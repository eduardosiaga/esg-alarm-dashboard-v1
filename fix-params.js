const fs = require('fs');
const path = require('path');

// List of files to update
const files = [
  'app/api/devices/[deviceId]/status/route.ts',
  'app/api/devices/[deviceId]/ota/route.ts',
  'app/api/devices/[deviceId]/output/route.ts',
  'app/api/devices/[deviceId]/system/route.ts',
  'app/api/devices/[deviceId]/config/route.ts',
  'app/api/devices/[deviceId]/diagnostic/route.ts',
  'app/api/groups/[groupId]/devices/route.ts',
  'app/api/groups/[groupId]/route.ts',
  'app/api/users/[userId]/route.ts',
  'app/api/users/[userId]/approve/route.ts',
  'app/api/auth/sessions/[sessionId]/route.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Update deviceId params
  if (content.includes('{ params }: { params: { deviceId: string } }')) {
    content = content.replace(
      /\{ params \}: \{ params: \{ deviceId: string \} \}/g,
      '{ params }: { params: Promise<{ deviceId: string }> }'
    );
    content = content.replace(
      /const deviceId = parseInt\(params\.deviceId\)/g,
      'const { deviceId: deviceIdParam } = await params;\n    const deviceId = parseInt(deviceIdParam)'
    );
    content = content.replace(
      /params\.deviceId/g,
      '(await params).deviceId'
    );
    modified = true;
  }
  
  // Update groupId params
  if (content.includes('{ params }: { params: { groupId: string } }')) {
    content = content.replace(
      /\{ params \}: \{ params: \{ groupId: string \} \}/g,
      '{ params }: { params: Promise<{ groupId: string }> }'
    );
    content = content.replace(
      /const groupId = parseInt\(params\.groupId\)/g,
      'const { groupId: groupIdParam } = await params;\n    const groupId = parseInt(groupIdParam)'
    );
    content = content.replace(
      /params\.groupId/g,
      '(await params).groupId'
    );
    modified = true;
  }
  
  // Update userId params
  if (content.includes('{ params }: { params: { userId: string } }')) {
    content = content.replace(
      /\{ params \}: \{ params: \{ userId: string \} \}/g,
      '{ params }: { params: Promise<{ userId: string }> }'
    );
    content = content.replace(
      /const userId = parseInt\(params\.userId\)/g,
      'const { userId: userIdParam } = await params;\n    const userId = parseInt(userIdParam)'
    );
    content = content.replace(
      /params\.userId/g,
      '(await params).userId'
    );
    modified = true;
  }
  
  // Update sessionId params
  if (content.includes('{ params }: { params: { sessionId: string } }')) {
    content = content.replace(
      /\{ params \}: \{ params: \{ sessionId: string \} \}/g,
      '{ params }: { params: Promise<{ sessionId: string }> }'
    );
    content = content.replace(
      /const sessionId = params\.sessionId/g,
      'const { sessionId } = await params'
    );
    content = content.replace(
      /params\.sessionId/g,
      '(await params).sessionId'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${file}`);
  } else {
    console.log(`⏭️  Skipped: ${file} (no changes needed)`);
  }
});

console.log('\n✨ Done!');