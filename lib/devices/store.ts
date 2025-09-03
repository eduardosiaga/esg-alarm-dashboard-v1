import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { 
  DeviceState, 
  DeviceStateUpdate, 
  AlarmEventData, 
  CommandQueue, 
  CommandResponse 
} from '../../types/device';

export class DeviceStore extends EventEmitter {
  private devices: Map<string, DeviceState> = new Map();
  private alarmEvents: Map<string, AlarmEventData[]> = new Map();
  private commandQueue: Map<string, CommandQueue[]> = new Map();
  private offlineTimeout: Map<string, NodeJS.Timeout> = new Map();
  private readonly OFFLINE_TIMEOUT = 90000; // 90 seconds
  private readonly MAX_ALARM_EVENTS = 100; // Keep last 100 events per device

  constructor() {
    super();
    this.startCleanupInterval();
  }

  /**
   * Create default device state
   */
  private createDefaultDevice(deviceId: string): DeviceState {
    return {
      deviceId,
      hostname: deviceId,
      macAddress: '',
      lastSeen: new Date(),
      online: true,
      state: 'BOOT',
      firmware: '',
      uptime: 0,
      bootCount: 0,
      freeHeap: 0,
      fanPwmDuty: 0,
      network: 'none',
      ipAddress: '',
      rssi: 0,
      mqttConnected: false,
      ntpSynced: false,
      location: {
        country: '',
        zone: 0,
        latitude: 0,
        longitude: 0,
      },
      temperature: 0,
      humidity: 0,
      inputs: {
        panic1: false,
        panic2: false,
        boxSw: false,
      },
      outputs: {
        siren: false,
        turret: false,
      },
      counters: {
        panic1Count: 0,
        panic2Count: 0,
        tamperCount: 0,
        wifiDisconnects: 0,
        mqttDisconnects: 0,
      },
      errorFlags: 0,
      errorCount: 0,
    };
  }

  /**
   * Update device state
   */
  async updateDevice(deviceId: string, updates: DeviceStateUpdate): Promise<void> {
    const existing = this.devices.get(deviceId) || this.createDefaultDevice(deviceId);
    
    // Merge updates with existing state
    const updated: DeviceState = {
      ...existing,
      ...updates,
      inputs: {
        ...existing.inputs,
        ...(updates.inputs || {}),
      },
      outputs: {
        ...existing.outputs,
        ...(updates.outputs || {}),
      },
      counters: {
        ...existing.counters,
        ...(updates.counters || {}),
      },
      location: {
        ...existing.location,
        ...(updates.location || {}),
      },
    };

    this.devices.set(deviceId, updated);
    
    // Reset offline timeout
    this.resetOfflineTimeout(deviceId);
    
    // Emit update event
    this.emit('device-updated', deviceId, updated);
    
    logger.debug(`Device ${deviceId} updated`, {
      online: updated.online,
      state: updated.state,
      temperature: updated.temperature,
      humidity: updated.humidity,
    });
  }

  /**
   * Get device state
   */
  getDevice(deviceId: string): DeviceState | undefined {
    return this.devices.get(deviceId);
  }

  /**
   * Get all devices
   */
  getAllDevices(): DeviceState[] {
    return Array.from(this.devices.values());
  }

  /**
   * Get online devices
   */
  getOnlineDevices(): DeviceState[] {
    return Array.from(this.devices.values()).filter(d => d.online);
  }

  /**
   * Add alarm event
   */
  async addAlarmEvent(deviceId: string, event: AlarmEventData): Promise<void> {
    const events = this.alarmEvents.get(deviceId) || [];
    events.unshift(event); // Add to beginning
    
    // Keep only last MAX_ALARM_EVENTS
    if (events.length > this.MAX_ALARM_EVENTS) {
      events.pop();
    }
    
    this.alarmEvents.set(deviceId, events);
    this.emit('alarm-event', deviceId, event);
    
    logger.warn(`Alarm event for device ${deviceId}`, {
      type: event.type,
      state: event.state,
      priority: event.priority,
    });
  }

  /**
   * Get alarm events for a device
   */
  getAlarmEvents(deviceId: string, limit?: number): AlarmEventData[] {
    const events = this.alarmEvents.get(deviceId) || [];
    return limit ? events.slice(0, limit) : events;
  }

  /**
   * Increment a counter
   */
  async incrementCounter(deviceId: string, counter: keyof DeviceState['counters']): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device) {
      device.counters[counter]++;
      this.devices.set(deviceId, device);
      this.emit('counter-updated', deviceId, counter, device.counters[counter]);
    }
  }

  /**
   * Add command to queue
   */
  async queueCommand(deviceId: string, command: any): Promise<string> {
    const commandId = uuidv4();
    const queueItem: CommandQueue = {
      id: commandId,
      deviceId,
      command,
      status: 'pending',
      timestamp: new Date(),
      retries: 0,
    };
    
    const queue = this.commandQueue.get(deviceId) || [];
    queue.push(queueItem);
    this.commandQueue.set(deviceId, queue);
    
    this.emit('command-queued', deviceId, queueItem);
    logger.info(`Command queued for device ${deviceId}`, { commandId });
    
    return commandId;
  }

  /**
   * Update command response
   */
  async updateCommandResponse(deviceId: string, response: CommandResponse): Promise<void> {
    const queue = this.commandQueue.get(deviceId) || [];
    const command = queue.find(c => c.command.request_id === response.requestId);
    
    if (command) {
      command.status = response.success ? 'acknowledged' : 'failed';
      command.response = response;
      this.commandQueue.set(deviceId, queue);
      this.emit('command-response', deviceId, response);
      
      logger.info(`Command response for device ${deviceId}`, {
        requestId: response.requestId,
        success: response.success,
      });
    }
  }

  /**
   * Get command queue for device
   */
  getCommandQueue(deviceId: string): CommandQueue[] {
    return this.commandQueue.get(deviceId) || [];
  }

  /**
   * Get pending commands
   */
  getPendingCommands(deviceId: string): CommandQueue[] {
    const queue = this.commandQueue.get(deviceId) || [];
    return queue.filter(c => c.status === 'pending');
  }

  /**
   * Reset offline timeout for a device
   */
  private resetOfflineTimeout(deviceId: string): void {
    // Clear existing timeout
    const existing = this.offlineTimeout.get(deviceId);
    if (existing) {
      clearTimeout(existing);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      const device = this.devices.get(deviceId);
      if (device) {
        device.online = false;
        this.devices.set(deviceId, device);
        this.emit('device-offline', deviceId);
        logger.warn(`Device ${deviceId} marked as offline`);
      }
    }, this.OFFLINE_TIMEOUT);
    
    this.offlineTimeout.set(deviceId, timeout);
  }

  /**
   * Start cleanup interval for old data
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      // Clean up old command queue items (older than 1 hour)
      const oneHourAgo = new Date(Date.now() - 3600000);
      
      for (const [deviceId, queue] of this.commandQueue.entries()) {
        const filtered = queue.filter(c => 
          c.status === 'pending' || c.timestamp > oneHourAgo
        );
        this.commandQueue.set(deviceId, filtered);
      }
    }, 300000); // Run every 5 minutes
  }

  /**
   * Get store statistics
   */
  getStats() {
    return {
      totalDevices: this.devices.size,
      onlineDevices: this.getOnlineDevices().length,
      totalAlarmEvents: Array.from(this.alarmEvents.values())
        .reduce((sum, events) => sum + events.length, 0),
      pendingCommands: Array.from(this.commandQueue.values())
        .reduce((sum, queue) => sum + queue.filter(c => c.status === 'pending').length, 0),
    };
  }

  /**
   * Clear all data (for testing)
   */
  clearAll(): void {
    this.devices.clear();
    this.alarmEvents.clear();
    this.commandQueue.clear();
    this.offlineTimeout.forEach(timeout => clearTimeout(timeout));
    this.offlineTimeout.clear();
  }
}

export const deviceStore = new DeviceStore();