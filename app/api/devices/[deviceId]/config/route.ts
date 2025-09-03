import { NextRequest, NextResponse } from 'next/server';
import { CommandService } from '@/lib/commands/command-service';
import { logger } from '@/lib/utils/logger';
import { z } from 'zod';

// Schema for WiFi config - all fields optional
const WifiConfigSchema = z.object({
  ssid: z.string().max(32).optional(),
  password: z.string().max(64).optional(),
  dhcp: z.boolean().optional(),
  staticIp: z.string().optional(),
  gateway: z.string().optional(),
  netmask: z.string().optional()
});

// Schema for MQTT config - all fields optional
const MqttConfigSchema = z.object({
  brokerUrl: z.string().max(128).optional(),
  port: z.number().min(1).max(65535).optional(),
  username: z.string().max(32).optional(),
  password: z.string().max(32).optional(),
  keepalive: z.number().min(10).max(3600).optional(),
  qos: z.number().min(0).max(2).optional(),
  useTls: z.boolean().optional()
});

// Schema for Device config - all fields optional
const DeviceConfigSchema = z.object({
  hostname: z.string().max(32).optional(),
  deviceId: z.number().optional(),
  enableHeartbeat: z.boolean().optional(),
  heartbeatInterval: z.number().min(10).max(3600).optional()
});

// Schema for Location config - all fields optional
const LocationConfigSchema = z.object({
  country: z.string().max(3).optional(),
  zone: z.number().min(0).max(255).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});

// Schema for NTP config - all fields optional
const NTPConfigSchema = z.object({
  server1: z.string().max(64).optional(),
  server2: z.string().max(64).optional(),
  server3: z.string().max(64).optional(),
  enableSync: z.boolean().optional(),
  syncInterval: z.number().min(300).max(86400).optional(),
  timezoneOffset: z.number().min(-43200).max(43200).optional(),
  timezoneName: z.string().max(32).optional()
});

// Schema for BLE config - all fields optional
const BLEConfigSchema = z.object({
  enable: z.boolean().optional(),
  deviceName: z.string().max(32).optional(),
  advertise: z.boolean().optional(),
  intervalMs: z.number().min(20).max(10240).optional(),
  advHmacKey: z.string().optional(),
  sppHmacKey: z.string().optional(),
  txPower: z.number().min(0).max(7).optional()
});

// Main config request schema
const ConfigRequestSchema = z.object({
  type: z.enum(['WIFI', 'MQTT', 'DEVICE', 'LOCATION', 'NTP', 'BLE']),
  config: z.any() // Will be validated based on type
});

// POST - Update configuration
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    const body = await request.json();

    // Validate base request
    const { type, config } = ConfigRequestSchema.parse(body);

    // Validate config based on type
    let validatedConfig;
    switch (type) {
      case 'WIFI':
        validatedConfig = WifiConfigSchema.parse(config);
        break;
      case 'MQTT':
        validatedConfig = MqttConfigSchema.parse(config);
        break;
      case 'DEVICE':
        validatedConfig = DeviceConfigSchema.parse(config);
        break;
      case 'LOCATION':
        validatedConfig = LocationConfigSchema.parse(config);
        break;
      case 'NTP':
        validatedConfig = NTPConfigSchema.parse(config);
        break;
      case 'BLE':
        validatedConfig = BLEConfigSchema.parse(config);
        break;
      default:
        throw new Error('Invalid config type');
    }

    logger.info('Config command request', {
      deviceId,
      type,
      fieldsToUpdate: Object.keys(validatedConfig)
    });

    // Send command with only the fields that were provided
    const result = await CommandService.sendConfigCommand(
      deviceId,
      type,
      validatedConfig
    );

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error('Config command error', {
      error: error.message,
      stack: error.stack
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid configuration', 
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
      { error: 'Failed to send config command' },
      { status: 500 }
    );
  }
}

// GET - Read configuration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await params;
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'ALL';
    const includeSensitive = searchParams.get('includeSensitive') === 'true';

    logger.info('Config read request', {
      deviceId,
      type,
      includeSensitive
    });

    const result = await CommandService.readConfig(
      deviceId,
      type,
      includeSensitive
    );

    return NextResponse.json(result);
  } catch (error: any) {
    logger.error('Config read error', {
      error: error.message,
      stack: error.stack
    });

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
      { error: 'Failed to read config' },
      { status: 500 }
    );
  }
}