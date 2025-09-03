import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDeviceStatus() {
  try {
    const deviceStatus = await prisma.deviceStatus.findUnique({
      where: { deviceId: 5 }
    });
    
    if (deviceStatus) {
      console.log('Device Status for Device ID 5:');
      console.log('================================');
      console.log('Temperature:', deviceStatus.temperature, '°C');
      console.log('Humidity:', deviceStatus.humidity, '%');
      console.log('Fan PWM Duty:', deviceStatus.fanPwmDuty, '%');
      console.log('Panic1:', deviceStatus.panic1);
      console.log('Panic2:', deviceStatus.panic2);
      console.log('Box Switch:', deviceStatus.boxSw);
      console.log('Siren:', deviceStatus.siren);
      console.log('Turret:', deviceStatus.turret);
      console.log('Uptime:', deviceStatus.uptime, 'seconds');
      console.log('Network Type:', deviceStatus.networkType);
      console.log('Firmware:', deviceStatus.firmwareVersion);
      console.log('Is Online:', deviceStatus.isOnline);
      console.log('Connected:', deviceStatus.connected);
      console.log('Last Seen:', deviceStatus.lastSeen);
      console.log('================================');
    } else {
      console.log('No device status found for device ID 5');
    }
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDeviceStatus();