import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { wrapHMAC } from './hmac-wrapper';

// Load compiled protobuf messages
const messages = require('./compiled/messages.js');

// Global counter for tracking command builds
let globalBuildCounter = 0;

export class CommandBuilder {
  private static sequenceCounter = 0;

  /**
   * Get next sequence number
   */
  private static getNextSequence(): number {
    this.sequenceCounter = (this.sequenceCounter + 1) % 0xFFFFFFFF;
    logger.warn(`🔍 SEQUENCE INCREMENT`, {
      newSequence: this.sequenceCounter,
      stackTrace: new Error().stack?.split('\n').slice(2, 5).join('\n')
    });
    return this.sequenceCounter;
  }

  /**
   * Build ConfigCommand for device ID synchronization
   */
  static buildDeviceIdSyncCommand(deviceDbId: number, hostname: string): {
    command: Buffer;
    requestId: string;
    sequence: number;
  } {
    const buildId = ++globalBuildCounter;
    const buildTimestamp = Date.now();
    const stackTrace = new Error().stack;
    
    logger.warn(`🔍 BUILD DEVICE ID SYNC COMMAND CALLED`, {
      buildId,
      buildTimestamp,
      deviceDbId,
      hostname,
      stackTrace: stackTrace?.split('\n').slice(2, 7).join('\n')
    });
    
    try {
      const requestId = uuidv4();
      const sequence = this.getNextSequence();

      // Create DeviceConfig message
      const DeviceConfig = messages.esg.alarm.DeviceConfig;
      
      // Ensure device_id is a proper uint32
      const deviceIdUint32 = Math.max(0, Math.min(0xFFFFFFFF, parseInt(deviceDbId.toString(), 10)));
      
      const deviceConfig = DeviceConfig.create({
        deviceId: deviceIdUint32,  // Changed from device_id to deviceId (camelCase)
        hostname: hostname,
        enableHeartbeat: true,  // Changed to camelCase
        heartbeatInterval: 60   // Changed to camelCase
      });
      
      logger.info('DeviceConfig created', {
        device_id: deviceConfig.deviceId,  // Access with camelCase
        hostname: deviceConfig.hostname,
        deviceDbId_input: deviceDbId,
        deviceIdUint32_converted: deviceIdUint32,
        typeof_input: typeof deviceDbId,
        deviceConfig_raw: JSON.stringify(deviceConfig)
      });

      // Create ConfigCommand
      const ConfigCommand = messages.esg.alarm.ConfigCommand;
      const configCommand = ConfigCommand.create({
        type: messages.esg.alarm.ConfigCommand.ConfigType.CFG_DEVICE,
        device: deviceConfig
      });

      // Create CommandEnvelope
      const CommandEnvelope = messages.esg.alarm.CommandEnvelope;
      const envelope = CommandEnvelope.create({
        sequence: sequence,
        timestamp: Math.floor(Date.now() / 1000),
        requestId: requestId,  // Fixed: use camelCase as in protobuf generated code
        authLevel: 1, // Fixed: use camelCase for auth_level too
        config: configCommand
      });

      // Encode to buffer
      const buffer = CommandEnvelope.encode(envelope).finish();
      
      // Log the raw protobuf before HMAC wrapping
      logger.info('Raw protobuf command before HMAC', {
        deviceDbId,
        hostname,
        bufferSize: buffer.length,
        rawHex: Buffer.from(buffer).toString('hex'),
        rawBytes: Array.from(buffer),
        deviceConfigVerify: {
          device_id: deviceConfig.deviceId,  // Access with camelCase
          hostname: deviceConfig.hostname
        }
      });
      
      // Wrap with HMAC
      const wrappedCommand = wrapHMAC(Buffer.from(buffer), sequence);

      logger.debug('Built device ID sync command', {
        deviceDbId,
        hostname,
        requestId,
        sequence,
        commandSize: wrappedCommand.length
      });

      return {
        command: wrappedCommand,
        requestId,
        sequence
      };
    } catch (error) {
      logger.error('Error building device ID sync command', error);
      throw error;
    }
  }

  /**
   * Build SystemCommand for status request
   */
  static buildStatusRequestCommand(): {
    command: Buffer;
    requestId: string;
    sequence: number;
  } {
    try {
      const requestId = uuidv4();
      const sequence = this.getNextSequence();

      // Create SystemCommand
      const SystemCommand = messages.esg.alarm.SystemCommand;
      const systemCommand = SystemCommand.create({
        action: messages.esg.alarm.SystemCommand.SystemAction.SYS_GET_STATUS
      });

      // Create CommandEnvelope
      const CommandEnvelope = messages.esg.alarm.CommandEnvelope;
      const envelope = CommandEnvelope.create({
        sequence: sequence,
        timestamp: Math.floor(Date.now() / 1000),
        requestId: requestId,  // Fixed: use camelCase
        authLevel: 0, // Fixed: use camelCase
        system: systemCommand
      });

      // Encode to buffer
      const buffer = CommandEnvelope.encode(envelope).finish();
      
      // Wrap with HMAC
      const wrappedCommand = wrapHMAC(Buffer.from(buffer), sequence);

      logger.debug('Built status request command', {
        requestId,
        sequence,
        commandSize: wrappedCommand.length
      });

      return {
        command: wrappedCommand,
        requestId,
        sequence
      };
    } catch (error) {
      logger.error('Error building status request command', error);
      throw error;
    }
  }

  /**
   * Build DiagnosticCommand for diagnostics
   */
  static buildDiagnosticCommand(
    action: 'MEMORY_INFO' | 'NETWORK_INFO' | 'SENSOR_READ' | 'SELF_TEST' | 'LOG_DUMP',
    testMask?: number,
    logLines?: number
  ): {
    command: Buffer;
    requestId: string;
    sequence: number;
  } {
    try {
      const requestId = uuidv4();
      const sequence = this.getNextSequence();

      // Map diagnostic action
      const actionMap = {
        'MEMORY_INFO': messages.esg.alarm.DiagnosticCommand.DiagAction.DIAG_MEMORY_INFO,
        'NETWORK_INFO': messages.esg.alarm.DiagnosticCommand.DiagAction.DIAG_NETWORK_INFO,
        'SENSOR_READ': messages.esg.alarm.DiagnosticCommand.DiagAction.DIAG_SENSOR_READ,
        'SELF_TEST': messages.esg.alarm.DiagnosticCommand.DiagAction.DIAG_SELF_TEST,
        'LOG_DUMP': messages.esg.alarm.DiagnosticCommand.DiagAction.DIAG_LOG_DUMP
      };

      // Create DiagnosticCommand
      const DiagnosticCommand = messages.esg.alarm.DiagnosticCommand;
      const diagnosticCommand = DiagnosticCommand.create({
        action: actionMap[action],
        testMask: testMask || 0,
        logLines: logLines || 0
      });

      // Create CommandEnvelope
      const CommandEnvelope = messages.esg.alarm.CommandEnvelope;
      const envelope = CommandEnvelope.create({
        sequence: sequence,
        timestamp: Math.floor(Date.now() / 1000),
        requestId: requestId,  // Using camelCase
        authLevel: 1, // Using camelCase
        diagnostic: diagnosticCommand
      });

      // Encode to buffer
      const buffer = CommandEnvelope.encode(envelope).finish();
      
      // Log the raw protobuf before HMAC wrapping
      logger.info('Raw protobuf diagnostic command before HMAC', {
        action,
        requestId,
        sequence,
        bufferSize: buffer.length,
        rawHex: Buffer.from(buffer).toString('hex'),
        rawBytes: Array.from(buffer),
        // Log the encoded fields to verify request_id is included
        envelopeFields: {
          sequence,
          timestamp: envelope.timestamp,
          requestId: envelope.requestId,
          authLevel: envelope.authLevel
        }
      });
      
      // Wrap with HMAC
      const wrappedCommand = wrapHMAC(Buffer.from(buffer), sequence);

      logger.debug('Built diagnostic command', {
        action,
        requestId,
        sequence,
        commandSize: wrappedCommand.length
      });

      return {
        command: wrappedCommand,
        requestId,
        sequence
      };
    } catch (error) {
      logger.error('Error building diagnostic command', error);
      throw error;
    }
  }

  /**
   * Build OutputCommand for controlling outputs
   */
  static buildOutputCommand(
    outputType: 'siren' | 'turret' | 'relay1' | 'relay2' | 'all',
    state: boolean,
    duration?: number
  ): {
    command: Buffer;
    requestId: string;
    sequence: number;
  } {
    try {
      const requestId = uuidv4();
      const sequence = this.getNextSequence();

      // Map output type
      const outputTypeMap = {
        'siren': messages.esg.alarm.OutputCommand.OutputType.OUT_SIREN,
        'turret': messages.esg.alarm.OutputCommand.OutputType.OUT_TURRET,
        'relay1': messages.esg.alarm.OutputCommand.OutputType.OUT_RELAY1,
        'relay2': messages.esg.alarm.OutputCommand.OutputType.OUT_RELAY2,
        'all': messages.esg.alarm.OutputCommand.OutputType.OUT_ALL
      };

      // Create OutputCommand
      const OutputCommand = messages.esg.alarm.OutputCommand;
      const outputCommand = OutputCommand.create({
        output: outputTypeMap[outputType],
        pattern: messages.esg.alarm.OutputCommand.PatternType.PATTERN_CONSTANT,
        state: state,
        total_duration: duration || 0 // 0 = permanent
      });

      // Create CommandEnvelope
      const CommandEnvelope = messages.esg.alarm.CommandEnvelope;
      const envelope = CommandEnvelope.create({
        sequence: sequence,
        timestamp: Math.floor(Date.now() / 1000),
        requestId: requestId,  // Fixed: use camelCase
        authLevel: 2, // Fixed: use camelCase
        output: outputCommand
      });

      // Encode to buffer
      const buffer = CommandEnvelope.encode(envelope).finish();
      
      // Wrap with HMAC
      const wrappedCommand = wrapHMAC(Buffer.from(buffer), sequence);

      logger.debug('Built output command', {
        outputType,
        state,
        duration,
        requestId,
        sequence,
        commandSize: wrappedCommand.length
      });

      return {
        command: wrappedCommand,
        requestId,
        sequence
      };
    } catch (error) {
      logger.error('Error building output command', error);
      throw error;
    }
  }
}

export default CommandBuilder;