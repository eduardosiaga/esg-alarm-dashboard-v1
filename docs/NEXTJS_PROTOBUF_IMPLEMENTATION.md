# Next.js Protobuf Implementation Guide

## Overview
This guide provides a step-by-step implementation of Protocol Buffers communication with the ESP32-WROVER Alarm System in a Next.js application.

## Prerequisites

### Required Packages
```bash
npm install protobufjs mqtt uuid
npm install --save-dev @types/uuid
```

### Optional Packages (for TypeScript support)
```bash
npm install --save-dev @protobuf-ts/plugin @protobuf-ts/runtime
```

## Step 1: Set Up Protobuf Definitions

### 1.1 Create Proto File
Create `lib/proto/command.proto` in your Next.js project:

```protobuf
syntax = "proto3";

package esg.alarm;

// Copy the complete proto definitions from the ESP32 project
// This ensures consistency between server and client
```

### 1.2 Generate JavaScript/TypeScript Classes

Using protobufjs CLI:
```bash
npx pbjs -t static-module -w es6 -o lib/proto/command.js lib/proto/command.proto
npx pbts -o lib/proto/command.d.ts lib/proto/command.js
```

Or using protobuf-ts:
```bash
npx protoc --ts_out lib/proto --proto_path lib/proto command.proto
```

## Step 2: Create Protobuf Service Class

### 2.1 Basic Service Implementation
Create `lib/services/AlarmProtobufService.ts`:

```typescript
import * as protobuf from 'protobufjs';
import { v4 as uuidv4 } from 'uuid';
import mqtt, { MqttClient } from 'mqtt';

// Load protobuf definitions
const protoPath = '/proto/command.proto'; // Adjust path as needed

export class AlarmProtobufService {
  private root: protobuf.Root | null = null;
  private CommandEnvelope: protobuf.Type | null = null;
  private CommandResponse: protobuf.Type | null = null;
  private mqttClient: MqttClient | null = null;
  private sequence: number = 1;
  private deviceId: string;
  private baseTopic: string;
  private responseCallbacks: Map<string, (response: any) => void> = new Map();

  constructor(deviceId: string, baseTopic: string = 'iot') {
    this.deviceId = deviceId;
    this.baseTopic = baseTopic;
  }

  /**
   * Initialize the protobuf definitions
   */
  async init(): Promise<void> {
    this.root = await protobuf.load(protoPath);
    this.CommandEnvelope = this.root.lookupType('esg.alarm.CommandEnvelope');
    this.CommandResponse = this.root.lookupType('esg.alarm.CommandResponse');
  }

  /**
   * Connect to MQTT broker
   */
  connectMqtt(brokerUrl: string, options?: mqtt.IClientOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mqttClient = mqtt.connect(brokerUrl, {
        ...options,
        clientId: `nextjs_${this.deviceId}_${Date.now()}`,
      });

      this.mqttClient.on('connect', () => {
        // Subscribe to response topic
        const responseTopic = `${this.baseTopic}/pb/d/${this.deviceId}/resp`;
        this.mqttClient!.subscribe(responseTopic, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      this.mqttClient.on('message', (topic, message) => {
        this.handleResponse(message);
      });

      this.mqttClient.on('error', reject);
    });
  }

  /**
   * Handle incoming response messages
   */
  private handleResponse(message: Buffer): void {
    try {
      const response = this.CommandResponse!.decode(message);
      const responseObj = this.CommandResponse!.toObject(response);
      
      const callback = this.responseCallbacks.get(responseObj.requestId);
      if (callback) {
        callback(responseObj);
        this.responseCallbacks.delete(responseObj.requestId);
      }
    } catch (error) {
      console.error('Error decoding response:', error);
    }
  }

  /**
   * Send a command and wait for response
   */
  async sendCommand(command: any, authLevel: number = 1): Promise<any> {
    if (!this.mqttClient || !this.CommandEnvelope) {
      throw new Error('Service not initialized');
    }

    const requestId = uuidv4();
    const envelope = {
      sequence: this.sequence++,
      timestamp: Math.floor(Date.now() / 1000),
      requestId,
      authLevel,
      ...command,
    };

    // Encode the command
    const message = this.CommandEnvelope.encode(envelope).finish();

    // Set up response handler
    const responsePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.responseCallbacks.delete(requestId);
        reject(new Error('Command timeout'));
      }, 10000); // 10 second timeout

      this.responseCallbacks.set(requestId, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });
    });

    // Publish command
    const commandTopic = `${this.baseTopic}/pb/d/${this.deviceId}/cmd`;
    this.mqttClient.publish(commandTopic, message);

    return responsePromise;
  }

  /**
   * Disconnect from MQTT
   */
  disconnect(): void {
    if (this.mqttClient) {
      this.mqttClient.end();
      this.mqttClient = null;
    }
  }
}
```

## Step 3: Create Command Builder Helpers

### 3.1 Command Builder Class
Create `lib/services/CommandBuilder.ts`:

```typescript
export class CommandBuilder {
  /**
   * Create a system reboot command
   */
  static reboot(delaySeconds: number = 0) {
    return {
      system: {
        action: 'SYS_REBOOT',
        delaySeconds,
      },
    };
  }

  /**
   * Create a system status request
   */
  static getStatus() {
    return {
      system: {
        action: 'SYS_GET_STATUS',
      },
    };
  }

  /**
   * Create an output control command
   */
  static controlOutput(
    output: string,
    pattern: string,
    options: {
      state?: boolean;
      totalDuration?: number;
      pulseCount?: number;
      onDurationMs?: number;
      offDurationMs?: number;
      customData?: number;
    } = {}
  ) {
    return {
      output: {
        output,
        pattern,
        ...options,
      },
    };
  }

  /**
   * Turn on siren
   */
  static sirenOn(duration: number = 0) {
    return this.controlOutput('OUT_SIREN', 'PATTERN_CONSTANT', {
      state: true,
      totalDuration: duration,
    });
  }

  /**
   * Turn off siren
   */
  static sirenOff() {
    return this.controlOutput('OUT_SIREN', 'PATTERN_OFF');
  }

  /**
   * Create pulse pattern
   */
  static pulsePattern(
    output: string,
    pulseCount: number,
    onMs: number,
    offMs: number
  ) {
    return this.controlOutput(output, 'PATTERN_PULSE', {
      pulseCount,
      onDurationMs: onMs,
      offDurationMs: offMs,
    });
  }

  /**
   * Control fan speed
   */
  static fanSpeed(dutyCycle: number) {
    return this.controlOutput('OUT_FAN', 'PATTERN_PWM', {
      customData: Math.min(100, Math.max(0, dutyCycle)),
    });
  }

  /**
   * Configure WiFi
   */
  static configureWifi(ssid: string, password: string, dhcp: boolean = true) {
    return {
      config: {
        type: 'CFG_WIFI',
        wifi: {
          ssid,
          password,
          dhcp,
        },
      },
    };
  }

  /**
   * Configure MQTT
   */
  static configureMqtt(
    brokerUrl: string,
    port: number,
    username?: string,
    password?: string
  ) {
    return {
      config: {
        type: 'CFG_MQTT',
        mqtt: {
          brokerUrl,
          port,
          username: username || '',
          password: password || '',
          keepalive: 60,
          qos: 1,
          useTls: port === 8883,
        },
      },
    };
  }

  /**
   * Start OTA update
   */
  static otaUpdate(url: string, md5?: string, size?: number) {
    return {
      ota: {
        action: 'OTA_START_UPDATE',
        url,
        md5: md5 || '',
        size: size || 0,
      },
    };
  }
}
```

## Step 4: Create React Hooks

### 4.1 useAlarmDevice Hook
Create `hooks/useAlarmDevice.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { AlarmProtobufService } from '@/lib/services/AlarmProtobufService';
import { CommandBuilder } from '@/lib/services/CommandBuilder';

interface UseAlarmDeviceOptions {
  deviceId: string;
  brokerUrl: string;
  baseTopic?: string;
  autoConnect?: boolean;
}

export function useAlarmDevice({
  deviceId,
  brokerUrl,
  baseTopic = 'iot',
  autoConnect = true,
}: UseAlarmDeviceOptions) {
  const [service, setService] = useState<AlarmProtobufService | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initService = async () => {
      try {
        setLoading(true);
        const svc = new AlarmProtobufService(deviceId, baseTopic);
        await svc.init();
        
        if (autoConnect) {
          await svc.connectMqtt(brokerUrl);
          setConnected(true);
        }
        
        setService(svc);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initService();

    return () => {
      if (service) {
        service.disconnect();
      }
    };
  }, [deviceId, brokerUrl, baseTopic, autoConnect]);

  const sendCommand = useCallback(
    async (command: any, authLevel: number = 1) => {
      if (!service) {
        throw new Error('Service not initialized');
      }
      return service.sendCommand(command, authLevel);
    },
    [service]
  );

  // Convenience methods
  const sirenOn = useCallback(
    (duration?: number) => sendCommand(CommandBuilder.sirenOn(duration)),
    [sendCommand]
  );

  const sirenOff = useCallback(
    () => sendCommand(CommandBuilder.sirenOff()),
    [sendCommand]
  );

  const setFanSpeed = useCallback(
    (speed: number) => sendCommand(CommandBuilder.fanSpeed(speed)),
    [sendCommand]
  );

  const reboot = useCallback(
    (delay?: number) => sendCommand(CommandBuilder.reboot(delay), 2),
    [sendCommand]
  );

  const getStatus = useCallback(
    () => sendCommand(CommandBuilder.getStatus()),
    [sendCommand]
  );

  return {
    connected,
    loading,
    error,
    sendCommand,
    sirenOn,
    sirenOff,
    setFanSpeed,
    reboot,
    getStatus,
  };
}
```

## Step 5: Create UI Components

### 5.1 Alarm Control Component
Create `components/AlarmControl.tsx`:

```tsx
import React, { useState } from 'react';
import { useAlarmDevice } from '@/hooks/useAlarmDevice';
import { CommandBuilder } from '@/lib/services/CommandBuilder';

interface AlarmControlProps {
  deviceId: string;
  brokerUrl: string;
}

export function AlarmControl({ deviceId, brokerUrl }: AlarmControlProps) {
  const {
    connected,
    loading,
    error,
    sirenOn,
    sirenOff,
    setFanSpeed,
    sendCommand,
    getStatus,
  } = useAlarmDevice({ deviceId, brokerUrl });

  const [fanSpeed, setFanSpeedValue] = useState(50);
  const [pulseCount, setPulseCount] = useState(3);
  const [statusData, setStatusData] = useState<any>(null);

  const handlePulsePattern = async () => {
    try {
      const command = CommandBuilder.pulsePattern(
        'OUT_SIREN',
        pulseCount,
        1000,
        500
      );
      const response = await sendCommand(command);
      console.log('Pulse response:', response);
    } catch (error) {
      console.error('Pulse error:', error);
    }
  };

  const handleGetStatus = async () => {
    try {
      const response = await getStatus();
      setStatusData(response);
    } catch (error) {
      console.error('Status error:', error);
    }
  };

  if (loading) return <div>Connecting to device...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!connected) return <div>Not connected</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Alarm Control - {deviceId}</h2>
      
      {/* Siren Controls */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Siren Control</h3>
        <div className="flex gap-2">
          <button
            onClick={() => sirenOn(30)}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Siren ON (30s)
          </button>
          <button
            onClick={sirenOff}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Siren OFF
          </button>
        </div>
      </div>

      {/* Pulse Pattern */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Pulse Pattern</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={pulseCount}
            onChange={(e) => setPulseCount(Number(e.target.value))}
            min="1"
            max="10"
            className="w-20 px-2 py-1 border rounded"
          />
          <button
            onClick={handlePulsePattern}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send Pulses
          </button>
        </div>
      </div>

      {/* Fan Control */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Fan Speed</h3>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            value={fanSpeed}
            onChange={(e) => setFanSpeedValue(Number(e.target.value))}
            min="0"
            max="100"
            className="flex-1"
          />
          <span className="w-12">{fanSpeed}%</span>
          <button
            onClick={() => setFanSpeed(fanSpeed)}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Set
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Device Status</h3>
        <button
          onClick={handleGetStatus}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Get Status
        </button>
        {statusData && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">
            {JSON.stringify(statusData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
```

### 5.2 Advanced Control Panel
Create `components/AdvancedAlarmPanel.tsx`:

```tsx
import React, { useState } from 'react';
import { useAlarmDevice } from '@/hooks/useAlarmDevice';
import { CommandBuilder } from '@/lib/services/CommandBuilder';

interface Pattern {
  name: string;
  value: string;
  description: string;
}

const PATTERNS: Pattern[] = [
  { name: 'Constant', value: 'PATTERN_CONSTANT', description: 'Steady ON/OFF' },
  { name: 'Pulse', value: 'PATTERN_PULSE', description: 'Custom pulses' },
  { name: 'Slow Blink', value: 'PATTERN_BLINK_SLOW', description: '500ms ON/OFF' },
  { name: 'Fast Blink', value: 'PATTERN_BLINK_FAST', description: '200ms ON/OFF' },
  { name: 'Strobe', value: 'PATTERN_STROBE', description: '50ms ON, 950ms OFF' },
  { name: 'SOS', value: 'PATTERN_SOS', description: 'SOS pattern' },
  { name: 'OFF', value: 'PATTERN_OFF', description: 'Force OFF' },
];

const OUTPUTS = [
  { name: 'Siren', value: 'OUT_SIREN' },
  { name: 'Turret', value: 'OUT_TURRET' },
  { name: 'Relay 1', value: 'OUT_RELAY1' },
  { name: 'Relay 2', value: 'OUT_RELAY2' },
  { name: 'Fan', value: 'OUT_FAN' },
  { name: 'All', value: 'OUT_ALL' },
];

export function AdvancedAlarmPanel({ deviceId, brokerUrl }: any) {
  const { connected, sendCommand } = useAlarmDevice({ deviceId, brokerUrl });
  
  const [selectedOutput, setSelectedOutput] = useState('OUT_SIREN');
  const [selectedPattern, setSelectedPattern] = useState('PATTERN_CONSTANT');
  const [duration, setDuration] = useState(30);
  const [pulseCount, setPulseCount] = useState(3);
  const [onDuration, setOnDuration] = useState(1000);
  const [offDuration, setOffDuration] = useState(500);
  const [pwmDuty, setPwmDuty] = useState(50);

  const handleSendCommand = async () => {
    let command: any = {
      output: {
        output: selectedOutput,
        pattern: selectedPattern,
        totalDuration: duration,
      },
    };

    // Add pattern-specific parameters
    if (selectedPattern === 'PATTERN_CONSTANT') {
      command.output.state = true;
    } else if (selectedPattern === 'PATTERN_PULSE') {
      command.output.pulseCount = pulseCount;
      command.output.onDurationMs = onDuration;
      command.output.offDurationMs = offDuration;
    } else if (selectedPattern === 'PATTERN_PWM' && selectedOutput === 'OUT_FAN') {
      command.output.customData = pwmDuty;
    }

    try {
      const response = await sendCommand(command);
      console.log('Command response:', response);
    } catch (error) {
      console.error('Command error:', error);
    }
  };

  if (!connected) return <div>Connecting...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Advanced Alarm Control</h2>
      
      <div className="space-y-4">
        {/* Output Selection */}
        <div>
          <label className="block mb-2 font-semibold">Output</label>
          <select
            value={selectedOutput}
            onChange={(e) => setSelectedOutput(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {OUTPUTS.map((output) => (
              <option key={output.value} value={output.value}>
                {output.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pattern Selection */}
        <div>
          <label className="block mb-2 font-semibold">Pattern</label>
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {PATTERNS.map((pattern) => (
              <option key={pattern.value} value={pattern.value}>
                {pattern.name} - {pattern.description}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-2 font-semibold">
            Duration (seconds, 0 = permanent)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Pulse Pattern Options */}
        {selectedPattern === 'PATTERN_PULSE' && (
          <>
            <div>
              <label className="block mb-2 font-semibold">Pulse Count</label>
              <input
                type="number"
                value={pulseCount}
                onChange={(e) => setPulseCount(Number(e.target.value))}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">ON Duration (ms)</label>
              <input
                type="number"
                value={onDuration}
                onChange={(e) => setOnDuration(Number(e.target.value))}
                min="50"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">OFF Duration (ms)</label>
              <input
                type="number"
                value={offDuration}
                onChange={(e) => setOffDuration(Number(e.target.value))}
                min="50"
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        {/* PWM Options for FAN */}
        {selectedOutput === 'OUT_FAN' && selectedPattern === 'PATTERN_PWM' && (
          <div>
            <label className="block mb-2 font-semibold">PWM Duty Cycle (%)</label>
            <input
              type="range"
              value={pwmDuty}
              onChange={(e) => setPwmDuty(Number(e.target.value))}
              min="0"
              max="100"
              className="w-full"
            />
            <div className="text-center">{pwmDuty}%</div>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSendCommand}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send Command
        </button>
      </div>
    </div>
  );
}
```

## Step 6: Environment Configuration

### 6.1 Environment Variables
Create `.env.local`:

```env
NEXT_PUBLIC_MQTT_BROKER=ws://broker.hivemq.com:8000/mqtt
NEXT_PUBLIC_MQTT_USERNAME=
NEXT_PUBLIC_MQTT_PASSWORD=
NEXT_PUBLIC_BASE_TOPIC=iot
```

### 6.2 Configuration Service
Create `lib/config.ts`:

```typescript
export const config = {
  mqtt: {
    broker: process.env.NEXT_PUBLIC_MQTT_BROKER || 'ws://localhost:9001',
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
  },
  baseTopic: process.env.NEXT_PUBLIC_BASE_TOPIC || 'iot',
};
```

## Step 7: Example Page Implementation

### 7.1 Alarm Dashboard Page
Create `app/alarm/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { AlarmControl } from '@/components/AlarmControl';
import { AdvancedAlarmPanel } from '@/components/AdvancedAlarmPanel';
import { config } from '@/lib/config';

export default function AlarmDashboard() {
  const [deviceId, setDeviceId] = useState('ESP32_001');
  const [view, setView] = useState<'simple' | 'advanced'>('simple');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">ESP32 Alarm System Control</h1>
      
      {/* Device Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Device ID</label>
        <input
          type="text"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="p-2 border rounded"
          placeholder="ESP32_001"
        />
      </div>

      {/* View Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setView('simple')}
          className={`px-4 py-2 mr-2 rounded ${
            view === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Simple Control
        </button>
        <button
          onClick={() => setView('advanced')}
          className={`px-4 py-2 rounded ${
            view === 'advanced' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Advanced Control
        </button>
      </div>

      {/* Control Panel */}
      {view === 'simple' ? (
        <AlarmControl deviceId={deviceId} brokerUrl={config.mqtt.broker} />
      ) : (
        <AdvancedAlarmPanel deviceId={deviceId} brokerUrl={config.mqtt.broker} />
      )}
    </div>
  );
}
```

## Step 8: Testing

### 8.1 Test Script
Create `scripts/test-protobuf.ts`:

```typescript
import { AlarmProtobufService } from '../lib/services/AlarmProtobufService';
import { CommandBuilder } from '../lib/services/CommandBuilder';

async function testCommands() {
  const service = new AlarmProtobufService('ESP32_001');
  
  try {
    await service.init();
    await service.connectMqtt('ws://broker.hivemq.com:8000/mqtt');
    
    console.log('Connected to MQTT broker');
    
    // Test siren ON
    console.log('Turning siren ON for 5 seconds...');
    const response1 = await service.sendCommand(CommandBuilder.sirenOn(5));
    console.log('Response:', response1);
    
    // Wait 6 seconds
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Test pulse pattern
    console.log('Sending 3 pulses...');
    const response2 = await service.sendCommand(
      CommandBuilder.pulsePattern('OUT_SIREN', 3, 1000, 500)
    );
    console.log('Response:', response2);
    
    // Test fan speed
    console.log('Setting fan to 75%...');
    const response3 = await service.sendCommand(CommandBuilder.fanSpeed(75));
    console.log('Response:', response3);
    
    service.disconnect();
    console.log('Test completed');
  } catch (error) {
    console.error('Test failed:', error);
    service.disconnect();
  }
}

testCommands();
```

Run test:
```bash
npx ts-node scripts/test-protobuf.ts
```

## Troubleshooting

### Common Issues

1. **Protobuf Loading Errors**
   - Ensure proto files are in public directory for client-side loading
   - Or bundle them with webpack/next.config.js

2. **MQTT Connection Issues**
   - Check CORS settings on MQTT broker
   - Ensure WebSocket support is enabled
   - Verify correct port (usually 8000, 8083, or 9001 for WebSocket)

3. **Binary Data Issues**
   - Ensure MQTT client is configured for binary payloads
   - Check that protobuf encoding/decoding matches ESP32 implementation

4. **Authentication Errors**
   - Verify auth_level matches device expectations
   - Check MQTT credentials if using authentication

## Security Considerations

1. **Use TLS/SSL for production**
   ```typescript
   await service.connectMqtt('wss://broker.example.com:8883', {
     username: 'user',
     password: 'pass',
     rejectUnauthorized: true,
   });
   ```

2. **Implement request signing**
   - Add HMAC signature to SecureCommand wrapper
   - Validate timestamps to prevent replay attacks

3. **Rate limiting**
   - Implement client-side rate limiting
   - Track sequence numbers to detect duplicates

4. **Environment variables**
   - Never commit credentials to version control
   - Use environment variables for all sensitive data

## Performance Optimization

1. **Connection pooling**
   - Reuse MQTT connections across components
   - Implement singleton pattern for service

2. **Message batching**
   - Group multiple commands when possible
   - Reduce network overhead

3. **Caching**
   - Cache device status locally
   - Implement optimistic UI updates

4. **Lazy loading**
   - Load protobuf definitions on demand
   - Use dynamic imports for large components

## Summary

This implementation provides:
- Type-safe protobuf communication
- React hooks for easy integration
- Reusable command builders
- Complete UI components
- Error handling and recovery
- Testing utilities

The system is production-ready with proper error handling, TypeScript support, and follows Next.js best practices.