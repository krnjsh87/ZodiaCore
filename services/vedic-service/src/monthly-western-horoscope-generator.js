/**
 * Monthly Western Horoscope Generator
 * ZC3.7 Western Astrology Horoscope Generation System
 *
 * Generates monthly horoscopes with lunar phases, planetary movements,
 * and monthly transit analysis.
 */

const { WesternHoroscopeGenerator } = require('./western-horoscope-generator');
const { WESTERN_HOROSCOPE_CONSTANTS } = require('./western-horoscope-constants');
const { calculateMoonPhase } = require('./western-horoscope-utils');

class MonthlyWesternHoroscopeGenerator extends WesternHoroscopeGenerator {
    /**
     * Generate monthly horoscope
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Promise<Object>} Monthly horoscope
     */
    async generateMonthlyHoroscope(year, month) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const horoscope = await this.generateHoroscope(startDate, endDate, 'monthly');

        // Add monthly-specific analysis
        horoscope.monthly = {
            monthlyTransit: this.analyzeMonthlyTransits(year, month),
            lunarPhases: this.getLunarPhases(year, month),
            planetaryMovements: this.trackPlanetaryMovements(year, month),
            retrogrades: this.identifyRetrogrades(year, month),
            newMoon: this.findNewMoon(year, month),
            fullMoon: this.findFullMoon(year, month),
            solarTransits: this.analyzeSolarTransits(year, month)
        };

        return horoscope;
    }

    /**
     * Analyze monthly transits
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Object} Monthly transit analysis
     */
    analyzeMonthlyTransits(year, month) {
        const monthlyAnalysis = {
            sunTransit: this.analyzeSunTransit(year, month),
            moonTransits: this.analyzeMoonTransits(year, month),
            majorAspects: this.identifyMajorAspects(year, month),
            planetaryPositions: this.getPlanetaryPositionsForMonth(year, month)
        };

        return monthlyAnalysis;
    }

    /**
     * Analyze Sun transit through signs
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Object} Sun transit analysis
     */
    analyzeSunTransit(year, month) {
        const startSunPosition = this.getSunPosition(new Date(year, month, 1));
        const endSunPosition = this.getSunPosition(new Date(year, month + 1, 0));

        const startSign = Math.floor(startSunPosition / 30) % 12;
        const endSign = Math.floor(endSunPosition / 30) % 12;

        return {
            startSign: WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[startSign],
            endSign: WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[endSign],
            degreesTravelled: endSunPosition - startSunPosition,
            signChange: startSign !== endSign,
            newSign: startSign !== endSign ? WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[endSign] : null
        };
    }

    /**
     * Analyze Moon transits through signs
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Array} Moon transit analysis
     */
    analyzeMoonTransits(year, month) {
        const moonTransits = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const moonSign = Math.floor(this.getMoonPosition(date) / 30) % 12;
            moonTransits.push({
                date: new Date(date),
                sign: WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[moonSign],
                phase: calculateMoonPhase(date)
            });
        }

        return moonTransits;
    }

    /**
     * Get lunar phases for the month
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Array} Lunar phases
     */
    getLunarPhases(year, month) {
        const phases = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const moonPhase = calculateMoonPhase(date);

            if (moonPhase === WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.NEW_MOON ||
                moonPhase === WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.FULL_MOON ||
                moonPhase === WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.FIRST_QUARTER ||
                moonPhase === WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.LAST_QUARTER) {
                phases.push({
                    date: new Date(date),
                    phase: moonPhase,
                    significance: this.getPhaseSignificance(moonPhase)
                });
            }
        }

        return phases;
    }

    /**
     * Get significance of lunar phase
     * @param {string} phase - Moon phase
     * @returns {string} Significance description
     */
    getPhaseSignificance(phase) {
        const significances = {
            [WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.NEW_MOON]: "New beginnings, setting intentions, planting seeds",
            [WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.FULL_MOON]: "Culmination, clarity, emotional intensity, release",
            [WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.FIRST_QUARTER]: "Action, decision-making, overcoming obstacles",
            [WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.LAST_QUARTER]: "Release, letting go, reflection, course correction"
        };

        return significances[phase] || "General lunar influence";
    }

    /**
     * Track planetary movements
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Object} Planetary movements
     */
    trackPlanetaryMovements(year, month) {
        const movements = {};
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        // Track major planets
        const planets = ['MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];

        for (const planet of planets) {
            const startPos = this.getPlanetPosition(planet, startDate);
            const endPos = this.getPlanetPosition(planet, endDate);

            movements[planet] = {
                startPosition: startPos,
                endPosition: endPos,
                movement: endPos - startPos,
                direction: endPos > startPos ? 'direct' : 'retrograde',
                sign: WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[Math.floor(endPos / 30) % 12]
            };
        }

        return movements;
    }

    /**
     * Identify retrogrades in the month
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Array} Retrograde periods
     */
    identifyRetrogrades(year, month) {
        const retrogrades = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const transits = this.transitCalculator.calculateCurrentTransits(date);

            for (const planet in transits.retrograde) {
                if (transits.retrograde[planet]) {
                    retrogrades.push({
                        planet: planet,
                        date: new Date(date),
                        significance: this.getRetrogradeSignificance(planet)
                    });
                }
            }
        }

        return [...new Set(retrogrades.map(r => r.planet))].map(planet => {
            return retrogrades.find(r => r.planet === planet);
        });
    }

    /**
     * Get retrograde significance
     * @param {string} planet - Planet name
     * @returns {string} Significance description
     */
    getRetrogradeSignificance(planet) {
        const significances = {
            MERCURY: "Review communication, reconsider decisions, technical issues",
            VENUS: "Reevaluate relationships, financial matters, aesthetic choices",
            MARS: "Redirect energy, review actions, internal motivation",
            JUPITER: "Reassess beliefs, philosophical matters, expansion plans",
            SATURN: "Karmic lessons, responsibility, structural changes",
            URANUS: "Sudden changes, innovation, breaking free from constraints",
            NEPTUNE: "Spiritual insights, creative inspiration, dissolution of boundaries",
            PLUTO: "Deep transformation, power dynamics, rebirth"
        };

        return significances[planet] || "Internal reflection and review";
    }

    /**
     * Find new moon in month
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Object|null} New moon data
     */
    findNewMoon(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (calculateMoonPhase(date) === WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.NEW_MOON) {
                return {
                    date: new Date(date),
                    significance: "Plant seeds for new projects and intentions"
                };
            }
        }
        return null;
    }

    /**
     * Find full moon in month
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Object|null} Full moon data
     */
    findFullMoon(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (calculateMoonPhase(date) === WESTERN_HOROSCOPE_CONSTANTS.MOON_PHASES.FULL_MOON) {
                return {
                    date: new Date(date),
                    significance: "Harvest results, gain clarity, release what no longer serves"
                };
            }
        }
        return null;
    }

    /**
     * Analyze solar transits
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Object} Solar transit analysis
     */
    analyzeSolarTransits(year, month) {
        const solarTransits = {
            sunSignChanges: [],
            importantDates: []
        };

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const sunPos = this.getSunPosition(date);
            const sign = Math.floor(sunPos / 30) % 12;

            if (day === 1 || (day > 1 && sign !== Math.floor(this.getSunPosition(new Date(year, month, day - 1)) / 30) % 12)) {
                solarTransits.sunSignChanges.push({
                    date: new Date(date),
                    sign: WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[sign],
                    significance: `Sun enters ${WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[sign]}`
                });
            }
        }

        return solarTransits;
    }

    /**
     * Get planetary positions for month (simplified)
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Object} Planetary positions
     */
    getPlanetaryPositionsForMonth(year, month) {
        const midMonth = new Date(year, month, 15);
        const transits = this.transitCalculator.calculateCurrentTransits(midMonth);

        const positions = {};
        for (const planet in transits.positions) {
            positions[planet] = {
                longitude: transits.positions[planet],
                sign: WESTERN_HOROSCOPE_CONSTANTS.ZODIAC_SIGNS[Math.floor(transits.positions[planet] / 30) % 12]
            };
        }

        return positions;
    }

    /**
     * Get Sun position (simplified)
     * @param {Date} date - Date
     * @returns {number} Longitude in degrees
     */
    getSunPosition(date) {
        const transits = this.transitCalculator.calculateCurrentTransits(date);
        return transits.positions.SUN;
    }

    /**
     * Get Moon position (simplified)
     * @param {Date} date - Date
     * @returns {number} Longitude in degrees
     */
    getMoonPosition(date) {
        const transits = this.transitCalculator.calculateCurrentTransits(date);
        return transits.positions.MOON;
    }

    /**
     * Get planet position (simplified)
     * @param {string} planet - Planet name
     * @param {Date} date - Date
     * @returns {number} Longitude in degrees
     */
    getPlanetPosition(planet, date) {
        const transits = this.transitCalculator.calculateCurrentTransits(date);
        return transits.positions[planet];
    }

    /**
     * Identify major aspects in month
     * @param {number} year - Year
     * @param {number} month - Month
     * @returns {Array} Major aspects
     */
    identifyMajorAspects(year, month) {
        const aspects = [];
        const midMonth = new Date(year, month, 15);
        const transits = this.transitCalculator.calculateCurrentTransits(midMonth);
        const transitAspects = this.transitCalculator.calculateTransitAspects(this.birthChart, transits);

        for (const natalPlanet in transitAspects) {
            for (const transitPlanet in transitAspects[natalPlanet]) {
                const aspect = transitAspects[natalPlanet][transitPlanet];
                if (aspect.aspect && aspect.strength > 0.7) {
                    aspects.push({
                        natalPlanet: natalPlanet,
                        transitPlanet: transitPlanet,
                        aspect: aspect.aspect,
                        strength: aspect.strength,
                        significance: this.getAspectSignificance(aspect.aspect, natalPlanet, transitPlanet)
                    });
                }
            }
        }

        return aspects.slice(0, 5);
    }

    /**
     * Get aspect significance
     * @param {string} aspect - Aspect type
     * @param {string} natalPlanet - Natal planet
     * @param {string} transitPlanet - Transit planet
     * @returns {string} Significance description
     */
    getAspectSignificance(aspect, natalPlanet, transitPlanet) {
        const significances = {
            CONJUNCTION: `${transitPlanet} conjunct natal ${natalPlanet} - New beginnings and focus`,
            SEXTILE: `${transitPlanet} sextile natal ${natalPlanet} - Opportunities and harmony`,
            SQUARE: `${transitPlanet} square natal ${natalPlanet} - Challenges and growth`,
            TRINE: `${transitPlanet} trine natal ${natalPlanet} - Flow and ease`,
            OPPOSITION: `${transitPlanet} opposition natal ${natalPlanet} - Balance and integration`
        };

        return significances[aspect] || "Planetary influence";
    }

    /**
     * Generate summary text for monthly horoscope
     * @param {number} score - Score
     * @param {string} rating - Rating
     * @param {string} type - Type
     * @returns {string} Summary text
     */
    generateSummaryText(score, rating, type) {
        const templates = {
            Excellent: "An exceptional month with outstanding opportunities and positive developments.",
            'Very Good': "A very favorable month with excellent prospects in multiple areas.",
            Good: "A good month with positive developments and manageable challenges.",
            Fair: "A mixed month with both opportunities and obstacles to navigate.",
            Challenging: "A challenging month requiring patience and strategic planning.",
            Difficult: "A difficult month with significant challenges and limited opportunities."
        };

        return templates[rating] || "A month with mixed influences requiring balanced approach.";
    }
}

module.exports = {
    MonthlyWesternHoroscopeGenerator
};