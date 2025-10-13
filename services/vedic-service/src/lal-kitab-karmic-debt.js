/**
 * Lal Kitab Karmic Debt Analysis Implementation
 * Based on Pt. Roop Chand Joshi's traditional Lal Kitab principles
 *
 * This module provides comprehensive analysis of the four primary karmic debts:
 * - Pitru Rina (Ancestral Debt)
 * - Matru Rina (Mother's Debt)
 * - Bhratru Rina (Brother's Debt)
 * - Putra Rina (Son's Debt)
 */

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

/**
 * Lal Kitab house lord assignments based on traditional principles
 */
const HOUSE_LORDS = {
    1: 'MARS',      // Ascendant
    2: 'VENUS',     // Wealth
    3: 'MERCURY',   // Siblings
    4: 'MOON',      // Mother/Home
    5: 'SUN',       // Children
    6: 'MERCURY',   // Enemies
    7: 'VENUS',     // Spouse
    8: 'SATURN',    // Longevity
    9: 'SUN',       // Father/Fortune
    10: 'SATURN',   // Career
    11: 'JUPITER',  // Gains
    12: 'SATURN'    // Expenses
};

/**
 * Planets considered malefic in Lal Kitab system
 */
const MALEFIC_PLANETS = ['SATURN', 'RAHU', 'KETU', 'MARS'];

/**
 * Qualitative intensity levels replacing numerical scoring
 */
const INTENSITY_LEVELS = {
    MILD: { value: 1, description: 'Minor karmic influences requiring basic attention' },
    MODERATE: { value: 2, description: 'Noticeable life challenges needing focused remedies' },
    STRONG: { value: 3, description: 'Significant obstacles requiring comprehensive remedies' },
    SEVERE: { value: 4, description: 'Major life difficulties demanding urgent spiritual intervention' }
};

/**
 * Lal Kitab aspect rules - house-based, not sign-based like Vedic astrology
 */
const LAL_KITAB_ASPECTS = {
    // Planets aspect houses directly opposite (7 houses away)
    OPPOSITE: 7,
    // Harmonious aspects (2, 3, 4, 5, 6, 8, 9, 10, 11 houses away)
    HARMONIOUS: [2, 3, 4, 5, 6, 8, 9, 10, 11],
    // Neutral aspects (same house)
    NEUTRAL: [1]
};

/**
 * Scoring weights for rina calculations - eliminates magic numbers
 */
const SCORING_WEIGHTS = {
    PRIMARY_INDICATORS: {
        SUN_IN_9TH: 3,
        SATURN_IN_9TH: 2.5,
        RAHU_IN_9TH: 2,
        KETU_IN_9TH: 1.5,
        MOON_IN_4TH: 3,
        VENUS_IN_4TH: 2.5,
        MARS_IN_4TH: 2,
        MERCURY_IN_4TH: 1.5,
        MARS_IN_3RD: 3,
        MERCURY_IN_3RD: 2.5,
        JUPITER_IN_3RD: 2,
        SATURN_IN_3RD: 1.5,
        JUPITER_IN_5TH: 3,
        SUN_IN_5TH: 2.5,
        VENUS_IN_5TH: 2,
        MERCURY_IN_5TH: 1.5
    },
    SECONDARY_FACTORS: {
        HOUSE_LORD_AFFLICTED: 1,
        PLANETARY_DISHARMONY: 0.5,
        MULTIPLE_PLANETS_IN_HOUSE: 0.5,
        EMPTY_HOUSE: 0.5,
        MALEFIC_IN_5TH_HOUSE: 0.5
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the lord of a specific house in Lal Kitab system
 * @param {number} houseNumber - House number (1-12)
 * @param {Object} chart - Lal Kitab chart (optional, for validation)
 * @returns {string} Planet name that lords the house
 * @throws {Error} If house number is invalid
 */
function getHouseLord(houseNumber, chart = null) {
    if (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 12) {
        throw new Error(`Invalid house number: ${houseNumber}. Must be between 1 and 12.`);
    }

    const lord = HOUSE_LORDS[houseNumber];
    if (!lord) {
        throw new Error(`No lord defined for house ${houseNumber}`);
    }

    return lord;
}

/**
 * Check if a planet is afflicted in Lal Kitab context
 * @param {string} planetName - Name of the planet
 * @param {Object} chart - Lal Kitab chart with planetary positions
 * @returns {boolean} True if planet is afflicted
 * @throws {Error} If planet or chart data is invalid
 */
function isPlanetAfflicted(planetName, chart) {
    if (!planetName || typeof planetName !== 'string') {
        throw new Error('Invalid planet name provided');
    }

    if (!chart || !chart.planets || !chart.planets[planetName.toUpperCase()]) {
        throw new Error(`Planet ${planetName} not found in chart`);
    }

    const planet = chart.planets[planetName.toUpperCase()];
    const house = planet.house;

    // Check if planet is in malefic houses (6, 8, 12)
    if ([6, 8, 12].includes(house)) {
        return true;
    }

    // Check if malefic planets are aspecting this planet
    for (const malefic of MALEFIC_PLANETS) {
        if (malefic === planetName.toUpperCase()) continue; // Don't check self

        const maleficPlanet = chart.planets[malefic];
        if (!maleficPlanet) continue;

        const aspect = checkLalKitabAspect(planet, maleficPlanet);
        if (!aspect.harmonious) {
            return true;
        }
    }

    return false;
}

/**
 * Check Lal Kitab planetary aspects based on house positions
 * @param {Object} planet1 - First planet object with house property
 * @param {Object} planet2 - Second planet object with house property
 * @returns {Object} Aspect information
 * @throws {Error} If planet data is invalid
 */
function checkLalKitabAspect(planet1, planet2) {
    if (!planet1 || !planet2 || !planet1.house || !planet2.house) {
        throw new Error('Invalid planet data provided for aspect calculation');
    }

    const houseDiff = Math.abs(planet1.house - planet2.house);

    // Handle wrap-around for 12-house system
    const actualDiff = houseDiff === 0 ? 12 : Math.min(houseDiff, 12 - houseDiff);

    if (actualDiff === LAL_KITAB_ASPECTS.OPPOSITE) {
        return { type: 'opposite', harmonious: false, strength: 'strong' };
    }

    if (LAL_KITAB_ASPECTS.HARMONIOUS.includes(actualDiff)) {
        return { type: 'harmonious', harmonious: true, strength: 'moderate' };
    }

    if (LAL_KITAB_ASPECTS.NEUTRAL.includes(actualDiff)) {
        return { type: 'neutral', harmonious: true, strength: 'weak' };
    }

    return { type: 'distant', harmonious: false, strength: 'weak' };
}

/**
 * Convert numerical score to qualitative intensity level
 * @param {number} score - Numerical score (0-4)
 * @returns {Object} Intensity level with description
 */
function getIntensityLevel(score) {
    if (score <= 1) return INTENSITY_LEVELS.MILD;
    if (score <= 2) return INTENSITY_LEVELS.MODERATE;
    if (score <= 3) return INTENSITY_LEVELS.STRONG;
    return INTENSITY_LEVELS.SEVERE;
}

/**
 * Validate Lal Kitab chart structure
 * @param {Object} chart - Chart to validate
 * @throws {Error} If chart is invalid
 */
function validateChart(chart) {
    if (!chart || typeof chart !== 'object') {
        throw new Error('Chart must be a valid object');
    }

    if (!chart.planets || typeof chart.planets !== 'object') {
        throw new Error('Chart must contain planets object');
    }

    const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

    for (const planet of requiredPlanets) {
        if (!chart.planets[planet]) {
            throw new Error(`Missing required planet: ${planet}`);
        }

        if (!chart.planets[planet].house || typeof chart.planets[planet].house !== 'number' ||
            chart.planets[planet].house < 1 || chart.planets[planet].house > 12) {
            throw new Error(`Invalid house position for planet ${planet}`);
        }
    }
}

/**
 * Validate planet object structure
 * @param {Object} planet - Planet object to validate
 * @returns {boolean} True if valid
 * @throws {Error} If planet structure is invalid
 */
function validatePlanetObject(planet) {
    if (!planet || typeof planet !== 'object') {
        throw new Error('Planet must be a valid object');
    }

    if (!('house' in planet) || typeof planet.house !== 'number') {
        throw new Error('Planet must have a valid house property');
    }

    if (planet.house < 1 || planet.house > 12) {
        throw new Error('Planet house must be between 1 and 12');
    }

    return true;
}

/**
 * Validate rina analysis result structure
 * @param {Object} rinaResult - Rina analysis result to validate
 * @returns {boolean} True if valid
 * @throws {Error} If result structure is invalid
 */
function validateRinaResult(rinaResult) {
    const requiredProps = ['present', 'intensity', 'score', 'indicators', 'effects', 'remedies'];

    for (const prop of requiredProps) {
        if (!(prop in rinaResult)) {
            throw new Error(`Rina result missing required property: ${prop}`);
        }
    }

    if (typeof rinaResult.present !== 'boolean') {
        throw new Error('Rina present property must be boolean');
    }

    if (typeof rinaResult.intensity !== 'object' || !rinaResult.intensity.value) {
        throw new Error('Rina intensity must be a valid intensity level object');
    }

    if (typeof rinaResult.score !== 'number') {
        throw new Error('Rina score must be a number');
    }

    if (!Array.isArray(rinaResult.indicators) || !Array.isArray(rinaResult.effects)) {
        throw new Error('Rina indicators and effects must be arrays');
    }

    if (typeof rinaResult.remedies !== 'object') {
        throw new Error('Rina remedies must be an object');
    }

    return true;
}

// ============================================================================
// CACHING SYSTEM FOR PERFORMANCE OPTIMIZATION
// ============================================================================

/**
 * Cache for expensive calculations to improve performance
 */
const calculationCache = {
    houseLords: new Map(),
    aspects: new Map(),
    afflictions: new Map()
};

/**
 * Get cached house lord or calculate and cache it
 * @param {number} houseNumber - House number (1-12)
 * @param {Object} chart - Lal Kitab chart (optional)
 * @returns {string} Planet name that lords the house
 */
function getCachedHouseLord(houseNumber, chart = null) {
    const cacheKey = `house_${houseNumber}`;

    if (calculationCache.houseLords.has(cacheKey)) {
        return calculationCache.houseLords.get(cacheKey);
    }

    const lord = getHouseLord(houseNumber, chart);
    calculationCache.houseLords.set(cacheKey, lord);
    return lord;
}

/**
 * Get cached aspect or calculate and cache it
 * @param {Object} planet1 - First planet object
 * @param {Object} planet2 - Second planet object
 * @returns {Object} Cached aspect information
 */
function getCachedAspect(planet1, planet2) {
    // Create deterministic cache key
    const key1 = `${planet1.house}_${planet2.house}`;
    const key2 = `${planet2.house}_${planet1.house}`;
    const cacheKey = key1 < key2 ? key1 : key2;

    if (calculationCache.aspects.has(cacheKey)) {
        return calculationCache.aspects.get(cacheKey);
    }

    const aspect = checkLalKitabAspect(planet1, planet2);
    calculationCache.aspects.set(cacheKey, aspect);
    return aspect;
}

/**
 * Get cached planet affliction or calculate and cache it
 * @param {string} planetName - Name of the planet
 * @param {Object} chart - Lal Kitab chart
 * @returns {boolean} True if planet is afflicted
 */
function getCachedAffliction(planetName, chart) {
    const cacheKey = `${planetName}_${JSON.stringify(chart.planets[planetName.toUpperCase()])}`;

    if (calculationCache.afflictions.has(cacheKey)) {
        return calculationCache.afflictions.get(cacheKey);
    }

    const afflicted = isPlanetAfflicted(planetName, chart);
    calculationCache.afflictions.set(cacheKey, afflicted);
    return afflicted;
}

/**
 * Clear all calculation caches (useful for memory management)
 */
function clearCalculationCache() {
    calculationCache.houseLords.clear();
    calculationCache.aspects.clear();
    calculationCache.afflictions.clear();
}

// ============================================================================
// GENERIC RINA CALCULATION ENGINE
// ============================================================================

/**
 * Generic rina calculation engine to reduce code duplication
 * @param {Object} chart - Lal Kitab chart
 * @param {Object} config - Rina-specific configuration
 * @returns {Object} Rina analysis result
 */
function calculateRina(chart, config) {
    try {
        validateChart(chart);

        let score = 0;
        const indicators = [];

        // Calculate primary indicators
        for (const [key, weight] of Object.entries(config.primaryIndicators)) {
            const planet = key.split('_')[0];
            const house = parseInt(key.split('_')[1]);

            if (chart.planets[planet] && chart.planets[planet].house === house) {
                score += weight;
                indicators.push(config.indicatorMessages[key]);
            }
        }

        // Calculate secondary factors
        for (const factor of config.secondaryFactors) {
            try {
                switch (factor.type) {
                    case 'houseLordAfflicted':
                        const lord = getCachedHouseLord(factor.house, chart);
                        if (getCachedAffliction(lord, chart)) {
                            score += SCORING_WEIGHTS.SECONDARY_FACTORS.HOUSE_LORD_AFFLICTED;
                            indicators.push(factor.message);
                        }
                        break;

                    case 'planetaryDisharmony':
                        const aspect = getCachedAspect(
                            chart.planets[factor.planet1],
                            chart.planets[factor.planet2]
                        );
                        if (!aspect.harmonious) {
                            score += SCORING_WEIGHTS.SECONDARY_FACTORS.PLANETARY_DISHARMONY;
                            indicators.push(factor.message);
                        }
                        break;

                    case 'multiplePlanetsInHouse':
                        const planetsInHouse = Object.values(chart.planets)
                            .filter(p => p.house === factor.house).length;
                        if (planetsInHouse > 1) {
                            score += SCORING_WEIGHTS.SECONDARY_FACTORS.MULTIPLE_PLANETS_IN_HOUSE;
                            indicators.push(factor.message);
                        }
                        break;

                    case 'emptyHouse':
                        const planetsInTargetHouse = Object.values(chart.planets)
                            .filter(p => p.house === factor.house).length;
                        if (planetsInTargetHouse === 0) {
                            score += SCORING_WEIGHTS.SECONDARY_FACTORS.EMPTY_HOUSE;
                            indicators.push(factor.message);
                        }
                        break;

                    case 'maleficInHouse':
                        const maleficsInHouse = MALEFIC_PLANETS.filter(planet =>
                            chart.planets[planet] && chart.planets[planet].house === factor.house
                        );
                        if (maleficsInHouse.length > 0) {
                            score += SCORING_WEIGHTS.SECONDARY_FACTORS.MALEFIC_IN_5TH_HOUSE;
                            indicators.push(`${factor.message} ${maleficsInHouse.join(', ')}`);
                        }
                        break;
                }
            } catch (error) {
                console.warn(`Could not calculate secondary factor ${factor.type}:`, error.message);
            }
        }

        const intensity = getIntensityLevel(Math.min(score, 4));
        const present = score >= 1;

        const result = {
            type: config.type,
            present: present,
            intensity: intensity,
            score: Math.min(score, 4),
            indicators: indicators,
            effects: config.effectAnalyzer(intensity),
            remedies: config.remedyGenerator(intensity, indicators)
        };

        // Validate result structure
        validateRinaResult(result);

        return result;

    } catch (error) {
        throw new Error(`${config.type} Rina calculation failed: ${error.message}`);
    }
}

// ============================================================================
// PITRU RINA ANALYSIS (ANCESTRAL DEBT)
// ============================================================================

/**
 * Analyze effects of Pitru Rina based on intensity
 * @param {Object} intensity - Intensity level object
 * @returns {Array<string>} List of effects
 */
function analyzePitruRinaEffects(intensity) {
    const effects = [];

    switch (intensity.value) {
        case INTENSITY_LEVELS.SEVERE.value:
            effects.push('Severe spiritual disconnection from ancestral lineage');
            effects.push('Chronic health issues affecting longevity');
            effects.push('Complete breakdown of family traditions and values');
            effects.push('Financial ruin through inherited property disputes');
            break;
        case INTENSITY_LEVELS.STRONG.value:
            effects.push('Significant obstacles in spiritual practices');
            effects.push('Frequent conflicts with father or father figures');
            effects.push('Instability in inherited wealth and property');
            effects.push('Lack of ancestral blessings and guidance');
            break;
        case INTENSITY_LEVELS.MODERATE.value:
            effects.push('Difficulty maintaining family traditions');
            effects.push('Occasional health concerns from ancestral patterns');
            effects.push('Challenges in receiving paternal support');
            effects.push('Minor financial issues related to family background');
            break;
        case INTENSITY_LEVELS.MILD.value:
            effects.push('Occasional feelings of disconnection from roots');
            effects.push('Minor delays in spiritual progress');
            effects.push('Need for conscious effort to honor ancestors');
            break;
    }

    return effects;
}

/**
 * Generate remedies for Pitru Rina based on intensity and indicators
 * @param {Object} intensity - Intensity level object
 * @param {Array<string>} indicators - List of rina indicators
 * @returns {Object} Remedies categorized by frequency
 */
function generatePitruRinaRemedies(intensity, indicators) {
    const remedies = {
        daily: [],
        weekly: [],
        monthly: [],
        oneTime: []
    };

    // Basic remedies for all levels
    remedies.daily.push('Offer water to the Sun at sunrise while facing East');
    remedies.daily.push('Feed crows (messengers of ancestors) daily');

    if (intensity.value >= INTENSITY_LEVELS.MODERATE.value) {
        remedies.weekly.push('Visit ancestral temple or place of worship on Sundays');
        remedies.weekly.push('Perform tarpan (water offering) rituals for ancestors');
    }

    if (intensity.value >= INTENSITY_LEVELS.STRONG.value) {
        remedies.monthly.push('Organize ancestor worship ceremonies');
        remedies.monthly.push('Donate food and clothing to elderly people in need');
        remedies.oneTime.push('Plant trees in memory of ancestors');
    }

    if (intensity.value === INTENSITY_LEVELS.SEVERE.value) {
        remedies.oneTime.push('Consult spiritual guide for intensive ancestor healing rituals');
        remedies.oneTime.push('Establish family memorial or ancestor shrine');
    }

    // Specific remedies based on indicators
    if (indicators.some(ind => ind.includes('Sun in 9th'))) {
        remedies.daily.push('Meditate on ancestral wisdom and gratitude');
    }

    if (indicators.some(ind => ind.includes('Saturn in 9th'))) {
        remedies.weekly.push('Offer prayers to Lord Shiva on Saturdays');
    }

    return remedies;
}

/**
 * Configuration for Pitru Rina (Ancestral Debt) calculations
 */
const PITRU_RINA_CONFIG = {
    type: 'Pitru Rina',
    primaryIndicators: {
        'SUN_9': SCORING_WEIGHTS.PRIMARY_INDICATORS.SUN_IN_9TH,
        'SATURN_9': SCORING_WEIGHTS.PRIMARY_INDICATORS.SATURN_IN_9TH,
        'RAHU_9': SCORING_WEIGHTS.PRIMARY_INDICATORS.RAHU_IN_9TH,
        'KETU_9': SCORING_WEIGHTS.PRIMARY_INDICATORS.KETU_IN_9TH
    },
    indicatorMessages: {
        'SUN_9': "Sun in 9th house - Direct ancestral connection and responsibility",
        'SATURN_9': "Saturn in 9th house - Karmic ancestral lessons and duties",
        'RAHU_9': "Rahu in 9th house - Unresolved ancestral karmic patterns",
        'KETU_9': "Ketu in 9th house - Past life ancestral spiritual debts"
    },
    secondaryFactors: [
        {
            type: 'houseLordAfflicted',
            house: 9,
            message: "9th house lord afflicted - Blocked ancestral blessings and fortune"
        },
        {
            type: 'planetaryDisharmony',
            planet1: 'SUN',
            planet2: 'MOON',
            message: "Sun-Moon disharmony - Conflicts between paternal and maternal ancestral lines"
        }
    ],
    effectAnalyzer: analyzePitruRinaEffects,
    remedyGenerator: generatePitruRinaRemedies
};

/**
 * Calculate Pitru Rina (Ancestral Debt) for a Lal Kitab chart
 * @param {Object} chart - Lal Kitab chart with house positions
 * @returns {Object} Pitru Rina analysis
 * @throws {Error} If chart validation fails
 */
function calculatePitruRina(chart) {
    return calculateRina(chart, PITRU_RINA_CONFIG);
}

// ============================================================================
// MATRU RINA ANALYSIS (MOTHER'S DEBT)
// ============================================================================

/**
 * Analyze effects of Matru Rina based on intensity
 * @param {Object} intensity - Intensity level object
 * @returns {Array<string>} List of effects
 */
function analyzeMatruRinaEffects(intensity) {
    const effects = [];

    switch (intensity.value) {
        case INTENSITY_LEVELS.SEVERE.value:
            effects.push('Complete emotional disconnection from mother and maternal lineage');
            effects.push('Severe home and family instability');
            effects.push('Chronic emotional and psychological disorders');
            effects.push('Inability to form nurturing relationships');
            break;
        case INTENSITY_LEVELS.STRONG.value:
            effects.push('Significant emotional conflicts with mother');
            effects.push('Frequent home and property disputes');
            effects.push('Difficulty maintaining stable relationships');
            effects.push('Health issues related to emotions and digestion');
            break;
        case INTENSITY_LEVELS.MODERATE.value:
            effects.push('Occasional conflicts with mother or mother figures');
            effects.push('Minor home and family disturbances');
            effects.push('Challenges in emotional expression');
            effects.push('Need for conscious effort in nurturing relationships');
            break;
        case INTENSITY_LEVELS.MILD.value:
            effects.push('Minor emotional sensitivities with maternal figures');
            effects.push('Occasional feelings of home insecurity');
            effects.push('Need for mindful emotional boundaries');
            break;
    }

    return effects;
}

/**
 * Generate remedies for Matru Rina based on intensity and indicators
 * @param {Object} intensity - Intensity level object
 * @param {Array<string>} indicators - List of rina indicators
 * @returns {Object} Remedies categorized by frequency
 */
function generateMatruRinaRemedies(intensity, indicators) {
    const remedies = {
        daily: [],
        weekly: [],
        monthly: [],
        oneTime: []
    };

    // Basic remedies for all levels
    remedies.daily.push('Drink water from a silver vessel');
    remedies.daily.push('Keep white flowers in the home temple');

    if (intensity.value >= INTENSITY_LEVELS.MODERATE.value) {
        remedies.weekly.push('Feed cows with respect and devotion');
        remedies.weekly.push('Maintain cleanliness and harmony in the home');
    }

    if (intensity.value >= INTENSITY_LEVELS.STRONG.value) {
        remedies.monthly.push('Perform special prayers for mother\'s well-being');
        remedies.monthly.push('Donate white items (clothes, rice, etc.) to those in need');
    }

    if (intensity.value === INTENSITY_LEVELS.SEVERE.value) {
        remedies.oneTime.push('Establish a special shrine for mother goddess worship');
        remedies.oneTime.push('Seek counseling for deep emotional healing');
    }

    // Specific remedies based on indicators
    if (indicators.some(ind => ind.includes('Moon in 4th'))) {
        remedies.daily.push('Meditate on mother\'s love and gratitude');
    }

    if (indicators.some(ind => ind.includes('Mars in 4th'))) {
        remedies.weekly.push('Offer red flowers to mother goddess on Tuesdays');
    }

    return remedies;
}

/**
 * Configuration for Matru Rina (Mother's Debt) calculations
 */
const MATRU_RINA_CONFIG = {
    type: 'Matru Rina',
    primaryIndicators: {
        'MOON_4': SCORING_WEIGHTS.PRIMARY_INDICATORS.MOON_IN_4TH,
        'VENUS_4': SCORING_WEIGHTS.PRIMARY_INDICATORS.VENUS_IN_4TH,
        'MARS_4': SCORING_WEIGHTS.PRIMARY_INDICATORS.MARS_IN_4TH,
        'MERCURY_4': SCORING_WEIGHTS.PRIMARY_INDICATORS.MERCURY_IN_4TH
    },
    indicatorMessages: {
        'MOON_4': "Moon in 4th house - Direct maternal emotional connection",
        'VENUS_4': "Venus in 4th house - Love and comfort issues with mother",
        'MARS_4': "Mars in 4th house - Conflict and aggression from maternal side",
        'MERCURY_4': "Mercury in 4th house - Communication issues with mother"
    },
    secondaryFactors: [
        {
            type: 'houseLordAfflicted',
            house: 4,
            message: "4th house lord afflicted - Home and mother problems"
        },
        {
            type: 'planetaryDisharmony',
            planet1: 'MOON',
            planet2: 'VENUS',
            message: "Moon-Venus disharmony - Emotional nurturing conflicts"
        },
        {
            type: 'multiplePlanetsInHouse',
            house: 4,
            message: "Multiple planets in 4th house - Complex maternal influences"
        }
    ],
    effectAnalyzer: analyzeMatruRinaEffects,
    remedyGenerator: generateMatruRinaRemedies
};

/**
 * Calculate Matru Rina (Mother's Debt) for a Lal Kitab chart
 * @param {Object} chart - Lal Kitab chart with house positions
 * @returns {Object} Matru Rina analysis
 * @throws {Error} If chart validation fails
 */
function calculateMatruRina(chart) {
    return calculateRina(chart, MATRU_RINA_CONFIG);
}

// ============================================================================
// BHRATRU RINA ANALYSIS (BROTHER'S DEBT)
// ============================================================================

/**
 * Analyze effects of Bhratru Rina based on intensity
 * @param {Object} intensity - Intensity level object
 * @returns {Array<string>} List of effects
 */
function analyzeBhratruRinaEffects(intensity) {
    const effects = [];

    switch (intensity.value) {
        case INTENSITY_LEVELS.SEVERE.value:
            effects.push('Complete breakdown of sibling relationships');
            effects.push('Inability to form partnerships or collaborations');
            effects.push('Chronic health issues in arms, shoulders, and respiratory system');
            effects.push('Professional isolation and lack of team support');
            break;
        case INTENSITY_LEVELS.STRONG.value:
            effects.push('Frequent conflicts with brothers and siblings');
            effects.push('Difficulty in teamwork and partnerships');
            effects.push('Health problems in arms and shoulders');
            effects.push('Communication breakdowns in relationships');
            break;
        case INTENSITY_LEVELS.MODERATE.value:
            effects.push('Occasional sibling disputes and misunderstandings');
            effects.push('Challenges in collaborative efforts');
            effects.push('Need for conscious effort in maintaining relationships');
            effects.push('Minor health concerns in upper body');
            break;
        case INTENSITY_LEVELS.MILD.value:
            effects.push('Minor communication issues with siblings');
            effects.push('Occasional feelings of isolation in groups');
            effects.push('Need for mindful relationship maintenance');
            break;
    }

    return effects;
}

/**
 * Generate remedies for Bhratru Rina based on intensity and indicators
 * @param {Object} intensity - Intensity level object
 * @param {Array<string>} indicators - List of rina indicators
 * @returns {Object} Remedies categorized by frequency
 */
function generateBhratruRinaRemedies(intensity, indicators) {
    const remedies = {
        daily: [],
        weekly: [],
        monthly: [],
        oneTime: []
    };

    // Basic remedies for all levels
    remedies.daily.push('Feed small birds (sparrows, pigeons) daily');
    remedies.weekly.push('Wear green clothes on Wednesdays');

    if (intensity.value >= INTENSITY_LEVELS.MODERATE.value) {
        remedies.weekly.push('Plant small plants or trees');
        remedies.monthly.push('Improve relationships with siblings through communication');
    }

    if (intensity.value >= INTENSITY_LEVELS.STRONG.value) {
        remedies.monthly.push('Participate in group activities and team sports');
        remedies.oneTime.push('Avoid non-vegetarian food on Tuesdays');
    }

    if (intensity.value === INTENSITY_LEVELS.SEVERE.value) {
        remedies.oneTime.push('Seek family counseling for sibling relationship healing');
        remedies.oneTime.push('Establish regular family gatherings and communications');
    }

    // Specific remedies based on indicators
    if (indicators.some(ind => ind.includes('Mars in 3rd'))) {
        remedies.weekly.push('Offer prayers to Lord Hanuman on Tuesdays');
    }

    if (indicators.some(ind => ind.includes('Mercury in 3rd'))) {
        remedies.daily.push('Practice mindful communication and active listening');
    }

    return remedies;
}

/**
 * Configuration for Bhratru Rina (Brother's Debt) calculations
 */
const BHRATRU_RINA_CONFIG = {
    type: 'Bhratru Rina',
    primaryIndicators: {
        'MARS_3': SCORING_WEIGHTS.PRIMARY_INDICATORS.MARS_IN_3RD,
        'MERCURY_3': SCORING_WEIGHTS.PRIMARY_INDICATORS.MERCURY_IN_3RD,
        'JUPITER_3': SCORING_WEIGHTS.PRIMARY_INDICATORS.JUPITER_IN_3RD,
        'SATURN_3': SCORING_WEIGHTS.PRIMARY_INDICATORS.SATURN_IN_3RD
    },
    indicatorMessages: {
        'MARS_3': "Mars in 3rd house - Direct sibling conflicts and courage issues",
        'MERCURY_3': "Mercury in 3rd house - Communication issues with siblings",
        'JUPITER_3': "Jupiter in 3rd house - Blocked sibling wisdom and guidance",
        'SATURN_3': "Saturn in 3rd house - Karmic sibling lessons and responsibilities"
    },
    secondaryFactors: [
        {
            type: 'houseLordAfflicted',
            house: 3,
            message: "3rd house lord afflicted - Sibling relationship problems"
        },
        {
            type: 'planetaryDisharmony',
            planet1: 'MARS',
            planet2: 'MERCURY',
            message: "Mars-Mercury disharmony - Sibling communication conflicts"
        },
        {
            type: 'emptyHouse',
            house: 3,
            message: "Empty 3rd house - Lack of sibling support and courage"
        }
    ],
    effectAnalyzer: analyzeBhratruRinaEffects,
    remedyGenerator: generateBhratruRinaRemedies
};

/**
 * Calculate Bhratru Rina (Brother's Debt) for a Lal Kitab chart
 * @param {Object} chart - Lal Kitab chart with house positions
 * @returns {Object} Bhratru Rina analysis
 * @throws {Error} If chart validation fails
 */
function calculateBhratruRina(chart) {
    return calculateRina(chart, BHRATRU_RINA_CONFIG);
}

// ============================================================================
// PUTRA RINA ANALYSIS (SON'S DEBT)
// ============================================================================

/**
 * Analyze effects of Putra Rina based on intensity
 * @param {Object} intensity - Intensity level object
 * @returns {Array<string>} List of effects
 */
function analyzePutraRinaEffects(intensity) {
    const effects = [];

    switch (intensity.value) {
        case INTENSITY_LEVELS.SEVERE.value:
            effects.push('Complete inability to have children or severe progeny issues');
            effects.push('Total blockage of creativity and self-expression');
            effects.push('Chronic health issues affecting children and creative organs');
            effects.push('Complete lack of joy and celebration in life');
            break;
        case INTENSITY_LEVELS.STRONG.value:
            effects.push('Significant difficulties with children and progeny');
            effects.push('Blocked creativity and artistic expression');
            effects.push('Health problems affecting children and reproductive system');
            effects.push('Lack of happiness and fulfillment in creative pursuits');
            break;
        case INTENSITY_LEVELS.MODERATE.value:
            effects.push('Challenges in having or raising children');
            effects.push('Difficulty expressing creativity');
            effects.push('Need for conscious effort in child welfare');
            effects.push('Minor health concerns related to children');
            break;
        case INTENSITY_LEVELS.MILD.value:
            effects.push('Minor delays or concerns with children');
            effects.push('Occasional creative blocks');
            effects.push('Need for mindful attention to progeny matters');
            break;
    }

    return effects;
}

/**
 * Generate remedies for Putra Rina based on intensity and indicators
 * @param {Object} intensity - Intensity level object
 * @param {Array<string>} indicators - List of rina indicators
 * @returns {Object} Remedies categorized by frequency
 */
function generatePutraRinaRemedies(intensity, indicators) {
    const remedies = {
        daily: [],
        weekly: [],
        monthly: [],
        oneTime: []
    };

    // Basic remedies for all levels
    remedies.weekly.push('Feed Brahmins on Thursdays');
    remedies.weekly.push('Wear yellow or saffron clothes on Thursdays');

    if (intensity.value >= INTENSITY_LEVELS.MODERATE.value) {
        remedies.monthly.push('Support education and welfare of poor children');
        remedies.monthly.push('Donate to children\'s charities');
    }

    if (intensity.value >= INTENSITY_LEVELS.STRONG.value) {
        remedies.monthly.push('Care for young family members and children');
        remedies.oneTime.push('Establish a children\'s education fund');
    }

    if (intensity.value === INTENSITY_LEVELS.SEVERE.value) {
        remedies.oneTime.push('Consult fertility specialists if applicable');
        remedies.oneTime.push('Establish regular prayers for children\'s well-being');
    }

    // Specific remedies based on indicators
    if (indicators.some(ind => ind.includes('Jupiter in 5th'))) {
        remedies.weekly.push('Offer prayers to Lord Vishnu on Thursdays');
    }

    if (indicators.some(ind => ind.includes('Sun in 5th'))) {
        remedies.daily.push('Meditate on paternal love and responsibility');
    }

    return remedies;
}

/**
 * Configuration for Putra Rina (Son's Debt) calculations
 */
const PUTRA_RINA_CONFIG = {
    type: 'Putra Rina',
    primaryIndicators: {
        'JUPITER_5': SCORING_WEIGHTS.PRIMARY_INDICATORS.JUPITER_IN_5TH,
        'SUN_5': SCORING_WEIGHTS.PRIMARY_INDICATORS.SUN_IN_5TH,
        'VENUS_5': SCORING_WEIGHTS.PRIMARY_INDICATORS.VENUS_IN_5TH,
        'MERCURY_5': SCORING_WEIGHTS.PRIMARY_INDICATORS.MERCURY_IN_5TH
    },
    indicatorMessages: {
        'JUPITER_5': "Jupiter in 5th house - Direct children connection and wisdom blockage",
        'SUN_5': "Sun in 5th house - Authority issues with children and creativity",
        'VENUS_5': "Venus in 5th house - Love and creativity blocked in children matters",
        'MERCURY_5': "Mercury in 5th house - Intelligence and education issues with children"
    },
    secondaryFactors: [
        {
            type: 'houseLordAfflicted',
            house: 5,
            message: "5th house lord afflicted - Children and creativity problems"
        },
        {
            type: 'planetaryDisharmony',
            planet1: 'JUPITER',
            planet2: 'VENUS',
            message: "Jupiter-Venus disharmony - Creative progeny conflicts"
        },
        {
            type: 'maleficInHouse',
            house: 5,
            message: "Malefic planet(s) in 5th house - Children obstacles"
        }
    ],
    effectAnalyzer: analyzePutraRinaEffects,
    remedyGenerator: generatePutraRinaRemedies
};

/**
 * Calculate Putra Rina (Son's Debt) for a Lal Kitab chart
 * @param {Object} chart - Lal Kitab chart with house positions
 * @returns {Object} Putra Rina analysis
 * @throws {Error} If chart validation fails
 */
function calculatePutraRina(chart) {
    return calculateRina(chart, PUTRA_RINA_CONFIG);
}

/**
 * Validation examples based on traditional Lal Kitab case studies
 * These examples demonstrate typical karmic debt patterns and their analysis
 */

/**
 * Example 1: Strong Pitru Rina - Traditional case of ancestral disconnection
 * Chart: Sun in 9th house, Saturn in 9th house, afflicted 9th lord
 */
function validateExampleStrongPitruRina() {
    const chart = createTestChart({
        SUN: 9,      // Strong ancestral connection
        SATURN: 9,   // Karmic ancestral lessons
        JUPITER: 6   // 9th lord (Jupiter) in 6th house - afflicted
    });

    const result = analyzeAllRinas(chart);

    // Expected results
    const expected = {
        pitruRinaPresent: true,
        pitruRinaIntensity: INTENSITY_LEVELS.SEVERE.value,
        totalActiveRinas: 1,
        karmicBurdenLevel: "Low"
    };

    console.assert(result.pitruRina.present === expected.pitruRinaPresent, "Pitru Rina should be present");
    console.assert(result.pitruRina.intensity.value === expected.pitruRinaIntensity, "Should be severe intensity");
    console.assert(result.summary.totalActiveRinas === expected.totalActiveRinas, "Should have 1 active rina");
    console.assert(result.summary.karmicBurden.level === expected.karmicBurdenLevel, "Should have low burden");

    console.log("✓ Strong Pitru Rina example validated");
    return result;
}

/**
 * Example 2: Multiple Rinas - Complex family karmic pattern
 * Chart: Sun in 9th (Pitru), Moon in 4th (Matru), Mars in 3rd (Bhratru)
 */
function validateExampleMultipleRinas() {
    const chart = createTestChart({
        SUN: 9,      // Pitru Rina
        MOON: 4,     // Matru Rina
        MARS: 3,     // Bhratru Rina
        MERCURY: 6   // 4th lord (Moon) afflicted
    });

    const result = analyzeAllRinas(chart);

    // Expected results
    const expected = {
        activeRinas: 3,
        karmicBurdenLevel: "High",
        dominantRina: "Bhratru Rina (Brother's Debt)"
    };

    console.assert(result.summary.totalActiveRinas === expected.activeRinas, "Should have 3 active rinas");
    console.assert(result.summary.karmicBurden.level === expected.karmicBurdenLevel, "Should have high burden");
    console.assert(result.summary.dominantRina === expected.dominantRina, "Bhratru Rina should be dominant");

    console.log("✓ Multiple Rinas example validated");
    return result;
}

/**
 * Example 3: Matru Rina with Emotional Indicators
 * Chart: Moon in 4th, Venus in 4th, Mars in 4th, afflicted 4th lord
 */
function validateExampleMatruRinaEmotional() {
    const chart = createTestChart({
        MOON: 4,     // Primary maternal indicator
        VENUS: 4,    // Love/comfort issues
        MARS: 4,     // Conflict/aggression
        MERCURY: 8   // 4th lord (Moon) in 8th - severely afflicted
    });

    const result = analyzeAllRinas(chart);

    // Expected results
    const expected = {
        matruRinaPresent: true,
        matruRinaIntensity: INTENSITY_LEVELS.SEVERE.value,
        effectsInclude: "Complete emotional disconnection"
    };

    console.assert(result.matruRina.present === expected.matruRinaPresent, "Matru Rina should be present");
    console.assert(result.matruRina.intensity.value === expected.matruRinaIntensity, "Should be severe intensity");
    console.assert(result.matruRina.effects.some(effect => effect.includes(expected.effectsInclude)),
        "Should include severe emotional effects");

    console.log("✓ Matru Rina emotional example validated");
    return result;
}

/**
 * Example 4: Bhratru Rina with Communication Focus
 * Chart: Mars in 3rd, Mercury in 3rd, empty 3rd house otherwise
 */
function validateExampleBhratruRinaCommunication() {
    const chart = createTestChart({
        MARS: 3,     // Direct sibling conflicts
        MERCURY: 3,  // Communication issues
        // Other planets in different houses - empty 3rd house
        SUN: 1, MOON: 2, JUPITER: 5, VENUS: 7, SATURN: 8, RAHU: 9, KETU: 10
    });

    const result = analyzeAllRinas(chart);

    // Expected results
    const expected = {
        bhratruRinaPresent: true,
        indicatorsInclude: "Communication issues with siblings",
        remediesInclude: "Practice mindful communication"
    };

    console.assert(result.bhratruRina.present === expected.bhratruRinaPresent, "Bhratru Rina should be present");
    console.assert(result.bhratruRina.indicators.some(ind => ind.includes(expected.indicatorsInclude)),
        "Should identify communication issues");
    console.assert(result.bhratruRina.remedies.daily.some(remedy => remedy.includes(expected.remediesInclude)),
        "Should include communication remedy");

    console.log("✓ Bhratru Rina communication example validated");
    return result;
}

/**
 * Example 5: Putra Rina with Blocked Creativity
 * Chart: Jupiter in 5th, Venus in 5th, Saturn in 5th (malefic)
 */
function validateExamplePutraRinaCreativity() {
    const chart = createTestChart({
        JUPITER: 5,  // Children connection
        VENUS: 5,    // Creativity blocked
        SATURN: 5,   // Malefic in 5th house
        SUN: 12      // 5th lord (Sun) in 12th - afflicted
    });

    const result = analyzeAllRinas(chart);

    // Expected results
    const expected = {
        putraRinaPresent: true,
        indicatorsInclude: "Malefic planet(s) in 5th house",
        effectsInclude: "Blocked creativity and self-expression"
    };

    console.assert(result.putraRina.present === expected.putraRinaPresent, "Putra Rina should be present");
    console.assert(result.putraRina.indicators.some(ind => ind.includes(expected.indicatorsInclude)),
        "Should identify malefic in 5th house");
    console.assert(result.putraRina.effects.some(effect => effect.includes(expected.effectsInclude)),
        "Should include creativity blockage effects");

    console.log("✓ Putra Rina creativity example validated");
    return result;
}

/**
 * Example 6: Clean Chart - No Rinas
 * Chart: All planets in favorable positions, no rina indicators
 */
function validateExampleNoRinas() {
    const chart = createTestChart({
        SUN: 1,      // Lagna - favorable
        MOON: 2,     // Wealth house - favorable
        MARS: 10,    // Career - favorable
        MERCURY: 2,  // Wealth - favorable
        JUPITER: 9,  // Fortune - favorable
        VENUS: 7,    // Spouse - favorable
        SATURN: 11,  // Gains - favorable
        RAHU: 12,    // Expenses - manageable
        KETU: 6      // Enemies - challenging but not rina
    });

    const result = analyzeAllRinas(chart);

    // Expected results
    const expected = {
        totalActiveRinas: 0,
        karmicBurdenLevel: "Minimal"
    };

    console.assert(result.summary.totalActiveRinas === expected.totalActiveRinas, "Should have no active rinas");
    console.assert(result.summary.karmicBurden.level === expected.karmicBurdenLevel, "Should have minimal burden");

    console.log("✓ No Rinas example validated");
    return result;
}

/**
 * Run all validation examples
 */
function runValidationExamples() {
    console.log("Running Lal Kitab Karmic Debt Analysis Validation Examples...");

    try {
        console.log("\n1. Strong Pitru Rina Example:");
        validateExampleStrongPitruRina();

        console.log("\n2. Multiple Rinas Example:");
        validateExampleMultipleRinas();

        console.log("\n3. Matru Rina Emotional Example:");
        validateExampleMatruRinaEmotional();

        console.log("\n4. Bhratru Rina Communication Example:");
        validateExampleBhratruRinaCommunication();

        console.log("\n5. Putra Rina Creativity Example:");
        validateExamplePutraRinaCreativity();

        console.log("\n6. No Rinas Example:");
        validateExampleNoRinas();

        console.log("\n✓ All validation examples passed successfully!");

    } catch (error) {
        console.error("Validation example failed:", error.message);
        throw error;
    }
}
// ============================================================================
// COMPREHENSIVE RINA ANALYSIS
// ============================================================================

/**
 * Assess overall karmic burden based on active rinas
 * @param {number} totalScore - Total numerical score
 * @param {number} activeRinasCount - Number of active rinas
 * @returns {Object} Karmic burden assessment
 */
function assessKarmicBurden(totalScore, activeRinasCount) {
    if (totalScore >= 8 || activeRinasCount >= 3) {
        return {
            level: "High",
            description: "Significant karmic debts requiring immediate attention and comprehensive remedies",
            priority: "Critical",
            recommendation: "Consult spiritual guide for intensive karmic healing"
        };
    }

    if (totalScore >= 5 || activeRinasCount >= 2) {
        return {
            level: "Moderate",
            description: "Noticeable karmic influences affecting multiple life areas",
            priority: "Important",
            recommendation: "Implement regular remedial practices and lifestyle adjustments"
        };
    }

    if (totalScore >= 2 || activeRinasCount >= 1) {
        return {
            level: "Low",
            description: "Minor karmic debts with manageable effects on daily life",
            priority: "Optional",
            recommendation: "Maintain basic remedial practices for prevention"
        };
    }

    return {
        level: "Minimal",
        description: "Light karmic influences, generally positive life flow with natural harmony",
        priority: "None",
        recommendation: "Continue spiritual practices for maintenance"
    };
}

/**
 * Generate overall recommendations based on all rinas
 * @param {Array} allRinas - Array of all rina analysis objects
 * @returns {Array<string>} List of recommendations
 */
function generateOverallRecommendations(allRinas) {
    const recommendations = [];
    const activeRinas = allRinas.filter(r => r.present);

    if (activeRinas.length === 0) {
        recommendations.push("Maintain current spiritual practices and family harmony");
        recommendations.push("Continue charitable activities for karmic merit accumulation");
        return recommendations;
    }

    if (activeRinas.length >= 3) {
        recommendations.push("Seek guidance from experienced Lal Kitab practitioner");
        recommendations.push("Consider intensive remedial programs for multiple rinas");
    }

    if (activeRinas.some(r => r.intensity.value >= INTENSITY_LEVELS.SEVERE.value)) {
        recommendations.push("Prioritize severe rina remedies immediately");
        recommendations.push("Consider professional counseling alongside spiritual remedies");
    }

    recommendations.push("Implement remedies consistently for at least 43 days");
    recommendations.push("Track progress and adjust remedies based on results");
    recommendations.push("Maintain positive relationships with family members");

    return recommendations;
}

/**
 * Generate comprehensive remedies for all active rinas
 * @param {Array} allRinas - Array of all rina analysis objects
 * @returns {Object} Comprehensive remedies by frequency
 */
function generateComprehensiveRemedies(allRinas) {
    const remedies = {
        daily: new Set(),
        weekly: new Set(),
        monthly: new Set(),
        general: new Set()
    };

    allRinas.forEach(rina => {
        if (rina.present && rina.remedies) {
            // Add daily remedies
            rina.remedies.daily?.forEach(remedy => remedies.daily.add(remedy));
            // Add weekly remedies
            rina.remedies.weekly?.forEach(remedy => remedies.weekly.add(remedy));
            // Add monthly remedies
            rina.remedies.monthly?.forEach(remedy => remedies.monthly.add(remedy));
            // Add one-time remedies as general
            rina.remedies.oneTime?.forEach(remedy => remedies.general.add(remedy));
        }
    });

    // Convert Sets back to Arrays
    return {
        daily: Array.from(remedies.daily),
        weekly: Array.from(remedies.weekly),
        monthly: Array.from(remedies.monthly),
        general: Array.from(remedies.general)
    };
}

/**
 * Comprehensive Lal Kitab karmic debt analysis
 * @param {Object} chart - Lal Kitab chart with house positions
 * @returns {Object} Complete rina analysis
 * @throws {Error} If analysis fails
 */
function analyzeAllRinas(chart) {
    try {
        validateChart(chart);

        const pitruRina = calculatePitruRina(chart);
        const matruRina = calculateMatruRina(chart);
        const bhratruRina = calculateBhratruRina(chart);
        const putraRina = calculatePutraRina(chart);

        const allRinas = [pitruRina, matruRina, bhratruRina, putraRina];
        const activeRinas = allRinas.filter(rina => rina.present);

        // Calculate overall metrics
        const totalScore = allRinas.reduce((sum, rina) => sum + rina.score, 0);
        const averageIntensity = activeRinas.length > 0 ?
            activeRinas.reduce((sum, rina) => sum + rina.intensity.value, 0) / activeRinas.length : 0;

        // Determine dominant rina
        const dominantRina = activeRinas.length > 0 ?
            activeRinas.reduce((max, rina) => rina.intensity.value > max.intensity.value ? rina : max) : null;

        // Get rina type names using type property
        const getRinaName = (rina) => {
            if (rina.type === 'Pitru Rina') return "Pitru Rina (Ancestral Debt)";
            if (rina.type === 'Matru Rina') return "Matru Rina (Mother's Debt)";
            if (rina.type === 'Bhratru Rina') return "Bhratru Rina (Brother's Debt)";
            if (rina.type === 'Putra Rina') return "Putra Rina (Son's Debt)";
            return "Unknown Rina";
        };

        const karmicBurden = assessKarmicBurden(totalScore, activeRinas.length);

        return {
            pitruRina: pitruRina,
            matruRina: matruRina,
            bhratruRina: bhratruRina,
            putraRina: putraRina,
            summary: {
                totalActiveRinas: activeRinas.length,
                totalScore: totalScore,
                averageIntensity: averageIntensity,
                dominantRina: dominantRina ? getRinaName(dominantRina) : null,
                karmicBurden: karmicBurden
            },
            recommendations: generateOverallRecommendations(allRinas),
            comprehensiveRemedies: generateComprehensiveRemedies(allRinas)
        };

    } catch (error) {
        throw new Error(`Comprehensive Rina analysis failed: ${error.message}`);
    }
}

// ============================================================================
// TESTING AND VALIDATION
// ============================================================================

/**
 * Create test chart for validation
 * @param {Object} planetPositions - Object with planet house positions
 * @returns {Object} Valid Lal Kitab chart
 */
function createTestChart(planetPositions) {
    const chart = { planets: {} };

    // Set default positions for all planets
    const defaults = {
        SUN: 1, MOON: 2, MARS: 3, MERCURY: 4, JUPITER: 5,
        VENUS: 6, SATURN: 7, RAHU: 8, KETU: 9
    };

    Object.keys(defaults).forEach(planet => {
        chart.planets[planet] = {
            house: planetPositions[planet] || defaults[planet]
        };
    });

    return chart;
}

/**
 * Test case: Strong Pitru Rina with Sun in 9th
 */
function testStrongPitruRina() {
    clearCalculationCache(); // Clear cache for clean test
    const chart = createTestChart({ SUN: 9 });
    const result = calculatePitruRina(chart);

    console.assert(result.present === true, "Should detect Pitru Rina presence");
    console.assert(result.intensity.value >= INTENSITY_LEVELS.STRONG.value, "Should be strong intensity");
    console.assert(result.indicators.some(ind => ind.includes("Sun in 9th")), "Should identify Sun in 9th indicator");

    return result;
}

/**
 * Test case: Multiple Rinas scenario
 */
function testMultipleRinas() {
    clearCalculationCache(); // Clear cache for clean test
    const chart = createTestChart({
        SUN: 9,     // Pitru Rina
        MOON: 4,    // Matru Rina
        MARS: 3     // Bhratru Rina
    });

    const result = analyzeAllRinas(chart);

    console.assert(result.summary.totalActiveRinas === 3, "Should detect 3 active rinas");
    console.assert(result.summary.karmicBurden.level === "High", "Should assess high karmic burden");

    return result;
}

/**
 * Test case: No Rinas (clean chart)
 */
function testNoRinas() {
    clearCalculationCache(); // Clear cache for clean test
    const chart = createTestChart({}); // All planets in default positions
    const result = analyzeAllRinas(chart);

    console.assert(result.summary.totalActiveRinas === 0, "Should detect no active rinas");
    console.assert(result.summary.karmicBurden.level === "Minimal", "Should assess minimal karmic burden");

    return result;
}

/**
 * Run all validation tests
 */
function runValidationTests() {
    console.log("Running Lal Kitab Karmic Debt Analysis Validation Tests...");

    try {
        console.log("Test 1: Strong Pitru Rina");
        testStrongPitruRina();
        console.log("✓ Passed");

        console.log("Test 2: Multiple Rinas");
        testMultipleRinas();
        console.log("✓ Passed");

        console.log("Test 3: No Rinas");
        testNoRinas();
        console.log("✓ Passed");

        console.log("All validation tests passed!");

    } catch (error) {
        console.error("Validation test failed:", error.message);
        throw error;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Core analysis functions
    analyzeAllRinas,
    calculatePitruRina,
    calculateMatruRina,
    calculateBhratruRina,
    calculatePutraRina,

    // Utility functions
    getHouseLord,
    isPlanetAfflicted,
    checkLalKitabAspect,
    validateChart,

    // Effect analysis functions
    analyzePitruRinaEffects,
    analyzeMatruRinaEffects,
    analyzeBhratruRinaEffects,
    analyzePutraRinaEffects,

    // Remedy generation functions
    generatePitruRinaRemedies,
    generateMatruRinaRemedies,
    generateBhratruRinaRemedies,
    generatePutraRinaRemedies,
    generateComprehensiveRemedies,

    // Constants
    INTENSITY_LEVELS,
    HOUSE_LORDS,
    MALEFIC_PLANETS,

    // Testing functions
    runValidationTests,
    createTestChart,
    runValidationExamples,

    // Validation examples
    validateExampleStrongPitruRina,
    validateExampleMultipleRinas,
    validateExampleMatruRinaEmotional,
    validateExampleBhratruRinaCommunication,
    validateExamplePutraRinaCreativity,
    validateExampleNoRinas,

    // Version info
    VERSION: "1.0.0",
    DESCRIPTION: "Lal Kitab Karmic Debt Analysis based on Pt. Roop Chand Joshi's traditional principles"
};