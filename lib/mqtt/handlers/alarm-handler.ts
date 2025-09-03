import { logger } from '../../utils/logger';
import { protobufDecoder } from '../../protobuf/decoder';
import { unwrapHMAC } from '../../protobuf/hmac-wrapper';
import { DeviceService } from '../../db/device-service';
import { deviceStore } from '../../devices/store';
import { monitorServer } from '../../websocket/websocket-monitor';
import { AlarmType, EventState, Priority } from '@prisma/client';

// Alarm processing event types
export enum AlarmProcessingEvent {
  ALARM_START = 'ALARM_START',
  HMAC_UNWRAP = 'HMAC_UNWRAP',
  DECODE_MESSAGE = 'DECODE_MESSAGE',
  CHECK_DEVICE_ID = 'CHECK_DEVICE_ID',
  DEVICE_FOUND = 'DEVICE_FOUND',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  CHECK_ALARM_TYPE = 'CHECK_ALARM_TYPE',
  UPDATE_DEVICE_STATE = 'UPDATE_DEVICE_STATE',
  SAVE_ALARM_EVENT = 'SAVE_ALARM_EVENT',
  UPDATE_COUNTERS = 'UPDATE_COUNTERS',
  UPDATE_MEMORY_STORE = 'UPDATE_MEMORY_STORE',
  ALARM_COMPLETE = 'ALARM_COMPLETE',
  ALARM_ERROR = 'ALARM_ERROR'
}

/**
 * Interface for alarm data
 */
interface AlarmData {
  sequence: number;
  timestamp: number;
  deviceDbId: number;
  type: number;
  state: number;
  priority: number;
  physicalState: boolean;
  outputType?: number;
  patternType?: number;
  durationSeconds?: number;
  elapsedSeconds?: number;
}

/**
 * Map protobuf alarm type to Prisma enum
 */
function mapAlarmType(type: number): AlarmType {
  const typeMap: { [key: number]: AlarmType } = {
    0: AlarmType.UNKNOWN,
    1: AlarmType.PANIC1,
    2: AlarmType.PANIC2,
    3: AlarmType.TAMPER,
    4: AlarmType.FIRE,
    5: AlarmType.INTRUSION,
    6: AlarmType.MEDICAL,
    7: AlarmType.DURESS,
    10: AlarmType.OUTPUT_EVENT
  };
  return typeMap[type] || AlarmType.UNKNOWN;
}

/**
 * Map protobuf event state to Prisma enum
 */
function mapEventState(state: number): EventState {
  const stateMap: { [key: number]: EventState } = {
    0: EventState.INACTIVE,
    1: EventState.ACTIVE,
    2: EventState.TEST,
    3: EventState.STARTING,
    4: EventState.STOPPING
  };
  return stateMap[state] || EventState.INACTIVE;
}

/**
 * Map protobuf priority to Prisma enum
 */
function mapPriority(priority: number): Priority {
  const priorityMap: { [key: number]: Priority } = {
    0: Priority.LOW,
    1: Priority.MEDIUM,
    2: Priority.HIGH,
    3: Priority.CRITICAL
  };
  return priorityMap[priority] || Priority.MEDIUM;
}

/**
 * Process alarm message from device
 */
export async function processAlarmMessage(
  topic: string,
  payload: Buffer
): Promise<void> {
  try {
    logger.debug('Processing alarm message', { topic, size: payload.length });

    // Extract hostname from topic for logging
    const hostname = topic.split('/')[3];

    // Emit alarm processing start
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.ALARM_START,
      hostname,
      timestamp: new Date(),
      size: payload.length
    });

    // 1. Unwrap HMAC
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.HMAC_UNWRAP,
      hostname,
      size: payload.length
    });

    const unwrapped = unwrapHMAC(payload);
    if (!unwrapped || !unwrapped.valid) {
      logger.error('Invalid HMAC in alarm message');
      monitorServer.broadcastAlarmProcessing({
        event: AlarmProcessingEvent.ALARM_ERROR,
        hostname,
        error: 'Invalid HMAC'
      });
      return;
    }

    // 2. Decode AlarmEvent message
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.DECODE_MESSAGE,
      hostname,
      payloadSize: unwrapped.payload.length
    });

    const alarmMessage = protobufDecoder.decodeAlarmEvent(unwrapped.payload);
    logger.debug('Decoded alarm message', alarmMessage);

    // Convert field names to consistent format
    const alarmData: AlarmData = {
      sequence: alarmMessage.sequence || 0,
      timestamp: alarmMessage.timestamp || Math.floor(Date.now() / 1000),
      deviceDbId: alarmMessage.deviceDbId || alarmMessage.device_db_id || 0,
      type: alarmMessage.type || 0,
      state: alarmMessage.state || 0,
      priority: alarmMessage.priority || 1,
      physicalState: alarmMessage.physicalState || alarmMessage.physical_state || false,
      outputType: alarmMessage.outputType || alarmMessage.output_type,
      patternType: alarmMessage.patternType || alarmMessage.pattern_type,
      durationSeconds: alarmMessage.durationSeconds || alarmMessage.duration_seconds,
      elapsedSeconds: alarmMessage.elapsedSeconds || alarmMessage.elapsed_seconds
    };

    // 3. Check device_db_id
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.CHECK_DEVICE_ID,
      hostname,
      deviceDbId: alarmData.deviceDbId,
      alarmType: mapAlarmType(alarmData.type),
      eventState: mapEventState(alarmData.state),
      priority: mapPriority(alarmData.priority),
      physicalState: alarmData.physicalState
    });

    if (alarmData.deviceDbId === 0) {
      logger.warn('Alarm message with device_db_id=0, discarding', {
        topic,
        hostname
      });
      monitorServer.broadcastAlarmProcessing({
        event: AlarmProcessingEvent.ALARM_ERROR,
        hostname,
        error: 'device_db_id is 0, discarding message'
      });
      return;
    }
    
    logger.warn('ALARM EVENT from device', { 
      deviceDbId: alarmData.deviceDbId,
      hostname,
      type: mapAlarmType(alarmData.type),
      state: mapEventState(alarmData.state),
      priority: mapPriority(alarmData.priority),
      physicalState: alarmData.physicalState
    });

    // 4. Find device by device_db_id
    const device = await DeviceService.findById(alarmData.deviceDbId);
    if (!device) {
      logger.error('Device not found for device_db_id', { deviceDbId: alarmData.deviceDbId });
      monitorServer.broadcastAlarmProcessing({
        event: AlarmProcessingEvent.DEVICE_NOT_FOUND,
        hostname,
        deviceDbId: alarmData.deviceDbId
      });
      return;
    }

    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.DEVICE_FOUND,
      hostname,
      deviceDbId: alarmData.deviceDbId,
      macAddress: device.macAddress
    });

    // 5. Check alarm type and determine action
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.CHECK_ALARM_TYPE,
      hostname,
      deviceDbId: alarmData.deviceDbId,
      alarmType: mapAlarmType(alarmData.type),
      state: mapEventState(alarmData.state),
      isInputAlarm: alarmData.type <= 7,
      isOutputEvent: alarmData.type === 10
    });

    // 6. Update device state based on alarm type
    const isActive = alarmData.state === 1; // STATE_ACTIVE
    const isStarting = alarmData.state === 3; // STATE_STARTING
    
    if (alarmData.type <= 7) {
      // Input alarm events (PANIC1, PANIC2, TAMPER, etc.)
      monitorServer.broadcastAlarmProcessing({
        event: AlarmProcessingEvent.UPDATE_DEVICE_STATE,
        hostname,
        deviceDbId: alarmData.deviceDbId,
        updateType: 'INPUT_ALARM',
        alarmType: mapAlarmType(alarmData.type),
        newState: isActive
      });

      // Update device status for input alarms
      const statusUpdate: any = {};
      switch (alarmData.type) {
        case 1: // ALARM_PANIC1
          statusUpdate.panic1 = isActive;
          if (isActive) {
            await DeviceService.incrementCounter(device.id, 'panic1Count');
          }
          break;
        case 2: // ALARM_PANIC2
          statusUpdate.panic2 = isActive;
          if (isActive) {
            await DeviceService.incrementCounter(device.id, 'panic2Count');
          }
          break;
        case 3: // ALARM_TAMPER
          statusUpdate.boxSw = isActive;
          if (isActive) {
            await DeviceService.incrementCounter(device.id, 'tamperCount');
          }
          break;
      }
      
      if (Object.keys(statusUpdate).length > 0) {
        await DeviceService.updateDeviceStatus(device.id, statusUpdate);
      }
      
    } else if (alarmData.type === 10) {
      // Output events (SIREN, TURRET)
      monitorServer.broadcastAlarmProcessing({
        event: AlarmProcessingEvent.UPDATE_DEVICE_STATE,
        hostname,
        deviceDbId: alarmData.deviceDbId,
        updateType: 'OUTPUT_EVENT',
        outputType: alarmData.outputType,
        patternType: alarmData.patternType,
        newState: isStarting
      });

      // Update device status for output events
      const statusUpdate: any = {};
      if (alarmData.outputType === 1) { // OUT_SIREN
        statusUpdate.siren = isStarting;
      } else if (alarmData.outputType === 2) { // OUT_TURRET
        statusUpdate.turret = isStarting;
      }
      
      if (Object.keys(statusUpdate).length > 0) {
        await DeviceService.updateDeviceStatus(device.id, statusUpdate);
      }
    }

    // 7. Save alarm event to database
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.SAVE_ALARM_EVENT,
      hostname,
      deviceDbId: alarmData.deviceDbId,
      alarmType: mapAlarmType(alarmData.type),
      state: mapEventState(alarmData.state),
      priority: mapPriority(alarmData.priority)
    });

    await DeviceService.saveDeviceAlarm({
      deviceId: device.id,
      sequence: alarmData.sequence,
      timestamp: new Date(alarmData.timestamp * 1000),
      alarmType: mapAlarmType(alarmData.type),
      eventState: mapEventState(alarmData.state),
      priority: mapPriority(alarmData.priority),
      physicalState: alarmData.physicalState,
      outputType: alarmData.outputType,
      patternType: alarmData.patternType,
      durationSeconds: alarmData.durationSeconds,
      elapsedSeconds: alarmData.elapsedSeconds
    });

    // 8. Update in-memory device store
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.UPDATE_MEMORY_STORE,
      hostname,
      deviceDbId: alarmData.deviceDbId
    });

    // Update memory store with alarm information
    const currentDevice = deviceStore.getDevice(hostname);
    if (currentDevice) {
      await deviceStore.updateDevice(hostname, {
        ...currentDevice
        // Note: lastAlarmType, lastAlarmState, and lastAlarmTime are not in DeviceStateUpdate interface
        // They would need to be added to the interface if needed
      });
    }

    logger.info('Alarm message processed successfully', { 
      deviceId: device.id,
      hostname,
      alarmType: mapAlarmType(alarmData.type),
      state: mapEventState(alarmData.state)
    });

    // Emit alarm complete
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.ALARM_COMPLETE,
      hostname,
      deviceDbId: alarmData.deviceDbId,
      success: true,
      alarmType: mapAlarmType(alarmData.type),
      state: mapEventState(alarmData.state)
    });

    // Emit alarm event for other listeners
    deviceStore.emit('alarm', hostname, alarmData);

  } catch (error) {
    logger.error('Error processing alarm message', error);
    
    // Extract hostname from topic for error event
    const hostname = topic.split('/')[3];
    monitorServer.broadcastAlarmProcessing({
      event: AlarmProcessingEvent.ALARM_ERROR,
      hostname,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}