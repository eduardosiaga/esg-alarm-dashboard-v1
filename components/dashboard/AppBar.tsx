'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  Dashboard,
  Refresh,
} from '@mui/icons-material';
import { useState } from 'react';

interface DashboardAppBarProps {
  user: any;
  onMenuClick: () => void;
  onLogout: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  drawerWidth: number;
}

export default function DashboardAppBar({
  user,
  onMenuClick,
  onLogout,
  onRefresh,
  refreshing = false,
  drawerWidth,
}: DashboardAppBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        background: 'linear-gradient(90deg, #0066cc 0%, #6366f1 100%)',
        boxShadow: '0 4px 20px rgba(0, 102, 204, 0.25)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div">
            City Alarm Dashboard
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="Actualizar datos">
              <IconButton
                color="inherit"
                onClick={onRefresh}
                disabled={refreshing}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {refreshing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Refresh />
                )}
              </IconButton>
            </Tooltip>
          )}
          
          <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
            {user?.name || user?.email}
          </Typography>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem',
              }}
            >
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                background: 'rgba(26, 26, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Conectado como
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ mr: 2, fontSize: 20 }} />
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Settings sx={{ mr: 2, fontSize: 20 }} />
              Configuración
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={onLogout} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 2, fontSize: 20 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}