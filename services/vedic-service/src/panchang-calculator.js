/**
 * ZodiaCore - Panchang Calculator
 *
 * Calculates the five essential elements of Panchang (Tithi, Nakshatra, Yoga, Karana, Vara)
 * for Vedic astrology and Muhurat calculations.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { normalizeAngle, degToRad, radToDeg, acosDeg, sinDeg, cosDeg, tanDeg } = require('./math-utils');
const { calculateLahiriAyanamsa } = require('./astronomical-calculations');
const PlanetaryCalculator = require('./planetary-calculator');
const {
    TITHI_NAMES,
    NAKSHATRA_DATA,
    YOGA_NAMES,
    AUSPICIOUS_YOGAS,
    KARANA_NAMES,
    AUSPICIOUS_KARANAS,
    VARA_DATA
} = require('./muhurat-constants');

/**
 * Panchang Calculator Class
 * Calculates all five elements of the Vedic Panchang
 */
class PanchangCalculator {
    constructor() {
        this.planetaryCalculator = new PlanetaryCalculator();
    }

    /**
     * Calculate angular separation between two longitudes
     * @param {number} longitude1 - First longitude
     * @param {number} longitude2 - Second longitude
     * @returns {number} Angular separation in degrees
     */
    angularSeparation(longitude1, longitude2) {
        let diff = longitude1 - longitude2;
        diff = normalizeAngle(diff);
        return Math.min(diff, 360 - diff);
    }

    /**
     * Calculate complete Panchang for a given date and location
     * @param {Date} date - Gregorian date
     * @param {number} latitude - Latitude in degrees
     * @param {number} longitude - Longitude in degrees
     * @returns {Object} Complete Panchang data
     */
    async calculatePanchang(date, latitude, longitude) {
        try {
            // Calculate astronomical data
            const julianDay = this.dateToJulianDay(date);
            const tropicalPositions = this.planetaryCalculator.calculateAccuratePlanets(julianDay);
            const ayanamsa = calculateLahiriAyanamsa(date.getFullYear());
            const siderealSun = normalizeAngle(tropicalPositions.SUN - ayanamsa);
            const siderealMoon = normalizeAngle(tropicalPositions.MOON - ayanamsa);

            // Calculate sunrise/sunset
            const solarTimes = this.calculateSunriseSunset(date, latitude, longitude);

            // Calculate all Panchang elements
            const panchang = {
                date: date,
                location: { latitude, longitude },
                julianDay: julianDay,
                ayanamsa: ayanamsa,

                // Panchang elements
                tithi: this.calculateTithi(siderealSun, siderealMoon),
                vara: this.calculateVara(date),
                nakshatra: this.calculateNakshatra(siderealMoon),
                yoga: this.calculateYoga(siderealSun, siderealMoon),
                karana: this.calculateKarana(siderealSun, siderealMoon),

                // Astronomical data
                sunrise: solarTimes.sunrise,
                sunset: solarTimes.sunset,
                dayLength: solarTimes.dayLength,
                moonPhase: this.calculateLunarPhase(siderealSun, siderealMoon),

                // Additional calculations
                auspiciousPeriods: this.calculateAuspiciousPeriods(solarTimes, date),
                inauspiciousPeriods: this.calculateInauspiciousPeriods(solarTimes, date),
                festivals: this.detectFestivals(panchang),

                // Planetary data
                sunLongitude: siderealSun,
                moonLongitude: siderealMoon,
                planetaryPositions: tropicalPositions
            };

            return panchang;

        } catch (error) {
            throw new Error(`Panchang calculation failed: ${error.message}`);
        }
    }

    /**
     * Calculate Tithi (Lunar Day)
     * @param {number} sunLongitude - Sun's sidereal longitude
     * @param {number} moonLongitude - Moon's sidereal longitude
     * @returns {Object} Tithi data
     */
    calculateTithi(sunLongitude, moonLongitude) {
        const longitudeDiff = normalizeAngle(moonLongitude - sunLongitude);
        const tithiNumber = Math.floor(longitudeDiff / 12) + 1;
        const tithiProgress = (longitudeDiff % 12) / 12;

        // Determine Paksha (fortnight)
        const paksha = tithiNumber <= 15 ? 'Shukla' : 'Krishna';
        const adjustedTithi = tithiNumber > 15 ? tithiNumber - 15 : tithiNumber;

        return {
            number: tithiNumber,
            adjustedNumber: adjustedTithi,
            name: TITHI_NAMES[Math.min(adjustedTithi - 1, 14)],
            paksha: paksha,
            progress: tithiProgress,
            isAuspicious: this.isTithiAuspicious(tithiNumber, paksha),
            endTime: this.calculateTithiEndTime(sunLongitude, moonLongitude, tithiNumber)
        };
    }

    /**
     * Determine if Tithi is auspicious for general activities
     * @param {number} tithiNumber - Tithi number (1-30)
     * @param {string} paksha - Shukla or Krishna
     * @returns {boolean} True if auspicious
     */
    isTithiAuspicious(tithiNumber, paksha) {
        const auspiciousTithis = {
            Shukla: [2, 3, 5, 7, 10, 11, 13, 15], // Dwitiya, Tritiya, Panchami, etc.
            Krishna: [2, 3, 5, 7, 10, 13] // Similar but fewer
        };

        return auspiciousTithis[paksha]?.includes(tithiNumber) || false;
    }

    /**
     * Calculate Nakshatra (Lunar Mansion)
     * @param {number} moonLongitude - Moon's sidereal longitude
     * @returns {Object} Nakshatra data
     */
    calculateNakshatra(moonLongitude) {
        const nakshatraIndex = Math.floor(moonLongitude / (360 / 27));
        const degreesInNakshatra = moonLongitude % (360 / 27);
        const pada = Math.floor(degreesInNakshatra / (360 / 27 / 4)) + 1;

        const nakshatra = NAKSHATRA_DATA[nakshatraIndex];

        return {
            number: nakshatraIndex + 1,
            name: nakshatra.name,
            lord: nakshatra.lord,
            pada: pada,
            nature: nakshatra.nature,
            isAuspicious: nakshatra.auspicious,
            degreesInNakshatra: degreesInNakshatra,
            remainingDegrees: (360 / 27) - degreesInNakshatra,
            totalSpan: 360 / 27
        };
    }

    /**
     * Calculate Yoga (Luni-solar combination)
     * @param {number} sunLongitude - Sun's sidereal longitude
     * @param {number} moonLongitude - Moon's sidereal longitude
     * @returns {Object} Yoga data
     */
    calculateYoga(sunLongitude, moonLongitude) {
        const combinedLongitude = normalizeAngle(sunLongitude + moonLongitude);
        const yogaIndex = Math.floor(combinedLongitude / (360 / 27));

        return {
            number: yogaIndex + 1,
            name: YOGA_NAMES[yogaIndex],
            isAuspicious: AUSPICIOUS_YOGAS.includes(yogaIndex + 1),
            strength: this.calculateYogaStrength(yogaIndex + 1),
            longitude: combinedLongitude
        };
    }

    /**
     * Calculate Yoga strength based on traditional wisdom
     * @param {number} yogaNumber - Yoga number (1-27)
     * @returns {number} Strength score (0-1)
     */
    calculateYogaStrength(yogaNumber) {
        const strongYogas = [3, 6, 11, 12, 15, 16, 18, 21, 23, 24, 25, 26];
        const weakYogas = [1, 9, 10, 13, 14, 17, 19, 20, 22, 27];

        if (strongYogas.includes(yogaNumber)) return 0.9;
        if (weakYogas.includes(yogaNumber)) return 0.3;
        return 0.6; // Neutral
    }

    /**
     * Calculate Karana (Half of Tithi)
     * @param {number} sunLongitude - Sun's sidereal longitude
     * @param {number} moonLongitude - Moon's sidereal longitude
     * @returns {Object} Karana data
     */
    calculateKarana(sunLongitude, moonLongitude) {
        const longitudeDiff = normalizeAngle(moonLongitude - sunLongitude);
        const karanaNumber = Math.floor(longitudeDiff / 6);

        return {
            number: karanaNumber + 1,
            name: KARANA_NAMES[karanaNumber % 11],
            isAuspicious: AUSPICIOUS_KARANAS.includes(karanaNumber + 1),
            type: karanaNumber % 11 === 0 ? 'Fixed' : 'Variable',
            longitude: longitudeDiff
        };
    }

    /**
     * Calculate Vara (Weekday) with astrological significance
     * @param {Date} date - Gregorian date
     * @returns {Object} Vara data
     */
    calculateVara(date) {
        const weekdayIndex = date.getDay();
        const vara = VARA_DATA[weekdayIndex];

        return {
            number: weekdayIndex + 1,
            name: vara.sanskritName,
            englishName: vara.name,
            lord: vara.lord,
            nature: vara.nature,
            isAuspicious: vara.auspicious,
            weekdayIndex: weekdayIndex
        };
    }

    /**
     * Calculate sunrise and sunset times
     * @param {Date} date - Date for calculation
     * @param {number} latitude - Latitude in degrees
     * @param {number} longitude - Longitude in degrees
     * @returns {Object} Sunrise and sunset times in decimal hours
     */
    calculateSunriseSunset(date, latitude, longitude) {
        const julianDay = this.dateToJulianDay(date);

        // Simplified sunrise/sunset calculation
        const solarNoon = 12 - longitude / 15; // Approximate
        const dayOfYear = Math.floor(julianDay - Math.floor(julianDay / 365.25) * 365.25);
        const solarDeclination = 23.45 * sinDeg(360 * (284 + dayOfYear) / 365);

        const hourAngle = acosDeg(
            (sinDeg(-0.83) - sinDeg(latitude) * sinDeg(solarDeclination)) /
            (cosDeg(latitude) * cosDeg(solarDeclination))
        );

        const sunrise = solarNoon - hourAngle / 15;
        const sunset = solarNoon + hourAngle / 15;
        const dayLength = sunset - sunrise;

        return {
            sunrise: sunrise,
            sunset: sunset,
            dayLength: dayLength
        };
    }

    /**
     * Calculate lunar phase
     * @param {number} sunLongitude - Sun's sidereal longitude
     * @param {number} moonLongitude - Moon's sidereal longitude
     * @returns {string} Lunar phase name
     */
    calculateLunarPhase(sunLongitude, moonLongitude) {
        const phaseAngle = this.angularSeparation(moonLongitude, sunLongitude);

        if (phaseAngle < 45) return 'New Moon';
        if (phaseAngle < 90) return 'Waxing Crescent';
        if (phaseAngle < 135) return 'First Quarter';
        if (phaseAngle < 180) return 'Waxing Gibbous';
        if (phaseAngle < 225) return 'Full Moon';
        if (phaseAngle < 270) return 'Waning Gibbous';
        if (phaseAngle < 315) return 'Last Quarter';
        return 'Waning Crescent';
    }

    /**
     * Calculate auspicious periods for the day
     * @param {Object} solarTimes - Sunrise/sunset times
     * @param {Date} date - Date for calculation
     * @returns {Array} List of auspicious periods
     */
    calculateAuspiciousPeriods(solarTimes, date) {
        const periods = [];

        // Abhijit Muhurat (most auspicious)
        const abhijitStart = solarTimes.sunrise + 11.5;
        const abhijitEnd = abhijitStart + 1.5;

        periods.push({
            name: 'Abhijit Muhurat',
            type: 'Supreme',
            startTime: abhijitStart,
            endTime: abhijitEnd,
            significance: 'Most auspicious period of the day'
        });

        // Brahma Muhurat (spiritual)
        const brahmaStart = solarTimes.sunrise - 1.5;
        const brahmaEnd = solarTimes.sunrise - 0.5;

        periods.push({
            name: 'Brahma Muhurat',
            type: 'Spiritual',
            startTime: brahmaStart,
            endTime: brahmaEnd,
            significance: 'Ideal for meditation and spiritual practices'
        });

        return periods;
    }

    /**
     * Calculate inauspicious periods for the day
     * @param {Object} solarTimes - Sunrise/sunset times
     * @param {Date} date - Date for calculation
     * @returns {Array} List of inauspicious periods
     */
    calculateInauspiciousPeriods(solarTimes, date) {
        const periods = [];

        // Rahu Kaal calculation
        const rahuKaalHours = this.getRahuKaalHours(date.getDay());
        const rahuKaalStart = solarTimes.sunrise + rahuKaalHours.start;
        const rahuKaalEnd = solarTimes.sunrise + rahuKaalHours.end;

        periods.push({
            name: 'Rahu Kaal',
            type: 'Inauspicious',
            startTime: rahuKaalStart,
            endTime: rahuKaalEnd,
            significance: 'Avoid important activities'
        });

        return periods;
    }

    /**
     * Get Rahu Kaal hours for each weekday
     * @param {number} weekdayIndex - Day of week (0-6)
     * @returns {Object} Start and end hours from sunrise
     */
    getRahuKaalHours(weekdayIndex) {
        const rahuKaalData = [
            { start: 4.5, end: 6 },    // Sunday
            { start: 7.5, end: 9 },    // Monday
            { start: 3, end: 4.5 },    // Tuesday
            { start: 12, end: 13.5 },  // Wednesday
            { start: 10.5, end: 12 },  // Thursday
            { start: 13.5, end: 15 },  // Friday
            { start: 7.5, end: 9 }     // Saturday
        ];

        return rahuKaalData[weekdayIndex];
    }

    /**
     * Detect festivals for the given Panchang
     * @param {Object} panchang - Complete Panchang data
     * @returns {Array} List of detected festivals
     */
    detectFestivals(panchang) {
        const festivals = [];

        // Lunar festivals
        if (panchang.tithi.paksha === 'Krishna' && panchang.tithi.adjustedNumber === 15) {
            festivals.push({
                name: 'Diwali',
                type: 'Lunar',
                significance: 'Festival of Lights'
            });
        }

        if (panchang.tithi.paksha === 'Krishna' && panchang.tithi.adjustedNumber === 8) {
            festivals.push({
                name: 'Janmashtami',
                type: 'Lunar',
                significance: 'Lord Krishna\'s Birthday'
            });
        }

        // Add more festival detection logic as needed...

        return festivals;
    }

    /**
     * Convert Date to Julian Day
     * @param {Date} date - Gregorian date
     * @returns {number} Julian Day
     */
    dateToJulianDay(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        // Simplified Julian Day calculation
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;

        const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y +
                          Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

        const fractionalDay = (hour - 12) / 24 + minute / 1440 + second / 86400;

        return julianDay + fractionalDay;
    }

    /**
     * Calculate when current Tithi ends
     * @param {number} sunLongitude - Sun's longitude
     * @param {number} moonLongitude - Moon's longitude
     * @param {number} tithiNumber - Current tithi number
     * @returns {number} Hours until tithi ends
     */
    calculateTithiEndTime(sunLongitude, moonLongitude, tithiNumber) {
        const longitudeDiff = normalizeAngle(moonLongitude - sunLongitude);
        const degreesToNextTithi = ((tithiNumber) * 12) - longitudeDiff;

        // Moon moves ~13.18 degrees per day relative to Sun
        const moonDailyMotion = 13.18;
        const hoursToEnd = (degreesToNextTithi / moonDailyMotion) * 24;

        return Math.max(0, hoursToEnd);
    }

    /**
     * Get auspicious activities for current Panchang
     * @param {Object} panchang - Panchang data
     * @returns {Array} List of recommended activities
     */
    getAuspiciousActivities(panchang) {
        const activities = [];

        if (panchang.tithi.isAuspicious) {
            activities.push('General auspicious activities');
        }

        if (panchang.nakshatra.isAuspicious) {
            activities.push('Important ceremonies and rituals');
        }

        if (panchang.yoga.isAuspicious) {
            activities.push('Business and financial activities');
        }

        if (panchang.vara.isAuspicious) {
            activities.push('New beginnings and travel');
        }

        return activities;
    }

    /**
     * Get inauspicious activities for current Panchang
     * @param {Object} panchang - Panchang data
     * @returns {Array} List of activities to avoid
     */
    getInauspiciousActivities(panchang) {
        const activities = [];

        if (!panchang.tithi.isAuspicious) {
            activities.push('Avoid major ceremonies');
        }

        if (!panchang.nakshatra.isAuspicious) {
            activities.push('Avoid travel and new ventures');
        }

        if (!panchang.yoga.isAuspicious) {
            activities.push('Avoid business dealings');
        }

        return activities;
    }
}

module.exports = PanchangCalculator;