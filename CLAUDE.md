# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ANIMA-MCP Integration
This project is integrated with ANIMA-MCP for context management and knowledge sharing.
- **Project ID**: esp32-alarm-dashboard
- **Project Name**: ESP32 Alarm Dashboard
- **Categories**: iot, backend-api, web-frontend
- **Created**: 2025-08-30

## Important Notes for Claude

### ⚠️ CRITICAL PORT MANAGEMENT RULES ⚠️
**ALWAYS USE PORT 3000 - NEVER CHANGE PORTS**
- ✅ The application MUST ALWAYS run on port 3000
- ❌ NEVER allow Next.js to auto-select a different port (3001, 3006, 3007, etc.)
- ⛔ If port 3000 is occupied and cannot be closed, STOP immediately and inform the user
- 🚫 DO NOT proceed with a different port under any circumstances

### Process Management on Windows
When working with ports and processes on Windows:

**IMPORTANT: Always use esg-shell for port management:**
- Use `mcp__esg-shell__execute_powershell` for finding and killing processes
- To find processes using a port: `netstat -ano | Select-String ":[PORT]"`
- To kill a process: `taskkill /F /PID [PID]`

**For other commands use bash:**
- Use `bash` for npm commands, file operations, and general development tasks
- Example: `npm run dev`, `npm install`, etc.

**Port configuration:**
- Port 3000: Next.js development server (MANDATORY - DO NOT CHANGE)
- Port 8888: WebSocket monitor server

**Server restart procedure:**
1. Find process using port 3000: `mcp__esg-shell__execute_powershell` with `netstat -ano | Select-String ":3000"`
2. Kill the process: `mcp__esg-shell__execute_powershell` with `taskkill /F /PID [PID]`
3. If step 2 fails, STOP and inform the user - DO NOT use a different port
4. Restart server: Use `bash` with `npm run dev`
5. Verify server is running on port 3000

## MUI Material v6 Documentation

### Version Information
- **Framework UI**: MUI Material v6 (SIEMPRE usar v6 en Context7)
- **Versión**: @mui/material@^6.2.0
- **Tema**: Dark mode por defecto
- **Framework**: Next.js App Router compatible

### DOCUMENTACIÓN OBLIGATORIA
**SIEMPRE usar Context7 para obtener documentación de MUI v6:**
- Library ID: `/mui/material-ui` 
- **IMPORTANTE**: Especificar siempre versión v6 en las consultas
- Ejemplo: `mcp__context7__get-library-docs` con parameters:
  - `context7CompatibleLibraryID`: `/mui/material-ui`
  - `topic`: "TextField Button Card Grid DataGrid v6"
- Guardar documentación en `docs/MuiMaterial/[ComponentName].md`
- Crear archivo de lecciones en `docs/MuiMaterial/[ComponentName]-lessons.md`

### Configuration Files
- **lib/theme/muiTheme.ts**: Tema personalizado con dark mode
- **app/providers.tsx**: ThemeProvider de MUI
- **app/globals.css**: Estilos globales CSS
- **app/layout.tsx**: Importa providers y estilos globales

### Theme Configuration
```typescript
// Tema oscuro por defecto
palette: {
  mode: 'dark',
  primary: { main: '#0066cc' },
  secondary: { main: '#6366f1' },
  success: { main: '#10b981' },
  warning: { main: '#f59e0b' },
  error: { main: '#ef4444' }
}
```

### Important Guidelines
- **Grid Component**: ANTES de usar Grid, obtener documentación actualizada con Context7 (Grid v2 cambios en v6)
- **Datos Reales**: SIEMPRE usar endpoints existentes en `/app/api`, NO usar datos mock
- **Servicios**: Revisar `/lib` para servicios ya implementados antes de crear nuevos

## Project Overview

This is an ESP32 Alarm System Dashboard - a Next.js backend server that interfaces with ESP32 alarm devices via MQTT protocol using Protocol Buffers for message serialization. The project is currently in the documentation and planning phase.

## System Architecture

```
ESP32 Devices <--MQTT/TLS--> MQTT Broker <--MQTT/TLS--> Next.js Server <--HTTP/API--> Client Apps
                                   |                          |
                              esag-tech.com              PostgreSQL + TimescaleDB
                                                          (Phase 2)
```

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **MQTT Client**: mqtt.js
- **Protocol**: Protocol Buffers (protobufjs)
- **Database**: PostgreSQL with TimescaleDB extension (Phase 2)
- **ORM**: Prisma
- **Deployment**: Node.js environment with TLS support

## Development Setup Commands

Since this project is in planning phase, use these commands when implementation begins:

```bash
# Project setup
npx create-next-app@latest alarm-server --typescript --app
cd alarm-server

# Install core dependencies
npm install mqtt protobufjs uuid dotenv @prisma/client
npm install --save-dev @types/node prisma

# Database setup (Phase 2)
npx prisma init
npx prisma migrate dev
```

## MQTT Configuration

- **Broker**: esag-tech.com
- **Port**: 8883 (TLS)
- **Protocol**: mqtts
- **Username**: esagtech_mqtt
- **Password**: lwcwDEBVZxD6VFU
- **Base Topic**: esg/alarm

## Key Message Topics

### Incoming (Device → Server)
- `+/pb/d/+/hb` - Heartbeat messages
- `+/pb/d/+/login` - Initial connection status (first status message after connecting)
- `+/pb/d/+/status` - Regular status updates (subsequent status messages)
- `+/pb/d/+/alarm` - Alarm events
- `+/pb/d/+/resp` - Command responses
- `+/pb/d/+/lw` - Last Will message (sent by broker when device disconnects unexpectedly)

### Outgoing (Server → Device)
- `{base_topic}/pb/d/{hostname}/cmd` - Commands to devices

## Protocol Buffer Messages

The system uses protobuf for efficient binary communication. Key message types:

- **Heartbeat**: Device health including temperature, humidity, I/O states, fan PWM
- **StatusMessage**: Comprehensive device status with counters and network info
  - Sent as `login` topic on initial connection (first message after connecting)
  - Sent as `status` topic for subsequent regular updates
- **AlarmEvent**: Alarm triggers (PANIC1, PANIC2, TAMPER) and output state changes
- **Command**: Device control including system, config, output, diagnostic, and OTA commands
- **LastWillMessage**: Device disconnection notification
  - Sent automatically by MQTT broker when device disconnects unexpectedly
  - Contains device state at time of connection (not disconnection)
  - Includes sequence, timestamp, device ID, uptime, firmware, IP, RSSI, and hostname

### HMAC Wrapper and Endianness

**IMPORTANT**: All MQTT messages from ESP32 devices are wrapped with HMAC authentication. The system uses different endianness for different protocol layers:

#### Message Structure
```
[Length:2 BE][Sequence:4 BE][Protobuf Payload:N LE][HMAC:8]
```

#### Endianness Specification

| Component | Endianness | Reason |
|-----------|------------|--------|
| **HMAC Wrapper - Length (2 bytes)** | Big-Endian (Network Byte Order) | Standard network protocol convention |
| **HMAC Wrapper - Sequence (4 bytes)** | Big-Endian (Network Byte Order) | Standard network protocol convention |
| **Protobuf Payload** | Little-Endian | Protocol Buffers specification |
| **HMAC (8 bytes)** | N/A | Raw hash bytes, no byte order |

#### Key Implementation Details

1. **HMAC Calculation**: Uses SHA-256 with the **LAST 8 bytes** of the hash (ESP32 convention)
2. **HMAC Key**: 32-byte hex key configured in `lib/protobuf/hmac-wrapper.ts`
3. **Layer Separation**: The HMAC wrapper (transport/authentication layer) and Protobuf payload (application layer) maintain independent endianness conventions
4. **Decoding Process**:
   - First unwrap HMAC using big-endian for length/sequence
   - Then decode Protobuf payload using little-endian as per protobuf spec
5. **IP Address Handling**: IP addresses in protobuf are uint32 values. When converting to string format, ensure correct byte order interpretation based on how ESP32 encodes them

#### Why Different Endianness?

- **Network Convention**: HMAC wrapper uses big-endian (network byte order) following standard network protocol practices (TCP/IP, TLS, etc.)
- **Protobuf Standard**: Protocol Buffers always use little-endian by specification
- **Interoperability**: Using network byte order for the wrapper ensures compatibility with standard network tools and libraries (ntohs, ntohl)
- **Layer Independence**: Each protocol layer maintains its own conventions without affecting the other

## Database Architecture (Phase 2)

Uses PostgreSQL with TimescaleDB for time-series optimization:

- **devices**: Device registry and configuration
- **device_status**: Current state with fast access patterns
- **heartbeats**: Historical data with Change Data Capture (CDC) for 90-95% storage reduction
- **alarm_events**: Security event logging
- **command_queue**: Command tracking and responses

## Database Schema (PostgreSQL)

### Tables Overview

#### device_status
- **id**: bigserial, primary key
- **created_at**: timestamptz, not null, default: now()
- **updated_at**: timestamptz, not null, default: now()
- **hostname**: text, not null, unique
- **location**: text
- **last_seen**: timestamptz
- **rssi**: numeric(4,0)
- **temperature**: numeric(5,2)
- **humidity**: numeric(5,2)
- **tamper**: boolean, default: false
- **panic1**: boolean, default: false
- **panic2**: boolean, default: false
- **input_states**: jsonb
- **output_states**: jsonb
- **box_sw**: boolean, default: false
- **ip_address**: inet
- **total_messages**: numeric(10,0), default: 0
- **total_alarms**: numeric(10,0), default: 0
- **total_errors**: numeric(10,0), default: 0
- **firmware_version**: text
- **uptime_seconds**: numeric(10,0)
- **status**: text, not null, default: 'offline'
- **group_id**: text
- **system_voltage**: numeric(5,2)
- **alarm_active**: boolean, default: false
- **siren_state**: boolean, default: false
- **relay1_state**: boolean, default: false
- **relay2_state**: boolean, default: false
- **turret_state**: boolean, default: false
- **ac_power**: boolean, default: true
- **battery_voltage**: numeric(5,2)
- **free_heap**: numeric(10,0)
- **wifi_channel**: numeric(3,0)
- **sequence_number**: numeric(10,0)
- **last_alarm_time**: timestamptz
- **last_alarm_type**: text
- **last_heartbeat**: timestamptz
- **config**: jsonb

### Prisma Models

When using Prisma ORM, the models automatically map snake_case database fields to camelCase JavaScript/TypeScript properties:

```typescript
// Database field: last_seen
// Prisma access: deviceStatus.lastSeen

// Database field: box_sw
// Prisma access: deviceStatus.boxSw

// Database field: ip_address
// Prisma access: deviceStatus.ipAddress
```

## Project Structure

```
nextjs-alarm-server/
├── app/
│   ├── api/
│   │   ├── devices/
│   │   │   ├── route.ts
│   │   │   └── [deviceId]/
│   │   │       ├── config/route.ts
│   │   │       ├── output/route.ts
│   │   │       ├── system/route.ts
│   │   │       ├── diagnostic/route.ts
│   │   │       └── ota/route.ts
│   └── statistics/route.ts
├── lib/
│   ├── mqtt/
│   │   ├── client.ts
│   │   ├── handlers.ts
│   │   └── topics.ts
│   ├── protobuf/
│   │   ├── schemas/
│   │   └── decoder.ts
│   └── devices/
│       ├── manager.ts
│       └── store.ts
└── types/
```

## API Endpoints

### Device Management
- `GET /api/devices` - List all devices
- `GET /api/devices/{deviceId}` - Get device status
- `GET /api/devices/{deviceId}/history` - Get device history

### Device Control
- `POST /api/devices/{deviceId}/config` - Update configuration
- `POST /api/devices/{deviceId}/output` - Control outputs (siren, turret, relays)
- `POST /api/devices/{deviceId}/system` - System commands (reboot, reset)
- `POST /api/devices/{deviceId}/diagnostic` - Run diagnostics
- `POST /api/devices/{deviceId}/ota` - Firmware updates

## Security Features

- TLS/SSL for all MQTT connections
- HMAC-SHA256 message authentication
- Anti-replay protection with sequence numbers
- Configurable authentication levels

## Performance Requirements

- Support 100+ concurrent device connections
- Handle 10 messages/second per device
- API response time < 500ms
- Automatic MQTT reconnection with exponential backoff

## Implementation Phases

1. **Phase 1** (Current): MQTT client with protobuf handling and REST API
2. **Phase 2**: PostgreSQL/TimescaleDB integration with CDC
3. **Phase 3**: Web dashboard with real-time monitoring

## Troubleshooting

### Common Decoding Issues

1. **HMAC Validation Failures**
   - Verify HMAC key matches ESP32 configuration
   - Check that you're using the LAST 8 bytes of SHA-256 hash
   - Ensure sequence numbers are in sync

2. **Protobuf Decoding Errors**
   - Remember protobuf payload uses little-endian encoding
   - HMAC wrapper header uses big-endian (network byte order)
   - Check message type matches the decoder being used

3. **IP Address Display Issues**
   - IP addresses are stored as uint32 in protobuf
   - Verify byte order when converting to dotted decimal notation
   - Current implementation assumes network byte order for IP

4. **Message Structure Verification**
   - Use `protobufDecoder.getRawFields()` to debug protobuf structure
   - Check HMAC wrapper with first bytes: length (2 BE), sequence (4 BE)
   - Verify total message size matches: 2 + 4 + payload_length + 8
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.