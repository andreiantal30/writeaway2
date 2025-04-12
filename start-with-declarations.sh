
#!/bin/bash
echo "Starting with TypeScript declaration generation..."
node generate-declarations.js
echo "Starting Vite development server..."
export VITE_SKIP_TS_CHECK=true
export VITE_DISABLE_WS_TOKEN=true
export __WS_TOKEN__=development-token
npx vite --force
