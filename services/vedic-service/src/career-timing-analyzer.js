/**
 * ZodiaCore - Career Timing Analyzer
 *
 * Analyzes career timing, opportunities, and professional success through
 * planetary transits, dasha periods, and yogas in Vedic astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VimshottariDasha = require('./vimshottari-dasha');
const YogaDetector = require('./yoga-detector');
const { PLANETARY_PERIODS } = require('./astro-constants');
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
 * Career Timing Analyzer Class
 * Analyzes optimal career timing and professional opportunities
 */
class CareerTimingAnalyzer {
    constructor(birthChart, currentDate) {
        this.chart = birthChart;
        this.currentDate = currentDate || new Date();
        this.careerIndicators = this.identifyCareerIndicators();
        this.dashaAnalysis = this.analyzeDashaPeriods();
        this.transitAnalysis = this.analyzeTransits();
        this.yogaDetector = new YogaDetector(birthChart);
        this._validateChart();
    }

    /**
     * Validate birth chart data
     * @private
     */
    _validateChart() {
        validateChart(this.chart);
    }

    /**
     * Identify key career indicators from birth chart
     * @returns {Object} Career indicators
     */
    identifyCareerIndicators() {
        const indicators = {
            tenthLord: getHouseLord(10),
            tenthHouse: this.chart.houses ? this.chart.houses[9] : null, // 0-based
            careerPlanets: ['SATURN', 'JUPITER', 'SUN', 'MARS'],
            careerHouses: HOUSE_CONFIG.CAREER_HOUSES
        };

        // Check for Raja Yoga combinations
        indicators.rajaYogas = this.findRajaYogas();

        return indicators;
    }

    /**
     * Analyze current and upcoming dasha periods for career
     * @returns {Object} Dasha analysis
     */
    analyzeDashaPeriods() {
        const dashaSystem = new VimshottariDasha();
        const moonNakshatra = getMoonNakshatra(this.chart);
        const birthDate = this.chart.birthDate || new Date();

        if (!moonNakshatra) {
            return { error: 'Moon nakshatra data not available' };
        }

        const balance = dashaSystem.calculateDashaBalance(moonNakshatra, birthDate);
        const currentDasha = dashaSystem.getCurrentDasha(birthDate, this.currentDate, balance);
        const upcomingDashas = dashaSystem.generateMahadashas(birthDate, balance).slice(0, 5); // Next 5 periods

        return {
            current: currentDasha ? this.evaluateDashaForCareer(currentDasha) : null,
            upcoming: upcomingDashas.map(d => this.evaluateDashaForCareer(d))
        };
    }

    /**
     * Evaluate dasha period for career potential
     * @param {Object} dashaPeriod - Dasha period object
     * @returns {Object} Career evaluation
     */
    evaluateDashaForCareer(dashaPeriod) {
        const planet = dashaPeriod.planet || dashaPeriod.mahadasha;
        const careerStrength = this.getPlanetCareerStrength(planet);

        return {
            period: dashaPeriod,
            careerPotential: careerStrength,
            favorableActivities: this.getFavorableActivities(planet),
            challenges: this.getCareerChallenges(planet)
        };
    }

    /**
     * Get career strength of a planet
     * @param {string} planet - Planet name
     * @returns {number} Career strength score (0-1)
     */
    getPlanetCareerStrength(planet) {
        return PLANETARY_WEIGHTS.CAREER[planet] || 0.5;
    }

    /**
     * Find Raja Yogas in the chart
     * @returns {Array} Array of Raja Yogas
     */
    findRajaYogas() {
        const yogas = [];

        // Kendra-Trikona Raja Yoga
        const kendraPlanets = getPlanetsInHouse(this.chart, HOUSE_CONFIG.KENDRA_HOUSES);
        const trikonaPlanets = getPlanetsInHouse(this.chart, HOUSE_CONFIG.TRICONA_HOUSES);

        if (kendraPlanets.length > 0 && trikonaPlanets.length > 0) {
            yogas.push({
                name: 'Kendra-Trikona Raja Yoga',
                strength: Math.min(kendraPlanets.length, trikonaPlanets.length) / 3,
                houses: [...kendraPlanets, ...trikonaPlanets],
                effects: 'Strong career success, leadership positions'
            });
        }

        // Dhana Yoga for financial success in career
        const dhanaYoga = this.findDhanaYoga();
        if (dhanaYoga) {
            yogas.push(dhanaYoga);
        }

        return yogas;
    }

    /**
     * Find Dhana Yoga
     * @returns {Object|null} Dhana Yoga object or null
     */
    findDhanaYoga() {
        const secondLord = getHouseLord(2);
        const eleventhLord = getHouseLord(11);

        if (this.arePlanetsConnected(secondLord, eleventhLord)) {
            return {
                name: 'Dhana Yoga',
                strength: 0.8,
                planets: [secondLord, eleventhLord],
                effects: 'Financial success in career'
            };
        }

        return null;
    }

    /**
     * Analyze current planetary transits for career
     * @returns {Object} Transit analysis
     */
    analyzeTransits() {
        // Simplified transit analysis
        const transits = {
            favorable: [],
            challenging: [],
            opportunities: []
        };

        // Check Jupiter transit for career expansion
        const jupiterTransit = this.getCurrentTransit('JUPITER');
        if (jupiterTransit && this.isFavorableHouse(jupiterTransit.house)) {
            transits.favorable.push({
                planet: 'JUPITER',
                effect: 'Career expansion and opportunities',
                duration: 'Current period'
            });
        }

        // Check Saturn transit for career discipline
        const saturnTransit = this.getCurrentTransit('SATURN');
        if (saturnTransit && saturnTransit.house === 10) {
            transits.favorable.push({
                planet: 'SATURN',
                effect: 'Career discipline and long-term success',
                duration: 'Current period'
            });
        }

        return transits;
    }

    /**
     * Get favorable activities for a planet's period
     * @param {string} planet - Planet name
     * @returns {Array} Favorable activities
     */
    getFavorableActivities(planet) {
        const activities = {
            'JUPITER': ['Teaching', 'Consulting', 'Spiritual guidance', 'Legal profession'],
            'SATURN': ['Government jobs', 'Real estate', 'Agriculture', 'Service industry'],
            'SUN': ['Government positions', 'Leadership roles', 'Politics', 'Administration'],
            'MARS': ['Military', 'Engineering', 'Sports', 'Competitive careers'],
            'MERCURY': ['Business', 'Writing', 'Communication', 'Trading'],
            'VENUS': ['Arts', 'Entertainment', 'Luxury goods', 'Creative fields'],
            'MOON': ['Public service', 'Nursing', 'Hospitality', 'Public relations'],
            'RAHU': ['Technology', 'Foreign affairs', 'Research', 'Unconventional careers'],
            'KETU': ['Spiritual pursuits', 'Research', 'Healing', 'Alternative medicine']
        };

        return activities[planet] || ['General career development'];
    }

    /**
     * Get career challenges for a planet's period
     * @param {string} planet - Planet name
     * @returns {Array} Career challenges
     */
    getCareerChallenges(planet) {
        const challenges = {
            'SATURN': ['Delays in promotion', 'Hard work required', 'Discipline needed'],
            'RAHU': ['Instability', 'Unconventional approaches', 'Sudden changes'],
            'KETU': ['Detachment from material success', 'Spiritual conflicts', 'Unpredictability'],
            'MARS': ['Conflicts', 'Aggression', 'Burnout risk']
        };

        return challenges[planet] || [];
    }


    /**
     * Get current transit of a planet
     * @param {string} planet - Planet name
     * @returns {Object|null} Transit data
     */
    getCurrentTransit(planet) {
        // Simplified transit calculation
        // In a real implementation, this would calculate current position
        return this.chart.transits ? this.chart.transits[planet] : null;
    }

    /**
     * Check if house is favorable for career
     * @param {number} house - House number
     * @returns {boolean} True if favorable
     */
    isFavorableHouse(house) {
        const favorableHouses = [1, 4, 5, 7, 9, 10, 11];
        return favorableHouses.includes(house);
    }

    /**
     * Generate comprehensive career timing report
     * @returns {Object} Career timing report
     */
    generateCareerTimingReport() {
        const startTime = performance.now();

        try {
            const report = {
                currentPeriod: this.dashaAnalysis.current,
                upcomingOpportunities: this.dashaAnalysis.upcoming,
                favorableTransits: this.transitAnalysis.favorable,
                careerYogas: this.careerIndicators.rajaYogas,
                recommendations: this.generateCareerRecommendations(),
                overallCareerPotential: this.calculateOverallCareerPotential(),
                generatedAt: new Date().toISOString(),
                systemVersion: 'ZC1.22'
            };

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Add performance metadata
            report.performance = {
                generationTimeMs: Math.round(duration),
                timestamp: new Date().toISOString()
            };

            return report;

        } catch (error) {
            console.error(`Career timing analysis failed: ${error.message}`);
            throw new Error(`Career timing analysis failed: ${error.message}`);
        }
    }

    /**
     * Generate career recommendations
     * @returns {Array} Career recommendations
     */
    generateCareerRecommendations() {
        const recommendations = [];

        if (this.dashaAnalysis.current && this.dashaAnalysis.current.careerPotential > 0.7) {
            recommendations.push({
                type: 'Timing',
                priority: 'High',
                advice: `Current ${this.dashaAnalysis.current.period.mahadasha} period is highly favorable for career advancement`
            });
        }

        if (this.transitAnalysis.favorable.length > 0) {
            recommendations.push({
                type: 'Transit',
                priority: 'Medium',
                advice: 'Current planetary transits support career growth'
            });
        }

        if (this.careerIndicators.rajaYogas.length > 0) {
            recommendations.push({
                type: 'Yoga',
                priority: 'High',
                advice: 'Strong career yogas indicate leadership potential'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall career potential
     * @returns {number} Career potential score (0-1)
     */
    calculateOverallCareerPotential() {
        let score = SCORING_WEIGHTS.CAREER.BASE; // Base score

        // Add dasha influence
        if (this.dashaAnalysis.current) {
            score += this.dashaAnalysis.current.careerPotential * SCORING_WEIGHTS.CAREER.DASHA;
        }

        // Add yoga influence
        score += this.careerIndicators.rajaYogas.length * SCORING_WEIGHTS.CAREER.YOGA;

        // Add transit influence
        score += this.transitAnalysis.favorable.length * SCORING_WEIGHTS.CAREER.TRANSIT;

        return Math.min(1, Math.max(0, score));
    }

    /**
     * Get career overview
     * @returns {Object} Career overview
     */
    getCareerOverview() {
        return {
            currentPeriodRating: this.dashaAnalysis.current ?
                (this.dashaAnalysis.current.careerPotential > 0.7 ? 'Favorable' : 'Moderate') : 'Unknown',
            careerPotential: this.calculateOverallCareerPotential(),
            keyYogas: this.careerIndicators.rajaYogas.slice(0, 2),
            upcomingOpportunities: this.dashaAnalysis.upcoming.slice(0, 3)
        };
    }
}

module.exports = CareerTimingAnalyzer;