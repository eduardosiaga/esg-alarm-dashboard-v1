import { logger } from '../../utils/logger';
import { protobufDecoder } from '../../protobuf/decoder';
import { unwrapHMAC } from '../../protobuf/hmac-wrapper';
import { DeviceService } from '../../db/device-service';
import { deviceStore } from '../../devices/store';
import { monitorServer } from '../../websocket/websocket-monitor';
import { ChangeType } from '@prisma/client';

// Heartbeat processing event types
export enum HeartbeatProcessingEvent {
  HB_START = 'HB_START',
  HMAC_UNWRAP = 'HMAC_UNWRAP',
  DECODE_MESSAGE = 'DECODE_MESSAGE',
  CHECK_DEVICE_ID = 'CHECK_DEVICE_ID',
  DEVICE_FOUND = 'DEVICE_FOUND',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  CHECK_CDC = 'CHECK_CDC',
  UPDATE_DATABASE = 'UPDATE_DATABASE',
  SAVE_HEARTBEAT = 'SAVE_HEARTBEAT',
  SAVE_TELEMETRY = 'SAVE_TELEMETRY',
  UPDATE_MEMORY_STORE = 'UPDATE_MEMORY_STORE',
  HB_COMPLETE = 'HB_COMPLETE',
  HB_ERROR = 'HB_ERROR'
}

/**
 * Interface for heartbeat data
 */
interface HeartbeatData {
  timestamp: number;
  deviceDbId: number;
  temperature: number;
  humidity: number;
  panic1: boolean;
  panic2: boolean;
  siren: boolean;
  turret: boolean;
  boxSw: boolean;
  uptime: number;
  ethInterface: number;
  firmware: string;
  fanPwmDuty: number;
}

/**
 * Determine change type for CDC (Change Data Capture) optimization
 */
function determineChangeType(current: HeartbeatData, previous?: any): ChangeType {
  if (!previous) {
    return ChangeType.PERIODIC;
  }

  // Check for alarm changes
  if (current.panic1 !== previous.panic1 || 
      current.panic2 !== previous.panic2 || 
      current.boxSw !== previous.boxSw) {
    return ChangeType.ALARM;
  }

  // Check for output changes
  if (current.siren !== previous.siren || 
      current.turret !== previous.turret) {
    return ChangeType.STATE_CHANGE;  // Changed from OUTPUT_EVENT to STATE_CHANGE
  }

  // Check for significant sensor changes (>5% difference)
  const tempDiff = Math.abs(current.temperature - (previous.temperature || 0));
  const humDiff = Math.abs(current.humidity - (previous.humidity || 0));
  if (tempDiff > 2 || humDiff > 5) {
    return ChangeType.SENSOR_DATA;
  }

  return ChangeType.PERIODIC;
}

/**
 * Process heartbeat message from device
 */
export async function processHeartbeatMessage(
  topic: string,
  payload: Buffer
): Promise<void> {
  try {
    logger.debug('Processing heartbeat message', { topic, size: payload.length });

    // Extract hostname from topic for logging
    const hostname = topic.split('/')[3];

    // Emit heartbeat processing start
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.HB_START,
      hostname,
      timestamp: new Date(),
      size: payload.length
    });

    // 1. Unwrap HMAC
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.HMAC_UNWRAP,
      hostname,
      size: payload.length
    });

    const unwrapped = unwrapHMAC(payload);
    if (!unwrapped || !unwrapped.valid) {
      logger.error('Invalid HMAC in heartbeat message');
      monitorServer.broadcastHeartbeatProcessing({
        event: HeartbeatProcessingEvent.HB_ERROR,
        hostname,
        error: 'Invalid HMAC'
      });
      return;
    }

    // 2. Decode Heartbeat message
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.DECODE_MESSAGE,
      hostname,
      payloadSize: unwrapped.payload.length
    });

    const heartbeatMessage = protobufDecoder.decodeHeartbeat(unwrapped.payload);
    logger.debug('Decoded heartbeat message', heartbeatMessage);

    // Convert field names to consistent format
    const heartbeatData: HeartbeatData = {
      timestamp: heartbeatMessage.timestamp,
      deviceDbId: heartbeatMessage.deviceDbId || heartbeatMessage.device_db_id || 0,
      temperature: heartbeatMessage.temperature || 0,
      humidity: heartbeatMessage.humidity || 0,
      panic1: heartbeatMessage.panic1 || false,
      panic2: heartbeatMessage.panic2 || false,
      siren: heartbeatMessage.siren || false,
      turret: heartbeatMessage.turret || false,
      boxSw: heartbeatMessage.boxSw || heartbeatMessage.box_sw || false,
      uptime: heartbeatMessage.uptime || 0,
      ethInterface: heartbeatMessage.ethInterface || heartbeatMessage.eth_interface || 0,
      firmware: heartbeatMessage.firmware || '',
      fanPwmDuty: heartbeatMessage.fanPwmDuty || heartbeatMessage.fan_pwm_duty || 0
    };

    // 3. Check device_db_id
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.CHECK_DEVICE_ID,
      hostname,
      deviceDbId: heartbeatData.deviceDbId,
      temperature: heartbeatData.temperature,
      humidity: heartbeatData.humidity,
      uptime: heartbeatData.uptime,
      inputs: {
        panic1: heartbeatData.panic1,
        panic2: heartbeatData.panic2,
        boxSw: heartbeatData.boxSw
      },
      outputs: {
        siren: heartbeatData.siren,
        turret: heartbeatData.turret
      }
    });

    if (heartbeatData.deviceDbId === 0) {
      logger.warn('Heartbeat message with device_db_id=0, discarding', {
        topic,
        hostname
      });
      monitorServer.broadcastHeartbeatProcessing({
        event: HeartbeatProcessingEvent.HB_ERROR,
        hostname,
        error: 'device_db_id is 0, discarding message'
      });
      return;
    }
    
    logger.info('Heartbeat from device', { 
      deviceDbId: heartbeatData.deviceDbId,
      hostname,
      temperature: heartbeatData.temperature,
      humidity: heartbeatData.humidity,
      uptime: heartbeatData.uptime,
      firmware: heartbeatData.firmware
    });

    // 4. Find device by device_db_id
    const device = await DeviceService.findById(heartbeatData.deviceDbId);
    if (!device) {
      logger.error('Device not found for device_db_id', { deviceDbId: heartbeatData.deviceDbId });
      monitorServer.broadcastHeartbeatProcessing({
        event: HeartbeatProcessingEvent.DEVICE_NOT_FOUND,
        hostname,
        deviceDbId: heartbeatData.deviceDbId
      });
      return;
    }

    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.DEVICE_FOUND,
      hostname,
      deviceDbId: heartbeatData.deviceDbId,
      macAddress: device.macAddress,
      hasStatus: !!device.deviceStatus
    });

    // 5. Check CDC (Change Data Capture) - determine if we need to save this heartbeat
    const previousStatus = device.deviceStatus;
    const changeType = determineChangeType(heartbeatData, previousStatus);
    
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.CHECK_CDC,
      hostname,
      deviceDbId: heartbeatData.deviceDbId,
      changeType: changeType.toString(),
      shouldSave: true // For now, save all heartbeats
    });

    // 6. Update device status in database
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.UPDATE_DATABASE,
      hostname,
      deviceDbId: heartbeatData.deviceDbId,
      fieldsToUpdate: {
        temperature: heartbeatData.temperature,
        humidity: heartbeatData.humidity,
        fanPwmDuty: heartbeatData.fanPwmDuty,
        panic1: heartbeatData.panic1,
        panic2: heartbeatData.panic2,
        boxSw: heartbeatData.boxSw,
        siren: heartbeatData.siren,
        turret: heartbeatData.turret,
        uptime: heartbeatData.uptime,
        isOnline: true,
        lastSeen: new Date()
      }
    });

    await DeviceService.updateDeviceStatus(device.id, {
      // Environmental sensors
      temperature: heartbeatData.temperature,
      humidity: heartbeatData.humidity,
      // fanPwmDuty is stored in the heartbeats table, not deviceStatus
      
      // Input states
      panic1: heartbeatData.panic1,
      panic2: heartbeatData.panic2,
      boxSw: heartbeatData.boxSw,
      
      // Output states
      siren: heartbeatData.siren,
      turret: heartbeatData.turret,
      
      // System info
      uptime: heartbeatData.uptime,
      networkType: heartbeatData.ethInterface === 1 ? 'ethernet' : 'wifi',
      firmwareVersion: heartbeatData.firmware,
      
      // Connection status
      isOnline: true,
      connected: true,
      lastSeen: new Date()
    });

    // 7. Save heartbeat to timeseries table (if change detected or periodic)
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.SAVE_TELEMETRY,
      hostname,
      deviceDbId: heartbeatData.deviceDbId,
      changeType: changeType.toString()
    });

    // Save telemetry record for historical data
    await DeviceService.saveTelemetry({
      deviceId: device.id,
      time: new Date(heartbeatData.timestamp * 1000),
      temperature: heartbeatData.temperature,
      humidity: heartbeatData.humidity,
      fanPwmDuty: heartbeatData.fanPwmDuty,
      panic1: heartbeatData.panic1,
      panic2: heartbeatData.panic2,
      siren: heartbeatData.siren,
      turret: heartbeatData.turret,
      boxSw: heartbeatData.boxSw,
      changeType: changeType
    });

    // 8. Update in-memory device store
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.UPDATE_MEMORY_STORE,
      hostname,
      deviceDbId: heartbeatData.deviceDbId
    });

    await deviceStore.updateDevice(hostname, {
      deviceId: hostname,
      hostname: hostname,
      macAddress: device.macAddress,
      online: true,
      lastSeen: new Date(),
      firmware: heartbeatData.firmware,
      uptime: heartbeatData.uptime,
      network: heartbeatData.ethInterface === 1 ? 'ethernet' : 'wifi',
      temperature: heartbeatData.temperature,
      humidity: heartbeatData.humidity,
      fanPwmDuty: heartbeatData.fanPwmDuty,
      inputs: {
        panic1: heartbeatData.panic1,
        panic2: heartbeatData.panic2,
        boxSw: heartbeatData.boxSw
      },
      outputs: {
        siren: heartbeatData.siren,
        turret: heartbeatData.turret
      }
    });

    logger.info('Heartbeat message processed successfully', { 
      deviceId: device.id,
      hostname,
      changeType: changeType.toString()
    });

    // Emit heartbeat complete
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.HB_COMPLETE,
      hostname,
      deviceDbId: heartbeatData.deviceDbId,
      success: true,
      changeType: changeType.toString()
    });

    // Emit heartbeat event for other listeners
    deviceStore.emit('heartbeat', hostname, heartbeatData);

  } catch (error) {
    logger.error('Error processing heartbeat message', error);
    
    // Extract hostname from topic for error event
    const hostname = topic.split('/')[3];
    monitorServer.broadcastHeartbeatProcessing({
      event: HeartbeatProcessingEvent.HB_ERROR,
      hostname,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}