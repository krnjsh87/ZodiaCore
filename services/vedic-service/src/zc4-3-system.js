/**
 * ZodiaCore ZC4.3 - Lucky Number & Auspicious Timing Generator System
 *
 * Complete implementation of ZC4.3 combining Vedic numerology with auspicious timing.
 * Provides comprehensive lucky number analysis and timing recommendations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ZC43_CACHE_CONFIG } = require('./zc4-3-constants');
const { generateLuckyNumbersWithTiming } = require('./zc4-3-lucky-number-generator');
const { calculateAuspiciousTiming } = require('./zc4-3-timing-calculator');
const { generatePersonalizedRecommendations } = require('./zc4-3-recommendations-engine');
const { calculateLifePathWithTiming, calculateDestinyWithTiming } = require('./zc4-3-core-algorithms');
const { validateBirthDate, validateFullName } = require('./numerology-utils');
const { validateActivityType } = require('./zc4-3-utils');

/**
 * ZodiaCore ZC4.3 Lucky Number & Auspicious Timing Generator
 * @version 1.0.0
 * @author ZodiaCore Development Team
 */
class ZC43LuckyTimingSystem {
    constructor() {
        this.cache = new Map();
        this.systems = ['vedic', 'pythagorean', 'chaldean'];
    }

    /**
     * Generate complete lucky number and auspicious timing analysis
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @param {object} dateRange - Date range for timing analysis
     * @param {object} options - Additional options
     * @returns {object} Complete analysis
     */
    async generateCompleteAnalysis(birthDate, fullName, activityType, dateRange, options = {}) {
        const startTime = Date.now();
        const cacheKey = `${birthDate}_${fullName}_${activityType}_${dateRange.start}_${dateRange.end}_${JSON.stringify(options.preferences || {})}`;

        if (this.cache.has(cacheKey) && !options.skipCache) {
            const cachedResult = this.cache.get(cacheKey);
            cachedResult.metadata.performance.cached = true;
            return cachedResult;
        }

        try {
            // Validate inputs
            this.validateInputs({ birthDate, fullName, activityType, dateRange });

            // Generate numerology profile
            const numerologyProfile = this.generateNumerologyProfile(birthDate, fullName, options);

            // Generate lucky numbers with timing integration
            const luckyNumbers = generateLuckyNumbersWithTiming(birthDate, fullName, { activity: activityType });

            // Calculate auspicious timing
            const timingAnalysis = calculateAuspiciousTiming(birthDate, luckyNumbers, activityType, dateRange);

            // Generate personalized recommendations
            const recommendations = generatePersonalizedRecommendations(
                numerologyProfile, timingAnalysis, activityType, options.preferences
            );

            // Create comprehensive report
            const comprehensiveReport = this.generateComprehensiveReport(
                numerologyProfile, luckyNumbers, timingAnalysis, recommendations, activityType
            );

            const endTime = Date.now();
            const duration = endTime - startTime;

            const result = {
                numerologyProfile: numerologyProfile,
                luckyNumbers: luckyNumbers,
                timingAnalysis: timingAnalysis,
                recommendations: recommendations,
                comprehensiveReport: comprehensiveReport,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    systemVersion: '1.0.0',
                    activityType: activityType,
                    dateRange: dateRange,
                    confidence: recommendations.confidence,
                    performance: {
                        duration: duration,
                        cached: false
                    }
                }
            };

            // Cache result (with size limit)
            if (this.cache.size >= ZC43_CACHE_CONFIG.MAX_SIZE) {
                // Implement LRU eviction - remove oldest entry
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(cacheKey, result);

            return result;

        } catch (error) {
            console.error('ZC4.3 Analysis Error:', {
                message: error.message,
                stack: error.stack,
                input: { birthDate, fullName, activityType, dateRange }
            });
            throw new ZC43Error(`Analysis generation failed: ${error.message}`);
        }
    }

    /**
     * Generate numerology profile
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {object} options - Options
     * @returns {object} Numerology profile
     */
    generateNumerologyProfile(birthDate, fullName, options = {}) {
        // Core calculations
        const lifePath = calculateLifePathWithTiming(birthDate);
        const vedicDestiny = calculateDestinyWithTiming(fullName, 'vedic', birthDate);

        const profile = {
            lifePath: lifePath,
            destiny: vedicDestiny,
            systems: {}
        };

        // Calculate destiny for each system
        for (const system of this.systems) {
            profile.systems[system] = {
                destiny: calculateDestinyWithTiming(fullName, system, birthDate)
            };
        }

        // Add additional calculations
        profile.challengeNumbers = this.calculateChallengeNumbers(birthDate);
        profile.maturityNumber = this.calculateMaturityNumber(birthDate, fullName, 'vedic');

        return profile;
    }

    /**
     * Calculate challenge numbers
     * @param {string|Date} birthDate - Birth date
     * @returns {object} Challenge numbers analysis
     */
    calculateChallengeNumbers(birthDate) {
        const { calculateChallengeNumbers } = require('./zc4-3-utils');
        return calculateChallengeNumbers(birthDate);
    }

    /**
     * Calculate maturity number
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} system - Numerology system
     * @returns {object} Maturity number analysis
     */
    calculateMaturityNumber(birthDate, fullName, system) {
        const { calculateMaturityNumber } = require('./zc4-3-utils');
        return calculateMaturityNumber(birthDate, fullName, system);
    }

    /**
     * Generate comprehensive final report
     * @param {object} numerologyProfile - Numerology profile
     * @param {object} luckyNumbers - Lucky numbers
     * @param {object} timingAnalysis - Timing analysis
     * @param {object} recommendations - Recommendations
     * @param {string} activityType - Activity type
     * @returns {object} Comprehensive report
     */
    generateComprehensiveReport(numerologyProfile, luckyNumbers, timingAnalysis, recommendations, activityType) {
        return {
            executiveSummary: {
                activityType: activityType,
                primaryLuckyNumbers: luckyNumbers.baseLucky.primary,
                recommendedTiming: timingAnalysis.recommendedTimings[0]?.date || null,
                confidence: recommendations.confidence,
                keyInsights: [
                    `Life Path Number: ${numerologyProfile.lifePath.lifePathNumber}`,
                    `Primary lucky numbers: ${luckyNumbers.baseLucky.primary.join(', ')}`,
                    `Best timing: ${timingAnalysis.recommendedTimings[0]?.date || 'Not available'}`
                ]
            },
            numerologySection: {
                title: 'Numerology Analysis',
                lifePath: numerologyProfile.lifePath,
                destiny: numerologyProfile.destiny,
                challengeNumbers: numerologyProfile.challengeNumbers,
                maturityNumber: numerologyProfile.maturityNumber
            },
            timingSection: {
                title: 'Auspicious Timing Analysis',
                recommendedTimings: timingAnalysis.recommendedTimings.slice(0, 5),
                analysis: timingAnalysis.analysis
            },
            recommendationsSection: {
                title: 'Personalized Recommendations',
                primary: recommendations.primaryLuckyNumbers,
                timing: recommendations.recommendedTimings,
                activitySpecific: recommendations.activitySpecific,
                precautions: recommendations.precautions
            },
            insights: this.generateDetailedInsights(numerologyProfile, luckyNumbers, timingAnalysis, activityType)
        };
    }

    /**
     * Generate detailed insights
     * @param {object} numerologyProfile - Numerology profile
     * @param {object} luckyNumbers - Lucky numbers
     * @param {object} timingAnalysis - Timing analysis
     * @param {string} activityType - Activity type
     * @returns {Array} Detailed insights
     */
    generateDetailedInsights(numerologyProfile, luckyNumbers, timingAnalysis, activityType) {
        const insights = [];

        // Numerology insights
        insights.push(`Your Life Path Number ${numerologyProfile.lifePath.lifePathNumber} indicates ${numerologyProfile.lifePath.significance.name} energy`);
        insights.push(`Destiny Number ${numerologyProfile.destiny.destinyNumber} suggests ${numerologyProfile.destiny.significance.name} as your life purpose`);

        // Lucky number insights
        insights.push(`Primary lucky numbers ${luckyNumbers.baseLucky.primary.join(', ')} should be incorporated into ${activityType} planning`);

        // Timing insights
        if (timingAnalysis.recommendedTimings.length > 0) {
            const topTiming = timingAnalysis.recommendedTimings[0];
            insights.push(`Most auspicious timing: ${topTiming.date} during ${topTiming.timeSlot} hours`);
        }

        // Activity-specific insights
        const activityInsights = this.getActivitySpecificInsights(activityType, luckyNumbers, timingAnalysis);
        insights.push(...activityInsights);

        return insights;
    }

    /**
     * Get activity-specific insights
     * @param {string} activityType - Activity type
     * @param {object} luckyNumbers - Lucky numbers
     * @param {object} timingAnalysis - Timing analysis
     * @returns {Array} Activity insights
     */
    getActivitySpecificInsights(activityType, luckyNumbers, timingAnalysis) {
        const insights = [];

        switch (activityType) {
            case 'marriage':
                insights.push('Marriage timing should align with both partners\' numerology');
                if (luckyNumbers.baseLucky.primary.includes(2) || luckyNumbers.baseLucky.primary.includes(6)) {
                    insights.push('Strong Venus/Moon energy supports relationship harmony');
                }
                break;

            case 'business':
                insights.push('Business success enhanced by numbers 1, 5, and 8');
                if (timingAnalysis.recommendedTimings.some(t => t.timeSlot === 'morning')) {
                    insights.push('Morning timing favors business activities');
                }
                break;

            case 'education':
                insights.push('Numbers 3, 5, and 7 support academic pursuits');
                if (luckyNumbers.baseLucky.primary.some(n => [3, 5, 7].includes(n))) {
                    insights.push('Excellent numerological support for educational goals');
                }
                break;

            case 'travel':
                insights.push('Travel numbers 3 and 5 provide journey protection');
                if (timingAnalysis.recommendedTimings.length > 0) {
                    insights.push('Recommended timing ensures safe and successful travel');
                }
                break;

            case 'health':
                insights.push('Health numbers 2, 4, and 6 promote healing energy');
                insights.push('Combine numerology with professional medical care');
                break;

            case 'finance':
                insights.push('Financial numbers 4, 6, and 8 attract prosperity');
                if (timingAnalysis.recommendedTimings.some(t => t.timeSlot === 'afternoon')) {
                    insights.push('Afternoon timing optimal for financial activities');
                }
                break;

            case 'career':
                insights.push('Career numbers 1, 4, and 8 support professional growth');
                if (luckyNumbers.baseLucky.primary.some(n => [1, 4, 8].includes(n))) {
                    insights.push('Strong numerological foundation for career advancement');
                }
                break;

            default:
                insights.push('General numerological guidance applies to all activities');
        }

        return insights;
    }

    /**
     * Validate input parameters
     * @param {object} params - Input parameters
     * @throws {Error} If validation fails
     */
    validateInputs(params) {
        const { birthDate, fullName, activityType, dateRange } = params;

        if (!birthDate) throw new ZC43Error('Birth date is required');
        if (!fullName || fullName.trim().length < 2) throw new ZC43Error('Valid full name is required');
        if (!fullName || fullName.trim().length > 100) throw new ZC43Error('Name too long (max 100 characters)');
        if (!activityType) throw new ZC43Error('Activity type is required');

        validateBirthDate(birthDate);
        validateFullName(fullName);
        validateActivityType(activityType);

        if (dateRange) {
            if (!dateRange.start || !dateRange.end) {
                throw new ZC43Error('Date range must include start and end dates');
            }

            const start = new Date(dateRange.start);
            const end = new Date(dateRange.end);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new ZC43Error('Invalid date format in date range');
            }

            if (start > end) {
                throw new ZC43Error('Start date cannot be after end date');
            }

            const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
            if (daysDiff > 365) {
                throw new ZC43Error('Date range cannot exceed 1 year');
            }
        }
    }

    /**
     * Get system health status
     * @returns {object} Health status
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            version: '1.0.0',
            cacheSize: this.cache.size,
            supportedSystems: this.systems,
            supportedActivities: Object.keys(require('./zc4-3-constants').ZC43_NUMEROLOGY_CONSTANTS.ACTIVITY_NUMBERS),
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Clear calculation cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get quick numerology insights (without full timing analysis)
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @returns {object} Quick insights
     */
    getQuickInsights(birthDate, fullName) {
        const lifePath = calculateLifePathWithTiming(birthDate);
        const destiny = calculateDestinyWithTiming(fullName, 'vedic', birthDate);

        return {
            lifePathNumber: lifePath.lifePathNumber,
            destinyNumber: destiny.destinyNumber,
            primaryLuckyNumbers: [lifePath.lifePathNumber, destiny.destinyNumber],
            lifePathSignificance: lifePath.significance.name,
            destinySignificance: destiny.significance.name
        };
    }
}

/**
 * Custom error class for ZC4.3
 */
class ZC43Error extends Error {
    constructor(message) {
        super(message);
        this.name = 'ZC43Error';
    }
}

// Export the main system class
module.exports = {
    ZC43LuckyTimingSystem,
    ZC43Error
};

// Usage example (for testing/documentation)
if (require.main === module) {
    const zc43System = new ZC43LuckyTimingSystem();

    // Example usage
    zc43System.generateCompleteAnalysis(
        '1990-05-15', // birth date
        'John Smith', // full name
        'marriage', // activity type
        { start: '2024-01-01', end: '2024-12-31' }, // date range
        { preferences: { riskTolerance: 'moderate' } } // options
    ).then(analysis => {
        console.log('ZC4.3 Complete Analysis:', analysis);
    }).catch(error => {
        console.error('Error:', error.message);
    });
}