/**
 * ZodiaCore - Significator Analyzer
 *
 * Analyzes horary charts to assign significators (planets representing querent, quesited, matter, timing).
 * Implements traditional Vedic horary astrology significator assignment rules.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { HORARY_CONSTANTS, QUESTION_KEYWORDS, RULING_PLANETS, HOUSE_MAPPINGS } = require('./horary-constants');

/**
 * Significator Analyzer Class
 * Handles assignment and analysis of significators in horary astrology
 */
class SignificatorAnalyzer {
    constructor() {
        this.questionClassifier = new QuestionClassifier();
    }

    /**
     * Assign significators for a horary question
     * @param {string} question - The question text
     * @param {Object} horaryChart - The horary chart data
     * @returns {Object} Significator analysis with assignments and strengths
     */
    assignSignificators(question, horaryChart) {
        try {
            // Classify the question type
            const questionType = this.questionClassifier.classifyQuestion(question);

            // Initialize significators object
            const significators = {
                querent: null,      // Person asking the question
                quesited: null,     // Person/thing asked about
                matter: null,       // The matter itself
                timing: null        // When it will happen
            };

            // Assign querent significator (usually ascendant lord)
            significators.querent = this.assignQuerentSignificator(horaryChart);

            // Assign quesited significator based on question type
            significators.quesited = this.assignQuesitedSignificator(questionType, horaryChart);

            // Assign matter significator
            significators.matter = this.assignMatterSignificator(questionType, horaryChart);

            // Assign timing significator
            significators.timing = this.assignTimingSignificator(horaryChart);

            // Calculate significator powers and strengths
            for (const [role, significator] of Object.entries(significators)) {
                if (significator) {
                    significator.power = this.calculateSignificatorPower(significator, horaryChart);
                    significator.strength = this.classifyStrength(significator.power);
                }
            }

            // Calculate overall significator strength
            const overallStrength = this.calculateOverallStrength(significators);

            return {
                questionType: questionType,
                significators: significators,
                overallStrength: overallStrength,
                analysis: this.analyzeSignificatorRelationships(significators, horaryChart)
            };

        } catch (error) {
            throw new Error(`Significator assignment failed: ${error.message}`);
        }
    }

    /**
     * Assign querent significator (person asking the question)
     * @param {Object} horaryChart - Horary chart data
     * @returns {Object} Querent significator
     */
    assignQuerentSignificator(horaryChart) {
        const ascendantSign = horaryChart.ascendant.sign;
        const ascendantLord = this.getSignLord(ascendantSign);

        return {
            planet: ascendantLord,
            house: 1,
            role: 'querent',
            type: 'primary',
            reason: 'Ascendant lord represents the querent'
        };
    }

    /**
     * Assign quesited significator based on question type
     * @param {string} questionType - Classified question type
     * @param {Object} horaryChart - Horary chart data
     * @returns {Object} Quesited significator
     */
    assignQuesitedSignificator(questionType, horaryChart) {
        const house = HOUSE_MAPPINGS[questionType] || 7; // Default to 7th house
        const houseLord = this.getHouseLord(house, horaryChart);

        return {
            planet: houseLord,
            house: house,
            role: 'quesited',
            type: 'primary',
            reason: `${house}th house lord represents the quesited in ${questionType} matters`
        };
    }

    /**
     * Assign matter significator
     * @param {string} questionType - Question type
     * @param {Object} horaryChart - Horary chart data
     * @returns {Object} Matter significator
     */
    assignMatterSignificator(questionType, horaryChart) {
        // Primary: Use ruling planet for the question type
        if (RULING_PLANETS[questionType]) {
            const rulingPlanet = RULING_PLANETS[questionType];
            return {
                planet: rulingPlanet,
                house: horaryChart.planets[rulingPlanet].house,
                role: 'matter',
                type: 'primary',
                reason: `${rulingPlanet} rules ${questionType} matters`
            };
        }

        // Secondary: Use Moon as general matter significator
        return {
            planet: 'MOON',
            house: horaryChart.planets.MOON.house,
            role: 'matter',
            type: 'secondary',
            reason: 'Moon represents the general matter of the question'
        };
    }

    /**
     * Assign timing significator
     * @param {Object} horaryChart - Horary chart data
     * @returns {Object} Timing significator
     */
    assignTimingSignificator(horaryChart) {
        // Use 5th house lord for timing (traditional approach)
        const fifthLord = this.getHouseLord(5, horaryChart);

        return {
            planet: fifthLord,
            house: 5,
            role: 'timing',
            type: 'secondary',
            reason: '5th house lord indicates timing of events'
        };
    }

    /**
     * Get lord of a zodiac sign
     * @param {number} sign - Sign number (0-11)
     * @returns {string} Planet name
     */
    getSignLord(sign) {
        const signLords = [
            'MARS',    // Aries (0)
            'VENUS',   // Taurus (1)
            'MERCURY', // Gemini (2)
            'MOON',    // Cancer (3)
            'SUN',     // Leo (4)
            'MERCURY', // Virgo (5)
            'VENUS',   // Libra (6)
            'MARS',    // Scorpio (7)
            'JUPITER', // Sagittarius (8)
            'SATURN',  // Capricorn (9)
            'SATURN',  // Aquarius (10)
            'JUPITER'  // Pisces (11)
        ];

        return signLords[sign];
    }

    /**
     * Get lord of a house
     * @param {number} houseNumber - House number (1-12)
     * @param {Object} horaryChart - Chart data
     * @returns {string} Planet name
     */
    getHouseLord(houseNumber, horaryChart) {
        // In Whole Sign Houses, house sign is the same as ascendant sign + (house-1)
        const ascendantSign = horaryChart.ascendant.sign;
        const houseSign = (ascendantSign + houseNumber - 1) % 12;
        return this.getSignLord(houseSign);
    }

    /**
     * Calculate significator power
     * @param {Object} significator - Significator object
     * @param {Object} horaryChart - Chart data
     * @returns {number} Power value (0.0 to 1.0)
     */
    calculateSignificatorPower(significator, horaryChart) {
        let power = 0.5; // Base power

        const planet = significator.planet;
        const planetData = horaryChart.planets[planet];

        if (!planetData) return 0.0;

        // Dignity check
        const dignity = this.getPlanetaryDignity(planet, horaryChart);
        power += HORARY_CONSTANTS.DIGNITY_SCORES[dignity] * 0.3;

        // House placement strength
        const house = planetData.house;
        if (HORARY_CONSTANTS.HOUSE_TYPES.KENDRA.includes(house)) {
            power += 0.2; // Angular houses
        } else if (HORARY_CONSTANTS.HOUSE_TYPES.TRIKONA.includes(house)) {
            power += 0.15; // Trine houses
        } else if (HORARY_CONSTANTS.HOUSE_TYPES.DUSTHANA.includes(house)) {
            power -= 0.1; // Challenging houses
        }

        // Speed consideration (faster planets are stronger in horary)
        const speed = Math.abs(planetData.speed || 1);
        if (speed > 1) power += 0.1; // Fast moving planets

        // Moon phase consideration for Moon significator
        if (planet === 'MOON') {
            power += this.getMoonPhaseStrength(horaryChart) * 0.1;
        }

        return Math.max(0.0, Math.min(1.0, power));
    }

    /**
     * Get planetary dignity
     * @param {string} planet - Planet name
     * @param {Object} horaryChart - Chart data
     * @returns {string} Dignity level
     */
    getPlanetaryDignity(planet, horaryChart) {
        const planetData = horaryChart.planets[planet];
        if (!planetData) return 'NEUTRAL';

        const sign = planetData.sign;

        // Simplified dignity check (would need full dignity tables in production)
        const exaltedSigns = { SUN: 0, MOON: 1, MARS: 9, JUPITER: 3, VENUS: 11, SATURN: 6 };
        const debilitatedSigns = { SUN: 6, MOON: 7, MARS: 3, JUPITER: 9, VENUS: 5, SATURN: 0 };

        if (exaltedSigns[planet] === sign) return 'EXALTED';
        if (debilitatedSigns[planet] === sign) return 'DEBILITATED';

        // Check if in own sign
        const ownSigns = {
            SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5],
            JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10]
        };

        if (ownSigns[planet] && ownSigns[planet].includes(sign)) return 'OWN_SIGN';

        return 'NEUTRAL';
    }

    /**
     * Get Moon phase strength
     * @param {Object} horaryChart - Chart data
     * @returns {number} Strength modifier (-1.0 to 1.0)
     */
    getMoonPhaseStrength(horaryChart) {
        const sunLon = horaryChart.planets.SUN.longitude;
        const moonLon = horaryChart.planets.MOON.longitude;

        let separation = moonLon - sunLon;
        if (separation < 0) separation += 360;

        // New Moon (0°) = -1, Full Moon (180°) = +1
        const phase = (separation / 180) - 1; // -1 to +1

        // Strongest at Full Moon, weakest at New Moon
        return phase;
    }

    /**
     * Classify significator strength
     * @param {number} power - Power value
     * @returns {string} Strength level
     */
    classifyStrength(power) {
        if (power >= HORARY_CONSTANTS.STRENGTH_LEVELS.VERY_STRONG.min) {
            return HORARY_CONSTANTS.STRENGTH_LEVELS.VERY_STRONG.description;
        }
        if (power >= HORARY_CONSTANTS.STRENGTH_LEVELS.STRONG.min) {
            return HORARY_CONSTANTS.STRENGTH_LEVELS.STRONG.description;
        }
        if (power >= HORARY_CONSTANTS.STRENGTH_LEVELS.MODERATE.min) {
            return HORARY_CONSTANTS.STRENGTH_LEVELS.MODERATE.description;
        }
        if (power >= HORARY_CONSTANTS.STRENGTH_LEVELS.WEAK.min) {
            return HORARY_CONSTANTS.STRENGTH_LEVELS.WEAK.description;
        }
        return HORARY_CONSTANTS.STRENGTH_LEVELS.VERY_WEAK.description;
    }

    /**
     * Calculate overall significator strength
     * @param {Object} significators - All significators
     * @returns {number} Average strength
     */
    calculateOverallStrength(significators) {
        const powers = Object.values(significators)
            .filter(sig => sig && sig.power !== undefined)
            .map(sig => sig.power);

        if (powers.length === 0) return 0.0;

        const averagePower = powers.reduce((sum, power) => sum + power, 0) / powers.length;
        return averagePower;
    }

    /**
     * Analyze relationships between significators
     * @param {Object} significators - Significator assignments
     * @param {Object} horaryChart - Chart data
     * @returns {Object} Relationship analysis
     */
    analyzeSignificatorRelationships(significators, horaryChart) {
        const analysis = {
            querent_quesited: this.analyzeSignificatorPair(significators.querent, significators.quesited, horaryChart),
            querent_matter: this.analyzeSignificatorPair(significators.querent, significators.matter, horaryChart),
            quesited_matter: this.analyzeSignificatorPair(significators.quesited, significators.matter, horaryChart)
        };

        // Overall favorability
        const favorableCount = Object.values(analysis).filter(a =>
            a && a.favorability === 'FAVORABLE'
        ).length;

        analysis.overall_favorability = favorableCount >= 2 ? 'FAVORABLE' :
                                       favorableCount === 1 ? 'MIXED' : 'CHALLENGING';

        return analysis;
    }

    /**
     * Analyze relationship between two significators
     * @param {Object} sig1 - First significator
     * @param {Object} sig2 - Second significator
     * @param {Object} horaryChart - Chart data
     * @returns {Object} Relationship analysis
     */
    analyzeSignificatorPair(sig1, sig2, horaryChart) {
        if (!sig1 || !sig2) return null;

        // Check if same planet
        if (sig1.planet === sig2.planet) {
            return {
                relationship: 'same_planet',
                favorability: 'MIXED',
                interpretation: 'Same planet represents both - unified interests'
            };
        }

        // Check house relationship
        const houseRelation = this.analyzeHouseRelationship(sig1.house, sig2.house);

        // Check planetary relationship
        const planetRelation = this.analyzePlanetaryRelationship(sig1.planet, sig2.planet);

        // Combine analysis
        const favorability = this.combineFavorability(houseRelation.favorability, planetRelation.favorability);

        return {
            relationship: `${sig1.role}_${sig2.role}`,
            house_relation: houseRelation,
            planet_relation: planetRelation,
            favorability: favorability,
            interpretation: this.getRelationshipInterpretation(sig1.role, sig2.role, favorability)
        };
    }

    /**
     * Analyze house relationship
     * @param {number} house1 - First house
     * @param {number} house2 - Second house
     * @returns {Object} House relationship analysis
     */
    analyzeHouseRelationship(house1, house2) {
        const angularHouses = [1, 4, 7, 10];
        const bothAngular = angularHouses.includes(house1) && angularHouses.includes(house2);
        const bothTrine = [1, 5, 9].includes(house1) && [1, 5, 9].includes(house2);

        if (bothAngular) {
            return { favorability: 'FAVORABLE', description: 'Both in angular houses' };
        }
        if (bothTrine) {
            return { favorability: 'FAVORABLE', description: 'Both in trine houses' };
        }

        return { favorability: 'NEUTRAL', description: 'Neutral house relationship' };
    }

    /**
     * Analyze planetary relationship
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {Object} Planetary relationship analysis
     */
    analyzePlanetaryRelationship(planet1, planet2) {
        // Simplified planetary relationships
        const friendly = {
            SUN: ['MOON', 'MARS', 'JUPITER'],
            MOON: ['SUN', 'MERCURY', 'JUPITER', 'VENUS'],
            MARS: ['SUN', 'MOON', 'JUPITER'],
            MERCURY: ['SUN', 'VENUS', 'RAHU'],
            JUPITER: ['SUN', 'MOON', 'MARS', 'VENUS', 'SATURN'],
            VENUS: ['MERCURY', 'SATURN', 'RAHU'],
            SATURN: ['MERCURY', 'VENUS', 'RAHU']
        };

        const isFriendly = friendly[planet1] && friendly[planet1].includes(planet2);

        return {
            favorability: isFriendly ? 'FAVORABLE' : 'NEUTRAL',
            description: isFriendly ? 'Planets are friendly' : 'Neutral planetary relationship'
        };
    }

    /**
     * Combine favorability scores
     * @param {string} fav1 - First favorability
     * @param {string} fav2 - Second favorability
     * @returns {string} Combined favorability
     */
    combineFavorability(fav1, fav2) {
        const scores = { FAVORABLE: 2, MIXED: 1, NEUTRAL: 0, CHALLENGING: -1 };
        const avg = (scores[fav1] + scores[fav2]) / 2;

        if (avg > 1.5) return 'FAVORABLE';
        if (avg > 0.5) return 'MIXED';
        if (avg > -0.5) return 'NEUTRAL';
        return 'CHALLENGING';
    }

    /**
     * Get relationship interpretation
     * @param {string} role1 - First role
     * @param {string} role2 - Second role
     * @param {string} favorability - Combined favorability
     * @returns {string} Interpretation text
     */
    getRelationshipInterpretation(role1, role2, favorability) {
        const interpretations = {
            FAVORABLE: `${role1} and ${role2} have harmonious relationship`,
            MIXED: `${role1} and ${role2} have mixed relationship`,
            NEUTRAL: `${role1} and ${role2} have neutral relationship`,
            CHALLENGING: `${role1} and ${role2} have challenging relationship`
        };

        return interpretations[favorability] || 'Complex relationship';
    }
}

/**
 * Question Classifier helper class
 */
class QuestionClassifier {
    /**
     * Classify question type based on keywords
     * @param {string} question - Question text
     * @returns {string} Question type
     */
    classifyQuestion(question) {
        const text = question.toLowerCase();

        // Check each question type
        for (const [type, keywords] of Object.entries(QUESTION_KEYWORDS)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return type;
            }
        }

        return 'general';
    }
}

module.exports = SignificatorAnalyzer;