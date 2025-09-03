# Database Schema Proposal - User Management System

## Naming Convention
Following the existing prefix-based categorization:
- **auth_** - Authentication and authorization tables
- **user_** - User-related tables
- **group_** - Grouping and permissions
- **device_** - Existing device tables (with assignment extension)
- **audit_** - Audit and logging tables

## Table Structure

### Authentication & Authorization Tables

```sql
-- auth_accounts: Parent accounts (organizations/companies)
CREATE TABLE auth_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email_domain VARCHAR(255), -- Optional: restrict users to specific email domain
    parent_account_id INTEGER REFERENCES auth_accounts(id), -- For hierarchical accounts
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- auth_roles: System roles
CREATE TYPE role_type AS ENUM ('SUPERADMIN', 'ADMIN', 'OPERATOR', 'VIEWER');

-- auth_sessions: JWT session management with persistent sessions
CREATE TABLE auth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    access_token_hash VARCHAR(64) NOT NULL, -- Store hash of JWT
    refresh_token_hash VARCHAR(64) NOT NULL UNIQUE,
    device_fingerprint VARCHAR(64), -- For persistent sessions across browser restarts
    remember_me BOOLEAN DEFAULT false, -- User opted for persistent session
    expires_at TIMESTAMPTZ NOT NULL,
    refresh_expires_at TIMESTAMPTZ NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ, -- For manual session revocation
    INDEX idx_auth_sessions_user_id (user_id),
    INDEX idx_auth_sessions_expires (expires_at),
    INDEX idx_auth_sessions_fingerprint (device_fingerprint)
);

-- auth_otp: One-time password codes
CREATE TABLE auth_otp (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    attempts INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_auth_otp_email_code (email, code),
    INDEX idx_auth_otp_expires (expires_at)
);

-- auth_rate_limits: Track login attempts
CREATE TABLE auth_rate_limits (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    blocked_until TIMESTAMPTZ,
    INDEX idx_auth_rate_limits_email (email),
    INDEX idx_auth_rate_limits_blocked (blocked_until)
);
```

### User Management Tables

```sql
-- user_profiles: Individual users
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES auth_accounts(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role role_type NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    approved_by INTEGER REFERENCES user_profiles(id),
    approved_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_user_profiles_account_id (account_id),
    INDEX idx_user_profiles_email (email),
    INDEX idx_user_profiles_role (role)
);

-- user_permissions: Global permissions for users
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    granted_by INTEGER REFERENCES user_profiles(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, permission),
    INDEX idx_user_permissions_user_id (user_id)
);
```

### Device Grouping & Assignment Tables

```sql
-- group_definitions: Groups for organizing devices
CREATE TABLE group_definitions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, name),
    INDEX idx_group_definitions_account_id (account_id)
);

-- group_device_assignments: Devices assigned to groups
CREATE TABLE group_device_assignments (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES group_definitions(id) ON DELETE CASCADE,
    device_id INTEGER NOT NULL REFERENCES device(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES user_profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, device_id),
    INDEX idx_group_device_assignments_group_id (group_id),
    INDEX idx_group_device_assignments_device_id (device_id)
);
```

### Device Account Assignment (New)

```sql
-- device_account_assignments: SUPERADMIN assigns devices to accounts
CREATE TABLE device_account_assignments (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES device(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
    assigned_by INTEGER NOT NULL REFERENCES user_profiles(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    unassigned_by INTEGER REFERENCES user_profiles(id),
    unassigned_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    UNIQUE(device_id, account_id) WHERE is_active = true,
    INDEX idx_device_account_assignments_device_id (device_id),
    INDEX idx_device_account_assignments_account_id (account_id),
    INDEX idx_device_account_assignments_active (is_active)
);
```

### Audit & Logging Tables

```sql
-- audit_logs: Comprehensive audit trail
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id),
    account_id INTEGER REFERENCES auth_accounts(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'device', 'user', 'group', 'account'
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_audit_logs_user_id (user_id),
    INDEX idx_audit_logs_entity (entity_type, entity_id),
    INDEX idx_audit_logs_created_at (created_at)
);

-- audit_device_access: Track device access/commands
CREATE TABLE audit_device_access (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_profiles(id),
    device_id INTEGER NOT NULL REFERENCES device(id),
    action VARCHAR(100) NOT NULL, -- 'view', 'command', 'config_change'
    command_type VARCHAR(50),
    command_data JSONB,
    response_data JSONB,
    success BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_audit_device_access_user_id (user_id),
    INDEX idx_audit_device_access_device_id (device_id),
    INDEX idx_audit_device_access_created_at (created_at)
);
```

## Key Features & Workflows

### 1. Device Auto-Registration Workflow
```sql
-- When a device auto-registers, it goes into the device table without an account assignment
-- The device is "unassigned" and only visible to SUPERADMIN users

-- View for unassigned devices (for SUPERADMIN dashboard)
CREATE VIEW unassigned_devices AS
SELECT d.*
FROM device d
LEFT JOIN device_account_assignments daa 
    ON d.id = daa.device_id AND daa.is_active = true
WHERE daa.id IS NULL;
```

### 2. SUPERADMIN Device Assignment
```sql
-- SUPERADMIN assigns device to parent account
INSERT INTO device_account_assignments (device_id, account_id, assigned_by)
VALUES ($device_id, $account_id, $superadmin_user_id);

-- After assignment, the device becomes visible to all users in that account
```

### 3. Device Visibility Query
```sql
-- Get devices visible to a user
CREATE VIEW user_visible_devices AS
SELECT DISTINCT d.*, daa.account_id, gda.group_id
FROM device d
INNER JOIN device_account_assignments daa 
    ON d.id = daa.device_id AND daa.is_active = true
LEFT JOIN group_device_assignments gda 
    ON d.id = gda.device_id
LEFT JOIN group_definitions gd 
    ON gda.group_id = gd.id
WHERE d.active = true;

-- Query for specific user
SELECT * FROM user_visible_devices
WHERE account_id = (SELECT account_id FROM user_profiles WHERE id = $user_id)
   OR account_id IN (
       SELECT id FROM auth_accounts 
       WHERE parent_account_id = (SELECT account_id FROM user_profiles WHERE id = $user_id)
   );
```

### 4. OTP Login Flow
```sql
-- Step 1: Request OTP
INSERT INTO auth_otp (email, code, expires_at)
VALUES ($email, $generated_code, NOW() + INTERVAL '10 minutes');

-- Step 2: Verify OTP with rate limiting
UPDATE auth_otp 
SET attempts = attempts + 1, 
    verified = CASE WHEN code = $provided_code THEN true ELSE false END
WHERE email = $email 
  AND expires_at > NOW() 
  AND attempts < 5;

-- Step 3: Create session after successful verification
INSERT INTO auth_sessions (user_id, access_token_hash, refresh_token_hash, expires_at, refresh_expires_at)
VALUES ($user_id, $access_hash, $refresh_hash, NOW() + INTERVAL '15 minutes', NOW() + INTERVAL '7 days');
```

### 5. Account Hierarchy
```sql
-- Parent accounts can see all child account devices
CREATE VIEW account_hierarchy AS
WITH RECURSIVE account_tree AS (
    SELECT id, name, parent_account_id, 0 as level
    FROM auth_accounts
    WHERE parent_account_id IS NULL
    
    UNION ALL
    
    SELECT a.id, a.name, a.parent_account_id, at.level + 1
    FROM auth_accounts a
    INNER JOIN account_tree at ON a.parent_account_id = at.id
)
SELECT * FROM account_tree;
```

## Indexes for Performance

```sql
-- Additional performance indexes
CREATE INDEX idx_device_active ON device(active) WHERE active = true;
CREATE INDEX idx_user_profiles_approved ON user_profiles(is_approved, is_active) 
    WHERE is_approved = true AND is_active = true;
CREATE INDEX idx_auth_sessions_active ON auth_sessions(user_id, expires_at) 
    WHERE expires_at > NOW();
```

## Security Considerations

1. **Password-less Authentication**: No password fields, only OTP via email
2. **JWT Token Management**: Store only hashes of tokens, not the tokens themselves
3. **Rate Limiting**: Built-in rate limiting for OTP attempts (5 attempts in 60 minutes)
4. **Audit Trail**: Complete audit logging of all actions
5. **Role-Based Access**: SUPERADMIN > ADMIN > OPERATOR > VIEWER hierarchy
6. **Device Isolation**: Devices without account assignment are only visible to SUPERADMIN
7. **Persistent Sessions**: Optional "Remember Me" with device fingerprinting for secure persistent sessions using local storage

## Migration Notes

1. The existing `device_*` tables remain unchanged
2. New tables follow the same prefix convention for consistency
3. Foreign key relationships properly cascade deletes
4. All timestamps use TIMESTAMPTZ for timezone awareness
5. Proper indexes for common query patterns