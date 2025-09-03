'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  DeviceHub,
  Warning,
  BarChart,
  Settings,
  Group,
  Security,
  Notifications,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardDrawerProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
}

const menuItems = [
  { text: 'Panel Principal', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Dispositivos', icon: <DeviceHub />, path: '/dashboard/devices' },
  { text: 'Alarmas', icon: <Warning />, path: '/dashboard/alarms' },
  { text: 'Estadísticas', icon: <BarChart />, path: '/dashboard/stats' },
  { text: 'Grupos', icon: <Group />, path: '/dashboard/groups' },
];

const adminItems = [
  { text: 'Configuración', icon: <Settings />, path: '/dashboard/settings' },
  { text: 'Seguridad', icon: <Security />, path: '/dashboard/security' },
  { text: 'Notificaciones', icon: <Notifications />, path: '/dashboard/notifications' },
];

export default function DashboardDrawer({
  mobileOpen,
  onDrawerToggle,
  drawerWidth,
}: DashboardDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
    // Solo cerrar en móvil
    if (window.innerWidth < 600) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Toolbar
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Security sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            ESP32 Alarm
          </Typography>
        </Box>
      </Toolbar>
      
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(0, 102, 204, 0.15) 100%)',
                  borderLeft: '3px solid #0066cc',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(0, 102, 204, 0.2) 100%)',
                  },
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.path ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.05)' }} />

      <Typography
        variant="caption"
        sx={{
          px: 2,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Administración
      </Typography>

      <List>
        {adminItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(0, 102, 204, 0.15) 100%)',
                  borderLeft: '3px solid #0066cc',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(0, 102, 204, 0.2) 100%)',
                  },
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.path ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Sistema v1.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary">
          © 2024 City Alarm
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'transparent',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'transparent',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}