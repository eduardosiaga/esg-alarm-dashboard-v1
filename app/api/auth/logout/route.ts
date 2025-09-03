import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/auth/jwt-service';
import { sessionManager } from '@/lib/auth/session-manager';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookie or header
    const accessToken = request.cookies.get('access_token')?.value ||
                       request.headers.get('authorization')?.replace('Bearer ', '');

    if (accessToken) {
      try {
        // Verify and extract session ID
        const payload = jwtService.verifyAccessToken(accessToken);
        
        // Revoke the session
        await sessionManager.revokeSession(payload.sessionId, parseInt(payload.sub));
        
        logger.info(`User ${payload.email} logged out`);
      } catch (error) {
        // Token might be expired or invalid, but we still want to clear cookies
        logger.warn('Failed to verify token during logout', error);
      }
    }

    // Clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;

  } catch (error) {
    logger.error('Failed to process logout', error);
    
    // Even if something fails, clear the cookies
    const response = NextResponse.json(
      { error: 'Logout failed, but session cleared' },
      { status: 500 }
    );
    
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    
    return response;
  }
}