import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pin the dev server to a fixed port so the backend CORS origin and the
// frontend URL never drift apart. strictPort fails fast instead of silently
// moving to another port (which used to break API calls).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
