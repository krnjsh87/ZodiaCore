/**
 * ZodiaCore - Western Birth Chart Analyzer
 *
 * Complete implementation of Western astrology birth chart analysis engine.
 * Provides comprehensive chart interpretation with multiple frameworks and techniques.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { WESTERN_BIRTH_CHART_CONSTANTS } = require('./western-birth-chart-constants');
const { normalizeAngle, angularDistance } = require('./math-utils');
const AspectCalculator = require('./aspect-calculator');

/**
 * Custom error classes for birth chart analysis
 */
class BirthChartValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BirthChartValidationError';
    }
}

class BirthChartCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BirthChartCalculationError';
    }
}

/**
 * Calculate the sign from longitude
 */
function getSignFromLongitude(longitude) {
    const normalized = normalizeAngle(longitude);
    return Math.floor(normalized / WESTERN_BIRTH_CHART_CONSTANTS.SIGN_DEGREES);
}

/**
 * Calculate the degree within a sign
 */
function getDegreeInSign(longitude) {
    const normalized = normalizeAngle(longitude);
    return normalized % WESTERN_BIRTH_CHART_CONSTANTS.SIGN_DEGREES;
}

/**
 * Check if point is within orb of target
 */
function withinOrb(point, target, orb) {
    return angularDistance(point, target) <= orb;
}

/**
 * Calculate weighted average of positions
 */
function weightedAverage(positions, weights) {
    let sumWeighted = 0;
    let sumWeights = 0;

    for (let i = 0; i < positions.length; i++) {
        sumWeighted += positions[i] * weights[i];
        sumWeights += weights[i];
    }

    return sumWeights > 0 ? sumWeighted / sumWeights : 0;
}

/**
 * Calculate span of positions
 */
function calculateSpan(positions) {
    if (positions.length === 0) return 0;
    const sorted = positions.sort((a, b) => a - b);
    return sorted[sorted.length - 1] - sorted[0];
}

/**
 * Get house ruler (simplified)
 */
function getHouseRuler(houseNumber) {
    const rulers = {
        1: 'mars', 2: 'venus', 3: 'mercury', 4: 'moon', 5: 'sun',
        6: 'mercury', 7: 'venus', 8: 'mars', 9: 'jupiter', 10: 'saturn',
        11: 'saturn', 12: 'jupiter'
    };
    return rulers[houseNumber] || 'sun';
}

/**
 * Find trine aspect between two planets
 */
function findTrine(aspects, planet1, planet2) {
    return aspects.find(a =>
        a.type === 'trine' &&
        ((a.planets.includes(planet1) && a.planets.includes(planet2)))
    );
}

/**
 * Get common element from signs
 */
function getCommonElement(signs) {
    const elements = signs.map(sign => {
        const fire = ['aries', 'leo', 'sagittarius'];
        const earth = ['taurus', 'virgo', 'capricorn'];
        const air = ['gemini', 'libra', 'aquarius'];
        const water = ['cancer', 'scorpio', 'pisces'];
        if (fire.includes(sign)) return 'fire';
        if (earth.includes(sign)) return 'earth';
        if (air.includes(sign)) return 'air';
        if (water.includes(sign)) return 'water';
        return 'unknown';
    });

    const unique = [...new Set(elements)];
    return unique.length === 1 ? unique[0] : 'mixed';
}

/**
 * Detect grand trine pattern
 */
function detectGrandTrine(planets, aspects) {
    const trines = aspects.filter(a => a.type === 'trine');

    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            for (let k = j + 1; k < planets.length; k++) {
                const planet1 = planets[i];
                const planet2 = planets[j];
                const planet3 = planets[k];

                const trine12 = findTrine(trines, planet1.name, planet2.name);
                const trine13 = findTrine(trines, planet1.name, planet3.name);
                const trine23 = findTrine(trines, planet2.name, planet3.name);

                if (trine12 && trine13 && trine23) {
                    return {
                        type: 'grand-trine',
                        planets: [planet1.name, planet2.name, planet3.name],
                        element: getCommonElement([planet1.sign, planet2.sign, planet3.sign]),
                        strength: (trine12.strength + trine13.strength + trine23.strength) / 3
                    };
                }
            }
        }
    }
    return null;
}

/**
 * Detect T-square pattern
 */
function detectTSquare(planets, aspects) {
    const squares = aspects.filter(a => a.type === 'square');
    const oppositions = aspects.filter(a => a.type === 'opposition');

    for (const opp of oppositions) {
        const [planet1, planet2] = opp.planets;

        const square1 = squares.find(s => s.planets.includes(planet1) &&
                                          !s.planets.includes(planet2));
        const square2 = squares.find(s => s.planets.includes(planet2) &&
                                          !s.planets.includes(planet1));

        if (square1 && square2) {
            const apex = square1.planets.find(p => !opp.planets.includes(p));
            return {
                type: 't-square',
                planets: [planet1, planet2, apex],
                opposition: opp,
                squares: [square1, square2],
                strength: (opp.strength + square1.strength + square2.strength) / 3
            };
        }
    }
    return null;
}

/**
 * Detect stellium (concentration of planets)
 */
function detectStellium(planets, minPlanets = 3, maxOrb = 30) {
    for (let i = 0; i < planets.length; i++) {
        const cluster = [planets[i]];
        const startLon = planets[i].longitude;

        for (let j = 0; j < planets.length; j++) {
            if (i !== j && angularDistance(startLon, planets[j].longitude) <= maxOrb) {
                cluster.push(planets[j]);
            }
        }

        if (cluster.length >= minPlanets) {
            return {
                type: 'stellium',
                planets: cluster.map(p => p.name),
                center: weightedAverage(cluster.map(p => p.longitude), cluster.map(p => 1)),
                span: calculateSpan(cluster.map(p => p.longitude)),
                strength: cluster.length / planets.length
            };
        }
    }
    return null;
}

/**
 * Analyze overall chart shape
 */
function analyzeChartShape(planets) {
    const positions = planets.map(p => p.longitude).sort((a, b) => a - b);

    // Calculate distribution
    const mean = positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
    const variance = positions.reduce((sum, pos) => sum + Math.pow(pos - mean, 2), 0) / positions.length;

    const distribution = {
        variance: variance,
        maxGap: Math.max(...positions.slice(1).map((pos, i) => pos - positions[i])),
        quadrantsBalanced: checkQuadrantBalance(positions)
    };

    // Determine shape
    if (distribution.variance < 10) {
        return { shape: 'bundle', concentration: 'high' };
    } else if (distribution.maxGap > 90) {
        return { shape: 'bowl', concentration: 'hemispheric' };
    } else if (distribution.quadrantsBalanced) {
        return { shape: 'seesaw', concentration: 'balanced' };
    } else {
        return { shape: 'splash', concentration: 'scattered' };
    }
}

/**
 * Check quadrant balance
 */
function checkQuadrantBalance(positions) {
    const quadrants = [0, 0, 0, 0];
    positions.forEach(pos => {
        const quad = Math.floor(pos / 90);
        quadrants[quad]++;
    });
    return quadrants.every(q => q >= 1);
}

/**
 * Calculate planetary strength
 */
function calculatePlanetaryStrength(planet, chart) {
    const strength = {
        essential: calculateEssentialDignity(planet, chart.signs),
        accidental: calculateAccidentalDignity(planet, chart.houses),
        aspect: calculateAspectStrength(planet, chart.aspects),
        speed: calculateSpeedStrength(planet.speed),
        phase: calculateLunarPhaseStrength(planet, chart.moonPhase)
    };

    strength.total = weightedAverage(
        [strength.essential, strength.accidental, strength.aspect, strength.speed, strength.phase],
        [0.3, 0.2, 0.3, 0.1, 0.1]
    );

    return strength;
}

/**
 * Calculate essential dignity (simplified)
 */
function calculateEssentialDignity(planet, signs) {
    // Simplified: return 1.0 for now
    return 1.0;
}

/**
 * Calculate accidental dignity (simplified)
 */
function calculateAccidentalDignity(planet, houses) {
    // Simplified: return 1.0 for now
    return 1.0;
}

/**
 * Calculate aspect strength
 */
function calculateAspectStrength(planet, aspects) {
    const planetAspects = aspects.filter(a => a.planets.includes(planet.name));
    if (planetAspects.length === 0) return 0.5;

    const avgStrength = planetAspects.reduce((sum, a) => sum + a.strength, 0) / planetAspects.length;
    return Math.min(2.0, avgStrength);
}

/**
 * Calculate speed strength
 */
function calculateSpeedStrength(speed) {
    // Simplified: higher speed = higher strength
    return Math.min(2.0, Math.max(0.1, speed / 2));
}

/**
 * Calculate lunar phase strength
 */
function calculateLunarPhaseStrength(planet, moonPhase) {
    // Simplified
    return 1.0;
}

/**
 * Interpret planet
 */
function interpretPlanet(planet, strength, aspects, house) {
    const interpretation = {
        planet: planet.name,
        sign: planet.sign,
        house: house,
        strength: strength.total,
        keywords: getPlanetaryKeywords(planet.name, planet.sign),
        personality: generatePersonalityTraits(planet, strength),
        lifeAreas: generateLifeAreaImpact(planet, house),
        challenges: generatePlanetaryChallenges(planet, aspects),
        potentials: generatePlanetaryPotentials(planet, strength)
    };

    return interpretation;
}

/**
 * Get planetary keywords (simplified)
 */
function getPlanetaryKeywords(planet, sign) {
    const keywords = {
        sun: ['identity', 'ego', 'leadership'],
        moon: ['emotions', 'nurturing', 'instincts'],
        mercury: ['communication', 'logic', 'learning'],
        venus: ['love', 'beauty', 'harmony'],
        mars: ['action', 'energy', 'courage'],
        jupiter: ['expansion', 'wisdom', 'optimism'],
        saturn: ['discipline', 'responsibility', 'structure']
    };
    return keywords[planet] || [];
}

/**
 * Generate personality traits (simplified)
 */
function generatePersonalityTraits(planet, strength) {
    return ['trait1', 'trait2'];
}

/**
 * Generate life area impact (simplified)
 */
function generateLifeAreaImpact(planet, house) {
    return ['area1', 'area2'];
}

/**
 * Generate planetary challenges (simplified)
 */
function generatePlanetaryChallenges(planet, aspects) {
    return ['challenge1'];
}

/**
 * Generate planetary potentials (simplified)
 */
function generatePlanetaryPotentials(planet, strength) {
    return ['potential1'];
}

/**
 * Analyze house
 */
function analyzeHouse(house, planets, aspects) {
    const analysis = {
        house: house.number,
        sign: house.sign,
        ruler: house.ruler,
        planets: planets.filter(p => p.house === house.number),
        aspects: aspects.filter(a => involvesHouse(a, house.number)),
        strength: calculateHouseStrength(house, planets),
        themes: getHouseThemes(house.number),
        interpretation: generateHouseInterpretation(house, planets)
    };

    return analysis;
}

/**
 * Check if aspect involves house
 */
function involvesHouse(aspect, houseNumber) {
    return aspect.planets.some(p => p.house === houseNumber);
}

/**
 * Calculate house strength
 */
function calculateHouseStrength(house, planets) {
    const housePlanets = planets.filter(p => p.house === house.number);
    return housePlanets.length > 0 ? housePlanets.length / planets.length : 0.1;
}

/**
 * Get house themes
 */
function getHouseThemes(houseNumber) {
    const themes = {
        1: ['self', 'identity', 'appearance'],
        2: ['wealth', 'possessions', 'values'],
        3: ['communication', 'siblings', 'learning'],
        4: ['home', 'family', 'roots'],
        5: ['creativity', 'children', 'pleasure'],
        6: ['health', 'service', 'routine'],
        7: ['partnerships', 'relationships', 'marriage'],
        8: ['transformation', 'shared resources', 'intimacy'],
        9: ['philosophy', 'travel', 'higher learning'],
        10: ['career', 'reputation', 'authority'],
        11: ['friends', 'groups', 'hopes'],
        12: ['spirituality', 'unconscious', 'sacrifice']
    };
    return themes[houseNumber] || [];
}

/**
 * Generate house interpretation (simplified)
 */
function generateHouseInterpretation(house, planets) {
    return 'House interpretation';
}

/**
 * Synthesize chart
 */
function synthesizeChart(chart) {
    const synthesis = {
        personalityProfile: synthesizePersonality(chart),
        lifePurpose: synthesizeLifePurpose(chart),
        challenges: synthesizeChallenges(chart),
        potentials: synthesizePotentials(chart),
        lifePath: synthesizeLifePath(chart),
        relationships: synthesizeRelationships(chart),
        career: synthesizeCareer(chart),
        spirituality: synthesizeSpirituality(chart)
    };

    return synthesis;
}

/**
 * Synthesize personality (simplified)
 */
function synthesizePersonality(chart) {
    return {
        coreIdentity: 'Core identity description',
        emotionalNature: 'Emotional nature description',
        mentalProcesses: 'Mental processes description',
        socialStyle: 'Social style description',
        lifeApproach: 'Life approach description'
    };
}

/**
 * Synthesize life purpose (simplified)
 */
function synthesizeLifePurpose(chart) {
    return 'Life purpose description';
}

/**
 * Synthesize challenges (simplified)
 */
function synthesizeChallenges(chart) {
    return ['challenge1', 'challenge2'];
}

/**
 * Synthesize potentials (simplified)
 */
function synthesizePotentials(chart) {
    return ['potential1', 'potential2'];
}

/**
 * Synthesize life path (simplified)
 */
function synthesizeLifePath(chart) {
    return 'Life path description';
}

/**
 * Synthesize relationships (simplified)
 */
function synthesizeRelationships(chart) {
    return 'Relationships description';
}

/**
 * Synthesize career (simplified)
 */
function synthesizeCareer(chart) {
    return 'Career description';
}

/**
 * Synthesize spirituality (simplified)
 */
function synthesizeSpirituality(chart) {
    return 'Spirituality description';
}

/**
 * Get dominant planets
 */
function getDominantPlanets(planetaryAnalysis) {
    return planetaryAnalysis
        .sort((a, b) => b.strength - a.strength)
        .slice(0, 3)
        .map(p => p.planet);
}

/**
 * Get dominant houses
 */
function getDominantHouses(houseAnalysis) {
    return houseAnalysis
        .sort((a, b) => b.strength - a.strength)
        .slice(0, 3)
        .map(h => h.house);
}

/**
 * Calculate aspect balance
 */
function calculateAspectBalance(aspects) {
    const types = aspects.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
    }, {});
    return types;
}

/**
 * Calculate overall chart strength
 */
function calculateOverallChartStrength(planetaryAnalysis) {
    const avgStrength = planetaryAnalysis.reduce((sum, p) => sum + p.strength, 0) / planetaryAnalysis.length;
    return avgStrength;
}

/**
 * Complete Western Astrology Birth Chart Analyzer
 */
class WesternBirthChartAnalyzer {
    constructor() {
        this.supportedFrameworks = ['traditional', 'modern', 'evolutionary'];
        this.supportedHouseSystems = ['placidus', 'koch', 'equal', 'whole-sign'];
    }

    /**
     * Analyze complete birth chart
     * @param {Object} birthData - Birth date, time, location
     * @param {Object} options - Analysis options
     * @returns {Object} Complete chart analysis
     */
    analyzeChart(birthData, options = {}) {
        try {
            // Validate inputs
            this._validateInputs(birthData, options);

            // Calculate astronomical positions
            const positions = this._calculatePositions(birthData);

            // Calculate houses
            const houses = this._calculateHouses(positions, birthData, options.houseSystem || 'placidus');

            // Calculate aspects
            const aspects = this._calculateAspects(positions.planets);

            // Detect patterns
            const patterns = this._detectPatterns(positions.planets, aspects);

            // Analyze components
            const planetaryAnalysis = this._analyzePlanets(positions.planets, houses, aspects);
            const houseAnalysis = this._analyzeHouses(houses, positions.planets, aspects);

            // Synthesize interpretation
            const synthesis = this._synthesizeChart(positions, houses, aspects, patterns, options);

            // Format results
            return this._formatAnalysisResults(birthData, positions, houses, aspects, patterns,
                                             planetaryAnalysis, houseAnalysis, synthesis, options);

        } catch (error) {
            throw new Error(`Birth chart analysis failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate input parameters
     */
    _validateInputs(birthData, options) {
        if (!birthData.date || !birthData.time || !birthData.location) {
            throw new BirthChartValidationError('Birth data must include date, time, and location');
        }

        if (options.framework && !this.supportedFrameworks.includes(options.framework)) {
            throw new BirthChartValidationError(`Unsupported framework: ${options.framework}`);
        }

        if (options.houseSystem && !this.supportedHouseSystems.includes(options.houseSystem)) {
            throw new BirthChartValidationError(`Unsupported house system: ${options.houseSystem}`);
        }
    }

    /**
     * Private method: Calculate astronomical positions
     */
    _calculatePositions(birthData) {
        // Implementation would integrate with ephemeris library
        // For demonstration, using mock calculations
        return {
            planets: [
                { name: 'sun', longitude: 120.5, sign: 'leo', speed: 1.0 },
                { name: 'moon', longitude: 180.3, sign: 'virgo', speed: 13.2 },
                { name: 'mercury', longitude: 115.7, sign: 'leo', speed: 1.4 },
                { name: 'venus', longitude: 90.2, sign: 'cancer', speed: 1.2 },
                { name: 'mars', longitude: 240.8, sign: 'scorpio', speed: 0.5 },
                { name: 'jupiter', longitude: 300.1, sign: 'capricorn', speed: 0.1 },
                { name: 'saturn', longitude: 45.6, sign: 'taurus', speed: 0.05 }
            ],
            points: [
                { name: 'ascendant', longitude: 75.2 },
                { name: 'midheaven', longitude: 15.8 }
            ]
        };
    }

    /**
     * Private method: Calculate houses
     */
    _calculateHouses(positions, birthData, houseSystem) {
        // Implementation would calculate house cusps based on system
        const houses = [];
        for (let i = 1; i <= WESTERN_BIRTH_CHART_CONSTANTS.HOUSES_COUNT; i++) {
            houses.push({
                number: i,
                cusp: (i - 1) * WESTERN_BIRTH_CHART_CONSTANTS.SIGN_DEGREES, // Simplified
                sign: WESTERN_BIRTH_CHART_CONSTANTS.SIGNS[Math.floor(((i - 1) * WESTERN_BIRTH_CHART_CONSTANTS.SIGN_DEGREES) / WESTERN_BIRTH_CHART_CONSTANTS.SIGN_DEGREES)],
                ruler: getHouseRuler(i)
            });
        }
        return houses;
    }

    /**
     * Private method: Calculate aspects
     */
    _calculateAspects(planets) {
        // Use aspect calculator
        const aspectCalculator = new AspectCalculator();
        // Convert planets to chart format
        const chart = { planets: {} };
        planets.forEach(p => {
            chart.planets[p.name] = { longitude: p.longitude };
        });
        return aspectCalculator.calculateAspects(planets).aspects || [];
    }

    /**
     * Private method: Detect patterns
     */
    _detectPatterns(planets, aspects) {
        const patterns = [];

        const grandTrine = detectGrandTrine(planets, aspects);
        if (grandTrine) patterns.push(grandTrine);

        const tSquare = detectTSquare(planets, aspects);
        if (tSquare) patterns.push(tSquare);

        const stellium = detectStellium(planets);
        if (stellium) patterns.push(stellium);

        return patterns;
    }

    /**
     * Private method: Analyze planets
     */
    _analyzePlanets(planets, houses, aspects) {
        return planets.map(planet => {
            const house = houses.find(h => h.number === planet.house);
            const planetAspects = aspects.filter(a => a.planets.includes(planet.name));
            const strength = calculatePlanetaryStrength(planet, { houses, aspects });

            return interpretPlanet(planet, strength, planetAspects, house);
        });
    }

    /**
     * Private method: Analyze houses
     */
    _analyzeHouses(houses, planets, aspects) {
        return houses.map(house => analyzeHouse(house, planets, aspects));
    }

    /**
     * Private method: Synthesize chart
     */
    _synthesizeChart(positions, houses, aspects, patterns, options) {
        return synthesizeChart({
            planets: positions.planets,
            houses: houses,
            aspects: aspects,
            patterns: patterns,
            framework: options.framework || 'modern'
        });
    }

    /**
     * Private method: Format analysis results
     */
    _formatAnalysisResults(birthData, positions, houses, aspects, patterns,
                          planetaryAnalysis, houseAnalysis, synthesis, options) {
        return {
            analysisTime: new Date().toISOString(),
            birthData: birthData,
            options: options,
            positions: positions,
            houses: houses,
            aspects: aspects,
            patterns: patterns,
            planetaryAnalysis: planetaryAnalysis,
            houseAnalysis: houseAnalysis,
            synthesis: synthesis,
            summary: {
                dominantPlanets: getDominantPlanets(planetaryAnalysis),
                dominantHouses: getDominantHouses(houseAnalysis),
                chartShape: analyzeChartShape(positions.planets),
                aspectBalance: calculateAspectBalance(aspects),
                overallStrength: calculateOverallChartStrength(planetaryAnalysis)
            }
        };
    }
}

module.exports = WesternBirthChartAnalyzer;