/**
 * ZodiaCore - Western Medical Astrology Analyzer
 *
 * Core analyzer for Western medical astrology health assessments.
 * Performs comprehensive analysis of planetary positions, aspects, and houses
 * to determine health predispositions and constitutional types.
 *
 * @version 3.10.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    RISK_LEVELS,
    DIGNITY_WEIGHTS,
    ASPECT_INFLUENCES,
    HOUSE_WEIGHTS,
    ACCURACY_THRESHOLDS,
    WESTERN_PLANETARY_RULERSHIPS,
    ZODIAC_SIGN_RULERSHIPS,
    WESTERN_RULERSHIPS,
    WESTERN_EXALTATIONS,
    WESTERN_DETRIMENTS,
    WESTERN_FALLS,
    CONSTITUTION_STRENGTHS,
    CONSTITUTION_VULNERABILITIES,
    HOUSE_HEALTH_FOCUS
} = require('./western-medical-astrology-constants');

/**
 * Western Medical Astrology Analyzer Class
 * Performs comprehensive health analysis based on Western astrological principles
 */
class WesternMedicalAstrologyAnalyzer {
    /**
     * Constructor for the analyzer
     * @param {Object} birthChart - Complete birth chart data
     */
    constructor(birthChart) {
        this.chart = birthChart;
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
        if (!this.chart.houses || this.chart.houses.length !== 12) {
            throw new Error('Invalid birth chart: missing or incomplete house data');
        }
    }

    /**
     * Perform complete health analysis
     * @returns {Object} Comprehensive health analysis
     */
    analyzeHealthProfile() {
        const planetaryHealth = this.analyzePlanetaryHealth();
        const signHealth = this.analyzeSignHealth();
        const houseHealth = this.analyzeHouseHealth();
        const aspectHealth = this.analyzeAspectHealth();
        const constitution = this.determineConstitution();

        const overallRisk = this.calculateOverallRisk(planetaryHealth, signHealth, houseHealth, aspectHealth);

        return {
            planetaryHealth: planetaryHealth,
            signHealth: signHealth,
            houseHealth: houseHealth,
            aspectHealth: aspectHealth,
            constitution: constitution,
            overallRisk: overallRisk,
            recommendations: this.generateRecommendations(overallRisk),
            generatedAt: new Date(),
            systemVersion: 'ZC3.10'
        };
    }

    /**
     * Analyze planetary health influences
     * @returns {Object} Planetary health analysis
     */
    analyzePlanetaryHealth() {
        const planetaryHealth = {};

        for (const [planet, data] of Object.entries(this.chart.planets)) {
            const dignity = this.calculatePlanetaryDignity(planet, data.longitude);
            const aspects = this.findAspects(data.longitude, this.chart.planets);
            const house = this.getHouseForLongitude(data.longitude);

            const healthScore = this.calculatePlanetaryHealthScore(planet, dignity, aspects, house);

            planetaryHealth[planet] = {
                dignity: dignity,
                aspects: aspects,
                house: house,
                healthScore: healthScore,
                riskLevel: this.getRiskLevel(healthScore),
                bodyParts: WESTERN_PLANETARY_RULERSHIPS[planet]?.primary || [],
                potentialIssues: WESTERN_PLANETARY_RULERSHIPS[planet]?.diseases || []
            };
        }

        return planetaryHealth;
    }

    /**
     * Analyze sign-based health influences
     * @returns {Object} Sign health analysis
     */
    analyzeSignHealth() {
        const signHealth = {};

        for (let i = 0; i < 12; i++) {
            const signData = ZODIAC_SIGN_RULERSHIPS[Object.keys(ZODIAC_SIGN_RULERSHIPS)[i]];
            const planetsInSign = this.getPlanetsInSign(i);

            const signStrength = this.calculateSignStrength(i, planetsInSign);
            const healthScore = this.calculateSignHealthScore(signData, planetsInSign);

            signHealth[Object.keys(ZODIAC_SIGN_RULERSHIPS)[i]] = {
                bodyParts: signData.body_parts,
                systems: signData.systems,
                planets: planetsInSign,
                strength: signStrength,
                healthScore: healthScore,
                riskLevel: this.getRiskLevel(healthScore),
                potentialIssues: signData.diseases
            };
        }

        return signHealth;
    }

    /**
     * Analyze house-based health influences
     * @returns {Object} House health analysis
     */
    analyzeHouseHealth() {
        const houseHealth = {};

        for (let i = 1; i <= 12; i++) {
            const planetsInHouse = this.getPlanetsInHouse(i);
            const houseSignificator = this.getHouseSignificator(i);

            const healthScore = this.calculateHouseHealthScore(i, planetsInHouse, houseSignificator);

            houseHealth[i] = {
                planets: planetsInHouse,
                significator: houseSignificator,
                healthFocus: HOUSE_HEALTH_FOCUS[i],
                healthScore: healthScore,
                riskLevel: this.getRiskLevel(healthScore)
            };
        }

        return houseHealth;
    }

    /**
     * Analyze aspect-based health influences
     * @returns {Array} Aspect health analysis
     */
    analyzeAspectHealth() {
        const aspectHealth = [];

        for (const [planet1, data1] of Object.entries(this.chart.planets)) {
            for (const [planet2, data2] of Object.entries(this.chart.planets)) {
                if (planet1 !== planet2) {
                    const aspects = this.findAspects(data1.longitude, data2.longitude);
                    for (const aspect of aspects) {
                        const healthImpact = this.calculateAspectHealthImpact(planet1, planet2, aspect);

                        aspectHealth.push({
                            planets: [planet1, planet2],
                            aspect: aspect,
                            healthImpact: healthImpact,
                            description: this.getAspectHealthDescription(planet1, planet2, aspect)
                        });
                    }
                }
            }
        }

        return aspectHealth;
    }

    /**
     * Determine constitutional type
     * @returns {Object} Constitution analysis
     */
    determineConstitution() {
        const sunSign = this.getSunSign();
        const moonSign = this.getMoonSign();
        const ascendant = this.getAscendantSign();

        const temperament = this.calculateTemperament(sunSign, moonSign, ascendant);
        const constitutionType = this.classifyConstitution(temperament);

        return {
            sunSign: sunSign,
            moonSign: moonSign,
            ascendant: ascendant,
            temperament: temperament,
            constitutionType: constitutionType,
            strengths: CONSTITUTION_STRENGTHS[constitutionType] || [],
            vulnerabilities: CONSTITUTION_VULNERABILITIES[constitutionType] || []
        };
    }

    /**
     * Calculate planetary dignity
     * @param {string} planet - Planet name
     * @param {number} longitude - Planetary longitude
     * @returns {number} Dignity score
     */
    calculatePlanetaryDignity(planet, longitude) {
        const signIndex = Math.floor(longitude / 30);
        let dignityScore = 0;

        // Rulership
        if (WESTERN_RULERSHIPS[planet] && WESTERN_RULERSHIPS[planet].includes(signIndex)) {
            dignityScore += DIGNITY_WEIGHTS.RULERSHIP;
        }

        // Exaltation
        if (WESTERN_EXALTATIONS[planet] === signIndex) {
            dignityScore += DIGNITY_WEIGHTS.EXALTATION;
        }

        // Detriment
        const detriment = WESTERN_DETRIMENTS[planet];
        if (detriment && (Array.isArray(detriment) ? detriment.includes(signIndex) : detriment === signIndex)) {
            dignityScore += DIGNITY_WEIGHTS.DETRIMENT;
        }

        // Fall
        if (WESTERN_FALLS[planet] === signIndex) {
            dignityScore += DIGNITY_WEIGHTS.FALL;
        }

        return dignityScore;
    }

    /**
     * Find aspects for a planet
     * @param {number} planetLongitude - Planet's longitude
     * @param {Object} allPlanets - All planetary data
     * @returns {Array} Aspects found
     */
    findAspects(planetLongitude, allPlanets) {
        const aspects = [];

        for (const [otherPlanet, data] of Object.entries(allPlanets)) {
            const separation = Math.abs(planetLongitude - data.longitude);
            const normalizedSeparation = Math.min(separation, 360 - separation);

            // Check major aspects
            const majorAspects = [
                { name: 'CONJUNCTION', angle: 0, orb: ACCURACY_THRESHOLDS.ASPECT_ORB_TOLERANCE },
                { name: 'SEXTILE', angle: 60, orb: 6 },
                { name: 'SQUARE', angle: 90, orb: 8 },
                { name: 'TRINE', angle: 120, orb: 8 },
                { name: 'OPPOSITION', angle: 180, orb: ACCURACY_THRESHOLDS.ASPECT_ORB_TOLERANCE },
                { name: 'QUINCUNX', angle: 150, orb: 4 }
            ];

            for (const aspect of majorAspects) {
                if (Math.abs(normalizedSeparation - aspect.angle) <= aspect.orb) {
                    aspects.push({
                        type: aspect.name,
                        orb: Math.abs(normalizedSeparation - aspect.angle),
                        applying: normalizedSeparation < aspect.angle
                    });
                }
            }
        }

        return aspects;
    }

    /**
     * Calculate planetary health score
     * @param {string} planet - Planet name
     * @param {number} dignity - Dignity score
     * @param {Array} aspects - Planetary aspects
     * @param {number} house - House placement
     * @returns {number} Health score
     */
    calculatePlanetaryHealthScore(planet, dignity, aspects, house) {
        const houseWeight = HOUSE_WEIGHTS[house] || 0.1;
        const aspectScore = aspects.reduce((sum, aspect) =>
            sum + (ASPECT_INFLUENCES[aspect.type] || 0), 0);

        return Math.max(0, Math.min(100, (dignity * 0.4) + (houseWeight * 0.3) + (aspectScore * 0.3)));
    }

    /**
     * Get house for longitude
     * @param {number} longitude - Longitude in degrees
     * @returns {number} House number (1-12)
     */
    getHouseForLongitude(longitude) {
        const ascendant = this.chart.houses[0];
        let relativeLongitude = (longitude - ascendant + 360) % 360;

        return Math.floor(relativeLongitude / 30) + 1;
    }

    /**
     * Get planets in a sign
     * @param {number} signIndex - Sign index (0-11)
     * @returns {Array} Planets in sign
     */
    getPlanetsInSign(signIndex) {
        const planets = [];
        const signStart = signIndex * 30;
        const signEnd = (signIndex + 1) * 30;

        for (const [planet, data] of Object.entries(this.chart.planets)) {
            if (data.longitude >= signStart && data.longitude < signEnd) {
                planets.push(planet);
            }
        }

        return planets;
    }

    /**
     * Calculate sign strength
     * @param {number} signIndex - Sign index
     * @param {Array} planetsInSign - Planets in sign
     * @returns {number} Strength score
     */
    calculateSignStrength(signIndex, planetsInSign) {
        let strength = planetsInSign.length * 10; // Base strength from planet count

        // Add strength for ruling planets
        for (const planet of planetsInSign) {
            if (WESTERN_RULERSHIPS[planet] && WESTERN_RULERSHIPS[planet].includes(signIndex)) {
                strength += 15;
            }
            if (WESTERN_EXALTATIONS[planet] === signIndex) {
                strength += 10;
            }
        }

        return Math.min(100, strength);
    }

    /**
     * Calculate sign health score
     * @param {Object} signData - Sign rulership data
     * @param {Array} planetsInSign - Planets in sign
     * @returns {number} Health score
     */
    calculateSignHealthScore(signData, planetsInSign) {
        let score = 50; // Base score

        // Adjust based on planet count and nature
        const planetCount = planetsInSign.length;
        score += (planetCount - 2) * 5; // Optimal 2 planets

        // Adjust for challenging planets
        const challengingPlanets = ['SATURN', 'MARS', 'URANUS', 'PLUTO'];
        const challengingCount = planetsInSign.filter(p => challengingPlanets.includes(p)).length;
        score -= challengingCount * 10;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get planets in house
     * @param {number} houseNumber - House number (1-12)
     * @returns {Array} Planets in house
     */
    getPlanetsInHouse(houseNumber) {
        const planets = [];

        for (const [planet, data] of Object.entries(this.chart.planets)) {
            const house = this.getHouseForLongitude(data.longitude);
            if (house === houseNumber) {
                planets.push(planet);
            }
        }

        return planets;
    }

    /**
     * Get house significator
     * @param {number} houseNumber - House number
     * @returns {string} Significator planet
     */
    getHouseSignificator(houseNumber) {
        const significators = {
            1: 'MARS', 2: 'VENUS', 3: 'MERCURY', 4: 'MOON', 5: 'SUN',
            6: 'MERCURY', 7: 'VENUS', 8: 'SATURN', 9: 'JUPITER', 10: 'SATURN',
            11: 'JUPITER', 12: 'SATURN'
        };

        return significators[houseNumber] || 'SATURN';
    }

    /**
     * Calculate house health score
     * @param {number} houseNumber - House number
     * @param {Array} planetsInHouse - Planets in house
     * @param {string} significator - House significator
     * @returns {number} Health score
     */
    calculateHouseHealthScore(houseNumber, planetsInHouse, significator) {
        let score = 50; // Base score

        // Adjust for planets in house
        score += planetsInHouse.length * 5;

        // Adjust for significator placement
        if (planetsInHouse.includes(significator)) {
            score += 15;
        }

        // House-specific adjustments
        const challengingHouses = [6, 8, 12];
        if (challengingHouses.includes(houseNumber)) {
            score -= 10;
        }

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate aspect health impact
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {Object} aspect - Aspect data
     * @returns {number} Health impact score
     */
    calculateAspectHealthImpact(planet1, planet2, aspect) {
        const baseImpact = ASPECT_INFLUENCES[aspect.type] || 0;

        // Adjust based on planetary natures
        const malefics = ['MARS', 'SATURN'];
        const benefics = ['JUPITER', 'VENUS'];

        let multiplier = 1;
        if (malefics.includes(planet1) || malefics.includes(planet2)) {
            multiplier = 1.5;
        } else if (benefics.includes(planet1) && benefics.includes(planet2)) {
            multiplier = 0.7;
        }

        return baseImpact * multiplier;
    }

    /**
     * Get aspect health description
     * @param {string} planet1 - First planet
     * @param {string} planet2 - Second planet
     * @param {Object} aspect - Aspect data
     * @returns {string} Description
     */
    getAspectHealthDescription(planet1, planet2, aspect) {
        const templates = {
            CONJUNCTION: `${planet1}-${planet2} conjunction indicates combined health influences`,
            TRINE: `${planet1}-${planet2} trine suggests harmonious health energies`,
            SEXTILE: `${planet1}-${planet2} sextile indicates supportive health dynamics`,
            SQUARE: `${planet1}-${planet2} square suggests challenging health tensions`,
            OPPOSITION: `${planet1}-${planet2} opposition indicates polarized health forces`,
            QUINCUNX: `${planet1}-${planet2} quincunx suggests adjustment needs in health`
        };

        return templates[aspect.type] || `${planet1}-${planet2} ${aspect.type.toLowerCase()} aspect`;
    }

    /**
     * Get Sun sign
     * @returns {string} Sun sign
     */
    getSunSign() {
        const sunLongitude = this.chart.planets.SUN?.longitude || 0;
        const signIndex = Math.floor(sunLongitude / 30);
        return Object.keys(ZODIAC_SIGN_RULERSHIPS)[signIndex];
    }

    /**
     * Get Moon sign
     * @returns {string} Moon sign
     */
    getMoonSign() {
        const moonLongitude = this.chart.planets.MOON?.longitude || 0;
        const signIndex = Math.floor(moonLongitude / 30);
        return Object.keys(ZODIAC_SIGN_RULERSHIPS)[signIndex];
    }

    /**
     * Get Ascendant sign
     * @returns {string} Ascendant sign
     */
    getAscendantSign() {
        const ascendant = this.chart.houses[0];
        const signIndex = Math.floor(ascendant / 30);
        return Object.keys(ZODIAC_SIGN_RULERSHIPS)[signIndex];
    }

    /**
     * Calculate temperament
     * @param {string} sunSign - Sun sign
     * @param {string} moonSign - Moon sign
     * @param {string} ascendant - Ascendant sign
     * @returns {Object} Temperament scores
     */
    calculateTemperament(sunSign, moonSign, ascendant) {
        const signs = [sunSign, moonSign, ascendant];
        const temperaments = { CHOLERIC: 0, PHLEGMATIC: 0, SANGUINE: 0, MELANCHOLIC: 0 };

        for (const sign of signs) {
            const signData = ZODIAC_SIGN_RULERSHIPS[sign];
            if (signData) {
                temperaments[signData.temperament.toUpperCase()] += 1;
            }
        }

        return temperaments;
    }

    /**
     * Classify constitution
     * @param {Object} temperament - Temperament scores
     * @returns {string} Constitution type
     */
    classifyConstitution(temperament) {
        const dominant = Object.keys(temperament).reduce((a, b) =>
            temperament[a] > temperament[b] ? a : b);

        return dominant;
    }

    /**
     * Calculate overall risk
     * @param {Object} planetaryHealth - Planetary health data
     * @param {Object} signHealth - Sign health data
     * @param {Object} houseHealth - House health data
     * @param {Array} aspectHealth - Aspect health data
     * @returns {Object} Overall risk assessment
     */
    calculateOverallRisk(planetaryHealth, signHealth, houseHealth, aspectHealth) {
        const planetaryAvg = Object.values(planetaryHealth).reduce((sum, p) => sum + p.healthScore, 0) /
                           Object.keys(planetaryHealth).length;

        const signAvg = Object.values(signHealth).reduce((sum, s) => sum + s.healthScore, 0) /
                      Object.keys(signHealth).length;

        const houseAvg = Object.values(houseHealth).reduce((sum, h) => sum + h.healthScore, 0) /
                        Object.keys(houseHealth).length;

        const aspectAvg = aspectHealth.reduce((sum, a) => sum + Math.abs(a.healthImpact), 0) /
                         aspectHealth.length;

        const overallScore = (planetaryAvg * 0.3) + (signAvg * 0.3) + (houseAvg * 0.2) + (aspectAvg * 0.2);

        return {
            score: overallScore,
            level: this.getRiskLevel(overallScore),
            breakdown: {
                planetary: planetaryAvg,
                sign: signAvg,
                house: houseAvg,
                aspect: aspectAvg
            }
        };
    }

    /**
     * Generate recommendations
     * @param {Object} overallRisk - Overall risk data
     * @returns {Array} Recommendations
     */
    generateRecommendations(overallRisk) {
        const recommendations = [];

        if (overallRisk.level === 'CRITICAL') {
            recommendations.push('URGENT: Consult medical professional immediately');
            recommendations.push('Consider comprehensive medical evaluation');
        } else if (overallRisk.level === 'HIGH') {
            recommendations.push('Schedule regular medical check-ups');
            recommendations.push('Implement preventive health measures');
        } else if (overallRisk.level === 'MODERATE') {
            recommendations.push('Maintain healthy lifestyle practices');
            recommendations.push('Monitor health indicators regularly');
        }

        // Add specific recommendations based on breakdown
        if (overallRisk.breakdown.aspect > 0.7) {
            recommendations.push('Address relationship stress and conflicts');
        }

        if (overallRisk.breakdown.house > 0.7) {
            recommendations.push('Focus on areas indicated by 6th, 8th, and 12th houses');
        }

        return recommendations;
    }

    /**
     * Get risk level
     * @param {number} score - Health score
     * @returns {string} Risk level
     */
    getRiskLevel(score) {
        if (score >= RISK_LEVELS.CRITICAL.threshold) return 'CRITICAL';
        if (score >= RISK_LEVELS.HIGH.threshold) return 'HIGH';
        if (score >= RISK_LEVELS.MODERATE.threshold) return 'MODERATE';
        return 'LOW';
    }
}

module.exports = WesternMedicalAstrologyAnalyzer;