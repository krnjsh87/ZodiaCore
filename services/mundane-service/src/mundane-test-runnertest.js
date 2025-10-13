/**
 * Simple Test Runner for Mundane Astrology Tests
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * Manual test runner to execute tests without npm/jest setup
 */

// Simple assertion library
const assert = {
    equal: (actual, expected, message) => {
        if (actual !== expected) {
            throw new Error(`Assertion failed: ${message || ''}. Expected ${expected}, got ${actual}`);
        }
        console.log(`✓ ${message || 'Test passed'}`);
    },

    closeTo: (actual, expected, delta, message) => {
        if (Math.abs(actual - expected) > delta) {
            throw new Error(`Assertion failed: ${message || ''}. Expected ${expected} ± ${delta}, got ${actual}`);
        }
        console.log(`✓ ${message || 'Test passed'}`);
    },

    throws: (fn, errorType, message) => {
        try {
            fn();
            throw new Error(`Expected ${errorType.name} to be thrown`);
        } catch (error) {
            if (error instanceof errorType) {
                console.log(`✓ ${message || 'Exception test passed'}`);
            } else {
                throw new Error(`Expected ${errorType.name}, got ${error.constructor.name}`);
            }
        }
    },

    doesNotThrow: (fn, message) => {
        try {
            fn();
            console.log(`✓ ${message || 'No exception test passed'}`);
        } catch (error) {
            throw new Error(`Unexpected exception: ${error.message}`);
        }
    }
};

// Test runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.currentSuite = null;
    }

    describe(name, fn) {
        this.currentSuite = name;
        console.log(`\n📋 Suite: ${name}`);
        fn();
        this.currentSuite = null;
    }

    test(name, fn) {
        this.tests.push({ name, fn, suite: this.currentSuite });
    }

    async run() {
        console.log('🚀 Running Mundane Astrology Tests\n');

        let passed = 0;
        let failed = 0;

        for (const test of this.tests) {
            try {
                await test.fn();
                passed++;
            } catch (error) {
                console.log(`❌ ${test.suite ? test.suite + ' > ' : ''}${test.name}: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

        if (failed === 0) {
            console.log('🎉 All tests passed!');
        }

        return { passed, failed };
    }
}

// Mock console methods to avoid conflicts
const originalConsole = { ...console };
console.log = (...args) => originalConsole.log(...args);
console.error = (...args) => originalConsole.error(...args);
console.warn = (...args) => originalConsole.warn(...args);

// Export for use in test files
global.assert = assert;
global.describe = (name, fn) => global.testRunner.describe(name, fn);
global.test = (name, fn) => global.testRunner.test(name, fn);
global.beforeEach = (fn) => { global.beforeEachFn = fn; };
global.afterEach = (fn) => { global.afterEachFn = fn; };

// Initialize test runner
global.testRunner = new TestRunner();

// Run tests when this file is executed
if (require.main === module) {
    // Load and run test files
    const fs = require('fs');
    const path = require('path');

    const testFiles = [
        'mundane-astrology-utils.test.js',
        'mundane-astronomical-calculations.test.js',
        'mundane-astrology-system.test.js'
    ];

    async function runAllTests() {
        for (const testFile of testFiles) {
            const testPath = path.join(__dirname, testFile);
            if (fs.existsSync(testPath)) {
                console.log(`\n📂 Loading ${testFile}...`);
                try {
                    require(testPath);
                } catch (error) {
                    console.error(`❌ Failed to load ${testFile}:`, error.message);
                }
            } else {
                console.warn(`⚠️  Test file not found: ${testFile}`);
            }
        }

        const results = await global.testRunner.run();
        process.exit(results.failed > 0 ? 1 : 0);
    }

    runAllTests().catch(error => {
        console.error('Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = { assert, TestRunner };