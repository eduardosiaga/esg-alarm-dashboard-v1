import { esg } from '../protobuf/compiled/messages';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export class CommandBuilder {
  private static sequence: number = Date.now() % 100000;

  /**
   * Get next sequence number
   */
  private static getNextSequence(): number {
    this.sequence = (this.sequence + 1) % 4294967296; // uint32 max
    return this.sequence;
  }

  /**
   * Build SystemCommand with optional field support
   */
  static buildSystemCommand(
    action: esg.alarm.SystemCommand.SystemAction,
    options?: {
      delaySeconds?: number;
      unixTime?: number;
    }
  ): esg.alarm.ICommandEnvelope {
    const systemCmd = esg.alarm.SystemCommand.create({
      action
    });

    // Use optional fields pattern
    if (options?.delaySeconds !== undefined) {
      systemCmd.delaySeconds = options.delaySeconds;
    }
    if (options?.unixTime !== undefined) {
      systemCmd.unixTime = options.unixTime;
    }

    return this.wrapCommand({ system: systemCmd });
  }

  /**
   * Build ConfigCommand with partial updates using optional fields
   */
  static buildConfigCommand(
    type: esg.alarm.ConfigCommand.ConfigType,
    config: Partial<any>
  ): esg.alarm.ICommandEnvelope {
    const configCmd = esg.alarm.ConfigCommand.create({ type });

    // Handle each config type with optional fields
    switch (type) {
      case esg.alarm.ConfigCommand.ConfigType.CFG_WIFI:
        const wifiConfig = esg.alarm.WifiConfig.create();
        // Only set fields that are provided
        if (config.ssid !== undefined) wifiConfig.ssid = config.ssid;
        if (config.password !== undefined) wifiConfig.password = config.password;
        if (config.dhcp !== undefined) wifiConfig.dhcp = config.dhcp;
        if (config.staticIp !== undefined) wifiConfig.staticIp = config.staticIp;
        if (config.gateway !== undefined) wifiConfig.gateway = config.gateway;
        if (config.netmask !== undefined) wifiConfig.netmask = config.netmask;
        configCmd.wifi = wifiConfig;
        break;

      case esg.alarm.ConfigCommand.ConfigType.CFG_MQTT:
        const mqttConfig = esg.alarm.MqttConfig.create();
        if (config.brokerUrl !== undefined) mqttConfig.brokerUrl = config.brokerUrl;
        if (config.port !== undefined) mqttConfig.port = config.port;
        if (config.username !== undefined) mqttConfig.username = config.username;
        if (config.password !== undefined) mqttConfig.password = config.password;
        if (config.keepalive !== undefined) mqttConfig.keepalive = config.keepalive;
        if (config.qos !== undefined) mqttConfig.qos = config.qos;
        if (config.useTls !== undefined) mqttConfig.useTls = config.useTls;
        configCmd.mqtt = mqttConfig;
        break;

      case esg.alarm.ConfigCommand.ConfigType.CFG_DEVICE:
        const deviceConfig = esg.alarm.DeviceConfig.create();
        if (config.hostname !== undefined) deviceConfig.hostname = config.hostname;
        if (config.deviceId !== undefined) deviceConfig.deviceId = config.deviceId;
        if (config.enableHeartbeat !== undefined) deviceConfig.enableHeartbeat = config.enableHeartbeat;
        if (config.heartbeatInterval !== undefined) deviceConfig.heartbeatInterval = config.heartbeatInterval;
        configCmd.device = deviceConfig;
        break;

      case esg.alarm.ConfigCommand.ConfigType.CFG_LOCATION:
        const locationConfig = esg.alarm.LocationConfig.create();
        if (config.country !== undefined) locationConfig.country = config.country;
        if (config.zone !== undefined) locationConfig.zone = config.zone;
        if (config.latitude !== undefined) locationConfig.latitude = config.latitude;
        if (config.longitude !== undefined) locationConfig.longitude = config.longitude;
        configCmd.location = locationConfig;
        break;

      case esg.alarm.ConfigCommand.ConfigType.CFG_NTP:
        const ntpConfig = esg.alarm.NTPConfig.create();
        if (config.server1 !== undefined) ntpConfig.server1 = config.server1;
        if (config.server2 !== undefined) ntpConfig.server2 = config.server2;
        if (config.server3 !== undefined) ntpConfig.server3 = config.server3;
        if (config.enableSync !== undefined) ntpConfig.enableSync = config.enableSync;
        if (config.syncInterval !== undefined) ntpConfig.syncInterval = config.syncInterval;
        if (config.timezoneOffset !== undefined) ntpConfig.timezoneOffset = config.timezoneOffset;
        if (config.timezoneName !== undefined) ntpConfig.timezoneName = config.timezoneName;
        configCmd.ntp = ntpConfig;
        break;

      case esg.alarm.ConfigCommand.ConfigType.CFG_BLE:
        const bleConfig = esg.alarm.BLEConfig.create();
        if (config.enable !== undefined) bleConfig.enable = config.enable;
        if (config.deviceName !== undefined) bleConfig.deviceName = config.deviceName;
        if (config.advertise !== undefined) bleConfig.advertise = config.advertise;
        if (config.intervalMs !== undefined) bleConfig.intervalMs = config.intervalMs;
        if (config.advHmacKey !== undefined) bleConfig.advHmacKey = config.advHmacKey;
        if (config.sppHmacKey !== undefined) bleConfig.sppHmacKey = config.sppHmacKey;
        if (config.txPower !== undefined) bleConfig.txPower = config.txPower;
        configCmd.ble = bleConfig;
        break;

      default:
        logger.warn('Unknown config type', { type });
    }

    return this.wrapCommand({ config: configCmd });
  }

  /**
   * Build OutputCommand with pattern control
   */
  static buildOutputCommand(
    output: esg.alarm.OutputCommand.OutputType,
    pattern: esg.alarm.OutputCommand.PatternType,
    options?: {
      state?: boolean;
      totalDuration?: number;
      pulseCount?: number;
      onDurationMs?: number;
      offDurationMs?: number;
      repeatInterval?: number;
      customData?: number;
    }
  ): esg.alarm.ICommandEnvelope {
    const outputCmd = esg.alarm.OutputCommand.create({
      output,
      pattern
    });

    // Set optional fields only if provided
    if (options?.state !== undefined) outputCmd.state = options.state;
    if (options?.totalDuration !== undefined) outputCmd.totalDuration = options.totalDuration;
    if (options?.pulseCount !== undefined) outputCmd.pulseCount = options.pulseCount;
    if (options?.onDurationMs !== undefined) outputCmd.onDurationMs = options.onDurationMs;
    if (options?.offDurationMs !== undefined) outputCmd.offDurationMs = options.offDurationMs;
    if (options?.repeatInterval !== undefined) outputCmd.repeatInterval = options.repeatInterval;
    if (options?.customData !== undefined) outputCmd.customData = options.customData;

    return this.wrapCommand({ output: outputCmd });
  }

  /**
   * Build DiagnosticCommand
   */
  static buildDiagnosticCommand(
    action: esg.alarm.DiagnosticCommand.DiagAction,
    options?: {
      testMask?: number;
      logLines?: number;
    }
  ): esg.alarm.ICommandEnvelope {
    const diagnosticCmd = esg.alarm.DiagnosticCommand.create({
      action
    });

    if (options?.testMask !== undefined) diagnosticCmd.testMask = options.testMask;
    if (options?.logLines !== undefined) diagnosticCmd.logLines = options.logLines;

    return this.wrapCommand({ diagnostic: diagnosticCmd });
  }

  /**
   * Build OTACommand
   */
  static buildOTACommand(
    action: esg.alarm.OTACommand.OTAAction,
    options?: {
      url?: string;
      md5?: string;
      size?: number;
    }
  ): esg.alarm.ICommandEnvelope {
    const otaCmd = esg.alarm.OTACommand.create({
      action
    });

    if (options?.url !== undefined) otaCmd.url = options.url;
    if (options?.md5 !== undefined) otaCmd.md5 = options.md5;
    if (options?.size !== undefined) otaCmd.size = options.size;

    return this.wrapCommand({ ota: otaCmd });
  }

  /**
   * Build ConfigReadCommand
   */
  static buildConfigReadCommand(
    type: esg.alarm.ConfigReadCommand.ReadType,
    includeSensitive: boolean = false
  ): esg.alarm.ICommandEnvelope {
    const configReadCmd = esg.alarm.ConfigReadCommand.create({
      type,
      includeSensitive
    });

    return this.wrapCommand({ configRead: configReadCmd });
  }

  /**
   * Wrap command in envelope with metadata
   */
  private static wrapCommand(command: any): esg.alarm.ICommandEnvelope {
    const envelope = esg.alarm.CommandEnvelope.create({
      sequence: this.getNextSequence(),
      timestamp: Math.floor(Date.now() / 1000),
      requestId: uuidv4(),
      authLevel: 2, // Admin by default
      ...command
    });

    logger.debug('Command envelope created', {
      sequence: envelope.sequence,
      requestId: envelope.requestId,
      commandType: Object.keys(command)[0]
    });

    return envelope;
  }

  /**
   * Encode command envelope to buffer with HMAC wrapper
   */
  static encodeCommand(envelope: esg.alarm.ICommandEnvelope): Buffer {
    const encoded = esg.alarm.CommandEnvelope.encode(envelope).finish();
    
    // Import HmacWrapper
    const { HmacWrapper } = require('../protobuf/hmac-wrapper');
    const wrapped = HmacWrapper.wrap(Buffer.from(encoded), envelope.sequence!);
    
    return wrapped;
  }
}