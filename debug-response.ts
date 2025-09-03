import { unwrapHMAC } from './lib/protobuf/hmac-wrapper';
import { protobufDecoder } from './lib/protobuf/decoder';

// Payload recibido en hex (sin espacios)
const hexPayload = '1082a9cfc5061801' + '2a1c446576696365' + '20636f6e66696720' + '7570646174656420' + '2849443d3529';

// Convertir hex a Buffer
const buffer = Buffer.from(hexPayload, 'hex');

console.log('=== DEBUG RESPONSE MESSAGE ===');
console.log('Raw payload size:', buffer.length, 'bytes');
console.log('Raw hex:', buffer.toString('hex'));
console.log('Raw bytes:', Array.from(buffer));

// Este mensaje parece NO tener HMAC wrapper (es muy corto)
// Intentar decodificar directamente como CommandResponse
try {
  console.log('\n=== Attempting direct protobuf decode (no HMAC) ===');
  const response = protobufDecoder.decodeCommandResponse(buffer);
  console.log('Decoded response:', JSON.stringify(response, null, 2));
  
  // Verificar el request_id
  if (response.request_id) {
    console.log('\n=== REQUEST ID ANALYSIS ===');
    console.log('Request ID in response:', response.request_id);
    console.log('Expected request ID: 209e14bf-fd12-4078-8f68-7e26d4874028');
    console.log('Match:', response.request_id === '209e14bf-fd12-4078-8f68-7e26d4874028');
  }
  
  // Decodificar el mensaje de texto si existe
  if (response.message) {
    console.log('\n=== MESSAGE CONTENT ===');
    console.log('Message:', response.message);
  }
} catch (error: any) {
  console.log('Error decoding as CommandResponse:', error.message);
}

// También intentar unwrap HMAC por si acaso
try {
  console.log('\n=== Attempting HMAC unwrap ===');
  const unwrapped = unwrapHMAC(buffer);
  if (unwrapped && unwrapped.payload) {
    console.log('HMAC unwrap successful');
    console.log('Payload after HMAC:', unwrapped.payload.toString('hex'));
    const response = protobufDecoder.decodeCommandResponse(unwrapped.payload);
    console.log('Decoded response:', JSON.stringify(response, null, 2));
  } else {
    console.log('HMAC unwrap failed or invalid');
  }
} catch (error: any) {
  console.log('Error with HMAC unwrap:', error.message);
}