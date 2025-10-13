/**
 * ZodiaCore - Predictive Timing Calculator
 *
 * Calculates timing windows for predictive astrology events.
 * Combines progressions and transits to determine when events are likely to occur.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PREDICTIVE_CONSTANTS } = require('./western-predictive-constants');
const {
    calculateSecondaryProgression,
    calculateSolarArcProgression,
    planetsInAspect,
    getEventTriggers,
    calculateTimingPrecision,
    formatTimeSpan
} = require('./western-predictive-utils');

/**
 * Predictive Timing Calculator Class
 */
class PredictiveTimingCalculator {
    constructor() {
        this.supportedEventTypes = Object.values(PREDICTIVE_CONSTANTS.EVENT_TYPES);
    }

    /**
     * Calculate predictive timing windows
     * @param {Object} birthChart - Birth chart data
     * @param {Date} targetDate - Date for predictions
     * @param {string} eventType - Type of event to predict
     * @returns {Object} Timing analysis
     */
    calculatePredictiveTiming(birthChart, targetDate, eventType = 'personal') {
        try {
            const timing = {
                windows: [],
                peakPeriods: [],
                duration: {},
                confidence: 0,
                eventType: eventType
            };

            // Get progressed positions
            const secondaryProgressed = this.calculateSecondaryPositions(birthChart, targetDate);
            const solarArcProgressed = this.calculateSolarArcPositions(birthChart, targetDate);

            // Get current transits (simplified for timing)
            const transits = this.calculateBasicTransits(birthChart, targetDate);

            // Find timing windows for specific event types
            timing.windows = this.findTimingWindows(eventType, secondaryProgressed, solarArcProgressed, transits, targetDate);

            // Calculate peak periods
            timing.peakPeriods = this.findPeakPeriods(timing.windows, targetDate);

            // Estimate duration
            timing.duration = this.estimateInfluenceDuration(timing.windows);

            // Calculate confidence
            timing.confidence = this.calculateTimingConfidence(timing.windows);

            return timing;

        } catch (error) {
            throw new Error(`Predictive timing calculation failed: ${error.message}`);
        }
    }

    /**
     * Calculate secondary progressed positions for timing
     * @param {Object} birthChart - Birth chart
     * @param {Date} targetDate - Target date
     * @returns {Object} Progressed positions
     */
    calculateSecondaryPositions(birthChart, targetDate) {
        const daysElapsed = Math.floor((targetDate - birthChart.birthDate) / (1000 * 60 * 60 * 24));
        const yearsElapsed = daysElapsed / 365.25;

        const progressed = {};

        // Progress key planets for timing
        const keyPlanets = ['SUN', 'MOON', 'MARS', 'JUPITER', 'SATURN'];
        for (const planet of keyPlanets) {
            if (birthChart.planets && birthChart.planets[planet]) {
                progressed[planet] = calculateSecondaryProgression(
                    birthChart.planets[planet].longitude,
                    yearsElapsed
                );
            }
        }

        return progressed;
    }

    /**
     * Calculate solar arc progressed positions for timing
     * @param {Object} birthChart - Birth chart
     * @param {Date} targetDate - Target date
     * @returns {Object} Progressed positions
     */
    calculateSolarArcPositions(birthChart, targetDate) {
        const daysElapsed = Math.floor((targetDate - birthChart.birthDate) / (1000 * 60 * 60 * 24));
        const yearsElapsed = daysElapsed / 365.25;

        const natalSun = birthChart.planets?.SUN?.longitude || 0;
        const progressed = {};

        // Progress key planets for timing
        const keyPlanets = ['SUN', 'MOON', 'MARS', 'JUPITER', 'SATURN'];
        for (const planet of keyPlanets) {
            if (birthChart.planets && birthChart.planets[planet]) {
                progressed[planet] = calculateSolarArcProgression(
                    birthChart.planets[planet].longitude,
                    natalSun,
                    yearsElapsed
                );
            }
        }

        return progressed;
    }

    /**
     * Calculate basic transits for timing
     * @param {Object} birthChart - Birth chart
     * @param {Date} targetDate - Target date
     * @returns {Object} Basic transit positions
     */
    calculateBasicTransits(birthChart, targetDate) {
        // Simplified transit calculation for timing purposes
        // In production, would use full ephemeris
        const daysSinceBirth = Math.floor((targetDate - birthChart.birthDate) / (1000 * 60 * 60 * 24));

        const transits = {};
        const keyPlanets = ['SUN', 'MOON', 'MARS', 'JUPITER', 'SATURN'];

        // Very simplified position calculation (not astronomically accurate)
        for (const planet of keyPlanets) {
            const baseSpeed = this.getBaseSpeed(planet);
            transits[planet] = (birthChart.planets[planet].longitude + (daysSinceBirth * baseSpeed / 365.25)) % 360;
        }

        return transits;
    }

    /**
     * Find timing windows for events
     * @param {string} eventType - Event type
     * @param {Object} secondary - Secondary progressions
     * @param {Object} solarArc - Solar arc progressions
     * @param {Object} transits - Current transits
     * @param {Date} targetDate - Target date
     * @returns {Array} Timing windows
     */
    findTimingWindows(eventType, secondary, solarArc, transits, targetDate) {
        const windows = [];
        const triggers = getEventTriggers(eventType);

        for (const trigger of triggers) {
            const window = this.findTriggerWindow(trigger, secondary, solarArc, transits, targetDate);
            if (window) {
                windows.push(window);
            }
        }

        // Also check for general timing indicators
        const generalWindows = this.findGeneralTimingWindows(secondary, solarArc, transits, targetDate);
        windows.push(...generalWindows);

        return windows;
    }

    /**
     * Find trigger window for specific trigger
     * @param {Object} trigger - Trigger configuration
     * @param {Object} secondary - Secondary progressions
     * @param {Object} solarArc - Solar arc progressions
     * @param {Object} transits - Transits
     * @param {Date} targetDate - Target date
     * @returns {Object|null} Timing window or null
     */
    findTriggerWindow(trigger, secondary, solarArc, transits, targetDate) {
        // Check if trigger planets are in aspect
        const aspects = this.checkTriggerAspects(trigger, secondary, solarArc, transits);

        if (aspects.length > 0) {
            return {
                trigger: trigger,
                aspects: aspects,
                date: targetDate,
                strength: this.calculateWindowStrength(aspects),
                indicators: aspects.length,
                type: 'trigger'
            };
        }

        return null;
    }

    /**
     * Check trigger aspects
     * @param {Object} trigger - Trigger configuration
     * @param {Object} secondary - Secondary progressions
     * @param {Object} solarArc - Solar arc progressions
     * @param {Object} transits - Transits
     * @returns {Array} Aspects found
     */
    checkTriggerAspects(trigger, secondary, solarArc, transits) {
        const aspects = [];

        // Check secondary progressions
        if (trigger.planets && trigger.planets.length >= 2) {
            for (let i = 0; i < trigger.planets.length; i++) {
                for (let j = i + 1; j < trigger.planets.length; j++) {
                    const planet1 = trigger.planets[i];
                    const planet2 = trigger.planets[j];

                    if (secondary[planet1] && secondary[planet2]) {
                        const aspect = planetsInAspect(secondary[planet1], secondary[planet2]);
                        if (aspect && trigger.aspects.includes(aspect.aspect)) {
                            aspects.push({
                                type: 'secondary',
                                planet1: planet1,
                                planet2: planet2,
                                aspect: aspect.aspect,
                                strength: aspect.strength
                            });
                        }
                    }
                }
            }
        }

        // Check solar arc progressions
        if (trigger.planets && trigger.planets.length >= 2) {
            for (let i = 0; i < trigger.planets.length; i++) {
                for (let j = i + 1; j < trigger.planets.length; j++) {
                    const planet1 = trigger.planets[i];
                    const planet2 = trigger.planets[j];

                    if (solarArc[planet1] && solarArc[planet2]) {
                        const aspect = planetsInAspect(solarArc[planet1], solarArc[planet2]);
                        if (aspect && trigger.aspects.includes(aspect.aspect)) {
                            aspects.push({
                                type: 'solar_arc',
                                planet1: planet1,
                                planet2: planet2,
                                aspect: aspect.aspect,
                                strength: aspect.strength
                            });
                        }
                    }
                }
            }
        }

        // Check transits to progressed planets
        for (const progressedPlanet in secondary) {
            if (transits[progressedPlanet]) {
                const aspect = planetsInAspect(secondary[progressedPlanet], transits[progressedPlanet]);
                if (aspect) {
                    aspects.push({
                        type: 'transit_secondary',
                        progressedPlanet: progressedPlanet,
                        transitPlanet: progressedPlanet,
                        aspect: aspect.aspect,
                        strength: aspect.strength
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Find general timing windows
     * @param {Object} secondary - Secondary progressions
     * @param {Object} solarArc - Solar arc progressions
     * @param {Object} transits - Transits
     * @param {Date} targetDate - Target date
     * @returns {Array} General timing windows
     */
    findGeneralTimingWindows(secondary, solarArc, transits, targetDate) {
        const windows = [];

        // Check for planets near angles in progressions
        for (const planet in secondary) {
            if (this.isNearAngle(secondary[planet])) {
                windows.push({
                    type: 'secondary_angle',
                    planet: planet,
                    longitude: secondary[planet],
                    date: targetDate,
                    strength: 0.8,
                    indicators: 1,
                    significance: 'Secondary progression angle activation'
                });
            }
        }

        for (const planet in solarArc) {
            if (this.isNearAngle(solarArc[planet])) {
                windows.push({
                    type: 'solar_arc_angle',
                    planet: planet,
                    longitude: solarArc[planet],
                    date: targetDate,
                    strength: 0.9,
                    indicators: 1,
                    significance: 'Solar arc angle activation'
                });
            }
        }

        // Check for multiple planet concentrations
        const concentration = this.checkPlanetaryConcentration(secondary, solarArc, transits);
        if (concentration) {
            windows.push(concentration);
        }

        return windows;
    }

    /**
     * Check if longitude is near an angle
     * @param {number} longitude - Longitude to check
     * @returns {boolean} True if near angle
     */
    isNearAngle(longitude) {
        for (const angle of PREDICTIVE_CONSTANTS.ANGLES) {
            if (Math.abs(longitude - angle) <= PREDICTIVE_CONSTANTS.TIMING_WINDOWS.CLOSE) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check for planetary concentration
     * @param {Object} secondary - Secondary progressions
     * @param {Object} solarArc - Solar arc progressions
     * @param {Object} transits - Transits
     * @returns {Object|null} Concentration window or null
     */
    checkPlanetaryConcentration(secondary, solarArc, transits) {
        // Check if multiple planets are in same sign or house
        const signCounts = {};
        const houseCounts = {};

        const allPositions = { ...secondary, ...solarArc, ...transits };

        for (const planet in allPositions) {
            const sign = Math.floor(allPositions[planet] / 30);
            const house = Math.floor(allPositions[planet] / 30); // Simplified

            signCounts[sign] = (signCounts[sign] || 0) + 1;
            houseCounts[house] = (houseCounts[house] || 0) + 1;
        }

        // Check for concentration
        for (const sign in signCounts) {
            if (signCounts[sign] >= 3) {
                return {
                    type: 'concentration',
                    focus: 'sign',
                    sign: parseInt(sign),
                    planets: signCounts[sign],
                    strength: 0.7,
                    indicators: signCounts[sign],
                    significance: `${signCounts[sign]} planets concentrated in sign ${sign}`
                };
            }
        }

        return null;
    }

    /**
     * Find peak periods from timing windows
     * @param {Array} windows - Timing windows
     * @param {Date} targetDate - Target date
     * @returns {Array} Peak periods
     */
    findPeakPeriods(windows, targetDate) {
        const peaks = [];

        // Sort windows by strength
        const sortedWindows = windows.sort((a, b) => b.strength - a.strength);

        // Take top windows as peaks
        for (let i = 0; i < Math.min(3, sortedWindows.length); i++) {
            const window = sortedWindows[i];
            peaks.push({
                date: targetDate.toISOString(),
                type: window.type,
                strength: window.strength,
                significance: window.significance || 'Peak period identified',
                duration: this.estimatePeakDuration(window)
            });
        }

        return peaks;
    }

    /**
     * Estimate influence duration
     * @param {Array} windows - Timing windows
     * @returns {Object} Duration estimates
     */
    estimateInfluenceDuration(windows) {
        if (windows.length === 0) {
            return {
                shortTerm: '1-2 weeks',
                mediumTerm: '1-3 months',
                longTerm: '6-12 months'
            };
        }

        // Calculate based on window strengths and types
        const avgStrength = windows.reduce((sum, w) => sum + w.strength, 0) / windows.length;

        let duration;
        if (avgStrength > 0.8) {
            duration = '3-6 months';
        } else if (avgStrength > 0.6) {
            duration = '1-3 months';
        } else {
            duration = '2-4 weeks';
        }

        return {
            estimated: duration,
            basedOn: `${windows.length} timing indicators`,
            confidence: avgStrength
        };
    }

    /**
     * Calculate timing confidence
     * @param {Array} windows - Timing windows
     * @returns {number} Confidence score (0-1)
     */
    calculateTimingConfidence(windows) {
        if (windows.length === 0) return 0;

        let totalConfidence = 0;

        for (const window of windows) {
            // Factors affecting confidence:
            // - Number of confirming indicators
            // - Strength of aspects
            // - Proximity to exact timing
            // - Historical accuracy patterns

            const indicatorStrength = Math.min(window.indicators || 1, 5) * 0.1; // Max 0.5
            const aspectStrength = window.strength || 0.5;
            const timingPrecision = calculateTimingPrecision(window);

            const windowConfidence = (indicatorStrength + aspectStrength + timingPrecision) / 3;
            totalConfidence += windowConfidence;
        }

        return Math.min(1.0, totalConfidence / windows.length);
    }

    /**
     * Calculate window strength
     * @param {Array} aspects - Aspects in window
     * @returns {number} Strength score
     */
    calculateWindowStrength(aspects) {
        if (aspects.length === 0) return 0;

        const avgStrength = aspects.reduce((sum, a) => sum + a.strength, 0) / aspects.length;
        const countBonus = Math.min(aspects.length * 0.1, 0.3); // Bonus for multiple aspects

        return Math.min(1.0, avgStrength + countBonus);
    }

    /**
     * Estimate peak duration
     * @param {Object} window - Timing window
     * @returns {string} Duration estimate
     */
    estimatePeakDuration(window) {
        if (window.type === 'solar_arc_angle') {
            return '2-3 months';
        } else if (window.type === 'secondary_angle') {
            return '1-2 months';
        } else if (window.type === 'trigger') {
            return '3-6 weeks';
        } else {
            return '1 month';
        }
    }

    /**
     * Get base speed for planet (degrees per day - simplified)
     * @param {string} planet - Planet name
     * @returns {number} Speed in degrees per day
     */
    getBaseSpeed(planet) {
        const speeds = {
            SUN: 1.0,
            MOON: 13.2,
            MERCURY: 4.1,
            VENUS: 1.6,
            MARS: 0.5,
            JUPITER: 0.08,
            SATURN: 0.03,
            URANUS: 0.01,
            NEPTUNE: 0.006,
            PLUTO: 0.004
        };

        return speeds[planet] || 1.0;
    }
}

module.exports = PredictiveTimingCalculator;