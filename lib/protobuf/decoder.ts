import * as protobuf from 'protobufjs';
import { logger } from '../utils/logger';

// Load compiled protobuf messages
const messages = require('./compiled/bundle.js');

export class ProtobufDecoder {
  private root: any;

  constructor() {
    this.root = messages;
  }

  /**
   * Decode heartbeat message
   */
  decodeHeartbeat(buffer: Buffer): any {
    try {
      const Heartbeat = this.root.Heartbeat;
      const message = Heartbeat.decode(buffer);
      return Heartbeat.toObject(message, {
        longs: String,
        enums: Number,  // Changed from String to Number to get numeric values
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true,
      });
    } catch (error) {
      logger.error('Error decoding heartbeat', error);
      throw error;
    }
  }

  /**
   * Decode status message
   */
  decodeStatus(buffer: Buffer): any {
    try {
      const StatusMessage = this.root.esg.alarm.StatusMessage;
      const message = StatusMessage.decode(buffer);
      return StatusMessage.toObject(message, {
        longs: String,
        enums: Number,  // Changed from String to Number to get numeric values
        bytes: Array,
        defaults: true,
        arrays: true,
        objects: true,
      });
    } catch (error) {
      logger.error('Error decoding status', error);
      throw error;
    }
  }

  /**
   * Decode alarm event message
   */
  decodeAlarmEvent(buffer: Buffer): any {
    try {
      const AlarmEvent = this.root.esg.alarm.AlarmEvent;
      const message = AlarmEvent.decode(buffer);
      return AlarmEvent.toObject(message, {
        longs: String,
        enums: Number,  // Changed from String to Number to get numeric values
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true,
      });
    } catch (error) {
      logger.error('Error decoding alarm event', error);
      throw error;
    }
  }

  /**
   * Decode command response
   */
  decodeCommandResponse(buffer: Buffer): any {
    try {
      const CommandResponse = this.root.esg.alarm.CommandResponse;
      const message = CommandResponse.decode(buffer);
      return CommandResponse.toObject(message, {
        longs: String,
        enums: Number,  // Changed from String to Number to get numeric values
        bytes: Array,   // Keep as Array for payload field
        defaults: true,
        arrays: true,
        objects: true,
      });
    } catch (error) {
      logger.error('Error decoding command response', error);
      throw error;
    }
  }

  /**
   * Decode last will message
   */
  decodeLastWill(buffer: Buffer): any {
    try {
      const LastWillMessage = this.root.esg.alarm.LastWillMessage;
      const message = LastWillMessage.decode(buffer);
      return LastWillMessage.toObject(message, {
        longs: String,
        enums: Number,  // Changed from String to Number to get numeric values
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true,
      });
    } catch (error) {
      logger.error('Error decoding last will', error);
      throw error;
    }
  }

  /**
   * Encode command envelope
   */
  encodeCommand(command: any): Buffer {
    try {
      const CommandEnvelope = this.root.esg.alarm.CommandEnvelope;
      const message = CommandEnvelope.create(command);
      return Buffer.from(CommandEnvelope.encode(message).finish());
    } catch (error) {
      logger.error('Error encoding command', error);
      throw error;
    }
  }

  /**
   * Decode any message type (for debugging)
   */
  decodeAny(buffer: Buffer, messageType: string): any {
    try {
      let MessageClass: any;
      
      switch (messageType) {
        case 'Heartbeat':
          MessageClass = this.root.Heartbeat;
          break;
        case 'StatusMessage':
          MessageClass = this.root.esg.alarm.StatusMessage;
          break;
        case 'AlarmEvent':
          MessageClass = this.root.esg.alarm.AlarmEvent;
          break;
        case 'CommandResponse':
          MessageClass = this.root.esg.alarm.CommandResponse;
          break;
        case 'LastWillMessage':
          MessageClass = this.root.esg.alarm.LastWillMessage;
          break;
        default:
          throw new Error(`Unknown message type: ${messageType}`);
      }

      const message = MessageClass.decode(buffer);
      return MessageClass.toObject(message, {
        longs: String,
        enums: Number,  // Changed from String to Number to get numeric values
        bytes: Array,
        defaults: true,
        arrays: true,
        objects: true,
      });
    } catch (error) {
      logger.error(`Error decoding ${messageType}`, error);
      throw error;
    }
  }

  /**
   * Get raw protobuf field list (for debugging)
   */
  getRawFields(buffer: Buffer): any {
    const reader = protobuf.Reader.create(buffer);
    const fields: any[] = [];
    
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      const fieldNumber = tag >>> 3;
      const wireType = tag & 7;
      
      let value: any;
      switch (wireType) {
        case 0: // Varint
          value = reader.uint64();
          break;
        case 1: // 64-bit
          value = reader.fixed64();
          break;
        case 2: // Length-delimited
          value = reader.bytes();
          break;
        case 5: // 32-bit
          value = reader.fixed32();
          break;
        default:
          reader.skipType(wireType);
          value = 'unknown';
      }
      
      fields.push({
        fieldNumber,
        wireType,
        value,
      });
    }
    
    return fields;
  }
}

export const protobufDecoder = new ProtobufDecoder();