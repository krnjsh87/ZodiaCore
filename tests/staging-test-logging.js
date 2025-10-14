#!/usr/bin/env node

/**
 * Staging Logging Test Script
 *
 * Tests logging functionality for ZodiaCore microservices in staging environment.
 * Verifies that services are generating logs with correlation IDs and proper structure.
 *
 * Usage: node tests/staging-test-logging.js
 */

const http = require('http');
const { v4: uuidv4 } = require('uuid');

// Configuration
const SERVICES = [
  { name: 'API Gateway', host: 'localhost', port: 3000, path: '/health' },
  { name: 'Vedic Service', host: 'localhost', port: 3001, path: '/health' },
  { name: 'Western Service', host: 'localhost', port: 3002, path: '/health' },
  { name: 'Mundane Service', host: 'localhost', port: 3003, path: '/health' },
];

const TIMEOUT = 5000; // 5 seconds timeout

/**
 * Make HTTP request with correlation ID header
 * @param {Object} service - Service configuration
 * @param {string} correlationId - Correlation ID to use
 * @returns {Promise<Object>} Response data
 */
function makeRequestWithCorrelationId(service, correlationId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: service.host,
      port: service.port,
      path: service.path,
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'ZodiaCore-Staging-Test/1.0',
        Accept: 'application/json',
        'x-correlation-id': correlationId,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = {
            service: service.name,
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
            responseTime: Date.now() - req.startTime,
            correlationId: correlationId,
          };
          resolve(response);
        } catch (error) {
          reject(
            new Error(
              `Failed to parse response from ${service.name}: ${error.message}`
            )
          );
        }
      });
    });

    req.startTime = Date.now();

    req.on('error', (error) => {
      reject(new Error(`Request failed for ${service.name}: ${error.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout (${TIMEOUT}ms) for ${service.name}`));
    });

    req.end();
  });
}

/**
 * Generate test requests to trigger logging
 * @param {Object} service - Service configuration
 * @returns {Promise<Array>} Array of request results
 */
async function generateTestRequests(service) {
  const results = [];
  const correlationIds = [uuidv4(), uuidv4(), uuidv4()]; // Generate multiple correlation IDs

  for (const correlationId of correlationIds) {
    try {
      const response = await makeRequestWithCorrelationId(
        service,
        correlationId
      );
      results.push({
        correlationId,
        success: true,
        response,
      });
    } catch (error) {
      results.push({
        correlationId,
        success: false,
        error: error.message,
      });
    }

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Validate logging behavior (this is more of a smoke test since we can't directly read logs)
 * @param {Array} requestResults - Results from test requests
 * @returns {Object} Validation result
 */
function validateLoggingBehavior(requestResults) {
  const result = {
    service: requestResults[0]?.response?.service || 'Unknown',
    status: 'PASS',
    message: 'Logging test completed',
    details: [],
    requestsMade: requestResults.length,
    successfulRequests: 0,
    correlationIds: [],
  };

  requestResults.forEach((resultItem, index) => {
    if (resultItem.success) {
      result.successfulRequests++;
      result.correlationIds.push(resultItem.correlationId);

      // Check if correlation ID is returned in response headers
      const responseCorrelationId =
        resultItem.response.headers['x-correlation-id'];
      if (responseCorrelationId !== resultItem.correlationId) {
        result.status = 'WARN';
        result.details.push(
          `Request ${index + 1}: Correlation ID mismatch in response header`
        );
      }
    } else {
      result.status = 'FAIL';
      result.details.push(`Request ${index + 1}: Failed - ${resultItem.error}`);
    }
  });

  // Check if we have unique correlation IDs
  const uniqueIds = new Set(result.correlationIds);
  if (uniqueIds.size !== result.correlationIds.length) {
    result.status = 'WARN';
    result.details.push('Duplicate correlation IDs detected');
  }

  // Check success rate
  const successRate = (result.successfulRequests / result.requestsMade) * 100;
  if (successRate < 100) {
    result.status = 'FAIL';
    result.message = `Only ${successRate.toFixed(1)}% of requests succeeded`;
  }

  return result;
}

/**
 * Run logging tests for all services
 */
async function runLoggingTests() {
  console.log('📝 Starting ZodiaCore Staging Logging Tests\n');
  console.log('='.repeat(50));
  console.log(
    'Note: This test verifies correlation ID handling and request success.'
  );
  console.log(
    'Actual log output should be checked manually in service logs.\n'
  );

  const results = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const service of SERVICES) {
    try {
      console.log(`\n🔍 Testing ${service.name} logging...`);
      const requestResults = await generateTestRequests(service);
      const validation = validateLoggingBehavior(requestResults);

      results.push(validation);

      console.log(`   📊 Requests made: ${validation.requestsMade}`);
      console.log(`   ✅ Successful: ${validation.successfulRequests}`);
      console.log(
        `   🆔 Correlation IDs: ${validation.correlationIds.length} unique`
      );

      if (validation.status === 'PASS') {
        console.log(`✅ ${validation.service}: ${validation.message}`);
        passed++;
      } else if (validation.status === 'WARN') {
        console.log(`⚠️  ${validation.service}: ${validation.message}`);
        warnings++;
      } else {
        console.log(`❌ ${validation.service}: ${validation.message}`);
        failed++;
      }

      if (validation.details.length > 0) {
        validation.details.forEach((detail) => {
          console.log(`   ${detail}`);
        });
      }
    } catch (error) {
      const result = {
        service: service.name,
        status: 'FAIL',
        message: error.message,
        details: [],
        requestsMade: 0,
        successfulRequests: 0,
        correlationIds: [],
      };
      results.push(result);
      console.log(`❌ ${service.name}: ${error.message}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📝 Logging Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total: ${results.length}`);

  console.log('\n🔍 Manual Log Verification Required:');
  console.log('   Check service logs for JSON-formatted entries with:');
  console.log('   - timestamp, level, message fields');
  console.log('   - correlationId matching request headers');
  console.log('   - service name identification');
  console.log('   - Proper log levels (info, debug, error, etc.)');

  // Exit with appropriate code
  if (failed > 0) {
    console.log(
      '\n❌ Some logging tests failed. Check service configurations.'
    );
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  All logging tests passed but some have warnings.');
    process.exit(0);
  } else {
    console.log('\n✅ All logging tests passed successfully!');
    process.exit(0);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  runLoggingTests().catch((error) => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  runLoggingTests,
  makeRequestWithCorrelationId,
  generateTestRequests,
  validateLoggingBehavior,
};
