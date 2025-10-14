/**
 * Vitest configuration for ZodiaCore project
 * This configuration sets up Vitest as the testing framework for the project.
 * It includes settings for test environment, coverage, and file patterns.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Test environment settings
  test: {
    // Global test setup file
    setupFiles: ['./tests/setup.js'],
    // Environment for tests (node for backend, jsdom for frontend)
    environment: 'node',
    // Test file patterns
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Exclude patterns
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'coverage/**'
    ],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        '**/*.config.{js,ts}',
        '**/*.d.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    // Timeout for individual tests
    testTimeout: 10000,
    // Enable globals like describe, it, expect
    globals: true
  },
  // Path resolution for imports
  resolve: {
    alias: {
      '@': './src',
      '@tests': './tests'
    }
  }
});