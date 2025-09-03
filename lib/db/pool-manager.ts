import { PrismaClient } from '@prisma/client'
import prisma from './prisma'

export interface PoolConfig {
  minConnections: number
  maxConnections: number
  acquireTimeout: number
  idleTimeout: number
  connectionLimit: number
}

export interface PoolMetrics {
  totalConnections: number
  activeConnections: number
  idleConnections: number
  pendingAcquires: number
  totalAcquireTime: number
  averageAcquireTime: number
  errors: number
  lastError?: string
  timestamp: Date
}

export class ConnectionPoolManager {
  private config: PoolConfig
  private metrics: PoolMetrics
  private healthCheckInterval?: NodeJS.Timeout
  private metricsInterval?: NodeJS.Timeout

  constructor() {
    this.config = {
      minConnections: parseInt(process.env.DATABASE_POOL_MIN || '2'),
      maxConnections: parseInt(process.env.DATABASE_POOL_MAX || '20'),
      acquireTimeout: parseInt(process.env.DATABASE_POOL_ACQUIRE_TIMEOUT || '60000'),
      idleTimeout: parseInt(process.env.DATABASE_POOL_IDLE_TIMEOUT || '10000'),
      connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '100')
    }

    this.metrics = {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      pendingAcquires: 0,
      totalAcquireTime: 0,
      averageAcquireTime: 0,
      errors: 0,
      timestamp: new Date()
    }

    this.startMonitoring()
  }

  private startMonitoring() {
    // Health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      try {
        const start = Date.now()
        await prisma.$queryRaw`SELECT 1`
        const duration = Date.now() - start
        
        if (duration > 1000) {
          console.warn(`⚠️ Slow database health check: ${duration}ms`)
        }
      } catch (error) {
        this.metrics.errors++
        this.metrics.lastError = error instanceof Error ? error.message : 'Unknown error'
        console.error('❌ Database health check failed:', error)
      }
    }, 30000)

    // Metrics collection every 10 seconds
    this.metricsInterval = setInterval(() => {
      this.updateMetrics()
    }, 10000)
  }

  private updateMetrics() {
    // In production with PgBouncer, these would come from PgBouncer stats
    // For now, we track what we can from Prisma
    this.metrics.timestamp = new Date()
    
    // Log metrics if in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Pool Metrics:', {
        config: this.config,
        metrics: this.metrics
      })
    }
  }

  async getMetrics(): Promise<PoolMetrics> {
    return { ...this.metrics }
  }

  getConfig(): PoolConfig {
    return { ...this.config }
  }

  async testConnection(): Promise<boolean> {
    try {
      const start = Date.now()
      await prisma.$queryRaw`SELECT 1`
      const duration = Date.now() - start
      
      this.metrics.totalAcquireTime += duration
      this.metrics.totalConnections++
      this.metrics.averageAcquireTime = 
        this.metrics.totalAcquireTime / this.metrics.totalConnections
      
      return true
    } catch (error) {
      this.metrics.errors++
      this.metrics.lastError = error instanceof Error ? error.message : 'Unknown error'
      return false
    }
  }

  async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    backoff: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        this.metrics.pendingAcquires++
        const result = await fn()
        this.metrics.pendingAcquires--
        this.metrics.activeConnections++
        
        // Simulate connection release after operation
        setTimeout(() => {
          this.metrics.activeConnections--
          this.metrics.idleConnections++
        }, 100)
        
        return result
      } catch (error) {
        this.metrics.pendingAcquires--
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (i < maxRetries - 1) {
          const delay = backoff * Math.pow(2, i)
          console.warn(`⚠️ Database operation failed, retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    this.metrics.errors++
    this.metrics.lastError = lastError?.message
    throw lastError || new Error('Max retries exceeded')
  }

  async warmupConnections(): Promise<void> {
    console.log('🔄 Warming up database connections...')
    const promises: Promise<boolean>[] = []
    
    for (let i = 0; i < this.config.minConnections; i++) {
      promises.push(this.testConnection())
    }
    
    const results = await Promise.all(promises)
    const successful = results.filter(r => r).length
    
    console.log(`✅ Warmed up ${successful}/${this.config.minConnections} connections`)
  }

  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
    }
  }
}

// Export singleton instance
export const poolManager = new ConnectionPoolManager()
export default poolManager