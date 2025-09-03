import { protobufDecoder } from './lib/protobuf/decoder';

// Comando enviado ID 85 (sin HMAC wrapper)
const hexCommand = '08021083a9cfc5065a220803621e0a164553475f414c41524d5f30343833303830434544443810051801203c';

// Convertir hex a Buffer
const buffer = Buffer.from(hexCommand, 'hex');

console.log('=== DEBUG COMMAND MESSAGE (ID 85) ===');
console.log('Raw command size:', buffer.length, 'bytes');
console.log('Raw hex:', buffer.toString('hex'));
console.log('Raw bytes:', Array.from(buffer));

// Decodificar como CommandEnvelope
try {
  console.log('\n=== Decoding as CommandEnvelope ===');
  const root = (protobufDecoder as any).root;
  const CommandEnvelope = root.esg.alarm.CommandEnvelope;
  const message = CommandEnvelope.decode(buffer);
  const decoded = CommandEnvelope.toObject(message, {
    longs: String,
    enums: Number,
    bytes: String,
    defaults: true,
    arrays: true,
    objects: true,
  });
  
  console.log('Decoded command:', JSON.stringify(decoded, null, 2));
  
  console.log('\n=== ANALYSIS ===');
  console.log('Has request_id?', !!decoded.requestId || !!decoded.request_id);
  console.log('request_id value:', decoded.requestId || decoded.request_id || 'NOT PRESENT');
  console.log('Expected request_id: 209e14bf-fd12-4078-8f68-7e26d4874028');
  
  // Verificar el tipo de comando
  if (decoded.config) {
    console.log('\nCommand type: CONFIG');
    console.log('Config type:', decoded.config.type);
    if (decoded.config.device) {
      console.log('Device config:', decoded.config.device);
    }
  }
} catch (error: any) {
  console.log('Error decoding:', error.message);
}

// También intentar análisis manual del buffer
console.log('\n=== MANUAL BUFFER ANALYSIS ===');
console.log('First byte (field 1, wire type):', buffer[0].toString(16), '-> Field', buffer[0] >> 3, 'Type', buffer[0] & 0x07);
console.log('Second byte (value):', buffer[1]);

// El request_id debería estar en el campo 3 (tag = 3 << 3 | 2 = 26 = 0x1a)
const requestIdTag = 0x1a; // Field 3, wire type 2 (length-delimited)
const requestIdIndex = buffer.indexOf(requestIdTag);
console.log('Looking for request_id tag (0x1a):', requestIdIndex >= 0 ? `Found at index ${requestIdIndex}` : 'NOT FOUND');