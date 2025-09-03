# Next Phase Implementation Plan

## Phase 2: Backend API Implementation

### Overview
This phase focuses on implementing the authentication system, API endpoints, and core services for the user management system.

## 1. Core Services Implementation

### 1.1 JWT Service (`lib/auth/jwt-service.ts`)
```typescript
- generateAccessToken(user: UserProfile): string
- generateRefreshToken(user: UserProfile, rememberMe: boolean): string
- verifyAccessToken(token: string): AccessTokenPayload
- verifyRefreshToken(token: string): RefreshTokenPayload
- hashToken(token: string): string
- generateDeviceFingerprint(req: NextRequest): string
```

### 1.2 OTP Service (`lib/auth/otp-service.ts`)
```typescript
- generateOTP(): string (6-digit code)
- storeOTP(email: string, code: string): Promise<void>
- verifyOTP(email: string, code: string): Promise<boolean>
- cleanupExpiredOTPs(): Promise<void>
```

### 1.3 Email Service (`lib/email/gmail-service.ts`)
```typescript
- Configuration with Gmail SMTP
- sendOTPEmail(email: string, code: string): Promise<void>
- sendApprovalNotification(email: string): Promise<void>
- sendAccountActivation(email: string): Promise<void>
```

### 1.4 Session Manager (`lib/auth/session-manager.ts`)
```typescript
- createSession(user: UserProfile, options: SessionOptions): Promise<Session>
- refreshSession(refreshToken: string): Promise<AccessToken>
- revokeSession(sessionId: string): Promise<void>
- getActiveSessionsForUser(userId: number): Promise<Session[]>
- cleanupExpiredSessions(): Promise<void>
```

### 1.5 Rate Limiter (`lib/auth/rate-limiter.ts`)
```typescript
- checkRateLimit(email: string): Promise<RateLimitResult>
- incrementAttempts(email: string): Promise<void>
- resetAttempts(email: string): Promise<void>
- blockUser(email: string, duration: number): Promise<void>
```

## 2. API Endpoints Implementation

### 2.1 Authentication Endpoints

#### `POST /api/auth/request-otp`
**Purpose**: Request OTP code for login
```typescript
Request: { email: string }
Response: { 
  success: boolean, 
  message: string,
  expiresIn: number // seconds
}
```
**Tasks**:
- Validate email format
- Check if user exists and is approved
- Check rate limiting
- Generate and store OTP
- Send email via Gmail
- Return success response

#### `POST /api/auth/verify-otp`
**Purpose**: Verify OTP and create session
```typescript
Request: { 
  email: string, 
  code: string,
  rememberMe?: boolean,
  deviceFingerprint?: string
}
Response: { 
  accessToken: string,
  refreshToken: string,
  user: UserProfile,
  expiresIn: number
}
```
**Tasks**:
- Verify OTP code and expiration
- Check attempt count
- Generate JWT tokens
- Create session in database
- Return tokens and user data

#### `POST /api/auth/refresh`
**Purpose**: Refresh access token
```typescript
Request: { 
  refreshToken: string,
  deviceFingerprint?: string
}
Response: { 
  accessToken: string,
  expiresIn: number
}
```
**Tasks**:
- Verify refresh token
- Check session validity
- Verify device fingerprint if present
- Generate new access token
- Update session activity

#### `POST /api/auth/logout`
**Purpose**: Logout and revoke session
```typescript
Request: { sessionId?: string } // From token or specific session
Response: { success: boolean }
```
**Tasks**:
- Revoke current or specific session
- Update database
- Create audit log entry

#### `GET /api/auth/session`
**Purpose**: Get current session info
```typescript
Response: {
  user: UserProfile,
  permissions: string[],
  account: Account,
  sessionId: string
}
```

#### `GET /api/auth/sessions`
**Purpose**: List user's active sessions
```typescript
Response: {
  sessions: Session[],
  current: string // Current session ID
}
```

### 2.2 User Management Endpoints (Admin)

#### `GET /api/admin/users`
**Purpose**: List users (with pagination)
```typescript
Query: { 
  page?: number, 
  limit?: number,
  accountId?: number,
  role?: string,
  status?: 'pending' | 'approved' | 'active'
}
Response: {
  users: UserProfile[],
  total: number,
  page: number,
  totalPages: number
}
```

#### `POST /api/admin/users`
**Purpose**: Create new user
```typescript
Request: {
  email: string,
  name: string,
  role: RoleType,
  accountId: number
}
Response: UserProfile
```

#### `PUT /api/admin/users/{userId}`
**Purpose**: Update user
```typescript
Request: Partial<UserProfile>
Response: UserProfile
```

#### `POST /api/admin/users/{userId}/approve`
**Purpose**: Approve pending user
```typescript
Response: { success: boolean, user: UserProfile }
```

#### `DELETE /api/admin/users/{userId}`
**Purpose**: Deactivate user
```typescript
Response: { success: boolean }
```

### 2.3 Account Management Endpoints

#### `GET /api/admin/accounts`
**Purpose**: List accounts with hierarchy
```typescript
Response: {
  accounts: AccountWithChildren[]
}
```

#### `POST /api/admin/accounts`
**Purpose**: Create new account
```typescript
Request: {
  name: string,
  emailDomain?: string,
  parentAccountId?: number
}
Response: Account
```

#### `PUT /api/admin/accounts/{accountId}`
**Purpose**: Update account
```typescript
Request: Partial<Account>
Response: Account
```

### 2.4 Device Assignment Endpoints (SUPERADMIN)

#### `GET /api/admin/devices/unassigned`
**Purpose**: List unassigned devices
```typescript
Response: {
  devices: Device[]
}
```

#### `POST /api/admin/devices/{deviceId}/assign`
**Purpose**: Assign device to account
```typescript
Request: {
  accountId: number,
  notes?: string
}
Response: DeviceAccountAssignment
```

#### `DELETE /api/admin/devices/{deviceId}/assign`
**Purpose**: Unassign device from account
```typescript
Request: {
  accountId: number,
  reason?: string
}
Response: { success: boolean }
```

### 2.5 Group Management Endpoints

#### `GET /api/groups`
**Purpose**: List groups for account
```typescript
Query: { accountId?: number }
Response: {
  groups: GroupDefinition[]
}
```

#### `POST /api/groups`
**Purpose**: Create new group
```typescript
Request: {
  name: string,
  description?: string,
  accountId: number
}
Response: GroupDefinition
```

#### `POST /api/groups/{groupId}/devices`
**Purpose**: Add devices to group
```typescript
Request: {
  deviceIds: number[]
}
Response: { success: boolean, added: number }
```

#### `DELETE /api/groups/{groupId}/devices/{deviceId}`
**Purpose**: Remove device from group
```typescript
Response: { success: boolean }
```

### 2.6 Audit Endpoints

#### `GET /api/audit/logs`
**Purpose**: Get audit logs
```typescript
Query: {
  userId?: number,
  entityType?: string,
  startDate?: string,
  endDate?: string,
  page?: number,
  limit?: number
}
Response: {
  logs: AuditLog[],
  total: number
}
```

#### `GET /api/audit/device-access`
**Purpose**: Get device access logs
```typescript
Query: {
  deviceId?: number,
  userId?: number,
  startDate?: string,
  endDate?: string
}
Response: {
  logs: DeviceAccessLog[]
}
```

## 3. Middleware Implementation

### 3.1 Authentication Middleware (`middleware/auth.ts`)
```typescript
- Extract and verify JWT from Authorization header
- Attach user to request context
- Handle token expiration
- Check session validity in database
```

### 3.2 RBAC Middleware (`middleware/rbac.ts`)
```typescript
- Role hierarchy validation
- Permission checking
- Account-level access control
- SUPERADMIN bypass for system operations
```

### 3.3 Audit Middleware (`middleware/audit.ts`)
```typescript
- Automatic audit log creation
- Request/response logging
- User action tracking
- Error logging
```

### 3.4 Rate Limiting Middleware (`middleware/rate-limit.ts`)
```typescript
- IP-based rate limiting
- User-based rate limiting
- Endpoint-specific limits
- Response with retry-after headers
```

## 4. Database Integration

### 4.1 Prisma Schema (`prisma/schema.prisma`)
- Define all models matching PostgreSQL tables
- Add relations and constraints
- Configure JSON fields for JSONB columns

### 4.2 Database Services
- `lib/db/user-service.ts`
- `lib/db/account-service.ts`
- `lib/db/session-service.ts`
- `lib/db/audit-service.ts`
- `lib/db/group-service.ts`

## 5. Configuration & Environment

### 5.1 Environment Variables
```env
# JWT
JWT_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_REFRESH_EXPIRY_REMEMBER=30d

# Gmail
GMAIL_USER=
GMAIL_APP_PASSWORD=
GMAIL_FROM_NAME=

# Security
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=5
RATE_LIMIT_WINDOW_MINUTES=60

# Database (already configured)
DATABASE_URL=
```

### 5.2 Configuration Files
- `config/auth.config.ts` - Authentication settings
- `config/email.config.ts` - Email settings
- `config/security.config.ts` - Security settings

## 6. Testing Requirements

### 6.1 Unit Tests
- JWT generation and validation
- OTP generation and verification
- Rate limiting logic
- Session management
- Permission checking

### 6.2 Integration Tests
- Complete authentication flow
- User management CRUD
- Device assignment workflow
- Group management
- Audit logging

### 6.3 E2E Tests
- Login flow with OTP
- Session persistence
- Role-based access
- Admin operations

## 7. Frontend Integration Requirements

### 7.1 Authentication Context
```typescript
interface AuthContextValue {
  user: UserProfile | null
  login: (email: string) => Promise<void>
  verifyOTP: (code: string, rememberMe: boolean) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}
```

### 7.2 HTTP Client Configuration
- Automatic token attachment
- Token refresh on 401
- Request retry logic
- Error handling

### 7.3 Protected Routes
- Authentication check
- Role-based rendering
- Redirect to login

## 8. Security Considerations

### 8.1 Token Security
- Secure token storage strategy
- XSS protection
- CSRF protection
- Token rotation

### 8.2 Session Security
- Device fingerprinting
- IP validation for sensitive operations
- Concurrent session limits
- Session timeout handling

### 8.3 API Security
- Input validation
- SQL injection prevention
- Rate limiting
- CORS configuration

## 9. Performance Optimizations

### 9.1 Caching Strategy
- Session caching
- Permission caching
- User data caching
- Rate limit caching

### 9.2 Database Optimizations
- Connection pooling
- Query optimization
- Index usage
- Batch operations

## 10. Monitoring & Logging

### 10.1 Application Monitoring
- Authentication success/failure rates
- Token refresh patterns
- API endpoint performance
- Error tracking

### 10.2 Security Monitoring
- Failed login attempts
- Suspicious activity detection
- Rate limit triggers
- Session anomalies

## Implementation Priority

### Week 1: Core Authentication
1. JWT Service
2. OTP Service
3. Session Manager
4. Basic auth endpoints (request-otp, verify-otp, refresh, logout)
5. Authentication middleware

### Week 2: User & Account Management
1. User CRUD endpoints
2. Account management endpoints
3. RBAC middleware
4. Admin approval workflow
5. Email notifications

### Week 3: Device & Group Management
1. Device assignment endpoints
2. Group management endpoints
3. Visibility queries
4. Audit logging
5. Rate limiting

### Week 4: Frontend Integration & Testing
1. Frontend auth components
2. Protected routes
3. Integration testing
4. Security testing
5. Performance optimization

## Success Criteria

1. ✅ Users can login with OTP via email
2. ✅ Sessions persist across browser restarts (with Remember Me)
3. ✅ JWT tokens refresh automatically
4. ✅ Role-based access control works correctly
5. ✅ SUPERADMIN can assign devices to accounts
6. ✅ Complete audit trail of all actions
7. ✅ Rate limiting prevents brute force attacks
8. ✅ All endpoints have proper authentication
9. ✅ Performance targets met (<500ms response time)
10. ✅ Security best practices implemented

## Deliverables

1. **Backend Services**: All core services implemented and tested
2. **API Endpoints**: All endpoints functional with documentation
3. **Middleware**: Authentication, RBAC, audit, and rate limiting
4. **Database Integration**: Prisma models and services
5. **Tests**: Unit, integration, and E2E tests
6. **Documentation**: API documentation with examples
7. **Frontend Integration**: Basic auth flow working
8. **Security**: All security measures implemented
9. **Performance**: Meeting response time targets
10. **Monitoring**: Logging and monitoring in place