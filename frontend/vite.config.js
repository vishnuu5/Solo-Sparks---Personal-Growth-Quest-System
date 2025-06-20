import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://solo-sparks-personal-growth-quest-system.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
