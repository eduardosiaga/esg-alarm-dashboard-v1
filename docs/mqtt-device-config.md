# MQTT Device Configuration Commands

## Overview
The device can be configured remotely via MQTT using protobuf commands. This includes setting the device database ID, hostname, and location information.

## Command Structure

### Topic
Commands should be sent to: `{topic_base}/pb/d/{hostname}/cmd`

Example: `esagtech/pb/d/ESP32-A1B2C3/cmd`

### Message Format
The message must be a protobuf-encoded `Command` message with:
- `type`: `CMD_CONFIG` (value: 2)
- `config`: A `ConfigCommand` message

## Device Configuration

### Update Device ID and Hostname

To update the device database ID and/or hostname:

```protobuf
Command {
  type: CMD_CONFIG
  config: ConfigCommand {
    type: CFG_DEVICE
    device: DeviceConfig {
      device_id: 12345        // New database ID (must be > 0)
      hostname: "ESP32-NEW"   // New hostname (optional)
    }
  }
}
```

### Fields:
- `device_id`: uint32 - The database ID for the device (must be greater than 0)
- `hostname`: string - The device hostname (max 32 chars, optional)

### Notes:
- If `device_id` is 0 or not provided, it won't be updated
- If `hostname` is empty or not provided, it won't be updated
- Changes are automatically saved to NVS

## Location Configuration

### Update Location Information

```protobuf
Command {
  type: CMD_CONFIG
  config: ConfigCommand {
    type: CFG_LOCATION
    location: LocationConfig {
      country: "US"           // Country code (2 chars)
      zone: 5                 // Zone number
      latitude: 37.7749       // Latitude
      longitude: -122.4194    // Longitude
    }
  }
}
```

### Fields:
- `country`: string - 2-character country code
- `zone`: uint32 - Zone identifier
- `latitude`: float - Latitude in decimal degrees
- `longitude`: float - Longitude in decimal degrees

## Security

### HMAC Protection
For security, it's recommended to enable HMAC verification:

1. Enable HMAC verification on the device:
```
AT+PBVERIFY=1
```

2. When HMAC is enabled, the protobuf message must be wrapped with HMAC:
```
[payload_len:2][sequence:4][protobuf_payload][hmac:8]
```

### Response
The device will respond with a status indicating success or failure.

## Testing

### Using AT Commands (Local Testing)

Test device ID configuration locally:
```
# Set device ID
AT+DBID=12345

# Query current device ID
AT+DBID?

# Set hostname
AT+HOSTNAME=ESP32-TEST
```

### Using MQTT (Remote Testing)

1. **Without HMAC** (for testing only):
```python
import paho.mqtt.client as mqtt
from command_pb2 import Command, ConfigCommand, DeviceConfig

# Create command
cmd = Command()
cmd.type = Command.CMD_CONFIG
cmd.config.type = ConfigCommand.CFG_DEVICE
cmd.config.device.device_id = 12345
cmd.config.device.hostname = "ESP32-NEW"

# Serialize to bytes
payload = cmd.SerializeToString()

# Send via MQTT
client = mqtt.Client()
client.connect("broker.example.com", 1883)
client.publish("esagtech/pb/d/ESP32-A1B2C3/cmd", payload)
```

2. **With HMAC** (production):
```python
import hmac
import hashlib
import struct

def wrap_with_hmac(payload, hmac_key, sequence):
    # Create HMAC wrapper
    payload_len = len(payload)
    
    # Pack header
    wrapped = struct.pack('<HI', payload_len, sequence)
    wrapped += payload
    
    # Calculate HMAC
    h = hmac.new(hmac_key, wrapped[:6+payload_len], hashlib.sha256)
    hmac_bytes = h.digest()[:8]  # Use first 8 bytes
    
    wrapped += hmac_bytes
    return wrapped

# Use the wrapped payload for MQTT publish
wrapped_payload = wrap_with_hmac(payload, hmac_key, sequence_num)
client.publish("esagtech/pb/d/ESP32-A1B2C3/cmd", wrapped_payload)
```

## Monitoring

After configuration, the device will:
1. Log the changes (visible in console if connected)
2. Save to NVS automatically
3. Include the new device_id in subsequent heartbeat and status messages

You can verify the configuration by:
- Checking the next heartbeat message (includes device_db_id)
- Checking the status message (includes device_db_id)
- Using AT commands to query current values