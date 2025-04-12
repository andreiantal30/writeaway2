
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const skipTsCheck = env.VITE_SKIP_TS_CHECK === 'true';

  return {
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://localhost:8090',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '/api')
        },
      },
      hmr: {
        clientPort: 443,
        protocol: "wss",
        path: "/__vite_hmr",
        host: undefined,
      },
    },
    plugins: [
      react({
        // Skip TypeScript checking in development for faster refresh
        tsDecorators: true,
        // The correct way to configure transpileOnly option
        ...(skipTsCheck ? { plugins: [['@swc/plugin-transform-typescript', { transpileOnly: true }]] } : {})
      }),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            lucide: ["lucide-react"],
            radix: [
              "@radix-ui/react-accordion",
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-tabs",
              "@radix-ui/react-toast",
            ],
          },
        },
      },
    },
    define: {
      __WS_TOKEN__: JSON.stringify(env.__WS_TOKEN__ || "development-token"),
    },
  }
});
