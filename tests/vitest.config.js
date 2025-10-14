/**
 * Vitest configuration for ZodiaCore testing framework
 * Configures test environment, coverage, and reporting settings
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment settings
    environment: 'node',
    globals: true,

    // Test file patterns
    include: [
      'tests/unit/**/*.{test,spec}.{js,ts}',
      'tests/integration/**/*.{test,spec}.{js,ts}',
      'tests/e2e/**/*.{test,spec}.{js,ts}',
      '**/*.{test,spec}.{js,ts}'
    ],

    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      'tests/coverage'
    ],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'tests/coverage',
      include: [
        'backend/**/*.js',
        'services/**/*.js',
        'frontend/src/**/*.{js,ts,jsx,tsx}'
      ],
      exclude: [
        'node_modules',
        'tests/**/*',
        'frontend/public/**/*',
        '**/*.config.js',
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

    // Test timeout
    testTimeout: 10000,

    // Setup files
    setupFiles: ['tests/setup.js'],

    // Reporter configuration
    reporter: ['verbose', 'json'],

    // Output directory for test results
    outputFile: 'tests/results.json'
  }
});