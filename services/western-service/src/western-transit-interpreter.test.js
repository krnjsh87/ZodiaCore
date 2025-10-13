/**
 * Unit Tests for Western Transit Interpreter
 *
 * Tests for transit interpretation and life area correlations.
 */

const TransitInterpreter = require('./western-transit-interpreter');

describe('TransitInterpreter', () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new TransitInterpreter();
    });

    test('interprets transit aspect', () => {
        const transit = {
            natalPlanet: 'SUN',
            transitingPlanet: 'MARS',
            aspect: 'SQUARE',
            orb: 2,
            intensity: 8
        };

        const interpretation = interpreter.interpretTransit(transit);
        expect(interpretation).toHaveProperty('affectedLifeAreas');
        expect(interpretation).toHaveProperty('description');
        expect(Array.isArray(interpretation.recommendations)).toBe(true);
    });

    test('calculates transit duration', () => {
        const transit = {
            natalPlanet: 'SUN',
            transitingPlanet: 'SATURN',
            aspect: 'CONJUNCTION'
        };

        const interpretation = interpreter.interpretTransit(transit);
        expect(interpretation.duration).toBeGreaterThan(0);
    });

    test('calculates intensity adjustments', () => {
        const transit = {
            natalPlanet: 'SUN',
            transitingPlanet: 'SATURN',
            aspect: 'CONJUNCTION',
            orb: 0.5,
            intensity: 8
        };

        const interpretation = interpreter.interpretTransit(transit);
        expect(interpretation.intensity).toBeGreaterThan(8); // Should be boosted for close orb
    });

    test('analyzes transit period', () => {
        const transits = [
            { natalPlanet: 'SUN', transitingPlanet: 'MARS', aspect: 'SQUARE', intensity: 8 },
            { natalPlanet: 'MOON', transitingPlanet: 'VENUS', aspect: 'TRINE', intensity: 7 }
        ];

        const analysis = interpreter.analyzeTransitPeriod(transits);
        expect(analysis).toHaveProperty('periodIntensity');
        expect(analysis).toHaveProperty('dominantLifeAreas');
        expect(analysis.transitCount).toBe(2);
    });

    test('determines overall theme', () => {
        const transits = [
            { aspect: 'SQUARE' },
            { aspect: 'SQUARE' },
            { aspect: 'TRINE' }
        ];

        const analysis = interpreter.analyzeTransitPeriod(transits);
        expect(analysis.overallTheme).toContain('challenging');
    });

    test('gets life areas for planet', () => {
        const areas = interpreter.getLifeAreas('SUN');
        expect(Array.isArray(areas)).toBe(true);
        expect(areas).toContain('identity');
    });

    test('gets aspect effect information', () => {
        const effect = interpreter.getAspectEffect('SQUARE');
        expect(effect).toHaveProperty('effect', 'challenge');
        expect(effect).toHaveProperty('duration');
    });
});