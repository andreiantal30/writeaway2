
@echo off
echo Starting with TypeScript declaration generation...
node generate-declarations.js
echo Starting Vite development server...
set VITE_SKIP_TS_CHECK=true
set VITE_DISABLE_WS_TOKEN=true
set __WS_TOKEN__=development-token
npx vite --force
