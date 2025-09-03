'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  icon,
  color = 'primary',
  loading = false,
  subtitle,
  trend,
}: StatsCardProps) {
  const getGradient = () => {
    switch (color) {
      case 'primary':
        return 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)';
      case 'secondary':
        return 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
      case 'success':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'error':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'info':
        return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)';
    }
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
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ ml: 'auto' }}>
              <Skeleton width={60} height={20} />
            </Box>
          </Box>
          <Skeleton width={100} height={25} sx={{ mb: 1 }} />
          <Skeleton width={80} height={40} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: 'rgba(26, 26, 26, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: getGradient(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 20px rgba(0, 102, 204, 0.3)',
            }}
          >
            {icon}
          </Box>
          
          {trend && (
            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                background: trend.isPositive 
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: trend.isPositive ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Typography>
            </Box>
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: getGradient(),
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}