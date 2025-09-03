// Dashboard Statistics Types
export interface DashboardStats {
  devices: {
    total: number;
    online: number;
    offline: number;
    withAlarms: number;
    withWarnings: number;
    withErrors: number;
  };
  trends: {
    devicesGrowth: number;
    onlineGrowth: number;
    warningsGrowth: number;
    offlineGrowth: number;
  };
  percentages: {
    online: number;
    offline: number;
    withAlarms: number;
    withWarnings: number;
  };
  timestamp: string;
}

// Recent Alarms Types
export interface AlarmDetails {
  temperature: number;
  humidity: number;
  panic1: boolean;
  panic2: boolean;
  tamper: boolean;
  siren: boolean;
  turret: boolean;
}

export interface RecentAlarm {
  id: number;
  deviceId: number;
  hostname: string;
  location: string;
  type: 'panic1' | 'panic2' | 'tamper' | 'high_temperature' | 'low_temperature' | 'high_humidity' | 'unknown';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  timestamp: string;
  timeAgo: string;
  isOnline: boolean;
  details: AlarmDetails;
}

export interface RecentAlarmsResponse {
  alarms: RecentAlarm[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  counts: {
    panic1: number;
    panic2: number;
    tamper: number;
    highTemperature: number;
    highHumidity: number;
  };
  timestamp: string;
}

// Device Health Types
export interface HealthDistribution {
  count: number;
  percentage: number;
}

export interface DeviceCategory {
  category: string;
  count: number;
  percentage: number;
  devices: Array<{
    id: number;
    hostname: string;
    location: string | null;
  }>;
}

export interface DeviceHealthResponse {
  distribution: {
    online: HealthDistribution;
    withWarnings: HealthDistribution;
    withAlarms: HealthDistribution;
    offline: HealthDistribution;
    healthy: HealthDistribution;
    withErrors: HealthDistribution;
    connectivityIssues: HealthDistribution;
  };
  metrics: {
    avgTemperature: number;
    avgHumidity: number;
    avgRssi: number;
    totalDevices: number;
  };
  categories: DeviceCategory[];
  healthScore: number;
  timestamp: string;
}

// Dashboard Card Types for UI
export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  trend?: number;
  loading?: boolean;
}