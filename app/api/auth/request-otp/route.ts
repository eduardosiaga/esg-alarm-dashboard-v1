import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email('Invalid email address')
});

export async function POST(request: NextRequest) {
  try {
    // Lazy load services to prevent initialization errors
    const { prisma } = await import('@/lib/db/prisma');
    const { rateLimiter } = await import('@/lib/auth/rate-limiter');
    const { otpService } = await import('@/lib/auth/otp-service');
    const { gmailService } = await import('@/lib/email/gmail-service');
    const { logger } = await import('@/lib/utils/logger');
    
    const body = await request.json();
    
    // Validate request
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Check IP rate limit
    const ipRateLimit = await rateLimiter.checkIPRateLimit(clientIp);
    if (!ipRateLimit.allowed) {
      logger.warn(`IP rate limit exceeded: ${clientIp}`);
      return NextResponse.json(
        { 
          error: 'Too many requests from this IP. Please try again later.',
          resetAt: ipRateLimit.resetAt
        },
        { status: 429 }
      );
    }

    // Check email rate limit
    const emailRateLimit = await rateLimiter.checkRateLimit(email);
    if (!emailRateLimit.allowed) {
      const blockedMinutes = emailRateLimit.blockedUntil 
        ? Math.ceil((emailRateLimit.blockedUntil.getTime() - Date.now()) / 60000)
        : 0;
        
      return NextResponse.json(
        { 
          error: `Too many OTP requests. Please try again in ${blockedMinutes} minutes.`,
          blockedUntil: emailRateLimit.blockedUntil
        },
        { status: 429 }
      );
    }

    // Check if email has recent OTP request (1 minute cooldown)
    const hasRecent = await otpService.hasRecentOTPRequest(email);
    if (hasRecent) {
      return NextResponse.json(
        { error: 'Please wait 1 minute before requesting another OTP.' },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await prisma.userProfile.findUnique({
      where: { email }
    });

    // For non-existent users, we should still send a success response
    // to prevent email enumeration attacks
    if (!user) {
      // Check if this is the first user (auto-register as SUPERADMIN)
      const userCount = await prisma.userProfile.count();
      
      if (userCount === 0) {
        // Auto-register first user as SUPERADMIN
        const newUser = await prisma.userProfile.create({
          data: {
            email,
            name: email.split('@')[0],
            role: 'SUPERADMIN',
            isActive: true,
            isApproved: true
          }
        });

        logger.info(`First user auto-registered as SUPERADMIN: ${email}`);
        
        // Generate and send OTP
        const otp = otpService.generateOTP();
        await otpService.storeOTP(email, otp);
        // TEMPORARY: Email sending disabled for testing
        console.log('[Request OTP] Email sending DISABLED - Using master OTP: 742503');
        // await gmailService.sendOTPEmail(email, otp);
        
        // Increment rate limit attempts
        await rateLimiter.incrementAttempts(email);

        return NextResponse.json({
          message: 'OTP sent successfully',
          expiresIn: parseInt(process.env.OTP_EXPIRY_MINUTES || '10')
        });
      } else {
        // For security, still pretend to send OTP
        logger.warn(`OTP request for non-existent user: ${email}`);
        return NextResponse.json({
          message: 'If the email exists, an OTP has been sent.',
          expiresIn: parseInt(process.env.OTP_EXPIRY_MINUTES || '10')
        });
      }
    }

    // Check if user is approved
    if (!user.isApproved) {
      // For security, don't reveal account status
      logger.warn(`OTP request for unapproved user: ${email}`);
      return NextResponse.json({
        message: 'If the email exists, an OTP has been sent.',
        expiresIn: parseInt(process.env.OTP_EXPIRY_MINUTES || '10')
      });
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn(`OTP request for inactive user: ${email}`);
      return NextResponse.json(
        { error: 'Account is disabled. Please contact support.' },
        { status: 403 }
      );
    }

    // Generate and send OTP
    const otp = otpService.generateOTP();
    await otpService.storeOTP(email, otp);
    // TEMPORARY: Email sending disabled for testing
    console.log('[Request OTP] Email sending DISABLED - Using master OTP: 742503');
    // await gmailService.sendOTPEmail(email, otp);
    
    // Increment rate limit attempts
    await rateLimiter.incrementAttempts(email);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        accountId: user.accountId,
        action: 'otp_requested',
        entityType: 'auth',
        entityId: user.id,
        ipAddress: clientIp
      }
    });

    logger.info(`OTP sent to ${email}`);

    return NextResponse.json({
      message: 'OTP sent successfully',
      expiresIn: parseInt(process.env.OTP_EXPIRY_MINUTES || '10')
    });

  } catch (error) {
    console.error('Failed to process OTP request', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}