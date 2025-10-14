#!/usr/bin/env node

/**
 * Staging Metrics Test Script
 *
 * Tests metrics collection for all ZodiaCore microservices in staging environment.
 * Verifies that services are exposing Prometheus-compatible metrics correctly.
 *
 * Usage: node tests/staging-test-metrics.js
 */

const http = require('http');

// Configuration
const SERVICES = [
  { name: 'API Gateway', host: 'localhost', port: 3000, path: '/metrics' },
  { name: 'Vedic Service', host: 'localhost', port: 3001, path: '/metrics' },
  { name: 'Western Service', host: 'localhost', port: 3002, path: '/metrics' },
  { name: 'Mundane Service', host: 'localhost', port: 3003, path: '/metrics' },
];

const TIMEOUT = 5000; // 5 seconds timeout

/**
 * Make HTTP request to metrics endpoint
 * @param {Object} service - Service configuration
 * @returns {Promise<Object>} Response data
 */
function fetchMetrics(service) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: service.host,
      port: service.port,
      path: service.path,
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'ZodiaCore-Staging-Test/1.0',
        Accept: 'text/plain',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = {
          service: service.name,
          status: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime: Date.now() - req.startTime,
        };
        resolve(response);
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
 * Parse Prometheus metrics format
 * @param {string} metricsText - Raw metrics text
 * @returns {Object} Parsed metrics
 */
function parsePrometheusMetrics(metricsText) {
  const lines = metricsText
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'));
  const metrics = {};

  lines.forEach((line) => {
    const parts = line.split(' ');
    if (parts.length >= 2) {
      const metricName = parts[0].split('{')[0]; // Remove labels
      const value = parseFloat(parts[parts.length - 1]);

      if (!isNaN(value)) {
        if (!metrics[metricName]) {
          metrics[metricName] = [];
        }
        metrics[metricName].push(value);
      }
    }
  });

  return metrics;
}

/**
 * Validate metrics response
 * @param {Object} response - Metrics response
 * @returns {Object} Validation result
 */
function validateMetricsResponse(response) {
  const result = {
    service: response.service,
    status: 'PASS',
    message: 'Metrics collection working',
    details: [],
    metricsCount: 0,
    requiredMetrics: [],
  };

  // Check HTTP status
  if (response.status !== 200) {
    result.status = 'FAIL';
    result.message = `Unexpected status code: ${response.status}`;
    result.details.push(`Expected 200, got ${response.status}`);
    return result;
  }

  // Check response time
  if (response.responseTime > 1000) {
    result.status = 'WARN';
    result.details.push(
      `Response time: ${response.responseTime}ms (expected < 1000ms)`
    );
  }

  // Check Content-Type
  const contentType = response.headers['content-type'];
  if (!contentType || !contentType.includes('text/plain')) {
    result.status = 'WARN';
    result.details.push(
      `Unexpected Content-Type: ${contentType} (expected text/plain)`
    );
  }

  // Parse and validate metrics
  if (!response.body || response.body.trim() === '') {
    result.status = 'FAIL';
    result.message = 'Empty metrics response';
    result.details.push('Response body is empty');
    return result;
  }

  try {
    const parsedMetrics = parsePrometheusMetrics(response.body);
    result.metricsCount = Object.keys(parsedMetrics).length;

    // Check for required metrics
    const requiredMetrics = [
      'http_requests_total',
      'http_request_duration_seconds',
      'process_memory_usage_bytes',
      'process_cpu_usage_percent',
    ];

    const foundMetrics = requiredMetrics.filter(
      (metric) => parsedMetrics[metric]
    );
    result.requiredMetrics = foundMetrics;

    if (foundMetrics.length < requiredMetrics.length) {
      const missing = requiredMetrics.filter(
        (metric) => !parsedMetrics[metric]
      );
      result.status = 'WARN';
      result.details.push(`Missing required metrics: ${missing.join(', ')}`);
    }

    // Check for reasonable metric values
    if (parsedMetrics.http_requests_total) {
      const requestCount = parsedMetrics.http_requests_total[0];
      if (requestCount < 0) {
        result.status = 'FAIL';
        result.details.push('Invalid http_requests_total value');
      }
    }

    if (parsedMetrics.process_cpu_usage_percent) {
      const cpuUsage = parsedMetrics.process_cpu_usage_percent[0];
      if (cpuUsage < 0 || cpuUsage > 100) {
        result.status = 'FAIL';
        result.details.push('Invalid process_cpu_usage_percent value');
      }
    }
  } catch (error) {
    result.status = 'FAIL';
    result.message = 'Failed to parse metrics';
    result.details.push(`Parse error: ${error.message}`);
  }

  return result;
}

/**
 * Run all metrics tests
 */
async function runMetricsTests() {
  console.log('📊 Starting ZodiaCore Staging Metrics Tests\n');
  console.log('='.repeat(50));

  const results = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const service of SERVICES) {
    try {
      console.log(`\n📈 Testing ${service.name} metrics...`);
      const response = await fetchMetrics(service);
      const validation = validateMetricsResponse(response);

      results.push(validation);

      console.log(`   📊 Metrics found: ${validation.metricsCount}`);
      console.log(
        `   ✅ Required metrics: ${validation.requiredMetrics.length}/4`
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
        metricsCount: 0,
        requiredMetrics: [],
      };
      results.push(result);
      console.log(`❌ ${service.name}: ${error.message}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📈 Metrics Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️  Warnings: ${warnings}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total: ${results.length}`);

  // Exit with appropriate code
  if (failed > 0) {
    console.log(
      '\n❌ Some metrics tests failed. Check service configurations.'
    );
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  All metrics tests passed but some have warnings.');
    process.exit(0);
  } else {
    console.log('\n✅ All metrics tests passed successfully!');
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
  runMetricsTests().catch((error) => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  runMetricsTests,
  fetchMetrics,
  validateMetricsResponse,
  parsePrometheusMetrics,
};
