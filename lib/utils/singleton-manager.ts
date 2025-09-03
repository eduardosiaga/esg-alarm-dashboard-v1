import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { logger } from './logger';

interface LockFileData {
  pid: number;
  startTime: string;
  hostname: string;
  wsPort: number;
  mqttClientId: string;
  nodeVersion: string;
  platform: string;
}

export class SingletonManager {
  private static instance: SingletonManager;
  private lockFilePath: string;
  private isLocked: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Use app root directory for lock file
    this.lockFilePath = path.resolve(process.cwd(), 'server.lock');
  }

  public static getInstance(): SingletonManager {
    if (!SingletonManager.instance) {
      SingletonManager.instance = new SingletonManager();
    }
    return SingletonManager.instance;
  }

  /**
   * Acquire lock for the server instance
   * @returns true if lock acquired, false if another instance is running
   */
  public async acquireLock(wsPort: number = 8888, mqttClientId?: string): Promise<boolean> {
    try {
      // Check if lock file exists
      if (fs.existsSync(this.lockFilePath)) {
        logger.warn('Lock file found, checking if process is still active...');
        
        const lockData = this.readLockFile();
        if (lockData && this.isProcessRunning(lockData.pid)) {
          logger.error(`❌ Server is already running!`, {
            pid: lockData.pid,
            startTime: lockData.startTime,
            wsPort: lockData.wsPort,
            hostname: lockData.hostname
          });
          
          // Additional check: Try to connect to the WebSocket port
          if (await this.isPortInUse(lockData.wsPort)) {
            logger.error(`WebSocket server confirmed active on port ${lockData.wsPort}`);
            return false;
          }
          
          logger.warn('Process appears dead but lock exists. Cleaning stale lock...');
        } else {
          logger.info('Previous instance terminated unexpectedly. Cleaning stale lock...');
        }
        
        // Clean stale lock
        this.releaseLock();
      }

      // Create new lock file
      const lockData: LockFileData = {
        pid: process.pid,
        startTime: new Date().toISOString(),
        hostname: require('os').hostname(),
        wsPort: wsPort,
        mqttClientId: mqttClientId || `esg-alarm-server-${process.pid}`,
        nodeVersion: process.version,
        platform: process.platform
      };

      fs.writeFileSync(this.lockFilePath, JSON.stringify(lockData, null, 2));
      this.isLocked = true;

      logger.info('✅ Lock acquired successfully', {
        pid: lockData.pid,
        lockFile: this.lockFilePath
      });

      // Start periodic lock file update to show we're alive
      this.startHeartbeat();

      // Set up cleanup handlers
      this.setupCleanupHandlers();

      return true;
    } catch (error) {
      logger.error('Failed to acquire lock', error);
      return false;
    }
  }

  /**
   * Release the lock file
   */
  public releaseLock(): void {
    try {
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }

      if (fs.existsSync(this.lockFilePath)) {
        const lockData = this.readLockFile();
        
        // Only delete if it's our lock
        if (lockData && lockData.pid === process.pid) {
          fs.unlinkSync(this.lockFilePath);
          logger.info('✅ Lock released successfully');
        } else if (lockData) {
          logger.warn('Lock file exists but belongs to another process', {
            ourPid: process.pid,
            lockPid: lockData.pid
          });
        }
      }
      
      this.isLocked = false;
    } catch (error) {
      logger.error('Error releasing lock', error);
    }
  }

  /**
   * Check if the current instance holds the lock
   */
  public hasLock(): boolean {
    if (!this.isLocked) return false;

    try {
      if (!fs.existsSync(this.lockFilePath)) {
        this.isLocked = false;
        return false;
      }

      const lockData = this.readLockFile();
      return lockData?.pid === process.pid;
    } catch {
      return false;
    }
  }

  /**
   * Get information about the running instance
   */
  public getRunningInstanceInfo(): LockFileData | null {
    try {
      if (fs.existsSync(this.lockFilePath)) {
        return this.readLockFile();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Force remove lock (use with caution)
   */
  public forceReleaseLock(): void {
    try {
      if (fs.existsSync(this.lockFilePath)) {
        fs.unlinkSync(this.lockFilePath);
        logger.warn('⚠️ Lock forcefully released');
      }
    } catch (error) {
      logger.error('Error force releasing lock', error);
    }
  }

  /**
   * Read and parse lock file
   */
  private readLockFile(): LockFileData | null {
    try {
      const data = fs.readFileSync(this.lockFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading lock file', error);
      return null;
    }
  }

  /**
   * Check if a process is running
   */
  private isProcessRunning(pid: number): boolean {
    try {
      if (process.platform === 'win32') {
        // Windows: Use tasklist command
        try {
          const result = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV`, { 
            encoding: 'utf8',
            windowsHide: true 
          });
          return result.includes(pid.toString());
        } catch {
          return false;
        }
      } else {
        // Unix/Linux/Mac: Send signal 0 to check if process exists
        try {
          process.kill(pid, 0);
          return true;
        } catch {
          return false;
        }
      }
    } catch (error) {
      logger.error('Error checking process status', error);
      return false;
    }
  }

  /**
   * Check if a port is in use
   */
  private async isPortInUse(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (process.platform === 'win32') {
        try {
          const result = execSync(`netstat -ano | findstr :${port}`, { 
            encoding: 'utf8',
            windowsHide: true 
          });
          resolve(result.includes(`:${port}`));
        } catch {
          resolve(false);
        }
      } else {
        try {
          const result = execSync(`lsof -i:${port}`, { encoding: 'utf8' });
          resolve(result.length > 0);
        } catch {
          resolve(false);
        }
      }
    });
  }

  /**
   * Update lock file periodically to show we're alive
   */
  private startHeartbeat(): void {
    // Update lock file every 30 seconds
    this.checkInterval = setInterval(() => {
      try {
        if (this.isLocked && fs.existsSync(this.lockFilePath)) {
          const lockData = this.readLockFile();
          if (lockData && lockData.pid === process.pid) {
            // Just touch the file to update modified time
            const now = new Date();
            fs.utimesSync(this.lockFilePath, now, now);
          }
        }
      } catch (error) {
        logger.error('Error updating lock heartbeat', error);
      }
    }, 30000);
  }

  /**
   * Set up process cleanup handlers
   */
  private setupCleanupHandlers(): void {
    const cleanup = (signal: string) => {
      logger.info(`Received ${signal}, cleaning up...`);
      this.releaseLock();
    };

    // Handle various termination signals
    process.once('SIGINT', () => cleanup('SIGINT'));
    process.once('SIGTERM', () => cleanup('SIGTERM'));
    process.once('SIGUSR1', () => cleanup('SIGUSR1'));
    process.once('SIGUSR2', () => cleanup('SIGUSR2'));
    
    // Handle uncaught errors
    process.once('uncaughtException', (error) => {
      logger.error('Uncaught exception, cleaning up...', error);
      this.releaseLock();
      process.exit(1);
    });

    process.once('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection, cleaning up...', { reason, promise });
      this.releaseLock();
      process.exit(1);
    });

    // Clean exit
    process.once('exit', () => {
      this.releaseLock();
    });

    // Windows-specific handlers
    if (process.platform === 'win32') {
      process.once('SIGBREAK', () => cleanup('SIGBREAK'));
    }
  }

  /**
   * Kill the running instance (if any)
   */
  public async killRunningInstance(): Promise<boolean> {
    try {
      const lockData = this.readLockFile();
      if (!lockData) {
        logger.info('No running instance found');
        return false;
      }

      if (!this.isProcessRunning(lockData.pid)) {
        logger.info('Process is not running, cleaning stale lock');
        this.forceReleaseLock();
        return true;
      }

      logger.warn(`Attempting to kill process ${lockData.pid}...`);

      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${lockData.pid}`, { windowsHide: true });
      } else {
        process.kill(lockData.pid, 'SIGTERM');
        
        // Wait a bit for graceful shutdown
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Force kill if still running
        if (this.isProcessRunning(lockData.pid)) {
          process.kill(lockData.pid, 'SIGKILL');
        }
      }

      // Clean up lock file
      this.forceReleaseLock();
      
      logger.info(`✅ Successfully killed process ${lockData.pid}`);
      return true;
    } catch (error) {
      logger.error('Error killing running instance', error);
      return false;
    }
  }
}

export default SingletonManager.getInstance();