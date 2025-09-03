const fs = require('fs');
const path = require('path');

// List of files to update
const files = [
  'app/api/auth/me/route.ts',
  'app/api/auth/register/route.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix Zod error references
  const newContent = content.replace(/validation\.error\.errors/g, 'validation.error.issues');
  if (newContent !== content) {
    content = newContent;
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