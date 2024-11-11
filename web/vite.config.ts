import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    EnvironmentPlugin({
      LIVEKIT_URL: process.env.LIVEKIT_URL || '',
      VA_BACKEND_URL: process.env.VA_BACKEND_URL || '',
    }),
  ],
});


