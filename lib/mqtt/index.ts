import { ESGMQTTClient, setMqttClient } from './client';
import { messageHandler } from './handlers';
import { monitorServer } from '../websocket/websocket-monitor';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

let mqttClient: ESGMQTTClient | null = null;

/**
 * Initialize and start MQTT client
 */
export async function startMQTTClient(): Promise<void> {
  try {
    // Create MQTT client
    mqttClient = new ESGMQTTClient({
      host: process.env.MQTT_HOST || 'esag-tech.com',
      port: parseInt(process.env.MQTT_PORT || '8883'),
      username: process.env.MQTT_USERNAME || 'esagtech_mqtt',
      password: process.env.MQTT_PASSWORD || 'lwcwDEBVZxD6VFU',
      clientId: process.env.MQTT_CLIENT_ID || 'nextjs-server',
      baseTopic: process.env.MQTT_BASE_TOPIC || 'esagtech',
    });
    
    // Set singleton instance
    setMqttClient(mqttClient);

    // Track message processing
    let messageCount = 0;
    
    // Set up event handlers
    mqttClient.on('message', async (topic: string, payload: Buffer) => {
      messageCount++;
      const messageId = messageCount;
      
      logger.info('MQTT message received', {
        messageId,
        topic,
        size: payload.length,
        first20Bytes: payload.slice(0, 20).toString('hex')
      });
      
      try {
        // Process message
        await messageHandler.handleMessage(topic, payload);
        
        logger.info('MQTT message processed', {
          messageId,
          topic
        });
        
        // Broadcast to monitor
        monitorServer.broadcastMessage(topic, payload, 'in');
      } catch (error) {
        logger.error('Error processing MQTT message', error);
        monitorServer.broadcastError('Message processing error', { topic, error });
      }
    });

    mqttClient.on('connected', () => {
      logger.info('MQTT client connected successfully');
    });

    mqttClient.on('disconnected', () => {
      logger.warn('MQTT client disconnected');
    });

    mqttClient.on('error', (error: Error) => {
      logger.error('MQTT client error', error);
      monitorServer.broadcastError('MQTT client error', { error: error.message });
    });

    // Connect to MQTT broker
    await mqttClient.connect();
    
    // Subscribe to topics
    await mqttClient.subscribeToTopics();
    
    logger.info('MQTT client initialized and subscribed to topics');
  } catch (error) {
    logger.error('Failed to start MQTT client', error);
    throw error;
  }
}

/**
 * Stop MQTT client
 */
export async function stopMQTTClient(): Promise<void> {
  if (mqttClient) {
    await mqttClient.disconnect();
    mqttClient = null;
    logger.info('MQTT client stopped');
  }
}

/**
 * Publish message to device
 */
export async function publishToDevice(hostname: string, command: Buffer): Promise<void> {
  if (!mqttClient) {
    throw new Error('MQTT client not initialized');
  }
  
  const baseTopic = process.env.MQTT_BASE_TOPIC || 'esagtech';
  const topic = `${baseTopic}/pb/d/${hostname}/cmd`;
  
  await mqttClient.publish(topic, command);
  
  // Broadcast to monitor
  monitorServer.broadcastMessage(topic, command, 'out');
  
  // Also broadcast as command sent event for detailed logging
  monitorServer.broadcastCommandSent(topic, command);
}

/**
 * Get MQTT client status
 */
export function getMQTTStatus() {
  if (!mqttClient) {
    return { connected: false };
  }
  
  return {
    connected: mqttClient.getIsConnected(),
    stats: mqttClient.getStats(),
  };
}

// Export client instance
export { mqttClient };