import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    // The sandbox sets worker-count environment variables that conflict with
    // Vitest's defaults; pin a single worker so the pool always constructs.
    pool: "forks",
    minWorkers: 1,
    maxWorkers: 1,
    poolOptions: {
      forks: { minForks: 1, maxForks: 1 },
      threads: { minThreads: 1, maxThreads: 1 },
    },
  },
});
