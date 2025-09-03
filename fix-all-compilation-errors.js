const fs = require('fs');
const path = require('path');

console.log('Starting comprehensive fix for all compilation errors...\n');

// Fix 1: Grid2 props (xs, sm, md should be size)
function fixGrid2Props() {
  const files = [
    'components/devices/DeviceFilters.tsx',
    'components/devices/detail/DeviceHealth.tsx',
    'components/devices/detail/DeviceTelemetry.tsx'
  ];
  
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix Grid2 props
    content = content.replace(/<Grid2\s+xs={/g, '<Grid2 size={');
    content = content.replace(/<Grid2\s+xs={(\d+)}\s+sm={(\d+)}/g, '<Grid2 size={{ xs: $1, sm: $2 }}');
    content = content.replace(/<Grid2\s+xs={(\d+)}\s+sm={(\d+)}\s+md={(\d+)}/g, '<Grid2 size={{ xs: $1, sm: $2, md: $3 }}');
    content = content.replace(/<Grid2\s+xs={(\d+)}\s+md={(\d+)}/g, '<Grid2 size={{ xs: $1, md: $2 }}');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Grid2 props in ${file}`);
  });
}

// Fix 2: Prisma field names
function fixPrismaFieldNames() {
  const files = [
    'app/api/auth/register/route.ts',
    'app/api/auth/request-otp/route.ts',
    'app/api/auth/verify-otp/route.ts',
    'app/api/users/[userId]/approve/route.ts',
    'app/api/users/[userId]/route.ts',
    'app/api/users/route.ts'
  ];
  
  const replacements = [
    // Audit log fields
    { from: /new_values:/g, to: 'newValues:' },
    { from: /old_values:/g, to: 'oldValues:' },
    { from: /user_id:/g, to: 'userId:' },
    { from: /account_id:/g, to: 'accountId:' },
    { from: /entity_type:/g, to: 'entityType:' },
    { from: /entity_id:/g, to: 'entityId:' },
    { from: /ip_address:/g, to: 'ipAddress:' },
    
    // User profile fields  
    { from: /created_by:/g, to: 'createdBy:' },
    { from: /approved_by:/g, to: 'approvedBy:' },
    { from: /approved_at:/g, to: 'approvedAt:' },
    { from: /is_approved:/g, to: 'isApproved:' },
    { from: /is_active:/g, to: 'isActive:' },
    
    // Properties access
    { from: /\.account_id/g, to: '.accountId' },
    { from: /\.is_approved/g, to: '.isApproved' },
    { from: /\.is_active/g, to: '.isActive' },
    
    // User permissions
    { from: /user_id: userId/g, to: 'userId: userId' },
    { from: /user_id: newUser\.id/g, to: 'userId: newUser.id' }
  ];
  
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Prisma fields in ${file}`);
  });
}

// Fix 3: Layout.tsx undefined check
function fixLayoutUndefined() {
  const filePath = path.join(__dirname, 'app/(dashboard)/layout.tsx');
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix line 354 - add null checks
  content = content.replace(
    /const hasPermission = user\.permissions\?\.some\(p => p\.permission === requiredPermission\)/g,
    'const hasPermission = user?.permissions?.some(p => p?.permission === requiredPermission) || false'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed layout.tsx undefined checks');
}

// Fix 4: Auth store null issue
function fixAuthStore() {
  const filePath = path.join(__dirname, 'lib/store/auth.store.ts');
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix null vs undefined
  content = content.replace(
    /const storedRefreshToken = localStorage\.getItem\('refresh_token'\);/g,
    "const storedRefreshToken = localStorage.getItem('refresh_token') ?? undefined;"
  );
  
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed auth.store.ts null/undefined');
}

// Fix 5: useRealTimeUpdates type
function fixRealTimeUpdates() {
  const filePath = path.join(__dirname, 'lib/hooks/useRealTimeUpdates.ts');
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add type to prev parameter at line 245
  content = content.replace(
    /setDeviceTelemetry\(prev => {/g,
    'setDeviceTelemetry((prev: any) => {'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed useRealTimeUpdates types');
}

// Fix 6: Remove 'type' field from auth_accounts
function fixAuthAccountsType() {
  const filePath = path.join(__dirname, 'app/api/auth/register/route.ts');
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove type field from auth_accounts creation
  content = content.replace(
    /const defaultAccount = await prisma\.authAccount\.create\({[\s\S]*?data: {[\s\S]*?type: 'local',[\s\S]*?}/g,
    (match) => match.replace("type: 'local',\n", '')
  );
  
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed auth_accounts type field');
}

// Run all fixes
console.log('Applying fixes...\n');
fixGrid2Props();
fixPrismaFieldNames();
fixLayoutUndefined();
fixAuthStore();
fixRealTimeUpdates();
fixAuthAccountsType();

console.log('\n✨ All fixes applied successfully!');