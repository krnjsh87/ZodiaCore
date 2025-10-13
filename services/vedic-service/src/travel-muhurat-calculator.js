/**
 * ZodiaCore - Travel Muhurat Calculator
 *
 * Specialized calculator for finding auspicious timing for journeys and travel.
 * Incorporates traditional Vedic rules for safe and successful travel.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const PanchangCalculator = require('./panchang-calculator');
const MuhuratCalculator = require('./muhurat-calculator');
const { ACTIVITY_TITHIS, ACTIVITY_NAKSHATRAS, TRAVEL_DIRECTIONS } = require('./muhurat-constants');

/**
 * Travel Muhurat Calculator Class
 * Handles specialized calculations for travel and journeys
 */
class TravelMuhuratCalculator {
    constructor() {
        this.panchangCalculator = new PanchangCalculator();
        this.muhuratCalculator = new MuhuratCalculator();

        // Travel-specific safe conditions
        this.safeConditions = {
            tithis: ACTIVITY_TITHIS.travel,
            nakshatras: ACTIVITY_NAKSHATRAS.travel,
            directions: TRAVEL_DIRECTIONS
        };
    }

    /**
     * Find suitable travel muhurats within a date range
     * @param {Date} startDate - Start date for search
     * @param {Date} endDate - End date for search
     * @param {string} direction - Travel direction (north, south, east, west)
     * @param {Object} preferences - User preferences
     * @returns {Array} Array of suitable travel muhurats
     */
    async findTravelMuhurat(startDate, endDate, direction = 'general', preferences = {}) {
        const suitableDates = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            try {
                const panchang = await this.panchangCalculator.calculatePanchang(
                    date,
                    preferences.latitude || 28.6139,
                    preferences.longitude || 77.2090
                );

                const score = this.evaluateTravelSuitability(panchang, direction, preferences);

                if (score.totalScore >= (preferences.minScore || 0.6)) {
                    suitableDates.push({
                        date: new Date(date),
                        panchang: panchang,
                        score: score,
                        direction: direction,
                        recommendations: this.getTravelRecommendations(panchang, score, direction)
                    });
                }
            } catch (error) {
                console.warn(`Error calculating panchang for ${date}: ${error.message}`);
            }
        }

        return suitableDates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }

    /**
     * Evaluate travel suitability of a panchang
     * @param {Object} panchang - Panchang data
     * @param {string} direction - Travel direction
     * @param {Object} preferences - User preferences
     * @returns {Object} Evaluation score
     */
    evaluateTravelSuitability(panchang, direction, preferences) {
        let score = 0;
        const factors = {
            tithi: 0,
            nakshatra: 0,
            yoga: 0,
            karana: 0,
            vara: 0,
            direction: 0,
            planetary: 0
        };

        // Tithi evaluation
        if (this.safeConditions.tithis.includes(panchang.tithi.adjustedNumber)) {
            factors.tithi = 1.0;
            score += 0.20;
        } else {
            factors.tithi = panchang.tithi.isAuspicious ? 0.7 : 0.3;
            score += factors.tithi * 0.20;
        }

        // Nakshatra evaluation
        if (this.safeConditions.nakshatras.includes(panchang.nakshatra.number)) {
            factors.nakshatra = 1.0;
            score += 0.25;
        } else {
            factors.nakshatra = panchang.nakshatra.isAuspicious ? 0.6 : 0.2;
            score += factors.nakshatra * 0.25;
        }

        // Yoga evaluation
        factors.yoga = panchang.yoga.isAuspicious ? 1.0 : 0.5;
        score += factors.yoga * 0.15;

        // Karana evaluation
        factors.karana = panchang.karana.isAuspicious ? 1.0 : 0.5;
        score += factors.karana * 0.10;

        // Vara (Weekday) evaluation for direction
        const directionFavorable = this.isDirectionFavorable(panchang.vara.number, direction);
        factors.vara = directionFavorable ? 1.0 : 0.4;
        score += factors.vara * 0.15;

        // Direction evaluation
        factors.direction = directionFavorable ? 1.0 : 0.5;
        score += factors.direction * 0.10;

        // Planetary evaluation
        factors.planetary = this.evaluateTravelPlanetaryPositions(panchang, direction);
        score += factors.planetary * 0.05;

        return {
            totalScore: Math.round(score * 100) / 100,
            componentScores: factors,
            grade: this.getGrade(score),
            recommendation: this.getRecommendation(score, direction)
        };
    }

    /**
     * Check if direction is favorable for the weekday
     * @param {number} weekday - Weekday number (1-7)
     * @param {string} direction - Travel direction
     * @returns {boolean} True if favorable
     */
    isDirectionFavorable(weekday, direction) {
        if (direction === 'general') return true;

        const favorableWeekdays = this.safeConditions.directions[direction];
        return favorableWeekdays ? favorableWeekdays.includes(weekday) : true;
    }

    /**
     * Evaluate planetary positions for travel
     * @param {Object} panchang - Panchang data
     * @param {string} direction - Travel direction
     * @returns {number} Planetary score (0-1)
     */
    evaluateTravelPlanetaryPositions(panchang, direction) {
        // Moon is important for travel
        // Mars for courage and energy
        // Mercury for communication during travel
        let score = 0.6;

        // Adjust based on direction
        switch (direction) {
            case 'north':
                // Moon dominant for north
                score = 0.8;
                break;
            case 'south':
                // Mars dominant for south
                score = 0.7;
                break;
            case 'east':
                // Sun dominant for east
                score = 0.7;
                break;
            case 'west':
                // Saturn dominant for west
                score = 0.6;
                break;
            default:
                score = 0.6;
        }

        return score;
    }

    /**
     * Get grade based on score
     * @param {number} score - Total score
     * @returns {string} Grade
     */
    getGrade(score) {
        if (score >= 0.8) return 'Excellent';
        if (score >= 0.7) return 'Very Good';
        if (score >= 0.6) return 'Good';
        if (score >= 0.5) return 'Fair';
        if (score >= 0.4) return 'Poor';
        return 'Inauspicious';
    }

    /**
     * Get recommendation based on score
     * @param {number} score - Total score
     * @param {string} direction - Travel direction
     * @returns {string} Recommendation
     */
    getRecommendation(score, direction) {
        const dir = direction !== 'general' ? ` ${direction}bound` : '';

        if (score >= 0.8) {
            return `Excellent time for${dir} travel. Safe and auspicious journey expected.`;
        } else if (score >= 0.6) {
            return `Good time for${dir} travel. Generally favorable with minor precautions.`;
        } else if (score >= 0.4) {
            return `Fair time for${dir} travel. Consider alternatives if possible.`;
        } else {
            return `Inauspicious time for${dir} travel. Avoid if possible or perform remedies.`;
        }
    }

    /**
     * Get travel-specific recommendations
     * @param {Object} panchang - Panchang data
     * @param {Object} score - Score data
     * @param {string} direction - Travel direction
     * @returns {Array} Recommendations
     */
    getTravelRecommendations(panchang, score, direction) {
        const recommendations = [];

        if (score.totalScore >= 0.7) {
            recommendations.push(`Favorable time for ${direction !== 'general' ? direction + 'bound ' : ''}travel`);
            recommendations.push('Perform safe travel prayers before departure');
        }

        if (!this.isDirectionFavorable(panchang.vara.number, direction)) {
            recommendations.push(`Direction ${direction} is not ideal for ${panchang.vara.englishName}`);
            recommendations.push('Consider changing travel direction or date');
        }

        if (!panchang.nakshatra.isAuspicious) {
            recommendations.push('Nakshatra is challenging - perform travel protection rituals');
        }

        recommendations.push('Carry protective items (turmeric, coconut, etc.)');
        recommendations.push('Start journey after chanting travel mantras');
        recommendations.push('Consult with experienced astrologer for detailed analysis');

        return recommendations;
    }
}

module.exports = TravelMuhuratCalculator;