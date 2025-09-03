// Test decoding of raw heartbeat message
const protobuf = require('protobufjs');

// Raw hex from the captured message
const rawHex = '00190000078308eec8c7c50650b2c003620d393839663938312d6469727479a53083f3fc3182e8';
const buffer = Buffer.from(rawHex, 'hex');

console.log('Raw buffer analysis:');
console.log('Total size:', buffer.length, 'bytes');
console.log('First 2 bytes LE:', buffer.readUInt16LE(0), '(0x' + buffer.slice(0,2).toString('hex') + ')');
console.log('First 2 bytes BE:', buffer.readUInt16BE(0), '(0x' + buffer.slice(0,2).toString('hex') + ')');
console.log('Next 4 bytes LE:', buffer.readUInt32LE(2), '(0x' + buffer.slice(2,6).toString('hex') + ')');
console.log('Next 4 bytes BE:', buffer.readUInt32BE(2), '(0x' + buffer.slice(2,6).toString('hex') + ')');

// Try to extract the actual protobuf payload
// If format is: [len:2][seq:4][payload][hmac:8]
const payloadLen = buffer.readUInt16BE(0);  // Try Big Endian
const sequence = buffer.readUInt32BE(2);
const payloadStart = 6;
const payloadEnd = payloadStart + payloadLen;

console.log('\nAssuming HMAC wrapper format:');
console.log('Payload length:', payloadLen);
console.log('Sequence:', sequence);
console.log('Payload should be from byte', payloadStart, 'to', payloadEnd);

if (buffer.length >= payloadEnd + 8) {
    const payload = buffer.slice(payloadStart, payloadEnd);
    const hmac = buffer.slice(payloadEnd, payloadEnd + 8);
    
    console.log('Payload hex:', payload.toString('hex'));
    console.log('HMAC hex:', hmac.toString('hex'));
    console.log('Payload bytes:', Array.from(payload));
    
    // Try to decode as protobuf
    console.log('\n--- Trying to decode payload as protobuf ---');
    const reader = protobuf.Reader.create(payload);
    const fields = [];
    
    try {
        while (reader.pos < reader.len) {
            const tag = reader.uint32();
            const fieldNumber = tag >>> 3;
            const wireType = tag & 7;
            
            console.log(`Field ${fieldNumber}, wire type ${wireType}`);
            
            let value;
            switch (wireType) {
                case 0: // Varint
                    value = reader.uint64();
                    console.log(`  Value (varint): ${value}`);
                    break;
                case 1: // 64-bit
                    value = reader.fixed64();
                    console.log(`  Value (64-bit): ${value}`);
                    break;
                case 2: // Length-delimited
                    value = reader.bytes();
                    console.log(`  Value (bytes): ${Buffer.from(value).toString('hex')}`);
                    console.log(`  Value (string): ${Buffer.from(value).toString()}`);
                    break;
                case 5: // 32-bit
                    value = reader.fixed32();
                    console.log(`  Value (32-bit): ${value}`);
                    break;
                default:
                    console.log(`  Unknown wire type: ${wireType}`);
                    reader.skipType(wireType);
            }
            
            fields.push({ fieldNumber, wireType, value });
        }
    } catch (e) {
        console.log('Error parsing:', e.message);
    }
} else {
    console.log('\nBuffer too short for expected format!');
    console.log('Expected at least', payloadEnd + 8, 'bytes, got', buffer.length);
    
    // Maybe it's not HMAC wrapped?
    console.log('\n--- Trying without HMAC wrapper ---');
    // Skip first 2 bytes (might be some other header)
    const payloadNoWrapper = buffer.slice(2);
    console.log('Payload without first 2 bytes:', payloadNoWrapper.toString('hex'));
    
    const reader = protobuf.Reader.create(payloadNoWrapper);
    try {
        while (reader.pos < reader.len) {
            const tag = reader.uint32();
            const fieldNumber = tag >>> 3;
            const wireType = tag & 7;
            
            console.log(`Field ${fieldNumber}, wire type ${wireType}`);
            
            switch (wireType) {
                case 0: // Varint
                    const val = reader.uint64();
                    console.log(`  Value: ${val}`);
                    break;
                case 2: // Length-delimited
                    const bytes = reader.bytes();
                    console.log(`  Bytes: ${Buffer.from(bytes).toString('hex')}`);
                    console.log(`  String: ${Buffer.from(bytes).toString()}`);
                    break;
                case 5: // 32-bit
                    const val32 = reader.fixed32();
                    console.log(`  32-bit: ${val32}`);
                    break;
                default:
                    reader.skipType(wireType);
            }
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
}