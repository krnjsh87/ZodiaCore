/**
 * ZodiaCore - Financial Prosperity Analyzer
 *
 * Analyzes wealth accumulation potential, spending patterns, and financial stability
 * through planetary positions and yogas in Vedic astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VimshottariDasha = require('./vimshottari-dasha');
const YogaDetector = require('./yoga-detector');
const {
    getHouseLord,
    getPlanetsInHouse,
    getPlanetStrength,
    isPlanetAfflicted,
    arePlanetsConnected,
    getMoonNakshatra,
    validateChart,
    sanitizeHealthData
} = require('./astrology-utils');
const { PLANETARY_WEIGHTS, HOUSE_CONFIG, SCORING_WEIGHTS } = require('./astrology-constants');

/**
 * Financial Prosperity Analyzer Class
 * Evaluates wealth accumulation potential and financial stability
 */
class FinancialProsperityAnalyzer {
    constructor(birthChart, currentDate) {
        this.chart = birthChart;
        this.currentDate = currentDate || new Date();
        this.wealthIndicators = this.analyzeWealthIndicators();
        this.spendingPatterns = this.analyzeSpendingPatterns();
        this.financialYogas = this.findFinancialYogas();
        this.dashaAnalysis = this.analyzeFinancialDashas();
        this._validateChart();
    }

    /**
     * Validate birth chart data
     * @private
     */
    _validateChart() {
        if (!this.chart || !this.chart.planets) {
            throw new Error('Invalid birth chart: missing planetary data');
        }

        if (!this.chart.ascendant) {
            throw new Error('Invalid birth chart: missing ascendant data');
        }
    }

    /**
     * Analyze wealth accumulation indicators
     * @returns {Object} Wealth indicators
     */
    analyzeWealthIndicators() {
        const secondLord = this.getHouseLord(2);
        const eleventhLord = this.getHouseLord(11);
        const wealthPlanets = ['JUPITER', 'VENUS'];

        return {
            wealthHouses: [2, 5, 9, 11],
            wealthPlanets: wealthPlanets,
            dhanaYogaStrength: this.calculateDhanaYogaStrength(),
            expenditureControl: this.analyzeExpenditureControl(),
            wealthPotential: this.calculateWealthPotential()
        };
    }

    /**
     * Analyze spending patterns
     * @returns {Object} Spending pattern analysis
     */
    analyzeSpendingPatterns() {
        const twelfthLord = this.getHouseLord(12);
        const twelfthHouse = this.chart.houses ? this.chart.houses[11] : null; // 0-based

        return {
            expenditureLord: twelfthLord,
            spendingTendencies: this.getSpendingTendencies(twelfthLord),
            savingsPotential: this.calculateSavingsPotential(),
            financialDiscipline: this.assessFinancialDiscipline()
        };
    }

    /**
     * Find Dhana Yogas for wealth accumulation
     * @returns {Array} Financial yogas
     */
    findFinancialYogas() {
        const yogas = [];

        // Lakshmi Yoga
        if (this.isLakshmiYogaPresent()) {
            yogas.push({
                name: 'Lakshmi Yoga',
                strength: 0.9,
                description: 'Strong wealth accumulation yoga',
                activation: 'During Jupiter or Venus periods'
            });
        }

        // Gajakesari Yoga
        if (this.isGajakesariYogaPresent()) {
            yogas.push({
                name: 'Gajakesari Yoga',
                strength: 0.8,
                description: 'Wisdom and wealth combination',
                activation: 'During Moon-Jupiter periods'
            });
        }

        // Panchmahapurusha Yogas for wealth
        const panchmahapurusha = this.detectWealthPanchmahapurusha();
        if (panchmahapurusha) {
            yogas.push(panchmahapurusha);
        }

        return yogas;
    }

    /**
     * Analyze financial implications of dasha periods
     * @returns {Object} Financial dasha analysis
     */
    analyzeFinancialDashas() {
        const dashaSystem = new VimshottariDasha();
        const moonNakshatra = this.getMoonNakshatra();
        const birthDate = this.chart.birthDate || new Date();

        if (!moonNakshatra) {
            return { error: 'Moon nakshatra data not available' };
        }

        const balance = dashaSystem.calculateDashaBalance(moonNakshatra, birthDate);
        const currentDasha = dashaSystem.getCurrentDasha(birthDate, this.currentDate, balance);
        const upcomingDashas = dashaSystem.generateMahadashas(birthDate, balance).slice(0, 5);

        return {
            current: currentDasha ? this.evaluateFinancialDasha(currentDasha) : null,
            upcoming: upcomingDashas.map(d => this.evaluateFinancialDasha(d))
        };
    }

    /**
     * Evaluate financial potential of a dasha period
     * @param {Object} dashaPeriod - Dasha period object
     * @returns {Object} Financial evaluation
     */
    evaluateFinancialDasha(dashaPeriod) {
        const planet = dashaPeriod.planet || dashaPeriod.mahadasha;
        const financialStrength = this.getFinancialStrength(planet);

        return {
            period: dashaPeriod,
            financialPotential: financialStrength,
            wealthActivities: this.getWealthActivities(planet),
            financialChallenges: this.getFinancialChallenges(planet)
        };
    }

    /**
     * Get financial strength of a planet
     * @param {string} planet - Planet name
     * @returns {number} Financial strength score (0-1)
     */
    getFinancialStrength(planet) {
        const financialWeights = {
            'JUPITER': 0.9, // Wealth through wisdom, expansion
            'VENUS': 0.8,   // Wealth through luxury, partnerships
            'MERCURY': 0.7, // Wealth through business, trade
            'SATURN': 0.7,  // Wealth through hard work, real estate
            'SUN': 0.6,     // Wealth through authority, government
            'MOON': 0.6,    // Wealth through emotions, public
            'MARS': 0.5,    // Wealth through courage, speculation
            'RAHU': 0.6,    // Wealth through unconventional means
            'KETU': 0.4     // Detachment from material wealth
        };

        return financialWeights[planet] || 0.5;
    }

    /**
     * Check for Lakshmi Yoga
     * @returns {boolean} True if Lakshmi Yoga is present
     */
    isLakshmiYogaPresent() {
        const ninthLord = this.getHouseLord(9);
        const tenthLord = this.getHouseLord(10);
        const eleventhLord = this.getHouseLord(11);

        // Various conditions for Lakshmi Yoga
        return this.checkLakshmiYogaConditions(ninthLord, tenthLord, eleventhLord);
    }

    /**
     * Check Lakshmi Yoga conditions
     * @param {string} ninthLord - 9th house lord
     * @param {string} tenthLord - 10th house lord
     * @param {string} eleventhLord - 11th house lord
     * @returns {boolean} True if conditions met
     */
    checkLakshmiYogaConditions(ninthLord, tenthLord, eleventhLord) {
        // Condition 1: Lords in kendra or trikona
        const kendraHouses = [1, 4, 7, 10];
        const trikonaHouses = [1, 5, 9];

        const ninthInGoodHouse = kendraHouses.includes(this.chart.planets[ninthLord]?.house) ||
                                trikonaHouses.includes(this.chart.planets[ninthLord]?.house);
        const tenthInGoodHouse = kendraHouses.includes(this.chart.planets[tenthLord]?.house) ||
                                trikonaHouses.includes(this.chart.planets[tenthLord]?.house);
        const eleventhInGoodHouse = kendraHouses.includes(this.chart.planets[eleventhLord]?.house) ||
                                   trikonaHouses.includes(this.chart.planets[eleventhLord]?.house);

        // Condition 2: Venus and Moon in kendra from lagna
        const venusHouse = this.chart.planets.VENUS?.house;
        const moonHouse = this.chart.planets.MOON?.house;
        const venusMoonKendra = kendraHouses.includes(venusHouse) && kendraHouses.includes(moonHouse);

        return ninthInGoodHouse || tenthInGoodHouse || eleventhInGoodHouse || venusMoonKendra;
    }

    /**
     * Check for Gajakesari Yoga
     * @returns {boolean} True if Gajakesari Yoga is present
     */
    isGajakesariYogaPresent() {
        const moonHouse = this.chart.planets.MOON?.house;
        const jupiterHouse = this.chart.planets.JUPITER?.house;

        // Moon and Jupiter in kendra or trikona from each other
        const goodHouses = [1, 4, 5, 7, 9, 10];
        return goodHouses.includes(moonHouse) && goodHouses.includes(jupiterHouse);
    }

    /**
     * Detect wealth-related Panchmahapurusha Yoga
     * @returns {Object|null} Panchmahapurusha Yoga or null
     */
    detectWealthPanchmahapurusha() {
        // Malavya Yoga (Venus in own sign in kendra)
        if (this.isMalavyaYoga()) {
            return {
                name: 'Malavya Yoga',
                type: 'Panchmahapurusha',
                strength: 'Strong',
                effects: 'Luxury, wealth, artistic success',
                activation: 'Venus periods'
            };
        }

        // Pushya Yoga (Saturn in own sign in kendra)
        if (this.isPushyaYoga()) {
            return {
                name: 'Pushya Yoga',
                type: 'Panchmahapurusha',
                strength: 'Strong',
                effects: 'Steady wealth, real estate, long-term gains',
                activation: 'Saturn periods'
            };
        }

        return null;
    }

    /**
     * Check for Malavya Yoga
     * @returns {boolean} True if Malavya Yoga is present
     */
    isMalavyaYoga() {
        const venus = this.chart.planets.VENUS;
        if (!venus) return false;

        const kendraHouses = [1, 4, 7, 10];
        return kendraHouses.includes(venus.house) && this.isInOwnSign('VENUS');
    }

    /**
     * Check for Pushya Yoga
     * @returns {boolean} True if Pushya Yoga is present
     */
    isPushyaYoga() {
        const saturn = this.chart.planets.SATURN;
        if (!saturn) return false;

        const kendraHouses = [1, 4, 7, 10];
        return kendraHouses.includes(saturn.house) && this.isInOwnSign('SATURN');
    }

    /**
     * Calculate Dhana Yoga strength
     * @returns {number} Dhana Yoga strength (0-1)
     */
    calculateDhanaYogaStrength() {
        let strength = 0;

        // Check wealth house lords
        const wealthLords = [this.getHouseLord(2), this.getHouseLord(11)];
        wealthLords.forEach(lord => {
            if (this.isPlanetStrong(lord)) strength += 0.3;
        });

        // Check Jupiter and Venus strength
        if (this.isPlanetStrong('JUPITER')) strength += 0.2;
        if (this.isPlanetStrong('VENUS')) strength += 0.2;

        return Math.min(1, strength);
    }

    /**
     * Analyze expenditure control
     * @returns {Object} Expenditure analysis
     */
    analyzeExpenditureControl() {
        const twelfthLord = this.getHouseLord(12);
        const twelfthHousePlanets = this.getPlanetsInHouse(12);

        return {
            expenditureLord: twelfthLord,
            controlLevel: this.getExpenditureControlLevel(twelfthLord),
            wastefulTendencies: this.getWastefulTendencies(twelfthHousePlanets),
            savingsAdvice: this.generateSavingsAdvice(twelfthLord)
        };
    }

    /**
     * Calculate wealth potential
     * @returns {number} Wealth potential score (0-1)
     */
    calculateWealthPotential() {
        let potential = 0.5; // Base potential

        // Add yoga influence
        potential += this.financialYogas.length * 0.1;

        // Add dasha influence
        if (this.dashaAnalysis.current) {
            potential += this.dashaAnalysis.current.financialPotential * 0.2;
        }

        // Add house strength
        const wealthHouses = [2, 5, 9, 11];
        wealthHouses.forEach(house => {
            if (this.isHouseStrong(house)) potential += 0.05;
        });

        return Math.min(1, Math.max(0, potential));
    }

    /**
     * Calculate savings potential
     * @returns {number} Savings potential score (0-1)
     */
    calculateSavingsPotential() {
        const twelfthLord = this.getHouseLord(12);
        const twelfthStrength = this.getPlanetStrength(twelfthLord);

        // Strong 12th lord = more expenditure, less savings
        return Math.max(0, 1 - twelfthStrength);
    }

    /**
     * Assess financial discipline
     * @returns {string} Financial discipline level
     */
    assessFinancialDiscipline() {
        const savings = this.calculateSavingsPotential();
        const expenditure = this.analyzeExpenditureControl();

        if (savings > 0.7 && expenditure.controlLevel === 'High') return 'Excellent';
        if (savings > 0.5 && expenditure.controlLevel === 'Medium') return 'Good';
        if (savings > 0.3) return 'Fair';
        return 'Needs Improvement';
    }

    /**
     * Get spending tendencies based on 12th lord
     * @param {string} twelfthLord - 12th house lord
     * @returns {Array} Spending tendencies
     */
    getSpendingTendencies(twelfthLord) {
        const tendencies = {
            'JUPITER': ['Charitable donations', 'Education', 'Spiritual expenses'],
            'VENUS': ['Luxury items', 'Entertainment', 'Beauty products'],
            'SATURN': ['Practical necessities', 'Health expenses', 'Family obligations'],
            'MARS': ['Impulsive purchases', 'Competitive spending', 'Risky investments'],
            'MERCURY': ['Communication', 'Technology', 'Business expenses'],
            'MOON': ['Emotional purchases', 'Home improvements', 'Food and comfort'],
            'SUN': ['Status symbols', 'Authority-related expenses', 'Leadership investments'],
            'RAHU': ['Unconventional expenses', 'Foreign items', 'Speculative spending'],
            'KETU': ['Spiritual donations', 'Minimalist purchases', 'Health and healing']
        };

        return tendencies[twelfthLord] || ['General expenses'];
    }

    /**
     * Get wealth activities for a planet's period
     * @param {string} planet - Planet name
     * @returns {Array} Wealth activities
     */
    getWealthActivities(planet) {
        const activities = {
            'JUPITER': ['Investing in education', 'Spiritual business', 'Consulting', 'Teaching'],
            'VENUS': ['Luxury business', 'Arts and entertainment', 'Partnerships', 'Beauty industry'],
            'SATURN': ['Real estate', 'Agriculture', 'Long-term investments', 'Service industry'],
            'MERCURY': ['Trading', 'Communication business', 'Technology', 'Writing'],
            'SUN': ['Government contracts', 'Leadership positions', 'Solar energy', 'Gold business'],
            'MOON': ['Hospitality', 'Real estate', 'Food industry', 'Import-export'],
            'MARS': ['Sports business', 'Engineering', 'Military supplies', 'Energy sector'],
            'RAHU': ['Technology', 'Foreign trade', 'Research', 'Unconventional business'],
            'KETU': ['Spiritual products', 'Healing services', 'Alternative medicine', 'Charity work']
        };

        return activities[planet] || ['General wealth building'];
    }

    /**
     * Get financial challenges for a planet's period
     * @param {string} planet - Planet name
     * @returns {Array} Financial challenges
     */
    getFinancialChallenges(planet) {
        const challenges = {
            'SATURN': ['Slow growth', 'Hard work required', 'Delayed returns'],
            'RAHU': ['Instability', 'Speculative losses', 'Unpredictable income'],
            'KETU': ['Detachment from wealth', 'Spiritual conflicts', 'Sudden losses'],
            'MARS': ['Impulsive decisions', 'Conflicts in business', 'High risk-taking']
        };

        return challenges[planet] || [];
    }

    /**
     * Get expenditure control level
     * @param {string} twelfthLord - 12th house lord
     * @returns {string} Control level
     */
    getExpenditureControlLevel(twelfthLord) {
        const controlLevels = {
            'SATURN': 'High',   // Disciplined spending
            'JUPITER': 'Medium', // Balanced spending
            'VENUS': 'Low',     // Luxury spending
            'MARS': 'Low',      // Impulsive spending
            'MERCURY': 'Medium', // Practical spending
            'MOON': 'Medium',   // Emotional spending
            'SUN': 'High',      // Controlled spending
            'RAHU': 'Low',      // Uncontrolled spending
            'KETU': 'High'      // Minimal spending
        };

        return controlLevels[twelfthLord] || 'Medium';
    }

    /**
     * Get wasteful tendencies
     * @param {Array} planets - Planets in 12th house
     * @returns {Array} Wasteful tendencies
     */
    getWastefulTendencies(planets) {
        const tendencies = [];
        planets.forEach(planet => {
            if (planet === 'VENUS') tendencies.push('Luxury overspending');
            if (planet === 'MARS') tendencies.push('Impulsive purchases');
            if (planet === 'RAHU') tendencies.push('Speculative losses');
        });
        return tendencies;
    }

    /**
     * Generate savings advice
     * @param {string} twelfthLord - 12th house lord
     * @returns {Array} Savings advice
     */
    generateSavingsAdvice(twelfthLord) {
        const advice = {
            'SATURN': ['Maintain budget discipline', 'Long-term savings focus'],
            'JUPITER': ['Balance spending with charity', 'Invest in education'],
            'VENUS': ['Control luxury spending', 'Focus on quality over quantity'],
            'MARS': ['Avoid impulsive decisions', 'Channel energy into productive investments'],
            'MERCURY': ['Track expenses meticulously', 'Business expense management'],
            'MOON': ['Emotional spending awareness', 'Home budget planning'],
            'SUN': ['Status-driven spending control', 'Leadership in financial planning'],
            'RAHU': ['Avoid speculative spending', 'Ground unconventional expenses'],
            'KETU': ['Minimalist approach', 'Focus on essential spending']
        };

        return advice[twelfthLord] || ['General financial discipline'];
    }

    // Utility methods

    getHouseLord(house) {
        const houseLords = {
            1: 'MARS', 2: 'VENUS', 3: 'MERCURY', 4: 'MOON',
            5: 'SUN', 6: 'MERCURY', 7: 'VENUS', 8: 'MARS',
            9: 'JUPITER', 10: 'SATURN', 11: 'SATURN', 12: 'JUPITER'
        };
        return houseLords[house];
    }

    getPlanetsInHouse(house) {
        const planets = [];
        for (const planet in this.chart.planets) {
            if (this.chart.planets[planet].house === house) {
                planets.push(planet);
            }
        }
        return planets;
    }

    isPlanetStrong(planet) {
        const strength = this.getPlanetStrength(planet);
        return strength > 0.6;
    }

    getPlanetStrength(planet) {
        // Simplified strength calculation
        const planetData = this.chart.planets[planet];
        if (!planetData) return 0.5;

        let strength = 0.5;

        // House strength
        const goodHouses = [1, 4, 5, 7, 9, 10, 11];
        if (goodHouses.includes(planetData.house)) strength += 0.2;

        // Own sign
        if (this.isInOwnSign(planet)) strength += 0.2;

        // Exaltation
        if (this.isExalted(planet)) strength += 0.1;

        return Math.min(1, strength);
    }

    isInOwnSign(planet) {
        const planetData = this.chart.planets[planet];
        if (!planetData) return false;

        const ownSigns = {
            SUN: [4], MOON: [3], MARS: [0, 7], MERCURY: [2, 5],
            JUPITER: [8, 11], VENUS: [1, 6], SATURN: [9, 10]
        };
        return (ownSigns[planet] || []).includes(planetData.sign);
    }

    isExalted(planet) {
        const planetData = this.chart.planets[planet];
        if (!planetData) return false;

        const exaltations = {
            SUN: 0, MOON: 1, MARS: 9, MERCURY: 5,
            JUPITER: 3, VENUS: 11, SATURN: 6
        };
        return exaltations[planet] === planetData.sign;
    }

    isHouseStrong(house) {
        const lord = this.getHouseLord(house);
        return this.isPlanetStrong(lord);
    }

    getMoonNakshatra() {
        return this.chart.moonNakshatra || null;
    }

    /**
     * Generate comprehensive financial prosperity report
     * @returns {Object} Financial prosperity report
     */
    generateFinancialReport() {
        const startTime = performance.now();

        try {
            const report = {
                wealthPotential: this.calculateWealthPotential(),
                spendingPatterns: this.spendingPatterns,
                financialYogas: this.financialYogas,
                currentDasha: this.dashaAnalysis.current,
                upcomingFinancialPeriods: this.dashaAnalysis.upcoming,
                recommendations: this.generateFinancialRecommendations(),
                overallFinancialHealth: this.assessFinancialDiscipline(),
                generatedAt: new Date().toISOString(),
                systemVersion: 'ZC1.22'
            };

            const endTime = performance.now();
            const duration = endTime - startTime;

            report.performance = {
                generationTimeMs: Math.round(duration),
                timestamp: new Date().toISOString()
            };

            return report;

        } catch (error) {
            console.error(`Financial prosperity analysis failed: ${error.message}`);
            throw new Error(`Financial prosperity analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate financial recommendations
     * @returns {Array} Financial recommendations
     */
    generateFinancialRecommendations() {
        const recommendations = [];

        if (this.calculateWealthPotential() > 0.7) {
            recommendations.push({
                type: 'Investment',
                priority: 'High',
                advice: 'Strong wealth potential - consider long-term investments'
            });
        }

        if (this.financialYogas.length > 0) {
            recommendations.push({
                type: 'Yoga',
                priority: 'High',
                advice: 'Beneficial financial yogas present - focus on wealth-building activities'
            });
        }

        if (this.spendingPatterns.expenditureControl.controlLevel === 'Low') {
            recommendations.push({
                type: 'Budgeting',
                priority: 'Medium',
                advice: 'Improve expenditure control through budgeting and financial planning'
            });
        }

        return recommendations;
    }

    /**
     * Get financial overview
     * @returns {Object} Financial overview
     */
    getFinancialOverview() {
        return {
            wealthPotential: this.calculateWealthPotential(),
            financialDiscipline: this.assessFinancialDiscipline(),
            keyYogas: this.financialYogas.slice(0, 2),
            spendingProfile: this.spendingPatterns.expenditureControl.controlLevel,
            upcomingOpportunities: this.dashaAnalysis.upcoming.slice(0, 3)
        };
    }
}

module.exports = FinancialProsperityAnalyzer;