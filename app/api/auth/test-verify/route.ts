import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import { sessionManager } from '@/lib/auth/session-manager';
import { UserProfile } from '@/lib/auth/jwt-service';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  rememberMe: z.boolean().optional().default(false),
  deviceFingerprint: z.string().optional()
});



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, otp, rememberMe } = validation.data;

    // Verify OTP
    const otpRecord = await prisma.authOtp.findFirst({
      where: {
        email,
        code: otp,
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
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is disabled' },
        { status: 403 }
      );
    }

    // Mark OTP as verified
    await prisma.authOtp.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    // Update last login
    await prisma.userProfile.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date()
      }
    });

    // Create user profile for session
    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accountId: user.accountId!,
      permissions: user.permissions.map(p => p.permission)
    };

    // Create session using session manager
    const session = await sessionManager.createSession(userProfile, {
      rememberMe,
      deviceFingerprint: validation.data.deviceFingerprint,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined
    });

    console.log(`✅ User ${email} logged in successfully`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountId: user.accountId,
        permissions: user.permissions.map(p => p.permission)
      },
      session: {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        refreshExpiresAt: session.refreshExpiresAt
      }
    });

  } catch (error: any) {
    console.error('Failed to verify OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}