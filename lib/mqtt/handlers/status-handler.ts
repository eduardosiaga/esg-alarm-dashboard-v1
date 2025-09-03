import { logger } from '../../utils/logger';
import { protobufDecoder } from '../../protobuf/decoder';
import { unwrapHMAC } from '../../protobuf/hmac-wrapper';
import { DeviceService } from '../../db/device-service';
import { deviceStore } from '../../devices/store';
import { monitorServer } from '../../websocket/websocket-monitor';

// Status processing event types
export enum StatusProcessingEvent {
  STATUS_START = 'STATUS_START',
  HMAC_UNWRAP = 'HMAC_UNWRAP',
  DECODE_MESSAGE = 'DECODE_MESSAGE',
  CHECK_DEVICE_ID = 'CHECK_DEVICE_ID',
  DEVICE_FOUND = 'DEVICE_FOUND',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  UPDATE_DATABASE = 'UPDATE_DATABASE',
  UPDATE_MEMORY_STORE = 'UPDATE_MEMORY_STORE',
  STATUS_COMPLETE = 'STATUS_COMPLETE',
  STATUS_ERROR = 'STATUS_ERROR'
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
 * Map DeviceState enum to string
 */
function mapDeviceState(state: number): string {
  const states: Record<number, string> = {
    0: 'BOOT',
    1: 'INIT',
    2: 'CONNECTING',
    3: 'NORMAL',
    4: 'ALARM',
    5: 'MAINTENANCE',
    6: 'ERROR',
    7: 'CRITICAL'
  };
  return states[state] || 'UNKNOWN';
}

/**
 * Map NetworkInterface enum to string
 */
function mapNetworkType(network: number): string {
  const types: Record<number, string> = {
    0: 'WIFI',
    1: 'ETHERNET',
    2: 'NONE'
  };
  return types[network] || 'UNKNOWN';
}

/**
 * Process status message from device
 */
export async function processStatusMessage(
  topic: string,
  payload: Buffer
): Promise<void> {
  try {
    logger.info('Processing status message', { topic, size: payload.length });

    // Extract hostname from topic for logging
    const hostname = topic.split('/')[3];

    // Emit status processing start
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.STATUS_START,
      hostname,
      timestamp: new Date()
    });

    // 1. Unwrap HMAC
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.HMAC_UNWRAP,
      hostname,
      size: payload.length
    });

    const unwrapped = unwrapHMAC(payload);
    if (!unwrapped || !unwrapped.valid) {
      logger.error('Invalid HMAC in status message');
      monitorServer.broadcastStatusProcessing({
        event: StatusProcessingEvent.STATUS_ERROR,
        hostname,
        error: 'Invalid HMAC'
      });
      return;
    }

    // 2. Decode StatusMessage
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.DECODE_MESSAGE,
      hostname,
      payloadSize: unwrapped.payload.length
    });

    const statusMessage = protobufDecoder.decodeStatus(unwrapped.payload);
    logger.debug('Decoded status message', statusMessage);

    // 3. Check device_db_id
    const deviceDbId = statusMessage.deviceDbId || statusMessage.device_db_id || 0;
    
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.CHECK_DEVICE_ID,
      hostname,
      deviceDbId,
      state: mapDeviceState(statusMessage.state) as any,
      uptime: statusMessage.uptime,
      firmware: statusMessage.firmware
    });

    if (deviceDbId === 0) {
      logger.warn('Status message with device_db_id=0, discarding', {
        topic,
        hostname
      });
      monitorServer.broadcastStatusProcessing({
        event: StatusProcessingEvent.STATUS_ERROR,
        hostname,
        error: 'device_db_id is 0, discarding message'
      });
      return;
    }
    
    logger.info('Status from device', { 
      deviceDbId,
      hostname,
      state: mapDeviceState(statusMessage.state) as any,
      uptime: statusMessage.uptime,
      firmware: statusMessage.firmware 
    });

    // 5. Find device by device_db_id
    const device = await DeviceService.findById(deviceDbId);
    if (!device) {
      logger.error('Device not found for device_db_id', { deviceDbId });
      monitorServer.broadcastStatusProcessing({
        event: StatusProcessingEvent.DEVICE_NOT_FOUND,
        hostname,
        deviceDbId
      });
      return;
    }

    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.DEVICE_FOUND,
      hostname,
      deviceDbId,
      macAddress: device.macAddress,
      hasStatus: !!device.deviceStatus
    });

    // 6. Update device status in database
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.UPDATE_DATABASE,
      hostname,
      deviceDbId,
      fieldsToUpdate: {
        state: mapDeviceState(statusMessage.state) as any,
        uptime: statusMessage.uptime,
        firmware: statusMessage.firmware,
        connected: statusMessage.connected,
        mqttConnected: statusMessage.mqttConnected || statusMessage.mqtt_connected,
        ntpSynced: statusMessage.ntpSynced || statusMessage.ntp_synced
      }
    });

    await DeviceService.updateDeviceStatus(device.id, {
      // State information
      deviceState: mapDeviceState(statusMessage.state),
      stateDuration: statusMessage.stateDuration || statusMessage.state_duration,
      
      // System information
      uptime: statusMessage.uptime,
      bootCount: statusMessage.bootCount || statusMessage.boot_count,
      freeHeap: statusMessage.freeHeap || statusMessage.free_heap,
      minHeap: statusMessage.minHeap || statusMessage.min_heap,
      firmwareVersion: statusMessage.firmware,
      
      // Network information
      networkType: mapNetworkType(statusMessage.network),
      connected: statusMessage.connected,
      hasIp: statusMessage.hasIp || statusMessage.has_ip,
      rssi: statusMessage.rssi,
      ipAddress: statusMessage.ipAddress ? 
        (typeof statusMessage.ipAddress === 'string' ? 
          statusMessage.ipAddress : 
          uint32ToIpAddress(statusMessage.ipAddress || statusMessage.ip_address)) : 
        uint32ToIpAddress(statusMessage.ip_address || 0),
      
      // Service states
      mqttConnected: statusMessage.mqttConnected || statusMessage.mqtt_connected,
      ntpSynced: statusMessage.ntpSynced || statusMessage.ntp_synced,
      lastNtpSync: statusMessage.lastNtpSync ? 
        new Date(statusMessage.lastNtpSync * 1000) :
        (statusMessage.last_ntp_sync ? new Date(statusMessage.last_ntp_sync * 1000) : undefined),
      
      // Alarm states
      panic1: statusMessage.panic1,
      panic2: statusMessage.panic2,
      boxSw: statusMessage.boxSw || statusMessage.box_sw,
      siren: statusMessage.siren,
      turret: statusMessage.turret,
      
      // Event counters
      panic1Count: statusMessage.panic1Count || statusMessage.panic1_count,
      panic2Count: statusMessage.panic2Count || statusMessage.panic2_count,
      tamperCount: statusMessage.tamperCount || statusMessage.tamper_count,
      wifiDisconnects: statusMessage.wifiDisconnects || statusMessage.wifi_disconnects,
      mqttDisconnects: statusMessage.mqttDisconnects || statusMessage.mqtt_disconnects,
      
      // Environmental sensors
      temperature: statusMessage.temperature,
      humidity: statusMessage.humidity,
      
      // Error information
      errorFlags: statusMessage.errorFlags || statusMessage.error_flags,
      errorCount: statusMessage.errorCount || statusMessage.error_count,
      
      // OTA information
      partition: statusMessage.partition,
      otaValidated: statusMessage.otaValidated || statusMessage.ota_validated,
      
      // Connection status
      isOnline: true,
      lastSeen: new Date(),
      deviceSynced: true // device_db_id != 0 means it's synced
    });

    // 7. Update in-memory device store
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.UPDATE_MEMORY_STORE,
      hostname,
      deviceDbId
    });

    await deviceStore.updateDevice(hostname, {
      deviceId: deviceDbId,
      hostname: hostname,
      macAddress: device.macAddress,
      online: true,
      lastSeen: new Date(),
      firmware: statusMessage.firmware,
      uptime: statusMessage.uptime,
      state: mapDeviceState(statusMessage.state) as any,
      network: mapNetworkType(statusMessage.network) as any,
      ipAddress: statusMessage.ipAddress ? 
        (typeof statusMessage.ipAddress === 'string' ? 
          statusMessage.ipAddress : 
          uint32ToIpAddress(statusMessage.ipAddress || statusMessage.ip_address)) : 
        uint32ToIpAddress(statusMessage.ip_address || 0),
      rssi: statusMessage.rssi,
      mqttConnected: statusMessage.mqttConnected || statusMessage.mqtt_connected,
      ntpSynced: statusMessage.ntpSynced || statusMessage.ntp_synced,
      inputs: {
        panic1: statusMessage.panic1,
        panic2: statusMessage.panic2,
        boxSw: statusMessage.boxSw || statusMessage.box_sw
      },
      outputs: {
        siren: statusMessage.siren,
        turret: statusMessage.turret
      },
      counters: {
        panic1Count: statusMessage.panic1Count || statusMessage.panic1_count,
        panic2Count: statusMessage.panic2Count || statusMessage.panic2_count,
        tamperCount: statusMessage.tamperCount || statusMessage.tamper_count,
        wifiDisconnects: statusMessage.wifiDisconnects || statusMessage.wifi_disconnects,
        mqttDisconnects: statusMessage.mqttDisconnects || statusMessage.mqtt_disconnects
      },
      temperature: statusMessage.temperature,
      humidity: statusMessage.humidity
    });

    logger.info('Status message processed successfully', { 
      deviceId: device.id,
      hostname,
      state: mapDeviceState(statusMessage.state)
    });

    // Emit status complete
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.STATUS_COMPLETE,
      hostname,
      deviceDbId,
      success: true
    });

  } catch (error) {
    logger.error('Error processing status message', error);
    
    // Extract hostname from topic for error event
    const hostname = topic.split('/')[3];
    monitorServer.broadcastStatusProcessing({
      event: StatusProcessingEvent.STATUS_ERROR,
      hostname,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}