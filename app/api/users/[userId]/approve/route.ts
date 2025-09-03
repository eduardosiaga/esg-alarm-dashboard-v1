import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { gmailService } from '@/lib/email/gmail-service';
import { logger } from '@/lib/utils/logger';
import { jwtService } from '@/lib/auth/jwt-service';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{
    userId: string;
  }>;
}

const approveSchema = z.object({
  role: z.enum(['ADMIN', 'OPERATOR', 'VIEWER']).optional(),
  accountId: z.number().optional(),
  permissions: z.array(z.string()).optional()
});

/**
 * POST /api/users/[userId]/approve - Approve pending user
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    // Get params
    const { userId: userIdStr } = await params;
    const userId = parseInt(userIdStr);
    
    // Get auth token
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.cookies.get('access_token')?.value;
                  
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user
    let currentUser;
    try {
      currentUser = await jwtService.verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check permissions - only SUPERADMIN and ADMIN can approve users
    if (currentUser.role !== 'SUPERADMIN' && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const body = await req.json().catch(() => ({}));
    
    // Validate request
    const validation = approveSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { role, accountId, permissions } = validation.data;

    // Get user to approve
    const user = await prisma.userProfile.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isApproved) {
      return NextResponse.json(
        { error: 'User is already approved' },
        { status: 400 }
      );
    }

    // For ADMIN approvers, set account to their own
    const finalAccountId = currentUser.role === 'ADMIN' 
      ? parseInt(currentUser.accountId.toString())
      : (accountId || parseInt(currentUser.accountId.toString()));

    // Update user
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: {
        isApproved: true,
        isActive: true,
        role: role || 'VIEWER',
        accountId: finalAccountId,
        approvedBy: parseInt(currentUser.sub),
        approvedAt: new Date()
      }
    });

    // Add permissions if provided
    if (permissions && permissions.length > 0) {
      await prisma.userPermission.createMany({
        data: permissions.map(permission => ({
          userId: userId,
          permission
        }))
      });
    }

    // Send approval email
    await gmailService.sendApprovalEmail(user.email, updatedUser.name);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: parseInt(currentUser.sub),
        accountId: parseInt(currentUser.accountId.toString()),
        action: 'user_approved',
        entityType: 'user',
        entityId: userId,
        newValues: {
          email: user.email,
          role: updatedUser.role,
          accountId: updatedUser.accountId,
          permissions
        }
      }
    });

    logger.info(`User ${user.email} approved by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: 'User approved successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        accountId: updatedUser.accountId
      }
    });

  } catch (error) {
    logger.error('Failed to approve user', error);
    return NextResponse.json(
      { error: 'Failed to approve user' },
      { status: 500 }
    );
  }
}