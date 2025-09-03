import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from '@/lib/auth/jwt-service';
import { sessionManager } from '@/lib/auth/session-manager';
import { logger } from '@/lib/utils/logger';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
    accountId: number;
    permissions: string[];
    sessionId: string;
  };
}

/**
 * Authentication middleware - verifies JWT token and adds user to request
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    requireAuth?: boolean;
    allowExpired?: boolean;
  }
) {
  return async (req: NextRequest) => {
    const requireAuth = options?.requireAuth ?? true;
    const allowExpired = options?.allowExpired ?? false;

    try {
      // Get token from cookie or header
      const accessToken = req.cookies.get('access_token')?.value ||
                         req.headers.get('authorization')?.replace('Bearer ', '');

      if (!accessToken) {
        if (requireAuth) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        return handler(req as AuthenticatedRequest);
      }

      // Verify token
      try {
        const payload = jwtService.verifyAccessToken(accessToken);
        
        // Validate session is still active
        const isValid = await sessionManager.validateSession(payload.sessionId);
        if (!isValid) {
          logger.warn(`Invalid session: ${payload.sessionId}`);
          return NextResponse.json(
            { error: 'Session expired or invalid' },
            { status: 401 }
          );
        }

        // Add user to request
        (req as AuthenticatedRequest).user = {
          id: parseInt(payload.sub),
          email: payload.email,
          name: payload.name,
          role: payload.role,
          accountId: payload.accountId,
          permissions: payload.permissions || [],
          sessionId: payload.sessionId
        };

        return handler(req as AuthenticatedRequest);
        
      } catch (error: any) {
        if (error.message?.includes('expired') && allowExpired) {
          // Token is expired but we allow it (for refresh endpoint)
          return handler(req as AuthenticatedRequest);
        }
        
        logger.warn('Token verification failed', error);
        
        if (requireAuth) {
          return NextResponse.json(
            { error: error.message || 'Invalid token' },
            { status: 401 }
          );
        }
        
        return handler(req as AuthenticatedRequest);
      }

    } catch (error) {
      logger.error('Authentication middleware error', error);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Role-based access control middleware
 */
export function withRole(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  allowedRoles: string[]
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role}`);
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Permission-based access control middleware
 */
export function withPermission(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  requiredPermissions: string[]
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // SUPERADMIN has all permissions
    if (req.user.role === 'SUPERADMIN') {
      return handler(req);
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission =>
      req.user!.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      logger.warn(`Permission denied for user ${req.user.email}. Required: ${requiredPermissions.join(', ')}`);
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Account-based access control middleware
 */
export function withAccount(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  checkAccountId?: (req: AuthenticatedRequest) => number | undefined
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // SUPERADMIN can access all accounts
    if (req.user.role === 'SUPERADMIN') {
      return handler(req);
    }

    if (checkAccountId) {
      const requestedAccountId = checkAccountId(req);
      
      if (requestedAccountId && requestedAccountId !== req.user.accountId) {
        logger.warn(`Account access denied for user ${req.user.email}`);
        return NextResponse.json(
          { error: 'Access denied to this account' },
          { status: 403 }
        );
      }
    }

    return handler(req);
  });
}