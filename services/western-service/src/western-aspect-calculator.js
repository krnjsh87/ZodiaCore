/**
 * ZodiaCore - Western Aspect Calculator
 *
 * Core aspect calculation engine for Western astrology.
 * Calculates planetary aspects, orbs, strengths, and interpretations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Aspect Constants
const ASPECT_CONSTANTS = {
    // Aspect Angles (in degrees)
    CONJUNCTION: 0,
    SEMI_SEXTILE: 30,
    SEMI_SQUARE: 45,
    SEXTILE: 60,
    SQUARE: 90,
    TRINE: 120,
    SESQUI_SQUARE: 135,
    QUINCUNX: 150,
    OPPOSITION: 180,

    // Default Orbs (in degrees)
    MAJOR_ORB: 8.0,
    MINOR_ORB: 2.0,
    CONJUNCTION_ORB: 10.0,
    OPPOSITION_ORB: 10.0,

    // Aspect Types
    MAJOR_ASPECTS: ['conjunction', 'sextile', 'square', 'trine', 'opposition'],
    MINOR_ASPECTS: ['semi-sextile', 'semi-square', 'sesqui-square', 'quincunx'],

    // Planetary Constants
    PLANETS: ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
    LUMINARIES: ['sun', 'moon'],
    PERSONAL_PLANETS: ['sun', 'moon', 'mercury', 'venus', 'mars'],
    SOCIAL_PLANETS: ['jupiter', 'saturn'],
    TRANSPERSONAL_PLANETS: ['uranus', 'neptune', 'pluto'],

    // Mathematical Constants
    DEGREES_PER_CIRCLE: 360.0,
    MAX_ORB: 15.0,
    MIN_ORB: 0.5
};

const ASPECT_TYPES = {
    CONJUNCTION: 'conjunction',
    SEMI_SEXTILE: 'semi-sextile',
    SEMI_SQUARE: 'semi-square',
    SEXTILE: 'sextile',
    SQUARE: 'square',
    TRINE: 'trine',
    SESQUI_SQUARE: 'sesqui-square',
    QUINCUNX: 'quincunx',
    OPPOSITION: 'opposition'
};

/**
 * Calculate the angular distance between two longitudes (shortest path)
 */
function angularDistance(lon1, lon2) {
    let diff = Math.abs(lon1 - lon2);
    return Math.min(diff, 360 - diff);
}

/**
 * Calculate angular separation considering direction
 */
function angularSeparation(fromLon, toLon) {
    let diff = toLon - fromLon;
    while (diff < 0) diff += 360;
    while (diff >= 360) diff -= 360;
    return diff;
}

/**
 * Normalize angle to 0-360 degrees
 */
function normalizeAngle(angle) {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

/**
 * Check if two angles are within orb of each other
 */
function withinOrb(angle1, angle2, orb) {
    return angularDistance(angle1, angle2) <= orb;
}

/**
 * Calculate aspect strength based on orb
 */
function calculateAspectStrength(exactAngle, actualSeparation, maxOrb) {
    if (maxOrb <= 0) {
        throw new AspectCalculationError('Max orb must be greater than 0');
    }
    const orbUsed = angularDistance(exactAngle, actualSeparation);
    return Math.max(0, (maxOrb - orbUsed) / maxOrb);
}

/**
 * Determine if aspect is applying or separating
 * @param {number} planet1Speed - Speed of first planet (degrees/day)
 * @param {number} planet2Speed - Speed of second planet (degrees/day)
 * @param {number} separation - Angular separation between planets
 * @returns {boolean} True if aspect is applying
 */
function isApplying(planet1Speed, planet2Speed, separation) {
    // Calculate relative speed: positive means planet1 is overtaking planet2
    const relativeSpeed = planet1Speed - planet2Speed;

    // For applying aspects, the faster planet should be closing the gap
    // If separation < 180°, faster planet moving toward slower one applies
    // If separation > 180°, faster planet moving away from slower one applies
    if (separation <= 180) {
        return relativeSpeed > 0; // planet1 faster and catching up
    } else {
        return relativeSpeed < 0; // planet2 faster and catching up from behind
    }
}

/**
 * Check for conjunction aspect
 */
function checkConjunction(lon1, lon2, orb = ASPECT_CONSTANTS.CONJUNCTION_ORB) {
    const separation = angularDistance(lon1, lon2);
    if (separation <= orb) {
        return {
            type: ASPECT_TYPES.CONJUNCTION,
            angle: 0,
            separation: separation,
            strength: calculateAspectStrength(0, separation, orb),
            exact: separation === 0
        };
    }
    return null;
}

/**
 * Check for sextile aspect
 */
function checkSextile(lon1, lon2, orb = ASPECT_CONSTANTS.MAJOR_ORB) {
    const angles = [60, 300]; // 60° and 300° (360-60)
    for (const angle of angles) {
        const separation = angularDistance(lon1, lon2);
        const diff = angularDistance(angle, separation);
        if (diff <= orb) {
            return {
                type: ASPECT_TYPES.SEXTILE,
                angle: angle,
                separation: separation,
                strength: calculateAspectStrength(angle, separation, orb),
                exact: diff === 0
            };
        }
    }
    return null;
}

/**
 * Check for square aspect
 */
function checkSquare(lon1, lon2, orb = ASPECT_CONSTANTS.MAJOR_ORB) {
    const angles = [90, 270]; // 90° and 270°
    for (const angle of angles) {
        const separation = angularDistance(lon1, lon2);
        const diff = angularDistance(angle, separation);
        if (diff <= orb) {
            return {
                type: ASPECT_TYPES.SQUARE,
                angle: angle,
                separation: separation,
                strength: calculateAspectStrength(angle, separation, orb),
                exact: diff === 0
            };
        }
    }
    return null;
}

/**
 * Check for trine aspect
 */
function checkTrine(lon1, lon2, orb = ASPECT_CONSTANTS.MAJOR_ORB) {
    const angles = [120, 240]; // 120° and 240°
    for (const angle of angles) {
        const separation = angularDistance(lon1, lon2);
        const diff = angularDistance(angle, separation);
        if (diff <= orb) {
            return {
                type: ASPECT_TYPES.TRINE,
                angle: angle,
                separation: separation,
                strength: calculateAspectStrength(angle, separation, orb),
                exact: diff === 0
            };
        }
    }
    return null;
}

/**
 * Check for opposition aspect
 */
function checkOpposition(lon1, lon2, orb = ASPECT_CONSTANTS.OPPOSITION_ORB) {
    const separation = angularDistance(lon1, lon2);
    const diff = angularDistance(180, separation);
    if (diff <= orb) {
        return {
            type: ASPECT_TYPES.OPPOSITION,
            angle: 180,
            separation: separation,
            strength: calculateAspectStrength(180, separation, orb),
            exact: diff === 0
        };
    }
    return null;
}

/**
 * Create aspect checker factory for minor aspects
 */
function createMinorAspectChecker(targetAngle) {
    return (lon1, lon2, orb) => checkMinorAspect(lon1, lon2, targetAngle, orb);
}

/**
 * Find all aspects between two planets
 */
function findAspectsBetweenPlanets(planet1, planet2, customOrbs = {}) {
    const aspects = [];
    const lon1 = planet1.longitude;
    const lon2 = planet2.longitude;

    // Define aspect checkers with their angles and default orbs
    const aspectCheckers = [
        { type: ASPECT_TYPES.CONJUNCTION, checker: checkConjunction, orb: customOrbs.conjunction || ASPECT_CONSTANTS.CONJUNCTION_ORB },
        { type: ASPECT_TYPES.SEXTILE, checker: checkSextile, orb: customOrbs.sextile || ASPECT_CONSTANTS.MAJOR_ORB },
        { type: ASPECT_TYPES.SQUARE, checker: checkSquare, orb: customOrbs.square || ASPECT_CONSTANTS.MAJOR_ORB },
        { type: ASPECT_TYPES.TRINE, checker: checkTrine, orb: customOrbs.trine || ASPECT_CONSTANTS.MAJOR_ORB },
        { type: ASPECT_TYPES.OPPOSITION, checker: checkOpposition, orb: customOrbs.opposition || ASPECT_CONSTANTS.OPPOSITION_ORB },
        { type: ASPECT_TYPES.SEMI_SEXTILE, checker: createMinorAspectChecker(30), orb: customOrbs['semi-sextile'] || ASPECT_CONSTANTS.MINOR_ORB },
        { type: ASPECT_TYPES.SEMI_SQUARE, checker: createMinorAspectChecker(45), orb: customOrbs['semi-square'] || ASPECT_CONSTANTS.MINOR_ORB },
        { type: ASPECT_TYPES.SESQUI_SQUARE, checker: createMinorAspectChecker(135), orb: customOrbs['sesqui-square'] || ASPECT_CONSTANTS.MINOR_ORB },
        { type: ASPECT_TYPES.QUINCUNX, checker: createMinorAspectChecker(150), orb: customOrbs.quincunx || ASPECT_CONSTANTS.MINOR_ORB }
    ];

    for (const { type, checker, orb } of aspectCheckers) {
        const aspect = checker(lon1, lon2, orb);
        if (aspect) {
            aspects.push({
                ...aspect,
                planets: [planet1.name, planet2.name],
                applying: isApplying(planet1.speed, planet2.speed, aspect.separation)
            });
        }
    }

    return aspects;
}

/**
 * Check for minor aspect
 */
function checkMinorAspect(lon1, lon2, targetAngle, orb) {
    const separation = angularDistance(lon1, lon2);
    const diff = angularDistance(targetAngle, separation);
    if (diff <= orb) {
        return {
            type: getAspectTypeFromAngle(targetAngle),
            angle: targetAngle,
            separation: separation,
            strength: calculateAspectStrength(targetAngle, separation, orb),
            exact: diff === 0
        };
    }
    return null;
}

/**
 * Get aspect type from angle
 */
function getAspectTypeFromAngle(angle) {
    const normalized = normalizeAngle(angle);
    switch (normalized) {
        case 30: return ASPECT_TYPES.SEMI_SEXTILE;
        case 45: return ASPECT_TYPES.SEMI_SQUARE;
        case 135: return ASPECT_TYPES.SESQUI_SQUARE;
        case 150: return ASPECT_TYPES.QUINCUNX;
        default: return 'unknown';
    }
}

/**
 * Calculate all aspects in a chart
 */
function calculateAllAspects(planets, customOrbs = {}) {
    const aspects = [];

    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const planetAspects = findAspectsBetweenPlanets(planets[i], planets[j], customOrbs);
            aspects.push(...planetAspects);
        }
    }

    return aspects.sort((a, b) => b.strength - a.strength); // Sort by strength
}

/**
 * Calculate overall aspect strength considering multiple factors
 */
function calculateOverallAspectStrength(aspect, chartContext) {
    let strength = aspect.strength;

    // Orb factor (already included in aspect.strength)

    // Planetary dignity factor
    const dignityFactor = calculateDignityFactor(aspect.planets, chartContext);
    strength *= dignityFactor;

    // House placement factor
    const houseFactor = calculateHouseFactor(aspect.planets, chartContext);
    strength *= houseFactor;

    // Sign compatibility factor
    const signFactor = calculateSignCompatibility(aspect.planets, aspect.type);
    strength *= signFactor;

    // Apply aspect-specific modifiers
    const aspectModifier = getAspectStrengthModifier(aspect.type);
    strength *= aspectModifier;

    return Math.min(1.0, Math.max(0.0, strength));
}

/**
 * Get aspect-specific strength modifier
 */
function getAspectStrengthModifier(aspectType) {
    const modifiers = {
        conjunction: 1.2,  // Most powerful
        opposition: 1.1,   // Strong awareness
        trine: 1.0,        // Natural flow
        square: 0.9,       // Dynamic tension
        sextile: 0.8,      // Opportunity
        'semi-sextile': 0.6,
        'semi-square': 0.6,
        'sesqui-square': 0.7,
        quincunx: 0.7
    };
    return modifiers[aspectType] || 0.5;
}

/**
 * Calculate planetary dignity factor
 */
function calculateDignityFactor(planetNames, chartContext) {
    // Simplified dignity calculation
    let totalDignity = 0;
    for (const name of planetNames) {
        const planet = chartContext.planets.find(p => p.name === name);
        if (planet) {
            totalDignity += planet.dignity || 0.5; // 0-1 scale
        }
    }
    return totalDignity / planetNames.length;
}

/**
 * Calculate house placement factor
 */
function calculateHouseFactor(planetNames, chartContext) {
    // Simplified house factor
    let totalFactor = 0;
    for (const name of planetNames) {
        const planet = chartContext.planets.find(p => p.name === name);
        if (planet && planet.house) {
            // Angular houses (1,4,7,10) get higher factor
            const angularHouses = [1, 4, 7, 10];
            totalFactor += angularHouses.includes(planet.house) ? 1.2 : 0.8;
        } else {
            totalFactor += 1.0;
        }
    }
    return totalFactor / planetNames.length;
}

/**
 * Calculate sign compatibility factor
 */
function calculateSignCompatibility(planetNames, aspectType) {
    // Simplified compatibility based on aspect type
    const compatibilityFactors = {
        conjunction: 1.0, // Always compatible
        sextile: 0.9, // Compatible elements
        square: 0.7, // Challenging but compatible
        trine: 0.95, // Same element
        opposition: 0.8 // Polar opposites
    };
    return compatibilityFactors[aspectType] || 0.5;
}

/**
 * Generate aspect interpretation
 */
function interpretAspect(aspect, chartContext) {
    const interpretation = {
        aspect: aspect,
        summary: generateAspectSummary(aspect),
        personality: generatePersonalityImpact(aspect),
        lifeAreas: generateLifeAreaImpact(aspect),
        challenges: generateChallenges(aspect),
        strengths: generateStrengths(aspect),
        advice: generateAdvice(aspect, chartContext)
    };

    return interpretation;
}

/**
 * Generate aspect summary
 */
function generateAspectSummary(aspect) {
    const planet1 = aspect.planets[0];
    const planet2 = aspect.planets[1];
    const type = aspect.type;

    const summaries = {
        conjunction: `${planet1} and ${planet2} energies merge, creating intense focus in ${getCombinedDomains(planet1, planet2)}.`,
        sextile: `${planet1} and ${planet2} work harmoniously, offering opportunities in ${getCombinedDomains(planet1, planet2)}.`,
        square: `${planet1} and ${planet2} create dynamic tension, driving growth through ${getCombinedDomains(planet1, planet2)} challenges.`,
        trine: `${planet1} and ${planet2} flow naturally together, bringing ease in ${getCombinedDomains(planet1, planet2)}.`,
        opposition: `${planet1} and ${planet2} balance each other, highlighting ${getCombinedDomains(planet1, planet2)} polarities.`
    };

    return summaries[type] || `${planet1} and ${planet2} form a ${type} aspect.`;
}

/**
 * Get combined planetary domains
 */
function getCombinedDomains(planet1, planet2) {
    const domains = {
        sun: 'identity and life force',
        moon: 'emotions and instincts',
        mercury: 'communication and intellect',
        venus: 'relationships and values',
        mars: 'action and drive',
        jupiter: 'expansion and wisdom',
        saturn: 'structure and responsibility',
        uranus: 'innovation and freedom',
        neptune: 'spirituality and imagination',
        pluto: 'transformation and power'
    };

    const domain1 = domains[planet1] || planet1;
    const domain2 = domains[planet2] || planet2;
    return `${domain1} and ${domain2}`;
}

/**
 * Generate personality impact
 */
function generatePersonalityImpact(aspect) {
    // Simplified personality impacts
    const impacts = {
        conjunction: 'Amplified traits and intensified experiences',
        sextile: 'Natural talents and cooperative abilities',
        square: 'Drive and determination through challenges',
        trine: 'Ease and confidence in related areas',
        opposition: 'Balance and awareness of polarities'
    };
    return impacts[aspect.type] || 'Balanced integration of planetary energies';
}

/**
 * Generate life area impact
 */
function generateLifeAreaImpact(aspect) {
    const areas = {
        conjunction: 'Core identity and fundamental life areas',
        sextile: 'Opportunities and social connections',
        square: 'Growth through overcoming obstacles',
        trine: 'Success and natural flow in endeavors',
        opposition: 'Relationships and finding balance'
    };
    return areas[aspect.type] || 'Various life areas depending on context';
}

/**
 * Generate challenges
 */
function generateChallenges(aspect) {
    const challenges = {
        conjunction: 'Overwhelm and lack of balance',
        sextile: 'Complacency and missed opportunities',
        square: 'Frustration and resistance to change',
        trine: 'Lack of motivation and complacency',
        opposition: 'Indecision and extreme positions'
    };
    return challenges[aspect.type] || 'Integration of opposing energies';
}

/**
 * Generate strengths
 */
function generateStrengths(aspect) {
    const strengths = {
        conjunction: 'Focus, power, and synthesis',
        sextile: 'Balance, adaptability, and growth',
        square: 'Motivation, growth, and resilience',
        trine: 'Ease, creativity, and stability',
        opposition: 'Balance, awareness, and cooperation'
    };
    return strengths[aspect.type] || 'Harmonious energy flow';
}

/**
 * Generate advice
 */
function generateAdvice(aspect, chartContext) {
    const advice = {
        conjunction: 'Learn to balance and channel the combined energies effectively',
        sextile: 'Take advantage of natural opportunities and maintain momentum',
        square: 'Embrace challenges as catalysts for growth and transformation',
        trine: 'Use natural talents while avoiding complacency',
        opposition: 'Find middle ground and integrate opposing forces'
    };
    return advice[aspect.type] || 'Work with the planetary energies constructively';
}

/**
 * Detect grand trine pattern
 */
function detectGrandTrine(planets, aspects) {
    const trines = aspects.filter(a => a.type === ASPECT_TYPES.TRINE);
    if (trines.length < 3) return null;

    // Create a map of planet connections for faster lookup
    const planetConnections = new Map();
    for (const trine of trines) {
        const [p1, p2] = trine.planets;
        if (!planetConnections.has(p1)) planetConnections.set(p1, new Set());
        if (!planetConnections.has(p2)) planetConnections.set(p2, new Set());
        planetConnections.get(p1).add(p2);
        planetConnections.get(p2).add(p1);
    }

    // Find triangles in the trine graph
    for (const [planet1, connections] of planetConnections) {
        for (const planet2 of connections) {
            if (planet2 <= planet1) continue; // Avoid duplicates
            for (const planet3 of connections) {
                if (planet3 <= planet2) continue;
                if (planetConnections.get(planet2)?.has(planet3)) {
                    // Found a grand trine
                    const p1 = planets.find(p => p.name === planet1);
                    const p2 = planets.find(p => p.name === planet2);
                    const p3 = planets.find(p => p.name === planet3);
                    if (p1 && p2 && p3) {
                        const trine12 = trines.find(t => t.planets.includes(planet1) && t.planets.includes(planet2));
                        const trine13 = trines.find(t => t.planets.includes(planet1) && t.planets.includes(planet3));
                        const trine23 = trines.find(t => t.planets.includes(planet2) && t.planets.includes(planet3));
                        return {
                            type: 'grand-trine',
                            planets: [planet1, planet2, planet3],
                            element: getCommonElement([p1.sign, p2.sign, p3.sign]),
                            strength: (trine12.strength + trine13.strength + trine23.strength) / 3
                        };
                    }
                }
            }
        }
    }

    return null;
}

/**
 * Get common element from signs
 */
function getCommonElement(signs) {
    if (!Array.isArray(signs) || signs.length === 0) {
        return 'unknown';
    }

    const elements = signs.map(sign => {
        if (typeof sign !== 'string') return 'unknown';

        const fire = ['aries', 'leo', 'sagittarius'];
        const earth = ['taurus', 'virgo', 'capricorn'];
        const air = ['gemini', 'libra', 'aquarius'];
        const water = ['cancer', 'scorpio', 'pisces'];

        if (fire.includes(sign.toLowerCase())) return 'fire';
        if (earth.includes(sign.toLowerCase())) return 'earth';
        if (air.includes(sign.toLowerCase())) return 'air';
        if (water.includes(sign.toLowerCase())) return 'water';
        return 'unknown';
    });

    // Filter out unknown elements
    const validElements = elements.filter(el => el !== 'unknown');
    if (validElements.length === 0) return 'unknown';

    const uniqueElements = [...new Set(validElements)];
    return uniqueElements.length === 1 ? uniqueElements[0] : 'mixed';
}

/**
 * Detect T-square pattern
 */
function detectTSquare(planets, aspects) {
    const squares = aspects.filter(a => a.type === ASPECT_TYPES.SQUARE);
    const oppositions = aspects.filter(a => a.type === ASPECT_TYPES.OPPOSITION);

    // Find opposition with both ends squared to same planet
    for (const opp of oppositions) {
        const [planet1, planet2] = opp.planets;

        const square1 = squares.find(s => s.planets.includes(planet1) && !s.planets.includes(planet2));
        const square2 = squares.find(s => s.planets.includes(planet2) && !s.planets.includes(planet1));

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
 * Custom error classes for aspect calculations
 */
class AspectValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AspectValidationError';
    }
}

class AspectCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AspectCalculationError';
    }
}

/**
 * Complete Western Astrology Aspect Calculator
 */
class WesternAspectCalculator {
    constructor() {
        this.supportedAspects = Object.values(ASPECT_TYPES);
    }

    /**
     * Calculate all aspects in a birth chart
     * @param {Array} planets - Array of planet objects with name, longitude, speed
     * @param {Object} options - Calculation options
     * @returns {Object} Aspect calculation results
     */
    calculateAspects(planets, options = {}) {
        try {
            // Validate inputs
            this._validateInputs(planets, options);

            const customOrbs = options.orbs || {};
            const aspects = calculateAllAspects(planets, customOrbs);

            // Detect patterns
            const patterns = this._detectPatterns(planets, aspects);

            // Generate interpretations
            const interpretations = aspects.map(aspect => interpretAspect(aspect, { planets }));

            // Format results
            return this._formatAspectResults(planets, aspects, patterns, interpretations, options);

        } catch (error) {
            throw new Error(`Aspect calculation failed: ${error.message}`);
        }
    }

    /**
     * Private method: Validate input parameters
     */
    _validateInputs(planets, options) {
        if (!Array.isArray(planets) || planets.length < 2) {
            throw new AspectValidationError('At least 2 planets required for aspect calculation');
        }

        for (const planet of planets) {
            if (!planet.name || typeof planet.longitude !== 'number' || isNaN(planet.longitude)) {
                throw new AspectValidationError('Each planet must have name and valid longitude');
            }
            // Validate longitude bounds
            if (planet.longitude < 0 || planet.longitude >= 360) {
                throw new AspectValidationError(`Planet ${planet.name} longitude must be between 0 and 360 degrees`);
            }
        }

        if (options.orbs) {
            for (const [aspect, orb] of Object.entries(options.orbs)) {
                if (typeof orb !== 'number' || orb < 0 || orb > ASPECT_CONSTANTS.MAX_ORB) {
                    throw new AspectValidationError(`Invalid orb for ${aspect}: ${orb}`);
                }
            }
        }
    }

    /**
     * Private method: Detect aspect patterns
     */
    _detectPatterns(planets, aspects) {
        const patterns = [];

        // Detect grand trines
        const grandTrine = detectGrandTrine(planets, aspects);
        if (grandTrine) patterns.push(grandTrine);

        // Detect T-squares
        const tSquare = detectTSquare(planets, aspects);
        if (tSquare) patterns.push(tSquare);

        // Add more pattern detection as needed

        return patterns;
    }

    /**
     * Private method: Format aspect calculation results
     */
    _formatAspectResults(planets, aspects, patterns, interpretations, options) {
        const formattedAspects = aspects.map((aspect, index) => ({
            id: index + 1,
            planets: aspect.planets,
            type: aspect.type,
            angle: aspect.angle,
            separation: aspect.separation,
            strength: aspect.strength,
            applying: aspect.applying,
            interpretation: interpretations[index]
        }));

        return {
            calculationTime: new Date().toISOString(),
            input: {
                planetCount: planets.length,
                options: options
            },
            aspects: formattedAspects,
            patterns: patterns,
            summary: {
                totalAspects: aspects.length,
                majorAspects: aspects.filter(a => ASPECT_CONSTANTS.MAJOR_ASPECTS.includes(a.type)).length,
                minorAspects: aspects.filter(a => ASPECT_CONSTANTS.MINOR_ASPECTS.includes(a.type)).length,
                averageStrength: aspects.reduce((sum, a) => sum + a.strength, 0) / aspects.length
            }
        };
    }

    /**
     * Get aspects for specific planet
     * @param {string} planetName - Name of the planet
     * @param {Array} aspects - All aspects in chart
     * @returns {Array} Aspects involving the planet
     */
    getAspectsForPlanet(planetName, aspects) {
        return aspects.filter(aspect => aspect.planets.includes(planetName));
    }

    /**
     * Get aspects between two specific planets
     * @param {string} planet1 - First planet name
     * @param {string} planet2 - Second planet name
     * @param {Array} aspects - All aspects in chart
     * @returns {Array} Aspects between the planets
     */
    getAspectsBetweenPlanets(planet1, planet2, aspects) {
        return aspects.filter(aspect =>
            aspect.planets.includes(planet1) && aspect.planets.includes(planet2)
        );
    }
}

module.exports = WesternAspectCalculator;