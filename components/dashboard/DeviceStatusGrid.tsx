'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid2 as Grid,
  Skeleton,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Circle,
  SignalWifiOff,
  SignalWifi4Bar,
  SignalWifi3Bar,
  SignalWifi2Bar,
  SignalWifi1Bar,
  Warning,
  Battery20,
  Battery50,
  Battery80,
  BatteryFull,
  PowerOff,
  MoreVert,
  DeviceHub,
  NotificationImportant,
} from '@mui/icons-material';

interface Device {
  id: number;
  hostname: string;
  macAddress: string;
  status?: {
    isOnline: boolean;
    lastSeen?: string | null;
    firmwareVersion?: string;
    uptime?: number;
    state?: string;
    network?: {
      type?: string;
      ipAddress?: string | null;
      rssi?: number | null;
      connected?: boolean;
      mqttConnected?: boolean;
    };
    sensors?: {
      temperature?: number | null;
      humidity?: number | null;
      fanPwmDuty?: number | null;
    };
    alarms?: {
      panic1?: boolean;
      panic2?: boolean;
      tamper?: boolean;
      siren?: boolean;
      turret?: boolean;
    };
    counters?: {
      panic1Count?: number;
      panic2Count?: number;
      tamperCount?: number;
      wifiDisconnects?: number;
      mqttDisconnects?: number;
      errorCount?: number;
    };
  } | null;
  location?: {
    latitude?: number | null;
    longitude?: number | null;
    description?: string | null;
  };
  account?: any;
  groups?: any[];
  active?: boolean;
}

interface DeviceStatusGridProps {
  devices: Device[];
  loading?: boolean;
}

export default function DeviceStatusGrid({ devices, loading = false }: DeviceStatusGridProps) {
  // Ensure devices is always an array
  const deviceList = Array.isArray(devices) ? devices : [];
  
  const getStatusColor = (isOnline?: boolean) => {
    if (isOnline === true) return '#10b981';
    if (isOnline === false) return '#ef4444';
    return '#6b7280';
  };

  const getWifiIcon = (rssi?: number | null) => {
    if (!rssi) return <SignalWifiOff fontSize="small" />;
    if (rssi >= -50) return <SignalWifi4Bar fontSize="small" />;
    if (rssi >= -60) return <SignalWifi3Bar fontSize="small" />;
    if (rssi >= -70) return <SignalWifi2Bar fontSize="small" />;
    if (rssi >= -80) return <SignalWifi1Bar fontSize="small" />;
    return <SignalWifiOff fontSize="small" />;
  };

  const getBatteryIcon = (voltage?: number) => {
    if (!voltage) return <PowerOff fontSize="small" />;
    if (voltage >= 12.5) return <BatteryFull fontSize="small" />;
    if (voltage >= 12.0) return <Battery80 fontSize="small" />;
    if (voltage >= 11.5) return <Battery50 fontSize="small" />;
    return <Battery20 fontSize="small" />;
  };

  const formatLastSeen = (lastSeen?: string | null) => {
    if (!lastSeen) return 'Nunca';
    const date = new Date(lastSeen);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} h`;
    return `Hace ${Math.floor(minutes / 1440)} días`;
  };

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Grid key={n} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{
                background: 'rgba(26, 26, 26, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardContent>
                <Skeleton variant="rectangular" height={120} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Handle empty state
  if (!loading && deviceList.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4,
        color: 'text.secondary'
      }}>
        <DeviceHub sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">No hay dispositivos registrados</Typography>
        <Typography variant="body2">Los dispositivos aparecerán aquí cuando se conecten</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {deviceList.map((device) => (
        <Grid key={device.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Card
            sx={{
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: (device.status?.alarms?.panic1 || device.status?.alarms?.panic2 || device.status?.alarms?.tamper) 
                ? 'error.main' 
                : 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              boxShadow: (device.status?.alarms?.panic1 || device.status?.alarms?.panic2 || device.status?.alarms?.tamper)
                ? '0 0 20px rgba(239, 68, 68, 0.3)'
                : '0 4px 20px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (device.status?.alarms?.panic1 || device.status?.alarms?.panic2 || device.status?.alarms?.tamper)
                  ? '0 0 30px rgba(239, 68, 68, 0.5)'
                  : '0 8px 30px rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            {(device.status?.alarms?.panic1 || device.status?.alarms?.panic2 || device.status?.alarms?.tamper) && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                  animation: 'pulse 2s infinite',
                }}
              />
            )}

            <CardContent>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {device.hostname}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {device.status?.network?.ipAddress || 'Sin IP'}
                  </Typography>
                </Box>
                
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>

              {/* Status */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Circle
                    sx={{
                      fontSize: 12,
                      color: getStatusColor(device.status?.isOnline),
                      animation: device.status?.isOnline 
                        ? 'pulse 2s infinite' 
                        : 'none',
                    }}
                  />
                  <Chip
                    label={device.status?.isOnline ? 'En línea' : 'Desconectado'}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(device.status?.isOnline)}20`,
                      color: getStatusColor(device.status?.isOnline),
                      fontWeight: 600,
                      border: `1px solid ${getStatusColor(device.status?.isOnline)}40`,
                    }}
                  />
                </Box>
                {(device.status?.alarms?.panic1 || device.status?.alarms?.panic2 || device.status?.alarms?.tamper) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1.5 }}>
                    <NotificationImportant 
                      sx={{ 
                        fontSize: 40,
                        color: 'error.main',
                        animation: 'pulse 1s infinite',
                        mr: 1
                      }}
                    />
                    <Chip
                      icon={<Warning sx={{ fontSize: 16 }} />}
                      label="ALARMA"
                      size="small"
                      color="error"
                      sx={{
                        animation: 'pulse 1s infinite',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Metrics */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getWifiIcon(device.status?.network?.rssi)}
                  <Typography variant="caption" color="text.secondary">
                    {device.status?.network?.rssi ? `${device.status.network.rssi} dBm` : 'Sin señal'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {device.status?.network?.connected ? (
                    <BatteryFull fontSize="small" color="success" />
                  ) : (
                    <PowerOff fontSize="small" />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {device.status?.network?.connected ? 'Conectado' : 'Sin conexión'}
                  </Typography>
                </Box>
                
                {device.status?.sensors?.temperature !== null && device.status?.sensors?.temperature !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      🌡️ {device.status.sensors.temperature.toFixed(1)}°C
                    </Typography>
                  </Box>
                )}
                
                {device.status?.sensors?.humidity !== null && device.status?.sensors?.humidity !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      💧 {device.status.sensors.humidity.toFixed(0)}%
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Last Seen */}
              <Typography variant="caption" color="text.secondary">
                Última conexión: {formatLastSeen(device.status?.lastSeen)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}