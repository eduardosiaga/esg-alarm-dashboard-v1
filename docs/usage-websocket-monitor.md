# WebSocket Monitor - Guía de Uso Completa

## 📡 Descripción General

El WebSocket Monitor es una herramienta de debugging en tiempo real que permite monitorear todos los mensajes MQTT que fluyen entre los dispositivos ESP32 y el servidor. Proporciona una interfaz interactiva mediante comandos AT para controlar qué información se muestra y cómo se presenta.

### Características Principales
- 🔍 Monitoreo en tiempo real de mensajes MQTT
- 🎛️ Filtrado avanzado por tipo de mensaje, hostname y dirección
- 📊 Decodificación automática de Protocol Buffers
- 🔐 Validación HMAC de mensajes
- 📝 Logging de eventos de procesamiento de login
- 💾 Buffer de mensajes históricos
- 🎯 Comandos AT case-insensitive

## 🚀 Inicio Rápido

### 1. Iniciar el Servidor Principal

Primero, asegúrate de que el servidor MQTT esté corriendo:

```bash
npm run server
# O directamente:
npx tsx server.ts
```

Este comando inicia:
- 🔌 Cliente MQTT conectado a esag-tech.com:8883 (TLS)
- 🌐 WebSocket Monitor en puerto 8888
- 📨 Suscripciones a todos los topics de dispositivos

### 2. Conectar el Cliente Monitor

En otra terminal, tienes varias opciones:

#### Opción A: Cliente Automático (solo observación)
```bash
node test-ws-monitor.js
```
Este cliente se configura automáticamente y muestra todos los mensajes, pero no permite enviar comandos.

#### Opción B: Cliente Interactivo (recomendado)
```bash
node interactive-ws-monitor.js
```
Este cliente permite enviar comandos AT interactivamente. Después de la autenticación, aparecerá un prompt `AT>` donde puedes escribir comandos.

**⚠️ IMPORTANTE**: El cliente interactivo DEBE ejecutarse en tu propia terminal (PowerShell/CMD), NO desde Claude Code, para poder escribir comandos.

#### Opción C: Cliente WebSocket personalizado
Conecta cualquier cliente WebSocket a:
```
ws://localhost:8888
```

### 3. Autenticación

Una vez conectado, debes autenticarte usando:

```
AT+AUTH=admin,admin123
```

### 4. Configuración Inicial Recomendada

```bash
# Configuración silenciosa por defecto
AT+SETMSG=none    # No mostrar mensajes por defecto

# Luego activar solo lo que necesitas
AT+SETMSG=login,alarm,lw    # Solo eventos importantes
# O
AT+SETMSG=all     # Ver todo
```

## 📋 Comandos AT Disponibles

### 🔧 Comandos Básicos

| Comando | Descripción | Ejemplo | Notas |
|---------|-------------|---------|-------|
| `AT` | Test de conexión | `AT` | Retorna "OK" |
| `AT+AUTH=username,password` | Autenticación | `AT+AUTH=admin,admin123` | Requerido para acceder |
| `AT+HELP` | Mostrar ayuda completa | `AT+HELP` | Lista todos los comandos organizados |

### 📊 Control de Visualización

| Comando | Descripción | Opciones | Default |
|---------|-------------|----------|---------|
| `AT+MODE[=modo]` | Modo de visualización | `raw`, `decoded`, `both` | `decoded` |
| `AT+VERBOSE[=nivel]` | Nivel de detalle | `minimal`, `normal`, `verbose` | `normal` |
| `AT+HMAC[=estado]` | Mostrar detalles HMAC | `ON/OFF`, `1/0` | `OFF` |
| `AT+ERRORS[=estado]` | Mostrar errores | `ON/OFF`, `1/0` | `ON` |
| `AT+LOGINLOG[=estado]` | Logs de procesamiento /login | `ON/OFF`, `1/0` | `OFF` |

**Nota**: Los comandos sin parámetros muestran el valor actual.

#### Ejemplos:
```bash
AT+MODE                # Muestra modo actual
AT+MODE=both          # Muestra datos raw y decodificados
AT+VERBOSE            # Muestra nivel actual
AT+VERBOSE=verbose    # Máximo detalle
AT+HMAC=ON           # Activa información HMAC
AT+ERRORS=1          # Muestra errores de procesamiento
AT+LOGINLOG=ON       # Activa logs de login
```

### 🔍 Filtros de Mensajes

| Comando | Descripción | Ejemplo | Notas |
|---------|-------------|---------|-------|
| `AT+SETMSG[=tipos]` | Filtrar por tipo de mensaje | `AT+SETMSG=hb,alarm` | Por defecto: `none` |
| `AT+SETMSG=all` | Mostrar todos los tipos | `AT+SETMSG=all` | |
| `AT+SETMSG=none` | No mostrar mensajes | `AT+SETMSG=none` | |
| `AT+FILTER[=hostnames]` | Filtrar por hostname | `AT+FILTER=ESG_ALARM_0483080CEDD8` | Case-sensitive |
| `AT+DIRECTION[=dir]` | Filtrar dirección | `in`, `out`, `both` | Default: `both` |

#### Tipos de mensaje válidos para AT+SETMSG:
- `hb` - Heartbeat messages (cada 30 segundos)
- `login` - Login/initial connection messages
- `status` - Status update messages
- `alarm` - Alarm event messages
- `resp` - Command response messages
- `lw` - Last Will messages (desconexión)
- `cmd` - Commands sent to devices

#### Ejemplos de filtrado:
```bash
# Configuración inicial silenciosa
AT+SETMSG=none                                    # No mostrar nada

# Solo eventos importantes
AT+SETMSG=login,alarm,lw                         # Login, alarmas y desconexiones

# Monitoreo de heartbeats
AT+SETMSG=hb                                     # Solo heartbeats

# Filtrar por dispositivo específico
AT+FILTER=ESG_ALARM_0483080CEDD8                 # Un dispositivo
AT+FILTER=ESG_ALARM_0483080CEDD8,ESG_ALARM_123456  # Múltiples dispositivos
AT+FILTER=                                       # Limpiar filtro

# Dirección del tráfico
AT+DIRECTION=in                                  # Solo mensajes entrantes
AT+DIRECTION=out                                 # Solo mensajes salientes
AT+DIRECTION=both                                # Ambas direcciones
```

### 📈 Estado e Información

| Comando | Descripción | Ejemplo | Retorna |
|---------|-------------|---------|---------|
| `AT+STATUS` | Estado actual del monitor | `AT+STATUS` | Configuración y estadísticas |
| `AT+DEVICES` | Listar dispositivos | `AT+DEVICES` | Lista de dispositivos conectados |
| `AT+BUFFER=n` | Ver últimos n mensajes | `AT+BUFFER=10` | Mensajes del buffer |
| `AT+CLEAR` | Limpiar buffer | `AT+CLEAR` | Confirma limpieza |

## 📊 Interpretación de la Salida

### Estructura de un Mensaje MQTT

Cuando llega un mensaje (y pasa los filtros), verás algo como:

```json
{
  "type": "mqtt_message",
  "timestamp": "2025-08-30T15:28:39.039Z",
  "direction": "in",
  "topic": "esagtech/pb/d/ESG_ALARM_0483080CEDD8/hb",
  "hostname": "ESG_ALARM_0483080CEDD8",
  "messageType": "hb",
  "decoded": {
    "timestamp": 1756567717,
    "temperature": 0,
    "humidity": 0,
    "panic1": false,
    "panic2": false,
    "siren": false,
    "turret": false,
    "boxSw": false,
    "uptime": 3369,
    "firmware": "2.0.0",
    "fanPwmDuty": 0
  }
}
```

### Con modo verbose y HMAC activado:

```json
{
  "type": "mqtt_message",
  "timestamp": "2025-08-30T15:28:39.039Z",
  "direction": "in",
  "topic": "esagtech/pb/d/ESG_ALARM_0483080CEDD8/hb",
  "hostname": "ESG_ALARM_0483080CEDD8",
  "messageType": "hb",
  "raw": "001800000022...",
  "size": 38,
  "hmacInfo": {
    "wrapped": true,
    "sequence": 34,
    "valid": true,
    "hmac": "95941d91405f4c73"
  },
  "decoded": {
    // ... datos decodificados
  }
}
```

### Eventos de Procesamiento de Login (AT+LOGINLOG=ON)

Cuando está activado, verás eventos detallados del procesamiento de login:

```json
{
  "type": "login_processing",
  "event": "LOGIN_START",
  "data": {
    "topic": "esagtech/pb/d/ESG_ALARM_0483080CEDD8/login",
    "size": 150
  }
}

{
  "type": "login_processing",
  "event": "DEVICE_INFO",
  "data": {
    "macAddress": "04:83:08:0C:ED:D8",
    "hostname": "ESG_ALARM_0483080CEDD8",
    "deviceDbId": 0,
    "firmware": "2.0.0"
  }
}

{
  "type": "login_processing",
  "event": "NEW_DEVICE",
  "data": {
    "macAddress": "04:83:08:0C:ED:D8",
    "hostname": "ESG_ALARM_0483080CEDD8"
  }
}

{
  "type": "login_processing",
  "event": "SYNC_COMMAND_SENT",
  "data": {
    "hostname": "ESG_ALARM_0483080CEDD8",
    "dbId": 1,
    "requestId": "uuid-here",
    "topic": "esagtech/pb/d/ESG_ALARM_0483080CEDD8/cmd"
  }
}

{
  "type": "login_processing",
  "event": "LOGIN_COMPLETE",
  "data": {
    "hostname": "ESG_ALARM_0483080CEDD8",
    "isNew": true,
    "needsSync": true
  }
}
```

### Tipos de Eventos de Login:
- `LOGIN_START` - Inicio del procesamiento
- `DEVICE_INFO` - Información del dispositivo extraída
- `DEVICE_FOUND` - Dispositivo existente encontrado en BD
- `NEW_DEVICE` - Nuevo dispositivo detectado
- `DEVICE_CREATED` - Dispositivo creado en BD
- `SYNC_NEEDED` - Requiere sincronización de device_db_id
- `SYNC_COMMAND_GENERATED` - Comando de sincronización generado
- `SYNC_COMMAND_SENT` - Comando enviado al dispositivo
- `DEVICE_SYNCED` - Dispositivo ya sincronizado
- `LOGIN_COMPLETE` - Procesamiento completado
- `LOGIN_ERROR` - Error durante el procesamiento

## 🔍 Casos de Uso Comunes

### 1. Monitoreo Inicial Silencioso

```bash
# Conectar sin ruido
AT+AUTH=admin,admin123
AT+SETMSG=none              # Sin mensajes por defecto
AT+STATUS                   # Ver estado
AT+DEVICES                  # Ver dispositivos

# Activar solo lo necesario
AT+SETMSG=alarm,lw          # Solo alarmas y desconexiones
```

### 2. Debugging de Dispositivo Específico

```bash
AT+AUTH=admin,admin123
AT+SETMSG=all                           # Ver todo
AT+FILTER=ESG_ALARM_0483080CEDD8       # Solo este dispositivo
AT+MODE=both                            # Raw y decodificado
AT+HMAC=ON                              # Ver validación HMAC
AT+ERRORS=ON                            # Ver errores
AT+VERBOSE=verbose                      # Máximo detalle
```

### 3. Monitoreo de Login y Sincronización

```bash
AT+AUTH=admin,admin123
AT+SETMSG=login,resp                   # Login y respuestas
AT+LOGINLOG=ON                         # Activar logs de procesamiento
AT+MODE=decoded                        # Solo decodificado
```

### 4. Análisis de Heartbeats

```bash
AT+AUTH=admin,admin123
AT+SETMSG=hb                          # Solo heartbeats
AT+MODE=decoded                       # Solo decodificado
AT+VERBOSE=minimal                    # Mínimo detalle
# Los heartbeats llegan cada 30 segundos
```

### 5. Verificación de Alarmas

```bash
AT+AUTH=admin,admin123
AT+SETMSG=alarm                       # Solo alarmas
AT+MODE=decoded                       # Decodificado
AT+VERBOSE=normal                     # Detalle normal
# Esperar eventos de alarma
```

### 6. Análisis de Tráfico Completo

```bash
AT+AUTH=admin,admin123
AT+SETMSG=all                        # Todo
AT+DIRECTION=both                    # Entrada y salida
AT+FILTER=                           # Sin filtros
AT+MODE=decoded                      # Solo decodificado
AT+VERBOSE=minimal                   # Solo esencial
```

## 🛠️ Configuración Avanzada

### Configuración por Defecto (en el código)

Si necesitas cambiar la configuración por defecto, edita `lib/websocket/monitor-server.ts`:

```typescript
const session: MonitorSession = {
  ws,
  authenticated: false,
  username: '',
  settings: {
    mode: 'decoded',           // Modo por defecto
    showHMAC: false,           // HMAC desactivado
    showErrors: true,          // Errores activados
    filterHostnames: [],       // Sin filtros
    showIncoming: true,        // Mostrar entrantes
    showOutgoing: true,        // Mostrar salientes
    verbosity: 'normal',       // Nivel de verbosidad
    showLoginProcessing: false, // Logs de login desactivados
    messageFilter: 'none',     // NO mostrar mensajes por defecto
  },
};
```

### Crear Cliente Personalizado

```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    // Autenticación
    ws.send('AT+AUTH=admin,admin123');
    
    // Configuración personalizada
    setTimeout(() => {
        ws.send('AT+SETMSG=alarm,lw');  // Solo alarmas y desconexiones
        ws.send('AT+MODE=decoded');
        ws.send('AT+VERBOSE=minimal');
        ws.send('AT+LOGINLOG=ON');      // Logs de login
    }, 100);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    switch(msg.type) {
        case 'mqtt_message':
            console.log(`[${msg.messageType}] Device: ${msg.hostname}`);
            if (msg.messageType === 'alarm' && msg.decoded) {
                console.log('⚠️ ALARMA:', msg.decoded.type, msg.decoded.state);
            }
            break;
            
        case 'login_processing':
            console.log(`[LOGIN] ${msg.event}:`, msg.data);
            break;
            
        case 'response':
            console.log('Response:', msg.message);
            break;
            
        case 'error':
            console.error('Error:', msg.message);
            break;
    }
});
```

## 📈 Métricas y Estadísticas

El comando `AT+STATUS` proporciona información completa:

```json
{
  "type": "status",
  "settings": {
    "mode": "decoded",
    "showHMAC": false,
    "showErrors": true,
    "filterHostnames": [],
    "showIncoming": true,
    "showOutgoing": false,
    "verbosity": "normal",
    "showLoginProcessing": true,
    "messageFilter": ["login", "alarm", "lw"]
  },
  "stats": {
    "totalDevices": 1,
    "onlineDevices": 1,
    "totalMessages": 150,
    "messagesPerMinute": 3
  },
  "bufferSize": 1000
}
```

## 🔐 Seguridad

### Autenticación
- Usuario por defecto: `admin`
- Contraseña por defecto: `admin123`
- Sin token JWT actualmente (puede agregarse)

### Cambiar Credenciales

En `lib/websocket/monitor-server.ts`:

```typescript
private handleAuth(ws: WebSocket, params: string): void {
  const [username, password] = params.split(',');
  
  if (username === 'admin' && password === 'admin123') {
    // Cambiar aquí las credenciales
  }
}
```

## 🐛 Troubleshooting

### Problema: No se conecta al WebSocket

**Solución:**
1. Verificar que el servidor esté corriendo: `npx tsx server.ts`
2. Verificar el puerto con PowerShell:
   ```powershell
   netstat -an | Select-String ":8888"
   ```
3. Si el puerto está ocupado, encontrar el proceso:
   ```powershell
   Get-NetTCPConnection -LocalPort 8888 | Select-Object -Property OwningProcess
   ```

### Problema: No llegan mensajes

**Solución:**
1. Verificar autenticación: `AT+AUTH=admin,admin123`
2. **Verificar filtro de tipos**: `AT+SETMSG` (por defecto es `none`)
3. Activar mensajes: `AT+SETMSG=all` o tipos específicos
4. Verificar filtros: `AT+FILTER=` (limpiar filtros)
5. Verificar dirección: `AT+DIRECTION=both`

### Problema: Mensajes con error de decodificación

**Solución:**
1. Activar modo raw: `AT+MODE=both`
2. Verificar HMAC: `AT+HMAC=ON`
3. Ver errores: `AT+ERRORS=ON`
4. Revisar que el protobuf schema esté actualizado

### Problema: HMAC no valida

**Verificar:**
1. La clave HMAC en `lib/protobuf/hmac-wrapper.ts`
2. El byte order (Big Endian para header, Little Endian para protobuf)
3. Que se usen los últimos 8 bytes del SHA256

### Problema: Comandos no reconocidos

**Verificar:**
1. Los comandos son case-insensitive desde la última actualización
2. Usa `AT+HELP` para ver lista completa
3. Algunos comandos requieren autenticación previa

## 📝 Notas Importantes

### Características del Sistema

1. **Comandos Case-Insensitive**: Todos los comandos AT y sus parámetros aceptan mayúsculas y minúsculas (excepto valores de hostname en AT+FILTER)
2. **Inicio Silencioso**: Por defecto `messageFilter` está en `none` para evitar saturación inicial
3. **Comandos sin Parámetros**: Muestran el valor actual de la configuración
4. **Heartbeats**: Se envían cada 30 segundos automáticamente
5. **HMAC**: Usa SHA256 truncado a los últimos 8 bytes
6. **Byte Order**: 
   - Header HMAC: Big Endian (network byte order)
   - Protobuf payload: Little Endian
7. **Buffer**: Almacena hasta 1000 mensajes en memoria
8. **Reconexión**: El cliente debe reconectarse manualmente si se pierde la conexión

### Tipos de Mensajes MQTT

| Tipo | Topic | Frecuencia | Contenido |
|------|-------|------------|-----------|
| `hb` | `/pb/d/{hostname}/hb` | 30 segundos | Temperatura, humedad, I/O, uptime |
| `login` | `/pb/d/{hostname}/login` | Al conectar | Estado inicial completo |
| `status` | `/pb/d/{hostname}/status` | Por solicitud | Estado completo del dispositivo |
| `alarm` | `/pb/d/{hostname}/alarm` | Al activarse | Tipo, estado, prioridad |
| `resp` | `/pb/d/{hostname}/resp` | Por comando | Confirmación de comando |
| `lw` | `/pb/d/{hostname}/lw` | Al desconectar | Last Will del dispositivo |
| `cmd` | `/pb/d/{hostname}/cmd` | Por solicitud | Comandos al dispositivo |

## 🔗 Referencias

- [Documentación MQTT](./MQTT_PROTOCOL.md)
- [Protobuf Schemas](./protobuf/)
- [Configuración del Dispositivo](./mqtt-device-config.md)
- [Guía de Implementación](./IMPLEMENTATION_GUIDE.md)

---

## Ejemplo de Sesión Completa

```bash
# Terminal 1: Iniciar servidor
$ npx tsx server.ts
[INFO] ESP32 Alarm System Backend is running!
[INFO] MQTT Broker: esag-tech.com:8883
[INFO] WebSocket Monitor: ws://localhost:8888

# Terminal 2: Cliente monitor interactivo
$ node interactive-ws-monitor.js
Connected to monitor server!

AT> AT+AUTH=admin,admin123
Response: Authentication successful!

AT> AT+HELP
[Muestra lista completa de comandos organizados]

AT> AT+SETMSG
Response: Message filter: none

AT> AT+SETMSG=login,alarm,lw
Response: Filtering messages: login, alarm, lw

AT> AT+MODE=decoded
Response: Mode set to: decoded

AT> AT+LOGINLOG=ON
Response: Login processing logs enabled

AT> AT+STATUS
[Muestra configuración actual y estadísticas]

# Esperar mensajes...
# Los eventos filtrados aparecerán automáticamente
```

---

**Última actualización**: Noviembre 2024
**Versión**: 2.0.0
**Autor**: Sistema ESP32 Alarm Dashboard

Este monitor es una herramienta esencial para el desarrollo y debugging del sistema de alarmas ESP32.