
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Creative Campaign Generator Startup Helper');
console.log('===========================================');

// First generate declarations
console.log('🔄 Generating declaration files...');
try {
  execSync('node generate-declarations.js', { stdio: 'inherit' });
  console.log('✅ Declaration files generated successfully');
} catch (err) {
  console.warn('⚠️ Warning: Failed to generate declaration files, continuing anyway...');
}

// Determine the best command to run
console.log('🚀 Starting development server...');
const command = 'npx vite --force';

console.log(`Running: ${command}`);
const child = execSync(command, {
  env: {
    ...process.env,
    // Disable WebSocket token validation
    VITE_DISABLE_WS_TOKEN: 'true',
    // Define the WS token directly
    __WS_TOKEN__: 'development-token',
    // Enable detailed hmr logging
    DEBUG: 'vite:hmr'
  },
  stdio: 'inherit'
});
