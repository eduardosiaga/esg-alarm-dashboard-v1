import { NextRequest, NextResponse } from 'next/server';
import { CommandService } from '@/lib/commands/command-service';
import { logger } from '@/lib/utils/logger';
import { z } from 'zod';

// Schema for OTA command validation
const OTACommandSchema = z.object({
  action: z.enum(['CHECK_UPDATE', 'START_UPDATE', 'VALIDATE', 'ROLLBACK', 'GET_STATUS']),
  options: z.object({
    url: z.string().url().max(256).optional(),
    md5: z.string().length(32).optional(),
    size: z.number().min(1).max(10485760).optional() // Max 10MB
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
    const validatedData = OTACommandSchema.parse(body);

    // Additional validation for START_UPDATE
    if (validatedData.action === 'START_UPDATE') {
      if (!validatedData.options?.url) {
        return NextResponse.json(
          { error: 'URL is required for START_UPDATE action' },
          { status: 400 }
        );
      }
      if (!validatedData.options?.md5) {
        return NextResponse.json(
          { error: 'MD5 checksum is required for START_UPDATE action' },
          { status: 400 }
        );
      }
      if (!validatedData.options?.size) {
        return NextResponse.json(
          { error: 'File size is required for START_UPDATE action' },
          { status: 400 }
        );
      }
    }

    logger.info('OTA command request', {
      deviceId,
      action: validatedData.action,
      options: validatedData.options
    });

    // Send command
    const result = await CommandService.sendOTACommand(
      deviceId,
      validatedData.action,
      validatedData.options
    );

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error('OTA command error', {
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
      { error: 'Failed to send OTA command' },
      { status: 500 }
    );
  }
}