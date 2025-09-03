'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Fade,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  Security as SecurityIcon,
  Send as SendIcon,
} from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check if user already has an active session
    const checkExistingSession = async () => {
      console.log('[Login Page] Checking for existing session...');
      
      const userData = localStorage.getItem('user');
      const refreshToken = localStorage.getItem('refresh_token');
      
      console.log('[Login Page] Local storage check:', {
        hasUser: !!userData,
        hasRefreshToken: !!refreshToken
      });
      
      if (userData) {
        try {
          // Verify session is still valid
          console.log('[Login Page] Verifying session validity...');
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          });
          
          console.log('[Login Page] Session verification response:', {
            status: response.status,
            ok: response.ok
          });
          
          if (response.ok) {
            console.log('[Login Page] Valid session found, redirecting to dashboard');
            router.push('/dashboard');
            return;
          } else {
            console.log('[Login Page] Session invalid, clearing local storage');
            localStorage.removeItem('user');
            localStorage.removeItem('refresh_token');
          }
        } catch (error) {
          console.error('[Login Page] Session verification error:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('refresh_token');
        }
      }
      
      setCheckingSession(false);
    };
    
    checkExistingSession();
  }, [router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess(false);

    // Validate email
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el código');
      }

      setSuccess(true);
      
      // Redirect to OTP verification page after 1.5 seconds
      setTimeout(() => {
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking session
  if (checkingSession) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,102,204,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <Container maxWidth="sm">
        <Fade in timeout={500}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'rgba(26, 26, 26, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
                  mb: 2,
                }}
              >
                <SecurityIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                City Alarm Dashboard
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                Ingresa tu correo para recibir un código de acceso
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                placeholder="usuario@ejemplo.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {/* Error Alert */}
              {error && (
                <Fade in>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              {/* Success Alert */}
              {success && (
                <Fade in>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Código enviado exitosamente. Redirigiendo...
                  </Alert>
                </Fade>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || success}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  background: loading || success
                    ? 'rgba(102, 126, 234, 0.5)'
                    : 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
                  '&:hover': {
                    background: loading || success
                      ? 'rgba(102, 126, 234, 0.5)'
                      : 'linear-gradient(135deg, #7c94ff 0%, #0052a3 100%)',
                  },
                }}
              >
                {loading ? 'Enviando...' : success ? 'Código Enviado' : 'Enviar Código de Acceso'}
              </Button>
            </form>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Sistema seguro con autenticación OTP
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}