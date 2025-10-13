/**
 * Unit Tests for Mundane Astrology Utilities
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * Comprehensive test suite for utility classes and functions
 */

const {
    DateUtils,
    Logger,
    ValidationUtils,
    MundaneAstrologyError,
    ErrorHandler
} = require('./mundane-astrology-utils');

const { assert } = require('./mundane-test-runner.test');

describe('DateUtils', () => {
    describe('calculateJulianDay', () => {
        test('should calculate Julian Day for J2000 epoch', () => {
            const jd = DateUtils.calculateJulianDay(2000, 1, 1, 12, 0, 0);
            assert.closeTo(jd, 2451545.0, 1, 'Julian Day for J2000 epoch');
        });

        test('should handle leap years correctly', () => {
            const jd1 = DateUtils.calculateJulianDay(2000, 2, 29); // Leap year
            const jd2 = DateUtils.calculateJulianDay(2001, 2, 28); // Non-leap year
            assert.equal(jd1 > jd2, true, 'Leap year has later Julian Day');
        });

        test('should include time components', () => {
            const jd1 = DateUtils.calculateJulianDay(2000, 1, 1, 0, 0, 0);
            const jd2 = DateUtils.calculateJulianDay(2000, 1, 1, 12, 0, 0);
            assert.closeTo(jd2, jd1 + 0.5, 0.001, 'Time components add 0.5 days');
        });
    });

    describe('calculateJulianDayFromDate', () => {
        test('should parse date string correctly', () => {
            const jd = DateUtils.calculateJulianDayFromDate('2000-01-01');
            expect(jd).toBeCloseTo(2451544.5, 1);
        });

        test('should handle different date formats', () => {
            expect(() => {
                DateUtils.calculateJulianDayFromDate('invalid-date');
            }).toThrow();
        });
    });

    describe('calculateElapsedYears', () => {
        test('should calculate years between dates', () => {
            const start = new Date('2000-01-01');
            const end = new Date('2001-01-01');
            const years = DateUtils.calculateElapsedYears(start, end);
            expect(years).toBeCloseTo(1.0, 2);
        });

        test('should use current date as default', () => {
            const past = new Date('2000-01-01');
            const years = DateUtils.calculateElapsedYears(past);
            expect(years).toBeGreaterThan(20);
        });
    });
});

describe('Logger', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('generateCorrelationId', () => {
        test('should generate unique correlation IDs', () => {
            const id1 = Logger.generateCorrelationId();
            const id2 = Logger.generateCorrelationId();
            expect(id1).not.toBe(id2);
            expect(typeof id1).toBe('string');
            expect(id1.length).toBeGreaterThan(10);
        });
    });

    describe('log', () => {
        test('should format log entries correctly', () => {
            const entry = Logger.log('info', 'Test message', { key: 'value' }, 'test-id');
            expect(entry).toHaveProperty('timestamp');
            expect(entry.level).toBe('INFO');
            expect(entry.message).toBe('Test message');
            expect(entry.correlationId).toBe('test-id');
            expect(entry.context).toEqual({ key: 'value' });
        });

        test('should generate correlation ID if not provided', () => {
            const entry = Logger.log('info', 'Test message');
            expect(entry.correlationId).toBeDefined();
        });

        test('should log debug messages when DEBUG level', () => {
            process.env.LOG_LEVEL = 'DEBUG';
            Logger.log('debug', 'Debug message');
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('convenience methods', () => {
        test('info should call log with correct level', () => {
            const entry = Logger.info('Info message', { data: 'test' });
            expect(entry.level).toBe('INFO');
            expect(entry.message).toBe('Info message');
        });

        test('error should call log with correct level', () => {
            const entry = Logger.error('Error message', { error: 'test' });
            expect(entry.level).toBe('ERROR');
            expect(entry.message).toBe('Error message');
        });
    });
});

describe('ValidationUtils', () => {
    describe('validateCoordinates', () => {
        test('should accept valid coordinates', () => {
            expect(() => {
                ValidationUtils.validateCoordinates(40.7128, -74.0060);
            }).not.toThrow();
        });

        test('should reject invalid latitude', () => {
            expect(() => {
                ValidationUtils.validateCoordinates(91, 0);
            }).toThrow(MundaneAstrologyError);
        });

        test('should reject invalid longitude', () => {
            expect(() => {
                ValidationUtils.validateCoordinates(0, 181);
            }).toThrow(MundaneAstrologyError);
        });

        test('should reject non-numeric coordinates', () => {
            expect(() => {
                ValidationUtils.validateCoordinates('40.7128', '-74.0060');
            }).toThrow(MundaneAstrologyError);
        });
    });

    describe('validateNationalData', () => {
        test('should accept valid national data', () => {
            const validData = {
                countryName: 'Test Country',
                foundingYear: 1776,
                foundingMonth: 7,
                foundingDay: 4
            };
            expect(() => {
                ValidationUtils.validateNationalData(validData);
            }).not.toThrow();
        });

        test('should reject missing required fields', () => {
            const invalidData = {
                countryName: 'Test Country'
                // Missing founding date fields
            };
            expect(() => {
                ValidationUtils.validateNationalData(invalidData);
            }).toThrow(MundaneAstrologyError);
        });

        test('should reject invalid dates', () => {
            const invalidData = {
                countryName: 'Test Country',
                foundingYear: 1776,
                foundingMonth: 13, // Invalid month
                foundingDay: 4
            };
            expect(() => {
                ValidationUtils.validateNationalData(invalidData);
            }).toThrow(MundaneAstrologyError);
        });
    });

    describe('validateAnalysisRequest', () => {
        test('should accept valid request', () => {
            const validRequest = {
                region: { name: 'Test Region' },
                nationalData: {
                    countryName: 'Test Country',
                    foundingYear: 1776,
                    foundingMonth: 7,
                    foundingDay: 4
                }
            };
            expect(() => {
                ValidationUtils.validateAnalysisRequest(validRequest);
            }).not.toThrow();
        });

        test('should reject request without region', () => {
            const invalidRequest = {
                nationalData: {
                    countryName: 'Test Country',
                    foundingYear: 1776,
                    foundingMonth: 7,
                    foundingDay: 4
                }
            };
            expect(() => {
                ValidationUtils.validateAnalysisRequest(invalidRequest);
            }).toThrow(MundaneAstrologyError);
        });
    });

    describe('sanitizeString', () => {
        test('should remove dangerous characters', () => {
            const input = '<script>alert("xss")</script>Hello World';
            const sanitized = ValidationUtils.sanitizeString(input);
            expect(sanitized).toBe('Hello World');
        });

        test('should trim whitespace', () => {
            const input = '  test string  ';
            const sanitized = ValidationUtils.sanitizeString(input);
            expect(sanitized).toBe('test string');
        });

        test('should limit length', () => {
            const input = 'a'.repeat(200);
            const sanitized = ValidationUtils.sanitizeString(input);
            expect(sanitized.length).toBeLessThanOrEqual(100);
        });

        test('should handle non-string input', () => {
            const sanitized = ValidationUtils.sanitizeString(123);
            expect(sanitized).toBe('');
        });
    });
});

describe('MundaneAstrologyError', () => {
    test('should create error with correct properties', () => {
        const error = new MundaneAstrologyError('CALC_001', { test: 'data' });
        expect(error.name).toBe('MundaneAstrologyError');
        expect(error.code).toBe('CALC_001');
        expect(error.severity).toBe('HIGH');
        expect(error.details).toEqual({ test: 'data' });
        expect(error.timestamp).toBeInstanceOf(Date);
    });

    test('should throw for unknown error code', () => {
        expect(() => {
            new MundaneAstrologyError('UNKNOWN_CODE');
        }).toThrow();
    });

    describe('toLogFormat', () => {
        test('should format error for logging', () => {
            const error = new MundaneAstrologyError('CALC_001', { test: 'data' });
            const logFormat = error.toLogFormat();
            expect(logFormat).toHaveProperty('timestamp');
            expect(logFormat.error.code).toBe('CALC_001');
            expect(logFormat.error.severity).toBe('HIGH');
        });
    });

    describe('toUserMessage', () => {
        test('should provide user-friendly messages', () => {
            const error = new MundaneAstrologyError('CALC_001');
            const message = error.toUserMessage();
            expect(message).toContain('astronomical calculations');
        });

        test('should handle unknown codes', () => {
            const error = new MundaneAstrologyError('CALC_001');
            error.code = 'UNKNOWN';
            const message = error.toUserMessage();
            expect(message).toBe('An unexpected error occurred.');
        });
    });
});

describe('ErrorHandler', () => {
    let loggerSpy;

    beforeEach(() => {
        loggerSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        loggerSpy.mockRestore();
    });

    describe('handleError', () => {
        test('should handle recoverable errors', async () => {
            const error = new MundaneAstrologyError('CALC_001');
            const result = await ErrorHandler.handleError(error, { context: 'test' });
            expect(result.success).toBe(false);
            expect(result.error.code).toBe('CALC_001');
        });

        test('should attempt recovery for recoverable errors', async () => {
            const error = new MundaneAstrologyError('COORD_001');
            const result = await ErrorHandler.handleError(error, { context: 'test' });
            expect(result.success).toBe(true);
            expect(result.coordinates).toEqual({ lat: 0, lon: 0 });
        });

        test('should not attempt recovery for non-recoverable errors', async () => {
            const error = new MundaneAstrologyError('DATE_001');
            const result = await ErrorHandler.handleError(error, { context: 'test' });
            expect(result.success).toBe(false);
        });
    });

    describe('getRecoveryStrategy', () => {
        test('should return recovery strategy for known errors', () => {
            const strategy = ErrorHandler.getRecoveryStrategy('CALC_001');
            expect(strategy.canRecover).toBe(true);
            expect(strategy.fallback).toBe('simplified_calculation');
        });

        test('should return no recovery for unknown errors', () => {
            const strategy = ErrorHandler.getRecoveryStrategy('UNKNOWN');
            expect(strategy.canRecover).toBe(false);
        });
    });
});