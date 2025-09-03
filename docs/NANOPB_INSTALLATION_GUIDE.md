# nanopb Installation and Testing Guide

## Overview
This guide explains how to install nanopb (Protocol Buffers for embedded systems) and test the protobuf heartbeat functionality in the ESP32-WROVER alarm system.

## Installation Steps

### 1. Prerequisites
- Windows PowerShell (run as Administrator recommended)
- Python 3.x installed and in PATH
- ESP-IDF environment configured

### 2. Run Installation Script

Open PowerShell in the project root directory and run:

```powershell
# Allow script execution for this session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Run the installation script
.\scripts\install_nanopb.ps1
```

The script will:
- Download nanopb v0.4.8 from GitHub
- Extract and copy required files to `components/nanopb/nanopb/`
- Generate C files from proto definitions
- Configure CMakeLists.txt with NANOPB_AVAILABLE flag
- Clean up temporary files

### 3. Verify Installation

Check that the following files exist:
```
components/nanopb/
├── pb.h
├── pb_common.h
├── pb_common.c
├── pb_encode.h
├── pb_encode.c
├── pb_decode.h
├── pb_decode.c
└── generator/
    └── nanopb_generator.py

components/protobuf_messages/
├── heartbeat.pb.h
└── heartbeat.pb.c
```

### 4. Rebuild Project

Clean and rebuild the project with nanopb support:

```bash
# Using esg-shell on Windows:
idf.py fullclean
idf.py build

# Flash to device
idf.py -p COM[X] flash monitor
```

## Testing Protobuf Functionality

### 1. Configure Protobuf Settings

Connect to the device console and configure protobuf:

```
# Enable protobuf heartbeat (keeps JSON enabled by default)
AT+PBPROTO=1
OK

# Enable HMAC for security (optional)
AT+PBHMAC=1
OK

# Set HMAC key (32 bytes as 64 hex characters)
AT+PBKEY=0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF
OK

# Verify configuration
AT+PBSHOW
JSON: ENABLED
PROTOBUF: ENABLED
HMAC: ENABLED
KEY: 0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF
OK
```

### 2. MQTT Topic Structure

When protobuf is enabled, heartbeats are sent to different topics:

- **JSON Format**: `{topic_base}/d/{hostname}/hb`
- **Protobuf Format**: `{topic_base}/pb/d/{hostname}/hb`

Example:
- JSON: `iot/devices/d/ESP32-ABCD1234/hb`
- Protobuf: `iot/devices/pb/d/ESP32-ABCD1234/hb`

### 3. Verify Protobuf Messages

Monitor MQTT broker to verify both JSON and protobuf messages:

```bash
# Subscribe to both topics
mosquitto_sub -h broker.address -t "iot/devices/d/+/hb" -t "iot/devices/pb/d/+/hb" -v
```

### 4. Protobuf Message Format

#### Without HMAC
Binary protobuf message directly containing:
- timestamp (uint32)
- device_db_id (uint32)
- temperature (float)
- humidity (float)
- panic1, panic2, siren, turret, box_sw (bool)
- uptime (uint32)
- eth_interface (uint32: 0=WiFi, 1=Ethernet)
- firmware (string, max 16 chars)

#### With HMAC
Format: `[length:2][sequence:4][protobuf_data][hmac:32]`
- length: 2 bytes, payload size
- sequence: 4 bytes, anti-replay counter
- protobuf_data: Variable length protobuf message
- hmac: 32 bytes, HMAC-SHA256 of previous fields

### 5. Decoding Protobuf Messages

To decode received protobuf messages, use Python with protobuf library:

```python
import heartbeat_pb2  # Generated from heartbeat.proto
import binascii

# Example hex string from MQTT
hex_data = "08D4E6..."  
binary_data = binascii.unhexlify(hex_data)

# If HMAC is enabled, extract protobuf portion
if hmac_enabled:
    length = int.from_bytes(binary_data[0:2], 'big')
    sequence = int.from_bytes(binary_data[2:6], 'big')
    protobuf_data = binary_data[6:6+length]
    hmac = binary_data[6+length:6+length+32]
else:
    protobuf_data = binary_data

# Decode protobuf
heartbeat = heartbeat_pb2.Heartbeat()
heartbeat.ParseFromString(protobuf_data)

print(f"Timestamp: {heartbeat.timestamp}")
print(f"Device ID: {heartbeat.device_db_id}")
print(f"Temperature: {heartbeat.temperature}°C")
print(f"Humidity: {heartbeat.humidity}%")
```

## Troubleshooting

### Python Not Found
If the script reports "Python not found", manually generate the files:
```bash
cd main\proto
python ..\..\components\nanopb\generator\nanopb_generator.py ^
  -D ..\..\components\protobuf_messages heartbeat.proto
```

### Build Errors
If you get "NANOPB_AVAILABLE not defined":
1. Ensure the script updated CMakeLists.txt correctly
2. Check `components/nanopb/CMakeLists.txt` contains:
   ```cmake
   add_definitions(-DNANOPB_AVAILABLE)
   ```
3. Run `idf.py fullclean` before rebuilding

### Protobuf Encoding Fails
Check serial monitor for error messages:
- "nanopb not available" - Installation incomplete
- "Encoding failed" - Check heartbeat data fields
- "HMAC key not set" - Configure key with AT+PBKEY

### MQTT Not Receiving
1. Verify MQTT connection: `AT+MQTTSTA`
2. Check protobuf enabled: `AT+PBSHOW`
3. Monitor correct topics (note `/pb/` prefix for protobuf)
4. Ensure broker supports binary payloads

## Configuration Persistence

All protobuf settings are saved in NVS and persist across reboots:
- `send_json`: Enable JSON heartbeat
- `send_protobuf`: Enable protobuf heartbeat
- `protobuf_hmac`: Enable HMAC authentication
- `hmac_key`: 32-byte HMAC key

## Performance Benefits

Compared to JSON format:
- **Size**: ~60-70% smaller messages
- **Processing**: Faster parsing, no string operations
- **Security**: Built-in HMAC authentication
- **Bandwidth**: Reduced network usage
- **Battery**: Lower power consumption for transmission

## Next Steps

1. Add more message types (alarms, configuration, commands)
2. Implement protobuf decoding for incoming messages
3. Add compression for further size reduction
4. Implement key rotation for enhanced security