/**
 * ZC1.28 Charity Timing Calculator
 * Calculates auspicious timing for charity based on Panchang and planetary transits
 */

const { CHARITY_CONSTANTS } = require('./charity-constants');
const {
    AUSPICIOUS_TITHIS,
    AUSPICIOUS_YOGAS,
    INAUSPICIOUS_YOGAS,
    AUSPICIOUS_KARANAS,
    NEUTRAL_NAKSHATRAS,
    TIMING_SCORES,
    TIMING_RATINGS,
    TIMING_RECOMMENDATIONS
} = require('./charity-timing-constants');

class CharityTimingCalculator {
    constructor() {
        this.planetaryCharities = CHARITY_CONSTANTS;
    }

    /**
     * Calculate auspicious timing for charity based on Panchang
     * @param {Object} panchang - Panchang data
     * @param {Object} planetCharity - Planet charity data
     * @returns {Object} Timing analysis
     */
    calculateCharityTiming(panchang, planetCharity) {
        let timingScore = 0;
        const factors = [];

        // Tithi compatibility
        const tithiCompatibility = this.checkTithiCompatibility(panchang.tithi, planetCharity);
        timingScore += tithiCompatibility.score;
        factors.push(tithiCompatibility);

        // Nakshatra compatibility
        const nakshatraCompatibility = this.checkNakshatraCompatibility(panchang.nakshatra, planetCharity);
        timingScore += nakshatraCompatibility.score;
        factors.push(nakshatraCompatibility);

        // Yoga compatibility
        const yogaCompatibility = this.checkYogaCompatibility(panchang.yoga, planetCharity);
        timingScore += yogaCompatibility.score;
        factors.push(yogaCompatibility);

        // Karana compatibility
        const karanaCompatibility = this.checkKaranaCompatibility(panchang.karana, planetCharity);
        timingScore += karanaCompatibility.score;
        factors.push(karanaCompatibility);

        // Vara (weekday) compatibility
        const varaCompatibility = this.checkVaraCompatibility(panchang.vara, planetCharity);
        timingScore += varaCompatibility.score;
        factors.push(varaCompatibility);

        return {
            totalScore: timingScore,
            factors: factors,
            rating: this.getTimingRating(timingScore),
            recommendation: this.getTimingRecommendation(timingScore)
        };
    }

    /**
     * Check Tithi compatibility for charity
     * @param {Object} tithi - Tithi data
     * @param {Object} planetCharity - Planet charity data
     * @returns {Object} Compatibility result
     */
    checkTithiCompatibility(tithi, planetCharity) {
        const planetTithis = AUSPICIOUS_TITHIS[planetCharity.planet] || [1, 2, 3, 5, 7, 10, 12, 15];

        if (planetTithis.includes(tithi.number)) {
            return {
                factor: 'tithi',
                score: TIMING_SCORES.TITHI_AUSPICIOUS,
                compatibility: 'auspicious',
                reason: `${tithi.name} is favorable for ${planetCharity.planet} charity`
            };
        }

        return {
            factor: 'tithi',
            score: TIMING_SCORES.TITHI_NEUTRAL,
            compatibility: 'neutral',
            reason: `${tithi.name} is acceptable for ${planetCharity.planet} charity`
        };
    }

    /**
     * Check Nakshatra compatibility for charity
     * @param {Object} nakshatra - Nakshatra data
     * @param {Object} planetCharity - Planet charity data
     * @returns {Object} Compatibility result
     */
    checkNakshatraCompatibility(nakshatra, planetCharity) {
        const auspiciousNakshatras = planetCharity.auspiciousNakshatras || [];

        if (auspiciousNakshatras.includes(nakshatra.name)) {
            return {
                factor: 'nakshatra',
                score: TIMING_SCORES.NAKSHATRA_AUSPICIOUS,
                compatibility: 'auspicious',
                reason: `${nakshatra.name} is highly favorable for ${planetCharity.planet} charity`
            };
        }

        if (NEUTRAL_NAKSHATRAS.includes(nakshatra.name)) {
            return {
                factor: 'nakshatra',
                score: TIMING_SCORES.NAKSHATRA_NEUTRAL,
                compatibility: 'neutral',
                reason: `${nakshatra.name} is acceptable for ${planetCharity.planet} charity`
            };
        }

        return {
            factor: 'nakshatra',
            score: TIMING_SCORES.NAKSHATRA_INAUSPICIOUS,
            compatibility: 'inauspicious',
            reason: `${nakshatra.name} is less favorable for ${planetCharity.planet} charity`
        };
    }

    /**
     * Check Yoga compatibility for charity
     * @param {Object} yoga - Yoga data
     * @param {Object} planetCharity - Planet charity data
     * @returns {Object} Compatibility result
     */
    checkYogaCompatibility(yoga, planetCharity) {
        if (AUSPICIOUS_YOGAS.includes(yoga.name)) {
            return {
                factor: 'yoga',
                score: TIMING_SCORES.YOGA_AUSPICIOUS,
                compatibility: 'auspicious',
                reason: `${yoga.name} yoga enhances charity effectiveness`
            };
        }

        if (INAUSPICIOUS_YOGAS.includes(yoga.name)) {
            return {
                factor: 'yoga',
                score: TIMING_SCORES.YOGA_INAUSPICIOUS,
                compatibility: 'inauspicious',
                reason: `${yoga.name} yoga reduces charity effectiveness`
            };
        }

        return {
            factor: 'yoga',
            score: TIMING_SCORES.YOGA_NEUTRAL,
            compatibility: 'neutral',
            reason: `${yoga.name} yoga has neutral effect on charity`
        };
    }

    /**
     * Check Karana compatibility for charity
     * @param {Object} karana - Karana data
     * @param {Object} planetCharity - Planet charity data
     * @returns {Object} Compatibility result
     */
    checkKaranaCompatibility(karana, planetCharity) {
        if (AUSPICIOUS_KARANAS.includes(karana.name)) {
            return {
                factor: 'karana',
                score: TIMING_SCORES.KARANA_AUSPICIOUS,
                compatibility: 'auspicious',
                reason: `${karana.name} karana is favorable for charity`
            };
        }

        return {
            factor: 'karana',
            score: TIMING_SCORES.KARANA_NEUTRAL,
            compatibility: 'neutral',
            reason: `${karana.name} karana is acceptable for charity`
        };
    }

    /**
     * Check Vara (weekday) compatibility for charity
     * @param {Object} vara - Weekday data
     * @param {Object} planetCharity - Planet charity data
     * @returns {Object} Compatibility result
     */
    checkVaraCompatibility(vara, planetCharity) {
        const auspiciousDays = planetCharity.auspiciousDays || [];

        if (auspiciousDays.includes(vara.name)) {
            return {
                factor: 'vara',
                score: TIMING_SCORES.VARA_AUSPICIOUS,
                compatibility: 'auspicious',
                reason: `${vara.name} is the most favorable day for ${planetCharity.planet} charity`
            };
        }

        return {
            factor: 'vara',
            score: TIMING_SCORES.VARA_NEUTRAL,
            compatibility: 'neutral',
            reason: `${vara.name} is acceptable for ${planetCharity.planet} charity`
        };
    }

    /**
     * Get timing rating based on score
     * @param {number} score - Total timing score
     * @returns {string} Rating
     */
    getTimingRating(score) {
        if (score >= TIMING_RATINGS.EXCELLENT.min) return TIMING_RATINGS.EXCELLENT.label;
        if (score >= TIMING_RATINGS.VERY_GOOD.min) return TIMING_RATINGS.VERY_GOOD.label;
        if (score >= TIMING_RATINGS.GOOD.min) return TIMING_RATINGS.GOOD.label;
        if (score >= TIMING_RATINGS.FAIR.min) return TIMING_RATINGS.FAIR.label;
        return TIMING_RATINGS.POOR.label;
    }

    /**
     * Get timing recommendation based on score
     * @param {number} score - Total timing score
     * @returns {string} Recommendation
     */
    getTimingRecommendation(score) {
        if (score >= TIMING_RATINGS.EXCELLENT.min) return TIMING_RECOMMENDATIONS.EXCELLENT;
        if (score >= TIMING_RATINGS.VERY_GOOD.min) return TIMING_RECOMMENDATIONS.VERY_GOOD;
        if (score >= TIMING_RATINGS.GOOD.min) return TIMING_RECOMMENDATIONS.GOOD;
        if (score >= TIMING_RATINGS.FAIR.min) return TIMING_RECOMMENDATIONS.FAIR;
        return TIMING_RECOMMENDATIONS.POOR;
    }

    /**
     * Calculate favorable planetary transits for charity
     * @param {string} planet - Planet name
     * @param {Date} currentDate - Current date
     * @param {Object} chart - Birth chart
     * @returns {Array} Favorable transits
     */
    calculateFavorableTransits(planet, currentDate, chart) {
        const transits = this.calculateCurrentTransits(currentDate, chart);
        const favorableTransits = [];

        // Check if planet is well-placed in transit
        const transitPosition = transits[planet];
        if (transitPosition) {
            const signStrength = this.getSignStrength(planet, transitPosition.sign);
            const houseStrength = this.getHouseStrength(transitPosition.house);

            if (signStrength >= 15 && houseStrength >= 15) {
                favorableTransits.push({
                    type: 'transit_position',
                    planet: planet,
                    strength: (signStrength + houseStrength) / 2,
                    reason: `${planet} is well-placed in transit`
                });
            }
        }

        // Check for beneficial aspects
        const aspects = this.calculateTransitAspects(chart, transits);
        if (aspects[planet]) {
            Object.keys(aspects[planet]).forEach(aspectingPlanet => {
                const aspect = aspects[planet][aspectingPlanet];
                if (['trine', 'sextile'].includes(aspect.aspect)) {
                    favorableTransits.push({
                        type: 'benefic_aspect',
                        planets: [planet, aspectingPlanet],
                        aspect: aspect.aspect,
                        strength: aspect.strength,
                        reason: `Benefic ${aspect.aspect} from ${aspectingPlanet} to ${planet}`
                    });
                }
            });
        }

        return favorableTransits;
    }

    /**
     * Calculate current planetary transits (simplified)
     * @param {Date} currentDate - Current date
     * @param {Object} chart - Birth chart
     * @returns {Object} Transit positions
     */
    calculateCurrentTransits(currentDate, chart) {
        // This would integrate with actual ephemeris calculations
        // For now, return simplified transit data
        const transits = {};

        // Simplified transit calculation - in real implementation would use astronomical calculations
        Object.keys(chart.planets).forEach(planet => {
            transits[planet] = {
                longitude: (chart.planets[planet].longitude + 1) % 360, // Simplified daily motion
                sign: Math.floor(((chart.planets[planet].longitude + 1) % 360) / 30),
                house: 1 // Simplified house calculation
            };
        });

        return transits;
    }

    /**
     * Calculate transit aspects (simplified)
     * @param {Object} chart - Birth chart
     * @param {Object} transits - Transit positions
     * @returns {Object} Aspect data
     */
    calculateTransitAspects(chart, transits) {
        // Simplified aspect calculation
        const aspects = {};

        // This would be replaced with actual aspect calculation logic
        return aspects;
    }

    /**
     * Get sign strength for transit
     * @param {string} planet - Planet name
     * @param {number} sign - Sign number
     * @returns {number} Strength score
     */
    getSignStrength(planet, sign) {
        const signStrengths = {
            SUN: { 4: 20, 0: 15, 8: 15, 6: 10, 2: 10, 10: 5, 7: 5, 11: 5 },
            MOON: { 3: 20, 2: 15, 8: 15, 11: 10, 5: 10, 9: 5, 7: 5 },
            MARS: { 0: 20, 7: 20, 9: 15, 4: 15, 8: 10, 3: 5, 6: 5 },
            MERCURY: { 5: 20, 2: 20, 6: 15, 10: 15, 8: 10, 11: 10, 4: 5, 7: 5 },
            JUPITER: { 8: 20, 11: 20, 3: 15, 4: 15, 0: 10, 7: 10, 5: 5, 9: 5 },
            VENUS: { 2: 20, 6: 20, 11: 15, 8: 15, 3: 10, 7: 10, 5: 5, 4: 5 },
            SATURN: { 9: 20, 10: 20, 6: 15, 8: 15, 2: 10, 5: 10, 3: 5, 4: 5 },
            RAHU: { 10: 20, 7: 15, 11: 15, 3: 10, 4: 10, 2: 5, 5: 5 },
            KETU: { 7: 20, 11: 15, 10: 15, 3: 10, 4: 10, 2: 5, 5: 5 }
        };

        return signStrengths[planet]?.[sign] || 10;
    }

    /**
     * Get house strength for transit
     * @param {number} house - House number
     * @returns {number} Strength score
     */
    getHouseStrength(house) {
        const houseStrengths = {
            1: 20, 4: 20, 7: 20, 10: 20, // Angular houses ( Kendra )
            2: 15, 5: 15, 8: 15, 11: 15, // Succedent houses ( Panapara )
            3: 10, 6: 10, 9: 10, 12: 10  // Cadent houses ( Apoklima )
        };

        return houseStrengths[house] || 10;
    }

    /**
     * Find recommended dates for charity within a period
     * @param {string} planet - Planet name
     * @param {Date} startDate - Start date
     * @param {number} days - Number of days to check
     * @returns {Array} Recommended dates
     */
    findRecommendedDates(planet, startDate, days) {
        const recommendedDates = [];
        const planetData = this.planetaryCharities[planet];

        if (!planetData) return recommendedDates;

        for (let i = 0; i < days; i++) {
            const checkDate = new Date(startDate);
            checkDate.setDate(startDate.getDate() + i);

            const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][checkDate.getDay()];

            if (planetData.auspiciousDays.includes(dayName)) {
                recommendedDates.push({
                    date: new Date(checkDate),
                    day: dayName,
                    reason: `Auspicious day for ${planet} charity`
                });
            }
        }

        return recommendedDates.slice(0, 5); // Return top 5 dates
    }
}

module.exports = CharityTimingCalculator;