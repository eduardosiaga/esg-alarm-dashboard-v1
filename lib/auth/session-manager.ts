import { prisma } from '../db/prisma';
import { jwtService, UserProfile } from './jwt-service';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export interface SessionOptions {
  rememberMe: boolean;
  deviceFingerprint?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Session {
  id: string;
  userId: number;
  accessToken: string;
  refreshToken: string;
  deviceFingerprint?: string;
  rememberMe: boolean;
  expiresAt: Date;
  refreshExpiresAt: Date;
}

export interface SessionInfo {
  id: string;
  userId: number;
  deviceFingerprint?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
}

class SessionManager {
  private readonly sessionCheckInterval: number;

  constructor() {
    this.sessionCheckInterval = parseInt(process.env.SESSION_CHECK_INTERVAL || '60000');
    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Create a new session
   */
  async createSession(
    user: UserProfile,
    options: SessionOptions
  ): Promise<Session> {
    try {
      const sessionId = jwtService.generateSessionId();
      
      // Generate tokens
      const accessToken = jwtService.generateAccessToken(user, sessionId);
      const refreshToken = jwtService.generateRefreshToken(
        user,
        sessionId,
        options.rememberMe,
        options.deviceFingerprint
      );

      // Calculate expiration times
      const accessExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      const refreshExpiry = options.rememberMe
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Store session in database
      await prisma.authSession.create({
        data: {
          id: sessionId,
          userId: user.id,
          accessTokenHash: jwtService.hashToken(accessToken),
          refreshTokenHash: jwtService.hashToken(refreshToken),
          deviceFingerprint: options.deviceFingerprint,
          rememberMe: options.rememberMe,
          expiresAt: accessExpiry,
          refreshExpiresAt: refreshExpiry,
          ipAddress: options.ipAddress,
          userAgent: options.userAgent,
          lastActivity: new Date(),
          revokedAt: null
        }
      });

      // Create audit log
      await this.createAuditLog(user.id, 'login', {
        sessionId,
        rememberMe: options.rememberMe,
        ipAddress: options.ipAddress
      });

      logger.info(`Session created for user ${user.email}`, { sessionId });

      return {
        id: sessionId,
        userId: user.id,
        accessToken,
        refreshToken,
        deviceFingerprint: options.deviceFingerprint,
        rememberMe: options.rememberMe,
        expiresAt: accessExpiry,
        refreshExpiresAt: refreshExpiry
      };
    } catch (error) {
      logger.error('Failed to create session', error);
      throw new Error('Failed to create session');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshSession(refreshToken: string, deviceFingerprint?: string): Promise<{
    accessToken: string;
    expiresIn: number;
    sessionId: string;
    userId: number;
  }> {
    try {
      // Verify refresh token
      const payload = jwtService.verifyRefreshToken(refreshToken);
      
      // Find session
      const session = await prisma.authSession.findUnique({
        where: {
          id: payload.sessionId,
          revokedAt: null
        }
      });

      if (!session) {
        throw new Error('Session not found or has been revoked');
      }

      // Verify refresh token hash
      const tokenHash = jwtService.hashToken(refreshToken);
      if (session.refreshTokenHash !== tokenHash) {
        throw new Error('Invalid refresh token');
      }

      // Check if refresh token has expired
      if (session.refreshExpiresAt < new Date()) {
        throw new Error('Refresh token has expired');
      }

      // Verify device fingerprint if present
      if (session.deviceFingerprint && deviceFingerprint) {
        if (session.deviceFingerprint !== deviceFingerprint) {
          logger.warn('Device fingerprint mismatch', {
            sessionId: session.id,
            expected: session.deviceFingerprint,
            received: deviceFingerprint
          });
          throw new Error('Device fingerprint mismatch');
        }
      }

      // Get user
      const user = await prisma.userProfile.findUnique({
        where: { id: session.userId },
        include: {
          permissions: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access token
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountId: user.accountId!,
        permissions: user.permissions.map(p => p.permission)
      };

      const newAccessToken = jwtService.generateAccessToken(userProfile, session.id);
      const newAccessExpiry = new Date(Date.now() + 15 * 60 * 1000);

      // Update session
      await prisma.authSession.update({
        where: { id: session.id },
        data: {
          accessTokenHash: jwtService.hashToken(newAccessToken),
          expiresAt: newAccessExpiry,
          lastActivity: new Date()
        }
      });

      logger.info('Session refreshed', { sessionId: session.id, userId: user.id });

      return {
        accessToken: newAccessToken,
        expiresIn: 900, // 15 minutes in seconds
        sessionId: session.id,
        userId: user.id
      };
    } catch (error) {
      logger.error('Failed to refresh session', error);
      throw error;
    }
  }

  /**
   * Revoke a session
   */
  async revokeSession(sessionId: string, userId?: number): Promise<void> {
    try {
      const session = await prisma.authSession.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // If userId is provided, verify it matches
      if (userId && session.userId !== userId) {
        throw new Error('Unauthorized to revoke this session');
      }

      // Revoke the session
      await prisma.authSession.update({
        where: { id: sessionId },
        data: {
          revokedAt: new Date()
        }
      });

      // Create audit log
      await this.createAuditLog(session.userId, 'logout', { sessionId });

      logger.info('Session revoked', { sessionId, userId: session.userId });
    } catch (error) {
      logger.error('Failed to revoke session', error);
      throw error;
    }
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllUserSessions(userId: number, exceptSessionId?: string): Promise<void> {
    try {
      const whereClause: any = {
        userId: userId,
        revokedAt: null
      };

      if (exceptSessionId) {
        whereClause.id = { not: exceptSessionId };
      }

      const result = await prisma.authSession.updateMany({
        where: whereClause,
        data: {
          revokedAt: new Date()
        }
      });

      logger.info(`Revoked ${result.count} sessions for user ${userId}`);
    } catch (error) {
      logger.error('Failed to revoke user sessions', error);
      throw error;
    }
  }

  /**
   * Get active sessions for a user
   */
  async getActiveSessionsForUser(userId: number): Promise<SessionInfo[]> {
    try {
      const sessions = await prisma.authSession.findMany({
        where: {
          userId: userId,
          revokedAt: null,
          refreshExpiresAt: {
            gt: new Date()
          }
        },
        orderBy: {
          lastActivity: 'desc'
        }
      });

      return sessions.map(session => ({
        id: session.id,
        userId: session.userId,
        deviceFingerprint: session.deviceFingerprint || undefined,
        ipAddress: session.ipAddress || undefined,
        userAgent: session.userAgent || undefined,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        expiresAt: session.refreshExpiresAt
      }));
    } catch (error) {
      logger.error('Failed to get active sessions', error);
      throw error;
    }
  }

  /**
   * Validate session
   */
  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const session = await prisma.authSession.findUnique({
        where: {
          id: sessionId,
          revokedAt: null
        }
      });

      if (!session) {
        return false;
      }

      // Check if session has expired
      if (session.refreshExpiresAt < new Date()) {
        // Revoke expired session
        await this.revokeSession(sessionId);
        return false;
      }

      // Update last activity
      await prisma.authSession.update({
        where: { id: sessionId },
        data: {
          lastActivity: new Date()
        }
      });

      return true;
    } catch (error) {
      logger.error('Failed to validate session', error);
      return false;
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    try {
      // Revoke sessions where refresh token has expired
      const result = await prisma.authSession.updateMany({
        where: {
          refreshExpiresAt: {
            lt: new Date()
          },
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      });

      if (result.count > 0) {
        logger.info(`Cleaned up ${result.count} expired sessions`);
      }

      // Delete very old revoked sessions (older than 90 days)
      const deleteResult = await prisma.authSession.deleteMany({
        where: {
          revokedAt: {
            lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          }
        }
      });

      if (deleteResult.count > 0) {
        logger.info(`Deleted ${deleteResult.count} old revoked sessions`);
      }
    } catch (error) {
      logger.error('Failed to cleanup expired sessions', error);
    }
  }

  /**
   * Create audit log entry
   */
  private async createAuditLog(
    userId: number,
    action: string,
    details: any
  ): Promise<void> {
    try {
      const user = await prisma.userProfile.findUnique({
        where: { id: userId }
      });

      await prisma.auditLog.create({
        data: {
          userId: userId,
          accountId: user?.accountId,
          action,
          entityType: 'session',
          entityId: userId,
          newValues: details
        }
      });
    } catch (error) {
      logger.error('Failed to create audit log', error);
      // Don't throw - audit logging failure shouldn't break the operation
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpiredSessions().catch(error => {
        logger.error('Session cleanup interval error', error);
      });
    }, this.sessionCheckInterval);
  }
}

export const sessionManager = new SessionManager();