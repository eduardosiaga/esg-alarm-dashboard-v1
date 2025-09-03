import { logger } from '../utils/logger';
import { deviceStore } from '../devices/store';
import { protobufDecoder } from '../protobuf/decoder';
import { unwrapHMAC } from '../protobuf/hmac-wrapper';
import { DeviceState, AlarmEventData, CommandResponse } from '../../types/device';
import { processLoginMessage } from './handlers/login-handler';
import { processStatusMessage } from './handlers/status-handler';
import { processLastWillMessage } from './handlers/lastwill-handler';
import { processHeartbeatMessage } from './handlers/heartbeat-handler';
import { processAlarmMessage } from './handlers/alarm-handler';
import { processResponseMessage } from './handlers/response-handler';
import { mqttClient } from './index';

export class MessageHandler {
  /**
   * Main message handler - routes messages to specific handlers based on topic
   */
  async handleMessage(topic: string, payload: Buffer): Promise<void> {
    try {
      const topicParts = topic.split('/');
      const messageType = topicParts[topicParts.length - 1];
      const deviceId = topicParts[topicParts.length - 2];

      logger.debug(`Processing message: ${messageType} from device: ${deviceId}`);

      switch (messageType) {
        case 'hb':
          await this.handleHeartbeat(deviceId, payload);
          break;
        case 'login':
          await this.handleLogin(deviceId, payload);
          break;
        case 'status':
          await this.handleStatus(deviceId, payload);
          break;
        case 'alarm':
          await this.handleAlarm(deviceId, payload);
          break;
        case 'resp':
        case 'response':  // ESP32 uses 'response' instead of 'resp'
          await this.handleResponse(deviceId, payload);
          break;
        case 'lw':
          await this.handleLastWill(deviceId, payload);
          break;
        default:
          logger.warn(`Unknown message type: ${messageType}`);
      }
    } catch (error) {
      logger.error('Error handling message', error, { topic });
    }
  }

  /**
   * Handle heartbeat messages using the new heartbeat handler
   */
  private async handleHeartbeat(deviceId: string, payload: Buffer): Promise<void> {
    try {
      // Get the full topic from the payload context
      const topic = `${mqttClient?.getBaseTopic() || 'esagtech'}/pb/d/${deviceId}/hb`;
      
      // Use the new heartbeat handler with database integration
      await processHeartbeatMessage(topic, payload);
      
      logger.info('Heartbeat processing completed', { deviceId });
      
      // The heartbeat handler already emits events through deviceStore
    } catch (error) {
      logger.error(`Error processing heartbeat from ${deviceId}`, error);
    }
  }

  // Track login message counts
  private loginMessageCounts = new Map<string, number>();

  /**
   * Handle login messages (initial connection status) with database integration
   */
  private async handleLogin(deviceId: string, payload: Buffer): Promise<void> {
    try {
      // Track how many times we receive login for this device
      const currentCount = this.loginMessageCounts.get(deviceId) || 0;
      this.loginMessageCounts.set(deviceId, currentCount + 1);
      
      logger.warn('Login message received', {
        deviceId,
        messageCount: currentCount + 1,
        payloadSize: payload.length,
        first20Bytes: payload.slice(0, 20).toString('hex')
      });
      
      // Get the full topic from the payload context
      const topic = `${mqttClient?.getBaseTopic() || 'esg/alarm'}/pb/d/${deviceId}/login`;
      
      // Use the new login handler with database integration
      const result = await processLoginMessage(topic, payload);
      
      logger.info('Login processing completed', {
        deviceId: result.hostname,
        dbId: result.deviceId,
        isNew: result.isNew,
        needsSync: result.needsSync,
        macAddress: result.macAddress,
        totalLoginMessages: this.loginMessageCounts.get(deviceId)
      });
      
      // Emit login event for real-time updates
      deviceStore.emit('login', deviceId, {
        deviceId: result.deviceId,
        hostname: result.hostname,
        macAddress: result.macAddress,
        isNew: result.isNew,
        syncSent: result.needsSync
      });
    } catch (error) {
      logger.error(`Error processing login from ${deviceId}`, error);
    }
  }

  /**
   * Handle status messages using the new status handler
   */
  private async handleStatus(deviceId: string, payload: Buffer): Promise<void> {
    try {
      // Get the full topic from the payload context
      const topic = `${mqttClient?.getBaseTopic() || 'esagtech'}/pb/d/${deviceId}/status`;
      
      // Use the new status handler with database integration
      await processStatusMessage(topic, payload);
      
      logger.info('Status processing completed', { deviceId });
      
      // The status handler already emits events through deviceStore
    } catch (error) {
      logger.error(`Error processing status from ${deviceId}`, error);
    }
  }

  /**
   * Handle alarm events using the new alarm handler
   */
  private async handleAlarm(deviceId: string, payload: Buffer): Promise<void> {
    try {
      // Get the full topic from the payload context
      const topic = `${mqttClient?.getBaseTopic() || 'esagtech'}/pb/d/${deviceId}/alarm`;
      
      // Use the new alarm handler with database integration
      await processAlarmMessage(topic, payload);
      
      logger.info('Alarm processing completed', { deviceId });
      
      // The alarm handler already emits events through deviceStore
    } catch (error) {
      logger.error(`Error processing alarm from ${deviceId}`, error);
    }
  }

  /**
   * Handle command responses using the new response handler
   */
  private async handleResponse(deviceId: string, payload: Buffer): Promise<void> {
    try {
      // Get the full topic from the payload context
      const topic = `${mqttClient?.getBaseTopic() || 'esagtech'}/pb/d/${deviceId}/resp`;
      
      // Use the new response handler with database integration
      const result = await processResponseMessage(topic, payload);
      
      if (result) {
        logger.info('Response processing completed', { 
          deviceId: result.deviceId,
          hostname: result.hostname,
          requestId: result.requestId,
          success: result.success
        });
      } else {
        logger.warn('Response processing returned no result', { deviceId });
      }
      
      // The response handler already emits events through deviceStore
    } catch (error) {
      logger.error(`Error processing response from ${deviceId}`, error);
    }
  }

  /**
   * Handle Last Will messages using the new handler
   */
  private async handleLastWill(deviceId: string, payload: Buffer): Promise<void> {
    try {
      // Get the full topic from the payload context
      const topic = `${mqttClient?.getBaseTopic() || 'esagtech'}/pb/d/${deviceId}/lw`;
      
      // Use the new Last Will handler with database integration
      await processLastWillMessage(topic, payload);
      
      logger.info('Last Will processing completed', { deviceId });
      
      // The Last Will handler already emits events through deviceStore
    } catch (error) {
      logger.error(`Error processing Last Will from ${deviceId}`, error);
    }
  }

  /**
   * Handle output state change events
   */
  private async handleOutputEvent(deviceId: string, message: any): Promise<void> {
    const isStarting = message.state === 3; // STATE_STARTING
    const isStopping = message.state === 4; // STATE_STOPPING
    
    if (message.output_type === 1) { // SIREN
      await deviceStore.updateDevice(deviceId, {
        outputs: {
          siren: isStarting,
          turret: undefined, // Don't change turret state
        },
      });
    } else if (message.output_type === 2) { // TURRET
      await deviceStore.updateDevice(deviceId, {
        outputs: {
          siren: undefined, // Don't change siren state
          turret: isStarting,
        },
      });
    }
  }

  /**
   * Handle input alarm events
   */
  private async handleInputAlarm(deviceId: string, message: any): Promise<void> {
    const isActive = message.state === 1; // STATE_ACTIVE
    
    switch (message.type) {
      case 1: // ALARM_PANIC1
        await deviceStore.updateDevice(deviceId, {
          inputs: {
            panic1: isActive,
            panic2: undefined,
            boxSw: undefined,
          },
        });
        if (isActive) {
          await deviceStore.incrementCounter(deviceId, 'panic1Count');
        }
        break;
      case 2: // ALARM_PANIC2
        await deviceStore.updateDevice(deviceId, {
          inputs: {
            panic1: undefined,
            panic2: isActive,
            boxSw: undefined,
          },
        });
        if (isActive) {
          await deviceStore.incrementCounter(deviceId, 'panic2Count');
        }
        break;
      case 3: // ALARM_TAMPER
        await deviceStore.updateDevice(deviceId, {
          inputs: {
            panic1: undefined,
            panic2: undefined,
            boxSw: isActive,
          },
        });
        if (isActive) {
          await deviceStore.incrementCounter(deviceId, 'tamperCount');
        }
        break;
    }
  }

  /**
   * Map protobuf device state to our enum
   */
  private mapDeviceState(state: number | undefined): DeviceState['state'] {
    const stateMap: { [key: number]: DeviceState['state'] } = {
      0: 'BOOT',
      1: 'INIT',
      2: 'CONNECTING',
      3: 'NORMAL',
      4: 'ALARM',
      5: 'MAINTENANCE',
      6: 'ERROR',
      7: 'CRITICAL',
    };
    return stateMap[state || 0] || 'BOOT';
  }

  /**
   * Map network interface enum
   */
  private mapNetworkInterface(network: number | undefined): 'wifi' | 'ethernet' | 'none' {
    const networkMap: { [key: number]: 'wifi' | 'ethernet' | 'none' } = {
      0: 'wifi',
      1: 'ethernet',
      2: 'none',
    };
    return networkMap[network || 2] || 'none';
  }

  /**
   * Map alarm type enum
   */
  private mapAlarmType(type: number | undefined): string {
    const typeMap: { [key: number]: string } = {
      0: 'UNKNOWN',
      1: 'PANIC1',
      2: 'PANIC2',
      3: 'TAMPER',
      4: 'FIRE',
      5: 'INTRUSION',
      6: 'MEDICAL',
      7: 'DURESS',
      10: 'OUTPUT_EVENT',
    };
    return typeMap[type || 0] || 'UNKNOWN';
  }

  /**
   * Map event state enum
   */
  private mapEventState(state: number | undefined): string {
    const stateMap: { [key: number]: string } = {
      0: 'INACTIVE',
      1: 'ACTIVE',
      2: 'TEST',
      3: 'STARTING',
      4: 'STOPPING',
    };
    return stateMap[state || 0] || 'INACTIVE';
  }

  /**
   * Map priority enum
   */
  private mapPriority(priority: number | undefined): string {
    const priorityMap: { [key: number]: string } = {
      0: 'LOW',
      1: 'MEDIUM',
      2: 'HIGH',
      3: 'CRITICAL',
    };
    return priorityMap[priority || 0] || 'LOW';
  }
}

export const messageHandler = new MessageHandler();