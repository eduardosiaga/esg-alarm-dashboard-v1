# Protobuf Commands Documentation

## Overview
The ESP32-WROVER Alarm System implements a Protocol Buffers (protobuf) based command system for efficient binary communication over MQTT. This provides a structured, type-safe, and bandwidth-efficient protocol for device control.

## MQTT Topics

### Command Topic
```
{base_topic}/pb/d/{device_id}/cmd
Example: iot/pb/d/ESP32_001/cmd
```

### Response Topic
```
{base_topic}/pb/d/{device_id}/resp
Example: iot/pb/d/ESP32_001/resp
```

### Heartbeat Topic
```
{base_topic}/pb/d/{device_id}/hb
Example: iot/pb/d/ESP32_001/hb
```

#### Heartbeat Message Structure
```protobuf
message Heartbeat {
  uint32 timestamp = 1;      // Unix timestamp (seconds since 1970)
  uint32 device_db_id = 2;   // Device database ID
  float temperature = 3;     // Temperature in Celsius
  float humidity = 4;        // Humidity percentage
  bool panic1 = 5;           // Panic button 1 state
  bool panic2 = 6;           // Panic button 2 state
  bool siren = 7;            // Siren output state
  bool turret = 8;           // Turret light state
  bool box_sw = 9;           // Box tamper switch
  uint32 uptime = 10;        // Uptime in seconds
  uint32 eth_interface = 11; // 0=WiFi, 1=Ethernet
  string firmware = 12;      // Firmware version string (max 16 chars)
  uint32 fan_pwm_duty = 13;  // Fan PWM duty cycle (0-100%)
}
```

The heartbeat message is sent periodically (configurable interval) to report device health and status.

### Status Topic
```
{base_topic}/pb/d/{device_id}/status
Example: iot/pb/d/ESP32_001/status
```

### Alarm Event Topic
```
{base_topic}/pb/d/{device_id}/alarm
Example: iot/pb/d/ESP32_001/alarm
```

## Command Structure

### CommandEnvelope
Main wrapper for all commands with metadata and authentication.

```protobuf
message CommandEnvelope {
    uint32 sequence = 1;           // Anti-replay counter
    uint32 timestamp = 2;          // Unix timestamp
    string request_id = 3;         // UUID for correlation (max 37 chars)
    uint32 auth_level = 4;         // 0=none, 1=basic, 2=admin
    
    oneof command {
        SystemCommand system = 10;
        ConfigCommand config = 11;
        OutputCommand output = 12;
        DiagnosticCommand diagnostic = 13;
        OTACommand ota = 14;
    }
}
```

### CommandResponse
Response structure for all commands.

```protobuf
message CommandResponse {
    string request_id = 1;         // Correlation with request
    uint32 timestamp = 2;          // Response timestamp
    bool success = 3;              // Execution result
    uint32 error_code = 4;         // Error code if failed
    string message = 5;            // Human readable message (max 128 chars)
    bytes payload = 6;             // Response data if any (max 256 bytes)
}
```

## System Commands

### SystemCommand
Control system-level operations.

```protobuf
enum SystemAction {
    SYS_UNKNOWN = 0;
    SYS_REBOOT = 1;
    SYS_FACTORY_RESET = 2;
    SYS_GET_STATUS = 3;
    SYS_SET_TIME = 4;
    SYS_CLEAR_COUNTERS = 5;
}

message SystemCommand {
    SystemAction action = 1;
    uint32 delay_seconds = 2;     // For reboot delay
    uint32 unix_time = 3;          // For set_time
}
```

#### Examples

**Reboot Device**
```json
{
  "sequence": 1,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440001",
  "auth_level": 2,
  "system": {
    "action": "SYS_REBOOT",
    "delay_seconds": 5
  }
}
```

**Set System Time**
```json
{
  "sequence": 2,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440002",
  "auth_level": 1,
  "system": {
    "action": "SYS_SET_TIME",
    "unix_time": 1693526400
  }
}
```

## Configuration Commands

### ConfigCommand
Update device configuration settings.

```protobuf
enum ConfigType {
    CFG_UNKNOWN = 0;
    CFG_WIFI = 1;
    CFG_MQTT = 2;
    CFG_DEVICE = 3;
    CFG_LOCATION = 4;
}

message ConfigCommand {
    ConfigType type = 1;
    oneof config {
        WifiConfig wifi = 10;
        MqttConfig mqtt = 11;
        DeviceConfig device = 12;
        LocationConfig location = 13;
    }
}
```

### Configuration Structures

**WiFi Configuration**
```protobuf
message WifiConfig {
    string ssid = 1;               // Max 32 chars
    string password = 2;           // Max 64 chars
    bool dhcp = 3;
    uint32 static_ip = 4;
    uint32 gateway = 5;
    uint32 netmask = 6;
}
```

**MQTT Configuration**
```protobuf
message MqttConfig {
    string broker_url = 1;         // Max 128 chars
    uint32 port = 2;
    string username = 3;           // Max 32 chars
    string password = 4;           // Max 32 chars
    uint32 keepalive = 5;
    uint32 qos = 6;
    bool use_tls = 7;
}
```

**Device Configuration**
```protobuf
message DeviceConfig {
    string hostname = 1;           // Max 32 chars
    uint32 device_id = 2;          // Database ID (must be > 0 to update)
    bool enable_heartbeat = 3;
    uint32 heartbeat_interval = 4;
}
```

**Note**: The `device_id` field maps to `device_cfg.device_db_id` in the device. Only values greater than 0 will update the ID.

**Location Configuration**
```protobuf
message LocationConfig {
    string country = 1;            // Max 3 chars (ISO code)
    uint32 zone = 2;
    float latitude = 3;
    float longitude = 4;
}
```

#### Example: Configure WiFi
```json
{
  "sequence": 3,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440003",
  "auth_level": 2,
  "config": {
    "type": "CFG_WIFI",
    "wifi": {
      "ssid": "MyNetwork",
      "password": "SecurePassword123",
      "dhcp": true
    }
  }
}
```

#### Example: Configure Device ID
```json
{
  "sequence": 4,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440004",
  "auth_level": 2,
  "config": {
    "type": "CFG_DEVICE",
    "device": {
      "device_id": 12345,
      "hostname": "ESP32-ALARM-001"
    }
  }
}
```

#### Example: Configure Location
```json
{
  "sequence": 5,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440005",
  "auth_level": 2,
  "config": {
    "type": "CFG_LOCATION",
    "location": {
      "country": "US",
      "zone": 5,
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  }
}
```

## Output Control Commands

### OutputCommand
Control physical outputs (sirens, relays, lights, fan).

```protobuf
enum OutputType {
    OUT_UNKNOWN = 0;
    OUT_SIREN = 1;
    OUT_TURRET = 2;
    OUT_RELAY1 = 3;
    OUT_RELAY2 = 4;
    OUT_FAN = 5;
    OUT_ALL = 6;          // All outputs except FAN
}

enum PatternType {
    PATTERN_NONE = 0;         // Not implemented
    PATTERN_CONSTANT = 1;     // Constant ON/OFF
    PATTERN_PULSE = 2;        // Pulse control
    PATTERN_BLINK_SLOW = 3;   // 500ms ON, 500ms OFF
    PATTERN_BLINK_FAST = 4;   // 200ms ON, 200ms OFF
    PATTERN_DOUBLE_PULSE = 5; // Double pulse pattern
    PATTERN_TRIPLE_PULSE = 6; // Triple pulse pattern
    PATTERN_SOS = 7;          // SOS pattern
    PATTERN_STROBE = 8;       // 50ms ON, 950ms OFF
    PATTERN_OFF = 9;          // Force OFF
    PATTERN_PWM = 10;         // PWM control (FAN only)
    PATTERN_CUSTOM = 255;     // Custom pattern
}

message OutputCommand {
    OutputType output = 1;
    PatternType pattern = 2;
    
    // Basic control
    bool state = 3;                  // For PATTERN_CONSTANT
    uint32 total_duration = 4;       // Duration in seconds (0=permanent)
    
    // Pulse control
    uint32 pulse_count = 5;          // Number of pulses (0=infinite)
    uint32 on_duration_ms = 6;       // ON duration in milliseconds
    uint32 off_duration_ms = 7;      // OFF duration in milliseconds
    
    // Advanced control
    uint32 repeat_interval = 8;      // Pattern repeat interval (seconds)
    uint32 custom_data = 9;          // PWM duty (0-100%) for FAN, or custom data
}
```

#### Examples

**Turn ON Siren for 30 seconds**
```json
{
  "sequence": 4,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440004",
  "auth_level": 1,
  "output": {
    "output": "OUT_SIREN",
    "pattern": "PATTERN_CONSTANT",
    "state": true,
    "total_duration": 30
  }
}
```

**Pulse Pattern (3 beeps)**
```json
{
  "sequence": 5,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440005",
  "auth_level": 1,
  "output": {
    "output": "OUT_SIREN",
    "pattern": "PATTERN_PULSE",
    "pulse_count": 3,
    "on_duration_ms": 1000,
    "off_duration_ms": 500,
    "total_duration": 0
  }
}
```

**Set FAN Speed (PWM)**
```json
{
  "sequence": 6,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440006",
  "auth_level": 1,
  "output": {
    "output": "OUT_FAN",
    "pattern": "PATTERN_PWM",
    "custom_data": 75      // 75% duty cycle
  }
}
```

**Turn OFF All Outputs**
```json
{
  "sequence": 7,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440007",
  "auth_level": 1,
  "output": {
    "output": "OUT_ALL",
    "pattern": "PATTERN_OFF"
  }
}
```

**Strobe Light Pattern**
```json
{
  "sequence": 8,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440008",
  "auth_level": 1,
  "output": {
    "output": "OUT_TURRET",
    "pattern": "PATTERN_STROBE",
    "total_duration": 60    // Run for 60 seconds
  }
}
```

## Diagnostic Commands

### DiagnosticCommand
Run diagnostic tests and retrieve system information.

```protobuf
enum DiagAction {
    DIAG_UNKNOWN = 0;
    DIAG_SELF_TEST = 1;
    DIAG_MEMORY_INFO = 2;
    DIAG_NETWORK_INFO = 3;
    DIAG_SENSOR_READ = 4;
    DIAG_LOG_DUMP = 5;
}

message DiagnosticCommand {
    DiagAction action = 1;
    uint32 test_mask = 2;         // For self-test selection
    uint32 log_lines = 3;         // For log dump
}
```

#### Example: Get Memory Info
```json
{
  "sequence": 9,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440009",
  "auth_level": 1,
  "diagnostic": {
    "action": "DIAG_MEMORY_INFO"
  }
}
```

## OTA Commands

### OTACommand
Over-The-Air firmware update control.

```protobuf
enum OTAAction {
    OTA_UNKNOWN = 0;
    OTA_CHECK_UPDATE = 1;
    OTA_START_UPDATE = 2;
    OTA_VALIDATE = 3;
    OTA_ROLLBACK = 4;
    OTA_GET_STATUS = 5;
}

message OTACommand {
    OTAAction action = 1;
    string url = 2;               // Max 256 chars
    string md5 = 3;               // Max 33 chars
    uint32 size = 4;
}
```

#### Example: Start OTA Update
```json
{
  "sequence": 10,
  "timestamp": 1693526400,
  "request_id": "550e8400-e29b-41d4-a716-446655440010",
  "auth_level": 2,
  "ota": {
    "action": "OTA_START_UPDATE",
    "url": "https://update.server.com/firmware-v2.0.bin",
    "md5": "5d41402abc4b2a76b9719d911017c592",
    "size": 1234567
  }
}
```

## Security with HMAC

### Generic HMAC Wrapper
All protobuf messages can be protected with HMAC-SHA256 for enhanced security. The wrapper format is:

```
[payload_len:2][sequence:4][payload][hmac:8]
```

- **payload_len**: 2 bytes, little-endian, length of the protobuf payload
- **sequence**: 4 bytes, little-endian, anti-replay counter
- **payload**: Variable length protobuf message
- **hmac**: 8 bytes, truncated HMAC-SHA256 of all preceding data

### Enabling HMAC

**For sending (TX):**
```
AT+PBHMAC=1        # Enable HMAC for outgoing protobuf messages
```

**For receiving (RX):**
```
AT+PBVERIFY=1      # Enable HMAC verification for incoming commands
```

**Set HMAC key:**
```
AT+PBKEY=0123456789ABCDEF...  # 64 hex chars (32 bytes)
```

### Implementation Notes
1. The same HMAC key is used for both TX and RX
2. Sequence numbers provide anti-replay protection
3. HMAC is calculated over the entire message including headers
4. Only the first 8 bytes of the HMAC-SHA256 are used
5. When HMAC verification is enabled, non-HMAC messages are rejected

## Error Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | Invalid command |
| 2 | Invalid parameters |
| 3 | Unknown type |
| 4 | Operation failed |
| 5 | Not supported |
| 6 | Timeout |
| 7 | Authentication failed |
| 8 | Resource busy |
| 9 | Memory error |
| 10 | Hardware error |

## Binary Encoding

Commands are encoded using nanopb (Protocol Buffers for embedded systems) and transmitted as binary data over MQTT. The binary format is significantly more efficient than JSON:

### Size Comparison Example
**Turn ON Siren Command:**
- JSON: ~200 bytes
- Protobuf: ~30 bytes
- Savings: 85% bandwidth reduction

## Status Messages

The device periodically sends status messages containing comprehensive system information:

### StatusMessage Structure
```protobuf
message StatusMessage {
    // Metadata
    uint32 sequence = 1;
    uint32 timestamp = 2;
    uint32 device_db_id = 3;
    
    // System state
    DeviceState state = 4;
    uint32 state_duration = 5;
    uint32 uptime = 6;
    uint32 boot_count = 7;
    uint32 free_heap = 8;
    uint32 min_heap = 9;
    string firmware = 10;
    
    // Network
    NetworkInterface network = 11;
    bool connected = 12;
    bool has_ip = 13;
    int32 rssi = 14;
    uint32 ip_address = 15;
    bytes mac_address = 16;        // NEW: 6-byte MAC address
    
    // Services
    bool mqtt_connected = 17;
    bool ntp_synced = 18;
    int64 last_ntp_sync = 19;
    
    // I/O states
    bool panic1 = 20;
    bool panic2 = 21;
    bool box_sw = 22;
    bool siren = 23;
    bool turret = 24;
    
    // Counters
    uint32 panic1_count = 25;
    uint32 panic2_count = 26;
    uint32 tamper_count = 27;
    uint32 wifi_disconnects = 28;
    uint32 mqtt_disconnects = 29;
    
    // Sensors
    float temperature = 30;
    float humidity = 31;
    
    // Location
    string country = 32;
    uint32 zone = 33;
    float latitude = 34;
    float longitude = 35;
    
    // Error tracking
    uint32 error_flags = 36;
    uint32 error_count = 37;
    
    // OTA info
    uint32 partition = 38;
    bool ota_validated = 39;
}
```

## Implementation Notes

1. **Anti-Replay Protection**: Use incrementing sequence numbers
2. **Request Correlation**: Always include unique request_id (UUID)
3. **Timestamp Validation**: Device validates timestamp freshness (±5 minutes)
4. **Auth Levels**: 
   - 0: Read-only operations
   - 1: Basic control operations
   - 2: Admin operations (config, OTA, factory reset)
5. **Maximum Sizes**: Respect field size limits to prevent buffer overflows
6. **Pattern Timing**: All durations in milliseconds for precise control
7. **FAN Control**: PWM duty cycle 0-100% stored in custom_data field for output commands
8. **MAC Address**: Device MAC is included in status messages for identification
9. **Device ID**: The `device_db_id` field identifies the device in the backend database
10. **FAN Status**: Current fan PWM duty cycle (0-100%) is reported in heartbeat messages