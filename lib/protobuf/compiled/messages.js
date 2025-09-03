/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.esg = (function() {

    /**
     * Namespace esg.
     * @exports esg
     * @namespace
     */
    var esg = {};

    esg.alarm = (function() {

        /**
         * Namespace alarm.
         * @memberof esg
         * @namespace
         */
        var alarm = {};

        alarm.AlarmEvent = (function() {

            /**
             * Properties of an AlarmEvent.
             * @memberof esg.alarm
             * @interface IAlarmEvent
             * @property {number|null} [sequence] AlarmEvent sequence
             * @property {number|null} [timestamp] AlarmEvent timestamp
             * @property {number|null} [deviceDbId] AlarmEvent deviceDbId
             * @property {esg.alarm.AlarmEvent.AlarmType|null} [type] AlarmEvent type
             * @property {esg.alarm.AlarmEvent.EventState|null} [state] AlarmEvent state
             * @property {esg.alarm.AlarmEvent.Priority|null} [priority] AlarmEvent priority
             * @property {boolean|null} [physicalState] AlarmEvent physicalState
             * @property {number|null} [outputType] AlarmEvent outputType
             * @property {number|null} [patternType] AlarmEvent patternType
             * @property {number|null} [durationSeconds] AlarmEvent durationSeconds
             * @property {number|null} [elapsedSeconds] AlarmEvent elapsedSeconds
             */

            /**
             * Constructs a new AlarmEvent.
             * @memberof esg.alarm
             * @classdesc Represents an AlarmEvent.
             * @implements IAlarmEvent
             * @constructor
             * @param {esg.alarm.IAlarmEvent=} [properties] Properties to set
             */
            function AlarmEvent(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AlarmEvent sequence.
             * @member {number} sequence
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.sequence = 0;

            /**
             * AlarmEvent timestamp.
             * @member {number} timestamp
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.timestamp = 0;

            /**
             * AlarmEvent deviceDbId.
             * @member {number} deviceDbId
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.deviceDbId = 0;

            /**
             * AlarmEvent type.
             * @member {esg.alarm.AlarmEvent.AlarmType} type
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.type = 0;

            /**
             * AlarmEvent state.
             * @member {esg.alarm.AlarmEvent.EventState} state
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.state = 0;

            /**
             * AlarmEvent priority.
             * @member {esg.alarm.AlarmEvent.Priority} priority
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.priority = 0;

            /**
             * AlarmEvent physicalState.
             * @member {boolean} physicalState
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.physicalState = false;

            /**
             * AlarmEvent outputType.
             * @member {number} outputType
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.outputType = 0;

            /**
             * AlarmEvent patternType.
             * @member {number} patternType
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.patternType = 0;

            /**
             * AlarmEvent durationSeconds.
             * @member {number} durationSeconds
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.durationSeconds = 0;

            /**
             * AlarmEvent elapsedSeconds.
             * @member {number} elapsedSeconds
             * @memberof esg.alarm.AlarmEvent
             * @instance
             */
            AlarmEvent.prototype.elapsedSeconds = 0;

            /**
             * Creates a new AlarmEvent instance using the specified properties.
             * @function create
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {esg.alarm.IAlarmEvent=} [properties] Properties to set
             * @returns {esg.alarm.AlarmEvent} AlarmEvent instance
             */
            AlarmEvent.create = function create(properties) {
                return new AlarmEvent(properties);
            };

            /**
             * Encodes the specified AlarmEvent message. Does not implicitly {@link esg.alarm.AlarmEvent.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {esg.alarm.IAlarmEvent} message AlarmEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AlarmEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sequence);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.timestamp);
                if (message.deviceDbId != null && Object.hasOwnProperty.call(message, "deviceDbId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.deviceDbId);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.type);
                if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.state);
                if (message.priority != null && Object.hasOwnProperty.call(message, "priority"))
                    writer.uint32(/* id 8, wireType 0 =*/64).int32(message.priority);
                if (message.physicalState != null && Object.hasOwnProperty.call(message, "physicalState"))
                    writer.uint32(/* id 10, wireType 0 =*/80).bool(message.physicalState);
                if (message.outputType != null && Object.hasOwnProperty.call(message, "outputType"))
                    writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.outputType);
                if (message.patternType != null && Object.hasOwnProperty.call(message, "patternType"))
                    writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.patternType);
                if (message.durationSeconds != null && Object.hasOwnProperty.call(message, "durationSeconds"))
                    writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.durationSeconds);
                if (message.elapsedSeconds != null && Object.hasOwnProperty.call(message, "elapsedSeconds"))
                    writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.elapsedSeconds);
                return writer;
            };

            /**
             * Encodes the specified AlarmEvent message, length delimited. Does not implicitly {@link esg.alarm.AlarmEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {esg.alarm.IAlarmEvent} message AlarmEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AlarmEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AlarmEvent message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.AlarmEvent} AlarmEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AlarmEvent.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.AlarmEvent();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.sequence = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.timestamp = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.deviceDbId = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.type = reader.int32();
                            break;
                        }
                    case 5: {
                            message.state = reader.int32();
                            break;
                        }
                    case 8: {
                            message.priority = reader.int32();
                            break;
                        }
                    case 10: {
                            message.physicalState = reader.bool();
                            break;
                        }
                    case 11: {
                            message.outputType = reader.uint32();
                            break;
                        }
                    case 12: {
                            message.patternType = reader.uint32();
                            break;
                        }
                    case 13: {
                            message.durationSeconds = reader.uint32();
                            break;
                        }
                    case 14: {
                            message.elapsedSeconds = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AlarmEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.AlarmEvent} AlarmEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AlarmEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AlarmEvent message.
             * @function verify
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AlarmEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    if (!$util.isInteger(message.sequence))
                        return "sequence: integer expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isInteger(message.timestamp))
                        return "timestamp: integer expected";
                if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
                    if (!$util.isInteger(message.deviceDbId))
                        return "deviceDbId: integer expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 10:
                        break;
                    }
                if (message.state != null && message.hasOwnProperty("state"))
                    switch (message.state) {
                    default:
                        return "state: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.priority != null && message.hasOwnProperty("priority"))
                    switch (message.priority) {
                    default:
                        return "priority: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.physicalState != null && message.hasOwnProperty("physicalState"))
                    if (typeof message.physicalState !== "boolean")
                        return "physicalState: boolean expected";
                if (message.outputType != null && message.hasOwnProperty("outputType"))
                    if (!$util.isInteger(message.outputType))
                        return "outputType: integer expected";
                if (message.patternType != null && message.hasOwnProperty("patternType"))
                    if (!$util.isInteger(message.patternType))
                        return "patternType: integer expected";
                if (message.durationSeconds != null && message.hasOwnProperty("durationSeconds"))
                    if (!$util.isInteger(message.durationSeconds))
                        return "durationSeconds: integer expected";
                if (message.elapsedSeconds != null && message.hasOwnProperty("elapsedSeconds"))
                    if (!$util.isInteger(message.elapsedSeconds))
                        return "elapsedSeconds: integer expected";
                return null;
            };

            /**
             * Creates an AlarmEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.AlarmEvent} AlarmEvent
             */
            AlarmEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.AlarmEvent)
                    return object;
                var message = new $root.esg.alarm.AlarmEvent();
                if (object.sequence != null)
                    message.sequence = object.sequence >>> 0;
                if (object.timestamp != null)
                    message.timestamp = object.timestamp >>> 0;
                if (object.deviceDbId != null)
                    message.deviceDbId = object.deviceDbId >>> 0;
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "ALARM_UNKNOWN":
                case 0:
                    message.type = 0;
                    break;
                case "ALARM_PANIC1":
                case 1:
                    message.type = 1;
                    break;
                case "ALARM_PANIC2":
                case 2:
                    message.type = 2;
                    break;
                case "ALARM_TAMPER":
                case 3:
                    message.type = 3;
                    break;
                case "ALARM_FIRE":
                case 4:
                    message.type = 4;
                    break;
                case "ALARM_INTRUSION":
                case 5:
                    message.type = 5;
                    break;
                case "ALARM_MEDICAL":
                case 6:
                    message.type = 6;
                    break;
                case "ALARM_DURESS":
                case 7:
                    message.type = 7;
                    break;
                case "OUTPUT_EVENT":
                case 10:
                    message.type = 10;
                    break;
                }
                switch (object.state) {
                default:
                    if (typeof object.state === "number") {
                        message.state = object.state;
                        break;
                    }
                    break;
                case "STATE_INACTIVE":
                case 0:
                    message.state = 0;
                    break;
                case "STATE_ACTIVE":
                case 1:
                    message.state = 1;
                    break;
                case "STATE_TEST":
                case 2:
                    message.state = 2;
                    break;
                case "STATE_STARTING":
                case 3:
                    message.state = 3;
                    break;
                case "STATE_STOPPING":
                case 4:
                    message.state = 4;
                    break;
                }
                switch (object.priority) {
                default:
                    if (typeof object.priority === "number") {
                        message.priority = object.priority;
                        break;
                    }
                    break;
                case "PRIORITY_LOW":
                case 0:
                    message.priority = 0;
                    break;
                case "PRIORITY_MEDIUM":
                case 1:
                    message.priority = 1;
                    break;
                case "PRIORITY_HIGH":
                case 2:
                    message.priority = 2;
                    break;
                case "PRIORITY_CRITICAL":
                case 3:
                    message.priority = 3;
                    break;
                }
                if (object.physicalState != null)
                    message.physicalState = Boolean(object.physicalState);
                if (object.outputType != null)
                    message.outputType = object.outputType >>> 0;
                if (object.patternType != null)
                    message.patternType = object.patternType >>> 0;
                if (object.durationSeconds != null)
                    message.durationSeconds = object.durationSeconds >>> 0;
                if (object.elapsedSeconds != null)
                    message.elapsedSeconds = object.elapsedSeconds >>> 0;
                return message;
            };

            /**
             * Creates a plain object from an AlarmEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {esg.alarm.AlarmEvent} message AlarmEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AlarmEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.sequence = 0;
                    object.timestamp = 0;
                    object.deviceDbId = 0;
                    object.type = options.enums === String ? "ALARM_UNKNOWN" : 0;
                    object.state = options.enums === String ? "STATE_INACTIVE" : 0;
                    object.priority = options.enums === String ? "PRIORITY_LOW" : 0;
                    object.physicalState = false;
                    object.outputType = 0;
                    object.patternType = 0;
                    object.durationSeconds = 0;
                    object.elapsedSeconds = 0;
                }
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    object.sequence = message.sequence;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
                    object.deviceDbId = message.deviceDbId;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.esg.alarm.AlarmEvent.AlarmType[message.type] === undefined ? message.type : $root.esg.alarm.AlarmEvent.AlarmType[message.type] : message.type;
                if (message.state != null && message.hasOwnProperty("state"))
                    object.state = options.enums === String ? $root.esg.alarm.AlarmEvent.EventState[message.state] === undefined ? message.state : $root.esg.alarm.AlarmEvent.EventState[message.state] : message.state;
                if (message.priority != null && message.hasOwnProperty("priority"))
                    object.priority = options.enums === String ? $root.esg.alarm.AlarmEvent.Priority[message.priority] === undefined ? message.priority : $root.esg.alarm.AlarmEvent.Priority[message.priority] : message.priority;
                if (message.physicalState != null && message.hasOwnProperty("physicalState"))
                    object.physicalState = message.physicalState;
                if (message.outputType != null && message.hasOwnProperty("outputType"))
                    object.outputType = message.outputType;
                if (message.patternType != null && message.hasOwnProperty("patternType"))
                    object.patternType = message.patternType;
                if (message.durationSeconds != null && message.hasOwnProperty("durationSeconds"))
                    object.durationSeconds = message.durationSeconds;
                if (message.elapsedSeconds != null && message.hasOwnProperty("elapsedSeconds"))
                    object.elapsedSeconds = message.elapsedSeconds;
                return object;
            };

            /**
             * Converts this AlarmEvent to JSON.
             * @function toJSON
             * @memberof esg.alarm.AlarmEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AlarmEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AlarmEvent
             * @function getTypeUrl
             * @memberof esg.alarm.AlarmEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AlarmEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.AlarmEvent";
            };

            /**
             * AlarmType enum.
             * @name esg.alarm.AlarmEvent.AlarmType
             * @enum {number}
             * @property {number} ALARM_UNKNOWN=0 ALARM_UNKNOWN value
             * @property {number} ALARM_PANIC1=1 ALARM_PANIC1 value
             * @property {number} ALARM_PANIC2=2 ALARM_PANIC2 value
             * @property {number} ALARM_TAMPER=3 ALARM_TAMPER value
             * @property {number} ALARM_FIRE=4 ALARM_FIRE value
             * @property {number} ALARM_INTRUSION=5 ALARM_INTRUSION value
             * @property {number} ALARM_MEDICAL=6 ALARM_MEDICAL value
             * @property {number} ALARM_DURESS=7 ALARM_DURESS value
             * @property {number} OUTPUT_EVENT=10 OUTPUT_EVENT value
             */
            AlarmEvent.AlarmType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "ALARM_UNKNOWN"] = 0;
                values[valuesById[1] = "ALARM_PANIC1"] = 1;
                values[valuesById[2] = "ALARM_PANIC2"] = 2;
                values[valuesById[3] = "ALARM_TAMPER"] = 3;
                values[valuesById[4] = "ALARM_FIRE"] = 4;
                values[valuesById[5] = "ALARM_INTRUSION"] = 5;
                values[valuesById[6] = "ALARM_MEDICAL"] = 6;
                values[valuesById[7] = "ALARM_DURESS"] = 7;
                values[valuesById[10] = "OUTPUT_EVENT"] = 10;
                return values;
            })();

            /**
             * EventState enum.
             * @name esg.alarm.AlarmEvent.EventState
             * @enum {number}
             * @property {number} STATE_INACTIVE=0 STATE_INACTIVE value
             * @property {number} STATE_ACTIVE=1 STATE_ACTIVE value
             * @property {number} STATE_TEST=2 STATE_TEST value
             * @property {number} STATE_STARTING=3 STATE_STARTING value
             * @property {number} STATE_STOPPING=4 STATE_STOPPING value
             */
            AlarmEvent.EventState = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "STATE_INACTIVE"] = 0;
                values[valuesById[1] = "STATE_ACTIVE"] = 1;
                values[valuesById[2] = "STATE_TEST"] = 2;
                values[valuesById[3] = "STATE_STARTING"] = 3;
                values[valuesById[4] = "STATE_STOPPING"] = 4;
                return values;
            })();

            /**
             * Priority enum.
             * @name esg.alarm.AlarmEvent.Priority
             * @enum {number}
             * @property {number} PRIORITY_LOW=0 PRIORITY_LOW value
             * @property {number} PRIORITY_MEDIUM=1 PRIORITY_MEDIUM value
             * @property {number} PRIORITY_HIGH=2 PRIORITY_HIGH value
             * @property {number} PRIORITY_CRITICAL=3 PRIORITY_CRITICAL value
             */
            AlarmEvent.Priority = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "PRIORITY_LOW"] = 0;
                values[valuesById[1] = "PRIORITY_MEDIUM"] = 1;
                values[valuesById[2] = "PRIORITY_HIGH"] = 2;
                values[valuesById[3] = "PRIORITY_CRITICAL"] = 3;
                return values;
            })();

            return AlarmEvent;
        })();

        /**
         * CommandType enum.
         * @name esg.alarm.CommandType
         * @enum {number}
         * @property {number} CMD_UNKNOWN=0 CMD_UNKNOWN value
         * @property {number} CMD_SYSTEM=1 CMD_SYSTEM value
         * @property {number} CMD_CONFIG=2 CMD_CONFIG value
         * @property {number} CMD_OUTPUT=3 CMD_OUTPUT value
         * @property {number} CMD_DIAGNOSTIC=4 CMD_DIAGNOSTIC value
         * @property {number} CMD_OTA=5 CMD_OTA value
         */
        alarm.CommandType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CMD_UNKNOWN"] = 0;
            values[valuesById[1] = "CMD_SYSTEM"] = 1;
            values[valuesById[2] = "CMD_CONFIG"] = 2;
            values[valuesById[3] = "CMD_OUTPUT"] = 3;
            values[valuesById[4] = "CMD_DIAGNOSTIC"] = 4;
            values[valuesById[5] = "CMD_OTA"] = 5;
            return values;
        })();

        alarm.SystemCommand = (function() {

            /**
             * Properties of a SystemCommand.
             * @memberof esg.alarm
             * @interface ISystemCommand
             * @property {esg.alarm.SystemCommand.SystemAction|null} [action] SystemCommand action
             * @property {number|null} [delaySeconds] SystemCommand delaySeconds
             * @property {number|null} [unixTime] SystemCommand unixTime
             */

            /**
             * Constructs a new SystemCommand.
             * @memberof esg.alarm
             * @classdesc Represents a SystemCommand.
             * @implements ISystemCommand
             * @constructor
             * @param {esg.alarm.ISystemCommand=} [properties] Properties to set
             */
            function SystemCommand(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SystemCommand action.
             * @member {esg.alarm.SystemCommand.SystemAction} action
             * @memberof esg.alarm.SystemCommand
             * @instance
             */
            SystemCommand.prototype.action = 0;

            /**
             * SystemCommand delaySeconds.
             * @member {number} delaySeconds
             * @memberof esg.alarm.SystemCommand
             * @instance
             */
            SystemCommand.prototype.delaySeconds = 0;

            /**
             * SystemCommand unixTime.
             * @member {number} unixTime
             * @memberof esg.alarm.SystemCommand
             * @instance
             */
            SystemCommand.prototype.unixTime = 0;

            /**
             * Creates a new SystemCommand instance using the specified properties.
             * @function create
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {esg.alarm.ISystemCommand=} [properties] Properties to set
             * @returns {esg.alarm.SystemCommand} SystemCommand instance
             */
            SystemCommand.create = function create(properties) {
                return new SystemCommand(properties);
            };

            /**
             * Encodes the specified SystemCommand message. Does not implicitly {@link esg.alarm.SystemCommand.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {esg.alarm.ISystemCommand} message SystemCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SystemCommand.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
                if (message.delaySeconds != null && Object.hasOwnProperty.call(message, "delaySeconds"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.delaySeconds);
                if (message.unixTime != null && Object.hasOwnProperty.call(message, "unixTime"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.unixTime);
                return writer;
            };

            /**
             * Encodes the specified SystemCommand message, length delimited. Does not implicitly {@link esg.alarm.SystemCommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {esg.alarm.ISystemCommand} message SystemCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SystemCommand.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SystemCommand message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.SystemCommand} SystemCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SystemCommand.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.SystemCommand();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.action = reader.int32();
                            break;
                        }
                    case 2: {
                            message.delaySeconds = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.unixTime = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SystemCommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.SystemCommand} SystemCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SystemCommand.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SystemCommand message.
             * @function verify
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SystemCommand.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.action != null && message.hasOwnProperty("action"))
                    switch (message.action) {
                    default:
                        return "action: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    }
                if (message.delaySeconds != null && message.hasOwnProperty("delaySeconds"))
                    if (!$util.isInteger(message.delaySeconds))
                        return "delaySeconds: integer expected";
                if (message.unixTime != null && message.hasOwnProperty("unixTime"))
                    if (!$util.isInteger(message.unixTime))
                        return "unixTime: integer expected";
                return null;
            };

            /**
             * Creates a SystemCommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.SystemCommand} SystemCommand
             */
            SystemCommand.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.SystemCommand)
                    return object;
                var message = new $root.esg.alarm.SystemCommand();
                switch (object.action) {
                default:
                    if (typeof object.action === "number") {
                        message.action = object.action;
                        break;
                    }
                    break;
                case "SYS_UNKNOWN":
                case 0:
                    message.action = 0;
                    break;
                case "SYS_REBOOT":
                case 1:
                    message.action = 1;
                    break;
                case "SYS_FACTORY_RESET":
                case 2:
                    message.action = 2;
                    break;
                case "SYS_GET_STATUS":
                case 3:
                    message.action = 3;
                    break;
                case "SYS_SET_TIME":
                case 4:
                    message.action = 4;
                    break;
                case "SYS_CLEAR_COUNTERS":
                case 5:
                    message.action = 5;
                    break;
                }
                if (object.delaySeconds != null)
                    message.delaySeconds = object.delaySeconds >>> 0;
                if (object.unixTime != null)
                    message.unixTime = object.unixTime >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a SystemCommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {esg.alarm.SystemCommand} message SystemCommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SystemCommand.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.action = options.enums === String ? "SYS_UNKNOWN" : 0;
                    object.delaySeconds = 0;
                    object.unixTime = 0;
                }
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = options.enums === String ? $root.esg.alarm.SystemCommand.SystemAction[message.action] === undefined ? message.action : $root.esg.alarm.SystemCommand.SystemAction[message.action] : message.action;
                if (message.delaySeconds != null && message.hasOwnProperty("delaySeconds"))
                    object.delaySeconds = message.delaySeconds;
                if (message.unixTime != null && message.hasOwnProperty("unixTime"))
                    object.unixTime = message.unixTime;
                return object;
            };

            /**
             * Converts this SystemCommand to JSON.
             * @function toJSON
             * @memberof esg.alarm.SystemCommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SystemCommand.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SystemCommand
             * @function getTypeUrl
             * @memberof esg.alarm.SystemCommand
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SystemCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.SystemCommand";
            };

            /**
             * SystemAction enum.
             * @name esg.alarm.SystemCommand.SystemAction
             * @enum {number}
             * @property {number} SYS_UNKNOWN=0 SYS_UNKNOWN value
             * @property {number} SYS_REBOOT=1 SYS_REBOOT value
             * @property {number} SYS_FACTORY_RESET=2 SYS_FACTORY_RESET value
             * @property {number} SYS_GET_STATUS=3 SYS_GET_STATUS value
             * @property {number} SYS_SET_TIME=4 SYS_SET_TIME value
             * @property {number} SYS_CLEAR_COUNTERS=5 SYS_CLEAR_COUNTERS value
             */
            SystemCommand.SystemAction = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "SYS_UNKNOWN"] = 0;
                values[valuesById[1] = "SYS_REBOOT"] = 1;
                values[valuesById[2] = "SYS_FACTORY_RESET"] = 2;
                values[valuesById[3] = "SYS_GET_STATUS"] = 3;
                values[valuesById[4] = "SYS_SET_TIME"] = 4;
                values[valuesById[5] = "SYS_CLEAR_COUNTERS"] = 5;
                return values;
            })();

            return SystemCommand;
        })();

        alarm.ConfigCommand = (function() {

            /**
             * Properties of a ConfigCommand.
             * @memberof esg.alarm
             * @interface IConfigCommand
             * @property {esg.alarm.ConfigCommand.ConfigType|null} [type] ConfigCommand type
             * @property {esg.alarm.IWifiConfig|null} [wifi] ConfigCommand wifi
             * @property {esg.alarm.IMqttConfig|null} [mqtt] ConfigCommand mqtt
             * @property {esg.alarm.IDeviceConfig|null} [device] ConfigCommand device
             * @property {esg.alarm.ILocationConfig|null} [location] ConfigCommand location
             * @property {esg.alarm.INTPConfig|null} [ntp] ConfigCommand ntp
             * @property {esg.alarm.IBLEConfig|null} [ble] ConfigCommand ble
             */

            /**
             * Constructs a new ConfigCommand.
             * @memberof esg.alarm
             * @classdesc Represents a ConfigCommand.
             * @implements IConfigCommand
             * @constructor
             * @param {esg.alarm.IConfigCommand=} [properties] Properties to set
             */
            function ConfigCommand(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ConfigCommand type.
             * @member {esg.alarm.ConfigCommand.ConfigType} type
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            ConfigCommand.prototype.type = 0;

            /**
             * ConfigCommand wifi.
             * @member {esg.alarm.IWifiConfig|null|undefined} wifi
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            ConfigCommand.prototype.wifi = null;

            /**
             * ConfigCommand mqtt.
             * @member {esg.alarm.IMqttConfig|null|undefined} mqtt
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            ConfigCommand.prototype.mqtt = null;

            /**
             * ConfigCommand device.
             * @member {esg.alarm.IDeviceConfig|null|undefined} device
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            ConfigCommand.prototype.device = null;

            /**
             * ConfigCommand location.
             * @member {esg.alarm.ILocationConfig|null|undefined} location
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            ConfigCommand.prototype.location = null;

            /**
             * ConfigCommand ntp.
             * @member {esg.alarm.INTPConfig|null|undefined} ntp
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            ConfigCommand.prototype.ntp = null;

            /**
             * ConfigCommand ble.
             * @member {esg.alarm.IBLEConfig|null|undefined} ble
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            ConfigCommand.prototype.ble = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * ConfigCommand config.
             * @member {"wifi"|"mqtt"|"device"|"location"|"ntp"|"ble"|undefined} config
             * @memberof esg.alarm.ConfigCommand
             * @instance
             */
            Object.defineProperty(ConfigCommand.prototype, "config", {
                get: $util.oneOfGetter($oneOfFields = ["wifi", "mqtt", "device", "location", "ntp", "ble"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ConfigCommand instance using the specified properties.
             * @function create
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {esg.alarm.IConfigCommand=} [properties] Properties to set
             * @returns {esg.alarm.ConfigCommand} ConfigCommand instance
             */
            ConfigCommand.create = function create(properties) {
                return new ConfigCommand(properties);
            };

            /**
             * Encodes the specified ConfigCommand message. Does not implicitly {@link esg.alarm.ConfigCommand.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {esg.alarm.IConfigCommand} message ConfigCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConfigCommand.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.wifi != null && Object.hasOwnProperty.call(message, "wifi"))
                    $root.esg.alarm.WifiConfig.encode(message.wifi, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.mqtt != null && Object.hasOwnProperty.call(message, "mqtt"))
                    $root.esg.alarm.MqttConfig.encode(message.mqtt, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.device != null && Object.hasOwnProperty.call(message, "device"))
                    $root.esg.alarm.DeviceConfig.encode(message.device, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                    $root.esg.alarm.LocationConfig.encode(message.location, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.ntp != null && Object.hasOwnProperty.call(message, "ntp"))
                    $root.esg.alarm.NTPConfig.encode(message.ntp, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                if (message.ble != null && Object.hasOwnProperty.call(message, "ble"))
                    $root.esg.alarm.BLEConfig.encode(message.ble, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ConfigCommand message, length delimited. Does not implicitly {@link esg.alarm.ConfigCommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {esg.alarm.IConfigCommand} message ConfigCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConfigCommand.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ConfigCommand message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.ConfigCommand} ConfigCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConfigCommand.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.ConfigCommand();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 10: {
                            message.wifi = $root.esg.alarm.WifiConfig.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.mqtt = $root.esg.alarm.MqttConfig.decode(reader, reader.uint32());
                            break;
                        }
                    case 12: {
                            message.device = $root.esg.alarm.DeviceConfig.decode(reader, reader.uint32());
                            break;
                        }
                    case 13: {
                            message.location = $root.esg.alarm.LocationConfig.decode(reader, reader.uint32());
                            break;
                        }
                    case 14: {
                            message.ntp = $root.esg.alarm.NTPConfig.decode(reader, reader.uint32());
                            break;
                        }
                    case 15: {
                            message.ble = $root.esg.alarm.BLEConfig.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ConfigCommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.ConfigCommand} ConfigCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConfigCommand.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ConfigCommand message.
             * @function verify
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ConfigCommand.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        break;
                    }
                if (message.wifi != null && message.hasOwnProperty("wifi")) {
                    properties.config = 1;
                    {
                        var error = $root.esg.alarm.WifiConfig.verify(message.wifi);
                        if (error)
                            return "wifi." + error;
                    }
                }
                if (message.mqtt != null && message.hasOwnProperty("mqtt")) {
                    if (properties.config === 1)
                        return "config: multiple values";
                    properties.config = 1;
                    {
                        var error = $root.esg.alarm.MqttConfig.verify(message.mqtt);
                        if (error)
                            return "mqtt." + error;
                    }
                }
                if (message.device != null && message.hasOwnProperty("device")) {
                    if (properties.config === 1)
                        return "config: multiple values";
                    properties.config = 1;
                    {
                        var error = $root.esg.alarm.DeviceConfig.verify(message.device);
                        if (error)
                            return "device." + error;
                    }
                }
                if (message.location != null && message.hasOwnProperty("location")) {
                    if (properties.config === 1)
                        return "config: multiple values";
                    properties.config = 1;
                    {
                        var error = $root.esg.alarm.LocationConfig.verify(message.location);
                        if (error)
                            return "location." + error;
                    }
                }
                if (message.ntp != null && message.hasOwnProperty("ntp")) {
                    if (properties.config === 1)
                        return "config: multiple values";
                    properties.config = 1;
                    {
                        var error = $root.esg.alarm.NTPConfig.verify(message.ntp);
                        if (error)
                            return "ntp." + error;
                    }
                }
                if (message.ble != null && message.hasOwnProperty("ble")) {
                    if (properties.config === 1)
                        return "config: multiple values";
                    properties.config = 1;
                    {
                        var error = $root.esg.alarm.BLEConfig.verify(message.ble);
                        if (error)
                            return "ble." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ConfigCommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.ConfigCommand} ConfigCommand
             */
            ConfigCommand.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.ConfigCommand)
                    return object;
                var message = new $root.esg.alarm.ConfigCommand();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "CFG_UNKNOWN":
                case 0:
                    message.type = 0;
                    break;
                case "CFG_WIFI":
                case 1:
                    message.type = 1;
                    break;
                case "CFG_MQTT":
                case 2:
                    message.type = 2;
                    break;
                case "CFG_DEVICE":
                case 3:
                    message.type = 3;
                    break;
                case "CFG_LOCATION":
                case 4:
                    message.type = 4;
                    break;
                case "CFG_NTP":
                case 5:
                    message.type = 5;
                    break;
                case "CFG_BLE":
                case 6:
                    message.type = 6;
                    break;
                }
                if (object.wifi != null) {
                    if (typeof object.wifi !== "object")
                        throw TypeError(".esg.alarm.ConfigCommand.wifi: object expected");
                    message.wifi = $root.esg.alarm.WifiConfig.fromObject(object.wifi);
                }
                if (object.mqtt != null) {
                    if (typeof object.mqtt !== "object")
                        throw TypeError(".esg.alarm.ConfigCommand.mqtt: object expected");
                    message.mqtt = $root.esg.alarm.MqttConfig.fromObject(object.mqtt);
                }
                if (object.device != null) {
                    if (typeof object.device !== "object")
                        throw TypeError(".esg.alarm.ConfigCommand.device: object expected");
                    message.device = $root.esg.alarm.DeviceConfig.fromObject(object.device);
                }
                if (object.location != null) {
                    if (typeof object.location !== "object")
                        throw TypeError(".esg.alarm.ConfigCommand.location: object expected");
                    message.location = $root.esg.alarm.LocationConfig.fromObject(object.location);
                }
                if (object.ntp != null) {
                    if (typeof object.ntp !== "object")
                        throw TypeError(".esg.alarm.ConfigCommand.ntp: object expected");
                    message.ntp = $root.esg.alarm.NTPConfig.fromObject(object.ntp);
                }
                if (object.ble != null) {
                    if (typeof object.ble !== "object")
                        throw TypeError(".esg.alarm.ConfigCommand.ble: object expected");
                    message.ble = $root.esg.alarm.BLEConfig.fromObject(object.ble);
                }
                return message;
            };

            /**
             * Creates a plain object from a ConfigCommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {esg.alarm.ConfigCommand} message ConfigCommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ConfigCommand.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.type = options.enums === String ? "CFG_UNKNOWN" : 0;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.esg.alarm.ConfigCommand.ConfigType[message.type] === undefined ? message.type : $root.esg.alarm.ConfigCommand.ConfigType[message.type] : message.type;
                if (message.wifi != null && message.hasOwnProperty("wifi")) {
                    object.wifi = $root.esg.alarm.WifiConfig.toObject(message.wifi, options);
                    if (options.oneofs)
                        object.config = "wifi";
                }
                if (message.mqtt != null && message.hasOwnProperty("mqtt")) {
                    object.mqtt = $root.esg.alarm.MqttConfig.toObject(message.mqtt, options);
                    if (options.oneofs)
                        object.config = "mqtt";
                }
                if (message.device != null && message.hasOwnProperty("device")) {
                    object.device = $root.esg.alarm.DeviceConfig.toObject(message.device, options);
                    if (options.oneofs)
                        object.config = "device";
                }
                if (message.location != null && message.hasOwnProperty("location")) {
                    object.location = $root.esg.alarm.LocationConfig.toObject(message.location, options);
                    if (options.oneofs)
                        object.config = "location";
                }
                if (message.ntp != null && message.hasOwnProperty("ntp")) {
                    object.ntp = $root.esg.alarm.NTPConfig.toObject(message.ntp, options);
                    if (options.oneofs)
                        object.config = "ntp";
                }
                if (message.ble != null && message.hasOwnProperty("ble")) {
                    object.ble = $root.esg.alarm.BLEConfig.toObject(message.ble, options);
                    if (options.oneofs)
                        object.config = "ble";
                }
                return object;
            };

            /**
             * Converts this ConfigCommand to JSON.
             * @function toJSON
             * @memberof esg.alarm.ConfigCommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ConfigCommand.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ConfigCommand
             * @function getTypeUrl
             * @memberof esg.alarm.ConfigCommand
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ConfigCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.ConfigCommand";
            };

            /**
             * ConfigType enum.
             * @name esg.alarm.ConfigCommand.ConfigType
             * @enum {number}
             * @property {number} CFG_UNKNOWN=0 CFG_UNKNOWN value
             * @property {number} CFG_WIFI=1 CFG_WIFI value
             * @property {number} CFG_MQTT=2 CFG_MQTT value
             * @property {number} CFG_DEVICE=3 CFG_DEVICE value
             * @property {number} CFG_LOCATION=4 CFG_LOCATION value
             * @property {number} CFG_NTP=5 CFG_NTP value
             * @property {number} CFG_BLE=6 CFG_BLE value
             */
            ConfigCommand.ConfigType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "CFG_UNKNOWN"] = 0;
                values[valuesById[1] = "CFG_WIFI"] = 1;
                values[valuesById[2] = "CFG_MQTT"] = 2;
                values[valuesById[3] = "CFG_DEVICE"] = 3;
                values[valuesById[4] = "CFG_LOCATION"] = 4;
                values[valuesById[5] = "CFG_NTP"] = 5;
                values[valuesById[6] = "CFG_BLE"] = 6;
                return values;
            })();

            return ConfigCommand;
        })();

        alarm.WifiConfig = (function() {

            /**
             * Properties of a WifiConfig.
             * @memberof esg.alarm
             * @interface IWifiConfig
             * @property {string|null} [ssid] WifiConfig ssid
             * @property {string|null} [password] WifiConfig password
             * @property {boolean|null} [dhcp] WifiConfig dhcp
             * @property {number|null} [staticIp] WifiConfig staticIp
             * @property {number|null} [gateway] WifiConfig gateway
             * @property {number|null} [netmask] WifiConfig netmask
             */

            /**
             * Constructs a new WifiConfig.
             * @memberof esg.alarm
             * @classdesc Represents a WifiConfig.
             * @implements IWifiConfig
             * @constructor
             * @param {esg.alarm.IWifiConfig=} [properties] Properties to set
             */
            function WifiConfig(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * WifiConfig ssid.
             * @member {string|null|undefined} ssid
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            WifiConfig.prototype.ssid = null;

            /**
             * WifiConfig password.
             * @member {string|null|undefined} password
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            WifiConfig.prototype.password = null;

            /**
             * WifiConfig dhcp.
             * @member {boolean|null|undefined} dhcp
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            WifiConfig.prototype.dhcp = null;

            /**
             * WifiConfig staticIp.
             * @member {number|null|undefined} staticIp
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            WifiConfig.prototype.staticIp = null;

            /**
             * WifiConfig gateway.
             * @member {number|null|undefined} gateway
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            WifiConfig.prototype.gateway = null;

            /**
             * WifiConfig netmask.
             * @member {number|null|undefined} netmask
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            WifiConfig.prototype.netmask = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * WifiConfig _ssid.
             * @member {"ssid"|undefined} _ssid
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            Object.defineProperty(WifiConfig.prototype, "_ssid", {
                get: $util.oneOfGetter($oneOfFields = ["ssid"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * WifiConfig _password.
             * @member {"password"|undefined} _password
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            Object.defineProperty(WifiConfig.prototype, "_password", {
                get: $util.oneOfGetter($oneOfFields = ["password"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * WifiConfig _dhcp.
             * @member {"dhcp"|undefined} _dhcp
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            Object.defineProperty(WifiConfig.prototype, "_dhcp", {
                get: $util.oneOfGetter($oneOfFields = ["dhcp"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * WifiConfig _staticIp.
             * @member {"staticIp"|undefined} _staticIp
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            Object.defineProperty(WifiConfig.prototype, "_staticIp", {
                get: $util.oneOfGetter($oneOfFields = ["staticIp"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * WifiConfig _gateway.
             * @member {"gateway"|undefined} _gateway
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            Object.defineProperty(WifiConfig.prototype, "_gateway", {
                get: $util.oneOfGetter($oneOfFields = ["gateway"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * WifiConfig _netmask.
             * @member {"netmask"|undefined} _netmask
             * @memberof esg.alarm.WifiConfig
             * @instance
             */
            Object.defineProperty(WifiConfig.prototype, "_netmask", {
                get: $util.oneOfGetter($oneOfFields = ["netmask"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new WifiConfig instance using the specified properties.
             * @function create
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {esg.alarm.IWifiConfig=} [properties] Properties to set
             * @returns {esg.alarm.WifiConfig} WifiConfig instance
             */
            WifiConfig.create = function create(properties) {
                return new WifiConfig(properties);
            };

            /**
             * Encodes the specified WifiConfig message. Does not implicitly {@link esg.alarm.WifiConfig.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {esg.alarm.IWifiConfig} message WifiConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WifiConfig.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ssid != null && Object.hasOwnProperty.call(message, "ssid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.ssid);
                if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
                if (message.dhcp != null && Object.hasOwnProperty.call(message, "dhcp"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.dhcp);
                if (message.staticIp != null && Object.hasOwnProperty.call(message, "staticIp"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.staticIp);
                if (message.gateway != null && Object.hasOwnProperty.call(message, "gateway"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.gateway);
                if (message.netmask != null && Object.hasOwnProperty.call(message, "netmask"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.netmask);
                return writer;
            };

            /**
             * Encodes the specified WifiConfig message, length delimited. Does not implicitly {@link esg.alarm.WifiConfig.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {esg.alarm.IWifiConfig} message WifiConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            WifiConfig.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a WifiConfig message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.WifiConfig} WifiConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WifiConfig.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.WifiConfig();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.ssid = reader.string();
                            break;
                        }
                    case 2: {
                            message.password = reader.string();
                            break;
                        }
                    case 3: {
                            message.dhcp = reader.bool();
                            break;
                        }
                    case 4: {
                            message.staticIp = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.gateway = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.netmask = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a WifiConfig message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.WifiConfig} WifiConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            WifiConfig.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a WifiConfig message.
             * @function verify
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            WifiConfig.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.ssid != null && message.hasOwnProperty("ssid")) {
                    properties._ssid = 1;
                    if (!$util.isString(message.ssid))
                        return "ssid: string expected";
                }
                if (message.password != null && message.hasOwnProperty("password")) {
                    properties._password = 1;
                    if (!$util.isString(message.password))
                        return "password: string expected";
                }
                if (message.dhcp != null && message.hasOwnProperty("dhcp")) {
                    properties._dhcp = 1;
                    if (typeof message.dhcp !== "boolean")
                        return "dhcp: boolean expected";
                }
                if (message.staticIp != null && message.hasOwnProperty("staticIp")) {
                    properties._staticIp = 1;
                    if (!$util.isInteger(message.staticIp))
                        return "staticIp: integer expected";
                }
                if (message.gateway != null && message.hasOwnProperty("gateway")) {
                    properties._gateway = 1;
                    if (!$util.isInteger(message.gateway))
                        return "gateway: integer expected";
                }
                if (message.netmask != null && message.hasOwnProperty("netmask")) {
                    properties._netmask = 1;
                    if (!$util.isInteger(message.netmask))
                        return "netmask: integer expected";
                }
                return null;
            };

            /**
             * Creates a WifiConfig message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.WifiConfig} WifiConfig
             */
            WifiConfig.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.WifiConfig)
                    return object;
                var message = new $root.esg.alarm.WifiConfig();
                if (object.ssid != null)
                    message.ssid = String(object.ssid);
                if (object.password != null)
                    message.password = String(object.password);
                if (object.dhcp != null)
                    message.dhcp = Boolean(object.dhcp);
                if (object.staticIp != null)
                    message.staticIp = object.staticIp >>> 0;
                if (object.gateway != null)
                    message.gateway = object.gateway >>> 0;
                if (object.netmask != null)
                    message.netmask = object.netmask >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a WifiConfig message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {esg.alarm.WifiConfig} message WifiConfig
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            WifiConfig.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.ssid != null && message.hasOwnProperty("ssid")) {
                    object.ssid = message.ssid;
                    if (options.oneofs)
                        object._ssid = "ssid";
                }
                if (message.password != null && message.hasOwnProperty("password")) {
                    object.password = message.password;
                    if (options.oneofs)
                        object._password = "password";
                }
                if (message.dhcp != null && message.hasOwnProperty("dhcp")) {
                    object.dhcp = message.dhcp;
                    if (options.oneofs)
                        object._dhcp = "dhcp";
                }
                if (message.staticIp != null && message.hasOwnProperty("staticIp")) {
                    object.staticIp = message.staticIp;
                    if (options.oneofs)
                        object._staticIp = "staticIp";
                }
                if (message.gateway != null && message.hasOwnProperty("gateway")) {
                    object.gateway = message.gateway;
                    if (options.oneofs)
                        object._gateway = "gateway";
                }
                if (message.netmask != null && message.hasOwnProperty("netmask")) {
                    object.netmask = message.netmask;
                    if (options.oneofs)
                        object._netmask = "netmask";
                }
                return object;
            };

            /**
             * Converts this WifiConfig to JSON.
             * @function toJSON
             * @memberof esg.alarm.WifiConfig
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            WifiConfig.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for WifiConfig
             * @function getTypeUrl
             * @memberof esg.alarm.WifiConfig
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            WifiConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.WifiConfig";
            };

            return WifiConfig;
        })();

        alarm.MqttConfig = (function() {

            /**
             * Properties of a MqttConfig.
             * @memberof esg.alarm
             * @interface IMqttConfig
             * @property {string|null} [brokerUrl] MqttConfig brokerUrl
             * @property {number|null} [port] MqttConfig port
             * @property {string|null} [username] MqttConfig username
             * @property {string|null} [password] MqttConfig password
             * @property {number|null} [keepalive] MqttConfig keepalive
             * @property {number|null} [qos] MqttConfig qos
             * @property {boolean|null} [useTls] MqttConfig useTls
             */

            /**
             * Constructs a new MqttConfig.
             * @memberof esg.alarm
             * @classdesc Represents a MqttConfig.
             * @implements IMqttConfig
             * @constructor
             * @param {esg.alarm.IMqttConfig=} [properties] Properties to set
             */
            function MqttConfig(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MqttConfig brokerUrl.
             * @member {string|null|undefined} brokerUrl
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            MqttConfig.prototype.brokerUrl = null;

            /**
             * MqttConfig port.
             * @member {number|null|undefined} port
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            MqttConfig.prototype.port = null;

            /**
             * MqttConfig username.
             * @member {string|null|undefined} username
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            MqttConfig.prototype.username = null;

            /**
             * MqttConfig password.
             * @member {string|null|undefined} password
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            MqttConfig.prototype.password = null;

            /**
             * MqttConfig keepalive.
             * @member {number|null|undefined} keepalive
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            MqttConfig.prototype.keepalive = null;

            /**
             * MqttConfig qos.
             * @member {number|null|undefined} qos
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            MqttConfig.prototype.qos = null;

            /**
             * MqttConfig useTls.
             * @member {boolean|null|undefined} useTls
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            MqttConfig.prototype.useTls = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * MqttConfig _brokerUrl.
             * @member {"brokerUrl"|undefined} _brokerUrl
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            Object.defineProperty(MqttConfig.prototype, "_brokerUrl", {
                get: $util.oneOfGetter($oneOfFields = ["brokerUrl"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * MqttConfig _port.
             * @member {"port"|undefined} _port
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            Object.defineProperty(MqttConfig.prototype, "_port", {
                get: $util.oneOfGetter($oneOfFields = ["port"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * MqttConfig _username.
             * @member {"username"|undefined} _username
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            Object.defineProperty(MqttConfig.prototype, "_username", {
                get: $util.oneOfGetter($oneOfFields = ["username"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * MqttConfig _password.
             * @member {"password"|undefined} _password
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            Object.defineProperty(MqttConfig.prototype, "_password", {
                get: $util.oneOfGetter($oneOfFields = ["password"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * MqttConfig _keepalive.
             * @member {"keepalive"|undefined} _keepalive
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            Object.defineProperty(MqttConfig.prototype, "_keepalive", {
                get: $util.oneOfGetter($oneOfFields = ["keepalive"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * MqttConfig _qos.
             * @member {"qos"|undefined} _qos
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            Object.defineProperty(MqttConfig.prototype, "_qos", {
                get: $util.oneOfGetter($oneOfFields = ["qos"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * MqttConfig _useTls.
             * @member {"useTls"|undefined} _useTls
             * @memberof esg.alarm.MqttConfig
             * @instance
             */
            Object.defineProperty(MqttConfig.prototype, "_useTls", {
                get: $util.oneOfGetter($oneOfFields = ["useTls"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new MqttConfig instance using the specified properties.
             * @function create
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {esg.alarm.IMqttConfig=} [properties] Properties to set
             * @returns {esg.alarm.MqttConfig} MqttConfig instance
             */
            MqttConfig.create = function create(properties) {
                return new MqttConfig(properties);
            };

            /**
             * Encodes the specified MqttConfig message. Does not implicitly {@link esg.alarm.MqttConfig.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {esg.alarm.IMqttConfig} message MqttConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MqttConfig.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.brokerUrl != null && Object.hasOwnProperty.call(message, "brokerUrl"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.brokerUrl);
                if (message.port != null && Object.hasOwnProperty.call(message, "port"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.port);
                if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.username);
                if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.password);
                if (message.keepalive != null && Object.hasOwnProperty.call(message, "keepalive"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.keepalive);
                if (message.qos != null && Object.hasOwnProperty.call(message, "qos"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.qos);
                if (message.useTls != null && Object.hasOwnProperty.call(message, "useTls"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.useTls);
                return writer;
            };

            /**
             * Encodes the specified MqttConfig message, length delimited. Does not implicitly {@link esg.alarm.MqttConfig.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {esg.alarm.IMqttConfig} message MqttConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MqttConfig.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MqttConfig message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.MqttConfig} MqttConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MqttConfig.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.MqttConfig();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.brokerUrl = reader.string();
                            break;
                        }
                    case 2: {
                            message.port = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.username = reader.string();
                            break;
                        }
                    case 4: {
                            message.password = reader.string();
                            break;
                        }
                    case 5: {
                            message.keepalive = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.qos = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.useTls = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MqttConfig message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.MqttConfig} MqttConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MqttConfig.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MqttConfig message.
             * @function verify
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MqttConfig.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.brokerUrl != null && message.hasOwnProperty("brokerUrl")) {
                    properties._brokerUrl = 1;
                    if (!$util.isString(message.brokerUrl))
                        return "brokerUrl: string expected";
                }
                if (message.port != null && message.hasOwnProperty("port")) {
                    properties._port = 1;
                    if (!$util.isInteger(message.port))
                        return "port: integer expected";
                }
                if (message.username != null && message.hasOwnProperty("username")) {
                    properties._username = 1;
                    if (!$util.isString(message.username))
                        return "username: string expected";
                }
                if (message.password != null && message.hasOwnProperty("password")) {
                    properties._password = 1;
                    if (!$util.isString(message.password))
                        return "password: string expected";
                }
                if (message.keepalive != null && message.hasOwnProperty("keepalive")) {
                    properties._keepalive = 1;
                    if (!$util.isInteger(message.keepalive))
                        return "keepalive: integer expected";
                }
                if (message.qos != null && message.hasOwnProperty("qos")) {
                    properties._qos = 1;
                    if (!$util.isInteger(message.qos))
                        return "qos: integer expected";
                }
                if (message.useTls != null && message.hasOwnProperty("useTls")) {
                    properties._useTls = 1;
                    if (typeof message.useTls !== "boolean")
                        return "useTls: boolean expected";
                }
                return null;
            };

            /**
             * Creates a MqttConfig message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.MqttConfig} MqttConfig
             */
            MqttConfig.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.MqttConfig)
                    return object;
                var message = new $root.esg.alarm.MqttConfig();
                if (object.brokerUrl != null)
                    message.brokerUrl = String(object.brokerUrl);
                if (object.port != null)
                    message.port = object.port >>> 0;
                if (object.username != null)
                    message.username = String(object.username);
                if (object.password != null)
                    message.password = String(object.password);
                if (object.keepalive != null)
                    message.keepalive = object.keepalive >>> 0;
                if (object.qos != null)
                    message.qos = object.qos >>> 0;
                if (object.useTls != null)
                    message.useTls = Boolean(object.useTls);
                return message;
            };

            /**
             * Creates a plain object from a MqttConfig message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {esg.alarm.MqttConfig} message MqttConfig
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MqttConfig.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.brokerUrl != null && message.hasOwnProperty("brokerUrl")) {
                    object.brokerUrl = message.brokerUrl;
                    if (options.oneofs)
                        object._brokerUrl = "brokerUrl";
                }
                if (message.port != null && message.hasOwnProperty("port")) {
                    object.port = message.port;
                    if (options.oneofs)
                        object._port = "port";
                }
                if (message.username != null && message.hasOwnProperty("username")) {
                    object.username = message.username;
                    if (options.oneofs)
                        object._username = "username";
                }
                if (message.password != null && message.hasOwnProperty("password")) {
                    object.password = message.password;
                    if (options.oneofs)
                        object._password = "password";
                }
                if (message.keepalive != null && message.hasOwnProperty("keepalive")) {
                    object.keepalive = message.keepalive;
                    if (options.oneofs)
                        object._keepalive = "keepalive";
                }
                if (message.qos != null && message.hasOwnProperty("qos")) {
                    object.qos = message.qos;
                    if (options.oneofs)
                        object._qos = "qos";
                }
                if (message.useTls != null && message.hasOwnProperty("useTls")) {
                    object.useTls = message.useTls;
                    if (options.oneofs)
                        object._useTls = "useTls";
                }
                return object;
            };

            /**
             * Converts this MqttConfig to JSON.
             * @function toJSON
             * @memberof esg.alarm.MqttConfig
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MqttConfig.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for MqttConfig
             * @function getTypeUrl
             * @memberof esg.alarm.MqttConfig
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            MqttConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.MqttConfig";
            };

            return MqttConfig;
        })();

        alarm.DeviceConfig = (function() {

            /**
             * Properties of a DeviceConfig.
             * @memberof esg.alarm
             * @interface IDeviceConfig
             * @property {string|null} [hostname] DeviceConfig hostname
             * @property {number|null} [deviceId] DeviceConfig deviceId
             * @property {boolean|null} [enableHeartbeat] DeviceConfig enableHeartbeat
             * @property {number|null} [heartbeatInterval] DeviceConfig heartbeatInterval
             */

            /**
             * Constructs a new DeviceConfig.
             * @memberof esg.alarm
             * @classdesc Represents a DeviceConfig.
             * @implements IDeviceConfig
             * @constructor
             * @param {esg.alarm.IDeviceConfig=} [properties] Properties to set
             */
            function DeviceConfig(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeviceConfig hostname.
             * @member {string|null|undefined} hostname
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            DeviceConfig.prototype.hostname = null;

            /**
             * DeviceConfig deviceId.
             * @member {number|null|undefined} deviceId
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            DeviceConfig.prototype.deviceId = null;

            /**
             * DeviceConfig enableHeartbeat.
             * @member {boolean|null|undefined} enableHeartbeat
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            DeviceConfig.prototype.enableHeartbeat = null;

            /**
             * DeviceConfig heartbeatInterval.
             * @member {number|null|undefined} heartbeatInterval
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            DeviceConfig.prototype.heartbeatInterval = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * DeviceConfig _hostname.
             * @member {"hostname"|undefined} _hostname
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            Object.defineProperty(DeviceConfig.prototype, "_hostname", {
                get: $util.oneOfGetter($oneOfFields = ["hostname"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DeviceConfig _deviceId.
             * @member {"deviceId"|undefined} _deviceId
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            Object.defineProperty(DeviceConfig.prototype, "_deviceId", {
                get: $util.oneOfGetter($oneOfFields = ["deviceId"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DeviceConfig _enableHeartbeat.
             * @member {"enableHeartbeat"|undefined} _enableHeartbeat
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            Object.defineProperty(DeviceConfig.prototype, "_enableHeartbeat", {
                get: $util.oneOfGetter($oneOfFields = ["enableHeartbeat"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * DeviceConfig _heartbeatInterval.
             * @member {"heartbeatInterval"|undefined} _heartbeatInterval
             * @memberof esg.alarm.DeviceConfig
             * @instance
             */
            Object.defineProperty(DeviceConfig.prototype, "_heartbeatInterval", {
                get: $util.oneOfGetter($oneOfFields = ["heartbeatInterval"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new DeviceConfig instance using the specified properties.
             * @function create
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {esg.alarm.IDeviceConfig=} [properties] Properties to set
             * @returns {esg.alarm.DeviceConfig} DeviceConfig instance
             */
            DeviceConfig.create = function create(properties) {
                return new DeviceConfig(properties);
            };

            /**
             * Encodes the specified DeviceConfig message. Does not implicitly {@link esg.alarm.DeviceConfig.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {esg.alarm.IDeviceConfig} message DeviceConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeviceConfig.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.hostname != null && Object.hasOwnProperty.call(message, "hostname"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostname);
                if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.deviceId);
                if (message.enableHeartbeat != null && Object.hasOwnProperty.call(message, "enableHeartbeat"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.enableHeartbeat);
                if (message.heartbeatInterval != null && Object.hasOwnProperty.call(message, "heartbeatInterval"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.heartbeatInterval);
                return writer;
            };

            /**
             * Encodes the specified DeviceConfig message, length delimited. Does not implicitly {@link esg.alarm.DeviceConfig.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {esg.alarm.IDeviceConfig} message DeviceConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeviceConfig.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeviceConfig message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.DeviceConfig} DeviceConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeviceConfig.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.DeviceConfig();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.hostname = reader.string();
                            break;
                        }
                    case 2: {
                            message.deviceId = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.enableHeartbeat = reader.bool();
                            break;
                        }
                    case 4: {
                            message.heartbeatInterval = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DeviceConfig message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.DeviceConfig} DeviceConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeviceConfig.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeviceConfig message.
             * @function verify
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeviceConfig.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.hostname != null && message.hasOwnProperty("hostname")) {
                    properties._hostname = 1;
                    if (!$util.isString(message.hostname))
                        return "hostname: string expected";
                }
                if (message.deviceId != null && message.hasOwnProperty("deviceId")) {
                    properties._deviceId = 1;
                    if (!$util.isInteger(message.deviceId))
                        return "deviceId: integer expected";
                }
                if (message.enableHeartbeat != null && message.hasOwnProperty("enableHeartbeat")) {
                    properties._enableHeartbeat = 1;
                    if (typeof message.enableHeartbeat !== "boolean")
                        return "enableHeartbeat: boolean expected";
                }
                if (message.heartbeatInterval != null && message.hasOwnProperty("heartbeatInterval")) {
                    properties._heartbeatInterval = 1;
                    if (!$util.isInteger(message.heartbeatInterval))
                        return "heartbeatInterval: integer expected";
                }
                return null;
            };

            /**
             * Creates a DeviceConfig message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.DeviceConfig} DeviceConfig
             */
            DeviceConfig.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.DeviceConfig)
                    return object;
                var message = new $root.esg.alarm.DeviceConfig();
                if (object.hostname != null)
                    message.hostname = String(object.hostname);
                if (object.deviceId != null)
                    message.deviceId = object.deviceId >>> 0;
                if (object.enableHeartbeat != null)
                    message.enableHeartbeat = Boolean(object.enableHeartbeat);
                if (object.heartbeatInterval != null)
                    message.heartbeatInterval = object.heartbeatInterval >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a DeviceConfig message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {esg.alarm.DeviceConfig} message DeviceConfig
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeviceConfig.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.hostname != null && message.hasOwnProperty("hostname")) {
                    object.hostname = message.hostname;
                    if (options.oneofs)
                        object._hostname = "hostname";
                }
                if (message.deviceId != null && message.hasOwnProperty("deviceId")) {
                    object.deviceId = message.deviceId;
                    if (options.oneofs)
                        object._deviceId = "deviceId";
                }
                if (message.enableHeartbeat != null && message.hasOwnProperty("enableHeartbeat")) {
                    object.enableHeartbeat = message.enableHeartbeat;
                    if (options.oneofs)
                        object._enableHeartbeat = "enableHeartbeat";
                }
                if (message.heartbeatInterval != null && message.hasOwnProperty("heartbeatInterval")) {
                    object.heartbeatInterval = message.heartbeatInterval;
                    if (options.oneofs)
                        object._heartbeatInterval = "heartbeatInterval";
                }
                return object;
            };

            /**
             * Converts this DeviceConfig to JSON.
             * @function toJSON
             * @memberof esg.alarm.DeviceConfig
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeviceConfig.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DeviceConfig
             * @function getTypeUrl
             * @memberof esg.alarm.DeviceConfig
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DeviceConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.DeviceConfig";
            };

            return DeviceConfig;
        })();

        alarm.LocationConfig = (function() {

            /**
             * Properties of a LocationConfig.
             * @memberof esg.alarm
             * @interface ILocationConfig
             * @property {string|null} [country] LocationConfig country
             * @property {number|null} [zone] LocationConfig zone
             * @property {number|null} [latitude] LocationConfig latitude
             * @property {number|null} [longitude] LocationConfig longitude
             */

            /**
             * Constructs a new LocationConfig.
             * @memberof esg.alarm
             * @classdesc Represents a LocationConfig.
             * @implements ILocationConfig
             * @constructor
             * @param {esg.alarm.ILocationConfig=} [properties] Properties to set
             */
            function LocationConfig(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LocationConfig country.
             * @member {string|null|undefined} country
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            LocationConfig.prototype.country = null;

            /**
             * LocationConfig zone.
             * @member {number|null|undefined} zone
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            LocationConfig.prototype.zone = null;

            /**
             * LocationConfig latitude.
             * @member {number|null|undefined} latitude
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            LocationConfig.prototype.latitude = null;

            /**
             * LocationConfig longitude.
             * @member {number|null|undefined} longitude
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            LocationConfig.prototype.longitude = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * LocationConfig _country.
             * @member {"country"|undefined} _country
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            Object.defineProperty(LocationConfig.prototype, "_country", {
                get: $util.oneOfGetter($oneOfFields = ["country"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * LocationConfig _zone.
             * @member {"zone"|undefined} _zone
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            Object.defineProperty(LocationConfig.prototype, "_zone", {
                get: $util.oneOfGetter($oneOfFields = ["zone"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * LocationConfig _latitude.
             * @member {"latitude"|undefined} _latitude
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            Object.defineProperty(LocationConfig.prototype, "_latitude", {
                get: $util.oneOfGetter($oneOfFields = ["latitude"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * LocationConfig _longitude.
             * @member {"longitude"|undefined} _longitude
             * @memberof esg.alarm.LocationConfig
             * @instance
             */
            Object.defineProperty(LocationConfig.prototype, "_longitude", {
                get: $util.oneOfGetter($oneOfFields = ["longitude"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new LocationConfig instance using the specified properties.
             * @function create
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {esg.alarm.ILocationConfig=} [properties] Properties to set
             * @returns {esg.alarm.LocationConfig} LocationConfig instance
             */
            LocationConfig.create = function create(properties) {
                return new LocationConfig(properties);
            };

            /**
             * Encodes the specified LocationConfig message. Does not implicitly {@link esg.alarm.LocationConfig.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {esg.alarm.ILocationConfig} message LocationConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocationConfig.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.country != null && Object.hasOwnProperty.call(message, "country"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.country);
                if (message.zone != null && Object.hasOwnProperty.call(message, "zone"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.zone);
                if (message.latitude != null && Object.hasOwnProperty.call(message, "latitude"))
                    writer.uint32(/* id 3, wireType 5 =*/29).float(message.latitude);
                if (message.longitude != null && Object.hasOwnProperty.call(message, "longitude"))
                    writer.uint32(/* id 4, wireType 5 =*/37).float(message.longitude);
                return writer;
            };

            /**
             * Encodes the specified LocationConfig message, length delimited. Does not implicitly {@link esg.alarm.LocationConfig.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {esg.alarm.ILocationConfig} message LocationConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocationConfig.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LocationConfig message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.LocationConfig} LocationConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocationConfig.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.LocationConfig();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.country = reader.string();
                            break;
                        }
                    case 2: {
                            message.zone = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.latitude = reader.float();
                            break;
                        }
                    case 4: {
                            message.longitude = reader.float();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a LocationConfig message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.LocationConfig} LocationConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocationConfig.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LocationConfig message.
             * @function verify
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LocationConfig.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.country != null && message.hasOwnProperty("country")) {
                    properties._country = 1;
                    if (!$util.isString(message.country))
                        return "country: string expected";
                }
                if (message.zone != null && message.hasOwnProperty("zone")) {
                    properties._zone = 1;
                    if (!$util.isInteger(message.zone))
                        return "zone: integer expected";
                }
                if (message.latitude != null && message.hasOwnProperty("latitude")) {
                    properties._latitude = 1;
                    if (typeof message.latitude !== "number")
                        return "latitude: number expected";
                }
                if (message.longitude != null && message.hasOwnProperty("longitude")) {
                    properties._longitude = 1;
                    if (typeof message.longitude !== "number")
                        return "longitude: number expected";
                }
                return null;
            };

            /**
             * Creates a LocationConfig message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.LocationConfig} LocationConfig
             */
            LocationConfig.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.LocationConfig)
                    return object;
                var message = new $root.esg.alarm.LocationConfig();
                if (object.country != null)
                    message.country = String(object.country);
                if (object.zone != null)
                    message.zone = object.zone >>> 0;
                if (object.latitude != null)
                    message.latitude = Number(object.latitude);
                if (object.longitude != null)
                    message.longitude = Number(object.longitude);
                return message;
            };

            /**
             * Creates a plain object from a LocationConfig message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {esg.alarm.LocationConfig} message LocationConfig
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LocationConfig.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.country != null && message.hasOwnProperty("country")) {
                    object.country = message.country;
                    if (options.oneofs)
                        object._country = "country";
                }
                if (message.zone != null && message.hasOwnProperty("zone")) {
                    object.zone = message.zone;
                    if (options.oneofs)
                        object._zone = "zone";
                }
                if (message.latitude != null && message.hasOwnProperty("latitude")) {
                    object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
                    if (options.oneofs)
                        object._latitude = "latitude";
                }
                if (message.longitude != null && message.hasOwnProperty("longitude")) {
                    object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
                    if (options.oneofs)
                        object._longitude = "longitude";
                }
                return object;
            };

            /**
             * Converts this LocationConfig to JSON.
             * @function toJSON
             * @memberof esg.alarm.LocationConfig
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LocationConfig.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LocationConfig
             * @function getTypeUrl
             * @memberof esg.alarm.LocationConfig
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LocationConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.LocationConfig";
            };

            return LocationConfig;
        })();

        alarm.NTPConfig = (function() {

            /**
             * Properties of a NTPConfig.
             * @memberof esg.alarm
             * @interface INTPConfig
             * @property {string|null} [server1] NTPConfig server1
             * @property {string|null} [server2] NTPConfig server2
             * @property {string|null} [server3] NTPConfig server3
             * @property {boolean|null} [enableSync] NTPConfig enableSync
             * @property {number|null} [syncInterval] NTPConfig syncInterval
             * @property {number|null} [timezoneOffset] NTPConfig timezoneOffset
             * @property {string|null} [timezoneName] NTPConfig timezoneName
             */

            /**
             * Constructs a new NTPConfig.
             * @memberof esg.alarm
             * @classdesc Represents a NTPConfig.
             * @implements INTPConfig
             * @constructor
             * @param {esg.alarm.INTPConfig=} [properties] Properties to set
             */
            function NTPConfig(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * NTPConfig server1.
             * @member {string|null|undefined} server1
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            NTPConfig.prototype.server1 = null;

            /**
             * NTPConfig server2.
             * @member {string|null|undefined} server2
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            NTPConfig.prototype.server2 = null;

            /**
             * NTPConfig server3.
             * @member {string|null|undefined} server3
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            NTPConfig.prototype.server3 = null;

            /**
             * NTPConfig enableSync.
             * @member {boolean|null|undefined} enableSync
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            NTPConfig.prototype.enableSync = null;

            /**
             * NTPConfig syncInterval.
             * @member {number|null|undefined} syncInterval
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            NTPConfig.prototype.syncInterval = null;

            /**
             * NTPConfig timezoneOffset.
             * @member {number|null|undefined} timezoneOffset
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            NTPConfig.prototype.timezoneOffset = null;

            /**
             * NTPConfig timezoneName.
             * @member {string|null|undefined} timezoneName
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            NTPConfig.prototype.timezoneName = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * NTPConfig _server1.
             * @member {"server1"|undefined} _server1
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            Object.defineProperty(NTPConfig.prototype, "_server1", {
                get: $util.oneOfGetter($oneOfFields = ["server1"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * NTPConfig _server2.
             * @member {"server2"|undefined} _server2
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            Object.defineProperty(NTPConfig.prototype, "_server2", {
                get: $util.oneOfGetter($oneOfFields = ["server2"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * NTPConfig _server3.
             * @member {"server3"|undefined} _server3
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            Object.defineProperty(NTPConfig.prototype, "_server3", {
                get: $util.oneOfGetter($oneOfFields = ["server3"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * NTPConfig _enableSync.
             * @member {"enableSync"|undefined} _enableSync
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            Object.defineProperty(NTPConfig.prototype, "_enableSync", {
                get: $util.oneOfGetter($oneOfFields = ["enableSync"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * NTPConfig _syncInterval.
             * @member {"syncInterval"|undefined} _syncInterval
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            Object.defineProperty(NTPConfig.prototype, "_syncInterval", {
                get: $util.oneOfGetter($oneOfFields = ["syncInterval"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * NTPConfig _timezoneOffset.
             * @member {"timezoneOffset"|undefined} _timezoneOffset
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            Object.defineProperty(NTPConfig.prototype, "_timezoneOffset", {
                get: $util.oneOfGetter($oneOfFields = ["timezoneOffset"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * NTPConfig _timezoneName.
             * @member {"timezoneName"|undefined} _timezoneName
             * @memberof esg.alarm.NTPConfig
             * @instance
             */
            Object.defineProperty(NTPConfig.prototype, "_timezoneName", {
                get: $util.oneOfGetter($oneOfFields = ["timezoneName"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new NTPConfig instance using the specified properties.
             * @function create
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {esg.alarm.INTPConfig=} [properties] Properties to set
             * @returns {esg.alarm.NTPConfig} NTPConfig instance
             */
            NTPConfig.create = function create(properties) {
                return new NTPConfig(properties);
            };

            /**
             * Encodes the specified NTPConfig message. Does not implicitly {@link esg.alarm.NTPConfig.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {esg.alarm.INTPConfig} message NTPConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NTPConfig.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.server1 != null && Object.hasOwnProperty.call(message, "server1"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.server1);
                if (message.server2 != null && Object.hasOwnProperty.call(message, "server2"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.server2);
                if (message.server3 != null && Object.hasOwnProperty.call(message, "server3"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.server3);
                if (message.enableSync != null && Object.hasOwnProperty.call(message, "enableSync"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.enableSync);
                if (message.syncInterval != null && Object.hasOwnProperty.call(message, "syncInterval"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.syncInterval);
                if (message.timezoneOffset != null && Object.hasOwnProperty.call(message, "timezoneOffset"))
                    writer.uint32(/* id 6, wireType 0 =*/48).int32(message.timezoneOffset);
                if (message.timezoneName != null && Object.hasOwnProperty.call(message, "timezoneName"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.timezoneName);
                return writer;
            };

            /**
             * Encodes the specified NTPConfig message, length delimited. Does not implicitly {@link esg.alarm.NTPConfig.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {esg.alarm.INTPConfig} message NTPConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            NTPConfig.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a NTPConfig message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.NTPConfig} NTPConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NTPConfig.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.NTPConfig();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.server1 = reader.string();
                            break;
                        }
                    case 2: {
                            message.server2 = reader.string();
                            break;
                        }
                    case 3: {
                            message.server3 = reader.string();
                            break;
                        }
                    case 4: {
                            message.enableSync = reader.bool();
                            break;
                        }
                    case 5: {
                            message.syncInterval = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.timezoneOffset = reader.int32();
                            break;
                        }
                    case 7: {
                            message.timezoneName = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a NTPConfig message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.NTPConfig} NTPConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NTPConfig.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a NTPConfig message.
             * @function verify
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            NTPConfig.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.server1 != null && message.hasOwnProperty("server1")) {
                    properties._server1 = 1;
                    if (!$util.isString(message.server1))
                        return "server1: string expected";
                }
                if (message.server2 != null && message.hasOwnProperty("server2")) {
                    properties._server2 = 1;
                    if (!$util.isString(message.server2))
                        return "server2: string expected";
                }
                if (message.server3 != null && message.hasOwnProperty("server3")) {
                    properties._server3 = 1;
                    if (!$util.isString(message.server3))
                        return "server3: string expected";
                }
                if (message.enableSync != null && message.hasOwnProperty("enableSync")) {
                    properties._enableSync = 1;
                    if (typeof message.enableSync !== "boolean")
                        return "enableSync: boolean expected";
                }
                if (message.syncInterval != null && message.hasOwnProperty("syncInterval")) {
                    properties._syncInterval = 1;
                    if (!$util.isInteger(message.syncInterval))
                        return "syncInterval: integer expected";
                }
                if (message.timezoneOffset != null && message.hasOwnProperty("timezoneOffset")) {
                    properties._timezoneOffset = 1;
                    if (!$util.isInteger(message.timezoneOffset))
                        return "timezoneOffset: integer expected";
                }
                if (message.timezoneName != null && message.hasOwnProperty("timezoneName")) {
                    properties._timezoneName = 1;
                    if (!$util.isString(message.timezoneName))
                        return "timezoneName: string expected";
                }
                return null;
            };

            /**
             * Creates a NTPConfig message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.NTPConfig} NTPConfig
             */
            NTPConfig.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.NTPConfig)
                    return object;
                var message = new $root.esg.alarm.NTPConfig();
                if (object.server1 != null)
                    message.server1 = String(object.server1);
                if (object.server2 != null)
                    message.server2 = String(object.server2);
                if (object.server3 != null)
                    message.server3 = String(object.server3);
                if (object.enableSync != null)
                    message.enableSync = Boolean(object.enableSync);
                if (object.syncInterval != null)
                    message.syncInterval = object.syncInterval >>> 0;
                if (object.timezoneOffset != null)
                    message.timezoneOffset = object.timezoneOffset | 0;
                if (object.timezoneName != null)
                    message.timezoneName = String(object.timezoneName);
                return message;
            };

            /**
             * Creates a plain object from a NTPConfig message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {esg.alarm.NTPConfig} message NTPConfig
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            NTPConfig.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.server1 != null && message.hasOwnProperty("server1")) {
                    object.server1 = message.server1;
                    if (options.oneofs)
                        object._server1 = "server1";
                }
                if (message.server2 != null && message.hasOwnProperty("server2")) {
                    object.server2 = message.server2;
                    if (options.oneofs)
                        object._server2 = "server2";
                }
                if (message.server3 != null && message.hasOwnProperty("server3")) {
                    object.server3 = message.server3;
                    if (options.oneofs)
                        object._server3 = "server3";
                }
                if (message.enableSync != null && message.hasOwnProperty("enableSync")) {
                    object.enableSync = message.enableSync;
                    if (options.oneofs)
                        object._enableSync = "enableSync";
                }
                if (message.syncInterval != null && message.hasOwnProperty("syncInterval")) {
                    object.syncInterval = message.syncInterval;
                    if (options.oneofs)
                        object._syncInterval = "syncInterval";
                }
                if (message.timezoneOffset != null && message.hasOwnProperty("timezoneOffset")) {
                    object.timezoneOffset = message.timezoneOffset;
                    if (options.oneofs)
                        object._timezoneOffset = "timezoneOffset";
                }
                if (message.timezoneName != null && message.hasOwnProperty("timezoneName")) {
                    object.timezoneName = message.timezoneName;
                    if (options.oneofs)
                        object._timezoneName = "timezoneName";
                }
                return object;
            };

            /**
             * Converts this NTPConfig to JSON.
             * @function toJSON
             * @memberof esg.alarm.NTPConfig
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            NTPConfig.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for NTPConfig
             * @function getTypeUrl
             * @memberof esg.alarm.NTPConfig
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            NTPConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.NTPConfig";
            };

            return NTPConfig;
        })();

        alarm.BLEConfig = (function() {

            /**
             * Properties of a BLEConfig.
             * @memberof esg.alarm
             * @interface IBLEConfig
             * @property {boolean|null} [enable] BLEConfig enable
             * @property {string|null} [deviceName] BLEConfig deviceName
             * @property {boolean|null} [advertise] BLEConfig advertise
             * @property {number|null} [intervalMs] BLEConfig intervalMs
             * @property {Uint8Array|null} [advHmacKey] BLEConfig advHmacKey
             * @property {Uint8Array|null} [sppHmacKey] BLEConfig sppHmacKey
             * @property {number|null} [txPower] BLEConfig txPower
             */

            /**
             * Constructs a new BLEConfig.
             * @memberof esg.alarm
             * @classdesc Represents a BLEConfig.
             * @implements IBLEConfig
             * @constructor
             * @param {esg.alarm.IBLEConfig=} [properties] Properties to set
             */
            function BLEConfig(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BLEConfig enable.
             * @member {boolean|null|undefined} enable
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            BLEConfig.prototype.enable = null;

            /**
             * BLEConfig deviceName.
             * @member {string|null|undefined} deviceName
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            BLEConfig.prototype.deviceName = null;

            /**
             * BLEConfig advertise.
             * @member {boolean|null|undefined} advertise
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            BLEConfig.prototype.advertise = null;

            /**
             * BLEConfig intervalMs.
             * @member {number|null|undefined} intervalMs
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            BLEConfig.prototype.intervalMs = null;

            /**
             * BLEConfig advHmacKey.
             * @member {Uint8Array|null|undefined} advHmacKey
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            BLEConfig.prototype.advHmacKey = null;

            /**
             * BLEConfig sppHmacKey.
             * @member {Uint8Array|null|undefined} sppHmacKey
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            BLEConfig.prototype.sppHmacKey = null;

            /**
             * BLEConfig txPower.
             * @member {number|null|undefined} txPower
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            BLEConfig.prototype.txPower = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * BLEConfig _enable.
             * @member {"enable"|undefined} _enable
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            Object.defineProperty(BLEConfig.prototype, "_enable", {
                get: $util.oneOfGetter($oneOfFields = ["enable"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * BLEConfig _deviceName.
             * @member {"deviceName"|undefined} _deviceName
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            Object.defineProperty(BLEConfig.prototype, "_deviceName", {
                get: $util.oneOfGetter($oneOfFields = ["deviceName"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * BLEConfig _advertise.
             * @member {"advertise"|undefined} _advertise
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            Object.defineProperty(BLEConfig.prototype, "_advertise", {
                get: $util.oneOfGetter($oneOfFields = ["advertise"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * BLEConfig _intervalMs.
             * @member {"intervalMs"|undefined} _intervalMs
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            Object.defineProperty(BLEConfig.prototype, "_intervalMs", {
                get: $util.oneOfGetter($oneOfFields = ["intervalMs"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * BLEConfig _advHmacKey.
             * @member {"advHmacKey"|undefined} _advHmacKey
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            Object.defineProperty(BLEConfig.prototype, "_advHmacKey", {
                get: $util.oneOfGetter($oneOfFields = ["advHmacKey"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * BLEConfig _sppHmacKey.
             * @member {"sppHmacKey"|undefined} _sppHmacKey
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            Object.defineProperty(BLEConfig.prototype, "_sppHmacKey", {
                get: $util.oneOfGetter($oneOfFields = ["sppHmacKey"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * BLEConfig _txPower.
             * @member {"txPower"|undefined} _txPower
             * @memberof esg.alarm.BLEConfig
             * @instance
             */
            Object.defineProperty(BLEConfig.prototype, "_txPower", {
                get: $util.oneOfGetter($oneOfFields = ["txPower"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new BLEConfig instance using the specified properties.
             * @function create
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {esg.alarm.IBLEConfig=} [properties] Properties to set
             * @returns {esg.alarm.BLEConfig} BLEConfig instance
             */
            BLEConfig.create = function create(properties) {
                return new BLEConfig(properties);
            };

            /**
             * Encodes the specified BLEConfig message. Does not implicitly {@link esg.alarm.BLEConfig.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {esg.alarm.IBLEConfig} message BLEConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BLEConfig.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.enable != null && Object.hasOwnProperty.call(message, "enable"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.enable);
                if (message.deviceName != null && Object.hasOwnProperty.call(message, "deviceName"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.deviceName);
                if (message.advertise != null && Object.hasOwnProperty.call(message, "advertise"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.advertise);
                if (message.intervalMs != null && Object.hasOwnProperty.call(message, "intervalMs"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.intervalMs);
                if (message.advHmacKey != null && Object.hasOwnProperty.call(message, "advHmacKey"))
                    writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.advHmacKey);
                if (message.sppHmacKey != null && Object.hasOwnProperty.call(message, "sppHmacKey"))
                    writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.sppHmacKey);
                if (message.txPower != null && Object.hasOwnProperty.call(message, "txPower"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.txPower);
                return writer;
            };

            /**
             * Encodes the specified BLEConfig message, length delimited. Does not implicitly {@link esg.alarm.BLEConfig.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {esg.alarm.IBLEConfig} message BLEConfig message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BLEConfig.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BLEConfig message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.BLEConfig} BLEConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BLEConfig.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.BLEConfig();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.enable = reader.bool();
                            break;
                        }
                    case 2: {
                            message.deviceName = reader.string();
                            break;
                        }
                    case 3: {
                            message.advertise = reader.bool();
                            break;
                        }
                    case 4: {
                            message.intervalMs = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.advHmacKey = reader.bytes();
                            break;
                        }
                    case 6: {
                            message.sppHmacKey = reader.bytes();
                            break;
                        }
                    case 7: {
                            message.txPower = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BLEConfig message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.BLEConfig} BLEConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BLEConfig.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BLEConfig message.
             * @function verify
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BLEConfig.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.enable != null && message.hasOwnProperty("enable")) {
                    properties._enable = 1;
                    if (typeof message.enable !== "boolean")
                        return "enable: boolean expected";
                }
                if (message.deviceName != null && message.hasOwnProperty("deviceName")) {
                    properties._deviceName = 1;
                    if (!$util.isString(message.deviceName))
                        return "deviceName: string expected";
                }
                if (message.advertise != null && message.hasOwnProperty("advertise")) {
                    properties._advertise = 1;
                    if (typeof message.advertise !== "boolean")
                        return "advertise: boolean expected";
                }
                if (message.intervalMs != null && message.hasOwnProperty("intervalMs")) {
                    properties._intervalMs = 1;
                    if (!$util.isInteger(message.intervalMs))
                        return "intervalMs: integer expected";
                }
                if (message.advHmacKey != null && message.hasOwnProperty("advHmacKey")) {
                    properties._advHmacKey = 1;
                    if (!(message.advHmacKey && typeof message.advHmacKey.length === "number" || $util.isString(message.advHmacKey)))
                        return "advHmacKey: buffer expected";
                }
                if (message.sppHmacKey != null && message.hasOwnProperty("sppHmacKey")) {
                    properties._sppHmacKey = 1;
                    if (!(message.sppHmacKey && typeof message.sppHmacKey.length === "number" || $util.isString(message.sppHmacKey)))
                        return "sppHmacKey: buffer expected";
                }
                if (message.txPower != null && message.hasOwnProperty("txPower")) {
                    properties._txPower = 1;
                    if (!$util.isInteger(message.txPower))
                        return "txPower: integer expected";
                }
                return null;
            };

            /**
             * Creates a BLEConfig message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.BLEConfig} BLEConfig
             */
            BLEConfig.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.BLEConfig)
                    return object;
                var message = new $root.esg.alarm.BLEConfig();
                if (object.enable != null)
                    message.enable = Boolean(object.enable);
                if (object.deviceName != null)
                    message.deviceName = String(object.deviceName);
                if (object.advertise != null)
                    message.advertise = Boolean(object.advertise);
                if (object.intervalMs != null)
                    message.intervalMs = object.intervalMs >>> 0;
                if (object.advHmacKey != null)
                    if (typeof object.advHmacKey === "string")
                        $util.base64.decode(object.advHmacKey, message.advHmacKey = $util.newBuffer($util.base64.length(object.advHmacKey)), 0);
                    else if (object.advHmacKey.length >= 0)
                        message.advHmacKey = object.advHmacKey;
                if (object.sppHmacKey != null)
                    if (typeof object.sppHmacKey === "string")
                        $util.base64.decode(object.sppHmacKey, message.sppHmacKey = $util.newBuffer($util.base64.length(object.sppHmacKey)), 0);
                    else if (object.sppHmacKey.length >= 0)
                        message.sppHmacKey = object.sppHmacKey;
                if (object.txPower != null)
                    message.txPower = object.txPower >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a BLEConfig message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {esg.alarm.BLEConfig} message BLEConfig
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BLEConfig.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (message.enable != null && message.hasOwnProperty("enable")) {
                    object.enable = message.enable;
                    if (options.oneofs)
                        object._enable = "enable";
                }
                if (message.deviceName != null && message.hasOwnProperty("deviceName")) {
                    object.deviceName = message.deviceName;
                    if (options.oneofs)
                        object._deviceName = "deviceName";
                }
                if (message.advertise != null && message.hasOwnProperty("advertise")) {
                    object.advertise = message.advertise;
                    if (options.oneofs)
                        object._advertise = "advertise";
                }
                if (message.intervalMs != null && message.hasOwnProperty("intervalMs")) {
                    object.intervalMs = message.intervalMs;
                    if (options.oneofs)
                        object._intervalMs = "intervalMs";
                }
                if (message.advHmacKey != null && message.hasOwnProperty("advHmacKey")) {
                    object.advHmacKey = options.bytes === String ? $util.base64.encode(message.advHmacKey, 0, message.advHmacKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.advHmacKey) : message.advHmacKey;
                    if (options.oneofs)
                        object._advHmacKey = "advHmacKey";
                }
                if (message.sppHmacKey != null && message.hasOwnProperty("sppHmacKey")) {
                    object.sppHmacKey = options.bytes === String ? $util.base64.encode(message.sppHmacKey, 0, message.sppHmacKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.sppHmacKey) : message.sppHmacKey;
                    if (options.oneofs)
                        object._sppHmacKey = "sppHmacKey";
                }
                if (message.txPower != null && message.hasOwnProperty("txPower")) {
                    object.txPower = message.txPower;
                    if (options.oneofs)
                        object._txPower = "txPower";
                }
                return object;
            };

            /**
             * Converts this BLEConfig to JSON.
             * @function toJSON
             * @memberof esg.alarm.BLEConfig
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BLEConfig.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BLEConfig
             * @function getTypeUrl
             * @memberof esg.alarm.BLEConfig
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BLEConfig.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.BLEConfig";
            };

            return BLEConfig;
        })();

        alarm.OutputCommand = (function() {

            /**
             * Properties of an OutputCommand.
             * @memberof esg.alarm
             * @interface IOutputCommand
             * @property {esg.alarm.OutputCommand.OutputType|null} [output] OutputCommand output
             * @property {esg.alarm.OutputCommand.PatternType|null} [pattern] OutputCommand pattern
             * @property {boolean|null} [state] OutputCommand state
             * @property {number|null} [totalDuration] OutputCommand totalDuration
             * @property {number|null} [pulseCount] OutputCommand pulseCount
             * @property {number|null} [onDurationMs] OutputCommand onDurationMs
             * @property {number|null} [offDurationMs] OutputCommand offDurationMs
             * @property {number|null} [repeatInterval] OutputCommand repeatInterval
             * @property {number|null} [customData] OutputCommand customData
             */

            /**
             * Constructs a new OutputCommand.
             * @memberof esg.alarm
             * @classdesc Represents an OutputCommand.
             * @implements IOutputCommand
             * @constructor
             * @param {esg.alarm.IOutputCommand=} [properties] Properties to set
             */
            function OutputCommand(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * OutputCommand output.
             * @member {esg.alarm.OutputCommand.OutputType} output
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.output = 0;

            /**
             * OutputCommand pattern.
             * @member {esg.alarm.OutputCommand.PatternType} pattern
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.pattern = 0;

            /**
             * OutputCommand state.
             * @member {boolean} state
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.state = false;

            /**
             * OutputCommand totalDuration.
             * @member {number} totalDuration
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.totalDuration = 0;

            /**
             * OutputCommand pulseCount.
             * @member {number} pulseCount
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.pulseCount = 0;

            /**
             * OutputCommand onDurationMs.
             * @member {number} onDurationMs
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.onDurationMs = 0;

            /**
             * OutputCommand offDurationMs.
             * @member {number} offDurationMs
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.offDurationMs = 0;

            /**
             * OutputCommand repeatInterval.
             * @member {number} repeatInterval
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.repeatInterval = 0;

            /**
             * OutputCommand customData.
             * @member {number} customData
             * @memberof esg.alarm.OutputCommand
             * @instance
             */
            OutputCommand.prototype.customData = 0;

            /**
             * Creates a new OutputCommand instance using the specified properties.
             * @function create
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {esg.alarm.IOutputCommand=} [properties] Properties to set
             * @returns {esg.alarm.OutputCommand} OutputCommand instance
             */
            OutputCommand.create = function create(properties) {
                return new OutputCommand(properties);
            };

            /**
             * Encodes the specified OutputCommand message. Does not implicitly {@link esg.alarm.OutputCommand.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {esg.alarm.IOutputCommand} message OutputCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OutputCommand.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.output != null && Object.hasOwnProperty.call(message, "output"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.output);
                if (message.pattern != null && Object.hasOwnProperty.call(message, "pattern"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pattern);
                if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.state);
                if (message.totalDuration != null && Object.hasOwnProperty.call(message, "totalDuration"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.totalDuration);
                if (message.pulseCount != null && Object.hasOwnProperty.call(message, "pulseCount"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.pulseCount);
                if (message.onDurationMs != null && Object.hasOwnProperty.call(message, "onDurationMs"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.onDurationMs);
                if (message.offDurationMs != null && Object.hasOwnProperty.call(message, "offDurationMs"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.offDurationMs);
                if (message.repeatInterval != null && Object.hasOwnProperty.call(message, "repeatInterval"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.repeatInterval);
                if (message.customData != null && Object.hasOwnProperty.call(message, "customData"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.customData);
                return writer;
            };

            /**
             * Encodes the specified OutputCommand message, length delimited. Does not implicitly {@link esg.alarm.OutputCommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {esg.alarm.IOutputCommand} message OutputCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OutputCommand.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an OutputCommand message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.OutputCommand} OutputCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OutputCommand.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.OutputCommand();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.output = reader.int32();
                            break;
                        }
                    case 2: {
                            message.pattern = reader.int32();
                            break;
                        }
                    case 3: {
                            message.state = reader.bool();
                            break;
                        }
                    case 4: {
                            message.totalDuration = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.pulseCount = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.onDurationMs = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.offDurationMs = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.repeatInterval = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.customData = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an OutputCommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.OutputCommand} OutputCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OutputCommand.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an OutputCommand message.
             * @function verify
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OutputCommand.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.output != null && message.hasOwnProperty("output"))
                    switch (message.output) {
                    default:
                        return "output: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        break;
                    }
                if (message.pattern != null && message.hasOwnProperty("pattern"))
                    switch (message.pattern) {
                    default:
                        return "pattern: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 255:
                        break;
                    }
                if (message.state != null && message.hasOwnProperty("state"))
                    if (typeof message.state !== "boolean")
                        return "state: boolean expected";
                if (message.totalDuration != null && message.hasOwnProperty("totalDuration"))
                    if (!$util.isInteger(message.totalDuration))
                        return "totalDuration: integer expected";
                if (message.pulseCount != null && message.hasOwnProperty("pulseCount"))
                    if (!$util.isInteger(message.pulseCount))
                        return "pulseCount: integer expected";
                if (message.onDurationMs != null && message.hasOwnProperty("onDurationMs"))
                    if (!$util.isInteger(message.onDurationMs))
                        return "onDurationMs: integer expected";
                if (message.offDurationMs != null && message.hasOwnProperty("offDurationMs"))
                    if (!$util.isInteger(message.offDurationMs))
                        return "offDurationMs: integer expected";
                if (message.repeatInterval != null && message.hasOwnProperty("repeatInterval"))
                    if (!$util.isInteger(message.repeatInterval))
                        return "repeatInterval: integer expected";
                if (message.customData != null && message.hasOwnProperty("customData"))
                    if (!$util.isInteger(message.customData))
                        return "customData: integer expected";
                return null;
            };

            /**
             * Creates an OutputCommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.OutputCommand} OutputCommand
             */
            OutputCommand.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.OutputCommand)
                    return object;
                var message = new $root.esg.alarm.OutputCommand();
                switch (object.output) {
                default:
                    if (typeof object.output === "number") {
                        message.output = object.output;
                        break;
                    }
                    break;
                case "OUT_UNKNOWN":
                case 0:
                    message.output = 0;
                    break;
                case "OUT_SIREN":
                case 1:
                    message.output = 1;
                    break;
                case "OUT_TURRET":
                case 2:
                    message.output = 2;
                    break;
                case "OUT_RELAY1":
                case 3:
                    message.output = 3;
                    break;
                case "OUT_RELAY2":
                case 4:
                    message.output = 4;
                    break;
                case "OUT_FAN":
                case 5:
                    message.output = 5;
                    break;
                case "OUT_ALL":
                case 6:
                    message.output = 6;
                    break;
                }
                switch (object.pattern) {
                default:
                    if (typeof object.pattern === "number") {
                        message.pattern = object.pattern;
                        break;
                    }
                    break;
                case "PATTERN_NONE":
                case 0:
                    message.pattern = 0;
                    break;
                case "PATTERN_CONSTANT":
                case 1:
                    message.pattern = 1;
                    break;
                case "PATTERN_PULSE":
                case 2:
                    message.pattern = 2;
                    break;
                case "PATTERN_BLINK_SLOW":
                case 3:
                    message.pattern = 3;
                    break;
                case "PATTERN_BLINK_FAST":
                case 4:
                    message.pattern = 4;
                    break;
                case "PATTERN_DOUBLE_PULSE":
                case 5:
                    message.pattern = 5;
                    break;
                case "PATTERN_TRIPLE_PULSE":
                case 6:
                    message.pattern = 6;
                    break;
                case "PATTERN_SOS":
                case 7:
                    message.pattern = 7;
                    break;
                case "PATTERN_STROBE":
                case 8:
                    message.pattern = 8;
                    break;
                case "PATTERN_OFF":
                case 9:
                    message.pattern = 9;
                    break;
                case "PATTERN_PWM":
                case 10:
                    message.pattern = 10;
                    break;
                case "PATTERN_CUSTOM":
                case 255:
                    message.pattern = 255;
                    break;
                }
                if (object.state != null)
                    message.state = Boolean(object.state);
                if (object.totalDuration != null)
                    message.totalDuration = object.totalDuration >>> 0;
                if (object.pulseCount != null)
                    message.pulseCount = object.pulseCount >>> 0;
                if (object.onDurationMs != null)
                    message.onDurationMs = object.onDurationMs >>> 0;
                if (object.offDurationMs != null)
                    message.offDurationMs = object.offDurationMs >>> 0;
                if (object.repeatInterval != null)
                    message.repeatInterval = object.repeatInterval >>> 0;
                if (object.customData != null)
                    message.customData = object.customData >>> 0;
                return message;
            };

            /**
             * Creates a plain object from an OutputCommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {esg.alarm.OutputCommand} message OutputCommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OutputCommand.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.output = options.enums === String ? "OUT_UNKNOWN" : 0;
                    object.pattern = options.enums === String ? "PATTERN_NONE" : 0;
                    object.state = false;
                    object.totalDuration = 0;
                    object.pulseCount = 0;
                    object.onDurationMs = 0;
                    object.offDurationMs = 0;
                    object.repeatInterval = 0;
                    object.customData = 0;
                }
                if (message.output != null && message.hasOwnProperty("output"))
                    object.output = options.enums === String ? $root.esg.alarm.OutputCommand.OutputType[message.output] === undefined ? message.output : $root.esg.alarm.OutputCommand.OutputType[message.output] : message.output;
                if (message.pattern != null && message.hasOwnProperty("pattern"))
                    object.pattern = options.enums === String ? $root.esg.alarm.OutputCommand.PatternType[message.pattern] === undefined ? message.pattern : $root.esg.alarm.OutputCommand.PatternType[message.pattern] : message.pattern;
                if (message.state != null && message.hasOwnProperty("state"))
                    object.state = message.state;
                if (message.totalDuration != null && message.hasOwnProperty("totalDuration"))
                    object.totalDuration = message.totalDuration;
                if (message.pulseCount != null && message.hasOwnProperty("pulseCount"))
                    object.pulseCount = message.pulseCount;
                if (message.onDurationMs != null && message.hasOwnProperty("onDurationMs"))
                    object.onDurationMs = message.onDurationMs;
                if (message.offDurationMs != null && message.hasOwnProperty("offDurationMs"))
                    object.offDurationMs = message.offDurationMs;
                if (message.repeatInterval != null && message.hasOwnProperty("repeatInterval"))
                    object.repeatInterval = message.repeatInterval;
                if (message.customData != null && message.hasOwnProperty("customData"))
                    object.customData = message.customData;
                return object;
            };

            /**
             * Converts this OutputCommand to JSON.
             * @function toJSON
             * @memberof esg.alarm.OutputCommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OutputCommand.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for OutputCommand
             * @function getTypeUrl
             * @memberof esg.alarm.OutputCommand
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            OutputCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.OutputCommand";
            };

            /**
             * OutputType enum.
             * @name esg.alarm.OutputCommand.OutputType
             * @enum {number}
             * @property {number} OUT_UNKNOWN=0 OUT_UNKNOWN value
             * @property {number} OUT_SIREN=1 OUT_SIREN value
             * @property {number} OUT_TURRET=2 OUT_TURRET value
             * @property {number} OUT_RELAY1=3 OUT_RELAY1 value
             * @property {number} OUT_RELAY2=4 OUT_RELAY2 value
             * @property {number} OUT_FAN=5 OUT_FAN value
             * @property {number} OUT_ALL=6 OUT_ALL value
             */
            OutputCommand.OutputType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "OUT_UNKNOWN"] = 0;
                values[valuesById[1] = "OUT_SIREN"] = 1;
                values[valuesById[2] = "OUT_TURRET"] = 2;
                values[valuesById[3] = "OUT_RELAY1"] = 3;
                values[valuesById[4] = "OUT_RELAY2"] = 4;
                values[valuesById[5] = "OUT_FAN"] = 5;
                values[valuesById[6] = "OUT_ALL"] = 6;
                return values;
            })();

            /**
             * PatternType enum.
             * @name esg.alarm.OutputCommand.PatternType
             * @enum {number}
             * @property {number} PATTERN_NONE=0 PATTERN_NONE value
             * @property {number} PATTERN_CONSTANT=1 PATTERN_CONSTANT value
             * @property {number} PATTERN_PULSE=2 PATTERN_PULSE value
             * @property {number} PATTERN_BLINK_SLOW=3 PATTERN_BLINK_SLOW value
             * @property {number} PATTERN_BLINK_FAST=4 PATTERN_BLINK_FAST value
             * @property {number} PATTERN_DOUBLE_PULSE=5 PATTERN_DOUBLE_PULSE value
             * @property {number} PATTERN_TRIPLE_PULSE=6 PATTERN_TRIPLE_PULSE value
             * @property {number} PATTERN_SOS=7 PATTERN_SOS value
             * @property {number} PATTERN_STROBE=8 PATTERN_STROBE value
             * @property {number} PATTERN_OFF=9 PATTERN_OFF value
             * @property {number} PATTERN_PWM=10 PATTERN_PWM value
             * @property {number} PATTERN_CUSTOM=255 PATTERN_CUSTOM value
             */
            OutputCommand.PatternType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "PATTERN_NONE"] = 0;
                values[valuesById[1] = "PATTERN_CONSTANT"] = 1;
                values[valuesById[2] = "PATTERN_PULSE"] = 2;
                values[valuesById[3] = "PATTERN_BLINK_SLOW"] = 3;
                values[valuesById[4] = "PATTERN_BLINK_FAST"] = 4;
                values[valuesById[5] = "PATTERN_DOUBLE_PULSE"] = 5;
                values[valuesById[6] = "PATTERN_TRIPLE_PULSE"] = 6;
                values[valuesById[7] = "PATTERN_SOS"] = 7;
                values[valuesById[8] = "PATTERN_STROBE"] = 8;
                values[valuesById[9] = "PATTERN_OFF"] = 9;
                values[valuesById[10] = "PATTERN_PWM"] = 10;
                values[valuesById[255] = "PATTERN_CUSTOM"] = 255;
                return values;
            })();

            return OutputCommand;
        })();

        alarm.DiagnosticCommand = (function() {

            /**
             * Properties of a DiagnosticCommand.
             * @memberof esg.alarm
             * @interface IDiagnosticCommand
             * @property {esg.alarm.DiagnosticCommand.DiagAction|null} [action] DiagnosticCommand action
             * @property {number|null} [testMask] DiagnosticCommand testMask
             * @property {number|null} [logLines] DiagnosticCommand logLines
             */

            /**
             * Constructs a new DiagnosticCommand.
             * @memberof esg.alarm
             * @classdesc Represents a DiagnosticCommand.
             * @implements IDiagnosticCommand
             * @constructor
             * @param {esg.alarm.IDiagnosticCommand=} [properties] Properties to set
             */
            function DiagnosticCommand(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DiagnosticCommand action.
             * @member {esg.alarm.DiagnosticCommand.DiagAction} action
             * @memberof esg.alarm.DiagnosticCommand
             * @instance
             */
            DiagnosticCommand.prototype.action = 0;

            /**
             * DiagnosticCommand testMask.
             * @member {number} testMask
             * @memberof esg.alarm.DiagnosticCommand
             * @instance
             */
            DiagnosticCommand.prototype.testMask = 0;

            /**
             * DiagnosticCommand logLines.
             * @member {number} logLines
             * @memberof esg.alarm.DiagnosticCommand
             * @instance
             */
            DiagnosticCommand.prototype.logLines = 0;

            /**
             * Creates a new DiagnosticCommand instance using the specified properties.
             * @function create
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {esg.alarm.IDiagnosticCommand=} [properties] Properties to set
             * @returns {esg.alarm.DiagnosticCommand} DiagnosticCommand instance
             */
            DiagnosticCommand.create = function create(properties) {
                return new DiagnosticCommand(properties);
            };

            /**
             * Encodes the specified DiagnosticCommand message. Does not implicitly {@link esg.alarm.DiagnosticCommand.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {esg.alarm.IDiagnosticCommand} message DiagnosticCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiagnosticCommand.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
                if (message.testMask != null && Object.hasOwnProperty.call(message, "testMask"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.testMask);
                if (message.logLines != null && Object.hasOwnProperty.call(message, "logLines"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.logLines);
                return writer;
            };

            /**
             * Encodes the specified DiagnosticCommand message, length delimited. Does not implicitly {@link esg.alarm.DiagnosticCommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {esg.alarm.IDiagnosticCommand} message DiagnosticCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiagnosticCommand.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DiagnosticCommand message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.DiagnosticCommand} DiagnosticCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DiagnosticCommand.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.DiagnosticCommand();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.action = reader.int32();
                            break;
                        }
                    case 2: {
                            message.testMask = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.logLines = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DiagnosticCommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.DiagnosticCommand} DiagnosticCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DiagnosticCommand.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DiagnosticCommand message.
             * @function verify
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DiagnosticCommand.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.action != null && message.hasOwnProperty("action"))
                    switch (message.action) {
                    default:
                        return "action: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        break;
                    }
                if (message.testMask != null && message.hasOwnProperty("testMask"))
                    if (!$util.isInteger(message.testMask))
                        return "testMask: integer expected";
                if (message.logLines != null && message.hasOwnProperty("logLines"))
                    if (!$util.isInteger(message.logLines))
                        return "logLines: integer expected";
                return null;
            };

            /**
             * Creates a DiagnosticCommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.DiagnosticCommand} DiagnosticCommand
             */
            DiagnosticCommand.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.DiagnosticCommand)
                    return object;
                var message = new $root.esg.alarm.DiagnosticCommand();
                switch (object.action) {
                default:
                    if (typeof object.action === "number") {
                        message.action = object.action;
                        break;
                    }
                    break;
                case "DIAG_UNKNOWN":
                case 0:
                    message.action = 0;
                    break;
                case "DIAG_SELF_TEST":
                case 1:
                    message.action = 1;
                    break;
                case "DIAG_MEMORY_INFO":
                case 2:
                    message.action = 2;
                    break;
                case "DIAG_NETWORK_INFO":
                case 3:
                    message.action = 3;
                    break;
                case "DIAG_SENSOR_READ":
                case 4:
                    message.action = 4;
                    break;
                case "DIAG_LOG_DUMP":
                case 5:
                    message.action = 5;
                    break;
                case "DIAG_INOUT_READ":
                case 6:
                    message.action = 6;
                    break;
                }
                if (object.testMask != null)
                    message.testMask = object.testMask >>> 0;
                if (object.logLines != null)
                    message.logLines = object.logLines >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a DiagnosticCommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {esg.alarm.DiagnosticCommand} message DiagnosticCommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DiagnosticCommand.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.action = options.enums === String ? "DIAG_UNKNOWN" : 0;
                    object.testMask = 0;
                    object.logLines = 0;
                }
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = options.enums === String ? $root.esg.alarm.DiagnosticCommand.DiagAction[message.action] === undefined ? message.action : $root.esg.alarm.DiagnosticCommand.DiagAction[message.action] : message.action;
                if (message.testMask != null && message.hasOwnProperty("testMask"))
                    object.testMask = message.testMask;
                if (message.logLines != null && message.hasOwnProperty("logLines"))
                    object.logLines = message.logLines;
                return object;
            };

            /**
             * Converts this DiagnosticCommand to JSON.
             * @function toJSON
             * @memberof esg.alarm.DiagnosticCommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DiagnosticCommand.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DiagnosticCommand
             * @function getTypeUrl
             * @memberof esg.alarm.DiagnosticCommand
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DiagnosticCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.DiagnosticCommand";
            };

            /**
             * DiagAction enum.
             * @name esg.alarm.DiagnosticCommand.DiagAction
             * @enum {number}
             * @property {number} DIAG_UNKNOWN=0 DIAG_UNKNOWN value
             * @property {number} DIAG_SELF_TEST=1 DIAG_SELF_TEST value
             * @property {number} DIAG_MEMORY_INFO=2 DIAG_MEMORY_INFO value
             * @property {number} DIAG_NETWORK_INFO=3 DIAG_NETWORK_INFO value
             * @property {number} DIAG_SENSOR_READ=4 DIAG_SENSOR_READ value
             * @property {number} DIAG_LOG_DUMP=5 DIAG_LOG_DUMP value
             * @property {number} DIAG_INOUT_READ=6 DIAG_INOUT_READ value
             */
            DiagnosticCommand.DiagAction = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "DIAG_UNKNOWN"] = 0;
                values[valuesById[1] = "DIAG_SELF_TEST"] = 1;
                values[valuesById[2] = "DIAG_MEMORY_INFO"] = 2;
                values[valuesById[3] = "DIAG_NETWORK_INFO"] = 3;
                values[valuesById[4] = "DIAG_SENSOR_READ"] = 4;
                values[valuesById[5] = "DIAG_LOG_DUMP"] = 5;
                values[valuesById[6] = "DIAG_INOUT_READ"] = 6;
                return values;
            })();

            return DiagnosticCommand;
        })();

        alarm.OTACommand = (function() {

            /**
             * Properties of a OTACommand.
             * @memberof esg.alarm
             * @interface IOTACommand
             * @property {esg.alarm.OTACommand.OTAAction|null} [action] OTACommand action
             * @property {string|null} [url] OTACommand url
             * @property {string|null} [md5] OTACommand md5
             * @property {number|null} [size] OTACommand size
             */

            /**
             * Constructs a new OTACommand.
             * @memberof esg.alarm
             * @classdesc Represents a OTACommand.
             * @implements IOTACommand
             * @constructor
             * @param {esg.alarm.IOTACommand=} [properties] Properties to set
             */
            function OTACommand(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * OTACommand action.
             * @member {esg.alarm.OTACommand.OTAAction} action
             * @memberof esg.alarm.OTACommand
             * @instance
             */
            OTACommand.prototype.action = 0;

            /**
             * OTACommand url.
             * @member {string} url
             * @memberof esg.alarm.OTACommand
             * @instance
             */
            OTACommand.prototype.url = "";

            /**
             * OTACommand md5.
             * @member {string} md5
             * @memberof esg.alarm.OTACommand
             * @instance
             */
            OTACommand.prototype.md5 = "";

            /**
             * OTACommand size.
             * @member {number} size
             * @memberof esg.alarm.OTACommand
             * @instance
             */
            OTACommand.prototype.size = 0;

            /**
             * Creates a new OTACommand instance using the specified properties.
             * @function create
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {esg.alarm.IOTACommand=} [properties] Properties to set
             * @returns {esg.alarm.OTACommand} OTACommand instance
             */
            OTACommand.create = function create(properties) {
                return new OTACommand(properties);
            };

            /**
             * Encodes the specified OTACommand message. Does not implicitly {@link esg.alarm.OTACommand.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {esg.alarm.IOTACommand} message OTACommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OTACommand.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
                if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.url);
                if (message.md5 != null && Object.hasOwnProperty.call(message, "md5"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.md5);
                if (message.size != null && Object.hasOwnProperty.call(message, "size"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.size);
                return writer;
            };

            /**
             * Encodes the specified OTACommand message, length delimited. Does not implicitly {@link esg.alarm.OTACommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {esg.alarm.IOTACommand} message OTACommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            OTACommand.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a OTACommand message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.OTACommand} OTACommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OTACommand.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.OTACommand();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.action = reader.int32();
                            break;
                        }
                    case 2: {
                            message.url = reader.string();
                            break;
                        }
                    case 3: {
                            message.md5 = reader.string();
                            break;
                        }
                    case 4: {
                            message.size = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a OTACommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.OTACommand} OTACommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OTACommand.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a OTACommand message.
             * @function verify
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            OTACommand.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.action != null && message.hasOwnProperty("action"))
                    switch (message.action) {
                    default:
                        return "action: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    }
                if (message.url != null && message.hasOwnProperty("url"))
                    if (!$util.isString(message.url))
                        return "url: string expected";
                if (message.md5 != null && message.hasOwnProperty("md5"))
                    if (!$util.isString(message.md5))
                        return "md5: string expected";
                if (message.size != null && message.hasOwnProperty("size"))
                    if (!$util.isInteger(message.size))
                        return "size: integer expected";
                return null;
            };

            /**
             * Creates a OTACommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.OTACommand} OTACommand
             */
            OTACommand.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.OTACommand)
                    return object;
                var message = new $root.esg.alarm.OTACommand();
                switch (object.action) {
                default:
                    if (typeof object.action === "number") {
                        message.action = object.action;
                        break;
                    }
                    break;
                case "OTA_UNKNOWN":
                case 0:
                    message.action = 0;
                    break;
                case "OTA_CHECK_UPDATE":
                case 1:
                    message.action = 1;
                    break;
                case "OTA_START_UPDATE":
                case 2:
                    message.action = 2;
                    break;
                case "OTA_VALIDATE":
                case 3:
                    message.action = 3;
                    break;
                case "OTA_ROLLBACK":
                case 4:
                    message.action = 4;
                    break;
                case "OTA_GET_STATUS":
                case 5:
                    message.action = 5;
                    break;
                }
                if (object.url != null)
                    message.url = String(object.url);
                if (object.md5 != null)
                    message.md5 = String(object.md5);
                if (object.size != null)
                    message.size = object.size >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a OTACommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {esg.alarm.OTACommand} message OTACommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            OTACommand.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.action = options.enums === String ? "OTA_UNKNOWN" : 0;
                    object.url = "";
                    object.md5 = "";
                    object.size = 0;
                }
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = options.enums === String ? $root.esg.alarm.OTACommand.OTAAction[message.action] === undefined ? message.action : $root.esg.alarm.OTACommand.OTAAction[message.action] : message.action;
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.md5 != null && message.hasOwnProperty("md5"))
                    object.md5 = message.md5;
                if (message.size != null && message.hasOwnProperty("size"))
                    object.size = message.size;
                return object;
            };

            /**
             * Converts this OTACommand to JSON.
             * @function toJSON
             * @memberof esg.alarm.OTACommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            OTACommand.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for OTACommand
             * @function getTypeUrl
             * @memberof esg.alarm.OTACommand
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            OTACommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.OTACommand";
            };

            /**
             * OTAAction enum.
             * @name esg.alarm.OTACommand.OTAAction
             * @enum {number}
             * @property {number} OTA_UNKNOWN=0 OTA_UNKNOWN value
             * @property {number} OTA_CHECK_UPDATE=1 OTA_CHECK_UPDATE value
             * @property {number} OTA_START_UPDATE=2 OTA_START_UPDATE value
             * @property {number} OTA_VALIDATE=3 OTA_VALIDATE value
             * @property {number} OTA_ROLLBACK=4 OTA_ROLLBACK value
             * @property {number} OTA_GET_STATUS=5 OTA_GET_STATUS value
             */
            OTACommand.OTAAction = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "OTA_UNKNOWN"] = 0;
                values[valuesById[1] = "OTA_CHECK_UPDATE"] = 1;
                values[valuesById[2] = "OTA_START_UPDATE"] = 2;
                values[valuesById[3] = "OTA_VALIDATE"] = 3;
                values[valuesById[4] = "OTA_ROLLBACK"] = 4;
                values[valuesById[5] = "OTA_GET_STATUS"] = 5;
                return values;
            })();

            return OTACommand;
        })();

        alarm.ConfigReadCommand = (function() {

            /**
             * Properties of a ConfigReadCommand.
             * @memberof esg.alarm
             * @interface IConfigReadCommand
             * @property {esg.alarm.ConfigReadCommand.ReadType|null} [type] ConfigReadCommand type
             * @property {boolean|null} [includeSensitive] ConfigReadCommand includeSensitive
             */

            /**
             * Constructs a new ConfigReadCommand.
             * @memberof esg.alarm
             * @classdesc Represents a ConfigReadCommand.
             * @implements IConfigReadCommand
             * @constructor
             * @param {esg.alarm.IConfigReadCommand=} [properties] Properties to set
             */
            function ConfigReadCommand(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ConfigReadCommand type.
             * @member {esg.alarm.ConfigReadCommand.ReadType} type
             * @memberof esg.alarm.ConfigReadCommand
             * @instance
             */
            ConfigReadCommand.prototype.type = 0;

            /**
             * ConfigReadCommand includeSensitive.
             * @member {boolean} includeSensitive
             * @memberof esg.alarm.ConfigReadCommand
             * @instance
             */
            ConfigReadCommand.prototype.includeSensitive = false;

            /**
             * Creates a new ConfigReadCommand instance using the specified properties.
             * @function create
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {esg.alarm.IConfigReadCommand=} [properties] Properties to set
             * @returns {esg.alarm.ConfigReadCommand} ConfigReadCommand instance
             */
            ConfigReadCommand.create = function create(properties) {
                return new ConfigReadCommand(properties);
            };

            /**
             * Encodes the specified ConfigReadCommand message. Does not implicitly {@link esg.alarm.ConfigReadCommand.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {esg.alarm.IConfigReadCommand} message ConfigReadCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConfigReadCommand.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.includeSensitive != null && Object.hasOwnProperty.call(message, "includeSensitive"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.includeSensitive);
                return writer;
            };

            /**
             * Encodes the specified ConfigReadCommand message, length delimited. Does not implicitly {@link esg.alarm.ConfigReadCommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {esg.alarm.IConfigReadCommand} message ConfigReadCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ConfigReadCommand.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ConfigReadCommand message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.ConfigReadCommand} ConfigReadCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConfigReadCommand.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.ConfigReadCommand();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.includeSensitive = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ConfigReadCommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.ConfigReadCommand} ConfigReadCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ConfigReadCommand.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ConfigReadCommand message.
             * @function verify
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ConfigReadCommand.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        break;
                    }
                if (message.includeSensitive != null && message.hasOwnProperty("includeSensitive"))
                    if (typeof message.includeSensitive !== "boolean")
                        return "includeSensitive: boolean expected";
                return null;
            };

            /**
             * Creates a ConfigReadCommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.ConfigReadCommand} ConfigReadCommand
             */
            ConfigReadCommand.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.ConfigReadCommand)
                    return object;
                var message = new $root.esg.alarm.ConfigReadCommand();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "READ_UNKNOWN":
                case 0:
                    message.type = 0;
                    break;
                case "READ_WIFI":
                case 1:
                    message.type = 1;
                    break;
                case "READ_MQTT":
                case 2:
                    message.type = 2;
                    break;
                case "READ_DEVICE":
                case 3:
                    message.type = 3;
                    break;
                case "READ_LOCATION":
                case 4:
                    message.type = 4;
                    break;
                case "READ_NTP":
                case 5:
                    message.type = 5;
                    break;
                case "READ_BLE":
                case 6:
                    message.type = 6;
                    break;
                case "READ_ALL":
                case 7:
                    message.type = 7;
                    break;
                }
                if (object.includeSensitive != null)
                    message.includeSensitive = Boolean(object.includeSensitive);
                return message;
            };

            /**
             * Creates a plain object from a ConfigReadCommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {esg.alarm.ConfigReadCommand} message ConfigReadCommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ConfigReadCommand.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "READ_UNKNOWN" : 0;
                    object.includeSensitive = false;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.esg.alarm.ConfigReadCommand.ReadType[message.type] === undefined ? message.type : $root.esg.alarm.ConfigReadCommand.ReadType[message.type] : message.type;
                if (message.includeSensitive != null && message.hasOwnProperty("includeSensitive"))
                    object.includeSensitive = message.includeSensitive;
                return object;
            };

            /**
             * Converts this ConfigReadCommand to JSON.
             * @function toJSON
             * @memberof esg.alarm.ConfigReadCommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ConfigReadCommand.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ConfigReadCommand
             * @function getTypeUrl
             * @memberof esg.alarm.ConfigReadCommand
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ConfigReadCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.ConfigReadCommand";
            };

            /**
             * ReadType enum.
             * @name esg.alarm.ConfigReadCommand.ReadType
             * @enum {number}
             * @property {number} READ_UNKNOWN=0 READ_UNKNOWN value
             * @property {number} READ_WIFI=1 READ_WIFI value
             * @property {number} READ_MQTT=2 READ_MQTT value
             * @property {number} READ_DEVICE=3 READ_DEVICE value
             * @property {number} READ_LOCATION=4 READ_LOCATION value
             * @property {number} READ_NTP=5 READ_NTP value
             * @property {number} READ_BLE=6 READ_BLE value
             * @property {number} READ_ALL=7 READ_ALL value
             */
            ConfigReadCommand.ReadType = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "READ_UNKNOWN"] = 0;
                values[valuesById[1] = "READ_WIFI"] = 1;
                values[valuesById[2] = "READ_MQTT"] = 2;
                values[valuesById[3] = "READ_DEVICE"] = 3;
                values[valuesById[4] = "READ_LOCATION"] = 4;
                values[valuesById[5] = "READ_NTP"] = 5;
                values[valuesById[6] = "READ_BLE"] = 6;
                values[valuesById[7] = "READ_ALL"] = 7;
                return values;
            })();

            return ConfigReadCommand;
        })();

        alarm.CommandEnvelope = (function() {

            /**
             * Properties of a CommandEnvelope.
             * @memberof esg.alarm
             * @interface ICommandEnvelope
             * @property {number|null} [sequence] CommandEnvelope sequence
             * @property {number|null} [timestamp] CommandEnvelope timestamp
             * @property {string|null} [requestId] CommandEnvelope requestId
             * @property {number|null} [authLevel] CommandEnvelope authLevel
             * @property {esg.alarm.ISystemCommand|null} [system] CommandEnvelope system
             * @property {esg.alarm.IConfigCommand|null} [config] CommandEnvelope config
             * @property {esg.alarm.IOutputCommand|null} [output] CommandEnvelope output
             * @property {esg.alarm.IDiagnosticCommand|null} [diagnostic] CommandEnvelope diagnostic
             * @property {esg.alarm.IOTACommand|null} [ota] CommandEnvelope ota
             * @property {esg.alarm.IConfigReadCommand|null} [configRead] CommandEnvelope configRead
             */

            /**
             * Constructs a new CommandEnvelope.
             * @memberof esg.alarm
             * @classdesc Represents a CommandEnvelope.
             * @implements ICommandEnvelope
             * @constructor
             * @param {esg.alarm.ICommandEnvelope=} [properties] Properties to set
             */
            function CommandEnvelope(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CommandEnvelope sequence.
             * @member {number} sequence
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.sequence = 0;

            /**
             * CommandEnvelope timestamp.
             * @member {number} timestamp
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.timestamp = 0;

            /**
             * CommandEnvelope requestId.
             * @member {string} requestId
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.requestId = "";

            /**
             * CommandEnvelope authLevel.
             * @member {number} authLevel
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.authLevel = 0;

            /**
             * CommandEnvelope system.
             * @member {esg.alarm.ISystemCommand|null|undefined} system
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.system = null;

            /**
             * CommandEnvelope config.
             * @member {esg.alarm.IConfigCommand|null|undefined} config
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.config = null;

            /**
             * CommandEnvelope output.
             * @member {esg.alarm.IOutputCommand|null|undefined} output
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.output = null;

            /**
             * CommandEnvelope diagnostic.
             * @member {esg.alarm.IDiagnosticCommand|null|undefined} diagnostic
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.diagnostic = null;

            /**
             * CommandEnvelope ota.
             * @member {esg.alarm.IOTACommand|null|undefined} ota
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.ota = null;

            /**
             * CommandEnvelope configRead.
             * @member {esg.alarm.IConfigReadCommand|null|undefined} configRead
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            CommandEnvelope.prototype.configRead = null;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * CommandEnvelope command.
             * @member {"system"|"config"|"output"|"diagnostic"|"ota"|"configRead"|undefined} command
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             */
            Object.defineProperty(CommandEnvelope.prototype, "command", {
                get: $util.oneOfGetter($oneOfFields = ["system", "config", "output", "diagnostic", "ota", "configRead"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new CommandEnvelope instance using the specified properties.
             * @function create
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {esg.alarm.ICommandEnvelope=} [properties] Properties to set
             * @returns {esg.alarm.CommandEnvelope} CommandEnvelope instance
             */
            CommandEnvelope.create = function create(properties) {
                return new CommandEnvelope(properties);
            };

            /**
             * Encodes the specified CommandEnvelope message. Does not implicitly {@link esg.alarm.CommandEnvelope.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {esg.alarm.ICommandEnvelope} message CommandEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommandEnvelope.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sequence);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.timestamp);
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.requestId);
                if (message.authLevel != null && Object.hasOwnProperty.call(message, "authLevel"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.authLevel);
                if (message.system != null && Object.hasOwnProperty.call(message, "system"))
                    $root.esg.alarm.SystemCommand.encode(message.system, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.config != null && Object.hasOwnProperty.call(message, "config"))
                    $root.esg.alarm.ConfigCommand.encode(message.config, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.output != null && Object.hasOwnProperty.call(message, "output"))
                    $root.esg.alarm.OutputCommand.encode(message.output, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.diagnostic != null && Object.hasOwnProperty.call(message, "diagnostic"))
                    $root.esg.alarm.DiagnosticCommand.encode(message.diagnostic, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.ota != null && Object.hasOwnProperty.call(message, "ota"))
                    $root.esg.alarm.OTACommand.encode(message.ota, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                if (message.configRead != null && Object.hasOwnProperty.call(message, "configRead"))
                    $root.esg.alarm.ConfigReadCommand.encode(message.configRead, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CommandEnvelope message, length delimited. Does not implicitly {@link esg.alarm.CommandEnvelope.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {esg.alarm.ICommandEnvelope} message CommandEnvelope message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommandEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CommandEnvelope message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.CommandEnvelope} CommandEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommandEnvelope.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.CommandEnvelope();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.sequence = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.timestamp = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.requestId = reader.string();
                            break;
                        }
                    case 4: {
                            message.authLevel = reader.uint32();
                            break;
                        }
                    case 10: {
                            message.system = $root.esg.alarm.SystemCommand.decode(reader, reader.uint32());
                            break;
                        }
                    case 11: {
                            message.config = $root.esg.alarm.ConfigCommand.decode(reader, reader.uint32());
                            break;
                        }
                    case 12: {
                            message.output = $root.esg.alarm.OutputCommand.decode(reader, reader.uint32());
                            break;
                        }
                    case 13: {
                            message.diagnostic = $root.esg.alarm.DiagnosticCommand.decode(reader, reader.uint32());
                            break;
                        }
                    case 14: {
                            message.ota = $root.esg.alarm.OTACommand.decode(reader, reader.uint32());
                            break;
                        }
                    case 15: {
                            message.configRead = $root.esg.alarm.ConfigReadCommand.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CommandEnvelope message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.CommandEnvelope} CommandEnvelope
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommandEnvelope.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CommandEnvelope message.
             * @function verify
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CommandEnvelope.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    if (!$util.isInteger(message.sequence))
                        return "sequence: integer expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isInteger(message.timestamp))
                        return "timestamp: integer expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!$util.isString(message.requestId))
                        return "requestId: string expected";
                if (message.authLevel != null && message.hasOwnProperty("authLevel"))
                    if (!$util.isInteger(message.authLevel))
                        return "authLevel: integer expected";
                if (message.system != null && message.hasOwnProperty("system")) {
                    properties.command = 1;
                    {
                        var error = $root.esg.alarm.SystemCommand.verify(message.system);
                        if (error)
                            return "system." + error;
                    }
                }
                if (message.config != null && message.hasOwnProperty("config")) {
                    if (properties.command === 1)
                        return "command: multiple values";
                    properties.command = 1;
                    {
                        var error = $root.esg.alarm.ConfigCommand.verify(message.config);
                        if (error)
                            return "config." + error;
                    }
                }
                if (message.output != null && message.hasOwnProperty("output")) {
                    if (properties.command === 1)
                        return "command: multiple values";
                    properties.command = 1;
                    {
                        var error = $root.esg.alarm.OutputCommand.verify(message.output);
                        if (error)
                            return "output." + error;
                    }
                }
                if (message.diagnostic != null && message.hasOwnProperty("diagnostic")) {
                    if (properties.command === 1)
                        return "command: multiple values";
                    properties.command = 1;
                    {
                        var error = $root.esg.alarm.DiagnosticCommand.verify(message.diagnostic);
                        if (error)
                            return "diagnostic." + error;
                    }
                }
                if (message.ota != null && message.hasOwnProperty("ota")) {
                    if (properties.command === 1)
                        return "command: multiple values";
                    properties.command = 1;
                    {
                        var error = $root.esg.alarm.OTACommand.verify(message.ota);
                        if (error)
                            return "ota." + error;
                    }
                }
                if (message.configRead != null && message.hasOwnProperty("configRead")) {
                    if (properties.command === 1)
                        return "command: multiple values";
                    properties.command = 1;
                    {
                        var error = $root.esg.alarm.ConfigReadCommand.verify(message.configRead);
                        if (error)
                            return "configRead." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a CommandEnvelope message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.CommandEnvelope} CommandEnvelope
             */
            CommandEnvelope.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.CommandEnvelope)
                    return object;
                var message = new $root.esg.alarm.CommandEnvelope();
                if (object.sequence != null)
                    message.sequence = object.sequence >>> 0;
                if (object.timestamp != null)
                    message.timestamp = object.timestamp >>> 0;
                if (object.requestId != null)
                    message.requestId = String(object.requestId);
                if (object.authLevel != null)
                    message.authLevel = object.authLevel >>> 0;
                if (object.system != null) {
                    if (typeof object.system !== "object")
                        throw TypeError(".esg.alarm.CommandEnvelope.system: object expected");
                    message.system = $root.esg.alarm.SystemCommand.fromObject(object.system);
                }
                if (object.config != null) {
                    if (typeof object.config !== "object")
                        throw TypeError(".esg.alarm.CommandEnvelope.config: object expected");
                    message.config = $root.esg.alarm.ConfigCommand.fromObject(object.config);
                }
                if (object.output != null) {
                    if (typeof object.output !== "object")
                        throw TypeError(".esg.alarm.CommandEnvelope.output: object expected");
                    message.output = $root.esg.alarm.OutputCommand.fromObject(object.output);
                }
                if (object.diagnostic != null) {
                    if (typeof object.diagnostic !== "object")
                        throw TypeError(".esg.alarm.CommandEnvelope.diagnostic: object expected");
                    message.diagnostic = $root.esg.alarm.DiagnosticCommand.fromObject(object.diagnostic);
                }
                if (object.ota != null) {
                    if (typeof object.ota !== "object")
                        throw TypeError(".esg.alarm.CommandEnvelope.ota: object expected");
                    message.ota = $root.esg.alarm.OTACommand.fromObject(object.ota);
                }
                if (object.configRead != null) {
                    if (typeof object.configRead !== "object")
                        throw TypeError(".esg.alarm.CommandEnvelope.configRead: object expected");
                    message.configRead = $root.esg.alarm.ConfigReadCommand.fromObject(object.configRead);
                }
                return message;
            };

            /**
             * Creates a plain object from a CommandEnvelope message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {esg.alarm.CommandEnvelope} message CommandEnvelope
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CommandEnvelope.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.sequence = 0;
                    object.timestamp = 0;
                    object.requestId = "";
                    object.authLevel = 0;
                }
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    object.sequence = message.sequence;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = message.requestId;
                if (message.authLevel != null && message.hasOwnProperty("authLevel"))
                    object.authLevel = message.authLevel;
                if (message.system != null && message.hasOwnProperty("system")) {
                    object.system = $root.esg.alarm.SystemCommand.toObject(message.system, options);
                    if (options.oneofs)
                        object.command = "system";
                }
                if (message.config != null && message.hasOwnProperty("config")) {
                    object.config = $root.esg.alarm.ConfigCommand.toObject(message.config, options);
                    if (options.oneofs)
                        object.command = "config";
                }
                if (message.output != null && message.hasOwnProperty("output")) {
                    object.output = $root.esg.alarm.OutputCommand.toObject(message.output, options);
                    if (options.oneofs)
                        object.command = "output";
                }
                if (message.diagnostic != null && message.hasOwnProperty("diagnostic")) {
                    object.diagnostic = $root.esg.alarm.DiagnosticCommand.toObject(message.diagnostic, options);
                    if (options.oneofs)
                        object.command = "diagnostic";
                }
                if (message.ota != null && message.hasOwnProperty("ota")) {
                    object.ota = $root.esg.alarm.OTACommand.toObject(message.ota, options);
                    if (options.oneofs)
                        object.command = "ota";
                }
                if (message.configRead != null && message.hasOwnProperty("configRead")) {
                    object.configRead = $root.esg.alarm.ConfigReadCommand.toObject(message.configRead, options);
                    if (options.oneofs)
                        object.command = "configRead";
                }
                return object;
            };

            /**
             * Converts this CommandEnvelope to JSON.
             * @function toJSON
             * @memberof esg.alarm.CommandEnvelope
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CommandEnvelope.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CommandEnvelope
             * @function getTypeUrl
             * @memberof esg.alarm.CommandEnvelope
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CommandEnvelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.CommandEnvelope";
            };

            return CommandEnvelope;
        })();

        alarm.CommandResponse = (function() {

            /**
             * Properties of a CommandResponse.
             * @memberof esg.alarm
             * @interface ICommandResponse
             * @property {string|null} [requestId] CommandResponse requestId
             * @property {number|null} [timestamp] CommandResponse timestamp
             * @property {boolean|null} [success] CommandResponse success
             * @property {number|null} [errorCode] CommandResponse errorCode
             * @property {string|null} [message] CommandResponse message
             * @property {Uint8Array|null} [payload] CommandResponse payload
             */

            /**
             * Constructs a new CommandResponse.
             * @memberof esg.alarm
             * @classdesc Represents a CommandResponse.
             * @implements ICommandResponse
             * @constructor
             * @param {esg.alarm.ICommandResponse=} [properties] Properties to set
             */
            function CommandResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CommandResponse requestId.
             * @member {string} requestId
             * @memberof esg.alarm.CommandResponse
             * @instance
             */
            CommandResponse.prototype.requestId = "";

            /**
             * CommandResponse timestamp.
             * @member {number} timestamp
             * @memberof esg.alarm.CommandResponse
             * @instance
             */
            CommandResponse.prototype.timestamp = 0;

            /**
             * CommandResponse success.
             * @member {boolean} success
             * @memberof esg.alarm.CommandResponse
             * @instance
             */
            CommandResponse.prototype.success = false;

            /**
             * CommandResponse errorCode.
             * @member {number} errorCode
             * @memberof esg.alarm.CommandResponse
             * @instance
             */
            CommandResponse.prototype.errorCode = 0;

            /**
             * CommandResponse message.
             * @member {string} message
             * @memberof esg.alarm.CommandResponse
             * @instance
             */
            CommandResponse.prototype.message = "";

            /**
             * CommandResponse payload.
             * @member {Uint8Array} payload
             * @memberof esg.alarm.CommandResponse
             * @instance
             */
            CommandResponse.prototype.payload = $util.newBuffer([]);

            /**
             * Creates a new CommandResponse instance using the specified properties.
             * @function create
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {esg.alarm.ICommandResponse=} [properties] Properties to set
             * @returns {esg.alarm.CommandResponse} CommandResponse instance
             */
            CommandResponse.create = function create(properties) {
                return new CommandResponse(properties);
            };

            /**
             * Encodes the specified CommandResponse message. Does not implicitly {@link esg.alarm.CommandResponse.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {esg.alarm.ICommandResponse} message CommandResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommandResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.requestId);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.timestamp);
                if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.success);
                if (message.errorCode != null && Object.hasOwnProperty.call(message, "errorCode"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.errorCode);
                if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.message);
                if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
                    writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.payload);
                return writer;
            };

            /**
             * Encodes the specified CommandResponse message, length delimited. Does not implicitly {@link esg.alarm.CommandResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {esg.alarm.ICommandResponse} message CommandResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CommandResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CommandResponse message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.CommandResponse} CommandResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommandResponse.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.CommandResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.requestId = reader.string();
                            break;
                        }
                    case 2: {
                            message.timestamp = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.success = reader.bool();
                            break;
                        }
                    case 4: {
                            message.errorCode = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.message = reader.string();
                            break;
                        }
                    case 6: {
                            message.payload = reader.bytes();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CommandResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.CommandResponse} CommandResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CommandResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CommandResponse message.
             * @function verify
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CommandResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    if (!$util.isString(message.requestId))
                        return "requestId: string expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isInteger(message.timestamp))
                        return "timestamp: integer expected";
                if (message.success != null && message.hasOwnProperty("success"))
                    if (typeof message.success !== "boolean")
                        return "success: boolean expected";
                if (message.errorCode != null && message.hasOwnProperty("errorCode"))
                    if (!$util.isInteger(message.errorCode))
                        return "errorCode: integer expected";
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                if (message.payload != null && message.hasOwnProperty("payload"))
                    if (!(message.payload && typeof message.payload.length === "number" || $util.isString(message.payload)))
                        return "payload: buffer expected";
                return null;
            };

            /**
             * Creates a CommandResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.CommandResponse} CommandResponse
             */
            CommandResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.CommandResponse)
                    return object;
                var message = new $root.esg.alarm.CommandResponse();
                if (object.requestId != null)
                    message.requestId = String(object.requestId);
                if (object.timestamp != null)
                    message.timestamp = object.timestamp >>> 0;
                if (object.success != null)
                    message.success = Boolean(object.success);
                if (object.errorCode != null)
                    message.errorCode = object.errorCode >>> 0;
                if (object.message != null)
                    message.message = String(object.message);
                if (object.payload != null)
                    if (typeof object.payload === "string")
                        $util.base64.decode(object.payload, message.payload = $util.newBuffer($util.base64.length(object.payload)), 0);
                    else if (object.payload.length >= 0)
                        message.payload = object.payload;
                return message;
            };

            /**
             * Creates a plain object from a CommandResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {esg.alarm.CommandResponse} message CommandResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CommandResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.requestId = "";
                    object.timestamp = 0;
                    object.success = false;
                    object.errorCode = 0;
                    object.message = "";
                    if (options.bytes === String)
                        object.payload = "";
                    else {
                        object.payload = [];
                        if (options.bytes !== Array)
                            object.payload = $util.newBuffer(object.payload);
                    }
                }
                if (message.requestId != null && message.hasOwnProperty("requestId"))
                    object.requestId = message.requestId;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                if (message.success != null && message.hasOwnProperty("success"))
                    object.success = message.success;
                if (message.errorCode != null && message.hasOwnProperty("errorCode"))
                    object.errorCode = message.errorCode;
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                if (message.payload != null && message.hasOwnProperty("payload"))
                    object.payload = options.bytes === String ? $util.base64.encode(message.payload, 0, message.payload.length) : options.bytes === Array ? Array.prototype.slice.call(message.payload) : message.payload;
                return object;
            };

            /**
             * Converts this CommandResponse to JSON.
             * @function toJSON
             * @memberof esg.alarm.CommandResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CommandResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CommandResponse
             * @function getTypeUrl
             * @memberof esg.alarm.CommandResponse
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CommandResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.CommandResponse";
            };

            return CommandResponse;
        })();

        alarm.LastWillMessage = (function() {

            /**
             * Properties of a LastWillMessage.
             * @memberof esg.alarm
             * @interface ILastWillMessage
             * @property {number|null} [sequence] LastWillMessage sequence
             * @property {number|null} [timestamp] LastWillMessage timestamp
             * @property {number|null} [deviceDbId] LastWillMessage deviceDbId
             * @property {number|null} [uptimeAtConnect] LastWillMessage uptimeAtConnect
             * @property {string|null} [firmware] LastWillMessage firmware
             * @property {number|null} [ipAddress] LastWillMessage ipAddress
             * @property {number|null} [rssi] LastWillMessage rssi
             * @property {string|null} [hostname] LastWillMessage hostname
             */

            /**
             * Constructs a new LastWillMessage.
             * @memberof esg.alarm
             * @classdesc Represents a LastWillMessage.
             * @implements ILastWillMessage
             * @constructor
             * @param {esg.alarm.ILastWillMessage=} [properties] Properties to set
             */
            function LastWillMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LastWillMessage sequence.
             * @member {number} sequence
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.sequence = 0;

            /**
             * LastWillMessage timestamp.
             * @member {number} timestamp
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.timestamp = 0;

            /**
             * LastWillMessage deviceDbId.
             * @member {number} deviceDbId
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.deviceDbId = 0;

            /**
             * LastWillMessage uptimeAtConnect.
             * @member {number} uptimeAtConnect
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.uptimeAtConnect = 0;

            /**
             * LastWillMessage firmware.
             * @member {string} firmware
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.firmware = "";

            /**
             * LastWillMessage ipAddress.
             * @member {number} ipAddress
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.ipAddress = 0;

            /**
             * LastWillMessage rssi.
             * @member {number} rssi
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.rssi = 0;

            /**
             * LastWillMessage hostname.
             * @member {string} hostname
             * @memberof esg.alarm.LastWillMessage
             * @instance
             */
            LastWillMessage.prototype.hostname = "";

            /**
             * Creates a new LastWillMessage instance using the specified properties.
             * @function create
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {esg.alarm.ILastWillMessage=} [properties] Properties to set
             * @returns {esg.alarm.LastWillMessage} LastWillMessage instance
             */
            LastWillMessage.create = function create(properties) {
                return new LastWillMessage(properties);
            };

            /**
             * Encodes the specified LastWillMessage message. Does not implicitly {@link esg.alarm.LastWillMessage.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {esg.alarm.ILastWillMessage} message LastWillMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LastWillMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sequence);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.timestamp);
                if (message.deviceDbId != null && Object.hasOwnProperty.call(message, "deviceDbId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.deviceDbId);
                if (message.uptimeAtConnect != null && Object.hasOwnProperty.call(message, "uptimeAtConnect"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.uptimeAtConnect);
                if (message.firmware != null && Object.hasOwnProperty.call(message, "firmware"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.firmware);
                if (message.ipAddress != null && Object.hasOwnProperty.call(message, "ipAddress"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.ipAddress);
                if (message.rssi != null && Object.hasOwnProperty.call(message, "rssi"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.rssi);
                if (message.hostname != null && Object.hasOwnProperty.call(message, "hostname"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.hostname);
                return writer;
            };

            /**
             * Encodes the specified LastWillMessage message, length delimited. Does not implicitly {@link esg.alarm.LastWillMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {esg.alarm.ILastWillMessage} message LastWillMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LastWillMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LastWillMessage message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.LastWillMessage} LastWillMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LastWillMessage.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.LastWillMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.sequence = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.timestamp = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.deviceDbId = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.uptimeAtConnect = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.firmware = reader.string();
                            break;
                        }
                    case 6: {
                            message.ipAddress = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.rssi = reader.int32();
                            break;
                        }
                    case 8: {
                            message.hostname = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a LastWillMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.LastWillMessage} LastWillMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LastWillMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LastWillMessage message.
             * @function verify
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LastWillMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    if (!$util.isInteger(message.sequence))
                        return "sequence: integer expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isInteger(message.timestamp))
                        return "timestamp: integer expected";
                if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
                    if (!$util.isInteger(message.deviceDbId))
                        return "deviceDbId: integer expected";
                if (message.uptimeAtConnect != null && message.hasOwnProperty("uptimeAtConnect"))
                    if (!$util.isInteger(message.uptimeAtConnect))
                        return "uptimeAtConnect: integer expected";
                if (message.firmware != null && message.hasOwnProperty("firmware"))
                    if (!$util.isString(message.firmware))
                        return "firmware: string expected";
                if (message.ipAddress != null && message.hasOwnProperty("ipAddress"))
                    if (!$util.isInteger(message.ipAddress))
                        return "ipAddress: integer expected";
                if (message.rssi != null && message.hasOwnProperty("rssi"))
                    if (!$util.isInteger(message.rssi))
                        return "rssi: integer expected";
                if (message.hostname != null && message.hasOwnProperty("hostname"))
                    if (!$util.isString(message.hostname))
                        return "hostname: string expected";
                return null;
            };

            /**
             * Creates a LastWillMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.LastWillMessage} LastWillMessage
             */
            LastWillMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.LastWillMessage)
                    return object;
                var message = new $root.esg.alarm.LastWillMessage();
                if (object.sequence != null)
                    message.sequence = object.sequence >>> 0;
                if (object.timestamp != null)
                    message.timestamp = object.timestamp >>> 0;
                if (object.deviceDbId != null)
                    message.deviceDbId = object.deviceDbId >>> 0;
                if (object.uptimeAtConnect != null)
                    message.uptimeAtConnect = object.uptimeAtConnect >>> 0;
                if (object.firmware != null)
                    message.firmware = String(object.firmware);
                if (object.ipAddress != null)
                    message.ipAddress = object.ipAddress >>> 0;
                if (object.rssi != null)
                    message.rssi = object.rssi | 0;
                if (object.hostname != null)
                    message.hostname = String(object.hostname);
                return message;
            };

            /**
             * Creates a plain object from a LastWillMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {esg.alarm.LastWillMessage} message LastWillMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LastWillMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.sequence = 0;
                    object.timestamp = 0;
                    object.deviceDbId = 0;
                    object.uptimeAtConnect = 0;
                    object.firmware = "";
                    object.ipAddress = 0;
                    object.rssi = 0;
                    object.hostname = "";
                }
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    object.sequence = message.sequence;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
                    object.deviceDbId = message.deviceDbId;
                if (message.uptimeAtConnect != null && message.hasOwnProperty("uptimeAtConnect"))
                    object.uptimeAtConnect = message.uptimeAtConnect;
                if (message.firmware != null && message.hasOwnProperty("firmware"))
                    object.firmware = message.firmware;
                if (message.ipAddress != null && message.hasOwnProperty("ipAddress"))
                    object.ipAddress = message.ipAddress;
                if (message.rssi != null && message.hasOwnProperty("rssi"))
                    object.rssi = message.rssi;
                if (message.hostname != null && message.hasOwnProperty("hostname"))
                    object.hostname = message.hostname;
                return object;
            };

            /**
             * Converts this LastWillMessage to JSON.
             * @function toJSON
             * @memberof esg.alarm.LastWillMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LastWillMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LastWillMessage
             * @function getTypeUrl
             * @memberof esg.alarm.LastWillMessage
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LastWillMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.LastWillMessage";
            };

            return LastWillMessage;
        })();

        /**
         * DeviceState enum.
         * @name esg.alarm.DeviceState
         * @enum {number}
         * @property {number} STATE_BOOT=0 STATE_BOOT value
         * @property {number} STATE_INIT=1 STATE_INIT value
         * @property {number} STATE_CONNECTING=2 STATE_CONNECTING value
         * @property {number} STATE_NORMAL=3 STATE_NORMAL value
         * @property {number} STATE_ALARM=4 STATE_ALARM value
         * @property {number} STATE_MAINTENANCE=5 STATE_MAINTENANCE value
         * @property {number} STATE_ERROR=6 STATE_ERROR value
         * @property {number} STATE_CRITICAL=7 STATE_CRITICAL value
         */
        alarm.DeviceState = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "STATE_BOOT"] = 0;
            values[valuesById[1] = "STATE_INIT"] = 1;
            values[valuesById[2] = "STATE_CONNECTING"] = 2;
            values[valuesById[3] = "STATE_NORMAL"] = 3;
            values[valuesById[4] = "STATE_ALARM"] = 4;
            values[valuesById[5] = "STATE_MAINTENANCE"] = 5;
            values[valuesById[6] = "STATE_ERROR"] = 6;
            values[valuesById[7] = "STATE_CRITICAL"] = 7;
            return values;
        })();

        /**
         * NetworkInterface enum.
         * @name esg.alarm.NetworkInterface
         * @enum {number}
         * @property {number} NETWORK_WIFI=0 NETWORK_WIFI value
         * @property {number} NETWORK_ETHERNET=1 NETWORK_ETHERNET value
         * @property {number} NETWORK_NONE=2 NETWORK_NONE value
         */
        alarm.NetworkInterface = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NETWORK_WIFI"] = 0;
            values[valuesById[1] = "NETWORK_ETHERNET"] = 1;
            values[valuesById[2] = "NETWORK_NONE"] = 2;
            return values;
        })();

        alarm.StatusMessage = (function() {

            /**
             * Properties of a StatusMessage.
             * @memberof esg.alarm
             * @interface IStatusMessage
             * @property {number|null} [sequence] StatusMessage sequence
             * @property {number|null} [timestamp] StatusMessage timestamp
             * @property {number|null} [deviceDbId] StatusMessage deviceDbId
             * @property {esg.alarm.DeviceState|null} [state] StatusMessage state
             * @property {number|null} [stateDuration] StatusMessage stateDuration
             * @property {number|null} [uptime] StatusMessage uptime
             * @property {number|null} [bootCount] StatusMessage bootCount
             * @property {number|null} [freeHeap] StatusMessage freeHeap
             * @property {number|null} [minHeap] StatusMessage minHeap
             * @property {string|null} [firmware] StatusMessage firmware
             * @property {esg.alarm.NetworkInterface|null} [network] StatusMessage network
             * @property {boolean|null} [connected] StatusMessage connected
             * @property {boolean|null} [hasIp] StatusMessage hasIp
             * @property {number|null} [rssi] StatusMessage rssi
             * @property {number|null} [ipAddress] StatusMessage ipAddress
             * @property {Uint8Array|null} [macAddress] StatusMessage macAddress
             * @property {boolean|null} [mqttConnected] StatusMessage mqttConnected
             * @property {boolean|null} [ntpSynced] StatusMessage ntpSynced
             * @property {number|Long|null} [lastNtpSync] StatusMessage lastNtpSync
             * @property {boolean|null} [panic1] StatusMessage panic1
             * @property {boolean|null} [panic2] StatusMessage panic2
             * @property {boolean|null} [boxSw] StatusMessage boxSw
             * @property {boolean|null} [siren] StatusMessage siren
             * @property {boolean|null} [turret] StatusMessage turret
             * @property {number|null} [panic1Count] StatusMessage panic1Count
             * @property {number|null} [panic2Count] StatusMessage panic2Count
             * @property {number|null} [tamperCount] StatusMessage tamperCount
             * @property {number|null} [wifiDisconnects] StatusMessage wifiDisconnects
             * @property {number|null} [mqttDisconnects] StatusMessage mqttDisconnects
             * @property {number|null} [temperature] StatusMessage temperature
             * @property {number|null} [humidity] StatusMessage humidity
             * @property {string|null} [country] StatusMessage country
             * @property {number|null} [zone] StatusMessage zone
             * @property {number|null} [latitude] StatusMessage latitude
             * @property {number|null} [longitude] StatusMessage longitude
             * @property {number|null} [errorFlags] StatusMessage errorFlags
             * @property {number|null} [errorCount] StatusMessage errorCount
             * @property {number|null} [partition] StatusMessage partition
             * @property {boolean|null} [otaValidated] StatusMessage otaValidated
             */

            /**
             * Constructs a new StatusMessage.
             * @memberof esg.alarm
             * @classdesc Represents a StatusMessage.
             * @implements IStatusMessage
             * @constructor
             * @param {esg.alarm.IStatusMessage=} [properties] Properties to set
             */
            function StatusMessage(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StatusMessage sequence.
             * @member {number} sequence
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.sequence = 0;

            /**
             * StatusMessage timestamp.
             * @member {number} timestamp
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.timestamp = 0;

            /**
             * StatusMessage deviceDbId.
             * @member {number} deviceDbId
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.deviceDbId = 0;

            /**
             * StatusMessage state.
             * @member {esg.alarm.DeviceState} state
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.state = 0;

            /**
             * StatusMessage stateDuration.
             * @member {number} stateDuration
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.stateDuration = 0;

            /**
             * StatusMessage uptime.
             * @member {number} uptime
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.uptime = 0;

            /**
             * StatusMessage bootCount.
             * @member {number} bootCount
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.bootCount = 0;

            /**
             * StatusMessage freeHeap.
             * @member {number} freeHeap
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.freeHeap = 0;

            /**
             * StatusMessage minHeap.
             * @member {number} minHeap
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.minHeap = 0;

            /**
             * StatusMessage firmware.
             * @member {string} firmware
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.firmware = "";

            /**
             * StatusMessage network.
             * @member {esg.alarm.NetworkInterface} network
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.network = 0;

            /**
             * StatusMessage connected.
             * @member {boolean} connected
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.connected = false;

            /**
             * StatusMessage hasIp.
             * @member {boolean} hasIp
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.hasIp = false;

            /**
             * StatusMessage rssi.
             * @member {number} rssi
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.rssi = 0;

            /**
             * StatusMessage ipAddress.
             * @member {number} ipAddress
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.ipAddress = 0;

            /**
             * StatusMessage macAddress.
             * @member {Uint8Array} macAddress
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.macAddress = $util.newBuffer([]);

            /**
             * StatusMessage mqttConnected.
             * @member {boolean} mqttConnected
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.mqttConnected = false;

            /**
             * StatusMessage ntpSynced.
             * @member {boolean} ntpSynced
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.ntpSynced = false;

            /**
             * StatusMessage lastNtpSync.
             * @member {number|Long} lastNtpSync
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.lastNtpSync = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * StatusMessage panic1.
             * @member {boolean} panic1
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.panic1 = false;

            /**
             * StatusMessage panic2.
             * @member {boolean} panic2
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.panic2 = false;

            /**
             * StatusMessage boxSw.
             * @member {boolean} boxSw
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.boxSw = false;

            /**
             * StatusMessage siren.
             * @member {boolean} siren
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.siren = false;

            /**
             * StatusMessage turret.
             * @member {boolean} turret
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.turret = false;

            /**
             * StatusMessage panic1Count.
             * @member {number} panic1Count
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.panic1Count = 0;

            /**
             * StatusMessage panic2Count.
             * @member {number} panic2Count
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.panic2Count = 0;

            /**
             * StatusMessage tamperCount.
             * @member {number} tamperCount
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.tamperCount = 0;

            /**
             * StatusMessage wifiDisconnects.
             * @member {number} wifiDisconnects
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.wifiDisconnects = 0;

            /**
             * StatusMessage mqttDisconnects.
             * @member {number} mqttDisconnects
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.mqttDisconnects = 0;

            /**
             * StatusMessage temperature.
             * @member {number} temperature
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.temperature = 0;

            /**
             * StatusMessage humidity.
             * @member {number} humidity
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.humidity = 0;

            /**
             * StatusMessage country.
             * @member {string} country
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.country = "";

            /**
             * StatusMessage zone.
             * @member {number} zone
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.zone = 0;

            /**
             * StatusMessage latitude.
             * @member {number} latitude
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.latitude = 0;

            /**
             * StatusMessage longitude.
             * @member {number} longitude
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.longitude = 0;

            /**
             * StatusMessage errorFlags.
             * @member {number} errorFlags
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.errorFlags = 0;

            /**
             * StatusMessage errorCount.
             * @member {number} errorCount
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.errorCount = 0;

            /**
             * StatusMessage partition.
             * @member {number} partition
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.partition = 0;

            /**
             * StatusMessage otaValidated.
             * @member {boolean} otaValidated
             * @memberof esg.alarm.StatusMessage
             * @instance
             */
            StatusMessage.prototype.otaValidated = false;

            /**
             * Creates a new StatusMessage instance using the specified properties.
             * @function create
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {esg.alarm.IStatusMessage=} [properties] Properties to set
             * @returns {esg.alarm.StatusMessage} StatusMessage instance
             */
            StatusMessage.create = function create(properties) {
                return new StatusMessage(properties);
            };

            /**
             * Encodes the specified StatusMessage message. Does not implicitly {@link esg.alarm.StatusMessage.verify|verify} messages.
             * @function encode
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {esg.alarm.IStatusMessage} message StatusMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StatusMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sequence != null && Object.hasOwnProperty.call(message, "sequence"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sequence);
                if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.timestamp);
                if (message.deviceDbId != null && Object.hasOwnProperty.call(message, "deviceDbId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.deviceDbId);
                if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.state);
                if (message.stateDuration != null && Object.hasOwnProperty.call(message, "stateDuration"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.stateDuration);
                if (message.uptime != null && Object.hasOwnProperty.call(message, "uptime"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.uptime);
                if (message.bootCount != null && Object.hasOwnProperty.call(message, "bootCount"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.bootCount);
                if (message.freeHeap != null && Object.hasOwnProperty.call(message, "freeHeap"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.freeHeap);
                if (message.minHeap != null && Object.hasOwnProperty.call(message, "minHeap"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.minHeap);
                if (message.firmware != null && Object.hasOwnProperty.call(message, "firmware"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.firmware);
                if (message.network != null && Object.hasOwnProperty.call(message, "network"))
                    writer.uint32(/* id 11, wireType 0 =*/88).int32(message.network);
                if (message.connected != null && Object.hasOwnProperty.call(message, "connected"))
                    writer.uint32(/* id 12, wireType 0 =*/96).bool(message.connected);
                if (message.hasIp != null && Object.hasOwnProperty.call(message, "hasIp"))
                    writer.uint32(/* id 13, wireType 0 =*/104).bool(message.hasIp);
                if (message.rssi != null && Object.hasOwnProperty.call(message, "rssi"))
                    writer.uint32(/* id 14, wireType 0 =*/112).int32(message.rssi);
                if (message.ipAddress != null && Object.hasOwnProperty.call(message, "ipAddress"))
                    writer.uint32(/* id 15, wireType 0 =*/120).uint32(message.ipAddress);
                if (message.macAddress != null && Object.hasOwnProperty.call(message, "macAddress"))
                    writer.uint32(/* id 16, wireType 2 =*/130).bytes(message.macAddress);
                if (message.mqttConnected != null && Object.hasOwnProperty.call(message, "mqttConnected"))
                    writer.uint32(/* id 17, wireType 0 =*/136).bool(message.mqttConnected);
                if (message.ntpSynced != null && Object.hasOwnProperty.call(message, "ntpSynced"))
                    writer.uint32(/* id 18, wireType 0 =*/144).bool(message.ntpSynced);
                if (message.lastNtpSync != null && Object.hasOwnProperty.call(message, "lastNtpSync"))
                    writer.uint32(/* id 19, wireType 0 =*/152).int64(message.lastNtpSync);
                if (message.panic1 != null && Object.hasOwnProperty.call(message, "panic1"))
                    writer.uint32(/* id 20, wireType 0 =*/160).bool(message.panic1);
                if (message.panic2 != null && Object.hasOwnProperty.call(message, "panic2"))
                    writer.uint32(/* id 21, wireType 0 =*/168).bool(message.panic2);
                if (message.boxSw != null && Object.hasOwnProperty.call(message, "boxSw"))
                    writer.uint32(/* id 22, wireType 0 =*/176).bool(message.boxSw);
                if (message.siren != null && Object.hasOwnProperty.call(message, "siren"))
                    writer.uint32(/* id 23, wireType 0 =*/184).bool(message.siren);
                if (message.turret != null && Object.hasOwnProperty.call(message, "turret"))
                    writer.uint32(/* id 24, wireType 0 =*/192).bool(message.turret);
                if (message.panic1Count != null && Object.hasOwnProperty.call(message, "panic1Count"))
                    writer.uint32(/* id 25, wireType 0 =*/200).uint32(message.panic1Count);
                if (message.panic2Count != null && Object.hasOwnProperty.call(message, "panic2Count"))
                    writer.uint32(/* id 26, wireType 0 =*/208).uint32(message.panic2Count);
                if (message.tamperCount != null && Object.hasOwnProperty.call(message, "tamperCount"))
                    writer.uint32(/* id 27, wireType 0 =*/216).uint32(message.tamperCount);
                if (message.wifiDisconnects != null && Object.hasOwnProperty.call(message, "wifiDisconnects"))
                    writer.uint32(/* id 28, wireType 0 =*/224).uint32(message.wifiDisconnects);
                if (message.mqttDisconnects != null && Object.hasOwnProperty.call(message, "mqttDisconnects"))
                    writer.uint32(/* id 29, wireType 0 =*/232).uint32(message.mqttDisconnects);
                if (message.temperature != null && Object.hasOwnProperty.call(message, "temperature"))
                    writer.uint32(/* id 30, wireType 5 =*/245).float(message.temperature);
                if (message.humidity != null && Object.hasOwnProperty.call(message, "humidity"))
                    writer.uint32(/* id 31, wireType 5 =*/253).float(message.humidity);
                if (message.country != null && Object.hasOwnProperty.call(message, "country"))
                    writer.uint32(/* id 32, wireType 2 =*/258).string(message.country);
                if (message.zone != null && Object.hasOwnProperty.call(message, "zone"))
                    writer.uint32(/* id 33, wireType 0 =*/264).uint32(message.zone);
                if (message.latitude != null && Object.hasOwnProperty.call(message, "latitude"))
                    writer.uint32(/* id 34, wireType 5 =*/277).float(message.latitude);
                if (message.longitude != null && Object.hasOwnProperty.call(message, "longitude"))
                    writer.uint32(/* id 35, wireType 5 =*/285).float(message.longitude);
                if (message.errorFlags != null && Object.hasOwnProperty.call(message, "errorFlags"))
                    writer.uint32(/* id 36, wireType 0 =*/288).uint32(message.errorFlags);
                if (message.errorCount != null && Object.hasOwnProperty.call(message, "errorCount"))
                    writer.uint32(/* id 37, wireType 0 =*/296).uint32(message.errorCount);
                if (message.partition != null && Object.hasOwnProperty.call(message, "partition"))
                    writer.uint32(/* id 38, wireType 0 =*/304).uint32(message.partition);
                if (message.otaValidated != null && Object.hasOwnProperty.call(message, "otaValidated"))
                    writer.uint32(/* id 39, wireType 0 =*/312).bool(message.otaValidated);
                return writer;
            };

            /**
             * Encodes the specified StatusMessage message, length delimited. Does not implicitly {@link esg.alarm.StatusMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {esg.alarm.IStatusMessage} message StatusMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StatusMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StatusMessage message from the specified reader or buffer.
             * @function decode
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {esg.alarm.StatusMessage} StatusMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StatusMessage.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.esg.alarm.StatusMessage();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.sequence = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.timestamp = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.deviceDbId = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.state = reader.int32();
                            break;
                        }
                    case 5: {
                            message.stateDuration = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.uptime = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.bootCount = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.freeHeap = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.minHeap = reader.uint32();
                            break;
                        }
                    case 10: {
                            message.firmware = reader.string();
                            break;
                        }
                    case 11: {
                            message.network = reader.int32();
                            break;
                        }
                    case 12: {
                            message.connected = reader.bool();
                            break;
                        }
                    case 13: {
                            message.hasIp = reader.bool();
                            break;
                        }
                    case 14: {
                            message.rssi = reader.int32();
                            break;
                        }
                    case 15: {
                            message.ipAddress = reader.uint32();
                            break;
                        }
                    case 16: {
                            message.macAddress = reader.bytes();
                            break;
                        }
                    case 17: {
                            message.mqttConnected = reader.bool();
                            break;
                        }
                    case 18: {
                            message.ntpSynced = reader.bool();
                            break;
                        }
                    case 19: {
                            message.lastNtpSync = reader.int64();
                            break;
                        }
                    case 20: {
                            message.panic1 = reader.bool();
                            break;
                        }
                    case 21: {
                            message.panic2 = reader.bool();
                            break;
                        }
                    case 22: {
                            message.boxSw = reader.bool();
                            break;
                        }
                    case 23: {
                            message.siren = reader.bool();
                            break;
                        }
                    case 24: {
                            message.turret = reader.bool();
                            break;
                        }
                    case 25: {
                            message.panic1Count = reader.uint32();
                            break;
                        }
                    case 26: {
                            message.panic2Count = reader.uint32();
                            break;
                        }
                    case 27: {
                            message.tamperCount = reader.uint32();
                            break;
                        }
                    case 28: {
                            message.wifiDisconnects = reader.uint32();
                            break;
                        }
                    case 29: {
                            message.mqttDisconnects = reader.uint32();
                            break;
                        }
                    case 30: {
                            message.temperature = reader.float();
                            break;
                        }
                    case 31: {
                            message.humidity = reader.float();
                            break;
                        }
                    case 32: {
                            message.country = reader.string();
                            break;
                        }
                    case 33: {
                            message.zone = reader.uint32();
                            break;
                        }
                    case 34: {
                            message.latitude = reader.float();
                            break;
                        }
                    case 35: {
                            message.longitude = reader.float();
                            break;
                        }
                    case 36: {
                            message.errorFlags = reader.uint32();
                            break;
                        }
                    case 37: {
                            message.errorCount = reader.uint32();
                            break;
                        }
                    case 38: {
                            message.partition = reader.uint32();
                            break;
                        }
                    case 39: {
                            message.otaValidated = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a StatusMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {esg.alarm.StatusMessage} StatusMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StatusMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StatusMessage message.
             * @function verify
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StatusMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    if (!$util.isInteger(message.sequence))
                        return "sequence: integer expected";
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    if (!$util.isInteger(message.timestamp))
                        return "timestamp: integer expected";
                if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
                    if (!$util.isInteger(message.deviceDbId))
                        return "deviceDbId: integer expected";
                if (message.state != null && message.hasOwnProperty("state"))
                    switch (message.state) {
                    default:
                        return "state: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        break;
                    }
                if (message.stateDuration != null && message.hasOwnProperty("stateDuration"))
                    if (!$util.isInteger(message.stateDuration))
                        return "stateDuration: integer expected";
                if (message.uptime != null && message.hasOwnProperty("uptime"))
                    if (!$util.isInteger(message.uptime))
                        return "uptime: integer expected";
                if (message.bootCount != null && message.hasOwnProperty("bootCount"))
                    if (!$util.isInteger(message.bootCount))
                        return "bootCount: integer expected";
                if (message.freeHeap != null && message.hasOwnProperty("freeHeap"))
                    if (!$util.isInteger(message.freeHeap))
                        return "freeHeap: integer expected";
                if (message.minHeap != null && message.hasOwnProperty("minHeap"))
                    if (!$util.isInteger(message.minHeap))
                        return "minHeap: integer expected";
                if (message.firmware != null && message.hasOwnProperty("firmware"))
                    if (!$util.isString(message.firmware))
                        return "firmware: string expected";
                if (message.network != null && message.hasOwnProperty("network"))
                    switch (message.network) {
                    default:
                        return "network: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.connected != null && message.hasOwnProperty("connected"))
                    if (typeof message.connected !== "boolean")
                        return "connected: boolean expected";
                if (message.hasIp != null && message.hasOwnProperty("hasIp"))
                    if (typeof message.hasIp !== "boolean")
                        return "hasIp: boolean expected";
                if (message.rssi != null && message.hasOwnProperty("rssi"))
                    if (!$util.isInteger(message.rssi))
                        return "rssi: integer expected";
                if (message.ipAddress != null && message.hasOwnProperty("ipAddress"))
                    if (!$util.isInteger(message.ipAddress))
                        return "ipAddress: integer expected";
                if (message.macAddress != null && message.hasOwnProperty("macAddress"))
                    if (!(message.macAddress && typeof message.macAddress.length === "number" || $util.isString(message.macAddress)))
                        return "macAddress: buffer expected";
                if (message.mqttConnected != null && message.hasOwnProperty("mqttConnected"))
                    if (typeof message.mqttConnected !== "boolean")
                        return "mqttConnected: boolean expected";
                if (message.ntpSynced != null && message.hasOwnProperty("ntpSynced"))
                    if (typeof message.ntpSynced !== "boolean")
                        return "ntpSynced: boolean expected";
                if (message.lastNtpSync != null && message.hasOwnProperty("lastNtpSync"))
                    if (!$util.isInteger(message.lastNtpSync) && !(message.lastNtpSync && $util.isInteger(message.lastNtpSync.low) && $util.isInteger(message.lastNtpSync.high)))
                        return "lastNtpSync: integer|Long expected";
                if (message.panic1 != null && message.hasOwnProperty("panic1"))
                    if (typeof message.panic1 !== "boolean")
                        return "panic1: boolean expected";
                if (message.panic2 != null && message.hasOwnProperty("panic2"))
                    if (typeof message.panic2 !== "boolean")
                        return "panic2: boolean expected";
                if (message.boxSw != null && message.hasOwnProperty("boxSw"))
                    if (typeof message.boxSw !== "boolean")
                        return "boxSw: boolean expected";
                if (message.siren != null && message.hasOwnProperty("siren"))
                    if (typeof message.siren !== "boolean")
                        return "siren: boolean expected";
                if (message.turret != null && message.hasOwnProperty("turret"))
                    if (typeof message.turret !== "boolean")
                        return "turret: boolean expected";
                if (message.panic1Count != null && message.hasOwnProperty("panic1Count"))
                    if (!$util.isInteger(message.panic1Count))
                        return "panic1Count: integer expected";
                if (message.panic2Count != null && message.hasOwnProperty("panic2Count"))
                    if (!$util.isInteger(message.panic2Count))
                        return "panic2Count: integer expected";
                if (message.tamperCount != null && message.hasOwnProperty("tamperCount"))
                    if (!$util.isInteger(message.tamperCount))
                        return "tamperCount: integer expected";
                if (message.wifiDisconnects != null && message.hasOwnProperty("wifiDisconnects"))
                    if (!$util.isInteger(message.wifiDisconnects))
                        return "wifiDisconnects: integer expected";
                if (message.mqttDisconnects != null && message.hasOwnProperty("mqttDisconnects"))
                    if (!$util.isInteger(message.mqttDisconnects))
                        return "mqttDisconnects: integer expected";
                if (message.temperature != null && message.hasOwnProperty("temperature"))
                    if (typeof message.temperature !== "number")
                        return "temperature: number expected";
                if (message.humidity != null && message.hasOwnProperty("humidity"))
                    if (typeof message.humidity !== "number")
                        return "humidity: number expected";
                if (message.country != null && message.hasOwnProperty("country"))
                    if (!$util.isString(message.country))
                        return "country: string expected";
                if (message.zone != null && message.hasOwnProperty("zone"))
                    if (!$util.isInteger(message.zone))
                        return "zone: integer expected";
                if (message.latitude != null && message.hasOwnProperty("latitude"))
                    if (typeof message.latitude !== "number")
                        return "latitude: number expected";
                if (message.longitude != null && message.hasOwnProperty("longitude"))
                    if (typeof message.longitude !== "number")
                        return "longitude: number expected";
                if (message.errorFlags != null && message.hasOwnProperty("errorFlags"))
                    if (!$util.isInteger(message.errorFlags))
                        return "errorFlags: integer expected";
                if (message.errorCount != null && message.hasOwnProperty("errorCount"))
                    if (!$util.isInteger(message.errorCount))
                        return "errorCount: integer expected";
                if (message.partition != null && message.hasOwnProperty("partition"))
                    if (!$util.isInteger(message.partition))
                        return "partition: integer expected";
                if (message.otaValidated != null && message.hasOwnProperty("otaValidated"))
                    if (typeof message.otaValidated !== "boolean")
                        return "otaValidated: boolean expected";
                return null;
            };

            /**
             * Creates a StatusMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {esg.alarm.StatusMessage} StatusMessage
             */
            StatusMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.esg.alarm.StatusMessage)
                    return object;
                var message = new $root.esg.alarm.StatusMessage();
                if (object.sequence != null)
                    message.sequence = object.sequence >>> 0;
                if (object.timestamp != null)
                    message.timestamp = object.timestamp >>> 0;
                if (object.deviceDbId != null)
                    message.deviceDbId = object.deviceDbId >>> 0;
                switch (object.state) {
                default:
                    if (typeof object.state === "number") {
                        message.state = object.state;
                        break;
                    }
                    break;
                case "STATE_BOOT":
                case 0:
                    message.state = 0;
                    break;
                case "STATE_INIT":
                case 1:
                    message.state = 1;
                    break;
                case "STATE_CONNECTING":
                case 2:
                    message.state = 2;
                    break;
                case "STATE_NORMAL":
                case 3:
                    message.state = 3;
                    break;
                case "STATE_ALARM":
                case 4:
                    message.state = 4;
                    break;
                case "STATE_MAINTENANCE":
                case 5:
                    message.state = 5;
                    break;
                case "STATE_ERROR":
                case 6:
                    message.state = 6;
                    break;
                case "STATE_CRITICAL":
                case 7:
                    message.state = 7;
                    break;
                }
                if (object.stateDuration != null)
                    message.stateDuration = object.stateDuration >>> 0;
                if (object.uptime != null)
                    message.uptime = object.uptime >>> 0;
                if (object.bootCount != null)
                    message.bootCount = object.bootCount >>> 0;
                if (object.freeHeap != null)
                    message.freeHeap = object.freeHeap >>> 0;
                if (object.minHeap != null)
                    message.minHeap = object.minHeap >>> 0;
                if (object.firmware != null)
                    message.firmware = String(object.firmware);
                switch (object.network) {
                default:
                    if (typeof object.network === "number") {
                        message.network = object.network;
                        break;
                    }
                    break;
                case "NETWORK_WIFI":
                case 0:
                    message.network = 0;
                    break;
                case "NETWORK_ETHERNET":
                case 1:
                    message.network = 1;
                    break;
                case "NETWORK_NONE":
                case 2:
                    message.network = 2;
                    break;
                }
                if (object.connected != null)
                    message.connected = Boolean(object.connected);
                if (object.hasIp != null)
                    message.hasIp = Boolean(object.hasIp);
                if (object.rssi != null)
                    message.rssi = object.rssi | 0;
                if (object.ipAddress != null)
                    message.ipAddress = object.ipAddress >>> 0;
                if (object.macAddress != null)
                    if (typeof object.macAddress === "string")
                        $util.base64.decode(object.macAddress, message.macAddress = $util.newBuffer($util.base64.length(object.macAddress)), 0);
                    else if (object.macAddress.length >= 0)
                        message.macAddress = object.macAddress;
                if (object.mqttConnected != null)
                    message.mqttConnected = Boolean(object.mqttConnected);
                if (object.ntpSynced != null)
                    message.ntpSynced = Boolean(object.ntpSynced);
                if (object.lastNtpSync != null)
                    if ($util.Long)
                        (message.lastNtpSync = $util.Long.fromValue(object.lastNtpSync)).unsigned = false;
                    else if (typeof object.lastNtpSync === "string")
                        message.lastNtpSync = parseInt(object.lastNtpSync, 10);
                    else if (typeof object.lastNtpSync === "number")
                        message.lastNtpSync = object.lastNtpSync;
                    else if (typeof object.lastNtpSync === "object")
                        message.lastNtpSync = new $util.LongBits(object.lastNtpSync.low >>> 0, object.lastNtpSync.high >>> 0).toNumber();
                if (object.panic1 != null)
                    message.panic1 = Boolean(object.panic1);
                if (object.panic2 != null)
                    message.panic2 = Boolean(object.panic2);
                if (object.boxSw != null)
                    message.boxSw = Boolean(object.boxSw);
                if (object.siren != null)
                    message.siren = Boolean(object.siren);
                if (object.turret != null)
                    message.turret = Boolean(object.turret);
                if (object.panic1Count != null)
                    message.panic1Count = object.panic1Count >>> 0;
                if (object.panic2Count != null)
                    message.panic2Count = object.panic2Count >>> 0;
                if (object.tamperCount != null)
                    message.tamperCount = object.tamperCount >>> 0;
                if (object.wifiDisconnects != null)
                    message.wifiDisconnects = object.wifiDisconnects >>> 0;
                if (object.mqttDisconnects != null)
                    message.mqttDisconnects = object.mqttDisconnects >>> 0;
                if (object.temperature != null)
                    message.temperature = Number(object.temperature);
                if (object.humidity != null)
                    message.humidity = Number(object.humidity);
                if (object.country != null)
                    message.country = String(object.country);
                if (object.zone != null)
                    message.zone = object.zone >>> 0;
                if (object.latitude != null)
                    message.latitude = Number(object.latitude);
                if (object.longitude != null)
                    message.longitude = Number(object.longitude);
                if (object.errorFlags != null)
                    message.errorFlags = object.errorFlags >>> 0;
                if (object.errorCount != null)
                    message.errorCount = object.errorCount >>> 0;
                if (object.partition != null)
                    message.partition = object.partition >>> 0;
                if (object.otaValidated != null)
                    message.otaValidated = Boolean(object.otaValidated);
                return message;
            };

            /**
             * Creates a plain object from a StatusMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {esg.alarm.StatusMessage} message StatusMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StatusMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.sequence = 0;
                    object.timestamp = 0;
                    object.deviceDbId = 0;
                    object.state = options.enums === String ? "STATE_BOOT" : 0;
                    object.stateDuration = 0;
                    object.uptime = 0;
                    object.bootCount = 0;
                    object.freeHeap = 0;
                    object.minHeap = 0;
                    object.firmware = "";
                    object.network = options.enums === String ? "NETWORK_WIFI" : 0;
                    object.connected = false;
                    object.hasIp = false;
                    object.rssi = 0;
                    object.ipAddress = 0;
                    if (options.bytes === String)
                        object.macAddress = "";
                    else {
                        object.macAddress = [];
                        if (options.bytes !== Array)
                            object.macAddress = $util.newBuffer(object.macAddress);
                    }
                    object.mqttConnected = false;
                    object.ntpSynced = false;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, false);
                        object.lastNtpSync = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.lastNtpSync = options.longs === String ? "0" : 0;
                    object.panic1 = false;
                    object.panic2 = false;
                    object.boxSw = false;
                    object.siren = false;
                    object.turret = false;
                    object.panic1Count = 0;
                    object.panic2Count = 0;
                    object.tamperCount = 0;
                    object.wifiDisconnects = 0;
                    object.mqttDisconnects = 0;
                    object.temperature = 0;
                    object.humidity = 0;
                    object.country = "";
                    object.zone = 0;
                    object.latitude = 0;
                    object.longitude = 0;
                    object.errorFlags = 0;
                    object.errorCount = 0;
                    object.partition = 0;
                    object.otaValidated = false;
                }
                if (message.sequence != null && message.hasOwnProperty("sequence"))
                    object.sequence = message.sequence;
                if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                    object.timestamp = message.timestamp;
                if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
                    object.deviceDbId = message.deviceDbId;
                if (message.state != null && message.hasOwnProperty("state"))
                    object.state = options.enums === String ? $root.esg.alarm.DeviceState[message.state] === undefined ? message.state : $root.esg.alarm.DeviceState[message.state] : message.state;
                if (message.stateDuration != null && message.hasOwnProperty("stateDuration"))
                    object.stateDuration = message.stateDuration;
                if (message.uptime != null && message.hasOwnProperty("uptime"))
                    object.uptime = message.uptime;
                if (message.bootCount != null && message.hasOwnProperty("bootCount"))
                    object.bootCount = message.bootCount;
                if (message.freeHeap != null && message.hasOwnProperty("freeHeap"))
                    object.freeHeap = message.freeHeap;
                if (message.minHeap != null && message.hasOwnProperty("minHeap"))
                    object.minHeap = message.minHeap;
                if (message.firmware != null && message.hasOwnProperty("firmware"))
                    object.firmware = message.firmware;
                if (message.network != null && message.hasOwnProperty("network"))
                    object.network = options.enums === String ? $root.esg.alarm.NetworkInterface[message.network] === undefined ? message.network : $root.esg.alarm.NetworkInterface[message.network] : message.network;
                if (message.connected != null && message.hasOwnProperty("connected"))
                    object.connected = message.connected;
                if (message.hasIp != null && message.hasOwnProperty("hasIp"))
                    object.hasIp = message.hasIp;
                if (message.rssi != null && message.hasOwnProperty("rssi"))
                    object.rssi = message.rssi;
                if (message.ipAddress != null && message.hasOwnProperty("ipAddress"))
                    object.ipAddress = message.ipAddress;
                if (message.macAddress != null && message.hasOwnProperty("macAddress"))
                    object.macAddress = options.bytes === String ? $util.base64.encode(message.macAddress, 0, message.macAddress.length) : options.bytes === Array ? Array.prototype.slice.call(message.macAddress) : message.macAddress;
                if (message.mqttConnected != null && message.hasOwnProperty("mqttConnected"))
                    object.mqttConnected = message.mqttConnected;
                if (message.ntpSynced != null && message.hasOwnProperty("ntpSynced"))
                    object.ntpSynced = message.ntpSynced;
                if (message.lastNtpSync != null && message.hasOwnProperty("lastNtpSync"))
                    if (typeof message.lastNtpSync === "number")
                        object.lastNtpSync = options.longs === String ? String(message.lastNtpSync) : message.lastNtpSync;
                    else
                        object.lastNtpSync = options.longs === String ? $util.Long.prototype.toString.call(message.lastNtpSync) : options.longs === Number ? new $util.LongBits(message.lastNtpSync.low >>> 0, message.lastNtpSync.high >>> 0).toNumber() : message.lastNtpSync;
                if (message.panic1 != null && message.hasOwnProperty("panic1"))
                    object.panic1 = message.panic1;
                if (message.panic2 != null && message.hasOwnProperty("panic2"))
                    object.panic2 = message.panic2;
                if (message.boxSw != null && message.hasOwnProperty("boxSw"))
                    object.boxSw = message.boxSw;
                if (message.siren != null && message.hasOwnProperty("siren"))
                    object.siren = message.siren;
                if (message.turret != null && message.hasOwnProperty("turret"))
                    object.turret = message.turret;
                if (message.panic1Count != null && message.hasOwnProperty("panic1Count"))
                    object.panic1Count = message.panic1Count;
                if (message.panic2Count != null && message.hasOwnProperty("panic2Count"))
                    object.panic2Count = message.panic2Count;
                if (message.tamperCount != null && message.hasOwnProperty("tamperCount"))
                    object.tamperCount = message.tamperCount;
                if (message.wifiDisconnects != null && message.hasOwnProperty("wifiDisconnects"))
                    object.wifiDisconnects = message.wifiDisconnects;
                if (message.mqttDisconnects != null && message.hasOwnProperty("mqttDisconnects"))
                    object.mqttDisconnects = message.mqttDisconnects;
                if (message.temperature != null && message.hasOwnProperty("temperature"))
                    object.temperature = options.json && !isFinite(message.temperature) ? String(message.temperature) : message.temperature;
                if (message.humidity != null && message.hasOwnProperty("humidity"))
                    object.humidity = options.json && !isFinite(message.humidity) ? String(message.humidity) : message.humidity;
                if (message.country != null && message.hasOwnProperty("country"))
                    object.country = message.country;
                if (message.zone != null && message.hasOwnProperty("zone"))
                    object.zone = message.zone;
                if (message.latitude != null && message.hasOwnProperty("latitude"))
                    object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
                if (message.longitude != null && message.hasOwnProperty("longitude"))
                    object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
                if (message.errorFlags != null && message.hasOwnProperty("errorFlags"))
                    object.errorFlags = message.errorFlags;
                if (message.errorCount != null && message.hasOwnProperty("errorCount"))
                    object.errorCount = message.errorCount;
                if (message.partition != null && message.hasOwnProperty("partition"))
                    object.partition = message.partition;
                if (message.otaValidated != null && message.hasOwnProperty("otaValidated"))
                    object.otaValidated = message.otaValidated;
                return object;
            };

            /**
             * Converts this StatusMessage to JSON.
             * @function toJSON
             * @memberof esg.alarm.StatusMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StatusMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for StatusMessage
             * @function getTypeUrl
             * @memberof esg.alarm.StatusMessage
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            StatusMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/esg.alarm.StatusMessage";
            };

            return StatusMessage;
        })();

        return alarm;
    })();

    return esg;
})();

$root.Heartbeat = (function() {

    /**
     * Properties of a Heartbeat.
     * @exports IHeartbeat
     * @interface IHeartbeat
     * @property {number|null} [timestamp] Heartbeat timestamp
     * @property {number|null} [deviceDbId] Heartbeat deviceDbId
     * @property {number|null} [temperature] Heartbeat temperature
     * @property {number|null} [humidity] Heartbeat humidity
     * @property {boolean|null} [panic1] Heartbeat panic1
     * @property {boolean|null} [panic2] Heartbeat panic2
     * @property {boolean|null} [siren] Heartbeat siren
     * @property {boolean|null} [turret] Heartbeat turret
     * @property {boolean|null} [boxSw] Heartbeat boxSw
     * @property {number|null} [uptime] Heartbeat uptime
     * @property {number|null} [ethInterface] Heartbeat ethInterface
     * @property {string|null} [firmware] Heartbeat firmware
     * @property {number|null} [fanPwmDuty] Heartbeat fanPwmDuty
     */

    /**
     * Constructs a new Heartbeat.
     * @exports Heartbeat
     * @classdesc Represents a Heartbeat.
     * @implements IHeartbeat
     * @constructor
     * @param {IHeartbeat=} [properties] Properties to set
     */
    function Heartbeat(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Heartbeat timestamp.
     * @member {number} timestamp
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.timestamp = 0;

    /**
     * Heartbeat deviceDbId.
     * @member {number} deviceDbId
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.deviceDbId = 0;

    /**
     * Heartbeat temperature.
     * @member {number} temperature
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.temperature = 0;

    /**
     * Heartbeat humidity.
     * @member {number} humidity
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.humidity = 0;

    /**
     * Heartbeat panic1.
     * @member {boolean} panic1
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.panic1 = false;

    /**
     * Heartbeat panic2.
     * @member {boolean} panic2
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.panic2 = false;

    /**
     * Heartbeat siren.
     * @member {boolean} siren
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.siren = false;

    /**
     * Heartbeat turret.
     * @member {boolean} turret
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.turret = false;

    /**
     * Heartbeat boxSw.
     * @member {boolean} boxSw
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.boxSw = false;

    /**
     * Heartbeat uptime.
     * @member {number} uptime
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.uptime = 0;

    /**
     * Heartbeat ethInterface.
     * @member {number} ethInterface
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.ethInterface = 0;

    /**
     * Heartbeat firmware.
     * @member {string} firmware
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.firmware = "";

    /**
     * Heartbeat fanPwmDuty.
     * @member {number} fanPwmDuty
     * @memberof Heartbeat
     * @instance
     */
    Heartbeat.prototype.fanPwmDuty = 0;

    /**
     * Creates a new Heartbeat instance using the specified properties.
     * @function create
     * @memberof Heartbeat
     * @static
     * @param {IHeartbeat=} [properties] Properties to set
     * @returns {Heartbeat} Heartbeat instance
     */
    Heartbeat.create = function create(properties) {
        return new Heartbeat(properties);
    };

    /**
     * Encodes the specified Heartbeat message. Does not implicitly {@link Heartbeat.verify|verify} messages.
     * @function encode
     * @memberof Heartbeat
     * @static
     * @param {IHeartbeat} message Heartbeat message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Heartbeat.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.timestamp);
        if (message.deviceDbId != null && Object.hasOwnProperty.call(message, "deviceDbId"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.deviceDbId);
        if (message.temperature != null && Object.hasOwnProperty.call(message, "temperature"))
            writer.uint32(/* id 3, wireType 5 =*/29).float(message.temperature);
        if (message.humidity != null && Object.hasOwnProperty.call(message, "humidity"))
            writer.uint32(/* id 4, wireType 5 =*/37).float(message.humidity);
        if (message.panic1 != null && Object.hasOwnProperty.call(message, "panic1"))
            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.panic1);
        if (message.panic2 != null && Object.hasOwnProperty.call(message, "panic2"))
            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.panic2);
        if (message.siren != null && Object.hasOwnProperty.call(message, "siren"))
            writer.uint32(/* id 7, wireType 0 =*/56).bool(message.siren);
        if (message.turret != null && Object.hasOwnProperty.call(message, "turret"))
            writer.uint32(/* id 8, wireType 0 =*/64).bool(message.turret);
        if (message.boxSw != null && Object.hasOwnProperty.call(message, "boxSw"))
            writer.uint32(/* id 9, wireType 0 =*/72).bool(message.boxSw);
        if (message.uptime != null && Object.hasOwnProperty.call(message, "uptime"))
            writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.uptime);
        if (message.ethInterface != null && Object.hasOwnProperty.call(message, "ethInterface"))
            writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.ethInterface);
        if (message.firmware != null && Object.hasOwnProperty.call(message, "firmware"))
            writer.uint32(/* id 12, wireType 2 =*/98).string(message.firmware);
        if (message.fanPwmDuty != null && Object.hasOwnProperty.call(message, "fanPwmDuty"))
            writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.fanPwmDuty);
        return writer;
    };

    /**
     * Encodes the specified Heartbeat message, length delimited. Does not implicitly {@link Heartbeat.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Heartbeat
     * @static
     * @param {IHeartbeat} message Heartbeat message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Heartbeat.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Heartbeat message from the specified reader or buffer.
     * @function decode
     * @memberof Heartbeat
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Heartbeat} Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Heartbeat.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Heartbeat();
        while (reader.pos < end) {
            var tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.timestamp = reader.uint32();
                    break;
                }
            case 2: {
                    message.deviceDbId = reader.uint32();
                    break;
                }
            case 3: {
                    message.temperature = reader.float();
                    break;
                }
            case 4: {
                    message.humidity = reader.float();
                    break;
                }
            case 5: {
                    message.panic1 = reader.bool();
                    break;
                }
            case 6: {
                    message.panic2 = reader.bool();
                    break;
                }
            case 7: {
                    message.siren = reader.bool();
                    break;
                }
            case 8: {
                    message.turret = reader.bool();
                    break;
                }
            case 9: {
                    message.boxSw = reader.bool();
                    break;
                }
            case 10: {
                    message.uptime = reader.uint32();
                    break;
                }
            case 11: {
                    message.ethInterface = reader.uint32();
                    break;
                }
            case 12: {
                    message.firmware = reader.string();
                    break;
                }
            case 13: {
                    message.fanPwmDuty = reader.uint32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Heartbeat message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Heartbeat
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Heartbeat} Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Heartbeat.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Heartbeat message.
     * @function verify
     * @memberof Heartbeat
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Heartbeat.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp))
                return "timestamp: integer expected";
        if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
            if (!$util.isInteger(message.deviceDbId))
                return "deviceDbId: integer expected";
        if (message.temperature != null && message.hasOwnProperty("temperature"))
            if (typeof message.temperature !== "number")
                return "temperature: number expected";
        if (message.humidity != null && message.hasOwnProperty("humidity"))
            if (typeof message.humidity !== "number")
                return "humidity: number expected";
        if (message.panic1 != null && message.hasOwnProperty("panic1"))
            if (typeof message.panic1 !== "boolean")
                return "panic1: boolean expected";
        if (message.panic2 != null && message.hasOwnProperty("panic2"))
            if (typeof message.panic2 !== "boolean")
                return "panic2: boolean expected";
        if (message.siren != null && message.hasOwnProperty("siren"))
            if (typeof message.siren !== "boolean")
                return "siren: boolean expected";
        if (message.turret != null && message.hasOwnProperty("turret"))
            if (typeof message.turret !== "boolean")
                return "turret: boolean expected";
        if (message.boxSw != null && message.hasOwnProperty("boxSw"))
            if (typeof message.boxSw !== "boolean")
                return "boxSw: boolean expected";
        if (message.uptime != null && message.hasOwnProperty("uptime"))
            if (!$util.isInteger(message.uptime))
                return "uptime: integer expected";
        if (message.ethInterface != null && message.hasOwnProperty("ethInterface"))
            if (!$util.isInteger(message.ethInterface))
                return "ethInterface: integer expected";
        if (message.firmware != null && message.hasOwnProperty("firmware"))
            if (!$util.isString(message.firmware))
                return "firmware: string expected";
        if (message.fanPwmDuty != null && message.hasOwnProperty("fanPwmDuty"))
            if (!$util.isInteger(message.fanPwmDuty))
                return "fanPwmDuty: integer expected";
        return null;
    };

    /**
     * Creates a Heartbeat message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Heartbeat
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Heartbeat} Heartbeat
     */
    Heartbeat.fromObject = function fromObject(object) {
        if (object instanceof $root.Heartbeat)
            return object;
        var message = new $root.Heartbeat();
        if (object.timestamp != null)
            message.timestamp = object.timestamp >>> 0;
        if (object.deviceDbId != null)
            message.deviceDbId = object.deviceDbId >>> 0;
        if (object.temperature != null)
            message.temperature = Number(object.temperature);
        if (object.humidity != null)
            message.humidity = Number(object.humidity);
        if (object.panic1 != null)
            message.panic1 = Boolean(object.panic1);
        if (object.panic2 != null)
            message.panic2 = Boolean(object.panic2);
        if (object.siren != null)
            message.siren = Boolean(object.siren);
        if (object.turret != null)
            message.turret = Boolean(object.turret);
        if (object.boxSw != null)
            message.boxSw = Boolean(object.boxSw);
        if (object.uptime != null)
            message.uptime = object.uptime >>> 0;
        if (object.ethInterface != null)
            message.ethInterface = object.ethInterface >>> 0;
        if (object.firmware != null)
            message.firmware = String(object.firmware);
        if (object.fanPwmDuty != null)
            message.fanPwmDuty = object.fanPwmDuty >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a Heartbeat message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Heartbeat
     * @static
     * @param {Heartbeat} message Heartbeat
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Heartbeat.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.timestamp = 0;
            object.deviceDbId = 0;
            object.temperature = 0;
            object.humidity = 0;
            object.panic1 = false;
            object.panic2 = false;
            object.siren = false;
            object.turret = false;
            object.boxSw = false;
            object.uptime = 0;
            object.ethInterface = 0;
            object.firmware = "";
            object.fanPwmDuty = 0;
        }
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = message.timestamp;
        if (message.deviceDbId != null && message.hasOwnProperty("deviceDbId"))
            object.deviceDbId = message.deviceDbId;
        if (message.temperature != null && message.hasOwnProperty("temperature"))
            object.temperature = options.json && !isFinite(message.temperature) ? String(message.temperature) : message.temperature;
        if (message.humidity != null && message.hasOwnProperty("humidity"))
            object.humidity = options.json && !isFinite(message.humidity) ? String(message.humidity) : message.humidity;
        if (message.panic1 != null && message.hasOwnProperty("panic1"))
            object.panic1 = message.panic1;
        if (message.panic2 != null && message.hasOwnProperty("panic2"))
            object.panic2 = message.panic2;
        if (message.siren != null && message.hasOwnProperty("siren"))
            object.siren = message.siren;
        if (message.turret != null && message.hasOwnProperty("turret"))
            object.turret = message.turret;
        if (message.boxSw != null && message.hasOwnProperty("boxSw"))
            object.boxSw = message.boxSw;
        if (message.uptime != null && message.hasOwnProperty("uptime"))
            object.uptime = message.uptime;
        if (message.ethInterface != null && message.hasOwnProperty("ethInterface"))
            object.ethInterface = message.ethInterface;
        if (message.firmware != null && message.hasOwnProperty("firmware"))
            object.firmware = message.firmware;
        if (message.fanPwmDuty != null && message.hasOwnProperty("fanPwmDuty"))
            object.fanPwmDuty = message.fanPwmDuty;
        return object;
    };

    /**
     * Converts this Heartbeat to JSON.
     * @function toJSON
     * @memberof Heartbeat
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Heartbeat.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Heartbeat
     * @function getTypeUrl
     * @memberof Heartbeat
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Heartbeat.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Heartbeat";
    };

    return Heartbeat;
})();

module.exports = $root;
