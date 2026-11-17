import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: 3000,
      strictPort: true,
      proxy: {
        "^/api(?:/|$)": {
          target: env.VITE_API_TARGET || "http://127.0.0.1:3004",
          changeOrigin: true,
          timeout: 5000,
          proxyTimeout: 5000,
        },
        "/s3/soil-types/": {
          target: env.VITE_MEDIA_TARGET || "http://127.0.0.1:9000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/s3/, ""),
        },
      },
    },
  };
});
