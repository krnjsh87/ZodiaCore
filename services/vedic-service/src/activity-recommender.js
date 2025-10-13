/**
 * ZodiaCore - Activity Recommender
 *
 * Provides activity-specific lucky number and timing recommendations.
 * Combines numerology with traditional activity-based guidance.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    ACTIVITY_LUCKY_NUMBERS,
    AUSPICIOUS_MONTHS,
    PREFERRED_NAKSHATRAS
} = require('./numerology-constants');

const { validateActivityType } = require('./numerology-utils');

/**
 * Activity-specific lucky number and timing recommendations
 */
class ActivityRecommender {
    constructor() {
        this.activityRules = {
            marriage: {
                luckyNumbers: ACTIVITY_LUCKY_NUMBERS.marriage,
                auspiciousMonths: AUSPICIOUS_MONTHS.marriage,
                preferredNakshatras: PREFERRED_NAKSHATRAS.marriage,
                numerologyWeight: 0.8,
                timingWeight: 0.9
            },
            business: {
                luckyNumbers: ACTIVITY_LUCKY_NUMBERS.business,
                auspiciousMonths: AUSPICIOUS_MONTHS.business,
                preferredNakshatras: PREFERRED_NAKSHATRAS.business,
                numerologyWeight: 0.9,
                timingWeight: 0.7
            },
            education: {
                luckyNumbers: ACTIVITY_LUCKY_NUMBERS.education,
                auspiciousMonths: AUSPICIOUS_MONTHS.education,
                preferredNakshatras: PREFERRED_NAKSHATRAS.education,
                numerologyWeight: 0.7,
                timingWeight: 0.8
            },
            travel: {
                luckyNumbers: ACTIVITY_LUCKY_NUMBERS.travel,
                auspiciousMonths: AUSPICIOUS_MONTHS.travel,
                preferredNakshatras: PREFERRED_NAKSHATRAS.travel,
                numerologyWeight: 0.6,
                timingWeight: 0.9
            },
            health: {
                luckyNumbers: ACTIVITY_LUCKY_NUMBERS.health,
                auspiciousMonths: AUSPICIOUS_MONTHS.health,
                preferredNakshatras: PREFERRED_NAKSHATRAS.health,
                numerologyWeight: 0.8,
                timingWeight: 0.6
            },
            career: {
                luckyNumbers: ACTIVITY_LUCKY_NUMBERS.career,
                auspiciousMonths: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12], // All months
                preferredNakshatras: ['Rohini', 'Pushya', 'Hasta', 'Chitra'],
                numerologyWeight: 0.7,
                timingWeight: 0.8
            },
            finance: {
                luckyNumbers: ACTIVITY_LUCKY_NUMBERS.finance,
                auspiciousMonths: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12], // All months
                preferredNakshatras: ['Pushya', 'Hasta', 'Chitra', 'Swati'],
                numerologyWeight: 0.8,
                timingWeight: 0.7
            }
        };
    }

    /**
     * Generate activity-specific recommendations
     * @param {object} profile - Numerology profile
     * @param {string} activityType - Activity type
     * @param {object} dateRange - Date range for analysis
     * @returns {object} Activity-specific recommendations
     */
    generateActivityRecommendations(profile, activityType, dateRange) {
        const rules = this.activityRules[activityType];
        if (!rules) {
            return this.generateGenericRecommendations(profile, activityType);
        }

        const recommendations = {
            activityType: activityType,
            luckyNumbers: this.prioritizeLuckyNumbers(profile, rules.luckyNumbers),
            auspiciousMonths: rules.auspiciousMonths,
            preferredNakshatras: rules.preferredNakshatras,
            timingPreferences: this.generateTimingPreferences(rules, dateRange),
            numerologyInsights: this.generateActivityNumerologyInsights(profile, rules),
            precautions: this.generateActivityPrecautions(activityType)
        };

        return recommendations;
    }

    /**
     * Prioritize lucky numbers for activity
     * @param {object} profile - Numerology profile
     * @param {number[]} activityNumbers - Activity-specific lucky numbers
     * @returns {Array} Prioritized lucky numbers with reasons
     */
    prioritizeLuckyNumbers(profile, activityNumbers) {
        const personalNumbers = profile.categories.primary.numbers;
        const prioritized = [];

        // First, add matching personal and activity numbers
        for (const num of activityNumbers) {
            if (personalNumbers.includes(num)) {
                prioritized.push({
                    number: num,
                    priority: 'high',
                    reason: 'Matches both personal and activity preferences'
                });
            }
        }

        // Then add other activity numbers
        for (const num of activityNumbers) {
            if (!prioritized.some(p => p.number === num)) {
                prioritized.push({
                    number: num,
                    priority: 'medium',
                    reason: 'Activity-specific lucky number'
                });
            }
        }

        // Finally add remaining personal numbers
        for (const num of personalNumbers) {
            if (!prioritized.some(p => p.number === num)) {
                prioritized.push({
                    number: num,
                    priority: 'low',
                    reason: 'Personal lucky number'
                });
            }
        }

        return prioritized;
    }

    /**
     * Generate timing preferences for activity
     * @param {object} rules - Activity rules
     * @param {object} dateRange - Date range
     * @returns {object} Timing preferences
     */
    generateTimingPreferences(rules, dateRange) {
        const preferences = {
            numerologyWeight: rules.numerologyWeight,
            timingWeight: rules.timingWeight,
            preferredMonths: rules.auspiciousMonths,
            dateRange: dateRange
        };

        return preferences;
    }

    /**
     * Generate activity-specific numerology insights
     * @param {object} profile - Numerology profile
     * @param {object} rules - Activity rules
     * @returns {string[]} Array of insights
     */
    generateActivityNumerologyInsights(profile, rules) {
        const insights = [];
        const personalPrimaries = profile.categories.primary.numbers;
        const activityMatches = personalPrimaries.filter(num => rules.luckyNumbers.includes(num));

        if (activityMatches.length > 0) {
            insights.push(`Your lucky numbers ${activityMatches.join(', ')} are particularly favorable for ${rules.activityType || 'this activity'}.`);
        }

        insights.push(`Incorporate numbers ${rules.luckyNumbers.join(', ')} into planning and decision-making.`);

        return insights;
    }

    /**
     * Generate activity-specific precautions
     * @param {string} activityType - Activity type
     * @returns {string[]} Array of precautions
     */
    generateActivityPrecautions(activityType) {
        const precautions = {
            marriage: [
                'Avoid dates with challenging numbers during Rahu Kaal',
                'Ensure compatibility of lucky numbers between partners',
                'Consider family traditions alongside numerology'
            ],
            business: [
                'Verify business name numerology compatibility',
                'Consider market timing alongside personal lucky numbers',
                'Balance risk-taking numbers with conservative planning'
            ],
            education: [
                'Focus on learning-oriented numbers during study periods',
                'Avoid challenging numbers during examinations',
                'Combine with academic calendar planning'
            ],
            travel: [
                'Check destination numerology compatibility',
                'Consider travel duration and return dates',
                'Balance adventure with safety considerations'
            ],
            health: [
                'Prioritize healing numbers during treatment',
                'Combine with medical astrology recommendations',
                'Focus on positive number sequences'
            ],
            career: [
                'Align career choices with ruling planet numbers',
                'Consider industry-specific numerological factors',
                'Balance ambition with practical considerations'
            ],
            finance: [
                'Use conservative numbers for savings and investments',
                'Avoid speculative numbers during uncertain periods',
                'Consider long-term financial planning cycles'
            ]
        };

        return precautions[activityType] || [
            'Consult multiple numerological systems for comprehensive guidance',
            'Balance personal preferences with traditional wisdom',
            'Consider professional consultation for major decisions'
        ];
    }

    /**
     * Generate generic recommendations for unsupported activities
     * @param {object} profile - Numerology profile
     * @param {string} activityType - Activity type
     * @returns {object} Generic recommendations
     */
    generateGenericRecommendations(profile, activityType) {
        return {
            activityType: activityType,
            luckyNumbers: profile.categories.primary.numbers.map(num => ({
                number: num,
                priority: 'high',
                reason: 'Personal lucky number'
            })),
            auspiciousMonths: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12], // All months
            preferredNakshatras: ['Rohini', 'Pushya', 'Hasta', 'Chitra'],
            timingPreferences: {
                numerologyWeight: 0.7,
                timingWeight: 0.8,
                preferredMonths: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12],
                dateRange: null
            },
            numerologyInsights: [
                `Use your primary lucky numbers ${profile.categories.primary.numbers.join(', ')} for ${activityType}`,
                'Consider numerological compatibility for optimal results'
            ],
            precautions: [
                'Consult with experienced numerologist for specific guidance',
                'Combine numerology with astrological timing for best results',
                'Consider personal circumstances alongside numerical guidance'
            ]
        };
    }

    /**
     * Get activity rules for a specific activity
     * @param {string} activityType - Activity type
     * @returns {object|null} Activity rules or null if not found
     */
    getActivityRules(activityType) {
        return this.activityRules[activityType] || null;
    }

    /**
     * Get all supported activity types
     * @returns {string[]} Array of supported activity types
     */
    getSupportedActivities() {
        return Object.keys(this.activityRules);
    }

    /**
     * Validate and get activity configuration
     * @param {string} activityType - Activity type to validate
     * @returns {object} Activity configuration
     */
    getActivityConfig(activityType) {
        validateActivityType(activityType);
        return this.activityRules[activityType] || this.generateGenericRecommendations({}, activityType);
    }
}

module.exports = ActivityRecommender;