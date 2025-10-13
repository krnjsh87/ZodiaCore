/**
 * ZC1.27 Yantra Recommendation Engine
 * Analyzes birth charts and recommends appropriate Yantras based on astrological needs
 */

const { PLANETARY_YANTRAS, DEITY_YANTRAS, PURPOSE_YANTRAS, COMPATIBILITY_CONSTANTS } = require('./yantra-sacred-geometry-constants');

class YantraRecommendationEngine {
    constructor(astrologyEngine) {
        this.astrologyEngine = astrologyEngine;
        this.compatibilityCache = new Map();
    }

    /**
     * Generate comprehensive Yantra recommendations for a user
     * @param {Object} birthChart - Complete Vedic birth chart
     * @param {Object} userPreferences - User goals and preferences
     * @returns {Object} Complete recommendation package
     */
    generateRecommendations(birthChart, userPreferences = {}) {
        try {
            // Step 1: Analyze astrological needs
            const needs = this.analyzeChartNeeds(birthChart);

            // Step 2: Calculate Yantra compatibility scores
            const yantraScores = this.calculateYantraCompatibility(birthChart, needs);

            // Step 3: Generate prioritized recommendations
            const recommendations = this.createRecommendations(yantraScores, userPreferences);

            // Step 4: Add complementary Yantras
            recommendations.complementary = this.generateComplementaryYantras(birthChart, userPreferences);

            // Step 5: Generate usage precautions
            recommendations.precautions = this.generatePrecautions(birthChart, recommendations);

            return recommendations;

        } catch (error) {
            throw new Error(`Yantra recommendation generation failed: ${error.message}`);
        }
    }

    /**
     * Analyze birth chart to identify primary remedial needs
     * @param {Object} birthChart - Birth chart data
     * @returns {Array} Array of identified needs
     */
    analyzeChartNeeds(birthChart) {
        const needs = [];

        // Check for weak or afflicted planets
        const weakPlanets = this.identifyWeakPlanets(birthChart);
        if (weakPlanets.length > 0) {
            needs.push({
                type: 'PLANETARY_STRENGTH',
                planets: weakPlanets,
                priority: 'HIGH'
            });
        }

        // Check for challenging house placements
        const challengingHouses = this.identifyChallengingHouses(birthChart);
        if (challengingHouses.length > 0) {
            needs.push({
                type: 'HOUSE_HARMONIZATION',
                houses: challengingHouses,
                priority: 'MEDIUM'
            });
        }

        // Check for desired life areas
        const lifeGoals = this.identifyLifeGoals(birthChart);
        if (lifeGoals.length > 0) {
            needs.push({
                type: 'GOAL_MANIFESTATION',
                goals: lifeGoals,
                priority: 'MEDIUM'
            });
        }

        // Check for current Dasha influences
        const dashaNeeds = this.analyzeDashaNeeds(birthChart);
        if (dashaNeeds.length > 0) {
            needs.push({
                type: 'DASHA_HARMONIZATION',
                dasha: dashaNeeds,
                priority: 'HIGH'
            });
        }

        return needs;
    }

    /**
     * Identify weak or afflicted planets requiring Yantra support
     * @param {Object} birthChart - Birth chart data
     * @returns {Array} Weak planets with affliction scores
     */
    identifyWeakPlanets(birthChart) {
        const weakPlanets = [];

        for (const [planet, data] of Object.entries(birthChart.planets || {})) {
            let weaknessScore = 0;

            // Check debilitation
            if (this.isDebilitated(planet, data.sign)) weaknessScore += 3;

            // Check enemy sign
            if (this.isEnemySign(planet, data.sign)) weaknessScore += 2;

            // Check aspects from malefics
            const maleficAspects = this.countMaleficAspects(planet, birthChart);
            weaknessScore += maleficAspects;

            // Check house placement
            if (this.isBadHouses(data.house)) weaknessScore += 1;

            // Check retrograde status
            if (data.retrograde) weaknessScore += 1;

            // Check combustion
            if (this.isCombust(planet, data.longitude, birthChart.planets.SUN?.longitude)) weaknessScore += 2;

            if (weaknessScore >= 4) {
                weakPlanets.push({
                    planet: planet,
                    weaknessScore: weaknessScore,
                    primaryIssues: this.identifyIssues(planet, data),
                    sign: data.sign,
                    house: data.house
                });
            }
        }

        return weakPlanets.sort((a, b) => b.weaknessScore - a.weaknessScore);
    }

    /**
     * Identify challenging house placements
     * @param {Object} birthChart - Birth chart data
     * @returns {Array} Challenging houses
     */
    identifyChallengingHouses(birthChart) {
        const challengingHouses = [];
        const houses = birthChart.houses || [];

        // Check for malefic influences in key houses
        const keyHouses = [1, 4, 5, 7, 9, 10]; // Self, home, children, partner, fortune, career

        for (const houseNum of keyHouses) {
            const house = houses[houseNum - 1];
            if (house) {
                const maleficCount = this.countMaleficsInHouse(houseNum, birthChart);
                if (maleficCount >= 2) {
                    challengingHouses.push({
                        house: houseNum,
                        significance: this.getHouseSignificance(houseNum),
                        maleficCount: maleficCount
                    });
                }
            }
        }

        return challengingHouses;
    }

    /**
     * Identify life goals based on chart analysis
     * @param {Object} birthChart - Birth chart data
     * @returns {Array} Life goals
     */
    identifyLifeGoals(birthChart) {
        const goals = [];

        // Analyze 10th house for career goals
        if (this.hasBeneficInfluence(10, birthChart)) {
            goals.push({ type: 'CAREER_SUCCESS', house: 10 });
        }

        // Analyze 7th house for relationships
        if (this.needsHarmonization(7, birthChart)) {
            goals.push({ type: 'RELATIONSHIP_HARMONY', house: 7 });
        }

        // Analyze 2nd house for wealth
        if (this.hasBeneficInfluence(2, birthChart)) {
            goals.push({ type: 'FINANCIAL_STABILITY', house: 2 });
        }

        // Analyze 5th house for children/education
        if (this.needsHarmonization(5, birthChart)) {
            goals.push({ type: 'FAMILY_HARMONY', house: 5 });
        }

        return goals;
    }

    /**
     * Analyze current Dasha needs
     * @param {Object} birthChart - Birth chart data
     * @returns {Array} Dasha-related needs
     */
    analyzeDashaNeeds(birthChart) {
        const dashaNeeds = [];

        // Get current Dasha (simplified - would need actual Dasha calculator)
        const currentDasha = this.getCurrentDasha(birthChart);

        if (currentDasha) {
            // Check if Dasha lord is weak
            const dashaLordStrength = this.getPlanetStrength(birthChart, currentDasha.planet);

            if (dashaLordStrength < 50) {
                dashaNeeds.push({
                    planet: currentDasha.planet,
                    period: currentDasha.period,
                    strength: dashaLordStrength,
                    need: 'DASHA_LORD_STRENGTH'
                });
            }

            // Check for challenging transits during Dasha
            const challengingTransits = this.identifyChallengingTransits(currentDasha);
            if (challengingTransits.length > 0) {
                dashaNeeds.push({
                    planet: currentDasha.planet,
                    transits: challengingTransits,
                    need: 'TRANSIT_MITIGATION'
                });
            }
        }

        return dashaNeeds;
    }

    /**
     * Calculate compatibility scores for all Yantras
     * @param {Object} birthChart - Birth chart data
     * @param {Array} needs - Identified needs
     * @returns {Object} Yantra compatibility scores
     */
    calculateYantraCompatibility(birthChart, needs) {
        const scores = {};

        // Calculate scores for planetary Yantras
        for (const [planet, yantra] of Object.entries(PLANETARY_YANTRAS)) {
            scores[planet] = this.calculateCompatibilityScore(birthChart, yantra, needs);
        }

        // Calculate scores for deity Yantras
        for (const [deity, yantra] of Object.entries(DEITY_YANTRAS)) {
            scores[deity] = this.calculateCompatibilityScore(birthChart, yantra, needs);
        }

        // Calculate scores for purpose Yantras
        for (const [category, categoryYantras] of Object.entries(PURPOSE_YANTRAS)) {
            for (const [purpose, yantra] of Object.entries(categoryYantras)) {
                scores[purpose] = this.calculateCompatibilityScore(birthChart, yantra, needs);
            }
        }

        return scores;
    }

    /**
     * Calculate compatibility score for a specific Yantra
     * @param {Object} birthChart - Birth chart data
     * @param {Object} yantra - Yantra configuration
     * @param {Array} needs - Identified needs
     * @returns {Object} Compatibility score and reasons
     */
    calculateCompatibilityScore(birthChart, yantra, needs) {
        let score = 50; // Base score
        const reasons = [];

        // Planetary affinity (40% weight)
        if (yantra.planet) {
            const planetStrength = this.getPlanetStrength(birthChart, yantra.planet);
            const affinityScore = (planetStrength - 50) * COMPATIBILITY_CONSTANTS.WEIGHTS.PLANETARY_AFFINITY;
            score += affinityScore;
            reasons.push(`Planetary affinity: ${planetStrength}%`);
        }

        // Elemental balance (30% weight)
        const elementalScore = this.calculateElementalCompatibility(birthChart, yantra);
        score += elementalScore * COMPATIBILITY_CONSTANTS.WEIGHTS.ELEMENTAL_BALANCE;
        reasons.push(`Elemental compatibility: ${elementalScore}%`);

        // Purpose alignment (20% weight)
        const purposeScore = this.calculatePurposeAlignment(birthChart, yantra, needs);
        score += purposeScore * COMPATIBILITY_CONSTANTS.WEIGHTS.PURPOSE_ALIGNMENT;
        reasons.push(`Purpose alignment: ${purposeScore}%`);

        // Geometric harmonics (10% weight)
        const harmonicScore = this.calculateGeometricHarmonics(birthChart, yantra);
        score += harmonicScore * COMPATIBILITY_CONSTANTS.WEIGHTS.GEOMETRIC_HARMONICS;
        reasons.push(`Geometric harmonics: ${harmonicScore}%`);

        // Ensure score is within bounds
        score = Math.max(0, Math.min(100, score));

        return {
            score: Math.round(score),
            reasons: reasons,
            yantra: yantra
        };
    }

    /**
     * Calculate elemental compatibility
     * @param {Object} birthChart - Birth chart data
     * @param {Object} yantra - Yantra configuration
     * @returns {number} Elemental compatibility score
     */
    calculateElementalCompatibility(birthChart, yantra) {
        const chartElements = this.analyzeChartElements(birthChart);
        const yantraElements = yantra.elements || [];

        let compatibility = 0;

        // Check for complementary elements
        if (yantraElements.includes('Gold') && chartElements.fire < 0.3) {
            compatibility += 20; // Gold strengthens fire deficiency
        }

        if (yantraElements.includes('Silver') && chartElements.water < 0.3) {
            compatibility += 20; // Silver strengthens water deficiency
        }

        if (yantraElements.includes('Copper') && chartElements.earth < 0.3) {
            compatibility += 15; // Copper strengthens earth deficiency
        }

        // Check directional alignment
        const favorableDirection = this.getFavorableDirection(birthChart);
        if (yantraElements.includes(favorableDirection)) {
            compatibility += 15;
        }

        return Math.min(compatibility, 100);
    }

    /**
     * Calculate purpose alignment score
     * @param {Object} birthChart - Birth chart data
     * @param {Object} yantra - Yantra configuration
     * @param {Array} needs - Identified needs
     * @returns {number} Purpose alignment score
     */
    calculatePurposeAlignment(birthChart, yantra, needs) {
        let alignment = 0;

        for (const need of needs) {
            switch (need.type) {
                case 'PLANETARY_STRENGTH':
                    if (yantra.planet && need.planets.some(p => p.planet === yantra.planet)) {
                        alignment += 40;
                    }
                    break;
                case 'HOUSE_HARMONIZATION':
                    if (this.yantraHelpsHouse(yantra, need.houses)) {
                        alignment += 30;
                    }
                    break;
                case 'GOAL_MANIFESTATION':
                    if (this.yantraSupportsGoals(yantra, need.goals)) {
                        alignment += 25;
                    }
                    break;
                case 'DASHA_HARMONIZATION':
                    if (yantra.planet && need.dasha.some(d => d.planet === yantra.planet)) {
                        alignment += 35;
                    }
                    break;
            }
        }

        return Math.min(alignment, 100);
    }

    /**
     * Calculate geometric harmonics score
     * @param {Object} birthChart - Birth chart data
     * @param {Object} yantra - Yantra configuration
     * @returns {number} Geometric harmonics score
     */
    calculateGeometricHarmonics(birthChart, yantra) {
        // Simplified geometric harmonics calculation
        // In a full implementation, this would analyze birth chart geometry
        // against Yantra sacred geometry patterns

        let harmonics = 50; // Base harmony

        // Adjust based on chart complexity
        const planetCount = Object.keys(birthChart.planets || {}).length;
        if (planetCount > 7) {
            harmonics += 10; // Complex charts benefit from complex Yantras
        }

        // Adjust based on Yantra complexity
        if (yantra.geometry?.includes('complex') || yantra.geometry?.includes('interlocking')) {
            harmonics += 15;
        }

        return Math.min(harmonics, 100);
    }

    /**
     * Create prioritized recommendations from compatibility scores
     * @param {Object} yantraScores - Compatibility scores for all Yantras
     * @param {Object} userPreferences - User preferences
     * @returns {Object} Prioritized recommendations
     */
    createRecommendations(yantraScores, userPreferences) {
        const recommendations = {
            primary: null,
            secondary: [],
            rationale: []
        };

        // Sort Yantras by compatibility score
        const sortedYantras = Object.entries(yantraScores)
            .sort(([,a], [,b]) => b.score - a.score);

        if (sortedYantras.length > 0) {
            // Primary recommendation
            const [primaryKey, primaryData] = sortedYantras[0];
            recommendations.primary = {
                yantra: primaryData.yantra,
                score: primaryData.score,
                reasons: primaryData.reasons,
                priority: 'PRIMARY'
            };

            // Secondary recommendations (up to 2)
            for (let i = 1; i < Math.min(sortedYantras.length, 3); i++) {
                const [key, data] = sortedYantras[i];
                recommendations.secondary.push({
                    yantra: data.yantra,
                    score: data.score,
                    reasons: data.reasons,
                    priority: 'SECONDARY'
                });
            }
        }

        // Generate rationale
        recommendations.rationale = this.generateRecommendationRationale(recommendations, userPreferences);

        return recommendations;
    }

    /**
     * Generate complementary Yantras based on user goals
     * @param {Object} birthChart - Birth chart data
     * @param {Object} userPreferences - User preferences
     * @returns {Array} Complementary Yantras
     */
    generateComplementaryYantras(birthChart, userPreferences) {
        const complementary = [];

        if (userPreferences.goals) {
            for (const goal of userPreferences.goals) {
                const yantra = this.findYantraForGoal(goal, birthChart);
                if (yantra) {
                    complementary.push({
                        yantra: yantra,
                        purpose: goal,
                        priority: 'COMPLEMENTARY'
                    });
                }
            }
        }

        return complementary;
    }

    /**
     * Generate usage precautions
     * @param {Object} birthChart - Birth chart data
     * @param {Object} recommendations - Yantra recommendations
     * @returns {Array} Precautions and warnings
     */
    generatePrecautions(birthChart, recommendations) {
        const precautions = [];

        // Check for contraindications
        if (recommendations.primary) {
            const primaryYantra = recommendations.primary.yantra;
            if (primaryYantra.contraindications) {
                precautions.push(...primaryYantra.contraindications);
            }
        }

        // General precautions
        precautions.push(
            "Consult with a qualified astrologer before starting Yantra practice",
            "Maintain purity and devotion during usage",
            "Do not use Yantras for harmful purposes",
            "Store Yantras in clean, sacred space",
            "Regular maintenance and energization required"
        );

        // Chart-specific precautions
        if (this.hasMaleficInfluence(birthChart)) {
            precautions.push("Extra purification rituals recommended due to malefic influences");
        }

        return precautions;
    }

    // Helper Methods

    isDebilitated(planet, sign) {
        const debilitationSigns = {
            SUN: 'Libra', MOON: 'Scorpio', MARS: 'Cancer', MERCURY: 'Pisces',
            JUPITER: 'Capricorn', VENUS: 'Virgo', SATURN: 'Aries', RAHU: 'Scorpio', KETU: 'Taurus'
        };
        return debilitationSigns[planet] === sign;
    }

    isEnemySign(planet, sign) {
        // Simplified enemy sign check
        const enemySigns = {
            SUN: ['Venus', 'Saturn'], MOON: ['Rahu', 'Ketu'], MARS: ['Mercury'],
            MERCURY: ['Moon'], JUPITER: ['Mercury', 'Venus'], VENUS: ['Sun', 'Moon'],
            SATURN: ['Sun', 'Moon', 'Mars']
        };
        return enemySigns[planet]?.includes(sign) || false;
    }

    countMaleficAspects(planet, birthChart) {
        // Simplified aspect counting
        const malefics = ['MARS', 'SATURN', 'RAHU', 'KETU'];
        let count = 0;

        for (const malefic of malefics) {
            if (malefic !== planet && this.hasAspect(malefic, planet, birthChart)) {
                count++;
            }
        }

        return count;
    }

    isBadHouses(house) {
        return [6, 8, 12].includes(house); // Dusthana houses
    }

    isCombust(planet, planetLng, sunLng) {
        if (!sunLng || planet === 'SUN') return false;
        const distance = Math.abs(planetLng - sunLng);
        return distance <= 8.5; // Degrees for combustion
    }

    countMaleficsInHouse(houseNum, birthChart) {
        const malefics = ['MARS', 'SATURN', 'RAHU', 'KETU'];
        let count = 0;

        for (const [planet, data] of Object.entries(birthChart.planets || {})) {
            if (malefics.includes(planet) && data.house === houseNum) {
                count++;
            }
        }

        return count;
    }

    getHouseSignificance(houseNum) {
        const significances = {
            1: 'Self and personality', 4: 'Home and emotions', 5: 'Children and creativity',
            7: 'Relationships and partnerships', 9: 'Fortune and spirituality',
            10: 'Career and reputation'
        };
        return significances[houseNum] || 'General life area';
    }

    hasBeneficInfluence(houseNum, birthChart) {
        const benefics = ['JUPITER', 'VENUS', 'MERCURY'];
        return benefics.some(planet =>
            birthChart.planets?.[planet]?.house === houseNum
        );
    }

    needsHarmonization(houseNum, birthChart) {
        return this.countMaleficsInHouse(houseNum, birthChart) > 0;
    }

    getCurrentDasha(birthChart) {
        // Simplified - would integrate with actual Dasha calculator
        return {
            planet: 'JUPITER', // Example
            period: '2024-2028',
            subPeriod: 'VENUS'
        };
    }

    getPlanetStrength(birthChart, planet) {
        // Simplified strength calculation
        const data = birthChart.planets?.[planet];
        if (!data) return 50;

        let strength = 50;

        // Dignity factors
        if (this.isOwnSign(planet, data.sign)) strength += 20;
        if (this.isExalted(planet, data.sign)) strength += 25;
        if (this.isDebilitated(planet, data.sign)) strength -= 25;

        // House factors
        if ([1, 4, 5, 9, 10].includes(data.house)) strength += 10;
        if ([6, 8, 12].includes(data.house)) strength -= 10;

        return Math.max(0, Math.min(100, strength));
    }

    isOwnSign(planet, sign) {
        const ownSigns = {
            SUN: ['Leo'], MOON: ['Cancer'], MARS: ['Aries', 'Scorpio'],
            MERCURY: ['Gemini', 'Virgo'], JUPITER: ['Sagittarius', 'Pisces'],
            VENUS: ['Taurus', 'Libra'], SATURN: ['Capricorn', 'Aquarius']
        };
        return ownSigns[planet]?.includes(sign) || false;
    }

    isExalted(planet, sign) {
        const exaltationSigns = {
            SUN: 'Aries', MOON: 'Taurus', MARS: 'Capricorn', MERCURY: 'Virgo',
            JUPITER: 'Cancer', VENUS: 'Pisces', SATURN: 'Libra'
        };
        return exaltationSigns[planet] === sign;
    }

    hasAspect(aspecting, aspected, birthChart) {
        // Simplified aspect checking
        return Math.random() > 0.7; // Placeholder
    }

    identifyChallengingTransits(dasha) {
        // Simplified transit analysis
        return []; // Would implement actual transit checking
    }

    analyzeChartElements(birthChart) {
        // Simplified elemental analysis
        return {
            fire: 0.4, earth: 0.3, air: 0.2, water: 0.1
        };
    }

    getFavorableDirection(birthChart) {
        // Simplified directional analysis
        return 'East'; // Would analyze chart for favorable direction
    }

    yantraHelpsHouse(yantra, houses) {
        // Simplified house-Yantra relationship
        return Math.random() > 0.6;
    }

    yantraSupportsGoals(yantra, goals) {
        // Simplified goal-Yantra relationship
        return Math.random() > 0.7;
    }

    hasMaleficInfluence(birthChart) {
        // Check for strong malefic influences
        const malefics = ['MARS', 'SATURN', 'RAHU', 'KETU'];
        return malefics.some(planet =>
            this.getPlanetStrength(birthChart, planet) > 60
        );
    }

    generateRecommendationRationale(recommendations, userPreferences) {
        const rationale = [];

        if (recommendations.primary) {
            rationale.push(`Primary Yantra ${recommendations.primary.yantra.name} selected for highest compatibility score of ${recommendations.primary.score}%`);
        }

        if (recommendations.secondary.length > 0) {
            rationale.push(`${recommendations.secondary.length} secondary Yantras recommended for additional support`);
        }

        return rationale;
    }

    findYantraForGoal(goal, birthChart) {
        // Simplified goal-to-Yantra mapping
        const goalMappings = {
            WEALTH: PURPOSE_YANTRAS.WEALTH.KUBERA_YANTRA,
            RELATIONSHIPS: PURPOSE_YANTRAS.WEALTH.LAKSHMI_YANTRA, // Simplified
            HEALTH: PURPOSE_YANTRAS.HEALTH.DHANVANTARI_YANTRA,
            PROTECTION: PURPOSE_YANTRAS.PROTECTION.DURGA_YANTRA,
            SPIRITUALITY: DEITY_YANTRAS.SRI_YANTRA
        };

        return goalMappings[goal.type];
    }

    identifyIssues(planet, data) {
        const issues = [];
        if (this.isDebilitated(planet, data.sign)) issues.push('debilitated');
        if (this.isEnemySign(planet, data.sign)) issues.push('enemy_sign');
        if (this.isBadHouses(data.house)) issues.push('bad_house');
        if (data.retrograde) issues.push('retrograde');
        return issues;
    }
}

module.exports = YantraRecommendationEngine;