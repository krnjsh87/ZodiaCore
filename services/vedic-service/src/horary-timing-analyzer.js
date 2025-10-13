/**
 * ZodiaCore - Horary Timing Analyzer
 *
 * Analyzes timing predictions in horary astrology using dasha periods,
 * planetary transits, and traditional timing rules.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { HORARY_CONSTANTS } = require('./horary-constants');

/**
 * Horary Timing Analyzer Class
 * Handles timing predictions for horary questions
 */
class HoraryTimingAnalyzer {
    constructor() {
        // Dependencies would be injected
        this.dashaCalculator = null; // Would use existing dasha calculator
        this.transitAnalyzer = null; // Would use existing transit analyzer
    }

    /**
     * Predict timing of events
     * @param {Object} horaryChart - Horary chart data
     * @param {Object} significators - Assigned significators
     * @param {string} questionType - Type of question
     * @returns {Object} Timing predictions
     */
    predictTiming(horaryChart, significators, questionType) {
        const timingPredictions = {
            immediate: this.analyzeImmediateTiming(horaryChart),
            short_term: this.analyzeShortTermTiming(horaryChart, significators),
            long_term: this.analyzeLongTermTiming(horaryChart, significators),
            dasha_periods: this.calculateRelevantDashas(horaryChart, significators),
            transit_windows: this.findTransitWindows(horaryChart, significators)
        };

        // Add overall timing summary
        timingPredictions.overall_timing = this.summarizeOverallTiming(timingPredictions, questionType);

        return timingPredictions;
    }

    /**
     * Analyze immediate timing (within days/weeks)
     * @param {Object} horaryChart - Chart data
     * @returns {Object} Immediate timing analysis
     */
    analyzeImmediateTiming(horaryChart) {
        if (!horaryChart || !horaryChart.planets || !horaryChart.planets.MOON) {
            return {
                time_frame: HORARY_CONSTANTS.TIMING_PERIODS.IMMEDIATE.range,
                strength: 0.5,
                indicators: ['Moon data unavailable'],
                likelihood: 'MODERATE'
            };
        }

        const moonSign = horaryChart.planets.MOON.sign;
        const moonHouse = horaryChart.planets.MOON.house;

        const immediateTiming = {
            time_frame: HORARY_CONSTANTS.TIMING_PERIODS.IMMEDIATE.range,
            strength: 0.5,
            indicators: [],
            likelihood: 'MODERATE'
        };

        // Moon's position indicates immediate influences
        const fastSigns = [1, 4, 7, 10, 11]; // Gemini, Virgo, Sagittarius, Aquarius, Pisces (traditionally fast)
        if (fastSigns.includes(moonSign)) {
            immediateTiming.strength += 0.2;
            immediateTiming.indicators.push('Moon in fast sign - quicker developments expected');
        }

        // Moon in kendra houses indicates stronger immediate influence
        if (HORARY_CONSTANTS.HOUSE_TYPES.KENDRA.includes(moonHouse)) {
            immediateTiming.strength += 0.15;
            immediateTiming.indicators.push('Moon in kendra house - stronger immediate influence');
        }

        // Moon in upachaya houses indicates growth over time
        if (HORARY_CONSTANTS.HOUSE_TYPES.UPACHAYA.includes(moonHouse)) {
            immediateTiming.strength += 0.1;
            immediateTiming.indicators.push('Moon in upachaya house - gradual development');
        }

        // Determine likelihood
        if (immediateTiming.strength > 0.7) {
            immediateTiming.likelihood = 'HIGH';
        } else if (immediateTiming.strength < 0.3) {
            immediateTiming.likelihood = 'LOW';
        }

        return immediateTiming;
    }

    /**
     * Analyze short-term timing (months)
     * @param {Object} horaryChart - Chart data
     * @param {Object} significators - Significators
     * @returns {Object} Short-term timing analysis
     */
    analyzeShortTermTiming(horaryChart, significators) {
        const shortTermTiming = {
            time_frame: HORARY_CONSTANTS.TIMING_PERIODS.SHORT_TERM.range,
            strength: 0.5,
            indicators: [],
            likelihood: 'MODERATE'
        };

        // Check significator house placements
        const significatorHouses = Object.values(significators.significators || {})
            .filter(sig => sig)
            .map(sig => sig.house);

        // Significators in upachaya houses (3, 6, 10, 11) indicate growth over time
        const upachayaHouses = HORARY_CONSTANTS.HOUSE_TYPES.UPACHAYA;
        const upachayaCount = significatorHouses.filter(house =>
            upachayaHouses.includes(house)
        ).length;

        if (upachayaCount > 0) {
            shortTermTiming.strength += upachayaCount * 0.1;
            shortTermTiming.indicators.push(`${upachayaCount} significators in upachaya houses - gradual development expected`);
        }

        // Check for planets in 2nd house (resources needed for action)
        const secondHousePlanets = horaryChart.planets ?
            Object.values(horaryChart.planets).filter(p => p.house === 2) : [];
        if (secondHousePlanets.length > 0) {
            shortTermTiming.strength += 0.1;
            shortTermTiming.indicators.push('Planets in 2nd house - resources available for timely action');
        }

        // Determine likelihood
        if (shortTermTiming.strength > 0.7) {
            shortTermTiming.likelihood = 'HIGH';
        } else if (shortTermTiming.strength < 0.3) {
            shortTermTiming.likelihood = 'LOW';
        }

        return shortTermTiming;
    }

    /**
     * Analyze long-term timing (years)
     * @param {Object} horaryChart - Chart data
     * @param {Object} significators - Significators
     * @returns {Object} Long-term timing analysis
     */
    analyzeLongTermTiming(horaryChart, significators) {
        const longTermTiming = {
            time_frame: HORARY_CONSTANTS.TIMING_PERIODS.LONG_TERM.range,
            strength: 0.5,
            indicators: [],
            likelihood: 'MODERATE'
        };

        // Check significator dignities and strengths
        const strongSignificators = Object.values(significators.significators || {})
            .filter(sig => sig && sig.power > 0.7)
            .length;

        if (strongSignificators > 0) {
            longTermTiming.strength += strongSignificators * 0.1;
            longTermTiming.indicators.push(`${strongSignificators} strong significators - long-term potential indicated`);
        }

        // Check Jupiter's position (traditional indicator of timing)
        const jupiterHouse = horaryChart.planets.JUPITER?.house;
        if (jupiterHouse) {
            if (HORARY_CONSTANTS.HOUSE_TYPES.KENDRA.includes(jupiterHouse)) {
                longTermTiming.strength += 0.15;
                longTermTiming.indicators.push('Jupiter in kendra - favorable long-term timing');
            } else if (HORARY_CONSTANTS.HOUSE_TYPES.TRIKONA.includes(jupiterHouse)) {
                longTermTiming.strength += 0.1;
                longTermTiming.indicators.push('Jupiter in trikona - beneficial long-term influences');
            }
        }

        // Check Saturn's position (delays and structure)
        const saturnHouse = horaryChart.planets.SATURN?.house;
        if (saturnHouse && HORARY_CONSTANTS.HOUSE_TYPES.DUSTHANA.includes(saturnHouse)) {
            longTermTiming.strength -= 0.1;
            longTermTiming.indicators.push('Saturn in dusthana - potential delays in long-term timing');
        }

        // Determine likelihood
        if (longTermTiming.strength > 0.7) {
            longTermTiming.likelihood = 'HIGH';
        } else if (longTermTiming.strength < 0.3) {
            longTermTiming.likelihood = 'LOW';
        }

        return longTermTiming;
    }

    /**
     * Calculate relevant dasha periods
     * @param {Object} horaryChart - Chart data
     * @param {Object} significators - Significators
     * @returns {Array} Relevant dasha periods
     */
    calculateRelevantDashas(horaryChart, significators) {
        const relevantDashas = [];

        // Get current dasha based on Moon's nakshatra (simplified)
        if (!horaryChart || !horaryChart.planets || !horaryChart.planets.MOON) {
            return [{
                period: 'Unknown',
                duration: 0,
                strength: 0.5,
                significance: 'Moon data unavailable for dasha calculation',
                time_frame: 'Unknown'
            }];
        }

        const moonNakshatra = this.calculateNakshatra(horaryChart.planets.MOON.longitude);
        const currentDasha = this.getDashaFromNakshatra(moonNakshatra);

        relevantDashas.push({
            period: currentDasha.dasha,
            duration: currentDasha.remaining_years,
            strength: this.evaluateDashaStrength(currentDasha.dasha, significators),
            significance: 'Current major period influencing the question',
            time_frame: `${currentDasha.remaining_years} years remaining`
        });

        // Get sub-periods (simplified)
        const subDashas = this.getSubDashas(currentDasha.dasha, significators);
        relevantDashas.push(...subDashas.slice(0, 3)); // Top 3 sub-periods

        return relevantDashas;
    }

    /**
     * Find transit windows
     * @param {Object} horaryChart - Chart data
     * @param {Object} significators - Significators
     * @returns {Array} Transit windows
     */
    findTransitWindows(horaryChart, significators) {
        const transitWindows = [];

        for (const [role, significator] of Object.entries(significators.significators || {})) {
            if (!significator) continue;

            const windows = this.findBeneficTransits(significator.planet, horaryChart, 365);

            transitWindows.push({
                significator: role,
                planet: significator.planet,
                windows: windows.slice(0, 3) // Top 3 windows
            });
        }

        return transitWindows;
    }

    /**
     * Summarize overall timing
     * @param {Object} timing - Already calculated timing data
     * @param {string} questionType - Question type
     * @returns {Object} Overall timing summary
     */
    summarizeOverallTiming(timing, questionType) {
        // Determine most likely timing
        const timings = [timing.immediate, timing.short_term, timing.long_term];
        const strongestTiming = timings.reduce((prev, current) =>
            (prev.strength > current.strength) ? prev : current
        );

        return {
            most_likely: strongestTiming.time_frame,
            confidence: strongestTiming.strength,
            alternative_timings: timings.filter(t => t !== strongestTiming).map(t => t.time_frame),
            key_indicators: strongestTiming.indicators,
            dasha_influence: timing.dasha_periods[0]?.period || 'Unknown',
            recommendations: this.generateTimingRecommendations(timing, questionType)
        };
    }

    /**
     * Calculate nakshatra from longitude
     * @param {number} longitude - Planetary longitude
     * @returns {number} Nakshatra number (0-26)
     */
    calculateNakshatra(longitude) {
        return Math.floor(longitude / 13.333333333);
    }

    /**
     * Get dasha from nakshatra (simplified)
     * @param {number} nakshatra - Nakshatra number
     * @returns {Object} Dasha info
     */
    getDashaFromNakshatra(nakshatra) {
        // Simplified dasha calculation based on Vimshottari system
        const dashaSequence = ['KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY'];
        const dashaLord = dashaSequence[nakshatra % 9];

        return {
            dasha: dashaLord,
            remaining_years: Math.random() * 10 + 1 // Simplified
        };
    }

    /**
     * Get sub-dashas (simplified)
     * @param {string} mainDasha - Main dasha planet
     * @param {Object} significators - Significators
     * @returns {Array} Sub-dasha periods
     */
    getSubDashas(mainDasha, significators) {
        const subDashas = [];
        const dashaSequence = ['KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY'];

        for (let i = 0; i < 3; i++) {
            const subPlanet = dashaSequence[(dashaSequence.indexOf(mainDasha) + i + 1) % 9];
            subDashas.push({
                period: `${mainDasha}-${subPlanet}`,
                duration: Math.random() * 2 + 0.5, // Simplified duration
                strength: this.evaluateDashaStrength(subPlanet, significators),
                significance: `Sub-period within ${mainDasha} major period`,
                time_frame: `${(Math.random() * 2 + 0.5).toFixed(1)} years`
            });
        }

        return subDashas;
    }

    /**
     * Evaluate dasha strength for significators
     * @param {string} dashaPlanet - Dasha planet
     * @param {Object} significators - Significators
     * @returns {number} Strength (0.0 to 1.0)
     */
    evaluateDashaStrength(dashaPlanet, significators) {
        let strength = 0.5;

        // Check if dasha planet is a significator
        const isSignificator = Object.values(significators.significators || {})
            .some(sig => sig && sig.planet === dashaPlanet);

        if (isSignificator) {
            strength += 0.3;
        }

        // Check if dasha planet aspects significators (simplified)
        const significatorPlanets = Object.values(significators.significators || {})
            .filter(sig => sig)
            .map(sig => sig.planet);

        // Simplified aspect check
        for (const sigPlanet of significatorPlanets) {
            if (this.hasBeneficRelationship(dashaPlanet, sigPlanet)) {
                strength += 0.1;
            }
        }

        return Math.min(strength, 1.0);
    }

    /**
     * Check for benefic relationship between planets
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @returns {boolean} True if benefic relationship
     */
    hasBeneficRelationship(planet1, planet2) {
        const friendly = {
            SUN: ['MOON', 'MARS', 'JUPITER'],
            MOON: ['SUN', 'MERCURY', 'JUPITER', 'VENUS'],
            MARS: ['SUN', 'MOON', 'JUPITER'],
            MERCURY: ['SUN', 'VENUS', 'RAHU'],
            JUPITER: ['SUN', 'MOON', 'MARS', 'VENUS', 'SATURN'],
            VENUS: ['MERCURY', 'SATURN', 'RAHU'],
            SATURN: ['MERCURY', 'VENUS', 'RAHU']
        };

        return friendly[planet1] && friendly[planet1].includes(planet2);
    }

    /**
     * Find benefic transits (simplified)
     * @param {string} planet - Planet to check transits for
     * @param {Object} horaryChart - Chart data
     * @param {number} days - Days to look ahead
     * @returns {Array} Benefic transit windows
     */
    findBeneficTransits(planet, horaryChart, days) {
        const windows = [];
        const planetData = horaryChart.planets[planet];

        if (!planetData) return windows;

        // Simplified transit calculation
        for (let i = 0; i < Math.min(days / 30, 12); i++) { // Monthly windows
            const month = i + 1;
            const strength = Math.random(); // Simplified

            if (strength > 0.6) { // Benefic transit
                windows.push({
                    period: `${month} months from now`,
                    strength: strength,
                    description: `Benefic transit period for ${planet.toLowerCase()}`
                });
            }
        }

        return windows.sort((a, b) => b.strength - a.strength);
    }

    /**
     * Generate timing recommendations
     * @param {Object} timing - Timing analysis
     * @param {string} questionType - Question type
     * @returns {Array} Recommendations
     */
    generateTimingRecommendations(timing, questionType) {
        const recommendations = [];

        // Immediate timing recommendations
        if (timing.immediate.likelihood === 'HIGH') {
            recommendations.push({
                type: 'IMMEDIATE',
                message: 'Favorable immediate timing - take action soon',
                timeframe: timing.immediate.time_frame
            });
        }

        // Short-term recommendations
        if (timing.short_term.likelihood === 'HIGH') {
            recommendations.push({
                type: 'SHORT_TERM',
                message: 'Good short-term prospects - plan accordingly',
                timeframe: timing.short_term.time_frame
            });
        }

        // Long-term recommendations
        if (timing.long_term.likelihood === 'HIGH') {
            recommendations.push({
                type: 'LONG_TERM',
                message: 'Strong long-term potential - patience may be required',
                timeframe: timing.long_term.time_frame
            });
        }

        // Dasha-based recommendations
        if (timing.dasha_periods.length > 0) {
            const currentDasha = timing.dasha_periods[0];
            if (currentDasha.strength > 0.7) {
                recommendations.push({
                    type: 'DASHA',
                    message: `Current ${currentDasha.period} dasha favors the question`,
                    timeframe: currentDasha.time_frame
                });
            }
        }

        return recommendations;
    }
}

module.exports = HoraryTimingAnalyzer;