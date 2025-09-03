'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Grid2 as Grid,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import {
  DeviceHub,
  CheckCircle,
  Warning,
  Speed,
  Memory,
  Router,
} from '@mui/icons-material';
import StatsCard from '@/components/dashboard/StatsCard';
import DeviceStatusGrid from '@/components/dashboard/DeviceStatusGrid';
import RecentAlarmsCard from '@/components/dashboard/RecentAlarmsCard';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    devices: {
      total: 0,
      online: 0,
      offline: 0,
      withAlarms: 0,
      withWarnings: 0,
      withErrors: 0,
    },
    trends: {
      devicesGrowth: 0,
      onlineGrowth: 0,
      warningsGrowth: 0,
      offlineGrowth: 0,
    },
    percentages: {
      online: 0,
      offline: 0,
      withAlarms: 0,
      withWarnings: 0,
    },
  });
  const [devices, setDevices] = useState<any[]>([]);
  const [alarms, setAlarms] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch all data in parallel
      const [statsRes, devicesRes, alarmsRes] = await Promise.all([
        fetch('/api/dashboard/stats', { credentials: 'include' }),
        fetch('/api/devices', { credentials: 'include' }),
        fetch('/api/dashboard/recent-alarms', { credentials: 'include' }),
      ]);

      // Check responses
      if (!statsRes.ok || !devicesRes.ok || !alarmsRes.ok) {
        throw new Error('Error al cargar los datos del dashboard');
      }

      // Parse responses
      const [statsData, devicesData, alarmsData] = await Promise.all([
        statsRes.json(),
        devicesRes.json(),
        alarmsRes.json(),
      ]);

      // Debug: Log what we're receiving
      console.log('[Dashboard] API Responses:', {
        stats: statsData,
        devices: devicesData,
        alarms: alarmsData
      });

      // Update state based on actual API structure
      setStats(statsData);
      
      // Devices endpoint returns { success: true, data: [...] }
      const devicesList = devicesData?.data && Array.isArray(devicesData.data) 
        ? devicesData.data 
        : [];
      
      setDevices(devicesList);
      
      // Alarms endpoint returns { alarms: [...] }
      const alarmsList = alarmsData?.alarms && Array.isArray(alarmsData.alarms) 
        ? alarmsData.alarms 
        : [];
        
      setAlarms(alarmsList);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    // Escuchar evento de refresh del layout
    const handleRefreshEvent = () => {
      fetchDashboardData(true);
    };
    window.addEventListener('dashboard-refresh', handleRefreshEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('dashboard-refresh', handleRefreshEvent);
    };
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Calcular estadísticas adicionales usando la estructura correcta
  const offlineDevices = stats.devices.offline;
  const deviceHealthPercentage = stats.percentages.online;

  return (
    <Container maxWidth="xl" sx={{ mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Panel de Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitoreo en tiempo real del sistema de alarmas ESP32
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Dispositivos"
              value={stats.devices.total}
              icon={<DeviceHub />}
              color="primary"
              loading={loading}
              subtitle="Dispositivos registrados"
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Dispositivos En Línea"
              value={stats.devices.online}
              icon={<CheckCircle />}
              color="success"
              loading={loading}
              subtitle={`${deviceHealthPercentage}% del total`}
              trend={{
                value: stats.trends.onlineGrowth,
                isPositive: stats.trends.onlineGrowth > 0,
              }}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Con Alarmas"
              value={stats.devices.withAlarms}
              icon={<Warning />}
              color="warning"
              loading={loading}
              subtitle={`${stats.percentages.withAlarms}% del total`}
            />
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Dispositivos Offline"
              value={stats.devices.offline}
              icon={<Warning />}
              color={stats.devices.offline > 0 ? 'error' : 'info'}
              loading={loading}
              subtitle={stats.devices.offline > 0 ? 'Requieren atención' : 'Todos en línea'}
              trend={{
                value: stats.trends.offlineGrowth,
                isPositive: stats.trends.offlineGrowth < 0,
              }}
            />
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Devices Section */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper
              sx={{
                p: 3,
                background: 'rgba(26, 26, 26, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DeviceHub sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Estado de Dispositivos
                </Typography>
                <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#10b981',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      En línea ({stats.devices.online})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#ef4444',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Desconectado ({stats.devices.offline})
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <DeviceStatusGrid 
                devices={devices} 
                loading={loading}
              />
            </Paper>
          </Grid>

          {/* Alarms Section */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <RecentAlarmsCard
              alarms={alarms}
              loading={loading}
              maxItems={8}
            />
          </Grid>
        </Grid>

        {/* System Info Footer */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Última actualización: {new Date().toLocaleString('es-ES')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Speed sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Latencia: &lt;100ms
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Router sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                MQTT: Conectado
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
  );
}