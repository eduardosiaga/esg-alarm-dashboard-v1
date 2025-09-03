import { prisma } from '../db/prisma';
import { logger } from '../utils/logger';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  blockedUntil?: Date;
}

class RateLimiter {
  private readonly windowMinutes: number;
  private readonly maxAttempts: number;
  private readonly blockDurationMinutes: number;

  constructor() {
    this.windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '60');
    this.maxAttempts = parseInt(process.env.MAX_OTP_ATTEMPTS || '5');
    this.blockDurationMinutes = parseInt(process.env.RATE_LIMIT_BLOCK_MINUTES || '60');
  }

  /**
   * Check rate limit for an email
   */
  async checkRateLimit(email: string): Promise<RateLimitResult> {
    try {
      const now = new Date();
      
      // Check if user is currently blocked
      const existingLimit = await prisma.authRateLimit.findFirst({
        where: {
          email,
          blockedUntil: {
            gt: now
          }
        }
      });

      if (existingLimit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: existingLimit.blockedUntil!,
          blockedUntil: existingLimit.blockedUntil!
        };
      }

      // Get attempts in current window
      const windowStart = new Date(now.getTime() - this.windowMinutes * 60 * 1000);
      
      const recentLimit = await prisma.authRateLimit.findFirst({
        where: {
          email,
          windowStart: {
            gte: windowStart
          }
        }
      });

      if (!recentLimit) {
        // First attempt in this window
        return {
          allowed: true,
          remaining: this.maxAttempts - 1,
          resetAt: new Date(now.getTime() + this.windowMinutes * 60 * 1000)
        };
      }

      // Check if max attempts exceeded
      if (recentLimit.attemptCount >= this.maxAttempts) {
        // Block the user
        const blockedUntil = new Date(now.getTime() + this.blockDurationMinutes * 60 * 1000);
        
        await prisma.authRateLimit.update({
          where: { id: recentLimit.id },
          data: {
            blockedUntil: blockedUntil
          }
        });

        logger.warn(`Rate limit exceeded for email: ${email}`, {
          attempts: recentLimit.attemptCount,
          blockedUntil
        });

        return {
          allowed: false,
          remaining: 0,
          resetAt: blockedUntil,
          blockedUntil
        };
      }

      // Still within limits
      const resetAt = new Date(recentLimit.windowStart.getTime() + this.windowMinutes * 60 * 1000);
      
      return {
        allowed: true,
        remaining: this.maxAttempts - recentLimit.attemptCount,
        resetAt
      };
    } catch (error) {
      logger.error('Failed to check rate limit', error);
      // On error, allow the request but log it
      return {
        allowed: true,
        remaining: this.maxAttempts,
        resetAt: new Date(Date.now() + this.windowMinutes * 60 * 1000)
      };
    }
  }

  /**
   * Increment attempts for an email
   */
  async incrementAttempts(email: string): Promise<void> {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() - this.windowMinutes * 60 * 1000);

      // Find or create rate limit record
      const existingLimit = await prisma.authRateLimit.findFirst({
        where: {
          email,
          windowStart: {
            gte: windowStart
          }
        }
      });

      if (existingLimit) {
        // Increment existing record
        await prisma.authRateLimit.update({
          where: { id: existingLimit.id },
          data: {
            attemptCount: {
              increment: 1
            }
          }
        });

        logger.info(`Rate limit incremented for ${email}`, {
          attempts: existingLimit.attemptCount + 1,
          max: this.maxAttempts
        });
      } else {
        // Create new record
        await prisma.authRateLimit.create({
          data: {
            email,
            attemptCount: 1,
            windowStart: now
          }
        });

        logger.info(`Rate limit started for ${email}`, {
          attempts: 1,
          max: this.maxAttempts
        });
      }
    } catch (error) {
      logger.error('Failed to increment rate limit attempts', error);
    }
  }

  /**
   * Reset attempts for an email (e.g., after successful login)
   */
  async resetAttempts(email: string): Promise<void> {
    try {
      await prisma.authRateLimit.deleteMany({
        where: { email }
      });

      logger.info(`Rate limit reset for ${email}`);
    } catch (error) {
      logger.error('Failed to reset rate limit attempts', error);
    }
  }

  /**
   * Block a user for a specific duration
   */
  async blockUser(email: string, durationMinutes: number): Promise<void> {
    try {
      const now = new Date();
      const blockedUntil = new Date(now.getTime() + durationMinutes * 60 * 1000);

      // Find existing record or create new one
      const existingLimit = await prisma.authRateLimit.findFirst({
        where: { email }
      });

      if (existingLimit) {
        await prisma.authRateLimit.update({
          where: { id: existingLimit.id },
          data: {
            blockedUntil: blockedUntil,
            attemptCount: this.maxAttempts
          }
        });
      } else {
        await prisma.authRateLimit.create({
          data: {
            email,
            attemptCount: this.maxAttempts,
            windowStart: now,
            blockedUntil: blockedUntil
          }
        });
      }

      logger.warn(`User blocked: ${email}`, { blockedUntil, durationMinutes });
    } catch (error) {
      logger.error('Failed to block user', error);
    }
  }

  /**
   * Check if IP address is rate limited
   */
  async checkIPRateLimit(ipAddress: string, maxRequests: number = 100): Promise<RateLimitResult> {
    // This is a simplified IP rate limiting
    // In production, you might want to use Redis or a more sophisticated solution
    try {
      const windowStart = new Date(Date.now() - 15 * 60 * 1000); // 15 minute window
      
      // Count requests from this IP in the last 15 minutes
      const requestCount = await prisma.auditLog.count({
        where: {
          ipAddress: ipAddress,
          createdAt: {
            gte: windowStart
          }
        }
      });

      const remaining = Math.max(0, maxRequests - requestCount);
      const resetAt = new Date(windowStart.getTime() + 15 * 60 * 1000);

      return {
        allowed: requestCount < maxRequests,
        remaining,
        resetAt
      };
    } catch (error) {
      logger.error('Failed to check IP rate limit', error);
      return {
        allowed: true,
        remaining: maxRequests,
        resetAt: new Date(Date.now() + 15 * 60 * 1000)
      };
    }
  }

  /**
   * Clean up old rate limit records
   */
  async cleanupOldRecords(): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

      const result = await prisma.authRateLimit.deleteMany({
        where: {
          windowStart: {
            lt: cutoffDate
          },
          OR: [
            { blockedUntil: null },
            { blockedUntil: { lt: new Date() } }
          ]
        }
      });

      if (result.count > 0) {
        logger.info(`Cleaned up ${result.count} old rate limit records`);
      }
    } catch (error) {
      logger.error('Failed to cleanup old rate limit records', error);
    }
  }
}

export const rateLimiter = new RateLimiter();