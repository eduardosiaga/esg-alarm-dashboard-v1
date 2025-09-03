#!/usr/bin/env node

/**
 * Test script for auth/me and refresh token endpoints
 */

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'eduardosiaga@gmail.com';
const TEST_OTP = '742503';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

let accessToken = '';
let refreshToken = '';

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`🧪 TEST: ${testName}`, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message
    };
  }
}

// Test 1: Login and get tokens
async function testLogin() {
  logTest('Login with OTP');
  
  // First, request OTP
  const otpResult = await makeRequest('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email: TEST_EMAIL })
  });

  if (!otpResult.ok) {
    logError(`Failed to send OTP: ${otpResult.data?.error || otpResult.error}`);
    return false;
  }
  
  logSuccess('OTP sent successfully');
  
  // Verify OTP
  const verifyResult = await makeRequest('/api/auth/test-verify', {
    method: 'POST',
    body: JSON.stringify({
      email: TEST_EMAIL,
      otp: TEST_OTP,
      rememberMe: false
    })
  });

  if (verifyResult.ok) {
    logSuccess('Login successful');
    
    // Store tokens
    accessToken = verifyResult.data.session.accessToken;
    refreshToken = verifyResult.data.session.refreshToken;
    
    logInfo(`Access Token: ${accessToken.substring(0, 30)}...`);
    logInfo(`Refresh Token: ${refreshToken.substring(0, 30)}...`);
    logInfo(`Expires at: ${verifyResult.data.session.expiresAt}`);
    
    return true;
  } else {
    logError(`Failed to login: ${verifyResult.data?.error || verifyResult.error}`);
    return false;
  }
}

// Test 2: Test /api/auth/me endpoint
async function testAuthMe() {
  logTest('Test /api/auth/me Endpoint');
  
  if (!accessToken) {
    logError('No access token available');
    return false;
  }

  const result = await makeRequest('/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (result.ok) {
    logSuccess('Successfully retrieved user info');
    logInfo(`User ID: ${result.data.user.id}`);
    logInfo(`Email: ${result.data.user.email}`);
    logInfo(`Name: ${result.data.user.name}`);
    logInfo(`Role: ${result.data.user.role}`);
    logInfo(`Account ID: ${result.data.user.accountId}`);
    logInfo(`Permissions: ${result.data.user.permissions?.join(', ') || 'none'}`);
    return true;
  } else {
    logError(`Failed to get user info: ${result.data?.error || result.error}`);
    logInfo(`Status code: ${result.status}`);
    return false;
  }
}

// Test 3: Test with expired/invalid token
async function testInvalidToken() {
  logTest('Test with Invalid Token');
  
  const result = await makeRequest('/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid_token_here'
    }
  });

  if (!result.ok && result.status === 401) {
    logSuccess('Correctly rejected invalid token');
    logInfo(`Error message: ${result.data?.error}`);
    return true;
  } else {
    logError(`Unexpected response: ${result.status}`);
    return false;
  }
}

// Test 4: Test refresh token endpoint
async function testRefreshToken() {
  logTest('Test Refresh Token');
  
  if (!refreshToken) {
    logError('No refresh token available');
    return false;
  }

  const result = await makeRequest('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({
      refreshToken: refreshToken
    })
  });

  if (result.ok) {
    logSuccess('Token refreshed successfully');
    
    const oldAccessToken = accessToken;
    accessToken = result.data.session.accessToken;
    
    logInfo(`New Access Token: ${accessToken.substring(0, 30)}...`);
    logInfo(`Token changed: ${oldAccessToken !== accessToken ? 'Yes ✓' : 'No ✗'}`);
    logInfo(`New expiry: ${result.data.session.expiresAt}`);
    
    return true;
  } else {
    logError(`Failed to refresh token: ${result.data?.error || result.error}`);
    logInfo(`Status code: ${result.status}`);
    return false;
  }
}

// Test 5: Test /api/auth/me with new token
async function testAuthMeWithNewToken() {
  logTest('Test /api/auth/me with Refreshed Token');
  
  if (!accessToken) {
    logError('No access token available');
    return false;
  }

  const result = await makeRequest('/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (result.ok) {
    logSuccess('New token works correctly');
    logInfo(`User verified as: ${result.data.user.email}`);
    return true;
  } else {
    logError(`Failed with new token: ${result.data?.error || result.error}`);
    return false;
  }
}

// Test 6: Test concurrent requests (simulate the infinite loop issue)
async function testConcurrentRequests() {
  logTest('Test Concurrent Requests (Check for loops)');
  
  if (!accessToken) {
    logError('No access token available');
    return false;
  }

  logInfo('Making 5 concurrent requests to /api/auth/me...');
  
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      makeRequest('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    );
  }

  const startTime = Date.now();
  const results = await Promise.all(promises);
  const endTime = Date.now();
  
  const successCount = results.filter(r => r.ok).length;
  const failCount = results.filter(r => !r.ok).length;
  
  logInfo(`Requests completed in ${endTime - startTime}ms`);
  logInfo(`Success: ${successCount}, Failed: ${failCount}`);
  
  if (successCount === 5) {
    logSuccess('All concurrent requests succeeded');
    return true;
  } else {
    logError(`Some requests failed: ${failCount}/5`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n' + '█'.repeat(60));
  log(' AUTH ENDPOINTS TEST SUITE', 'yellow');
  console.log('█'.repeat(60));
  logInfo(`Base URL: ${BASE_URL}`);
  logInfo(`Test Email: ${TEST_EMAIL}`);
  
  const tests = [
    { name: 'Login with OTP', fn: testLogin },
    { name: 'Test /api/auth/me', fn: testAuthMe },
    { name: 'Test Invalid Token', fn: testInvalidToken },
    { name: 'Refresh Token', fn: testRefreshToken },
    { name: 'Test with New Token', fn: testAuthMeWithNewToken },
    { name: 'Concurrent Requests', fn: testConcurrentRequests }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const success = await test.fn();
    results.push({ name: test.name, success });
    
    if (!success && test.name === 'Login with OTP') {
      logError('Critical test failed, stopping test suite');
      break;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  log(' TEST SUMMARY', 'yellow');
  console.log('='.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  results.forEach(result => {
    if (result.success) {
      logSuccess(`${result.name}`);
      passed++;
    } else {
      logError(`${result.name}`);
      failed++;
    }
  });
  
  console.log('\n' + '-'.repeat(60));
  log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`, 
      failed === 0 ? 'green' : 'yellow');
  console.log('='.repeat(60) + '\n');
  
  process.exit(failed === 0 ? 0 : 1);
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(BASE_URL);
    return response.ok || response.status < 500;
  } catch (error) {
    return false;
  }
}

// Main
async function main() {
  const serverUp = await checkServer();
  
  if (!serverUp) {
    logError(`Server is not running at ${BASE_URL}`);
    logInfo('Please start the server with: npm run dev');
    process.exit(1);
  }
  
  await runAllTests();
}

// Run tests
main().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});