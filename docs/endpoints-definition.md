# API Endpoints Definition

Complete documentation for ESP32 Alarm Dashboard remote command API endpoints.

## Table of Contents
- [Authentication](#authentication)
- [System Commands](#system-commands)
- [Configuration Commands](#configuration-commands)
- [Output Control Commands](#output-control-commands)
- [Diagnostic Commands](#diagnostic-commands)
- [OTA Commands](#ota-commands)
- [Error Responses](#error-responses)

## Authentication

All endpoints require appropriate authentication levels:
- **Level 0**: No authentication (public endpoints)
- **Level 1**: Basic authentication (read operations)
- **Level 2**: Admin authentication (write operations, sensitive data)

Headers required:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## System Commands

### POST `/api/devices/{deviceId}/system`

Execute system-level commands on the device.

**Authentication**: Level 2 (Admin)

#### Request Body

```json
{
  "action": "REBOOT|FACTORY_RESET|GET_STATUS|SET_TIME|CLEAR_COUNTERS",
  "options": {
    "delaySeconds": 30,        // For REBOOT: delay before reboot (0-3600)
    "unixTime": 1704067200     // For SET_TIME: Unix timestamp
  }
}
```

#### Response

```json
{
  "success": true,
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "sequence": 12345,
  "message": "Command sent successfully"
}
```

#### Examples

##### Reboot Device
```bash
curl -X POST http://localhost:3000/api/devices/5/system \
  -H "Content-Type: application/json" \
  -d '{
    "action": "REBOOT",
    "options": {
      "delaySeconds": 10
    }
  }'
```

##### Factory Reset
```bash
curl -X POST http://localhost:3000/api/devices/5/system \
  -H "Content-Type: application/json" \
  -d '{
    "action": "FACTORY_RESET"
  }'
```

##### Set Device Time
```bash
curl -X POST http://localhost:3000/api/devices/5/system \
  -H "Content-Type: application/json" \
  -d '{
    "action": "SET_TIME",
    "options": {
      "unixTime": 1704067200
    }
  }'
```

## Configuration Commands

### POST `/api/devices/{deviceId}/config`

Update device configuration. All fields are optional - only provided fields will be updated.

**Authentication**: Level 2 (Admin)

#### Request Body

```json
{
  "type": "WIFI|MQTT|DEVICE|LOCATION|NTP|BLE",
  "config": {
    // Configuration object based on type
  }
}
```

#### Configuration Types

##### WiFi Configuration
```json
{
  "type": "WIFI",
  "config": {
    "ssid": "MyNetwork",          // optional
    "password": "SecurePass123",   // optional
    "dhcp": true,                  // optional
    "staticIp": "192.168.1.100",   // optional (ignored if dhcp=true)
    "gateway": "192.168.1.1",      // optional (ignored if dhcp=true)
    "netmask": "255.255.255.0"     // optional (ignored if dhcp=true)
  }
}
```

##### MQTT Configuration
```json
{
  "type": "MQTT",
  "config": {
    "brokerUrl": "mqtt.example.com",  // optional
    "port": 8883,                      // optional (1-65535)
    "username": "device001",           // optional
    "password": "mqttpass",            // optional
    "keepalive": 60,                   // optional (10-3600 seconds)
    "qos": 1,                          // optional (0-2)
    "useTls": true                     // optional
  }
}
```

##### Device Configuration
```json
{
  "type": "DEVICE",
  "config": {
    "hostname": "alarm-device-01",    // optional
    "deviceId": 123,                  // optional
    "enableHeartbeat": true,          // optional
    "heartbeatInterval": 30           // optional (10-3600 seconds)
  }
}
```

##### Location Configuration
```json
{
  "type": "LOCATION",
  "config": {
    "country": "USA",                 // optional (3-letter code)
    "zone": 1,                        // optional (0-255)
    "latitude": 40.7128,              // optional (-90 to 90)
    "longitude": -74.0060             // optional (-180 to 180)
  }
}
```

##### NTP Configuration
```json
{
  "type": "NTP",
  "config": {
    "server1": "pool.ntp.org",        // optional
    "server2": "time.google.com",     // optional
    "server3": "time.cloudflare.com", // optional
    "enableSync": true,                // optional
    "syncInterval": 3600,              // optional (300-86400 seconds)
    "timezoneOffset": -18000,          // optional (-43200 to 43200 seconds)
    "timezoneName": "EST"              // optional
  }
}
```

##### BLE Configuration
```json
{
  "type": "BLE",
  "config": {
    "enable": true,                    // optional
    "deviceName": "ESP32-Alarm",      // optional
    "advertise": true,                 // optional
    "intervalMs": 100,                 // optional (20-10240 ms)
    "advHmacKey": "0x1234...",        // optional (hex string)
    "sppHmacKey": "0x5678...",        // optional (hex string)
    "txPower": 4                      // optional (0-7)
  }
}
```

### GET `/api/devices/{deviceId}/config`

Read current device configuration.

**Authentication**: Level 1 (Basic) or Level 2 (Admin for sensitive data)

#### Query Parameters

- `type`: Configuration type to read (WIFI|MQTT|DEVICE|LOCATION|NTP|BLE|ALL)
- `includeSensitive`: Include passwords/keys (requires Level 2)

#### Example

```bash
# Read WiFi configuration (without password)
curl http://localhost:3000/api/devices/5/config?type=WIFI

# Read all configuration with sensitive data
curl http://localhost:3000/api/devices/5/config?type=ALL&includeSensitive=true \
  -H "Authorization: Bearer <admin-token>"
```

## Output Control Commands

### POST `/api/devices/{deviceId}/output`

Control device outputs (siren, turret, relays, fan).

**Authentication**: Level 2 (Admin)

#### Request Body

```json
{
  "output": "SIREN|TURRET|RELAY1|RELAY2|FAN|ALL",
  "pattern": "CONSTANT|PULSE|BLINK_SLOW|BLINK_FAST|DOUBLE_PULSE|TRIPLE_PULSE|SOS|STROBE|OFF|PWM|CUSTOM",
  "options": {
    "state": true,                // For CONSTANT: true=ON, false=OFF
    "totalDuration": 60,           // Total duration in seconds (0=permanent)
    "pulseCount": 5,               // Number of pulses (0=infinite)
    "onDurationMs": 500,           // ON duration in milliseconds
    "offDurationMs": 500,          // OFF duration in milliseconds
    "repeatInterval": 10,          // Interval between pattern repeats (seconds)
    "customData": 50               // For FAN+PWM: duty cycle (0-100%)
  }
}
```

#### Pattern Types

| Pattern | Description | Compatible Outputs |
|---------|-------------|-------------------|
| `CONSTANT` | Continuous ON or OFF | All |
| `PULSE` | Configurable pulses | All |
| `BLINK_SLOW` | 500ms ON, 500ms OFF | All |
| `BLINK_FAST` | 200ms ON, 200ms OFF | All |
| `DOUBLE_PULSE` | Two pulses with pause | All |
| `TRIPLE_PULSE` | Three pulses with pause | All |
| `SOS` | SOS pattern | All |
| `STROBE` | 50ms ON, 950ms OFF | All |
| `OFF` | Force output OFF | All |
| `PWM` | PWM control | FAN only |
| `CUSTOM` | Custom pattern | All |

#### Examples

##### Activate Siren for 30 seconds
```bash
curl -X POST http://localhost:3000/api/devices/5/output \
  -H "Content-Type: application/json" \
  -d '{
    "output": "SIREN",
    "pattern": "CONSTANT",
    "options": {
      "state": true,
      "totalDuration": 30
    }
  }'
```

##### Blink Turret Light
```bash
curl -X POST http://localhost:3000/api/devices/5/output \
  -H "Content-Type: application/json" \
  -d '{
    "output": "TURRET",
    "pattern": "BLINK_FAST",
    "options": {
      "totalDuration": 60
    }
  }'
```

##### Set Fan Speed to 75%
```bash
curl -X POST http://localhost:3000/api/devices/5/output \
  -H "Content-Type: application/json" \
  -d '{
    "output": "FAN",
    "pattern": "PWM",
    "options": {
      "customData": 75
    }
  }'
```

##### SOS Pattern on All Outputs
```bash
curl -X POST http://localhost:3000/api/devices/5/output \
  -H "Content-Type: application/json" \
  -d '{
    "output": "ALL",
    "pattern": "SOS",
    "options": {
      "totalDuration": 120
    }
  }'
```

## Diagnostic Commands

### POST `/api/devices/{deviceId}/diagnostic`

Run diagnostic tests and retrieve system information.

**Authentication**: Level 2 (Admin)

#### Request Body

```json
{
  "action": "SELF_TEST|MEMORY_INFO|NETWORK_INFO|SENSOR_READ|LOG_DUMP|INOUT_READ",
  "options": {
    "testMask": 15,      // For SELF_TEST: bitmask of tests to run
    "logLines": 100      // For LOG_DUMP: number of log lines to retrieve
  }
}
```

#### Diagnostic Actions

| Action | Description | Response Data |
|--------|-------------|---------------|
| `SELF_TEST` | Run hardware self-tests | Test results and status |
| `MEMORY_INFO` | Get memory statistics | Free heap, min heap, fragmentation |
| `NETWORK_INFO` | Get network details | IP, MAC, RSSI, connection status |
| `SENSOR_READ` | Read all sensors | Temperature, humidity, inputs |
| `LOG_DUMP` | Retrieve device logs | Recent log entries |
| `INOUT_READ` | Read I/O states | All inputs, outputs, and fan PWM |

#### Examples

##### Get Memory Information
```bash
curl -X POST http://localhost:3000/api/devices/5/diagnostic \
  -H "Content-Type: application/json" \
  -d '{
    "action": "MEMORY_INFO"
  }'
```

##### Run Self-Test
```bash
curl -X POST http://localhost:3000/api/devices/5/diagnostic \
  -H "Content-Type: application/json" \
  -d '{
    "action": "SELF_TEST",
    "options": {
      "testMask": 15
    }
  }'
```

##### Dump Recent Logs
```bash
curl -X POST http://localhost:3000/api/devices/5/diagnostic \
  -H "Content-Type: application/json" \
  -d '{
    "action": "LOG_DUMP",
    "options": {
      "logLines": 50
    }
  }'
```

## OTA Commands

### POST `/api/devices/{deviceId}/ota`

Manage over-the-air firmware updates.

**Authentication**: Level 2 (Admin)

#### Request Body

```json
{
  "action": "CHECK_UPDATE|START_UPDATE|VALIDATE|ROLLBACK|GET_STATUS",
  "options": {
    "url": "https://example.com/firmware.bin",  // For START_UPDATE
    "md5": "5d41402abc4b2a76b9719d911017c592",  // For START_UPDATE
    "size": 1048576                             // For START_UPDATE (bytes)
  }
}
```

#### OTA Actions

| Action | Description | Required Options |
|--------|-------------|------------------|
| `CHECK_UPDATE` | Check for available updates | None |
| `START_UPDATE` | Begin firmware update | url, md5, size |
| `VALIDATE` | Validate current firmware | None |
| `ROLLBACK` | Rollback to previous firmware | None |
| `GET_STATUS` | Get OTA update status | None |

#### Examples

##### Check for Updates
```bash
curl -X POST http://localhost:3000/api/devices/5/ota \
  -H "Content-Type: application/json" \
  -d '{
    "action": "CHECK_UPDATE"
  }'
```

##### Start Firmware Update
```bash
curl -X POST http://localhost:3000/api/devices/5/ota \
  -H "Content-Type: application/json" \
  -d '{
    "action": "START_UPDATE",
    "options": {
      "url": "https://updates.example.com/esp32-alarm-v2.0.0.bin",
      "md5": "5d41402abc4b2a76b9719d911017c592",
      "size": 1048576
    }
  }'
```

##### Get Update Status
```bash
curl -X POST http://localhost:3000/api/devices/5/ota \
  -H "Content-Type: application/json" \
  -d '{
    "action": "GET_STATUS"
  }'
```

## Error Responses

All endpoints follow a consistent error response format:

### Error Response Structure

```json
{
  "error": "Error description",
  "details": [
    {
      "code": "VALIDATION_ERROR",
      "path": ["field", "name"],
      "message": "Detailed error message"
    }
  ]
}
```

### Common HTTP Status Codes

| Status Code | Description | Example |
|-------------|-------------|---------|
| 200 | Success | Command sent successfully |
| 400 | Bad Request | Invalid parameters or validation error |
| 404 | Not Found | Device not found |
| 408 | Request Timeout | Command timeout (no response from device) |
| 500 | Internal Server Error | Server error |

### Example Error Responses

#### Validation Error (400)
```json
{
  "error": "Invalid configuration",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["options", "delaySeconds"],
      "message": "Expected number, received string"
    }
  ]
}
```

#### Device Not Found (404)
```json
{
  "error": "Device not found"
}
```

#### Command Timeout (408)
```json
{
  "error": "Command timeout"
}
```

## Command Response Tracking

All commands are logged in the database with the following states:

| Status | Description |
|--------|-------------|
| `PENDING` | Command created but not sent |
| `SENT` | Command sent to device |
| `ACKNOWLEDGED` | Device acknowledged receipt |
| `COMPLETED` | Command executed successfully |
| `FAILED` | Command execution failed |
| `TIMEOUT` | No response within timeout period |
| `CANCELLED` | Command cancelled by user |

### Get Command History

```bash
# Get last 50 commands for a device
curl http://localhost:3000/api/devices/5/commands?limit=50
```

## Testing with cURL

### Complete Test Sequence

```bash
# 1. Get device status
curl -X POST http://localhost:3000/api/devices/5/system \
  -H "Content-Type: application/json" \
  -d '{"action": "GET_STATUS"}'

# 2. Read current configuration
curl http://localhost:3000/api/devices/5/config?type=ALL

# 3. Update WiFi settings (partial update)
curl -X POST http://localhost:3000/api/devices/5/config \
  -H "Content-Type: application/json" \
  -d '{
    "type": "WIFI",
    "config": {
      "ssid": "NewNetwork"
    }
  }'

# 4. Test siren
curl -X POST http://localhost:3000/api/devices/5/output \
  -H "Content-Type: application/json" \
  -d '{
    "output": "SIREN",
    "pattern": "PULSE",
    "options": {
      "pulseCount": 3,
      "onDurationMs": 500,
      "offDurationMs": 500
    }
  }'

# 5. Get memory info
curl -X POST http://localhost:3000/api/devices/5/diagnostic \
  -H "Content-Type: application/json" \
  -d '{"action": "MEMORY_INFO"}'

# 6. Clear event counters
curl -X POST http://localhost:3000/api/devices/5/system \
  -H "Content-Type: application/json" \
  -d '{"action": "CLEAR_COUNTERS"}'
```

## WebSocket Real-time Updates

Connect to WebSocket for real-time command responses and device status updates:

```javascript
const ws = new WebSocket('ws://localhost:8888');

ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  if (message.type === 'COMMAND_RESPONSE') {
    console.log('Command response:', message.data);
  }
});
```

## Notes

1. **Partial Updates**: Configuration endpoints support partial updates using optional fields. Only provided fields will be updated on the device.

2. **Timeout Handling**: Default timeout is 30 seconds. Commands that don't receive a response within this period will be marked as TIMEOUT.

3. **Retry Logic**: Failed commands can be retried up to 3 times with exponential backoff.

4. **Rate Limiting**: API endpoints are rate-limited to prevent abuse. Default: 100 requests per 15 minutes per IP.

5. **MQTT Connection**: Commands are sent via MQTT. If MQTT is unavailable in the API context, commands are queued for later sending.

6. **Protocol Buffers**: All commands use Protocol Buffers for efficient binary serialization with HMAC-SHA256 authentication.