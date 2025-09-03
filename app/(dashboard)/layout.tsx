'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  CircularProgress,
} from '@mui/material';
import { muiTheme } from '@/lib/theme/muiTheme';
import DashboardAppBar from '@/components/dashboard/AppBar';
import DashboardDrawer from '@/components/dashboard/Drawer';

const drawerWidth = 240;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = async () => {
      console.log('[Dashboard Layout] Starting auth check...');
      
      try {
        const userData = localStorage.getItem('user');
        console.log('[Dashboard Layout] User data from localStorage:', userData ? 'Found' : 'Not found');
        
        if (!userData) {
          console.log('[Dashboard Layout] No user data in localStorage, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('[Dashboard Layout] Verifying session with server...');
        // Verificar sesión en el servidor usando el endpoint /api/auth/me
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        console.log('[Dashboard Layout] Auth/me response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Dashboard Layout] Auth verification failed:', {
            status: response.status,
            error: errorText
          });
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        const sessionData = await response.json();
        console.log('[Dashboard Layout] Auth verified successfully:', sessionData);
        
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('[Dashboard Layout] Auth check failed with exception:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Setup auto-refresh de token
    // El access token dura 15 minutos (900 segundos)
    // Hacemos refresh cuando quedan 5 minutos (a los 10 minutos)
    const interval = setInterval(async () => {
      console.log('[Dashboard Layout] Attempting token refresh...');
      try {
        // Get refresh token from localStorage or cookie
        const refreshToken = localStorage.getItem('refresh_token');
        console.log('[Dashboard Layout] Refresh token available:', !!refreshToken);
        
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: refreshToken ? JSON.stringify({ refreshToken }) : '{}',
        });
        
        console.log('[Dashboard Layout] Token refresh response:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('[Dashboard Layout] Token refresh failed:', {
            status: response.status,
            error: errorData
          });
          localStorage.removeItem('user');
          localStorage.removeItem('refresh_token');
          router.push('/login');
        } else {
          const data = await response.json();
          console.log('[Dashboard Layout] Token refreshed successfully:', {
            success: data.success,
            expiresAt: data.session?.expiresAt
          });
          
          // Update refresh token if new one provided
          if (data.session?.refreshToken) {
            localStorage.setItem('refresh_token', data.session.refreshToken);
          }
        }
      } catch (error) {
        console.error('[Dashboard Layout] Token refresh exception:', error);
      }
    }, 10 * 60 * 1000); // Cada 10 minutos (el token dura 15 minutos)

    return () => clearInterval(interval);
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      localStorage.removeItem('user');
      sessionStorage.clear();
      router.push('/login');
    }
  };

  const handleRefresh = () => {
    // Trigger refresh en la página actual
    setRefreshing(true);
    window.dispatchEvent(new Event('dashboard-refresh'));
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* AppBar */}
        <DashboardAppBar
          user={user}
          onMenuClick={handleDrawerToggle}
          onLogout={handleLogout}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          drawerWidth={drawerWidth}
        />

        {/* Drawer */}
        <DashboardDrawer
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            mt: 8,
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}