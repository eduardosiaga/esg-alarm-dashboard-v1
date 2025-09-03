export interface DeviceState {
  // Identification
  deviceId: string;
  hostname: string;
  macAddress: string;
  
  // Status
  lastSeen: Date;
  lastLogin?: Date;  // Track when device initially connected
  online: boolean;
  state: 'BOOT' | 'INIT' | 'CONNECTING' | 'NORMAL' | 'ALARM' | 'MAINTENANCE' | 'ERROR' | 'CRITICAL';
  
  // System Info
  firmware: string;
  uptime: number;
  bootCount: number;
  freeHeap: number;
  fanPwmDuty: number;
  
  // Network
  network: 'wifi' | 'ethernet' | 'none';
  ipAddress: string;
  rssi: number;
  mqttConnected: boolean;
  ntpSynced: boolean;
  
  // Location
  location: {
    country: string;
    zone: number;
    latitude: number;
    longitude: number;
  };
  
  // Sensors
  temperature: number;
  humidity: number;
  
  // I/O States
  inputs: {
    panic1: boolean;
    panic2: boolean;
    boxSw: boolean;
  };
  outputs: {
    siren: boolean;
    turret: boolean;
  };
  
  // Statistics
  counters: {
    panic1Count: number;
    panic2Count: number;
    tamperCount: number;
    wifiDisconnects: number;
    mqttDisconnects: number;
  };
  
  // Error tracking
  errorFlags: number;
  errorCount: number;
}

export interface AlarmEventData {
  sequence: number;
  timestamp: Date;
  deviceId: string;
  type: string;
  state: string;
  priority: string;
  physicalState: boolean;
  outputType?: number;
  patternType?: number;
  durationSeconds?: number;
  elapsedSeconds?: number;
}

export interface CommandQueue {
  id: string;
  deviceId: string;
  command: any;
  status: 'pending' | 'sent' | 'acknowledged' | 'failed';
  timestamp: Date;
  retries: number;
  response?: CommandResponse;
}

export interface CommandResponse {
  requestId: string;
  timestamp: Date;
  success: boolean;
  errorCode: number;
  message: string;
  payload?: any;
}

export interface DeviceCommand {
  type: 'system' | 'config' | 'output' | 'diagnostic' | 'ota';
  payload: any;
  requestId?: string;
}

// Partial update type for device state
export type DeviceStateUpdate = Partial<Omit<DeviceState, 'inputs' | 'outputs' | 'counters' | 'location'>> & {
  inputs?: Partial<DeviceState['inputs']>;
  outputs?: Partial<DeviceState['outputs']>;
  counters?: Partial<DeviceState['counters']>;
  location?: Partial<DeviceState['location']>;
  lastWillData?: {
    timestamp: Date;
    uptimeAtConnect: number;
    firmware: string;
    ipAddress: string;
    rssi: number;
    hostname: string;
  };
};