import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { gmailService } from '@/lib/email/gmail-service';
import { logger } from '@/lib/utils/logger';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  accountName: z.string().optional()
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

    const { email, name, accountName } = validation.data;
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Check if email already exists
    const existingUser = await prisma.userProfile.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if this is the first user
    const userCount = await prisma.userProfile.count();
    const isFirstUser = userCount === 0;

    let newUser;

    if (isFirstUser) {
      // First user becomes SUPERADMIN with auto-approval
      // Create default account for SUPERADMIN
      const defaultAccount = await prisma.authAccount.create({
        data: {
          name: accountName || 'Main Account'
        }
      });

      newUser = await prisma.userProfile.create({
        data: {
          email,
          name,
          role: 'SUPERADMIN',
          isActive: true,
          isApproved: true,
          accountId: defaultAccount.id
        }
      });

      logger.info(`First user registered as SUPERADMIN: ${email}`);
      
      // Send welcome email (no approval needed)
      await gmailService.sendApprovalEmail(email, name);

    } else {
      // Regular user registration - requires approval
      newUser = await prisma.userProfile.create({
        data: {
          email,
          name,
          role: 'VIEWER', // Default role for new users
          isActive: false, // Inactive until approved
          isApproved: false // Requires admin approval
        }
      });

      logger.info(`New user registered (pending approval): ${email}`);
      
      // Send account created notification
      await gmailService.sendAccountCreatedEmail(email, name);
      
      // Notify admins about new registration
      const admins = await prisma.userProfile.findMany({
        where: {
          role: {
            in: ['SUPERADMIN', 'ADMIN']
          },
          isActive: true
        }
      });

      // TODO: Send notification to admins about pending approval
      logger.info(`Notified ${admins.length} admins about new user registration`);
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        accountId: newUser.accountId,
        action: 'user_registered',
        entityType: 'user',
        entityId: newUser.id,
        ipAddress: clientIp,
        newValues: {
          email,
          name,
          role: newUser.role,
          isFirstUser
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: isFirstUser 
        ? 'Registration successful! You can now login.'
        : 'Registration successful! Your account is pending approval.',
      requiresApproval: !isFirstUser
    });

  } catch (error) {
    logger.error('Failed to register user', error);
    return NextResponse.json(
      { error: 'Failed to register. Please try again.' },
      { status: 500 }
    );
  }
}