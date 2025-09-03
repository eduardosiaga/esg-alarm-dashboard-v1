const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8888');

let helpReceived = false;

ws.on('open', () => {
    console.log('Connected to WebSocket monitor');
    
    // Authenticate
    ws.send('AT+AUTH=admin,admin123');
    
    setTimeout(() => {
        // Check help
        console.log('\nRequesting AT+HELP...');
        ws.send('AT+HELP');
        
        // Wait longer for the help response
        setTimeout(() => {
            if (!helpReceived) {
                console.log('No help response received');
            }
            console.log('\nTest completed!');
            ws.close();
        }, 2000);
    }, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    
    if (msg.type === 'system') {
        console.log('System:', msg.message);
    } else if (msg.type === 'auth') {
        console.log('Auth:', msg.authenticated ? 'Success' : 'Failed');
    } else if (msg.type === 'response') {
        if (msg.message && msg.message.includes('Available commands:')) {
            helpReceived = true;
            console.log('\n=== HELP RESPONSE ===');
            console.log(msg.message);
            console.log('===================\n');
        } else {
            console.log('Response:', msg.message);
        }
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