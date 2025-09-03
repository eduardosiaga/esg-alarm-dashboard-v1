const WebSocket = require('ws');

console.log('Connecting to WebSocket monitor...');
const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected to monitor server!');
    console.log('Authenticating...');
    
    // Authenticate first
    ws.send('AT+AUTH=admin,admin123');
    
    // Configure monitor after auth
    setTimeout(() => {
        console.log('Configuring monitor for HMAC visibility...');
        ws.send('AT+MODE=both');     // Show both raw and decoded
        ws.send('AT+HMAC=1');        // Enable HMAC details
        ws.send('AT+VERBOSE=verbose'); // Verbose output
        ws.send('AT+ERRORS=1');      // Show errors
        ws.send('AT+DIRECTION=in');  // Only incoming messages
        console.log('Monitor configured!');
        console.log('Waiting for messages...\n');
    }, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    if (msg.type === 'mqtt_message') {
        console.log('\n' + '='.repeat(60));
        console.log('🔵 MQTT MESSAGE RECEIVED');
        console.log('='.repeat(60));
        console.log('📍 Topic:', msg.topic);
        console.log('📍 Type:', msg.messageType);
        console.log('📍 Device:', msg.hostname);
        console.log('📍 Size:', msg.size, 'bytes');
        
        // HMAC Information
        if (msg.hmacInfo) {
            console.log('\n🔐 HMAC VALIDATION:');
            console.log('  Wrapped:', msg.hmacInfo.wrapped ? '✅ Yes' : '❌ No');
            console.log('  Valid:', msg.hmacInfo.valid ? '✅ VALID' : '❌ INVALID');
            console.log('  Sequence:', msg.hmacInfo.sequence);
            console.log('  HMAC (8 bytes):', msg.hmacInfo.hmac ? msg.hmacInfo.hmac.substring(0, 16) + '...' : 'N/A');
        } else {
            console.log('\n⚠️  NO HMAC WRAPPER DETECTED');
        }
        
        // Decoded message
        if (msg.decoded) {
            console.log('\n📦 DECODED CONTENT:');
            // Show key fields based on message type
            switch(msg.messageType) {
                case 'hb':
                    console.log('  Uptime:', msg.decoded.uptime, 'seconds');
                    console.log('  Temperature:', msg.decoded.temperature, '°C');
                    console.log('  Firmware:', msg.decoded.firmware);
                    break;
                case 'login':
                case 'status':
                    console.log('  State:', msg.decoded.state);
                    console.log('  Uptime:', msg.decoded.uptime, 'seconds');
                    console.log('  Connected:', msg.decoded.connected);
                    console.log('  Firmware:', msg.decoded.firmware);
                    break;
                case 'lw':
                    console.log('  Hostname:', msg.decoded.hostname);
                    console.log('  Firmware:', msg.decoded.firmware);
                    console.log('  RSSI:', msg.decoded.rssi, 'dBm');
                    console.log('  Uptime at connect:', msg.decoded.uptime_at_connect, 'seconds');
                    break;
                case 'alarm':
                    console.log('  Type:', msg.decoded.type);
                    console.log('  State:', msg.decoded.state);
                    console.log('  Priority:', msg.decoded.priority);
                    break;
            }
        }
        
        if (msg.decodeError) {
            console.log('\n❌ DECODE ERROR:', msg.decodeError);
        }
        
        console.log('='.repeat(60) + '\n');
    } else if (msg.type === 'auth' && msg.success) {
        console.log('✅ Authentication successful!\n');
    }
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('\nWebSocket connection closed');
    process.exit(0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\nClosing connection...');
    ws.close();
    process.exit(0);
});

console.log('HMAC Monitor Test Started');
console.log('Press Ctrl+C to exit\n');