
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Creative Campaign Generator - TypeScript Declarations & Start');
console.log('===========================================');

// Check if tsconfig.declarations.json exists, create if not
if (!fs.existsSync('tsconfig.declarations.json')) {
  console.log('🔧 Creating tsconfig.declarations.json...');
  execSync('node generate-declarations.js', { stdio: 'inherit' });
}

// First generate declarations
console.log('🔄 Running declaration generation...');
try {
  execSync('node generate-declarations.js', { stdio: 'inherit' });
  console.log('✅ Declaration files generated successfully');
} catch (err) {
  console.warn('⚠️ Warning: Failed to generate declaration files, continuing anyway...');
  console.error(err.message);
}

// Set up environment variables for Vite
const env = {
  ...process.env,
  VITE_DISABLE_WS_TOKEN: 'true',
  __WS_TOKEN__: 'development-token',
  VITE_SKIP_TS_CHECK: 'true',
  DEBUG: 'vite:hmr' // Enable detailed hmr logging
};

// Start Vite with force flag to ensure clean start
console.log('🚀 Starting Vite development server...');
console.log('Running: npx vite --force');

try {
  execSync('npx vite --force', { 
    env,
    stdio: 'inherit' // This will pipe the child process I/O to the parent
  });
} catch (error) {
  // This will trigger if user presses Ctrl+C, not necessarily an error
  console.log('\n🛑 Development server stopped.');
}
