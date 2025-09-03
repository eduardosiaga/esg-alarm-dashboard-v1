# AT Commands Reference

This document provides a comprehensive reference for all AT commands supported by the ESP32-WROVER Alarm System V2.

## Command Format
- All commands start with `AT+`
- Commands are case-sensitive
- Commands end with `\r\n` (carriage return + line feed)
- Query commands typically end with `?`
- Set commands use `=` followed by the value(s)

## System Commands

### Device Information

| Command | Description | Example |
|---------|-------------|---------|
| `AT+VERSION` | Show firmware version | `AT+VERSION` |
| `AT+INFO` | Show system information | `AT+INFO` |
| `AT+HEAP` | Show memory status | `AT+HEAP` |
| `AT+MAC` | Show device MAC addresses | `AT+MAC` |
| `AT+RESET` | Restart system | `AT+RESET` |
| `AT+HISTORY` | Show command history | `AT+HISTORY` |
| `AT+CLEARHIST` | Clear command history | `AT+CLEARHIST` |
| `AT+HELP` | Show help for all commands | `AT+HELP` |

### Device Configuration

| Command | Description | Example |
|---------|-------------|---------|
| `AT+HOSTNAME` | Get device hostname | `AT+HOSTNAME` |
| `AT+HOSTNAME=<name>` | Set device hostname (max 32 chars) | `AT+HOSTNAME=ESP32-ALARM` |
| `AT+DBID` | Get device database ID | `AT+DBID` |
| `AT+DBID?` | Query device database ID | `AT+DBID?` |
| `AT+DBID=<id>` | Set device database ID (0-4294967295) | `AT+DBID=12345` |

### Location Configuration

| Command | Description | Example |
|---------|-------------|---------|
| `AT+COUNTRY=<XX>` | Set country code (2 chars) | `AT+COUNTRY=US` |
| `AT+ZONE=<1-255>` | Set zone number | `AT+ZONE=5` |
| `AT+LAT=<value>` | Set latitude (-90.0 to 90.0) | `AT+LAT=37.7749` |
| `AT+LON=<value>` | Set longitude (-180.0 to 180.0) | `AT+LON=-122.4194` |
| `AT+INSTALLTS=<unix>` | Set installation timestamp | `AT+INSTALLTS=1700000000` |
| `AT+LOCSHOW` | Show all location information | `AT+LOCSHOW` |

## Network Commands

### Network Mode

| Command | Description | Example |
|---------|-------------|---------|
| `AT+NETMODE=<mode>` | Set network mode (0=WiFi, 1=Ethernet) | `AT+NETMODE=0` |
| `AT+NETMODE?` | Query current network mode | `AT+NETMODE?` |
| `AT+ETHSTATUS?` | Show Ethernet connection status | `AT+ETHSTATUS?` |
| `AT+NETSTATUS?` | Show network connection status | `AT+NETSTATUS?` |

### WiFi Configuration

| Command | Description | Example |
|---------|-------------|---------|
| `AT+WIFISSID=<ssid>` | Set WiFi SSID | `AT+WIFISSID=MyNetwork` |
| `AT+WIFIPASS=<pass>` | Set WiFi password | `AT+WIFIPASS=MyPassword` |
| `AT+WIFITXPOWER=<dBm>` | Set TX power (2-21 dBm) | `AT+WIFITXPOWER=20` |
| `AT+WIFICHANNEL=<ch>` | Set channel (0=auto, 1-13) | `AT+WIFICHANNEL=0` |
| `AT+WIFIDHCP=<0/1>` | Enable/disable DHCP | `AT+WIFIDHCP=1` |
| `AT+WIFIRECONNECT=<0/1>` | Enable/disable auto-reconnect | `AT+WIFIRECONNECT=1` |
| `AT+WIFIRETRIES=<n>` | Set max reconnect retries (0-255) | `AT+WIFIRETRIES=10` |
| `AT+WIFIRETRYDELAY=<ms>` | Set retry delay in ms (100-60000) | `AT+WIFIRETRYDELAY=5000` |
| `AT+WIFISHOW` | Show WiFi configuration | `AT+WIFISHOW` |
| `AT+WIFISAVE` | Save WiFi config to NVS | `AT+WIFISAVE` |
| `AT+WIFILOAD` | Load WiFi config from NVS | `AT+WIFILOAD` |
| `AT+WIFICONNECT` | Connect to WiFi AP | `AT+WIFICONNECT` |
| `AT+WIFIDISCONNECT` | Disconnect from WiFi | `AT+WIFIDISCONNECT` |
| `AT+WIFISTATUS` | Show WiFi connection status | `AT+WIFISTATUS` |

## MQTT Commands

### MQTT Configuration

| Command | Description | Example |
|---------|-------------|---------|
| `AT+MQTTSERVER=<server>` | Set MQTT server | `AT+MQTTSERVER=broker.mqtt.com` |
| `AT+MQTTPORT=<port>` | Set MQTT port | `AT+MQTTPORT=1883` |
| `AT+MQTTUSER=<user>` | Set MQTT username | `AT+MQTTUSER=myuser` |
| `AT+MQTTPASS=<pass>` | Set MQTT password | `AT+MQTTPASS=mypass` |
| `AT+MQTTCLIENT=<id>` | Set MQTT client ID | `AT+MQTTCLIENT=ESP32-001` |
| `AT+MQTTTOPIC=<topic>` | Set MQTT topic base | `AT+MQTTTOPIC=esagtech` |
| `AT+MQTTRECONNECT=<0/1>` | Enable/disable auto-reconnect | `AT+MQTTRECONNECT=1` |
| `AT+MQTTRETRIES=<n>` | Set max reconnect retries (0=infinite) | `AT+MQTTRETRIES=0` |
| `AT+MQTTRETRYDELAY=<ms>` | Set retry delay in ms (100-60000) | `AT+MQTTRETRYDELAY=5000` |
| `AT+MQTTBACKOFF=<ms>` | Set backoff increment (0-10000) | `AT+MQTTBACKOFF=1000` |
| `AT+MQTTSHOW` | Show MQTT configuration | `AT+MQTTSHOW` |
| `AT+MQTTSAVE` | Save MQTT config to NVS | `AT+MQTTSAVE` |
| `AT+MQTTLOAD` | Load MQTT config from NVS | `AT+MQTTLOAD` |

### MQTT Control

| Command | Description | Example |
|---------|-------------|---------|
| `AT+MQTTSSL=<0/1>[,port]` | Enable/disable TLS and optionally set port | `AT+MQTTSSL=1,8883` |
| `AT+MQTTSSL?` | Show TLS status and port | `AT+MQTTSSL?` |
| `AT+MQTTENABLE=<0/1>` | Enable/disable MQTT completely | `AT+MQTTENABLE=1` |
| `AT+MQTTENABLE?` | Show MQTT enabled status | `AT+MQTTENABLE?` |
| `AT+MQTTCONNECT` | Connect to MQTT broker | `AT+MQTTCONNECT` |
| `AT+MQTTDISCONNECT` | Disconnect from MQTT broker | `AT+MQTTDISCONNECT` |
| `AT+MQTTSTATUS` | Show MQTT connection status | `AT+MQTTSTATUS` |

## Protobuf Configuration

| Command | Description | Example |
|---------|-------------|---------|
| `AT+PBJSON=<0/1>` | Enable/disable JSON heartbeat | `AT+PBJSON=1` |
| `AT+PBPROTO=<0/1>` | Enable/disable Protobuf heartbeat | `AT+PBPROTO=1` |
| `AT+PBHMAC=<0/1>` | Enable/disable HMAC for TX protobuf | `AT+PBHMAC=1` |
| `AT+PBVERIFY=<0/1>` | Enable/disable HMAC verification for RX commands | `AT+PBVERIFY=1` |
| `AT+PBKEY=<hex>` | Set HMAC key (64 hex chars = 32 bytes) | `AT+PBKEY=0123456789ABCDEF...` |
| `AT+PBSHOW` | Show protobuf configuration | `AT+PBSHOW` |

## TLS Certificate Commands

| Command | Description | Example |
|---------|-------------|---------|
| `AT+TLSCERT=<url>` | Download and store CA certificate | `AT+TLSCERT=https://example.com/ca.pem` |
| `AT+TLSCERT?` | Show certificate info | `AT+TLSCERT?` |
| `AT+TLSCERTDEL` | Delete stored certificate | `AT+TLSCERTDEL` |
| `AT+TLSCERTUPLOAD` | Upload certificate manually (multi-line) | `AT+TLSCERTUPLOAD` |
| `AT+TLSCERTTEST` | Test certificate parsing | `AT+TLSCERTTEST` |
| `AT+TLSCERTRAW` | Show raw certificate data | `AT+TLSCERTRAW` |

## NTP Commands

| Command | Description | Example |
|---------|-------------|---------|
| `AT+NTPENABLE=<0/1>` | Enable/disable NTP sync | `AT+NTPENABLE=1` |
| `AT+NTPSERVER1=<server>` | Set primary NTP server | `AT+NTPSERVER1=pool.ntp.org` |
| `AT+NTPSERVER2=<server>` | Set secondary NTP server | `AT+NTPSERVER2=time.google.com` |
| `AT+NTPSERVER3=<server>` | Set tertiary NTP server | `AT+NTPSERVER3=time.cloudflare.com` |
| `AT+NTPTIMEOUT=<ms>` | Set sync timeout (1000-30000) | `AT+NTPTIMEOUT=5000` |
| `AT+NTPINTERVAL=<hours>` | Set sync interval (1-168) | `AT+NTPINTERVAL=24` |
| `AT+TIMEZONE=<tz>` | Set timezone | `AT+TIMEZONE=CST6CDT,M3.2.0,M11.1.0` |
| `AT+NTPSHOW` | Show NTP configuration | `AT+NTPSHOW` |
| `AT+NTPSAVE` | Save NTP config to NVS | `AT+NTPSAVE` |
| `AT+NTPLOAD` | Load NTP config from NVS | `AT+NTPLOAD` |
| `AT+NTPSYNC` | Force NTP sync now | `AT+NTPSYNC` |
| `AT+NTPSTATUS` | Show NTP sync status | `AT+NTPSTATUS` |
| `AT+TIME?` | Show current system time | `AT+TIME?` |

## Alarm System Commands

### Alarm Control

| Command | Description | Example |
|---------|-------------|---------|
| `AT+ARM` | Arm alarm system | `AT+ARM` |
| `AT+DISARM` | Disarm alarm system | `AT+DISARM` |
| `AT+STATUS?` | Show system status | `AT+STATUS?` |
| `AT+TRIGGERS?` | Show trigger count | `AT+TRIGGERS?` |
| `AT+CLEAR` | Clear triggers | `AT+CLEAR` |

### Input/Output Control

| Command | Description | Example |
|---------|-------------|---------|
| `AT+INPUTS?` | Read all input states | `AT+INPUTS?` |
| `AT+OUTPUTS?` | Read all output states | `AT+OUTPUTS?` |
| `AT+SIRENA=<0/1>` | Control siren (0=OFF, 1=ON) | `AT+SIRENA=1` |
| `AT+TORRETA=<0/1>` | Control turret light (0=OFF, 1=ON) | `AT+TORRETA=1` |
| `AT+TESTIO` | Test all outputs | `AT+TESTIO` |

### LED Control

| Command | Description | Example |
|---------|-------------|---------|
| `AT+LEDTEST` | Test WS2812 RGB LED colors | `AT+LEDTEST` |
| `AT+LEDRGB=<R>,<G>,<B>` | Set RGB color (0-255) | `AT+LEDRGB=255,0,0` |
| `AT+LED=<W>,<B>,<G>,<R>` | Control individual LEDs (1=ON, 0=OFF) | `AT+LED=1,0,0,1` |
| `AT+LEDMANUAL=<W>,<B>,<G>,<R>` | Manual LED control (1=ON, 0=OFF) | `AT+LEDMANUAL=1,1,1,1` |

## OTA Update Commands

| Command | Description | Example |
|---------|-------------|---------|
| `AT+OTASTART=<url>` | Start OTA update from URL | `AT+OTASTART=https://example.com/firmware.bin` |
| `AT+OTASTATUS` | Get OTA update status | `AT+OTASTATUS` |
| `AT+OTAABORT` | Abort ongoing OTA update | `AT+OTAABORT` |
| `AT+OTAINFO` | Get partition and version info | `AT+OTAINFO` |
| `AT+OTAVALIDATE` | Validate current firmware | `AT+OTAVALIDATE` |
| `AT+OTAROLLBACK` | Rollback to previous firmware | `AT+OTAROLLBACK` |

## RS485 Commands

| Command | Description | Example |
|---------|-------------|---------|
| `AT+RS485STATUS` | Get RS485 status and statistics | `AT+RS485STATUS` |
| `AT+RS485SEND=<cmd>,<data>` | Send RS485 command | `AT+RS485SEND=01,Hello` |
| `AT+RS485CONFIG` | Get RS485 configuration | `AT+RS485CONFIG` |

## BLE Commands

| Command | Description | Example |
|---------|-------------|---------|
| `AT+BLESTATUS` | Get BLE status and statistics | `AT+BLESTATUS` |
| `AT+BLESTART` | Start BLE advertising | `AT+BLESTART` |
| `AT+BLESTOP` | Stop BLE advertising | `AT+BLESTOP` |
| `AT+BLEDISCONNECT` | Disconnect BLE client | `AT+BLEDISCONNECT` |
| `AT+BLEHMAC=<adv_key>,<spp_key>` | Set BLE HMAC keys (32 bytes hex each) | `AT+BLEHMAC=0123...,ABCD...` |

## Fan Control

| Command | Description | Example |
|---------|-------------|---------|
| `AT+FANSET=<duty>` | Set fan speed (0-100%) | `AT+FANSET=50` |
| `AT+FANSTATUS` | Get fan status | `AT+FANSTATUS` |

## Response Codes

All AT commands return one of the following responses:
- `OK` - Command executed successfully
- `ERROR` - Command failed or invalid syntax
- Additional information may be provided before the response code

## Command Examples

### Initial Setup
```
AT+HOSTNAME=ESP32-ALARM-001
AT+DBID=12345
AT+COUNTRY=US
AT+ZONE=5
AT+LAT=37.7749
AT+LON=-122.4194
```

### WiFi Configuration
```
AT+WIFISSID=MyNetwork
AT+WIFIPASS=MyPassword
AT+WIFISAVE
AT+WIFICONNECT
```

### MQTT Configuration
```
AT+MQTTSERVER=broker.mqtt.com
AT+MQTTPORT=1883
AT+MQTTUSER=myuser
AT+MQTTPASS=mypass
AT+MQTTTOPIC=esagtech
AT+MQTTSAVE
AT+MQTTCONNECT
```

### Enable Protobuf with HMAC
```
AT+PBPROTO=1
AT+PBHMAC=1
AT+PBVERIFY=1
AT+PBKEY=0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF
```

## Notes

1. All configuration changes are stored in NVS (Non-Volatile Storage) when using the respective SAVE commands
2. Some commands require the system to be in a specific state (e.g., WiFi must be disconnected to change WiFi settings)
3. HMAC keys must be exactly 64 hexadecimal characters (32 bytes)
4. Network changes may cause temporary disconnections
5. OTA updates will restart the device upon successful completion