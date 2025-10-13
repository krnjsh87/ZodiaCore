/**
 * ZodiaCore - ZC1.11 Lucky Number & Auspicious Timing Generator System
 *
 * Complete implementation of ZC1.11 combining Vedic numerology with auspicious timing.
 * Provides comprehensive lucky number analysis and timing recommendations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { LuckyNumberGenerator } = require('./lucky-number-generator');
const { LuckyTimingIntegrator } = require('./lucky-timing-integrator');
const { ActivityRecommender } = require('./activity-recommender');
const { NumerologyCalculator } = require('./numerology-calculator');
const { astrologyLogger } = require('./logger');
const { astrologyCache } = require('./cache');
const { performanceMonitor } = require('./performance-monitor');
const { ErrorFactory } = require('./errors');

/**
 * Complete ZC1.11 Lucky Number & Auspicious Timing Generator System
 */
class ZC111LuckyTimingSystem {
    constructor() {
        this.numerologyGenerator = new LuckyNumberGenerator();
        this.timingIntegrator = new LuckyTimingIntegrator();
        this.activityRecommender = new ActivityRecommender();
        this.numerologyCalculator = new NumerologyCalculator();
    }

    /**
     * Generate complete lucky number and auspicious timing analysis
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @param {object} dateRange - Date range for analysis
     * @param {object} preferences - Additional preferences
     * @returns {object} Complete analysis result
     */
    async generateCompleteAnalysis(birthDate, fullName, activityType, dateRange, preferences = {}) {
        const timer = performanceMonitor.startTimer('generateCompleteAnalysis', {
            activityType,
            birthDate: birthDate.toISOString ? birthDate.toISOString() : birthDate
        });

        try {
            astrologyLogger.info(`Generating analysis for ${activityType}`, {
                activityType,
                dateRange,
                birthDate: birthDate.toISOString ? birthDate.toISOString() : birthDate
            });

            // Generate numerology profile with caching
            const numerologyProfile = await astrologyCache.getOrSetLuckyNumbers(
                birthDate,
                fullName,
                activityType,
                () => this.numerologyGenerator.generatePersonalizedLuckyNumbers(
                    birthDate, fullName, { activity: activityType, dateRange: dateRange }
                )
            );

            // Get activity-specific recommendations
            const activityRecommendations = this.activityRecommender.generateActivityRecommendations(
                numerologyProfile, activityType, dateRange
            );

            // Generate integrated timing recommendations with caching
            const integratedAnalysis = await astrologyCache.getOrSetTimingRecommendations(
                birthDate,
                fullName,
                activityType,
                dateRange,
                () => this.timingIntegrator.generateLuckyTimingRecommendations(
                    birthDate, fullName, activityType, dateRange, preferences
                )
            );

            // Generate comprehensive report
            const comprehensiveReport = this.generateComprehensiveReport(
                numerologyProfile, activityRecommendations, integratedAnalysis, activityType
            );

            const result = {
                numerologyProfile: numerologyProfile,
                activityRecommendations: activityRecommendations,
                integratedAnalysis: integratedAnalysis,
                comprehensiveReport: comprehensiveReport,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    systemVersion: '1.0.0',
                    activityType: activityType,
                    dateRange: dateRange
                }
            };

            timer.end({ success: true });
            return result;

        } catch (error) {
            timer.end({ success: false, error: error.message });
            performanceMonitor.recordError(error, 'generateCompleteAnalysis', {
                birthDate: birthDate.toISOString ? birthDate.toISOString() : birthDate,
                fullName,
                activityType
            });

            // Use structured error
            throw ErrorFactory.calculation(
                'generateCompleteAnalysis',
                `Analysis generation failed: ${error.message}`,
                { birthDate, fullName, activityType, dateRange }
            );
        }
    }

    /**
     * Generate comprehensive final report
     * @param {object} numerologyProfile - Numerology profile
     * @param {object} activityRecs - Activity recommendations
     * @param {object} integratedAnalysis - Integrated analysis
     * @param {string} activityType - Activity type
     * @returns {object} Comprehensive report
     */
    generateComprehensiveReport(numerologyProfile, activityRecs, integratedAnalysis, activityType) {
        const report = {
            executiveSummary: this.generateExecutiveSummary(
                numerologyProfile, integratedAnalysis, activityType
            ),
            numerologySection: {
                title: 'Numerology Analysis',
                profile: numerologyProfile,
                insights: this.generateNumerologySection(numerologyProfile)
            },
            timingSection: {
                title: 'Auspicious Timing Analysis',
                recommendations: integratedAnalysis.integratedRecommendations.slice(0, 5),
                insights: this.generateTimingSection(integratedAnalysis)
            },
            activitySection: {
                title: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Specific Guidance`,
                recommendations: activityRecs,
                insights: this.generateActivitySection(activityRecs, activityType)
            },
            recommendations: this.generateFinalRecommendations(
                numerologyProfile, activityRecs, integratedAnalysis, activityType
            ),
            precautions: this.generateFinalPrecautions(activityType)
        };

        return report;
    }

    /**
     * Generate executive summary
     * @param {object} profile - Numerology profile
     * @param {object} integrated - Integrated analysis
     * @param {string} activityType - Activity type
     * @returns {object} Executive summary
     */
    generateExecutiveSummary(profile, integrated, activityType) {
        const topTiming = integrated.integratedRecommendations[0];
        const luckyNumbers = profile.categories.primary.numbers;

        return {
            overview: `Comprehensive numerological and timing analysis for ${activityType}`,
            keyFindings: [
                `Primary lucky numbers: ${luckyNumbers.join(', ')}`,
                `Best timing: ${topTiming ? topTiming.date.toLocaleDateString() : 'Not available'}`,
                `Compatibility score: ${topTiming ? Math.round(topTiming.adjustedScore.combinedScore * 100) + '%' : 'N/A'}`
            ],
            recommendations: [
                'Incorporate lucky numbers into planning and decision-making',
                'Schedule important activities during auspicious timings',
                'Consider both numerological and astrological factors'
            ]
        };
    }

    /**
     * Generate numerology section
     * @param {object} profile - Numerology profile
     * @returns {string[]} Array of insights
     */
    generateNumerologySection(profile) {
        const insights = [];

        const vedic = profile.profile.systems.vedic;
        insights.push(`Life Path Number: ${vedic.lifePath.lifePathNumber} (${vedic.lifePath.significance.name})`);
        insights.push(`Destiny Number: ${vedic.destiny.destinyNumber} (${vedic.destiny.significance.name})`);
        insights.push(`Soul Urge Number: ${vedic.soulUrge.soulUrgeNumber} (${vedic.soulUrge.significance.name})`);

        return insights;
    }

    /**
     * Generate timing section
     * @param {object} integrated - Integrated analysis
     * @returns {string[]} Array of insights
     */
    generateTimingSection(integrated) {
        const insights = [];
        const recommendations = integrated.integratedRecommendations;

        if (recommendations.length > 0) {
            insights.push(`${recommendations.length} auspicious timing options identified`);
            insights.push(`Top recommendation: ${recommendations[0].date.toLocaleDateString()}`);
        }

        return insights;
    }

    /**
     * Generate activity section
     * @param {object} activityRecs - Activity recommendations
     * @param {string} activityType - Activity type
     * @returns {string[]} Array of insights
     */
    generateActivitySection(activityRecs, activityType) {
        const insights = [];

        insights.push(`Activity-specific lucky numbers prioritized for ${activityType}`);
        insights.push(`Preferred months: ${activityRecs.auspiciousMonths.join(', ')}`);

        return insights;
    }

    /**
     * Generate final recommendations
     * @param {object} profile - Numerology profile
     * @param {object} activityRecs - Activity recommendations
     * @param {object} integrated - Integrated analysis
     * @param {string} activityType - Activity type
     * @returns {Array} Array of recommendation categories
     */
    generateFinalRecommendations(profile, activityRecs, integrated, activityType) {
        const recommendations = [];

        // Lucky number recommendations
        recommendations.push({
            category: 'Lucky Numbers',
            items: [
                `Use primary lucky numbers: ${profile.categories.primary.numbers.join(', ')}`,
                `Consider activity-specific numbers: ${activityRecs.luckyNumbers.slice(0, 3).map(n => n.number).join(', ')}`,
                'Incorporate lucky numbers into addresses, dates, and decisions'
            ]
        });

        // Timing recommendations
        const topTiming = integrated.integratedRecommendations[0];
        if (topTiming) {
            recommendations.push({
                category: 'Auspicious Timing',
                items: [
                    `Best date: ${topTiming.date.toLocaleDateString()}`,
                    `Time period: ${topTiming.timeSlot.period}`,
                    `Compatibility: ${Math.round(topTiming.adjustedScore.combinedScore * 100)}%`
                ]
            });
        }

        // Activity-specific recommendations
        recommendations.push({
            category: 'Activity Specific',
            items: activityRecs.numerologyInsights.concat(
                activityRecs.precautions.slice(0, 2)
            )
        });

        return recommendations;
    }

    /**
     * Generate final precautions
     * @param {string} activityType - Activity type
     * @returns {string[]} Array of precautions
     */
    generateFinalPrecautions(activityType) {
        return [
            'This analysis provides guidance but should not replace professional consultation',
            'Consider personal circumstances and traditional customs',
            'Consult with experienced astrologers and numerologists for complex decisions',
            'Balance modern practicality with traditional wisdom',
            'Regular review and adjustment of plans based on changing circumstances'
        ];
    }

    /**
     * Quick analysis for immediate results
     * @param {string|Date} birthDate - Birth date
     * @param {string} fullName - Full name
     * @param {string} activityType - Activity type
     * @returns {object} Quick analysis result
     */
    generateQuickAnalysis(birthDate, fullName, activityType) {
        const timer = performanceMonitor.startTimer('generateQuickAnalysis', {
            birthDate: birthDate.toISOString ? birthDate.toISOString() : birthDate,
            activityType
        });

        try {
            const profile = this.numerologyGenerator.generatePersonalizedLuckyNumbers(birthDate, fullName);

            const result = {
                luckyNumbers: profile.categories.primary.numbers,
                lifePathNumber: profile.profile.systems.vedic.lifePath.lifePathNumber,
                destinyNumber: profile.profile.systems.vedic.destiny.destinyNumber,
                activityGuidance: this.activityRecommender.generateActivityRecommendations(
                    profile, activityType, null
                ),
                quickTips: [
                    `Your lucky numbers are: ${profile.categories.primary.numbers.join(', ')}`,
                    `Life Path: ${profile.profile.systems.vedic.lifePath.lifePathNumber} - ${profile.profile.systems.vedic.lifePath.significance.name}`,
                    `Destiny: ${profile.profile.systems.vedic.destiny.destinyNumber} - ${profile.profile.systems.vedic.destiny.significance.name}`
                ]
            };

            timer.end({ success: true });
            return result;

        } catch (error) {
            timer.end({ success: false, error: error.message });
            performanceMonitor.recordError(error, 'generateQuickAnalysis', {
                birthDate: birthDate.toISOString ? birthDate.toISOString() : birthDate,
                fullName,
                activityType
            });

            throw ErrorFactory.calculation(
                'generateQuickAnalysis',
                `Quick analysis failed: ${error.message}`,
                { birthDate, fullName, activityType }
            );
        }
    }

    /**
     * Get system health status
     * @returns {object} Health status
     */
    getHealthStatus() {
        const performanceHealth = performanceMonitor.getHealthStatus();
        const cacheStats = astrologyCache.getStats();

        // Determine overall system health
        const componentHealth = {
            numerologyGenerator: 'operational',
            timingIntegrator: 'operational',
            activityRecommender: 'operational',
            numerologyCalculator: 'operational',
            cache: cacheStats.size < 10000 ? 'operational' : 'warning', // Warning if cache is very large
            performanceMonitor: performanceHealth.status === 'healthy' ? 'operational' : 'degraded'
        };

        const allOperational = Object.values(componentHealth).every(status => status === 'operational');
        const overallStatus = allOperational ? 'healthy' : 'degraded';

        return {
            status: overallStatus,
            version: '1.0.0',
            components: componentHealth,
            performance: {
                health: performanceHealth.status,
                issues: performanceHealth.issues,
                stats: performanceHealth.stats
            },
            cache: {
                size: cacheStats.size,
                hitRate: cacheStats.hitRate,
                status: componentHealth.cache
            },
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Validate input parameters
     * @param {object} params - Input parameters
     * @returns {boolean} Validation result
     */
    validateInputs(params) {
        const { birthDate, fullName, activityType, dateRange } = params;

        try {
            if (birthDate) require('./numerology-utils').validateBirthDate(birthDate);
            if (fullName) require('./numerology-utils').validateFullName(fullName);
            if (activityType) require('./numerology-utils').validateActivityType(activityType);

            if (dateRange) {
                if (!dateRange.start || !dateRange.end) {
                    throw new Error('Date range must include both start and end dates');
                }

                // Validate date format
                const startDate = new Date(dateRange.start);
                const endDate = new Date(dateRange.end);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error('Invalid date format in date range');
                }

                if (startDate > endDate) {
                    throw new Error('Start date cannot be after end date');
                }

                // Prevent excessively long date ranges
                const maxRangeDays = 365; // 1 year
                const rangeDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
                if (rangeDays > maxRangeDays) {
                    throw new Error('Date range cannot exceed 1 year');
                }
            }

            return true;
        } catch (error) {
            astrologyLogger.error('Input validation failed', { error: error.message, params });
            return false;
        }
    }
}

// Usage Example
// const zc111System = new ZC111LuckyTimingSystem();
//
// const analysis = await zc111System.generateCompleteAnalysis(
//     '1990-05-15', // birth date
//     'John Doe', // full name
//     'marriage', // activity type
//     { start: '2024-01-01', end: '2024-12-31' }, // date range
//     { latitude: 28.6139, longitude: 77.2090 } // location preferences
// );
//
// console.log('Complete Analysis:', analysis);

module.exports = ZC111LuckyTimingSystem;