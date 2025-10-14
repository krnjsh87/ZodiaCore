/**
 * Basic test to verify Vitest setup is working correctly
 * This test ensures that the testing framework is properly configured
 * and can run basic assertions.
 */

describe('Vitest Setup Verification', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to global test utilities', () => {
    expect(global.testUtils).toBeDefined();
    expect(typeof global.testUtils.createMockResponse).toBe('function');
    expect(typeof global.testUtils.generateId).toBe('function');
  });

  it('should verify test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should test mock utilities', () => {
    const mockResponse = global.testUtils.createMockResponse({ success: true }, 200);
    expect(mockResponse.status).toBe(200);
    expect(mockResponse.ok).toBe(true);
  });

  it('should generate unique IDs', () => {
    const id1 = global.testUtils.generateId();
    const id2 = global.testUtils.generateId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(0);
  });
});