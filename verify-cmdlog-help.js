const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected to WebSocket monitor\n');
    
    // First authenticate
    ws.send('AT+AUTH=admin,admin123');
    
    setTimeout(() => {
        // Request help
        console.log('Requesting AT+HELP to find AT+CMDLOG...\n');
        ws.send('AT+HELP');
        
        setTimeout(() => {
            console.log('\n✅ Test completed!');
            ws.close();
        }, 2000);
    }, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    
    if (msg.type === 'system') {
        // Skip system message
    } else if (msg.type === 'auth') {
        if (msg.success || msg.authenticated) {
            console.log('✅ Authenticated successfully\n');
        }
    } else if (msg.type === 'response') {
        if (msg.message && msg.message.includes('Available commands:')) {
            console.log('=== HELP RESPONSE RECEIVED ===\n');
            
            // Parse and display all logging commands
            const lines = msg.message.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').split('\n');
            
            console.log('📝 LOGGING COMMANDS FOUND:');
            console.log('----------------------------');
            
            lines.forEach(line => {
                if (line.includes('LOG[') || line.includes('log')) {
                    console.log(line);
                }
            });
            
            console.log('\n----------------------------');
            
            // Check specifically for AT+CMDLOG
            const cmdlogLine = lines.find(line => line.includes('AT+CMDLOG'));
            if (cmdlogLine) {
                console.log('\n✅ AT+CMDLOG FOUND IN HELP!');
                console.log('Entry:', cmdlogLine);
            } else {
                console.log('\n❌ AT+CMDLOG NOT FOUND IN HELP');
            }
        }
    }
});

ws.on('close', () => {
    console.log('\nDisconnected from WebSocket monitor');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});