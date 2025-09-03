import { createHmac } from 'crypto';
import { logger } from '../utils/logger';

// HMAC key provided by user
const HMAC_KEY = Buffer.from('0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF', 'hex');

export interface HMACWrapper {
  payloadLength: number;
  sequence: number;
  payload: Buffer;
  hmac: Buffer;
  valid: boolean;
}

/**
 * Unwrap HMAC-protected message
 * Format: [payload_len:2][sequence:4][payload][hmac:8]
 */
export function unwrapHMAC(buffer: Buffer): HMACWrapper | null {
  try {
    // Log the first bytes to debug
    logger.debug('HMAC unwrap attempt', { 
      size: buffer.length,
      first10bytes: buffer.slice(0, 10).toString('hex')
    });

    // Check minimum size (2 + 4 + 1 + 8 = 15 bytes minimum)
    if (buffer.length < 15) {
      logger.debug('Buffer too small for HMAC wrapper', { size: buffer.length });
      return null;
    }

    // Read payload length (2 bytes, BIG-endian - ESP32 uses network byte order)
    const payloadLength = buffer.readUInt16BE(0);
    
    // Verify buffer has expected size
    const expectedSize = 2 + 4 + payloadLength + 8;
    if (buffer.length !== expectedSize) {
      logger.debug('Buffer size mismatch', { 
        actual: buffer.length, 
        expected: expectedSize,
        payloadLength 
      });
      return null;
    }

    // Read sequence number (4 bytes, BIG-endian - ESP32 uses network byte order)
    const sequence = buffer.readUInt32BE(2);
    
    // Extract payload
    const payload = buffer.slice(6, 6 + payloadLength);
    
    // Extract HMAC (last 8 bytes)
    const hmac = buffer.slice(6 + payloadLength);
    
    // Verify HMAC
    const dataToVerify = buffer.slice(0, 6 + payloadLength);
    // ESP32 uses the LAST 8 bytes of the HMAC SHA256, not the first 8
    const calculatedHmac = createHmac('sha256', HMAC_KEY)
      .update(dataToVerify)
      .digest()
      .slice(-8); // Take LAST 8 bytes (ESP32 convention)
    
    const valid = calculatedHmac.equals(hmac);
    
    if (!valid) {
      logger.warn('HMAC validation failed', {
        sequence,
        calculatedHmac: calculatedHmac.toString('hex'),
        receivedHmac: hmac.toString('hex')
      });
    } else {
      logger.debug('HMAC validated successfully', {
        sequence
      });
    }

    return {
      payloadLength,
      sequence,
      payload,
      hmac,
      valid
    };
  } catch (error) {
    logger.error('Error unwrapping HMAC', error);
    return null;
  }
}

// Global counter for tracking wrapHMAC calls
let globalWrapCounter = 0;

/**
 * Wrap message with HMAC
 * Format: [payload_len:2][sequence:4][payload][hmac:8]
 */
export function wrapHMAC(payload: Buffer, sequence: number): Buffer {
  const wrapId = ++globalWrapCounter;
  const wrapTimestamp = Date.now();
  const stackTrace = new Error().stack;
  
  logger.warn(`🔍 HMAC WRAP CALLED`, {
    wrapId,
    wrapTimestamp,
    sequence,
    payloadSize: payload.length,
    first20Bytes: payload.slice(0, 20).toString('hex'),
    stackTrace: stackTrace?.split('\n').slice(2, 7).join('\n')
  });
  
  // Create header (using BIG-endian to match ESP32)
  const header = Buffer.allocUnsafe(6);
  header.writeUInt16BE(payload.length, 0);
  header.writeUInt32BE(sequence, 2);
  
  // Combine header and payload
  const dataToSign = Buffer.concat([header, payload]);
  
  // Calculate HMAC (ESP32 uses last 8 bytes)
  const hmac = createHmac('sha256', HMAC_KEY)
    .update(dataToSign)
    .digest()
    .slice(-8); // Take LAST 8 bytes to match ESP32
  
  // Combine all parts
  const result = Buffer.concat([dataToSign, hmac]);
  
  logger.warn(`🔍 HMAC WRAP COMPLETED`, {
    wrapId,
    wrapTimestamp,
    sequence,
    resultSize: result.length,
    hmacHex: hmac.toString('hex')
  });
  
  return result;
}