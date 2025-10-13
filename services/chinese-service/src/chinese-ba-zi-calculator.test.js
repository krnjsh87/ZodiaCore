// Chinese Ba-Zi Calculator Tests
// Unit tests for Ba-Zi (Four Pillars) calculation functions
// Based on ZC2.1 Chinese Birth Chart Implementation Guide

const {
    calculateBaZi,
    calculateYearPillar,
    calculateMonthPillar,
    calculateDayPillar,
    calculateHourPillar,
    validateBaZi,
    getBaZiSummary
} = require('./chinese-ba-zi-calculator');

describe('Chinese Ba-Zi Calculator', () => {
    describe('calculateBaZi', () => {
        test('calculates complete four pillars', () => {
            const birthData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };
            const result = calculateBaZi(birthData);
            expect(result).toHaveProperty('year');
            expect(result).toHaveProperty('month');
            expect(result).toHaveProperty('day');
            expect(result).toHaveProperty('hour');
            expect(result.year).toHaveProperty('stem');
            expect(result.year).toHaveProperty('branch');
        });

        test('handles different birth times', () => {
            const birthData1 = { year: 1990, month: 5, day: 15, hour: 2, minute: 0, second: 0 };
            const birthData2 = { year: 1990, month: 5, day: 15, hour: 14, minute: 0, second: 0 };
            const result1 = calculateBaZi(birthData1);
            const result2 = calculateBaZi(birthData2);
            expect(result1.hour.stem).not.toBe(result2.hour.stem);
        });

        test('includes lunar date information', () => {
            const birthData = { year: 1990, month: 5, day: 15, hour: 12, minute: 0, second: 0 };
            const result = calculateBaZi(birthData);
            expect(result).toHaveProperty('lunarDate');
            expect(result.lunarDate).toHaveProperty('lunarYear');
            expect(result.lunarDate).toHaveProperty('solarTerm');
        });

        test('produces consistent results for same input', () => {
            const birthData = { year: 1985, month: 3, day: 20, hour: 9, minute: 15, second: 30 };
            const result1 = calculateBaZi(birthData);
            const result2 = calculateBaZi(birthData);

            expect(result1).toEqual(result2);
        });
    });

    describe('calculateYearPillar', () => {
        test('calculates year pillar correctly', () => {
            const result = calculateYearPillar(1990);
            expect(result).toHaveProperty('stem');
            expect(result).toHaveProperty('branch');
            expect(result).toHaveProperty('element');
            expect(result).toHaveProperty('animal');
        });

        test('returns valid stems and branches', () => {
            const result = calculateYearPillar(1984); // Jia Zi year
            expect(result.stem).toBe('Jia');
            expect(result.branch).toBe('Zi');
            expect(result.element).toBe('Wood');
            expect(result.animal).toBe('Rat');
        });

        test('handles different years correctly', () => {
            const year2024 = calculateYearPillar(2024); // Jia Chen
            const year2025 = calculateYearPillar(2025); // Yi Si

            expect(year2024.stem).toBe('Jia');
            expect(year2024.branch).toBe('Chen');
            expect(year2025.stem).toBe('Yi');
            expect(year2025.branch).toBe('Si');
        });
    });

    describe('calculateMonthPillar', () => {
        test('calculates month pillar correctly', () => {
            const mockSolarTerm = { longitude: 45 }; // Spring equinox-ish
            const result = calculateMonthPillar(1990, mockSolarTerm);

            expect(result).toHaveProperty('stem');
            expect(result).toHaveProperty('branch');
            expect(result).toHaveProperty('element');
            expect(result).toHaveProperty('animal');
        });

        test('uses solar term longitude for month determination', () => {
            const solarTerm1 = { longitude: 15 }; // Around Yin (Tiger)
            const solarTerm2 = { longitude: 45 }; // Around Mao (Rabbit)

            const result1 = calculateMonthPillar(1990, solarTerm1);
            const result2 = calculateMonthPillar(1990, solarTerm2);

            expect(result1.branch).toBe('Yin');
            expect(result2.branch).toBe('Mao');
        });
    });

    describe('calculateDayPillar', () => {
        test('calculates day pillar correctly', () => {
            const birthData = { year: 1990, month: 5, day: 15, hour: 12, minute: 0, second: 0 };
            const result = calculateDayPillar(birthData);

            expect(result).toHaveProperty('stem');
            expect(result).toHaveProperty('branch');
            expect(result).toHaveProperty('element');
            expect(result).toHaveProperty('animal');
        });

        test('handles timezone offset correctly', () => {
            const birthDataUTC = { year: 1990, month: 5, day: 15, hour: 12, minute: 0, second: 0, timezoneOffset: 0 };
            const birthDataEST = { year: 1990, month: 5, day: 15, hour: 12, minute: 0, second: 0, timezoneOffset: -5 };

            const resultUTC = calculateDayPillar(birthDataUTC);
            const resultEST = calculateDayPillar(birthDataEST);

            // Should be different due to timezone adjustment
            expect(resultUTC).not.toEqual(resultEST);
        });
    });

    describe('calculateHourPillar', () => {
        test('calculates hour pillar correctly', () => {
            const result = calculateHourPillar('Jia', 14); // 2 PM

            expect(result).toHaveProperty('stem');
            expect(result).toHaveProperty('branch');
            expect(result).toHaveProperty('element');
            expect(result).toHaveProperty('animal');
        });

        test('different hours produce different results', () => {
            const result1 = calculateHourPillar('Jia', 2); // 2 AM
            const result2 = calculateHourPillar('Jia', 14); // 2 PM

            expect(result1.stem).not.toBe(result2.stem);
            expect(result1.branch).not.toBe(result2.branch);
        });

        test('same day stem with different hours', () => {
            const result1 = calculateHourPillar('Jia', 0); // Midnight
            const result2 = calculateHourPillar('Jia', 12); // Noon

            expect(result1.stem).not.toBe(result2.stem);
        });
    });

    describe('validateBaZi', () => {
        test('validates correct Ba-Zi structure', () => {
            const validBaZi = {
                year: { stem: 'Jia', branch: 'Zi', element: 'Wood', animal: 'Rat' },
                month: { stem: 'Yi', branch: 'Chou', element: 'Wood', animal: 'Ox' },
                day: { stem: 'Bing', branch: 'Yin', element: 'Fire', animal: 'Tiger' },
                hour: { stem: 'Ding', branch: 'Mao', element: 'Fire', animal: 'Rabbit' }
            };

            expect(validateBaZi(validBaZi)).toBe(true);
        });

        test('rejects invalid stem', () => {
            const invalidBaZi = {
                year: { stem: 'Invalid', branch: 'Zi', element: 'Wood', animal: 'Rat' },
                month: { stem: 'Yi', branch: 'Chou', element: 'Wood', animal: 'Ox' },
                day: { stem: 'Bing', branch: 'Yin', element: 'Fire', animal: 'Tiger' },
                hour: { stem: 'Ding', branch: 'Mao', element: 'Fire', animal: 'Rabbit' }
            };

            expect(validateBaZi(invalidBaZi)).toBe(false);
        });

        test('rejects invalid branch', () => {
            const invalidBaZi = {
                year: { stem: 'Jia', branch: 'Invalid', element: 'Wood', animal: 'Rat' },
                month: { stem: 'Yi', branch: 'Chou', element: 'Wood', animal: 'Ox' },
                day: { stem: 'Bing', branch: 'Yin', element: 'Fire', animal: 'Tiger' },
                hour: { stem: 'Ding', branch: 'Mao', element: 'Fire', animal: 'Rabbit' }
            };

            expect(validateBaZi(invalidBaZi)).toBe(false);
        });

        test('rejects missing pillar', () => {
            const invalidBaZi = {
                year: { stem: 'Jia', branch: 'Zi', element: 'Wood', animal: 'Rat' },
                month: { stem: 'Yi', branch: 'Chou', element: 'Wood', animal: 'Ox' },
                // Missing day pillar
                hour: { stem: 'Ding', branch: 'Mao', element: 'Fire', animal: 'Rabbit' }
            };

            expect(validateBaZi(invalidBaZi)).toBe(false);
        });
    });

    describe('getBaZiSummary', () => {
        test('generates correct summary string', () => {
            const baZi = {
                year: { stem: 'Jia', branch: 'Zi' },
                month: { stem: 'Yi', branch: 'Chou' },
                day: { stem: 'Bing', branch: 'Yin' },
                hour: { stem: 'Ding', branch: 'Mao' }
            };

            const summary = getBaZiSummary(baZi);
            expect(summary).toBe('JiaZi YiChou BingYin DingMao');
        });
    });

    describe('Performance and Complexity', () => {
        test('calculateBaZi completes within reasonable time', () => {
            const birthData = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0 };

            const startTime = Date.now();
            calculateBaZi(birthData);
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(50); // Should be very fast
        });

        test('pillar calculations are O(1) complexity', () => {
            const iterations = 1000;

            const startTime = Date.now();
            for (let i = 0; i < iterations; i++) {
                calculateYearPillar(1990 + i);
                calculateHourPillar('Jia', i % 24);
            }
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(100); // Should handle 1000 operations quickly
        });
    });

    describe('Edge Cases', () => {
        test('handles year boundaries correctly', () => {
            const year2023 = calculateYearPillar(2023); // Gui Hai
            const year2024 = calculateYearPillar(2024); // Jia Zi

            expect(year2023.stem).toBe('Gui');
            expect(year2023.branch).toBe('Hai');
            expect(year2024.stem).toBe('Jia');
            expect(year2024.branch).toBe('Chen'); // 2024 is actually Jia Chen, not Jia Zi
        });

        test('handles hour boundary at midnight', () => {
            const result = calculateHourPillar('Jia', 0); // 12 AM - 1 AM
            expect(result).toHaveProperty('stem');
            expect(result).toHaveProperty('branch');
            expect(result.branch).toBe('Zi'); // Midnight is Zi branch
        });

        test('handles hour boundary at noon', () => {
            const result = calculateHourPillar('Jia', 12); // 12 PM - 1 PM
            expect(result).toHaveProperty('stem');
            expect(result).toHaveProperty('branch');
            expect(result.branch).toBe('Wu'); // Noon is Wu branch
        });
    });
});