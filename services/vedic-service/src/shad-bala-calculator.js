/**
 * ZodiaCore - Shad Bala Calculator
 *
 * Complete Shad Bala calculation system for Vedic astrology.
 * Implements the six-fold strength calculation (Shad Bala) for planetary analysis.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { SHAD_BALA_WEIGHTS, NAISARGIKA_BALAS, DIG_BALA_TABLE, INTERPRETATION_CONSTANTS } = require('./deep-horoscope-constants');
const { PLANETS } = require('./astro-constants');

/**
 * Complete Shad Bala calculation system
 */
class ShadBalaCalculator {
    constructor(birthChart) {
        this.birthChart = birthChart;
    }

    /**
     * Calculate complete Shad Bala for a planet
     * @param {string} planet - Planet name (SUN, MOON, etc.)
     * @returns {Object} Complete Shad Bala analysis
     */
    calculateShadBala(planet) {
        try {
            const sthanBala = this.calculateSthanBala(planet);
            const digBala = this.calculateDigBala(planet);
            const kalaBala = this.calculateKalaBala(planet);
            const chestaBala = this.calculateChestaBala(planet);
            const naisargikaBala = this.getNaisargikaBala(planet);
            const drigBala = this.calculateDrigBala(planet);

            const totalBala = (
                sthanBala * SHAD_BALA_WEIGHTS.sthanBala +
                digBala * SHAD_BALA_WEIGHTS.digBala +
                kalaBala * SHAD_BALA_WEIGHTS.kalaBala +
                chestaBala * SHAD_BALA_WEIGHTS.chestaBala +
                naisargikaBala * SHAD_BALA_WEIGHTS.naisargikaBala +
                drigBala * SHAD_BALA_WEIGHTS.drigBala
            );

            return {
                total: totalBala,
                components: {
                    sthanBala,
                    digBala,
                    kalaBala,
                    chestaBala,
                    naisargikaBala,
                    drigBala
                },
                strength: this.getStrengthLevel(totalBala),
                interpretation: this.interpretBalaStrength(planet, totalBala)
            };
        } catch (error) {
            throw new Error(`Shad Bala calculation failed for ${planet}: ${error.message}`);
        }
    }

    /**
     * Calculate Sthan Bala (positional strength)
     * @param {string} planet - Planet name
     * @returns {number} Sthan Bala score (0-165)
     */
    calculateSthanBala(planet) {
        let sthanBala = 0;
        const planetData = this.birthChart.planets[planet];

        if (!planetData) return 0;

        // Uchcha Bala (exaltation)
        if (this.isExalted(planet, planetData.sign)) {
            sthanBala += 60;
        } else if (this.isDebilitated(planet, planetData.sign)) {
            sthanBala += 0;
        } else {
            sthanBala += 30; // Neutral
        }

        // Own sign Bala
        if (this.isInOwnSign(planet, planetData.sign)) {
            sthanBala += 60;
        } else if (this.isInFriendlySign(planet, planetData.sign)) {
            sthanBala += 30;
        } else if (this.isInEnemySign(planet, planetData.sign)) {
            sthanBala += 15;
        }

        // Moolatrikona Bala
        if (this.isInMoolatrikona(planet, planetData.sign, planetData.degree)) {
            sthanBala += 45;
        }

        return Math.min(sthanBala, 165); // Maximum 165 units
    }

    /**
     * Calculate Dig Bala (house strength)
     * @param {string} planet - Planet name
     * @returns {number} Dig Bala score
     */
    calculateDigBala(planet) {
        const house = this.birthChart.planets[planet]?.house;
        return DIG_BALA_TABLE[house] || 0;
    }

    /**
     * Calculate Kala Bala (temporal strength)
     * @param {string} planet - Planet name
     * @returns {number} Kala Bala score (0-135)
     */
    calculateKalaBala(planet) {
        let kalaBala = 0;
        const planetData = this.birthChart.planets[planet];

        if (!planetData) return 0;

        // Nakshatra Bala
        const nakshatraLord = planetData.nakshatra?.lord;
        if (nakshatraLord === planet) {
            kalaBala += 60;
        }

        // Day Bala (simplified - would need birth date)
        const dayLord = this.getWeekdayLord();
        if (dayLord === planet) {
            kalaBala += 45;
        }

        // Tithi Bala (simplified)
        const tithi = this.birthChart.moonDetails?.tithi?.number || 1;
        if (this.isBeneficTithi(tithi)) {
            kalaBala += 30;
        }

        return Math.min(kalaBala, 135);
    }

    /**
     * Calculate Chesta Bala (motivational strength)
     * @param {string} planet - Planet name
     * @returns {number} Chesta Bala score
     */
    calculateChestaBala(planet) {
        // Simplified Chesta Bala based on aspects and conjunctions
        let chestaBala = 30; // Base value

        const planetData = this.birthChart.planets[planet];
        if (!planetData) return chestaBala;

        // Benefic aspects increase Chesta Bala
        const beneficAspects = this.getBeneficAspects(planet);
        chestaBala += beneficAspects.length * 15;

        // Malefic aspects decrease Chesta Bala
        const maleficAspects = this.getMaleficAspects(planet);
        chestaBala -= maleficAspects.length * 10;

        return Math.max(0, Math.min(chestaBala, 60));
    }

    /**
     * Get Naisargika Bala (natural strength)
     * @param {string} planet - Planet name
     * @returns {number} Naisargika Bala score
     */
    getNaisargikaBala(planet) {
        return NAISARGIKA_BALAS[planet] || 0;
    }

    /**
     * Calculate Drig Bala (aspect strength)
     * @param {string} planet - Planet name
     * @returns {number} Drig Bala score
     */
    calculateDrigBala(planet) {
        // Simplified Drig Bala based on aspects received
        let drigBala = 0;

        const aspects = this.getAllAspects(planet);
        for (const aspect of aspects) {
            if (this.isBeneficPlanet(aspect.planet)) {
                drigBala += 10;
            } else {
                drigBala -= 5;
            }
        }

        return Math.max(0, Math.min(drigBala, 60));
    }

    /**
     * Get strength level based on total Shad Bala
     * @param {number} totalBala - Total Shad Bala score
     * @returns {string} Strength level
     */
    getStrengthLevel(totalBala) {
        const levels = INTERPRETATION_CONSTANTS.STRENGTH_LEVELS;

        if (totalBala >= levels.EXCELLENT.min) return 'EXCELLENT';
        if (totalBala >= levels.VERY_GOOD.min) return 'VERY_GOOD';
        if (totalBala >= levels.GOOD.min) return 'GOOD';
        if (totalBala >= levels.MODERATE.min) return 'MODERATE';
        if (totalBala >= levels.WEAK.min) return 'WEAK';
        return 'VERY_WEAK';
    }

    /**
     * Interpret planetary strength
     * @param {string} planet - Planet name
     * @param {number} totalBala - Total Shad Bala score
     * @returns {string} Interpretation text
     */
    interpretBalaStrength(planet, totalBala) {
        const strength = this.getStrengthLevel(totalBala);
        const interpretations = {
            EXCELLENT: `${planet} is extremely strong and will give excellent results in its areas of influence.`,
            VERY_GOOD: `${planet} is very strong and will provide good results with some challenges.`,
            GOOD: `${planet} has moderate strength and will give mixed results.`,
            MODERATE: `${planet} is weak and may cause difficulties in its areas of influence.`,
            WEAK: `${planet} is very weak and requires strengthening through remedies.`,
            VERY_WEAK: `${planet} is extremely weak and may cause significant problems.`
        };

        return interpretations[strength] || 'Strength analysis unavailable.';
    }

    // Helper methods for dignity checks

    isExalted(planet, sign) {
        const exaltations = {
            SUN: 0,    // Aries
            MOON: 1,   // Taurus
            MARS: 9,   // Capricorn
            MERCURY: 5, // Virgo
            JUPITER: 3, // Cancer
            VENUS: 11,  // Pisces
            SATURN: 6   // Libra
        };
        return exaltations[planet] === sign;
    }

    isDebilitated(planet, sign) {
        const debilitations = {
            SUN: 6,    // Libra
            MOON: 7,   // Scorpio
            MARS: 3,   // Cancer
            MERCURY: 11, // Pisces
            JUPITER: 9,  // Capricorn
            VENUS: 5,    // Virgo
            SATURN: 0    // Aries
        };
        return debilitations[planet] === sign;
    }

    isInOwnSign(planet, sign) {
        const ownSigns = {
            SUN: [4],       // Leo
            MOON: [3],      // Cancer
            MARS: [0, 7],   // Aries, Scorpio
            MERCURY: [2, 5], // Gemini, Virgo
            JUPITER: [8, 11], // Sagittarius, Pisces
            VENUS: [1, 6],   // Taurus, Libra
            SATURN: [9, 10]  // Capricorn, Aquarius
        };
        return (ownSigns[planet] || []).includes(sign);
    }

    isInFriendlySign(planet, sign) {
        // Simplified - would need full friendship tables
        return !this.isInOwnSign(planet, sign) && !this.isInEnemySign(planet, sign);
    }

    isInEnemySign(planet, sign) {
        const enemySigns = {
            SUN: [6],       // Libra
            MOON: [7],      // Scorpio
            MARS: [3, 6],   // Cancer, Libra
            MERCURY: [],    // Mercury is neutral
            JUPITER: [9],   // Capricorn
            VENUS: [0, 7],  // Aries, Scorpio
            SATURN: [3, 4]  // Cancer, Leo
        };
        return (enemySigns[planet] || []).includes(sign);
    }

    isInMoolatrikona(planet, sign, degree) {
        const moolatrikona = {
            SUN: { sign: 4, start: 0, end: 20 },      // Leo 0-20°
            MOON: { sign: 1, start: 4, end: 30 },     // Taurus 4-30°
            MARS: { sign: 0, start: 0, end: 12 },     // Aries 0-12°
            MERCURY: { sign: 5, start: 16, end: 20 }, // Virgo 16-20°
            JUPITER: { sign: 8, start: 0, end: 13 },  // Sagittarius 0-13°
            VENUS: { sign: 6, start: 0, end: 27 },    // Libra 0-27°
            SATURN: { sign: 9, start: 0, end: 20 }    // Capricorn 0-20°
        };

        const range = moolatrikona[planet];
        if (!range) return false;

        return sign === range.sign && degree >= range.start && degree <= range.end;
    }

    getWeekdayLord() {
        // Simplified - would need actual birth date
        return 'SUN'; // Default to Sunday
    }

    isBeneficTithi(tithi) {
        // Benefic tithis: 2, 5, 7, 10, 11, 13, 15
        const beneficTithis = [2, 5, 7, 10, 11, 13, 15];
        return beneficTithis.includes(tithi);
    }

    getBeneficAspects(planet) {
        // Simplified aspect analysis
        return this.getAllAspects(planet).filter(aspect =>
            this.isBeneficPlanet(aspect.planet)
        );
    }

    getMaleficAspects(planet) {
        return this.getAllAspects(planet).filter(aspect =>
            !this.isBeneficPlanet(aspect.planet)
        );
    }

    getAllAspects(planet) {
        // Simplified - would need full aspect calculation
        const aspects = [];
        const planetData = this.birthChart.planets[planet];

        if (!planetData) return aspects;

        for (const otherPlanet of PLANETS) {
            if (otherPlanet === planet) continue;

            const otherData = this.birthChart.planets[otherPlanet];
            if (!otherData) continue;

            // Check for conjunction (0° aspect)
            if (Math.abs(planetData.longitude - otherData.longitude) < 10) {
                aspects.push({ planet: otherPlanet, aspect: 0 });
            }
        }

        return aspects;
    }

    isBeneficPlanet(planet) {
        const benefics = ['JUPITER', 'VENUS', 'MERCURY', 'MOON'];
        return benefics.includes(planet);
    }
}

module.exports = ShadBalaCalculator;