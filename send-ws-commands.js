const WebSocket = require('ws');

console.log('Connecting to WebSocket monitor...');
const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected! Sending authentication...');
    ws.send('AT+AUTH=admin,admin123');
    
    setTimeout(() => {
        console.log('Configuring monitor for debugging...');
        ws.send('AT+MODE=both');        // Show raw and decoded data
        ws.send('AT+HMAC=1');          // Show HMAC details
        ws.send('AT+VERBOSE=verbose');  // Maximum detail
        ws.send('AT+FILTER=ESG_ALARM_0483080CEDD8'); // Filter specific device
        
        console.log('Configuration sent. Waiting for heartbeat messages...');
    }, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    if (msg.type === 'mqtt_message' && msg.messageType === 'hb') {
        console.log('\n=== HEARTBEAT MESSAGE CAPTURED ===');
        console.log('Topic:', msg.topic);
        console.log('Hostname:', msg.hostname);
        console.log('Size:', msg.size, 'bytes');
        
        if (msg.raw) {
            console.log('\n📦 RAW DATA (hex):');
            console.log(msg.raw);
            
            // Parse raw hex to show byte structure
            const bytes = Buffer.from(msg.raw, 'hex');
            console.log('\n📊 RAW BYTES Analysis:');
            console.log('Total size:', bytes.length);
            console.log('First 20 bytes:', Array.from(bytes.slice(0, 20)));
            
            // Check if it looks like HMAC wrapper
            if (bytes.length >= 15) {
                const payloadLength = bytes.readUInt16LE(0);
                const expectedSize = 2 + 4 + payloadLength + 8;
                console.log('\nHMAC Analysis:');
                console.log('Payload length field:', payloadLength);
                console.log('Expected total size:', expectedSize);
                console.log('Actual size:', bytes.length);
                console.log('Looks like HMAC wrapped:', expectedSize === bytes.length);
            }
        }
        
        if (msg.hmac) {
            console.log('\n🔐 HMAC Info:');
            console.log('  Wrapped:', msg.hmac.wrapped);
            console.log('  Valid:', msg.hmac.valid);
            console.log('  Sequence:', msg.hmac.sequence);
            if (msg.hmac.payloadLength) {
                console.log('  Payload Length:', msg.hmac.payloadLength);
            }
        }
        
        if (msg.decoded) {
            console.log('\n✅ DECODED MESSAGE:');
            console.log(JSON.stringify(msg.decoded, null, 2));
        }
        
        if (msg.decodeError) {
            console.log('\n❌ DECODE ERROR:');
            console.log(msg.decodeError);
        }
        
        console.log('================================\n');
    } else if (msg.type === 'mqtt_message' && (msg.messageType === 'status' || msg.messageType === 'alarm')) {
        console.log(`\n✅ ${msg.messageType.toUpperCase()} message processed successfully`);
    }
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('Connection closed');
});

// Keep the script running
setTimeout(() => {
    console.log('\nClosing after 60 seconds...');
    ws.close();
    process.exit(0);
}, 60000);