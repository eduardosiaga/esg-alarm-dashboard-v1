'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Fade,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push('/login');
    }
  }, [email, router]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits entered
    if (value && index === 5 && newOtp.every(digit => digit)) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    
    if (pastedData.length === 6) {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      setError('Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: code,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        throw new Error(data.error || 'Código inválido');
      }

      setSuccess(true);
      
      console.log('[Verify OTP] Success response:', {
        hasSession: !!data.session,
        hasUser: !!data.user,
        hasRefreshToken: !!data.session?.refreshToken
      });
      
      // Store tokens if needed (they're also set as httpOnly cookies)
      if (data.session) {
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store refresh token for auto-refresh
        if (data.session.refreshToken) {
          localStorage.setItem('refresh_token', data.session.refreshToken);
          console.log('[Verify OTP] Refresh token stored in localStorage');
        }
      }

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el código');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
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
        throw new Error(data.error || 'Error al reenviar el código');
      }

      setError('');
      alert('Código reenviado exitosamente');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

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
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/login')}
              sx={{ mb: 2, color: 'text.secondary' }}
            >
              Volver
            </Button>

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
                  background: success 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
                  mb: 2,
                  transition: 'all 0.3s ease',
                }}
              >
                {success ? (
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
                ) : (
                  <LockIcon sx={{ fontSize: 40, color: 'white' }} />
                )}
              </Box>
              
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 600,
                  background: success
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                {success ? '¡Verificación Exitosa!' : 'Verificación OTP'}
              </Typography>
              
              <Typography variant="body1" color="text.secondary">
                {success 
                  ? 'Redirigiendo al dashboard...'
                  : `Ingresa el código de 6 dígitos enviado a ${email}`
                }
              </Typography>
            </Box>

            {!success && (
              <>
                {/* OTP Input */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        disabled={loading || success}
                        maxLength={1}
                        style={{
                          width: '50px',
                          height: '50px',
                          fontSize: '24px',
                          textAlign: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '2px solid',
                          borderColor: digit ? '#0066cc' : 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = digit ? '#0066cc' : 'rgba(255, 255, 255, 0.2)';
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Remember Me */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: 'text.secondary',
                          '&.Mui-checked': {
                            color: '#0066cc',
                          },
                        }}
                      />
                    }
                    label="Recordarme en este dispositivo"
                  />
                </Box>

                {/* Error Alert */}
                {error && (
                  <Fade in>
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                      {attemptsRemaining !== null && attemptsRemaining > 0 && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Intentos restantes: {attemptsRemaining}
                        </Typography>
                      )}
                    </Alert>
                  </Fade>
                )}

                {/* Buttons */}
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => handleSubmit()}
                    disabled={loading || success || otp.some(d => !d)}
                    sx={{
                      py: 1.5,
                      background: loading || success || otp.some(d => !d)
                        ? 'rgba(102, 126, 234, 0.5)'
                        : 'linear-gradient(135deg, #667eea 0%, #0066cc 100%)',
                      '&:hover': {
                        background: loading || success || otp.some(d => !d)
                          ? 'rgba(102, 126, 234, 0.5)'
                          : 'linear-gradient(135deg, #7c94ff 0%, #0052a3 100%)',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Verificar Código'
                    )}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={handleResendOTP}
                    disabled={loading}
                    sx={{ color: 'text.secondary' }}
                  >
                    Reenviar código
                  </Button>
                </Stack>
              </>
            )}

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                El código expira en 10 minutos
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    }>
      <VerifyPageContent />
    </Suspense>
  );
}