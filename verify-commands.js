const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected to WebSocket monitor\n');
    
    // First authenticate with correct credentials
    console.log('Sending: AT+AUTH=admin,admin123');
    ws.send('AT+AUTH=admin,admin123');
    
    setTimeout(() => {
        // Check help
        console.log('\nSending: AT+HELP');
        ws.send('AT+HELP');
        
        setTimeout(() => {
            // Check ALARMLOG status
            console.log('\nSending: AT+ALARMLOG');
            ws.send('AT+ALARMLOG');
            
            setTimeout(() => {
                // Enable ALARMLOG
                console.log('\nSending: AT+ALARMLOG=ON');
                ws.send('AT+ALARMLOG=ON');
                
                setTimeout(() => {
                    // Check HBLOG status
                    console.log('\nSending: AT+HBLOG');
                    ws.send('AT+HBLOG');
                    
                    setTimeout(() => {
                        // Enable HBLOG
                        console.log('\nSending: AT+HBLOG=ON');
                        ws.send('AT+HBLOG=ON');
                        
                        setTimeout(() => {
                            console.log('\n✅ All commands tested!');
                            ws.close();
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 1000);
    }, 500);
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    
    if (msg.type === 'system') {
        console.log('System:', msg.message);
    } else if (msg.type === 'auth') {
        if (msg.success || msg.authenticated) {
            console.log('✅ Auth: Success -', msg.message || 'Authenticated');
        } else {
            console.log('❌ Auth: Failed -', msg.message || 'Invalid credentials');
        }
    } else if (msg.type === 'response') {
        if (msg.message && msg.message.includes('Available commands:')) {
            console.log('\n=== HELP RESPONSE ===');
            // Handle both single and double backslash escaping
            const lines = msg.message.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').split('\n');
            for (const line of lines) {
                console.log(line);
            }
            console.log('===================');
        } else {
            console.log('Response:', msg.message);
        }
    } else if (msg.type === 'error') {
        console.log('❌ Error:', msg.message);
    }
});

ws.on('close', () => {
    console.log('\nDisconnected from WebSocket monitor');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});