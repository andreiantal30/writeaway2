
#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📝 Generating TypeScript declaration files...');

// Create a tsconfig specifically for declarations
const tsconfigBuild = {
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist/types",
    "skipLibCheck": true,
    "composite": true // Add composite flag
  },
  "include": ["src/**/*", "server/**/*"],
  "exclude": ["node_modules", "dist"]
};

// Write the config to a file
fs.writeFileSync(
  path.join(__dirname, 'tsconfig.build.json'), 
  JSON.stringify(tsconfigBuild, null, 2)
);

// Clean up any previous build artifacts
console.log('🧹 Cleaning previous build artifacts...');
try {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Removed dist directory');
  }
  
  // Remove any stray declaration files in the root
  const files = fs.readdirSync('.');
  files.forEach(file => {
    if (file.endsWith('.d.ts')) {
      fs.unlinkSync(file);
      console.log(`✅ Removed ${file}`);
    }
  });
} catch (err) {
  console.error('Error cleaning build artifacts:', err);
}

// Run the TypeScript compiler using this config
console.log('🔨 Building declaration files...');
exec('npx tsc --build tsconfig.build.json', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error generating declaration files: ${error.message}`);
    console.error(stderr);
    process.exit(1);
  }
  
  console.log('✅ Declaration files generated successfully!');
  if (stdout) console.log(stdout);
});
