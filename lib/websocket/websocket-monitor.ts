/**
 * WebSocket Monitor Server
 * Real-time MQTT message monitoring and debugging interface
 * Runs on port 8888 and provides AT command interface
 */

import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';
import { unwrapHMAC } from '../protobuf/hmac-wrapper';
import { protobufDecoder } from '../protobuf/decoder';
import { mapEnumsInMessage } from '../protobuf/enum-mapper';

interface MonitorClient {
  ws: WebSocket;
  authenticated: boolean;
  id: string;
  config: {
    mode: 'raw' | 'decoded' | 'both';
    verbose: 'minimal' | 'normal' | 'verbose';
    showHMAC: boolean;
    showErrors: boolean;
    showLoginLog: boolean;
    messageTypes: Set<string>;
    deviceFilter: string | null;
    directionFilter: 'in' | 'out' | 'both';
  };
}

interface MQTTMessage {
  topic: string;
  payload: any;
  direction: 'in' | 'out';
  timestamp: Date;
  raw?: Buffer;
  decoded?: any;
  error?: string;
  hmacInfo?: {
    valid: boolean;
    sequence: number;
    payloadLength: number;
    hmac: string;
  };
}

export class WebSocketMonitor extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, MonitorClient> = new Map();
  private messageBuffer: MQTTMessage[] = [];
  private maxBufferSize = 100;
  private port: number;
  private isRunning = false;
  private deviceList: Set<string> = new Set();
  private decoder: any;

  constructor(port: number = 8888) {
    super();
    this.port = port;
    this.decoder = protobufDecoder;
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isRunning) {
        resolve();
        return;
      }

      this.wss = new WebSocketServer({ port: this.port });

      this.wss.on('connection', (ws) => {
        this.handleNewConnection(ws);
      });

      this.wss.on('listening', () => {
        this.isRunning = true;
        logger.info(`WebSocket Monitor started on port ${this.port}`);
        resolve();
      });

      this.wss.on('error', (error) => {
        logger.error('WebSocket Monitor error:', error);
        reject(error);
      });
    });
  }

  stop(): void {
    if (this.wss) {
      this.clients.forEach(client => {
        client.ws.close();
      });
      this.clients.clear();
      this.wss.close();
      this.wss = null;
      this.isRunning = false;
      logger.info('WebSocket Monitor stopped');
    }
  }

  private handleNewConnection(ws: WebSocket): void {
    const clientId = this.generateClientId();
    const client: MonitorClient = {
      ws,
      authenticated: false,
      id: clientId,
      config: {
        mode: 'decoded',
        verbose: 'normal',
        showHMAC: false,
        showErrors: true,
        showLoginLog: false,
        messageTypes: new Set(['all']),
        deviceFilter: null,
        directionFilter: 'both'
      }
    };

    this.clients.set(clientId, client);
    logger.info(`Monitor client connected: ${clientId}`);

    ws.on('message', (data) => {
      this.handleClientMessage(client, data.toString());
    });

    ws.on('close', () => {
      this.clients.delete(clientId);
      logger.info(`Monitor client disconnected: ${clientId}`);
    });

    ws.on('error', (error) => {
      logger.error(`Monitor client error (${clientId}):`, error);
    });

    // Send initial response
    this.sendToClient(client, {
      type: 'connection',
      message: 'WebSocket Monitor connected. Please authenticate with AT+AUTH=admin,admin123'
    });
  }

  private handleClientMessage(client: MonitorClient, message: string): void {
    const trimmed = message.trim().toUpperCase();
    
    // Parse AT command
    if (!trimmed.startsWith('AT')) {
      this.sendToClient(client, { type: 'error', message: 'Invalid command format' });
      return;
    }

    // Handle authentication
    if (!client.authenticated && !trimmed.startsWith('AT+AUTH=')) {
      this.sendToClient(client, { type: 'error', message: 'Authentication required' });
      return;
    }

    // Process command
    this.processATCommand(client, trimmed);
  }

  private processATCommand(client: MonitorClient, command: string): void {
    // Basic AT test
    if (command === 'AT') {
      this.sendToClient(client, { type: 'response', message: 'OK' });
      return;
    }

    // Authentication
    if (command.startsWith('AT+AUTH=')) {
      const parts = command.substring(8).split(',');
      if (parts[0] === 'ADMIN' && parts[1] === 'ADMIN123') {
        client.authenticated = true;
        this.sendToClient(client, { 
          type: 'auth', 
          success: true,
          message: 'Authentication successful'
        });
      } else {
        this.sendToClient(client, { 
          type: 'auth', 
          success: false,
          message: 'Authentication failed'
        });
      }
      return;
    }

    // Check authentication for other commands
    if (!client.authenticated) {
      this.sendToClient(client, { type: 'error', message: 'Not authenticated' });
      return;
    }

    // Process authenticated commands
    if (command === 'AT+HELP') {
      this.sendHelp(client);
    } else if (command === 'AT+STATUS') {
      this.sendStatus(client);
    } else if (command === 'AT+DEVICES') {
      this.sendDeviceList(client);
    } else if (command === 'AT+BUFFER') {
      this.sendBuffer(client);
    } else if (command === 'AT+CLEAR') {
      this.clearBuffer();
      this.sendToClient(client, { type: 'response', message: 'Buffer cleared' });
    } else if (command.startsWith('AT+MODE=')) {
      this.setMode(client, command.substring(8));
    } else if (command.startsWith('AT+VERBOSE=')) {
      this.setVerbose(client, command.substring(11));
    } else if (command.startsWith('AT+HMAC=')) {
      this.setHMAC(client, command.substring(8));
    } else if (command.startsWith('AT+FILTER=')) {
      this.setFilter(client, command.substring(10));
    } else if (command.startsWith('AT+SETMSG=')) {
      this.setMessageTypes(client, command.substring(10));
    } else {
      this.sendToClient(client, { type: 'error', message: 'Unknown command' });
    }
  }

  private sendHelp(client: MonitorClient): void {
    const help = {
      type: 'help',
      commands: [
        'AT - Test connection',
        'AT+AUTH=username,password - Authenticate',
        'AT+HELP - Show this help',
        'AT+STATUS - Show monitor status',
        'AT+DEVICES - List known devices',
        'AT+BUFFER - Show message buffer',
        'AT+CLEAR - Clear message buffer',
        'AT+MODE=raw|decoded|both - Set display mode',
        'AT+VERBOSE=minimal|normal|verbose - Set verbosity',
        'AT+HMAC=ON|OFF - Show/hide HMAC details',
        'AT+FILTER=hostname - Filter by device',
        'AT+SETMSG=type1,type2,... - Set message types to show'
      ]
    };
    this.sendToClient(client, help);
  }

  private sendStatus(client: MonitorClient): void {
    const status = {
      type: 'status',
      clients: this.clients.size,
      bufferSize: this.messageBuffer.length,
      devices: this.deviceList.size,
      config: {
        mode: client.config.mode,
        verbose: client.config.verbose,
        showHMAC: client.config.showHMAC,
        showErrors: client.config.showErrors,
        filter: client.config.deviceFilter,
        messageTypes: Array.from(client.config.messageTypes)
      }
    };
    this.sendToClient(client, status);
  }

  private sendDeviceList(client: MonitorClient): void {
    this.sendToClient(client, {
      type: 'devices',
      list: Array.from(this.deviceList)
    });
  }

  private sendBuffer(client: MonitorClient): void {
    const filtered = this.filterMessages(client, this.messageBuffer);
    this.sendToClient(client, {
      type: 'buffer',
      messages: filtered.slice(-20) // Last 20 messages
    });
  }

  private setMode(client: MonitorClient, mode: string): void {
    if (['RAW', 'DECODED', 'BOTH'].includes(mode)) {
      client.config.mode = mode.toLowerCase() as 'raw' | 'decoded' | 'both';
      this.sendToClient(client, { type: 'response', message: `Mode set to ${mode}` });
    } else {
      this.sendToClient(client, { type: 'error', message: 'Invalid mode' });
    }
  }

  private setVerbose(client: MonitorClient, level: string): void {
    if (['MINIMAL', 'NORMAL', 'VERBOSE'].includes(level)) {
      client.config.verbose = level.toLowerCase() as 'minimal' | 'normal' | 'verbose';
      this.sendToClient(client, { type: 'response', message: `Verbosity set to ${level}` });
    } else {
      this.sendToClient(client, { type: 'error', message: 'Invalid verbosity level' });
    }
  }

  private setHMAC(client: MonitorClient, state: string): void {
    client.config.showHMAC = state === 'ON' || state === '1';
    this.sendToClient(client, { type: 'response', message: `HMAC display ${client.config.showHMAC ? 'enabled' : 'disabled'}` });
  }

  private setFilter(client: MonitorClient, filter: string): void {
    if (filter === 'NONE' || filter === '') {
      client.config.deviceFilter = null;
      this.sendToClient(client, { type: 'response', message: 'Filter cleared' });
    } else {
      client.config.deviceFilter = filter;
      this.sendToClient(client, { type: 'response', message: `Filter set to ${filter}` });
    }
  }

  private setMessageTypes(client: MonitorClient, types: string): void {
    const typeList = types.split(',').map(t => t.trim().toLowerCase());
    client.config.messageTypes = new Set(typeList);
    this.sendToClient(client, { type: 'response', message: `Message types set to: ${typeList.join(', ')}` });
  }

  private clearBuffer(): void {
    this.messageBuffer = [];
  }

  private sendToClient(client: MonitorClient, data: any): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  private filterMessages(client: MonitorClient, messages: MQTTMessage[]): MQTTMessage[] {
    return messages.filter(msg => {
      // Filter by direction
      if (client.config.directionFilter !== 'both' && msg.direction !== client.config.directionFilter) {
        return false;
      }

      // Filter by device
      if (client.config.deviceFilter) {
        const deviceId = this.extractDeviceId(msg.topic);
        if (!deviceId || !deviceId.includes(client.config.deviceFilter)) {
          return false;
        }
      }

      // Filter by message type
      if (!client.config.messageTypes.has('all')) {
        const messageType = this.extractMessageType(msg.topic);
        if (!client.config.messageTypes.has(messageType)) {
          return false;
        }
      }

      return true;
    });
  }

  private extractDeviceId(topic: string): string | null {
    const parts = topic.split('/');
    if (parts.length >= 5) {
      return parts[3]; // Device ID is typically at index 3
    }
    return null;
  }

  private extractMessageType(topic: string): string {
    const parts = topic.split('/');
    return parts[parts.length - 1]; // Last part is message type
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(7);
  }

  /**
   * Format buffer as hex dump
   */
  private formatHexDump(buffer: Buffer): string {
    const lines = [];
    const bytesPerLine = 16;
    
    for (let i = 0; i < buffer.length; i += bytesPerLine) {
      const slice = buffer.slice(i, Math.min(i + bytesPerLine, buffer.length));
      const hex = Array.from(slice)
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');
      const ascii = Array.from(slice)
        .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
        .join('');
      
      const address = i.toString(16).padStart(8, '0').toUpperCase();
      const hexPadded = hex.padEnd(48, ' ');
      lines.push(`${address}  ${hexPadded}  |${ascii}|`);
    }
    
    return lines.join('\n');
  }

  /**
   * Process and decode MQTT message
   */
  private processMQTTMessage(topic: string, payload: Buffer): MQTTMessage {
    const message: MQTTMessage = {
      topic,
      payload,
      direction: 'in',
      timestamp: new Date(),
      raw: payload
    };

    // Extract device ID and message type
    const deviceId = this.extractDeviceId(topic);
    const messageType = this.extractMessageType(topic);

    // Try to unwrap HMAC
    const unwrapped = unwrapHMAC(payload);
    if (unwrapped) {
      message.hmacInfo = {
        valid: unwrapped.valid,
        sequence: unwrapped.sequence,
        payloadLength: unwrapped.payloadLength,
        hmac: unwrapped.hmac.toString('hex')
      };

      // Try to decode protobuf based on message type
      if (unwrapped.valid && unwrapped.payload) {
        try {
          let decoded: any;
          switch (messageType) {
            case 'hb':
              decoded = this.decoder.decodeHeartbeat(unwrapped.payload);
              break;
            case 'status':
            case 'login':
              decoded = this.decoder.decodeStatus(unwrapped.payload);
              break;
            case 'alarm':
              decoded = this.decoder.decodeAlarmEvent(unwrapped.payload);
              break;
            case 'lw':
              decoded = this.decoder.decodeLastWill(unwrapped.payload);
              break;
            case 'resp':
            case 'response':
              decoded = this.decoder.decodeCommandResponse(unwrapped.payload);
              break;
          }
          
          // Apply enum mapping to make the output more readable
          if (decoded) {
            message.decoded = mapEnumsInMessage(decoded, messageType);
          }
        } catch (error) {
          message.error = `Failed to decode ${messageType}: ${error}`;
        }
      }
    } else {
      message.error = 'Failed to unwrap HMAC';
    }

    return message;
  }

  /**
   * Format message for display based on client config
   */
  private formatMessageForClient(client: MonitorClient, message: MQTTMessage): any {
    const formatted: any = {
      type: 'mqtt_message',
      topic: message.topic,
      direction: message.direction,
      timestamp: message.timestamp,
      messageType: this.extractMessageType(message.topic),
      hostname: this.extractDeviceId(message.topic),
      size: message.raw ? message.raw.length : 0
    };

    // Add HMAC info if enabled
    if (client.config.showHMAC && message.hmacInfo) {
      formatted.hmac = {
        valid: message.hmacInfo.valid ? '✅ VALID' : '❌ INVALID',
        sequence: message.hmacInfo.sequence,
        payloadLength: message.hmacInfo.payloadLength,
        hmacValue: message.hmacInfo.hmac
      };
    }

    // Add content based on mode
    if (client.config.mode === 'raw' || client.config.mode === 'both') {
      if (message.raw) {
        // Send the raw buffer as base64 so it can be properly transmitted
        // The client will need to handle base64 decoding
        formatted.raw = {
          buffer: message.raw.toString('base64'), // Send as base64
          hex: message.raw.toString('hex'),
          hexDump: this.formatHexDump(message.raw)
        };
      }
    }

    if (client.config.mode === 'decoded' || client.config.mode === 'both') {
      if (message.decoded) {
        formatted.decoded = message.decoded;
      } else if (message.error) {
        formatted.error = message.error;
      }
    }

    return formatted;
  }

  // Public methods for broadcasting messages
  
  broadcastMessage(topic: string, payload: any, direction: 'in' | 'out'): void {
    // Process the message if it's incoming and is a Buffer
    let message: MQTTMessage;
    
    if (direction === 'in' && Buffer.isBuffer(payload)) {
      message = this.processMQTTMessage(topic, payload);
      message.direction = direction;
    } else {
      message = {
        topic,
        payload,
        direction,
        timestamp: new Date(),
        raw: Buffer.isBuffer(payload) ? payload : undefined,
        decoded: !Buffer.isBuffer(payload) ? payload : undefined
      };
    }

    // Add to buffer
    this.messageBuffer.push(message);
    if (this.messageBuffer.length > this.maxBufferSize) {
      this.messageBuffer.shift();
    }

    // Update device list
    const deviceId = this.extractDeviceId(topic);
    if (deviceId) {
      this.deviceList.add(deviceId);
    }

    // Broadcast to authenticated clients
    this.clients.forEach(client => {
      if (client.authenticated) {
        const filtered = this.filterMessages(client, [message]);
        if (filtered.length > 0) {
          const formatted = this.formatMessageForClient(client, message);
          this.sendToClient(client, formatted);
        }
      }
    });
  }

  broadcastError(message: string, details: any): void {
    this.clients.forEach(client => {
      if (client.authenticated && client.config.showErrors) {
        this.sendToClient(client, {
          type: 'error',
          message,
          details,
          timestamp: new Date()
        });
      }
    });
  }

  broadcastCommandSent(topic: string, command: any, details?: any): void {
    this.broadcastMessage(topic, command, 'out');
  }

  broadcastLoginProcessing(eventType: string, data: any): void {
    this.clients.forEach(client => {
      if (client.authenticated && client.config.showLoginLog) {
        this.sendToClient(client, {
          type: 'login_processing',
          event: eventType,
          data,
          timestamp: new Date()
        });
      }
    });
  }

  broadcastHeartbeatProcessing(event: any): void {
    this.broadcastProcessingEvent('heartbeat_processing', event);
  }

  broadcastStatusProcessing(event: any): void {
    this.broadcastProcessingEvent('status_processing', event);
  }

  broadcastAlarmProcessing(event: any): void {
    this.broadcastProcessingEvent('alarm_processing', event);
  }

  broadcastResponseProcessing(eventType: string, data: any): void {
    this.broadcastProcessingEvent('response_processing', { event: eventType, ...data });
  }

  broadcastLastWillProcessing(event: any): void {
    this.broadcastProcessingEvent('lastwill_processing', event);
  }

  private broadcastProcessingEvent(type: string, data: any): void {
    this.clients.forEach(client => {
      if (client.authenticated && client.config.verbose === 'verbose') {
        this.sendToClient(client, {
          type,
          data,
          timestamp: new Date()
        });
      }
    });
  }

  setActive(active: boolean): void {
    // Compatibility method
    if (!active && this.isRunning) {
      this.stop();
    }
  }
}

// Export singleton instance
export const monitorServer = new WebSocketMonitor(8888);