import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

export interface MQTTClientConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  clientId: string;
  baseTopic: string;
}

export class ESGMQTTClient extends EventEmitter {
  private client: MqttClient | null = null;
  private config: MQTTClientConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 1000; // Start with 1 second
  private maxReconnectInterval = 60000; // Max 60 seconds
  private isConnected = false;
  private subscriptions: Set<string> = new Set();

  constructor(config: MQTTClientConfig) {
    super();
    this.config = config;
  }

  /**
   * Connect to MQTT broker with TLS
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: IClientOptions = {
        host: this.config.host,
        port: this.config.port,
        protocol: 'mqtts',
        username: this.config.username,
        password: this.config.password,
        clientId: `${this.config.clientId}-${Date.now()}`,
        rejectUnauthorized: false, // Accept self-signed certificates
        keepalive: 60,
        clean: true,
        reconnectPeriod: 0, // We handle reconnection manually
        connectTimeout: 30000,
      };

      logger.info('Connecting to MQTT broker', {
        host: options.host,
        port: options.port,
        clientId: options.clientId,
      });

      this.client = mqtt.connect(options);
      this.setupEventHandlers();

      // Set up connection timeout
      const connectionTimeout = setTimeout(() => {
        if (!this.isConnected) {
          logger.error('MQTT connection timeout');
          reject(new Error('MQTT connection timeout'));
        }
      }, 30000);

      // Listen for successful connection
      this.once('connected', () => {
        clearTimeout(connectionTimeout);
        resolve();
      });

      // Listen for connection error
      this.once('error', (error) => {
        clearTimeout(connectionTimeout);
        reject(error);
      });
    });
  }

  /**
   * Set up MQTT client event handlers
   */
  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      logger.info('MQTT client connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectInterval = 1000;
      this.emit('connected');
      
      // Only resubscribe if we're reconnecting (have previous subscriptions)
      // Initial subscriptions are handled in index.ts
      if (this.subscriptions.size > 0) {
        this.resubscribeToTopics();
      }
    });

    this.client.on('message', (topic: string, payload: Buffer) => {
      logger.debug('MQTT message received', { 
        topic, 
        size: payload.length,
        rawHex: payload.toString('hex'),
        rawBytes: Array.from(payload.slice(0, Math.min(50, payload.length)))
      });
      this.emit('message', topic, payload);
    });

    this.client.on('error', (error: Error) => {
      logger.error('MQTT client error', error);
      this.emit('error', error);
    });

    this.client.on('close', () => {
      logger.warn('MQTT connection closed');
      this.isConnected = false;
      this.emit('disconnected');
      this.handleReconnection();
    });

    this.client.on('offline', () => {
      logger.warn('MQTT client offline');
      this.isConnected = false;
      this.emit('offline');
    });

    this.client.on('reconnect', () => {
      logger.info('MQTT client reconnecting');
      this.emit('reconnecting');
    });
  }

  /**
   * Handle reconnection with exponential backoff
   */
  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached');
      this.emit('max_reconnect_exceeded');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectInterval
    );

    logger.info(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected && this.client) {
        this.client.reconnect();
      }
    }, delay);
  }

  /**
   * Subscribe to MQTT topics
   */
  async subscribeToTopics(): Promise<void> {
    if (!this.client || !this.isConnected) {
      throw new Error('MQTT client not connected');
    }

    const topics = [
      `${this.config.baseTopic}/pb/d/+/hb`,      // Heartbeat
      `${this.config.baseTopic}/pb/d/+/login`,   // Login (initial connection)
      `${this.config.baseTopic}/pb/d/+/status`,  // Status
      `${this.config.baseTopic}/pb/d/+/alarm`,   // Alarm events
      `${this.config.baseTopic}/pb/d/+/response`, // Command responses (ESP32 uses 'response' not 'resp')
      `${this.config.baseTopic}/pb/d/+/lw`,      // Last Will (disconnection)
      // Legacy subscriptions removed to prevent duplicate message processing
    ];

    for (const topic of topics) {
      await this.subscribe(topic);
    }
  }

  /**
   * Subscribe to a single topic
   */
  private async subscribe(topic: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new Error('MQTT client not initialized'));
        return;
      }

      // Check if already subscribed to prevent duplicates
      if (this.subscriptions.has(topic)) {
        logger.warn(`Already subscribed to topic: ${topic}`, {
          currentSubscriptions: Array.from(this.subscriptions),
          stackTrace: new Error().stack
        });
        resolve();
        return;
      }

      this.client.subscribe(topic, { qos: 1 }, (error) => {
        if (error) {
          logger.error(`Failed to subscribe to topic: ${topic}`, error);
          reject(error);
        } else {
          logger.info(`Subscribed to topic: ${topic}`, {
            qos: 1,
            totalSubscriptions: this.subscriptions.size + 1
          });
          this.subscriptions.add(topic);
          resolve();
        }
      });
    });
  }

  /**
   * Resubscribe to all topics after reconnection
   */
  private async resubscribeToTopics(): Promise<void> {
    if (this.subscriptions.size === 0) {
      // No subscriptions yet, subscribe to all topics
      await this.subscribeToTopics();
    } else {
      // Clear the subscriptions set and re-subscribe (for reconnection scenarios)
      const topicsToResubscribe = Array.from(this.subscriptions);
      this.subscriptions.clear();
      
      for (const topic of topicsToResubscribe) {
        await this.subscribe(topic);
      }
    }
  }

  // Track published messages
  private publishCount = 0;
  private static globalPublishCount = 0;

  /**
   * Publish a message to a topic
   */
  async publish(topic: string, payload: Buffer): Promise<void> {
    this.publishCount++;
    const localPublishId = this.publishCount;
    const globalPublishId = ++ESGMQTTClient.globalPublishCount;
    const publishTimestamp = Date.now();
    const stackTrace = new Error().stack;
    
    logger.warn(`🔍 MQTT CLIENT PUBLISH CALLED`, {
      globalPublishId,
      localPublishId,
      publishTimestamp,
      topic,
      size: payload.length,
      first20Bytes: payload.slice(0, 20).toString('hex'),
      stackTrace: stackTrace?.split('\n').slice(2, 7).join('\n')
    });
    
    return new Promise((resolve, reject) => {
      if (!this.client || !this.isConnected) {
        reject(new Error('MQTT client not connected'));
        return;
      }

      this.client.publish(topic, payload, { qos: 0 }, (error) => {
        if (error) {
          logger.error(`🔍 MQTT CLIENT PUBLISH ERROR`, { 
            globalPublishId,
            localPublishId, 
            error 
          });
          reject(error);
        } else {
          logger.warn(`🔍 MQTT CLIENT PUBLISH SUCCESS`, { 
            globalPublishId,
            localPublishId,
            publishTimestamp,
            topic,
            size: payload.length,
            first20Bytes: payload.slice(0, 20).toString('hex'),
            qos: 0
          });
          resolve();
        }
      });
    });
  }

  /**
   * Disconnect from MQTT broker
   */
  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.client) {
        resolve();
        return;
      }

      this.client.end(false, {}, () => {
        logger.info('MQTT client disconnected');
        this.isConnected = false;
        this.client = null;
        resolve();
      });
    });
  }

  /**
   * Check if client is connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get client statistics
   */
  getStats() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptions: Array.from(this.subscriptions),
    };
  }

  /**
   * Get base topic
   */
  getBaseTopic(): string {
    return this.config.baseTopic;
  }
  
  /**
   * Get configuration
   */
  getConfig() {
    return this.config;
  }
}

// Singleton instance (initialized in server.ts via index.ts)
let instance: ESGMQTTClient | null = null;

export function getMqttClient(): ESGMQTTClient {
  if (!instance) {
    throw new Error('MQTT client not initialized. Call startMQTTClient() first.');
  }
  return instance;
}

export function setMqttClient(client: ESGMQTTClient): void {
  instance = client;
}