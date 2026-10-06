import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths so the build can be served from any sub-directory.
  base: "./",
  build: {
    outDir: "build",
    emptyOutDir: true
  },
  server: {
    port: 8000
  }
});
