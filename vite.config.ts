/// <reference types="vitest/config" />
import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function buildVersion(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return 'local'
  }
}

// https://vite.dev/config/
export default defineConfig({
  // User site (kh3ldar.github.io) is served from the root, and so is a custom domain.
  base: '/',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
