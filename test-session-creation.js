#!/usr/bin/env node

/**
 * Direct test of session creation
 */

const crypto = require('crypto');

// Test UUID generation
console.log('Testing UUID generation:');
const uuid1 = crypto.randomUUID();
const uuid2 = crypto.randomUUID();
console.log('UUID 1:', uuid1);
console.log('UUID 2:', uuid2);

// Test what the JWT service would generate
function generateSessionId() {
  return crypto.randomUUID();
}

console.log('\nTesting generateSessionId function:');
for (let i = 0; i < 5; i++) {
  const id = generateSessionId();
  console.log(`Session ${i + 1}: ${id}`);
}

// Test JWT payload
const jwt = require('jsonwebtoken');

const testPayload = {
  sub: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'ADMIN',
  accountId: 1,
  permissions: [],
  sessionId: generateSessionId()
};

console.log('\nTest JWT Payload:');
console.log(JSON.stringify(testPayload, null, 2));

const token = jwt.sign(testPayload, 'test-secret', { expiresIn: '15m' });
console.log('\nGenerated JWT:');
console.log(token.substring(0, 50) + '...');

const decoded = jwt.decode(token);
console.log('\nDecoded JWT:');
console.log(JSON.stringify(decoded, null, 2));

// Test accessing the sessionId from decoded token
console.log('\nSession ID from decoded token:', decoded.sessionId);
console.log('Type of sessionId:', typeof decoded.sessionId);