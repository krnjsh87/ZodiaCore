/**
 * Unit Tests for Western Transit Calculator
 *
 * Tests for transit aspect detection and prediction algorithms.
 */

const TransitCalculator = require('./western-transit-calculator');

describe('TransitCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new TransitCalculator();
    });

    test('finds conjunction aspect', () => {
        const aspect = calculator.findTransitAspect(0, 2); // Within 8° orb
        expect(aspect).toHaveProperty('name', 'Conjunction');
        expect(aspect.orb).toBeCloseTo(2, 1);
    });

    test('finds square aspect', () => {
        const aspect = calculator.findTransitAspect(0, 88); // Near 90°
        expect(aspect).toHaveProperty('name', 'Square');
    });

    test('returns null for no aspect', () => {
        const aspect = calculator.findTransitAspect(0, 20); // Outside orb
        expect(aspect).toBeNull();
    });

    test('calculates active transits', () => {
        const natalPositions = { SUN: 0, MOON: 30 };
        const transits = calculator.calculateActiveTransits(natalPositions, 2451545.0);
        expect(Array.isArray(transits)).toBe(true);
        // Should find some transits
        expect(transits.length).toBeGreaterThan(0);
    });

    test('predicts transits within date range', () => {
        const natalPositions = { SUN: 0 };
        const predictions = calculator.predictTransits(natalPositions, 2451545.0, 2451546.0);
        expect(predictions.length).toBeGreaterThan(0);
    });

    test('calculates exact transit timing', () => {
        const result = calculator.calculateExactTransit(0, 'SUN', 'CONJUNCTION', 2451545.0);
        expect(result).toHaveProperty('julianDay');
        expect(result).toHaveProperty('date');
        expect(result.aspect).toBe('Conjunction');
    });

    test('throws error for invalid aspect type', () => {
        expect(() => calculator.calculateExactTransit(0, 'SUN', 'INVALID', 2451545.0))
            .toThrow('Invalid aspect type: INVALID');
    });

    test('converts Julian Day to date', () => {
        const date = calculator.julianDayToDate(2451545.0);
        expect(date).toHaveProperty('year');
        expect(date).toHaveProperty('month');
        expect(date).toHaveProperty('day');
    });

    test('calculates transit duration', () => {
        const transit = {
            natalPlanet: 'SUN',
            transitingPlanet: 'SATURN',
            aspect: 'CONJUNCTION'
        };
        const duration = calculator.calculateTransitDuration(transit);
        expect(duration).toBeGreaterThan(0);
    });

    test('filters transits by intensity', () => {
        const transits = [
            { intensity: 3, aspect: 'Conjunction' },
            { intensity: 8, aspect: 'Square' },
            { intensity: 6, aspect: 'Trine' }
        ];
        const filtered = calculator.filterTransits(transits, { minIntensity: 5 });
        expect(filtered.length).toBe(2);
        expect(filtered.every(t => t.intensity >= 5)).toBe(true);
    });

    test('filters minor aspects when requested', () => {
        const transits = [
            { aspect: 'Conjunction', intensity: 8 },
            { aspect: 'Semi-sextile', intensity: 6 },
            { aspect: 'Square', intensity: 7 }
        ];
        const filtered = calculator.filterTransits(transits, { includeMinorAspects: false });
        expect(filtered.length).toBe(2);
        expect(filtered.some(t => t.aspect === 'Semi-sextile')).toBe(false);
    });

    test('filters by planets', () => {
        const transits = [
            { natalPlanet: 'SUN', transitingPlanet: 'MARS', aspect: 'Square' },
            { natalPlanet: 'MOON', transitingPlanet: 'VENUS', aspect: 'Trine' }
        ];
        const filtered = calculator.filterTransits(transits, { planets: ['SUN', 'MARS'] });
        expect(filtered.length).toBe(1);
        expect(filtered[0].natalPlanet).toBe('SUN');
    });

    test('filters by aspects', () => {
        const transits = [
            { aspect: 'Square', intensity: 8 },
            { aspect: 'Trine', intensity: 7 },
            { aspect: 'Opposition', intensity: 9 }
        ];
        const filtered = calculator.filterTransits(transits, { aspects: ['SQUARE', 'OPPOSITION'] });
        expect(filtered.length).toBe(2);
        expect(filtered.every(t => ['Square', 'Opposition'].includes(t.aspect))).toBe(true);
    });
});