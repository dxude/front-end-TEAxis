import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // No alias: rely on normal node resolution for react-router/@remix-run/router
    // If Vercel still fails, we'll add targeted optimizeDeps or a safe alias.
  }
});
