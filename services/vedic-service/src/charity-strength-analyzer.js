/**
 * ZC1.28 Charity Strength Analyzer
 * Analyzes planetary strengths and afflictions for charity recommendations
 */

const { CHARITY_CONSTANTS } = require('./charity-constants');

class CharityStrengthAnalyzer {
    constructor() {
        this.planetaryConstants = CHARITY_CONSTANTS;
    }

    /**
     * Analyze planetary strengths and afflictions for charity recommendations
     * @param {Object} chart - Birth chart with planetary positions
     * @returns {Object} Planetary analysis for charity guidance
     */
    analyzePlanetaryStrengthsForCharity(chart) {
        const planetaryAnalysis = {};

        for (const planetName in chart.planets) {
            const planet = chart.planets[planetName];
            const strength = this.calculatePlanetaryStrength(planet, chart);
            const afflictions = this.identifyPlanetaryAfflictions(planet, chart);
            const charityNeeds = this.determineCharityNeeds(strength, afflictions, planetName);

            planetaryAnalysis[planetName] = {
                strength: strength,
                afflictions: afflictions,
                charityPriority: charityNeeds.priority,
                recommendedCharities: charityNeeds.charities,
                urgency: charityNeeds.urgency
            };
        }

        return planetaryAnalysis;
    }

    /**
     * Calculate overall planetary strength
     * @param {Object} planet - Planet data
     * @param {Object} chart - Full birth chart
     * @returns {number} Strength score (0-100)
     */
    calculatePlanetaryStrength(planet, chart) {
        if (!planet || !chart) {
            throw new Error('Invalid planet or chart data provided');
        }

        if (typeof planet.longitude !== 'number' || planet.longitude < 0 || planet.longitude >= 360) {
            throw new Error('Invalid planetary longitude');
        }

        if (typeof planet.sign !== 'number' || planet.sign < 0 || planet.sign > 11) {
            throw new Error('Invalid planetary sign');
        }

        if (typeof planet.house !== 'number' || planet.house < 1 || planet.house > 12) {
            throw new Error('Invalid planetary house');
        }

        let strength = 0;

        // Sign strength (own sign = 20, friendly = 15, neutral = 10, enemy = 5)
        const signStrength = this.getSignStrength(planet.name, planet.sign);
        strength += signStrength;

        // House strength (angular = 20, succedent = 15, cadent = 10)
        const houseStrength = this.getHouseStrength(planet.house);
        strength += houseStrength;

        // Aspect strength (benefic aspects add, malefic subtract)
        const aspectStrength = this.calculateAspectStrength(planet, chart);
        strength += aspectStrength;

        // Nakshatra strength
        const nakshatraStrength = this.getNakshatraStrength(planet.nakshatra);
        strength += nakshatraStrength;

        return Math.max(0, Math.min(100, strength));
    }

    /**
     * Get sign strength for a planet
     */
    getSignStrength(planetName, sign) {
        const signStrengths = {
            SUN: { 'Leo': 20, 'Aries': 15, 'Sagittarius': 15, 'Libra': 10, 'Taurus': 10, 'Aquarius': 5, 'Scorpio': 5, 'Pisces': 5 },
            MOON: { 'Cancer': 20, 'Taurus': 15, 'Sagittarius': 15, 'Pisces': 10, 'Virgo': 10, 'Capricorn': 5, 'Scorpio': 5 },
            MARS: { 'Aries': 20, 'Scorpio': 20, 'Capricorn': 15, 'Leo': 15, 'Sagittarius': 10, 'Cancer': 5, 'Libra': 5 },
            MERCURY: { 'Gemini': 20, 'Virgo': 20, 'Libra': 15, 'Aquarius': 15, 'Sagittarius': 10, 'Pisces': 10, 'Leo': 5, 'Scorpio': 5 },
            JUPITER: { 'Sagittarius': 20, 'Pisces': 20, 'Cancer': 15, 'Leo': 15, 'Aries': 10, 'Scorpio': 10, 'Virgo': 5, 'Capricorn': 5 },
            VENUS: { 'Taurus': 20, 'Libra': 20, 'Pisces': 15, 'Sagittarius': 15, 'Cancer': 10, 'Scorpio': 10, 'Virgo': 5, 'Leo': 5 },
            SATURN: { 'Capricorn': 20, 'Aquarius': 20, 'Libra': 15, 'Sagittarius': 15, 'Taurus': 10, 'Virgo': 10, 'Cancer': 5, 'Leo': 5 },
            RAHU: { 'Aquarius': 20, 'Scorpio': 15, 'Pisces': 15, 'Cancer': 10, 'Leo': 10, 'Taurus': 5, 'Virgo': 5 },
            KETU: { 'Scorpio': 20, 'Pisces': 15, 'Aquarius': 15, 'Cancer': 10, 'Leo': 10, 'Taurus': 5, 'Virgo': 5 }
        };

        return signStrengths[planetName]?.[sign] || 10; // Neutral by default
    }

    /**
     * Get house strength
     */
    getHouseStrength(house) {
        const houseStrengths = {
            1: 20, 4: 20, 7: 20, 10: 20, // Angular houses ( Kendra )
            2: 15, 5: 15, 8: 15, 11: 15, // Succedent houses ( Panapara )
            3: 10, 6: 10, 9: 10, 12: 10  // Cadent houses ( Apoklima )
        };

        return houseStrengths[house] || 10;
    }

    /**
     * Calculate aspect strength
     */
    calculateAspectStrength(planet, chart) {
        let aspectStrength = 0;

        // Simplified aspect calculation - in real implementation would use proper aspect calculations
        // This is a placeholder for the concept
        const aspects = this.getAspects(planet, chart);

        aspects.forEach(aspect => {
            if (aspect.type === 'trine' || aspect.type === 'sextile') {
                aspectStrength += 10;
            } else if (aspect.type === 'square' || aspect.type === 'opposition') {
                aspectStrength -= 5;
            }
        });

        return aspectStrength;
    }

    /**
     * Get aspects for a planet (simplified)
     */
    getAspects(planet, chart) {
        // This would be replaced with actual aspect calculation logic
        // For now, return empty array as placeholder
        return [];
    }

    /**
     * Get nakshatra strength
     */
    getNakshatraStrength(nakshatra) {
        // Simplified nakshatra strength - would need full nakshatra data
        const strongNakshatras = ['Rohini', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Uttara Ashadha', 'Uttara Bhadrapada'];

        return strongNakshatras.includes(nakshatra) ? 15 : 10;
    }

    /**
     * Identify planetary afflictions requiring charity
     */
    identifyPlanetaryAfflictions(planet, chart) {
        const afflictions = [];

        // Debilitation
        if (this.isDebilitated(planet.name, planet.sign)) {
            afflictions.push({
                type: 'debilitation',
                severity: 'high',
                description: `${planet.name} is debilitated in ${this.getSignName(planet.sign)}`
            });
        }

        // Combustion
        if (this.isCombust(planet, chart.planets.SUN)) {
            afflictions.push({
                type: 'combustion',
                severity: 'high',
                description: `${planet.name} is combust (too close to Sun)`
            });
        }

        // Malefic aspects
        const maleficAspects = this.getMaleficAspects(planet, chart);
        if (maleficAspects.length > 0) {
            afflictions.push({
                type: 'malefic_aspects',
                severity: maleficAspects.length > 2 ? 'high' : 'medium',
                description: `${planet.name} has ${maleficAspects.length} malefic aspects`
            });
        }

        // House afflictions (Dusthana houses: 6, 8, 12)
        if ([6, 8, 12].includes(planet.house)) {
            afflictions.push({
                type: 'dusthana_house',
                severity: 'medium',
                description: `${planet.name} is in dusthana house ${planet.house}`
            });
        }

        return afflictions;
    }

    /**
     * Check if planet is debilitated
     */
    isDebilitated(planetName, sign) {
        const debilitationSigns = {
            SUN: 'Libra',
            MOON: 'Scorpio',
            MARS: 'Cancer',
            MERCURY: 'Pisces',
            JUPITER: 'Capricorn',
            VENUS: 'Virgo',
            SATURN: 'Aries',
            RAHU: 'Scorpio',
            KETU: 'Taurus'
        };

        return debilitationSigns[planetName] === sign;
    }

    /**
     * Check if planet is combust
     */
    isCombust(planet, sun) {
        if (!sun || planet.name === 'SUN') return false;

        // Simplified combustion check - within 8 degrees of Sun
        const angularDistance = Math.abs(planet.longitude - sun.longitude);
        return angularDistance <= 8;
    }

    /**
     * Get malefic aspects (simplified)
     */
    getMaleficAspects(planet, chart) {
        // This would be replaced with actual aspect calculation
        // For now, return empty array as placeholder
        return [];
    }

    /**
     * Get sign name from number (simplified)
     */
    getSignName(signNumber) {
        const signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        return signs[signNumber - 1] || 'Unknown';
    }

    /**
     * Determine charity needs based on planetary analysis
     */
    determineCharityNeeds(strength, afflictions, planetName) {
        let priority = 'low';
        let urgency = 'low';
        const charities = [];

        // Calculate severity score
        let severityScore = 0;

        afflictions.forEach(affliction => {
            switch (affliction.severity) {
                case 'high': severityScore += 3; break;
                case 'medium': severityScore += 2; break;
                case 'low': severityScore += 1; break;
            }
        });

        // Adjust for planetary strength
        if (strength < 30) severityScore += 2;
        else if (strength < 50) severityScore += 1;

        // Determine priority and urgency
        if (severityScore >= 5) {
            priority = 'high';
            urgency = 'immediate';
        } else if (severityScore >= 3) {
            priority = 'medium';
            urgency = 'soon';
        } else if (severityScore >= 1) {
            priority = 'low';
            urgency = 'when_convenient';
        }

        // Get planet-specific charities
        const planetCharityData = this.planetaryConstants[planetName];
        if (planetCharityData) {
            charities.push(...planetCharityData.recommendedCharities);
        }

        // Add general charities based on afflictions
        if (afflictions.some(a => a.type === 'debilitation')) {
            charities.push({
                item: 'General donation',
                recipient: 'Temples',
                significance: 'Strengthens debilitated planet'
            });
        }

        return {
            priority: priority,
            urgency: urgency,
            charities: charities
        };
    }
}

module.exports = CharityStrengthAnalyzer;