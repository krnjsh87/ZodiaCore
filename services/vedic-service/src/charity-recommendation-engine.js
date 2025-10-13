/**
 * ZC1.28 Charity Recommendation Engine
 * Generates personalized charity recommendations based on planetary analysis
 */

const { CHARITY_CONSTANTS } = require('./charity-constants');
const { CHARITY_COSTS, COST_MULTIPLIERS } = require('./charity-costs');
const { WEEK_DISTRIBUTION, QUANTITY_DESCRIPTIONS, FREQUENCY_DESCRIPTIONS } = require('./charity-timing-constants');
const CharityStrengthAnalyzer = require('./charity-strength-analyzer');

class CharityRecommendationEngine {
    constructor() {
        this.planetaryCharities = CHARITY_CONSTANTS;
        this.strengthAnalyzer = new CharityStrengthAnalyzer();
    }

    /**
     * Generate complete charity guidance for a birth chart
     * @param {Object} chart - Birth chart data
     * @param {Date} currentDate - Current date for timing calculations
     * @returns {Object} Complete charity guidance
     */
    generateCharityGuidance(chart, currentDate = new Date()) {
        const planetaryAnalysis = this.strengthAnalyzer.analyzePlanetaryStrengthsForCharity(chart);
        const prioritizedPlanets = this.prioritizePlanets(planetaryAnalysis);
        const recommendations = this.createRecommendations(prioritizedPlanets, planetaryAnalysis, currentDate);
        const timing = this.calculateAuspiciousTiming(prioritizedPlanets, currentDate);

        return {
            analysis: planetaryAnalysis,
            priorityPlanets: prioritizedPlanets,
            recommendations: recommendations,
            auspiciousTiming: timing,
            monthlyPlan: this.createMonthlyCharityPlan(recommendations, currentDate),
            emergencyCharities: this.identifyEmergencyCharities(planetaryAnalysis)
        };
    }

    /**
     * Prioritize planets for charity based on need
     * @param {Object} planetaryAnalysis - Analysis results
     * @returns {Array} Sorted array of planets by priority
     */
    prioritizePlanets(planetaryAnalysis) {
        const planets = Object.keys(planetaryAnalysis);

        return planets
            .map(planet => ({
                name: planet,
                priority: planetaryAnalysis[planet].charityPriority,
                urgency: planetaryAnalysis[planet].urgency,
                strength: planetaryAnalysis[planet].strength,
                afflictionCount: planetaryAnalysis[planet].afflictions.length
            }))
            .sort((a, b) => {
                // Sort by priority (high > medium > low)
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                if (priorityDiff !== 0) return priorityDiff;

                // Then by affliction count
                return b.afflictionCount - a.afflictionCount;
            });
    }

    /**
     * Create specific charity recommendations
     * @param {Array} prioritizedPlanets - Planets sorted by priority
     * @param {Object} planetaryAnalysis - Full analysis data
     * @param {Date} currentDate - Current date
     * @returns {Array} Charity recommendations
     */
    createRecommendations(prioritizedPlanets, planetaryAnalysis, currentDate) {
        const recommendations = [];

        prioritizedPlanets.forEach(planet => {
            const analysis = planetaryAnalysis[planet.name];
            const planetData = this.planetaryCharities[planet.name];

            if (planetData && analysis.recommendedCharities) {
                analysis.recommendedCharities.forEach(charity => {
                    recommendations.push({
                        planet: planet.name,
                        priority: planet.priority,
                        urgency: planet.urgency,
                        item: charity.item,
                        recipient: charity.recipient,
                        significance: charity.significance,
                        quantity: this.determineQuantity(planet.priority),
                        frequency: this.determineFrequency(planet.urgency),
                        estimatedCost: this.estimateCost(charity.item, planet.priority)
                    });
                });
            }
        });

        return recommendations;
    }

    /**
     * Calculate auspicious timing for charities
     * @param {Array} prioritizedPlanets - Planets by priority
     * @param {Date} currentDate - Current date
     * @returns {Object} Timing information
     */
    calculateAuspiciousTiming(prioritizedPlanets, currentDate) {
        const timing = {};

        prioritizedPlanets.forEach(planet => {
            const planetData = this.planetaryCharities[planet.name];

            timing[planet.name] = {
                bestDays: planetData.auspiciousDays,
                bestNakshatras: planetData.auspiciousNakshatras,
                bestTime: planetData.bestTime,
                nextAuspiciousDates: this.findNextAuspiciousDates(
                    planetData.auspiciousDays,
                    currentDate
                ),
                planetaryPeriods: this.getFavorablePlanetaryPeriods(planet.name, currentDate)
            };
        });

        return timing;
    }

    /**
     * Create monthly charity plan
     * @param {Array} recommendations - Charity recommendations
     * @param {Date} currentDate - Current date
     * @returns {Array} Monthly plan
     */
    createMonthlyCharityPlan(recommendations, currentDate) {
        const monthlyPlan = [];
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Group recommendations by week
        for (let week = 0; week < 4; week++) {
            const weekStart = new Date(monthStart);
            weekStart.setDate(monthStart.getDate() + (week * 7));

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const weekRecommendations = recommendations.filter(rec => {
                // Filter based on priority and timing
                return this.isSuitableForWeek(rec, week, monthStart);
            });

            if (weekRecommendations.length > 0) {
                monthlyPlan.push({
                    week: week + 1,
                    startDate: weekStart,
                    endDate: weekEnd,
                    recommendations: weekRecommendations.slice(0, 3), // Max 3 per week
                    focus: this.determineWeekFocus(weekRecommendations)
                });
            }
        }

        return monthlyPlan;
    }

    /**
     * Identify emergency charities for immediate relief
     * @param {Object} planetaryAnalysis - Analysis results
     * @returns {Array} Emergency charities
     */
    identifyEmergencyCharities(planetaryAnalysis) {
        const emergencyCharities = [];

        Object.keys(planetaryAnalysis).forEach(planet => {
            const analysis = planetaryAnalysis[planet];

            if (analysis.charityPriority === 'high' && analysis.urgency === 'immediate') {
                const planetData = this.planetaryCharities[planet];

                emergencyCharities.push({
                    planet: planet,
                    immediateAction: planetData.recommendedCharities[0], // Most important charity
                    reason: `Critical planetary affliction requiring immediate attention`,
                    timeFrame: 'Within 7 days'
                });
            }
        });

        return emergencyCharities;
    }

    /**
     * Determine quantity based on priority
     * @param {string} priority - Priority level
     * @returns {string} Quantity description
     */
    determineQuantity(priority) {
        return QUANTITY_DESCRIPTIONS[priority] || QUANTITY_DESCRIPTIONS.low;
    }

    /**
     * Determine frequency based on urgency
     * @param {string} urgency - Urgency level
     * @returns {string} Frequency description
     */
    determineFrequency(urgency) {
        return FREQUENCY_DESCRIPTIONS[urgency] || FREQUENCY_DESCRIPTIONS.when_convenient;
    }

    /**
     * Estimate cost of charity item
     * @param {string} item - Charity item
     * @param {string} priority - Priority level
     * @returns {number} Estimated cost in local currency
     */
    estimateCost(item, priority) {
        const baseCost = CHARITY_COSTS[item] || 100;
        const multiplier = COST_MULTIPLIERS[priority] || 1;
        return Math.round(baseCost * multiplier);
    }

    /**
     * Find next auspicious dates for charity
     * @param {Array} auspiciousDays - Array of day names
     * @param {Date} currentDate - Current date
     * @returns {Array} Next auspicious dates
     */
    findNextAuspiciousDates(auspiciousDays, currentDate) {
        const dates = [];
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        for (let i = 0; i < 7 && dates.length < 3; i++) {
            const checkDate = new Date(currentDate);
            checkDate.setDate(currentDate.getDate() + i);

            const dayName = dayNames[checkDate.getDay()];
            if (auspiciousDays.includes(dayName)) {
                dates.push({
                    date: new Date(checkDate),
                    day: dayName
                });
            }
        }

        return dates;
    }

    /**
     * Get favorable planetary periods (simplified)
     * @param {string} planet - Planet name
     * @param {Date} currentDate - Current date
     * @returns {Array} Favorable periods
     */
    getFavorablePlanetaryPeriods(planet, currentDate) {
        // Simplified - in real implementation would calculate actual planetary hours/days
        return [
            {
                type: 'planetary_hour',
                description: `${planet}'s hour today`,
                nextOccurrence: new Date(currentDate.getTime() + (2 * 60 * 60 * 1000)) // Placeholder
            },
            {
                type: 'planetary_day',
                description: `${planet}'s day this week`,
                nextOccurrence: new Date(currentDate.getTime() + (3 * 24 * 60 * 60 * 1000)) // Placeholder
            }
        ];
    }

    /**
     * Check if recommendation is suitable for a specific week
     * @param {Object} rec - Recommendation
     * @param {number} week - Week number (0-3)
     * @param {Date} monthStart - Month start date
     * @returns {boolean} Whether suitable
     */
    isSuitableForWeek(rec, week, monthStart) {
        return WEEK_DISTRIBUTION[rec.priority]?.includes(week) || false;
    }

    /**
     * Determine focus for the week
     * @param {Array} recommendations - Week's recommendations
     * @returns {string} Week focus
     */
    determineWeekFocus(recommendations) {
        const priorities = recommendations.map(r => r.priority);
        if (priorities.includes('high')) return 'High priority planetary afflictions';
        if (priorities.includes('medium')) return 'Medium priority planetary balance';
        return 'General spiritual maintenance';
    }
}

module.exports = CharityRecommendationEngine;