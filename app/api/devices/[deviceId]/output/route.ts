import { NextRequest, NextResponse } from 'next/server';
import { CommandService } from '@/lib/commands/command-service';
import { logger } from '@/lib/utils/logger';
import { z } from 'zod';

// Schema for output command validation
const OutputCommandSchema = z.object({
  output: z.enum(['SIREN', 'TURRET', 'RELAY1', 'RELAY2', 'FAN', 'ALL']),
  pattern: z.enum([
    'CONSTANT', 'PULSE', 'BLINK_SLOW', 'BLINK_FAST',
    'DOUBLE_PULSE', 'TRIPLE_PULSE', 'SOS', 'STROBE',
    'OFF', 'PWM', 'CUSTOM'
  ]),
  options: z.object({
    state: z.boolean().optional(),
    totalDuration: z.number().min(0).max(86400).optional(), // Max 24 hours
    pulseCount: z.number().min(0).max(1000).optional(),
    onDurationMs: z.number().min(10).max(60000).optional(),
    offDurationMs: z.number().min(10).max(60000).optional(),
    repeatInterval: z.number().min(0).max(3600).optional(),
    customData: z.number().min(0).max(100).optional() // For PWM percentage or custom data
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
    const validatedData = OutputCommandSchema.parse(body);

    logger.info('Output command request', {
      deviceId,
      output: validatedData.output,
      pattern: validatedData.pattern,
      options: validatedData.options
    });

    // Special validation for FAN with PWM pattern
    if (validatedData.output === 'FAN' && validatedData.pattern === 'PWM') {
      if (!validatedData.options?.customData || 
          validatedData.options.customData < 0 || 
          validatedData.options.customData > 100) {
        return NextResponse.json(
          { error: 'PWM duty cycle must be between 0 and 100' },
          { status: 400 }
        );
      }
    }

    // Send command
    const result = await CommandService.sendOutputCommand(
      deviceId,
      validatedData.output,
      validatedData.pattern,
      validatedData.options
    );

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error('Output command error', {
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
      { error: 'Failed to send output command' },
      { status: 500 }
    );
  }
}