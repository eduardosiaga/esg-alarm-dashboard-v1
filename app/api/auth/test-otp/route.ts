import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email('Invalid email address')
});

// Simple OTP generator for testing
function generateOTP(): string {
  // TEMPORAL: OTP hardcodeado para desarrollo - ELIMINAR EN PRODUCCIÓN
  return '742503';
  // return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
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

    // Check if user exists - Prisma uses camelCase for models
    const user = await prisma.userProfile.findUnique({
      where: { email }
    });

    if (!user) {
      // For security, still return success
      return NextResponse.json({
        message: 'If the email exists, an OTP has been sent.',
        expiresIn: 10
      });
    }

    // Check if user is approved and active
    if (!user.isApproved || !user.isActive) {
      return NextResponse.json({
        message: 'If the email exists, an OTP has been sent.',
        expiresIn: 10
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTP for this email
    await prisma.authOtp.deleteMany({
      where: { email }
    });

    // Store new OTP
    await prisma.authOtp.create({
      data: {
        email,
        code: otp,
        expiresAt: expiresAt,
        attempts: 0,
        verified: false
      }
    });

    console.log(`📧 OTP for ${email}: ${otp}`);
    console.log('Since email is not configured, use the OTP shown in the console.');

    return NextResponse.json({
      message: 'OTP sent successfully (check console for now)',
      expiresIn: 10,
      // For testing only - remove in production!
      testOTP: otp
    });

  } catch (error: any) {
    console.error('Failed to process OTP request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}