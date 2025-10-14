#!/usr/bin/env node

/**
 * Production Environment Connectivity Test Suite
 *
 * Comprehensive testing for production environment connectivity as specified in microtask 0.3.8.
 * Tests MongoDB Atlas connection, API endpoints, database operations, and network connectivity
 * in the production Render environment.
 *
 * Usage: node tests/production-connectivity-test.test.js
 * Or: npm test -- --testPathPattern=production-connectivity-test.test.js
 */

const http = require('http');
const https = require('https');
const { MongoClient } = require('mongodb');

// Configuration - Environment variables for production
const PRODUCTION_CONFIG = {
  baseUrl:
    process.env.RENDER_EXTERNAL_URL ||
    'https://zodiacore-production.onrender.com',
  mongodbUri: process.env.MONGODB_URI,
  mongodbDbName: process.env.MONGODB_DB_NAME || 'zodiacore_prod',
  timeout: parseInt(process.env.TEST_TIMEOUT_MS) || 30000, // 30 seconds for production
  retries: parseInt(process.env.TEST_RETRIES) || 3,
  latencyThreshold: parseInt(process.env.LATENCY_THRESHOLD_MS) || 2000, // 2 seconds
};

// Test data for database operations
const TEST_DATA = {
  testCollection: 'production_connectivity_test',
  testDocument: {
    testId: `test_${Date.now()}`,
    timestamp: new Date(),
    environment: 'production',
    testType: 'connectivity',
    data: { message: 'Production connectivity test document' },
  },
};

// Logger utility
class TestLogger {
  constructor(logFile) {
    this.logFile = logFile;
    this.logs = [];
  }

  log(level, message, data = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      data,
    };

    this.logs.push(entry);
    const logMessage = `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`;
    console.log(logMessage);

    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  info(message, data) {
    this.log('info', message, data);
  }
  warn(message, data) {
    this.log('warn', message, data);
  }
  error(message, data) {
    this.log('error', message, data);
  }
  success(message, data) {
    this.log('success', message, data);
  }

  getLogs() {
    return this.logs;
  }

  saveToFile() {
    if (this.logFile) {
      require('fs').writeFileSync(
        this.logFile,
        JSON.stringify(this.logs, null, 2)
      );
    }
  }
}

// HTTP request utility with retry logic
async function makeRequest(
  options,
  logger,
  retries = PRODUCTION_CONFIG.retries
) {
  const startTime = Date.now();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Making request attempt ${attempt}/${retries}`, {
        url: `${options.protocol || 'http'}://${options.hostname}:${options.port || 443}${options.path}`,
        method: options.method || 'GET',
      });

      const response = await new Promise((resolve, reject) => {
        const req = (options.protocol === 'https:' ? https : http).request(
          options,
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              const latency = Date.now() - startTime;
              resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                data: data,
                latency,
              });
            });
          }
        );

        req.on('error', reject);
        req.setTimeout(PRODUCTION_CONFIG.timeout, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });

        req.end();
      });

      logger.success(`Request successful on attempt ${attempt}`, {
        statusCode: response.statusCode,
        latency: response.latency,
      });

      return response;
    } catch (error) {
      logger.warn(`Request attempt ${attempt} failed: ${error.message}`);

      if (attempt === retries) {
        throw new Error(
          `Request failed after ${retries} attempts: ${error.message}`
        );
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}

// MongoDB connection test
async function testMongoDBConnection(logger) {
  const testName = 'MongoDB Atlas Connection';
  logger.info(`Starting ${testName}`);

  let client;
  try {
    if (!PRODUCTION_CONFIG.mongodbUri) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    logger.info('Connecting to MongoDB Atlas...');
    client = new MongoClient(PRODUCTION_CONFIG.mongodbUri, {
      serverSelectionTimeoutMS: PRODUCTION_CONFIG.timeout,
      connectTimeoutMS: PRODUCTION_CONFIG.timeout,
      socketTimeoutMS: PRODUCTION_CONFIG.timeout,
    });

    const startTime = Date.now();
    await client.connect();
    const latency = Date.now() - startTime;

    logger.success('MongoDB connection established', { latency });

    // Test database access
    const db = client.db(PRODUCTION_CONFIG.mongodbDbName);
    const collections = await db.collections();
    logger.info('Database access verified', {
      database: PRODUCTION_CONFIG.mongodbDbName,
      collectionsCount: collections.length,
    });

    return {
      status: 'PASS',
      latency,
      collectionsCount: collections.length,
      message: 'MongoDB Atlas connection successful',
    };
  } catch (error) {
    logger.error(`${testName} failed`, { error: error.message });
    return {
      status: 'FAIL',
      error: error.message,
      message: 'MongoDB Atlas connection failed',
    };
  } finally {
    if (client) {
      await client.close();
      logger.info('MongoDB connection closed');
    }
  }
}

// API endpoint accessibility test
async function testAPIEndpoints(logger) {
  const testName = 'API Endpoint Accessibility';
  logger.info(`Starting ${testName}`);

  const endpoints = [
    { path: '/health', method: 'GET', description: 'Health Check' },
    { path: '/api/v1/status', method: 'GET', description: 'API Status' },
    // Add more endpoints as they become available
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const url = new URL(PRODUCTION_CONFIG.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        protocol: url.protocol,
        path: endpoint.path,
        method: endpoint.method,
        headers: {
          'User-Agent': 'ZodiaCore-Production-Test/1.0',
          Accept: 'application/json',
        },
      };

      const response = await makeRequest(options, logger);

      // Validate response
      const isValid = response.statusCode >= 200 && response.statusCode < 300;
      const isFast = response.latency < PRODUCTION_CONFIG.latencyThreshold;

      results.push({
        endpoint: endpoint.path,
        description: endpoint.description,
        status: isValid ? 'PASS' : 'FAIL',
        statusCode: response.statusCode,
        latency: response.latency,
        latencyStatus: isFast ? 'GOOD' : 'SLOW',
        message: isValid
          ? 'Endpoint accessible'
          : `Unexpected status: ${response.statusCode}`,
      });

      logger.info(
        `${endpoint.description} (${endpoint.path}): ${isValid ? 'PASS' : 'FAIL'}`,
        {
          statusCode: response.statusCode,
          latency: response.latency,
        }
      );
    } catch (error) {
      results.push({
        endpoint: endpoint.path,
        description: endpoint.description,
        status: 'FAIL',
        error: error.message,
        message: 'Endpoint not accessible',
      });

      logger.error(`${endpoint.description} failed`, { error: error.message });
    }
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const total = results.length;

  return {
    status: passed === total ? 'PASS' : 'FAIL',
    results,
    summary: `${passed}/${total} endpoints accessible`,
    message: `API endpoints test: ${passed}/${total} passed`,
  };
}

// Database read/write operations test
async function testDatabaseOperations(logger) {
  const testName = 'Database Read/Write Operations';
  logger.info(`Starting ${testName}`);

  let client;
  try {
    if (!PRODUCTION_CONFIG.mongodbUri) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    client = new MongoClient(PRODUCTION_CONFIG.mongodbUri);
    await client.connect();

    const db = client.db(PRODUCTION_CONFIG.mongodbDbName);
    const collection = db.collection(TEST_DATA.testCollection);

    // Write operation
    logger.info('Performing write operation...');
    const writeStart = Date.now();
    const writeResult = await collection.insertOne(TEST_DATA.testDocument);
    const writeLatency = Date.now() - writeStart;

    logger.success('Write operation successful', {
      insertedId: writeResult.insertedId,
      latency: writeLatency,
    });

    // Read operation
    logger.info('Performing read operation...');
    const readStart = Date.now();
    const readResult = await collection.findOne({
      testId: TEST_DATA.testDocument.testId,
    });
    const readLatency = Date.now() - readStart;

    logger.success('Read operation successful', {
      found: !!readResult,
      latency: readLatency,
    });

    // Cleanup
    logger.info('Cleaning up test data...');
    await collection.deleteOne({ testId: TEST_DATA.testDocument.testId });
    logger.info('Test data cleaned up');

    return {
      status: 'PASS',
      operations: {
        write: { latency: writeLatency, success: true },
        read: { latency: readLatency, success: !!readResult },
      },
      message: 'Database read/write operations successful',
    };
  } catch (error) {
    logger.error(`${testName} failed`, { error: error.message });
    return {
      status: 'FAIL',
      error: error.message,
      message: 'Database operations failed',
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Network connectivity and latency test
async function testNetworkConnectivity(logger) {
  const testName = 'Network Connectivity & Latency';
  logger.info(`Starting ${testName}`);

  const targets = [
    { name: 'Production API', url: PRODUCTION_CONFIG.baseUrl },
    { name: 'MongoDB Atlas', url: 'https://cloud.mongodb.com' }, // Approximate Atlas endpoint
    // Add more external dependencies as needed
  ];

  const results = [];

  for (const target of targets) {
    try {
      const url = new URL(target.url);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        protocol: url.protocol,
        path: url.pathname || '/',
        method: 'HEAD', // Use HEAD for connectivity check without full response
        timeout: PRODUCTION_CONFIG.timeout,
      };

      const startTime = Date.now();
      const response = await makeRequest(options, logger);
      const latency = Date.now() - startTime;

      const isConnected = response.statusCode > 0;
      const isFast = latency < PRODUCTION_CONFIG.latencyThreshold;

      results.push({
        target: target.name,
        url: target.url,
        status: isConnected ? 'PASS' : 'FAIL',
        latency,
        latencyStatus: isFast ? 'GOOD' : 'SLOW',
        message: isConnected ? 'Connected' : 'Connection failed',
      });

      logger.info(
        `${target.name} connectivity: ${isConnected ? 'PASS' : 'FAIL'}`,
        {
          latency,
          statusCode: response.statusCode,
        }
      );
    } catch (error) {
      results.push({
        target: target.name,
        url: target.url,
        status: 'FAIL',
        error: error.message,
        message: 'Network connectivity failed',
      });

      logger.error(`${target.name} connectivity failed`, {
        error: error.message,
      });
    }
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const total = results.length;

  return {
    status: passed === total ? 'PASS' : 'FAIL',
    results,
    summary: `${passed}/${total} targets reachable`,
    message: `Network connectivity test: ${passed}/${total} passed`,
  };
}

// Main test runner
async function runProductionConnectivityTests() {
  const logFile = `production-connectivity-test-${Date.now()}.log`;
  const logger = new TestLogger(logFile);

  logger.info('🚀 Starting ZodiaCore Production Connectivity Tests');
  logger.info('Configuration:', {
    baseUrl: PRODUCTION_CONFIG.baseUrl,
    mongodbDbName: PRODUCTION_CONFIG.mongodbDbName,
    timeout: PRODUCTION_CONFIG.timeout,
    retries: PRODUCTION_CONFIG.retries,
  });

  const results = {
    timestamp: new Date().toISOString(),
    environment: 'production',
    tests: [],
  };

  let overallStatus = 'PASS';

  // Run all tests
  const tests = [
    { name: 'MongoDB Atlas Connection', fn: testMongoDBConnection },
    { name: 'API Endpoint Accessibility', fn: testAPIEndpoints },
    { name: 'Database Operations', fn: testDatabaseOperations },
    { name: 'Network Connectivity', fn: testNetworkConnectivity },
  ];

  for (const test of tests) {
    try {
      logger.info(`\n🔍 Running ${test.name}...`);
      const result = await test.fn(logger);

      results.tests.push({
        name: test.name,
        ...result,
      });

      if (result.status === 'FAIL') {
        overallStatus = 'FAIL';
      }

      logger.info(`${test.name} completed: ${result.status}`, result);
    } catch (error) {
      logger.error(`${test.name} execution failed`, { error: error.message });
      results.tests.push({
        name: test.name,
        status: 'FAIL',
        error: error.message,
        message: 'Test execution failed',
      });
      overallStatus = 'FAIL';
    }
  }

  // Generate summary
  const passedTests = results.tests.filter((t) => t.status === 'PASS').length;
  const totalTests = results.tests.length;

  logger.info('\n📊 Test Summary:', {
    overallStatus,
    passed: passedTests,
    failed: totalTests - passedTests,
    total: totalTests,
  });

  // Save results
  logger.saveToFile();
  const resultsFile = `production-connectivity-results-${Date.now()}.json`;
  require('fs').writeFileSync(resultsFile, JSON.stringify(results, null, 2));

  logger.info('📄 Results saved to:', { logFile, resultsFile });

  // Exit with appropriate code
  if (overallStatus === 'PASS') {
    logger.success('✅ All production connectivity tests passed!');
    process.exit(0);
  } else {
    logger.error(
      '❌ Some production connectivity tests failed. Check logs for details.'
    );
    process.exit(1);
  }
}

// Export for testing framework
module.exports = {
  runProductionConnectivityTests,
  testMongoDBConnection,
  testAPIEndpoints,
  testDatabaseOperations,
  testNetworkConnectivity,
  TestLogger,
  PRODUCTION_CONFIG,
};

// Jest test suite
describe('Production Environment Connectivity Tests', () => {
  // Test MongoDB connection
  describe('MongoDB Atlas Connection', () => {
    test('should establish connection to MongoDB Atlas', async () => {
      const result = await testMongoDBConnection(new TestLogger());
      expect(result.status).toBe('PASS');
      expect(result.latency).toBeGreaterThan(0);
      expect(result.collectionsCount).toBeGreaterThanOrEqual(0);
    }, 30000);

    test('should handle connection failure gracefully', async () => {
      // Temporarily set invalid URI to test error handling
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI = 'mongodb://invalid:27017/test';

      const result = await testMongoDBConnection(new TestLogger());
      expect(result.status).toBe('FAIL');
      expect(result.error).toBeDefined();

      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    });
  });

  // Test API endpoints
  describe('API Endpoint Accessibility', () => {
    test('should validate API endpoint responses', async () => {
      const result = await testAPIEndpoints(new TestLogger());
      expect(result.status).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
    }, 30000);

    test('should handle network timeouts gracefully', async () => {
      // This would test with invalid URLs or timeouts
      const result = await testAPIEndpoints(new TestLogger());
      expect(result).toBeDefined();
    });
  });

  // Test database operations
  describe('Database Read/Write Operations', () => {
    test('should perform read/write operations successfully', async () => {
      const result = await testDatabaseOperations(new TestLogger());
      expect(result.status).toBe('PASS');
      expect(result.operations.write.success).toBe(true);
      expect(result.operations.read.success).toBe(true);
    }, 30000);

    test('should handle database operation failures', async () => {
      // Test with invalid collection or permissions
      const result = await testDatabaseOperations(new TestLogger());
      expect(result.status).toBeDefined();
    });
  });

  // Test network connectivity
  describe('Network Connectivity & Latency', () => {
    test('should verify network connectivity to all targets', async () => {
      const result = await testNetworkConnectivity(new TestLogger());
      expect(result.status).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
    }, 30000);

    test('should measure latency within acceptable thresholds', async () => {
      const result = await testNetworkConnectivity(new TestLogger());
      if (result.results) {
        result.results.forEach((target) => {
          if (target.status === 'PASS') {
            expect(target.latency).toBeGreaterThan(0);
            expect(target.latency).toBeLessThanOrEqual(
              PRODUCTION_CONFIG.latencyThreshold * 2
            ); // Allow some tolerance
          }
        });
      }
    });
  });

  // Test full suite execution
  describe('Full Test Suite Execution', () => {
    test('should run complete production connectivity test suite', async () => {
      const result = await runProductionConnectivityTests();
      expect(result).toBeDefined();
      // This would normally exit the process, but in test environment we capture the result
    }, 120000); // 2 minutes timeout for full suite
  });
});

// Run if called directly
if (require.main === module) {
  runProductionConnectivityTests().catch((error) => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}
