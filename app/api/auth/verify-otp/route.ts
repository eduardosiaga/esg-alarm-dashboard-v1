import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UserProfile } from '@/lib/auth/jwt-service';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  rememberMe: z.boolean().optional().default(false),
  deviceFingerprint: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Lazy load services to prevent initialization errors
    const { prisma } = await import('@/lib/db/prisma');
    const { rateLimiter } = await import('@/lib/auth/rate-limiter');
    const { otpService } = await import('@/lib/auth/otp-service');
    const { sessionManager } = await import('@/lib/auth/session-manager');
    const { logger } = await import('@/lib/utils/logger');
    
    const body = await request.json();
    
    // Validate request
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, otp, rememberMe, deviceFingerprint } = validation.data;
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Check rate limit
    const rateLimit = await rateLimiter.checkRateLimit(email);
    if (!rateLimit.allowed) {
      const blockedMinutes = rateLimit.blockedUntil 
        ? Math.ceil((rateLimit.blockedUntil.getTime() - Date.now()) / 60000)
        : 0;
        
      logger.warn(`OTP verification blocked for ${email}`);
      return NextResponse.json(
        { 
          error: `Too many failed attempts. Account blocked for ${blockedMinutes} minutes.`,
          blockedUntil: rateLimit.blockedUntil
        },
        { status: 429 }
      );
    }

    // Verify OTP
    const isValid = await otpService.verifyOTP(email, otp);
    
    if (!isValid) {
      // Increment rate limit attempts
      await rateLimiter.incrementAttempts(email);
      
      // Get remaining attempts
      const attemptsCount = await otpService.getAttemptsCount(email);
      const maxAttempts = parseInt(process.env.MAX_OTP_ATTEMPTS || '5');
      const remaining = maxAttempts - attemptsCount;
      
      logger.warn(`Invalid OTP for ${email}. Attempts: ${attemptsCount}`);
      
      return NextResponse.json(
        { 
          error: 'Invalid or expired OTP',
          attemptsRemaining: remaining
        },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.userProfile.findUnique({
      where: { email },
      include: {
        permissions: true
      }
    });

    if (!user) {
      logger.error(`User not found after OTP verification: ${email}`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn(`Inactive user attempted login: ${email}`);
      return NextResponse.json(
        { error: 'Account is disabled' },
        { status: 403 }
      );
    }

    // Reset rate limit attempts on successful verification
    await rateLimiter.resetAttempts(email);

    // Create user profile for JWT
    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accountId: user.accountId!,
      permissions: user.permissions.map(p => p.permission)
    };

    // Create session
    const session = await sessionManager.createSession(userProfile, {
      rememberMe,
      deviceFingerprint,
      ipAddress: clientIp,
      userAgent
    });

    // Update last login
    await prisma.userProfile.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date()
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        accountId: user.accountId,
        action: 'login_success',
        entityType: 'auth',
        entityId: user.id,
        ipAddress: clientIp,
        newValues: {
          sessionId: session.id,
          rememberMe,
          deviceFingerprint: deviceFingerprint || null
        }
      }
    });

    logger.info(`User logged in successfully: ${email}`);

    // Set secure HTTP-only cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions.map(p => p.permission)
      },
      session: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        refreshExpiresAt: session.refreshExpiresAt
      }
    });

    // Set cookies for tokens
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/'
    };

    response.cookies.set('access_token', session.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 // 15 minutes
    });

    response.cookies.set('refresh_token', session.refreshToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days or 7 days
    });

    return response;

  } catch (error) {
    console.error('Failed to verify OTP', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}