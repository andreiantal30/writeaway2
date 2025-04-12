
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📝 Generating TypeScript declaration files...');

// Create the dist/types directory if it doesn't exist
const typesDir = path.join(__dirname, 'dist', 'types');
if (!fs.existsSync(typesDir)) {
  console.log('📁 Creating types directory...');
  fs.mkdirSync(typesDir, { recursive: true });
}

// Clean up any previous declaration files
console.log('🧹 Cleaning previous declaration files...');
try {
  // Clean dist/types directory
  const files = fs.readdirSync(typesDir);
  for (const file of files) {
    const filePath = path.join(typesDir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
  console.log('✅ Previous declaration files cleaned');
} catch (error) {
  console.log('⚠️ No previous declaration files to clean or error cleaning:', error.message);
}

// Create or update tsconfig.declarations.json for declaration file generation
console.log('📋 Creating/updating tsconfig.declarations.json...');
const tsconfigDeclarations = {
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "./dist/types",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "composite": true
  },
  "include": ["src/**/*", "server/**/*"],
  "exclude": ["node_modules", "dist"]
};

fs.writeFileSync(
  path.join(__dirname, 'tsconfig.declarations.json'),
  JSON.stringify(tsconfigDeclarations, null, 2)
);
console.log('✅ tsconfig.declarations.json updated');

// Create a temporary tsconfig.temp.json to fix reference issues
console.log('🔧 Creating temporary TypeScript configuration...');
const tempConfigContent = `
// This file is auto-generated - do not modify
{
  "extends": "./tsconfig.declarations.json"
}
`;
fs.writeFileSync(path.join(__dirname, 'tsconfig.temp.json'), tempConfigContent);
console.log('✅ Temporary TypeScript configuration created');

// Run the TypeScript compiler using our special declarations config
console.log('🔨 Building declaration files...');
try {
  execSync('npx tsc --project tsconfig.declarations.json --force', { stdio: 'inherit' });
  console.log('✅ Declaration files generated successfully!');
} catch (error) {
  console.error(`❌ Error generating declaration files: ${error.message}`);
  // Continue execution even if there's an error
  console.log('⚠️ Continuing despite declaration generation errors');
}

// Check if declarations were actually generated
try {
  const files = fs.readdirSync(typesDir);
  if (files.length === 0) {
    console.warn('⚠️ Warning: No declaration files were generated. There might be TypeScript configuration issues.');
  } else {
    console.log(`✅ Generated ${files.length} declaration files/directories`);
  }
} catch (error) {
  console.error('❌ Error checking declaration files:', error.message);
}

console.log('✅ Declaration generation process completed');
