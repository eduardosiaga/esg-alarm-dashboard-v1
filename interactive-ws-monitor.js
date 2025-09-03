const WebSocket = require('ws');
const readline = require('readline');

// Create readline interface for interactive input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'AT> '
});

console.log('Connecting to WebSocket monitor...');
const ws = new WebSocket('ws://localhost:8888');

let authenticated = false;

ws.on('open', () => {
    console.log('Connected to monitor server!');
    console.log('Authenticating...');
    
    // Authenticate first
    ws.send('AT+AUTH=admin,admin123');
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    // Clear the current line and move cursor to beginning (if available)
    if (process.stdout.clearLine) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    }
    
    console.log('\n=== MESSAGE RECEIVED ===');
    console.log('Type:', msg.type);
    
    if (msg.type === 'auth' && msg.success) {
        console.log('✅ Authentication successful!');
        authenticated = true;
        console.log('\n📝 You can now send AT commands. Type "help" for command list.');
        console.log('Examples:');
        console.log('  AT+MODE=both        - Show raw and decoded data');
        console.log('  AT+HMAC=1          - Show HMAC details');
        console.log('  AT+VERBOSE=verbose - Maximum detail');
        console.log('  AT+FILTER=ESG_ALARM_0483080CEDD8 - Filter by device');
        console.log('  AT+STATUS          - Show monitor status');
        console.log('  AT+DEVICES         - List devices');
        console.log('  AT+HELP            - Show all commands');
        console.log('  exit               - Quit the monitor');
        console.log('');
    } else if (msg.type === 'mqtt_message') {
        console.log('\n🔵 MQTT MESSAGE:');
        console.log('Topic:', msg.topic);
        console.log('Direction:', msg.direction);
        console.log('Message Type:', msg.messageType);
        console.log('Hostname:', msg.hostname);
        console.log('Size:', msg.size, 'bytes');
        
        if (msg.raw) {
            console.log('\n📦 RAW DATA (hex):');
            // Handle the new format with hex and hexDump
            if (typeof msg.raw === 'object' && msg.raw.hex) {
                console.log('Hex:', msg.raw.hex);
                if (msg.raw.hexDump) {
                    console.log('\n📊 HEX DUMP:');
                    console.log(msg.raw.hexDump);
                }
            } else {
                // Fallback for old format
                console.log(msg.raw);
            }
        }
        
        if (msg.hmac) {
            console.log('\n🔐 HMAC Info:');
            console.log('  Status:', msg.hmac.valid);
            console.log('  Sequence:', msg.hmac.sequence);
            console.log('  Payload Length:', msg.hmac.payloadLength);
            console.log('  HMAC Value:', msg.hmac.hmacValue);
        }
        
        if (msg.decoded) {
            console.log('\n✅ DECODED MESSAGE:');
            console.log(JSON.stringify(msg.decoded, null, 2));
        }
        
        if (msg.decodeError) {
            console.log('\n❌ DECODE ERROR:');
            console.log(msg.decodeError);
        }
    } else if (msg.type === 'error') {
        console.log('❌ ERROR:', msg.error);
        if (msg.context) {
            console.log('Context:', msg.context);
        }
    } else if (msg.type === 'response') {
        console.log('📢 Response:', msg.message);
    } else if (msg.type === 'status') {
        console.log('\n📊 MONITOR STATUS:');
        console.log('Settings:', JSON.stringify(msg.settings, null, 2));
        if (msg.stats) {
            console.log('Stats:', JSON.stringify(msg.stats, null, 2));
        }
        if (msg.bufferSize) {
            console.log('Buffer Size:', msg.bufferSize);
        }
    } else if (msg.type === 'devices') {
        console.log('\n🖥️ DEVICES:');
        if (msg.devices && msg.devices.length > 0) {
            msg.devices.forEach(dev => {
                console.log(`  - ${dev.hostname}: ${dev.online ? '🟢 Online' : '🔴 Offline'}`);
                if (dev.lastSeen) {
                    console.log(`    Last seen: ${new Date(dev.lastSeen).toLocaleString()}`);
                }
            });
        } else {
            console.log('  No devices connected');
        }
    } else if (msg.type === 'help') {
        console.log('\n📚 AVAILABLE COMMANDS:');
        if (msg.commands) {
            Object.entries(msg.commands).forEach(([cmd, desc]) => {
                console.log(`  ${cmd.padEnd(30)} - ${desc}`);
            });
        }
    } else if (msg.type === 'login_processing') {
        console.log('\n🔑 LOGIN PROCESSING EVENT:');
        console.log('Event:', msg.event);
        
        // Format message based on event type
        switch(msg.event) {
            case 'LOGIN_START':
                console.log('🚀 Processing login message from device');
                console.log('  Topic:', msg.data.topic);
                console.log('  Size:', msg.data.size, 'bytes');
                break;
                
            case 'DEVICE_INFO':
                console.log('📋 Device information extracted:');
                console.log('  MAC Address:', msg.data.macAddress);
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId || 'Not set (needs sync)');
                console.log('  Firmware:', msg.data.firmware);
                break;
                
            case 'DEVICE_FOUND':
                console.log('✅ Device found in database!');
                console.log('  Database ID:', msg.data.dbId);
                console.log('  Hostname:', msg.data.hostname);
                console.log('  MAC Address:', msg.data.macAddress);
                console.log('  Needs Sync:', msg.data.needsSync ? '🔄 YES' : '✅ NO');
                break;
                
            case 'NEW_DEVICE':
                console.log('🆕 New device detected!');
                console.log('  MAC Address:', msg.data.macAddress);
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Action: Creating database record...');
                break;
                
            case 'DEVICE_CREATED':
                console.log('✨ Device record created in database!');
                console.log('  Database ID:', msg.data.dbId);
                console.log('  Hostname:', msg.data.hostname);
                console.log('  MAC Address:', msg.data.macAddress);
                break;
                
            case 'SYNC_NEEDED':
                console.log('🔄 Device needs ID synchronization');
                console.log('  Database ID:', msg.data.dbId);
                console.log('  Current Device ID:', msg.data.deviceDbId || 'None');
                console.log('  Hostname:', msg.data.hostname);
                break;
                
            case 'SYNC_COMMAND_GENERATED':
                console.log('📦 Sync command prepared');
                console.log('  Target DB ID:', msg.data.dbId);
                console.log('  Request ID:', msg.data.requestId);
                console.log('  Command Size:', msg.data.commandSize, 'bytes');
                break;
                
            case 'SYNC_COMMAND_SENT':
                console.log('📡 Sync command sent to device');
                console.log('  Topic:', msg.data.topic);
                console.log('  Database ID:', msg.data.dbId);
                console.log('  Request ID:', msg.data.requestId);
                break;
                
            case 'DEVICE_SYNCED':
                console.log('✅ Device already synchronized');
                console.log('  Database ID:', msg.data.dbId);
                console.log('  Hostname:', msg.data.hostname);
                break;
                
            case 'LOGIN_COMPLETE':
                console.log('🎉 Login processing completed!');
                console.log('  Device:', msg.data.hostname);
                console.log('  Database ID:', msg.data.deviceId);
                console.log('  New Device:', msg.data.isNew ? 'YES' : 'NO');
                console.log('  Sync Command Sent:', msg.data.syncCommandSent ? 'YES' : 'NO');
                console.log('  Request ID:', msg.data.requestId || 'N/A');
                break;
                
            case 'LOGIN_ERROR':
                console.log('❌ Login processing error!');
                console.log('  Message:', msg.data.message);
                if (msg.data.error) {
                    console.log('  Error:', msg.data.error);
                }
                break;
                
            default:
                console.log('Data:', JSON.stringify(msg.data, null, 2));
        }
        
        // Show additional details if available
        if (msg.details) {
            console.log('\n📊 Additional Details:');
            console.log(JSON.stringify(msg.details, null, 2));
        }
    } else if (msg.type === 'status_processing') {
        console.log('\n📊 STATUS PROCESSING EVENT:');
        console.log('Event:', msg.event);
        
        // Format message based on event type
        switch(msg.event) {
            case 'STATUS_START':
                console.log('🚀 Processing status message from device');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Timestamp:', msg.data.timestamp);
                break;
                
            case 'HMAC_UNWRAP':
                console.log('🔓 Unwrapping HMAC wrapper');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Payload size:', msg.data.size, 'bytes');
                break;
                
            case 'DECODE_MESSAGE':
                console.log('📋 Decoding status message');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Protobuf size:', msg.data.payloadSize, 'bytes');
                break;
                
            case 'CHECK_DEVICE_ID':
                console.log('🔍 Checking device sync status');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId || 'Not set (will discard)');
                console.log('  State:', msg.data.state);
                console.log('  Uptime:', msg.data.uptime, 'seconds');
                console.log('  Firmware:', msg.data.firmware);
                break;
                
            case 'DEVICE_FOUND':
                console.log('✅ Device found in database!');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Database ID:', msg.data.deviceDbId);
                console.log('  MAC Address:', msg.data.macAddress);
                console.log('  Has existing status:', msg.data.hasStatus ? 'YES' : 'NO');
                break;
                
            case 'DEVICE_NOT_FOUND':
                console.log('❌ Device not found in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'UPDATE_DATABASE':
                console.log('💾 Updating device status in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                if (msg.data.fieldsToUpdate) {
                    console.log('  Fields being updated:');
                    Object.entries(msg.data.fieldsToUpdate).forEach(([key, value]) => {
                        console.log(`    - ${key}: ${value}`);
                    });
                }
                break;
                
            case 'UPDATE_MEMORY_STORE':
                console.log('📝 Updating in-memory device store');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'STATUS_COMPLETE':
                console.log('✅ Status processing completed successfully!');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'STATUS_ERROR':
                console.log('❌ Error processing status message');
                console.log('  Hostname:', msg.data.hostname || 'unknown');
                console.log('  Error:', msg.data.error);
                break;
                
            default:
                console.log('Data:', JSON.stringify(msg.data, null, 2));
        }
    } else if (msg.type === 'heartbeat_processing') {
        console.log('\n💓 HEARTBEAT PROCESSING EVENT:');
        console.log('Event:', msg.event);
        
        // Format message based on event type
        switch(msg.event) {
            case 'HB_START':
                console.log('🚀 Processing heartbeat message');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Timestamp:', msg.data.timestamp);
                console.log('  Size:', msg.data.size, 'bytes');
                break;
                
            case 'HMAC_UNWRAP':
                console.log('🔓 Unwrapping HMAC wrapper');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Size:', msg.data.size, 'bytes');
                break;
                
            case 'DECODE_MESSAGE':
                console.log('📋 Decoding heartbeat message');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Payload size:', msg.data.payloadSize, 'bytes');
                break;
                
            case 'CHECK_DEVICE_ID':
                console.log('🔍 Checking device ID');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Temperature:', msg.data.temperature, '°C');
                console.log('  Humidity:', msg.data.humidity, '%');
                console.log('  Uptime:', msg.data.uptime, 'seconds');
                if (msg.data.inputs) {
                    console.log('  Inputs:', JSON.stringify(msg.data.inputs));
                }
                if (msg.data.outputs) {
                    console.log('  Outputs:', JSON.stringify(msg.data.outputs));
                }
                break;
                
            case 'DEVICE_FOUND':
                console.log('✅ Device found in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  MAC Address:', msg.data.macAddress);
                console.log('  Has status:', msg.data.hasStatus);
                break;
                
            case 'DEVICE_NOT_FOUND':
                console.log('❌ Device not found in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'CHECK_CDC':
                console.log('🔄 Change Data Capture check');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Change Type:', msg.data.changeType);
                console.log('  Should Save:', msg.data.shouldSave);
                break;
                
            case 'UPDATE_DATABASE':
                console.log('💾 Updating device status in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                if (msg.data.fieldsToUpdate) {
                    console.log('  Fields:', JSON.stringify(msg.data.fieldsToUpdate, null, 2));
                }
                break;
                
            case 'SAVE_HEARTBEAT':
                console.log('📊 Saving heartbeat to timeseries table');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Change Type:', msg.data.changeType);
                break;
                
            case 'UPDATE_MEMORY_STORE':
                console.log('🧠 Updating in-memory device store');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'HB_COMPLETE':
                console.log('✅ Heartbeat processing complete');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Success:', msg.data.success);
                console.log('  Change Type:', msg.data.changeType);
                break;
                
            case 'HB_ERROR':
                console.log('❌ Error processing heartbeat');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Error:', msg.data.error);
                break;
                
            default:
                console.log('  Unknown event data:', JSON.stringify(msg.data, null, 2));
        }
        console.log('---');
        
    } else if (msg.type === 'alarm_processing') {
        console.log('\n🚨 ALARM PROCESSING EVENT:');
        console.log('Event:', msg.event);
        
        // Format message based on event type
        switch(msg.event) {
            case 'ALARM_START':
                console.log('🚀 Processing alarm message');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Timestamp:', msg.data.timestamp);
                console.log('  Size:', msg.data.size, 'bytes');
                break;
                
            case 'HMAC_UNWRAP':
                console.log('🔓 Unwrapping HMAC wrapper');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Size:', msg.data.size, 'bytes');
                break;
                
            case 'DECODE_MESSAGE':
                console.log('📋 Decoding alarm message');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Payload size:', msg.data.payloadSize, 'bytes');
                break;
                
            case 'CHECK_DEVICE_ID':
                console.log('🔍 Checking device ID');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Alarm Type:', msg.data.alarmType);
                console.log('  Event State:', msg.data.eventState);
                console.log('  Priority:', msg.data.priority);
                console.log('  Physical State:', msg.data.physicalState);
                break;
                
            case 'DEVICE_FOUND':
                console.log('✅ Device found in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  MAC Address:', msg.data.macAddress);
                break;
                
            case 'DEVICE_NOT_FOUND':
                console.log('❌ Device not found in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'CHECK_ALARM_TYPE':
                console.log('🔔 Checking alarm type');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Alarm Type:', msg.data.alarmType);
                console.log('  State:', msg.data.state);
                console.log('  Is Input Alarm:', msg.data.isInputAlarm);
                console.log('  Is Output Event:', msg.data.isOutputEvent);
                break;
                
            case 'UPDATE_DEVICE_STATE':
                console.log('💾 Updating device state');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Update Type:', msg.data.updateType);
                if (msg.data.alarmType) {
                    console.log('  Alarm Type:', msg.data.alarmType);
                }
                if (msg.data.outputType !== undefined) {
                    console.log('  Output Type:', msg.data.outputType);
                }
                console.log('  New State:', msg.data.newState);
                break;
                
            case 'SAVE_ALARM_EVENT':
                console.log('📊 Saving alarm event to database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Alarm Type:', msg.data.alarmType);
                console.log('  State:', msg.data.state);
                console.log('  Priority:', msg.data.priority);
                break;
                
            case 'UPDATE_COUNTERS':
                console.log('🔢 Updating alarm counters');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Counter Type:', msg.data.counterType);
                break;
                
            case 'UPDATE_MEMORY_STORE':
                console.log('🧠 Updating in-memory device store');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'ALARM_COMPLETE':
                console.log('✅ Alarm processing complete');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Success:', msg.data.success);
                console.log('  Alarm Type:', msg.data.alarmType);
                console.log('  State:', msg.data.state);
                break;
                
            case 'ALARM_ERROR':
                console.log('❌ Error processing alarm');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Error:', msg.data.error);
                break;
                
            default:
                console.log('  Unknown event data:', JSON.stringify(msg.data, null, 2));
        }
        console.log('---');
        
    } else if (msg.type === 'lastwill_processing') {
        console.log('\n💀 LAST WILL PROCESSING EVENT:');
        console.log('Event:', msg.event);
        
        // Format message based on event type
        switch(msg.event) {
            case 'LW_START':
                console.log('🚀 Processing Last Will message (device disconnected unexpectedly)');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Timestamp:', msg.data.timestamp);
                console.log('  Info:', msg.data.info);
                break;
                
            case 'HMAC_UNWRAP':
                console.log('🔓 Unwrapping HMAC wrapper');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Payload size:', msg.data.size, 'bytes');
                break;
                
            case 'DECODE_MESSAGE':
                console.log('📋 Decoding Last Will message');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Protobuf size:', msg.data.payloadSize, 'bytes');
                break;
                
            case 'CHECK_DEVICE_ID':
                console.log('🔍 Checking device information from Last Will');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId || 'Not set (will discard)');
                console.log('  Uptime at connect:', msg.data.uptimeAtConnect, 'seconds');
                console.log('  Firmware:', msg.data.firmware);
                console.log('  IP Address:', msg.data.ipAddress);
                console.log('  RSSI:', msg.data.rssi, 'dBm');
                console.log('  Timestamp:', new Date(msg.data.timestamp * 1000).toLocaleString());
                break;
                
            case 'DEVICE_FOUND':
                console.log('✅ Device found in database!');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Database ID:', msg.data.deviceDbId);
                console.log('  MAC Address:', msg.data.macAddress);
                console.log('  DB Hostname:', msg.data.dbHostname);
                break;
                
            case 'DEVICE_NOT_FOUND':
                console.log('❌ Device not found in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'UPDATE_OFFLINE_STATUS':
                console.log('🔴 Marking device as OFFLINE');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                if (msg.data.fieldsToUpdate) {
                    console.log('  Status being updated:');
                    Object.entries(msg.data.fieldsToUpdate).forEach(([key, value]) => {
                        console.log(`    - ${key}: ${value}`);
                    });
                }
                break;
                
            case 'UPDATE_DATABASE':
                console.log('💾 Database updated with offline status');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Success:', msg.data.success ? 'YES' : 'NO');
                break;
                
            case 'UPDATE_MEMORY_STORE':
                console.log('📝 Updating in-memory device store');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                break;
                
            case 'LW_COMPLETE':
                console.log('✅ Last Will processing completed!');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device DB ID:', msg.data.deviceDbId);
                console.log('  Device is now:', msg.data.deviceNowOffline ? '🔴 OFFLINE' : 'ONLINE');
                break;
                
            case 'LW_ERROR':
                console.log('❌ Error processing Last Will message');
                console.log('  Hostname:', msg.data.hostname || 'unknown');
                console.log('  Error:', msg.data.error);
                break;
                
            default:
                console.log('Data:', JSON.stringify(msg.data, null, 2));
        }
        
    } else if (msg.type === 'command_sent') {
        console.log('\n📤 COMMAND SENT:');
        console.log('Timestamp:', msg.timestamp);
        console.log('Topic:', msg.topic);
        console.log('Hostname:', msg.hostname);
        console.log('Size:', msg.size, 'bytes');
        
        if (msg.details) {
            console.log('Details:');
            if (msg.details.type) console.log('  Type:', msg.details.type);
            if (msg.details.deviceId) console.log('  Device ID:', msg.details.deviceId);
            if (msg.details.hostname) console.log('  Hostname:', msg.details.hostname);
            if (msg.details.requestId) console.log('  Request ID:', msg.details.requestId);
        }
        
        if (msg.summary) {
            console.log('Summary:', msg.summary);
        } else if (msg.raw) {
            console.log('Raw (preview):', msg.raw);
        }
        
        if (msg.fullRaw) {
            console.log('Full Raw:', msg.fullRaw);
        }
        
    } else if (msg.type === 'response_processing') {
        console.log('\n📥 RESPONSE PROCESSING EVENT:');
        console.log('Event:', msg.event);
        
        // Format message based on event type
        switch(msg.event) {
            case 'RESPONSE_START':
                console.log('🚀 Processing command response');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Topic:', msg.data.topic);
                console.log('  Size:', msg.data.size, 'bytes');
                break;
                
            case 'RESPONSE_DECODED':
                console.log('✅ Response decoded successfully');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Request ID:', msg.data.requestId);
                console.log('  Success:', msg.data.success ? '✅ YES' : '❌ NO');
                if (msg.data.errorCode > 0) {
                    console.log('  Error Code:', msg.data.errorCode);
                }
                if (msg.data.message) {
                    console.log('  Message:', msg.data.message);
                }
                break;
                
            case 'DEVICE_NOT_FOUND':
                console.log('⚠️ Device not found in database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Warning:', msg.data.warning);
                break;
                
            case 'RESPONSE_SAVED':
                console.log('💾 Response saved to database');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device ID:', msg.data.deviceId);
                console.log('  Request ID:', msg.data.requestId);
                break;
                
            case 'COMMAND_STATUS_UPDATED':
                console.log('📊 Command status updated');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Request ID:', msg.data.requestId);
                console.log('  New Status:', msg.data.status);
                break;
                
            case 'RESPONSE_COMPLETE':
                console.log('✅ Response processing completed!');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device ID:', msg.data.deviceId);
                console.log('  Request ID:', msg.data.requestId);
                console.log('  Success:', msg.data.success ? '✅' : '❌');
                if (msg.data.errorCode > 0) {
                    console.log('  Error Code:', msg.data.errorCode);
                }
                if (msg.data.message) {
                    console.log('  Message:', msg.data.message);
                }
                break;
                
            case 'HMAC_INVALID':
                console.log('⚠️ HMAC validation failed');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Warning:', msg.data.warning);
                break;
                
            case 'SAVE_ERROR':
                console.log('❌ Error saving response');
                console.log('  Hostname:', msg.data.hostname);
                console.log('  Device ID:', msg.data.deviceId);
                console.log('  Error:', msg.data.error);
                break;
                
            case 'RESPONSE_ERROR':
                console.log('❌ Error processing response');
                console.log('  Hostname:', msg.data.hostname || 'unknown');
                console.log('  Error:', msg.data.error);
                break;
                
            default:
                console.log('  Unknown event data:', JSON.stringify(msg.data, null, 2));
        }
        console.log('---');
    }
    
    console.log('========================\n');
    
    // Show prompt again
    rl.prompt();
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
    rl.close();
    process.exit(0);
});

// Handle user input
rl.on('line', (line) => {
    const input = line.trim();
    
    if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        console.log('Closing connection...');
        ws.close();
        rl.close();
        process.exit(0);
    } else if (input.toLowerCase() === 'help') {
        if (authenticated) {
            ws.send('AT+HELP');
        } else {
            console.log('Not authenticated yet. Please wait...');
        }
    } else if (input.toUpperCase().startsWith('AT')) {
        if (authenticated) {
            console.log(`Sending: ${input}`);
            ws.send(input);
        } else {
            console.log('Not authenticated yet. Please wait...');
        }
    } else if (input !== '') {
        console.log('Commands must start with "AT". Type "help" for command list or "exit" to quit.');
    }
    
    rl.prompt();
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\nClosing connection...');
    ws.close();
    rl.close();
    process.exit(0);
});

console.log('Interactive monitor client started.');
console.log('Note: Heartbeats are sent every 30 seconds by ESP32 devices.');