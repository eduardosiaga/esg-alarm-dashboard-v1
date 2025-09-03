import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';
import { sessionManager } from '@/lib/auth/session-manager';
import { logger } from '@/lib/utils/logger';

/**
 * GET /api/auth/sessions - Get all active sessions for current user
 */
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const sessions = await sessionManager.getActiveSessionsForUser(req.user.id);

    // Mark current session
    const currentSessionId = req.user.sessionId;
    const sessionsWithCurrent = sessions.map(session => ({
      ...session,
      isCurrent: session.id === currentSessionId
    }));

    return NextResponse.json({
      sessions: sessionsWithCurrent,
      total: sessions.length
    });

  } catch (error) {
    logger.error('Failed to get user sessions', error);
    return NextResponse.json(
      { error: 'Failed to retrieve sessions' },
      { status: 500 }
    );
  }
});