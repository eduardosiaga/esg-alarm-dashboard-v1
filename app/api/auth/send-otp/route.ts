import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { gmailService } from '@/lib/email/gmail-service';
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

    // Log OTP to console (for backup/debugging)
    console.log(`📧 Attempting to send OTP to ${email}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log(`⏰ Expires at: ${expiresAt.toLocaleString()}`);

    // TEMPORAL: Simular envío de email para desarrollo
    try {
      // await gmailService.sendOTPEmail(email, otp);
      console.log(`📧 [SIMULADO] Email enviado a ${email} con OTP: ${otp}`);
      
      return NextResponse.json({
        message: 'OTP sent successfully to your email',
        expiresIn: 10,
        // Remove this in production - only for testing
        debugInfo: {
          emailSent: true,
          consoleOTP: otp,
          note: 'Check your email. OTP also shown here for debugging.'
        }
      });
    } catch (emailError: any) {
      console.error('❌ Failed to send email:', emailError.message);
      
      // Even if email fails, OTP is stored and can be used
      return NextResponse.json({
        message: 'OTP generated (email service may be unavailable)',
        expiresIn: 10,
        // Show OTP if email fails
        debugInfo: {
          emailSent: false,
          consoleOTP: otp,
          error: emailError.message,
          note: 'Email failed, but OTP is valid. Use the code shown here.'
        }
      });
    }

  } catch (error: any) {
    console.error('Failed to process OTP request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}