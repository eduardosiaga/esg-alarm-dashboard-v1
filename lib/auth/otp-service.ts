import crypto from 'crypto';
import { prisma } from '../db/prisma';
import { logger } from '../utils/logger';

class OTPService {
  private readonly otpLength: number = 6;
  private readonly expiryMinutes: number;
  private readonly maxAttempts: number;

  constructor() {
    this.expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
    this.maxAttempts = parseInt(process.env.MAX_OTP_ATTEMPTS || '5');
  }

  /**
   * Generate a 6-digit OTP code
   */
  generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    
    for (let i = 0; i < this.otpLength; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex];
    }
    
    return otp;
  }

  /**
   * Store OTP in database
   */
  async storeOTP(email: string, code: string): Promise<void> {
    try {
      // Delete any existing OTP for this email
      await prisma.authOtp.deleteMany({
        where: { email }
      });

      // Create new OTP record
      await prisma.authOtp.create({
        data: {
          email,
          code,
          expiresAt: new Date(Date.now() + this.expiryMinutes * 60 * 1000),
          attempts: 0,
          verified: false
        }
      });

      logger.info(`OTP stored for email: ${email}`);
    } catch (error) {
      logger.error('Failed to store OTP', error);
      throw new Error('Failed to store OTP code');
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    try {
      // Find the OTP record
      const otpRecord = await prisma.authOtp.findFirst({
        where: {
          email,
          expiresAt: {
            gt: new Date()
          },
          verified: false
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!otpRecord) {
        logger.warn(`No valid OTP found for email: ${email}`);
        return false;
      }

      // Check if max attempts exceeded
      if (otpRecord.attempts >= this.maxAttempts) {
        logger.warn(`Max OTP attempts exceeded for email: ${email}`);
        return false;
      }

      // Increment attempts
      await prisma.authOtp.update({
        where: { id: otpRecord.id },
        data: {
          attempts: {
            increment: 1
          }
        }
      });

      // Verify the code
      if (otpRecord.code === code) {
        // Mark as verified
        await prisma.authOtp.update({
          where: { id: otpRecord.id },
          data: {
            verified: true
          }
        });

        logger.info(`OTP verified successfully for email: ${email}`);
        return true;
      }

      logger.warn(`Invalid OTP code for email: ${email}`);
      return false;
    } catch (error) {
      logger.error('Failed to verify OTP', error);
      throw new Error('Failed to verify OTP code');
    }
  }

  /**
   * Clean up expired OTP codes
   */
  async cleanupExpiredOTPs(): Promise<void> {
    try {
      const result = await prisma.authOtp.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      if (result.count > 0) {
        logger.info(`Cleaned up ${result.count} expired OTP codes`);
      }
    } catch (error) {
      logger.error('Failed to cleanup expired OTPs', error);
    }
  }

  /**
   * Check if email has recent OTP request (rate limiting)
   */
  async hasRecentOTPRequest(email: string, windowMinutes: number = 1): Promise<boolean> {
    try {
      const recentOTP = await prisma.authOtp.findFirst({
        where: {
          email,
          createdAt: {
            gt: new Date(Date.now() - windowMinutes * 60 * 1000)
          }
        }
      });

      return !!recentOTP;
    } catch (error) {
      logger.error('Failed to check recent OTP request', error);
      return false;
    }
  }

  /**
   * Get OTP attempts count for email
   */
  async getAttemptsCount(email: string): Promise<number> {
    try {
      const otpRecord = await prisma.authOtp.findFirst({
        where: {
          email,
          expiresAt: {
            gt: new Date()
          },
          verified: false
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return otpRecord?.attempts || 0;
    } catch (error) {
      logger.error('Failed to get OTP attempts count', error);
      return 0;
    }
  }
}

export const otpService = new OTPService();