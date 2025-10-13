/**
 * ZodiaCore - Muhurat Scorer
 *
 * Comprehensive scoring system for evaluating auspicious timing (Muhurat).
 * Provides weighted evaluation of Panchang elements for various activities.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { SCORING_WEIGHTS, ACTIVITY_TITHIS, ACTIVITY_NAKSHATRAS } = require('./muhurat-constants');

/**
 * Muhurat Scorer Class
 * Handles comprehensive scoring of Muhurat selections
 */
class MuhuratScorer {
    constructor() {
        this.weights = SCORING_WEIGHTS;
    }

    /**
     * Calculate comprehensive Muhurat score
     * @param {Object} panchang - Panchang data
     * @param {string} activityType - Type of activity
     * @param {Object} timeSlot - Time slot information (optional)
     * @returns {Object} Complete scoring result
     */
    calculateMuhuratScore(panchang, activityType, timeSlot = null) {
        const scores = {
            tithi: this.scoreTithi(panchang.tithi, activityType),
            nakshatra: this.scoreNakshatra(panchang.nakshatra, activityType),
            yoga: this.scoreYoga(panchang.yoga, activityType),
            karana: this.scoreKarana(panchang.karana, activityType),
            vara: this.scoreVara(panchang.vara, activityType),
            muhurat: timeSlot ? this.scoreMuhuratTime(timeSlot, activityType) : 0.7,
            planetary: this.scorePlanetaryPositions(panchang, activityType)
        };

        const totalScore = Object.keys(scores).reduce((sum, key) => {
            return sum + (scores[key] * this.weights[key]);
        }, 0);

        return {
            totalScore: Math.round(totalScore * 100) / 100,
            componentScores: scores,
            grade: this.getGrade(totalScore),
            recommendation: this.getRecommendation(totalScore, activityType),
            strengths: this.identifyStrengths(panchang, activityType),
            weaknesses: this.identifyWeaknesses(panchang, activityType)
        };
    }

    /**
     * Score Tithi for specific activity
     * @param {Object} tithi - Tithi data
     * @param {string} activityType - Activity type
     * @returns {number} Score (0-1)
     */
    scoreTithi(tithi, activityType) {
        const activityTithis = ACTIVITY_TITHIS[activityType] || ACTIVITY_TITHIS.general;

        if (activityTithis.includes(tithi.adjustedNumber)) {
            return 1.0; // Perfect match
        }

        if (tithi.isAuspicious) {
            return 0.8; // Generally auspicious
        }

        // Check for inauspicious tithis
        const inauspiciousTithis = {
            marriage: [4, 6, 8, 12, 14],
            business: [8, 14],
            travel: [4, 9, 14]
        };

        if (inauspiciousTithis[activityType]?.includes(tithi.adjustedNumber)) {
            return 0.2; // Highly inauspicious
        }

        return 0.6; // Neutral
    }

    /**
     * Score Nakshatra for specific activity
     * @param {Object} nakshatra - Nakshatra data
     * @param {string} activityType - Activity type
     * @returns {number} Score (0-1)
     */
    scoreNakshatra(nakshatra, activityType) {
        const activityNakshatras = ACTIVITY_NAKSHATRAS[activityType] || ACTIVITY_NAKSHATRAS.general;

        if (activityNakshatras.includes(nakshatra.number)) {
            return 1.0; // Perfect match
        }

        if (nakshatra.isAuspicious) {
            return 0.8; // Generally auspicious
        }

        // Check for Gand Mula Nakshatras (generally inauspicious)
        const gandMulaNakshatras = [5, 6, 9, 10, 12, 14, 18, 20, 22, 24, 25];
        if (gandMulaNakshatras.includes(nakshatra.number)) {
            return 0.2; // Highly inauspicious
        }

        return 0.4; // Generally inauspicious
    }

    /**
     * Score Yoga
     * @param {Object} yoga - Yoga data
     * @param {string} activityType - Activity type
     * @returns {number} Score (0-1)
     */
    scoreYoga(yoga, activityType) {
        if (yoga.isAuspicious) {
            return 1.0;
        }

        // Activity-specific yoga preferences
        const weakYogas = [1, 9, 10, 13, 14, 17, 19, 20, 22, 27];
        if (weakYogas.includes(yoga.number)) {
            return 0.3; // Weak yoga
        }

        return 0.6; // Neutral
    }

    /**
     * Score Karana
     * @param {Object} karana - Karana data
     * @param {string} activityType - Activity type
     * @returns {number} Score (0-1)
     */
    scoreKarana(karana, activityType) {
        if (karana.isAuspicious) {
            return 1.0;
        }

        return 0.5; // Neutral for inauspicious karanas
    }

    /**
     * Score Vara (Weekday)
     * @param {Object} vara - Vara data
     * @param {string} activityType - Activity type
     * @returns {number} Score (0-1)
     */
    scoreVara(vara, activityType) {
        // Activity-specific weekday preferences
        const weekdayPreferences = {
            marriage: { good: [1, 2, 4, 5, 6], bad: [3, 7] },
            business: { good: [1, 3, 4, 5, 6], bad: [2, 7] },
            travel: { good: [1, 3, 4, 5, 6], bad: [2, 7] },
            education: { good: [1, 3, 4, 5, 6], bad: [2, 7] },
            medical: { good: [1, 3, 4, 5, 6], bad: [2, 7] },
            general: { good: [1, 2, 3, 4, 5, 6], bad: [7] }
        };

        const prefs = weekdayPreferences[activityType] || weekdayPreferences.general;

        if (prefs.good.includes(vara.number)) {
            return 1.0;
        }

        if (prefs.bad.includes(vara.number)) {
            return 0.3;
        }

        return 0.7; // Neutral
    }

    /**
     * Score Muhurat time slot
     * @param {Object} timeSlot - Time slot data
     * @param {string} activityType - Activity type
     * @returns {number} Score (0-1)
     */
    scoreMuhuratTime(timeSlot, activityType) {
        // This would integrate with the MuhuratCalculator
        // For now, return a placeholder score
        return 0.7;
    }

    /**
     * Score planetary positions
     * @param {Object} panchang - Panchang data
     * @param {string} activityType - Activity type
     * @returns {number} Score (0-1)
     */
    scorePlanetaryPositions(panchang, activityType) {
        // Simplified planetary scoring
        // In production, would analyze specific planetary positions
        let score = 0.6;

        // Activity-specific adjustments
        switch (activityType) {
            case 'marriage':
                // Venus and Jupiter are important
                score = 0.8;
                break;
            case 'business':
                // Mercury and Jupiter are important
                score = 0.7;
                break;
            case 'travel':
                // Moon and Mars are important
                score = 0.7;
                break;
            case 'education':
                // Jupiter and Mercury are important
                score = 0.8;
                break;
            default:
                score = 0.6;
        }

        return score;
    }

    /**
     * Get grade based on total score
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
     * @param {string} activityType - Activity type
     * @returns {string} Recommendation
     */
    getRecommendation(score, activityType) {
        if (score >= 0.8) {
            return `Excellent time for ${activityType}. Proceed with confidence.`;
        } else if (score >= 0.6) {
            return `Good time for ${activityType}. Generally favorable.`;
        } else if (score >= 0.4) {
            return `Fair time for ${activityType}. Consider alternatives if possible.`;
        } else {
            return `Inauspicious time for ${activityType}. Avoid if possible or perform remedies.`;
        }
    }

    /**
     * Identify strengths of the Muhurat
     * @param {Object} panchang - Panchang data
     * @param {string} activityType - Activity type
     * @returns {Array} List of strengths
     */
    identifyStrengths(panchang, activityType) {
        const strengths = [];

        if (panchang.tithi.isAuspicious) {
            strengths.push(`Auspicious Tithi: ${panchang.tithi.name}`);
        }

        if (panchang.nakshatra.isAuspicious) {
            strengths.push(`Beneficial Nakshatra: ${panchang.nakshatra.name}`);
        }

        if (panchang.yoga.isAuspicious) {
            strengths.push(`Favorable Yoga: ${panchang.yoga.name}`);
        }

        if (panchang.karana.isAuspicious) {
            strengths.push(`Good Karana: ${panchang.karana.name}`);
        }

        if (panchang.vara.isAuspicious) {
            strengths.push(`Auspicious Day: ${panchang.vara.englishName}`);
        }

        return strengths;
    }

    /**
     * Identify weaknesses of the Muhurat
     * @param {Object} panchang - Panchang data
     * @param {string} activityType - Activity type
     * @returns {Array} List of weaknesses
     */
    identifyWeaknesses(panchang, activityType) {
        const weaknesses = [];

        if (!panchang.tithi.isAuspicious) {
            weaknesses.push(`Challenging Tithi: ${panchang.tithi.name}`);
        }

        if (!panchang.nakshatra.isAuspicious) {
            weaknesses.push(`Difficult Nakshatra: ${panchang.nakshatra.name}`);
        }

        if (!panchang.yoga.isAuspicious) {
            weaknesses.push(`Unfavorable Yoga: ${panchang.yoga.name}`);
        }

        if (!panchang.karana.isAuspicious) {
            weaknesses.push(`Inauspicious Karana: ${panchang.karana.name}`);
        }

        if (!panchang.vara.isAuspicious) {
            weaknesses.push(`Challenging Day: ${panchang.vara.englishName}`);
        }

        return weaknesses;
    }

    /**
     * Suggest remedies for weak Muhurat
     * @param {Object} panchang - Panchang data
     * @param {string} activityType - Activity type
     * @returns {Array} List of remedies
     */
    suggestRemedies(panchang, activityType) {
        const remedies = [];

        if (!panchang.tithi.isAuspicious) {
            remedies.push('Perform Ganesh Puja before commencing activity');
        }

        if (!panchang.nakshatra.isAuspicious) {
            remedies.push('Chant protective mantras specific to the nakshatra lord');
        }

        if (!panchang.yoga.isAuspicious) {
            remedies.push('Perform general auspicious ceremonies');
        }

        if (!panchang.vara.isAuspicious) {
            remedies.push('Offer prayers to the ruling deity of the day');
        }

        remedies.push('Consult with experienced priest or astrologer');
        remedies.push('Consider alternative auspicious timing');

        return remedies;
    }

    /**
     * Compare two Muhurat scores
     * @param {Object} score1 - First score object
     * @param {Object} score2 - Second score object
     * @returns {Object} Comparison result
     */
    compareScores(score1, score2) {
        const diff = score1.totalScore - score2.totalScore;

        return {
            better: diff > 0 ? 'First' : diff < 0 ? 'Second' : 'Equal',
            difference: Math.abs(diff),
            percentage: Math.abs(diff / Math.max(score1.totalScore, score2.totalScore) * 100)
        };
    }
}

module.exports = MuhuratScorer;