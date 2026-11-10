import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is the dev server + bundler. `npm run dev` starts it on http://localhost:5173
// and hot-reloads the page every time you save a file.
export default defineConfig({
  plugins: [react()],
  server: { open: true },
});
