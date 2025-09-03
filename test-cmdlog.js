const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
    console.log('Connected to WebSocket monitor\n');
    
    // First authenticate with correct credentials
    console.log('Sending: AT+AUTH=admin,admin123');
    ws.send('AT+AUTH=admin,admin123');
    
    setTimeout(() => {
        // Check CMDLOG status
        console.log('\n1. Checking CMDLOG status...');
        ws.send('AT+CMDLOG');
        
        setTimeout(() => {
            // Enable CMDLOG
            console.log('\n2. Enabling CMDLOG...');
            ws.send('AT+CMDLOG=ON');
            
            setTimeout(() => {
                // Check CMDLOG status again
                console.log('\n3. Checking CMDLOG status again...');
                ws.send('AT+CMDLOG');
                
                setTimeout(() => {
                    // Check AT+HELP to verify command is listed
                    console.log('\n4. Checking AT+HELP for CMDLOG...');
                    ws.send('AT+HELP');
                    
                    setTimeout(() => {
                        // Disable CMDLOG
                        console.log('\n5. Disabling CMDLOG...');
                        ws.send('AT+CMDLOG=OFF');
                        
                        setTimeout(() => {
                            // Final status check
                            console.log('\n6. Final CMDLOG status...');
                            ws.send('AT+CMDLOG');
                            
                            setTimeout(() => {
                                console.log('\n✅ All tests completed!');
                                ws.close();
                            }, 500);
                        }, 500);
                    }, 1000);
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
        if (msg.success || msg.authenticated) {
            console.log('✅ Auth: Success -', msg.message || 'Authenticated');
        } else {
            console.log('❌ Auth: Failed -', msg.message || 'Invalid credentials');
        }
    } else if (msg.type === 'response') {
        if (msg.message && msg.message.includes('Available commands:')) {
            // Check if AT+CMDLOG is in the help
            if (msg.message.includes('AT+CMDLOG')) {
                console.log('✅ AT+CMDLOG found in help!');
            } else {
                console.log('❌ AT+CMDLOG not found in help');
            }
            // Show just the CMDLOG line
            const lines = msg.message.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').split('\n');
            const cmdlogLine = lines.find(line => line.includes('AT+CMDLOG'));
            if (cmdlogLine) {
                console.log('  Help entry:', cmdlogLine);
            }
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