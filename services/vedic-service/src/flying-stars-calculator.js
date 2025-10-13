/**
 * Flying Stars Calculator
 * ZC2.5 Feng Shui Remedies and Guidance Implementation
 *
 * This class calculates Flying Stars charts for annual, monthly, and daily
 * time-based energy analysis in Feng Shui practice.
 */

const { FLYING_STARS } = require('./feng-shui-constants');
const { calculateMountainStar, calculateWaterStar, calculateStarRating, getStarInfluences } = require('./feng-shui-utils');

class FlyingStarsCalculator {
    /**
     * Analyze Flying Stars for location and time
     * @param {object} location - Location data with facing direction
     * @param {number} year - Analysis year
     * @param {number} month - Analysis month (optional)
     * @param {number} day - Analysis day (optional)
     * @returns {object} Flying Stars analysis
     */
    analyze(location, year, month = null, day = null) {
        const analysis = {
            annual: this.calculateAnnualFlyingStars(location, year),
            monthly: month ? this.calculateMonthlyFlyingStars(location, year, month) : null,
            daily: day ? this.calculateDailyFlyingStars(location, year, month, day) : null,
            recommendations: [],
            overallRating: 0
        };

        // Calculate overall rating
        const stars = [analysis.annual, analysis.monthly, analysis.daily].filter(s => s);
        const averageRating = stars.reduce((sum, star) => sum + star.rating, 0) / stars.length;
        analysis.overallRating = averageRating;

        // Generate recommendations based on star combinations
        analysis.recommendations = this.generateFlyingStarRemedies(analysis);

        return analysis;
    }

    /**
     * Calculate annual Flying Stars chart
     * @param {object} location - Location data
     * @param {number} year - Year
     * @returns {object} Annual stars
     */
    calculateAnnualFlyingStars(location, year) {
        // Simplified calculation - in practice would use complex formulas
        const basePeriod = Math.floor((year - 1864) / 20) + 1; // 20-year cycles
        const periodStar = ((basePeriod - 1) % 9) + 1;

        // Mountain and Water stars based on facing direction
        const facingDirection = location.facingDirection;
        const mountainStar = calculateMountainStar(facingDirection, periodStar);
        const waterStar = calculateWaterStar(facingDirection, periodStar);

        return {
            period: basePeriod,
            mountainStar: mountainStar,
            waterStar: waterStar,
            rating: calculateStarRating(mountainStar, waterStar),
            influences: getStarInfluences(mountainStar, waterStar)
        };
    }

    /**
     * Calculate monthly Flying Stars chart
     * @param {object} location - Location data
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {object} Monthly stars
     */
    calculateMonthlyFlyingStars(location, year, month) {
        // Simplified calculation
        const annual = this.calculateAnnualFlyingStars(location, year);
        const monthStar = ((annual.mountainStar + month - 1) % 9) + 1;
        const monthWaterStar = ((annual.waterStar + month - 1) % 9) + 1;

        return {
            period: annual.period,
            month: month,
            mountainStar: monthStar,
            waterStar: monthWaterStar,
            rating: calculateStarRating(monthStar, monthWaterStar),
            influences: getStarInfluences(monthStar, monthWaterStar)
        };
    }

    /**
     * Calculate daily Flying Stars chart
     * @param {object} location - Location data
     * @param {number} year - Year
     * @param {number} month - Month
     * @param {number} day - Day
     * @returns {object} Daily stars
     */
    calculateDailyFlyingStars(location, year, month, day) {
        // Simplified calculation
        const monthly = this.calculateMonthlyFlyingStars(location, year, month);
        const dayStar = ((monthly.mountainStar + day - 1) % 9) + 1;
        const dayWaterStar = ((monthly.waterStar + day - 1) % 9) + 1;

        return {
            period: monthly.period,
            month: month,
            day: day,
            mountainStar: dayStar,
            waterStar: dayWaterStar,
            rating: calculateStarRating(dayStar, dayWaterStar),
            influences: getStarInfluences(dayStar, dayWaterStar)
        };
    }

    /**
     * Generate remedies for Flying Star combinations
     * @param {object} analysis - Complete analysis
     * @returns {array} Remedies
     */
    generateFlyingStarRemedies(analysis) {
        const remedies = [];

        // Annual remedies
        if (analysis.annual) {
            const annualRemedies = this.getStarSpecificRemedies(analysis.annual.mountainStar, analysis.annual.waterStar, 'annual');
            remedies.push(...annualRemedies);
        }

        // Monthly remedies
        if (analysis.monthly) {
            const monthlyRemedies = this.getStarSpecificRemedies(analysis.monthly.mountainStar, analysis.monthly.waterStar, 'monthly');
            remedies.push(...monthlyRemedies);
        }

        // Daily remedies
        if (analysis.daily) {
            const dailyRemedies = this.getStarSpecificRemedies(analysis.daily.mountainStar, analysis.daily.waterStar, 'daily');
            remedies.push(...dailyRemedies);
        }

        // Prioritize remedies by effectiveness
        return remedies.sort((a, b) => b.effectiveness - a.effectiveness);
    }

    /**
     * Get remedies for specific star combinations
     * @param {number} mountainStar - Mountain star
     * @param {number} waterStar - Water star
     * @param {string} timeframe - 'annual', 'monthly', or 'daily'
     * @returns {array} Remedies
     */
    getStarSpecificRemedies(mountainStar, waterStar, timeframe) {
        const remedies = [];

        // Check for problematic star combinations
        if (mountainStar === 2 || mountainStar === 3 || mountainStar === 7) {
            remedies.push({
                type: 'Mountain Star',
                star: mountainStar,
                timeframe: timeframe,
                description: `Problematic mountain star ${mountainStar} requires attention`,
                remedies: this.getStarRemedies(mountainStar),
                effectiveness: 0.8,
                urgency: 'High'
            });
        }

        if (waterStar === 2 || waterStar === 3 || waterStar === 7) {
            remedies.push({
                type: 'Water Star',
                star: waterStar,
                timeframe: timeframe,
                description: `Problematic water star ${waterStar} requires attention`,
                remedies: this.getStarRemedies(waterStar),
                effectiveness: 0.8,
                urgency: 'High'
            });
        }

        // Check for beneficial combinations
        if ((mountainStar === 8 || mountainStar === 9) && (waterStar === 8 || waterStar === 9)) {
            remedies.push({
                type: 'Beneficial Combination',
                stars: `${mountainStar}-${waterStar}`,
                timeframe: timeframe,
                description: 'Excellent star combination - enhance positive energy',
                remedies: this.getEnhancementRemedies(mountainStar, waterStar),
                effectiveness: 0.9,
                urgency: 'Low'
            });
        }

        return remedies;
    }

    /**
     * Get remedies for specific stars
     * @param {number} starNumber - Star number
     * @returns {array} Remedies
     */
    getStarRemedies(starNumber) {
        const starRemedies = {
            2: [
                { type: 'Cure', item: 'Six Rod Wind Chime', placement: 'Center of home' },
                { type: 'Enhancement', item: 'Red items or lights', placement: 'South area' }
            ],
            3: [
                { type: 'Cure', item: 'Metal objects', placement: 'West or Northwest' },
                { type: 'Enhancement', item: 'Wooden items', placement: 'East or Southeast' }
            ],
            7: [
                { type: 'Cure', item: 'Fire elements (candles)', placement: 'South' },
                { type: 'Enhancement', item: 'Earth items', placement: 'Center, Northeast, Southwest' }
            ]
        };

        return starRemedies[starNumber] || [];
    }

    /**
     * Get enhancement remedies for beneficial stars
     * @param {number} mountainStar - Mountain star
     * @param {number} waterStar - Water star
     * @returns {array} Remedies
     */
    getEnhancementRemedies(mountainStar, waterStar) {
        const remedies = [];

        if (mountainStar === 8) {
            remedies.push({ type: 'Enhancement', item: 'Mountain symbols', placement: 'Northeast' });
        }
        if (mountainStar === 9) {
            remedies.push({ type: 'Enhancement', item: 'Fire elements', placement: 'South' });
        }
        if (waterStar === 8) {
            remedies.push({ type: 'Enhancement', item: 'Water features', placement: 'North' });
        }
        if (waterStar === 9) {
            remedies.push({ type: 'Enhancement', item: 'Purple items', placement: 'South' });
        }

        return remedies;
    }
}

module.exports = FlyingStarsCalculator;