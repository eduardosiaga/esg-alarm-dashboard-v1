import { NextRequest, NextResponse } from 'next/server';
import { withRole, AuthenticatedRequest } from '@/middleware/auth';
import { prisma } from '@/lib/db/prisma';
import { gmailService } from '@/lib/email/gmail-service';
import { logger } from '@/lib/utils/logger';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'OPERATOR', 'VIEWER']),
  accountId: z.number().optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional().default(true),
  isApproved: z.boolean().optional().default(true)
});

/**
 * GET /api/users - List all users (ADMIN+ only)
 */
export const GET = withRole(async (req: AuthenticatedRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || 'all'; // all, active, inactive, pending

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // ADMIN can only see users in their account
    if (req.user?.role === 'ADMIN') {
      where.accountId = req.user.accountId;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    switch (status) {
      case 'active':
        where.isActive = true;
        where.isApproved = true;
        break;
      case 'inactive':
        where.isActive = false;
        break;
      case 'pending':
        where.isApproved = false;
        break;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.userProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          account: true,
          permissions: true
        }
      }),
      prisma.userProfile.count({ where })
    ]);

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountId: user.accountId,
        accountName: user.account?.name,
        permissions: user.permissions.map(p => p.permission),
        isActive: user.isActive,
        isApproved: user.isApproved,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Failed to list users', error);
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}, ['SUPERADMIN', 'ADMIN']);

/**
 * POST /api/users - Create new user (ADMIN+ only)
 */
export const POST = withRole(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();
    
    // Validate request
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, name, role, accountId, permissions, isActive, isApproved } = validation.data;

    // Check permissions
    if (req.user?.role === 'ADMIN') {
      // ADMIN can only create users for their account with limited roles
      if (role === 'SUPERADMIN') {
        return NextResponse.json(
          { error: 'You cannot create SUPERADMIN users' },
          { status: 403 }
        );
      }
      if (accountId && accountId !== req.user.accountId) {
        return NextResponse.json(
          { error: 'You can only create users for your account' },
          { status: 403 }
        );
      }
    }

    // Check if email already exists
    const existingUser = await prisma.userProfile.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Create user
    const newUser = await prisma.userProfile.create({
      data: {
        email,
        name,
        role,
        accountId: accountId || (req.user?.role === 'ADMIN' ? req.user.accountId : null),
        isActive: isActive,
        isApproved: isApproved
      }
    });

    // Add permissions if provided
    if (permissions && permissions.length > 0) {
      await prisma.userPermission.createMany({
        data: permissions.map(permission => ({
          userId: newUser.id,
          permission
        }))
      });
    }

    // Send approval email if approved
    if (isApproved && isActive) {
      await gmailService.sendApprovalEmail(email, name);
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        accountId: req.user!.accountId,
        action: 'user_created',
        entityType: 'user',
        entityId: newUser.id,
        newValues: {
          email,
          name,
          role,
          accountId,
          permissions
        }
      }
    });

    logger.info(`User created by ${req.user?.email}: ${email}`);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        accountId: newUser.accountId,
        isActive: newUser.isActive,
        isApproved: newUser.isApproved
      }
    });

  } catch (error) {
    logger.error('Failed to create user', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}, ['SUPERADMIN', 'ADMIN']);