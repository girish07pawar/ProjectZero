import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Kestrel's "https" launch profile. Set VITE_API_PROXY_TARGET in .env to
  // https://localhost:44332 if you run the backend under IIS Express instead.
  const target = env.VITE_API_PROXY_TARGET || "https://localhost:7285";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      open: true,
      proxy: {
        // Proxying sidesteps both CORS and the backend's HTTPS redirect, which
        // would otherwise 307 the preflight and fail every POST from the browser.
        "/api": {
          target,
          changeOrigin: true,
          secure: false, // the ASP.NET Core dev certificate is self-signed
        },
      },
    },
  };
});
