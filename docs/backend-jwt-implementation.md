# Backend JWT Implementation Guide

## Overview
This document outlines the implementation of JWT-based authentication with passwordless login, persistent sessions, and comprehensive security features for the ESP32 Alarm Dashboard.

## Architecture Components

### 1. Authentication Flow
```
User Email → OTP Generation → Email Delivery (Gmail) → OTP Verification → JWT Generation → Session Creation
```

### 2. Token Structure

#### Access Token (15 minutes)
```typescript
interface AccessTokenPayload {
  sub: string;           // User ID
  email: string;         // User email
  role: string;          // SUPERADMIN | ADMIN | OPERATOR | VIEWER
  accountId: number;     // Parent account ID
  permissions: string[]; // Global permissions
  sessionId: string;     // Session UUID
  iat: number;          // Issued at
  exp: number;          // Expires at
}
```

#### Refresh Token (7 days / 30 days with Remember Me)
```typescript
interface RefreshTokenPayload {
  sub: string;           // User ID
  sessionId: string;     // Session UUID
  fingerprint?: string;  // Device fingerprint for persistent sessions
  rememberMe: boolean;   // Extended expiration flag
  iat: number;
  exp: number;
}
```

### 3. Client-Side Storage Strategy

#### Local Storage (Persistent Sessions)
```typescript
// Stored in localStorage for persistent sessions
interface PersistentSession {
  refreshToken: string;        // Encrypted refresh token
  deviceFingerprint: string;   // Unique device identifier
  rememberMe: boolean;         // User preference
  expiresAt: string;           // ISO date string
}
```

#### Session Storage (Standard Sessions)
```typescript
// Stored in sessionStorage for browser session only
interface SessionData {
  accessToken: string;         // Current access token
  refreshToken: string;        // Current refresh token
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    accountId: number;
  };
}
```

## Implementation Checklist

### ✅ Completed Tasks
- [x] Database schema design with auth_ tables
- [x] Persistent session support in database schema
- [x] Rate limiting table structure
- [x] Audit logging table structure

### 🔄 In Progress
- [ ] PostgreSQL table creation scripts

### 📋 Pending Implementation

#### Backend API Endpoints
- [ ] **POST /api/auth/request-otp** - Request OTP code
  - [ ] Validate email format
  - [ ] Check if user exists and is approved
  - [ ] Generate 6-digit OTP
  - [ ] Store in auth_otp table
  - [ ] Send email via Gmail SMTP
  - [ ] Implement rate limiting

- [ ] **POST /api/auth/verify-otp** - Verify OTP and login
  - [ ] Validate OTP code
  - [ ] Check expiration (10 minutes)
  - [ ] Verify attempt count (<5)
  - [ ] Generate JWT tokens
  - [ ] Create session in auth_sessions
  - [ ] Return tokens and user data

- [ ] **POST /api/auth/refresh** - Refresh access token
  - [ ] Validate refresh token
  - [ ] Check session validity
  - [ ] Verify device fingerprint (if persistent)
  - [ ] Generate new access token
  - [ ] Update last_activity
  - [ ] Return new access token

- [ ] **POST /api/auth/logout** - Logout user
  - [ ] Invalidate session
  - [ ] Clear refresh token
  - [ ] Add to revoked tokens list
  - [ ] Create audit log entry

- [ ] **GET /api/auth/session** - Get current session
  - [ ] Validate access token
  - [ ] Return user data and permissions
  - [ ] Check session expiration

- [ ] **POST /api/auth/revoke-session** - Revoke specific session
  - [ ] Admin only endpoint
  - [ ] Mark session as revoked
  - [ ] Create audit log entry

#### Middleware Components
- [ ] **JWT Verification Middleware**
  ```typescript
  // lib/auth/middleware.ts
  export async function verifyJWT(req: NextRequest) {
    // Extract token from Authorization header
    // Verify signature and expiration
    // Attach user to request context
    // Check session validity in database
  }
  ```

- [ ] **Role-Based Access Control**
  ```typescript
  // lib/auth/rbac.ts
  export function requireRole(roles: string[]) {
    // Check user role against required roles
    // Apply hierarchical permissions
    // Return 403 if unauthorized
  }
  ```

- [ ] **Rate Limiting Middleware**
  ```typescript
  // lib/auth/rate-limit.ts
  export async function rateLimit(identifier: string) {
    // Check auth_rate_limits table
    // Increment attempt count
    // Block if over threshold (5 in 60 min)
    // Return 429 if rate limited
  }
  ```

#### Security Components
- [ ] **Device Fingerprinting**
  ```typescript
  // lib/auth/fingerprint.ts
  export function generateFingerprint(req: NextRequest): string {
    // Combine: User-Agent, Accept headers, IP subnet
    // Hash with SHA-256
    // Return consistent identifier
  }
  ```

- [ ] **Token Encryption for Local Storage**
  ```typescript
  // lib/auth/encryption.ts
  export function encryptToken(token: string): string {
    // Use Web Crypto API
    // AES-GCM encryption
    // Return encrypted string
  }
  ```

- [ ] **Gmail SMTP Integration**
  ```typescript
  // lib/email/gmail.ts
  export async function sendOTP(email: string, code: string) {
    // Configure nodemailer with Gmail
    // Use OAuth2 or App Password
    // Send formatted OTP email
  }
  ```

#### Frontend Components
- [ ] **Login Page Component**
  ```typescript
  // app/login/page.tsx
  - OTP request form
  - OTP verification form
  - Remember Me checkbox
  - Rate limit handling
  ```

- [ ] **Auth Context Provider**
  ```typescript
  // contexts/AuthContext.tsx
  - Token management
  - Auto-refresh logic
  - Persistent session handling
  - Logout functionality
  ```

- [ ] **Protected Route Wrapper**
  ```typescript
  // components/ProtectedRoute.tsx
  - Check authentication status
  - Redirect to login if needed
  - Role-based rendering
  ```

- [ ] **Session Manager Hook**
  ```typescript
  // hooks/useSession.ts
  - Handle token refresh
  - Manage local/session storage
  - Device fingerprint generation
  - Session expiration monitoring
  ```

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_REFRESH_EXPIRY_REMEMBER=30d

# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password
GMAIL_FROM_NAME=ESP32 Alarm System

# Security
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=5
RATE_LIMIT_WINDOW_MINUTES=60
BCRYPT_ROUNDS=10

# Client Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SESSION_CHECK_INTERVAL=60000
```

## Security Best Practices

### 1. Token Security
- Never store raw tokens in database (only hashes)
- Use httpOnly cookies for access tokens in production
- Implement token rotation on refresh
- Short access token lifetime (15 minutes)
- Maintain revocation list for compromised tokens

### 2. Session Management
- Device fingerprinting for persistent sessions
- IP address validation for sensitive operations
- Automatic session cleanup for expired sessions
- Maximum concurrent sessions per user limit
- Session activity tracking

### 3. Rate Limiting
- Exponential backoff for failed attempts
- IP-based and email-based rate limiting
- CAPTCHA after multiple failures (future)
- Temporary account lockout mechanism

### 4. Audit Logging
- Log all authentication attempts
- Track permission changes
- Monitor suspicious activity patterns
- Retain logs for compliance (90 days minimum)

## Testing Checklist

### Unit Tests
- [ ] JWT generation and validation
- [ ] OTP generation and verification
- [ ] Rate limiting logic
- [ ] Session management
- [ ] Device fingerprinting

### Integration Tests
- [ ] Complete login flow
- [ ] Token refresh cycle
- [ ] Session persistence
- [ ] Rate limit enforcement
- [ ] Audit logging

### Security Tests
- [ ] SQL injection attempts
- [ ] JWT tampering
- [ ] Brute force protection
- [ ] Session hijacking prevention
- [ ] XSS protection

## Deployment Considerations

### 1. Production Environment
- Use secure httpOnly cookies for tokens
- Enable HTTPS for all endpoints
- Implement CORS properly
- Use environment-specific JWT secrets
- Enable security headers (CSP, HSTS, etc.)

### 2. Monitoring
- Track authentication success/failure rates
- Monitor token refresh patterns
- Alert on unusual login patterns
- Track session duration metrics
- Monitor rate limit triggers

### 3. Scaling
- Redis for session storage (future)
- Distributed rate limiting
- Load balancer session affinity
- Database read replicas for auth queries

## Migration Path

### Phase 1: Core Authentication (Current)
- Basic JWT implementation
- OTP via Gmail
- Session management
- Role-based access

### Phase 2: Enhanced Security
- Two-factor authentication
- Biometric authentication (WebAuthn)
- Advanced threat detection
- IP allowlisting

### Phase 3: Enterprise Features
- Single Sign-On (SSO)
- SAML/OAuth2 integration
- Multi-tenant isolation
- Compliance reporting

## References

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)