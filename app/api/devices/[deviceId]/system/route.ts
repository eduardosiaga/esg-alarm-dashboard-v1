import { NextRequest, NextResponse } from 'next/server';
import { CommandService } from '@/lib/commands/command-service';
import { logger } from '@/lib/utils/logger';
import { z } from 'zod';

// Schema for system command validation
const SystemCommandSchema = z.object({
  action: z.enum(['REBOOT', 'FACTORY_RESET', 'GET_STATUS', 'SET_TIME', 'CLEAR_COUNTERS']),
  options: z.object({
    delaySeconds: z.number().min(0).max(3600).optional(),
    unixTime: z.number().optional()
  }).optional()
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    const body = await request.json();

    // Validate request
    const validatedData = SystemCommandSchema.parse(body);

    logger.info('System command request', {
      deviceId,
      action: validatedData.action,
      options: validatedData.options
    });

    // Send command
    const result = await CommandService.sendSystemCommand(
      deviceId,
      validatedData.action,
      validatedData.options
    );

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error('System command error', {
      error: error.message,
      stack: error.stack
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request', 
          details: error.issues 
        },
        { status: 400 }
      );
    }

    if (error.message.includes('Device not found')) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    if (error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Command timeout' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send system command' },
      { status: 500 }
    );
  }
}