const fs = require('fs');
const path = require('path');

// List of files to update
const files = [
  'app/api/auth/register/route.ts',
  'app/api/auth/request-otp/route.ts',
  'app/api/auth/verify-otp/route.ts',
  'lib/auth/otp-service.ts',
  'app/(dashboard)/layout.tsx',
  'websocket-server.ts',
  'lib/store/auth.store.ts'
];

// Common replacements
const replacements = [
  // Prisma field names - more comprehensive
  { from: /entity_type:/g, to: 'entityType:' },
  { from: /user_id:/g, to: 'userId:' },
  { from: /last_login:/g, to: 'lastLogin:' },
  { from: /user_permissions:/g, to: 'permissions:' },
  { from: /\.user_permissions/g, to: '.permissions' },
  { from: /is_approved:/g, to: 'isApproved:' },
  { from: /\.is_approved/g, to: '.isApproved' },
  { from: /\.is_active/g, to: '.isActive' },
  
  // Auth OTP specific
  { from: /isVerified: false/g, to: 'verified: false' },
  { from: /isVerified: true/g, to: 'verified: true' },
  
  // WebSocket event types
  { from: /wsEvent = WS_EVENTS\.TELEMETRY_UPDATE/g, to: 'wsEvent = WS_EVENTS.DEVICE_UPDATE' },
  { from: /wsEvent = WS_EVENTS\.DEVICE_ALARM/g, to: 'wsEvent = WS_EVENTS.DEVICE_UPDATE' },
  { from: /wsEvent = WS_EVENTS\.DEVICE_ONLINE/g, to: 'wsEvent = WS_EVENTS.DEVICE_UPDATE' },
  { from: /wsEvent = WS_EVENTS\.DEVICE_OFFLINE/g, to: 'wsEvent = WS_EVENTS.DEVICE_UPDATE' },
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

// Fix specific issues in layout.tsx
const layoutPath = path.join(__dirname, 'app/(dashboard)/layout.tsx');
if (fs.existsSync(layoutPath)) {
  let content = fs.readFileSync(layoutPath, 'utf8');
  
  // Fix Object is possibly 'undefined' at line 354
  content = content.replace(
    /const hasPermission = user\.permissions\?\.some\(p => p\.permission === requiredPermission\)/g,
    'const hasPermission = user?.permissions?.some(p => p.permission === requiredPermission) || false'
  );
  
  fs.writeFileSync(layoutPath, content);
  console.log('✅ Fixed undefined check in layout.tsx');
}

// Fix auth store null issue
const authStorePath = path.join(__dirname, 'lib/store/auth.store.ts');
if (fs.existsSync(authStorePath)) {
  let content = fs.readFileSync(authStorePath, 'utf8');
  
  // Fix null vs undefined type issue
  content = content.replace(
    /const storedRefreshToken = localStorage\.getItem\('refresh_token'\);/g,
    'const storedRefreshToken = localStorage.getItem(\'refresh_token\') || undefined;'
  );
  
  fs.writeFileSync(authStorePath, content);
  console.log('✅ Fixed null/undefined in auth.store.ts');
}

console.log('\n✨ Done!');