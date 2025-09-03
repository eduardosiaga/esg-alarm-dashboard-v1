const WebSocket = require('ws');

console.log('Connecting to WebSocket monitor...');
const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected to monitor server!');
    console.log('Authenticating...');
    
    // Authenticate first
    ws.send('AT+AUTH=admin,admin123');
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('\n=== MESSAGE RECEIVED ===');
    console.log('Type:', msg.type);
    
    if (msg.type === 'auth' && msg.success) {
        console.log('Authentication successful!');
        console.log('Setting up monitor...');
        
        // Configure monitor settings
        setTimeout(() => {
            ws.send('AT+MODE=both');  // Show both raw and decoded
            ws.send('AT+HMAC=1');     // Show HMAC details
            ws.send('AT+ERRORS=1');   // Show errors
            ws.send('AT+VERBOSE=verbose'); // Verbose output
            ws.send('AT+DIRECTION=in'); // Only incoming messages
            console.log('Monitor configured for maximum debugging');
            console.log('Waiting for heartbeat messages (every 30s)...\n');
        }, 100);
    } else if (msg.type === 'mqtt_message') {
        console.log('\n🔵 MQTT MESSAGE:');
        console.log('Topic:', msg.topic);
        console.log('Direction:', msg.direction);
        console.log('Message Type:', msg.messageType);
        console.log('Hostname:', msg.hostname);
        console.log('Size:', msg.size, 'bytes');
        
        if (msg.raw) {
            console.log('\n📦 RAW DATA (hex):');
            console.log(msg.raw);
            
            // Parse raw hex to show byte structure
            const bytes = Buffer.from(msg.raw, 'hex');
            console.log('\n📊 RAW BYTES (first 20):');
            console.log(Array.from(bytes.slice(0, 20)));
        }
        
        if (msg.hmac) {
            console.log('\n🔐 HMAC Info:');
            console.log('  Wrapped:', msg.hmac.wrapped);
            console.log('  Valid:', msg.hmac.valid);
            console.log('  Sequence:', msg.hmac.sequence);
            console.log('  HMAC:', msg.hmac.hmac);
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
        console.log('Response:', msg.message);
    }
    
    console.log('========================\n');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
});

// Keep the script running
process.on('SIGINT', () => {
    console.log('\nClosing connection...');
    ws.close();
    process.exit(0);
});

console.log('Monitor client started. Press Ctrl+C to exit.');
console.log('Note: Heartbeats are sent every 30 seconds by ESP32 devices.');