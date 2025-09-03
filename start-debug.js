// Debug startup script
require('dotenv').config({ path: '.env.local' });

// Set debug logging
process.env.LOG_LEVEL = 'debug';

console.log('================================================');
console.log('Starting ESP32 Alarm Dashboard in DEBUG mode');
console.log('================================================');
console.log('MQTT Broker:', process.env.MQTT_HOST + ':' + process.env.MQTT_PORT);
console.log('Base Topic:', process.env.MQTT_BASE_TOPIC);
console.log('================================================\n');

// Start the server
require('./server.ts');