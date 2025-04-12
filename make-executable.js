
#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  console.log('Making scripts executable...');
  
  if (process.platform !== 'win32') {
    // Only need to do this on Unix-like systems
    execSync('chmod +x generate-declarations.js');
    execSync('chmod +x start-declarations.js');
    execSync('chmod +x start-with-declarations.sh');
  }
  
  console.log('Scripts are now executable.');
  console.log('To start the application with TypeScript declaration generation, run:');
  console.log('- On Windows: start-with-declarations.bat');
  console.log('- On Mac/Linux: ./start-with-declarations.sh');
  console.log('- Or use: node start-declarations.js');
} catch (error) {
  console.error('Error making scripts executable:', error.message);
}
