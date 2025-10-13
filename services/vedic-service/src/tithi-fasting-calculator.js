/**
 * ZodiaCore - Tithi Fasting Calculator
 *
 * Calculates fasting recommendations based on tithi (lunar day) and
 * provides specific rules, duration, and rituals for each tithi.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { TITHI_FASTING_RULES } = require('./fasting-constants');

/**
 * Tithi Fasting Calculator Class
 * Provides fasting recommendations based on lunar day (tithi)
 */
class TithiFastingCalculator {
    constructor() {
        this.tithiRules = TITHI_FASTING_RULES;
    }

    /**
     * Calculate fasting recommendation for current tithi
     * @param {number} sunLongitude - Sun's longitude in degrees
     * @param {number} moonLongitude - Moon's longitude in degrees
     * @param {Date} date - Current date
     * @returns {Object} Tithi fasting recommendation
     */
    getTithiFastingRecommendation(sunLongitude, moonLongitude, date) {
        // Calculate tithi (simplified - in production use precise calculation)
        const difference = this.normalizeAngle(moonLongitude - sunLongitude);
        const tithiNumber = Math.floor(difference / 12) + 1;

        const tithiData = this.tithiRules[tithiNumber] || {
            name: 'Unknown',
            fasting: false,
            significance: 'General day'
        };

        return {
            tithi: {
                number: tithiNumber,
                name: tithiData.name,
                paksha: tithiNumber <= 15 ? 'Shukla' : 'Krishna',
                progress: (difference % 12) / 12
            },
            fastingRecommended: tithiData.fasting,
            significance: tithiData.significance,
            rules: this.getFastingRules(tithiNumber),
            duration: this.getFastingDuration(tithiNumber),
            rituals: this.getRitualsForTithi(tithiNumber, date)
        };
    }

    /**
     * Get fasting rules for specific tithi
     * @param {number} tithiNumber - Tithi number (1-15)
     * @returns {Array} Array of fasting rules
     */
    getFastingRules(tithiNumber) {
        const rules = {
            4: ['Fast until evening', 'Worship Ganesha', 'Avoid grains'],
            8: ['Durga puja', 'Stay awake night', 'Special prayers'],
            11: ['No grains', 'Devotional reading', 'Charity'],
            13: ['Oil massage', 'Shiv worship', 'Stay awake'],
            15: ['Complete fast', 'Moon worship', 'Water immersion']
        };

        return rules[tithiNumber] || ['Light fasting', 'Devotional activities'];
    }

    /**
     * Get fasting duration for specific tithi
     * @param {number} tithiNumber - Tithi number (1-15)
     * @returns {string} Fasting duration
     */
    getFastingDuration(tithiNumber) {
        const durations = {
            4: 'Until evening',
            8: '24 hours',
            11: 'Sunrise to sunrise',
            13: '24 hours',
            15: '24 hours'
        };

        return durations[tithiNumber] || 'Partial day';
    }

    /**
     * Get rituals for specific tithi
     * @param {number} tithiNumber - Tithi number (1-15)
     * @param {Date} date - Current date
     * @returns {Array} Array of rituals
     */
    getRitualsForTithi(tithiNumber, date) {
        const rituals = {
            4: ['Ganesha worship', 'Modak offering', 'Chanting Om Gam Ganapataye Namaha'],
            8: ['Durga mantra recitation', 'Kumari puja', 'Nine forms of Durga worship'],
            11: ['Hari nama sankirtana', 'Reading Bhagavad Gita', 'Feeding Brahmins'],
            13: ['Rudra abhishek', 'Shiv lingam worship', 'Bilva leaf offering'],
            15: ['Moon gazing', 'Tarun tarpan', 'Donation of white items']
        };

        return rituals[tithiNumber] || ['General prayers', 'Meditation', 'Charity'];
    }

    /**
     * Check if tithi is auspicious for fasting
     * @param {number} tithiNumber - Tithi number (1-15)
     * @returns {boolean} True if auspicious for fasting
     */
    isTithiAuspiciousForFasting(tithiNumber) {
        const auspiciousTithis = [4, 8, 11, 13, 15];
        return auspiciousTithis.includes(tithiNumber);
    }

    /**
     * Get tithi fasting intensity
     * @param {number} tithiNumber - Tithi number (1-15)
     * @returns {string} Fasting intensity level
     */
    getFastingIntensity(tithiNumber) {
        const intensities = {
            4: 'Medium',    // Chaturthi
            8: 'High',      // Ashtami
            11: 'High',     // Ekadashi
            13: 'High',     // Trayodashi
            15: 'Very High' // Purnima/Amavasya
        };

        return intensities[tithiNumber] || 'Low';
    }

    /**
     * Calculate next auspicious tithi for fasting
     * @param {Date} currentDate - Current date
     * @param {Object} location - Location coordinates
     * @returns {Object} Next auspicious tithi information
     */
    getNextAuspiciousTithi(currentDate, location) {
        // Simplified calculation - in production use precise astronomical data
        const auspiciousTithis = [4, 8, 11, 13, 15];
        let nextDate = new Date(currentDate);
        let daysToAdd = 0;

        // Find next auspicious tithi (simplified)
        while (daysToAdd < 30) { // Max 30 days look ahead
            const testDate = new Date(currentDate);
            testDate.setDate(currentDate.getDate() + daysToAdd);

            // Simplified tithi calculation (would use real astronomical data)
            const dayOfMonth = testDate.getDate();
            const tithiNumber = (dayOfMonth % 15) + 1; // Very simplified

            if (auspiciousTithis.includes(tithiNumber)) {
                return {
                    date: testDate,
                    tithiNumber: tithiNumber,
                    tithiName: this.tithiRules[tithiNumber].name,
                    daysUntil: daysToAdd,
                    fastingType: this.getFastingIntensity(tithiNumber)
                };
            }
            daysToAdd++;
        }

        return null; // No auspicious tithi found in 30 days
    }

    /**
     * Get tithi-specific mantras
     * @param {number} tithiNumber - Tithi number (1-15)
     * @returns {Array} Array of recommended mantras
     */
    getTithiMantras(tithiNumber) {
        const mantras = {
            4: ['Om Gam Ganapataye Namaha', 'Vakratundaya Hum'],
            8: ['Om Dum Durgaye Namaha', 'Jai Ambe Gauri'],
            11: ['Hare Krishna Hare Rama', 'Om Namo Bhagavate Vasudevaya'],
            13: ['Om Namah Shivaya', 'Om Trayambakam Yajamahe'],
            15: ['Om Chandraya Namaha', 'Om Shanti Shanti Shantihi']
        };

        return mantras[tithiNumber] || ['Om Shanti', 'General prayers'];
    }

    /**
     * Normalize angle to 0-360 degrees
     * @param {number} angle - Angle in degrees
     * @returns {number} Normalized angle
     */
    normalizeAngle(angle) {
        while (angle < 0) angle += 360;
        while (angle >= 360) angle -= 360;
        return angle;
    }
}

module.exports = TithiFastingCalculator;