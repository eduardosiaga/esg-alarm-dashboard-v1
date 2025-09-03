import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sessionManager } from '@/lib/auth/session-manager';
import { jwtService } from '@/lib/auth/jwt-service';
import { logger } from '@/lib/utils/logger';

interface RouteParams {
  params: Promise<{
    sessionId: string;
  }>;
}

/**
 * DELETE /api/auth/sessions/[sessionId] - Revoke a specific session
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Get the params
    const { sessionId } = await params;
    
    // Get user from token
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || 
                  req.cookies.get('access_token')?.value;
                  
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let user;
    try {
      user = await jwtService.verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the session to check ownership
    const session = await prisma.authSession.findUnique({
      where: { id: sessionId }
    });
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Only allow users to revoke their own sessions
    if (session.userId !== parseInt(user.sub)) {
      return NextResponse.json(
        { error: 'You can only revoke your own sessions' },
        { status: 403 }
      );
    }

    // Revoke the session
    await sessionManager.revokeSession(sessionId);

    logger.info(`Session revoked: ${sessionId} by user ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully'
    });

  } catch (error) {
    logger.error('Failed to revoke session', error);
    return NextResponse.json(
      { error: 'Failed to revoke session' },
      { status: 500 }
    );
  }
}