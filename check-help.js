const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected to WebSocket monitor');
    
    // Authenticate
    ws.send('AT+AUTH=admin,admin123');
    
    setTimeout(() => {
        // Check help
        console.log('\nChecking available commands...');
        ws.send('AT+HELP');
        
        setTimeout(() => {
            console.log('\nTest completed!');
            ws.close();
        }, 1000);
    }, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    
    if (msg.type === 'system') {
        console.log('System:', msg.message);
    } else if (msg.type === 'auth') {
        console.log('Auth:', msg.authenticated ? 'Success' : 'Failed');
    } else if (msg.type === 'response') {
        console.log('Response:', msg.message);
    } else if (msg.type === 'error') {
        console.log('Error:', msg.message);
    }
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket monitor');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});