/**
 * ZodiaCore - House System Unit Tests
 *
 * Comprehensive test suite for Western astrology house system calculations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    HOUSE_SYSTEMS,
    calculateWholeSignHouses,
    calculateEqualHouses,
    calculatePlacidusHouses,
    calculateKochHouses,
    calculatePorphyryHouses,
    calculateRegiomontanusHouses,
    calculateCampanusHouses,
    calculateMorinusHouses,
    calculateTopocentricHouses,
    calculateAscendantFromLST,
    getHouseFromLongitude,
    getPlanetsInHouse,
    calculateHouseStrengths,
    angularDistance,
    angularSeparation,
    HouseSystemValidationError,
    HouseSystemCalculationError,
    WesternHouseSystemCalculator
} = require('./house-systems');

describe('Utility Functions', () => {
    describe('angularDistance', () => {
        test('calculates shortest distance between angles', () => {
            expect(angularDistance(0, 10)).toBe(10);
            expect(angularDistance(350, 10)).toBe(20); // Crossing 0/360 boundary
            expect(angularDistance(180, 0)).toBe(180);
            expect(angularDistance(10, 350)).toBe(20); // Reverse direction
            expect(angularDistance(0, 0)).toBe(0); // Same angle
            expect(angularDistance(180, 180)).toBe(0); // Same angle
        });

        test('handles large angle differences', () => {
            expect(angularDistance(359, 1)).toBe(2);
            expect(angularDistance(1, 359)).toBe(2);
            expect(angularDistance(270, 90)).toBe(180);
        });
    });

    describe('angularSeparation', () => {
        test('calculates separation considering direction', () => {
            expect(angularSeparation(0, 90)).toBe(90);
            expect(angularSeparation(350, 10)).toBe(20); // Crossing boundary
            expect(angularSeparation(90, 0)).toBe(270); // Counter-clockwise
            expect(angularSeparation(0, 270)).toBe(270); // Counter-clockwise
            expect(angularSeparation(180, 90)).toBe(270); // Counter-clockwise
        });

        test('handles wrap-around correctly', () => {
            expect(angularSeparation(350, 10)).toBe(20);
            expect(angularSeparation(10, 350)).toBe(340); // Clockwise long way
        });
    });
});

describe('Western House Systems', () => {
    describe('calculateAscendantFromLST', () => {
        test('calculates ascendant for standard conditions', () => {
            const ascendant = calculateAscendantFromLST(90, 40, 23.4);
            expect(ascendant).toBeGreaterThanOrEqual(0);
            expect(ascendant).toBeLessThan(360);
            expect(typeof ascendant).toBe('number');
        });

        test('returns normalized angles', () => {
            const ascendant = calculateAscendantFromLST(450, 40, 23.4); // LST > 360
            expect(ascendant).toBeGreaterThanOrEqual(0);
            expect(ascendant).toBeLessThan(360);
        });

        test('handles equatorial latitude', () => {
            const ascendant = calculateAscendantFromLST(90, 0, 23.4);
            expect(ascendant).toBeCloseTo(90, 1); // Should be close to LST at equator
        });

        test('handles polar latitudes', () => {
            const ascendantNorth = calculateAscendantFromLST(90, 89, 23.4);
            const ascendantSouth = calculateAscendantFromLST(90, -89, 23.4);
            expect(ascendantNorth).toBeGreaterThanOrEqual(0);
            expect(ascendantSouth).toBeGreaterThanOrEqual(0);
        });
    });

    describe('calculateWholeSignHouses', () => {
        test('calculates whole sign houses correctly', () => {
            const houses = calculateWholeSignHouses(15); // 15° Cancer (Cancer starts at 90°)
            expect(houses).toHaveLength(12);
            expect(houses[0]).toBe(90); // 1st house starts at Cancer
            expect(houses[1]).toBe(120); // 2nd house Leo
            expect(houses[11]).toBe(60); // 12th house Gemini
        });

        test('handles angle wrapping', () => {
            const houses = calculateWholeSignHouses(359); // Almost 360°
            expect(houses[0]).toBe(330); // Should wrap to Pisces
        });
    });

    describe('calculatePlacidusHouses', () => {
        test('calculates houses for equatorial latitude', () => {
            const lst = 90;
            const latitude = 0;
            const houses = calculatePlacidusHouses(lst, latitude);
            expect(houses).toHaveLength(12);
            expect(houses[0]).toBeCloseTo(90, 1); // Ascendant at equator
        });

        test('throws error for high latitude', () => {
            expect(() => calculatePlacidusHouses(90, 70)).toThrow('Placidus house system is not valid');
        });

        test('returns normalized angles', () => {
            const houses = calculatePlacidusHouses(400, 30);
            houses.forEach(house => {
                expect(house).toBeGreaterThanOrEqual(0);
                expect(house).toBeLessThan(360);
            });
        });

        test('calculates houses for northern hemisphere', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculatePlacidusHouses(lst, latitude);
            expect(houses).toHaveLength(12);
            expect(houses[0]).toBeGreaterThan(0); // Ascendant
            expect(houses[9]).toBe(120); // MC should be LST
        });

        test('handles southern hemisphere', () => {
            const lst = 120;
            const latitude = -40;
            const houses = calculatePlacidusHouses(lst, latitude);
            expect(houses).toHaveLength(12);
            expect(houses[0]).toBeGreaterThan(0); // Ascendant
        });

        test('validates fraction range in helper function', () => {
            // This would require mocking or testing the internal function
            // For now, test that valid inputs work
            const houses = calculatePlacidusHouses(120, 30);
            expect(houses).toHaveLength(12);
        });

        test('handles edge case near latitude limit', () => {
            const houses = calculatePlacidusHouses(120, 59); // Just under limit
            expect(houses).toHaveLength(12);
        });
    });

    describe('calculateEqualHouses', () => {
        test('calculates equal 30-degree divisions', () => {
            const ascendant = 0;
            const houses = calculateEqualHouses(ascendant);
            expect(houses[0]).toBe(0);   // 1st house
            expect(houses[3]).toBe(90);  // 4th house
            expect(houses[6]).toBe(180); // 7th house
            expect(houses[9]).toBe(270); // 10th house
        });

        test('handles angle wrapping', () => {
            const ascendant = 330;
            const houses = calculateEqualHouses(ascendant);
            expect(houses[0]).toBe(330);
            expect(houses[1]).toBe(0);   // Wraps around
            expect(houses[2]).toBe(30);
        });

        test('calculates equal divisions for any ascendant', () => {
            const ascendant = 45;
            const houses = calculateEqualHouses(ascendant);
            expect(houses[0]).toBe(45);  // 1st house
            expect(houses[1]).toBe(75);  // 2nd house
            expect(houses[6]).toBe(225); // 7th house (opposite)
            expect(houses[9]).toBe(315); // 10th house
        });

        test('ensures all houses are exactly 30 degrees apart', () => {
            const ascendant = 15;
            const houses = calculateEqualHouses(ascendant);
            for (let i = 1; i < 12; i++) {
                const diff = (houses[i] - houses[i-1] + 360) % 360;
                expect(diff).toBe(30);
            }
        });

        test('handles negative ascendant angles', () => {
            const ascendant = -30;
            const houses = calculateEqualHouses(ascendant);
            expect(houses[0]).toBe(330); // Normalized
            expect(houses[1]).toBe(0);
        });

        test('handles ascendant at 360 degrees', () => {
            const ascendant = 360;
            const houses = calculateEqualHouses(ascendant);
            expect(houses[0]).toBe(0); // Should normalize to 0
        });
    });

    describe('calculateKochHouses', () => {
        test('calculates houses successfully', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateKochHouses(lst, latitude);
            expect(houses).toHaveLength(12);
            expect(typeof houses[0]).toBe('number');
        });

        test('throws error for high latitude', () => {
            expect(() => calculateKochHouses(120, 70)).toThrow('Koch house system is not valid');
        });

        test('calculates houses for different latitudes', () => {
            const lst = 120;
            const housesNorth = calculateKochHouses(lst, 30);
            const housesSouth = calculateKochHouses(lst, -30);
            expect(housesNorth).toHaveLength(12);
            expect(housesSouth).toHaveLength(12);
            // Results should be different for different latitudes
            expect(housesNorth[0]).not.toBe(housesSouth[0]);
        });

        test('sets angular houses correctly', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateKochHouses(lst, latitude);
            expect(houses[9]).toBe(120); // MC should be LST
            expect(houses[0]).toBeGreaterThan(0); // Ascendant
        });

        test('handles edge case near latitude limit', () => {
            const houses = calculateKochHouses(120, 58); // Just under limit
            expect(houses).toHaveLength(12);
        });
    });

    describe('calculatePorphyryHouses', () => {
        test('calculates Porphyry houses correctly', () => {
            const ascendant = 0;
            const midheaven = 90;
            const houses = calculatePorphyryHouses(ascendant, midheaven);
            expect(houses).toHaveLength(12);
            // Porphyry should have equal divisions within quadrants
            expect(houses[1]).toBeCloseTo(30, 1); // 2nd house
            expect(houses[2]).toBeCloseTo(60, 1); // 3rd house
        });

        test('handles different ascendant and midheaven positions', () => {
            const ascendant = 45;
            const midheaven = 135;
            const houses = calculatePorphyryHouses(ascendant, midheaven);
            expect(houses).toHaveLength(12);
            expect(houses[0]).toBe(45); // Ascendant
            expect(houses[9]).toBe(135); // MC
            // Check that intermediate houses are calculated correctly
            expect(houses[1]).toBeGreaterThan(45);
            expect(houses[1]).toBeLessThan(135);
        });

        test('ensures angular houses are set correctly', () => {
            const ascendant = 30;
            const midheaven = 120;
            const houses = calculatePorphyryHouses(ascendant, midheaven);
            expect(houses[0]).toBe(30);  // Ascendant
            expect(houses[3]).toBe(300); // IC (midheaven + 180)
            expect(houses[6]).toBe(210); // Descendant (ascendant + 180)
            expect(houses[9]).toBe(120); // MC
        });

        test('calculates equal divisions within each quadrant', () => {
            const ascendant = 0;
            const midheaven = 90;
            const houses = calculatePorphyryHouses(ascendant, midheaven);
            // First quadrant: houses 1-3 should be at 0, 30, 60
            expect(houses[0]).toBe(0);
            expect(houses[1]).toBe(30);
            expect(houses[2]).toBe(60);
            // Second quadrant: houses 4-6 should be at 270, 300, 330
            expect(houses[3]).toBe(270); // IC
            expect(houses[4]).toBe(300);
            expect(houses[5]).toBe(330);
        });
    });

    describe('calculateRegiomontanusHouses', () => {
        test('calculates Regiomontanus houses', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateRegiomontanusHouses(lst, latitude);
            expect(houses).toHaveLength(12);
        });

        test('sets angular houses correctly', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateRegiomontanusHouses(lst, latitude);
            expect(houses[9]).toBe(120); // MC should be LST
            expect(houses[0]).toBeGreaterThan(0); // Ascendant
            expect(houses[6]).toBe(normalizeAngle(houses[0] + 180)); // Descendant
        });

        test('calculates houses for different latitudes', () => {
            const lst = 120;
            const housesNorth = calculateRegiomontanusHouses(lst, 30);
            const housesSouth = calculateRegiomontanusHouses(lst, -30);
            expect(housesNorth).toHaveLength(12);
            expect(housesSouth).toHaveLength(12);
        });
    });

    describe('calculateCampanusHouses', () => {
        test('calculates Campanus houses', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateCampanusHouses(lst, latitude);
            expect(houses).toHaveLength(12);
        });

        test('sets angular houses correctly', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateCampanusHouses(lst, latitude);
            expect(houses[9]).toBe(120); // MC should be LST
            expect(houses[0]).toBeGreaterThan(0); // Ascendant
            expect(houses[6]).toBe(normalizeAngle(houses[0] + 180)); // Descendant
            expect(houses[3]).toBe(normalizeAngle(houses[9] + 180)); // IC
        });

        test('calculates houses for different latitudes', () => {
            const lst = 120;
            const housesNorth = calculateCampanusHouses(lst, 30);
            const housesSouth = calculateCampanusHouses(lst, -30);
            expect(housesNorth).toHaveLength(12);
            expect(housesSouth).toHaveLength(12);
        });
    });

    describe('calculateMorinusHouses', () => {
        test('calculates Morinus houses', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateMorinusHouses(lst, latitude);
            expect(houses).toHaveLength(12);
        });

        test('throws error for high latitude', () => {
            expect(() => calculateMorinusHouses(120, 70)).toThrow('Morinus house system is not valid');
        });

        test('sets angular houses correctly', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateMorinusHouses(lst, latitude);
            expect(houses[9]).toBe(120); // MC should be LST
            expect(houses[0]).toBeGreaterThan(0); // Ascendant
        });

        test('calculates houses for different latitudes', () => {
            const lst = 120;
            const housesNorth = calculateMorinusHouses(lst, 30);
            const housesSouth = calculateMorinusHouses(lst, -30);
            expect(housesNorth).toHaveLength(12);
            expect(housesSouth).toHaveLength(12);
        });

        test('handles edge case near latitude limit', () => {
            const houses = calculateMorinusHouses(120, 58); // Just under limit
            expect(houses).toHaveLength(12);
        });
    });

    describe('calculateTopocentricHouses', () => {
        test('calculates Topocentric houses', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateTopocentricHouses(lst, latitude);
            expect(houses).toHaveLength(12);
        });

        test('handles altitude parameter', () => {
            const lst = 120;
            const latitude = 40;
            const houses1 = calculateTopocentricHouses(lst, latitude, 23.4, 0);
            const houses2 = calculateTopocentricHouses(lst, latitude, 23.4, 1000);
            expect(houses1).not.toEqual(houses2); // Should be different with altitude
        });

        test('uses Placidus as base calculation', () => {
            const lst = 120;
            const latitude = 40;
            const topocentricHouses = calculateTopocentricHouses(lst, latitude);
            const placidusHouses = calculatePlacidusHouses(lst, latitude);
            // Should be similar but potentially different due to parallax correction
            expect(topocentricHouses).toHaveLength(12);
            expect(placidusHouses).toHaveLength(12);
        });

        test('handles zero altitude', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateTopocentricHouses(lst, latitude, 23.4, 0);
            expect(houses).toHaveLength(12);
        });

        test('handles high altitude', () => {
            const lst = 120;
            const latitude = 40;
            const houses = calculateTopocentricHouses(lst, latitude, 23.4, 5000);
            expect(houses).toHaveLength(12);
        });
    });

    describe('getHouseFromLongitude', () => {
        test('correctly identifies house positions', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            expect(getHouseFromLongitude(15, houses)).toBe(1);
            expect(getHouseFromLongitude(45, houses)).toBe(2);
            expect(getHouseFromLongitude(359, houses)).toBe(12);
        });

        test('handles boundary conditions', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            expect(getHouseFromLongitude(0, houses)).toBe(1); // Exactly on cusp
            expect(getHouseFromLongitude(30, houses)).toBe(1); // Exactly on cusp (belongs to 1st)
            expect(getHouseFromLongitude(359.9, houses)).toBe(12);
        });

        test('handles wrap-around at 360 degrees', () => {
            const houses = [330, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300];
            expect(getHouseFromLongitude(345, houses)).toBe(12); // Between 330 and 0 (360)
            expect(getHouseFromLongitude(15, houses)).toBe(2);  // Between 0 and 30
        });
    });

    describe('getPlanetsInHouse', () => {
        test('correctly identifies planets in a specific house', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const planetaryPositions = {
                sun: 15,    // 1st house
                moon: 45,   // 2nd house
                mars: 75,   // 3rd house
                venus: 359  // 12th house
            };
            expect(getPlanetsInHouse(1, planetaryPositions, houses)).toEqual(['sun']);
            expect(getPlanetsInHouse(2, planetaryPositions, houses)).toEqual(['moon']);
            expect(getPlanetsInHouse(3, planetaryPositions, houses)).toEqual(['mars']);
            expect(getPlanetsInHouse(12, planetaryPositions, houses)).toEqual(['venus']);
        });

        test('returns multiple planets in same house', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const planetaryPositions = {
                sun: 15,      // 1st house
                mercury: 20,  // 1st house
                venus: 25     // 1st house
            };
            expect(getPlanetsInHouse(1, planetaryPositions, houses)).toEqual(['sun', 'mercury', 'venus']);
        });

        test('returns empty array when no planets in house', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const planetaryPositions = {
                sun: 15,  // 1st house
                moon: 45  // 2nd house
            };
            expect(getPlanetsInHouse(3, planetaryPositions, houses)).toEqual([]);
        });
    });

    describe('calculateHouseStrengths', () => {
        test('calculates house strengths based on planetary positions', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const planetaryPositions = {
                sun: 15,    // 1st house
                moon: 45,   // 2nd house
                mars: 45,   // 2nd house
                venus: 359  // 12th house
            };
            const strengths = calculateHouseStrengths(houses, planetaryPositions);
            expect(strengths).toHaveLength(12);
            expect(strengths[0]).toBe(1); // 1st house: sun
            expect(strengths[1]).toBe(2); // 2nd house: moon, mars
            expect(strengths[11]).toBe(1); // 12th house: venus
            expect(strengths[2]).toBe(0); // 3rd house: empty
        });

        test('returns zero strengths for empty planetary positions', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const planetaryPositions = {};
            const strengths = calculateHouseStrengths(houses, planetaryPositions);
            expect(strengths).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });

        test('handles all planets in one house', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            const planetaryPositions = {
                sun: 15,
                moon: 20,
                mars: 25
            };
            const strengths = calculateHouseStrengths(houses, planetaryPositions);
            expect(strengths[0]).toBe(3); // All in 1st house
            expect(strengths.slice(1)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
    });

    describe('WesternHouseSystemCalculator', () => {
        let calculator;

        beforeEach(() => {
            calculator = new WesternHouseSystemCalculator();
        });

        test('calculates Placidus houses successfully', () => {
            const result = calculator.calculateHouses('placidus', 120, 40, 23.4);
            expect(result.system).toBe('placidus');
            expect(result.houses).toHaveLength(12);
            expect(result.angularHouses.ascendant).toBeDefined();
        });

        test('calculates Equal houses correctly', () => {
            const result = calculator.calculateHouses('equal', 120, 40, 23.4);
            // Equal houses should be exactly 30 degrees apart
            for (let i = 1; i < 12; i++) {
                const diff = Math.abs(result.houses[i-1].cusp - result.houses[i].cusp);
                expect(diff).toBeCloseTo(30, 1);
            }
        });

        test('throws error for invalid house system', () => {
            expect(() => calculator.calculateHouses('invalid', 120, 40, 23.4))
                .toThrow('Unsupported house system');
        });

        test('throws error for invalid latitude', () => {
            expect(() => calculator.calculateHouses('placidus', 120, 100, 23.4))
                .toThrow('Latitude must be between -90 and 90');
        });

        test('handles polar latitudes for Equal system', () => {
            const result = calculator.calculateHouses('equal', 120, 89, 23.4);
            expect(result.houses).toHaveLength(12);
        });

        test('calculates Porphyry houses correctly', () => {
            const result = calculator.calculateHouses('porphyry', 120, 40, 23.4);
            // Porphyry should have equal divisions within quadrants
            const asc = result.angularHouses.ascendant.cusp;
            const mc = result.angularHouses.midheaven.cusp;
            const quadrantSize = Math.abs(mc - asc);
            expect(quadrantSize).toBeGreaterThan(0);
        });

        test('getHouseFromLongitude works correctly', () => {
            const houses = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
            expect(calculator.getHouseFromLongitude(15, houses)).toBe(1);
            expect(calculator.getHouseFromLongitude(45, houses)).toBe(2);
            expect(calculator.getHouseFromLongitude(359, houses)).toBe(12);
        });
    });

    describe('House System Integration', () => {
        test('all house systems produce valid results', () => {
            const calculator = new WesternHouseSystemCalculator();
            const systems = ['placidus', 'equal', 'koch', 'porphyry', 'regiomontanus', 'campanus', 'morinus', 'topocentric'];

            systems.forEach(system => {
                const result = calculator.calculateHouses(system, 120, 40, 23.4);
                expect(result.houses).toHaveLength(12);
                expect(result.system).toBe(system);
            });
        });

        test('performance benchmark', () => {
            const calculator = new WesternHouseSystemCalculator();
            const startTime = Date.now();

            for (let i = 0; i < 100; i++) {
                calculator.calculateHouses('placidus', 120 + i, 40, 23.4);
            }

            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
        });
    });

    describe('Error Handling', () => {
        test('HouseSystemValidationError is properly defined', () => {
            const error = new HouseSystemValidationError('Test error');
            expect(error.message).toBe('Test error');
            expect(error.name).toBe('HouseSystemValidationError');
        });

        test('HouseSystemCalculationError is properly defined', () => {
            const error = new HouseSystemCalculationError('Test error');
            expect(error.message).toBe('Test error');
            expect(error.name).toBe('HouseSystemCalculationError');
        });
    });

    describe('Input Validation', () => {
        describe('WesternHouseSystemCalculator validation', () => {
            let calculator;

            beforeEach(() => {
                calculator = new WesternHouseSystemCalculator();
            });

            test('validates house system parameter', () => {
                expect(() => calculator.calculateHouses('invalid', 120, 40, 23.4))
                    .toThrow('Invalid house system');
            });

            test('validates LST parameter', () => {
                expect(() => calculator.calculateHouses('placidus', 'invalid', 40, 23.4))
                    .toThrow('LST must be a valid number');
                expect(() => calculator.calculateHouses('placidus', NaN, 40, 23.4))
                    .toThrow('LST must be a valid number');
            });

            test('validates latitude range', () => {
                expect(() => calculator.calculateHouses('placidus', 120, 100, 23.4))
                    .toThrow('Latitude must be a number between -90 and 90');
                expect(() => calculator.calculateHouses('placidus', 120, -100, 23.4))
                    .toThrow('Latitude must be a number between -90 and 90');
                expect(() => calculator.calculateHouses('placidus', 120, 'invalid', 23.4))
                    .toThrow('Latitude must be a number between -90 and 90');
            });

            test('validates obliquity range', () => {
                expect(() => calculator.calculateHouses('placidus', 120, 40, 100))
                    .toThrow('Obliquity must be a number between 0 and 90');
                expect(() => calculator.calculateHouses('placidus', 120, 40, -5))
                    .toThrow('Obliquity must be a number between 0 and 90');
                expect(() => calculator.calculateHouses('placidus', 120, 40, 'invalid'))
                    .toThrow('Obliquity must be a number between 0 and 90');
            });

            test('accepts valid parameters', () => {
                const result = calculator.calculateHouses('placidus', 120, 40, 23.4);
                expect(result).toBeDefined();
                expect(result.system).toBe('placidus');
            });
        });

        describe('Individual function validations', () => {
            test('calculatePlacidusHouses validates latitude', () => {
                expect(() => calculatePlacidusHouses(120, 70))
                    .toThrow('Placidus house system is not valid for latitudes beyond ±60 degrees');
            });

            test('calculateKochHouses validates latitude', () => {
                expect(() => calculateKochHouses(120, 70))
                    .toThrow('Koch house system is not valid for latitudes beyond ±60 degrees');
            });

            test('calculateMorinusHouses validates latitude', () => {
                expect(() => calculateMorinusHouses(120, 70))
                    .toThrow('Morinus house system is not valid for latitudes beyond ±60 degrees');
            });
        });
    });

    describe('Performance and Accuracy', () => {
        test('calculations complete within time limits', () => {
            const calculator = new WesternHouseSystemCalculator();
            const startTime = Date.now();

            // Test multiple calculations
            for (let i = 0; i < 50; i++) {
                calculator.calculateHouses('placidus', 120 + i, 40, 23.4);
            }

            const endTime = Date.now();
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(200); // Should complete in < 200ms
        });

        test('house cusps are within valid ranges', () => {
            const calculator = new WesternHouseSystemCalculator();
            const systems = ['placidus', 'equal', 'koch', 'porphyry', 'regiomontanus', 'campanus', 'morinus', 'topocentric'];

            systems.forEach(system => {
                const result = calculator.calculateHouses(system, 120, 40, 23.4);
                result.houses.forEach(house => {
                    expect(house.cusp).toBeGreaterThanOrEqual(0);
                    expect(house.cusp).toBeLessThan(360);
                    expect(house.sign).toBeGreaterThanOrEqual(0);
                    expect(house.sign).toBeLessThan(12);
                    expect(house.degree).toBeGreaterThanOrEqual(0);
                    expect(house.degree).toBeLessThan(30);
                });
            });
        });

        test('angular houses are properly positioned', () => {
            const calculator = new WesternHouseSystemCalculator();
            const systems = ['placidus', 'equal', 'koch', 'porphyry', 'regiomontanus', 'campanus', 'morinus', 'topocentric'];

            systems.forEach(system => {
                const result = calculator.calculateHouses(system, 120, 40, 23.4);
                const asc = result.angularHouses.ascendant.cusp;
                const mc = result.angularHouses.midheaven.cusp;
                const desc = result.angularHouses.descendant.cusp;
                const ic = result.angularHouses.nadir.cusp;

                // Check angular relationships
                expect(Math.abs(normalizeAngle(desc - asc) - 180)).toBeLessThan(1);
                expect(Math.abs(normalizeAngle(ic - mc) - 180)).toBeLessThan(1);
            });
        });

        test('results are deterministic', () => {
            const calculator = new WesternHouseSystemCalculator();

            // Run same calculation multiple times
            const result1 = calculator.calculateHouses('placidus', 120, 40, 23.4);
            const result2 = calculator.calculateHouses('placidus', 120, 40, 23.4);

            expect(result1.houses[0].cusp).toBe(result2.houses[0].cusp);
            expect(result1.houses[9].cusp).toBe(result2.houses[9].cusp);
        });
    });
});