/**
 * Unit Tests for Western VSOP87 Calculator
 *
 * Tests for high-precision planetary position calculations using VSOP87 theory.
 */

const VSOP87Calculator = require('./western-vsop87-calculator');

describe('VSOP87Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new VSOP87Calculator();
    });

    test('calculates Sun position at J2000', () => {
        const position = calculator.calculateLongitude('SUN', 0);
        expect(position).toBeCloseTo(280.459, 1); // Approximate value
    });

    test('returns normalized angles', () => {
        const position = calculator.calculateLongitude('SUN', 0);
        expect(position).toBeGreaterThanOrEqual(0);
        expect(position).toBeLessThan(360);
    });

    test('throws error for invalid planet', () => {
        expect(() => calculator.calculateLongitude('INVALID', 0)).toThrow('Planet INVALID not supported');
    });

    test('calculates all planetary positions', () => {
        const positions = calculator.calculateAllPositions(2451545.0);
        expect(positions).toHaveProperty('SUN');
        expect(positions).toHaveProperty('MOON');
        expect(positions).toHaveProperty('MARS');
        expect(typeof positions.SUN).toBe('number');
        expect(positions.SUN).toBeGreaterThanOrEqual(0);
        expect(positions.SUN).toBeLessThan(360);
    });

    test('calculates positions for specific date', () => {
        const positions = calculator.calculatePositionsForDate(2025, 10, 10);
        expect(positions).toHaveProperty('SUN');
        expect(positions).toHaveProperty('VENUS');
        expect(typeof positions.SUN).toBe('number');
    });

    test('gets individual planet position', () => {
        const position = calculator.getPlanetPosition('MARS', 2451545.0);
        expect(typeof position).toBe('number');
        expect(position).toBeGreaterThanOrEqual(0);
        expect(position).toBeLessThan(360);
    });

    test('handles invalid planet gracefully in calculateAllPositions', () => {
        // Temporarily modify the calculator to test error handling
        const originalTerms = calculator.vsopTerms;
        calculator.vsopTerms = { ...originalTerms };
        delete calculator.vsopTerms.MARS;

        const positions = calculator.calculateAllPositions(2451545.0);
        expect(positions.MARS).toBe(0); // Fallback position

        // Restore
        calculator.vsopTerms = originalTerms;
    });
});