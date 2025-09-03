# Remote Command Protocol Definition

## Overview
The ESP32-WROVER alarm system supports remote command execution via MQTT using Protocol Buffers (protobuf) encoding. Commands are sent to the device through MQTT topics and responses are returned with execution status and optional data payloads.

## MQTT Topics
- **Command Topic**: `{base}/pb/c/{hostname}/cmd`
- **Response Topic**: `{base}/pb/d/{hostname}/response`

Where `{base}` is typically `dev/empresa` for development or `prod/empresa` for production.

## Protocol Structure

### Command Envelope
All commands must be wrapped in a `CommandEnvelope` message:

```protobuf
message CommandEnvelope {
    uint32 sequence = 1;                        // Anti-replay counter
    uint32 timestamp = 2;                       // Unix timestamp (must be within 5 minutes)
    string request_id = 3;                      // UUID for correlation (max 37 chars)
    uint32 auth_level = 4;                      // 0=none, 1=basic, 2=admin
    oneof command {                             // One command per envelope
        SystemCommand system = 10;
        ConfigCommand config = 11;
        OutputCommand output = 12;
        DiagnosticCommand diagnostic = 13;
        OTACommand ota = 14;
        ConfigReadCommand config_read = 15;
    }
}
```

### Command Response
All commands return a `CommandResponse`:

```protobuf
message CommandResponse {
    string request_id = 1;      // Correlation with request (max 37 chars)
    uint32 timestamp = 2;       // Response timestamp
    bool success = 3;           // Command execution result
    uint32 error_code = 4;      // Error code if failed
    string message = 5;         // Human readable message (max 128 chars)
    bytes payload = 6;          // Response data if any (max 512 bytes)
}
```

### HMAC Wrapper (Optional)
When HMAC authentication is enabled, the protobuf message is wrapped:
```
[payload_len:2][sequence:4][protobuf_payload][hmac:8]
```
- **payload_len**: 2 bytes, big-endian, protobuf message size
- **sequence**: 4 bytes, incrementing counter for anti-replay
- **protobuf_payload**: Actual protobuf encoded message
- **hmac**: Last 8 bytes of HMAC-SHA256 (truncated for efficiency)

---

## 1️⃣ SYSTEM COMMANDS

### SYS_REBOOT
Reinicia el dispositivo con delay opcional.

**Protobuf Definition:**
```protobuf
message SystemCommand {
    SystemAction action = 1;    // SYS_REBOOT (value: 1)
    uint32 delay_seconds = 2;   // Delay antes del reinicio (0-3600)
}
```

**Backend Example (Python):**
```python
import command_pb2
import uuid
import time

# Create command
cmd = command_pb2.CommandEnvelope()
cmd.sequence = 1001
cmd.timestamp = int(time.time())
cmd.request_id = str(uuid.uuid4())
cmd.auth_level = 1
cmd.system.action = command_pb2.SystemCommand.SYS_REBOOT
cmd.system.delay_seconds = 5

# Serialize to bytes
payload = cmd.SerializeToString()

# Publish to MQTT
client.publish("prod/empresa/pb/c/ESP32-001/cmd", payload)
```

**Response Example:**
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": 1704067201,
  "success": true,
  "error_code": 0,
  "message": "Rebooting in 5 seconds"
}
```

### SYS_FACTORY_RESET
Restaura configuración de fábrica y borra NVS completa.

**Protobuf Definition:**
```protobuf
message SystemCommand {
    SystemAction action = 1;    // SYS_FACTORY_RESET (value: 2)
}
```

**Backend Example (Node.js):**
```javascript
const protobuf = require('protobufjs');
const mqtt = require('mqtt');

// Load proto
const root = await protobuf.load('command.proto');
const CommandEnvelope = root.lookupType('esg.alarm.CommandEnvelope');

// Create command
const message = CommandEnvelope.create({
    sequence: 1002,
    timestamp: Math.floor(Date.now() / 1000),
    requestId: uuidv4(),
    authLevel: 2,  // Admin required
    system: {
        action: 'SYS_FACTORY_RESET'
    }
});

// Encode and publish
const buffer = CommandEnvelope.encode(message).finish();
mqttClient.publish('prod/empresa/pb/c/ESP32-001/cmd', buffer);
```

### SYS_GET_STATUS
Obtiene el estado actual del dispositivo.

**Response Payload (JSON):**
```json
{
  "device_id": 12345,
  "hostname": "ESP32-ALARM-001",
  "uptime": 3600,
  "firmware": "v1.0.5-989f981",
  "free_heap": 150000,
  "min_heap": 120000,
  "wifi_connected": true,
  "mqtt_connected": true,
  "eth_interface": 0,
  "ip": "192.168.1.100",
  "rssi": -45
}
```

### SYS_SET_TIME
Configura el tiempo del sistema.

**Backend Example (C#):**
```csharp
var command = new CommandEnvelope
{
    Sequence = 1003,
    Timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
    RequestId = Guid.NewGuid().ToString(),
    AuthLevel = 1,
    System = new SystemCommand
    {
        Action = SystemAction.SysSetTime,
        UnixTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
    }
};

var payload = command.ToByteArray();
await mqttClient.PublishAsync("prod/empresa/pb/c/ESP32-001/cmd", payload);
```

### SYS_CLEAR_COUNTERS
Limpia todos los contadores del sistema.

**Response:**
```json
{
  "success": true,
  "message": "All counters cleared"
}
```

---

## 2️⃣ CONFIGURATION WRITE COMMANDS

### CFG_WIFI
Configura parámetros de WiFi.

**Protobuf Definition:**
```protobuf
message WifiConfig {
    string ssid = 1;         // max 32 chars
    string password = 2;     // max 64 chars
    bool dhcp = 3;           // true=DHCP, false=static
    uint32 static_ip = 4;    // IP as uint32
    uint32 gateway = 5;      // Gateway as uint32
    uint32 netmask = 6;      // Netmask as uint32
}
```

**IP Address Conversion:**
```python
# Convert IP to uint32
def ip_to_uint32(ip_str):
    parts = ip_str.split('.')
    return (int(parts[0]) << 24) | (int(parts[1]) << 16) | \
           (int(parts[2]) << 8) | int(parts[3])

# Example: "192.168.1.100" -> 3232235876

# Convert uint32 to IP
def uint32_to_ip(ip_int):
    return f"{(ip_int >> 24) & 0xFF}.{(ip_int >> 16) & 0xFF}." \
           f"{(ip_int >> 8) & 0xFF}.{ip_int & 0xFF}"
```

**Backend Example (Static IP):**
```python
cmd.config.type = command_pb2.ConfigCommand.CFG_WIFI
cmd.config.wifi.ssid = "CorpNetwork"
cmd.config.wifi.password = "SecurePass123"
cmd.config.wifi.dhcp = False
cmd.config.wifi.static_ip = ip_to_uint32("192.168.1.100")
cmd.config.wifi.gateway = ip_to_uint32("192.168.1.1")
cmd.config.wifi.netmask = ip_to_uint32("255.255.255.0")
```

### CFG_MQTT
Configura parámetros del broker MQTT.

**Protobuf Definition:**
```protobuf
message MqttConfig {
    string broker_url = 1;   // max 128 chars
    uint32 port = 2;         // 1883, 8883, etc
    string username = 3;     // max 32 chars
    string password = 4;     // max 32 chars
    uint32 keepalive = 5;    // seconds (10-3600)
    uint32 qos = 6;          // 0, 1, or 2
    bool use_tls = 7;        // Enable TLS/SSL
}
```

**Backend Example (TLS Configuration):**
```python
cmd.config.type = command_pb2.ConfigCommand.CFG_MQTT
cmd.config.mqtt.broker_url = "mqtt.production.com"
cmd.config.mqtt.port = 8883
cmd.config.mqtt.username = "device_001"
cmd.config.mqtt.password = "mqtt_secure_password"
cmd.config.mqtt.keepalive = 60
cmd.config.mqtt.qos = 1
cmd.config.mqtt.use_tls = True
```

### CFG_DEVICE
Configura parámetros del dispositivo.

**Backend Example:**
```python
cmd.config.type = command_pb2.ConfigCommand.CFG_DEVICE
cmd.config.device.hostname = "ALARM-ZONE-A"
cmd.config.device.device_id = 12345
cmd.config.device.enable_heartbeat = True
cmd.config.device.heartbeat_interval = 30
```

### CFG_LOCATION
Configura ubicación del dispositivo.

**Backend Example:**
```python
cmd.config.type = command_pb2.ConfigCommand.CFG_LOCATION
cmd.config.location.country = "USA"
cmd.config.location.zone = 5
cmd.config.location.latitude = 37.7749
cmd.config.location.longitude = -122.4194
```

### CFG_NTP
Configura sincronización de tiempo NTP.

**Backend Example:**
```python
cmd.config.type = command_pb2.ConfigCommand.CFG_NTP
cmd.config.ntp.server1 = "pool.ntp.org"
cmd.config.ntp.server2 = "time.google.com"
cmd.config.ntp.server3 = "time.cloudflare.com"
cmd.config.ntp.enable_sync = True
cmd.config.ntp.sync_interval = 3600  # 1 hour
cmd.config.ntp.timezone_offset = -28800  # PST (UTC-8)
cmd.config.ntp.timezone_name = "America/Los_Angeles"
```

### CFG_BLE
Configura Bluetooth Low Energy.

**Backend Example (With HMAC Keys):**
```python
# Convert hex string to bytes
adv_key = bytes.fromhex("0123456789ABCDEF" * 4)  # 32 bytes
spp_key = bytes.fromhex("FEDCBA9876543210" * 4)  # 32 bytes

cmd.config.type = command_pb2.ConfigCommand.CFG_BLE
cmd.config.ble.enable = True
cmd.config.ble.device_name = "ESP32-ALARM-BLE"
cmd.config.ble.advertise = True
cmd.config.ble.interval_ms = 1000
cmd.config.ble.adv_hmac_key = adv_key
cmd.config.ble.spp_hmac_key = spp_key
cmd.config.ble.tx_power = 4  # 0-7 range
```

---

## 3️⃣ CONFIGURATION READ COMMANDS

### READ_WIFI
Lee configuración WiFi actual (password enmascarado).

**Protobuf Definition:**
```protobuf
message ConfigReadCommand {
    ReadType type = 1;           // READ_WIFI (value: 1)
    bool include_sensitive = 2;  // Always ignored for security
}
```

**Backend Example:**
```python
cmd.config_read.type = command_pb2.ConfigReadCommand.READ_WIFI
```

**Response Payload (JSON):**
```json
{
  "ssid": "CorpNetwork",
  "password": "******",
  "dhcp": true,
  "ip": "192.168.1.100",
  "netmask": "255.255.255.0",
  "gateway": "192.168.1.1",
  "mac": "AA:BB:CC:DD:EE:FF",
  "rssi": -45,
  "connected": true
}
```

### READ_MQTT
Lee configuración MQTT (password enmascarado).

**Response Payload (JSON):**
```json
{
  "broker": "mqtt.production.com",
  "port": 8883,
  "user": "device_001",
  "password": "******",
  "keepalive": 60,
  "qos": 1,
  "tls": true,
  "connected": true
}
```

### READ_DEVICE
Lee configuración del dispositivo.

**Response Payload (JSON):**
```json
{
  "hostname": "ALARM-ZONE-A",
  "device_id": 12345,
  "hb_enable": true,
  "hb_interval": 30
}
```

### READ_LOCATION
Lee configuración de ubicación.

**Response Payload (JSON):**
```json
{
  "country": "USA",
  "zone": 5,
  "lat": 37.7749,
  "lon": -122.4194
}
```

### READ_NTP
Lee configuración NTP.

**Response Payload (JSON):**
```json
{
  "srv1": "pool.ntp.org",
  "srv2": "time.google.com",
  "srv3": "time.cloudflare.com",
  "sync": true,
  "interval": 3600,
  "tz_offset": -28800,
  "tz": "America/Los_Angeles"
}
```

### READ_BLE
Lee configuración BLE (HMAC keys enmascaradas).

**Response Payload (JSON):**
```json
{
  "enable": true,
  "name": "ESP32-ALARM-BLE",
  "adv": true,
  "interval": 1000,
  "adv_key": "******",
  "spp_key": "******",
  "tx_pwr": 4
}
```

### READ_ALL
Lee todas las configuraciones en una sola respuesta.

**Backend Example:**
```python
cmd.config_read.type = command_pb2.ConfigReadCommand.READ_ALL
```

**Response Payload (JSON):**
```json
{
  "wifi": {
    "ssid": "CorpNetwork",
    "password": "******",
    "dhcp": true,
    "ip": "192.168.1.100"
  },
  "mqtt": {
    "broker": "mqtt.production.com",
    "port": 8883,
    "password": "******"
  },
  "device": {
    "hostname": "ALARM-ZONE-A",
    "device_id": 12345
  },
  "location": {
    "country": "USA",
    "zone": 5
  },
  "ntp": {
    "srv1": "pool.ntp.org",
    "sync": true
  },
  "ble": {
    "enable": true,
    "name": "ESP32-ALARM-BLE"
  }
}
```

---

## 4️⃣ OUTPUT CONTROL COMMANDS

### Output Types
- `OUT_SIREN` (1): Sirena
- `OUT_TURRET` (2): Torreta/Baliza
- `OUT_RELAY1` (3): Relé 1
- `OUT_RELAY2` (4): Relé 2
- `OUT_FAN` (5): Ventilador PWM
- `OUT_ALL` (6): Todas las salidas (excepto FAN)

### Pattern Types
- `PATTERN_OFF` (9): Apagar salida inmediatamente
- `PATTERN_CONSTANT` (1): Estado constante ON/OFF
- `PATTERN_PULSE` (2): Pulsos configurables
- `PATTERN_BLINK_SLOW` (3): Parpadeo lento (2s ON, 5s OFF) *
- `PATTERN_BLINK_FAST` (4): Parpadeo rápido (1s ON, 2s OFF) *
- `PATTERN_DOUBLE_PULSE` (5): Doble pulso con pausa
- `PATTERN_TRIPLE_PULSE` (6): Triple pulso con pausa
- `PATTERN_SOS` (7): Patrón SOS (parcial)
- `PATTERN_STROBE` (8): Estroboscópico (1s ON, 1s OFF) *
- `PATTERN_PWM` (10): Control PWM (solo FAN)
- `PATTERN_CUSTOM` (255): Patrón personalizado (parcial)

*Nota: Los tiempos reales difieren de la documentación proto original

**Protobuf Definition:**
```protobuf
message OutputCommand {
    OutputType output = 1;              // Salida a controlar
    PatternType pattern = 2;            // Patrón a aplicar
    
    // Control básico
    bool state = 3;                     // true=ON, false=OFF (PATTERN_CONSTANT)
    uint32 total_duration = 4;          // Duración total en segundos (0=permanente)
    
    // Control de pulsos (PATTERN_PULSE)
    uint32 pulse_count = 5;             // Número de pulsos (0=infinito)
    uint32 on_duration_ms = 6;          // Duración ON en ms
    uint32 off_duration_ms = 7;         // Duración OFF en ms
    
    // Control avanzado
    uint32 repeat_interval = 8;         // Intervalo entre repeticiones (segundos)
    uint32 custom_data = 9;             // PWM duty cycle (0-100) para FAN
}
```

### Example: Emergency Alarm Activation
```python
# Activate siren and turret for emergency
cmd1 = create_command()
cmd1.output.output = command_pb2.OutputCommand.OUT_SIREN
cmd1.output.pattern = command_pb2.OutputCommand.PATTERN_CONSTANT
cmd1.output.state = True
cmd1.output.total_duration = 120  # 2 minutes

cmd2 = create_command()
cmd2.output.output = command_pb2.OutputCommand.OUT_TURRET
cmd2.output.pattern = command_pb2.OutputCommand.PATTERN_STROBE
cmd2.output.total_duration = 120

# Send both commands
publish(cmd1)
publish(cmd2)
```

### Example: Test Pattern
```python
# Test all outputs with pulse pattern
cmd.output.output = command_pb2.OutputCommand.OUT_ALL
cmd.output.pattern = command_pb2.OutputCommand.PATTERN_PULSE
cmd.output.pulse_count = 3
cmd.output.on_duration_ms = 500
cmd.output.off_duration_ms = 500
cmd.output.total_duration = 5
```

### Example: Fan Temperature Control
```python
# Set fan speed based on temperature
if temperature > 30:
    duty_cycle = 100
elif temperature > 25:
    duty_cycle = 75
elif temperature > 20:
    duty_cycle = 50
else:
    duty_cycle = 25

cmd.output.output = command_pb2.OutputCommand.OUT_FAN
cmd.output.pattern = command_pb2.OutputCommand.PATTERN_PWM
cmd.output.custom_data = duty_cycle
```

### Example: Silent Alarm Mode
```python
# Turn off all audible alarms, keep visual only
cmd1 = create_command()
cmd1.output.output = command_pb2.OutputCommand.OUT_SIREN
cmd1.output.pattern = command_pb2.OutputCommand.PATTERN_OFF

cmd2 = create_command()
cmd2.output.output = command_pb2.OutputCommand.OUT_TURRET
cmd2.output.pattern = command_pb2.OutputCommand.PATTERN_BLINK_SLOW
cmd2.output.total_duration = 300  # 5 minutes

publish(cmd1)
publish(cmd2)
```

---

## 5️⃣ DIAGNOSTIC COMMANDS

### DIAG_MEMORY_INFO
Obtiene información de memoria del sistema.

**Response Payload (JSON):**
```json
{
  "free_heap": 150000,
  "min_heap": 120000,
  "largest_block": 65536,
  "psram_free": 4194304,
  "psram_size": 8388608
}
```

### DIAG_NETWORK_INFO
Obtiene información detallada de red WiFi.

**Response Payload (JSON):**
```json
{
  "wifi": true,
  "ssid": "CorpNetwork",
  "rssi": -45,
  "channel": 6,
  "ip": "192.168.1.100",
  "netmask": "255.255.255.0",
  "gateway": "192.168.1.1",
  "dns1": "8.8.8.8",
  "dns2": "8.8.4.4",
  "mac": "AA:BB:CC:DD:EE:FF",
  "auth_mode": "WPA2_PSK"
}
```

### DIAG_SENSOR_READ
Lee valores del sensor HDC1080.

**Response Payload (JSON):**
```json
{
  "temperature": 25.5,
  "humidity": 65.2,
  "sensor": "HDC1080",
  "status": "ok"
}
```

### DIAG_INOUT_READ
Lee estados de entradas/salidas digitales y PWM.

**Response Payload (JSON):**
```json
{
  "inputs": {
    "panic1": false,
    "panic2": false,
    "box_sw": true,
    "aux1": false,
    "aux2": false
  },
  "outputs": {
    "siren": false,
    "turret": false,
    "relay1": false,
    "relay2": false
  },
  "fan": {
    "running": true,
    "duty_percent": 75,
    "frequency": 25000
  }
}
```

### DIAG_SELF_TEST
Ejecuta auto-diagnóstico (parcialmente implementado).

**Request:**
```python
cmd.diagnostic.action = command_pb2.DiagnosticCommand.DIAG_SELF_TEST
cmd.diagnostic.test_mask = 0xFF  # All tests
```

**Test Mask Bits:**
- Bit 0: Memory test
- Bit 1: WiFi test
- Bit 2: MQTT test
- Bit 3: Sensor test
- Bit 4: I/O test
- Bit 5: Flash test
- Bit 6: RTC test
- Bit 7: Reserved

### DIAG_LOG_DUMP
Extrae logs del sistema (parcialmente implementado).

**Request:**
```python
cmd.diagnostic.action = command_pb2.DiagnosticCommand.DIAG_LOG_DUMP
cmd.diagnostic.log_lines = 100  # Last 100 lines
```

---

## 6️⃣ OTA COMMANDS

### OTA_CHECK_UPDATE
Verifica disponibilidad de actualizaciones.

**Backend Example:**
```python
cmd.ota.action = command_pb2.OTACommand.OTA_CHECK_UPDATE
cmd.ota.url = "https://ota.server.com/firmware/esp32-alarm/manifest.json"
```

**Response Payload (Update Available):**
```json
{
  "update_available": true,
  "current": "v1.0.5",
  "latest": "v1.0.6",
  "size": 1245184,
  "url": "https://ota.server.com/firmware/esp32-alarm/v1.0.6.bin",
  "md5": "5d41402abc4b2a76b9719d911017c592",
  "changelog": "Bug fixes and performance improvements"
}
```

### OTA_START_UPDATE
Inicia actualización OTA.

**Backend Example:**
```python
cmd.ota.action = command_pb2.OTACommand.OTA_START_UPDATE
cmd.ota.url = "https://ota.server.com/firmware/esp32-alarm/v1.0.6.bin"
cmd.ota.md5 = "5d41402abc4b2a76b9719d911017c592"
cmd.ota.size = 1245184
```

### OTA_VALIDATE
Valida partición OTA después de actualización.

**Response Payload:**
```json
{
  "validated": true,
  "first_boot": true,
  "version": "v1.0.6",
  "partition": "ota_0",
  "next_ota": "ota_1"
}
```

### OTA_ROLLBACK
Revierte a la partición anterior.

**Response Payload:**
```json
{
  "success": true,
  "rolled_back_to": "factory",
  "version": "v1.0.4"
}
```

### OTA_GET_STATUS
Obtiene estado detallado del proceso OTA.

**Response Payload (During Update):**
```json
{
  "state": "downloading",
  "in_progress": true,
  "progress": 45,
  "downloaded": 560128,
  "total": 1245184,
  "speed_kbps": 125.5,
  "eta_seconds": 45,
  "version": "v1.0.6",
  "partition": "ota_0",
  "error": ""
}
```

**OTA States:**
- `idle`: Sin actividad OTA
- `connecting`: Conectando al servidor
- `downloading`: Descargando firmware
- `verifying`: Verificando integridad MD5
- `flashing`: Escribiendo a flash
- `completing`: Finalizando proceso
- `success`: Actualización exitosa
- `error`: Error en el proceso

---

## Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| 0    | Success | - |
| 1    | Invalid command | Check command structure |
| 2    | Authentication required | Increase auth_level |
| 3    | Invalid parameters | Verify parameter values |
| 4    | Timeout | Retry command |
| 5    | Device busy | Wait and retry |
| 6    | OTA failed | Check URL and network |
| 7    | Unknown command | Update protocol definition |
| 8    | Connection failed | Check network connectivity |
| 9    | Invalid state | Reset device state |
| 10   | Validation failed | Check firmware integrity |
| 11   | Mark app valid failed | Manual intervention required |
| 12   | Status unavailable | Wait for operation to complete |
| 99   | Protobuf not available | Enable protobuf in device |
| 400  | Bad request | Malformed command |
| 401  | Unauthorized | Invalid auth credentials |
| 403  | Forbidden | Insufficient permissions |
| 500  | Internal error | Device error, check logs |

---

## Authentication Levels

| Level | Description | Commands Allowed |
|-------|-------------|------------------|
| 0 | No authentication | Diagnostic commands only |
| 1 | Basic authentication | System (except factory reset), Output control, Config read |
| 2 | Admin authentication | All commands including Config write, OTA, Factory reset |

---

## Backend Implementation Examples

### Python - Complete Command Handler
```python
import paho.mqtt.client as mqtt
import command_pb2
import uuid
import time
import threading

class DeviceCommandHandler:
    def __init__(self, broker, port, base_topic):
        self.broker = broker
        self.port = port
        self.base_topic = base_topic
        self.client = mqtt.Client()
        self.pending_commands = {}
        self.sequence = 1000
        
    def connect(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(self.broker, self.port)
        self.client.loop_start()
        
    def on_connect(self, client, userdata, flags, rc):
        # Subscribe to all device responses
        client.subscribe(f"{self.base_topic}/pb/d/+/response")
        
    def on_message(self, client, userdata, msg):
        # Parse response
        response = command_pb2.CommandResponse()
        response.ParseFromString(msg.payload)
        
        # Handle response
        if response.request_id in self.pending_commands:
            callback = self.pending_commands[response.request_id]
            callback(response)
            del self.pending_commands[response.request_id]
            
    def send_command(self, device_id, command, callback=None, auth_level=1):
        # Create envelope
        envelope = command_pb2.CommandEnvelope()
        envelope.sequence = self.sequence
        self.sequence += 1
        envelope.timestamp = int(time.time())
        envelope.request_id = str(uuid.uuid4())
        envelope.auth_level = auth_level
        
        # Add command to envelope
        if isinstance(command, command_pb2.SystemCommand):
            envelope.system.CopyFrom(command)
        elif isinstance(command, command_pb2.ConfigCommand):
            envelope.config.CopyFrom(command)
        elif isinstance(command, command_pb2.OutputCommand):
            envelope.output.CopyFrom(command)
        elif isinstance(command, command_pb2.DiagnosticCommand):
            envelope.diagnostic.CopyFrom(command)
        elif isinstance(command, command_pb2.OTACommand):
            envelope.ota.CopyFrom(command)
        elif isinstance(command, command_pb2.ConfigReadCommand):
            envelope.config_read.CopyFrom(command)
            
        # Register callback
        if callback:
            self.pending_commands[envelope.request_id] = callback
            
        # Publish command
        topic = f"{self.base_topic}/pb/c/{device_id}/cmd"
        payload = envelope.SerializeToString()
        self.client.publish(topic, payload)
        
        return envelope.request_id
        
    def reboot_device(self, device_id, delay=5):
        cmd = command_pb2.SystemCommand()
        cmd.action = command_pb2.SystemCommand.SYS_REBOOT
        cmd.delay_seconds = delay
        
        def on_response(response):
            if response.success:
                print(f"Device {device_id} rebooting in {delay} seconds")
            else:
                print(f"Reboot failed: {response.message}")
                
        self.send_command(device_id, cmd, on_response)
        
    def configure_wifi(self, device_id, ssid, password):
        cmd = command_pb2.ConfigCommand()
        cmd.type = command_pb2.ConfigCommand.CFG_WIFI
        cmd.wifi.ssid = ssid
        cmd.wifi.password = password
        cmd.wifi.dhcp = True
        
        def on_response(response):
            if response.success:
                print(f"WiFi configured for {device_id}")
            else:
                print(f"WiFi config failed: {response.message}")
                
        self.send_command(device_id, cmd, on_response, auth_level=2)
        
    def activate_alarm(self, device_id, duration=60):
        # Send multiple commands for full alarm activation
        commands = []
        
        # Siren
        cmd1 = command_pb2.OutputCommand()
        cmd1.output = command_pb2.OutputCommand.OUT_SIREN
        cmd1.pattern = command_pb2.OutputCommand.PATTERN_CONSTANT
        cmd1.state = True
        cmd1.total_duration = duration
        commands.append(cmd1)
        
        # Turret strobe
        cmd2 = command_pb2.OutputCommand()
        cmd2.output = command_pb2.OutputCommand.OUT_TURRET
        cmd2.pattern = command_pb2.OutputCommand.PATTERN_STROBE
        cmd2.total_duration = duration
        commands.append(cmd2)
        
        # Send all commands
        for cmd in commands:
            self.send_command(device_id, cmd)
            time.sleep(0.1)  # Small delay between commands
            
    def get_device_status(self, device_id):
        cmd = command_pb2.SystemCommand()
        cmd.action = command_pb2.SystemCommand.SYS_GET_STATUS
        
        def on_response(response):
            if response.success and response.payload:
                import json
                status = json.loads(response.payload.decode('utf-8'))
                print(f"Device {device_id} status:")
                print(json.dumps(status, indent=2))
            else:
                print(f"Status request failed: {response.message}")
                
        self.send_command(device_id, cmd, on_response)

# Usage example
handler = DeviceCommandHandler("mqtt.server.com", 1883, "prod/empresa")
handler.connect()

# Configure device
handler.configure_wifi("ESP32-001", "NewNetwork", "Password123")

# Get status
handler.get_device_status("ESP32-001")

# Activate alarm
handler.activate_alarm("ESP32-001", duration=30)
```

### Node.js - Async/Await Implementation
```javascript
const mqtt = require('mqtt');
const protobuf = require('protobufjs');
const { v4: uuidv4 } = require('uuid');

class DeviceController {
    constructor(brokerUrl, baseTopic) {
        this.brokerUrl = brokerUrl;
        this.baseTopic = baseTopic;
        this.client = null;
        this.root = null;
        this.sequence = 1000;
        this.pendingCommands = new Map();
    }
    
    async initialize() {
        // Load protobuf schema
        this.root = await protobuf.load('command.proto');
        this.CommandEnvelope = this.root.lookupType('esg.alarm.CommandEnvelope');
        this.CommandResponse = this.root.lookupType('esg.alarm.CommandResponse');
        
        // Connect MQTT
        this.client = mqtt.connect(this.brokerUrl);
        
        return new Promise((resolve) => {
            this.client.on('connect', () => {
                this.client.subscribe(`${this.baseTopic}/pb/d/+/response`);
                this.client.on('message', this.handleMessage.bind(this));
                resolve();
            });
        });
    }
    
    handleMessage(topic, message) {
        try {
            const response = this.CommandResponse.decode(message);
            const pending = this.pendingCommands.get(response.requestId);
            
            if (pending) {
                pending.resolve(response);
                this.pendingCommands.delete(response.requestId);
            }
        } catch (error) {
            console.error('Error parsing response:', error);
        }
    }
    
    async sendCommand(deviceId, command, authLevel = 1) {
        const requestId = uuidv4();
        
        const envelope = {
            sequence: this.sequence++,
            timestamp: Math.floor(Date.now() / 1000),
            requestId: requestId,
            authLevel: authLevel,
            ...command
        };
        
        const message = this.CommandEnvelope.create(envelope);
        const buffer = this.CommandEnvelope.encode(message).finish();
        
        const topic = `${this.baseTopic}/pb/c/${deviceId}/cmd`;
        
        return new Promise((resolve, reject) => {
            // Set timeout
            const timeout = setTimeout(() => {
                this.pendingCommands.delete(requestId);
                reject(new Error('Command timeout'));
            }, 10000);
            
            // Register callback
            this.pendingCommands.set(requestId, {
                resolve: (response) => {
                    clearTimeout(timeout);
                    resolve(response);
                },
                reject
            });
            
            // Send command
            this.client.publish(topic, buffer);
        });
    }
    
    async readAllConfig(deviceId) {
        const response = await this.sendCommand(deviceId, {
            configRead: {
                type: 'READ_ALL'
            }
        });
        
        if (response.success && response.payload) {
            return JSON.parse(response.payload.toString());
        }
        
        throw new Error(response.message || 'Failed to read config');
    }
    
    async updateFirmware(deviceId, firmwareUrl, md5) {
        // Start update
        const startResponse = await this.sendCommand(deviceId, {
            ota: {
                action: 'OTA_START_UPDATE',
                url: firmwareUrl,
                md5: md5
            }
        }, 2);
        
        if (!startResponse.success) {
            throw new Error(startResponse.message);
        }
        
        // Poll status
        let status;
        do {
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const statusResponse = await this.sendCommand(deviceId, {
                ota: {
                    action: 'OTA_GET_STATUS'
                }
            });
            
            if (statusResponse.payload) {
                status = JSON.parse(statusResponse.payload.toString());
                console.log(`OTA Progress: ${status.progress}%`);
            }
        } while (status && status.in_progress);
        
        return status;
    }
}

// Usage
(async () => {
    const controller = new DeviceController('mqtt://broker.com', 'prod/empresa');
    await controller.initialize();
    
    // Read all configuration
    const config = await controller.readAllConfig('ESP32-001');
    console.log('Device config:', config);
    
    // Update firmware
    try {
        const result = await controller.updateFirmware(
            'ESP32-001',
            'https://ota.server.com/firmware.bin',
            '5d41402abc4b2a76b9719d911017c592'
        );
        console.log('Firmware update completed:', result);
    } catch (error) {
        console.error('Firmware update failed:', error);
    }
})();
```

---

## Security Considerations

### 1. HMAC Authentication
When enabled, wrap protobuf messages with HMAC-SHA256:
```python
import hmac
import hashlib
import struct

def wrap_with_hmac(protobuf_payload, sequence, hmac_key):
    # Prepare data
    payload_len = len(protobuf_payload)
    
    # Create message: [len:2][seq:4][payload]
    message = struct.pack('>HI', payload_len, sequence) + protobuf_payload
    
    # Calculate HMAC
    h = hmac.new(hmac_key, message, hashlib.sha256)
    hmac_signature = h.digest()[:8]  # Truncate to 8 bytes
    
    # Return wrapped message
    return message + hmac_signature
```

### 2. Timestamp Validation
Commands are rejected if timestamp is outside 5-minute window:
```python
def is_timestamp_valid(timestamp):
    current = int(time.time())
    diff = abs(current - timestamp)
    return diff <= 300  # 5 minutes
```

### 3. Sequence Counter
Prevent replay attacks by tracking sequence numbers:
```python
class SequenceTracker:
    def __init__(self, window_size=1000):
        self.last_sequence = 0
        self.seen_sequences = set()
        self.window_size = window_size
        
    def is_valid(self, sequence):
        if sequence in self.seen_sequences:
            return False  # Replay detected
            
        if sequence <= self.last_sequence - self.window_size:
            return False  # Too old
            
        self.seen_sequences.add(sequence)
        if sequence > self.last_sequence:
            self.last_sequence = sequence
            
        # Clean old sequences
        if len(self.seen_sequences) > self.window_size * 2:
            min_valid = self.last_sequence - self.window_size
            self.seen_sequences = {s for s in self.seen_sequences if s > min_valid}
            
        return True
```

---

## Testing & Debugging

### 1. Command Line Testing with mosquitto_pub
```bash
# Encode protobuf to hex and publish
echo -n "080110e807180a2a24353530653834..." | xxd -r -p | \
  mosquitto_pub -h mqtt.server.com -t "prod/empresa/pb/c/ESP32-001/cmd" -s

# Subscribe to responses
mosquitto_sub -h mqtt.server.com -t "prod/empresa/pb/d/+/response" -v
```

### 2. Protobuf Debugging
```python
# Decode received protobuf for debugging
def debug_protobuf(payload_bytes):
    try:
        response = command_pb2.CommandResponse()
        response.ParseFromString(payload_bytes)
        print("Decoded response:")
        print(f"  Request ID: {response.request_id}")
        print(f"  Success: {response.success}")
        print(f"  Message: {response.message}")
        if response.payload:
            try:
                json_data = json.loads(response.payload)
                print(f"  Payload: {json.dumps(json_data, indent=2)}")
            except:
                print(f"  Payload (hex): {response.payload.hex()}")
    except Exception as e:
        print(f"Failed to decode: {e}")
        print(f"Raw hex: {payload_bytes.hex()}")
```

### 3. Load Testing
```python
import asyncio
import aiohttp

async def stress_test(device_id, num_commands=100):
    tasks = []
    
    for i in range(num_commands):
        # Create different command types
        if i % 3 == 0:
            cmd = create_diagnostic_command()
        elif i % 3 == 1:
            cmd = create_output_command(pattern='PATTERN_PULSE')
        else:
            cmd = create_read_config_command()
            
        task = send_command_async(device_id, cmd)
        tasks.append(task)
        
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    success = sum(1 for r in results if not isinstance(r, Exception))
    print(f"Success rate: {success}/{num_commands} ({success*100/num_commands:.1f}%)")
```

---

## Best Practices

### 1. Command Batching
Group related commands to reduce network overhead:
```python
def configure_device_complete(device_id, config):
    commands = []
    
    # WiFi config
    if 'wifi' in config:
        cmd = create_wifi_config(config['wifi'])
        commands.append(('wifi', cmd))
        
    # MQTT config
    if 'mqtt' in config:
        cmd = create_mqtt_config(config['mqtt'])
        commands.append(('mqtt', cmd))
        
    # Send with delays
    for name, cmd in commands:
        response = send_command(device_id, cmd, auth_level=2)
        if not response.success:
            print(f"Failed to configure {name}: {response.message}")
            return False
        time.sleep(1)  # Allow device to process
        
    return True
```

### 2. Error Recovery
Implement retry logic with exponential backoff:
```python
async def send_with_retry(device_id, command, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = await send_command(device_id, command)
            if response.success:
                return response
                
            if response.error_code in [4, 5]:  # Timeout or busy
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
                continue
            else:
                return response  # Non-retryable error
                
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)
            
    raise Exception("Max retries exceeded")
```

### 3. State Management
Track device states in backend:
```python
class DeviceStateManager:
    def __init__(self):
        self.devices = {}
        
    def update_state(self, device_id, state_update):
        if device_id not in self.devices:
            self.devices[device_id] = {
                'last_seen': time.time(),
                'config': {},
                'status': {},
                'alarms': []
            }
            
        device = self.devices[device_id]
        device['last_seen'] = time.time()
        
        if 'config' in state_update:
            device['config'].update(state_update['config'])
        if 'status' in state_update:
            device['status'].update(state_update['status'])
            
    def is_online(self, device_id, timeout=300):
        if device_id not in self.devices:
            return False
        return time.time() - self.devices[device_id]['last_seen'] < timeout
        
    def get_device_state(self, device_id):
        return self.devices.get(device_id, None)
```

---

## Migration Guide

### From JSON to Protobuf
```python
# Old JSON command
json_cmd = {
    "cmd": "reboot",
    "delay": 5
}

# New Protobuf command
pb_cmd = command_pb2.CommandEnvelope()
pb_cmd.sequence = get_next_sequence()
pb_cmd.timestamp = int(time.time())
pb_cmd.request_id = str(uuid.uuid4())
pb_cmd.auth_level = 1
pb_cmd.system.action = command_pb2.SystemCommand.SYS_REBOOT
pb_cmd.system.delay_seconds = 5

# Size comparison
json_size = len(json.dumps(json_cmd))  # ~30 bytes
pb_size = len(pb_cmd.SerializeToString())  # ~20 bytes
```

---

## Appendix

### A. Quick Reference Card

| Command | Auth | Purpose | Key Parameters |
|---------|------|---------|----------------|
| SYS_REBOOT | 1 | Restart device | delay_seconds |
| SYS_FACTORY_RESET | 2 | Factory reset | - |
| SYS_GET_STATUS | 0 | Get device status | - |
| CFG_WIFI | 2 | Configure WiFi | ssid, password |
| CFG_MQTT | 2 | Configure MQTT | broker_url, port |
| READ_ALL | 1 | Read all config | - |
| OUT_SIREN | 1 | Control siren | pattern, duration |
| DIAG_NETWORK_INFO | 0 | Get network info | - |
| OTA_START_UPDATE | 2 | Start firmware update | url, md5 |

### B. Common Patterns

```python
# Pattern 1: Configure and verify
async def configure_and_verify(device_id, config):
    # Send configuration
    response = await send_config(device_id, config)
    if not response.success:
        return False
        
    # Wait for device to apply
    await asyncio.sleep(2)
    
    # Read back configuration
    current = await read_config(device_id)
    
    # Verify
    return verify_config(config, current)

# Pattern 2: Alarm sequence
def trigger_alarm_sequence(device_id):
    # Phase 1: Warning
    send_output(device_id, 'OUT_TURRET', 'PATTERN_BLINK_SLOW', 10)
    time.sleep(10)
    
    # Phase 2: Alert
    send_output(device_id, 'OUT_TURRET', 'PATTERN_BLINK_FAST', 10)
    send_output(device_id, 'OUT_SIREN', 'PATTERN_PULSE', 10)
    time.sleep(10)
    
    # Phase 3: Full alarm
    send_output(device_id, 'OUT_ALL', 'PATTERN_CONSTANT', 60)

# Pattern 3: Health monitoring
async def monitor_device_health(device_id):
    while True:
        try:
            # Get status
            status = await get_device_status(device_id)
            
            # Check thresholds
            if status['free_heap'] < 50000:
                await send_alert('Low memory', device_id)
            
            if status['rssi'] < -80:
                await send_alert('Weak WiFi signal', device_id)
                
        except Exception as e:
            await send_alert(f'Device offline: {e}', device_id)
            
        await asyncio.sleep(60)  # Check every minute
```

### C. Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| No response | Wrong topic | Check MQTT topic format |
| Error 2 | Auth required | Increase auth_level |
| Error 4 | Timeout | Check network, retry |
| Error 99 | Protobuf disabled | Enable with AT+PBPROTO=1 |
| Truncated response | Buffer too small | Response exceeds 512 bytes |
| HMAC failure | Wrong key | Verify HMAC key configuration |
| Replay detected | Old timestamp | Sync time with NTP |

---

## Version History

- **v1.0.0**: Initial protocol definition
- **v1.1.0**: Added CONFIG_READ commands
- **v1.2.0**: Increased payload buffer to 512 bytes
- **v1.3.0**: Added HMAC wrapper specification
- **v1.4.0**: Added backend implementation examples

---

## Contact

For protocol updates or issues, contact the engineering team.