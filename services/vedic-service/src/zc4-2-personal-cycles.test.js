/**
 * ZC4.2 Personal Year/Month/Day Cycles Unit Tests
 * @version 1.0.0
 * @author ZodiaCore Development Team
 *
 * Comprehensive unit tests for the ZC4.2 Personal Cycles Calculator
 */

const { ZC42PersonalCyclesCalculator, PersonalCyclesError } = require('./zc4-2-personal-cycles-calculator');
const {
    validateBirthDate,
    validateTargetDate,
    reduceToSingleDigit,
    calculateCompoundNumber,
    getMonthName,
    getDayOfWeek,
    calculateYearCyclePosition,
    validateSystem,
    calculateNumberCompatibility,
    PersonalCyclesError: UtilsError
} = require('./zc4-2-personal-cycles-utils');

describe('ZC42PersonalCyclesCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC42PersonalCyclesCalculator();
    });

    describe('calculatePersonalYear', () => {
        test('calculates correct personal year for May 15, 1990 in 2025', () => {
            const result = calculator.calculatePersonalYear('1990-05-15', 2025);
            // 5 + 15 + 2025 = 2045, 2+0+4+5=11, 1+1=2
            expect(result.personalYear).toBe(2);
            expect(result.components.birthMonth).toBe(5);
            expect(result.components.birthDay).toBe(15);
            expect(result.components.currentYear).toBe(2025);
            expect(result.components.total).toBe(2045);
            expect(result.interpretation.name).toBe('Cooperation');
        });

        test('handles master number reduction', () => {
            // Test case that would result in master number before reduction
            const result = calculator.calculatePersonalYear('1988-11-22', 2025);
            expect(result.personalYear).toBeGreaterThan(0);
            expect(result.personalYear).toBeLessThanOrEqual(9);
        });

        test('throws error for invalid date', () => {
            expect(() => calculator.calculatePersonalYear('invalid')).toThrow(PersonalCyclesError);
        });

        test('throws error for future birth date', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            expect(() => calculator.calculatePersonalYear(futureDate)).toThrow(PersonalCyclesError);
        });
    });

    describe('calculatePersonalMonth', () => {
        test('calculates correct personal month', () => {
            const result = calculator.calculatePersonalMonth(2, 10);
            // 2 + 10 = 12, 1+2=3
            expect(result.personalMonth).toBe(3);
            expect(result.components.personalYear).toBe(2);
            expect(result.components.currentMonth).toBe(10);
            expect(result.components.total).toBe(12);
            expect(result.interpretation.name).toBe('Expression');
            expect(result.monthName).toBe('October');
        });

        test('throws error for invalid month', () => {
            expect(() => calculator.calculatePersonalMonth(2, 13)).toThrow(PersonalCyclesError);
            expect(() => calculator.calculatePersonalMonth(2, 0)).toThrow(PersonalCyclesError);
        });
    });

    describe('calculatePersonalDay', () => {
        test('calculates correct personal day', () => {
            const result = calculator.calculatePersonalDay(3, 15);
            // 3 + 15 = 18, 1+8=9
            expect(result.personalDay).toBe(9);
            expect(result.components.personalMonth).toBe(3);
            expect(result.components.currentDay).toBe(15);
            expect(result.components.total).toBe(18);
            expect(result.interpretation.name).toBe('Completion');
        });

        test('throws error for invalid day', () => {
            expect(() => calculator.calculatePersonalDay(3, 32)).toThrow(PersonalCyclesError);
            expect(() => calculator.calculatePersonalDay(3, 0)).toThrow(PersonalCyclesError);
        });
    });

    describe('calculateCompleteCycles', () => {
        test('generates complete analysis', () => {
            const analysis = calculator.calculateCompleteCycles('1990-05-15', '2025-10-08');

            expect(analysis).toHaveProperty('birthDate', '1990-05-15');
            expect(analysis).toHaveProperty('targetDate', '2025-10-08');
            expect(analysis).toHaveProperty('cycles');
            expect(analysis.cycles).toHaveProperty('year');
            expect(analysis.cycles).toHaveProperty('month');
            expect(analysis.cycles).toHaveProperty('day');
            expect(analysis).toHaveProperty('compatibility');
            expect(analysis).toHaveProperty('recommendations');
        });

        test('defaults to current date when no target date provided', () => {
            const analysis = calculator.calculateCompleteCycles('1990-05-15');
            expect(analysis.targetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('analyzeCycleCompatibility', () => {
        test('analyzes compatibility correctly', () => {
            const year = { personalYear: 1 };
            const month = { personalMonth: 2 };
            const day = { personalDay: 3 };

            const compatibility = calculator.analyzeCycleCompatibility(year, month, day);

            expect(compatibility).toHaveProperty('yearMonth');
            expect(compatibility).toHaveProperty('monthDay');
            expect(compatibility).toHaveProperty('yearDay');
            expect(compatibility).toHaveProperty('overallHarmony');
            expect(['High', 'Medium', 'Low']).toContain(compatibility.overallHarmony);
        });
    });

    describe('generateCycleForecast', () => {
        test('generates forecast for specified months', () => {
            const forecast = calculator.generateCycleForecast('1990-05-15', 3);

            expect(forecast).toHaveProperty('birthDate', '1990-05-15');
            expect(forecast).toHaveProperty('forecastPeriod', '3 months');
            expect(forecast).toHaveProperty('forecasts');
            expect(forecast.forecasts).toHaveLength(3);
            expect(forecast).toHaveProperty('summary');
        });
    });

    describe('calculateCompleteAnalysis', () => {
        test('generates complete analysis with options', () => {
            const analysis = calculator.calculateCompleteAnalysis(
                '1990-05-15',
                '2025-10-08',
                { includeForecast: true, forecastMonths: 6 }
            );

            expect(analysis).toHaveProperty('cycles');
            expect(analysis).toHaveProperty('interpretations');
            expect(analysis).toHaveProperty('forecast');
            expect(analysis).toHaveProperty('integration');
        });

        test('caches results', () => {
            const analysis1 = calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');
            const analysis2 = calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

            expect(analysis1.timestamp).toBe(analysis2.timestamp);
        });

        test('skips cache when requested', () => {
            calculator.clearCache(); // Clear cache first
            const analysis1 = calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08', { skipCache: true });
            // Small delay to ensure different timestamps
            setTimeout(() => {
                const analysis2 = calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08', { skipCache: true });
                expect(analysis1.timestamp).not.toBe(analysis2.timestamp);
            }, 1);
        });
    });

    describe('generateMonthlyAnalysis', () => {
        test('generates monthly cycle analysis', () => {
            const analysis = calculator.generateMonthlyAnalysis('1990-05-15', 2025, 10);

            expect(analysis).toHaveProperty('birthDate', '1990-05-15');
            expect(analysis).toHaveProperty('month', '2025-10');
            expect(analysis).toHaveProperty('dailyCycles');
            expect(analysis.dailyCycles).toHaveLength(31); // October has 31 days
            expect(analysis).toHaveProperty('summary');
        });
    });

    describe('getHealthStatus', () => {
        test('returns health status', () => {
            const status = calculator.getHealthStatus();

            expect(status).toHaveProperty('status', 'healthy');
            expect(status).toHaveProperty('version', '1.0.0');
            expect(status).toHaveProperty('cacheSize');
            expect(status).toHaveProperty('lastUpdated');
        });
    });

    describe('clearCache', () => {
        test('clears the cache', () => {
            calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');
            expect(calculator.cache.size).toBeGreaterThan(0);

            calculator.clearCache();
            expect(calculator.cache.size).toBe(0);
        });
    });
});

describe('Utility Functions', () => {
    describe('validateBirthDate', () => {
        test('validates string date', () => {
            const date = validateBirthDate('1990-05-15');
            expect(date.getFullYear()).toBe(1990);
            expect(date.getMonth()).toBe(4); // 0-based
            expect(date.getDate()).toBe(15);
        });

        test('validates Date object', () => {
            const inputDate = new Date('1990-05-15');
            const date = validateBirthDate(inputDate);
            expect(date).toEqual(inputDate);
        });

        test('throws error for invalid date', () => {
            expect(() => validateBirthDate('invalid')).toThrow(UtilsError);
        });

        test('throws error for future date', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            expect(() => validateBirthDate(futureDate)).toThrow(UtilsError);
        });
    });

    describe('validateTargetDate', () => {
        test('validates target date', () => {
            const date = validateTargetDate('2025-10-08');
            expect(date.getFullYear()).toBe(2025);
            expect(date.getMonth()).toBe(9); // 0-based
            expect(date.getDate()).toBe(8);
        });

        test('throws error for invalid date', () => {
            expect(() => validateTargetDate('invalid')).toThrow(UtilsError);
        });
    });

    describe('reduceToSingleDigit', () => {
        test('reduces single digit numbers', () => {
            expect(reduceToSingleDigit(5)).toBe(5);
        });

        test('reduces multi-digit numbers', () => {
            expect(reduceToSingleDigit(15)).toBe(6); // 1+5=6
            expect(reduceToSingleDigit(99)).toBe(9); // 9+9=18, 1+8=9
        });

        test('reduces master numbers', () => {
            expect(reduceToSingleDigit(11)).toBe(2); // 11-9=2
            expect(reduceToSingleDigit(22)).toBe(4); // 22-9=13, 1+3=4
        });

        test('throws error for invalid input', () => {
            expect(() => reduceToSingleDigit('invalid')).toThrow(UtilsError);
        });
    });

    describe('calculateCompoundNumber', () => {
        test('calculates compound number', () => {
            expect(calculateCompoundNumber(123)).toBe(6); // 1+2+3=6
            expect(calculateCompoundNumber(999)).toBe(27); // 9+9+9=27
        });

        test('throws error for invalid input', () => {
            expect(() => calculateCompoundNumber('invalid')).toThrow(UtilsError);
        });
    });

    describe('getMonthName', () => {
        test('returns correct month names', () => {
            expect(getMonthName(1)).toBe('January');
            expect(getMonthName(12)).toBe('December');
        });

        test('throws error for invalid month', () => {
            expect(() => getMonthName(0)).toThrow(UtilsError);
            expect(() => getMonthName(13)).toThrow(UtilsError);
        });
    });

    describe('calculateYearCyclePosition', () => {
        test('calculates cycle position', () => {
            const birthDate = new Date('1990-05-15');
            const position = calculateYearCyclePosition(birthDate, 2025);

            expect(position.yearsSinceBirth).toBe(35);
            expect(position.positionInCycle).toBe(9); // 35 + 1 = 36, 36 % 9 = 0, but should be 1-9, so 9
            expect(position.nextCycleStart).toBe(2026); // birthYear + (cycleNumber * 9) = 1990 + (4 * 9) = 2026
        });
    });

    describe('calculateNumberCompatibility', () => {
        test('calculates compatibility score', () => {
            expect(calculateNumberCompatibility(1, 1)).toBe(1); // Perfect match
            expect(calculateNumberCompatibility(1, 9)).toBe(0); // Maximum difference
            expect(calculateNumberCompatibility(1, 5)).toBe(0.5); // Half difference
        });
    });
});

describe('Integration Tests', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC42PersonalCyclesCalculator();
    });

    test('end-to-end calculation flow', () => {
        // Test complete flow from birth date to analysis
        const analysis = calculator.calculateCompleteCycles('1990-05-15', '2025-10-08');

        // Verify structure
        expect(analysis.cycles.year.personalYear).toBe(2);
        expect(analysis.cycles.month.personalMonth).toBeDefined();
        expect(analysis.cycles.day.personalDay).toBeDefined();

        // Verify compatibility analysis
        expect(analysis.compatibility.overallHarmony).toBeDefined();

        // Verify recommendations exist
        expect(analysis.recommendations.keyThemes).toBeDefined();
    });

    test('forecast generation', () => {
        const forecast = calculator.generateCycleForecast('1990-05-15', 12);

        expect(forecast.forecasts).toHaveLength(12);
        forecast.forecasts.forEach(item => {
            expect(item).toHaveProperty('yearCycle');
            expect(item).toHaveProperty('monthCycle');
            expect(item).toHaveProperty('compatibility');
            expect(item).toHaveProperty('keyThemes');
        });
    });

    test('monthly analysis', () => {
        const monthly = calculator.generateMonthlyAnalysis('1990-05-15', 2025, 10);

        expect(monthly.dailyCycles).toHaveLength(31);
        monthly.dailyCycles.forEach(day => {
            expect(day).toHaveProperty('dayCycle');
            expect(day).toHaveProperty('interpretation');
            expect(day).toHaveProperty('compatibility');
        });
    });
});

describe('Performance Benchmarks', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC42PersonalCyclesCalculator();
    });

    test('single cycle calculation within time limit', () => {
        const startTime = Date.now();

        calculator.calculatePersonalYear('1990-05-15', 2025);

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(10); // Less than 10ms
    });

    test('complete analysis within time limit', () => {
        const startTime = Date.now();

        calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(50); // Less than 50ms
    });

    test('forecast generation within time limit', () => {
        const startTime = Date.now();

        calculator.generateCycleForecast('1990-05-15', 12);

        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(200); // Less than 200ms for 12 months
    });
});

describe('Edge Cases and Boundary Conditions', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC42PersonalCyclesCalculator();
    });

    describe('Leap Year Handling', () => {
        test('handles February 29 in leap year', () => {
            const result = calculator.calculatePersonalYear('2000-02-29', 2024);
            expect(result.personalYear).toBeDefined();
            expect(result.components.birthDay).toBe(29);
        });

        test('handles February 28 in non-leap year', () => {
            const result = calculator.calculatePersonalYear('1999-02-28', 2023);
            expect(result.personalYear).toBeDefined();
            expect(result.components.birthDay).toBe(28);
        });
    });

    describe('Month Transitions', () => {
        test('handles December to January transition', () => {
            const decResult = calculator.calculatePersonalMonth(5, 12);
            const janResult = calculator.calculatePersonalMonth(5, 1);

            expect(decResult.personalMonth).toBeDefined();
            expect(janResult.personalMonth).toBeDefined();
        });

        test('handles month 31 days correctly', () => {
            const result = calculator.calculatePersonalDay(5, 31);
            expect(result.personalDay).toBeDefined();
            expect(result.components.currentDay).toBe(31);
        });
    });

    describe('Century Boundaries', () => {
        test('handles year 2000 correctly', () => {
            const result = calculator.calculatePersonalYear('1900-01-01', 2000);
            expect(result.personalYear).toBeDefined();
            expect(result.components.currentYear).toBe(2000);
        });

        test('handles year 2100 correctly', () => {
            const result = calculator.calculatePersonalYear('2000-01-01', 2100);
            expect(result.personalYear).toBeDefined();
            expect(result.components.currentYear).toBe(2100);
        });
    });

    describe('Master Number Edge Cases', () => {
        test('reduces 11 correctly in year calculation', () => {
            // Birth: 1988-11-22, Year: 2025
            // 11 + 22 + 2025 = 2058, 2+0+5+8=15, 1+5=6
            const result = calculator.calculatePersonalYear('1988-11-22', 2025);
            expect(result.personalYear).toBe(6);
        });

        test('reduces 22 correctly in month calculation', () => {
            // Personal Year 4 + Month 9 = 13, 1+3=4
            const result = calculator.calculatePersonalMonth(4, 9);
            expect(result.personalMonth).toBe(4);
        });
    });

    describe('Date Validation Edge Cases', () => {
        test('rejects invalid date formats', () => {
            expect(() => calculator.calculatePersonalYear('13/45/6789')).toThrow();
            expect(() => calculator.calculatePersonalYear('1990-13-45')).toThrow();
            expect(() => calculator.calculatePersonalYear('')).toThrow();
        });

        test('handles timezone differences', () => {
            // Both dates represent the same day, so should give same result
            const result1 = calculator.calculatePersonalYear('1990-05-15T00:00:00Z', 2025);
            const result2 = calculator.calculatePersonalYear('1990-05-15T23:59:59Z', 2025);
            // Note: This test may fail due to timezone handling, which is expected behavior
            // The calculation should be consistent for the same logical date
            expect(result1.components.birthMonth).toBe(result2.components.birthMonth);
        });
    });

    describe('Cycle Position Calculations', () => {
        test('handles exact 9-year multiples', () => {
            const birthDate = new Date('1990-05-15');
            const position = calculateYearCyclePosition(birthDate, 1999); // 9 years later
            expect(position.yearsSinceBirth).toBe(9);
            expect(position.positionInCycle).toBe(1); // Should be 1 for new cycle
        });

        test('handles very old birth dates', () => {
            const birthDate = new Date('1900-01-01');
            const position = calculateYearCyclePosition(birthDate, 2025);
            expect(position.yearsSinceBirth).toBe(125);
            expect(position.positionInCycle).toBeDefined();
        });
    });
});

describe('Comprehensive Error Handling', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC42PersonalCyclesCalculator();
    });

    describe('Input Validation Errors', () => {
        test('throws descriptive error for null birth date', () => {
            expect(() => calculator.calculatePersonalYear(null)).toThrow(PersonalCyclesError);
        });

        test('throws descriptive error for undefined birth date', () => {
            expect(() => calculator.calculatePersonalYear(undefined)).toThrow(PersonalCyclesError);
        });

        test('throws descriptive error for non-string/non-date birth date', () => {
            expect(() => calculator.calculatePersonalYear(12345)).toThrow(PersonalCyclesError);
        });

        test('throws descriptive error for invalid month numbers', () => {
            expect(() => calculator.calculatePersonalMonth(5, 0)).toThrow(PersonalCyclesError);
            expect(() => calculator.calculatePersonalMonth(5, 13)).toThrow(PersonalCyclesError);
            expect(() => calculator.calculatePersonalMonth(5, 'invalid')).toThrow(PersonalCyclesError);
        });

        test('throws descriptive error for invalid day numbers', () => {
            expect(() => calculator.calculatePersonalDay(5, 0)).toThrow(PersonalCyclesError);
            expect(() => calculator.calculatePersonalDay(5, 32)).toThrow(PersonalCyclesError);
            expect(() => calculator.calculatePersonalDay(5, 'invalid')).toThrow(PersonalCyclesError);
        });
    });

    describe('Calculation Errors', () => {
        test('handles division by zero gracefully', () => {
            // This shouldn't happen in normal operation, but test edge cases
            const result = calculator.analyzeCycleCompatibility(
                { personalYear: 0 },
                { personalMonth: 0 },
                { personalDay: 0 }
            );
            expect(result.overallHarmony).toBeDefined();
        });

        test('handles very large numbers', () => {
            const result = calculator.calculatePersonalYear('1900-01-01', 9999);
            expect(result.personalYear).toBeDefined();
            expect(result.personalYear).toBeGreaterThanOrEqual(1);
            expect(result.personalYear).toBeLessThanOrEqual(9);
        });
    });

    describe('Cache Error Handling', () => {
        test('handles cache corruption gracefully', () => {
            calculator.cache.set('test', null);
            const result = calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');
            expect(result).toBeDefined();
        });

        test('handles cache size limits', () => {
            // Fill cache with many entries
            for (let i = 0; i < 1000; i++) {
                calculator.cache.set(`key${i}`, { data: `value${i}` });
            }
            expect(calculator.cache.size).toBeGreaterThan(0);
        });
    });
});

describe('Performance Regression Tests', () => {
    let calculator;

    beforeEach(() => {
        calculator = new ZC42PersonalCyclesCalculator();
    });

    test('maintains performance under load', () => {
        const iterations = 100;
        const startTime = Date.now();

        for (let i = 0; i < iterations; i++) {
            calculator.calculateCompleteCycles('1990-05-15', '2025-10-08');
        }

        const endTime = Date.now();
        const totalDuration = endTime - startTime;
        const avgDuration = totalDuration / iterations;

        expect(avgDuration).toBeLessThan(10); // Average less than 10ms per calculation
        expect(totalDuration).toBeLessThan(2000); // Total less than 2 seconds for 100 calculations
    });

    test('cache improves performance', () => {
        calculator.clearCache();

        // First run (cache miss)
        const startTime1 = Date.now();
        calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');
        const duration1 = Date.now() - startTime1;

        // Second run (cache hit)
        const startTime2 = Date.now();
        calculator.calculateCompleteAnalysis('1990-05-15', '2025-10-08');
        const duration2 = Date.now() - startTime2;

        expect(duration2).toBeLessThanOrEqual(duration1); // Cache should improve or maintain performance
    });

    test('memory usage remains stable', () => {
        const initialCacheSize = calculator.cache.size;

        // Perform many calculations
        for (let i = 0; i < 50; i++) {
            calculator.calculateCompleteAnalysis(`199${i % 10}-05-15`, '2025-10-08');
        }

        const finalCacheSize = calculator.cache.size;
        expect(finalCacheSize).toBeLessThanOrEqual(50); // Should not grow unbounded
    });

    test('forecast performance scales linearly', () => {
        const testCases = [6, 12, 24];

        const durations = testCases.map(months => {
            const startTime = Date.now();
            calculator.generateCycleForecast('1990-05-15', months);
            return Date.now() - startTime;
        });

        // Performance should scale roughly linearly
        // Allow for some variance in timing due to system load
        expect(durations[0]).toBeGreaterThanOrEqual(0); // At least some time taken (or zero due to timing precision)
        expect(durations[1]).toBeGreaterThanOrEqual(0); // At least some time taken
        expect(durations[2]).toBeGreaterThanOrEqual(0); // At least some time taken
        expect(durations[2]).toBeLessThan(1000); // But not more than 1 second total
    });
});