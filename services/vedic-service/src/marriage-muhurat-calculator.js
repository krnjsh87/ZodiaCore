/**
 * ZodiaCore - Marriage Muhurat Calculator
 *
 * Specialized calculator for finding auspicious timing for marriage ceremonies.
 * Incorporates traditional Vedic rules, planetary positions, and activity-specific
 * requirements for marriage muhurat selection.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const PanchangCalculator = require('./panchang-calculator');
const MuhuratCalculator = require('./muhurat-calculator');
const {
    ACTIVITY_TITHIS,
    ACTIVITY_NAKSHATRAS,
    GAND_MULA_NAKSHATRAS,
    RAHU_KAAL_HOURS
} = require('./muhurat-constants');

/**
 * Marriage Muhurat Calculator Class
 * Handles specialized calculations for marriage ceremonies
 */
class MarriageMuhuratCalculator {
    constructor() {
        this.panchangCalculator = new PanchangCalculator();
        this.muhuratCalculator = new MuhuratCalculator();

        // Marriage-specific ideal conditions
        this.idealConditions = {
            tithis: ACTIVITY_TITHIS.marriage,
            nakshatras: ACTIVITY_NAKSHATRAS.marriage,
            weekdays: [1, 2, 4, 5, 6], // Sunday, Monday, Wednesday, Thursday, Friday
            muhurats: [3, 6, 7, 8, 12, 17, 19, 21, 23, 26, 27, 28, 29, 30]
        };

        // Conditions to avoid for marriage
        this.avoidConditions = {
            tithis: [4, 6, 8, 9, 14], // Chaturthi, Shashthi, Ashtami, Navami, Chaturdashi
            nakshatras: GAND_MULA_NAKSHATRAS, // Gand Mula Nakshatras
            weekdays: [3, 7], // Tuesday, Saturday
            lunarPhases: ['Amavasya', 'Purnima'] // New moon, Full moon
        };
    }

    /**
     * Find suitable marriage muhurats within a date range
     * @param {Date} startDate - Start date for search
     * @param {Date} endDate - End date for search
     * @param {Object} preferences - User preferences and location
     * @returns {Array} Array of suitable marriage muhurats
     */
    async findMarriageMuhurat(startDate, endDate, preferences = {}) {
        const suitableDates = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            try {
                const panchang = await this.panchangCalculator.calculatePanchang(
                    date,
                    preferences.latitude || 28.6139, // Default Delhi
                    preferences.longitude || 77.2090
                );

                const score = this.evaluateMarriageSuitability(panchang, preferences);

                if (score.totalScore >= (preferences.minScore || 0.7)) {
                    suitableDates.push({
                        date: new Date(date),
                        panchang: panchang,
                        score: score,
                        recommendations: this.getMarriageRecommendations(panchang, score)
                    });
                }
            } catch (error) {
                console.warn(`Error calculating panchang for ${date}: ${error.message}`);
            }
        }

        return suitableDates.sort((a, b) => b.score.totalScore - a.score.totalScore);
    }

    /**
     * Evaluate marriage suitability of a panchang
     * @param {Object} panchang - Panchang data
     * @param {Object} preferences - User preferences
     * @returns {Object} Evaluation score
     */
    evaluateMarriageSuitability(panchang, preferences) {
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
        if (this.idealConditions.tithis.includes(panchang.tithi.adjustedNumber)) {
            factors.tithi = 1.0;
            score += 0.20;
        } else if (this.avoidConditions.tithis.includes(panchang.tithi.adjustedNumber)) {
            factors.tithi = 0.1;
            score += 0.02;
        } else {
            factors.tithi = 0.6;
            score += 0.12;
        }

        // Nakshatra evaluation
        if (this.idealConditions.nakshatras.includes(panchang.nakshatra.number)) {
            factors.nakshatra = 1.0;
            score += 0.25;
        } else if (this.isGandMulaNakshatra(panchang.nakshatra.number)) {
            factors.nakshatra = 0.1;
            score += 0.025;
        } else {
            factors.nakshatra = 0.4;
            score += 0.10;
        }

        // Yoga evaluation
        factors.yoga = panchang.yoga.isAuspicious ? 1.0 : 0.5;
        score += factors.yoga * 0.15;

        // Karana evaluation
        factors.karana = panchang.karana.isAuspicious ? 1.0 : 0.5;
        score += factors.karana * 0.10;

        // Vara (Weekday) evaluation
        if (this.idealConditions.weekdays.includes(panchang.vara.number)) {
            factors.vara = 1.0;
            score += 0.15;
        } else if (this.avoidConditions.weekdays.includes(panchang.vara.number)) {
            factors.vara = 0.2;
            score += 0.03;
        } else {
            factors.vara = 0.6;
            score += 0.09;
        }

        // Muhurat evaluation (simplified - would need time slots)
        factors.muhurat = 0.7; // Placeholder
        score += factors.muhurat * 0.10;

        // Planetary evaluation
        factors.planetary = this.evaluatePlanetaryPositions(panchang);
        score += factors.planetary * 0.05;

        // Apply penalties
        if (this.isGandMulaNakshatra(panchang.nakshatra.number)) {
            score *= 0.3; // Significant penalty
        }

        if (this.isRahuKaalActive(panchang, preferences.timeOfDay)) {
            score *= 0.7; // Moderate penalty
        }

        return {
            totalScore: Math.round(score * 100) / 100,
            componentScores: factors,
            grade: this.getGrade(score),
            recommendation: this.getRecommendation(score)
        };
    }

    /**
     * Check if nakshatra is Gand Mula (inauspicious for marriage)
     * @param {number} nakshatraNumber - Nakshatra number
     * @returns {boolean} True if Gand Mula
     */
    isGandMulaNakshatra(nakshatraNumber) {
        return GAND_MULA_NAKSHATRAS.includes(nakshatraNumber);
    }

    /**
     * Check if Rahu Kaal is active
     * @param {Object} panchang - Panchang data
     * @param {number} timeOfDay - Time of day in hours
     * @returns {boolean} True if Rahu Kaal active
     */
    isRahuKaalActive(panchang, timeOfDay) {
        if (!timeOfDay) return false;

        const weekday = panchang.vara.number - 1;
        const [startHour, endHour] = RAHU_KAAL_HOURS[weekday];

        return timeOfDay >= startHour && timeOfDay < endHour;
    }

    /**
     * Evaluate planetary positions for marriage
     * @param {Object} panchang - Panchang data
     * @returns {number} Planetary score (0-1)
     */
    evaluatePlanetaryPositions(panchang) {
        // Simplified planetary evaluation
        // In production, would check Venus, Jupiter, Mars positions
        let score = 0.5;

        // Venus is important for marriage
        // Jupiter for blessings
        // Mars for energy (but not too strong)

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
     * @returns {string} Recommendation
     */
    getRecommendation(score) {
        if (score >= 0.8) {
            return 'Excellent time for marriage. Proceed with confidence.';
        } else if (score >= 0.6) {
            return 'Good time for marriage. Generally favorable.';
        } else if (score >= 0.4) {
            return 'Fair time for marriage. Consider alternatives if possible.';
        } else {
            return 'Inauspicious time for marriage. Avoid if possible or perform remedies.';
        }
    }

    /**
     * Get marriage-specific recommendations
     * @param {Object} panchang - Panchang data
     * @param {Object} score - Score data
     * @returns {Array} Recommendations
     */
    getMarriageRecommendations(panchang, score) {
        const recommendations = [];

        if (score.totalScore >= 0.7) {
            recommendations.push('Ideal time for marriage ceremony');
            recommendations.push('Perform traditional Vedic marriage rituals');
        }

        if (this.isGandMulaNakshatra(panchang.nakshatra.number)) {
            recommendations.push('WARNING: Gand Mula Nakshatra - avoid marriage');
            recommendations.push('Perform special pujas and remedies before marriage');
        }

        if (!panchang.tithi.isAuspicious) {
            recommendations.push('Consider performing Ganesh Puja before ceremony');
        }

        if (!panchang.nakshatra.isAuspicious) {
            recommendations.push('Chant protective mantras for the nakshatra lord');
        }

        recommendations.push('Consult with experienced priest or astrologer');
        recommendations.push('Consider gotra matching and kundli compatibility');

        return recommendations;
    }

    /**
     * Find the best marriage muhurat for a specific date
     * @param {Date} date - Specific date
     * @param {Object} preferences - User preferences
     * @returns {Object} Best muhurat for the date
     */
    async findBestMuhuratForDate(date, preferences = {}) {
        const panchang = await this.panchangCalculator.calculatePanchang(
            date,
            preferences.latitude || 28.6139,
            preferences.longitude || 77.2090
        );

        const sunrise = panchang.sunrise;
        const muhurats = this.muhuratCalculator.calculateDailyMuhurats(sunrise, date);

        // Find best muhurat for marriage
        const bestMuhurat = this.muhuratCalculator.findBestMuhuratForActivity(
            muhurats,
            'marriage'
        );

        return {
            date: date,
            panchang: panchang,
            bestMuhurat: bestMuhurat,
            overallScore: this.evaluateMarriageSuitability(panchang, preferences)
        };
    }

    /**
     * Validate marriage muhurat selection
     * @param {Object} selectedMuhurat - Selected muhurat data
     * @returns {Object} Validation results
     */
    validateMarriageMuhurat(selectedMuhurat) {
        const validations = {
            gandMulaCheck: !this.isGandMulaNakshatra(selectedMuhurat.panchang.nakshatra.number),
            rahuKaalCheck: !this.isRahuKaalActive(selectedMuhurat.panchang, selectedMuhurat.timeOfDay),
            tithiCheck: selectedMuhurat.panchang.tithi.isAuspicious,
            weekdayCheck: this.idealConditions.weekdays.includes(selectedMuhurat.panchang.vara.number),
            lunarPhaseCheck: !this.avoidConditions.lunarPhases.includes(selectedMuhurat.panchang.tithi.name)
        };

        const passedValidations = Object.values(validations).filter(v => v).length;
        const totalValidations = Object.keys(validations).length;

        return {
            isValid: passedValidations >= totalValidations * 0.7, // 70% pass rate
            validations: validations,
            score: passedValidations / totalValidations,
            recommendations: this.generateValidationRecommendations(validations)
        };
    }

    /**
     * Generate validation recommendations
     * @param {Object} validations - Validation results
     * @returns {Array} Recommendations
     */
    generateValidationRecommendations(validations) {
        const recommendations = [];

        if (!validations.gandMulaCheck) {
            recommendations.push('Avoid Gand Mula Nakshatra - highly inauspicious for marriage');
        }

        if (!validations.rahuKaalCheck) {
            recommendations.push('Avoid Rahu Kaal period');
        }

        if (!validations.tithiCheck) {
            recommendations.push('Tithi is not ideal - consider performing additional pujas');
        }

        if (!validations.weekdayCheck) {
            recommendations.push('Weekday is not traditionally favorable for marriage');
        }

        if (!validations.lunarPhaseCheck) {
            recommendations.push('Avoid marriage during Amavasya or Purnima');
        }

        return recommendations;
    }
}

module.exports = MarriageMuhuratCalculator;