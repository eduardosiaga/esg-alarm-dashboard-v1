const WebSocket = require('ws');

console.log('Connecting to WebSocket monitor...');
const ws = new WebSocket('ws://localhost:8888');

ws.on('open', () => {
  console.log('Connected! Authenticating...');
  ws.send('AT+AUTH=admin,admin123');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  
  if (msg.type === 'auth' && msg.success) {
    console.log('Authenticated successfully!');
    ws.send('AT+MODE=both');
    ws.send('AT+VERBOSE=verbose');
    ws.send('AT+HMAC=1');
    ws.send('AT+STATUS');
    console.log('\nWaiting for MQTT messages...\n');
  } else if (msg.type === 'mqtt_message') {
    console.log('=== MQTT Message ===');
    console.log(`Time: ${msg.timestamp}`);
    console.log(`Topic: ${msg.topic}`);
    console.log(`Device: ${msg.hostname}`);
    console.log(`Type: ${msg.messageType}`);
    
    if (msg.hmac) {
      console.log(`HMAC Valid: ${msg.hmac.valid}`);
      console.log(`Sequence: ${msg.hmac.sequence}`);
    }
    
    if (msg.decoded) {
      console.log('Decoded Data:');
      console.log('  Temperature:', msg.decoded.temperature, '°C');
      console.log('  Humidity:', msg.decoded.humidity, '%');
      console.log('  Uptime:', msg.decoded.uptime, 'seconds');
      console.log('  Fan PWM:', msg.decoded.fan_pwm_duty, '%');
    }
    
    if (msg.decodeError) {
      console.log('Decode Error:', msg.decodeError);
    }
    
    console.log('==================\n');
  } else if (msg.type === 'status') {
    console.log('System Status:', JSON.stringify(msg.stats, null, 2));
  }
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err.message);
});

ws.on('close', () => {
  console.log('Disconnected');
  process.exit(0);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\nClosing...');
  ws.close();
  process.exit(0);
});