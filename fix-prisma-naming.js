const fs = require('fs');
const path = require('path');

// List of files to update
const files = [
  'lib/auth/otp-service.ts',
  'lib/auth/rate-limiter.ts',
  'app/api/auth/register/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/logout-all/route.ts',
  'app/api/auth/me/route.ts'
];

// Prisma model name mappings (snake_case to camelCase)
const replacements = [
  // Model names
  { from: /prisma\.auth_otp/g, to: 'prisma.authOtp' },
  { from: /prisma\.auth_rate_limits/g, to: 'prisma.authRateLimit' },
  { from: /prisma\.audit_logs/g, to: 'prisma.auditLog' },
  { from: /prisma\.user_profiles/g, to: 'prisma.userProfile' },
  
  // Field names for auth_otp
  { from: /expires_at:/g, to: 'expiresAt:' },
  { from: /created_at:/g, to: 'createdAt:' },
  { from: /verified:/g, to: 'isVerified:' },
  
  // Field names for auth_rate_limits
  { from: /attempt_count:/g, to: 'attemptCount:' },
  { from: /first_attempt:/g, to: 'firstAttempt:' },
  { from: /last_attempt:/g, to: 'lastAttempt:' },
  { from: /blocked_until:/g, to: 'blockedUntil:' },
  
  // Field names for audit_logs
  { from: /user_id:/g, to: 'userId:' },
  { from: /created_at:/g, to: 'createdAt:' },
  { from: /ip_address:/g, to: 'ipAddress:' },
  { from: /user_agent:/g, to: 'userAgent:' },
  
  // Field names in where clauses
  { from: /expires_at: \{/g, to: 'expiresAt: {' },
  { from: /created_at: \{/g, to: 'createdAt: {' },
  { from: /verified: false/g, to: 'isVerified: false' },
  { from: /verified: true/g, to: 'isVerified: true' },
  { from: /created_at: 'desc'/g, to: "createdAt: 'desc'" },
  { from: /created_at: 'asc'/g, to: "createdAt: 'asc'" },
  { from: /first_attempt: \{/g, to: 'firstAttempt: {' },
  { from: /last_attempt: \{/g, to: 'lastAttempt: {' },
  { from: /blocked_until: \{/g, to: 'blockedUntil: {' },
  { from: /blocked_until: null/g, to: 'blockedUntil: null' },
  { from: /attempt_count: \{/g, to: 'attemptCount: {' },
  { from: /attempt_count: 0/g, to: 'attemptCount: 0' },
  { from: /attempt_count: 1/g, to: 'attemptCount: 1' },
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ from, to }) => {
    const newContent = content.replace(from, to);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${file}`);
  } else {
    console.log(`⏭️  Skipped: ${file} (no changes needed)`);
  }
});

console.log('\n✨ Done!');