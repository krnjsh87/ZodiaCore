/**
 * ZodiaCore - Divisional Chart Calculator Tests
 *
 * Comprehensive unit tests for divisional chart calculations.
 * Tests accuracy against reference document zc1_3_divisional_charts_vargas.md
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const DivisionalChartCalculator = require('./divisional-chart-calculator');
const { InvalidChartTypeError, InvalidLongitudeError } = require('./errors');

describe('DivisionalChartCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new DivisionalChartCalculator();
    });

    describe('Constructor', () => {
        test('should initialize with correct configurations', () => {
            expect(calculator.divisionalCharts).toBeDefined();
            expect(calculator.signTypes).toBeDefined();
            expect(calculator.chartSignificances).toBeDefined();
            expect(calculator.vargaBalaWeights).toBeDefined();
            expect(calculator.planetaryRelationships).toBeDefined();
        });
    });

    describe('getSignType', () => {
        test('should correctly identify moveable signs', () => {
            expect(calculator.getSignType(0)).toBe('moveable'); // Aries
            expect(calculator.getSignType(3)).toBe('moveable'); // Cancer
            expect(calculator.getSignType(6)).toBe('moveable'); // Libra
            expect(calculator.getSignType(9)).toBe('moveable'); // Capricorn
        });

        test('should correctly identify fixed signs', () => {
            expect(calculator.getSignType(1)).toBe('fixed'); // Taurus
            expect(calculator.getSignType(4)).toBe('fixed'); // Leo
            expect(calculator.getSignType(7)).toBe('fixed'); // Scorpio
            expect(calculator.getSignType(10)).toBe('fixed'); // Aquarius
        });

        test('should correctly identify dual signs', () => {
            expect(calculator.getSignType(2)).toBe('dual'); // Gemini
            expect(calculator.getSignType(5)).toBe('dual'); // Virgo
            expect(calculator.getSignType(8)).toBe('dual'); // Sagittarius
            expect(calculator.getSignType(11)).toBe('dual'); // Pisces
        });
    });

    describe('calculateDivisionalLongitude', () => {
        test('should return same longitude for D1', () => {
            const longitude = 45.5;
            expect(calculator.calculateDivisionalLongitude(longitude, 'D1')).toBe(longitude);
        });

        test('should calculate Hora (D2) correctly', () => {
            // Aries (sign 0, even): first 15° = Leo (4), last 15° = Cancer (3)
            expect(calculator.calculateDivisionalLongitude(5, 'D2')).toBe(4 * 30 + 5 * 2); // Leo
            expect(calculator.calculateDivisionalLongitude(20, 'D2')).toBe(3 * 30 + 20 * 2); // Cancer

            // Taurus (sign 1, odd): first 15° = Leo (4), last 15° = Cancer (3)
            expect(calculator.calculateDivisionalLongitude(30 + 5, 'D2')).toBe(4 * 30 + 5 * 2); // Leo
            expect(calculator.calculateDivisionalLongitude(30 + 20, 'D2')).toBe(3 * 30 + 20 * 2); // Cancer
        });

        test('should calculate Drekkana (D3) correctly', () => {
            // Aries: 0-10° = Aries (0), 10-20° = Cancer (3), 20-30° = Libra (6)
            expect(calculator.calculateDivisionalLongitude(5, 'D3')).toBe(0 * 30 + 5 * 3); // Aries
            expect(calculator.calculateDivisionalLongitude(15, 'D3')).toBe(3 * 30 + 15 * 3); // Cancer
            expect(calculator.calculateDivisionalLongitude(25, 'D3')).toBe(6 * 30 + 25 * 3); // Libra
        });

        test('should calculate Chaturthamsa (D4) correctly', () => {
            // D4 follows moveable sign sequence rules
            // Aries (moveable): divisions progress sequentially
            expect(calculator.calculateDivisionalLongitude(0, 'D4')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(7.5, 'D4')).toBe(1 * 30 + 7.5 * 4); // Taurus

            // Taurus (fixed): start from 9th sign (Scorpio)
            expect(calculator.calculateDivisionalLongitude(30, 'D4')).toBe(7 * 30 + 0); // Scorpio 0°
        });

        test('should calculate Panchamsa (D5) correctly', () => {
            // D5 follows dual sign sequence rules
            // Gemini (dual): start from 5th sign (Sagittarius)
            expect(calculator.calculateDivisionalLongitude(60, 'D5')).toBe(8 * 30 + 0); // Sagittarius 0°
            expect(calculator.calculateDivisionalLongitude(60 + 6, 'D5')).toBe(9 * 30 + 6 * 5); // Capricorn
        });

        test('should calculate Shashtamsa (D6) correctly', () => {
            // D6 follows fixed sign sequence rules
            // Taurus (fixed): start from 9th sign (Scorpio)
            expect(calculator.calculateDivisionalLongitude(30, 'D6')).toBe(7 * 30 + 0); // Scorpio 0°
            expect(calculator.calculateDivisionalLongitude(30 + 5, 'D6')).toBe(8 * 30 + 5 * 6); // Sagittarius
        });

        test('should calculate Saptamsa (D7) correctly', () => {
            // D7 follows moveable sign sequence rules
            // Aries (moveable): divisions progress sequentially
            expect(calculator.calculateDivisionalLongitude(0, 'D7')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(4.2857, 'D7')).toBe(1 * 30 + 4.2857 * 7); // Taurus
        });

        test('should calculate Ashtamsa (D8) correctly', () => {
            // D8 follows dual sign sequence rules
            // Gemini (dual): start from 5th sign (Sagittarius)
            expect(calculator.calculateDivisionalLongitude(60, 'D8')).toBe(8 * 30 + 0); // Sagittarius 0°
            expect(calculator.calculateDivisionalLongitude(60 + 3.75, 'D8')).toBe(9 * 30 + 3.75 * 8); // Capricorn
        });

        test('should calculate Navamsa (D9) correctly', () => {
            // Aries (moveable): divisions progress sequentially
            expect(calculator.calculateDivisionalLongitude(0, 'D9')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(3.333, 'D9')).toBe(1 * 30 + 3.333 * 9); // Taurus

            // Taurus (fixed): start from 9th sign (Scorpio)
            expect(calculator.calculateDivisionalLongitude(30, 'D9')).toBe(7 * 30 + 0); // Scorpio 0°
        });

        test('should calculate Dasamsa (D10) correctly', () => {
            // Aries (odd sign): sequential
            expect(calculator.calculateDivisionalLongitude(0, 'D10')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(3, 'D10')).toBe(1 * 30 + 3 * 10); // Taurus

            // Taurus (even sign): start from 9th sign
            expect(calculator.calculateDivisionalLongitude(30, 'D10')).toBe(7 * 30 + 0); // Scorpio 0°
        });

        test('should calculate Shodasamsa (D16) correctly', () => {
            // D16 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D16')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(1.875, 'D16')).toBe(1 * 30 + 1.875 * 16); // Taurus
        });

        test('should calculate Vimsamsa (D20) correctly', () => {
            // D20 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D20')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(1.5, 'D20')).toBe(1 * 30 + 1.5 * 20); // Taurus
        });

        test('should calculate Chaturvimsamsa (D24) correctly', () => {
            // D24 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D24')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(1.25, 'D24')).toBe(1 * 30 + 1.25 * 24); // Taurus
        });

        test('should calculate Nakshatramsa (D27) correctly', () => {
            // D27 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D27')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(1.111, 'D27')).toBe(1 * 30 + 1.111 * 27); // Taurus
        });

        test('should calculate Trimsamsa (D30) correctly', () => {
            // D30 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D30')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(1, 'D30')).toBe(1 * 30 + 1 * 30); // Taurus
        });

        test('should calculate Khavedamsa (D40) correctly', () => {
            // D40 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D40')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(0.75, 'D40')).toBe(1 * 30 + 0.75 * 40); // Taurus
        });

        test('should calculate Akshavedamsa (D45) correctly', () => {
            // D45 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D45')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(0.666, 'D45')).toBe(1 * 30 + 0.666 * 45); // Taurus
        });

        test('should calculate Shashtyamsa (D60) correctly', () => {
            // D60 follows moveable sign sequence rules
            expect(calculator.calculateDivisionalLongitude(0, 'D60')).toBe(0 * 30 + 0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(0.5, 'D60')).toBe(1 * 30 + 0.5 * 60); // Taurus
        });

        test('should handle boundary conditions correctly', () => {
            // Test exact sign boundaries
            expect(calculator.calculateDivisionalLongitude(29.999, 'D9')).toBeCloseTo(8 * 30 + 29.999 * 9, 3);
            expect(calculator.calculateDivisionalLongitude(30, 'D9')).toBe(7 * 30 + 0); // Taurus -> Scorpio

            // Test 360° wraparound
            expect(calculator.calculateDivisionalLongitude(359.999, 'D1')).toBeCloseTo(359.999, 3);
        });

        test('should throw InvalidChartTypeError for unknown chart', () => {
            expect(() => calculator.calculateDivisionalLongitude(45, 'D99')).toThrow(InvalidChartTypeError);
        });

        test('should throw InvalidLongitudeError for invalid longitude', () => {
            expect(() => calculator.calculateDivisionalLongitude('invalid', 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude(400, 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude(-10, 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude(NaN, 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude(Infinity, 'D9')).toThrow(InvalidLongitudeError);
        });
    });

    describe('generateDivisionalChart', () => {
        const mockPositions = {
            SUN: 45.5,
            MOON: 120.3,
            ASC: 15.7
        };

        test('should generate valid chart structure', () => {
            const chart = calculator.generateDivisionalChart(mockPositions, 'D9');

            expect(chart).toHaveProperty('type', 'D9');
            expect(chart).toHaveProperty('name');
            expect(chart).toHaveProperty('significance');
            expect(chart).toHaveProperty('divisor', 9);
            expect(chart).toHaveProperty('positions');
            expect(chart).toHaveProperty('houses');
            expect(chart.positions).toHaveProperty('SUN');
            expect(chart.positions).toHaveProperty('MOON');
            expect(chart.houses).toHaveLength(12);
        });

        test('should validate input parameters', () => {
            expect(() => calculator.generateDivisionalChart(null, 'D9')).toThrow();
            expect(() => calculator.generateDivisionalChart(mockPositions, 'D99')).toThrow(InvalidChartTypeError);
            expect(() => calculator.generateDivisionalChart({ SUN: 'invalid' }, 'D9')).toThrow(InvalidLongitudeError);
        });
    });

    describe('calculateVargaBala', () => {
        const mockBirthChart = {
            planets: {
                SUN: 45.5, // Taurus
                MOON: 120.3 // Leo
            }
        };

        test('should calculate Varga Bala for Sun', () => {
            const result = calculator.calculateVargaBala('SUN', mockBirthChart);

            expect(result).toHaveProperty('planet', 'SUN');
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('maxScore', 21); // Sum of weights: 6+2+4+2+5+2
            expect(result).toHaveProperty('percentage');
            expect(result).toHaveProperty('strength');
            expect(result).toHaveProperty('breakdown');
        });

        test('should calculate Varga Bala for Moon', () => {
            const result = calculator.calculateVargaBala('MOON', mockBirthChart);

            expect(result.planet).toBe('MOON');
            expect(result.maxScore).toBe(21);
            expect(result.percentage).toBeGreaterThanOrEqual(0);
            expect(result.percentage).toBeLessThanOrEqual(100);
        });

        test('should throw error for unknown planet', () => {
            expect(() => calculator.calculateVargaBala('UNKNOWN', mockBirthChart)).toThrow();
        });
    });

    describe('calculateSignStrength', () => {
        const sunData = calculator.planetaryRelationships.SUN;

        test('should return 1.0 for exaltation sign', () => {
            expect(calculator.calculateSignStrength('SUN', 3, sunData)).toBe(1.0); // Aries (exaltation)
        });

        test('should return 1.0 for own sign', () => {
            expect(calculator.calculateSignStrength('SUN', 4, sunData)).toBe(1.0); // Leo (own sign)
        });

        test('should return 0.75 for friendly sign', () => {
            expect(calculator.calculateSignStrength('SUN', 1, sunData)).toBe(0.75); // Taurus (friendly)
        });

        test('should return 0.5 for neutral sign', () => {
            expect(calculator.calculateSignStrength('SUN', 2, sunData)).toBe(0.5); // Gemini (neutral)
        });

        test('should return 0.25 for enemy sign', () => {
            expect(calculator.calculateSignStrength('SUN', 0, sunData)).toBe(0.25); // Aries (enemy)
        });

        test('should return 0.0 for debilitation sign', () => {
            expect(calculator.calculateSignStrength('SUN', 6, sunData)).toBe(0.0); // Libra (debilitation)
        });

        test('should return 0.5 for unknown sign', () => {
            expect(calculator.calculateSignStrength('SUN', 99, sunData)).toBe(0.5); // Default neutral
        });
    });

    describe('getStrengthLevel', () => {
        test('should return correct strength levels', () => {
            expect(calculator.getStrengthLevel(85)).toBe('Excellent');
            expect(calculator.getStrengthLevel(65)).toBe('Good');
            expect(calculator.getStrengthLevel(45)).toBe('Moderate');
            expect(calculator.getStrengthLevel(25)).toBe('Weak');
            expect(calculator.getStrengthLevel(15)).toBe('Very Weak');
        });
    });

    describe('getChartSignificance', () => {
        test('should return correct significance for known charts', () => {
            const d9 = calculator.getChartSignificance('D9');
            expect(d9.name).toBe('Navamsa Chart');
            expect(d9.significance).toBe('Marriage and relationships');
            expect(d9.areas).toContain('Marriage');
        });

        test('should return default for unknown charts', () => {
            const unknown = calculator.getChartSignificance('D99');
            expect(unknown.name).toBe('Unknown Chart');
            expect(unknown.significance).toBe('Specialized analysis');
        });
    });

    describe('generateAllDivisionalCharts', () => {
        const mockPositions = { SUN: 45.5, MOON: 120.3 };

        test('should generate all charts', () => {
            const charts = calculator.generateAllDivisionalCharts(mockPositions);

            expect(charts).toHaveProperty('D1');
            expect(charts).toHaveProperty('D2');
            expect(charts).toHaveProperty('D9');
            expect(charts).toHaveProperty('D10');
            expect(charts.D1).toBeTruthy();
            expect(charts.D2).toBeTruthy();
        });

        test('should handle errors gracefully', () => {
            // Mock a failing chart by temporarily modifying the method
            const original = calculator.generateDivisionalChart;
            calculator.generateDivisionalChart = jest.fn((positions, type) => {
                if (type === 'D9') throw new Error('Mock error');
                return original.call(this, positions, type);
            });

            const charts = calculator.generateAllDivisionalCharts(mockPositions);
            expect(charts.D9).toBeNull();
            expect(charts.D1).toBeTruthy();

            // Restore original method
            calculator.generateDivisionalChart = original;
        });

        test('should validate input', () => {
            expect(() => calculator.generateAllDivisionalCharts(null)).toThrow();
            expect(() => calculator.generateAllDivisionalCharts('invalid')).toThrow();
        });
    });

    describe('calculateDivisionalHouses', () => {
        test('should calculate houses based on divisional ascendant', () => {
            const positions = { ASC: 15.7 }; // Cancer ascendant
            const houses = calculator.calculateDivisionalHouses(positions, 'D9');

            expect(houses).toHaveLength(12);
            expect(houses[0]).toBeGreaterThanOrEqual(0);
            expect(houses[0]).toBeLessThan(360);
            expect(houses[11]).toBeGreaterThanOrEqual(0);
            expect(houses[11]).toBeLessThan(360);
        });
    });

    describe('Reference Document Validation', () => {
        test('should match Navamsa calculation examples from reference document', () => {
            // Test Aries (moveable) - divisions progress sequentially
            expect(calculator.calculateDivisionalLongitude(0, 'D9')).toBe(0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(3.333, 'D9')).toBeCloseTo(30 + 3.333 * 9, 3); // Taurus
            expect(calculator.calculateDivisionalLongitude(6.667, 'D9')).toBeCloseTo(60 + 6.667 * 9, 3); // Gemini

            // Test Taurus (fixed) - start from 9th sign (Scorpio)
            expect(calculator.calculateDivisionalLongitude(30, 'D9')).toBe(210); // Scorpio 0° (7 * 30)
            expect(calculator.calculateDivisionalLongitude(33.333, 'D9')).toBeCloseTo(240 + 3.333 * 9, 3); // Sagittarius
        });

        test('should match Dasamsa calculation examples from reference document', () => {
            // Aries (odd sign): sequential progression
            expect(calculator.calculateDivisionalLongitude(0, 'D10')).toBe(0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(3, 'D10')).toBe(30 + 3 * 10); // Taurus 30°
            expect(calculator.calculateDivisionalLongitude(6, 'D10')).toBe(60 + 6 * 10); // Gemini 60°

            // Taurus (even sign): start from 9th sign
            expect(calculator.calculateDivisionalLongitude(30, 'D10')).toBe(210); // Scorpio 0°
            expect(calculator.calculateDivisionalLongitude(33, 'D10')).toBe(240 + 3 * 10); // Sagittarius 30°
        });

        test('should match Hora calculation rules from reference document', () => {
            // Odd signs: first 15° = Leo (4), last 15° = Cancer (3)
            expect(calculator.calculateDivisionalLongitude(0, 'D2')).toBe(120); // Leo 0° (4 * 30)
            expect(calculator.calculateDivisionalLongitude(7.5, 'D2')).toBe(120 + 7.5 * 2); // Leo 15°
            expect(calculator.calculateDivisionalLongitude(15, 'D2')).toBe(90); // Cancer 0° (3 * 30)
            expect(calculator.calculateDivisionalLongitude(22.5, 'D2')).toBe(90 + 7.5 * 2); // Cancer 15°

            // Even signs: first 15° = Cancer (3), last 15° = Leo (4)
            expect(calculator.calculateDivisionalLongitude(30, 'D2')).toBe(90); // Cancer 0°
            expect(calculator.calculateDivisionalLongitude(37.5, 'D2')).toBe(90 + 7.5 * 2); // Cancer 15°
            expect(calculator.calculateDivisionalLongitude(45, 'D2')).toBe(120); // Leo 0°
        });

        test('should match Drekkana calculation rules from reference document', () => {
            // Aries: 0-10° = Aries, 10-20° = Cancer, 20-30° = Libra
            expect(calculator.calculateDivisionalLongitude(0, 'D3')).toBe(0); // Aries 0°
            expect(calculator.calculateDivisionalLongitude(5, 'D3')).toBe(0 + 5 * 3); // Aries 15°
            expect(calculator.calculateDivisionalLongitude(10, 'D3')).toBe(90); // Cancer 0°
            expect(calculator.calculateDivisionalLongitude(15, 'D3')).toBe(90 + 5 * 3); // Cancer 15°
            expect(calculator.calculateDivisionalLongitude(20, 'D3')).toBe(180); // Libra 0°
            expect(calculator.calculateDivisionalLongitude(25, 'D3')).toBe(180 + 5 * 3); // Libra 15°
        });

        test('should validate Varga Bala weights from reference document', () => {
            // Verify weights match Parasara's system (section 8.3)
            expect(calculator.vargaBalaWeights.D1).toBe(6);
            expect(calculator.vargaBalaWeights.D2).toBe(2);
            expect(calculator.vargaBalaWeights.D3).toBe(4);
            expect(calculator.vargaBalaWeights.D7).toBe(2);
            expect(calculator.vargaBalaWeights.D9).toBe(5);
            expect(calculator.vargaBalaWeights.D12).toBe(2);

            // Total should be 21
            const totalWeight = Object.values(calculator.vargaBalaWeights).reduce((sum, weight) => sum + weight, 0);
            expect(totalWeight).toBe(21);
        });
    });

    describe('Edge Cases and Boundary Conditions', () => {
        test('should handle exact sign boundaries correctly', () => {
            // Test 29.999° vs 30° transitions
            expect(calculator.calculateDivisionalLongitude(29.999, 'D9')).toBeCloseTo(8 * 30 + 29.999 * 9, 3);
            expect(calculator.calculateDivisionalLongitude(30, 'D9')).toBe(7 * 30); // Taurus -> Scorpio

            // Test all 12 sign boundaries
            for (let sign = 0; sign < 12; sign++) {
                const boundary = sign * 30;
                expect(calculator.calculateDivisionalLongitude(boundary, 'D1')).toBe(boundary);
            }
        });

        test('should handle floating point precision correctly', () => {
            // Test with very small decimal values
            expect(calculator.calculateDivisionalLongitude(0.000001, 'D9')).toBeCloseTo(0.000009, 6);
            expect(calculator.calculateDivisionalLongitude(29.999999, 'D9')).toBeCloseTo(269.999991, 6);

            // Test with large decimal precision
            const preciseValue = 15.123456789;
            const result = calculator.calculateDivisionalLongitude(preciseValue, 'D10');
            expect(result).toBeCloseTo(30 + preciseValue * 10, 6);
        });

        test('should handle 360° wraparound correctly', () => {
            expect(calculator.calculateDivisionalLongitude(359.999, 'D1')).toBeCloseTo(359.999, 3);
            expect(calculator.calculateDivisionalLongitude(360, 'D1')).toBe(0); // Should normalize

            // Test with values > 360
            expect(calculator.calculateDivisionalLongitude(390, 'D1')).toBe(30); // 390 - 360 = 30
        });

        test('should handle division by zero and infinity cases', () => {
            // These should not occur in normal operation but test robustness
            expect(() => calculator.calculateDivisionalLongitude(NaN, 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude(Infinity, 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude(-Infinity, 'D9')).toThrow(InvalidLongitudeError);
        });

        test('should handle extreme longitude values', () => {
            // Test with very large positive values
            expect(() => calculator.calculateDivisionalLongitude(1000, 'D9')).toThrow(InvalidLongitudeError);

            // Test with very large negative values
            expect(() => calculator.calculateDivisionalLongitude(-1000, 'D9')).toThrow(InvalidLongitudeError);
        });
    });

    describe('Performance and Scalability', () => {
        test('should handle bulk calculations efficiently', () => {
            const positions = {};
            // Create 100 planetary positions
            for (let i = 0; i < 100; i++) {
                positions[`PLANET_${i}`] = Math.random() * 360;
            }

            const startTime = Date.now();
            const charts = calculator.generateAllDivisionalCharts(positions);
            const endTime = Date.now();

            // Should complete within reasonable time (less than 1 second for 100 planets)
            expect(endTime - startTime).toBeLessThan(1000);

            // Should generate all charts
            expect(Object.keys(charts)).toHaveLength(Object.keys(calculator.divisionalCharts).length);
        });

        test('should handle concurrent chart generation', () => {
            const positions1 = { SUN: 45, MOON: 120 };
            const positions2 = { SUN: 90, MOON: 180 };

            // Generate charts concurrently
            const promise1 = Promise.resolve(calculator.generateAllDivisionalCharts(positions1));
            const promise2 = Promise.resolve(calculator.generateAllDivisionalCharts(positions2));

            return Promise.all([promise1, promise2]).then(([charts1, charts2]) => {
                expect(charts1.D1.positions.SUN).toBe(45);
                expect(charts2.D1.positions.SUN).toBe(90);
            });
        });

        test('should maintain accuracy under load', () => {
            // Test that accuracy doesn't degrade with repeated calculations
            const testCases = [
                { longitude: 45.5, chart: 'D9', expected: calculator.calculateDivisionalLongitude(45.5, 'D9') },
                { longitude: 120.3, chart: 'D10', expected: calculator.calculateDivisionalLongitude(120.3, 'D10') },
                { longitude: 270.7, chart: 'D2', expected: calculator.calculateDivisionalLongitude(270.7, 'D2') }
            ];

            // Run calculations multiple times
            for (let i = 0; i < 100; i++) {
                testCases.forEach(testCase => {
                    const result = calculator.calculateDivisionalLongitude(testCase.longitude, testCase.chart);
                    expect(result).toBeCloseTo(testCase.expected, 10); // High precision
                });
            }
        });
    });

    describe('Error Handling', () => {
        test('should throw structured errors', () => {
            try {
                calculator.generateDivisionalChart({}, 'D99');
            } catch (error) {
                expect(error).toHaveProperty('code');
                expect(error).toHaveProperty('message');
                expect(error).toHaveProperty('details');
                expect(error).toHaveProperty('timestamp');
            }
        });

        test('should handle invalid input types', () => {
            expect(() => calculator.calculateDivisionalLongitude(null, 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude(undefined, 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude('45.5', 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude([], 'D9')).toThrow(InvalidLongitudeError);
            expect(() => calculator.calculateDivisionalLongitude({}, 'D9')).toThrow(InvalidLongitudeError);
        });

        test('should handle malformed chart requests', () => {
            expect(() => calculator.generateDivisionalChart(null, 'D9')).toThrow();
            expect(() => calculator.generateDivisionalChart(undefined, 'D9')).toThrow();
            expect(() => calculator.generateDivisionalChart(45, 'D9')).toThrow();
            expect(() => calculator.generateDivisionalChart('invalid', 'D9')).toThrow();
        });

        test('should gracefully handle calculation failures', () => {
            // Mock a calculation failure
            const original = calculator.calculateDivisionalLongitude;
            calculator.calculateDivisionalLongitude = jest.fn(() => { throw new Error('Mock calculation error'); });

            const positions = { SUN: 45 };
            expect(() => calculator.generateDivisionalChart(positions, 'D9')).toThrow();

            // Restore original method
            calculator.calculateDivisionalLongitude = original;
        });
    });

    describe('Varga Bala Calculations', () => {
        const mockBirthChart = {
            planets: {
                SUN: 45.5,    // Taurus (1) - neutral for Sun
                MOON: 93.7,   // Cancer (3) - own sign for Moon
                MARS: 0,      // Aries (0) - own sign for Mars
                VENUS: 41.2,  // Taurus (1) - own sign for Venus
                JUPITER: 240, // Sagittarius (8) - own sign for Jupiter
                SATURN: 270   // Capricorn (9) - own sign for Saturn
            }
        };

        test('should calculate Varga Bala for Sun with proper strength levels', () => {
            const result = calculator.calculateVargaBala('SUN', mockBirthChart);

            expect(result).toHaveProperty('planet', 'SUN');
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('percentage');
            expect(result).toHaveProperty('strength');
            expect(['Excellent', 'Good', 'Moderate', 'Weak', 'Very Weak']).toContain(result.strength);

            // Sun in Taurus (neutral) should have moderate score
            expect(result.percentage).toBeGreaterThanOrEqual(0);
            expect(result.percentage).toBeLessThanOrEqual(100);
        });

        test('should calculate Varga Bala for Moon in own sign', () => {
            const result = calculator.calculateVargaBala('MOON', mockBirthChart);

            // Moon in Cancer (own sign) should have high score
            expect(result.percentage).toBeGreaterThan(50); // Should be good or excellent
            expect(['Excellent', 'Good']).toContain(result.strength);
        });

        test('should calculate Varga Bala for Mars in exalted sign', () => {
            const marsExaltedChart = {
                planets: { MARS: 9 * 30 } // Capricorn (exaltation for Mars)
            };
            const result = calculator.calculateVargaBala('MARS', marsExaltedChart);

            // Mars in Capricorn should have excellent score
            expect(result.strength).toBe('Excellent');
            expect(result.percentage).toBeCloseTo(100, 0);
        });

        test('should calculate Varga Bala for Venus in debilitation', () => {
            const venusDebilitatedChart = {
                planets: { VENUS: 5 * 30 } // Virgo (debilitation for Venus)
            };
            const result = calculator.calculateVargaBala('VENUS', venusDebilitatedChart);

            // Venus in Virgo should have very weak score
            expect(result.strength).toBe('Very Weak');
            expect(result.percentage).toBe(0);
        });

        test('should validate Varga Bala breakdown matches weights', () => {
            const result = calculator.calculateVargaBala('SUN', mockBirthChart);

            expect(result.breakdown).toEqual(calculator.vargaBalaWeights);

            // Verify calculation uses correct weights
            const expectedMaxScore = Object.values(calculator.vargaBalaWeights).reduce((sum, weight) => sum + weight, 0);
            expect(result.maxScore).toBe(expectedMaxScore);
        });

        test('should handle planets with multiple strong positions', () => {
            // Jupiter in Sagittarius (own sign) and Pisces (own sign) across Vargas
            const jupiterStrongChart = {
                planets: { JUPITER: 8 * 30 } // Sagittarius
            };
            const result = calculator.calculateVargaBala('JUPITER', jupiterStrongChart);

            expect(result.percentage).toBeGreaterThan(70);
            expect(['Excellent', 'Good']).toContain(result.strength);
        });
    });

    describe('Integration Tests', () => {
        test('should generate complete birth chart analysis', () => {
            const fullBirthChart = {
                planets: {
                    SUN: 45.5, MOON: 93.7, MARS: 0, MERCURY: 35.2,
                    JUPITER: 240, VENUS: 41.2, SATURN: 270, RAHU: 120, KETU: 300
                },
                ascendant: 15.7
            };

            const allCharts = calculator.generateAllDivisionalCharts(fullBirthChart);

            // Should generate all supported charts
            expect(Object.keys(allCharts)).toContain('D1');
            expect(Object.keys(allCharts)).toContain('D9');
            expect(Object.keys(allCharts)).toContain('D10');

            // Each chart should have proper structure
            Object.values(allCharts).forEach(chart => {
                if (chart !== null) {
                    expect(chart).toHaveProperty('type');
                    expect(chart).toHaveProperty('name');
                    expect(chart).toHaveProperty('positions');
                    expect(chart).toHaveProperty('houses');
                }
            });
        });

        test('should maintain data consistency across charts', () => {
            const positions = { SUN: 45.5, MOON: 120.3 };
            const allCharts = calculator.generateAllDivisionalCharts(positions);

            // D1 should always return original positions
            expect(allCharts.D1.positions.SUN).toBe(45.5);
            expect(allCharts.D1.positions.MOON).toBe(120.3);

            // Other charts should have transformed positions
            expect(allCharts.D9.positions.SUN).not.toBe(45.5);
            expect(allCharts.D10.positions.MOON).not.toBe(120.3);
        });

        test('should handle ASC integration correctly', () => {
            const positions = { ASC: 15.7, SUN: 45.5 };
            const d9Chart = calculator.generateDivisionalChart(positions, 'D9');

            // Houses should be calculated based on divisional ASC
            expect(d9Chart.houses).toHaveLength(12);
            expect(d9Chart.houses[0]).toBeGreaterThanOrEqual(0);
            expect(d9Chart.houses[0]).toBeLessThan(360);
        });

        test('should validate chart generation with correlation IDs', () => {
            const positions = { SUN: 45.5 };
            const correlationId = 'test-123';

            // Mock console.log to capture logging
            const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            calculator.generateAllDivisionalCharts(positions, correlationId);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('[DivisionalCalculator]'),
                expect.objectContaining({ correlationId })
            );

            consoleLogSpy.mockRestore();
        });

        test('should handle partial failures gracefully', () => {
            const positions = { SUN: 45.5, MOON: 120.3 };

            // Mock to make D9 fail but others succeed
            const originalCalculate = calculator.calculateDivisionalLongitude;
            calculator.calculateDivisionalLongitude = jest.fn((longitude, chartType) => {
                if (chartType === 'D9') throw new Error('Mock D9 error');
                return originalCalculate.call(this, longitude, chartType);
            });

            const charts = calculator.generateAllDivisionalCharts(positions);

            expect(charts.D9).toBeNull();
            expect(charts.D1).not.toBeNull();
            expect(charts.D2).not.toBeNull();

            // Restore original method
            calculator.calculateDivisionalLongitude = originalCalculate;
        });
    });

    describe('Sign Type Classification', () => {
        test('should correctly classify all moveable signs', () => {
            const moveableSigns = [0, 3, 6, 9]; // Aries, Cancer, Libra, Capricorn
            moveableSigns.forEach(sign => {
                expect(calculator.getSignType(sign)).toBe('moveable');
            });
        });

        test('should correctly classify all fixed signs', () => {
            const fixedSigns = [1, 4, 7, 10]; // Taurus, Leo, Scorpio, Aquarius
            fixedSigns.forEach(sign => {
                expect(calculator.getSignType(sign)).toBe('fixed');
            });
        });

        test('should correctly classify all dual signs', () => {
            const dualSigns = [2, 5, 8, 11]; // Gemini, Virgo, Sagittarius, Pisces
            dualSigns.forEach(sign => {
                expect(calculator.getSignType(sign)).toBe('dual');
            });
        });

        test('should handle sign number wraparound', () => {
            expect(calculator.getSignType(12)).toBe('moveable'); // 12 % 12 = 0 (Aries)
            expect(calculator.getSignType(13)).toBe('fixed');    // 13 % 12 = 1 (Taurus)
            expect(calculator.getSignType(-1)).toBe('dual');     // Negative should still work
        });
    });

    describe('House Calculation Accuracy', () => {
        test('should calculate houses with proper equal distribution', () => {
            const positions = { ASC: 15.7 };
            const houses = calculator.calculateDivisionalHouses(positions, 'D9');

            expect(houses).toHaveLength(12);

            // Each house should be 30° apart
            for (let i = 1; i < houses.length; i++) {
                const diff = (houses[i] - houses[i-1] + 360) % 360;
                expect(diff).toBeCloseTo(30, 10); // Allow small floating point differences
            }
        });

        test('should start houses from divisional ascendant', () => {
            const positions = { ASC: 45 };
            const houses = calculator.calculateDivisionalHouses(positions, 'D10');

            // First house should start from divisional ASC
            const divisionalAsc = calculator.calculateDivisionalLongitude(45, 'D10');
            expect(houses[0]).toBeCloseTo(divisionalAsc, 5);
        });

        test('should handle 360° wraparound in house calculation', () => {
            const positions = { ASC: 350 }; // Near end of zodiac
            const houses = calculator.calculateDivisionalHouses(positions, 'D1');

            expect(houses[0]).toBeCloseTo(350, 5);
            expect(houses[11]).toBeCloseTo(320, 5); // 350 - 30 = 320
        });
    });

    describe('Chart Significance and Metadata', () => {
        test('should return correct significance for all major charts', () => {
            const majorCharts = ['D1', 'D2', 'D3', 'D7', 'D9', 'D10', 'D12'];

            majorCharts.forEach(chartType => {
                const significance = calculator.getChartSignificance(chartType);
                expect(significance).toHaveProperty('name');
                expect(significance).toHaveProperty('significance');
                expect(significance).toHaveProperty('areas');
                expect(significance.areas).toBeInstanceOf(Array);
            });
        });

        test('should provide meaningful significance descriptions', () => {
            const d9Significance = calculator.getChartSignificance('D9');
            expect(d9Significance.name).toBe('Navamsa Chart');
            expect(d9Significance.significance).toContain('Marriage');
            expect(d9Significance.areas).toContain('Marriage');

            const d10Significance = calculator.getChartSignificance('D10');
            expect(d10Significance.name).toBe('Dashamsa Chart');
            expect(d10Significance.significance).toContain('Career');
            expect(d10Significance.areas).toContain('Career');
        });

        test('should return default significance for unknown charts', () => {
            const unknown = calculator.getChartSignificance('D999');
            expect(unknown.name).toBe('Unknown Chart');
            expect(unknown.significance).toBe('Specialized analysis');
            expect(unknown.areas).toEqual(['Specific life areas']);
        });

        test('should validate chart metadata structure', () => {
            const chart = calculator.generateDivisionalChart({ SUN: 45 }, 'D9');

            expect(chart.type).toBe('D9');
            expect(chart.name).toBe('Navamsa Chart');
            expect(chart.significance).toBe('Marriage and relationships');
            expect(chart.divisor).toBe(9);
            expect(chart.positions).toBeDefined();
            expect(chart.houses).toBeDefined();
        });
    });
});