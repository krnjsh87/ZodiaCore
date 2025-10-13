/**
 * ZodiaCore - Transit Analyzer
 *
 * Analyzes planetary transits and their effects on various life areas
 * in Vedic astrology.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

/**
 * Transit Analyzer Class
 * Analyzes current and upcoming planetary transits
 */
class TransitAnalyzer {
    constructor(birthChart, currentDate) {
        this.birthChart = birthChart;
        this.currentDate = currentDate || new Date();
        this._validateChart();
    }

    /**
     * Validate birth chart data
     * @private
     */
    _validateChart() {
        if (!this.birthChart || !this.birthChart.planets) {
            throw new Error('Invalid birth chart: missing planetary data');
        }
    }

    /**
     * Analyze current planetary transits
     * @returns {Object} Current transit analysis
     */
    analyzeCurrentTransits() {
        const transits = {
            majorTransits: this.getMajorTransits(),
            favorableTransits: this.getFavorableTransits(),
            challengingTransits: this.getChallengingTransits(),
            upcomingTransits: this.getUpcomingTransits(6), // Next 6 months
            transitEffects: this.calculateTransitEffects()
        };

        return transits;
    }

    /**
     * Get major planetary transits
     * @returns {Array} Major transits
     */
    getMajorTransits() {
        const majorTransits = [];
        const planets = ['SATURN', 'JUPITER', 'RAHU', 'KETU', 'MARS'];

        planets.forEach(planet => {
            const transit = this.getCurrentTransit(planet);
            if (transit) {
                majorTransits.push({
                    planet: planet,
                    house: transit.house,
                    sign: transit.sign,
                    effects: this.getTransitEffects(planet, transit.house),
                    strength: this.calculateTransitStrength(planet, transit)
                });
            }
        });

        return majorTransits;
    }

    /**
     * Get favorable transits
     * @returns {Array} Favorable transits
     */
    getFavorableTransits() {
        const favorable = [];
        const beneficPlanets = ['JUPITER', 'VENUS'];

        beneficPlanets.forEach(planet => {
            const transit = this.getCurrentTransit(planet);
            if (transit && this.isFavorableHouse(transit.house)) {
                favorable.push({
                    planet: planet,
                    house: transit.house,
                    effects: `Positive influences in ${this.getHouseSignification(transit.house)}`,
                    duration: this.getTransitDuration(planet)
                });
            }
        });

        return favorable;
    }

    /**
     * Get challenging transits
     * @returns {Array} Challenging transits
     */
    getChallengingTransits() {
        const challenging = [];
        const maleficPlanets = ['SATURN', 'RAHU', 'KETU', 'MARS'];

        maleficPlanets.forEach(planet => {
            const transit = this.getCurrentTransit(planet);
            if (transit && this.isChallengingHouse(transit.house)) {
                challenging.push({
                    planet: planet,
                    house: transit.house,
                    effects: `Challenges in ${this.getHouseSignification(transit.house)}`,
                    precautions: this.getTransitPrecautions(planet)
                });
            }
        });

        return challenging;
    }

    /**
     * Get upcoming transits
     * @param {number} months - Number of months to look ahead
     * @returns {Array} Upcoming transits
     */
    getUpcomingTransits(months) {
        const upcoming = [];
        const futureDate = new Date(this.currentDate);
        futureDate.setMonth(futureDate.getMonth() + months);

        // Simplified - in practice would calculate actual transit changes
        const potentialTransits = [
            { planet: 'JUPITER', date: new Date('2025-05-15'), house: 7 },
            { planet: 'SATURN', date: new Date('2025-03-10'), house: 10 },
            { planet: 'RAHU', date: new Date('2025-08-20'), house: 5 }
        ];

        potentialTransits.forEach(transit => {
            if (transit.date > this.currentDate && transit.date < futureDate) {
                upcoming.push({
                    planet: transit.planet,
                    date: transit.date,
                    house: transit.house,
                    significance: this.getTransitSignificance(transit.planet, transit.house)
                });
            }
        });

        return upcoming;
    }

    /**
     * Calculate overall transit effects
     * @returns {Object} Transit effects summary
     */
    calculateTransitEffects() {
        const majorTransits = this.getMajorTransits();
        let favorableScore = 0;
        let challengingScore = 0;

        majorTransits.forEach(transit => {
            if (this.isBeneficPlanet(transit.planet)) {
                favorableScore += transit.strength;
            } else if (this.isMaleficPlanet(transit.planet)) {
                challengingScore += transit.strength;
            }
        });

        const netEffect = favorableScore - challengingScore;
        const overallEffect = netEffect > 0.3 ? 'Favorable' :
                             netEffect < -0.3 ? 'Challenging' : 'Mixed';

        return {
            favorableScore: favorableScore,
            challengingScore: challengingScore,
            netEffect: netEffect,
            overallEffect: overallEffect,
            dominantInfluence: this.getDominantTransitInfluence(majorTransits)
        };
    }

    /**
     * Get current transit of a planet
     * @param {string} planet - Planet name
     * @returns {Object|null} Transit data
     */
    getCurrentTransit(planet) {
        // Simplified transit calculation
        // In a real implementation, this would calculate current position
        const mockTransits = {
            'JUPITER': { house: 6, sign: 8, longitude: 248.5 },
            'SATURN': { house: 9, sign: 10, longitude: 301.2 },
            'MARS': { house: 3, sign: 4, longitude: 95.8 },
            'VENUS': { house: 5, sign: 6, longitude: 156.3 },
            'MERCURY': { house: 4, sign: 5, longitude: 125.7 },
            'SUN': { house: 4, sign: 5, longitude: 120.4 },
            'MOON': { house: 7, sign: 8, longitude: 235.9 },
            'RAHU': { house: 11, sign: 0, longitude: 23.1 },
            'KETU': { house: 5, sign: 6, longitude: 203.1 }
        };

        return mockTransits[planet] || null;
    }

    /**
     * Get transit effects for a planet in a house
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @returns {string} Transit effects
     */
    getTransitEffects(planet, house) {
        const houseEffects = {
            1: "self, personality, physical health",
            2: "wealth, family, speech",
            3: "siblings, communication, courage",
            4: "home, mother, emotions",
            5: "children, creativity, intelligence",
            6: "health, service, enemies",
            7: "marriage, partnerships, business",
            8: "transformation, secrets, longevity",
            9: "fortune, father, spirituality",
            10: "career, reputation, authority",
            11: "gains, friends, hopes",
            12: "expenses, foreign lands, spirituality"
        };

        const planetNature = this.getPlanetNature(planet);
        const houseSignification = houseEffects[house] || "various life areas";

        return `${planetNature} influences on ${houseSignification}`;
    }

    /**
     * Calculate transit strength
     * @param {string} planet - Planet name
     * @param {Object} transit - Transit data
     * @returns {number} Strength score (0-1)
     */
    calculateTransitStrength(planet, transit) {
        let strength = 0.5;

        // House strength
        if (this.isFavorableHouse(transit.house)) strength += 0.2;
        if (this.isChallengingHouse(transit.house)) strength -= 0.2;

        // Planet nature
        if (this.isBeneficPlanet(planet)) strength += 0.1;
        if (this.isMaleficPlanet(planet)) strength -= 0.1;

        // Exaltation/debilitation
        if (this.isTransitExalted(planet, transit.sign)) strength += 0.2;
        if (this.isTransitDebilitated(planet, transit.sign)) strength -= 0.2;

        return Math.max(0, Math.min(1, strength));
    }

    /**
     * Check if house is favorable for transits
     * @param {number} house - House number
     * @returns {boolean} True if favorable
     */
    isFavorableHouse(house) {
        const favorableHouses = [1, 2, 4, 5, 7, 9, 10, 11];
        return favorableHouses.includes(house);
    }

    /**
     * Check if house is challenging for transits
     * @param {number} house - House number
     * @returns {boolean} True if challenging
     */
    isChallengingHouse(house) {
        const challengingHouses = [6, 8, 12];
        return challengingHouses.includes(house);
    }

    /**
     * Get house signification
     * @param {number} house - House number
     * @returns {string} House signification
     */
    getHouseSignification(house) {
        const significations = {
            1: "self and personality",
            2: "wealth and family",
            3: "communication and siblings",
            4: "home and emotions",
            5: "children and creativity",
            6: "health and service",
            7: "relationships and partnerships",
            8: "transformation and secrets",
            9: "fortune and spirituality",
            10: "career and reputation",
            11: "gains and friends",
            12: "expenses and spirituality"
        };

        return significations[house] || "various areas";
    }

    /**
     * Get transit duration
     * @param {string} planet - Planet name
     * @returns {string} Duration description
     */
    getTransitDuration(planet) {
        const durations = {
            'JUPITER': 'about 1 year',
            'SATURN': 'about 2.5 years',
            'RAHU': 'about 1.5 years',
            'KETU': 'about 1.5 years',
            'MARS': 'about 1-2 months',
            'VENUS': 'about 3-4 weeks',
            'MERCURY': 'about 2-3 weeks',
            'SUN': 'about 1 month',
            'MOON': 'about 2-3 days'
        };

        return durations[planet] || 'varies';
    }

    /**
     * Get transit precautions
     * @param {string} planet - Planet name
     * @returns {Array} Precautions
     */
    getTransitPrecautions(planet) {
        const precautions = {
            'SATURN': ['Maintain discipline', 'Avoid risky decisions', 'Focus on long-term goals'],
            'RAHU': ['Be cautious with new ventures', 'Avoid speculation', 'Strengthen mental health'],
            'KETU': ['Practice spirituality', 'Avoid isolation', 'Focus on inner peace'],
            'MARS': ['Control anger', 'Avoid conflicts', 'Be careful with health']
        };

        return precautions[planet] || ['General caution advised'];
    }

    /**
     * Get transit significance
     * @param {string} planet - Planet name
     * @param {number} house - House number
     * @returns {string} Significance description
     */
    getTransitSignificance(planet, house) {
        const planetImpact = this.getPlanetNature(planet);
        const houseArea = this.getHouseSignification(house);

        return `${planetImpact} period affecting ${houseArea}`;
    }

    /**
     * Get dominant transit influence
     * @param {Array} transits - Major transits
     * @returns {string} Dominant influence
     */
    getDominantTransitInfluence(transits) {
        const influences = transits.map(transit => ({
            planet: transit.planet,
            strength: transit.strength,
            nature: this.getPlanetNature(transit.planet)
        }));

        const strongest = influences.reduce((prev, current) =>
            (prev.strength > current.strength) ? prev : current
        );

        return strongest ? `${strongest.nature} (${strongest.planet})` : 'Mixed influences';
    }

    /**
     * Get planet nature
     * @param {string} planet - Planet name
     * @returns {string} Planet nature
     */
    getPlanetNature(planet) {
        const natures = {
            'JUPITER': 'expansive and benevolent',
            'VENUS': 'harmonious and luxurious',
            'MERCURY': 'communicative and intellectual',
            'SUN': 'authoritative and vital',
            'MOON': 'emotional and nurturing',
            'MARS': 'energetic and assertive',
            'SATURN': 'disciplined and restrictive',
            'RAHU': 'ambitious and unconventional',
            'KETU': 'spiritual and detached'
        };

        return natures[planet] || 'planetary';
    }

    /**
     * Check if planet is benefic
     * @param {string} planet - Planet name
     * @returns {boolean} True if benefic
     */
    isBeneficPlanet(planet) {
        const benefics = ['JUPITER', 'VENUS'];
        return benefics.includes(planet);
    }

    /**
     * Check if planet is malefic
     * @param {string} planet - Planet name
     * @returns {boolean} True if malefic
     */
    isMaleficPlanet(planet) {
        const malefics = ['SATURN', 'MARS', 'RAHU', 'KETU'];
        return malefics.includes(planet);
    }

    /**
     * Check if transit is exalted
     * @param {string} planet - Planet name
     * @param {number} sign - Sign number
     * @returns {boolean} True if exalted
     */
    isTransitExalted(planet, sign) {
        const exaltations = {
            'SUN': 0, 'MOON': 1, 'MARS': 9, 'MERCURY': 5,
            'JUPITER': 3, 'VENUS': 11, 'SATURN': 6
        };
        return exaltations[planet] === sign;
    }

    /**
     * Check if transit is debilitated
     * @param {string} planet - Planet name
     * @param {number} sign - Sign number
     * @returns {boolean} True if debilitated
     */
    isTransitDebilitated(planet, sign) {
        const debilitations = {
            'SUN': 6, 'MOON': 7, 'MARS': 3, 'MERCURY': 11,
            'JUPITER': 9, 'VENUS': 5, 'SATURN': 0
        };
        return debilitations[planet] === sign;
    }

    /**
     * Generate comprehensive transit report
     * @returns {Object} Transit analysis report
     */
    generateTransitReport() {
        const startTime = performance.now();

        try {
            const analysis = this.analyzeCurrentTransits();

            const report = {
                currentTransits: analysis,
                lifeAreaImpacts: this.analyzeLifeAreaImpacts(),
                timingGuidance: this.generateTimingGuidance(),
                recommendations: this.generateTransitRecommendations(),
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
            console.error(`Transit analysis failed: ${error.message}`);
            throw new Error(`Transit analysis failed: ${error.message}`);
        }
    }

    /**
     * Analyze impacts on different life areas
     * @returns {Object} Life area impacts
     */
    analyzeLifeAreaImpacts() {
        const impacts = {
            career: this.getTransitImpactOnArea('career'),
            finance: this.getTransitImpactOnArea('finance'),
            health: this.getTransitImpactOnArea('health'),
            relationships: this.getTransitImpactOnArea('relationships'),
            spirituality: this.getTransitImpactOnArea('spirituality')
        };

        return impacts;
    }

    /**
     * Get transit impact on specific life area
     * @param {string} area - Life area
     * @returns {Object} Impact analysis
     */
    getTransitImpactOnArea(area) {
        const houseMapping = {
            career: [10],
            finance: [2, 11],
            health: [1, 6, 8],
            relationships: [5, 7],
            spirituality: [9, 12]
        };

        const relevantHouses = houseMapping[area] || [];
        const transitsInArea = this.getMajorTransits().filter(transit =>
            relevantHouses.includes(transit.house)
        );

        const favorableCount = transitsInArea.filter(t => this.isBeneficPlanet(t.planet)).length;
        const challengingCount = transitsInArea.filter(t => this.isMaleficPlanet(t.planet)).length;

        const netImpact = favorableCount - challengingCount;
        const impactLevel = netImpact > 0 ? 'Positive' :
                           netImpact < 0 ? 'Challenging' : 'Neutral';

        return {
            impactLevel: impactLevel,
            influencingPlanets: transitsInArea.map(t => t.planet),
            recommendations: this.getAreaRecommendations(area, impactLevel)
        };
    }

    /**
     * Generate timing guidance based on transits
     * @returns {Object} Timing guidance
     */
    generateTimingGuidance() {
        return {
            favorablePeriods: this.identifyFavorablePeriods(),
            challengingPeriods: this.identifyChallengingPeriods(),
            bestTimesFor: {
                career: this.getBestTimeForActivity('career'),
                finance: this.getBestTimeForActivity('finance'),
                relationships: this.getBestTimeForActivity('relationships'),
                health: this.getBestTimeForActivity('health')
            }
        };
    }

    /**
     * Generate transit recommendations
     * @returns {Array} Recommendations
     */
    generateTransitRecommendations() {
        const recommendations = [];

        const effects = this.calculateTransitEffects();

        if (effects.overallEffect === 'Favorable') {
            recommendations.push({
                type: 'Opportunity',
                priority: 'High',
                advice: 'Current transits are supportive - pursue important goals'
            });
        } else if (effects.overallEffect === 'Challenging') {
            recommendations.push({
                type: 'Caution',
                priority: 'High',
                advice: 'Current transits suggest caution - focus on stability and patience'
            });
        }

        // Add specific recommendations based on major transits
        const majorTransits = this.getMajorTransits();
        majorTransits.forEach(transit => {
            if (transit.strength > 0.7) {
                recommendations.push({
                    type: 'Transit Focus',
                    priority: 'Medium',
                    advice: `${transit.planet} transit is strong - pay attention to ${this.getHouseSignification(transit.house)}`
                });
            }
        });

        return recommendations;
    }

    /**
     * Get area-specific recommendations
     * @param {string} area - Life area
     * @param {string} impactLevel - Impact level
     * @returns {Array} Recommendations
     */
    getAreaRecommendations(area, impactLevel) {
        const recommendations = {
            career: {
                Positive: ['Pursue career advancement', 'Network actively', 'Take on new responsibilities'],
                Challenging: ['Focus on current stability', 'Avoid major changes', 'Strengthen existing position'],
                Neutral: ['Maintain steady progress', 'Plan for future opportunities', 'Build skills']
            },
            finance: {
                Positive: ['Invest in opportunities', 'Expand financial activities', 'Take calculated risks'],
                Challenging: ['Conserve resources', 'Avoid speculation', 'Focus on debt reduction'],
                Neutral: ['Maintain financial discipline', 'Plan for future security', 'Build savings']
            }
        };

        return recommendations[area]?.[impactLevel] || ['General guidance for this area'];
    }

    /**
     * Identify favorable periods
     * @returns {Array} Favorable periods
     */
    identifyFavorablePeriods() {
        return this.getFavorableTransits().map(transit => ({
            period: `${transit.planet} transit`,
            duration: transit.duration,
            focus: transit.effects
        }));
    }

    /**
     * Identify challenging periods
     * @returns {Array} Challenging periods
     */
    identifyChallengingPeriods() {
        return this.getChallengingTransits().map(transit => ({
            period: `${transit.planet} transit`,
            precautions: transit.precautions,
            focus: transit.effects
        }));
    }

    /**
     * Get best time for specific activity
     * @param {string} activity - Activity type
     * @returns {string} Best timing advice
     */
    getBestTimeForActivity(activity) {
        const favorableTransits = this.getFavorableTransits();
        if (favorableTransits.length > 0) {
            return `During ${favorableTransits[0].planet} transit (${favorableTransits[0].duration})`;
        }
        return 'When planetary influences are supportive';
    }

    /**
     * Get transit overview
     * @returns {Object} Transit overview
     */
    getTransitOverview() {
        const analysis = this.analyzeCurrentTransits();

        return {
            overallEffect: analysis.transitEffects.overallEffect,
            dominantInfluence: analysis.transitEffects.dominantInfluence,
            majorTransitsCount: analysis.majorTransits.length,
            favorableTransitsCount: analysis.favorableTransits.length,
            challengingTransitsCount: analysis.challengingTransits.length,
            upcomingSignificantTransits: analysis.upcomingTransits.slice(0, 3)
        };
    }
}

module.exports = TransitAnalyzer;