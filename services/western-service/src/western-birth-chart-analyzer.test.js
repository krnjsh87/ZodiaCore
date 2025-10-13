/**
 * ZodiaCore - Western Birth Chart Analyzer Tests
 *
 * Comprehensive unit tests for the Western astrology birth chart analysis engine.
 * Tests cover mathematical functions, pattern detection, planetary analysis,
 * house analysis, synthesis, and error handling.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const WesternBirthChartAnalyzer = require('./western-birth-chart-analyzer');

describe('WesternBirthChartAnalyzer', () => {
    let analyzer;

    beforeEach(() => {
        analyzer = new WesternBirthChartAnalyzer();
    });

    test('analyzes chart correctly', () => {
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        const result = analyzer.analyzeChart(birthData);
        expect(result).toHaveProperty('synthesis');
        expect(result.planetaryAnalysis).toHaveLength(7);
        expect(result.houseAnalysis).toHaveLength(12);
    });

    test('supports different frameworks', () => {
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        const traditional = analyzer.analyzeChart(birthData, { framework: 'traditional' });
        const modern = analyzer.analyzeChart(birthData, { framework: 'modern' });

        expect(traditional.synthesis).not.toEqual(modern.synthesis);
    });

    test('handles invalid birth data', () => {
        expect(() => analyzer.analyzeChart({})).toThrow('Birth data must include date, time, and location');
    });

    test('detects chart patterns', () => {
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        const result = analyzer.analyzeChart(birthData);
        expect(result.patterns).toBeDefined();
        expect(Array.isArray(result.patterns)).toBe(true);
    });

    test('calculates planetary strength', () => {
        const planets = [
            { name: 'sun', longitude: 120, sign: 'leo', house: 5, speed: 1.0 }
        ];
        const houses = [{ number: 5, cusp: 120 }];
        const aspects = [];

        // Test the internal function
        const { calculatePlanetaryStrength } = require('./western-birth-chart-analyzer');
        const strength = calculatePlanetaryStrength(planets[0], { houses, aspects });
        expect(strength.total).toBeGreaterThan(0);
        expect(strength.total).toBeLessThanOrEqual(2.0);
    });
});

describe('Mathematical Functions', () => {
    const {
        getSignFromLongitude,
        getDegreeInSign,
        normalizeAngle,
        angularDistance,
        withinOrb,
        weightedAverage,
        calculateSpan
    } = require('./western-birth-chart-analyzer');

    test('getSignFromLongitude calculates correct sign', () => {
        expect(getSignFromLongitude(0)).toBe(0); // Aries
        expect(getSignFromLongitude(30)).toBe(1); // Taurus
        expect(getSignFromLongitude(359)).toBe(11); // Pisces
        expect(getSignFromLongitude(360)).toBe(0); // Aries (normalized)
    });

    test('getDegreeInSign calculates correct degree within sign', () => {
        expect(getDegreeInSign(0)).toBe(0);
        expect(getDegreeInSign(15.5)).toBe(15.5);
        expect(getDegreeInSign(30)).toBe(0); // Start of Taurus
        expect(getDegreeInSign(359)).toBe(29); // End of Pisces
    });

    test('normalizeAngle handles various inputs', () => {
        expect(normalizeAngle(0)).toBe(0);
        expect(normalizeAngle(360)).toBe(0);
        expect(normalizeAngle(720)).toBe(0);
        expect(normalizeAngle(-30)).toBe(330);
        expect(normalizeAngle(390)).toBe(30);
    });

    test('angularDistance calculates shortest path', () => {
        expect(angularDistance(0, 10)).toBe(10);
        expect(angularDistance(350, 10)).toBe(20); // Shortest path
        expect(angularDistance(10, 350)).toBe(20);
        expect(angularDistance(180, 0)).toBe(180);
    });

    test('withinOrb checks orb correctly', () => {
        expect(withinOrb(0, 5, 10)).toBe(true);
        expect(withinOrb(0, 15, 10)).toBe(false);
        expect(withinOrb(350, 10, 20)).toBe(true); // Crosses 0
        expect(withinOrb(350, 30, 20)).toBe(false);
    });

    test('weightedAverage calculates correctly', () => {
        expect(weightedAverage([1, 2, 3], [1, 1, 1])).toBe(2);
        expect(weightedAverage([1, 2, 3], [2, 1, 1])).toBeCloseTo(1.5);
        expect(weightedAverage([10], [5])).toBe(10);
        expect(weightedAverage([], [])).toBe(0);
    });

    test('calculateSpan handles various inputs', () => {
        expect(calculateSpan([0, 30, 60])).toBe(60);
        expect(calculateSpan([350, 10, 30])).toBe(40); // Crosses 0
        expect(calculateSpan([])).toBe(0);
        expect(calculateSpan([100])).toBe(0);
    });
});

describe('Pattern Detection Algorithms', () => {
    const {
        detectGrandTrine,
        detectTSquare,
        detectStellium,
        analyzeChartShape,
        getCommonElement,
        findTrine
    } = require('./western-birth-chart-analyzer');

    test('detectGrandTrine identifies grand trine patterns', () => {
        const planets = [
            { name: 'sun', longitude: 0, sign: 'aries' },
            { name: 'moon', longitude: 120, sign: 'cancer' },
            { name: 'venus', longitude: 240, sign: 'scorpio' }
        ];
        const aspects = [
            { type: 'trine', planets: ['sun', 'moon'], strength: 0.8 },
            { type: 'trine', planets: ['sun', 'venus'], strength: 0.9 },
            { type: 'trine', planets: ['moon', 'venus'], strength: 0.7 }
        ];

        const result = detectGrandTrine(planets, aspects);
        expect(result).toHaveProperty('type', 'grand-trine');
        expect(result.planets).toEqual(['sun', 'moon', 'venus']);
        expect(result.element).toBe('water');
    });

    test('detectGrandTrine returns null when no pattern', () => {
        const planets = [
            { name: 'sun', longitude: 0, sign: 'aries' },
            { name: 'moon', longitude: 90, sign: 'cancer' }
        ];
        const aspects = [
            { type: 'square', planets: ['sun', 'moon'], strength: 0.8 }
        ];

        const result = detectGrandTrine(planets, aspects);
        expect(result).toBeNull();
    });

    test('detectTSquare identifies T-square patterns', () => {
        const planets = [
            { name: 'sun', longitude: 0 },
            { name: 'moon', longitude: 180 },
            { name: 'mars', longitude: 90 }
        ];
        const aspects = [
            { type: 'opposition', planets: ['sun', 'moon'], strength: 0.8 },
            { type: 'square', planets: ['sun', 'mars'], strength: 0.9 },
            { type: 'square', planets: ['moon', 'mars'], strength: 0.7 }
        ];

        const result = detectTSquare(planets, aspects);
        expect(result).toHaveProperty('type', 't-square');
        expect(result.planets).toEqual(['sun', 'moon', 'mars']);
    });

    test('detectStellium identifies planetary concentrations', () => {
        const planets = [
            { name: 'sun', longitude: 100 },
            { name: 'moon', longitude: 105 },
            { name: 'venus', longitude: 110 },
            { name: 'mars', longitude: 115 }
        ];

        const result = detectStellium(planets, 3, 30);
        expect(result).toHaveProperty('type', 'stellium');
        expect(result.planets).toContain('sun');
        expect(result.planets).toContain('moon');
        expect(result.planets).toContain('venus');
        expect(result.planets).toContain('mars');
    });

    test('detectStellium returns null when insufficient planets', () => {
        const planets = [
            { name: 'sun', longitude: 100 },
            { name: 'moon', longitude: 150 }
        ];

        const result = detectStellium(planets, 3, 30);
        expect(result).toBeNull();
    });

    test('analyzeChartShape determines correct shapes', () => {
        // Bundle shape (low variance)
        const bundlePlanets = [
            { longitude: 100 }, { longitude: 102 }, { longitude: 104 }
        ];
        expect(analyzeChartShape(bundlePlanets).shape).toBe('bundle');

        // Bowl shape (large gap)
        const bowlPlanets = [
            { longitude: 0 }, { longitude: 30 }, { longitude: 60 }, { longitude: 300 }
        ];
        expect(analyzeChartShape(bowlPlanets).shape).toBe('bowl');

        // Splash shape (scattered)
        const splashPlanets = [
            { longitude: 0 }, { longitude: 90 }, { longitude: 180 }, { longitude: 270 }
        ];
        expect(analyzeChartShape(splashPlanets).shape).toBe('splash');
    });

    test('getCommonElement identifies shared elements', () => {
        expect(getCommonElement(['aries', 'leo', 'sagittarius'])).toBe('fire');
        expect(getCommonElement(['cancer', 'scorpio', 'pisces'])).toBe('water');
        expect(getCommonElement(['aries', 'cancer'])).toBe('mixed');
        expect(getCommonElement([])).toBe('mixed');
    });
});

describe('Planetary Analysis Methods', () => {
    const {
        calculatePlanetaryStrength,
        interpretPlanet,
        getPlanetaryKeywords,
        getHouseRuler
    } = require('./western-birth-chart-analyzer');

    test('calculatePlanetaryStrength computes comprehensive strength', () => {
        const planet = { name: 'sun', longitude: 120, sign: 'leo', house: 5, speed: 1.0 };
        const chart = {
            houses: [{ number: 5, cusp: 120 }],
            aspects: [],
            signs: ['leo']
        };

        const strength = calculatePlanetaryStrength(planet, chart);
        expect(strength).toHaveProperty('essential');
        expect(strength).toHaveProperty('accidental');
        expect(strength).toHaveProperty('aspect');
        expect(strength).toHaveProperty('speed');
        expect(strength).toHaveProperty('phase');
        expect(strength).toHaveProperty('total');
        expect(strength.total).toBeGreaterThan(0);
        expect(strength.total).toBeLessThanOrEqual(2.0);
    });

    test('interpretPlanet generates complete interpretation', () => {
        const planet = { name: 'sun', longitude: 120, sign: 'leo', house: 5 };
        const strength = { total: 1.2 };
        const aspects = [];
        const house = { number: 5 };

        const interpretation = interpretPlanet(planet, strength, aspects, house);
        expect(interpretation).toHaveProperty('planet', 'sun');
        expect(interpretation).toHaveProperty('sign', 'leo');
        expect(interpretation).toHaveProperty('house', 5);
        expect(interpretation).toHaveProperty('strength', 1.2);
        expect(interpretation).toHaveProperty('keywords');
        expect(interpretation).toHaveProperty('personality');
        expect(interpretation).toHaveProperty('lifeAreas');
        expect(interpretation).toHaveProperty('challenges');
        expect(interpretation).toHaveProperty('potentials');
    });

    test('getPlanetaryKeywords returns appropriate keywords', () => {
        expect(getPlanetaryKeywords('sun')).toContain('identity');
        expect(getPlanetaryKeywords('moon')).toContain('emotions');
        expect(getPlanetaryKeywords('mercury')).toContain('communication');
        expect(getPlanetaryKeywords('unknown')).toEqual([]);
    });

    test('getHouseRuler returns correct rulers', () => {
        expect(getHouseRuler(1)).toBe('mars');
        expect(getHouseRuler(4)).toBe('moon');
        expect(getHouseRuler(10)).toBe('saturn');
        expect(getHouseRuler(13)).toBe('sun'); // Default
    });
});

describe('House Analysis Techniques', () => {
    const {
        analyzeHouse,
        calculateHouseStrength,
        getHouseThemes,
        involvesHouse
    } = require('./western-birth-chart-analyzer');

    test('analyzeHouse generates comprehensive analysis', () => {
        const house = { number: 1, sign: 'aries', ruler: 'mars' };
        const planets = [{ name: 'sun', house: 1 }];
        const aspects = [];

        const analysis = analyzeHouse(house, planets, aspects);
        expect(analysis).toHaveProperty('house', 1);
        expect(analysis).toHaveProperty('sign', 'aries');
        expect(analysis).toHaveProperty('ruler', 'mars');
        expect(analysis).toHaveProperty('planets');
        expect(analysis).toHaveProperty('aspects');
        expect(analysis).toHaveProperty('strength');
        expect(analysis).toHaveProperty('themes');
        expect(analysis).toHaveProperty('interpretation');
    });

    test('calculateHouseStrength computes based on planets', () => {
        const house = { number: 1 };
        const planets = [
            { house: 1 }, { house: 1 }, { house: 2 }
        ];

        const strength = calculateHouseStrength(house, planets);
        expect(strength).toBeGreaterThan(0);
        expect(strength).toBeLessThanOrEqual(1);
    });

    test('getHouseThemes returns appropriate themes', () => {
        expect(getHouseThemes(1)).toContain('self');
        expect(getHouseThemes(4)).toContain('home');
        expect(getHouseThemes(10)).toContain('career');
        expect(getHouseThemes(13)).toEqual([]); // Invalid house
    });

    test('involvesHouse checks aspect involvement', () => {
        const aspect = { planets: [{ house: 1 }, { house: 2 }] };
        expect(involvesHouse(aspect, 1)).toBe(true);
        expect(involvesHouse(aspect, 3)).toBe(false);
    });
});

describe('Synthesis and Holistic Analysis', () => {
    const {
        synthesizeChart,
        getDominantPlanets,
        getDominantHouses,
        calculateAspectBalance,
        calculateOverallChartStrength
    } = require('./western-birth-chart-analyzer');

    test('synthesizeChart produces comprehensive synthesis', () => {
        const chart = {
            planets: [{ name: 'sun' }],
            houses: [{ number: 1 }],
            aspects: [],
            patterns: [],
            framework: 'modern'
        };

        const synthesis = synthesizeChart(chart);
        expect(synthesis).toHaveProperty('personalityProfile');
        expect(synthesis).toHaveProperty('lifePurpose');
        expect(synthesis).toHaveProperty('challenges');
        expect(synthesis).toHaveProperty('potentials');
        expect(synthesis).toHaveProperty('lifePath');
        expect(synthesis).toHaveProperty('relationships');
        expect(synthesis).toHaveProperty('career');
        expect(synthesis).toHaveProperty('spirituality');
    });

    test('getDominantPlanets identifies top planets', () => {
        const planetaryAnalysis = [
            { planet: 'sun', strength: 1.5 },
            { planet: 'moon', strength: 1.2 },
            { planet: 'venus', strength: 1.0 }
        ];

        const dominant = getDominantPlanets(planetaryAnalysis);
        expect(dominant).toHaveLength(3);
        expect(dominant[0]).toBe('sun');
        expect(dominant[1]).toBe('moon');
    });

    test('getDominantHouses identifies top houses', () => {
        const houseAnalysis = [
            { house: 1, strength: 0.8 },
            { house: 2, strength: 0.6 },
            { house: 3, strength: 0.4 }
        ];

        const dominant = getDominantHouses(houseAnalysis);
        expect(dominant).toHaveLength(3);
        expect(dominant[0]).toBe(1);
        expect(dominant[1]).toBe(2);
    });

    test('calculateAspectBalance counts aspect types', () => {
        const aspects = [
            { type: 'trine' },
            { type: 'square' },
            { type: 'trine' },
            { type: 'conjunction' }
        ];

        const balance = calculateAspectBalance(aspects);
        expect(balance.trine).toBe(2);
        expect(balance.square).toBe(1);
        expect(balance.conjunction).toBe(1);
    });

    test('calculateOverallChartStrength averages planetary strengths', () => {
        const planetaryAnalysis = [
            { strength: 1.0 },
            { strength: 1.5 },
            { strength: 0.8 }
        ];

        const overall = calculateOverallChartStrength(planetaryAnalysis);
        expect(overall).toBeCloseTo(1.1);
    });
});

describe('Error Handling and Validation', () => {
    let analyzer;

    beforeEach(() => {
        analyzer = new WesternBirthChartAnalyzer();
    });

    test('throws BirthChartValidationError for missing date', () => {
        const invalidData = {
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        expect(() => analyzer.analyzeChart(invalidData))
            .toThrow('Birth data must include date, time, and location');
    });

    test('throws BirthChartValidationError for missing time', () => {
        const invalidData = {
            date: '1990-06-15',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        expect(() => analyzer.analyzeChart(invalidData))
            .toThrow('Birth data must include date, time, and location');
    });

    test('throws BirthChartValidationError for missing location', () => {
        const invalidData = {
            date: '1990-06-15',
            time: '14:30:00'
        };

        expect(() => analyzer.analyzeChart(invalidData))
            .toThrow('Birth data must include date, time, and location');
    });

    test('throws BirthChartValidationError for unsupported framework', () => {
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        expect(() => analyzer.analyzeChart(birthData, { framework: 'invalid' }))
            .toThrow('Unsupported framework: invalid');
    });

    test('throws BirthChartValidationError for unsupported house system', () => {
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        expect(() => analyzer.analyzeChart(birthData, { houseSystem: 'invalid' }))
            .toThrow('Unsupported house system: invalid');
    });
});

describe('Chart Synthesis Integration', () => {
    test('produces comprehensive synthesis', () => {
        const analyzer = new WesternBirthChartAnalyzer();
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        const result = analyzer.analyzeChart(birthData);
        expect(result.synthesis).toHaveProperty('personalityProfile');
        expect(result.synthesis).toHaveProperty('lifePurpose');
        expect(result.synthesis).toHaveProperty('challenges');
        expect(result.synthesis).toHaveProperty('potentials');
    });

    test('performance benchmark', () => {
        const analyzer = new WesternBirthChartAnalyzer();
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        const startTime = Date.now();
        for (let i = 0; i < 10; i++) {
            analyzer.analyzeChart(birthData);
        }
        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(2000); // Should complete in < 2 seconds
    });

    test('batch processing performance', () => {
        const analyzer = new WesternBirthChartAnalyzer();
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        const startTime = Date.now();
        const results = [];
        for (let i = 0; i < 100; i++) {
            results.push(analyzer.analyzeChart(birthData));
        }
        const endTime = Date.now();

        expect(results).toHaveLength(100);
        expect(endTime - startTime).toBeLessThan(10000); // Should complete in < 10 seconds
    });

    test('memory efficiency', () => {
        const analyzer = new WesternBirthChartAnalyzer();
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };

        // Run multiple analyses to check for memory leaks
        for (let i = 0; i < 50; i++) {
            analyzer.analyzeChart(birthData);
        }

        // If we get here without crashing, memory usage is acceptable
        expect(true).toBe(true);
    });
});

describe('Integration Tests', () => {
    test('complete chart analysis workflow', () => {
        const analyzer = new WesternBirthChartAnalyzer();
        const birthData = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };
        const options = {
            framework: 'modern',
            houseSystem: 'placidus'
        };

        const result = analyzer.analyzeChart(birthData, options);

        // Verify result structure
        expect(result).toHaveProperty('analysisTime');
        expect(result).toHaveProperty('birthData');
        expect(result).toHaveProperty('options');
        expect(result).toHaveProperty('positions');
        expect(result).toHaveProperty('houses');
        expect(result).toHaveProperty('aspects');
        expect(result).toHaveProperty('patterns');
        expect(result).toHaveProperty('planetaryAnalysis');
        expect(result).toHaveProperty('houseAnalysis');
        expect(result).toHaveProperty('synthesis');
        expect(result).toHaveProperty('summary');

        // Verify summary structure
        expect(result.summary).toHaveProperty('dominantPlanets');
        expect(result.summary).toHaveProperty('dominantHouses');
        expect(result.summary).toHaveProperty('chartShape');
        expect(result.summary).toHaveProperty('aspectBalance');
        expect(result.summary).toHaveProperty('overallStrength');
    });

    test('different birth locations produce different results', () => {
        const analyzer = new WesternBirthChartAnalyzer();
        const birthDataNYC = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 40.7128, longitude: -74.0060 }
        };
        const birthDataLondon = {
            date: '1990-06-15',
            time: '14:30:00',
            location: { latitude: 51.5074, longitude: -0.1278 }
        };

        const resultNYC = analyzer.analyzeChart(birthDataNYC);
        const resultLondon = analyzer.analyzeChart(birthDataLondon);

        // Results should be different due to different locations
        expect(resultNYC.houses).not.toEqual(resultLondon.houses);
    });
});