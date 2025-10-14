#!/usr/bin/env node

/**
 * Staging Health Check Test Script
 *
 * Tests health check endpoints for all ZodiaCore microservices in staging environment.
 * Verifies that services are running and responding correctly to health checks.
 *
 * Usage: node tests/staging-test-health.js
 */

const http = require('http');
const https = require('https');

// Configuration
const SERVICES = [
  { name: 'API Gateway', host: 'localhost', port: 3000, path: '/health' },
  { name: 'Vedic Service', host: 'localhost', port: 3001, path: '/health' },
  { name: 'Western Service', host: 'localhost', port: 3002, path: '/health' },
  { name: 'Mundane Service', host: 'localhost', port: 3003, path: '/health' },
];

const TIMEOUT = 5000; // 5 seconds timeout

/**
 * Make HTTP request to health endpoint
 * @param {Object} service - Service configuration
 * @returns {Promise<Object>} Response data
 */
function checkHealth(service) {
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
 * Validate health response
 * @param {Object} response - Health check response
 * @returns {Object} Validation result
 */
function validateHealthResponse(response) {
  const result = {
    service: response.service,
    status: 'PASS',
    message: 'Health check passed',
    details: [],
  };

  // Check HTTP status
  if (response.status !== 200) {
    result.status = 'FAIL';
    result.message = `Unexpected status code: ${response.status}`;
    result.details.push(`Expected 200, got ${response.status}`);
  }

  // Check response time
  if (response.responseTime > 1000) {
    result.status = 'WARN';
    result.message = 'Slow response time';
    result.details.push(
      `Response time: ${response.responseTime}ms (expected < 1000ms)`
    );
  }

  // Check response body structure
  if (!response.body) {
    result.status = 'FAIL';
    result.message = 'Missing response body';
    result.details.push('Response body is empty');
  } else {
    // Check for required health fields
    const requiredFields = ['status', 'timestamp', 'service'];
    const missingFields = requiredFields.filter(
      (field) => !response.body[field]
    );

    if (missingFields.length > 0) {
      result.status = 'FAIL';
      result.message = 'Missing required fields in response';
      result.details.push(`Missing fields: ${missingFields.join(', ')}`);
    }

    // Check status field
    if (response.body.status !== 'healthy' && response.body.status !== 'ok') {
      result.status = 'FAIL';
      result.message = 'Service reports unhealthy status';
      result.details.push(`Service status: ${response.body.status}`);
    }
  }

  return result;
}

/**
 * Run all health checks
 */
async function runHealthChecks() {
  console.log('🔍 Starting ZodiaCore Staging Health Checks\n');
  console.log('='.repeat(50));

  const results = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const service of SERVICES) {
    try {
      console.log(`\n📡 Checking ${service.name}...`);
      const response = await checkHealth(service);
      const validation = validateHealthResponse(response);

      results.push(validation);

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
      };
      results.push(result);
      console.log(`❌ ${service.name}: ${error.message}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Health Check Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${results.length}`);

  // Exit with appropriate code
  if (failed > 0) {
    console.log(
      '\n❌ Some health checks failed. Check service logs for details.'
    );
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  All health checks passed but some have warnings.');
    process.exit(0);
  } else {
    console.log('\n✅ All health checks passed successfully!');
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
  runHealthChecks().catch((error) => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runHealthChecks, checkHealth, validateHealthResponse };
