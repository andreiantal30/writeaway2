
#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  console.log('Making scripts executable...');
  
  if (process.platform !== 'win32') {
    // Only need to do this on Unix-like systems
    execSync('chmod +x generate-declarations.sh');
    execSync('chmod +x start-with-declarations.sh');
  }
  
  console.log('Scripts are now executable.');
} catch (error) {
  console.error('Error making scripts executable:', error.message);
}
