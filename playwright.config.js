import { defineConfig, devices } from "@playwright/test";

// End-to-end tests of the built game in Chromium (npm run e2e). Set
// CHROMIUM_PATH to use a Chromium already installed, rather than the one
// `npx playwright install chromium` downloads.
const PORT = 4173;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // At least 640 by 480, so one screen pixel is one game pixel.
        viewport: { width: 800, height: 600 },
        launchOptions: { executablePath: process.env.CHROMIUM_PATH },
      },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
