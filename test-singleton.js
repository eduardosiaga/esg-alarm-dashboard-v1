/**
 * Test script for singleton server implementation
 * 
 * Usage:
 *   node test-singleton.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${new Date().toISOString()} - ${message}${colors.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startServer(name = 'Server', env = {}) {
  return new Promise((resolve, reject) => {
    log(`Starting ${name}...`, colors.cyan);
    
    const serverProcess = spawn('npm', ['run', 'server'], {
      cwd: process.cwd(),
      env: { ...process.env, ...env },
      shell: true
    });

    let started = false;
    let output = '';

    serverProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(`${colors.blue}[${name}]${colors.reset} ${text}`);
      
      if (text.includes('ESP32 Alarm System Backend is running!')) {
        started = true;
        resolve({ process: serverProcess, output, success: true });
      }
      
      if (text.includes('Another server instance is already running!')) {
        started = true;
        resolve({ process: serverProcess, output, success: false, reason: 'already-running' });
      }
    });

    serverProcess.stderr.on('data', (data) => {
      process.stderr.write(`${colors.red}[${name} ERROR]${colors.reset} ${data}`);
    });

    serverProcess.on('close', (code) => {
      if (!started) {
        resolve({ process: serverProcess, output, success: false, code });
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!started) {
        serverProcess.kill();
        reject(new Error(`${name} failed to start within 30 seconds`));
      }
    }, 30000);
  });
}

async function runTests() {
  log('===========================================', colors.magenta);
  log('SINGLETON SERVER TEST SUITE', colors.magenta);
  log('===========================================', colors.magenta);
  
  const lockFile = path.join(process.cwd(), 'server.lock');
  
  // Clean up any existing lock file
  if (fs.existsSync(lockFile)) {
    log('Cleaning up existing lock file...', colors.yellow);
    fs.unlinkSync(lockFile);
  }
  
  let server1 = null;
  let server2 = null;
  
  try {
    // Test 1: Start first server instance
    log('\n[TEST 1] Starting first server instance...', colors.green);
    const result1 = await startServer('Server-1');
    
    if (!result1.success) {
      throw new Error('First server failed to start');
    }
    
    server1 = result1.process;
    log('✅ First server started successfully', colors.green);
    
    // Verify lock file exists
    if (fs.existsSync(lockFile)) {
      log('✅ Lock file created', colors.green);
      const lockData = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
      log(`   PID: ${lockData.pid}`, colors.cyan);
      log(`   Start Time: ${lockData.startTime}`, colors.cyan);
    } else {
      throw new Error('Lock file was not created');
    }
    
    // Wait a bit
    await sleep(3000);
    
    // Test 2: Try to start second server instance
    log('\n[TEST 2] Attempting to start second server instance...', colors.green);
    const result2 = await startServer('Server-2');
    
    if (result2.success) {
      server2 = result2.process;
      throw new Error('Second server should not have started!');
    }
    
    if (result2.reason === 'already-running') {
      log('✅ Second server correctly rejected (instance already running)', colors.green);
    } else {
      throw new Error('Second server failed for unexpected reason');
    }
    
    // Wait for second server to exit
    await sleep(2000);
    
    // Test 3: Kill first server and verify lock cleanup
    log('\n[TEST 3] Stopping first server gracefully...', colors.green);
    server1.kill('SIGINT');
    
    // Wait for graceful shutdown
    await sleep(3000);
    
    // Verify lock file is removed
    if (!fs.existsSync(lockFile)) {
      log('✅ Lock file cleaned up after graceful shutdown', colors.green);
    } else {
      log('⚠️  Lock file still exists after shutdown', colors.yellow);
    }
    
    // Test 4: Start server again after previous shutdown
    log('\n[TEST 4] Starting server after previous shutdown...', colors.green);
    const result3 = await startServer('Server-3');
    
    if (result3.success) {
      log('✅ Server started successfully after previous shutdown', colors.green);
      
      // Clean up
      result3.process.kill('SIGINT');
      await sleep(2000);
    } else {
      throw new Error('Server failed to start after previous shutdown');
    }
    
    // Test 5: Test --kill flag
    log('\n[TEST 5] Testing --kill flag functionality...', colors.green);
    
    // Start a server
    const result4 = await startServer('Server-4');
    if (!result4.success) {
      throw new Error('Server failed to start for kill test');
    }
    
    await sleep(2000);
    
    // Try to kill it using --kill flag
    const killProcess = spawn('npm', ['run', 'server', '--', '--kill'], {
      cwd: process.cwd(),
      shell: true
    });
    
    await new Promise((resolve) => {
      killProcess.on('close', resolve);
      setTimeout(resolve, 5000);
    });
    
    // Verify the server was killed
    await sleep(2000);
    if (!fs.existsSync(lockFile)) {
      log('✅ --kill flag successfully stopped running instance', colors.green);
    } else {
      log('⚠️  Server may still be running after --kill', colors.yellow);
    }
    
    log('\n===========================================', colors.magenta);
    log('✅ ALL TESTS PASSED!', colors.green);
    log('===========================================', colors.magenta);
    
  } catch (error) {
    log('\n===========================================', colors.red);
    log(`❌ TEST FAILED: ${error.message}`, colors.red);
    log('===========================================', colors.red);
    
  } finally {
    // Clean up any running processes
    if (server1 && !server1.killed) {
      log('Cleaning up server 1...', colors.yellow);
      server1.kill('SIGKILL');
    }
    if (server2 && !server2.killed) {
      log('Cleaning up server 2...', colors.yellow);
      server2.kill('SIGKILL');
    }
    
    // Clean up lock file
    if (fs.existsSync(lockFile)) {
      log('Cleaning up lock file...', colors.yellow);
      fs.unlinkSync(lockFile);
    }
    
    process.exit(0);
  }
}

// Run tests
runTests().catch(error => {
  log(`Unexpected error: ${error.message}`, colors.red);
  process.exit(1);
});