// Chinese Nine Star Ki Calculator
// Module for calculating Nine Star Ki (Flying Stars) and directional influences

const { NINE_STARS, DIRECTIONS, CHINESE_ASTRO_CONSTANTS } = require('./chinese-birth-chart-constants');

/**
 * Nine Star Ki Calculator Class
 */
class NineStarKiCalculator {
    /**
     * Calculate Nine Star Ki for birth chart
     * @param {Object} birthData - Birth information
     * @returns {Object} Nine Star Ki analysis
     */
    calculate(birthData) {
        // Calculate birth star based on year
        const birthStar = this._calculateBirthStar(birthData.year);

        // Calculate current year star
        const currentYear = new Date().getFullYear();
        const currentStar = this._calculateCurrentYearStar(birthData.year, currentYear);

        // Calculate directional influences
        const directions = this._calculateDirectionalStars(birthStar);

        // Generate analysis
        const analysis = this._analyzeStarInfluences(birthStar, directions);

        return {
            birthStar: birthStar,
            currentStar: currentStar,
            directions: directions,
            analysis: analysis
        };
    }

    /**
     * Calculate birth star from birth year
     * @private
     * @param {number} year - Birth year
     * @returns {string} Birth star
     */
    _calculateBirthStar(year) {
        // Nine Star Ki calculation based on year
        // Traditional calculation: 9-star cycle with specific patterns
        const baseYear = 1984; // Jia Zi year (1-White star)
        const yearsDiff = year - baseYear;

        // Nine Star Ki follows a specific 9-year cycle pattern
        // The pattern is: 1, 2, 3, 4, 5, 6, 7, 8, 9, then repeats
        // But adjusted for the starting point
        const starIndex = ((yearsDiff % 9) + 9) % 9; // Ensure positive modulo

        return NINE_STARS[starIndex];
    }

    /**
     * Calculate current year star
     * @private
     * @param {number} birthYear - Birth year
     * @param {number} currentYear - Current year
     * @returns {string} Current year star
     */
    _calculateCurrentYearStar(birthYear, currentYear) {
        const yearsDiff = currentYear - birthYear;
        const starIndex = Math.abs(yearsDiff) % 9;

        return NINE_STARS[starIndex];
    }

    /**
     * Calculate directional star influences
     * @private
     * @param {string} birthStar - Birth star
     * @returns {Object} Directional stars
     */
    _calculateDirectionalStars(birthStar) {
        const directions = {};
        const starNumber = parseInt(birthStar.split('-')[0]);

        // Simplified directional calculation
        // In full implementation, this would use complex flying star charts
        Object.keys(DIRECTIONS).forEach(direction => {
            const directionModifier = this._getDirectionModifier(direction);
            const directionStar = ((starNumber + directionModifier - 1) % 9) + 1;
            directions[direction] = `${directionStar}-${this._getStarColor(directionStar)}`;
        });

        return directions;
    }

    /**
     * Get direction modifier for star calculation
     * @private
     * @param {string} direction - Direction name
     * @returns {number} Modifier value
     */
    _getDirectionModifier(direction) {
        const modifiers = {
            [DIRECTIONS.NORTH]: 1,
            [DIRECTIONS.SOUTH]: 7,
            [DIRECTIONS.EAST]: 3,
            [DIRECTIONS.WEST]: 5,
            [DIRECTIONS.NORTHEAST]: 2,
            [DIRECTIONS.SOUTHEAST]: 8,
            [DIRECTIONS.NORTHWEST]: 4,
            [DIRECTIONS.SOUTHWEST]: 6,
            [DIRECTIONS.CENTER]: 0
        };

        return modifiers[direction] || 0;
    }

    /**
     * Get star color
     * @private
     * @param {number} starNumber - Star number (1-9)
     * @returns {string} Star color
     */
    _getStarColor(starNumber) {
        const colors = {
            1: 'White', 2: 'Black', 3: 'Jade', 4: 'Green',
            5: 'Yellow', 6: 'White', 7: 'Red', 8: 'White', 9: 'Purple'
        };

        return colors[starNumber] || 'White';
    }

    /**
     * Analyze star influences
     * @private
     * @param {string} birthStar - Birth star
     * @param {Object} directions - Directional stars
     * @returns {Object} Analysis results
     */
    _analyzeStarInfluences(birthStar, directions) {
        const starNumber = parseInt(birthStar.split('-')[0]);

        // Simplified analysis - would be more comprehensive in full implementation
        const influences = {
            personality: this._getPersonalityInfluence(starNumber),
            career: this._getCareerInfluence(starNumber),
            relationships: this._getRelationshipInfluence(starNumber),
            health: this._getHealthInfluence(starNumber),
            luckyDirections: this._getLuckyDirections(directions),
            challengingDirections: this._getChallengingDirections(directions)
        };

        return influences;
    }

    /**
     * Get personality influence for star
     * @private
     * @param {number} star - Star number
     * @returns {Array} Personality traits
     */
    _getPersonalityInfluence(star) {
        const traits = {
            1: ['Leadership', 'Independence', 'Determination'],
            2: ['Cooperation', 'Patience', 'Stability'],
            3: ['Creativity', 'Communication', 'Optimism'],
            4: ['Organization', 'Discipline', 'Reliability'],
            5: ['Balance', 'Harmony', 'Adaptability'],
            6: ['Nurturing', 'Responsibility', 'Loyalty'],
            7: ['Analysis', 'Precision', 'Independence'],
            8: ['Authority', 'Justice', 'Protection'],
            9: ['Wisdom', 'Spirituality', 'Humanitarianism']
        };

        return traits[star] || ['Balanced', 'Harmonious'];
    }

    /**
     * Get career influence for star
     * @private
     * @param {number} star - Star number
     * @returns {Array} Career suggestions
     */
    _getCareerInfluence(star) {
        const careers = {
            1: ['Leadership roles', 'Entrepreneurship', 'Management'],
            2: ['Team work', 'Support roles', 'Education'],
            3: ['Creative fields', 'Communication', 'Arts'],
            4: ['Administrative work', 'Finance', 'Planning'],
            5: ['Mediation', 'Counseling', 'Public service'],
            6: ['Healthcare', 'Teaching', 'Service industry'],
            7: ['Research', 'Technology', 'Analysis'],
            8: ['Legal field', 'Government', 'Security'],
            9: ['Counseling', 'Spirituality', 'Humanitarian work']
        };

        return careers[star] || ['Versatile career options'];
    }

    /**
     * Get relationship influence for star
     * @private
     * @param {number} star - Star number
     * @returns {Array} Relationship insights
     */
    _getRelationshipInfluence(star) {
        const relationships = {
            1: ['Values independence', 'Strong partnerships', 'Leadership in relationships'],
            2: ['Harmonious relationships', 'Supportive partner', 'Family-oriented'],
            3: ['Expressive communication', 'Creative connections', 'Social butterfly'],
            4: ['Stable relationships', 'Practical approach', 'Loyal companion'],
            5: ['Balanced partnerships', 'Harmonious unions', 'Diplomatic nature'],
            6: ['Nurturing relationships', 'Caring partner', 'Family focus'],
            7: ['Independent relationships', 'Intellectual connections', 'Selective bonds'],
            8: ['Protective partnerships', 'Strong commitments', 'Justice in relationships'],
            9: ['Spiritual connections', 'Wise partnerships', 'Humanitarian bonds']
        };

        return relationships[star] || ['Balanced relationship approach'];
    }

    /**
     * Get health influence for star
     * @private
     * @param {number} star - Star number
     * @returns {Array} Health focus areas
     */
    _getHealthInfluence(star) {
        const health = {
            1: ['Headaches', 'High blood pressure', 'Stress management'],
            2: ['Digestive health', 'Kidney function', 'Emotional balance'],
            3: ['Throat/respiratory', 'Communication-related stress', 'Heart health'],
            4: ['Liver/gallbladder', 'Structural alignment', 'Discipline in health'],
            5: ['Overall balance', 'Digestive harmony', 'Emotional stability'],
            6: ['Stomach/intestines', 'Nurturing self-care', 'Immune system'],
            7: ['Lungs/respiratory', 'Mental clarity', 'Analytical health approach'],
            8: ['Heart/circulation', 'Authority in health decisions', 'Protective measures'],
            9: ['Spiritual well-being', 'Wisdom in health choices', 'Holistic approach']
        };

        return health[star] || ['General health maintenance'];
    }

    /**
     * Get lucky directions
     * @private
     * @param {Object} directions - Directional stars
     * @returns {Array} Lucky directions
     */
    _getLuckyDirections(directions) {
        // Simplified - in practice, this would be more complex
        const lucky = [];
        Object.entries(directions).forEach(([direction, star]) => {
            const starNum = parseInt(star.split('-')[0]);
            if ([1, 6, 8].includes(starNum)) { // Generally auspicious stars
                lucky.push(direction);
            }
        });
        return lucky;
    }

    /**
     * Get challenging directions
     * @private
     * @param {Object} directions - Directional stars
     * @returns {Array} Challenging directions
     */
    _getChallengingDirections(directions) {
        // Simplified - in practice, this would be more complex
        const challenging = [];
        Object.entries(directions).forEach(([direction, star]) => {
            const starNum = parseInt(star.split('-')[0]);
            if ([2, 5, 7].includes(starNum)) { // Generally challenging stars
                challenging.push(direction);
            }
        });
        return challenging;
    }
}

module.exports = NineStarKiCalculator;