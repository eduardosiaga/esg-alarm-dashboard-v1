const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected to WebSocket monitor');
    
    // Authenticate
    ws.send('AT+AUTH=admin,admin123');
    
    setTimeout(() => {
        // Check alarm log status
        console.log('\nChecking ALARMLOG status...');
        ws.send('AT+ALARMLOG');
        
        setTimeout(() => {
            // Enable alarm log
            console.log('\nEnabling ALARMLOG...');
            ws.send('AT+ALARMLOG=ON');
            
            setTimeout(() => {
                // Check status again
                console.log('\nChecking ALARMLOG status again...');
                ws.send('AT+ALARMLOG');
                
                setTimeout(() => {
                    // Disable alarm log
                    console.log('\nDisabling ALARMLOG...');
                    ws.send('AT+ALARMLOG=OFF');
                    
                    setTimeout(() => {
                        // Check final status
                        console.log('\nFinal ALARMLOG status...');
                        ws.send('AT+ALARMLOG');
                        
                        setTimeout(() => {
                            console.log('\nTest completed!');
                            ws.close();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
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