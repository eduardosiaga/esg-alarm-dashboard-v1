const fs = require('fs');
const path = require('path');

// List of files to update
const files = [
  'app/api/auth/register/route.ts',
  'app/api/auth/request-otp/route.ts',
  'app/api/auth/verify-otp/route.ts',
  'app/api/auth/test-verify/route.ts',
  'lib/auth/rate-limiter.ts'
];

// Common replacements
const replacements = [
  // Prisma model names
  { from: /prisma\.auth_accounts/g, to: 'prisma.authAccount' },
  { from: /prisma\.user_profiles/g, to: 'prisma.userProfile' },
  { from: /prisma\.audit_logs/g, to: 'prisma.auditLog' },
  
  // Field names
  { from: /is_active:/g, to: 'isActive:' },
  { from: /is_active\s*:/g, to: 'isActive:' },
  { from: /account_id:/g, to: 'accountId:' },
  { from: /\.account_id/g, to: '.accountId' },
  { from: /window_start:/g, to: 'windowStart:' },
  { from: /window_start\s*:/g, to: 'windowStart:' },
  { from: /\.window_start/g, to: '.windowStart' },
  { from: /\.attempt_count/g, to: '.attemptCount' },
  { from: /\.blocked_until/g, to: '.blockedUntil' },
  
  // Zod errors
  { from: /validation\.error\.errors/g, to: 'validation.error.issues' },
  
  // Auth OTP fields
  { from: /isVerified:/g, to: 'verified:' },
  { from: /isVerified\s*:/g, to: 'verified:' }
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