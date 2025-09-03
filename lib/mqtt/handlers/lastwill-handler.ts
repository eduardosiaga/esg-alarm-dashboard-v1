import { logger } from '../../utils/logger';
import { protobufDecoder } from '../../protobuf/decoder';
import { unwrapHMAC } from '../../protobuf/hmac-wrapper';
import { DeviceService } from '../../db/device-service';
import { deviceStore } from '../../devices/store';
import { monitorServer } from '../../websocket/websocket-monitor';

// Last Will processing event types
export enum LastWillProcessingEvent {
  LW_START = 'LW_START',
  HMAC_UNWRAP = 'HMAC_UNWRAP',
  DECODE_MESSAGE = 'DECODE_MESSAGE',
  CHECK_DEVICE_ID = 'CHECK_DEVICE_ID',
  DEVICE_FOUND = 'DEVICE_FOUND',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  UPDATE_OFFLINE_STATUS = 'UPDATE_OFFLINE_STATUS',
  UPDATE_DATABASE = 'UPDATE_DATABASE',
  UPDATE_MEMORY_STORE = 'UPDATE_MEMORY_STORE',
  LW_COMPLETE = 'LW_COMPLETE',
  LW_ERROR = 'LW_ERROR'
}

/**
 * Convert uint32 IP to dotted decimal string
 */
function uint32ToIpAddress(uint32: number): string {
  return [
    (uint32 >>> 24) & 0xFF,
    (uint32 >>> 16) & 0xFF,
    (uint32 >>> 8) & 0xFF,
    uint32 & 0xFF
  ].join('.');
}

/**
 * Process Last Will message from broker when device disconnects unexpectedly
 */
export async function processLastWillMessage(
  topic: string,
  payload: Buffer
): Promise<void> {
  try {
    logger.warn('Processing Last Will message', { topic, size: payload.length });

    // Extract hostname from topic for logging
    const hostname = topic.split('/')[3];

    // Emit Last Will processing start
    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.LW_START,
      hostname,
      timestamp: new Date(),
      info: 'Device disconnected unexpectedly - processing Last Will'
    });

    // 1. Unwrap HMAC
    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.HMAC_UNWRAP,
      hostname,
      size: payload.length
    });

    const unwrapped = unwrapHMAC(payload);
    if (!unwrapped || !unwrapped.valid) {
      logger.error('Invalid HMAC in Last Will message');
      monitorServer.broadcastLastWillProcessing({
        event: LastWillProcessingEvent.LW_ERROR,
        hostname,
        error: 'Invalid HMAC'
      });
      return;
    }

    // 2. Decode LastWillMessage
    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.DECODE_MESSAGE,
      hostname,
      payloadSize: unwrapped.payload.length
    });

    const lastWillMessage = protobufDecoder.decodeLastWill(unwrapped.payload);
    logger.debug('Decoded Last Will message', lastWillMessage);

    // 3. Check device_db_id
    const deviceDbId = lastWillMessage.deviceDbId || lastWillMessage.device_db_id || 0;
    
    // Convert IP address
    const ipAddress = lastWillMessage.ipAddress || lastWillMessage.ip_address ? 
      uint32ToIpAddress(lastWillMessage.ipAddress || lastWillMessage.ip_address) : '';

    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.CHECK_DEVICE_ID,
      hostname: lastWillMessage.hostname || hostname,
      deviceDbId,
      uptimeAtConnect: lastWillMessage.uptimeAtConnect || lastWillMessage.uptime_at_connect,
      firmware: lastWillMessage.firmware,
      ipAddress,
      rssi: lastWillMessage.rssi,
      timestamp: lastWillMessage.timestamp
    });

    if (deviceDbId === 0) {
      logger.warn('Last Will message with device_db_id=0, discarding', {
        topic,
        hostname
      });
      monitorServer.broadcastLastWillProcessing({
        event: LastWillProcessingEvent.LW_ERROR,
        hostname,
        error: 'device_db_id is 0, discarding message'
      });
      return;
    }
    
    logger.warn('Device DISCONNECTED (Last Will)', { 
      deviceDbId,
      hostname: lastWillMessage.hostname || hostname,
      uptimeAtConnect: lastWillMessage.uptimeAtConnect || lastWillMessage.uptime_at_connect,
      firmware: lastWillMessage.firmware,
      ipAddress,
      rssi: lastWillMessage.rssi
    });

    // 4. Find device by device_db_id
    const device = await DeviceService.findById(deviceDbId);
    if (!device) {
      logger.error('Device not found for device_db_id', { deviceDbId });
      monitorServer.broadcastLastWillProcessing({
        event: LastWillProcessingEvent.DEVICE_NOT_FOUND,
        hostname,
        deviceDbId
      });
      return;
    }

    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.DEVICE_FOUND,
      hostname: lastWillMessage.hostname || hostname,
      deviceDbId,
      macAddress: device.macAddress,
      dbHostname: device.hostname
    });

    // 5. Update device status to offline in database
    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.UPDATE_OFFLINE_STATUS,
      hostname: lastWillMessage.hostname || hostname,
      deviceDbId,
      fieldsToUpdate: {
        isOnline: false,
        connected: false,
        lastSeen: new Date().toISOString(),
        lastWillTimestamp: lastWillMessage.timestamp,
        uptimeAtConnect: lastWillMessage.uptimeAtConnect || lastWillMessage.uptime_at_connect,
        lastKnownIp: ipAddress,
        lastKnownRssi: lastWillMessage.rssi
      }
    });

    // Update device status - mark as offline
    await DeviceService.updateDeviceStatus(device.id, {
      isOnline: false,
      connected: false,
      lastSeen: new Date(),
      // We don't clear other fields, just mark as offline
      // The device state remains as it was before disconnection
    });

    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.UPDATE_DATABASE,
      hostname: lastWillMessage.hostname || hostname,
      deviceDbId,
      success: true
    });

    // 6. Update in-memory device store
    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.UPDATE_MEMORY_STORE,
      hostname: lastWillMessage.hostname || hostname,
      deviceDbId
    });

    await deviceStore.updateDevice(lastWillMessage.hostname || hostname, {
      deviceId: lastWillMessage.hostname || hostname,
      hostname: lastWillMessage.hostname || hostname,
      macAddress: device.macAddress,
      online: false,
      lastSeen: new Date(),
      // Store Last Will information
      lastWillData: {
        timestamp: new Date(lastWillMessage.timestamp ? lastWillMessage.timestamp * 1000 : Date.now()),
        uptimeAtConnect: lastWillMessage.uptimeAtConnect || lastWillMessage.uptime_at_connect || 0,
        firmware: lastWillMessage.firmware || '',
        ipAddress,
        rssi: lastWillMessage.rssi || 0,
        hostname: lastWillMessage.hostname || hostname,
      }
    });

    logger.warn('Last Will message processed successfully', { 
      deviceId: device.id,
      hostname: lastWillMessage.hostname || hostname,
      nowOffline: true
    });

    // Emit Last Will complete
    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.LW_COMPLETE,
      hostname: lastWillMessage.hostname || hostname,
      deviceDbId,
      success: true,
      deviceNowOffline: true
    });

    // Emit last will event for other listeners
    deviceStore.emit('lastwill', lastWillMessage.hostname || hostname, {
      ...lastWillMessage,
      ipAddress,
      deviceDbId
    });

  } catch (error) {
    logger.error('Error processing Last Will message', error);
    
    // Extract hostname from topic for error event
    const hostname = topic.split('/')[3];
    monitorServer.broadcastLastWillProcessing({
      event: LastWillProcessingEvent.LW_ERROR,
      hostname,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}