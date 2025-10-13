/**
 * ZodiaCore - Planetary Calculator
 *
 * Advanced planetary position calculations using simplified VSOP87 theory.
 * Provides accurate planetary longitudes for Vedic astrology calculations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');
const { degToRad, radToDeg, normalizeAngle, sinDeg } = require('./math-utils');

/**
 * Planetary Calculator using simplified VSOP87 theory
 * For production use, integrate with Swiss Ephemeris or full VSOP87 coefficients
 */
class PlanetaryCalculator {
    constructor() {
        // Simplified VSOP87 coefficients (L0, L1, L2 terms for mean longitude)
        // In production, use complete VSOP87 with thousands of terms
        this.vsopTerms = {
            SUN: {
                L0: [
                    { A: 0, B: 0, C: 0 } // Mean longitude at J2000
                ],
                L1: [
                    { A: 628331966747.0, B: 0, C: 0 } // Annual variation
                ],
                L2: [
                    { A: 52919.0, B: 0, C: 0 } // Small corrections
                ]
            },
            MOON: {
                // Simplified ELP2000 lunar theory
                L: [
                    { A: 218.3164477, B: 481267.88123421, C: -0.0015786 },
                    { A: 6.288774, B: 477198.867398, C: 0 },
                    { A: 1.274027, B: 413335.35, C: 0 }
                ]
            },
            MARS: {
                L0: [
                    { A: 355.433, B: 0, C: 0 },
                    { A: 0.524021, B: 19139.858, C: 0 }
                ],
                L1: [
                    { A: 19139.858, B: 0, C: 0 }
                ]
            },
            MERCURY: {
                L0: [
                    { A: 252.251, B: 0, C: 0 },
                    { A: 1.602130, B: 149472.675, C: 0 }
                ]
            },
            VENUS: {
                L0: [
                    { A: 181.979, B: 0, C: 0 },
                    { A: 1.602130, B: 58517.814, C: 0 }
                ]
            },
            JUPITER: {
                L0: [
                    { A: 34.351, B: 0, C: 0 },
                    { A: 0.083129, B: 1097.279, C: 0 }
                ]
            },
            SATURN: {
                L0: [
                    { A: 50.078, B: 0, C: 0 },
                    { A: 0.033445, B: 439.883, C: 0 }
                ]
            }
        };
    }

    /**
     * Calculate planetary longitude using simplified VSOP87 theory
     * @param {string} planet - Planet name (SUN, MOON, etc.)
     * @param {number} T - Julian centuries from J2000
     * @returns {number} Longitude in degrees
     */
    calculatePlanetLongitude(planet, T) {
        if (!this.vsopTerms[planet]) {
            throw new Error(`Planet ${planet} not supported in simplified calculator`);
        }

        const terms = this.vsopTerms[planet];
        let longitude = 0;

        // Sum VSOP87 series (simplified)
        if (terms.L0) {
            for (const term of terms.L0) {
                longitude += term.A * Math.cos(term.B * T + term.C);
            }
        }

        if (terms.L1) {
            for (const term of terms.L1) {
                longitude += term.A * T * Math.cos(term.B * T + term.C);
            }
        }

        if (terms.L2) {
            for (const term of terms.L2) {
                longitude += term.A * T * T * Math.cos(term.B * T + term.C);
            }
        }

        // For Moon, use different calculation
        if (planet === 'MOON') {
            longitude = this.calculateMoonLongitude(T);
        }

        return normalizeAngle(radToDeg(longitude));
    }

    /**
     * Calculate Moon's longitude using simplified ELP2000 theory
     * @param {number} T - Julian centuries from J2000
     * @returns {number} Moon's longitude in degrees
     */
    calculateMoonLongitude(T) {
        // Mean longitude of the Moon
        const L = normalizeAngle(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);

        // Mean elongation of the Moon
        const D = normalizeAngle(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);

        // Mean anomaly of the Sun
        const M = normalizeAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);

        // Mean anomaly of the Moon
        const M_prime = normalizeAngle(134.9633964 + 477198.8675055 * T + 0.0087424 * T * T);

        // Mean distance of the Moon from its ascending node
        const F = normalizeAngle(93.272095 + 483202.0175233 * T - 0.0036539 * T * T);

        // Periodic terms for longitude
        const longitudeCorrection =
            6.288774 * sinDeg(M_prime) +
            1.274027 * sinDeg(2 * D - M_prime) +
            0.658314 * sinDeg(2 * D) +
            0.213618 * sinDeg(2 * M_prime) +
            -0.185116 * sinDeg(M) +
            -0.114332 * sinDeg(2 * F) +
            0.058793 * sinDeg(2 * D - 2 * M_prime) +
            0.057066 * sinDeg(2 * D - M - M_prime) +
            0.053322 * sinDeg(2 * D + M_prime) +
            -0.031958 * sinDeg(M - 2 * M_prime);

        return normalizeAngle(L + longitudeCorrection);
    }

    /**
     * Calculate accurate planetary positions for all planets
     * @param {number} julianDay - Julian Day Number
     * @returns {Object} Tropical planetary positions
     */
    calculateAccuratePlanets(julianDay) {
        const T = (julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000) / ASTRO_CONSTANTS.JULIAN_CENTURY;
        const positions = {};

        // Calculate each planet's position
        const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'VENUS', 'JUPITER', 'SATURN'];

        for (const planet of planets) {
            try {
                positions[planet] = this.calculatePlanetLongitude(planet, T);
            } catch (error) {
                // Fallback to simplified calculations
                positions[planet] = this.calculateSimplifiedPosition(planet, julianDay);
            }
        }

        // Calculate lunar nodes (Rahu/Ketu)
        const { rahu, ketu } = this.calculateLunarNodes(julianDay);
        positions.RAHU = rahu;
        positions.KETU = ketu;

        return positions;
    }

    /**
     * Calculate simplified planetary positions (fallback method)
     * @param {string} planet - Planet name
     * @param {number} julianDay - Julian Day Number
     * @returns {number} Longitude in degrees
     */
    calculateSimplifiedPosition(planet, julianDay) {
        const daysSinceJ2000 = julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000;

        switch (planet) {
            case 'SUN':
                return normalizeAngle(280.459 + 0.98564736 * daysSinceJ2000);

            case 'MOON':
                const T = daysSinceJ2000 / ASTRO_CONSTANTS.JULIAN_CENTURY;
                return this.calculateMoonLongitude(T);

            case 'MARS':
                return normalizeAngle(355.433 + 0.524021 * daysSinceJ2000);

            case 'MERCURY':
                return normalizeAngle(252.251 + 1.602130 * daysSinceJ2000);

            case 'VENUS':
                return normalizeAngle(181.979 + 1.602130 * daysSinceJ2000);

            case 'JUPITER':
                return normalizeAngle(34.351 + 0.083129 * daysSinceJ2000);

            case 'SATURN':
                return normalizeAngle(50.078 + 0.033445 * daysSinceJ2000);

            default:
                throw new Error(`Unknown planet: ${planet}`);
        }
    }

    /**
     * Calculate lunar nodes (Rahu and Ketu)
     * @param {number} julianDay - Julian Day Number
     * @returns {Object} Rahu and Ketu positions
     */
    calculateLunarNodes(julianDay) {
        // Lunar node cycle is 18.6 years (6798.38 days)
        const nodeCycle = 6798.38;
        const daysSinceJ2000 = julianDay - ASTRO_CONSTANTS.JULIAN_DAY_J2000;

        // Rahu moves retrograde at about 19.34 degrees per year
        const rahuMovement = -0.05305 * daysSinceJ2000; // degrees per day
        const rahu = normalizeAngle(125.0 + rahuMovement); // Base position for J2000

        // Ketu is always 180 degrees opposite
        const ketu = normalizeAngle(rahu + 180);

        return { rahu, ketu };
    }

    /**
     * Calculate planetary velocities (for retrograde detection)
     * @param {string} planet - Planet name
     * @param {number} julianDay - Julian Day Number
     * @returns {number} Velocity in degrees per day
     */
    calculatePlanetVelocity(planet, julianDay) {
        // Simplified velocity calculations
        // In production, use proper derivative calculations
        const dt = 1; // 1 day
        const pos1 = this.calculateSimplifiedPosition(planet, julianDay);
        const pos2 = this.calculateSimplifiedPosition(planet, julianDay + dt);

        let velocity = pos2 - pos1;
        if (velocity > 180) velocity -= 360;
        if (velocity < -180) velocity += 360;

        return velocity;
    }

    /**
     * Check if a planet is retrograde
     * @param {string} planet - Planet name
     * @param {number} julianDay - Julian Day Number
     * @returns {boolean} True if retrograde
     */
    isPlanetRetrograde(planet, julianDay) {
        // Rahu and Ketu are always retrograde
        if (planet === 'RAHU' || planet === 'KETU') {
            return true;
        }

        const velocity = this.calculatePlanetVelocity(planet, julianDay);
        return velocity < 0;
    }
}

module.exports = PlanetaryCalculator;