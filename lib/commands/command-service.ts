import { esg } from '../protobuf/compiled/messages';
import { CommandBuilder } from './command-builder';
import { DeviceService } from '../db/device-service';
import { logger } from '../utils/logger';
import { getMqttClient } from '../mqtt/client';
import { EventEmitter } from 'events';

interface PendingCommand {
  resolve: (response: esg.alarm.ICommandResponse) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
  deviceId: number;
  commandType: string;
}

interface CommandResult {
  success: boolean;
  message?: string;
  errorCode?: number;
  payload?: any;
  requestId: string;
  sequence: number;
}

export class CommandService {
  private static pendingCommands = new Map<string, PendingCommand>();
  private static responseEmitter = new EventEmitter();

  /**
   * Send command and wait for response
   */
  static async sendCommand(
    deviceId: string,
    command: esg.alarm.ICommandEnvelope,
    timeoutMs: number = 30000
  ): Promise<CommandResult> {
    const device = await DeviceService.findById(parseInt(deviceId));
    if (!device) throw new Error('Device not found');

    // Get command type for logging
    const commandType = this.getCommandType(command);

    // Encode command
    const encoded = CommandBuilder.encodeCommand(command);

    // Log command to database
    await DeviceService.logCommand({
      deviceId: device.id,
      requestId: command.requestId!,
      sequence: command.sequence!,
      commandType,
      commandData: command,
      status: 'PENDING'
    });

    // Setup response listener
    const responsePromise = this.waitForResponse(
      command.requestId!,
      device.id,
      commandType,
      timeoutMs
    );

    // Publish command
    try {
      const mqttClient = getMqttClient();
      const topic = `${mqttClient.getConfig().baseTopic}/pb/d/${device.hostname}/cmd`;
      await mqttClient.publish(topic, encoded);
      
      logger.info('Command sent via MQTT', {
        deviceId: device.id,
        hostname: device.hostname,
        requestId: command.requestId,
        commandType,
        topic
      });
    } catch (mqttError: any) {
      logger.warn('MQTT client not available, command logged for later sending', {
        error: mqttError.message,
        deviceId: device.id,
        requestId: command.requestId
      });
    }

    // Wait for response
    try {
      const response = await responsePromise;
      
      // Update command status
      await DeviceService.updateCommandStatus(
        command.requestId!,
        response.success ? 'COMPLETED' : 'FAILED',
        {
          errorCode: response.errorCode || 0,
          message: response.message || '',
          respondedAt: new Date()
        }
      );

      return {
        success: response.success!,
        message: response.message || undefined,
        errorCode: response.errorCode || undefined,
        payload: response.payload || undefined,
        requestId: command.requestId!,
        sequence: command.sequence!
      };
    } catch (error: any) {
      // Timeout or error
      await DeviceService.updateCommandStatus(
        command.requestId!,
        'TIMEOUT'
      );
      
      throw new Error(`Command timeout: ${error.message}`);
    }
  }

  /**
   * Send system command
   */
  static async sendSystemCommand(
    deviceId: string,
    action: string,
    options?: any
  ): Promise<CommandResult> {
    const actionEnum = this.mapSystemAction(action);
    const command = CommandBuilder.buildSystemCommand(actionEnum, options);
    return this.sendCommand(deviceId, command);
  }

  /**
   * Send configuration command with partial updates
   */
  static async sendConfigCommand(
    deviceId: string,
    type: string,
    config: any
  ): Promise<CommandResult> {
    const configType = this.mapConfigType(type);
    const command = CommandBuilder.buildConfigCommand(configType, config);
    return this.sendCommand(deviceId, command);
  }

  /**
   * Send output control command
   */
  static async sendOutputCommand(
    deviceId: string,
    output: string,
    pattern: string,
    options?: any
  ): Promise<CommandResult> {
    const outputType = this.mapOutputType(output);
    const patternType = this.mapPatternType(pattern);
    const command = CommandBuilder.buildOutputCommand(outputType, patternType, options);
    return this.sendCommand(deviceId, command);
  }

  /**
   * Send diagnostic command
   */
  static async sendDiagnosticCommand(
    deviceId: string,
    action: string,
    options?: any
  ): Promise<CommandResult> {
    const actionEnum = this.mapDiagnosticAction(action);
    const command = CommandBuilder.buildDiagnosticCommand(actionEnum, options);
    return this.sendCommand(deviceId, command);
  }

  /**
   * Send OTA command
   */
  static async sendOTACommand(
    deviceId: string,
    action: string,
    options?: any
  ): Promise<CommandResult> {
    const actionEnum = this.mapOTAAction(action);
    const command = CommandBuilder.buildOTACommand(actionEnum, options);
    return this.sendCommand(deviceId, command);
  }

  /**
   * Read device configuration
   */
  static async readConfig(
    deviceId: string,
    type: string,
    includeSensitive: boolean = false
  ): Promise<CommandResult> {
    const readType = this.mapReadType(type);
    const command = CommandBuilder.buildConfigReadCommand(readType, includeSensitive);
    return this.sendCommand(deviceId, command);
  }

  /**
   * Wait for command response
   */
  private static waitForResponse(
    requestId: string,
    deviceId: number,
    commandType: string,
    timeoutMs: number
  ): Promise<esg.alarm.ICommandResponse> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingCommands.delete(requestId);
        reject(new Error(`Command timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      this.pendingCommands.set(requestId, {
        resolve,
        reject,
        timeout,
        deviceId,
        commandType
      });

      logger.debug('Waiting for command response', {
        requestId,
        deviceId,
        commandType,
        timeoutMs
      });
    });
  }

  /**
   * Handle incoming command response
   */
  static handleResponse(response: esg.alarm.ICommandResponse) {
    const pending = this.pendingCommands.get(response.requestId!);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingCommands.delete(response.requestId!);
      
      logger.info('Command response received', {
        requestId: response.requestId,
        success: response.success,
        errorCode: response.errorCode,
        message: response.message
      });
      
      pending.resolve(response);
    } else {
      logger.warn('Received response for unknown command', {
        requestId: response.requestId
      });
    }
  }

  /**
   * Get command type from envelope
   */
  private static getCommandType(command: esg.alarm.ICommandEnvelope): string {
    if (command.system) return 'SYSTEM';
    if (command.config) return 'CONFIG';
    if (command.output) return 'OUTPUT';
    if (command.diagnostic) return 'DIAGNOSTIC';
    if (command.ota) return 'OTA';
    if (command.configRead) return 'CONFIG_READ';
    return 'UNKNOWN';
  }

  // Mapping functions
  private static mapSystemAction(action: string): esg.alarm.SystemCommand.SystemAction {
    const map: { [key: string]: esg.alarm.SystemCommand.SystemAction } = {
      'REBOOT': esg.alarm.SystemCommand.SystemAction.SYS_REBOOT,
      'FACTORY_RESET': esg.alarm.SystemCommand.SystemAction.SYS_FACTORY_RESET,
      'GET_STATUS': esg.alarm.SystemCommand.SystemAction.SYS_GET_STATUS,
      'SET_TIME': esg.alarm.SystemCommand.SystemAction.SYS_SET_TIME,
      'CLEAR_COUNTERS': esg.alarm.SystemCommand.SystemAction.SYS_CLEAR_COUNTERS
    };
    return map[action] || esg.alarm.SystemCommand.SystemAction.SYS_UNKNOWN;
  }

  private static mapConfigType(type: string): esg.alarm.ConfigCommand.ConfigType {
    const map: { [key: string]: esg.alarm.ConfigCommand.ConfigType } = {
      'WIFI': esg.alarm.ConfigCommand.ConfigType.CFG_WIFI,
      'MQTT': esg.alarm.ConfigCommand.ConfigType.CFG_MQTT,
      'DEVICE': esg.alarm.ConfigCommand.ConfigType.CFG_DEVICE,
      'LOCATION': esg.alarm.ConfigCommand.ConfigType.CFG_LOCATION,
      'NTP': esg.alarm.ConfigCommand.ConfigType.CFG_NTP,
      'BLE': esg.alarm.ConfigCommand.ConfigType.CFG_BLE
    };
    return map[type.toUpperCase()] || esg.alarm.ConfigCommand.ConfigType.CFG_UNKNOWN;
  }

  private static mapOutputType(output: string): esg.alarm.OutputCommand.OutputType {
    const map: { [key: string]: esg.alarm.OutputCommand.OutputType } = {
      'SIREN': esg.alarm.OutputCommand.OutputType.OUT_SIREN,
      'TURRET': esg.alarm.OutputCommand.OutputType.OUT_TURRET,
      'RELAY1': esg.alarm.OutputCommand.OutputType.OUT_RELAY1,
      'RELAY2': esg.alarm.OutputCommand.OutputType.OUT_RELAY2,
      'FAN': esg.alarm.OutputCommand.OutputType.OUT_FAN,
      'ALL': esg.alarm.OutputCommand.OutputType.OUT_ALL
    };
    return map[output.toUpperCase()] || esg.alarm.OutputCommand.OutputType.OUT_UNKNOWN;
  }

  private static mapPatternType(pattern: string): esg.alarm.OutputCommand.PatternType {
    const map: { [key: string]: esg.alarm.OutputCommand.PatternType } = {
      'CONSTANT': esg.alarm.OutputCommand.PatternType.PATTERN_CONSTANT,
      'PULSE': esg.alarm.OutputCommand.PatternType.PATTERN_PULSE,
      'BLINK_SLOW': esg.alarm.OutputCommand.PatternType.PATTERN_BLINK_SLOW,
      'BLINK_FAST': esg.alarm.OutputCommand.PatternType.PATTERN_BLINK_FAST,
      'DOUBLE_PULSE': esg.alarm.OutputCommand.PatternType.PATTERN_DOUBLE_PULSE,
      'TRIPLE_PULSE': esg.alarm.OutputCommand.PatternType.PATTERN_TRIPLE_PULSE,
      'SOS': esg.alarm.OutputCommand.PatternType.PATTERN_SOS,
      'STROBE': esg.alarm.OutputCommand.PatternType.PATTERN_STROBE,
      'OFF': esg.alarm.OutputCommand.PatternType.PATTERN_OFF,
      'PWM': esg.alarm.OutputCommand.PatternType.PATTERN_PWM,
      'CUSTOM': esg.alarm.OutputCommand.PatternType.PATTERN_CUSTOM
    };
    return map[pattern.toUpperCase()] || esg.alarm.OutputCommand.PatternType.PATTERN_NONE;
  }

  private static mapDiagnosticAction(action: string): esg.alarm.DiagnosticCommand.DiagAction {
    const map: { [key: string]: esg.alarm.DiagnosticCommand.DiagAction } = {
      'SELF_TEST': esg.alarm.DiagnosticCommand.DiagAction.DIAG_SELF_TEST,
      'MEMORY_INFO': esg.alarm.DiagnosticCommand.DiagAction.DIAG_MEMORY_INFO,
      'NETWORK_INFO': esg.alarm.DiagnosticCommand.DiagAction.DIAG_NETWORK_INFO,
      'SENSOR_READ': esg.alarm.DiagnosticCommand.DiagAction.DIAG_SENSOR_READ,
      'LOG_DUMP': esg.alarm.DiagnosticCommand.DiagAction.DIAG_LOG_DUMP,
      'INOUT_READ': esg.alarm.DiagnosticCommand.DiagAction.DIAG_INOUT_READ
    };
    return map[action.toUpperCase()] || esg.alarm.DiagnosticCommand.DiagAction.DIAG_UNKNOWN;
  }

  private static mapOTAAction(action: string): esg.alarm.OTACommand.OTAAction {
    const map: { [key: string]: esg.alarm.OTACommand.OTAAction } = {
      'CHECK_UPDATE': esg.alarm.OTACommand.OTAAction.OTA_CHECK_UPDATE,
      'START_UPDATE': esg.alarm.OTACommand.OTAAction.OTA_START_UPDATE,
      'VALIDATE': esg.alarm.OTACommand.OTAAction.OTA_VALIDATE,
      'ROLLBACK': esg.alarm.OTACommand.OTAAction.OTA_ROLLBACK,
      'GET_STATUS': esg.alarm.OTACommand.OTAAction.OTA_GET_STATUS
    };
    return map[action.toUpperCase()] || esg.alarm.OTACommand.OTAAction.OTA_UNKNOWN;
  }

  private static mapReadType(type: string): esg.alarm.ConfigReadCommand.ReadType {
    const map: { [key: string]: esg.alarm.ConfigReadCommand.ReadType } = {
      'WIFI': esg.alarm.ConfigReadCommand.ReadType.READ_WIFI,
      'MQTT': esg.alarm.ConfigReadCommand.ReadType.READ_MQTT,
      'DEVICE': esg.alarm.ConfigReadCommand.ReadType.READ_DEVICE,
      'LOCATION': esg.alarm.ConfigReadCommand.ReadType.READ_LOCATION,
      'NTP': esg.alarm.ConfigReadCommand.ReadType.READ_NTP,
      'BLE': esg.alarm.ConfigReadCommand.ReadType.READ_BLE,
      'ALL': esg.alarm.ConfigReadCommand.ReadType.READ_ALL
    };
    return map[type.toUpperCase()] || esg.alarm.ConfigReadCommand.ReadType.READ_UNKNOWN;
  }
}