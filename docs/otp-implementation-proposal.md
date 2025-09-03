# 🔐 Propuesta de Implementación - Sistema Login Passwordless con InputOtp

## 🎯 Componente HeroUI InputOtp Nativo

HeroUI incluye un componente `InputOtp` específicamente diseñado para códigos de verificación:

### Características del Componente
- ✅ Soporte para diferentes longitudes (4, 6, 8 dígitos)
- ✅ Auto-focus y auto-advance entre campos
- ✅ Validación nativa de entrada numérica
- ✅ Soporte para modo password (ocultar dígitos)
- ✅ Callback `onComplete` cuando se completan todos los dígitos
- ✅ Estilos y animaciones integradas con HeroUI

---

## 📱 Implementación con Componente Nativo

### FASE 1: Página de Login

```tsx
// app/(auth)/login/page.tsx
import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Input,
  Button,
  Divider,
  Checkbox
} from '@heroui/react';
import { gradients } from '@/hero';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleRequestOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        // Guardar email en sessionStorage para la siguiente página
        sessionStorage.setItem('login_email', email);
        sessionStorage.setItem('remember_me', rememberMe.toString());
        window.location.href = '/verify';
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col gap-3 pb-6" 
                    style={{ background: gradients.primary }}>
          <h1 className="text-2xl font-bold text-white">ESP32 Alarm System</h1>
          <p className="text-white/90">Acceso Seguro sin Contraseña</p>
        </CardHeader>
        
        <CardBody className="gap-4 p-6">
          <Input
            type="email"
            label="Correo Electrónico"
            placeholder="usuario@ejemplo.com"
            value={email}
            onValueChange={setEmail}
            variant="bordered"
            color="primary"
            size="lg"
            isRequired
            className="mb-2"
          />
          
          <Checkbox 
            isSelected={rememberMe}
            onValueChange={setRememberMe}
            color="primary"
            size="sm"
          >
            Mantenerme conectado por 90 días
          </Checkbox>
          
          <Divider className="my-2" />
          
          <Button
            color="primary"
            size="lg"
            onPress={handleRequestOTP}
            isLoading={loading}
            className="font-semibold"
            style={{ background: loading ? undefined : gradients.primary }}
          >
            Enviar Código de Verificación
          </Button>
          
          <p className="text-small text-center text-default-500">
            Recibirás un código de 6 dígitos en tu correo electrónico
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
```

### FASE 2: Página de Verificación OTP con InputOtp

```tsx
// app/(auth)/verify/page.tsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  InputOtp,
  Progress,
  Link,
  Chip,
  Form
} from '@heroui/react';
import { gradients } from '@/hero';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const [canResend, setCanResend] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  useEffect(() => {
    // Recuperar email de sessionStorage
    const storedEmail = sessionStorage.getItem('login_email');
    const storedRememberMe = sessionStorage.getItem('remember_me') === 'true';
    
    if (!storedEmail) {
      window.location.href = '/login';
      return;
    }
    
    setEmail(storedEmail);
    setRememberMe(storedRememberMe);
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          otp: otpValue,
          rememberMe,
          deviceFingerprint: navigator.userAgent // Simple fingerprint
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Guardar tokens en localStorage/cookies según la respuesta
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redireccionar al dashboard
        window.location.href = '/dashboard';
      } else {
        // Manejar error
        if (data.attemptsRemaining !== undefined) {
          setAttemptsLeft(data.attemptsRemaining);
        }
        setOtp(''); // Limpiar el OTP
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setTimeLeft(600); // Reiniciar timer
        setCanResend(false);
        setOtp('');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col gap-3 pb-6" 
                    style={{ background: gradients.secondary }}>
          <h1 className="text-2xl font-bold text-white">Verificación de Acceso</h1>
          <p className="text-white/90">Código enviado a:</p>
          <Chip color="primary" variant="flat" className="bg-white/20 text-white">
            {email}
          </Chip>
        </CardHeader>
        
        <CardBody className="gap-6 p-6">
          <div className="text-center mb-4">
            <p className="text-small text-default-600 mb-4">
              Ingresa el código de 6 dígitos enviado a tu correo
            </p>
            
            {/* Componente InputOtp Nativo de HeroUI */}
            <Form onSubmit={(e) => {
              e.preventDefault();
              if (otp.length === 6) {
                handleVerifyOTP(otp);
              }
            }}>
              <InputOtp
                length={6}
                value={otp}
                onValueChange={setOtp}
                onComplete={handleVerifyOTP}
                variant="bordered"
                color="primary"
                size="lg"
                isDisabled={loading}
                isInvalid={attemptsLeft < 3}
                errorMessage={attemptsLeft < 3 ? `Solo ${attemptsLeft} intentos restantes` : ''}
                description={timeLeft > 0 ? `Expira en ${formatTime(timeLeft)}` : 'Código expirado'}
                classNames={{
                  segment: "w-12 h-14 text-xl font-bold",
                  wrapper: "gap-2"
                }}
                autoFocus
              />
            </Form>
          </div>

          {/* Progress bar para tiempo restante */}
          <div className="space-y-2">
            <Progress 
              value={(timeLeft / 600) * 100}
              color={timeLeft < 60 ? "danger" : "primary"}
              size="sm"
              className="mb-2"
            />
            
            <div className="flex justify-between items-center text-small">
              <span className="text-default-500">
                Tiempo restante: {formatTime(timeLeft)}
              </span>
              <span className={`${attemptsLeft < 3 ? 'text-danger' : 'text-default-500'}`}>
                Intentos: {attemptsLeft}/5
              </span>
            </div>
          </div>

          <Button
            color="primary"
            size="lg"
            onPress={() => handleVerifyOTP(otp)}
            isLoading={loading}
            isDisabled={otp.length !== 6}
            className="font-semibold"
            style={{ background: loading ? undefined : gradients.primary }}
          >
            Verificar Código
          </Button>

          <div className="text-center">
            {canResend ? (
              <Button
                variant="light"
                color="primary"
                onPress={handleResendOTP}
                isLoading={loading}
                size="sm"
              >
                Reenviar código
              </Button>
            ) : (
              <p className="text-small text-default-400">
                ¿No recibiste el código? Podrás reenviarlo en {formatTime(timeLeft)}
              </p>
            )}
          </div>

          <Divider className="my-2" />
          
          <Link href="/login" color="primary" size="sm" className="text-center">
            ← Volver al inicio de sesión
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
```

### FASE 3: Dashboard con Sesión Persistente

```tsx
// app/(dashboard)/dashboard/page.tsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import { gradients } from '@/hero';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar autenticación
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/login';
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Setup auto-refresh de token
    setupTokenRefresh();
    
    // Setup sincronización entre tabs
    setupTabSync();
  }, []);

  const setupTokenRefresh = () => {
    // Verificar cada minuto si el token necesita renovación
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!response.ok) {
          // Token expirado, redirigir a login
          handleLogout();
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  };

  const setupTabSync = () => {
    // Sincronización entre pestañas usando BroadcastChannel
    const authChannel = new BroadcastChannel('auth_sync');
    
    authChannel.onmessage = (event) => {
      if (event.data.type === 'LOGOUT') {
        localStorage.clear();
        window.location.href = '/login';
      }
      if (event.data.type === 'TOKEN_REFRESH') {
        // Actualizar token local
        localStorage.setItem('user', JSON.stringify(event.data.user));
      }
    };
    
    return () => authChannel.close();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      // Notificar a otras pestañas
      const authChannel = new BroadcastChannel('auth_sync');
      authChannel.postMessage({ type: 'LOGOUT' });
      
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar isBordered className="shadow-md" style={{ background: gradients.header }}>
        <NavbarBrand>
          <p className="font-bold text-white">ESP32 Dashboard</p>
        </NavbarBrand>
        
        <NavbarContent justify="end">
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={user.name}
                  size="sm"
                  src=""
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-small text-default-500">{user.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">Configuración</DropdownItem>
                <DropdownItem key="help">Ayuda</DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                  Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Bienvenido, {user.name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Dispositivos Activos</h3>
              <p className="text-3xl font-bold text-primary">12</p>
            </CardBody>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Alarmas Hoy</h3>
              <p className="text-3xl font-bold text-warning">3</p>
            </CardBody>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Estado del Sistema</h3>
              <p className="text-3xl font-bold text-success">OK</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔄 Sistema de Sesiones Persistentes

### 1. Cookie Manager
```typescript
// lib/auth/cookie-manager.ts
export class CookieManager {
  static setTokens(tokens: AuthTokens, rememberMe: boolean) {
    // Access token en sessionStorage (corta duración)
    sessionStorage.setItem('access_token', tokens.accessToken);
    
    // Refresh token en cookie httpOnly (larga duración)
    const maxAge = rememberMe ? 90 * 24 * 60 * 60 : 30 * 24 * 60 * 60;
    
    // Este cookie se maneja desde el backend por seguridad
    // El servidor enviará Set-Cookie con httpOnly flag
  }
  
  static clearTokens() {
    sessionStorage.removeItem('access_token');
    localStorage.removeItem('user');
    // Cookie httpOnly se limpia desde el servidor
  }
}
```

### 2. Auto-Refresh Hook
```typescript
// lib/hooks/useAutoRefresh.ts
import { useEffect, useRef } from 'react';

export function useAutoRefresh() {
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = sessionStorage.getItem('access_token');
      if (!token) return;
      
      // Decodificar JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();
      
      // Renovar 1 minuto antes de expirar
      if (expiresIn < 60000) {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('access_token', data.accessToken);
            
            // Notificar a otras pestañas
            const channel = new BroadcastChannel('auth_sync');
            channel.postMessage({ 
              type: 'TOKEN_REFRESH',
              token: data.accessToken 
            });
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
      
      // Programar siguiente verificación
      refreshTimeoutRef.current = setTimeout(checkAndRefreshToken, 30000);
    };
    
    checkAndRefreshToken();
    
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);
}
```

---

## 📊 Ventajas de la Implementación

### Componente InputOtp Nativo
- ✨ **UX Optimizada**: Auto-focus, auto-advance, validación nativa
- 🎨 **Integración Perfecta**: Estilos consistentes con HeroUI
- ⚡ **Alto Rendimiento**: Sin librerías adicionales
- 📱 **Responsive**: Adaptable a móviles y tablets

### Sesiones Persistentes
- 🔐 **Seguridad Máxima**: Cookies httpOnly para refresh tokens
- 🔄 **Sin Interrupciones**: Renovación automática transparente
- 📱 **Multi-Tab Sync**: Sesión sincronizada entre pestañas
- ⏰ **Flexible**: 30-90 días según preferencia del usuario

### Experiencia de Usuario
- 🚀 **Login Rápido**: Sin contraseñas que recordar
- 📧 **Simple**: Solo email y código de 6 dígitos
- 🎯 **Intuitivo**: Flujo claro y feedback visual
- 🔒 **Confiable**: Indicadores de seguridad visibles

---

## 🚀 Próximos Pasos

1. **Instalar dependencias necesarias**
2. **Crear estructura de carpetas**
3. **Implementar páginas y componentes**
4. **Configurar middleware de autenticación**
5. **Probar flujo completo**
6. **Ajustar estilos y animaciones**