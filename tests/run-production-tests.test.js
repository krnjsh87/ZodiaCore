#!/usr/bin/env node

/**
 * Production Environment Test Runner
 *
 * Orchestrates comprehensive testing for production environment connectivity
 * as specified in microtask 0.3.8. This script runs the production connectivity
 * tests and provides detailed reporting.
 *
 * Usage: node tests/run-production-tests.test.js
 * Or: npm test -- --testPathPattern=run-production-tests.test.js
 */

const {
  runProductionConnectivityTests,
} = require('./production-connectivity-test.test.js');

// Configuration
const TEST_CONFIG = {
  timeout: parseInt(process.env.TEST_RUNNER_TIMEOUT_MS) || 300000, // 5 minutes
  retries: parseInt(process.env.TEST_RUNNER_RETRIES) || 2,
  logLevel: process.env.TEST_LOG_LEVEL || 'info',
};

// Test runner class
class ProductionTestRunner {
  constructor() {
    this.startTime = null;
    this.endTime = null;
    this.results = null;
    this.exitCode = 0;
  }

  /**
   * Run all production tests
   */
  async runTests() {
    console.log('🚀 Starting ZodiaCore Production Environment Test Suite');
    console.log('==================================================');
    console.log(`Start Time: ${new Date().toISOString()}`);
    console.log(`Timeout: ${TEST_CONFIG.timeout}ms`);
    console.log(`Retries: ${TEST_CONFIG.retries}`);
    console.log('');

    this.startTime = Date.now();

    try {
      // Set up timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(`Test suite timed out after ${TEST_CONFIG.timeout}ms`)
            ),
          TEST_CONFIG.timeout
        );
      });

      // Run tests with timeout
      const testPromise = runProductionConnectivityTests();
      this.results = await Promise.race([testPromise, timeoutPromise]);

      this.endTime = Date.now();
      const duration = this.endTime - this.startTime;

      console.log('');
      console.log('==================================================');
      console.log('🏁 Test Suite Completed');
      console.log(`Duration: ${duration}ms`);
      console.log(`End Time: ${new Date(this.endTime).toISOString()}`);

      // Determine exit code based on results
      this.exitCode = this.determineExitCode();

      if (this.exitCode === 0) {
        console.log('✅ All production tests passed successfully!');
      } else {
        console.log('❌ Some production tests failed. Check logs for details.');
      }
    } catch (error) {
      this.endTime = Date.now();
      const duration = this.endTime - this.startTime;

      console.error('');
      console.error('==================================================');
      console.error('❌ Test Suite Failed');
      console.error(`Duration: ${duration}ms`);
      console.error(`Error: ${error.message}`);

      this.exitCode = 1;
      this.results = { error: error.message };
    }

    // Print summary
    this.printSummary();

    return this.exitCode;
  }

  /**
   * Determine exit code based on test results
   */
  determineExitCode() {
    if (!this.results || this.results.error) {
      return 1;
    }

    // Check if any tests failed
    const failedTests = this.results.tests.filter(
      (test) => test.status === 'FAIL'
    );
    return failedTests.length > 0 ? 1 : 0;
  }

  /**
   * Print test summary
   */
  printSummary() {
    if (!this.results || this.results.error) {
      console.log('📊 Summary: Test suite execution failed');
      return;
    }

    const totalTests = this.results.tests.length;
    const passedTests = this.results.tests.filter(
      (test) => test.status === 'PASS'
    ).length;
    const failedTests = this.results.tests.filter(
      (test) => test.status === 'FAIL'
    ).length;

    console.log('');
    console.log('📊 Test Summary:');
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(
      `   📈 Success Rate: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`
    );

    if (failedTests > 0) {
      console.log('');
      console.log('❌ Failed Tests:');
      this.results.tests
        .filter((test) => test.status === 'FAIL')
        .forEach((test) => {
          console.log(`   - ${test.name}: ${test.message}`);
        });
    }

    console.log('');
    console.log('📋 Next Steps:');
    if (this.exitCode === 0) {
      console.log('   ✅ Production environment connectivity verified');
      console.log('   📝 Review detailed logs for performance metrics');
      console.log('   🚀 Ready for production deployment');
    } else {
      console.log('   🔍 Check detailed logs for failure reasons');
      console.log('   🛠️  Fix identified issues before deployment');
      console.log('   📞 Contact DevOps team if needed');
    }
  }

  /**
   * Get test results
   */
  getResults() {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.endTime - this.startTime,
      exitCode: this.exitCode,
      results: this.results,
    };
  }
}

// Main execution
async function main() {
  const runner = new ProductionTestRunner();
  const exitCode = await runner.runTests();

  // Save results to file
  const resultsFile = `production-test-run-results-${Date.now()}.json`;
  const fs = require('fs');
  fs.writeFileSync(resultsFile, JSON.stringify(runner.getResults(), null, 2));
  console.log(`📄 Detailed results saved to: ${resultsFile}`);

  process.exit(exitCode);
}

// Export for testing
module.exports = {
  ProductionTestRunner,
  TEST_CONFIG,
};

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Fatal error in test runner:', error.message);
    process.exit(1);
  });
}
