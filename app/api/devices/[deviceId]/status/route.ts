import { NextRequest, NextResponse } from 'next/server';
import { getMqttClient } from '@/lib/mqtt/client';
import { CommandBuilder } from '@/lib/protobuf/command-builder';
import { logger } from '@/lib/utils/logger';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    const deviceDbId = parseInt(deviceId);
    
    // Get device from database
    const device = await prisma.device.findUnique({
      where: { id: deviceDbId }
    });
    
    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }
    
    // Build status request command
    const { command, requestId, sequence } = CommandBuilder.buildStatusRequestCommand();
    
    // Log command for debugging
    logger.info('Sending status request command', {
      deviceDbId,
      hostname: device.hostname,
      requestId,
      sequence,
      commandSize: command.length
    });
    
    // Create command log entry
    await prisma.deviceCommand.create({
      data: {
        deviceId: deviceDbId,
        requestId,
        sequence,
        timestamp: new Date(),
        commandType: 'SYSTEM',
        commandData: { action: 'SYS_GET_STATUS' },
        sentAt: new Date()
      }
    });
    
    // Publish command to device
    const mqttClient = getMqttClient();
    const topic = `${mqttClient.getConfig().baseTopic}/pb/d/${device.hostname}/cmd`;
    await mqttClient.publish(topic, command);
    
    return NextResponse.json({
      success: true,
      requestId,
      sequence,
      message: 'Status request sent successfully'
    });
  } catch (error) {
    logger.error('Error sending status request', error);
    return NextResponse.json(
      { error: 'Failed to send status request' },
      { status: 500 }
    );
  }
}