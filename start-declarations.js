
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Creative Campaign Generator - Typescript Fix & Start');
console.log('===========================================');

// First generate declarations
console.log('🔄 Generating declaration files...');
try {
  execSync('node generate-declarations.js', { stdio: 'inherit' });
  console.log('✅ Declaration files generated successfully');
} catch (err) {
  console.warn('⚠️ Warning: Failed to generate declaration files, continuing anyway...');
}

// Start the dev server with Vite
console.log('🚀 Starting development server...');
console.log('Running: npx vite --force');

try {
  // Define custom environment variables to help with development
  const env = {
    ...process.env,
    // Disable WebSocket token validation
    VITE_DISABLE_WS_TOKEN: 'true',
    // Define the WS token directly
    __WS_TOKEN__: 'development-token',
    // Skip TypeScript type checking during development for faster reloads
    VITE_SKIP_TS_CHECK: 'true'
  };

  // Use exec instead of spawn to maintain STDIN/STDOUT/STDERR
  execSync('npx vite --force', { 
    env,
    stdio: 'inherit' // This will pipe the child process I/O to the parent
  });
} catch (error) {
  // This will trigger if user presses Ctrl+C, not necessarily an error
  console.log('\n🛑 Development server stopped.');
}
