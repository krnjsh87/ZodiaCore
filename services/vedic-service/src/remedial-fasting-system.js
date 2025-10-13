/**
 * ZodiaCore - Remedial Fasting System
 *
 * Analyzes birth charts for dosha conditions and provides remedial
 * fasting recommendations for karmic balance and planetary pacification.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { DOSHA_REMEDIES } = require('./fasting-constants');

/**
 * Remedial Fasting System Class
 * Provides fasting remedies for various astrological doshas
 */
class RemedialFastingSystem {
    constructor() {
        this.doshaRemedies = DOSHA_REMEDIES;
    }

    /**
     * Analyze birth chart for remedial fasting needs
     * @param {Object} birthChart - Birth chart data
     * @returns {Array} Array of remedial fasting recommendations
     */
    analyzeRemedialNeeds(birthChart) {
        const remedies = [];

        // Check for Pitru Dosha
        if (this.checkPitruDosha(birthChart)) {
            remedies.push({
                ...this.doshaRemedies.PITRU_DOSHA,
                detected: true,
                severity: this.getPitruDoshaSeverity(birthChart)
            });
        }

        // Check for Kemadruma Yoga
        if (this.checkKemadrumaYoga(birthChart)) {
            remedies.push({
                ...this.doshaRemedies.KEMADRUMA_YOGA,
                detected: true,
                severity: this.getKemadrumaSeverity(birthChart)
            });
        }

        // Check for Mangal Dosha
        if (this.checkMangalDosha(birthChart)) {
            remedies.push({
                ...this.doshaRemedies.MANGAL_DOSHA,
                detected: true,
                severity: this.getMangalDoshaSeverity(birthChart)
            });
        }

        // Check for Kalasarp Dosha
        if (this.checkKalasarpDosha(birthChart)) {
            remedies.push({
                ...this.doshaRemedies.KALASARP_DOSHA,
                detected: true,
                severity: this.getKalasarpSeverity(birthChart)
            });
        }

        // Check for other doshas
        const otherDoshas = this.checkOtherDoshas(birthChart);
        remedies.push(...otherDoshas);

        return remedies;
    }

    /**
     * Check for Pitru Dosha (Ancestral displeasure)
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if Pitru Dosha is present
     */
    checkPitruDosha(birthChart) {
        if (!birthChart.planets) return false;

        const sunHouse = birthChart.planets.SUN?.house;
        const moonHouse = birthChart.planets.MOON?.house;
        const saturnHouse = birthChart.planets.SATURN?.house;

        // Pitru Dosha indicators:
        // Sun or Moon in 9th house (ancestral house)
        // Saturn in 9th house
        // Sun and Saturn in conjunction
        // Moon and Saturn in conjunction

        const ancestralIndicators = [
            sunHouse === 9,
            moonHouse === 9,
            saturnHouse === 9,
            this.arePlanetsConjunct('SUN', 'SATURN', birthChart),
            this.arePlanetsConjunct('MOON', 'SATURN', birthChart)
        ];

        return ancestralIndicators.some(indicator => indicator);
    }

    /**
     * Check for Kemadruma Yoga (Moon without planetary support)
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if Kemadruma Yoga is present
     */
    checkKemadrumaYoga(birthChart) {
        if (!birthChart.planets) return false;

        const moonHouse = birthChart.planets.MOON?.house;
        if (!moonHouse) return false;

        let hasSupport = false;

        // Check if any planet is in the same house as Moon
        for (const planetName in birthChart.planets) {
            if (planetName !== 'MOON') {
                const planet = birthChart.planets[planetName];
                if (planet.house === moonHouse) {
                    hasSupport = true;
                    break;
                }
            }
        }

        // Also check if Moon has aspects from benefics
        if (!hasSupport) {
            hasSupport = this.checkMoonAspects(birthChart);
        }

        return !hasSupport;
    }

    /**
     * Check for Mangal Dosha (Mars affliction)
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if Mangal Dosha is present
     */
    checkMangalDosha(birthChart) {
        if (!birthChart.planets) return false;

        const marsHouse = birthChart.planets.MARS?.house;
        if (!marsHouse) return false;

        // Mangal Dosha houses: 1st, 4th, 7th, 8th, 12th
        const afflictedHouses = [1, 4, 7, 8, 12];

        return afflictedHouses.includes(marsHouse);
    }

    /**
     * Check for Kalasarp Dosha (All planets between Rahu-Ketu)
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if Kalasarp Dosha is present
     */
    checkKalasarpDosha(birthChart) {
        if (!birthChart.planets) return false;

        const rahuHouse = birthChart.planets.RAHU?.house;
        const ketuHouse = birthChart.planets.KETU?.house;

        if (!rahuHouse || !ketuHouse) return false;

        // Check if all planets are between Rahu and Ketu
        const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];
        let allBetween = true;

        for (const planet of planets) {
            const planetHouse = birthChart.planets[planet]?.house;
            if (planetHouse && !this.isBetweenRahuKetu(planetHouse, rahuHouse, ketuHouse)) {
                allBetween = false;
                break;
            }
        }

        return allBetween;
    }

    /**
     * Check for other remedial doshas
     * @param {Object} birthChart - Birth chart data
     * @returns {Array} Array of other dosha remedies
     */
    checkOtherDoshas(birthChart) {
        const remedies = [];

        // Check for Guru Chandala Yoga
        if (this.checkGuruChandalaYoga(birthChart)) {
            remedies.push({
                condition: 'Guru Chandala Yoga',
                fasting: 'Jupiter and Rahu fasting',
                rules: ['Thursday fasting', 'Jupiter mantras'],
                duration: 1,
                frequency: 'Weekly',
                detected: true,
                severity: 'Medium'
            });
        }

        // Check for Shani Sade Sati
        if (this.checkShaniSadeSati(birthChart)) {
            remedies.push({
                condition: 'Shani Sade Sati',
                fasting: 'Saturday fasting',
                rules: ['Oil donation', 'Shani mantras'],
                duration: 1,
                frequency: 'Weekly',
                detected: true,
                severity: 'High'
            });
        }

        return remedies;
    }

    /**
     * Check if Guru Chandala Yoga is present
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if present
     */
    checkGuruChandalaYoga(birthChart) {
        // Jupiter and Rahu in same house or aspecting each other
        return this.arePlanetsConjunct('JUPITER', 'RAHU', birthChart) ||
               this.arePlanetsOpposed('JUPITER', 'RAHU', birthChart);
    }

    /**
     * Check if Shani Sade Sati is active
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if active
     */
    checkShaniSadeSati(birthChart) {
        // Simplified check - Saturn transiting moon sign or adjacent signs
        // In production, this would check current transit
        const moonSign = birthChart.planets.MOON?.sign;
        const saturnSign = birthChart.planets.SATURN?.sign;

        if (!moonSign || !saturnSign) return false;

        // Check if Saturn is in moon sign or adjacent signs
        const signDistance = Math.abs(this.getSignNumber(saturnSign) - this.getSignNumber(moonSign));
        return signDistance <= 1 || signDistance >= 11; // Adjacent signs
    }

    /**
     * Check if Moon has beneficial aspects
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if Moon has support
     */
    checkMoonAspects(birthChart) {
        const moonHouse = birthChart.planets.MOON?.house;
        if (!moonHouse) return false;

        // Check trine aspects (5th and 9th houses from Moon)
        const trineHouses = [
            this.normalizeHouse(moonHouse + 4), // 5th from Moon
            this.normalizeHouse(moonHouse + 8)  // 9th from Moon
        ];

        // Check if benefics are in trine houses
        const benefics = ['JUPITER', 'VENUS'];
        for (const planet of benefics) {
            const planetHouse = birthChart.planets[planet]?.house;
            if (planetHouse && trineHouses.includes(planetHouse)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if two planets are conjunct
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if conjunct
     */
    arePlanetsConjunct(planet1, planet2, birthChart) {
        const house1 = birthChart.planets[planet1]?.house;
        const house2 = birthChart.planets[planet2]?.house;

        return house1 && house2 && house1 === house2;
    }

    /**
     * Check if two planets are opposed
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {Object} birthChart - Birth chart data
     * @returns {boolean} True if opposed
     */
    arePlanetsOpposed(planet1, planet2, birthChart) {
        const house1 = birthChart.planets[planet1]?.house;
        const house2 = birthChart.planets[planet2]?.house;

        if (!house1 || !house2) return false;

        const oppositionHouse = this.normalizeHouse(house1 + 6);
        return oppositionHouse === house2;
    }

    /**
     * Check if planet is between Rahu and Ketu
     * @param {number} planetHouse - Planet's house
     * @param {number} rahuHouse - Rahu's house
     * @param {number} ketuHouse - Ketu's house
     * @returns {boolean} True if between
     */
    isBetweenRahuKetu(planetHouse, rahuHouse, ketuHouse) {
        // Calculate the arc between Rahu and Ketu
        let start = rahuHouse;
        let end = ketuHouse;

        // Handle case where Ketu is before Rahu in zodiac
        if (end < start) {
            end += 12;
        }

        // Check if planet is in the arc
        if (planetHouse >= start && planetHouse <= end) {
            return true;
        }

        // Handle wrap-around case
        if (end > 12 && planetHouse + 12 >= start && planetHouse + 12 <= end) {
            return true;
        }

        return false;
    }

    /**
     * Get sign number (0-11)
     * @param {string} sign - Zodiac sign
     * @returns {number} Sign number
     */
    getSignNumber(sign) {
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        return signs.indexOf(sign);
    }

    /**
     * Normalize house number (1-12)
     * @param {number} house - House number
     * @returns {number} Normalized house
     */
    normalizeHouse(house) {
        while (house > 12) house -= 12;
        while (house < 1) house += 12;
        return house;
    }

    /**
     * Get Pitru Dosha severity
     * @param {Object} birthChart - Birth chart data
     * @returns {string} Severity level
     */
    getPitruDoshaSeverity(birthChart) {
        let severity = 0;

        if (birthChart.planets.SUN?.house === 9) severity++;
        if (birthChart.planets.MOON?.house === 9) severity++;
        if (birthChart.planets.SATURN?.house === 9) severity++;
        if (this.arePlanetsConjunct('SUN', 'SATURN', birthChart)) severity++;
        if (this.arePlanetsConjunct('MOON', 'SATURN', birthChart)) severity++;

        if (severity >= 3) return 'High';
        if (severity >= 2) return 'Medium';
        return 'Low';
    }

    /**
     * Get Kemadruma severity
     * @param {Object} birthChart - Birth chart data
     * @returns {string} Severity level
     */
    getKemadrumaSeverity(birthChart) {
        // Kemadruma is always significant when present
        return 'High';
    }

    /**
     * Get Mangal Dosha severity
     * @param {Object} birthChart - Birth chart data
     * @returns {string} Severity level
     */
    getMangalDoshaSeverity(birthChart) {
        const marsHouse = birthChart.planets.MARS?.house;

        // More severe in 7th, 8th houses
        if ([7, 8].includes(marsHouse)) return 'High';
        if ([1, 4, 12].includes(marsHouse)) return 'Medium';
        return 'Low';
    }

    /**
     * Get Kalasarp severity
     * @param {Object} birthChart - Birth chart data
     * @returns {string} Severity level
     */
    getKalasarpSeverity(birthChart) {
        // Kalasarp is generally high severity
        return 'High';
    }

    /**
     * Get personalized remedial fasting schedule
     * @param {Array} remedies - Array of remedies
     * @param {Date} startDate - Start date for scheduling
     * @returns {Object} Scheduled fasting plan
     */
    getRemedialSchedule(remedies, startDate = new Date()) {
        const schedule = {
            startDate: startDate,
            remedies: [],
            totalDuration: 0,
            weeklySchedule: {}
        };

        for (const remedy of remedies) {
            const remedySchedule = this.scheduleRemedy(remedy, startDate);
            schedule.remedies.push(remedySchedule);

            // Update total duration
            if (remedy.duration > schedule.totalDuration) {
                schedule.totalDuration = remedy.duration;
            }

            // Update weekly schedule
            this.updateWeeklySchedule(schedule.weeklySchedule, remedySchedule);
        }

        return schedule;
    }

    /**
     * Schedule individual remedy
     * @param {Object} remedy - Remedy object
     * @param {Date} startDate - Start date
     * @returns {Object} Scheduled remedy
     */
    scheduleRemedy(remedy, startDate) {
        const scheduledDates = [];

        if (remedy.frequency === 'Weekly') {
            for (let i = 0; i < remedy.duration; i++) {
                const fastingDate = new Date(startDate);
                fastingDate.setDate(startDate.getDate() + (i * 7));
                scheduledDates.push(fastingDate);
            }
        } else if (remedy.frequency === 'Yearly') {
            const fastingDate = new Date(startDate);
            fastingDate.setFullYear(startDate.getFullYear() + 1);
            scheduledDates.push(fastingDate);
        }

        return {
            ...remedy,
            scheduledDates: scheduledDates,
            nextFasting: scheduledDates[0] || null
        };
    }

    /**
     * Update weekly schedule
     * @param {Object} weeklySchedule - Weekly schedule object
     * @param {Object} remedySchedule - Remedy schedule
     */
    updateWeeklySchedule(weeklySchedule, remedySchedule) {
        for (const date of remedySchedule.scheduledDates) {
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            if (!weeklySchedule[dayName]) {
                weeklySchedule[dayName] = [];
            }
            weeklySchedule[dayName].push(remedySchedule.condition);
        }
    }
}

module.exports = RemedialFastingSystem;