import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/auth/jwt-service';
import { sessionManager } from '@/lib/auth/session-manager';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookie or header
    const accessToken = request.cookies.get('access_token')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user info
    const payload = jwtService.verifyAccessToken(accessToken);
    
    // Revoke all sessions except current (optional: include current)
    const exceptCurrent = request.nextUrl.searchParams.get('exceptCurrent') === 'true';
    await sessionManager.revokeAllUserSessions(
      parseInt(payload.sub),
      exceptCurrent ? payload.sessionId : undefined
    );
    
    logger.info(`All sessions revoked for user ${payload.email}`);

    // If not keeping current session, clear cookies
    const response = NextResponse.json({
      success: true,
      message: exceptCurrent 
        ? 'All other sessions have been logged out'
        : 'All sessions have been logged out'
    });

    if (!exceptCurrent) {
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
    }

    return response;

  } catch (error: any) {
    logger.error('Failed to revoke all sessions', error);
    
    if (error.message?.includes('expired')) {
      return NextResponse.json(
        { error: 'Token expired. Please login again.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to logout all sessions' },
      { status: 500 }
    );
  }
}