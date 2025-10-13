/**
 * ZodiaCore - Monthly Horoscope Generator
 *
 * Generates monthly Vedic horoscopes with transit analysis, lunar phases,
 * planetary movements, and monthly-specific predictions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const HoroscopeGenerator = require('./horoscope-generator');
const { HOROSCOPE_CONSTANTS } = require('./horoscope-constants');

/**
 * Monthly Horoscope Generator
 * Extends base generator with monthly-specific analysis and predictions
 */
class MonthlyHoroscopeGenerator extends HoroscopeGenerator {
    constructor(birthChart) {
        super(birthChart);
    }

    /**
     * Generate complete monthly horoscope
     * @param {number} year - Year for the month
     * @param {number} month - Month (0-11, JavaScript style)
     * @returns {Promise<Object>} Complete monthly horoscope
     */
    async generateMonthlyHoroscope(year, month) {
        // Validate inputs
        if (!Number.isInteger(year) || year < 1900 || year > 2100) {
            throw new Error('Invalid year provided for monthly horoscope');
        }
        if (!Number.isInteger(month) || month < 0 || month > 11) {
            throw new Error('Invalid month provided for monthly horoscope');
        }

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); // Last day of month

        const horoscope = await this.generateHoroscope(startDate, endDate, 'monthly');

        // Add monthly-specific analysis
        horoscope.monthly = {
            monthlyTransit: this.analyzeMonthlyTransits(year, month),
            lunarPhases: this.getLunarPhases(year, month),
            planetaryMovements: this.trackPlanetaryMovements(year, month),
            auspiciousDates: this.findAuspiciousDates(year, month),
            challengingPeriods: this.identifyChallengingPeriods(year, month),
            monthlyOverview: this.generateMonthlyOverview(year, month)
        };

        return horoscope;
    }

    /**
     * Analyze monthly planetary transits
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Object} Monthly transit analysis
     */
    analyzeMonthlyTransits(year, month) {
        const startDate = new Date(year, month, 1);
        const midDate = new Date(year, month, 15); // Mid-month
        const endDate = new Date(year, month + 1, 0);

        return {
            sunTransit: this.analyzeSunTransit(year, month),
            moonTransits: this.analyzeMoonTransits(year, month),
            majorTransits: this.identifyMajorTransits(year, month),
            planetaryPositions: {
                start: this.getPlanetarySnapshot(startDate),
                mid: this.getPlanetarySnapshot(midDate),
                end: this.getPlanetarySnapshot(endDate)
            }
        };
    }

    /**
     * Analyze Sun's transit through signs during the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Object} Sun transit analysis
     */
    analyzeSunTransit(year, month) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        try {
            const startTransits = this.transitCalculator.calculateCurrentTransits(startDate);
            const endTransits = this.transitCalculator.calculateCurrentTransits(endDate);

            const startSign = Math.floor(startTransits.positions.SUN / 30);
            const endSign = Math.floor(endTransits.positions.SUN / 30);
            const degreesTravelled = endTransits.positions.SUN - startTransits.positions.SUN;

            return {
                startSign: startSign,
                endSign: endSign,
                startSignName: this.getSignName(startSign),
                endSignName: this.getSignName(endSign),
                degreesTravelled: degreesTravelled,
                signChange: startSign !== endSign
            };
        } catch (error) {
            console.warn('Error analyzing sun transit:', error.message);
            return {
                startSign: 0,
                endSign: 0,
                startSignName: 'Unknown',
                endSignName: 'Unknown',
                degreesTravelled: 0,
                signChange: false
            };
        }
    }

    /**
     * Analyze Moon's transits through signs during the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Moon transit data
     */
    analyzeMoonTransits(year, month) {
        const moonTransits = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            try {
                const transits = this.transitCalculator.calculateCurrentTransits(date);
                const moonSign = Math.floor(transits.positions.MOON / 30);

                // Only add when sign changes
                if (moonTransits.length === 0 || moonTransits[moonTransits.length - 1].sign !== moonSign) {
                    moonTransits.push({
                        date: new Date(date),
                        sign: moonSign,
                        signName: this.getSignName(moonSign),
                        longitude: transits.positions.MOON
                    });
                }
            } catch (error) {
                console.warn(`Error analyzing moon transit for day ${day}:`, error.message);
            }
        }

        return moonTransits;
    }

    /**
     * Identify major planetary transits during the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Major transit events
     */
    identifyMajorTransits(year, month) {
        const majorTransits = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            try {
                const transits = this.transitCalculator.calculateCurrentTransits(date);

                // Check for planets entering new signs
                for (const planet in transits.positions) {
                    const longitude = transits.positions[planet];
                    const sign = Math.floor(longitude / 30);
                    const degree = longitude % 30;

                    // Check if planet is at the beginning of a sign (0-5 degrees)
                    if (degree <= 5) {
                        // Check if this is a sign change from previous day
                        if (day > 1) {
                            const prevDate = new Date(year, month, day - 1);
                            const prevTransits = this.transitCalculator.calculateCurrentTransits(prevDate);
                            const prevSign = Math.floor(prevTransits.positions[planet] / 30);

                            if (prevSign !== sign) {
                                majorTransits.push({
                                    date: new Date(date),
                                    planet: planet,
                                    event: 'sign_entry',
                                    sign: sign,
                                    signName: this.getSignName(sign),
                                    significance: this.getTransitSignificance(planet, sign)
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn(`Error identifying major transits for day ${day}:`, error.message);
            }
        }

        return majorTransits;
    }

    /**
     * Get significance of a planet entering a sign
     * @param {string} planet - Planet name
     * @param {number} sign - Sign number
     * @returns {string} Significance description
     */
    getTransitSignificance(planet, sign) {
        const significances = {
            SUN: `${planet} in ${this.getSignName(sign)} affects vitality and leadership`,
            MOON: `${planet} in ${this.getSignName(sign)} influences emotions and home life`,
            MARS: `${planet} in ${this.getSignName(sign)} affects energy and action`,
            MERCURY: `${planet} in ${this.getSignName(sign)} influences communication and intellect`,
            JUPITER: `${planet} in ${this.getSignName(sign)} brings expansion and wisdom`,
            VENUS: `${planet} in ${this.getSignName(sign)} affects relationships and harmony`,
            SATURN: `${planet} in ${this.getSignName(sign)} brings discipline and responsibility`,
            RAHU: `${planet} in ${this.getSignName(sign)} brings transformation and ambition`,
            KETU: `${planet} in ${this.getSignName(sign)} affects spirituality and detachment`
        };

        return significances[planet] || `${planet} transit affects general life areas`;
    }

    /**
     * Get lunar phases for the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Lunar phases in the month
     */
    getLunarPhases(year, month) {
        const phases = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            try {
                const transits = this.transitCalculator.calculateCurrentTransits(date);
                const sunLong = transits.positions.SUN;
                const moonLong = transits.positions.MOON;
                const phaseAngle = Math.abs(this.transitCalculator.constructor.prototype.angularSeparation ?
                    this.transitCalculator.constructor.prototype.angularSeparation(sunLong, moonLong) :
                    Math.abs(sunLong - moonLong));

                let phase = null;
                let significance = '';

                if (phaseAngle <= 10 || phaseAngle >= 350) {
                    phase = 'New Moon';
                    significance = 'New beginnings, setting intentions';
                } else if (Math.abs(phaseAngle - 90) <= 10) {
                    phase = 'First Quarter';
                    significance = 'Action, decision making, challenges';
                } else if (Math.abs(phaseAngle - 180) <= 10) {
                    phase = 'Full Moon';
                    significance = 'Culmination, completion, illumination';
                } else if (Math.abs(phaseAngle - 270) <= 10) {
                    phase = 'Last Quarter';
                    significance = 'Release, letting go, reflection';
                }

                if (phase) {
                    phases.push({
                        date: new Date(date),
                        phase: phase,
                        significance: significance,
                        phaseAngle: phaseAngle
                    });
                }
            } catch (error) {
                console.warn(`Error calculating lunar phase for day ${day}:`, error.message);
            }
        }

        return phases;
    }

    /**
     * Track planetary movements during the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Object} Planetary movement data
     */
    trackPlanetaryMovements(year, month) {
        const movements = {};
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        try {
            const startTransits = this.transitCalculator.calculateCurrentTransits(startDate);
            const endTransits = this.transitCalculator.calculateCurrentTransits(endDate);

            for (const planet in startTransits.positions) {
                const startPos = startTransits.positions[planet];
                const endPos = endTransits.positions[planet];
                const movement = endPos - startPos;

                movements[planet] = {
                    startPosition: startPos,
                    endPosition: endPos,
                    degreesMoved: movement,
                    direction: movement >= 0 ? 'direct' : 'retrograde',
                    signsCrossed: Math.floor(Math.abs(movement) / 30)
                };
            }
        } catch (error) {
            console.warn('Error tracking planetary movements:', error.message);
        }

        return movements;
    }

    /**
     * Find auspicious dates in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Auspicious dates
     */
    findAuspiciousDates(year, month) {
        const auspiciousDates = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const score = this.calculateDayScore(date);

            if (score >= 0.75) { // High threshold for auspicious dates
                auspiciousDates.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getAuspiciousDateReason(date, score)
                });
            }
        }

        return auspiciousDates.slice(0, 5); // Top 5 auspicious dates
    }

    /**
     * Identify challenging periods in the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Challenging periods
     */
    identifyChallengingPeriods(year, month) {
        const challengingPeriods = [];
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const score = this.calculateDayScore(date);

            if (score <= 0.35) { // Low threshold for challenging periods
                challengingPeriods.push({
                    date: new Date(date),
                    score: score,
                    reason: this.getChallengingDateReason(date, score)
                });
            }
        }

        return challengingPeriods.slice(0, 5); // Top 5 challenging dates
    }

    /**
     * Get reason for auspicious date
     * @param {Date} date - Date
     * @param {number} score - Score
     * @returns {string} Reason
     */
    getAuspiciousDateReason(date, score) {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        return `${weekday} shows highly favorable planetary alignments for success and positive outcomes.`;
    }

    /**
     * Get reason for challenging date
     * @param {Date} date - Date
     * @param {number} score - Score
     * @returns {string} Reason
     */
    getChallengingDateReason(date, score) {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        return `${weekday} may present challenges requiring patience and careful decision-making.`;
    }

    /**
     * Generate monthly overview
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Object} Monthly overview
     */
    generateMonthlyOverview(year, month) {
        const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });

        return {
            monthName: monthName,
            year: year,
            keyThemes: this.identifyKeyThemes(year, month),
            overallTrend: this.calculateMonthlyTrend(year, month),
            recommendations: this.generateMonthlyRecommendations(year, month)
        };
    }

    /**
     * Identify key themes for the month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Key themes
     */
    identifyKeyThemes(year, month) {
        const themes = [];
        const transits = this.analyzeMonthlyTransits(year, month);

        if (transits.sunTransit.signChange) {
            themes.push('Transition and change');
        }

        if (transits.majorTransits.length > 0) {
            themes.push('Important planetary movements');
        }

        if (transits.lunarPhases && transits.lunarPhases.length > 0) {
            themes.push('Emotional and intuitive development');
        }

        return themes.length > 0 ? themes : ['General growth and stability'];
    }

    /**
     * Calculate overall monthly trend
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {string} Trend description
     */
    calculateMonthlyTrend(year, month) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        let totalScore = 0;
        let dayCount = 0;

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            totalScore += this.calculateDayScore(date);
            dayCount++;
        }

        const averageScore = totalScore / dayCount;
        const rating = this.getRatingFromScore(averageScore);

        return `Overall ${rating.toLowerCase()} month with ${averageScore >= 0.5 ? 'positive' : 'challenging'} influences`;
    }

    /**
     * Generate monthly recommendations
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Recommendations
     */
    generateMonthlyRecommendations(year, month) {
        const recommendations = [];
        const transits = this.analyzeMonthlyTransits(year, month);

        if (transits.sunTransit.signChange) {
            recommendations.push('Embrace changes and new beginnings');
        }

        if (transits.majorTransits.length > 2) {
            recommendations.push('Stay flexible and adaptable to planetary shifts');
        }

        recommendations.push('Focus on personal growth and self-improvement');
        recommendations.push('Maintain balance between activity and rest');

        return recommendations;
    }

    /**
     * Get planetary snapshot for a date
     * @param {Date} date - Date
     * @returns {Object} Planetary positions
     */
    getPlanetarySnapshot(date) {
        try {
            const transits = this.transitCalculator.calculateCurrentTransits(date);
            return transits.positions;
        } catch (error) {
            console.warn('Error getting planetary snapshot:', error.message);
            return {};
        }
    }

    /**
     * Get sign name from sign number
     * @param {number} signNumber - Sign number (0-11)
     * @returns {string} Sign name
     */
    getSignName(signNumber) {
        const signNames = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        return signNames[signNumber] || 'Unknown';
    }
}

module.exports = MonthlyHoroscopeGenerator;