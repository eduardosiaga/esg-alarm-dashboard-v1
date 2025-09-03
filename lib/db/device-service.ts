import { PrismaClient, Device, DeviceStatus, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface DeviceWithStatus extends Device {
  deviceStatus: DeviceStatus | null;
}

export class DeviceService {
  /**
   * Find device by MAC address
   */
  static async findByMacAddress(macAddress: string): Promise<DeviceWithStatus | null> {
    try {
      const device = await prisma.device.findUnique({
        where: { macAddress },
        include: { deviceStatus: true }
      });
      return device as DeviceWithStatus;
    } catch (error) {
      logger.error('Error finding device by MAC address', { macAddress, error });
      throw error;
    }
  }

  /**
   * Find device by ID
   */
  static async findById(id: number): Promise<DeviceWithStatus | null> {
    try {
      const device = await prisma.device.findUnique({
        where: { id },
        include: { deviceStatus: true }
      });
      return device as DeviceWithStatus;
    } catch (error) {
      logger.error('Error finding device by ID', { id, error });
      throw error;
    }
  }

  /**
   * Create new device with initial status
   */
  static async createDevice(data: {
    macAddress: string;
    hostname?: string;
    country?: string;
    zone?: number;
    latitude?: number;
    longitude?: number;
  }): Promise<DeviceWithStatus> {
    try {
      return await prisma.device.create({
        data: {
          macAddress: data.macAddress,
          hostname: data.hostname,
          country: data.country,
          zone: data.zone,
          latitude: data.latitude ? new Prisma.Decimal(data.latitude) : null,
          longitude: data.longitude ? new Prisma.Decimal(data.longitude) : null,
          active: true,
          deviceStatus: {
            create: {
              isOnline: true,
              connected: true,
              lastSeen: new Date(),
              deviceSynced: false
            }
          }
        },
        include: { deviceStatus: true }
      });
    } catch (error) {
      logger.error('Error creating device', { data, error });
      throw error;
    }
  }

  /**
   * Update device status for login
   */
  static async updateDeviceLogin(
    deviceId: number,
    statusData: {
      hostname?: string;
      firmwareVersion?: string;
      uptime?: number;
      bootCount?: number;
      deviceState?: string;
      freeHeap?: number;
      networkType?: string;
      ipAddress?: string | null;
      rssi?: number;
      mqttConnected?: boolean;
      ntpSynced?: boolean;
      panic1?: boolean;
      panic2?: boolean;
      boxSw?: boolean;
      siren?: boolean;
      turret?: boolean;
      temperature?: number;
      humidity?: number;
      deviceSynced?: boolean;
      lastLoginTimestamp?: Date;
    }
  ): Promise<void> {
    try {
      // Update device hostname if changed
      if (statusData.hostname) {
        await prisma.device.update({
          where: { id: deviceId },
          data: { 
            hostname: statusData.hostname,
            updatedAt: new Date()
          }
        });
      }

      // Update or create device status
      await prisma.deviceStatus.upsert({
        where: { deviceId },
        create: {
          deviceId,
          isOnline: true,
          connected: true,  // ONLY set to true on login
          lastSeen: new Date(),
          lastLogin: statusData.lastLoginTimestamp,
          firmwareVersion: statusData.firmwareVersion,
          uptime: statusData.uptime,
          bootCount: statusData.bootCount || 0,
          deviceState: statusData.deviceState,
          freeHeap: statusData.freeHeap,
          networkType: statusData.networkType,
          ipAddress: statusData.ipAddress,
          rssi: statusData.rssi,
          mqttConnected: statusData.mqttConnected,
          ntpSynced: statusData.ntpSynced,
          panic1: statusData.panic1 || false,
          panic2: statusData.panic2 || false,
          boxSw: statusData.boxSw || false,
          siren: statusData.siren || false,
          turret: statusData.turret || false,
          temperature: statusData.temperature,
          humidity: statusData.humidity,
          deviceSynced: statusData.deviceSynced || false
        },
        update: {
          isOnline: true,
          connected: true,  // ONLY set to true on login
          lastSeen: new Date(),
          lastLogin: statusData.lastLoginTimestamp,
          firmwareVersion: statusData.firmwareVersion,
          uptime: statusData.uptime,
          bootCount: statusData.bootCount,
          deviceState: statusData.deviceState,
          freeHeap: statusData.freeHeap,
          networkType: statusData.networkType,
          ipAddress: statusData.ipAddress,
          rssi: statusData.rssi,
          mqttConnected: statusData.mqttConnected,
          ntpSynced: statusData.ntpSynced,
          panic1: statusData.panic1,
          panic2: statusData.panic2,
          boxSw: statusData.boxSw,
          siren: statusData.siren,
          turret: statusData.turret,
          temperature: statusData.temperature,
          humidity: statusData.humidity,
          deviceSynced: statusData.deviceSynced
        }
      });
    } catch (error) {
      logger.error('Error updating device login', { deviceId, error });
      throw error;
    }
  }

  /**
   * Mark device as synced
   */
  static async markDeviceSynced(deviceId: number): Promise<void> {
    try {
      await prisma.deviceStatus.update({
        where: { deviceId },
        data: {
          deviceSynced: true,
          lastSyncAttempt: new Date()
        }
      });
    } catch (error) {
      logger.error('Error marking device as synced', { deviceId, error });
      throw error;
    }
  }

  /**
   * Update device status from status message
   */
  static async updateDeviceStatus(
    deviceId: number,
    statusData: {
      // State information
      deviceState?: string;
      stateDuration?: number;
      
      // System information
      uptime?: number;
      bootCount?: number;
      freeHeap?: number;
      minHeap?: number;
      firmwareVersion?: string;
      
      // Network information
      networkType?: string;
      connected?: boolean;
      hasIp?: boolean;
      rssi?: number;
      ipAddress?: string | null;
      
      // Service states
      mqttConnected?: boolean;
      ntpSynced?: boolean;
      lastNtpSync?: Date;
      
      // Alarm states
      panic1?: boolean;
      panic2?: boolean;
      boxSw?: boolean;
      siren?: boolean;
      turret?: boolean;
      
      // Event counters
      panic1Count?: number;
      panic2Count?: number;
      tamperCount?: number;
      wifiDisconnects?: number;
      mqttDisconnects?: number;
      
      // Environmental sensors
      temperature?: number;
      humidity?: number;
      
      // Error information
      errorFlags?: number;
      errorCount?: number;
      
      // OTA information
      partition?: number;
      otaValidated?: boolean;
      
      // Connection status
      isOnline?: boolean;
      lastSeen?: Date;
      deviceSynced?: boolean;
    }
  ): Promise<void> {
    try {
      await prisma.deviceStatus.upsert({
        where: { deviceId },
        create: {
          deviceId,
          ...statusData
        },
        update: statusData
      });
      
      logger.debug('Device status updated', { deviceId });
    } catch (error) {
      logger.error('Error updating device status', { deviceId, error });
      throw error;
    }
  }

  /**
   * Increment a counter field in device status
   */
  static async incrementCounter(
    deviceId: number, 
    counterField: 'panic1Count' | 'panic2Count' | 'tamperCount' | 'wifiDisconnects' | 'mqttDisconnects' | 'errorCount'
  ): Promise<void> {
    try {
      const currentStatus = await prisma.deviceStatus.findUnique({
        where: { deviceId }
      });
      
      if (currentStatus) {
        const updateData: any = {};
        updateData[counterField] = (currentStatus[counterField] || 0) + 1;
        
        await prisma.deviceStatus.update({
          where: { deviceId },
          data: updateData
        });
        
        logger.debug(`Counter ${counterField} incremented for device ${deviceId}`);
      }
    } catch (error) {
      logger.error('Error incrementing counter', { deviceId, counterField, error });
      // Don't throw - counter increment should not break the flow
    }
  }

  /**
   * Save alarm event for historical tracking
   */
  static async saveDeviceAlarm(data: {
    deviceId: number;
    sequence: number;
    timestamp: Date;
    alarmType: any;
    eventState: any;
    priority: any;
    physicalState: boolean;
    outputType?: number;
    patternType?: number;
    durationSeconds?: number;
    elapsedSeconds?: number;
  }): Promise<void> {
    try {
      await prisma.deviceAlarm.create({
        data: {
          deviceId: data.deviceId,
          sequence: data.sequence,
          timestamp: data.timestamp,
          alarmType: data.alarmType,
          eventState: data.eventState,
          priority: data.priority,
          physicalState: data.physicalState,
          outputType: data.outputType,
          patternType: data.patternType,
          durationSeconds: data.durationSeconds,
          elapsedSeconds: data.elapsedSeconds
        }
      });
      
      logger.info('Alarm event saved', { 
        deviceId: data.deviceId, 
        alarmType: data.alarmType,
        eventState: data.eventState 
      });
    } catch (error) {
      logger.error('Error saving alarm event', { deviceId: data.deviceId, error });
      // Don't throw - alarm logging should not break the flow
    }
  }

  /**
   * Save telemetry data for historical tracking (formerly saveHeartbeat)
   */
  static async saveTelemetry(data: {
    deviceId: number;
    time: Date;
    temperature: number;
    humidity: number;
    fanPwmDuty: number;
    panic1: boolean;
    panic2: boolean;
    siren: boolean;
    turret: boolean;
    boxSw: boolean;
    changeType: any;
  }): Promise<void> {
    try {
      await prisma.deviceTelemetry.create({
        data: {
          deviceId: data.deviceId,
          time: data.time,
          temperature: data.temperature,
          humidity: data.humidity,
          fanPwmDuty: data.fanPwmDuty,
          panic1: data.panic1,
          panic2: data.panic2,
          siren: data.siren,
          turret: data.turret,
          boxSw: data.boxSw,
          changeType: data.changeType
        }
      });
      
      logger.debug('Telemetry saved', { 
        deviceId: data.deviceId, 
        changeType: data.changeType 
      });
    } catch (error) {
      logger.error('Error saving telemetry', { deviceId: data.deviceId, error });
      // Don't throw - heartbeat logging should not break the flow
    }
  }

  /**
   * Log command for tracking
   */
  static async logCommand(data: {
    deviceId: number;
    requestId: string;
    sequence: number;
    commandType: string;
    commandData: any;
    status?: string;
  }): Promise<void> {
    try {
      await prisma.deviceCommand.create({
        data: {
          deviceId: data.deviceId,
          requestId: data.requestId,
          sequence: data.sequence,
          timestamp: new Date(),
          commandType: data.commandType as any,
          commandData: data.commandData,
          status: (data.status || 'PENDING') as any,
          sentAt: new Date(),
          initiatedBy: 'SYSTEM_LOGIN_SYNC'
        }
      });
    } catch (error) {
      logger.error('Error logging command', { data, error });
      // Don't throw - logging should not break the flow
    }
  }

  /**
   * Find device by hostname
   */
  static async findByHostname(hostname: string): Promise<DeviceWithStatus | null> {
    try {
      const device = await prisma.device.findFirst({
        where: { hostname },
        include: { deviceStatus: true }
      });
      return device as DeviceWithStatus;
    } catch (error) {
      logger.error('Error finding device by hostname', { hostname, error });
      return null;
    }
  }

  /**
   * Save command response to database
   */
  static async saveCommandResponse(data: {
    deviceId: number;
    requestId: string;
    timestamp: Date;
    success: boolean;
    errorCode: number;
    message: string;
    payload?: Buffer;
  }): Promise<void> {
    try {
      // First, check if there's a command log entry for this request
      const deviceCommand = await prisma.deviceCommand.findFirst({
        where: { requestId: data.requestId }
      });

      if (deviceCommand) {
        // Update the existing command log with response data
        await prisma.deviceCommand.update({
          where: { id: deviceCommand.id },
          data: {
            status: data.success ? 'COMPLETED' : 'FAILED',
            acknowledgedAt: data.timestamp,
            responseData: {
              success: data.success,
              errorCode: data.errorCode,
              message: data.message,
              payload: data.payload?.toString('hex')
            }
          }
        });
        
        logger.info('Command log updated with response', { 
          deviceCommandId: deviceCommand.id,
          requestId: data.requestId,
          success: data.success
        });
      } else {
        // Create a new command log entry for orphaned response
        await prisma.deviceCommand.create({
          data: {
            deviceId: data.deviceId,
            requestId: data.requestId,
            sequence: 0, // Unknown sequence for orphaned response
            timestamp: new Date(),
            commandType: 'UNKNOWN' as any,
            commandData: {},
            status: data.success ? 'COMPLETED' : 'FAILED' as any,
            sentAt: null,
            acknowledgedAt: data.timestamp,
            responseData: {
              success: data.success,
              errorCode: data.errorCode,
              message: data.message,
              payload: data.payload?.toString('hex')
            },
            initiatedBy: 'DEVICE_RESPONSE'
          }
        });
        
        logger.warn('Created orphaned command log for response without request', { 
          deviceId: data.deviceId,
          requestId: data.requestId
        });
      }
    } catch (error) {
      logger.error('Error saving command response', { data, error });
      // Don't throw - response logging should not break the flow
    }
  }

  /**
   * Update command status in command_logs table
   */
  static async updateCommandStatus(
    requestId: string, 
    status: string,
    responseData?: {
      errorCode?: number;
      message?: string;
      respondedAt?: Date;
    }
  ): Promise<void> {
    try {
      const updateData: any = {
        status: status as any
      };

      if (responseData) {
        // Set the appropriate timestamp based on status
        if (status === 'COMPLETED') {
          updateData.completedAt = responseData.respondedAt || new Date();
        } else if (status === 'FAILED') {
          updateData.failedAt = responseData.respondedAt || new Date();
        } else {
          updateData.acknowledgedAt = responseData.respondedAt || new Date();
        }
        
        // Store error code
        if (responseData.errorCode !== undefined) {
          updateData.responseCode = responseData.errorCode;
        }
        
        // Separate handling for success vs error cases
        if (responseData.errorCode === 0) {
          // Success case: store message in responseData, clear errorMessage
          updateData.responseData = {
            success: true,
            message: responseData.message || '',
            timestamp: responseData.respondedAt || new Date()
          };
          updateData.errorMessage = null;  // Clear any previous error message
        } else {
          // Error case: store message in errorMessage, clear responseData
          updateData.errorMessage = responseData.message || 'Unknown error';
          updateData.responseData = null;  // Clear response data for errors
        }
      }

      await prisma.deviceCommand.updateMany({
        where: { requestId },
        data: updateData
      });
      
      logger.debug('Command status updated', { requestId, status });
    } catch (error) {
      logger.error('Error updating command status', { requestId, status, error });
      // Don't throw - status update should not break the flow
    }
  }

  /**
   * Get pending commands for a device
   */
  static async getPendingCommands(deviceId: number): Promise<any[]> {
    try {
      return await prisma.deviceCommand.findMany({
        where: {
          deviceId,
          status: 'PENDING'
        },
        orderBy: {
          timestamp: 'asc'
        }
      });
    } catch (error) {
      logger.error('Error getting pending commands', { deviceId, error });
      return [];
    }
  }

  /**
   * Get command history for a device
   */
  static async getCommandHistory(
    deviceId: number, 
    limit: number = 100
  ): Promise<any[]> {
    try {
      return await prisma.deviceCommand.findMany({
        where: { deviceId },
        orderBy: {
          timestamp: 'desc'
        },
        take: limit
      });
    } catch (error) {
      logger.error('Error getting command history', { deviceId, error });
      return [];
    }
  }
}

export default DeviceService;