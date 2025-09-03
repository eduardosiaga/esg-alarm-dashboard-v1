import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace esg. */
export namespace esg {

    /** Namespace alarm. */
    namespace alarm {

        /** Properties of an AlarmEvent. */
        interface IAlarmEvent {

            /** AlarmEvent sequence */
            sequence?: (number|null);

            /** AlarmEvent timestamp */
            timestamp?: (number|null);

            /** AlarmEvent deviceDbId */
            deviceDbId?: (number|null);

            /** AlarmEvent type */
            type?: (esg.alarm.AlarmEvent.AlarmType|null);

            /** AlarmEvent state */
            state?: (esg.alarm.AlarmEvent.EventState|null);

            /** AlarmEvent priority */
            priority?: (esg.alarm.AlarmEvent.Priority|null);

            /** AlarmEvent physicalState */
            physicalState?: (boolean|null);

            /** AlarmEvent outputType */
            outputType?: (number|null);

            /** AlarmEvent patternType */
            patternType?: (number|null);

            /** AlarmEvent durationSeconds */
            durationSeconds?: (number|null);

            /** AlarmEvent elapsedSeconds */
            elapsedSeconds?: (number|null);
        }

        /** Represents an AlarmEvent. */
        class AlarmEvent implements IAlarmEvent {

            /**
             * Constructs a new AlarmEvent.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IAlarmEvent);

            /** AlarmEvent sequence. */
            public sequence: number;

            /** AlarmEvent timestamp. */
            public timestamp: number;

            /** AlarmEvent deviceDbId. */
            public deviceDbId: number;

            /** AlarmEvent type. */
            public type: esg.alarm.AlarmEvent.AlarmType;

            /** AlarmEvent state. */
            public state: esg.alarm.AlarmEvent.EventState;

            /** AlarmEvent priority. */
            public priority: esg.alarm.AlarmEvent.Priority;

            /** AlarmEvent physicalState. */
            public physicalState: boolean;

            /** AlarmEvent outputType. */
            public outputType: number;

            /** AlarmEvent patternType. */
            public patternType: number;

            /** AlarmEvent durationSeconds. */
            public durationSeconds: number;

            /** AlarmEvent elapsedSeconds. */
            public elapsedSeconds: number;

            /**
             * Creates a new AlarmEvent instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AlarmEvent instance
             */
            public static create(properties?: esg.alarm.IAlarmEvent): esg.alarm.AlarmEvent;

            /**
             * Encodes the specified AlarmEvent message. Does not implicitly {@link esg.alarm.AlarmEvent.verify|verify} messages.
             * @param message AlarmEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IAlarmEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AlarmEvent message, length delimited. Does not implicitly {@link esg.alarm.AlarmEvent.verify|verify} messages.
             * @param message AlarmEvent message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IAlarmEvent, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AlarmEvent message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AlarmEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.AlarmEvent;

            /**
             * Decodes an AlarmEvent message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AlarmEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.AlarmEvent;

            /**
             * Verifies an AlarmEvent message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AlarmEvent message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AlarmEvent
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.AlarmEvent;

            /**
             * Creates a plain object from an AlarmEvent message. Also converts values to other types if specified.
             * @param message AlarmEvent
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.AlarmEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AlarmEvent to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AlarmEvent
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AlarmEvent {

            /** AlarmType enum. */
            enum AlarmType {
                ALARM_UNKNOWN = 0,
                ALARM_PANIC1 = 1,
                ALARM_PANIC2 = 2,
                ALARM_TAMPER = 3,
                ALARM_FIRE = 4,
                ALARM_INTRUSION = 5,
                ALARM_MEDICAL = 6,
                ALARM_DURESS = 7,
                OUTPUT_EVENT = 10
            }

            /** EventState enum. */
            enum EventState {
                STATE_INACTIVE = 0,
                STATE_ACTIVE = 1,
                STATE_TEST = 2,
                STATE_STARTING = 3,
                STATE_STOPPING = 4
            }

            /** Priority enum. */
            enum Priority {
                PRIORITY_LOW = 0,
                PRIORITY_MEDIUM = 1,
                PRIORITY_HIGH = 2,
                PRIORITY_CRITICAL = 3
            }
        }

        /** CommandType enum. */
        enum CommandType {
            CMD_UNKNOWN = 0,
            CMD_SYSTEM = 1,
            CMD_CONFIG = 2,
            CMD_OUTPUT = 3,
            CMD_DIAGNOSTIC = 4,
            CMD_OTA = 5
        }

        /** Properties of a SystemCommand. */
        interface ISystemCommand {

            /** SystemCommand action */
            action?: (esg.alarm.SystemCommand.SystemAction|null);

            /** SystemCommand delaySeconds */
            delaySeconds?: (number|null);

            /** SystemCommand unixTime */
            unixTime?: (number|null);
        }

        /** Represents a SystemCommand. */
        class SystemCommand implements ISystemCommand {

            /**
             * Constructs a new SystemCommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.ISystemCommand);

            /** SystemCommand action. */
            public action: esg.alarm.SystemCommand.SystemAction;

            /** SystemCommand delaySeconds. */
            public delaySeconds: number;

            /** SystemCommand unixTime. */
            public unixTime: number;

            /**
             * Creates a new SystemCommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SystemCommand instance
             */
            public static create(properties?: esg.alarm.ISystemCommand): esg.alarm.SystemCommand;

            /**
             * Encodes the specified SystemCommand message. Does not implicitly {@link esg.alarm.SystemCommand.verify|verify} messages.
             * @param message SystemCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.ISystemCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SystemCommand message, length delimited. Does not implicitly {@link esg.alarm.SystemCommand.verify|verify} messages.
             * @param message SystemCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.ISystemCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SystemCommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SystemCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.SystemCommand;

            /**
             * Decodes a SystemCommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SystemCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.SystemCommand;

            /**
             * Verifies a SystemCommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SystemCommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SystemCommand
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.SystemCommand;

            /**
             * Creates a plain object from a SystemCommand message. Also converts values to other types if specified.
             * @param message SystemCommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.SystemCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SystemCommand to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for SystemCommand
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace SystemCommand {

            /** SystemAction enum. */
            enum SystemAction {
                SYS_UNKNOWN = 0,
                SYS_REBOOT = 1,
                SYS_FACTORY_RESET = 2,
                SYS_GET_STATUS = 3,
                SYS_SET_TIME = 4,
                SYS_CLEAR_COUNTERS = 5
            }
        }

        /** Properties of a ConfigCommand. */
        interface IConfigCommand {

            /** ConfigCommand type */
            type?: (esg.alarm.ConfigCommand.ConfigType|null);

            /** ConfigCommand wifi */
            wifi?: (esg.alarm.IWifiConfig|null);

            /** ConfigCommand mqtt */
            mqtt?: (esg.alarm.IMqttConfig|null);

            /** ConfigCommand device */
            device?: (esg.alarm.IDeviceConfig|null);

            /** ConfigCommand location */
            location?: (esg.alarm.ILocationConfig|null);

            /** ConfigCommand ntp */
            ntp?: (esg.alarm.INTPConfig|null);

            /** ConfigCommand ble */
            ble?: (esg.alarm.IBLEConfig|null);
        }

        /** Represents a ConfigCommand. */
        class ConfigCommand implements IConfigCommand {

            /**
             * Constructs a new ConfigCommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IConfigCommand);

            /** ConfigCommand type. */
            public type: esg.alarm.ConfigCommand.ConfigType;

            /** ConfigCommand wifi. */
            public wifi?: (esg.alarm.IWifiConfig|null);

            /** ConfigCommand mqtt. */
            public mqtt?: (esg.alarm.IMqttConfig|null);

            /** ConfigCommand device. */
            public device?: (esg.alarm.IDeviceConfig|null);

            /** ConfigCommand location. */
            public location?: (esg.alarm.ILocationConfig|null);

            /** ConfigCommand ntp. */
            public ntp?: (esg.alarm.INTPConfig|null);

            /** ConfigCommand ble. */
            public ble?: (esg.alarm.IBLEConfig|null);

            /** ConfigCommand config. */
            public config?: ("wifi"|"mqtt"|"device"|"location"|"ntp"|"ble");

            /**
             * Creates a new ConfigCommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ConfigCommand instance
             */
            public static create(properties?: esg.alarm.IConfigCommand): esg.alarm.ConfigCommand;

            /**
             * Encodes the specified ConfigCommand message. Does not implicitly {@link esg.alarm.ConfigCommand.verify|verify} messages.
             * @param message ConfigCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IConfigCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ConfigCommand message, length delimited. Does not implicitly {@link esg.alarm.ConfigCommand.verify|verify} messages.
             * @param message ConfigCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IConfigCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ConfigCommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ConfigCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.ConfigCommand;

            /**
             * Decodes a ConfigCommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ConfigCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.ConfigCommand;

            /**
             * Verifies a ConfigCommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ConfigCommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ConfigCommand
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.ConfigCommand;

            /**
             * Creates a plain object from a ConfigCommand message. Also converts values to other types if specified.
             * @param message ConfigCommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.ConfigCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ConfigCommand to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ConfigCommand
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ConfigCommand {

            /** ConfigType enum. */
            enum ConfigType {
                CFG_UNKNOWN = 0,
                CFG_WIFI = 1,
                CFG_MQTT = 2,
                CFG_DEVICE = 3,
                CFG_LOCATION = 4,
                CFG_NTP = 5,
                CFG_BLE = 6
            }
        }

        /** Properties of a WifiConfig. */
        interface IWifiConfig {

            /** WifiConfig ssid */
            ssid?: (string|null);

            /** WifiConfig password */
            password?: (string|null);

            /** WifiConfig dhcp */
            dhcp?: (boolean|null);

            /** WifiConfig staticIp */
            staticIp?: (number|null);

            /** WifiConfig gateway */
            gateway?: (number|null);

            /** WifiConfig netmask */
            netmask?: (number|null);
        }

        /** Represents a WifiConfig. */
        class WifiConfig implements IWifiConfig {

            /**
             * Constructs a new WifiConfig.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IWifiConfig);

            /** WifiConfig ssid. */
            public ssid?: (string|null);

            /** WifiConfig password. */
            public password?: (string|null);

            /** WifiConfig dhcp. */
            public dhcp?: (boolean|null);

            /** WifiConfig staticIp. */
            public staticIp?: (number|null);

            /** WifiConfig gateway. */
            public gateway?: (number|null);

            /** WifiConfig netmask. */
            public netmask?: (number|null);

            /** WifiConfig _ssid. */
            public _ssid?: "ssid";

            /** WifiConfig _password. */
            public _password?: "password";

            /** WifiConfig _dhcp. */
            public _dhcp?: "dhcp";

            /** WifiConfig _staticIp. */
            public _staticIp?: "staticIp";

            /** WifiConfig _gateway. */
            public _gateway?: "gateway";

            /** WifiConfig _netmask. */
            public _netmask?: "netmask";

            /**
             * Creates a new WifiConfig instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WifiConfig instance
             */
            public static create(properties?: esg.alarm.IWifiConfig): esg.alarm.WifiConfig;

            /**
             * Encodes the specified WifiConfig message. Does not implicitly {@link esg.alarm.WifiConfig.verify|verify} messages.
             * @param message WifiConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IWifiConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WifiConfig message, length delimited. Does not implicitly {@link esg.alarm.WifiConfig.verify|verify} messages.
             * @param message WifiConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IWifiConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WifiConfig message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WifiConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.WifiConfig;

            /**
             * Decodes a WifiConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WifiConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.WifiConfig;

            /**
             * Verifies a WifiConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WifiConfig message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WifiConfig
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.WifiConfig;

            /**
             * Creates a plain object from a WifiConfig message. Also converts values to other types if specified.
             * @param message WifiConfig
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.WifiConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WifiConfig to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for WifiConfig
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a MqttConfig. */
        interface IMqttConfig {

            /** MqttConfig brokerUrl */
            brokerUrl?: (string|null);

            /** MqttConfig port */
            port?: (number|null);

            /** MqttConfig username */
            username?: (string|null);

            /** MqttConfig password */
            password?: (string|null);

            /** MqttConfig keepalive */
            keepalive?: (number|null);

            /** MqttConfig qos */
            qos?: (number|null);

            /** MqttConfig useTls */
            useTls?: (boolean|null);
        }

        /** Represents a MqttConfig. */
        class MqttConfig implements IMqttConfig {

            /**
             * Constructs a new MqttConfig.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IMqttConfig);

            /** MqttConfig brokerUrl. */
            public brokerUrl?: (string|null);

            /** MqttConfig port. */
            public port?: (number|null);

            /** MqttConfig username. */
            public username?: (string|null);

            /** MqttConfig password. */
            public password?: (string|null);

            /** MqttConfig keepalive. */
            public keepalive?: (number|null);

            /** MqttConfig qos. */
            public qos?: (number|null);

            /** MqttConfig useTls. */
            public useTls?: (boolean|null);

            /** MqttConfig _brokerUrl. */
            public _brokerUrl?: "brokerUrl";

            /** MqttConfig _port. */
            public _port?: "port";

            /** MqttConfig _username. */
            public _username?: "username";

            /** MqttConfig _password. */
            public _password?: "password";

            /** MqttConfig _keepalive. */
            public _keepalive?: "keepalive";

            /** MqttConfig _qos. */
            public _qos?: "qos";

            /** MqttConfig _useTls. */
            public _useTls?: "useTls";

            /**
             * Creates a new MqttConfig instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MqttConfig instance
             */
            public static create(properties?: esg.alarm.IMqttConfig): esg.alarm.MqttConfig;

            /**
             * Encodes the specified MqttConfig message. Does not implicitly {@link esg.alarm.MqttConfig.verify|verify} messages.
             * @param message MqttConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IMqttConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MqttConfig message, length delimited. Does not implicitly {@link esg.alarm.MqttConfig.verify|verify} messages.
             * @param message MqttConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IMqttConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MqttConfig message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MqttConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.MqttConfig;

            /**
             * Decodes a MqttConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MqttConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.MqttConfig;

            /**
             * Verifies a MqttConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MqttConfig message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MqttConfig
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.MqttConfig;

            /**
             * Creates a plain object from a MqttConfig message. Also converts values to other types if specified.
             * @param message MqttConfig
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.MqttConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MqttConfig to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for MqttConfig
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DeviceConfig. */
        interface IDeviceConfig {

            /** DeviceConfig hostname */
            hostname?: (string|null);

            /** DeviceConfig deviceId */
            deviceId?: (number|null);

            /** DeviceConfig enableHeartbeat */
            enableHeartbeat?: (boolean|null);

            /** DeviceConfig heartbeatInterval */
            heartbeatInterval?: (number|null);
        }

        /** Represents a DeviceConfig. */
        class DeviceConfig implements IDeviceConfig {

            /**
             * Constructs a new DeviceConfig.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IDeviceConfig);

            /** DeviceConfig hostname. */
            public hostname?: (string|null);

            /** DeviceConfig deviceId. */
            public deviceId?: (number|null);

            /** DeviceConfig enableHeartbeat. */
            public enableHeartbeat?: (boolean|null);

            /** DeviceConfig heartbeatInterval. */
            public heartbeatInterval?: (number|null);

            /** DeviceConfig _hostname. */
            public _hostname?: "hostname";

            /** DeviceConfig _deviceId. */
            public _deviceId?: "deviceId";

            /** DeviceConfig _enableHeartbeat. */
            public _enableHeartbeat?: "enableHeartbeat";

            /** DeviceConfig _heartbeatInterval. */
            public _heartbeatInterval?: "heartbeatInterval";

            /**
             * Creates a new DeviceConfig instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeviceConfig instance
             */
            public static create(properties?: esg.alarm.IDeviceConfig): esg.alarm.DeviceConfig;

            /**
             * Encodes the specified DeviceConfig message. Does not implicitly {@link esg.alarm.DeviceConfig.verify|verify} messages.
             * @param message DeviceConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IDeviceConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeviceConfig message, length delimited. Does not implicitly {@link esg.alarm.DeviceConfig.verify|verify} messages.
             * @param message DeviceConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IDeviceConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeviceConfig message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeviceConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.DeviceConfig;

            /**
             * Decodes a DeviceConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeviceConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.DeviceConfig;

            /**
             * Verifies a DeviceConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DeviceConfig message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DeviceConfig
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.DeviceConfig;

            /**
             * Creates a plain object from a DeviceConfig message. Also converts values to other types if specified.
             * @param message DeviceConfig
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.DeviceConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DeviceConfig to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DeviceConfig
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LocationConfig. */
        interface ILocationConfig {

            /** LocationConfig country */
            country?: (string|null);

            /** LocationConfig zone */
            zone?: (number|null);

            /** LocationConfig latitude */
            latitude?: (number|null);

            /** LocationConfig longitude */
            longitude?: (number|null);
        }

        /** Represents a LocationConfig. */
        class LocationConfig implements ILocationConfig {

            /**
             * Constructs a new LocationConfig.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.ILocationConfig);

            /** LocationConfig country. */
            public country?: (string|null);

            /** LocationConfig zone. */
            public zone?: (number|null);

            /** LocationConfig latitude. */
            public latitude?: (number|null);

            /** LocationConfig longitude. */
            public longitude?: (number|null);

            /** LocationConfig _country. */
            public _country?: "country";

            /** LocationConfig _zone. */
            public _zone?: "zone";

            /** LocationConfig _latitude. */
            public _latitude?: "latitude";

            /** LocationConfig _longitude. */
            public _longitude?: "longitude";

            /**
             * Creates a new LocationConfig instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LocationConfig instance
             */
            public static create(properties?: esg.alarm.ILocationConfig): esg.alarm.LocationConfig;

            /**
             * Encodes the specified LocationConfig message. Does not implicitly {@link esg.alarm.LocationConfig.verify|verify} messages.
             * @param message LocationConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.ILocationConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LocationConfig message, length delimited. Does not implicitly {@link esg.alarm.LocationConfig.verify|verify} messages.
             * @param message LocationConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.ILocationConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LocationConfig message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LocationConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.LocationConfig;

            /**
             * Decodes a LocationConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LocationConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.LocationConfig;

            /**
             * Verifies a LocationConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LocationConfig message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LocationConfig
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.LocationConfig;

            /**
             * Creates a plain object from a LocationConfig message. Also converts values to other types if specified.
             * @param message LocationConfig
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.LocationConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LocationConfig to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LocationConfig
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a NTPConfig. */
        interface INTPConfig {

            /** NTPConfig server1 */
            server1?: (string|null);

            /** NTPConfig server2 */
            server2?: (string|null);

            /** NTPConfig server3 */
            server3?: (string|null);

            /** NTPConfig enableSync */
            enableSync?: (boolean|null);

            /** NTPConfig syncInterval */
            syncInterval?: (number|null);

            /** NTPConfig timezoneOffset */
            timezoneOffset?: (number|null);

            /** NTPConfig timezoneName */
            timezoneName?: (string|null);
        }

        /** Represents a NTPConfig. */
        class NTPConfig implements INTPConfig {

            /**
             * Constructs a new NTPConfig.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.INTPConfig);

            /** NTPConfig server1. */
            public server1?: (string|null);

            /** NTPConfig server2. */
            public server2?: (string|null);

            /** NTPConfig server3. */
            public server3?: (string|null);

            /** NTPConfig enableSync. */
            public enableSync?: (boolean|null);

            /** NTPConfig syncInterval. */
            public syncInterval?: (number|null);

            /** NTPConfig timezoneOffset. */
            public timezoneOffset?: (number|null);

            /** NTPConfig timezoneName. */
            public timezoneName?: (string|null);

            /** NTPConfig _server1. */
            public _server1?: "server1";

            /** NTPConfig _server2. */
            public _server2?: "server2";

            /** NTPConfig _server3. */
            public _server3?: "server3";

            /** NTPConfig _enableSync. */
            public _enableSync?: "enableSync";

            /** NTPConfig _syncInterval. */
            public _syncInterval?: "syncInterval";

            /** NTPConfig _timezoneOffset. */
            public _timezoneOffset?: "timezoneOffset";

            /** NTPConfig _timezoneName. */
            public _timezoneName?: "timezoneName";

            /**
             * Creates a new NTPConfig instance using the specified properties.
             * @param [properties] Properties to set
             * @returns NTPConfig instance
             */
            public static create(properties?: esg.alarm.INTPConfig): esg.alarm.NTPConfig;

            /**
             * Encodes the specified NTPConfig message. Does not implicitly {@link esg.alarm.NTPConfig.verify|verify} messages.
             * @param message NTPConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.INTPConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified NTPConfig message, length delimited. Does not implicitly {@link esg.alarm.NTPConfig.verify|verify} messages.
             * @param message NTPConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.INTPConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a NTPConfig message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns NTPConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.NTPConfig;

            /**
             * Decodes a NTPConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns NTPConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.NTPConfig;

            /**
             * Verifies a NTPConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a NTPConfig message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns NTPConfig
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.NTPConfig;

            /**
             * Creates a plain object from a NTPConfig message. Also converts values to other types if specified.
             * @param message NTPConfig
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.NTPConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this NTPConfig to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for NTPConfig
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BLEConfig. */
        interface IBLEConfig {

            /** BLEConfig enable */
            enable?: (boolean|null);

            /** BLEConfig deviceName */
            deviceName?: (string|null);

            /** BLEConfig advertise */
            advertise?: (boolean|null);

            /** BLEConfig intervalMs */
            intervalMs?: (number|null);

            /** BLEConfig advHmacKey */
            advHmacKey?: (Uint8Array|null);

            /** BLEConfig sppHmacKey */
            sppHmacKey?: (Uint8Array|null);

            /** BLEConfig txPower */
            txPower?: (number|null);
        }

        /** Represents a BLEConfig. */
        class BLEConfig implements IBLEConfig {

            /**
             * Constructs a new BLEConfig.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IBLEConfig);

            /** BLEConfig enable. */
            public enable?: (boolean|null);

            /** BLEConfig deviceName. */
            public deviceName?: (string|null);

            /** BLEConfig advertise. */
            public advertise?: (boolean|null);

            /** BLEConfig intervalMs. */
            public intervalMs?: (number|null);

            /** BLEConfig advHmacKey. */
            public advHmacKey?: (Uint8Array|null);

            /** BLEConfig sppHmacKey. */
            public sppHmacKey?: (Uint8Array|null);

            /** BLEConfig txPower. */
            public txPower?: (number|null);

            /** BLEConfig _enable. */
            public _enable?: "enable";

            /** BLEConfig _deviceName. */
            public _deviceName?: "deviceName";

            /** BLEConfig _advertise. */
            public _advertise?: "advertise";

            /** BLEConfig _intervalMs. */
            public _intervalMs?: "intervalMs";

            /** BLEConfig _advHmacKey. */
            public _advHmacKey?: "advHmacKey";

            /** BLEConfig _sppHmacKey. */
            public _sppHmacKey?: "sppHmacKey";

            /** BLEConfig _txPower. */
            public _txPower?: "txPower";

            /**
             * Creates a new BLEConfig instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BLEConfig instance
             */
            public static create(properties?: esg.alarm.IBLEConfig): esg.alarm.BLEConfig;

            /**
             * Encodes the specified BLEConfig message. Does not implicitly {@link esg.alarm.BLEConfig.verify|verify} messages.
             * @param message BLEConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IBLEConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BLEConfig message, length delimited. Does not implicitly {@link esg.alarm.BLEConfig.verify|verify} messages.
             * @param message BLEConfig message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IBLEConfig, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BLEConfig message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BLEConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.BLEConfig;

            /**
             * Decodes a BLEConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BLEConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.BLEConfig;

            /**
             * Verifies a BLEConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BLEConfig message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BLEConfig
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.BLEConfig;

            /**
             * Creates a plain object from a BLEConfig message. Also converts values to other types if specified.
             * @param message BLEConfig
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.BLEConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BLEConfig to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BLEConfig
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an OutputCommand. */
        interface IOutputCommand {

            /** OutputCommand output */
            output?: (esg.alarm.OutputCommand.OutputType|null);

            /** OutputCommand pattern */
            pattern?: (esg.alarm.OutputCommand.PatternType|null);

            /** OutputCommand state */
            state?: (boolean|null);

            /** OutputCommand totalDuration */
            totalDuration?: (number|null);

            /** OutputCommand pulseCount */
            pulseCount?: (number|null);

            /** OutputCommand onDurationMs */
            onDurationMs?: (number|null);

            /** OutputCommand offDurationMs */
            offDurationMs?: (number|null);

            /** OutputCommand repeatInterval */
            repeatInterval?: (number|null);

            /** OutputCommand customData */
            customData?: (number|null);
        }

        /** Represents an OutputCommand. */
        class OutputCommand implements IOutputCommand {

            /**
             * Constructs a new OutputCommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IOutputCommand);

            /** OutputCommand output. */
            public output: esg.alarm.OutputCommand.OutputType;

            /** OutputCommand pattern. */
            public pattern: esg.alarm.OutputCommand.PatternType;

            /** OutputCommand state. */
            public state: boolean;

            /** OutputCommand totalDuration. */
            public totalDuration: number;

            /** OutputCommand pulseCount. */
            public pulseCount: number;

            /** OutputCommand onDurationMs. */
            public onDurationMs: number;

            /** OutputCommand offDurationMs. */
            public offDurationMs: number;

            /** OutputCommand repeatInterval. */
            public repeatInterval: number;

            /** OutputCommand customData. */
            public customData: number;

            /**
             * Creates a new OutputCommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OutputCommand instance
             */
            public static create(properties?: esg.alarm.IOutputCommand): esg.alarm.OutputCommand;

            /**
             * Encodes the specified OutputCommand message. Does not implicitly {@link esg.alarm.OutputCommand.verify|verify} messages.
             * @param message OutputCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IOutputCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OutputCommand message, length delimited. Does not implicitly {@link esg.alarm.OutputCommand.verify|verify} messages.
             * @param message OutputCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IOutputCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OutputCommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OutputCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.OutputCommand;

            /**
             * Decodes an OutputCommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OutputCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.OutputCommand;

            /**
             * Verifies an OutputCommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OutputCommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OutputCommand
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.OutputCommand;

            /**
             * Creates a plain object from an OutputCommand message. Also converts values to other types if specified.
             * @param message OutputCommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.OutputCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OutputCommand to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for OutputCommand
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace OutputCommand {

            /** OutputType enum. */
            enum OutputType {
                OUT_UNKNOWN = 0,
                OUT_SIREN = 1,
                OUT_TURRET = 2,
                OUT_RELAY1 = 3,
                OUT_RELAY2 = 4,
                OUT_FAN = 5,
                OUT_ALL = 6
            }

            /** PatternType enum. */
            enum PatternType {
                PATTERN_NONE = 0,
                PATTERN_CONSTANT = 1,
                PATTERN_PULSE = 2,
                PATTERN_BLINK_SLOW = 3,
                PATTERN_BLINK_FAST = 4,
                PATTERN_DOUBLE_PULSE = 5,
                PATTERN_TRIPLE_PULSE = 6,
                PATTERN_SOS = 7,
                PATTERN_STROBE = 8,
                PATTERN_OFF = 9,
                PATTERN_PWM = 10,
                PATTERN_CUSTOM = 255
            }
        }

        /** Properties of a DiagnosticCommand. */
        interface IDiagnosticCommand {

            /** DiagnosticCommand action */
            action?: (esg.alarm.DiagnosticCommand.DiagAction|null);

            /** DiagnosticCommand testMask */
            testMask?: (number|null);

            /** DiagnosticCommand logLines */
            logLines?: (number|null);
        }

        /** Represents a DiagnosticCommand. */
        class DiagnosticCommand implements IDiagnosticCommand {

            /**
             * Constructs a new DiagnosticCommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IDiagnosticCommand);

            /** DiagnosticCommand action. */
            public action: esg.alarm.DiagnosticCommand.DiagAction;

            /** DiagnosticCommand testMask. */
            public testMask: number;

            /** DiagnosticCommand logLines. */
            public logLines: number;

            /**
             * Creates a new DiagnosticCommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DiagnosticCommand instance
             */
            public static create(properties?: esg.alarm.IDiagnosticCommand): esg.alarm.DiagnosticCommand;

            /**
             * Encodes the specified DiagnosticCommand message. Does not implicitly {@link esg.alarm.DiagnosticCommand.verify|verify} messages.
             * @param message DiagnosticCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IDiagnosticCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DiagnosticCommand message, length delimited. Does not implicitly {@link esg.alarm.DiagnosticCommand.verify|verify} messages.
             * @param message DiagnosticCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IDiagnosticCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DiagnosticCommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DiagnosticCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.DiagnosticCommand;

            /**
             * Decodes a DiagnosticCommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DiagnosticCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.DiagnosticCommand;

            /**
             * Verifies a DiagnosticCommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DiagnosticCommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DiagnosticCommand
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.DiagnosticCommand;

            /**
             * Creates a plain object from a DiagnosticCommand message. Also converts values to other types if specified.
             * @param message DiagnosticCommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.DiagnosticCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DiagnosticCommand to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DiagnosticCommand
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DiagnosticCommand {

            /** DiagAction enum. */
            enum DiagAction {
                DIAG_UNKNOWN = 0,
                DIAG_SELF_TEST = 1,
                DIAG_MEMORY_INFO = 2,
                DIAG_NETWORK_INFO = 3,
                DIAG_SENSOR_READ = 4,
                DIAG_LOG_DUMP = 5,
                DIAG_INOUT_READ = 6
            }
        }

        /** Properties of a OTACommand. */
        interface IOTACommand {

            /** OTACommand action */
            action?: (esg.alarm.OTACommand.OTAAction|null);

            /** OTACommand url */
            url?: (string|null);

            /** OTACommand md5 */
            md5?: (string|null);

            /** OTACommand size */
            size?: (number|null);
        }

        /** Represents a OTACommand. */
        class OTACommand implements IOTACommand {

            /**
             * Constructs a new OTACommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IOTACommand);

            /** OTACommand action. */
            public action: esg.alarm.OTACommand.OTAAction;

            /** OTACommand url. */
            public url: string;

            /** OTACommand md5. */
            public md5: string;

            /** OTACommand size. */
            public size: number;

            /**
             * Creates a new OTACommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OTACommand instance
             */
            public static create(properties?: esg.alarm.IOTACommand): esg.alarm.OTACommand;

            /**
             * Encodes the specified OTACommand message. Does not implicitly {@link esg.alarm.OTACommand.verify|verify} messages.
             * @param message OTACommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IOTACommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OTACommand message, length delimited. Does not implicitly {@link esg.alarm.OTACommand.verify|verify} messages.
             * @param message OTACommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IOTACommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a OTACommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OTACommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.OTACommand;

            /**
             * Decodes a OTACommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OTACommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.OTACommand;

            /**
             * Verifies a OTACommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a OTACommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OTACommand
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.OTACommand;

            /**
             * Creates a plain object from a OTACommand message. Also converts values to other types if specified.
             * @param message OTACommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.OTACommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OTACommand to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for OTACommand
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace OTACommand {

            /** OTAAction enum. */
            enum OTAAction {
                OTA_UNKNOWN = 0,
                OTA_CHECK_UPDATE = 1,
                OTA_START_UPDATE = 2,
                OTA_VALIDATE = 3,
                OTA_ROLLBACK = 4,
                OTA_GET_STATUS = 5
            }
        }

        /** Properties of a ConfigReadCommand. */
        interface IConfigReadCommand {

            /** ConfigReadCommand type */
            type?: (esg.alarm.ConfigReadCommand.ReadType|null);

            /** ConfigReadCommand includeSensitive */
            includeSensitive?: (boolean|null);
        }

        /** Represents a ConfigReadCommand. */
        class ConfigReadCommand implements IConfigReadCommand {

            /**
             * Constructs a new ConfigReadCommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IConfigReadCommand);

            /** ConfigReadCommand type. */
            public type: esg.alarm.ConfigReadCommand.ReadType;

            /** ConfigReadCommand includeSensitive. */
            public includeSensitive: boolean;

            /**
             * Creates a new ConfigReadCommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ConfigReadCommand instance
             */
            public static create(properties?: esg.alarm.IConfigReadCommand): esg.alarm.ConfigReadCommand;

            /**
             * Encodes the specified ConfigReadCommand message. Does not implicitly {@link esg.alarm.ConfigReadCommand.verify|verify} messages.
             * @param message ConfigReadCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IConfigReadCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ConfigReadCommand message, length delimited. Does not implicitly {@link esg.alarm.ConfigReadCommand.verify|verify} messages.
             * @param message ConfigReadCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IConfigReadCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ConfigReadCommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ConfigReadCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.ConfigReadCommand;

            /**
             * Decodes a ConfigReadCommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ConfigReadCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.ConfigReadCommand;

            /**
             * Verifies a ConfigReadCommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ConfigReadCommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ConfigReadCommand
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.ConfigReadCommand;

            /**
             * Creates a plain object from a ConfigReadCommand message. Also converts values to other types if specified.
             * @param message ConfigReadCommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.ConfigReadCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ConfigReadCommand to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ConfigReadCommand
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ConfigReadCommand {

            /** ReadType enum. */
            enum ReadType {
                READ_UNKNOWN = 0,
                READ_WIFI = 1,
                READ_MQTT = 2,
                READ_DEVICE = 3,
                READ_LOCATION = 4,
                READ_NTP = 5,
                READ_BLE = 6,
                READ_ALL = 7
            }
        }

        /** Properties of a CommandEnvelope. */
        interface ICommandEnvelope {

            /** CommandEnvelope sequence */
            sequence?: (number|null);

            /** CommandEnvelope timestamp */
            timestamp?: (number|null);

            /** CommandEnvelope requestId */
            requestId?: (string|null);

            /** CommandEnvelope authLevel */
            authLevel?: (number|null);

            /** CommandEnvelope system */
            system?: (esg.alarm.ISystemCommand|null);

            /** CommandEnvelope config */
            config?: (esg.alarm.IConfigCommand|null);

            /** CommandEnvelope output */
            output?: (esg.alarm.IOutputCommand|null);

            /** CommandEnvelope diagnostic */
            diagnostic?: (esg.alarm.IDiagnosticCommand|null);

            /** CommandEnvelope ota */
            ota?: (esg.alarm.IOTACommand|null);

            /** CommandEnvelope configRead */
            configRead?: (esg.alarm.IConfigReadCommand|null);
        }

        /** Represents a CommandEnvelope. */
        class CommandEnvelope implements ICommandEnvelope {

            /**
             * Constructs a new CommandEnvelope.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.ICommandEnvelope);

            /** CommandEnvelope sequence. */
            public sequence: number;

            /** CommandEnvelope timestamp. */
            public timestamp: number;

            /** CommandEnvelope requestId. */
            public requestId: string;

            /** CommandEnvelope authLevel. */
            public authLevel: number;

            /** CommandEnvelope system. */
            public system?: (esg.alarm.ISystemCommand|null);

            /** CommandEnvelope config. */
            public config?: (esg.alarm.IConfigCommand|null);

            /** CommandEnvelope output. */
            public output?: (esg.alarm.IOutputCommand|null);

            /** CommandEnvelope diagnostic. */
            public diagnostic?: (esg.alarm.IDiagnosticCommand|null);

            /** CommandEnvelope ota. */
            public ota?: (esg.alarm.IOTACommand|null);

            /** CommandEnvelope configRead. */
            public configRead?: (esg.alarm.IConfigReadCommand|null);

            /** CommandEnvelope command. */
            public command?: ("system"|"config"|"output"|"diagnostic"|"ota"|"configRead");

            /**
             * Creates a new CommandEnvelope instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CommandEnvelope instance
             */
            public static create(properties?: esg.alarm.ICommandEnvelope): esg.alarm.CommandEnvelope;

            /**
             * Encodes the specified CommandEnvelope message. Does not implicitly {@link esg.alarm.CommandEnvelope.verify|verify} messages.
             * @param message CommandEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.ICommandEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CommandEnvelope message, length delimited. Does not implicitly {@link esg.alarm.CommandEnvelope.verify|verify} messages.
             * @param message CommandEnvelope message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.ICommandEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CommandEnvelope message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CommandEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.CommandEnvelope;

            /**
             * Decodes a CommandEnvelope message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CommandEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.CommandEnvelope;

            /**
             * Verifies a CommandEnvelope message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CommandEnvelope message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CommandEnvelope
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.CommandEnvelope;

            /**
             * Creates a plain object from a CommandEnvelope message. Also converts values to other types if specified.
             * @param message CommandEnvelope
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.CommandEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CommandEnvelope to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CommandEnvelope
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a CommandResponse. */
        interface ICommandResponse {

            /** CommandResponse requestId */
            requestId?: (string|null);

            /** CommandResponse timestamp */
            timestamp?: (number|null);

            /** CommandResponse success */
            success?: (boolean|null);

            /** CommandResponse errorCode */
            errorCode?: (number|null);

            /** CommandResponse message */
            message?: (string|null);

            /** CommandResponse payload */
            payload?: (Uint8Array|null);
        }

        /** Represents a CommandResponse. */
        class CommandResponse implements ICommandResponse {

            /**
             * Constructs a new CommandResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.ICommandResponse);

            /** CommandResponse requestId. */
            public requestId: string;

            /** CommandResponse timestamp. */
            public timestamp: number;

            /** CommandResponse success. */
            public success: boolean;

            /** CommandResponse errorCode. */
            public errorCode: number;

            /** CommandResponse message. */
            public message: string;

            /** CommandResponse payload. */
            public payload: Uint8Array;

            /**
             * Creates a new CommandResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CommandResponse instance
             */
            public static create(properties?: esg.alarm.ICommandResponse): esg.alarm.CommandResponse;

            /**
             * Encodes the specified CommandResponse message. Does not implicitly {@link esg.alarm.CommandResponse.verify|verify} messages.
             * @param message CommandResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.ICommandResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CommandResponse message, length delimited. Does not implicitly {@link esg.alarm.CommandResponse.verify|verify} messages.
             * @param message CommandResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.ICommandResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CommandResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CommandResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.CommandResponse;

            /**
             * Decodes a CommandResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CommandResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.CommandResponse;

            /**
             * Verifies a CommandResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CommandResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CommandResponse
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.CommandResponse;

            /**
             * Creates a plain object from a CommandResponse message. Also converts values to other types if specified.
             * @param message CommandResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.CommandResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CommandResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CommandResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a LastWillMessage. */
        interface ILastWillMessage {

            /** LastWillMessage sequence */
            sequence?: (number|null);

            /** LastWillMessage timestamp */
            timestamp?: (number|null);

            /** LastWillMessage deviceDbId */
            deviceDbId?: (number|null);

            /** LastWillMessage uptimeAtConnect */
            uptimeAtConnect?: (number|null);

            /** LastWillMessage firmware */
            firmware?: (string|null);

            /** LastWillMessage ipAddress */
            ipAddress?: (number|null);

            /** LastWillMessage rssi */
            rssi?: (number|null);

            /** LastWillMessage hostname */
            hostname?: (string|null);
        }

        /** Represents a LastWillMessage. */
        class LastWillMessage implements ILastWillMessage {

            /**
             * Constructs a new LastWillMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.ILastWillMessage);

            /** LastWillMessage sequence. */
            public sequence: number;

            /** LastWillMessage timestamp. */
            public timestamp: number;

            /** LastWillMessage deviceDbId. */
            public deviceDbId: number;

            /** LastWillMessage uptimeAtConnect. */
            public uptimeAtConnect: number;

            /** LastWillMessage firmware. */
            public firmware: string;

            /** LastWillMessage ipAddress. */
            public ipAddress: number;

            /** LastWillMessage rssi. */
            public rssi: number;

            /** LastWillMessage hostname. */
            public hostname: string;

            /**
             * Creates a new LastWillMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LastWillMessage instance
             */
            public static create(properties?: esg.alarm.ILastWillMessage): esg.alarm.LastWillMessage;

            /**
             * Encodes the specified LastWillMessage message. Does not implicitly {@link esg.alarm.LastWillMessage.verify|verify} messages.
             * @param message LastWillMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.ILastWillMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LastWillMessage message, length delimited. Does not implicitly {@link esg.alarm.LastWillMessage.verify|verify} messages.
             * @param message LastWillMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.ILastWillMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LastWillMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LastWillMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.LastWillMessage;

            /**
             * Decodes a LastWillMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LastWillMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.LastWillMessage;

            /**
             * Verifies a LastWillMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LastWillMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LastWillMessage
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.LastWillMessage;

            /**
             * Creates a plain object from a LastWillMessage message. Also converts values to other types if specified.
             * @param message LastWillMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.LastWillMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LastWillMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for LastWillMessage
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** DeviceState enum. */
        enum DeviceState {
            STATE_BOOT = 0,
            STATE_INIT = 1,
            STATE_CONNECTING = 2,
            STATE_NORMAL = 3,
            STATE_ALARM = 4,
            STATE_MAINTENANCE = 5,
            STATE_ERROR = 6,
            STATE_CRITICAL = 7
        }

        /** NetworkInterface enum. */
        enum NetworkInterface {
            NETWORK_WIFI = 0,
            NETWORK_ETHERNET = 1,
            NETWORK_NONE = 2
        }

        /** Properties of a StatusMessage. */
        interface IStatusMessage {

            /** StatusMessage sequence */
            sequence?: (number|null);

            /** StatusMessage timestamp */
            timestamp?: (number|null);

            /** StatusMessage deviceDbId */
            deviceDbId?: (number|null);

            /** StatusMessage state */
            state?: (esg.alarm.DeviceState|null);

            /** StatusMessage stateDuration */
            stateDuration?: (number|null);

            /** StatusMessage uptime */
            uptime?: (number|null);

            /** StatusMessage bootCount */
            bootCount?: (number|null);

            /** StatusMessage freeHeap */
            freeHeap?: (number|null);

            /** StatusMessage minHeap */
            minHeap?: (number|null);

            /** StatusMessage firmware */
            firmware?: (string|null);

            /** StatusMessage network */
            network?: (esg.alarm.NetworkInterface|null);

            /** StatusMessage connected */
            connected?: (boolean|null);

            /** StatusMessage hasIp */
            hasIp?: (boolean|null);

            /** StatusMessage rssi */
            rssi?: (number|null);

            /** StatusMessage ipAddress */
            ipAddress?: (number|null);

            /** StatusMessage macAddress */
            macAddress?: (Uint8Array|null);

            /** StatusMessage mqttConnected */
            mqttConnected?: (boolean|null);

            /** StatusMessage ntpSynced */
            ntpSynced?: (boolean|null);

            /** StatusMessage lastNtpSync */
            lastNtpSync?: (number|Long|null);

            /** StatusMessage panic1 */
            panic1?: (boolean|null);

            /** StatusMessage panic2 */
            panic2?: (boolean|null);

            /** StatusMessage boxSw */
            boxSw?: (boolean|null);

            /** StatusMessage siren */
            siren?: (boolean|null);

            /** StatusMessage turret */
            turret?: (boolean|null);

            /** StatusMessage panic1Count */
            panic1Count?: (number|null);

            /** StatusMessage panic2Count */
            panic2Count?: (number|null);

            /** StatusMessage tamperCount */
            tamperCount?: (number|null);

            /** StatusMessage wifiDisconnects */
            wifiDisconnects?: (number|null);

            /** StatusMessage mqttDisconnects */
            mqttDisconnects?: (number|null);

            /** StatusMessage temperature */
            temperature?: (number|null);

            /** StatusMessage humidity */
            humidity?: (number|null);

            /** StatusMessage country */
            country?: (string|null);

            /** StatusMessage zone */
            zone?: (number|null);

            /** StatusMessage latitude */
            latitude?: (number|null);

            /** StatusMessage longitude */
            longitude?: (number|null);

            /** StatusMessage errorFlags */
            errorFlags?: (number|null);

            /** StatusMessage errorCount */
            errorCount?: (number|null);

            /** StatusMessage partition */
            partition?: (number|null);

            /** StatusMessage otaValidated */
            otaValidated?: (boolean|null);
        }

        /** Represents a StatusMessage. */
        class StatusMessage implements IStatusMessage {

            /**
             * Constructs a new StatusMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: esg.alarm.IStatusMessage);

            /** StatusMessage sequence. */
            public sequence: number;

            /** StatusMessage timestamp. */
            public timestamp: number;

            /** StatusMessage deviceDbId. */
            public deviceDbId: number;

            /** StatusMessage state. */
            public state: esg.alarm.DeviceState;

            /** StatusMessage stateDuration. */
            public stateDuration: number;

            /** StatusMessage uptime. */
            public uptime: number;

            /** StatusMessage bootCount. */
            public bootCount: number;

            /** StatusMessage freeHeap. */
            public freeHeap: number;

            /** StatusMessage minHeap. */
            public minHeap: number;

            /** StatusMessage firmware. */
            public firmware: string;

            /** StatusMessage network. */
            public network: esg.alarm.NetworkInterface;

            /** StatusMessage connected. */
            public connected: boolean;

            /** StatusMessage hasIp. */
            public hasIp: boolean;

            /** StatusMessage rssi. */
            public rssi: number;

            /** StatusMessage ipAddress. */
            public ipAddress: number;

            /** StatusMessage macAddress. */
            public macAddress: Uint8Array;

            /** StatusMessage mqttConnected. */
            public mqttConnected: boolean;

            /** StatusMessage ntpSynced. */
            public ntpSynced: boolean;

            /** StatusMessage lastNtpSync. */
            public lastNtpSync: (number|Long);

            /** StatusMessage panic1. */
            public panic1: boolean;

            /** StatusMessage panic2. */
            public panic2: boolean;

            /** StatusMessage boxSw. */
            public boxSw: boolean;

            /** StatusMessage siren. */
            public siren: boolean;

            /** StatusMessage turret. */
            public turret: boolean;

            /** StatusMessage panic1Count. */
            public panic1Count: number;

            /** StatusMessage panic2Count. */
            public panic2Count: number;

            /** StatusMessage tamperCount. */
            public tamperCount: number;

            /** StatusMessage wifiDisconnects. */
            public wifiDisconnects: number;

            /** StatusMessage mqttDisconnects. */
            public mqttDisconnects: number;

            /** StatusMessage temperature. */
            public temperature: number;

            /** StatusMessage humidity. */
            public humidity: number;

            /** StatusMessage country. */
            public country: string;

            /** StatusMessage zone. */
            public zone: number;

            /** StatusMessage latitude. */
            public latitude: number;

            /** StatusMessage longitude. */
            public longitude: number;

            /** StatusMessage errorFlags. */
            public errorFlags: number;

            /** StatusMessage errorCount. */
            public errorCount: number;

            /** StatusMessage partition. */
            public partition: number;

            /** StatusMessage otaValidated. */
            public otaValidated: boolean;

            /**
             * Creates a new StatusMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StatusMessage instance
             */
            public static create(properties?: esg.alarm.IStatusMessage): esg.alarm.StatusMessage;

            /**
             * Encodes the specified StatusMessage message. Does not implicitly {@link esg.alarm.StatusMessage.verify|verify} messages.
             * @param message StatusMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: esg.alarm.IStatusMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StatusMessage message, length delimited. Does not implicitly {@link esg.alarm.StatusMessage.verify|verify} messages.
             * @param message StatusMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: esg.alarm.IStatusMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StatusMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StatusMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): esg.alarm.StatusMessage;

            /**
             * Decodes a StatusMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StatusMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): esg.alarm.StatusMessage;

            /**
             * Verifies a StatusMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StatusMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StatusMessage
             */
            public static fromObject(object: { [k: string]: any }): esg.alarm.StatusMessage;

            /**
             * Creates a plain object from a StatusMessage message. Also converts values to other types if specified.
             * @param message StatusMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: esg.alarm.StatusMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StatusMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for StatusMessage
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}

/** Properties of a Heartbeat. */
export interface IHeartbeat {

    /** Heartbeat timestamp */
    timestamp?: (number|null);

    /** Heartbeat deviceDbId */
    deviceDbId?: (number|null);

    /** Heartbeat temperature */
    temperature?: (number|null);

    /** Heartbeat humidity */
    humidity?: (number|null);

    /** Heartbeat panic1 */
    panic1?: (boolean|null);

    /** Heartbeat panic2 */
    panic2?: (boolean|null);

    /** Heartbeat siren */
    siren?: (boolean|null);

    /** Heartbeat turret */
    turret?: (boolean|null);

    /** Heartbeat boxSw */
    boxSw?: (boolean|null);

    /** Heartbeat uptime */
    uptime?: (number|null);

    /** Heartbeat ethInterface */
    ethInterface?: (number|null);

    /** Heartbeat firmware */
    firmware?: (string|null);

    /** Heartbeat fanPwmDuty */
    fanPwmDuty?: (number|null);
}

/** Represents a Heartbeat. */
export class Heartbeat implements IHeartbeat {

    /**
     * Constructs a new Heartbeat.
     * @param [properties] Properties to set
     */
    constructor(properties?: IHeartbeat);

    /** Heartbeat timestamp. */
    public timestamp: number;

    /** Heartbeat deviceDbId. */
    public deviceDbId: number;

    /** Heartbeat temperature. */
    public temperature: number;

    /** Heartbeat humidity. */
    public humidity: number;

    /** Heartbeat panic1. */
    public panic1: boolean;

    /** Heartbeat panic2. */
    public panic2: boolean;

    /** Heartbeat siren. */
    public siren: boolean;

    /** Heartbeat turret. */
    public turret: boolean;

    /** Heartbeat boxSw. */
    public boxSw: boolean;

    /** Heartbeat uptime. */
    public uptime: number;

    /** Heartbeat ethInterface. */
    public ethInterface: number;

    /** Heartbeat firmware. */
    public firmware: string;

    /** Heartbeat fanPwmDuty. */
    public fanPwmDuty: number;

    /**
     * Creates a new Heartbeat instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Heartbeat instance
     */
    public static create(properties?: IHeartbeat): Heartbeat;

    /**
     * Encodes the specified Heartbeat message. Does not implicitly {@link Heartbeat.verify|verify} messages.
     * @param message Heartbeat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IHeartbeat, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Heartbeat message, length delimited. Does not implicitly {@link Heartbeat.verify|verify} messages.
     * @param message Heartbeat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IHeartbeat, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Heartbeat message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Heartbeat;

    /**
     * Decodes a Heartbeat message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Heartbeat;

    /**
     * Verifies a Heartbeat message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Heartbeat message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Heartbeat
     */
    public static fromObject(object: { [k: string]: any }): Heartbeat;

    /**
     * Creates a plain object from a Heartbeat message. Also converts values to other types if specified.
     * @param message Heartbeat
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Heartbeat, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Heartbeat to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Heartbeat
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}
