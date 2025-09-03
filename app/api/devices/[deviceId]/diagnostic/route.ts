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
    
    // Get request body
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'MEMORY_INFO';
    
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
    
    // Build diagnostic command
    const { command, requestId, sequence } = CommandBuilder.buildDiagnosticCommand(action);
    
    // Log command for debugging
    logger.info('Sending diagnostic command', {
      deviceDbId,
      hostname: device.hostname,
      action,
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
        commandType: 'DIAGNOSTIC',
        commandData: { action },
        sentAt: new Date()
      }
    });
    
    // Try to publish command to device if MQTT client is available
    try {
      const mqttClient = getMqttClient();
      const topic = `${mqttClient.getConfig().baseTopic}/pb/d/${device.hostname}/cmd`;
      await mqttClient.publish(topic, command);
      
      return NextResponse.json({
        success: true,
        requestId,
        sequence,
        action,
        message: 'Diagnostic command sent successfully'
      });
    } catch (mqttError: any) {
      // MQTT client not available in API context, but command was logged
      logger.warn('MQTT client not available in API context', { error: mqttError.message });
      
      return NextResponse.json({
        success: true,
        requestId,
        sequence,
        action,
        message: 'Diagnostic command logged (MQTT not available in API context)',
        note: 'Command will be sent when using the standalone server'
      });
    }
  } catch (error) {
    logger.error('Error sending diagnostic command', error);
    return NextResponse.json(
      { error: 'Failed to send diagnostic command' },
      { status: 500 }
    );
  }
}