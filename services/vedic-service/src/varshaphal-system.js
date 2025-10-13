/**
 * ZodiaCore - Varshaphal (Annual Horoscope) System
 *
 * Implements Varshaphal calculations including solar return charts, Muntha progression,
 * Tajik yogas analysis, and annual predictions based on Vedic annual astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { VARSHA_CONSTANTS } = require('./advanced-astrology-constants');
const { ASTRO_CONSTANTS } = require('./astro-constants');

/**
 * Varshaphal System Class
 * Provides comprehensive annual horoscope calculations
 */
class VarshaphalSystem {
    /**
     * Initialize the Varshaphal system
     * @param {Object} birthChart - Birth chart data
     */
    constructor(birthChart) {
        this.birthChart = birthChart;
        this.solarReturn = null;
        this.muntha = null;
        this.tajikYogas = [];
    }

    /**
     * Calculate complete Varshaphal for a specific year
     * @param {number} year - Year for calculation
     * @returns {Object} Complete Varshaphal analysis
     */
    calculateVarshaphal(year) {
        try {
            // Validate input
            if (!year || year < 1900 || year > 2100) {
                throw new Error('Valid year required for Varshaphal calculation');
            }

            // Calculate solar return time
            const solarReturnTime = this.calculateSolarReturnTime(year);

            // Cast solar return chart
            this.solarReturn = this.castSolarReturnChart(solarReturnTime);

            // Calculate Muntha
            this.muntha = this.calculateMuntha(year);

            // Analyze Tajik yogas
            this.tajikYogas = this.analyzeTajikYogas();

            // Generate annual predictions
            const predictions = this.generateAnnualPredictions();

            // Identify key periods
            const keyPeriods = this.identifyKeyPeriods();

            // Generate annual remedies
            const remedies = this.generateAnnualRemedies();

            return {
                year: year,
                solarReturn: this.solarReturn,
                muntha: this.muntha,
                tajikYogas: this.tajikYogas,
                predictions: predictions,
                keyPeriods: keyPeriods,
                remedies: remedies,
                analysis: this.generateVarshaphalAnalysis(),
                success: true
            };
        } catch (error) {
            console.error('Error calculating Varshaphal:', error);
            return {
                year: year,
                solarReturn: null,
                muntha: null,
                tajikYogas: [],
                predictions: { overall: {}, monthly: [], career: '', finance: '', health: '', relationships: '', spiritual: '' },
                keyPeriods: [],
                remedies: { general: [], monthly: [], specific: [] },
                analysis: 'Varshaphal calculation failed',
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate solar return time
     * @param {number} year - Year for solar return
     * @returns {Date} Solar return date and time
     */
    calculateSolarReturnTime(year) {
        try {
            const natalSunLongitude = this.birthChart.planets.SUN.longitude;
            const birthday = new Date(year, this.birthChart.birthData.month - 1, this.birthChart.birthData.day);

            // Find exact solar return (Sun returns to natal position)
            return this.findSolarReturnTime(natalSunLongitude, birthday, 3); // ±3 days search
        } catch (error) {
            console.error('Error calculating solar return time:', error);
            // Fallback to birthday
            return new Date(year, this.birthChart.birthData.month - 1, this.birthChart.birthData.day);
        }
    }

    /**
     * Find exact solar return time within date range
     * @param {number} natalLongitude - Natal Sun longitude
     * @param {Date} centerDate - Center date for search
     * @param {number} daysRange - Days to search around center
     * @returns {Date} Exact solar return time
     */
    findSolarReturnTime(natalLongitude, centerDate, daysRange) {
        // Simplified implementation - in real system would use astronomical calculations
        // to find exact time when Sun returns to natal longitude

        // For demonstration, return the center date
        // Real implementation would iterate through times to find exact conjunction
        return new Date(centerDate);
    }

    /**
     * Cast solar return chart
     * @param {Date} returnTime - Solar return time
     * @returns {Object} Solar return chart
     */
    castSolarReturnChart(returnTime) {
        try {
            // Use birth location for solar return
            const location = this.birthChart.birthData;

            // Calculate return ascendant (simplified)
            const returnAscendant = this.calculateReturnAscendant(returnTime, location);

            // Calculate return planetary positions (simplified)
            const returnPlanets = this.calculateReturnPlanets(returnTime);

            // Calculate return houses
            const returnHouses = this.calculateReturnHouses(returnAscendant);

            // Calculate aspects
            const aspects = this.calculateReturnAspects(returnPlanets);

            return {
                time: returnTime.toISOString(),
                ascendant: returnAscendant,
                planets: returnPlanets,
                houses: returnHouses,
                aspects: aspects
            };
        } catch (error) {
            console.error('Error casting solar return chart:', error);
            return {
                time: returnTime.toISOString(),
                ascendant: { longitude: 0, sign: 0 },
                planets: {},
                houses: [],
                aspects: []
            };
        }
    }

    /**
     * Calculate return ascendant
     * @param {Date} returnTime - Return time
     * @param {Object} location - Birth location
     * @returns {Object} Return ascendant
     */
    calculateReturnAscendant(returnTime, location) {
        // Simplified calculation - real implementation would use astronomical formulas
        const natalAscendant = this.birthChart.ascendant.longitude;

        // Approximate - ascendant moves about 1° per 4 minutes
        const daysSinceBirth = Math.floor((returnTime - new Date(this.birthChart.birthData.year, this.birthChart.birthData.month - 1, this.birthChart.birthData.day)) / (1000 * 60 * 60 * 24));
        const movement = (daysSinceBirth * 360) / 365.25; // Approximate yearly movement

        const returnLongitude = (natalAscendant + movement) % 360;
        const sign = Math.floor(returnLongitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN);

        return {
            longitude: returnLongitude,
            sign: sign,
            degree: returnLongitude % ASTRO_CONSTANTS.DEGREES_PER_SIGN
        };
    }

    /**
     * Calculate return planetary positions
     * @param {Date} returnTime - Return time
     * @returns {Object} Return planets
     */
    calculateReturnPlanets(returnTime) {
        // Simplified - real implementation would calculate actual planetary positions
        const returnPlanets = {};

        for (const [planetName, planetData] of Object.entries(this.birthChart.planets)) {
            // Approximate progression - planets move at their natural speeds
            const daysSinceBirth = Math.floor((returnTime - new Date(this.birthChart.birthData.year, this.birthChart.birthData.month - 1, this.birthChart.birthData.day)) / (1000 * 60 * 60 * 24));

            // Simplified movement calculation
            let movement = 0;
            switch (planetName) {
                case 'SUN': movement = (daysSinceBirth * 360) / 365.25; break;
                case 'MOON': movement = (daysSinceBirth * 360) / 29.53; break;
                case 'MARS': movement = (daysSinceBirth * 360) / 687; break;
                case 'JUPITER': movement = (daysSinceBirth * 360) / 4333; break;
                case 'SATURN': movement = (daysSinceBirth * 360) / 10759; break;
                default: movement = (daysSinceBirth * 360) / 365; break; // Default
            }

            const returnLongitude = (planetData.longitude + movement) % 360;

            returnPlanets[planetName] = {
                longitude: returnLongitude,
                sign: Math.floor(returnLongitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN),
                house: this.getHouseFromLongitude(returnLongitude, this.birthChart.houses)
            };
        }

        return returnPlanets;
    }

    /**
     * Calculate return houses
     * @param {Object} returnAscendant - Return ascendant
     * @returns {Array<number>} Return house cusps
     */
    calculateReturnHouses(returnAscendant) {
        // Simplified house calculation
        const houses = [];
        for (let i = 0; i < ASTRO_CONSTANTS.HOUSES_COUNT; i++) {
            houses.push((returnAscendant.longitude + i * ASTRO_CONSTANTS.DEGREES_PER_SIGN) % 360);
        }
        return houses;
    }

    /**
     * Calculate return aspects
     * @param {Object} returnPlanets - Return planets
     * @returns {Array<Object>} Planetary aspects
     */
    calculateReturnAspects(returnPlanets) {
        // Simplified aspect calculation
        const aspects = [];
        const planetNames = Object.keys(returnPlanets);

        for (let i = 0; i < planetNames.length; i++) {
            for (let j = i + 1; j < planetNames.length; j++) {
                const planet1 = returnPlanets[planetNames[i]];
                const planet2 = returnPlanets[planetNames[j]];

                const angle = Math.abs(planet1.longitude - planet2.longitude) % 180;
                if (angle < 10 || angle > 170) { // Conjunction or opposition
                    aspects.push({
                        planets: [planetNames[i], planetNames[j]],
                        type: angle < 10 ? 'conjunction' : 'opposition',
                        orb: Math.min(angle, 180 - angle)
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Calculate Muntha (annual Moon progression)
     * @param {number} year - Year for calculation
     * @returns {Object} Muntha data
     */
    calculateMuntha(year) {
        try {
            const age = year - this.birthChart.birthData.year;
            const natalMoonLongitude = this.birthChart.planets.MOON.longitude;

            // Muntha moves approximately 1° per year
            const munthaLongitude = (natalMoonLongitude + age * VARSHA_CONSTANTS.MUNTHA_PROGRESSION_RATE) % 360;

            return {
                longitude: munthaLongitude,
                sign: Math.floor(munthaLongitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN),
                degree: munthaLongitude % ASTRO_CONSTANTS.DEGREES_PER_SIGN,
                house: this.getHouseFromLongitude(munthaLongitude, this.birthChart.houses),
                significance: this.interpretMunthaPosition(munthaLongitude)
            };
        } catch (error) {
            console.error('Error calculating Muntha:', error);
            return {
                longitude: 0,
                sign: 0,
                degree: 0,
                house: 1,
                significance: 'Muntha calculation failed'
            };
        }
    }

    /**
     * Interpret Muntha position significance
     * @param {number} longitude - Muntha longitude
     * @returns {string} Significance description
     */
    interpretMunthaPosition(longitude) {
        const sign = Math.floor(longitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN);

        const significances = [
            'New beginnings, leadership, vitality', // Aries
            'Wealth, family, material comforts', // Taurus
            'Communication, learning, siblings', // Gemini
            'Home, emotions, nurturing', // Cancer
            'Creativity, children, recognition', // Leo
            'Service, health, routine work', // Virgo
            'Partnership, marriage, business', // Libra
            'Transformation, secrets, research', // Scorpio
            'Fortune, spirituality, higher learning', // Sagittarius
            'Career, authority, father', // Capricorn
            'Gains, friends, hopes', // Aquarius
            'Spirituality, expenses, foreign lands' // Pisces
        ];

        return significances[sign] || 'General influence';
    }

    /**
     * Analyze Tajik yogas in solar return chart
     * @returns {Array<Object>} Tajik yogas
     */
    analyzeTajikYogas() {
        const yogas = [];

        // Raja Yoga
        if (this.checkRajaYoga()) {
            yogas.push({
                name: 'Raja Yoga',
                type: 'Beneficial',
                strength: this.calculateYogaStrength('raja'),
                effects: ['Authority', 'Success', 'Leadership'],
                duration: 'Throughout the year'
            });
        }

        // Dhana Yoga
        if (this.checkDhanaYoga()) {
            yogas.push({
                name: 'Dhana Yoga',
                type: 'Beneficial',
                strength: this.calculateYogaStrength('dhana'),
                effects: ['Wealth', 'Financial gains', 'Material prosperity'],
                duration: 'Multiple periods in the year'
            });
        }

        // Kemadruma Yoga
        if (this.checkKemadrumaYoga()) {
            yogas.push({
                name: 'Kemadruma Yoga',
                type: 'Challenging',
                strength: this.calculateYogaStrength('kemadruma'),
                effects: ['Isolation', 'Mental struggles', 'Lack of support'],
                duration: 'Throughout the year',
                remedies: ['Strengthen Moon', 'Build support network']
            });
        }

        return yogas;
    }

    /**
     * Check for Raja Yoga in solar return
     * @returns {boolean} True if Raja Yoga present
     */
    checkRajaYoga() {
        // Lords of 1st, 4th, 7th, 10th houses connected
        const kendraLords = [
            this.getHouseLord(this.solarReturn, 1),
            this.getHouseLord(this.solarReturn, 4),
            this.getHouseLord(this.solarReturn, 7),
            this.getHouseLord(this.solarReturn, 10)
        ];

        return kendraLords.some(lord => this.isInKendraOrTrikona(lord));
    }

    /**
     * Check for Dhana Yoga in solar return
     * @returns {boolean} True if Dhana Yoga present
     */
    checkDhanaYoga() {
        // 2nd and 11th house connections with benefics
        const secondLord = this.getHouseLord(this.solarReturn, 2);
        const eleventhLord = this.getHouseLord(this.solarReturn, 11);

        return this.isBenefic(secondLord) && this.isBenefic(eleventhLord);
    }

    /**
     * Check for Kemadruma Yoga
     * @returns {boolean} True if Kemadruma Yoga present
     */
    checkKemadrumaYoga() {
        // Moon isolated without planets in 2nd and 12th
        if (!this.solarReturn.planets.MOON) return false;

        const moonHouse = this.solarReturn.planets.MOON.house;
        const planetsInAdjacentHouses = this.getPlanetsInHouses([moonHouse - 1, moonHouse + 1]);

        return planetsInAdjacentHouses.length === 0;
    }

    /**
     * Calculate yoga strength
     * @param {string} yogaType - Type of yoga
     * @returns {number} Strength (0-1)
     */
    calculateYogaStrength(yogaType) {
        // Simplified strength calculation
        switch (yogaType) {
            case 'raja': return 0.8;
            case 'dhana': return 0.7;
            case 'kemadruma': return 0.6;
            default: return 0.5;
        }
    }

    /**
     * Check if planet is in kendra or trikona
     * @param {string} planet - Planet name
     * @returns {boolean} True if in good position
     */
    isInKendraOrTrikona(planet) {
        if (!this.solarReturn.planets[planet]) return false;
        const house = this.solarReturn.planets[planet].house;
        return [1, 4, 7, 10, 5, 9].includes(house); // Kendra and Trikona houses
    }

    /**
     * Check if planet is benefic
     * @param {string} planet - Planet name
     * @returns {boolean} True if benefic
     */
    isBenefic(planet) {
        return ['JUPITER', 'VENUS', 'MERCURY', 'MOON'].includes(planet);
    }

    /**
     * Get planets in specific houses
     * @param {Array<number>} houses - House numbers
     * @returns {Array<string>} Planets in those houses
     */
    getPlanetsInHouses(houses) {
        const planets = [];
        for (const [planetName, planetData] of Object.entries(this.solarReturn.planets)) {
            if (houses.includes(planetData.house)) {
                planets.push(planetName);
            }
        }
        return planets;
    }

    /**
     * Get house lord
     * @param {Object} chart - Chart data
     * @param {number} houseNumber - House number
     * @returns {string} House lord planet
     */
    getHouseLord(chart, houseNumber) {
        if (!chart.houses || chart.houses.length < houseNumber) return null;

        const cuspLongitude = chart.houses[houseNumber - 1];
        const sign = Math.floor(cuspLongitude / ASTRO_CONSTANTS.DEGREES_PER_SIGN);

        const signLords = [
            'MARS', 'VENUS', 'MERCURY', 'MOON', // Aries, Taurus, Gemini, Cancer
            'SUN', 'MERCURY', 'VENUS', 'MARS', // Leo, Virgo, Libra, Scorpio
            'JUPITER', 'SATURN', 'SATURN', 'JUPITER', // Sagittarius, Capricorn, Aquarius, Pisces
            'MARS', 'VENUS' // Additional
        ];

        return signLords[sign] || 'SUN';
    }

    /**
     * Generate annual predictions
     * @returns {Object} Annual predictions
     */
    generateAnnualPredictions() {
        return {
            overall: this.assessAnnualStrength(),
            monthly: this.generateMonthlyPredictions(),
            career: this.predictCareerYear(),
            finance: this.predictFinancialYear(),
            health: this.predictHealthYear(),
            relationships: this.predictRelationshipYear(),
            spiritual: this.predictSpiritualYear()
        };
    }

    /**
     * Assess overall annual strength
     * @returns {Object} Strength assessment
     */
    assessAnnualStrength() {
        let strength = VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.BASE_STRENGTH;

        // Add strength from beneficial yogas
        strength += this.tajikYogas.filter(yoga => yoga.type === 'Beneficial').length * VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.BENEFICIAL_YOGA_BONUS;

        // Subtract strength from challenging yogas
        strength -= this.tajikYogas.filter(yoga => yoga.type === 'Challenging').length * VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.CHALLENGING_YOGA_PENALTY;

        // Adjust based on Muntha position
        strength += this.getMunthaStrengthBonus();

        // Adjust based on solar return ascendant
        strength += this.getAscendantStrengthBonus();

        const finalStrength = Math.max(VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.MIN_STRENGTH,
                                     Math.min(VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.MAX_STRENGTH, strength));

        const rating = finalStrength > VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.EXCELLENT_MIN ? 'Excellent' :
                      finalStrength > VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.GOOD_MIN ? 'Good' :
                      finalStrength > VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.AVERAGE_MIN ? 'Average' : 'Challenging';

        return {
            score: finalStrength,
            rating: rating,
            description: this.getStrengthDescription(finalStrength)
        };
    }

    /**
     * Get Muntha strength bonus
     * @returns {number} Strength bonus
     */
    getMunthaStrengthBonus() {
        if (!this.muntha) return 0;

        // Beneficial signs for Muntha
        const beneficialSigns = [1, 4, 7, 10, 5, 9]; // Kendra and Trikona
        return beneficialSigns.includes(this.muntha.sign) ? 5 : 0;
    }

    /**
     * Get ascendant strength bonus
     * @returns {number} Strength bonus
     */
    getAscendantStrengthBonus() {
        if (!this.solarReturn.ascendant) return 0;

        // Strong ascendant signs
        const strongSigns = [0, 3, 6, 9]; // Cardinal signs
        return strongSigns.includes(this.solarReturn.ascendant.sign) ? 3 : 0;
    }

    /**
     * Get strength description
     * @param {number} strength - Strength score
     * @returns {string} Description
     */
    getStrengthDescription(strength) {
        if (strength > 80) return 'Excellent year with many opportunities';
        if (strength > 70) return 'Good year with steady progress';
        if (strength > 60) return 'Average year with mixed results';
        if (strength > 50) return 'Challenging year requiring caution';
        return 'Difficult year requiring strong remedial measures';
    }

    /**
     * Generate monthly predictions
     * @returns {Array<Object>} Monthly predictions
     */
    generateMonthlyPredictions() {
        const monthlyPredictions = [];

        for (let month = 1; month <= 12; month++) {
            const monthStart = new Date(this.solarReturn.time);
            monthStart.setMonth(monthStart.getMonth() + month - 1);

            monthlyPredictions.push({
                month: month,
                period: `${monthStart.toLocaleDateString()} - ${new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).toLocaleDateString()}`,
                focus: this.getMonthlyFocus(month),
                strength: this.getMonthlyStrength(month),
                keyEvents: this.predictMonthlyEvents(month),
                advice: this.getMonthlyAdvice(month)
            });
        }

        return monthlyPredictions;
    }

    /**
     * Get monthly focus area
     * @param {number} month - Month number
     * @returns {string} Focus area
     */
    getMonthlyFocus(month) {
        const focuses = [
            'New beginnings and planning',
            'Financial matters and stability',
            'Communication and learning',
            'Home and family',
            'Creativity and children',
            'Health and service',
            'Partnerships and relationships',
            'Transformation and change',
            'Fortune and expansion',
            'Career and authority',
            'Gains and friendships',
            'Spirituality and completion'
        ];
        return focuses[month - 1] || 'General activities';
    }

    /**
     * Get monthly strength
     * @param {number} month - Month number
     * @returns {string} Strength level
     */
    getMonthlyStrength(month) {
        // Simplified - real implementation would analyze transits
        const strengths = ['High', 'Medium', 'Low', 'High', 'Medium', 'Low', 'High', 'Medium', 'Low', 'High', 'Medium', 'Low'];
        return strengths[month - 1];
    }

    /**
     * Predict monthly key events
     * @param {number} month - Month number
     * @returns {Array<string>} Key events
     */
    predictMonthlyEvents(month) {
        // Simplified predictions
        const events = [
            ['New opportunities arise'],
            ['Financial decisions to make'],
            ['Learning and communication focus'],
            ['Family matters important'],
            ['Creative projects advance'],
            ['Health and service activities'],
            ['Relationship developments'],
            ['Changes and transformations'],
            ['Lucky breaks possible'],
            ['Career progress'],
            ['Gains from friends/network'],
            ['Spiritual insights']
        ];
        return events[month - 1] || [];
    }

    /**
     * Get monthly advice
     * @param {number} month - Month number
     * @returns {string} Advice
     */
    getMonthlyAdvice(month) {
        const advices = [
            'Start new ventures with confidence',
            'Be cautious with financial decisions',
            'Focus on learning and communication',
            'Spend quality time with family',
            'Express your creativity',
            'Pay attention to health matters',
            'Work on relationships',
            'Embrace necessary changes',
            'Take calculated risks',
            'Focus on career goals',
            'Network and build connections',
            'Practice spirituality and reflection'
        ];
        return advices[month - 1] || 'Stay positive and focused';
    }

    /**
     * Predict career year
     * @returns {string} Career prediction
     */
    predictCareerYear() {
        const tenthLord = this.getHouseLord(this.solarReturn, 10);
        const tenthHousePlanets = this.getPlanetsInHouses([10]);

        if (this.isBenefic(tenthLord) || tenthHousePlanets.some(p => this.isBenefic(p))) {
            return 'Good year for career advancement and recognition';
        } else {
            return 'Career may face challenges; focus on skill development';
        }
    }

    /**
     * Predict financial year
     * @returns {string} Financial prediction
     */
    predictFinancialYear() {
        const secondLord = this.getHouseLord(this.solarReturn, 2);
        const eleventhLord = this.getHouseLord(this.solarReturn, 11);

        if (this.isBenefic(secondLord) && this.isBenefic(eleventhLord)) {
            return 'Excellent year for financial growth and gains';
        } else {
            return 'Financial stability with moderate growth';
        }
    }

    /**
     * Predict health year
     * @returns {string} Health prediction
     */
    predictHealthYear() {
        const sixthLord = this.getHouseLord(this.solarReturn, 6);
        const eighthLord = this.getHouseLord(this.solarReturn, 8);

        if (!this.isBenefic(sixthLord) && !this.isBenefic(eighthLord)) {
            return 'Generally good health year';
        } else {
            return 'Pay attention to health; preventive care recommended';
        }
    }

    /**
     * Predict relationship year
     * @returns {string} Relationship prediction
     */
    predictRelationshipYear() {
        const seventhLord = this.getHouseLord(this.solarReturn, 7);

        if (this.isBenefic(seventhLord)) {
            return 'Harmonious relationships and possible new connections';
        } else {
            return 'Relationship challenges may arise; communication is key';
        }
    }

    /**
     * Predict spiritual year
     * @returns {string} Spiritual prediction
     */
    predictSpiritualYear() {
        const ninthLord = this.getHouseLord(this.solarReturn, 9);
        const twelfthLord = this.getHouseLord(this.solarReturn, 12);

        if (this.isBenefic(ninthLord) || this.isBenefic(twelfthLord)) {
            return 'Strong spiritual growth and inner development';
        } else {
            return 'Focus on spiritual practices for inner peace';
        }
    }

    /**
     * Identify key periods in the year
     * @returns {Array<Object>} Key periods
     */
    identifyKeyPeriods() {
        const keyPeriods = [];

        // Solar return activation period
        keyPeriods.push({
            name: 'Solar Return Activation',
            start: this.solarReturn.time,
            duration: VARSHA_CONSTANTS.KEY_PERIODS.SOLAR_RETURN_ACTIVATION.duration,
            significance: VARSHA_CONSTANTS.KEY_PERIODS.SOLAR_RETURN_ACTIVATION.significance,
            strength: 'High'
        });

        // Muntha transition periods
        const munthaTransitions = this.calculateMunthaTransitions();
        keyPeriods.push(...munthaTransitions);

        // Yoga activation periods
        for (const yoga of this.tajikYogas) {
            keyPeriods.push({
                name: `${yoga.name} Activation`,
                start: this.calculateYogaActivationTime(yoga),
                duration: yoga.duration,
                significance: yoga.effects.join(', '),
                strength: yoga.strength > 0.7 ? 'High' : 'Medium'
            });
        }

        return keyPeriods.sort((a, b) => new Date(a.start) - new Date(b.start));
    }

    /**
     * Calculate Muntha transitions
     * @returns {Array<Object>} Muntha transitions
     */
    calculateMunthaTransitions() {
        // Simplified - real implementation would calculate exact transition times
        return [{
            name: 'Muntha Sign Transition',
            start: this.solarReturn.time,
            duration: 'Variable',
            significance: 'Major life theme changes',
            strength: 'Medium'
        }];
    }

    /**
     * Calculate yoga activation time
     * @param {Object} yoga - Yoga object
     * @returns {string} Activation time
     */
    calculateYogaActivationTime(yoga) {
        // Simplified - return solar return time
        return this.solarReturn.time;
    }

    /**
     * Generate annual remedies
     * @returns {Object} Annual remedies
     */
    generateAnnualRemedies() {
        const remedies = {
            general: [],
            monthly: [],
            specific: []
        };

        const annualStrength = this.assessAnnualStrength();

        // General remedies based on chart strength
        if (annualStrength.score < VARSHA_CONSTANTS.STRENGTH_ASSESSMENT.AVERAGE_MIN) {
            remedies.general.push(
                'Daily prayer and meditation',
                'Charity and service activities',
                'Wear protective gemstones'
            );
        }

        // Remedies for challenging yogas
        for (const yoga of this.tajikYogas) {
            if (yoga.type === 'Challenging' && yoga.remedies) {
                remedies.specific.push(...yoga.remedies);
            }
        }

        // Monthly remedies based on Muntha
        for (let month = 1; month <= 12; month++) {
            remedies.monthly.push({
                month: month,
                remedies: this.getMonthlyRemedies(month)
            });
        }

        return remedies;
    }

    /**
     * Get monthly remedies
     * @param {number} month - Month number
     * @returns {Array<string>} Monthly remedies
     */
    getMonthlyRemedies(month) {
        // Simplified monthly remedies
        const remedies = [
            ['Start new ventures with prayers'],
            ['Financial planning and savings'],
            ['Communication and learning'],
            ['Family prayers and rituals'],
            ['Creative pursuits'],
            ['Health check-ups'],
            ['Relationship harmony rituals'],
            ['Meditation for change'],
            ['Lucky color rituals'],
            ['Career focused activities'],
            ['Networking and charity'],
            ['Spiritual practices']
        ];
        return remedies[month - 1] || ['General positive activities'];
    }

    /**
     * Get house from longitude
     * @param {number} longitude - Longitude
     * @param {Array<number>} houseCusps - House cusps
     * @returns {number} House number
     */
    getHouseFromLongitude(longitude, houseCusps) {
        if (!houseCusps || houseCusps.length !== 12) return 1;

        for (let i = 0; i < 12; i++) {
            const currentCusp = houseCusps[i];
            const nextCusp = houseCusps[(i + 1) % 12];

            if (this.isLongitudeInHouse(longitude, currentCusp, nextCusp)) {
                return i + 1;
            }
        }

        return 1;
    }

    /**
     * Check if longitude is in house
     * @param {number} longitude - Longitude
     * @param {number} startCusp - Start cusp
     * @param {number} endCusp - End cusp
     * @returns {boolean} True if in house
     */
    isLongitudeInHouse(longitude, startCusp, endCusp) {
        if (startCusp < endCusp) {
            return longitude >= startCusp && longitude < endCusp;
        } else {
            return longitude >= startCusp || longitude < endCusp;
        }
    }

    /**
     * Generate Varshaphal analysis summary
     * @returns {string} Analysis summary
     */
    generateVarshaphalAnalysis() {
        const strength = this.assessAnnualStrength();
        const yogaCount = this.tajikYogas.length;
        const beneficialYogas = this.tajikYogas.filter(y => y.type === 'Beneficial').length;

        let analysis = `Varshaphal for the year shows ${strength.rating.toLowerCase()} overall strength (${strength.score}%). `;

        if (yogaCount > 0) {
            analysis += `Found ${yogaCount} Tajik yogas (${beneficialYogas} beneficial). `;
        }

        if (this.muntha) {
            analysis += `Muntha in ${this.muntha.significance.toLowerCase()}. `;
        }

        analysis += strength.description;

        return analysis;
    }
}

module.exports = VarshaphalSystem;