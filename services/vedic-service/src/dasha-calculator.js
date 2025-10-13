/**
 * ZodiaCore Dasha Calculator (ZC1.2)
 *
 * Handles dasha calculations, balances, and current dasha determination.
 * Implements caching for performance optimization.
 *
 * @version 1.2.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { ASTRO_CONSTANTS } = require('./astro-constants');
const { dashaYearsToDays } = require('./dasha-utils');
const { getDashaEffects } = require('./dasha-effects-config');

/**
 * Dasha Calculator
 * Handles dasha calculations, balances, and current dasha determination
 * Implements caching for performance optimization
 */
class DashaCalculator {
    /**
     * Initialize Dasha calculator with caching
     */
    constructor() {
        this.totalCycleYears = 120; // Total Vimshottari cycle
        this.dashaOrder = ['KETU', 'VENUS', 'SUN', 'MOON', 'MARS', 'RAHU', 'JUPITER', 'SATURN', 'MERCURY'];
        this.dashaPeriods = ASTRO_CONSTANTS.PLANETARY_PERIODS;
        // Cache for antardasha calculations to avoid repeated computations
        this.antardashaCache = new Map();
    }

    /**
     * Calculate dasha balance at birth
     * @param {Object} moonData - Moon's nakshatra information
     * @param {Date} birthDate - Birth date
     * @returns {Object} Dasha balance information
     * @throws {Error} If input validation fails
     */
    calculateDashaBalance(moonData, birthDate) {
        // Input validation
        if (!moonData || typeof moonData !== 'object') {
            throw new Error('Invalid moon data: must be an object');
        }
        if (typeof moonData.longitude !== 'number' || moonData.longitude < 0 || moonData.longitude >= 360) {
            throw new Error('Invalid moon longitude: must be a number between 0 and 360');
        }
        if (!moonData.lord || typeof moonData.lord !== 'string') {
            throw new Error('Invalid nakshatra lord: must be a non-empty string');
        }
        if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
            throw new Error('Invalid birth date: must be a valid Date object');
        }

        const nakshatraLord = moonData.lord;
        const degreesInNakshatra = moonData.degreesInNakshatra || 0;
        if (typeof degreesInNakshatra !== 'number' || degreesInNakshatra < 0 || degreesInNakshatra >= ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA) {
            throw new Error('Invalid degrees in nakshatra: must be a number between 0 and degrees per nakshatra');
        }
        const totalNakshatraDegrees = ASTRO_CONSTANTS.DEGREES_PER_NAKSHATRA;

        // Calculate remaining degrees in nakshatra
        const remainingDegrees = totalNakshatraDegrees - degreesInNakshatra;

        // Convert to time (1 degree = 1 day in dasha calculations)
        const remainingDays = remainingDegrees;

        // Get the period of the nakshatra lord
        const lordPeriod = this.dashaPeriods[nakshatraLord];
        if (!lordPeriod || lordPeriod <= 0) {
            throw new Error(`Invalid planetary period for ${nakshatraLord}`);
        }

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
     * @throws {Error} If input validation fails
     */
    generateMahadashas(birthDate, balance) {
        // Input validation
        if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
            throw new Error('Invalid birth date: must be a valid Date object');
        }
        if (!balance || typeof balance !== 'object') {
            throw new Error('Invalid balance: must be an object');
        }
        if (typeof balance.balanceYears !== 'number' || balance.balanceYears < 0) {
            throw new Error('Invalid balance years: must be a non-negative number');
        }
        if (typeof balance.balanceDays !== 'number' || balance.balanceDays < 0) {
            throw new Error('Invalid balance days: must be a non-negative number');
        }
        if (!balance.lord || typeof balance.lord !== 'string') {
            throw new Error('Invalid balance lord: must be a non-empty string');
        }

        const mahadashas = [];
        let currentDate = new Date(birthDate);

        // Start with the balance dasha
        if (balance.balanceYears > 0) {
            // Use millisecond-based arithmetic for precision
            const endDate = new Date(currentDate.getTime() + balance.balanceDays * 24 * 60 * 60 * 1000);

            mahadashas.push({
                planet: balance.lord,
                startDate: new Date(currentDate),
                endDate: endDate,
                years: balance.balanceYears,
                type: 'balance'
            });
            currentDate = new Date(endDate);
        }

        // Generate full cycle mahadashas
        const startIndex = this.dashaOrder.indexOf(balance.lord);
        if (startIndex === -1) {
            throw new Error(`Balance lord ${balance.lord} not found in dasha order`);
        }

        for (let i = 0; i < this.dashaOrder.length; i++) {
            const planetIndex = (startIndex + i + 1) % this.dashaOrder.length;
            const planet = this.dashaOrder[planetIndex];
            const period = this.dashaPeriods[planet];

            // Skip if this was the balance dasha
            if (i === 0 && balance.balanceYears > 0) continue;

            // Use millisecond-based arithmetic for precision
            const periodDays = dashaYearsToDays(period);
            const endDate = new Date(currentDate.getTime() + periodDays * 24 * 60 * 60 * 1000);

            mahadashas.push({
                planet: planet,
                startDate: new Date(currentDate),
                endDate: endDate,
                years: period,
                type: 'mahadasha'
            });
            currentDate = new Date(endDate);
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
     * @throws {Error} If input validation fails
     */
    calculateAntardasha(mahadasha, targetDate) {
        // Input validation
        if (!mahadasha || typeof mahadasha !== 'object') {
            throw new Error('Invalid mahadasha: must be an object');
        }
        if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
            throw new Error('Invalid target date: must be a valid Date object');
        }
        if (!(mahadasha.startDate instanceof Date) || isNaN(mahadasha.startDate.getTime())) {
            throw new Error('Invalid mahadasha start date');
        }
        if (typeof mahadasha.years !== 'number' || mahadasha.years <= 0) {
            throw new Error('Invalid mahadasha years: must be a positive number');
        }
        if (!mahadasha.planet || typeof mahadasha.planet !== 'string') {
            throw new Error('Invalid mahadasha planet: must be a non-empty string');
        }

        // Check cache first
        const cacheKey = `${mahadasha.planet}-${targetDate.getTime()}`;
        if (this.antardashaCache.has(cacheKey)) {
            return this.antardashaCache.get(cacheKey);
        }

        const mahadashaDuration = mahadasha.years * 365.25 * 24 * 60 * 60 * 1000;
        const elapsed = targetDate - mahadasha.startDate;
        const progress = elapsed / mahadashaDuration;

        // Find which antardasha period we're in
        let cumulativeProgress = 0;
        const mahadashaLord = mahadasha.planet;

        for (let i = 0; i < this.dashaOrder.length; i++) {
            const antardashaLord = this.dashaOrder[i];
            const antardashaPeriod = this.dashaPeriods[antardashaLord];
            if (!antardashaPeriod || antardashaPeriod <= 0) {
                throw new Error(`Invalid antardasha period for ${antardashaLord}`);
            }

            // Division by zero protection
            if (this.dashaPeriods[mahadashaLord] === 0) {
                throw new Error(`Division by zero: Mahadasha period for ${mahadashaLord} is zero`);
            }

            const antardashaPortion = antardashaPeriod / this.dashaPeriods[mahadashaLord];
            const antardashaDuration = antardashaPortion * mahadashaDuration;

            if (progress <= cumulativeProgress + antardashaPortion) {
                const antardashaStart = new Date(mahadasha.startDate.getTime() + (cumulativeProgress * mahadashaDuration));
                const antardashaEnd = new Date(antardashaStart.getTime() + antardashaDuration);

                const result = {
                    planet: antardashaLord,
                    startDate: antardashaStart,
                    endDate: antardashaEnd,
                    progress: (progress - cumulativeProgress) / antardashaPortion
                };

                // Cache the result
                this.antardashaCache.set(cacheKey, result);
                return result;
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
        return getDashaEffects(planet);
    }
}

module.exports = DashaCalculator;