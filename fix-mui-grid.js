const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript/TSX files
const files = glob.sync('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**']
});

let totalFixed = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Replace Grid import with Grid2
  if (content.includes("import { Grid") && content.includes("from '@mui/material'")) {
    content = content.replace(
      /import\s*{\s*([^}]*)\bGrid\b([^}]*)\}\s*from\s*['"]@mui\/material['"]/g,
      (match, before, after) => {
        // Check if Grid2 is already imported
        if (!before.includes('Grid2') && !after.includes('Grid2')) {
          return `import { ${before}Grid2${after}} from '@mui/material'`;
        }
        return match;
      }
    );
    
    // Replace Grid usage with Grid2
    content = content.replace(/<Grid\s/g, '<Grid2 ');
    content = content.replace(/<\/Grid>/g, '</Grid2>');
    
    // Replace item prop with size
    content = content.replace(/\sitem\s+(xs|sm|md|lg|xl)={(\d+)}/g, ' size={$2}');
    content = content.replace(/\sitem\s+/g, ' ');
    
    // Fix container and spacing props
    content = content.replace(/(<Grid2[^>]*)\scontainer\s+spacing={(\d+)}/g, '$1 container spacing={$2}');
    
    modified = true;
  }
  
  // Fix specific Grid2 import issues
  if (content.includes("'@mui/material'") && content.includes("'Grid2'")) {
    content = content.replace(
      /{\s*'Grid2'\s*}/g,
      '{ Grid2 }'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Grid issues in: ${file}`);
    totalFixed++;
  }
});

console.log(`\n✨ Fixed ${totalFixed} files with Grid issues`);