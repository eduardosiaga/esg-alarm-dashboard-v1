import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Token payload interfaces
export interface AccessTokenPayload {
  sub: string;           // User ID
  email: string;         // User email
  name: string;          // User name
  role: string;          // SUPERADMIN | ADMIN | OPERATOR | VIEWER
  accountId: number;     // Parent account ID
  permissions: string[]; // Global permissions
  sessionId: string;     // Session UUID
  iat?: number;          // Issued at
  exp?: number;          // Expires at
}

export interface RefreshTokenPayload {
  sub: string;           // User ID
  sessionId: string;     // Session UUID
  fingerprint?: string;  // Device fingerprint for persistent sessions
  rememberMe: boolean;   // Extended expiration flag
  iat?: number;
  exp?: number;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  accountId: number;
  permissions?: string[];
}

class JWTService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiry: string;
  private readonly refreshExpiry: string;
  private readonly refreshExpiryRemember: string;

  constructor() {
    this.accessSecret = process.env.JWT_SECRET || 'default-access-secret';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
    this.accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    this.refreshExpiryRemember = process.env.JWT_REFRESH_EXPIRY_REMEMBER || '30d';
  }

  /**
   * Generate access token
   */
  generateAccessToken(user: UserProfile, sessionId: string): string {
    const payload: AccessTokenPayload = {
      sub: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      accountId: user.accountId,
      permissions: user.permissions || [],
      sessionId
    };

    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiry as any
    });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(
    user: UserProfile, 
    sessionId: string, 
    rememberMe: boolean = false,
    fingerprint?: string
  ): string {
    const payload: RefreshTokenPayload = {
      sub: user.id.toString(),
      sessionId,
      fingerprint,
      rememberMe
    };

    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: (rememberMe ? this.refreshExpiryRemember : this.refreshExpiry) as any
    });
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return jwt.verify(token, this.accessSecret) as AccessTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  decodeToken(token: string): AccessTokenPayload | RefreshTokenPayload | null {
    return jwt.decode(token) as AccessTokenPayload | RefreshTokenPayload | null;
  }

  /**
   * Hash token for storage (only store hashes in database)
   */
  hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Generate device fingerprint from request
   */
  generateDeviceFingerprint(
    userAgent: string | undefined,
    ipAddress: string | undefined,
    acceptHeaders: string | undefined
  ): string {
    const data = `${userAgent || 'unknown'}:${ipAddress || 'unknown'}:${acceptHeaders || 'unknown'}`;
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  /**
   * Generate session ID
   */
  generateSessionId(): string {
    return crypto.randomUUID();
  }
}

export const jwtService = new JWTService();