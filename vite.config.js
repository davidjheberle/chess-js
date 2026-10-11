import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths so the build can be served from any sub-directory.
  base: "./",
  build: {
    outDir: "build",
    emptyOutDir: true,
    // melonJS alone is ~850 kB minified; no point warning about it.
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 8000,
  },
  test: {
    include: ["js/**/*.test.js"],
  },
});
