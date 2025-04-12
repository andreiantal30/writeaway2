
#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📝 Generating TypeScript declaration files...');

// Run the TypeScript compiler using our special declarations config
console.log('🔨 Building declaration files...');
exec('npx tsc --project tsconfig.declarations.json --force', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error generating declaration files: ${error.message}`);
    console.error(stderr);
    process.exit(1);
  }
  
  console.log('✅ Declaration files generated successfully!');
  if (stdout) console.log(stdout);
});
