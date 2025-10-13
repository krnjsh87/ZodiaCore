/**
 * ZodiaCore - KP Prediction Engine
 *
 * Implements Krishnamurti Paddhati (KP) prediction algorithms for event analysis,
 * significator identification, cuspal interlinks, and probability calculations.
 * Provides comprehensive timing predictions based on ruling planets and sub-lords.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const KPSubLordCalculator = require('./kp-sub-lord-calculator');
const { KP_CONSTANTS } = require('./advanced-astrology-constants');
const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * KP Prediction Engine Class
 * Provides comprehensive KP astrology prediction capabilities
 */
class KPPredictionEngine {
    /**
     * Initialize the prediction engine with birth chart
     * @param {Object} birthChart - Complete birth chart data
     */
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.subLordCalculator = new KPSubLordCalculator();
        this.cuspalSubLords = null;

        // Initialize cuspal sub-lords if birth chart has houses
        if (birthChart && birthChart.houses) {
            const cuspalResult = this.subLordCalculator.calculateCuspalSubLords(birthChart.houses);
            if (cuspalResult.success) {
                this.cuspalSubLords = cuspalResult.cuspalSubLords;
            }
        }
    }

    /**
     * Analyze event possibility using KP rules
     * @param {string} eventType - Type of event (marriage, career, health, etc.)
     * @param {number} targetHouse - Target house number
     * @param {Date} currentTime - Current date and time for ruling planets
     * @returns {Object} Complete event analysis
     */
    analyzeEventPossibility(eventType, targetHouse, currentTime) {
        try {
            // Validate inputs
            if (!eventType || !targetHouse || !currentTime) {
                throw new Error('Missing required parameters for event analysis');
            }

            // Get ruling planets for current time
            const rulingResult = this.subLordCalculator.calculateRulingPlanets(currentTime, this.birthChart);
            if (!rulingResult.success) {
                throw new Error('Failed to calculate ruling planets');
            }
            const rulingPlanets = rulingResult.rulingPlanets;

            // Step 1: Identify significators for the event
            const significators = this.getSignificatorsForEvent(eventType, targetHouse);

            // Step 2: Check if ruling planets are significators
            const rulingSignificators = this.subLordCalculator.checkRulingPlanets(significators, rulingPlanets);

            // Step 3: Check cuspal interlinks
            const cuspalLinks = this.checkCuspalInterlinks(targetHouse, significators);

            // Step 4: Calculate event probability
            const probability = this.calculateEventProbability(rulingSignificators, cuspalLinks);

            // Step 5: Predict timing
            const timing = this.predictTiming(significators, currentTime);

            return {
                eventType: eventType,
                targetHouse: targetHouse,
                significators: significators,
                rulingPlanets: rulingPlanets,
                rulingSignificators: rulingSignificators,
                cuspalLinks: cuspalLinks,
                probability: probability,
                timing: timing,
                analysis: this.generateAnalysisSummary(rulingSignificators, cuspalLinks, probability),
                success: true
            };
        } catch (error) {
            console.error('Error analyzing event possibility:', error);
            return {
                eventType: eventType || null,
                targetHouse: targetHouse || null,
                significators: [],
                rulingPlanets: null,
                rulingSignificators: [],
                cuspalLinks: [],
                probability: 0,
                timing: [],
                analysis: 'Analysis failed due to error',
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get significators for specific events
     * @param {string} eventType - Type of event
     * @param {number} targetHouse - Target house number
     * @returns {Array<string>} Array of significator planets
     */
    getSignificatorsForEvent(eventType, targetHouse) {
        try {
            // Get significator houses for the event type
            const significatorHouses = KP_CONSTANTS.SIGNIFICATORS[eventType] || [targetHouse];

            const significators = [];

            // Get sub-lords for each significator house
            for (const houseNum of significatorHouses) {
                if (this.cuspalSubLords && this.cuspalSubLords[houseNum]) {
                    significators.push(this.cuspalSubLords[houseNum].planet);
                }
            }

            // Remove duplicates and return
            return [...new Set(significators)];
        } catch (error) {
            console.error('Error getting significators:', error);
            return [];
        }
    }

    /**
     * Check cuspal interlinks between houses
     * @param {number} targetHouse - Target house number
     * @param {Array<string>} significators - Array of significator planets
     * @returns {Array<Object>} Array of cuspal links
     */
    checkCuspalInterlinks(targetHouse, significators) {
        try {
            const links = [];

            if (!this.cuspalSubLords || !significators.length) {
                return links;
            }

            const targetCusp = this.cuspalSubLords[targetHouse];
            if (!targetCusp) {
                return links;
            }

            // Check links from target house to all other houses
            for (const houseNum of Object.keys(this.cuspalSubLords)) {
                const houseNumber = parseInt(houseNum);
                const cusp = this.cuspalSubLords[houseNumber];

                if (significators.includes(cusp.planet)) {
                    const strength = this.subLordCalculator.calculateLinkStrength(targetCusp, cusp);

                    links.push({
                        fromHouse: targetHouse,
                        toHouse: houseNumber,
                        connectingPlanet: cusp.planet,
                        strength: strength,
                        significance: this.interpretLinkSignificance(strength)
                    });
                }
            }

            // Sort by strength descending
            return links.sort((a, b) => b.strength - a.strength);
        } catch (error) {
            console.error('Error checking cuspal interlinks:', error);
            return [];
        }
    }

    /**
     * Calculate event probability based on ruling planets and cuspal links
     * @param {Array<Object>} rulingSignificators - Array of ruling significators
     * @param {Array<Object>} cuspalLinks - Array of cuspal links
     * @returns {number} Probability percentage (0-100)
     */
    calculateEventProbability(rulingSignificators, cuspalLinks) {
        try {
            let probability = KP_CONSTANTS.PROBABILITY_WEIGHTS.BASE_PROBABILITY || 0;

            // Add probability from ruling planets
            probability += rulingSignificators.length * KP_CONSTANTS.PROBABILITY_WEIGHTS.RULING_SIGNIFICATORS;

            // Add probability from cuspal links (weighted by strength)
            const totalLinkStrength = cuspalLinks.reduce((sum, link) => sum + link.strength, 0);
            probability += totalLinkStrength * KP_CONSTANTS.PROBABILITY_WEIGHTS.CUSPAL_LINKS;

            // Cap at maximum probability
            return Math.min(probability, KP_CONSTANTS.PROBABILITY_WEIGHTS.MAX_PROBABILITY);
        } catch (error) {
            console.error('Error calculating event probability:', error);
            return 0;
        }
    }

    /**
     * Predict timing for events based on significators
     * @param {Array<string>} significators - Array of significator planets
     * @param {Date} currentTime - Current date and time
     * @returns {Array<Object>} Array of timing predictions
     */
    predictTiming(significators, currentTime) {
        try {
            const timingPredictions = [];

            for (const significator of significators) {
                const nextRulingPeriod = this.findNextRulingPeriod(significator, currentTime);

                if (nextRulingPeriod) {
                    const confidence = this.calculateTimingConfidence(significator, nextRulingPeriod);

                    timingPredictions.push({
                        significator: significator,
                        startDate: nextRulingPeriod.start,
                        endDate: nextRulingPeriod.end,
                        confidence: confidence,
                        periodType: nextRulingPeriod.type,
                        description: this.generateTimingDescription(significator, nextRulingPeriod, confidence)
                    });
                }
            }

            // Sort by start date
            return timingPredictions.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        } catch (error) {
            console.error('Error predicting timing:', error);
            return [];
        }
    }

    /**
     * Find next period when a planet will be ruling
     * @param {string} planet - Planet name
     * @param {Date} currentTime - Current date and time
     * @returns {Object|null} Next ruling period or null
     */
    findNextRulingPeriod(planet, currentTime) {
        try {
            // This is a simplified implementation
            // In a full KP system, this would involve complex sub-lord period calculations

            // For demonstration, we'll simulate finding periods based on planetary hours
            // and other ruling periods

            const periods = this.calculateSimplifiedRulingPeriods(planet, currentTime);

            for (const period of periods) {
                if (new Date(period.start) > currentTime) {
                    return period;
                }
            }

            return null;
        } catch (error) {
            console.error('Error finding next ruling period:', error);
            return null;
        }
    }

    /**
     * Calculate simplified ruling periods for a planet
     * @param {string} planet - Planet name
     * @param {Date} currentTime - Current date and time
     * @returns {Array<Object>} Array of ruling periods
     */
    calculateSimplifiedRulingPeriods(planet, currentTime) {
        // Simplified implementation - in reality this would be much more complex
        // involving sub-lord dashas, planetary hours, etc.

        const periods = [];
        const currentDate = new Date(currentTime);

        // Simulate monthly ruling periods for demonstration
        for (let i = 0; i < 12; i++) {
            const startDate = new Date(currentDate);
            startDate.setMonth(startDate.getMonth() + i);

            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            // Check if this planet would rule in this period
            if (this.planetRulesInPeriod(planet, startDate)) {
                periods.push({
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                    type: 'Monthly Ruling Period',
                    strength: Math.random() * 0.5 + 0.5 // 0.5-1.0
                });
            }
        }

        return periods;
    }

    /**
     * Check if a planet rules in a given period (simplified)
     * @param {string} planet - Planet name
     * @param {Date} date - Date to check
     * @returns {boolean} True if planet rules
     */
    planetRulesInPeriod(planet, date) {
        // Simplified logic - in real implementation would check:
        // - Planetary hours
        // - Nakshatra lords
        // - Current dasha periods
        // - Sub-lord periods

        const dayOfWeek = date.getDay();
        const dayLord = KP_CONSTANTS.DAY_LORDS[dayOfWeek];

        // Planet rules if it's the day lord or in favorable position
        return planet === dayLord || Math.random() > 0.7; // 30% chance for demo
    }

    /**
     * Calculate confidence in timing prediction
     * @param {string} significator - Significator planet
     * @param {Object} period - Ruling period
     * @returns {number} Confidence percentage (0-100)
     */
    calculateTimingConfidence(significator, period) {
        try {
            let confidence = 50; // Base confidence

            // Higher confidence for stronger periods
            if (period.strength > 0.8) confidence += 30;
            else if (period.strength > 0.6) confidence += 20;
            else if (period.strength > 0.4) confidence += 10;

            // Adjust based on significator strength
            if (this.isStrongSignificator(significator)) confidence += 10;

            return Math.min(confidence, 100);
        } catch (error) {
            console.error('Error calculating timing confidence:', error);
            return 50;
        }
    }

    /**
     * Check if a planet is a strong significator
     * @param {string} planet - Planet name
     * @returns {boolean} True if strong significator
     */
    isStrongSignificator(planet) {
        // Simplified - in real implementation would check planetary strength
        const strongPlanets = ['JUPITER', 'VENUS', 'MERCURY'];
        return strongPlanets.includes(planet);
    }

    /**
     * Generate timing description
     * @param {string} significator - Significator planet
     * @param {Object} period - Ruling period
     * @param {number} confidence - Confidence level
     * @returns {string} Description text
     */
    generateTimingDescription(significator, period, confidence) {
        const startDate = new Date(period.start).toLocaleDateString();
        const endDate = new Date(period.end).toLocaleDateString();

        let description = `${significator} may influence events from ${startDate} to ${endDate}`;

        if (confidence > 80) {
            description += ' (High confidence)';
        } else if (confidence > 60) {
            description += ' (Moderate confidence)';
        } else {
            description += ' (Low confidence - requires further analysis)';
        }

        return description;
    }

    /**
     * Interpret link significance
     * @param {number} strength - Link strength (0-1)
     * @returns {string} Significance description
     */
    interpretLinkSignificance(strength) {
        if (strength >= 0.8) return 'Very Strong Connection';
        if (strength >= 0.6) return 'Strong Connection';
        if (strength >= 0.4) return 'Moderate Connection';
        if (strength >= 0.2) return 'Weak Connection';
        return 'Very Weak or No Connection';
    }

    /**
     * Generate analysis summary
     * @param {Array<Object>} rulingSignificators - Ruling significators
     * @param {Array<Object>} cuspalLinks - Cuspal links
     * @param {number} probability - Event probability
     * @returns {string} Analysis summary
     */
    generateAnalysisSummary(rulingSignificators, cuspalLinks, probability) {
        try {
            let summary = '';

            if (rulingSignificators.length > 0) {
                summary += `Positive indication: ${rulingSignificators.length} ruling planet(s) are significators. `;
            } else {
                summary += 'No ruling planets are currently significators. ';
            }

            if (cuspalLinks.length > 0) {
                const strongLinks = cuspalLinks.filter(link => link.strength >= 0.6).length;
                summary += `${cuspalLinks.length} cuspal links found (${strongLinks} strong). `;
            } else {
                summary += 'No significant cuspal interlinks. ';
            }

            if (probability >= 70) {
                summary += `High probability (${probability.toFixed(1)}%) of favorable outcome.`;
            } else if (probability >= 40) {
                summary += `Moderate probability (${probability.toFixed(1)}%) - timing is important.`;
            } else {
                summary += `Low probability (${probability.toFixed(1)}%) - reconsider or wait for better timing.`;
            }

            return summary;
        } catch (error) {
            console.error('Error generating analysis summary:', error);
            return 'Analysis summary generation failed';
        }
    }

    /**
     * Get all significators for the birth chart
     * @returns {Object} Significators for all houses
     */
    getAllSignificators() {
        try {
            const allSignificators = {};

            for (let house = 1; house <= ASTRO_CONSTANTS.HOUSES_COUNT; house++) {
                if (this.cuspalSubLords && this.cuspalSubLords[house]) {
                    allSignificators[house] = this.cuspalSubLords[house].planet;
                }
            }

            return allSignificators;
        } catch (error) {
            console.error('Error getting all significators:', error);
            return {};
        }
    }
}

module.exports = KPPredictionEngine;