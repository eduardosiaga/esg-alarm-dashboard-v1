# Protobuf AT Commands Quick Reference

## Configuration Commands

### AT+PBJSON
**Enable/Disable JSON heartbeat messages**
```
AT+PBJSON=<enable>
```
- `enable`: 0 = Disable, 1 = Enable (default)
- Example: `AT+PBJSON=1` - Enable JSON heartbeat
- Response: `OK` or `ERROR`

### AT+PBPROTO
**Enable/Disable Protobuf heartbeat messages**
```
AT+PBPROTO=<enable>
```
- `enable`: 0 = Disable, 1 = Enable
- Example: `AT+PBPROTO=1` - Enable protobuf heartbeat
- Response: `OK` or `ERROR`

### AT+PBHMAC
**Enable/Disable HMAC authentication for protobuf**
```
AT+PBHMAC=<enable>
```
- `enable`: 0 = Disable, 1 = Enable
- Example: `AT+PBHMAC=1` - Enable HMAC
- Response: `OK` or `ERROR`
- Note: Requires HMAC key to be set with AT+PBKEY

### AT+PBKEY
**Set HMAC-SHA256 key for protobuf authentication**
```
AT+PBKEY=<hex_key>
```
- `hex_key`: 64 hexadecimal characters (32 bytes)
- Example: `AT+PBKEY=0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF`
- Response: `OK` or `ERROR: Invalid key`
- Note: Key must be exactly 64 hex characters

### AT+PBSHOW
**Display current protobuf configuration**
```
AT+PBSHOW
```
- No parameters
- Response:
  ```
  JSON: ENABLED/DISABLED
  PROTOBUF: ENABLED/DISABLED
  HMAC: ENABLED/DISABLED
  KEY: <64-char hex key or "NOT SET">
  OK
  ```

## Usage Examples

### Basic Setup
```
# Enable protobuf with HMAC
AT+PBPROTO=1
AT+PBHMAC=1
AT+PBKEY=DEADBEEF00112233445566778899AABBCCDDEEFF0123456789ABCDEF01234567
AT+PBSHOW
```

### Dual Format (JSON + Protobuf)
```
# Send both JSON and protobuf heartbeats
AT+PBJSON=1
AT+PBPROTO=1
```

### Protobuf Only
```
# Disable JSON, keep only protobuf
AT+PBJSON=0
AT+PBPROTO=1
```

### Security Best Practices
```
# Always use HMAC in production
AT+PBPROTO=1
AT+PBHMAC=1
AT+PBKEY=<generate-random-32-byte-key>

# Generate random key (Linux/Mac):
# openssl rand -hex 32

# Generate random key (Windows PowerShell):
# -join ((1..32 | ForEach {'{0:X2}' -f (Get-Random -Max 256)}))
```

## Configuration Persistence

All settings are automatically saved to NVS and persist across:
- Device reboots
- Power cycles
- Firmware updates (with version migration)

## MQTT Topics

When protobuf is enabled, messages are sent to:
- **JSON**: `{base}/d/{hostname}/hb`
- **Protobuf**: `{base}/pb/d/{hostname}/hb`

Example with base topic `iot/devices`:
- JSON: `iot/devices/d/ESP32-ABCD1234/hb`
- Protobuf: `iot/devices/pb/d/ESP32-ABCD1234/hb`

## Message Format

### Protobuf without HMAC
Direct binary protobuf encoding of heartbeat message

### Protobuf with HMAC
```
[length:2][sequence:4][protobuf_payload][hmac:32]
```
- **length**: 2 bytes, big-endian, protobuf payload size
- **sequence**: 4 bytes, big-endian, anti-replay counter
- **protobuf_payload**: Variable length protobuf data
- **hmac**: 32 bytes, HMAC-SHA256(length|sequence|payload)

## Error Codes

- `ERROR: Invalid parameter` - Value must be 0 or 1
- `ERROR: Invalid key` - Key must be 64 hex characters
- `ERROR: NVS save failed` - Flash storage error
- `ERROR: Unknown command` - Command not recognized