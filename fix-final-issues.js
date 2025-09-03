const fs = require('fs');
const path = require('path');

// List of files to update with specific fixes
const fixes = [
  // Fix entity_id in audit logs
  {
    files: [
      'app/api/auth/register/route.ts',
      'app/api/auth/request-otp/route.ts', 
      'app/api/auth/verify-otp/route.ts'
    ],
    replacements: [
      { from: /entity_id:/g, to: 'entityId:' },
      { from: /ip_address:/g, to: 'ipAddress:' },
      { from: /created_by:/g, to: 'createdBy:' }
    ]
  },
  
  // Fix user API routes
  {
    files: [
      'app/api/users/route.ts',
      'app/api/users/[userId]/route.ts',
      'app/api/users/[userId]/approve/route.ts'
    ],
    replacements: [
      { from: /prisma\.user_profiles/g, to: 'prisma.userProfile' },
      { from: /prisma\.user_permissions/g, to: 'prisma.userPermission' },
      { from: /prisma\.audit_logs/g, to: 'prisma.auditLog' },
      { from: /\.errors/g, to: '.issues' }
    ]
  },
  
  // Fix layout.tsx
  {
    files: ['app/(dashboard)/layout.tsx'],
    replacements: [
      { from: /user\.permissions\?\.some\(p => p\.permission === requiredPermission\)/g, 
        to: 'user?.permissions?.some(p => p.permission === requiredPermission) || false' }
    ]
  },
  
  // Fix Grid imports
  {
    files: [
      'app/(dashboard)/devices/[deviceId]/page.tsx',
      'components/devices/detail/DeviceAlarms.tsx',
      'components/devices/detail/DeviceHealth.tsx', 
      'components/devices/detail/DeviceTelemetry.tsx',
      'components/devices/DeviceFilters.tsx'
    ],
    replacements: [
      { from: /import\s*{\s*([^}]*)\bGrid2\b([^}]*)\}\s*from\s*['"]@mui\/material['"]/g, 
        to: "import { $1Grid as Grid2$2} from '@mui/material'" },
      { from: /<Grid\s+item/g, to: '<Grid2' },
      { from: /<\/Grid>/g, to: '</Grid2>' },
      { from: /\sitem\s+xs={/g, to: ' size={' },
      { from: /\sitem\s+sm={/g, to: ' size={' },
      { from: /\sitem\s+md={/g, to: ' size={' },
      { from: /\sitem\s+lg={/g, to: ' size={' }
    ]
  }
];

// Apply fixes
fixes.forEach(({ files, replacements }) => {
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
});

// Fix auth store specific issue
const authStorePath = path.join(__dirname, 'lib/store/auth.store.ts');
if (fs.existsSync(authStorePath)) {
  let content = fs.readFileSync(authStorePath, 'utf8');
  
  // Fix null vs undefined
  content = content.replace(
    /localStorage\.getItem\('refresh_token'\)/g,
    "localStorage.getItem('refresh_token') || undefined"
  );
  
  fs.writeFileSync(authStorePath, content);
  console.log('✅ Fixed auth.store.ts');
}

// Add missing logger import in verify-otp
const verifyOtpPath = path.join(__dirname, 'app/api/auth/verify-otp/route.ts');
if (fs.existsSync(verifyOtpPath)) {
  let content = fs.readFileSync(verifyOtpPath, 'utf8');
  
  // Check if logger import is missing
  if (!content.includes("import { logger }") && content.includes("logger.")) {
    // Add logger import after other imports
    content = content.replace(
      /(import\s+{[^}]+}\s+from\s+['"]@\/lib\/utils\/[^'"]+['"];?)\n/,
      "$1\nimport { logger } from '@/lib/utils/logger';\n"
    );
    
    fs.writeFileSync(verifyOtpPath, content);
    console.log('✅ Added logger import to verify-otp');
  }
}

// Add missing gmailService import in users route
const usersRoutePath = path.join(__dirname, 'app/api/users/route.ts');
if (fs.existsSync(usersRoutePath)) {
  let content = fs.readFileSync(usersRoutePath, 'utf8');
  
  // Check if gmailService is used but not imported
  if (content.includes("gmailService") && !content.includes("import { gmailService }")) {
    // Add gmailService import
    content = content.replace(
      /(import\s+{[^}]+}\s+from\s+['"]@\/lib\/[^'"]+['"];?)\n/,
      "$1\nimport { gmailService } from '@/lib/email/gmail-service';\n"
    );
    
    fs.writeFileSync(usersRoutePath, content);
    console.log('✅ Added gmailService import to users route');
  }
}

console.log('\n✨ Done fixing final issues!');