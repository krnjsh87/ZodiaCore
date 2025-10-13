/**
 * Unit Tests for Astronomical Calculations
 * ZC1.23 Complex Mundane Astrology Implementation
 *
 * Comprehensive test suite for astronomical calculation functions
 */

const {
    degToRad,
    radToDeg,
    calculateLahiriAyanamsa,
    calculateGMST,
    calculateLST,
    calculateAscendant,
    calculateWholeSignHouses,
    calculateMidheaven,
    calculatePlanetaryPositions,
    tropicalToSidereal,
    calculateSolarPosition,
    calculateLunarPosition,
    calculateAngularSeparation,
    calculateMundaneStrength,
    calculateAspect,
    getAspectAngle,
    calculateDignityStrength,
    calculateNakshatra,
    calculateEclipseVisibility,
    analyzeEclipseEffects,
    calculateVernalEquinox,
    calculateSummerSolstice,
    calculateAutumnalEquinox,
    calculateWinterSolstice
} = require('./mundane-astronomical-calculations');

describe('Mathematical Utilities', () => {
    describe('degToRad and radToDeg', () => {
        test('should convert degrees to radians correctly', () => {
            expect(degToRad(0)).toBe(0);
            expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
            expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
            expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 10);
        });

        test('should convert radians to degrees correctly', () => {
            expect(radToDeg(0)).toBe(0);
            expect(radToDeg(Math.PI / 2)).toBeCloseTo(90, 10);
            expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
            expect(radToDeg(2 * Math.PI)).toBeCloseTo(360, 10);
        });

        test('should be inverse operations', () => {
            const degrees = 45.5;
            expect(radToDeg(degToRad(degrees))).toBeCloseTo(degrees, 10);
        });
    });
});

describe('Ayanamsa Calculations', () => {
    describe('calculateLahiriAyanamsa', () => {
        test('should calculate ayanamsa for year 2000', () => {
            const ayanamsa = calculateLahiriAyanamsa(2000);
            expect(ayanamsa).toBeGreaterThan(23);
            expect(ayanamsa).toBeLessThan(25);
        });

        test('should increase with year', () => {
            const ayanamsa2000 = calculateLahiriAyanamsa(2000);
            const ayanamsa2020 = calculateLahiriAyanamsa(2020);
            expect(ayanamsa2020).toBeGreaterThan(ayanamsa2000);
        });
    });
});

describe('Sidereal Time Calculations', () => {
    describe('calculateGMST', () => {
        test('should calculate GMST for J2000', () => {
            const gmst = calculateGMST(2451545.0);
            expect(gmst).toBeGreaterThan(0);
            expect(gmst).toBeLessThan(360);
        });

        test('should be periodic', () => {
            const gmst1 = calculateGMST(2451545.0);
            const gmst2 = calculateGMST(2451545.0 + 365.25); // One year later
            expect(Math.abs(gmst2 - gmst1)).toBeLessThan(1); // Should be approximately the same
        });
    });

    describe('calculateLST', () => {
        test('should calculate LST for Greenwich', () => {
            const gmst = 100;
            const lst = calculateLST(gmst, 0); // Greenwich
            expect(lst).toBe(100);
        });

        test('should adjust for longitude', () => {
            const gmst = 100;
            const lst = calculateLST(gmst, 15); // 15° East
            expect(lst).toBe(115);
        });

        test('should handle longitude wraparound', () => {
            const gmst = 350;
            const lst = calculateLST(gmst, 30);
            expect(lst).toBe(20); // 350 + 30 = 380, 380 - 360 = 20
        });
    });
});

describe('House Calculations', () => {
    describe('calculateAscendant', () => {
        test('should calculate ascendant for standard conditions', () => {
            const lst = 0; // Midnight
            const latitude = 0; // Equator
            const asc = calculateAscendant(lst, latitude);
            expect(asc).toBeGreaterThanOrEqual(0);
            expect(asc).toBeLessThan(360);
        });

        test('should handle different latitudes', () => {
            const lst = 90;
            const ascNorth = calculateAscendant(lst, 45);
            const ascSouth = calculateAscendant(lst, -45);
            expect(ascNorth).not.toBe(ascSouth);
        });
    });

    describe('calculateWholeSignHouses', () => {
        test('should generate 12 houses', () => {
            const houses = calculateWholeSignHouses(0);
            expect(houses).toHaveLength(12);
        });

        test('should start with ascendant', () => {
            const ascendant = 45;
            const houses = calculateWholeSignHouses(ascendant);
            expect(houses[0]).toBe(45);
        });

        test('should have 30-degree separations', () => {
            const houses = calculateWholeSignHouses(0);
            for (let i = 1; i < 12; i++) {
                expect(houses[i]).toBe((houses[i-1] + 30) % 360);
            }
        });
    });

    describe('calculateMidheaven', () => {
        test('should calculate midheaven', () => {
            const lst = 90;
            const mc = calculateMidheaven(lst);
            expect(mc).toBe(90);
        });
    });
});

describe('Planetary Position Calculations', () => {
    describe('calculatePlanetaryPositions', () => {
        test('should return all planets', () => {
            const positions = calculatePlanetaryPositions(2451545.0);
            expect(positions).toHaveProperty('SUN');
            expect(positions).toHaveProperty('MOON');
            expect(positions).toHaveProperty('MARS');
            expect(positions).toHaveProperty('VENUS');
            expect(positions).toHaveProperty('JUPITER');
            expect(positions).toHaveProperty('SATURN');
            expect(positions).toHaveProperty('RAHU');
            expect(positions).toHaveProperty('KETU');
        });

        test('should return valid longitudes', () => {
            const positions = calculatePlanetaryPositions(2451545.0);
            Object.values(positions).forEach(longitude => {
                expect(longitude).toBeGreaterThanOrEqual(0);
                expect(longitude).toBeLessThan(360);
            });
        });
    });

    describe('tropicalToSidereal', () => {
        test('should convert positions correctly', () => {
            const tropical = { SUN: 0, MOON: 90 };
            const ayanamsa = 24;
            const sidereal = tropicalToSidereal(tropical, ayanamsa);
            expect(sidereal.SUN).toBe(336); // 0 - 24 = -24, -24 + 360 = 336
            expect(sidereal.MOON).toBe(66); // 90 - 24 = 66
        });

        test('should handle negative results', () => {
            const tropical = { SUN: 10 };
            const ayanamsa = 30;
            const sidereal = tropicalToSidereal(tropical, ayanamsa);
            expect(sidereal.SUN).toBe(340); // 10 - 30 = -20, -20 + 360 = 340
        });
    });

    describe('calculateSolarPosition', () => {
        test('should return solar position object', () => {
            const position = calculateSolarPosition(2451545.0);
            expect(position).toHaveProperty('longitude');
            expect(position).toHaveProperty('latitude');
            expect(position).toHaveProperty('distance');
        });
    });

    describe('calculateLunarPosition', () => {
        test('should return lunar position object', () => {
            const position = calculateLunarPosition(2451545.0);
            expect(position).toHaveProperty('longitude');
            expect(position).toHaveProperty('latitude');
            expect(position).toHaveProperty('distance');
        });
    });
});

describe('Angular Calculations', () => {
    describe('calculateAngularSeparation', () => {
        test('should calculate separation between points', () => {
            const sep = calculateAngularSeparation(0, 0, 90, 0);
            expect(sep).toBeCloseTo(90, 1);
        });

        test('should handle same point', () => {
            const sep = calculateAngularSeparation(45, 30, 45, 30);
            expect(sep).toBe(0);
        });

        test('should handle antipodal points', () => {
            const sep = calculateAngularSeparation(0, 0, 180, 0);
            expect(sep).toBeCloseTo(180, 1);
        });
    });
});

describe('Aspect Calculations', () => {
    describe('calculateAspect', () => {
        test('should detect conjunction', () => {
            expect(calculateAspect(0, 5)).toBe('Conjunction');
            expect(calculateAspect(0, 355)).toBe('Conjunction'); // Wrap around
        });

        test('should detect opposition', () => {
            expect(calculateAspect(0, 180)).toBe('Opposition');
            expect(calculateAspect(0, 185)).toBe('Opposition');
        });

        test('should detect square', () => {
            expect(calculateAspect(0, 90)).toBe('Square');
            expect(calculateAspect(0, 95)).toBe('Square');
        });

        test('should detect trine', () => {
            expect(calculateAspect(0, 120)).toBe('Trine');
            expect(calculateAspect(0, 125)).toBe('Trine');
        });

        test('should detect sextile', () => {
            expect(calculateAspect(0, 60)).toBe('Sextile');
            expect(calculateAspect(0, 65)).toBe('Sextile');
        });

        test('should return no aspect for large separations', () => {
            expect(calculateAspect(0, 45)).toBe('No major aspect');
        });
    });

    describe('getAspectAngle', () => {
        test('should return correct angles', () => {
            expect(getAspectAngle('Conjunction')).toBe(0);
            expect(getAspectAngle('Sextile')).toBe(60);
            expect(getAspectAngle('Square')).toBe(90);
            expect(getAspectAngle('Trine')).toBe(120);
            expect(getAspectAngle('Opposition')).toBe(180);
            expect(getAspectAngle('Unknown')).toBe(0);
        });
    });
});

describe('Dignity and Strength Calculations', () => {
    describe('calculateDignityStrength', () => {
        test('should calculate Sun dignity', () => {
            const strength = calculateDignityStrength({ name: 'SUN' }, {});
            expect(typeof strength).toBe('number');
            expect(strength).toBeGreaterThanOrEqual(0);
        });

        test('should handle unknown planets', () => {
            const strength = calculateDignityStrength({ name: 'UNKNOWN' }, {});
            expect(strength).toBe(10); // Default value
        });
    });

    describe('calculateMundaneStrength', () => {
        test('should calculate planet strength', () => {
            const planet = { longitude: 90, house: 1 };
            const chart = { midheaven: 90 };
            const strength = calculateMundaneStrength(planet, chart);
            expect(strength).toBeGreaterThan(0);
        });
    });
});

describe('Nakshatra Calculations', () => {
    describe('calculateNakshatra', () => {
        test('should calculate nakshatra from longitude', () => {
            expect(calculateNakshatra(0)).toBe(0);
            expect(calculateNakshatra(13.3333)).toBe(1);
            expect(calculateNakshatra(359.999)).toBe(26);
        });
    });
});

describe('Eclipse Calculations', () => {
    describe('calculateEclipseVisibility', () => {
        test('should return visibility percentage', () => {
            const visibility = calculateEclipseVisibility(2451545.0, { lat: 0, lon: 0 });
            expect(visibility).toBeGreaterThanOrEqual(0);
            expect(visibility).toBeLessThanOrEqual(1);
        });
    });

    describe('analyzeEclipseEffects', () => {
        test('should return effect description', () => {
            const effect = analyzeEclipseEffects(0, 0);
            expect(typeof effect).toBe('string');
            expect(effect.length).toBeGreaterThan(0);
        });

        test('should handle all signs', () => {
            for (let sign = 0; sign < 12; sign++) {
                const effect = analyzeEclipseEffects(sign, sign);
                expect(typeof effect).toBe('string');
            }
        });
    });
});

describe('Seasonal Calculations', () => {
    describe('calculateVernalEquinox', () => {
        test('should calculate equinox date', () => {
            const jd = calculateVernalEquinox(2020);
            expect(jd).toBeGreaterThan(2451545); // After J2000
        });
    });

    describe('calculateSummerSolstice', () => {
        test('should calculate solstice date', () => {
            const jd = calculateSummerSolstice(2020);
            expect(jd).toBeGreaterThan(2451545);
        });
    });

    describe('calculateAutumnalEquinox', () => {
        test('should calculate equinox date', () => {
            const jd = calculateAutumnalEquinox(2020);
            expect(jd).toBeGreaterThan(2451545);
        });
    });

    describe('calculateWinterSolstice', () => {
        test('should calculate solstice date', () => {
            const jd = calculateWinterSolstice(2020);
            expect(jd).toBeGreaterThan(2451545);
        });
    });

    test('should have proper seasonal order', () => {
        const year = 2020;
        const vernal = calculateVernalEquinox(year);
        const summer = calculateSummerSolstice(year);
        const autumn = calculateAutumnalEquinox(year);
        const winter = calculateWinterSolstice(year);

        expect(vernal).toBeLessThan(summer);
        expect(summer).toBeLessThan(autumn);
        expect(autumn).toBeLessThan(winter);
    });
});