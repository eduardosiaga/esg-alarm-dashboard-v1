# Software Requirements Specification (SRS)
# ESP32 Alarm System - Next.js Backend Server

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Next.js backend server that interfaces with ESP32 alarm devices via MQTT protocol using Protocol Buffers (protobuf) for message serialization.

### 1.2 Document Conventions
- **SHALL**: Mandatory requirement
- **SHOULD**: Recommended requirement
- **MAY**: Optional requirement
- **REQ-XXX**: Requirement identifier

### 1.3 Intended Audience
- Software developers implementing the server
- System architects
- Quality assurance engineers
- DevOps engineers

### 1.4 Project Scope
The server acts as a central hub for managing ESP32 alarm devices, processing their messages, and providing a REST API for device control. Phase 1 focuses on MQTT communication and protobuf message handling.

## 2. Overall Description

### 2.1 Product Perspective
```
┌─────────────┐     MQTT/TLS      ┌──────────────┐     HTTP/REST    ┌──────────┐
│ESP32 Devices├──────────────────►│ Next.js      ├─────────────────►│Client    │
│             │◄──────────────────┤ Server       │◄─────────────────┤Apps      │
└─────────────┘                   └──────┬───────┘                  └──────────┘
                                         │
                                         │ Phase 2
                                         ▼
                                   ┌──────────────┐
                                   │PostgreSQL + TimescaleDB│
                                   └──────────────┘
```

### 2.2 Product Features
1. MQTT client with TLS support
2. Protobuf message encoding/decoding
3. Device state management
4. REST API for device control
5. Real-time event processing
6. Command queue management

### 2.3 User Classes and Characteristics
- **System Administrator**: Manages server configuration and deployment
- **API Consumer**: External applications using REST endpoints
- **ESP32 Devices**: IoT devices communicating via MQTT

### 2.4 Operating Environment
- **Server OS**: Linux/Windows/macOS with Node.js 18+
- **Runtime**: Node.js with Next.js framework
- **Network**: Internet connectivity with TLS support
- **Ports**: 3000 (HTTP), 8883 (MQTT)

## 3. System Features

### 3.1 MQTT Client Management

#### 3.1.1 Description
The system SHALL implement a robust MQTT client capable of secure communication with the broker.

#### 3.1.2 Functional Requirements

**REQ-MQTT-001**: The system SHALL establish TLS-encrypted connection to MQTT broker
```typescript
interface MQTTConfig {
  host: 'esag-tech.com';
  port: 8883;
  protocol: 'mqtts';
  username: 'esagtech_mqtt';
  password: 'lwcwDEBVZxD6VFU';
  rejectUnauthorized: true;
}
```

**REQ-MQTT-002**: The system SHALL implement automatic reconnection with exponential backoff
- Initial retry: 1 second
- Maximum retry: 60 seconds
- Backoff multiplier: 2

**REQ-MQTT-003**: The system SHALL subscribe to device topics using wildcards
```
+/pb/d/+/hb        # Heartbeat
+/pb/d/+/status    # Status
+/pb/d/+/alarm     # Alarm events
+/pb/d/+/resp      # Command responses
```

**REQ-MQTT-004**: The system SHALL publish commands to device-specific topics
```
{base_topic}/pb/d/{hostname}/cmd
```

**REQ-MQTT-005**: The system SHALL maintain MQTT connection health monitoring
- Ping interval: 30 seconds
- Timeout: 60 seconds

### 3.2 Protobuf Message Processing

#### 3.2.1 Description
The system SHALL process all protobuf messages from ESP32 devices.

#### 3.2.2 Functional Requirements

**REQ-PROTO-001**: The system SHALL decode incoming protobuf messages
- Heartbeat messages (including fan PWM duty cycle)
- Status messages  
- Alarm event messages (including output state changes)
- Command response messages
- Output event messages (pattern start/stop notifications)

**REQ-PROTO-002**: The system SHALL encode outgoing protobuf commands
```typescript
interface CommandTypes {
  CMD_SYSTEM: 1;
  CMD_CONFIG: 2;
  CMD_OUTPUT: 3;
  CMD_DIAGNOSTIC: 4;
  CMD_OTA: 5;
}
```

**REQ-PROTO-003**: The system SHALL validate protobuf message structure
- Check required fields
- Validate data types
- Verify message size limits

**REQ-PROTO-004**: The system SHALL handle HMAC-wrapped messages
```
Format: [payload_len:2][sequence:4][payload][hmac:8]
```

**REQ-PROTO-005**: The system SHALL maintain protobuf schema files
- command.proto
- heartbeat.proto
- status.proto
- alarm.proto

**REQ-PROTO-006**: The system SHALL process output event messages
- Detect OUTPUT_EVENT type (type = 10)
- Track pattern lifecycle (STATE_STARTING, STATE_STOPPING)
- Record output type and pattern type
- Calculate actual vs planned duration
- Update device output status in real-time

### 3.3 Device State Management

#### 3.3.1 Description
The system SHALL track and manage the state of all connected devices.

#### 3.3.2 Functional Requirements

**REQ-STATE-001**: The system SHALL maintain in-memory device state store
```typescript
interface DeviceState {
  deviceId: string;        // device_db_id
  hostname: string;
  macAddress: string;      // 6-byte MAC as hex string
  lastSeen: Date;
  online: boolean;
  state: DeviceStateEnum;
  uptime: number;
  bootCount: number;
  // ... additional fields
}
```

**REQ-STATE-002**: The system SHALL update device state on message receipt
- Update lastSeen timestamp
- Update online status
- Merge new state data

**REQ-STATE-003**: The system SHALL detect offline devices
- Timeout: 90 seconds without heartbeat
- Mark device as offline
- Generate offline event

**REQ-STATE-004**: The system SHALL track device counters
- panic1_count
- panic2_count
- tamper_count
- wifi_disconnects
- mqtt_disconnects

### 3.4 REST API Implementation

#### 3.4.1 Description
The system SHALL provide REST API endpoints for device management.

#### 3.4.2 Functional Requirements

**REQ-API-001**: Device Information Endpoints
```
GET  /api/devices              # List all devices
GET  /api/devices/{deviceId}   # Get device details
GET  /api/devices/{deviceId}/history  # Get device history
```

**REQ-API-002**: Device Control Endpoints
```
POST /api/devices/{deviceId}/config     # Send configuration
POST /api/devices/{deviceId}/output     # Control outputs
POST /api/devices/{deviceId}/system     # System commands
POST /api/devices/{deviceId}/diagnostic # Diagnostic commands
POST /api/devices/{deviceId}/ota        # OTA commands
```

**REQ-API-003**: Real-time Data Endpoint
```
GET  /api/devices/{deviceId}/stream  # Server-Sent Events
```

**REQ-API-004**: Statistics Endpoint
```
GET  /api/statistics  # Aggregated system statistics
```

**REQ-API-005**: API Response Format
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}
```

### 3.5 Command Queue Management

#### 3.5.1 Description
The system SHALL queue and manage commands sent to devices.

#### 3.5.2 Functional Requirements

**REQ-CMD-001**: The system SHALL implement command queue
```typescript
interface CommandQueue {
  id: string;           // UUID
  deviceId: string;
  command: any;         // Protobuf command
  status: 'pending' | 'sent' | 'acknowledged' | 'failed';
  timestamp: Date;
  retries: number;
  maxRetries: 3;
}
```

**REQ-CMD-002**: The system SHALL retry failed commands
- Maximum retries: 3
- Retry interval: 5 seconds

**REQ-CMD-003**: The system SHALL correlate command responses
- Match response by request_id
- Update command status
- Store response data

**REQ-CMD-004**: The system SHALL timeout pending commands
- Timeout: 30 seconds
- Mark as failed after timeout

## 4. External Interface Requirements

### 4.1 User Interfaces
Not applicable for Phase 1 (API-only server)

### 4.2 Hardware Interfaces
None (software-only solution)

### 4.3 Software Interfaces

#### 4.3.1 MQTT Broker Interface
- **Protocol**: MQTT v3.1.1 or v5.0
- **Transport**: TLS 1.2+
- **Port**: 8883
- **Authentication**: Username/password

#### 4.3.2 HTTP/REST Interface
- **Protocol**: HTTP/1.1, HTTP/2
- **Port**: 3000 (configurable)
- **Content-Type**: application/json
- **Encoding**: UTF-8

### 4.4 Communication Interfaces

#### 4.4.1 Protobuf Messages

**Incoming Message Types:**
```protobuf
// Heartbeat (Topic: +/pb/d/+/hb)
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
  uint32 fan_pwm_duty = 13;  // Fan PWM duty cycle (0-100%)
}

// Status (Topic: +/pb/d/+/status)
message StatusMessage {
  uint32 sequence = 1;
  uint32 timestamp = 2;
  uint32 device_db_id = 3;
  DeviceState state = 4;
  // ... 35+ additional fields
  bytes mac_address = 16;  // 6-byte MAC
}

// Alarm Event (Topic: +/pb/d/+/alarm) - Updated
message AlarmEvent {
  uint32 sequence = 1;
  uint32 timestamp = 2;
  uint32 device_db_id = 3;
  
  enum AlarmType {
    ALARM_PANIC1 = 1;
    ALARM_PANIC2 = 2;
    ALARM_TAMPER = 3;
    OUTPUT_EVENT = 10;    // Output state changes
  }
  AlarmType type = 4;
  
  enum EventState {
    STATE_INACTIVE = 0;
    STATE_ACTIVE = 1;
    STATE_TEST = 2;
    STATE_STARTING = 3;   // Pattern starting
    STATE_STOPPING = 4;   // Pattern stopping
  }
  EventState state = 5;
  Priority priority = 8;
  bool physical_state = 10;
  
  // Output event specific fields
  uint32 output_type = 11;      // OutputType from command.proto
  uint32 pattern_type = 12;     // PatternType from command.proto
  uint32 duration_seconds = 13; // Configured duration
  uint32 elapsed_seconds = 14;  // Actual elapsed time
}
```

**Outgoing Command Structure:**
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

## 5. Non-functional Requirements

### 5.1 Performance Requirements

**REQ-PERF-001**: Message Processing
- Throughput: ≥1000 messages/second
- Latency: <50ms per message

**REQ-PERF-002**: API Response Time
- Average: <200ms
- 95th percentile: <500ms
- 99th percentile: <1000ms

**REQ-PERF-003**: Concurrent Connections
- Minimum: 100 devices
- Target: 1000 devices

**REQ-PERF-004**: Memory Usage
- Base: <100MB
- Per device: <1MB

### 5.2 Safety Requirements
Not applicable (non-safety-critical system)

### 5.3 Security Requirements

**REQ-SEC-001**: The system SHALL use TLS for MQTT communication

**REQ-SEC-002**: The system SHALL store credentials in environment variables

**REQ-SEC-003**: The system SHALL validate all input data

**REQ-SEC-004**: The system SHALL implement rate limiting
- Per IP: 100 requests/minute
- Per device: 60 commands/minute

**REQ-SEC-005**: The system SHALL support HMAC message verification

### 5.4 Software Quality Attributes

**REQ-QUAL-001**: Availability
- Target uptime: 99.9%
- Maximum downtime: 8.76 hours/year

**REQ-QUAL-002**: Maintainability
- Code coverage: >80%
- Documentation: Complete API docs
- Logging: Structured JSON logs

**REQ-QUAL-003**: Scalability
- Horizontal scaling support
- Stateless design (Phase 1)
- Database support (Phase 2)

**REQ-QUAL-004**: Reliability
- Automatic error recovery
- Graceful degradation
- Circuit breaker pattern

## 6. System Constraints

### 6.1 Design Constraints
- Must use Next.js framework
- Must use TypeScript
- Must support protobuf binary protocol
- Must maintain backward compatibility

### 6.2 Implementation Constraints
- Node.js version 18 or higher
- Next.js version 14 or higher
- Must run on Linux/Windows/macOS

### 6.3 Regulatory Requirements
None identified for Phase 1

## 7. Data Requirements

### 7.1 Database Architecture

**REQ-DATA-001**: The system SHALL use PostgreSQL with TimescaleDB extension for time-series data storage.

**REQ-DATA-002**: The system SHALL implement Change Data Capture (CDC) with hardcoded thresholds:
- Temperature: 0.5°C change threshold
- Humidity: 2% change threshold  
- Fan PWM: 5% change threshold
- Boolean states: Always log changes
- Periodic forced logging: Every 5 minutes

**REQ-DATA-003**: The system SHALL maintain two primary data stores:
- `device_status` table for current state (O(1) access)
- `heartbeats` hypertable for historical data (compressed after 7 days)

**REQ-DATA-004**: The system SHALL achieve ≥90% storage reduction through threshold-based CDC.

### 7.2 Data Models

**Device Model:**
```typescript
interface Device {
  // Identification
  deviceId: string;          // Unique device ID (device_db_id)
  hostname: string;          // Device hostname
  macAddress: string;        // MAC address
  
  // Status
  online: boolean;
  lastSeen: Date;
  state: 'BOOT' | 'INIT' | 'CONNECTING' | 'NORMAL' | 'ALARM' | 'MAINTENANCE' | 'ERROR' | 'CRITICAL';
  
  // System Info
  firmware: string;
  uptime: number;
  bootCount: number;
  freeHeap: number;
  
  // Network
  network: 'wifi' | 'ethernet' | 'none';
  ipAddress: string;
  rssi: number;
  
  // Location
  country: string;
  zone: number;
  latitude: number;
  longitude: number;
  
  // Sensors
  temperature: number;
  humidity: number;
  
  // I/O States
  inputs: InputStates;
  outputs: OutputStates;
  
  // Statistics
  counters: DeviceCounters;
}
```

### 7.3 Data Persistence Strategy

**REQ-DATA-005**: The system SHALL use database triggers for automatic CDC processing:
```sql
-- Process on UPDATE to device_status table
-- Log to heartbeats only when thresholds exceeded
-- Zero additional application logic required
```

**REQ-DATA-006**: The system SHALL implement data retention policies:
- Raw data: 7 days
- Compressed data: 30 days  
- Aggregated hourly statistics: 1 year
- Alarm events: 2 years

**REQ-DATA-007**: The system SHALL maintain data integrity through:
- ACID transactions for critical operations
- Foreign key constraints
- Check constraints for valid ranges
- Trigger-based validation

**REQ-DATA-008**: The system SHALL optimize query performance with:
- Strategic indexes on common query patterns
- Continuous aggregates for statistics
- Partitioning by time (daily chunks)
- Compression for historical data

## 8. Testing Requirements

### 8.1 Unit Testing
- **Coverage**: Minimum 80%
- **Framework**: Jest
- **Scope**: All business logic

### 8.2 Integration Testing
- MQTT connection tests
- Protobuf encoding/decoding tests
- API endpoint tests
- End-to-end command flow tests

### 8.3 Performance Testing
- Load testing with 100+ simulated devices
- Stress testing with 10,000 messages/second
- API endpoint response time testing

### 8.4 Security Testing
- Input validation testing
- Rate limiting verification
- TLS configuration validation

## 9. Deployment Requirements

### 9.1 Development Environment
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 9.2 Production Environment
```bash
# Start production server
npm start

# Or with PM2
pm2 start npm --name "alarm-server" -- start
```

### 9.3 Environment Variables
```env
# Required
MQTT_HOST=esag-tech.com
MQTT_PORT=8883
MQTT_USERNAME=esagtech_mqtt
MQTT_PASSWORD=lwcwDEBVZxD6VFU
MQTT_BASE_TOPIC=esagtech

# Optional
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

## 10. Acceptance Criteria

### 10.1 Phase 1 Completion Criteria
- [ ] MQTT client connects and maintains connection
- [ ] All protobuf message types decode correctly
- [ ] Device states update in real-time
- [ ] All REST API endpoints functional
- [ ] Commands successfully sent to devices
- [ ] Error handling and logging operational
- [ ] Unit test coverage >80%
- [ ] Documentation complete

### 10.2 Performance Criteria
- [ ] Handle 100 concurrent devices
- [ ] Process 1000 messages/second
- [ ] API response time <500ms (95th percentile)
- [ ] Memory usage <1GB for 100 devices

## 11. Appendix

### 11.1 Glossary
- **MQTT**: Message Queuing Telemetry Transport
- **Protobuf**: Protocol Buffers
- **TLS**: Transport Layer Security
- **HMAC**: Hash-based Message Authentication Code
- **SSE**: Server-Sent Events
- **UUID**: Universally Unique Identifier

### 11.2 References
1. [MQTT Specification v5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
2. [Protocol Buffers Documentation](https://protobuf.dev/)
3. [Next.js Documentation](https://nextjs.org/docs)
4. [ESP32 Alarm System Protobuf Commands](./PROTOBUF_COMMANDS.md)
5. [ESP32 AT Commands Reference](./AT_COMMANDS.md)

### 11.3 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-29 | System | Initial SRS document |