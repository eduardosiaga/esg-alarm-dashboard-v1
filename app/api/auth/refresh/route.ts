import { NextRequest, NextResponse } from 'next/server';
import { sessionManager } from '@/lib/auth/session-manager';
import { logger } from '@/lib/utils/logger';
import { z } from 'zod';

const requestSchema = z.object({
  refreshToken: z.string().optional(),
  deviceFingerprint: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    console.log('[Refresh Token] Starting refresh attempt');
    
    const body = await request.json().catch(() => ({}));
    console.log('[Refresh Token] Request body:', body);
    
    // Validate request
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      console.error('[Refresh Token] Validation failed:', validation.error);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { deviceFingerprint } = validation.data;
    
    // Get refresh token from cookie or body
    const refreshTokenFromBody = validation.data.refreshToken;
    const refreshTokenFromCookie = request.cookies.get('refresh_token')?.value;
    
    console.log('[Refresh Token] Token sources:', {
      fromBody: !!refreshTokenFromBody,
      fromCookie: !!refreshTokenFromCookie
    });
    
    const refreshToken = refreshTokenFromBody || refreshTokenFromCookie;

    if (!refreshToken) {
      console.error('[Refresh Token] No refresh token provided');
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 401 }
      );
    }

    console.log('[Refresh Token] Attempting to refresh session...');
    // Refresh the session
    const result = await sessionManager.refreshSession(refreshToken, deviceFingerprint);

    console.log('[Refresh Token] Session refreshed successfully:', {
      sessionId: result.sessionId,
      userId: result.userId,
      expiresIn: result.expiresIn
    });
    
    logger.info('Session refreshed successfully');

    // Calculate expiration date
    const expiresAt = new Date(Date.now() + result.expiresIn * 1000);

    // Set new access token cookie
    const response = NextResponse.json({
      success: true,
      session: {
        accessToken: result.accessToken,
        refreshToken: refreshToken, // Return the same refresh token
        expiresAt: expiresAt.toISOString(),
        expiresIn: result.expiresIn
      }
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/'
    };

    response.cookies.set('access_token', result.accessToken, {
      ...cookieOptions,
      maxAge: result.expiresIn
    });

    return response;

  } catch (error: any) {
    logger.error('Failed to refresh session', error);
    
    // Clear cookies on refresh failure
    const response = NextResponse.json(
      { error: error.message || 'Failed to refresh session' },
      { status: 401 }
    );
    
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    
    return response;
  }
}