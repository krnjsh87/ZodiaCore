/**
 * Guna Milan (Ashtakoota) Compatibility Calculator
 *
 * Implements traditional Vedic astrology marriage compatibility analysis
 * based on the 8 Kootas (categories) with maximum 36 points total.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ValidationError, CalculationError } = require('./errors');

/**
 * Guna Milan Calculator Class
 * Handles all Ashtakoota compatibility calculations
 */
class GunaMilanCalculator {
    constructor() {
        this.kootaWeights = {
            varna: 1,
            vashya: 2,
            tara: 3,
            yoni: 4,
            grahaMaitri: 5,
            gana: 6,
            bhakoot: 7,
            nadi: 8
        };
    }

    /**
     * Calculate complete Guna Milan compatibility
     * @param {Object} brideChart - Bride's birth chart with Moon nakshatra details
     * @param {Object} groomChart - Groom's birth chart with Moon nakshatra details
     * @returns {Object} Complete compatibility report
     */
    calculateCompatibility(brideChart, groomChart) {
        // Input validation
        this.validateInput(brideChart, groomChart);

        const brideNakshatra = brideChart.moonDetails.nakshatra;
        const groomNakshatra = groomChart.moonDetails.nakshatra;

        // Calculate individual koota scores
        const scores = {
            varna: this.calculateVarna(brideNakshatra, groomNakshatra),
            vashya: this.calculateVashya(brideNakshatra, groomNakshatra),
            tara: this.calculateTara(brideNakshatra, groomNakshatra),
            yoni: this.calculateYoni(brideNakshatra, groomNakshatra),
            grahaMaitri: this.calculateGrahaMaitri(brideNakshatra, groomNakshatra),
            gana: this.calculateGana(brideNakshatra, groomNakshatra),
            bhakoot: this.calculateBhakoot(brideNakshatra, groomNakshatra),
            nadi: this.calculateNadi(brideNakshatra, groomNakshatra)
        };

        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const maxScore = 36;
        const percentage = Math.round((totalScore / maxScore) * 100);

        return {
            compatibilityId: this.generateCompatibilityId(),
            bride: {
                nakshatra: brideNakshatra.nakshatraName,
                lord: brideNakshatra.lord,
                sign: brideNakshatra.sign
            },
            groom: {
                nakshatra: groomNakshatra.nakshatraName,
                lord: groomNakshatra.lord,
                sign: groomNakshatra.sign
            },
            scores: scores,
            totalScore: totalScore,
            maxScore: maxScore,
            percentage: percentage,
            compatibility: this.getCompatibilityRating(totalScore),
            recommendations: this.generateRecommendations(scores, totalScore),
            exceptions: this.checkExceptions(scores),
            analysis: this.generateAnalysis(scores, totalScore)
        };
    }

    /**
     * Validate input charts
     * @param {Object} brideChart - Bride's chart
     * @param {Object} groomChart - Groom's chart
     * @throws {ValidationError} If input is invalid
     */
    validateInput(brideChart, groomChart) {
        if (!brideChart || !brideChart.moonDetails || !brideChart.moonDetails.nakshatra) {
            throw new ValidationError('INVALID_INPUT', 'Bride chart missing Moon nakshatra details');
        }
        if (!groomChart || !groomChart.moonDetails || !groomChart.moonDetails.nakshatra) {
            throw new ValidationError('INVALID_INPUT', 'Groom chart missing Moon nakshatra details');
        }

        const brideNak = brideChart.moonDetails.nakshatra;
        const groomNak = groomChart.moonDetails.nakshatra;

        if (!brideNak.nakshatraName || !brideNak.lord || !brideNak.caste || !brideNak.sign) {
            throw new ValidationError('INVALID_INPUT', 'Bride nakshatra data incomplete');
        }
        if (!groomNak.nakshatraName || !groomNak.lord || !groomNak.caste || !groomNak.sign) {
            throw new ValidationError('INVALID_INPUT', 'Groom nakshatra data incomplete');
        }
    }

    /**
     * Calculate Varna compatibility (1 point)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0 or 1)
     */
    calculateVarna(brideNakshatra, groomNakshatra) {
        const varnaHierarchy = {
            'Brahmin': 4,
            'Kshatriya': 3,
            'Vaishya': 2,
            'Shudra': 1
        };

        const brideVarna = brideNakshatra.caste;
        const groomVarna = groomNakshatra.caste;

        // Groom should be of equal or higher varna
        if (varnaHierarchy[groomVarna] >= varnaHierarchy[brideVarna]) {
            return 1;
        }
        return 0;
    }

    /**
     * Calculate Vashya compatibility (2 points)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0, 1, or 2)
     */
    calculateVashya(brideNakshatra, groomNakshatra) {
        const brideLord = brideNakshatra.lord;
        const groomLord = groomNakshatra.lord;

        // Same group gets 2 points
        if (this.getVashyaGroup(brideLord) === this.getVashyaGroup(groomLord)) {
            return 2;
        }

        // Compatible groups get 1 point
        const compatibleGroups = {
            'Manav': ['Vanchar', 'Chatushpad'],
            'Vanchar': ['Manav', 'Jalchar'],
            'Chatushpad': ['Manav', 'Keet'],
            'Jalchar': ['Vanchar'],
            'Keet': ['Chatushpad']
        };

        if (compatibleGroups[this.getVashyaGroup(brideLord)]?.includes(this.getVashyaGroup(groomLord))) {
            return 1;
        }

        return 0;
    }

    /**
     * Get Vashya group for a planet
     * @param {string} planet - Planet name
     * @returns {string} Vashya group
     */
    getVashyaGroup(planet) {
        const groups = {
            'Manav': ['SUN', 'MOON', 'JUPITER', 'VENUS'],
            'Vanchar': ['MERCURY'],
            'Chatushpad': ['MARS'],
            'Jalchar': ['SATURN'],
            'Keet': ['RAHU', 'KETU']
        };

        for (const [group, planets] of Object.entries(groups)) {
            if (planets.includes(planet)) return group;
        }
        return 'Manav'; // Default
    }

    /**
     * Calculate Tara compatibility (3 points)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0, 1.5, 2, or 3)
     */
    calculateTara(brideNakshatra, groomNakshatra) {
        const brideIndex = brideNakshatra.nakshatraNumber - 1;
        const groomIndex = groomNakshatra.nakshatraNumber - 1;

        let difference = Math.abs(brideIndex - groomIndex);
        if (difference > 13) difference = 27 - difference;

        // Tara classifications based on nakshatra distance
        const taraPoints = {
            0: 3,   // Same nakshatra - Janma Tara
            1: 1.5, // Sampat Tara
            2: 2,   // Vipat Tara
            3: 1.5, // Kshem Tara
            4: 2,   // Pratyak Tara
            5: 1.5, // Sadhak Tara
            6: 2,   // Vadha Tara
            7: 1.5, // Mitra Tara
            8: 2,   // Atimitra Tara
            9: 0,   // Direct opposition - no points
            10: 2,  // Opposition
            11: 1.5,// Friendly
            12: 2,  // Very friendly
            13: 3   // Same as 0
        };

        return taraPoints[difference] || 0;
    }

    /**
     * Calculate Yoni compatibility (4 points)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0, 2, or 4)
     */
    calculateYoni(brideNakshatra, groomNakshatra) {
        const yoniTypes = {
            'Ashwini': 'Horse',
            'Bharani': 'Elephant',
            'Krittika': 'Goat',
            'Rohini': 'Snake',
            'Mrigashira': 'Snake',
            'Ardra': 'Dog',
            'Punarvasu': 'Cat',
            'Pushya': 'Goat',
            'Ashlesha': 'Cat',
            'Magha': 'Rat',
            'Purva Phalguni': 'Rat',
            'Uttara Phalguni': 'Cow',
            'Hasta': 'Buffalo',
            'Chitra': 'Tiger',
            'Swati': 'Buffalo',
            'Vishakha': 'Tiger',
            'Anuradha': 'Deer',
            'Jyeshtha': 'Deer',
            'Moola': 'Dog',
            'Purva Ashadha': 'Monkey',
            'Uttara Ashadha': 'Mongoose',
            'Shravana': 'Monkey',
            'Dhanishtha': 'Lion',
            'Shatabhisha': 'Horse',
            'Purva Bhadrapada': 'Lion',
            'Uttara Bhadrapada': 'Cow',
            'Revati': 'Elephant'
        };

        const brideYoni = yoniTypes[brideNakshatra.nakshatraName];
        const groomYoni = yoniTypes[groomNakshatra.nakshatraName];

        // Same Yoni gets 4 points
        if (brideYoni === groomYoni) {
            return 4;
        }

        // Compatible Yonis get 2 points
        const compatibleYonis = {
            'Horse': ['Buffalo', 'Tiger'],
            'Elephant': ['Snake', 'Cow'],
            'Goat': ['Monkey', 'Mongoose'],
            'Snake': ['Elephant', 'Monkey'],
            'Dog': ['Deer'],
            'Cat': ['Rat', 'Tiger'],
            'Rat': ['Cat', 'Goat'],
            'Cow': ['Elephant', 'Horse'],
            'Buffalo': ['Horse', 'Snake'],
            'Tiger': ['Horse', 'Cat'],
            'Deer': ['Dog', 'Monkey'],
            'Monkey': ['Goat', 'Snake'],
            'Mongoose': ['Goat', 'Lion'],
            'Lion': ['Mongoose', 'Cow']
        };

        if (compatibleYonis[brideYoni]?.includes(groomYoni)) {
            return 2;
        }

        return 0;
    }

    /**
     * Calculate Graha Maitri compatibility (5 points)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0, 0.5, 1, 2.5, or 5)
     */
    calculateGrahaMaitri(brideNakshatra, groomNakshatra) {
        const brideLord = brideNakshatra.lord;
        const groomLord = groomNakshatra.lord;

        // Same lord gets 5 points
        if (brideLord === groomLord) {
            return 5;
        }

        // Planetary friendship matrix
        const friendship = {
            'SUN': { 'friends': ['MOON', 'MARS', 'JUPITER'], 'equals': ['MERCURY'], 'enemies': ['VENUS', 'SATURN'] },
            'MOON': { 'friends': ['SUN', 'MERCURY'], 'equals': ['MARS', 'JUPITER', 'VENUS', 'SATURN'], 'enemies': [] },
            'MARS': { 'friends': ['SUN', 'MOON', 'JUPITER'], 'equals': ['MERCURY', 'VENUS'], 'enemies': ['SATURN'] },
            'MERCURY': { 'friends': ['SUN', 'VENUS'], 'equals': ['MARS', 'JUPITER', 'SATURN'], 'enemies': ['MOON'] },
            'JUPITER': { 'friends': ['SUN', 'MOON', 'MARS'], 'equals': ['SATURN'], 'enemies': ['MERCURY', 'VENUS'] },
            'VENUS': { 'friends': ['MERCURY', 'SATURN'], 'equals': ['MARS', 'JUPITER'], 'enemies': ['SUN', 'MOON'] },
            'SATURN': { 'friends': ['MERCURY', 'VENUS'], 'equals': ['JUPITER'], 'enemies': ['SUN', 'MOON', 'MARS'] },
            'RAHU': { 'friends': [], 'equals': ['SATURN', 'VENUS'], 'enemies': ['SUN', 'MOON', 'MARS', 'JUPITER', 'MERCURY'] },
            'KETU': { 'friends': [], 'equals': ['MARS', 'VENUS'], 'enemies': ['SUN', 'MOON', 'JUPITER', 'MERCURY', 'SATURN'] }
        };

        const brideFriendship = friendship[brideLord];
        const groomFriendship = friendship[groomLord];

        // Check friendship levels
        if (brideFriendship.friends.includes(groomLord)) {
            return 5; // Friend
        }
        if (groomFriendship.friends.includes(brideLord)) {
            return 5; // Friend (bidirectional check)
        }
        if (brideFriendship.equals.includes(groomLord)) {
            return 2.5; // Neutral
        }
        if (brideFriendship.enemies.includes(groomLord)) {
            return 0; // Enemy
        }

        return 1; // Default neutral
    }

    /**
     * Calculate Gana compatibility (6 points)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0, 3, or 6)
     */
    calculateGana(brideNakshatra, groomNakshatra) {
        const brideGana = this.getGanaType(brideNakshatra.nakshatraName);
        const groomGana = this.getGanaType(groomNakshatra.nakshatraName);

        // Same Gana gets 6 points
        if (brideGana === groomGana) {
            return 6;
        }

        // Compatible combinations get 3 points
        const compatibleGanas = {
            'Deva': ['Manushya'],
            'Manushya': ['Deva', 'Rakshasa'],
            'Rakshasa': ['Manushya']
        };

        if (compatibleGanas[brideGana]?.includes(groomGana)) {
            return 3;
        }

        return 0;
    }

    /**
     * Get Gana type for nakshatra
     * @param {string} nakshatraName - Nakshatra name
     * @returns {string} Gana type
     */
    getGanaType(nakshatraName) {
        const ganaMap = {
            'Deva': ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Revati'],
            'Manushya': ['Bharani', 'Rohini', 'Ardra', 'Punarvasu', 'Pushya', 'Uttara Phalguni', 'Chitra', 'Vishakha', 'Uttara Ashadha', 'Dhanishtha', 'Purva Bhadrapada'],
            'Rakshasa': ['Krittika', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Jyeshtha', 'Moola', 'Purva Ashadha', 'Shatabhisha', 'Uttara Bhadrapada']
        };

        for (const [gana, nakshatras] of Object.entries(ganaMap)) {
            if (nakshatras.includes(nakshatraName)) return gana;
        }
        return 'Manushya'; // Default
    }

    /**
     * Calculate Bhakoot compatibility (7 points)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0-7)
     */
    calculateBhakoot(brideNakshatra, groomNakshatra) {
        const brideSign = brideNakshatra.sign;
        const groomSign = groomNakshatra.sign;

        let signDifference = Math.abs(brideSign - groomSign);

        // Handle circular zodiac
        if (signDifference > 6) signDifference = 12 - signDifference;

        // Bhakoot points based on sign difference
        const bhakootPoints = {
            0: 0,   // Same sign - no points
            1: 7,   // 1 sign apart - maximum compatibility
            2: 6,   // 2 signs apart
            3: 5,   // 3 signs apart
            4: 4,   // 4 signs apart
            5: 3,   // 5 signs apart
            6: 2    // 6 signs apart (opposition)
        };

        return bhakootPoints[signDifference] || 0;
    }

    /**
     * Calculate Nadi compatibility (8 points)
     * @param {Object} brideNakshatra - Bride's nakshatra
     * @param {Object} groomNakshatra - Groom's nakshatra
     * @returns {number} Points (0 or 8)
     */
    calculateNadi(brideNakshatra, groomNakshatra) {
        const brideNadi = this.getNadiType(brideNakshatra.nakshatraName);
        const groomNadi = this.getNadiType(groomNakshatra.nakshatraName);

        // Same Nadi gets 0 points (not recommended)
        if (brideNadi === groomNadi) {
            return 0;
        }

        // Different Nadi gets 8 points
        return 8;
    }

    /**
     * Get Nadi type for nakshatra
     * @param {string} nakshatraName - Nakshatra name
     * @returns {string} Nadi type
     */
    getNadiType(nakshatraName) {
        const nadiMap = {
            'Adi': ['Ashwini', 'Ardra', 'Punarvasu', 'Uttara Phalguni', 'Hasta', 'Jyeshtha', 'Moola', 'Shatabhisha', 'Purva Bhadrapada'],
            'Madhya': ['Bharani', 'Mrigashira', 'Pushya', 'Chitra', 'Anuradha', 'Purva Ashadha', 'Dhanishtha', 'Uttara Bhadrapada'],
            'Antya': ['Krittika', 'Rohini', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Swati', 'Vishakha', 'Uttara Ashadha', 'Shravana', 'Revati']
        };

        for (const [nadi, nakshatras] of Object.entries(nadiMap)) {
            if (nakshatras.includes(nakshatraName)) return nadi;
        }
        return 'Madhya'; // Default
    }

    /**
     * Get compatibility rating based on total score
     * @param {number} score - Total Guna Milan score
     * @returns {string} Compatibility rating
     */
    getCompatibilityRating(score) {
        if (score >= 28) return "Excellent Match";
        if (score >= 25) return "Very Good Match";
        if (score >= 22) return "Good Match";
        if (score >= 18) return "Average Match - Proceed with Caution";
        if (score >= 15) return "Below Average - Not Recommended";
        return "Poor Match - Strongly Not Recommended";
    }

    /**
     * Generate recommendations based on scores
     * @param {Object} scores - Individual koota scores
     * @param {number} totalScore - Total compatibility score
     * @returns {Array} List of recommendations
     */
    generateRecommendations(scores, totalScore) {
        const recommendations = [];

        // Check for critical issues
        if (scores.nadi === 0) {
            recommendations.push({
                type: "Critical",
                message: "Nadi dosha present - may affect health and progeny. Consider remedies.",
                remedies: ["Perform Nadi dosha nivaran puja", "Donate to charitable causes", "Wear specific gemstones"]
            });
        }

        if (scores.bhakoot === 0) {
            recommendations.push({
                type: "Critical",
                message: "Bhakoot dosha present - may cause financial and relationship issues.",
                remedies: ["Perform Bhakoot dosha nivaran rituals", "Fast on Tuesdays", "Donate food to poor"]
            });
        }

        if (totalScore < 18) {
            recommendations.push({
                type: "Warning",
                message: "Overall compatibility is low. Consider consulting elders or performing additional analysis.",
                suggestions: ["Check divisional chart compatibility", "Consider astrological remedies", "Evaluate other factors like education and family background"]
            });
        }

        // Positive aspects
        if (scores.yoni >= 2) {
            recommendations.push({
                type: "Positive",
                message: "Good sexual and physical compatibility indicated."
            });
        }

        if (scores.gana >= 3) {
            recommendations.push({
                type: "Positive",
                message: "Temperament compatibility is favorable."
            });
        }

        return recommendations;
    }

    /**
     * Check for exceptional cases that may override low scores
     * @param {Object} scores - Individual koota scores
     * @returns {Array} List of exceptions
     */
    checkExceptions(scores) {
        const exceptions = [];

        // Rajju exception - if Tara is good despite other doshas
        if (scores.tara >= 2 && scores.nadi === 0) {
            exceptions.push({
                type: "Exception",
                name: "Rajju Exception",
                description: "Good Tara score may mitigate Nadi dosha effects.",
                condition: "Tara >= 2 despite Nadi dosha"
            });
        }

        return exceptions;
    }

    /**
     * Generate detailed analysis
     * @param {Object} scores - Individual koota scores
     * @param {number} totalScore - Total score
     * @returns {Object} Analysis object
     */
    generateAnalysis(scores, totalScore) {
        const strengths = [];
        const challenges = [];

        // Analyze strengths
        if (scores.yoni >= 4) strengths.push("Excellent sexual compatibility");
        if (scores.gana >= 6) strengths.push("Perfect temperament match");
        if (scores.grahaMaitri >= 5) strengths.push("Strong mental harmony");
        if (scores.tara >= 3) strengths.push("Excellent longevity prospects");

        // Analyze challenges
        if (scores.nadi === 0) challenges.push("Nadi dosha may affect progeny");
        if (scores.bhakoot === 0) challenges.push("Bhakoot dosha may cause financial issues");
        if (scores.varna === 0) challenges.push("Social compatibility concerns");
        if (totalScore < 18) challenges.push("Overall compatibility below recommended threshold");

        return {
            strengths: strengths,
            challenges: challenges,
            luckyDates: this.generateLuckyDates(scores),
            confidence: totalScore >= 25 ? "High" : totalScore >= 18 ? "Medium" : "Low"
        };
    }

    /**
     * Generate lucky dates based on compatibility
     * @param {Object} scores - Koota scores
     * @returns {Array} Lucky dates
     */
    generateLuckyDates(scores) {
        // Simplified lucky date generation based on strong kootas
        const luckyDates = [];
        if (scores.yoni >= 2) luckyDates.push("Fridays");
        if (scores.gana >= 3) luckyDates.push("Wednesdays");
        if (scores.tara >= 2) luckyDates.push("Mondays");
        return luckyDates.length > 0 ? luckyDates : ["Consult astrologer for auspicious dates"];
    }

    /**
     * Generate unique compatibility ID
     * @returns {string} UUID-like ID
     */
    generateCompatibilityId() {
        return 'compat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

module.exports = GunaMilanCalculator;