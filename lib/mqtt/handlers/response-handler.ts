import { logger } from '../../utils/logger';
import { unwrapHMAC } from '../../protobuf/hmac-wrapper';
import { protobufDecoder } from '../../protobuf/decoder';
import { DeviceService } from '../../db/device-service';
import { deviceStore } from '../../devices/store';
import { monitorServer } from '../../websocket/websocket-monitor';

export interface ResponseProcessingResult {
  deviceId: number;
  requestId: string;
  success: boolean;
  errorCode: number;
  message: string;
  hostname: string;
}

/**
 * Process command response message from device
 */
export async function processResponseMessage(
  topic: string,
  payload: Buffer
): Promise<ResponseProcessingResult | null> {
  try {
    // Log raw payload for debugging
    logger.info('Processing command response message', { 
      topic, 
      size: payload.length,
      rawHex: payload.toString('hex'),
      rawBytes: Array.from(payload).slice(0, 50), // First 50 bytes for debugging
    });

    // Extract hostname from topic
    const topicParts = topic.split('/');
    const hostname = topicParts[topicParts.length - 2];

    // Broadcast start of processing
    monitorServer.broadcastResponseProcessing('RESPONSE_START', { 
      topic, 
      hostname,
      size: payload.length 
    });

    // 1. Unwrap HMAC
    const unwrapped = unwrapHMAC(payload);
    if (!unwrapped) {
      monitorServer.broadcastResponseProcessing('RESPONSE_ERROR', { 
        hostname,
        error: 'Failed to unwrap HMAC' 
      });
      throw new Error('Failed to unwrap HMAC in response message');
    }

    if (!unwrapped.valid) {
      logger.warn('Invalid HMAC in response message', { hostname });
      monitorServer.broadcastResponseProcessing('HMAC_INVALID', { 
        hostname,
        warning: 'HMAC validation failed but continuing' 
      });
    }

    // 2. Decode CommandResponse
    // First, let's see the raw fields for debugging
    const rawFields = protobufDecoder.getRawFields(unwrapped.payload);
    logger.info('Raw protobuf response fields', { 
      rawFields,
      payloadHex: unwrapped.payload.toString('hex'),
      payloadBytes: Array.from(unwrapped.payload)
    });
    
    const response = protobufDecoder.decodeCommandResponse(unwrapped.payload);
    
    // Additional debugging to see what's in the response
    logger.info('Decoded command response details', {
      hasRequestId: 'requestId' in response,
      requestIdValue: response.requestId,
      requestIdType: typeof response.requestId,
      allFields: Object.keys(response),
      fullResponse: JSON.stringify(response)
    });
    
    logger.debug('Decoded command response', response);

    // Broadcast decoded response
    monitorServer.broadcastResponseProcessing('RESPONSE_DECODED', { 
      hostname,
      requestId: response.requestId,  // Changed from request_id to requestId
      success: response.success,
      errorCode: response.errorCode,  // Changed from error_code to errorCode
      message: response.message
    });

    // 3. Find device in database by hostname
    const device = await DeviceService.findByHostname(hostname);
    
    if (!device) {
      logger.warn('Response from unknown device', { hostname });
      monitorServer.broadcastResponseProcessing('DEVICE_NOT_FOUND', { 
        hostname,
        warning: 'Device not in database' 
      });
      // Don't throw - still process the response for monitoring
    }

    const deviceId = device?.id || 0;

    // 4. Save response to database if device exists
    if (device && deviceId > 0) {
      try {
        await DeviceService.saveCommandResponse({
          deviceId: deviceId,
          requestId: response.requestId || '',
          timestamp: new Date(response.timestamp ? response.timestamp * 1000 : Date.now()),
          success: response.success || false,
          errorCode: response.errorCode || 0,
          message: response.message || '',
          payload: response.payload
        });

        monitorServer.broadcastResponseProcessing('RESPONSE_SAVED', { 
          hostname,
          deviceId,
          requestId: response.requestId
        });

        logger.info('Command response saved', { 
          deviceId, 
          hostname,
          requestId: response.requestId,
          success: response.success 
        });
      } catch (error) {
        logger.error('Error saving command response', { deviceId, error });
        monitorServer.broadcastResponseProcessing('SAVE_ERROR', { 
          hostname,
          deviceId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // 5. Update command status in database
    if (device && response.requestId) {
      try {
        await DeviceService.updateCommandStatus(
          response.requestId,
          response.success ? 'COMPLETED' : 'FAILED',
          {
            errorCode: response.errorCode,
            message: response.message,
            respondedAt: new Date(response.timestamp ? response.timestamp * 1000 : Date.now())
          }
        );

        monitorServer.broadcastResponseProcessing('COMMAND_STATUS_UPDATED', { 
          hostname,
          requestId: response.requestId,
          status: response.success ? 'COMPLETED' : 'FAILED'
        });
      } catch (error) {
        logger.error('Error updating command status', { requestId: response.requestId, error });
      }
    }

    // 6. Update in-memory device store
    const commandResponse = {
      requestId: response.requestId || '',
      timestamp: new Date(response.timestamp ? response.timestamp * 1000 : Date.now()),
      success: response.success || false,
      errorCode: response.errorCode || 0,
      message: response.message || '',
      payload: response.payload
    };

    await deviceStore.updateCommandResponse(hostname, commandResponse);

    // Emit event for real-time updates
    deviceStore.emit('response', hostname, commandResponse);

    // Broadcast completion
    monitorServer.broadcastResponseProcessing('RESPONSE_COMPLETE', { 
      hostname,
      deviceId,
      requestId: response.requestId,
      success: response.success,
      errorCode: response.errorCode,
      message: response.message
    });

    return {
      deviceId,
      requestId: response.requestId || '',
      success: response.success || false,
      errorCode: response.errorCode || 0,
      message: response.message || '',
      hostname
    };

  } catch (error) {
    logger.error('Error processing command response', error);
    
    // Broadcast error
    monitorServer.broadcastResponseProcessing('RESPONSE_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      topic
    });
    
    return null;
  }
}

export default { processResponseMessage };