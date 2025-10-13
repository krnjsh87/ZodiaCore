/**
 * Western Transit Calculator
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * This class handles astronomical calculations for planetary transits
 * in the tropical zodiac system used by Western astrology.
 */

const { WESTERN_HOROSCOPE_CONSTANTS } = require('./western-horoscope-constants');
const {
    calculateJulianDay,
    angularSeparation,
    normalizeAngle,
    withinOrb,
    calculateAspectStrength,
    isApplying
} = require('./western-horoscope-utils');

class WesternTransitCalculator {
    constructor() {
        // In production, integrate with Swiss Ephemeris or similar
        // For now, using simplified calculations
        this.planetaryCalculator = new SimplifiedPlanetaryCalculator();
    }

    /**
     * Calculate current transit positions
     * @param {Date} date - Date for transit calculation
     * @param {Object} location - Location {latitude, longitude}
     * @returns {Object} Transit data
     */
    calculateCurrentTransits(date, location = null) {
        const julianDay = calculateJulianDay(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        );

        const tropicalPositions = this.planetaryCalculator.calculateAccuratePlanets(julianDay);

        return {
            positions: tropicalPositions,
            date: date,
            julianDay: julianDay,
            retrograde: this.calculateRetrogradeStatus(tropicalPositions),
            location: location
        };
    }

    /**
     * Calculate transit aspects to natal planets
     * @param {Object} natalChart - Natal birth chart
     * @param {Object} transitPositions - Current transit positions
     * @returns {Object} Aspect analysis
     */
    calculateTransitAspects(natalChart, transitPositions) {
        const aspects = {};

        for (const natalPlanet in natalChart.planets) {
            aspects[natalPlanet] = {};

            for (const transitPlanet in transitPositions.positions) {
                const angle = angularSeparation(
                    natalChart.planets[natalPlanet].longitude,
                    transitPositions.positions[transitPlanet]
                );

                const aspect = this.determineAspect(angle);
                const strength = aspect ? calculateAspectStrength(
                    angle,
                    WESTERN_HOROSCOPE_CONSTANTS.ASPECTS[aspect].angle,
                    WESTERN_HOROSCOPE_CONSTANTS.ASPECTS[aspect].orb,
                    WESTERN_HOROSCOPE_CONSTANTS.ASPECTS[aspect].weight
                ) : 0;

                aspects[natalPlanet][transitPlanet] = {
                    angle: angle,
                    aspect: aspect,
                    strength: strength,
                    applying: aspect ? isApplying(
                        natalChart.planets[natalPlanet],
                        { longitude: transitPositions.positions[transitPlanet] }
                    ) : false,
                    orb: aspect ? Math.abs(angle - WESTERN_HOROSCOPE_CONSTANTS.ASPECTS[aspect].angle) : null
                };
            }
        }

        return aspects;
    }

    /**
     * Determine aspect type from angle
     * @param {number} angle - Angular separation
     * @returns {string|null} Aspect name or null
     */
    determineAspect(angle) {
        for (const [aspectName, aspectData] of Object.entries(WESTERN_HOROSCOPE_CONSTANTS.ASPECTS)) {
            if (withinOrb(angle, aspectData.angle, aspectData.orb)) {
                return aspectName;
            }
        }
        return null;
    }

    /**
     * Calculate retrograde status for planets
     * @param {Object} positions - Planetary positions
     * @returns {Object} Retrograde status
     */
    calculateRetrogradeStatus(positions) {
        // Simplified retrograde calculation
        // In production, requires velocity calculations from ephemeris
        const retrograde = {};

        // Mercury retrograde (approximately 3-4 times per year)
        retrograde.MERCURY = this.isPlanetRetrograde('MERCURY', positions.MERCURY);

        // Venus retrograde (every 18 months)
        retrograde.VENUS = this.isPlanetRetrograde('VENUS', positions.VENUS);

        // Mars retrograde (every 2 years)
        retrograde.MARS = this.isPlanetRetrograde('MARS', positions.MARS);

        // Jupiter, Saturn, Uranus, Neptune, Pluto have complex retrograde patterns
        // Simplified for this implementation
        retrograde.JUPITER = false;
        retrograde.SATURN = false;
        retrograde.URANUS = false;
        retrograde.NEPTUNE = false;
        retrograde.PLUTO = false;

        return retrograde;
    }

    /**
     * Check if planet is retrograde (simplified)
     * @param {string} planet - Planet name
     * @param {number} position - Current position
     * @returns {boolean} True if retrograde
     */
    isPlanetRetrograde(planet, position) {
        // Simplified retrograde detection
        // In production, use actual velocity calculations
        const retrogradeZones = {
            MERCURY: [210, 270], // Scorpio to Sagittarius
            VENUS: [150, 210],   // Leo to Scorpio
            MARS: [90, 150]      // Cancer to Leo
        };

        const zones = retrogradeZones[planet];
        if (!zones) return false;

        const normalizedPos = normalizeAngle(position);
        return normalizedPos >= zones[0] && normalizedPos <= zones[1];
    }

    /**
     * Calculate transit strength for a planet
     * @param {string} planet - Planet name
     * @param {Object} transits - Transit positions
     * @param {Object} aspects - Transit aspects
     * @returns {number} Strength score (0-1)
     */
    calculateTransitStrength(planet, transits, aspects) {
        let strength = WESTERN_HOROSCOPE_CONSTANTS.TRANSIT_WEIGHTS[planet] || 0.5;

        // Apply retrograde multiplier
        if (transits.retrograde && transits.retrograde[planet]) {
            strength *= WESTERN_HOROSCOPE_CONSTANTS.RETROGRADE_MULTIPLIERS[planet] || 0.8;
        }

        // Factor in aspects (simplified)
        let aspectBonus = 0;
        if (aspects[planet]) {
            for (const transitPlanet in aspects[planet]) {
                if (aspects[planet][transitPlanet].aspect) {
                    aspectBonus += aspects[planet][transitPlanet].strength * 0.1;
                }
            }
        }

        return Math.min(1, strength + aspectBonus);
    }
}

/**
 * Simplified Planetary Calculator
 * Placeholder for actual astronomical calculations
 * In production, replace with Swiss Ephemeris or similar
 */
class SimplifiedPlanetaryCalculator {
    /**
     * Calculate planetary positions (simplified)
     * @param {number} julianDay - Julian day
     * @returns {Object} Planetary longitudes
     */
    calculateAccuratePlanets(julianDay) {
        // Simplified calculations for demonstration
        // In production, use proper astronomical algorithms

        const baseDate = 2451545.0; // J2000 epoch
        const daysSinceEpoch = julianDay - baseDate;

        // Simplified mean longitudes (not accurate for real use)
        return {
            SUN: (280.460 + 0.9856474 * daysSinceEpoch) % 360,
            MOON: (218.316 + 13.176396 * daysSinceEpoch) % 360,
            MERCURY: (252.251 + 1.602130 * daysSinceEpoch) % 360,
            VENUS: (181.979 + 1.602130 * daysSinceEpoch) % 360,
            MARS: (355.433 + 0.5240207 * daysSinceEpoch) % 360,
            JUPITER: (34.351 + 0.083129 * daysSinceEpoch) % 360,
            SATURN: (50.078 + 0.033585 * daysSinceEpoch) % 360,
            URANUS: (314.055 + 0.011734 * daysSinceEpoch) % 360,
            NEPTUNE: (304.348 + 0.005981 * daysSinceEpoch) % 360,
            PLUTO: (238.928 + 0.003963 * daysSinceEpoch) % 360
        };
    }
}

module.exports = {
    WesternTransitCalculator,
    SimplifiedPlanetaryCalculator
};</path>
<line_count>180</line_count>
</write_to_file>