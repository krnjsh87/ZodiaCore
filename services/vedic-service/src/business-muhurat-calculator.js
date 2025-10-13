/**
 * ZodiaCore - Business Muhurat Calculator
 *
 * Specialized calculator for finding auspicious timing for business and financial activities.
 * Incorporates traditional Vedic rules for commerce, investment, and entrepreneurial activities.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const PanchangCalculator = require('./panchang-calculator');
const MuhuratCalculator = require('./muhurat-calculator');
const { ACTIVITY_TITHIS, ACTIVITY_NAKSHATRAS } = require('./muhurat-constants');

/**
 * Business Muhurat Calculator Class
 * Handles specialized calculations for business activities
 */
class BusinessMuhuratCalculator {
    constructor() {
        this.panchangCalculator = new PanchangCalculator();
        this.muhuratCalculator = new MuhuratCalculator();

        // Business-specific favorable conditions
        this.favorableConditions = {
            weekdays: [1, 3, 4, 5, 6], // Sunday, Tuesday, Wednesday, Thursday, Friday
            tithis: ACTIVITY_TITHIS.business,
            nakshatras: ACTIVITY_NAKSHATRAS.business,
            muhurats: [6, 7, 8, 12, 17, 19, 23, 26, 27, 28, 29, 30]
        };
    }

    /**
     * Find suitable business muhurats within a date range
     * @param {Date} startDate - Start date for search
     * @param {Date} endDate - End date for search
     * @param {string} activityType - Type of business activity
     * @param {Object} preferences - User preferences
     * @returns {Array} Array of suitable business muhurats
     */
    async findBusinessMuhurat(startDate, endDate, activityType = 'general', preferences = {}) {
        const suitableDates = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            try {
                const panchang = await this.panchangCalculator.calculatePanchang(
                    date,
                    preferences.latitude || 28.6139,
                    preferences.longitude || 77.2090
                );

                const score = this.evaluateBusinessSuitability(panchang, activityType, preferences);

                if (score.totalScore >= (preferences.minScore || 0.6)) {
                    suitableDates.push({
                        date: new Date(date),
                        panchang: panchang,
                        score: score,
                        activityType: activityType,
                        recommendations: this.getBusinessRecommendations(panchang, score, activityType)
                    });
                }
            } catch (error) {
                console.warn(`Error calculating panchang for ${date}: ${error.message}`);
            }
        }

        return suitableDates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }

    /**
     * Evaluate business suitability of a panchang
     * @param {Object} panchang - Panchang data
     * @param {string} activityType - Business activity type
     * @param {Object} preferences - User preferences
     * @returns {Object} Evaluation score
     */
    evaluateBusinessSuitability(panchang, activityType, preferences) {
        let score = 0;
        const factors = {
            tithi: 0,
            nakshatra: 0,
            yoga: 0,
            karana: 0,
            vara: 0,
            muhurat: 0,
            planetary: 0
        };

        // Tithi evaluation
        if (this.favorableConditions.tithis.includes(panchang.tithi.adjustedNumber)) {
            factors.tithi = 1.0;
            score += 0.20;
        } else {
            factors.tithi = panchang.tithi.isAuspicious ? 0.8 : 0.4;
            score += factors.tithi * 0.20;
        }

        // Nakshatra evaluation
        if (this.favorableConditions.nakshatras.includes(panchang.nakshatra.number)) {
            factors.nakshatra = 1.0;
            score += 0.25;
        } else {
            factors.nakshatra = panchang.nakshatra.isAuspicious ? 0.7 : 0.3;
            score += factors.nakshatra * 0.25;
        }

        // Yoga evaluation
        factors.yoga = panchang.yoga.isAuspicious ? 1.0 : 0.5;
        score += factors.yoga * 0.15;

        // Karana evaluation
        factors.karana = panchang.karana.isAuspicious ? 1.0 : 0.5;
        score += factors.karana * 0.10;

        // Vara (Weekday) evaluation
        if (this.favorableConditions.weekdays.includes(panchang.vara.number)) {
            factors.vara = 1.0;
            score += 0.15;
        } else {
            factors.vara = 0.4; // Business not favorable on Tuesday/Saturday
            score += 0.06;
        }

        // Muhurat evaluation (placeholder)
        factors.muhurat = 0.7;
        score += factors.muhurat * 0.10;

        // Planetary evaluation
        factors.planetary = this.evaluateBusinessPlanetaryPositions(panchang, activityType);
        score += factors.planetary * 0.05;

        return {
            totalScore: Math.round(score * 100) / 100,
            componentScores: factors,
            grade: this.getGrade(score),
            recommendation: this.getRecommendation(score, activityType)
        };
    }

    /**
     * Evaluate planetary positions for business activities
     * @param {Object} panchang - Panchang data
     * @param {string} activityType - Business activity type
     * @returns {number} Planetary score (0-1)
     */
    evaluateBusinessPlanetaryPositions(panchang, activityType) {
        // Mercury is important for business and communication
        // Jupiter for wisdom and expansion
        // Venus for luxury business
        let score = 0.6;

        // Adjust based on activity type
        switch (activityType) {
            case 'trading':
                // Mercury dominant
                score = 0.8;
                break;
            case 'investment':
                // Jupiter dominant
                score = 0.7;
                break;
            case 'manufacturing':
                // Mars for energy
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
     * @param {string} activityType - Business activity type
     * @returns {string} Recommendation
     */
    getRecommendation(score, activityType) {
        const activity = activityType || 'business';

        if (score >= 0.8) {
            return `Excellent time for ${activity}. Proceed with confidence.`;
        } else if (score >= 0.6) {
            return `Good time for ${activity}. Generally favorable.`;
        } else if (score >= 0.4) {
            return `Fair time for ${activity}. Consider alternatives if possible.`;
        } else {
            return `Inauspicious time for ${activity}. Avoid if possible or perform remedies.`;
        }
    }

    /**
     * Get business-specific recommendations
     * @param {Object} panchang - Panchang data
     * @param {Object} score - Score data
     * @param {string} activityType - Business activity type
     * @returns {Array} Recommendations
     */
    getBusinessRecommendations(panchang, score, activityType) {
        const recommendations = [];

        if (score.totalScore >= 0.7) {
            recommendations.push(`Favorable time for ${activityType || 'business'} activities`);
            recommendations.push('Consider performing Lakshmi Puja for prosperity');
        }

        if (!panchang.vara.isAuspicious) {
            recommendations.push('Weekday is not traditionally favorable for business');
        }

        if (!panchang.yoga.isAuspicious) {
            recommendations.push('Consider chanting business success mantras');
        }

        recommendations.push('Consult with financial astrologer for detailed analysis');
        recommendations.push('Consider market conditions along with astrological timing');

        return recommendations;
    }
}

module.exports = BusinessMuhuratCalculator;