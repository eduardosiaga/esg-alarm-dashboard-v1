const WebSocket = require('ws');
const readline = require('readline');

// Create WebSocket connection
const ws = new WebSocket('ws://localhost:8888');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'AT> '
});

// Handle WebSocket events
ws.on('open', () => {
  console.log('Connected to ESP32 Alarm Monitor');
  console.log('Type AT commands (e.g., AT+AUTH=admin,admin123)');
  console.log('Type "exit" to quit\n');
  rl.prompt();
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  
  // Format output based on message type
  if (message.type === 'mqtt_message') {
    console.log('\n--- MQTT Message ---');
    console.log(`Time: ${message.timestamp}`);
    console.log(`Direction: ${message.direction}`);
    console.log(`Topic: ${message.topic}`);
    console.log(`Hostname: ${message.hostname}`);
    console.log(`Type: ${message.messageType}`);
    
    if (message.decoded) {
      console.log('Decoded:', JSON.stringify(message.decoded, null, 2));
    }
    
    if (message.raw) {
      console.log(`Raw (hex): ${message.raw.substring(0, 64)}...`);
    }
    
    if (message.hmac) {
      console.log('HMAC:', message.hmac);
    }
    
    console.log('-------------------\n');
  } else if (message.type === 'status') {
    console.log('\n--- Status ---');
    console.log('Settings:', JSON.stringify(message.settings, null, 2));
    console.log('Stats:', JSON.stringify(message.stats, null, 2));
    console.log('--------------\n');
  } else if (message.type === 'devices') {
    console.log('\n--- Devices ---');
    message.devices.forEach((d) => {
      console.log(`${d.hostname}: ${d.online ? 'ONLINE' : 'OFFLINE'} - ${d.state}`);
      console.log(`  Last seen: ${d.lastSeen}`);
      console.log(`  Temp: ${d.temperature}°C, Humidity: ${d.humidity}%`);
    });
    console.log('---------------\n');
  } else if (message.type === 'help') {
    console.log('\n--- Available Commands ---');
    Object.entries(message.commands).forEach(([cmd, desc]) => {
      console.log(`${cmd.padEnd(30)} - ${desc}`);
    });
    console.log('-------------------------\n');
  } else {
    console.log('\n' + JSON.stringify(message, null, 2) + '\n');
  }
  
  rl.prompt();
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('Disconnected from monitor');
  process.exit(0);
});

// Handle user input
rl.on('line', (input) => {
  const cmd = input.trim();
  
  if (cmd.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    ws.close();
    rl.close();
    process.exit(0);
  } else if (cmd) {
    ws.send(cmd);
  }
  
  rl.prompt();
});

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  ws.close();
  rl.close();
  process.exit(0);
});