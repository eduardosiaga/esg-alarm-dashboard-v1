const fs = require('fs');
const path = require('path');

// Function to clean proto files by removing nanopb options
function cleanProtoFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove import statements for nanopb
  content = content.replace(/^import\s+"nanopb\.proto";\s*$/gm, '');
  
  // Remove nanopb options from fields
  content = content.replace(/\s*\[\(nanopb\)[^\]]*\]/g, '');
  
  // Save cleaned content
  const cleanedPath = filePath.replace('.proto', '_clean.proto');
  fs.writeFileSync(cleanedPath, content);
  
  // Overwrite original file with cleaned version
  fs.writeFileSync(filePath, content);
  
  console.log(`Cleaned: ${path.basename(filePath)}`);
  return content;
}

// Clean all proto files in schemas directory
const schemasDir = path.join(__dirname, 'schemas');
const protoFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.proto'));

protoFiles.forEach(file => {
  const filePath = path.join(schemasDir, file);
  cleanProtoFile(filePath);
});

console.log('All proto files cleaned successfully!');