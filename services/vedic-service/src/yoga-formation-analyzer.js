/**
 * ZC1.24 Yoga Formation Analysis and Interpretation Implementation
 *
 * This module provides comprehensive algorithms for detecting and interpreting
 * major Vedic astrology Yogas including Raja Yoga, Dhana Yoga, Mahapurusha Yoga,
 * and other significant planetary combinations.
 *
 * @module yoga-formation-analyzer
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Yoga Analysis Constants
const YOGA_CONSTANTS = {
    // House Classifications
    KENDRA_HOUSES: [1, 4, 7, 10],           // Angular houses
    TRIKONA_HOUSES: [1, 5, 9],              // Trine houses
    DHANA_HOUSES: [2, 11],                  // Wealth houses
    MALEFIC_HOUSES: [6, 8, 12],             // Dusthana houses
    BENEFIC_HOUSES: [1, 2, 3, 4, 5, 7, 9, 10, 11], // Benefic houses

    // Yoga Strength Multipliers
    EXALTED_MULTIPLIER: 1.5,                // Exalted planet strength
    OWN_SIGN_MULTIPLIER: 1.25,              // Own sign strength
    FRIENDLY_SIGN_MULTIPLIER: 1.1,          // Friendly sign strength
    DEBILITATED_MULTIPLIER: 0.5,            // Debilitated planet strength
    ENEMY_SIGN_MULTIPLIER: 0.75,            // Enemy sign strength

    // Aspect Strength Values
    FULL_ASPECT: 1.0,                       // 7th house aspect
    THREE_QUARTER_ASPECT: 0.75,             // 4th/10th house aspects
    HALF_ASPECT: 0.5,                       // 5th/9th house aspects
    QUARTER_ASPECT: 0.25,                   // 3rd/11th house aspects

    // Yoga Formation Thresholds
    MINIMUM_YOGA_STRENGTH: 0.6,             // Minimum strength for Yoga formation
    STRONG_YOGA_THRESHOLD: 0.8,             // Strong Yoga threshold
    VERY_STRONG_YOGA_THRESHOLD: 0.9,        // Very strong Yoga threshold
};

// Planetary Relationships
const PLANETARY_RELATIONSHIPS = {
    SUN: {
        friends: ['MOON', 'MARS', 'JUPITER'],
        enemies: ['VENUS', 'SATURN'],
        neutral: ['MERCURY']
    },
    MOON: {
        friends: ['SUN', 'MERCURY'],
        enemies: ['RAHU', 'KETU'],
        neutral: ['MARS', 'JUPITER', 'VENUS', 'SATURN']
    },
    MARS: {
        friends: ['SUN', 'MOON', 'JUPITER'],
        enemies: ['MERCURY'],
        neutral: ['VENUS', 'SATURN']
    },
    MERCURY: {
        friends: ['SUN', 'VENUS'],
        enemies: ['MOON'],
        neutral: ['MARS', 'JUPITER', 'SATURN']
    },
    JUPITER: {
        friends: ['SUN', 'MOON', 'MARS'],
        enemies: ['MERCURY', 'VENUS'],
        neutral: ['SATURN']
    },
    VENUS: {
        friends: ['MERCURY', 'SATURN'],
        enemies: ['SUN', 'MOON'],
        neutral: ['MARS', 'JUPITER']
    },
    SATURN: {
        friends: ['MERCURY', 'VENUS'],
        enemies: ['SUN', 'MOON', 'MARS'],
        neutral: ['JUPITER']
    },
    RAHU: {
        friends: ['VENUS', 'SATURN'],
        enemies: ['SUN', 'MOON'],
        neutral: ['MARS', 'MERCURY', 'JUPITER']
    },
    KETU: {
        friends: ['VENUS', 'SATURN'],
        enemies: ['SUN', 'MOON'],
        neutral: ['MARS', 'MERCURY', 'JUPITER']
    }
};

// Sign Lords
const SIGN_LORDS = [
    'MARS',    // Aries
    'VENUS',   // Taurus
    'MERCURY', // Gemini
    'MOON',    // Cancer
    'SUN',     // Leo
    'MERCURY', // Virgo
    'VENUS',   // Libra
    'MARS',    // Scorpio
    'JUPITER', // Sagittarius
    'SATURN',  // Capricorn
    'SATURN',  // Aquarius
    'JUPITER'  // Pisces
];

// Exaltation and Debilitation Signs
const PLANETARY_DIGNITIES = {
    SUN: { exaltation: 0, debilitation: 6 },       // Aries exalted, Libra debilitated
    MOON: { exaltation: 1, debilitation: 7 },      // Taurus exalted, Scorpio debilitated
    MARS: { exaltation: 9, debilitation: 3 },      // Capricorn exalted, Cancer debilitated
    MERCURY: { exaltation: 5, debilitation: 11 },  // Virgo exalted, Pisces debilitated
    JUPITER: { exaltation: 8, debilitation: 2 },   // Cancer exalted, Capricorn debilitated
    VENUS: { exaltation: 11, debilitation: 5 },    // Pisces exalted, Virgo debilitated
    SATURN: { exaltation: 6, debilitation: 0 },    // Libra exalted, Aries debilitated
    RAHU: { exaltation: 2, debilitation: 8 },      // Gemini exalted, Sagittarius debilitated
    KETU: { exaltation: 8, debilitation: 2 }       // Sagittarius exalted, Gemini debilitated
};

const YOGA_CATEGORIES = {
    RAJA_YOGA: {
        name: 'Raja Yoga',
        category: 'Power and Authority',
        description: 'Combinations indicating leadership, power, and high status',
        types: ['Kendra-Trikona Yoga', 'Dharma-Karma Yoga', 'Lagna-Kendra Yoga']
    },
    DHANA_YOGA: {
        name: 'Dhana Yoga',
        category: 'Wealth and Prosperity',
        description: 'Combinations indicating financial success and material abundance',
        types: ['Labha-Dhana Yoga', 'Jupiter-Venus Yoga', 'Second-Eleventh Yoga']
    },
    MAHAPURUSHA_YOGA: {
        name: 'Mahapurusha Yoga',
        category: 'Great Person',
        description: 'Combinations formed by planets in own or exalted signs in kendras',
        types: ['Pancha Mahapurusha', 'Individual Planet Yogas']
    },
    SPECIAL_YOGAS: {
        name: 'Special Yogas',
        category: 'Unique Combinations',
        description: 'Rare and powerful planetary combinations',
        types: ['Gaja Kesari', 'Neecha Bhanga', 'Viparita Raja', 'Parivartana']
    }
};

const YOGA_STRENGTH_LEVELS = {
    WEAK: { min: 0.6, max: 0.7, description: 'Present but weak influence' },
    MODERATE: { min: 0.7, max: 0.8, description: 'Noticeable influence' },
    STRONG: { min: 0.8, max: 0.9, description: 'Strong influence on life' },
    VERY_STRONG: { min: 0.9, max: 1.0, description: 'Dominant life influence' }
};

/**
 * Calculate planetary dignity strength
 * @param {string} planet - Planet name
 * @param {number} sign - Sign number (0-11)
 * @returns {number} Dignity strength multiplier
 */
function calculateDignityStrength(planet, sign) {
    const dignities = PLANETARY_DIGNITIES[planet];

    if (dignities.exaltation === sign) return YOGA_CONSTANTS.EXALTED_MULTIPLIER;
    if (SIGN_LORDS[sign] === planet) return YOGA_CONSTANTS.OWN_SIGN_MULTIPLIER;

    const relationships = PLANETARY_RELATIONSHIPS[planet];
    const signLord = SIGN_LORDS[sign];

    if (relationships.friends.includes(signLord)) return YOGA_CONSTANTS.FRIENDLY_SIGN_MULTIPLIER;
    if (relationships.enemies.includes(signLord)) return YOGA_CONSTANTS.ENEMY_SIGN_MULTIPLIER;

    return 1.0; // Neutral
}

/**
 * Check if planet is in kendra house
 * @param {number} house - House number (1-12)
 * @returns {boolean} True if in kendra
 */
function isInKendra(house) {
    return YOGA_CONSTANTS.KENDRA_HOUSES.includes(house);
}

/**
 * Check if planet is in trikona house
 * @param {number} house - House number (1-12)
 * @returns {boolean} True if in trikona
 */
function isInTrikona(house) {
    return YOGA_CONSTANTS.TRIKONA_HOUSES.includes(house);
}

/**
 * Calculate aspect strength between two planets
 * @param {number} planet1House - First planet's house
 * @param {number} planet2House - Second planet's house
 * @returns {number} Aspect strength (0-1)
 */
function calculateAspectStrength(planet1House, planet2House) {
    const houseDifference = Math.abs(planet1House - planet2House);
    const normalizedDiff = Math.min(houseDifference, 12 - houseDifference);

    switch (normalizedDiff) {
        case 1: return YOGA_CONSTANTS.QUARTER_ASPECT;     // 2/12 aspect
        case 2: return YOGA_CONSTANTS.HALF_ASPECT;        // 3/11 aspect
        case 3: return YOGA_CONSTANTS.THREE_QUARTER_ASPECT; // 4/10 aspect
        case 4: return YOGA_CONSTANTS.HALF_ASPECT;        // 5/9 aspect
        case 5: return YOGA_CONSTANTS.QUARTER_ASPECT;     // 6/8 aspect
        case 6: return YOGA_CONSTANTS.FULL_ASPECT;        // 7/7 aspect
        default: return 0;
    }
}

/**
 * Get house lord for a given house
 * @param {number} house - House number (1-12)
 * @param {number} ascendantSign - Ascendant sign (0-11)
 * @returns {string} House lord planet
 */
function getHouseLord(house, ascendantSign) {
    const houseSign = (ascendantSign + house - 1) % 12;
    return SIGN_LORDS[houseSign];
}

/**
 * Generic function to get yoga effects based on strength
 * @param {number} strength - Yoga strength (0-1)
 * @param {Object} effectsMap - Map of effects by strength level
 * @returns {Object} Effects object
 */
function getYogaEffects(strength, effectsMap) {
    let level;
    if (strength >= YOGA_CONSTANTS.VERY_STRONG_YOGA_THRESHOLD) {
        level = 'veryStrong';
    } else if (strength >= YOGA_CONSTANTS.STRONG_YOGA_THRESHOLD) {
        level = 'strong';
    } else {
        level = 'moderate';
    }
    return effectsMap[level];
}

/**
 * Detect Kendra-Trikona Raja Yoga
 * Rule: Lords of kendra and trikona houses exchange signs or aspect each other
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectKendraTrikonaYoga(birthChart) {
    const yogas = [];
    const kendraLords = [];
    const trikonaLords = [];

    // Get kendra and trikona lords
    for (const house of YOGA_CONSTANTS.KENDRA_HOUSES) {
        kendraLords.push(getHouseLord(house, birthChart.ascendant.sign));
    }

    for (const house of YOGA_CONSTANTS.TRIKONA_HOUSES) {
        trikonaLords.push(getHouseLord(house, birthChart.ascendant.sign));
    }

    // Check for parivartana (exchange) between kendra and trikona lords
    for (const kendraLord of kendraLords) {
        for (const trikonaLord of trikonaLords) {
            if (kendraLord !== trikonaLord) {
                const kendraSign = SIGN_LORDS.indexOf(kendraLord);
                const trikonaSign = SIGN_LORDS.indexOf(trikonaLord);

                // Check if planets are in each other's signs
                const kendraPlanetSign = Math.floor(birthChart.planets[kendraLord].longitude / 30);
                const trikonaPlanetSign = Math.floor(birthChart.planets[trikonaLord].longitude / 30);

                if (kendraPlanetSign === trikonaSign && trikonaPlanetSign === kendraSign) {
                    const strength = calculateYogaStrength(birthChart, [kendraLord, trikonaLord]);

                    yogas.push({
                        name: 'Kendra-Trikona Raja Yoga',
                        type: 'PARIVARTANA',
                        planets: [kendraLord, trikonaLord],
                        strength: strength,
                        description: `${kendraLord} and ${trikonaLord} exchange signs`,
                        effects: getRajaYogaEffects(strength),
                        houses: [YOGA_CONSTANTS.KENDRA_HOUSES[kendraLords.indexOf(kendraLord)], YOGA_CONSTANTS.TRIKONA_HOUSES[trikonaLords.indexOf(trikonaLord)]]
                    });
                }
            }
        }
    }

    return yogas;
}

/**
 * Detect Dharma-Karma Raja Yoga
 * Rule: 9th and 10th house lords in mutual kendras or aspecting each other
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectDharmaKarmaYoga(birthChart) {
    const ninthLord = getHouseLord(9, birthChart.ascendant.sign);
    const tenthLord = getHouseLord(10, birthChart.ascendant.sign);

    const ninthHouse = birthChart.planets[ninthLord].house;
    const tenthHouse = birthChart.planets[tenthLord].house;

    let strength = 0;
    let yogaType = '';

    // Check if 9th lord is in 10th house or vice versa
    if ((ninthHouse === 10 && tenthHouse === 9) ||
        (ninthHouse === 9 && tenthHouse === 10)) {
        strength = calculateYogaStrength(birthChart, [ninthLord, tenthLord]);
        yogaType = 'MUTUAL_HOUSES';
    }
    // Check if both are in kendras
    else if (isInKendra(ninthHouse) && isInKendra(tenthHouse)) {
        strength = calculateYogaStrength(birthChart, [ninthLord, tenthLord]) * 0.8;
        yogaType = 'BOTH_IN_KENDRAS';
    }
    // Check if lords are aspecting each other
    else {
        const aspectStrength = calculateAspectStrength(ninthHouse, tenthHouse);
        if (aspectStrength > 0) {
            strength = calculateYogaStrength(birthChart, [ninthLord, tenthLord]) * aspectStrength;
            yogaType = 'MUTUAL_ASPECT';
        }
    }

    if (strength >= YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH) {
        return [{
            name: 'Dharma-Karma Raja Yoga',
            type: yogaType,
            planets: [ninthLord, tenthLord],
            strength: strength,
            description: `9th lord ${ninthLord} and 10th lord ${tenthLord} form powerful combination`,
            effects: getRajaYogaEffects(strength),
            houses: [9, 10]
        }];
    }

    return [];
}

/**
 * Get Raja Yoga effects based on strength
 * @param {number} strength - Yoga strength (0-1)
 * @returns {Object} Effects object
 */
function getRajaYogaEffects(strength) {
    const effectsMap = {
        veryStrong: {
            power: 'Exceptional leadership and authority',
            career: 'High-level executive positions, government roles',
            wealth: 'Substantial wealth through position and influence',
            recognition: 'National or international fame',
            duration: 'Lifelong influence'
        },
        strong: {
            power: 'Strong leadership qualities',
            career: 'Management positions, influential roles',
            wealth: 'Good income through career',
            recognition: 'Local or professional recognition',
            duration: 'Major part of career'
        },
        moderate: {
            power: 'Leadership potential',
            career: 'Supervisory or team lead positions',
            wealth: 'Above average income',
            recognition: 'Professional respect',
            duration: 'Intermittent influence'
        }
    };
    return getYogaEffects(strength, effectsMap);
}

/**
 * Detect Labha-Dhana Yoga
 * Rule: 2nd and 11th house lords in mutual houses or strong positions
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectLabhaDhanaYoga(birthChart) {
    const secondLord = getHouseLord(2, birthChart.ascendant.sign);
    const eleventhLord = getHouseLord(11, birthChart.ascendant.sign);

    const secondHouse = birthChart.planets[secondLord].house;
    const eleventhHouse = birthChart.planets[eleventhLord].house;

    let strength = 0;
    let yogaType = '';

    // Check if 2nd lord is in 11th house or vice versa
    if ((secondHouse === 11 && eleventhHouse === 2) ||
        (secondHouse === 2 && eleventhHouse === 11)) {
        strength = calculateYogaStrength(birthChart, [secondLord, eleventhLord]);
        yogaType = 'MUTUAL_HOUSES';
    }
    // Check if both lords are in dhana houses
    else if (YOGA_CONSTANTS.DHANA_HOUSES.includes(secondHouse) &&
             YOGA_CONSTANTS.DHANA_HOUSES.includes(eleventhHouse)) {
        strength = calculateYogaStrength(birthChart, [secondLord, eleventhLord]) * 0.9;
        yogaType = 'BOTH_IN_DHANA_HOUSES';
    }
    // Check if lords are in beneficial positions
    else if (YOGA_CONSTANTS.BENEFIC_HOUSES.includes(secondHouse) &&
             YOGA_CONSTANTS.BENEFIC_HOUSES.includes(eleventhHouse)) {
        strength = calculateYogaStrength(birthChart, [secondLord, eleventhLord]) * 0.7;
        yogaType = 'BOTH_IN_BENEFIC_HOUSES';
    }

    if (strength >= YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH) {
        return [{
            name: 'Labha-Dhana Yoga',
            type: yogaType,
            planets: [secondLord, eleventhLord],
            strength: strength,
            description: `2nd lord ${secondLord} and 11th lord ${eleventhLord} create wealth combination`,
            effects: getDhanaYogaEffects(strength),
            houses: [2, 11]
        }];
    }

    return [];
}

/**
 * Detect Jupiter-Venus Dhana Yoga
 * Rule: Jupiter and Venus in beneficial positions creating wealth
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectJupiterVenusDhanaYoga(birthChart) {
    const jupiterHouse = birthChart.planets.JUPITER.house;
    const venusHouse = birthChart.planets.VENUS.house;

    const jupiterSign = Math.floor(birthChart.planets.JUPITER.longitude / 30);
    const venusSign = Math.floor(birthChart.planets.VENUS.longitude / 30);

    let strength = 0;
    let yogaType = '';

    // Check if both are in dhana houses
    if (YOGA_CONSTANTS.DHANA_HOUSES.includes(jupiterHouse) &&
        YOGA_CONSTANTS.DHANA_HOUSES.includes(venusHouse)) {
        strength = calculateYogaStrength(birthChart, ['JUPITER', 'VENUS']);
        yogaType = 'BOTH_IN_DHANA_HOUSES';
    }
    // Check if both are in trikona houses
    else if (isInTrikona(jupiterHouse) && isInTrikona(venusHouse)) {
        strength = calculateYogaStrength(birthChart, ['JUPITER', 'VENUS']) * 0.9;
        yogaType = 'BOTH_IN_TRIKONA_HOUSES';
    }
    // Check if Jupiter aspects Venus or vice versa
    else {
        const aspectStrength = calculateAspectStrength(jupiterHouse, venusHouse);
        if (aspectStrength > 0) {
            strength = calculateYogaStrength(birthChart, ['JUPITER', 'VENUS']) * aspectStrength;
            yogaType = 'MUTUAL_ASPECT';
        }
    }

    if (strength >= YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH) {
        return [{
            name: 'Jupiter-Venus Dhana Yoga',
            type: yogaType,
            planets: ['JUPITER', 'VENUS'],
            strength: strength,
            description: 'Jupiter and Venus combination for wealth and prosperity',
            effects: getDhanaYogaEffects(strength),
            houses: [jupiterHouse, venusHouse]
        }];
    }

    return [];
}

/**
 * Get Dhana Yoga effects based on strength
 * @param {number} strength - Yoga strength (0-1)
 * @returns {Object} Effects object
 */
function getDhanaYogaEffects(strength) {
    const effectsMap = {
        veryStrong: {
            wealth: 'Exceptional financial success and abundance',
            sources: 'Multiple income sources, investments, business',
            stability: 'Long-term financial security',
            generosity: 'Philanthropic tendencies',
            duration: 'Lifelong prosperity'
        },
        strong: {
            wealth: 'Strong financial position',
            sources: 'Good career income, property gains',
            stability: 'Financial stability with occasional windfalls',
            generosity: 'Charitable nature',
            duration: 'Most of adult life'
        },
        moderate: {
            wealth: 'Above average financial status',
            sources: 'Steady income, occasional gains',
            stability: 'Reasonable financial security',
            generosity: 'Generous when possible',
            duration: 'Intermittent financial success'
        }
    };
    return getYogaEffects(strength, effectsMap);
}

/**
 * Detect Pancha Mahapurusha Yogas
 * Rule: Planets in own sign or exalted in kendra houses
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectPanchaMahapurushaYoga(birthChart) {
    const yogas = [];
    const panchaMahapurusha = {
        MARS: 'Ruchaka Yoga',
        MERCURY: 'Bhadra Yoga',
        JUPITER: 'Hamsa Yoga',
        VENUS: 'Malavya Yoga',
        SATURN: 'Sasha Yoga'
    };

    for (const planet in panchaMahapurusha) {
        const planetData = birthChart.planets[planet];
        const planetSign = Math.floor(planetData.longitude / 30);
        const planetHouse = planetData.house;

        // Check if planet is in kendra
        if (isInKendra(planetHouse)) {
            let strength = 0;
            let yogaType = '';

            // Check if in own sign
            if (SIGN_LORDS[planetSign] === planet) {
                strength = YOGA_CONSTANTS.OWN_SIGN_MULTIPLIER;
                yogaType = 'OWN_SIGN';
            }
            // Check if exalted
            else if (PLANETARY_DIGNITIES[planet].exaltation === planetSign) {
                strength = YOGA_CONSTANTS.EXALTED_MULTIPLIER;
                yogaType = 'EXALTED';
            }

            if (strength > 0) {
                // Apply additional strength based on planetary condition
                strength *= calculateDignityStrength(planet, planetSign);

                if (strength >= YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH) {
                    yogas.push({
                        name: panchaMahapurusha[planet],
                        type: 'PANCHA_MAHAPURUSHA',
                        planet: planet,
                        strength: strength,
                        description: `${planet} in ${yogaType.toLowerCase()} position in ${planetHouse}th house`,
                        effects: getMahapurushaEffects(planet, strength),
                        house: planetHouse,
                        sign: planetSign
                    });
                }
            }
        }
    }

    return yogas;
}

/**
 * Detect general Mahapurusha Yoga
 * Rule: Any planet in own sign or exalted in kendra
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectGeneralMahapurushaYoga(birthChart) {
    const yogas = [];
    const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];

    for (const planet of planets) {
        const planetData = birthChart.planets[planet];
        const planetSign = Math.floor(planetData.longitude / 30);
        const planetHouse = planetData.house;

        if (isInKendra(planetHouse)) {
            let strength = 0;
            let yogaType = '';

            if (SIGN_LORDS[planetSign] === planet) {
                strength = YOGA_CONSTANTS.OWN_SIGN_MULTIPLIER;
                yogaType = 'OWN_SIGN';
            } else if (PLANETARY_DIGNITIES[planet].exaltation === planetSign) {
                strength = YOGA_CONSTANTS.EXALTED_MULTIPLIER;
                yogaType = 'EXALTED';
            }

            if (strength > 0) {
                strength *= calculateDignityStrength(planet, planetSign);

                if (strength >= YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH) {
                    yogas.push({
                        name: `${planet} Mahapurusha Yoga`,
                        type: 'GENERAL_MAHAPURUSHA',
                        planet: planet,
                        strength: strength,
                        description: `${planet} in ${yogaType.toLowerCase()} position in kendra`,
                        effects: getGeneralMahapurushaEffects(planet, strength),
                        house: planetHouse,
                        sign: planetSign
                    });
                }
            }
        }
    }

    return yogas;
}

/**
 * Get Pancha Mahapurusha Yoga effects
 * @param {string} planet - Planet name
 * @param {number} strength - Yoga strength
 * @returns {Object} Effects object
 */
function getMahapurushaEffects(planet, strength) {
    const effects = {
        MARS: {
            qualities: 'Courage, leadership, military prowess',
            career: 'Military, police, sports, surgery',
            personality: 'Brave, competitive, pioneering spirit'
        },
        MERCURY: {
            qualities: 'Intelligence, communication, business acumen',
            career: 'Business, writing, teaching, law',
            personality: 'Intelligent, adaptable, good communicator'
        },
        JUPITER: {
            qualities: 'Wisdom, spirituality, teaching ability',
            career: 'Teaching, religion, law, counseling',
            personality: 'Wise, philosophical, benevolent'
        },
        VENUS: {
            qualities: 'Artistic talent, luxury, relationship skills',
            career: 'Arts, entertainment, luxury goods, diplomacy',
            personality: 'Charming, artistic, pleasure-loving'
        },
        SATURN: {
            qualities: 'Discipline, perseverance, justice',
            career: 'Government, law, engineering, agriculture',
            personality: 'Disciplined, responsible, serious'
        }
    };

    const baseEffects = effects[planet];

    if (strength >= YOGA_CONSTANTS.VERY_STRONG_YOGA_THRESHOLD) {
        return {
            ...baseEffects,
            intensity: 'Exceptional manifestation',
            fame: 'National recognition',
            duration: 'Lifelong influence'
        };
    } else if (strength >= YOGA_CONSTANTS.STRONG_YOGA_THRESHOLD) {
        return {
            ...baseEffects,
            intensity: 'Strong manifestation',
            fame: 'Professional recognition',
            duration: 'Major career influence'
        };
    } else {
        return {
            ...baseEffects,
            intensity: 'Moderate manifestation',
            fame: 'Local recognition',
            duration: 'Career support'
        };
    }
}

/**
 * Get general Mahapurusha Yoga effects
 * @param {string} planet - Planet name
 * @param {number} strength - Yoga strength
 * @returns {Object} Effects object
 */
function getGeneralMahapurushaEffects(planet, strength) {
    const effects = {
        SUN: {
            qualities: 'Leadership, vitality, authority',
            career: 'Government, administration, politics',
            personality: 'Confident, ambitious, charismatic'
        },
        MOON: {
            qualities: 'Emotional intelligence, nurturing, intuition',
            career: 'Healthcare, counseling, public service',
            personality: 'Empathetic, caring, intuitive'
        },
        MARS: {
            qualities: 'Courage, leadership, military prowess',
            career: 'Military, police, sports, surgery',
            personality: 'Brave, competitive, pioneering spirit'
        },
        MERCURY: {
            qualities: 'Intelligence, communication, business acumen',
            career: 'Business, writing, teaching, law',
            personality: 'Intelligent, adaptable, good communicator'
        },
        JUPITER: {
            qualities: 'Wisdom, spirituality, teaching ability',
            career: 'Teaching, religion, law, counseling',
            personality: 'Wise, philosophical, benevolent'
        },
        VENUS: {
            qualities: 'Artistic talent, luxury, relationship skills',
            career: 'Arts, entertainment, luxury goods, diplomacy',
            personality: 'Charming, artistic, pleasure-loving'
        },
        SATURN: {
            qualities: 'Discipline, perseverance, justice',
            career: 'Government, law, engineering, agriculture',
            personality: 'Disciplined, responsible, serious'
        }
    };

    const baseEffects = effects[planet];

    if (strength >= YOGA_CONSTANTS.VERY_STRONG_YOGA_THRESHOLD) {
        return {
            ...baseEffects,
            intensity: 'Exceptional manifestation',
            fame: 'National recognition',
            duration: 'Lifelong influence'
        };
    } else if (strength >= YOGA_CONSTANTS.STRONG_YOGA_THRESHOLD) {
        return {
            ...baseEffects,
            intensity: 'Strong manifestation',
            fame: 'Professional recognition',
            duration: 'Major career influence'
        };
    } else {
        return {
            ...baseEffects,
            intensity: 'Moderate manifestation',
            fame: 'Local recognition',
            duration: 'Career support'
        };
    }
}

/**
 * Detect Gaja Kesari Yoga
 * Rule: Moon and Jupiter in kendra from each other
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectGajaKesariYoga(birthChart) {
    const moonHouse = birthChart.planets.MOON.house;
    const jupiterHouse = birthChart.planets.JUPITER.house;

    const houseDifference = Math.abs(moonHouse - jupiterHouse);
    const isKendraDistance = [1, 3, 4, 7, 9, 10].includes(Math.min(houseDifference, 12 - houseDifference));

    if (isKendraDistance) {
        const strength = calculateYogaStrength(birthChart, ['MOON', 'JUPITER']);

        if (strength >= YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH) {
            return [{
                name: 'Gaja Kesari Yoga',
                type: 'MOON_JUPITER_KENDRA',
                planets: ['MOON', 'JUPITER'],
                strength: strength,
                description: 'Moon and Jupiter in kendra positions from each other',
                effects: getGajaKesariEffects(strength),
                houses: [moonHouse, jupiterHouse]
            }];
        }
    }

    return [];
}

/**
 * Detect Neecha Bhanga Raja Yoga
 * Rule: Cancellation of debilitation through various factors
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectNeechaBhangaYoga(birthChart) {
    const yogas = [];

    for (const planet in PLANETARY_DIGNITIES) {
        const planetData = birthChart.planets[planet];
        if (!planetData) continue;
        const planetSign = Math.floor(planetData.longitude / 30);

        // Check if planet is debilitated
        if (PLANETARY_DIGNITIES[planet].debilitation === planetSign) {
            let cancellationStrength = 0;
            const cancellationFactors = [];

            // Factor 1: Exalted dispositor
            const dispositor = SIGN_LORDS[planetSign];
            const dispositorSign = Math.floor(birthChart.planets[dispositor].longitude / 30);

            if (PLANETARY_DIGNITIES[dispositor].exaltation === dispositorSign) {
                cancellationStrength += 0.4;
                cancellationFactors.push('EXALTED_DISPOSITOR');
            }

            // Factor 2: In kendra house
            if (isInKendra(planetData.house)) {
                cancellationStrength += 0.3;
                cancellationFactors.push('IN_KENDRA');
            }

            // Factor 3: Aspect from exalted planet
            // (Simplified check - full implementation would check all aspects)

            if (cancellationStrength >= 0.6) {
                yogas.push({
                    name: 'Neecha Bhanga Raja Yoga',
                    type: 'DEBILITATION_CANCELLATION',
                    planet: planet,
                    strength: cancellationStrength,
                    description: `${planet} debilitation cancelled by ${cancellationFactors.join(', ')}`,
                    effects: getNeechaBhangaEffects(planet, cancellationStrength),
                    house: planetData.house,
                    sign: planetSign
                });
            }
        }
    }

    return yogas;
}

/**
 * Detect Viparita Raja Yoga
 * Rule: Planets in 6th, 8th, or 12th houses giving benefic results
 * @param {Object} birthChart - Birth chart data
 * @returns {Array} Array of detected yogas
 */
function detectViparitaRajaYoga(birthChart) {
    const yogas = [];
    const viparitaHouses = [6, 8, 12];

    for (const house of viparitaHouses) {
        const planetsInHouse = Object.keys(birthChart.planets).filter(
            planet => birthChart.planets[planet].house === house
        );

        if (planetsInHouse.length > 0) {
            const strength = calculateYogaStrength(birthChart, planetsInHouse);

            if (strength >= YOGA_CONSTANTS.MINIMUM_YOGA_STRENGTH) {
                yogas.push({
                    name: `Viparita Raja Yoga (${house}th House)`,
                    type: 'MALEFIC_HOUSE_BENEFIC',
                    planets: planetsInHouse,
                    strength: strength,
                    description: `Planets in ${house}th house giving benefic results`,
                    effects: getViparitaRajaEffects(house, strength),
                    house: house
                });
            }
        }
    }

    return yogas;
}

/**
 * Get Gaja Kesari Yoga effects
 * @param {number} strength - Yoga strength
 * @returns {Object} Effects object
 */
function getGajaKesariEffects(strength) {
    const effectsMap = {
        veryStrong: {
            wisdom: 'Exceptional wisdom and intelligence',
            wealth: 'Wealth through wisdom and guidance',
            fame: 'Recognition as knowledgeable person',
            career: 'Teaching, counseling, advisory roles',
            duration: 'Lifelong influence'
        },
        strong: {
            wisdom: 'Exceptional wisdom and intelligence',
            wealth: 'Wealth through wisdom and guidance',
            fame: 'Recognition as knowledgeable person',
            career: 'Teaching, counseling, advisory roles',
            duration: 'Lifelong influence'
        },
        moderate: {
            wisdom: 'Good intelligence and learning ability',
            wealth: 'Comfortable financial position',
            fame: 'Local recognition',
            career: 'Educational or advisory roles',
            duration: 'Career support'
        }
    };
    return getYogaEffects(strength, effectsMap);
}

/**
 * Get Neecha Bhanga effects
 * @param {string} planet - Planet name
 * @param {number} strength - Yoga strength
 * @returns {Object} Effects object
 */
function getNeechaBhangaEffects(planet, strength) {
    const planetEffects = {
        SUN: 'Leadership despite challenges',
        MOON: 'Emotional strength despite difficulties',
        MARS: 'Courage overcoming obstacles',
        MERCURY: 'Intelligence overcoming communication barriers',
        JUPITER: 'Wisdom gained through hardship',
        VENUS: 'Beauty and harmony despite struggles',
        SATURN: 'Discipline and success through perseverance'
    };

    return {
        transformation: planetEffects[planet],
        strength: 'Overcoming inherent weaknesses',
        success: 'Success despite difficult circumstances',
        duration: strength >= 0.8 ? 'Lifelong transformation' : 'Major life periods'
    };
}

/**
 * Get Viparita Raja Yoga effects
 * @param {number} house - House number
 * @param {number} strength - Yoga strength
 * @returns {Object} Effects object
 */
function getViparitaRajaEffects(house, strength) {
    const houseEffects = {
        6: 'Success through overcoming enemies and obstacles',
        8: 'Transformation and success through crisis management',
        12: 'Spiritual growth and success through detachment'
    };

    return {
        transformation: houseEffects[house],
        strength: 'Turning challenges into opportunities',
        success: 'Unexpected success through difficult situations',
        duration: strength >= 0.8 ? 'Lifelong pattern' : 'Intermittent influence'
    };
}

/**
 * Calculate overall yoga strength for planets
 * @param {Object} birthChart - Birth chart data
 * @param {Array} planets - Array of planet names
 * @returns {number} Average strength (0-1)
 */
function calculateYogaStrength(birthChart, planets) {
    let totalStrength = 0;
    let planetCount = 0;

    for (const planet of planets) {
        const planetData = birthChart.planets[planet];
        const planetSign = Math.floor(planetData.longitude / 30);

        let planetStrength = calculateDignityStrength(planet, planetSign);

        // Add house strength
        if (isInKendra(planetData.house)) {
            planetStrength *= 1.2;
        } else if (isInTrikona(planetData.house)) {
            planetStrength *= 1.1;
        } else if (YOGA_CONSTANTS.MALEFIC_HOUSES.includes(planetData.house)) {
            planetStrength *= 0.8;
        }

        // Add Shad Bala influence (simplified)
        if (birthChart.strengths && birthChart.strengths[planet]) {
            planetStrength *= (0.5 + birthChart.strengths[planet].overall * 0.5);
        }

        totalStrength += planetStrength;
        planetCount++;
    }

    return planetCount > 0 ? Math.min(totalStrength / planetCount, 1.0) : 0;
}

/**
 * Complete Yoga Analysis and Detection System
 */
class YogaDetector {
    /**
     * Create a YogaDetector instance
     * @param {Object} birthChart - Complete birth chart data
     */
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.detectedYogas = [];
        this.validateBirthChart();
    }

    /**
     * Validate birth chart data
     * @throws {Error} If birth chart is invalid
     */
    validateBirthChart() {
        try {
            if (!this.birthChart) {
                throw new Error('Birth chart data is required');
            }
            if (typeof this.birthChart !== 'object') {
                throw new Error('Birth chart must be an object');
            }
            if (!this.birthChart.planets) {
                throw new Error('Planets data is required in birth chart');
            }
            if (typeof this.birthChart.planets !== 'object') {
                throw new Error('Planets data must be an object');
            }
            if (!this.birthChart.ascendant || typeof this.birthChart.ascendant !== 'object') {
                throw new Error('Ascendant data is required in birth chart');
            }
            if (this.birthChart.ascendant.sign === undefined || this.birthChart.ascendant.sign === null || typeof this.birthChart.ascendant.sign !== 'number') {
                throw new Error('Ascendant sign is required and must be a number (0-11)');
            }
            if (this.birthChart.ascendant.sign < 0 || this.birthChart.ascendant.sign > 11) {
                throw new Error('Ascendant sign must be between 0 and 11');
            }

            // Validate required planets
            const requiredPlanets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
            for (const planet of requiredPlanets) {
                if (!this.birthChart.planets[planet]) {
                    throw new Error(`Planet ${planet} data is required`);
                }
                const planetData = this.birthChart.planets[planet];
                if (typeof planetData !== 'object') {
                    throw new Error(`Planet ${planet} data must be an object`);
                }
                if (typeof planetData.longitude !== 'number' || isNaN(planetData.longitude)) {
                    throw new Error(`Planet ${planet} longitude must be a valid number`);
                }
                if (planetData.longitude < 0 || planetData.longitude >= 360) {
                    throw new Error(`Planet ${planet} longitude must be between 0 and 360 degrees`);
                }
                if (typeof planetData.house !== 'number' || !Number.isInteger(planetData.house)) {
                    throw new Error(`Planet ${planet} house must be an integer`);
                }
                if (planetData.house < 1 || planetData.house > 12) {
                    throw new Error(`Planet ${planet} house must be between 1 and 12`);
                }
            }

            // Optional planets validation
            const optionalPlanets = ['RAHU', 'KETU'];
            for (const planet of optionalPlanets) {
                if (this.birthChart.planets[planet]) {
                    const planetData = this.birthChart.planets[planet];
                    if (typeof planetData.longitude !== 'number' || isNaN(planetData.longitude)) {
                        throw new Error(`Planet ${planet} longitude must be a valid number`);
                    }
                    if (planetData.longitude < 0 || planetData.longitude >= 360) {
                        throw new Error(`Planet ${planet} longitude must be between 0 and 360 degrees`);
                    }
                    if (typeof planetData.house !== 'number' || !Number.isInteger(planetData.house)) {
                        throw new Error(`Planet ${planet} house must be an integer`);
                    }
                    if (planetData.house < 1 || planetData.house > 12) {
                        throw new Error(`Planet ${planet} house must be between 1 and 12`);
                    }
                }
            }
        } catch (error) {
            throw new Error(`Birth chart validation failed: ${error.message}`);
        }
    }

    /**
     * Detect all yogas in the birth chart
     * @returns {Array} Array of detected yogas
     */
    detectAllYogas() {
        try {
            this.detectedYogas = [];

            // Raja Yogas
            this.detectedYogas.push(...this.detectRajaYogas());

            // Dhana Yogas
            this.detectedYogas.push(...this.detectDhanaYogas());

            // Mahapurusha Yogas
            this.detectedYogas.push(...this.detectMahapurushaYogas());

            // Special Yogas
            this.detectedYogas.push(...this.detectSpecialYogas());

            // Sort by strength
            this.detectedYogas.sort((a, b) => b.strength - a.strength);

            return this.detectedYogas;
        } catch (error) {
            throw new Error(`Yoga detection failed: ${error.message}`);
        }
    }

    /**
     * Detect all Raja Yogas
     * @returns {Array} Array of Raja yogas
     */
    detectRajaYogas() {
        const rajayogas = [];

        rajayogas.push(...detectKendraTrikonaYoga(this.birthChart));
        rajayogas.push(...detectDharmaKarmaYoga(this.birthChart));

        // Add more Raja Yoga types as needed

        return rajayogas;
    }

    /**
     * Detect all Dhana Yogas
     * @returns {Array} Array of Dhana yogas
     */
    detectDhanaYogas() {
        const dhanayogas = [];

        dhanayogas.push(...detectLabhaDhanaYoga(this.birthChart));
        dhanayogas.push(...detectJupiterVenusDhanaYoga(this.birthChart));

        // Add more Dhana Yoga types as needed

        return dhanayogas;
    }

    /**
     * Detect all Mahapurusha Yogas
     * @returns {Array} Array of Mahapurusha yogas
     */
    detectMahapurushaYogas() {
        const mahapurushaYogas = [];

        mahapurushaYogas.push(...detectPanchaMahapurushaYoga(this.birthChart));
        mahapurushaYogas.push(...detectGeneralMahapurushaYoga(this.birthChart));

        return mahapurushaYogas;
    }

    /**
     * Detect special yogas
     * @returns {Array} Array of special yogas
     */
    detectSpecialYogas() {
        const specialYogas = [];

        specialYogas.push(...detectGajaKesariYoga(this.birthChart));
        specialYogas.push(...detectNeechaBhangaYoga(this.birthChart));
        specialYogas.push(...detectViparitaRajaYoga(this.birthChart));

        return specialYogas;
    }

    /**
     * Get yoga summary
     * @returns {Object} Summary of detected yogas
     */
    getYogaSummary() {
        const summary = {
            totalYogas: this.detectedYogas.length,
            categories: {},
            strongestYoga: null,
            dominantCategory: null
        };

        let maxStrength = 0;
        const categoryCount = {};

        for (const yoga of this.detectedYogas) {
            // Count by category
            const category = this.getYogaCategory(yoga.name);
            categoryCount[category] = (categoryCount[category] || 0) + 1;

            // Find strongest yoga
            if (yoga.strength > maxStrength) {
                maxStrength = yoga.strength;
                summary.strongestYoga = yoga;
            }
        }

        summary.categories = categoryCount;

        // Find dominant category
        let maxCount = 0;
        for (const category in categoryCount) {
            if (categoryCount[category] > maxCount) {
                maxCount = categoryCount[category];
                summary.dominantCategory = category;
            }
        }

        return summary;
    }

    /**
     * Get yoga category from name
     * @param {string} yogaName - Name of the yoga
     * @returns {string} Category name
     */
    getYogaCategory(yogaName) {
        if (yogaName.includes('Raja')) return 'Power & Authority';
        if (yogaName.includes('Dhana')) return 'Wealth & Prosperity';
        if (yogaName.includes('Mahapurusha') || yogaName.includes('Ruchaka') ||
            yogaName.includes('Bhadra') || yogaName.includes('Hamsa') ||
            yogaName.includes('Malavya') || yogaName.includes('Sasha')) {
            return 'Great Person';
        }
        return 'Special Combinations';
    }

    /**
     * Get yogas by strength level
     * @param {number} minStrength - Minimum strength threshold (0-1)
     * @returns {Array} Filtered yogas
     */
    getYogasByStrength(minStrength = 0) {
        return this.detectedYogas.filter(yoga => yoga.strength >= minStrength);
    }

    /**
     * Get yogas by category
     * @param {string} category - Category name
     * @returns {Array} Filtered yogas
     */
    getYogasByCategory(category) {
        return this.detectedYogas.filter(yoga => this.getYogaCategory(yoga.name) === category);
    }
}

// Export functions and classes
module.exports = {
    YogaDetector,
    YOGA_CONSTANTS,
    PLANETARY_RELATIONSHIPS,
    SIGN_LORDS,
    PLANETARY_DIGNITIES,
    YOGA_CATEGORIES,
    YOGA_STRENGTH_LEVELS,
    calculateDignityStrength,
    isInKendra,
    isInTrikona,
    calculateAspectStrength,
    getHouseLord,
    calculateYogaStrength
};