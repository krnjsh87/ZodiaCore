/**
 * ZodiaCore - Muhurat Calculator
 *
 * Calculates the 30 Muhurats of the day and their auspiciousness for various activities.
 * Implements traditional Vedic timing calculations based on sunrise and planetary positions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { MUHURAT_CONSTANTS, MUHURAT_NAMES, MUHURAT_RULING_PLANETS, AUSPICIOUS_MUHURATS } = require('./muhurat-constants');

/**
 * Muhurat Calculator Class
 * Handles calculation of daily Muhurats and their properties
 */
class MuhuratCalculator {
    constructor() {
        // Muhurat duration in milliseconds
        this.muhuratDurationMs = MUHURAT_CONSTANTS.MUHURAT_DURATION_MINUTES * 60 * 1000;
    }

    /**
     * Calculate all 30 Muhurats for a given day
     * @param {Date} sunrise - Sunrise time
     * @param {Date} date - Date for calculation
     * @returns {Array} Array of Muhurat objects
     */
    calculateDailyMuhurats(sunrise, date) {
        const muhurats = [];

        for (let i = 0; i < MUHURAT_CONSTANTS.MUHURATS_PER_DAY; i++) {
            const muhuratStart = new Date(sunrise.getTime() + (i * this.muhuratDurationMs));
            const muhuratEnd = new Date(muhuratStart.getTime() + this.muhuratDurationMs);

            const muhuratNumber = i + 1;
            const muhurat = {
                number: muhuratNumber,
                name: MUHURAT_NAMES[i],
                startTime: muhuratStart,
                endTime: muhuratEnd,
                duration: MUHURAT_CONSTANTS.MUHURAT_DURATION_MINUTES,
                isAuspicious: AUSPICIOUS_MUHURATS.includes(muhuratNumber),
                rulingPlanet: this.getRulingPlanet(muhuratNumber),
                quality: this.getMuhuratQuality(muhuratNumber),
                suitableActivities: this.getSuitableActivities(muhuratNumber),
                unsuitableActivities: this.getUnsuitableActivities(muhuratNumber)
            };

            muhurats.push(muhurat);
        }

        return muhurats;
    }

    /**
     * Get the ruling planet for a Muhurat
     * @param {number} muhuratNumber - Muhurat number (1-30)
     * @returns {string} Ruling planet name
     */
    getRulingPlanet(muhuratNumber) {
        const planetIndex = (muhuratNumber - 1) % 7;
        return MUHURAT_RULING_PLANETS[planetIndex];
    }

    /**
     * Get the quality/strength of a Muhurat
     * @param {number} muhuratNumber - Muhurat number (1-30)
     * @returns {string} Quality description
     */
    getMuhuratQuality(muhuratNumber) {
        if (AUSPICIOUS_MUHURATS.includes(muhuratNumber)) {
            return 'Auspicious';
        }

        // Special Muhurats
        const specialMuhurats = {
            1: 'Neutral', // Rudra - mixed
            2: 'Inauspicious', // Ahi - generally avoided
            24: 'Neutral', // Soma - medical activities
            25: 'Inauspicious', // Rakshasa - avoided
            26: 'Auspicious', // Gandharva - arts and music
            27: 'Auspicious', // Aditi - general auspicious
            28: 'Auspicious', // Vishnu - very auspicious
            29: 'Auspicious', // Dyumadgadyuti - very auspicious
            30: 'Supreme' // Brahma - most auspicious
        };

        return specialMuhurats[muhuratNumber] || 'Neutral';
    }

    /**
     * Get suitable activities for a Muhurat
     * @param {number} muhuratNumber - Muhurat number (1-30)
     * @returns {Array} List of suitable activities
     */
    getSuitableActivities(muhuratNumber) {
        const activityMap = {
            1: ['Spiritual practices', 'Meditation'], // Rudra
            2: ['Agriculture', 'Planting'], // Ahi
            3: ['Marriage', 'Ceremonies'], // Mitra
            4: ['Ancestral rites', 'Pitri ceremonies'], // Pitri
            5: ['Wealth accumulation', 'Financial activities'], // Vasu
            6: ['House construction', 'Property matters'], // Varaha
            7: ['Worship', 'Religious activities'], // Vishvedeva
            8: ['Legal matters', 'Court activities'], // Vidhi
            9: ['Marriage ceremonies', 'Festivals'], // Sutamukhi
            10: ['Worship', 'Puja ceremonies'], // Puruhuta
            11: ['Travel', 'Journey'], // Vahini
            12: ['Learning', 'Education'], // Naktanakara
            13: ['Water-related activities', 'Bathing'], // Varuna
            14: ['Marriage', 'Alliances'], // Aryaman
            15: ['Wealth', 'Prosperity activities'], // Bhaga
            16: ['Worship', 'Temple visits'], // Girisa
            17: ['All activities', 'General auspicious'], // Ajapada
            18: ['Spiritual practices', 'Meditation'], // Ahirbudhnya
            19: ['Agriculture', 'Farming'], // Pushya
            20: ['All activities', 'General'], // Ashvini
            21: ['Funeral rites', 'Last rites'], // Yama
            22: ['Remedial measures', 'Prayers'], // Agastya
            23: ['Drinking', 'Social activities'], // Varuni
            24: ['Medical treatment', 'Healing'], // Soma
            25: ['Secret activities', 'Espionage'], // Rakshasa
            26: ['Arts', 'Music', 'Entertainment'], // Gandharva
            27: ['General activities', 'Daily routines'], // Aditi
            28: ['All auspicious activities', 'Ceremonies'], // Vishnu
            29: ['Royal activities', 'Important matters'], // Dyumadgadyuti
            30: ['All activities', 'Supreme auspicious'] // Brahma
        };

        return activityMap[muhuratNumber] || ['General activities'];
    }

    /**
     * Get unsuitable activities for a Muhurat
     * @param {number} muhuratNumber - Muhurat number (1-30)
     * @returns {Array} List of unsuitable activities
     */
    getUnsuitableActivities(muhuratNumber) {
        const unsuitableMap = {
            2: ['Marriage', 'Important ceremonies'], // Ahi
            21: ['Marriage', 'New beginnings'], // Yama
            25: ['Marriage', 'Ceremonies', 'New ventures'], // Rakshasa
            1: ['Marriage', 'Business'], // Rudra (mixed)
            4: ['Marriage', 'Celebrations'], // Pitri
            22: ['Important decisions'], // Agastya
            23: ['Serious matters', 'Business'] // Varuni
        };

        return unsuitableMap[muhuratNumber] || [];
    }

    /**
     * Identify auspicious periods in the day
     * @param {Date} date - Date for calculation
     * @param {Date} sunrise - Sunrise time
     * @param {Object} planetaryPositions - Current planetary positions
     * @returns {Array} Array of auspicious period objects
     */
    identifyAuspiciousPeriods(date, sunrise, planetaryPositions) {
        const periods = [];

        // Abhijit Muhurat (most auspicious - around noon)
        const abhijitStart = new Date(sunrise.getTime() + (MUHURAT_CONSTANTS.ABHIJIT_MUHURAT_START * 60 * 60 * 1000));
        const abhijitEnd = new Date(abhijitStart.getTime() + (MUHURAT_CONSTANTS.ABHIJIT_MUHURAT_DURATION * 60 * 60 * 1000));

        periods.push({
            name: 'Abhijit Muhurat',
            type: 'Supreme',
            startTime: abhijitStart,
            endTime: abhijitEnd,
            significance: 'Most auspicious period of the day for all activities',
            duration: MUHURAT_CONSTANTS.ABHIJIT_MUHURAT_DURATION,
            rulingPlanet: 'SUN'
        });

        // Brahma Muhurat (spiritual activities - pre-dawn)
        const brahmaStart = new Date(sunrise.getTime() - (1.5 * 60 * 60 * 1000));
        const brahmaEnd = sunrise;

        periods.push({
            name: 'Brahma Muhurat',
            type: 'Spiritual',
            startTime: brahmaStart,
            endTime: brahmaEnd,
            significance: 'Ideal for meditation and spiritual practices',
            duration: 1.5,
            rulingPlanet: 'BRAHMA'
        });

        // Godhuli Muhurat (evening - sunset)
        const godhuliStart = new Date(sunrise.getTime() + (12 * 60 * 60 * 1000)); // Approximate sunset
        const godhuliEnd = new Date(godhuliStart.getTime() + (0.5 * 60 * 60 * 1000));

        periods.push({
            name: 'Godhuli Muhurat',
            type: 'Spiritual',
            startTime: godhuliStart,
            endTime: godhuliEnd,
            significance: 'Auspicious for evening prayers and worship',
            duration: 0.5,
            rulingPlanet: 'SUN'
        });

        return periods;
    }

    /**
     * Calculate Rahu Kaal for the day
     * @param {Date} date - Date for calculation
     * @returns {Object} Rahu Kaal period
     */
    calculateRahuKaal(date) {
        const weekday = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const { RAHU_KAAL_HOURS } = require('./muhurat-constants');

        const [startHour, endHour] = RAHU_KAAL_HOURS[weekday];

        // Assume sunrise at 6 AM for calculation (should be passed as parameter in production)
        const sunrise = new Date(date);
        sunrise.setHours(6, 0, 0, 0);

        const rahuKaalStart = new Date(sunrise.getTime() + (startHour * 60 * 60 * 1000));
        const rahuKaalEnd = new Date(sunrise.getTime() + (endHour * 60 * 60 * 1000));

        return {
            name: 'Rahu Kaal',
            type: 'Inauspicious',
            startTime: rahuKaalStart,
            endTime: rahuKaalEnd,
            significance: 'Inauspicious period - avoid important activities',
            duration: endHour - startHour,
            rulingPlanet: 'RAHU'
        };
    }

    /**
     * Find the best Muhurat for a specific activity
     * @param {Array} muhurats - Array of daily Muhurats
     * @param {string} activityType - Type of activity
     * @returns {Object} Best Muhurat for the activity
     */
    findBestMuhuratForActivity(muhurats, activityType) {
        const activityPreferences = this.getActivityMuhuratPreferences(activityType);

        let bestMuhurat = null;
        let bestScore = 0;

        for (const muhurat of muhurats) {
            const score = this.scoreMuhuratForActivity(muhurat, activityPreferences);

            if (score > bestScore) {
                bestScore = score;
                bestMuhurat = muhurat;
            }
        }

        return bestMuhurat;
    }

    /**
     * Get Muhurat preferences for different activities
     * @param {string} activityType - Type of activity
     * @returns {Object} Activity preferences
     */
    getActivityMuhuratPreferences(activityType) {
        const preferences = {
            marriage: {
                preferredMuhurats: [3, 6, 7, 8, 12, 17, 19, 21, 23, 26, 27, 28, 29, 30],
                preferredPlanets: ['VENUS', 'JUPITER', 'MOON'],
                avoidMuhurats: [2, 25]
            },
            business: {
                preferredMuhurats: [6, 7, 8, 12, 17, 19, 23, 26, 27, 28, 29, 30],
                preferredPlanets: ['MERCURY', 'JUPITER', 'SUN'],
                avoidMuhurats: [2, 21, 25]
            },
            travel: {
                preferredMuhurats: [3, 6, 7, 11, 12, 17, 19, 26, 27, 28, 29, 30],
                preferredPlanets: ['MOON', 'MARS', 'MERCURY'],
                avoidMuhurats: [2, 25]
            },
            education: {
                preferredMuhurats: [6, 7, 8, 12, 17, 19, 26, 27, 28, 29, 30],
                preferredPlanets: ['JUPITER', 'MERCURY', 'VENUS'],
                avoidMuhurats: [2, 21, 25]
            },
            medical: {
                preferredMuhurats: [6, 7, 12, 17, 19, 24, 26, 27, 28, 29, 30],
                preferredPlanets: ['MOON', 'JUPITER', 'VENUS'],
                avoidMuhurats: [2, 21, 25]
            },
            general: {
                preferredMuhurats: [6, 7, 8, 12, 17, 19, 26, 27, 28, 29, 30],
                preferredPlanets: ['JUPITER', 'VENUS', 'MERCURY'],
                avoidMuhurats: [2, 25]
            }
        };

        return preferences[activityType] || preferences.general;
    }

    /**
     * Score a Muhurat for a specific activity
     * @param {Object} muhurat - Muhurat object
     * @param {Object} preferences - Activity preferences
     * @returns {number} Score (0-1)
     */
    scoreMuhuratForActivity(muhurat, preferences) {
        let score = 0;

        // Preferred Muhurats
        if (preferences.preferredMuhurats.includes(muhurat.number)) {
            score += 0.6;
        }

        // Preferred Planets
        if (preferences.preferredPlanets.includes(muhurat.rulingPlanet)) {
            score += 0.3;
        }

        // Avoid Muhurats
        if (preferences.avoidMuhurats.includes(muhurat.number)) {
            score -= 0.5;
        }

        // General auspiciousness
        if (muhurat.isAuspicious) {
            score += 0.1;
        }

        return Math.max(0, Math.min(1, score));
    }

    /**
     * Convert time to Ghati and Pala
     * @param {number} decimalHours - Time in decimal hours from sunrise
     * @returns {Object} Ghati and Pala
     */
    hoursToGhatiPala(decimalHours) {
        const totalGhatis = decimalHours * (MUHURAT_CONSTANTS.GHATI_PER_DAY / 24);
        const ghatis = Math.floor(totalGhatis);
        const remainingGhatis = totalGhatis - ghatis;
        const palas = Math.floor(remainingGhatis * MUHURAT_CONSTANTS.PALA_PER_GHATI);

        return {
            ghatis: ghatis,
            palas: palas,
            totalGhatis: totalGhatis
        };
    }

    /**
     * Calculate Nazhika and Vinazhika
     * @param {Date} time - Time to calculate
     * @param {Date} sunrise - Sunrise time
     * @returns {Object} Nazhika and Vinazhika
     */
    calculateNazhika(time, sunrise) {
        const timeSinceSunrise = (time - sunrise) / (1000 * 60 * 60); // Hours
        const nazhika = Math.floor(timeSinceSunrise * (MUHURAT_CONSTANTS.NAZHIKA_PER_DAY / 24));
        const vinazhika = Math.floor(
            (timeSinceSunrise * (MUHURAT_CONSTANTS.NAZHIKA_PER_DAY / 24) - nazhika) *
            MUHURAT_CONSTANTS.VINAZHIKA_PER_NAZHIKA
        );

        return {
            nazhika: nazhika,
            vinazhika: vinazhika
        };
    }
}

module.exports = MuhuratCalculator;