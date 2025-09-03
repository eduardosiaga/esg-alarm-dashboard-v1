# Product Requirements Document (PRD)
# ESP32 Alarm System - Next.js Backend Server

## 1. Executive Summary

### 1.1 Purpose
Develop a Next.js backend server that acts as a bridge between ESP32 alarm devices and a web-based management system. The server will handle MQTT communication, decode protobuf messages, store device data, and provide REST API endpoints for device control.

### 1.2 Scope
- **Phase 1 (Current)**: MQTT client implementation with protobuf message handling and basic API endpoints
- **Phase 2 (Future)**: PostgreSQL database integration with TimescaleDB for time-series optimization
- **Phase 3 (Future)**: Dashboard implementation and user interface

### 1.3 Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **MQTT Client**: mqtt.js
- **Protobuf**: protobufjs
- **Database**: PostgreSQL with TimescaleDB (Phase 2)
- **Deployment**: Node.js environment with TLS support

## 2. System Architecture

### 2.1 High-Level Architecture
```
ESP32 Devices <--MQTT/TLS--> MQTT Broker <--MQTT/TLS--> Next.js Server <--HTTP/API--> Client Apps
                                   |                          |
                              esag-tech.com              PostgreSQL + TimescaleDB
                                                          (Phase 2)
```

### 2.2 MQTT Connection Details
```typescript
{
  host: 'esag-tech.com',
  port: 8883,
  protocol: 'mqtts',
  username: 'esagtech_mqtt',
  password: 'lwcwDEBVZxD6VFU',
  rejectUnauthorized: true,
  keepalive: 60,
  clean: true,
  clientId: 'nextjs-server-' + Date.now()
}
```

## 3. Functional Requirements

### 3.1 MQTT Client Features

#### 3.1.1 Connection Management
- Establish secure TLS connection to MQTT broker
- Implement automatic reconnection with exponential backoff
- Maintain connection health monitoring
- Log connection state changes

#### 3.1.2 Topic Subscriptions
The server must subscribe to the following topics:
```
# Wildcard subscription for all devices
+/pb/d/+/hb        # Heartbeat messages
+/pb/d/+/status    # Status messages
+/pb/d/+/alarm     # Alarm event messages
+/pb/d/+/resp      # Command response messages

# Example with base topic "esagtech"
esagtech/pb/d/+/hb
esagtech/pb/d/+/status
esagtech/pb/d/+/alarm
esagtech/pb/d/+/resp
```

#### 3.1.3 Message Publishing
Publish commands to device-specific topics:
```
{base_topic}/pb/d/{device_hostname}/cmd
```

### 3.2 Protobuf Message Processing

#### 3.2.1 Message Types to Handle

**Incoming Messages:**
1. **Heartbeat** - Regular device health checks (includes fan PWM duty cycle)
2. **StatusMessage** - Comprehensive device status
3. **AlarmEvent** - Alarm trigger notifications and output state changes
   - Input alarms: PANIC1, PANIC2, TAMPER
   - Output events: Pattern starting/stopping notifications
4. **CommandResponse** - Responses to sent commands

**Outgoing Messages:**
1. **Command** - Device control commands
2. **ConfigCommand** - Configuration updates
3. **OutputCommand** - Output control
4. **DiagnosticCommand** - Diagnostic requests
5. **OTACommand** - Firmware update commands

#### 3.2.2 Protobuf Schema Files Required
```
- command.proto
- heartbeat.proto
- status.proto
- alarm.proto
```

### 3.3 REST API Endpoints

#### 3.3.1 Device Management
```typescript
// Get all connected devices
GET /api/devices

// Get specific device status
GET /api/devices/{deviceId}

// Get device history
GET /api/devices/{deviceId}/history
```

#### 3.3.2 Command Endpoints
```typescript
// Send configuration command
POST /api/devices/{deviceId}/config
Body: {
  type: "device" | "wifi" | "mqtt" | "location",
  config: {...}
}

// Control outputs
POST /api/devices/{deviceId}/output
Body: {
  output: "siren" | "turret" | "relay1" | "relay2" | "fan",
  pattern: "constant" | "pulse" | "blink" | ...,
  duration: number,
  ...
}

// System commands
POST /api/devices/{deviceId}/system
Body: {
  action: "reboot" | "factory_reset" | "get_status" | ...,
  ...
}

// Diagnostic commands
POST /api/devices/{deviceId}/diagnostic
Body: {
  action: "self_test" | "memory_info" | "network_info" | ...,
  ...
}

// OTA update
POST /api/devices/{deviceId}/ota
Body: {
  action: "start_update" | "check" | "validate" | ...,
  url?: string,
  ...
}
```

#### 3.3.3 Real-time Data
```typescript
// Get real-time device updates (SSE)
GET /api/devices/{deviceId}/stream

// Get aggregated statistics
GET /api/statistics
```

## 4. Data Models

### 4.1 Device State Model
```typescript
interface DeviceState {
  deviceId: string;           // device_db_id from device
  hostname: string;           // device hostname
  macAddress: string;         // MAC address (hex string)
  lastSeen: Date;            // Last message timestamp
  online: boolean;           // Connection status
  
  // Current state
  state: DeviceStateEnum;    // BOOT, INIT, NORMAL, ALARM, etc.
  uptime: number;            // Seconds
  bootCount: number;         // Boot counter
  
  // Network
  network: 'wifi' | 'ethernet' | 'none';
  ipAddress: string;
  rssi: number;
  
  // Services
  mqttConnected: boolean;
  ntpSynced: boolean;
  
  // I/O States
  inputs: {
    panic1: boolean;
    panic2: boolean;
    boxSw: boolean;
  };
  outputs: {
    siren: boolean;
    turret: boolean;
  };
  
  // Sensors
  temperature: number;
  humidity: number;
  
  // Location
  country: string;
  zone: number;
  latitude: number;
  longitude: number;
  
  // Counters
  counters: {
    panic1Count: number;
    panic2Count: number;
    tamperCount: number;
    wifiDisconnects: number;
    mqttDisconnects: number;
  };
}
```

### 4.2 Command Queue Model
```typescript
interface CommandQueue {
  id: string;                // UUID
  deviceId: string;
  command: any;              // Protobuf command object
  status: 'pending' | 'sent' | 'acknowledged' | 'failed';
  timestamp: Date;
  retries: number;
  response?: any;
}
```

## 5. Technical Requirements

### 5.1 Project Structure
```
nextjs-alarm-server/
├── app/
│   ├── api/
│   │   ├── devices/
│   │   │   ├── route.ts
│   │   │   └── [deviceId]/
│   │   │       ├── route.ts
│   │   │       ├── config/route.ts
│   │   │       ├── output/route.ts
│   │   │       ├── system/route.ts
│   │   │       ├── diagnostic/route.ts
│   │   │       ├── ota/route.ts
│   │   │       └── stream/route.ts
│   │   └── statistics/route.ts
│   └── layout.tsx
├── lib/
│   ├── mqtt/
│   │   ├── client.ts
│   │   ├── handlers.ts
│   │   └── topics.ts
│   ├── protobuf/
│   │   ├── schemas/
│   │   │   ├── command.proto
│   │   │   ├── heartbeat.proto
│   │   │   ├── status.proto
│   │   │   └── alarm.proto
│   │   ├── compiled/
│   │   └── decoder.ts
│   ├── devices/
│   │   ├── manager.ts
│   │   └── store.ts
│   └── utils/
│       ├── logger.ts
│       └── helpers.ts
├── types/
│   ├── device.ts
│   ├── protobuf.ts
│   └── api.ts
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.js
```

### 5.2 Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "mqtt": "^5.0.0",
    "protobufjs": "^7.2.0",
    "uuid": "^9.0.0",
    "dotenv": "^16.0.0",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "prisma": "^5.0.0"
  }
}
```

### 5.3 Environment Variables
```env
# MQTT Configuration
MQTT_HOST=esag-tech.com
MQTT_PORT=8883
MQTT_USERNAME=esagtech_mqtt
MQTT_PASSWORD=lwcwDEBVZxD6VFU
MQTT_CLIENT_ID=nextjs-server
MQTT_BASE_TOPIC=esagtech

# Server Configuration
NODE_ENV=development
PORT=3000

# Database (Phase 2) - PostgreSQL
# DATABASE_URL=postgresql://postgres:Ob9eJjUIaMB3R0J@localhost:5432/alarm_system
```

## 6. Security Requirements

### 6.1 MQTT Security
- Use TLS/SSL for all MQTT connections
- Validate server certificates
- Store credentials securely in environment variables
- Implement connection rate limiting

### 6.2 API Security (Future Enhancement)
- Implement authentication middleware
- Add rate limiting per IP
- Validate all input data
- Sanitize protobuf payloads

### 6.3 HMAC Support
- Support HMAC-wrapped protobuf messages
- Verify HMAC signatures on incoming messages
- Sign outgoing commands with HMAC when enabled

## 7. Performance Requirements

### 7.1 Scalability
- Support minimum 100 concurrent device connections
- Handle 10 messages per second per device
- Response time < 500ms for API endpoints
- Queue commands when devices are offline

### 7.2 Reliability
- Implement automatic MQTT reconnection
- Store device states in memory (Phase 1)
- Persist critical data to database (Phase 2)
- Log all errors and important events

## 8. Monitoring & Logging

### 8.1 Metrics to Track
- Number of connected devices
- Messages received/sent per minute
- API response times
- Error rates
- Command success/failure rates

### 8.2 Logging Requirements
- Log all MQTT connection events
- Log all protobuf message decoding errors
- Log all API requests and responses
- Implement log rotation

## 9. Testing Requirements

### 9.1 Unit Tests
- Protobuf encoding/decoding
- Message handlers
- API endpoint logic
- Utility functions

### 9.2 Integration Tests
- MQTT connection and subscription
- End-to-end command flow
- API endpoint integration

### 9.3 Load Testing
- Simulate 100+ devices
- Test message throughput
- API endpoint performance

## 10. Deployment

### 10.1 Development
```bash
npm install
npm run dev
```

### 10.2 Production
```bash
npm run build
npm start
```

### 10.3 Docker Support (Optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 11. Success Criteria

### Phase 1 Completion
- [ ] MQTT client connects successfully to broker
- [ ] All protobuf message types decode correctly
- [ ] Device states are tracked in memory
- [ ] All API endpoints return correct data
- [ ] Commands are successfully sent to devices
- [ ] Basic error handling implemented
- [ ] Logging system operational

## 12. Future Enhancements (Phase 2 & 3)

### Phase 2 - Database Integration (Updated Architecture)
- PostgreSQL with TimescaleDB for time-series optimization
- Change Data Capture (CDC) with threshold-based logging
- Dual-table architecture: `device_status` (current) + `heartbeats` (historical)
- 90-95% storage reduction through intelligent data capture
- Automated compression and retention policies
- Continuous aggregates for real-time statistics

### Phase 3 - Dashboard
- Real-time device monitoring
- Command history visualization
- Alert management
- User authentication
- Role-based access control
- Mobile responsive design

## 13. Appendix

### 13.1 Protobuf Message Examples

**Heartbeat Message Structure:**
```protobuf
message Heartbeat {
  uint32 timestamp = 1;
  uint32 device_db_id = 2;
  float temperature = 3;
  float humidity = 4;
  bool panic1 = 5;
  bool panic2 = 6;
  bool siren = 7;
  bool turret = 8;
  bool box_sw = 9;
  uint32 uptime = 10;
  uint32 eth_interface = 11;
  string firmware = 12;
  uint32 fan_pwm_duty = 13;
}
```

**AlarmEvent Structure (Updated):**
```protobuf
message AlarmEvent {
  uint32 sequence = 1;
  uint32 timestamp = 2;
  uint32 device_db_id = 3;
  
  enum AlarmType {
    ALARM_PANIC1 = 1;
    ALARM_PANIC2 = 2;
    ALARM_TAMPER = 3;
    OUTPUT_EVENT = 10;  // Output state changes
  }
  AlarmType type = 4;
  
  enum EventState {
    STATE_INACTIVE = 0;
    STATE_ACTIVE = 1;
    STATE_TEST = 2;
    STATE_STARTING = 3;  // Pattern starting
    STATE_STOPPING = 4;  // Pattern stopping
  }
  EventState state = 5;
  Priority priority = 8;
  bool physical_state = 10;
  
  // Output event fields
  uint32 output_type = 11;      // OUT_SIREN, OUT_TURRET, etc.
  uint32 pattern_type = 12;     // PATTERN_CONSTANT, PATTERN_PULSE, etc.
  uint32 duration_seconds = 13; // Configured duration
  uint32 elapsed_seconds = 14;  // Actual elapsed time
}
```

**Command Structure:**
```protobuf
message Command {
  CommandType type = 1;
  oneof command {
    SystemCommand system = 10;
    ConfigCommand config = 11;
    OutputCommand output = 12;
    DiagnosticCommand diagnostic = 13;
    OTACommand ota = 14;
  }
}
```

### 13.2 HMAC Wrapper Format
When HMAC is enabled, messages are wrapped as:
```
[payload_len:2][sequence:4][payload][hmac:8]
```
- payload_len: 2 bytes, little-endian
- sequence: 4 bytes, little-endian (anti-replay)
- payload: Variable length protobuf message
- hmac: 8 bytes (truncated HMAC-SHA256)

### 13.3 Reference Documentation
- [PROTOBUF_COMMANDS.md](./PROTOBUF_COMMANDS.md) - Complete protobuf command reference
- [AT_COMMANDS.md](./AT_COMMANDS.md) - Device AT command reference
- [mqtt-device-config.md](./mqtt-device-config.md) - Device configuration via MQTT

## 14. Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2024-01-29 | System | Initial PRD creation |