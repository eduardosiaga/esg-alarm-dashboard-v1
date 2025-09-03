import { ESGMQTTClient } from './lib/mqtt/client';
import { CommandBuilder } from './lib/protobuf/command-builder';
import { logger } from './lib/utils/logger';
import { prisma } from './lib/db/prisma';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testDiagnosticCommand() {
  try {
    // Get device from database
    const device = await prisma.device.findUnique({
      where: { id: 5 }
    });
    
    if (!device) {
      console.error('Device with ID 5 not found');
      process.exit(1);
    }
    
    console.log('Found device:', device.hostname);
    
    // Build diagnostic command
    const { command, requestId, sequence } = CommandBuilder.buildDiagnosticCommand('MEMORY_INFO');
    
    console.log('\n=== DIAGNOSTIC COMMAND BUILT ===');
    console.log('Request ID:', requestId);
    console.log('Sequence:', sequence);
    console.log('Command size:', command.length, 'bytes');
    console.log('Command hex:', command.toString('hex'));
    console.log('Command bytes:', Array.from(command));
    
    // Log first 20 bytes to analyze structure
    console.log('\n=== HMAC WRAPPER STRUCTURE ===');
    const first20 = Array.from(command.slice(0, 20));
    console.log('First 20 bytes:', first20);
    console.log('Length (BE):', (command[0] << 8) | command[1]);
    console.log('Sequence (BE):', (command[2] << 24) | (command[3] << 16) | (command[4] << 8) | command[5]);
    
    // Create command log entry
    await prisma.deviceCommand.create({
      data: {
        deviceId: 5,
        requestId,
        sequence,
        timestamp: new Date(),
        commandType: 'DIAGNOSTIC',
        commandData: { action: 'MEMORY_INFO' },
        sentAt: new Date()
      }
    });
    
    console.log('\n=== COMMAND LOGGED TO DATABASE ===');
    console.log('Request ID:', requestId);
    
    // Create MQTT client and send command
    const mqttClient = new ESGMQTTClient({
      host: process.env.MQTT_HOST || 'esag-tech.com',
      port: parseInt(process.env.MQTT_PORT || '8883'),
      username: process.env.MQTT_USERNAME || 'esagtech_mqtt',
      password: process.env.MQTT_PASSWORD || 'lwcwDEBVZxD6VFU',
      clientId: `test-client-${Date.now()}`,
      baseTopic: process.env.MQTT_BASE_TOPIC || 'esagtech',
    });
    
    await mqttClient.connect();
    console.log('\n=== MQTT CONNECTED ===');
    
    const topic = `${mqttClient.getConfig().baseTopic}/pb/d/${device.hostname}/cmd`;
    console.log('Publishing to topic:', topic);
    
    await mqttClient.publish(topic, command);
    console.log('\n=== COMMAND SENT ===');
    console.log('Topic:', topic);
    console.log('Request ID:', requestId);
    console.log('Command sent successfully!');
    
    // Wait a bit for any response
    setTimeout(async () => {
      await mqttClient.disconnect();
      await prisma.$disconnect();
      process.exit(0);
    }, 5000);
    
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Run the test
testDiagnosticCommand();