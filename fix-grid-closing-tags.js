const fs = require('fs');
const path = require('path');

// Files with Grid issues
const files = [
  'components/devices/detail/DeviceHealth.tsx',
  'components/devices/detail/DeviceTelemetry.tsx',
  'components/devices/DeviceFilters.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // First ensure Grid is imported as Grid2
  if (!content.includes('Grid as Grid2')) {
    content = content.replace(
      /import\s*{\s*([^}]*)\bGrid\b([^}]*)\}\s*from\s*['"]@mui\/material['"]/g,
      "import { $1Grid as Grid2$2} from '@mui/material'"
    );
    modified = true;
  }
  
  // Replace all Grid tags with Grid2
  content = content.replace(/<Grid\s/g, '<Grid2 ');
  content = content.replace(/<\/Grid>/g, '</Grid2>');
  
  // Fix item prop
  content = content.replace(/\sitem\s+(xs|sm|md|lg|xl)={/g, ' size={');
  content = content.replace(/\sitem\s+/g, ' ');
  
  if (content.includes('Grid2')) {
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Grid issues in: ${file}`);
  } else {
    console.log(`⏭️  Skipped: ${file} (no changes needed)`);
  }
});

console.log('\n✨ Done fixing Grid closing tags!');