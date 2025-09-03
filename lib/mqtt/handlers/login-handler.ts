import { logger } from '../../utils/logger';
import { unwrapHMAC } from '../../protobuf/hmac-wrapper';
import { protobufDecoder } from '../../protobuf/decoder';
import { DeviceService } from '../../db/device-service';
import { CommandBuilder } from '../../protobuf/command-builder';
import { mqttClient } from '../index';
import { deviceStore } from '../../devices/store';
import { monitorServer } from '../../websocket/websocket-monitor';

export interface LoginProcessingResult {
  deviceId: number;
  isNew: boolean;
  needsSync: boolean;
  syncCommand?: Buffer;
  macAddress: string;
  hostname: string;
  requestId?: string;
}

/**
 * Convert bytes array to MAC address string
 */
function bytesToMacAddress(bytes: number[]): string {
  if (!bytes || bytes.length !== 6) {
    throw new Error('Invalid MAC address bytes');
  }
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
}

/**
 * Convert IP uint32 to string
 */
function uint32ToIpAddress(ip: number): string | null {
  if (!ip || ip === 0) return null; // Return null instead of empty string for PostgreSQL INET type
  return [
    (ip >>> 24) & 0xFF,
    (ip >>> 16) & 0xFF,
    (ip >>> 8) & 0xFF,
    ip & 0xFF
  ].join('.');
}

/**
 * Map protobuf DeviceState to string
 */
function mapDeviceState(state: number): string {
  const stateMap: { [key: number]: string } = {
    0: 'BOOT',
    1: 'INIT',
    2: 'CONNECTING',
    3: 'NORMAL',
    4: 'ALARM',
    5: 'MAINTENANCE',
    6: 'ERROR',
    7: 'CRITICAL'
  };
  return stateMap[state] || 'UNKNOWN';
}

/**
 * Map protobuf NetworkInterface to string
 */
function mapNetworkType(network: number): string {
  const networkMap: { [key: number]: string } = {
    0: 'WIFI',
    1: 'ETHERNET',
    2: 'NONE'
  };
  return networkMap[network] || 'UNKNOWN';
}

// Track recent login messages to prevent duplicates
const recentLogins = new Map<string, { timestamp: number, requestId?: string }>();
const LOGIN_DEDUP_WINDOW_MS = 5000; // 5 second deduplication window

// Processing lock to prevent concurrent login processing for same device
const processingLocks = new Map<string, Promise<LoginProcessingResult>>();

// Track commands sent to prevent duplicates
const commandsSent = new Map<string, { timestamp: number, count: number }>();
const COMMAND_DEDUP_WINDOW_MS = 10000; // 10 second window

// Global counter for tracking calls
let globalCallCounter = 0;

/**
 * Process login message from device
 */
export async function processLoginMessage(
  topic: string,
  payload: Buffer
): Promise<LoginProcessingResult> {
  // Generate unique tracking ID for this call
  const callId = ++globalCallCounter;
  const callTimestamp = Date.now();
  const callStack = new Error().stack;
  
  logger.warn('🔍 LOGIN HANDLER CALLED', {
    callId,
    callTimestamp,
    topic,
    payloadSize: payload.length,
    payloadHash: payload.slice(0, 20).toString('hex'),
    stackTrace: callStack?.split('\n').slice(2, 7).join('\n')
  });
  
  const deviceId = topic.split('/')[3]; // Extract device ID from topic
  
  // Check if already processing a login for this device
  const existingProcess = processingLocks.get(deviceId);
  if (existingProcess) {
    logger.warn('Login already being processed for device, waiting for existing process', {
      callId,
      deviceId,
      topic
    });
    return existingProcess;
  }

  // Create a processing promise and store it
  const processingPromise = processLoginMessageInternal(topic, payload, callId, callTimestamp);
  processingLocks.set(deviceId, processingPromise);
  
  try {
    const result = await processingPromise;
    logger.warn('🔍 LOGIN HANDLER COMPLETED', {
      callId,
      callTimestamp,
      deviceId,
      needsSync: result.needsSync,
      requestId: result.requestId
    });
    return result;
  } finally {
    // Clean up the lock after processing
    processingLocks.delete(deviceId);
  }
}

/**
 * Internal login message processor
 */
async function processLoginMessageInternal(
  topic: string,
  payload: Buffer,
  callId: number,
  callTimestamp: number
): Promise<LoginProcessingResult> {
  try {
    // Generate a unique key for this login based on topic and payload hash
    const payloadHash = payload.slice(0, 20).toString('hex'); // Use first 20 bytes as hash
    const loginKey = `${topic}:${payloadHash}`;
    
    // Check if we've recently processed this login
    const now = Date.now();
    const recentLogin = recentLogins.get(loginKey);
    
    if (recentLogin && (now - recentLogin.timestamp) < LOGIN_DEDUP_WINDOW_MS) {
      logger.warn('Duplicate login message detected, skipping', { 
        topic, 
        timeSinceLastLogin: now - recentLogin.timestamp,
        previousRequestId: recentLogin.requestId
      });
      
      // Return cached result to prevent duplicate command generation
      return {
        deviceId: 0, // We don't have the actual device ID, but this prevents errors
        isNew: false,
        needsSync: false,
        macAddress: '',
        hostname: topic.split('/')[3], // Extract hostname from topic
        requestId: recentLogin.requestId
      };
    }
    
    logger.info('Processing login message', { 
      topic, 
      size: payload.length,
      loginKey,
      recentLoginsCount: recentLogins.size 
    });

    // Clean up old entries
    for (const [key, value] of recentLogins.entries()) {
      if (now - value.timestamp > LOGIN_DEDUP_WINDOW_MS * 2) {
        recentLogins.delete(key);
      }
    }

    // Broadcast start of processing
    monitorServer.broadcastLoginProcessing('LOGIN_START', { 
      topic, 
      size: payload.length 
    });

    // 1. Unwrap HMAC
    const unwrapped = unwrapHMAC(payload);
    if (!unwrapped || !unwrapped.valid) {
      monitorServer.broadcastLoginProcessing('LOGIN_ERROR', { 
        error: 'Invalid HMAC' 
      });
      throw new Error('Invalid HMAC in login message');
    }

    // 2. Decode StatusMessage
    const statusMessage = protobufDecoder.decodeStatus(unwrapped.payload);
    logger.debug('Decoded login status message', statusMessage);

    // 3. Extract and convert MAC address
    const macAddress = bytesToMacAddress(statusMessage.macAddress);
    const hostname = statusMessage.hostname || topic.split('/')[3]; // Extract hostname from position 3 in topic
    const deviceDbId = statusMessage.deviceDbId || 0;
    
    logger.info('Login from device', { 
      macAddress, 
      hostname, 
      deviceDbId,
      firmware: statusMessage.firmware 
    });

    // Broadcast device info
    monitorServer.broadcastLoginProcessing('DEVICE_INFO', { 
      macAddress, 
      hostname, 
      deviceDbId,
      firmware: statusMessage.firmware,
      uptime: statusMessage.uptime,
      bootCount: statusMessage.bootCount
    });

    // 4. Check if device exists in database
    let device = await DeviceService.findByMacAddress(macAddress);
    let isNew = false;
    let needsSync = false;
    let syncCommand: Buffer | undefined;
    let requestId: string | undefined;

    if (device) {
      // 5. Device exists - check if sync needed
      logger.info('Existing device found', { 
        dbId: device.id, 
        deviceDbId, 
        needsSync: device.id !== deviceDbId 
      });

      needsSync = device.id !== deviceDbId;

      // Broadcast device found
      monitorServer.broadcastLoginProcessing('DEVICE_FOUND', { 
        macAddress,
        hostname,
        dbId: device.id,
        deviceDbId,
        needsSync
      });

      // 6. Update device status
      await DeviceService.updateDeviceLogin(device.id, {
        hostname: hostname,
        firmwareVersion: statusMessage.firmware,
        uptime: statusMessage.uptime,
        bootCount: statusMessage.bootCount,
        deviceState: mapDeviceState(statusMessage.state),
        freeHeap: statusMessage.freeHeap,
        networkType: mapNetworkType(statusMessage.network),
        ipAddress: uint32ToIpAddress(statusMessage.ipAddress) || undefined,
        rssi: statusMessage.rssi,
        mqttConnected: statusMessage.mqttConnected,
        ntpSynced: statusMessage.ntpSynced,
        panic1: statusMessage.panic1,
        panic2: statusMessage.panic2,
        boxSw: statusMessage.boxSw,
        siren: statusMessage.siren,
        turret: statusMessage.turret,
        temperature: statusMessage.temperature,
        humidity: statusMessage.humidity,
        deviceSynced: !needsSync,
        lastLoginTimestamp: new Date(statusMessage.timestamp * 1000) // Convert Unix timestamp
      });

    } else {
      // 7. New device - create it
      logger.info('New device detected, creating record', { macAddress, hostname });
      isNew = true;
      needsSync = true;

      // Broadcast new device event
      monitorServer.broadcastLoginProcessing('NEW_DEVICE', { 
        macAddress,
        hostname
      });

      device = await DeviceService.createDevice({
        macAddress,
        hostname,
        country: statusMessage.country,
        zone: statusMessage.zone,
        latitude: statusMessage.latitude,
        longitude: statusMessage.longitude
      });

      // Broadcast device created
      monitorServer.broadcastLoginProcessing('DEVICE_CREATED', { 
        macAddress,
        hostname,
        dbId: device.id
      });

      // Update with initial status data
      await DeviceService.updateDeviceLogin(device.id, {
        firmwareVersion: statusMessage.firmware,
        uptime: statusMessage.uptime,
        bootCount: statusMessage.bootCount,
        deviceState: mapDeviceState(statusMessage.state),
        freeHeap: statusMessage.freeHeap,
        networkType: mapNetworkType(statusMessage.network),
        ipAddress: uint32ToIpAddress(statusMessage.ipAddress) || undefined,
        rssi: statusMessage.rssi,
        mqttConnected: statusMessage.mqttConnected,
        ntpSynced: statusMessage.ntpSynced,
        panic1: statusMessage.panic1,
        panic2: statusMessage.panic2,
        boxSw: statusMessage.boxSw,
        siren: statusMessage.siren,
        turret: statusMessage.turret,
        temperature: statusMessage.temperature,
        humidity: statusMessage.humidity,
        deviceSynced: false,
        lastLoginTimestamp: new Date(statusMessage.timestamp * 1000)
      });
    }

    // 8. Generate sync command if needed
    if (needsSync) {
      const syncGenerationStack = new Error().stack;
      
      logger.warn('🔍 SYNC COMMAND GENERATION TRIGGERED', {
        callId,
        callTimestamp,
        deviceId: device.id,
        hostname,
        deviceDbId,
        isNew,
        stackTrace: syncGenerationStack?.split('\n').slice(2, 5).join('\n')
      });

      // Broadcast sync needed
      monitorServer.broadcastLoginProcessing('SYNC_NEEDED', { 
        hostname,
        dbId: device.id,
        deviceDbId
      });

      const commandData = CommandBuilder.buildDeviceIdSyncCommand(device.id, hostname);
      syncCommand = commandData.command;
      requestId = commandData.requestId;
      
      logger.warn('🔍 SYNC COMMAND BUILT', {
        callId,
        requestId,
        commandSize: syncCommand.length,
        first20Bytes: syncCommand.slice(0, 20).toString('hex')
      });

      // Broadcast command generated
      monitorServer.broadcastLoginProcessing('SYNC_COMMAND_GENERATED', { 
        hostname,
        dbId: device.id,
        requestId,
        commandSize: syncCommand.length
      });

      // 9. Log command in database
      await DeviceService.logCommand({
        deviceId: device.id,
        requestId: commandData.requestId,
        sequence: commandData.sequence,
        commandType: 'CONFIG',
        commandData: {
          type: 'CFG_DEVICE',
          device_id: device.id,
          hostname: hostname
        },
        status: 'SENT'
      });

      // 10. Publish sync command
      const baseTopic = mqttClient?.getBaseTopic() || 'esagtech';
      const commandTopic = `${baseTopic}/pb/d/${hostname}/cmd`;
      
      // Log raw command data
      logger.info('Raw sync command data', {
        deviceId: device.id,
        hostname: hostname,
        commandSize: syncCommand.length,
        rawHex: syncCommand.toString('hex'),
        rawBytes: Array.from(syncCommand),
        first20Bytes: Array.from(syncCommand.slice(0, 20))
      });
      
      // CRITICAL: Check if we already sent a command recently
      const commandKey = `${hostname}:CONFIG`;
      const existingCommand = commandsSent.get(commandKey);
      const currentTime = Date.now();
      
      // Clean up old entries
      for (const [key, value] of commandsSent.entries()) {
        if (currentTime - value.timestamp > COMMAND_DEDUP_WINDOW_MS) {
          commandsSent.delete(key);
        }
      }
      
      if (existingCommand && (currentTime - existingCommand.timestamp) < COMMAND_DEDUP_WINDOW_MS) {
        existingCommand.count++;
        logger.error('DUPLICATE COMMAND DETECTED - BLOCKING', {
          hostname,
          requestId,
          existingRequestId: existingCommand,
          timeSinceLastCommand: currentTime - existingCommand.timestamp,
          duplicateCount: existingCommand.count
        });
        
        // Don't send duplicate command
        return {
          deviceId: device.id,
          isNew,
          needsSync: false, // Mark as not needing sync since we already sent one
          macAddress,
          hostname,
          requestId: undefined
        };
      }
      
      // Record this command
      commandsSent.set(commandKey, {
        timestamp: currentTime,
        count: 1
      });
      
      // Publish the command
      if (mqttClient) {
        const publishStack = new Error().stack;
        
        logger.warn('🔍 ABOUT TO CALL MQTT PUBLISH', {
          callId,
          topic: commandTopic,
          requestId,
          deviceId: device.id,
          commandsSentSize: commandsSent.size,
          stackTrace: publishStack?.split('\n').slice(2, 5).join('\n')
        });
        
        try {
          await mqttClient.publish(commandTopic, syncCommand);
          logger.warn('🔍 MQTT PUBLISH COMPLETED', {
            callId,
            topic: commandTopic, 
            deviceId: device.id,
            requestId 
          });
        } catch (publishError) {
          logger.error('🔍 MQTT PUBLISH FAILED', {
            callId,
            error: publishError,
            topic: commandTopic,
            requestId
          });
          // Remove from sent commands on failure
          commandsSent.delete(commandKey);
          throw publishError;
        }
      } else {
        throw new Error('MQTT client not initialized');
      }

      // Broadcast command sent for logging
      monitorServer.broadcastCommandSent(commandTopic, syncCommand, {
        type: 'DEVICE_ID_SYNC',
        deviceId: device.id,
        hostname: hostname,
        requestId: requestId
      });

      // Broadcast command sent
      monitorServer.broadcastLoginProcessing('SYNC_COMMAND_SENT', { 
        hostname,
        dbId: device.id,
        requestId,
        topic: commandTopic
      });
    } else {
      // Broadcast no sync needed
      monitorServer.broadcastLoginProcessing('DEVICE_SYNCED', { 
        hostname,
        dbId: device.id,
        message: 'Device already synchronized'
      });
    }

    // 11. Update in-memory device store
    await deviceStore.updateDevice(hostname, {
      deviceId: hostname,
      hostname: hostname,
      macAddress: macAddress,
      online: true,
      state: mapDeviceState(statusMessage.state) as any,
      firmware: statusMessage.firmware,
      uptime: statusMessage.uptime,
      bootCount: statusMessage.bootCount,
      freeHeap: statusMessage.freeHeap,
      fanPwmDuty: statusMessage.fanPwmDuty || 0,
      network: mapNetworkType(statusMessage.network) as any,
      ipAddress: uint32ToIpAddress(statusMessage.ipAddress) || undefined,
      rssi: statusMessage.rssi,
      mqttConnected: statusMessage.mqttConnected,
      ntpSynced: statusMessage.ntpSynced,
      location: {
        country: statusMessage.country || '',
        zone: statusMessage.zone || 0,
        latitude: statusMessage.latitude || 0,
        longitude: statusMessage.longitude || 0
      },
      temperature: statusMessage.temperature || 0,
      humidity: statusMessage.humidity || 0,
      inputs: {
        panic1: statusMessage.panic1 || false,
        panic2: statusMessage.panic2 || false,
        boxSw: statusMessage.boxSw || false
      },
      outputs: {
        siren: statusMessage.siren || false,
        turret: statusMessage.turret || false
      },
      counters: {
        panic1Count: statusMessage.panic1Count || 0,
        panic2Count: statusMessage.panic2Count || 0,
        tamperCount: statusMessage.tamperCount || 0,
        wifiDisconnects: statusMessage.wifiDisconnects || 0,
        mqttDisconnects: statusMessage.mqttDisconnects || 0
      },
      errorFlags: statusMessage.errorFlags || 0,
      errorCount: statusMessage.errorCount || 0
    });

    // Store in deduplication cache
    recentLogins.set(loginKey, {
      timestamp: now,
      requestId: requestId
    });

    // Broadcast completion
    monitorServer.broadcastLoginProcessing('LOGIN_COMPLETE', { 
      hostname,
      macAddress,
      dbId: device.id,
      isNew,
      needsSync,
      requestId
    });

    return {
      deviceId: device.id,
      isNew,
      needsSync,
      syncCommand,
      macAddress,
      hostname,
      requestId
    };

  } catch (error) {
    logger.error('Error processing login message', error);
    
    // Broadcast error
    monitorServer.broadcastLoginProcessing('LOGIN_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      topic
    });
    
    throw error;
  }
}

export default { processLoginMessage };