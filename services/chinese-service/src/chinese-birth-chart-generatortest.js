// Chinese Birth Chart Generator Tests
// Comprehensive unit tests for the Chinese birth chart generation system

const ChineseBirthChartGenerator = require('./chinese-birth-chart-generator');

describe('ChineseBirthChartGenerator', () => {
    let generator;

    beforeEach(() => {
        generator = new ChineseBirthChartGenerator();
    });

    describe('generateBirthChart', () => {
        test('generates complete birth chart for valid birth data', async () => {
            const birthData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };

            const chart = await generator.generateBirthChart(birthData);

            expect(chart).toHaveProperty('birthData');
            expect(chart).toHaveProperty('baZi');
            expect(chart).toHaveProperty('fiveElements');
            expect(chart).toHaveProperty('nineStarKi');
            expect(chart).toHaveProperty('interpretations');
            expect(chart).toHaveProperty('metadata');
        });

        test('validates required birth data fields', async () => {
            const invalidData = {
                year: 1990,
                month: 5,
                day: 15
                // Missing hour, minute, second
            };

            await expect(generator.generateBirthChart(invalidData))
                .rejects.toThrow('Missing required field');
        });

        test('validates year range', async () => {
            const invalidData = {
                year: 1800, // Too early
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };

            await expect(generator.generateBirthChart(invalidData))
                .rejects.toThrow('Year must be between 1900 and 2100');
        });

        test('validates hour range', async () => {
            const invalidData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 25, // Invalid hour
                minute: 30,
                second: 0
            };

            await expect(generator.generateBirthChart(invalidData))
                .rejects.toThrow('Hour must be between 0 and 23');
        });
    });

    describe('Birth Chart Structure', () => {
        let chart;

        beforeEach(async () => {
            const birthData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };

            chart = await generator.generateBirthChart(birthData);
        });

        test('has complete Ba-Zi structure', () => {
            expect(chart.baZi).toHaveProperty('year');
            expect(chart.baZi).toHaveProperty('month');
            expect(chart.baZi).toHaveProperty('day');
            expect(chart.baZi).toHaveProperty('hour');

            // Each pillar should have stem, branch, element, animal
            ['year', 'month', 'day', 'hour'].forEach(pillar => {
                expect(chart.baZi[pillar]).toHaveProperty('stem');
                expect(chart.baZi[pillar]).toHaveProperty('branch');
                expect(chart.baZi[pillar]).toHaveProperty('element');
                expect(chart.baZi[pillar]).toHaveProperty('animal');
            });
        });

        test('has Five Elements analysis', () => {
            expect(chart.fiveElements).toHaveProperty('counts');
            expect(chart.fiveElements).toHaveProperty('strongest');
            expect(chart.fiveElements).toHaveProperty('weakest');
            expect(chart.fiveElements).toHaveProperty('balance');
            expect(chart.fiveElements).toHaveProperty('relationships');
        });

        test('has Nine Star Ki analysis', () => {
            expect(chart.nineStarKi).toHaveProperty('birthStar');
            expect(chart.nineStarKi).toHaveProperty('currentStar');
            expect(chart.nineStarKi).toHaveProperty('directions');
            expect(chart.nineStarKi).toHaveProperty('analysis');
        });

        test('has interpretations', () => {
            expect(chart.interpretations).toHaveProperty('personality');
            expect(chart.interpretations).toHaveProperty('career');
            expect(chart.interpretations).toHaveProperty('relationships');
            expect(chart.interpretations).toHaveProperty('health');
            expect(chart.interpretations).toHaveProperty('lucky');
        });

        test('has metadata with disclaimer', () => {
            expect(chart.metadata).toHaveProperty('calculationMethod');
            expect(chart.metadata).toHaveProperty('algorithmVersion');
            expect(chart.metadata).toHaveProperty('disclaimer');
            expect(chart.metadata.disclaimer).toContain('entertainment');
        });
    });

    describe('Utility Methods', () => {
        let chart;

        beforeEach(async () => {
            const birthData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };

            chart = await generator.generateBirthChart(birthData);
        });

        test('getElementBalance returns five elements analysis', () => {
            const balance = chart.getElementBalance();
            expect(balance).toEqual(chart.fiveElements);
        });

        test('getLuckyDirections returns nine star ki directions', () => {
            const directions = chart.getLuckyDirections();
            expect(directions).toEqual(chart.nineStarKi.directions);
        });

        test('getPersonalityTraits returns personality interpretations', () => {
            const traits = chart.getPersonalityTraits();
            expect(traits).toEqual(chart.interpretations.personality);
        });

        test('getCareerGuidance returns career interpretations', () => {
            const guidance = chart.getCareerGuidance();
            expect(guidance).toEqual(chart.interpretations.career);
        });
    });

    describe('Date Validation', () => {
        test('rejects invalid dates', async () => {
            const invalidDates = [
                { year: 1990, month: 2, day: 30, hour: 12, minute: 0, second: 0 }, // Feb 30
                { year: 1990, month: 4, day: 31, hour: 12, minute: 0, second: 0 }, // Apr 31
                { year: 1900, month: 2, day: 29, hour: 12, minute: 0, second: 0 }  // Feb 29 on non-leap year
            ];

            for (const date of invalidDates) {
                await expect(generator.generateBirthChart(date)).rejects.toThrow('Day must be between 1 and');
            }
        });

        test('accepts valid leap year dates', async () => {
            const leapYearDate = {
                year: 2000, // Leap year
                month: 2,
                day: 29,
                hour: 12,
                minute: 0,
                second: 0
            };

            await expect(generator.generateBirthChart(leapYearDate)).resolves.toBeDefined();
        });

        test('validates timezone offset range', async () => {
            const invalidTimezoneData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0,
                timezoneOffset: 15 // Invalid offset
            };

            await expect(generator.generateBirthChart(invalidTimezoneData))
                .rejects.toThrow('Timezone offset must be a number between -12 and 14');
        });
    });

    describe('Caching', () => {
        test('caches results for repeated requests', async () => {
            const birthData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };

            // First request
            const chart1 = await generator.generateBirthChart(birthData);
            // Second request (should be from cache)
            const chart2 = await generator.generateBirthChart(birthData);

            expect(chart1).toEqual(chart2);
        });

        test('cache respects different inputs', async () => {
            const data1 = { year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0 };
            const data2 = { year: 1990, month: 5, day: 15, hour: 15, minute: 30, second: 0 }; // Different hour

            const chart1 = await generator.generateBirthChart(data1);
            const chart2 = await generator.generateBirthChart(data2);

            expect(chart1.baZi.hour.stem).not.toBe(chart2.baZi.hour.stem);
        });
    });

    describe('Performance', () => {
        test('generates chart within performance limits', async () => {
            const birthData = {
                year: 1990,
                month: 5,
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };

            const startTime = Date.now();
            await generator.generateBirthChart(birthData);
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(100); // Should be well under 100ms
        });
    });

    describe('Error Handling', () => {
        test('handles calculation errors gracefully', async () => {
            const problematicData = {
                year: 1990,
                month: 13, // Invalid month
                day: 15,
                hour: 14,
                minute: 30,
                second: 0
            };

            await expect(generator.generateBirthChart(problematicData))
                .rejects.toThrow();
        });

        test('handles edge case calculations', async () => {
            // Test with minimum valid date
            const minDate = {
                year: 1900,
                month: 1,
                day: 1,
                hour: 0,
                minute: 0,
                second: 0
            };

            await expect(generator.generateBirthChart(minDate)).resolves.toBeDefined();

            // Test with maximum valid date
            const maxDate = {
                year: 2100,
                month: 12,
                day: 31,
                hour: 23,
                minute: 59,
                second: 59
            };

            await expect(generator.generateBirthChart(maxDate)).resolves.toBeDefined();
        });
    });
});

// Integration tests for the complete system
describe('Chinese Birth Chart System Integration', () => {
    test('produces consistent results for same input', async () => {
        const generator1 = new ChineseBirthChartGenerator();
        const generator2 = new ChineseBirthChartGenerator();

        const birthData = {
            year: 1985,
            month: 3,
            day: 20,
            hour: 9,
            minute: 15,
            second: 30
        };

        const chart1 = await generator1.generateBirthChart(birthData);
        const chart2 = await generator2.generateBirthChart(birthData);

        // Results should be identical for same input
        expect(chart1.baZi).toEqual(chart2.baZi);
        expect(chart1.fiveElements.counts).toEqual(chart2.fiveElements.counts);
    });

    test('handles different birth times correctly', async () => {
        const generator = new ChineseBirthChartGenerator();

        const data1 = { year: 1990, month: 5, day: 15, hour: 2, minute: 0, second: 0 };
        const data2 = { year: 1990, month: 5, day: 15, hour: 14, minute: 0, second: 0 };

        const chart1 = await generator.generateBirthChart(data1);
        const chart2 = await generator.generateBirthChart(data2);

        // Hour pillar should be different
        expect(chart1.baZi.hour.stem).not.toBe(chart2.baZi.hour.stem);
    });
});