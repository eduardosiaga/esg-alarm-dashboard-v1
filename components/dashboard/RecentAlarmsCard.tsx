'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Warning,
  ErrorOutline,
  Info,
  CheckCircle,
  AccessTime,
  Notifications,
} from '@mui/icons-material';

interface Alarm {
  id: string | number;
  deviceId?: number;
  hostname: string;  // La API devuelve 'hostname', no 'deviceHostname'
  location?: string; // Ubicación del dispositivo
  type: string; // Puede ser 'panic1', 'panic2', 'tamper', 'unknown', etc.
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string; // La API devuelve 'description', no 'message'
  timestamp: string;
  timeAgo?: string; // Tiempo relativo
  isOnline?: boolean; // Estado del dispositivo
  acknowledged?: boolean;
  details?: {
    temperature?: number;
    humidity?: number;
    panic1?: boolean;
    panic2?: boolean;
    tamper?: boolean;
    siren?: boolean;
    turret?: boolean;
  };
}

interface RecentAlarmsCardProps {
  alarms: Alarm[];
  loading?: boolean;
  maxItems?: number;
}

export default function RecentAlarmsCard({ 
  alarms, 
  loading = false,
  maxItems = 10 
}: RecentAlarmsCardProps) {
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ErrorOutline sx={{ color: 'error.main' }} />;
      case 'high':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'medium':
        return <Info sx={{ color: 'info.main' }} />;
      case 'low':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      default:
        return <Info sx={{ color: 'text.secondary' }} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getAlarmTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'panic1':
        return 'Pánico 1';
      case 'panic2':
        return 'Pánico 2';
      case 'tamper':
        return 'Sabotaje';
      case 'low_battery':
        return 'Batería Baja';
      case 'offline':
        return 'Desconexión';
      case 'online':
        return 'Reconexión';
      case 'unknown':
        return 'Alerta General';
      default:
        return type;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    // Si es más de un día, mostrar fecha y hora
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card
        sx={{
          background: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Notifications />
              <Typography variant="h6">Alarmas Recientes</Typography>
            </Box>
          }
        />
        <CardContent>
          <List>
            {[1, 2, 3].map((n) => (
              <ListItem key={n}>
                <Skeleton variant="rectangular" width="100%" height={60} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  const displayAlarms = alarms.slice(0, maxItems);

  return (
    <Card
      sx={{
        background: 'rgba(26, 26, 26, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Notifications sx={{ color: 'primary.main' }} />
            <Typography variant="h6">Alarmas Recientes</Typography>
            {alarms.length > 0 && (
              <Chip 
                label={alarms.length} 
                size="small" 
                color="primary"
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>
        }
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
        {displayAlarms.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert 
              severity="info" 
              icon={<CheckCircle />}
              sx={{
                background: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.3)',
              }}
            >
              No hay alarmas recientes. El sistema está funcionando normalmente.
            </Alert>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {displayAlarms.map((alarm, index) => (
              <ListItem
                key={alarm.id}
                sx={{
                  borderBottom: index < displayAlarms.length - 1 
                    ? '1px solid rgba(255, 255, 255, 0.05)' 
                    : 'none',
                  py: 2,
                  px: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.02)',
                  },
                  opacity: alarm.acknowledged ? 0.6 : 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getSeverityIcon(alarm.severity)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {alarm.hostname}
                      </Typography>
                      <Chip
                        label={getAlarmTypeLabel(alarm.type)}
                        size="small"
                        color={getSeverityColor(alarm.severity) as any}
                        sx={{ height: 20 }}
                      />
                      {alarm.isOnline !== undefined && (
                        <Chip
                          label={alarm.isOnline ? "En línea" : "Offline"}
                          size="small"
                          variant="outlined"
                          color={alarm.isOnline ? "success" : "error"}
                          sx={{ height: 20 }}
                        />
                      )}
                      {alarm.acknowledged && (
                        <Chip
                          label="Reconocida"
                          size="small"
                          variant="outlined"
                          sx={{ height: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {alarm.description}
                      </Typography>
                      {alarm.location && (
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          📍 {alarm.location}
                        </Typography>
                      )}
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography component="span" variant="caption" color="text.secondary">
                          {alarm.timeAgo || formatTime(alarm.timestamp)}
                        </Typography>
                      </Box>
                    </>
                  }
                  secondaryTypographyProps={{
                    component: 'div',
                    sx: { mt: 0.5 }
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}