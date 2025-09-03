import { startMQTTClient, stopMQTTClient } from './lib/mqtt';
import { monitorServer } from './lib/websocket/websocket-monitor';
import { logger } from './lib/utils/logger';
import singletonManager from './lib/utils/singleton-manager';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const WS_PORT = 8888;
const MQTT_CLIENT_ID = `esg-alarm-server-${process.env.NODE_ENV || 'production'}`;

async function startServer() {
  let lockAcquired = false;
  let wsStarted = false;
  let mqttStarted = false;

  try {
    logger.info('===========================================');
    logger.info('ESP32 Alarm System Backend - Starting...');
    logger.info(`Process ID: ${process.pid}`);
    logger.info(`Node Version: ${process.version}`);
    logger.info(`Platform: ${process.platform}`);
    logger.info('===========================================');
    
    // Step 1: Check for existing instance and acquire lock
    logger.info('Step 1: Checking for existing instances...');
    
    // Check if another instance is running
    const runningInstance = singletonManager.getRunningInstanceInfo();
    if (runningInstance) {
      logger.warn('Found existing lock file, verifying...');
    }

    // Try to acquire lock
    lockAcquired = await singletonManager.acquireLock(WS_PORT, MQTT_CLIENT_ID);
    
    if (!lockAcquired) {
      logger.error('❌ FAILED: Another server instance is already running!');
      
      if (runningInstance) {
        logger.error('Running instance details:', {
          pid: runningInstance.pid,
          startTime: runningInstance.startTime,
          wsPort: runningInstance.wsPort,
          hostname: runningInstance.hostname
        });
        
        logger.info('\nTo stop the running instance, use one of these commands:');
        if (process.platform === 'win32') {
          logger.info(`  taskkill /F /PID ${runningInstance.pid}`);
        } else {
          logger.info(`  kill ${runningInstance.pid}`);
        }
        logger.info('Or delete the lock file manually:');
        logger.info(`  ${process.cwd()}/server.lock`);
      }
      
      process.exit(1);
    }
    
    logger.info('✅ Lock acquired successfully');
    
    // Step 2: Start WebSocket monitor server
    logger.info('\nStep 2: Starting WebSocket monitor server...');
    try {
      monitorServer.start();
      wsStarted = true;
      logger.info(`✅ WebSocket monitor server started on port ${WS_PORT}`);
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ FAILED: Port ${WS_PORT} is already in use!`);
        logger.error('This should not happen with singleton control.');
        logger.error('Please check for zombie processes or other applications using this port.');
        
        // Release lock and exit
        singletonManager.releaseLock();
        process.exit(1);
      }
      throw error;
    }
    
    // Step 3: Start MQTT client
    logger.info('\nStep 3: Connecting to MQTT broker...');
    try {
      await startMQTTClient();
      mqttStarted = true;
      logger.info('✅ MQTT client connected successfully');
    } catch (error) {
      logger.error('❌ FAILED: Could not connect to MQTT broker', error);
      throw error;
    }
    
    // All systems go!
    logger.info('\n===========================================');
    logger.info('✅ ESP32 Alarm System Backend is running!');
    logger.info('===========================================');
    logger.info(`Process ID: ${process.pid}`);
    logger.info(`MQTT Broker: esag-tech.com:8883`);
    logger.info(`MQTT Client ID: ${MQTT_CLIENT_ID}`);
    logger.info(`WebSocket Monitor: ws://localhost:${WS_PORT}`);
    logger.info(`Lock File: ${process.cwd()}/server.lock`);
    logger.info('===========================================');
    logger.info('Press Ctrl+C to stop the server gracefully');
    logger.info('===========================================\n');
    
    // Set up graceful shutdown handlers
    setupGracefulShutdown(wsStarted, mqttStarted);
    
  } catch (error) {
    logger.error('❌ Failed to start server', error);
    
    // Clean up on failure
    await cleanup(lockAcquired, wsStarted, mqttStarted);
    process.exit(1);
  }
}

/**
 * Set up graceful shutdown handlers
 */
function setupGracefulShutdown(wsStarted: boolean, mqttStarted: boolean) {
  let isShuttingDown = false;
  
  const shutdown = async (signal: string) => {
    if (isShuttingDown) {
      logger.warn('Shutdown already in progress...');
      return;
    }
    
    isShuttingDown = true;
    
    logger.info('\n===========================================');
    logger.info(`Received ${signal} - Starting graceful shutdown...`);
    logger.info('===========================================');
    
    await cleanup(true, wsStarted, mqttStarted);
    
    logger.info('✅ Shutdown completed successfully');
    process.exit(0);
  };
  
  // Handle different termination signals
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  
  // Windows specific
  if (process.platform === 'win32') {
    process.on('SIGBREAK', () => shutdown('SIGBREAK'));
  }
  
  // Handle uncaught errors
  process.on('uncaughtException', async (error) => {
    logger.error('💥 Uncaught exception:', error);
    await cleanup(true, wsStarted, mqttStarted);
    process.exit(1);
  });
  
  process.on('unhandledRejection', async (reason, promise) => {
    logger.error('💥 Unhandled rejection:', { reason, promise });
    await cleanup(true, wsStarted, mqttStarted);
    process.exit(1);
  });
}

/**
 * Clean up resources
 */
async function cleanup(lockAcquired: boolean, wsStarted: boolean, mqttStarted: boolean) {
  logger.info('Cleaning up resources...');
  
  // Stop MQTT client
  if (mqttStarted) {
    try {
      logger.info('  • Disconnecting MQTT client...');
      await stopMQTTClient();
      logger.info('    ✓ MQTT client disconnected');
    } catch (error) {
      logger.error('    ✗ Error disconnecting MQTT client', error);
    }
  }
  
  // Stop WebSocket server
  if (wsStarted) {
    try {
      logger.info('  • Stopping WebSocket server...');
      monitorServer.stop();
      logger.info('    ✓ WebSocket server stopped');
    } catch (error) {
      logger.error('    ✗ Error stopping WebSocket server', error);
    }
  }
  
  // Release lock
  if (lockAcquired) {
    try {
      logger.info('  • Releasing instance lock...');
      singletonManager.releaseLock();
      logger.info('    ✓ Lock released');
    } catch (error) {
      logger.error('    ✗ Error releasing lock', error);
    }
  }
}

// Check for --kill flag to kill running instance
if (process.argv.includes('--kill')) {
  logger.info('Kill flag detected, attempting to stop running instance...');
  singletonManager.killRunningInstance().then((killed) => {
    if (killed) {
      logger.info('✅ Running instance stopped successfully');
    } else {
      logger.info('No running instance found or could not stop it');
    }
    process.exit(0);
  });
} else {
  // Start the server
  startServer();
}