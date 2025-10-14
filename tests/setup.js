/**
 * Global test setup for ZodiaCore testing framework
 * Configures test environment, mocks, and global utilities
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Global test configuration
global.testConfig = {
  timeout: 10000,
  retries: 3,
  environment: process.env.NODE_ENV || 'test'
};

// Mock implementations for common dependencies
global.mockConsole = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn()
};

// Setup before all tests
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.TESTING = 'true';

  // Mock console methods to reduce noise during testing
  global.originalConsole = { ...console };
  Object.assign(console, global.mockConsole);

  // Additional global setup can be added here
  // e.g., database connections, external service mocks
});

// Cleanup after all tests
afterAll(async () => {
  // Restore original console
  if (global.originalConsole) {
    Object.assign(console, global.originalConsole);
  }

  // Clean up test environment variables
  delete process.env.TESTING;

  // Additional global cleanup can be added here
  // e.g., close database connections, clean up files
});

// Setup before each test
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();

  // Reset mock console calls
  Object.values(global.mockConsole).forEach(mock => mock.mockClear());

  // Additional per-test setup can be added here
});

// Cleanup after each test
afterEach(() => {
  // Additional per-test cleanup can be added here
  // e.g., clean up test data, reset global state
});

// Export common test utilities
global.testUtils = {
  // Helper to wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to create mock data
  createMockData: (type, overrides = {}) => {
    const baseData = {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString()
      },
      birthChart: {
        id: 'test-chart-id',
        userId: 'test-user-id',
        dateOfBirth: '1990-01-01',
        timeOfBirth: '12:00:00',
        placeOfBirth: 'Test City, Test Country'
      }
    };

    return { ...baseData[type], ...overrides };
  },

  // Helper to assert error responses
  expectError: (response, statusCode, message) => {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('error');
    if (message) {
      expect(response.body.error).toContain(message);
    }
  },

  // Helper to assert success responses
  expectSuccess: (response, statusCode = 200) => {
    expect(response.status).toBe(statusCode);
    expect(response.body).not.toHaveProperty('error');
  }
};