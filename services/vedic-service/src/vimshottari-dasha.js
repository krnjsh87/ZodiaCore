/**
 * ZodiaCore - Vimshottari Dasha Calculator
 *
 * Calculates Vimshottari Dasha periods and balances for Vedic astrology.
 * Implements the 120-year cycle with planetary periods and sub-periods.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { PLANETARY_PERIODS } = require('./astro-constants');

/**
 * Vimshottari Dasha Calculator
 * Handles dasha calculations, balances, and current dasha determination
 */
class VimshottariDasha {
    constructor() {
        this.totalCycleYears = 120; // Total Vimshottari cycle
        this.dashaOrder = ['KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY'];
    }

    /**
     * Calculate dasha balance at birth
     * @param {Object} moonNakshatra - Moon's nakshatra information
     * @param {Date} birthDate - Birth date
     * @returns {Object} Dasha balance information
     */
    calculateDashaBalance(moonNakshatra, birthDate) {
        const nakshatraLord = moonNakshatra.lord;
        const degreesInNakshatra = moonNakshatra.degreesInNakshatra;
        const totalNakshatraDegrees = 13.333333; // 40 arcminutes = 13.333 degrees

        // Calculate remaining degrees in nakshatra
        const remainingDegrees = totalNakshatraDegrees - degreesInNakshatra;

        // Convert to time (1 degree = 1 day in dasha calculations)
        const remainingDays = remainingDegrees;

        // Get the period of the nakshatra lord
        const lordPeriod = PLANETARY_PERIODS[nakshatraLord];

        // Calculate balance years
        const balanceYears = (remainingDays / 360) * lordPeriod;

        return {
            lord: nakshatraLord,
            balanceYears: balanceYears,
            balanceDays: remainingDays,
            startingDasha: nakshatraLord
        };
    }

    /**
     * Generate mahadasha sequence
     * @param {Date} birthDate - Birth date
     * @param {Object} balance - Dasha balance
     * @returns {Array} Array of mahadashas
     */
    generateMahadashas(birthDate, balance) {
        const mahadashas = [];
        let currentDate = new Date(birthDate);

        // Start with the balance dasha
        if (balance.balanceYears > 0) {
            mahadashas.push({
                planet: balance.lord,
                startDate: new Date(currentDate),
                endDate: new Date(currentDate.getTime() + (balance.balanceYears * 365.25 * 24 * 60 * 60 * 1000)),
                years: balance.balanceYears,
                type: 'balance'
            });
            currentDate = mahadashas[mahadashas.length - 1].endDate;
        }

        // Generate full cycle mahadashas
        const startIndex = this.dashaOrder.indexOf(balance.lord);
        for (let i = 0; i < this.dashaOrder.length; i++) {
            const planetIndex = (startIndex + i + 1) % this.dashaOrder.length;
            const planet = this.dashaOrder[planetIndex];
            const period = PLANETARY_PERIODS[planet];

            // Skip if this was the balance dasha
            if (i === 0 && balance.balanceYears > 0) continue;

            mahadashas.push({
                planet: planet,
                startDate: new Date(currentDate),
                endDate: new Date(currentDate.getTime() + (period * 365.25 * 24 * 60 * 60 * 1000)),
                years: period,
                type: 'mahadasha'
            });
            currentDate = mahadashas[mahadashas.length - 1].endDate;
        }

        return mahadashas;
    }

    /**
     * Get current dasha for a given date
     * @param {Date} birthDate - Birth date
     * @param {Date} targetDate - Date to check
     * @param {Object} balance - Dasha balance
     * @returns {Object} Current dasha information
     */
    getCurrentDasha(birthDate, targetDate, balance) {
        const mahadashas = this.generateMahadashas(birthDate, balance);

        for (const dasha of mahadashas) {
            if (targetDate >= dasha.startDate && targetDate < dasha.endDate) {
                // Calculate progress within this dasha
                const totalDuration = dasha.endDate - dasha.startDate;
                const elapsed = targetDate - dasha.startDate;
                const progress = elapsed / totalDuration;

                return {
                    mahadasha: dasha.planet,
                    startDate: dasha.startDate,
                    endDate: dasha.endDate,
                    progress: progress,
                    remainingYears: dasha.years * (1 - progress),
                    antardasha: this.calculateAntardasha(dasha, targetDate)
                };
            }
        }

        return null; // Date is beyond the calculated period
    }

    /**
     * Calculate antardasha (sub-period) within a mahadasha
     * @param {Object} mahadasha - Mahadasha object
     * @param {Date} targetDate - Date to check
     * @returns {Object} Antardasha information
     */
    calculateAntardasha(mahadasha, targetDate) {
        const mahadashaDuration = mahadasha.years * 365.25 * 24 * 60 * 60 * 1000; // in milliseconds
        const elapsed = targetDate - mahadasha.startDate;
        const progress = elapsed / mahadashaDuration;

        // Find which antardasha period we're in
        let cumulativeProgress = 0;
        const mahadashaLord = mahadasha.planet;

        for (const antardashaLord of this.dashaOrder) {
            const antardashaPeriod = PLANETARY_PERIODS[antardashaLord];
            const antardashaPortion = antardashaPeriod / PLANETARY_PERIODS[mahadashaLord];
            const antardashaDuration = antardashaPortion * mahadashaDuration;

            if (progress <= cumulativeProgress + antardashaPortion) {
                const antardashaStart = new Date(mahadasha.startDate.getTime() + (cumulativeProgress * mahadashaDuration));
                const antardashaEnd = new Date(antardashaStart.getTime() + antardashaDuration);

                return {
                    planet: antardashaLord,
                    startDate: antardashaStart,
                    endDate: antardashaEnd,
                    progress: (progress - cumulativeProgress) / antardashaPortion
                };
            }

            cumulativeProgress += antardashaPortion;
        }

        return null;
    }

    /**
     * Get dasha effects and predictions
     * @param {string} planet - Planet name
     * @returns {Object} Dasha effects
     */
    getDashaEffects(planet) {
        // Simplified dasha effects - in production, this would be more comprehensive
        const effects = {
            SUN: {
                general: 'Leadership, authority, government matters',
                positive: 'Career advancement, recognition',
                negative: 'Health issues, conflicts with superiors',
                remedies: ['Sun worship', 'Donation of wheat', 'Wearing ruby']
            },
            MOON: {
                general: 'Emotions, mind, mother, home',
                positive: 'Mental peace, family harmony',
                negative: 'Mood swings, health issues',
                remedies: ['Moon worship', 'Donation of milk', 'Wearing pearl']
            },
            MARS: {
                general: 'Energy, courage, siblings, property',
                positive: 'Physical strength, new ventures',
                negative: 'Accidents, conflicts, surgery',
                remedies: ['Mars worship', 'Donation of red items', 'Wearing coral']
            },
            MERCURY: {
                general: 'Intelligence, communication, business',
                positive: 'Learning, writing, commerce',
                negative: 'Anxiety, speech issues',
                remedies: ['Mercury worship', 'Donation of green items', 'Wearing emerald']
            },
            JUPITER: {
                general: 'Wisdom, wealth, children, spirituality',
                positive: 'Prosperity, knowledge, marriage',
                negative: 'Overconfidence, weight gain',
                remedies: ['Jupiter worship', 'Donation of yellow items', 'Wearing yellow sapphire']
            },
            VENUS: {
                general: 'Love, beauty, luxury, spouse',
                positive: 'Relationships, arts, wealth',
                negative: 'Indulgence, health issues',
                remedies: ['Venus worship', 'Donation of white items', 'Wearing diamond']
            },
            SATURN: {
                general: 'Discipline, hard work, longevity',
                positive: 'Stability, spiritual growth',
                negative: 'Delays, obstacles, diseases',
                remedies: ['Saturn worship', 'Donation of black items', 'Wearing blue sapphire']
            },
            RAHU: {
                general: 'Ambition, foreign matters, technology',
                positive: 'Sudden gains, foreign travel',
                negative: 'Confusion, addiction, scandals',
                remedies: ['Rahu worship', 'Donation of black items', 'Wearing hessonite']
            },
            KETU: {
                general: 'Spirituality, detachment, past life karma',
                positive: 'Liberation, psychic abilities',
                negative: 'Health issues, mental confusion',
                remedies: ['Ketu worship', 'Donation of brown items', 'Wearing cat\'s eye']
            }
        };

        return effects[planet] || {
            general: 'General planetary influences',
            positive: 'Beneficial effects',
            negative: 'Challenging effects',
            remedies: ['General remedies', 'Consult astrologer']
        };
    }
}

module.exports = VimshottariDasha;