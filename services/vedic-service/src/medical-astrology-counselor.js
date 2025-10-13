/**
 * ZodiaCore - Medical Astrology Counselor
 *
 * Analyzes health issues, disease timing, and healing potential through
 * planetary influences on the body and medical yogas in Vedic astrology.
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
const { PLANETARY_WEIGHTS, HOUSE_CONFIG, SCORING_WEIGHTS, SECURITY_CONFIG } = require('./astrology-constants');

/**
 * Medical Astrology Counselor Class
 * Provides health analysis and counseling based on planetary positions
 */
class MedicalAstrologyCounselor {
    constructor(birthChart, currentDate) {
        this.chart = birthChart;
        this.currentDate = currentDate || new Date();
        this.healthAnalysis = this.analyzeHealthIndicators();
        this.diseaseTiming = this.analyzeDiseaseTiming();
        this.healingPotential = this.analyzeHealingPotential();
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
     * Analyze health indicators from birth chart
     * @returns {Object} Health indicators analysis
     */
    analyzeHealthIndicators() {
        const sixthLord = this.getHouseLord(6);
        const eighthLord = this.getHouseLord(8);
        const twelfthLord = this.getHouseLord(12);

        return {
            healthHouses: [6, 8, 12],
            diseasePlanets: ['SATURN', 'MARS', 'RAHU', 'KETU'],
            immunityStrength: this.calculateImmunityStrength(),
            chronicConditions: this.identifyChronicConditions(),
            bodyPartAfflictions: this.analyzeBodyPartAfflictions(),
            overallHealthScore: this.calculateOverallHealthScore()
        };
    }

    /**
     * Analyze disease timing through dasha and transits
     * @returns {Object} Disease timing analysis
     */
    analyzeDiseaseTiming() {
        const dashaSystem = new VimshottariDasha();
        const moonNakshatra = this.getMoonNakshatra();
        const birthDate = this.chart.birthDate || new Date();

        if (!moonNakshatra) {
            return { error: 'Moon nakshatra data not available' };
        }

        const balance = dashaSystem.calculateDashaBalance(moonNakshatra, birthDate);
        const currentDasha = dashaSystem.getCurrentDasha(birthDate, this.currentDate, balance);
        const upcomingDashas = dashaSystem.generateMahadashas(birthDate, balance).slice(0, 3); // Next 3 periods

        return {
            currentRisk: currentDasha ? this.evaluateHealthRisk(currentDasha) : null,
            upcomingRisks: upcomingDashas.map(d => ({
                period: d,
                healthRisk: this.evaluateHealthRisk(d),
                precautions: this.getHealthPrecautions(d.planet || d.mahadasha)
            })),
            vulnerablePeriods: this.identifyVulnerablePeriods()
        };
    }

    /**
     * Analyze healing potential and recovery factors
     * @returns {Object} Healing potential analysis
     */
    analyzeHealingPotential() {
        return {
            recoveryRate: this.calculateRecoveryRate(),
            healingPlanets: this.identifyHealingPlanets(),
            remedialMeasures: this.suggestRemedialMeasures(),
            lifestyleRecommendations: this.generateLifestyleRecommendations()
        };
    }

    /**
     * Evaluate health risk for a dasha period
     * @param {Object} dashaPeriod - Dasha period object
     * @returns {Object} Health risk evaluation
     */
    evaluateHealthRisk(dashaPeriod) {
        const planet = dashaPeriod.planet || dashaPeriod.mahadasha;
        const healthRiskWeights = {
            'SATURN': 0.8,   // Chronic diseases, bones
            'MARS': 0.7,     // Accidents, blood disorders
            'RAHU': 0.8,     // Mysterious diseases, mental health
            'KETU': 0.7,     // Spiritual diseases, wounds
            'SUN': 0.5,      // Heart, eyes
            'MOON': 0.6,     // Mental health, fluids
            'MERCURY': 0.5,  // Nervous system, skin
            'JUPITER': 0.4,  // Liver, diabetes
            'VENUS': 0.5     // Reproductive system, kidneys
        };

        const baseRisk = healthRiskWeights[planet] || 0.5;
        const planetaryStrength = this.getPlanetStrength(planet);
        const adjustedRisk = baseRisk * (1 - planetaryStrength * 0.3); // Stronger planets reduce risk

        return {
            riskLevel: adjustedRisk > 0.7 ? 'High' : adjustedRisk > 0.4 ? 'Medium' : 'Low',
            riskScore: adjustedRisk,
            primaryConcerns: this.getHealthConcernsForPlanet(planet),
            bodyPartsAffected: this.getBodyPartsForPlanet(planet)
        };
    }

    /**
     * Calculate immunity strength
     * @returns {number} Immunity strength score (0-1)
     */
    calculateImmunityStrength() {
        let strength = 0.5; // Base immunity

        // Jupiter represents immunity and wisdom
        const jupiterStrength = this.getPlanetStrength('JUPITER');
        strength += jupiterStrength * 0.3;

        // Sun represents vitality
        const sunStrength = this.getPlanetStrength('SUN');
        strength += sunStrength * 0.2;

        // Check for benefic influences on 1st house (overall health)
        const firstHousePlanets = this.getPlanetsInHouse(1);
        const benefics = ['JUPITER', 'VENUS'];
        const beneficCount = firstHousePlanets.filter(p => benefics.includes(p)).length;
        strength += beneficCount * 0.1;

        // Check for malefic influences on 6th house (reduce immunity)
        const sixthHousePlanets = this.getPlanetsInHouse(6);
        const malefics = ['SATURN', 'MARS', 'RAHU', 'KETU'];
        const maleficCount = sixthHousePlanets.filter(p => malefics.includes(p)).length;
        strength -= maleficCount * 0.1;

        return Math.max(0, Math.min(1, strength));
    }

    /**
     * Identify chronic conditions based on chart
     * @returns {Array} Chronic conditions
     */
    identifyChronicConditions() {
        const conditions = [];

        // Saturn afflictions - chronic diseases
        if (this.isPlanetAfflicted('SATURN')) {
            conditions.push({
                condition: 'Chronic musculoskeletal issues',
                severity: 'Medium',
                bodyParts: ['Bones', 'Joints', 'Teeth'],
                planetaryCause: 'SATURN'
            });
        }

        // Mars afflictions - blood disorders, accidents
        if (this.isPlanetAfflicted('MARS')) {
            conditions.push({
                condition: 'Blood disorders or inflammatory conditions',
                severity: 'Medium',
                bodyParts: ['Blood', 'Muscles', 'Head'],
                planetaryCause: 'MARS'
            });
        }

        // Rahu afflictions - mysterious diseases
        if (this.isPlanetAfflicted('RAHU')) {
            conditions.push({
                condition: 'Mental health or neurological issues',
                severity: 'High',
                bodyParts: ['Brain', 'Nervous system', 'Skin'],
                planetaryCause: 'RAHU'
            });
        }

        // Ketu afflictions - spiritual diseases
        if (this.isPlanetAfflicted('KETU')) {
            conditions.push({
                condition: 'Wounds, spiritual crises, or digestive issues',
                severity: 'Medium',
                bodyParts: ['Wounds', 'Intestines', 'Spiritual body'],
                planetaryCause: 'KETU'
            });
        }

        return conditions;
    }

    /**
     * Analyze body part afflictions
     * @returns {Object} Body part afflictions
     */
    analyzeBodyPartAfflictions() {
        const afflictions = {};

        // Analyze each planet's rulership
        const planetRulerships = this.getPlanetBodyRulerships();

        for (const planet in planetRulerships) {
            const strength = this.getPlanetStrength(planet);
            const affliction = this.isPlanetAfflicted(planet);

            if (affliction) {
                planetRulerships[planet].forEach(bodyPart => {
                    if (!afflictions[bodyPart]) {
                        afflictions[bodyPart] = [];
                    }
                    afflictions[bodyPart].push({
                        planet: planet,
                        severity: strength < 0.4 ? 'High' : strength < 0.7 ? 'Medium' : 'Low',
                        condition: this.getConditionForBodyPart(bodyPart, planet)
                    });
                });
            }
        }

        return afflictions;
    }

    /**
     * Calculate overall health score
     * @returns {number} Health score (0-1)
     */
    calculateOverallHealthScore() {
        let score = 0.7; // Base health score

        // Add immunity strength
        score += this.calculateImmunityStrength() * 0.2;

        // Subtract chronic conditions impact
        score -= this.identifyChronicConditions().length * 0.1;

        // Add benefic influences
        const beneficInfluence = this.calculateBeneficInfluence();
        score += beneficInfluence * 0.1;

        // Subtract malefic influences
        const maleficInfluence = this.calculateMaleficInfluence();
        score -= maleficInfluence * 0.1;

        return Math.max(0, Math.min(1, score));
    }

    /**
     * Get health concerns for a planet
     * @param {string} planet - Planet name
     * @returns {Array} Health concerns
     */
    getHealthConcernsForPlanet(planet) {
        const concerns = {
            'SATURN': ['Chronic pain', 'Depression', 'Arthritis', 'Skin diseases'],
            'MARS': ['Accidents', 'Infections', 'Blood pressure', 'Surgery'],
            'RAHU': ['Mental disorders', 'Skin diseases', 'Poisoning', 'Addiction'],
            'KETU': ['Wounds', 'Spiritual crises', 'Digestive issues', 'Amputations'],
            'SUN': ['Heart problems', 'Eye issues', 'Headaches', 'Authority conflicts'],
            'MOON': ['Mental health', 'Fluid retention', 'Sleep disorders', 'Emotional issues'],
            'MERCURY': ['Nervous disorders', 'Skin problems', 'Speech issues', 'Anxiety'],
            'JUPITER': ['Liver issues', 'Diabetes', 'Weight problems', 'Overconfidence'],
            'VENUS': ['Kidney problems', 'Reproductive issues', 'Luxury-related health', 'Indulgence']
        };

        return concerns[planet] || ['General health concerns'];
    }

    /**
     * Get body parts ruled by a planet
     * @param {string} planet - Planet name
     * @returns {Array} Body parts
     */
    getBodyPartsForPlanet(planet) {
        const rulerships = {
            'SUN': ['Heart', 'Eyes', 'Head', 'Bones'],
            'MOON': ['Mind', 'Breasts', 'Stomach', 'Uterus'],
            'MARS': ['Blood', 'Muscles', 'Genitals', 'Surgery sites'],
            'MERCURY': ['Nervous system', 'Skin', 'Lungs', 'Speech organs'],
            'JUPITER': ['Liver', 'Pancreas', 'Thighs', 'Wisdom teeth'],
            'VENUS': ['Kidneys', 'Reproductive organs', 'Face', 'Throat'],
            'SATURN': ['Bones', 'Teeth', 'Knees', 'Chronic conditions'],
            'RAHU': ['Skin diseases', 'Poison', 'Mental disorders', 'Foreign bodies'],
            'KETU': ['Wounds', 'Spiritual body', 'Amputations', 'Mysterious conditions']
        };

        return rulerships[planet] || ['General body'];
    }

    /**
     * Get health precautions for a planet's period
     * @param {string} planet - Planet name
     * @returns {Array} Health precautions
     */
    getHealthPrecautions(planet) {
        const precautions = {
            'SATURN': ['Maintain bone health', 'Manage stress', 'Regular exercise', 'Warm therapies'],
            'MARS': ['Avoid risky activities', 'Blood tests', 'Control anger', 'First aid preparedness'],
            'RAHU': ['Mental health support', 'Skin care', 'Avoid toxins', 'Spiritual practices'],
            'KETU': ['Wound care', 'Digestive health', 'Meditation', 'Spiritual healing'],
            'SUN': ['Heart health monitoring', 'Eye care', 'Stress management', 'Authority balance'],
            'MOON': ['Emotional balance', 'Sleep hygiene', 'Fluid intake', 'Mental wellness'],
            'MERCURY': ['Nervous system care', 'Communication therapy', 'Skin hygiene', 'Anxiety management'],
            'JUPITER': ['Liver health', 'Blood sugar monitoring', 'Moderation', 'Wisdom practices'],
            'VENUS': ['Kidney function', 'Reproductive health', 'Moderation in pleasures', 'Harmony']
        };

        return precautions[planet] || ['General health maintenance'];
    }

    /**
     * Identify vulnerable health periods
     * @returns {Array} Vulnerable periods
     */
    identifyVulnerablePeriods() {
        const vulnerable = [];

        // Check for malefic transits
        const maleficTransits = this.getMaleficTransits();
        maleficTransits.forEach(transit => {
            vulnerable.push({
                period: transit.period,
                risk: transit.risk,
                focus: transit.focus
            });
        });

        // Check for dasha combinations
        if (this.diseaseTiming.upcomingRisks) {
            this.diseaseTiming.upcomingRisks.forEach(risk => {
                if (risk.healthRisk.riskLevel === 'High') {
                    vulnerable.push({
                        period: risk.period,
                        risk: 'High',
                        focus: risk.healthRisk.primaryConcerns[0]
                    });
                }
            });
        }

        return vulnerable.slice(0, 5); // Limit to 5 most vulnerable periods
    }

    /**
     * Calculate recovery rate
     * @returns {number} Recovery rate score (0-1)
     */
    calculateRecoveryRate() {
        let rate = 0.6; // Base recovery rate

        // Jupiter and Venus enhance recovery
        const jupiterStrength = this.getPlanetStrength('JUPITER');
        const venusStrength = this.getPlanetStrength('VENUS');
        rate += (jupiterStrength + venusStrength) * 0.15;

        // Strong Moon helps emotional recovery
        const moonStrength = this.getPlanetStrength('MOON');
        rate += moonStrength * 0.1;

        // Malefic afflictions reduce recovery
        const maleficInfluence = this.calculateMaleficInfluence();
        rate -= maleficInfluence * 0.1;

        return Math.max(0.2, Math.min(1, rate));
    }

    /**
     * Identify healing planets
     * @returns {Array} Healing planets
     */
    identifyHealingPlanets() {
        const healingPlanets = [];

        // Jupiter - wisdom and healing
        if (this.getPlanetStrength('JUPITER') > 0.6) {
            healingPlanets.push({
                planet: 'JUPITER',
                healingType: 'Wisdom and immunity',
                strength: this.getPlanetStrength('JUPITER')
            });
        }

        // Venus - harmony and balance
        if (this.getPlanetStrength('VENUS') > 0.6) {
            healingPlanets.push({
                planet: 'VENUS',
                healingType: 'Harmony and rejuvenation',
                strength: this.getPlanetStrength('VENUS')
            });
        }

        // Moon - emotional healing
        if (this.getPlanetStrength('MOON') > 0.6) {
            healingPlanets.push({
                planet: 'MOON',
                healingType: 'Emotional and mental healing',
                strength: this.getPlanetStrength('MOON')
            });
        }

        return healingPlanets;
    }

    /**
     * Suggest remedial measures
     * @returns {Array} Remedial measures
     */
    suggestRemedialMeasures() {
        const remedies = [];

        // Gemstone recommendations
        const gemstones = this.recommendGemstones();
        remedies.push(...gemstones);

        // Mantra recommendations
        const mantras = this.recommendMantras();
        remedies.push(...mantras);

        // Charity recommendations
        remedies.push({
            type: 'Charity',
            description: 'Donate to health-related causes',
            frequency: 'Weekly',
            target: 'Health and healing'
        });

        // Fasting recommendations
        const fasting = this.recommendFasting();
        remedies.push(...fasting);

        return remedies;
    }

    /**
     * Generate lifestyle recommendations
     * @returns {Array} Lifestyle recommendations
     */
    generateLifestyleRecommendations() {
        const recommendations = [];

        // Diet recommendations
        recommendations.push({
            category: 'Diet',
            advice: 'Balanced diet with emphasis on fresh, natural foods',
            focus: 'According to constitutional type'
        });

        // Exercise recommendations
        recommendations.push({
            category: 'Exercise',
            advice: 'Regular moderate exercise appropriate to health condition',
            focus: 'Yoga, walking, or swimming'
        });

        // Sleep recommendations
        recommendations.push({
            category: 'Sleep',
            advice: 'Adequate sleep with consistent schedule',
            focus: '7-8 hours, aligned with natural cycles'
        });

        // Stress management
        recommendations.push({
            category: 'Stress Management',
            advice: 'Meditation, prayer, or relaxation techniques',
            focus: 'Daily practice for mental health'
        });

        return recommendations;
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

    getPlanetStrength(planet) {
        const planetData = this.chart.planets[planet];
        if (!planetData) return 0.5;

        let strength = 0.5;

        const goodHouses = [1, 4, 5, 7, 9, 10, 11];
        if (goodHouses.includes(planetData.house)) strength += 0.2;

        if (this.isInOwnSign(planet)) strength += 0.2;

        if (this.isExalted(planet)) strength += 0.1;

        return Math.min(1, strength);
    }

    isPlanetAfflicted(planet) {
        const strength = this.getPlanetStrength(planet);
        const house = this.chart.planets[planet]?.house;

        // Afflicted if weak and in bad houses
        const badHouses = [6, 8, 12];
        return strength < 0.5 || badHouses.includes(house);
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

    getPlanetBodyRulerships() {
        return {
            'SUN': ['Heart', 'Eyes', 'Head', 'Spine'],
            'MOON': ['Mind', 'Breasts', 'Stomach', 'Blood'],
            'MARS': ['Muscles', 'Blood', 'Head', 'Genitals'],
            'MERCURY': ['Nervous system', 'Skin', 'Lungs', 'Intestines'],
            'JUPITER': ['Liver', 'Pancreas', 'Thighs', 'Fat'],
            'VENUS': ['Kidneys', 'Reproductive system', 'Face', 'Throat'],
            'SATURN': ['Bones', 'Teeth', 'Knees', 'Skin'],
            'RAHU': ['Lungs', 'Foreign bodies', 'Mental health'],
            'KETU': ['Wounds', 'Mysterious diseases', 'Spiritual health']
        };
    }

    getConditionForBodyPart(bodyPart, planet) {
        const conditions = {
            'Heart': 'Cardiovascular issues',
            'Eyes': 'Vision problems',
            'Head': 'Headaches, migraines',
            'Bones': 'Arthritis, fractures',
            'Mind': 'Mental health issues',
            'Blood': 'Anemia, clotting disorders',
            'Muscles': 'Strains, spasms',
            'Nervous system': 'Anxiety, neurological disorders',
            'Skin': 'Dermatitis, infections',
            'Liver': 'Hepatitis, fatty liver',
            'Kidneys': 'Kidney stones, infections',
            'Reproductive system': 'Hormonal imbalances'
        };

        return conditions[bodyPart] || 'General health issues';
    }

    calculateBeneficInfluence() {
        const benefics = ['JUPITER', 'VENUS'];
        let influence = 0;

        benefics.forEach(planet => {
            influence += this.getPlanetStrength(planet);
        });

        return influence / benefics.length;
    }

    calculateMaleficInfluence() {
        const malefics = ['SATURN', 'MARS', 'RAHU', 'KETU'];
        let influence = 0;

        malefics.forEach(planet => {
            if (this.isPlanetAfflicted(planet)) {
                influence += (1 - this.getPlanetStrength(planet));
            }
        });

        return influence / malefics.length;
    }

    getMaleficTransits() {
        // Simplified - in practice would calculate actual transits
        return [
            { period: 'Next 3 months', risk: 'Medium', focus: 'General health' }
        ];
    }

    getMoonNakshatra() {
        return this.chart.moonNakshatra || null;
    }

    recommendGemstones() {
        const gemstones = [];

        if (this.isPlanetAfflicted('SUN')) {
            gemstones.push({
                type: 'Gemstone',
                description: 'Ruby for heart and vitality',
                planet: 'SUN',
                purpose: 'Heart health, vitality'
            });
        }

        if (this.isPlanetAfflicted('MOON')) {
            gemstones.push({
                type: 'Gemstone',
                description: 'Pearl for mental health',
                planet: 'MOON',
                purpose: 'Emotional balance, mental health'
            });
        }

        return gemstones;
    }

    recommendMantras() {
        const mantras = [];

        if (this.isPlanetAfflicted('SATURN')) {
            mantras.push({
                type: 'Mantra',
                description: 'Om Sham Shanicharaye Namaha',
                planet: 'SATURN',
                purpose: 'Saturn afflictions, chronic diseases'
            });
        }

        return mantras;
    }

    recommendFasting() {
        const fasting = [];

        fasting.push({
            type: 'Fasting',
            description: 'Fast on Sundays for Sun health',
            planet: 'SUN',
            purpose: 'Heart and eye health'
        });

        return fasting;
    }

    /**
     * Sanitize chronic conditions for privacy
     * @param {Array} conditions - Raw chronic conditions
     * @returns {Array} Sanitized conditions
     */
    sanitizeChronicConditions(conditions) {
        return conditions.map(condition => ({
            ...condition,
            // Remove specific medical details that could identify individuals
            condition: this.generalizeCondition(condition.condition),
            bodyParts: condition.bodyParts // Keep general body parts as they are educational
        }));
    }

    /**
     * Sanitize body part afflictions for privacy
     * @param {Object} afflictions - Raw body part afflictions
     * @returns {Object} Sanitized afflictions
     */
    sanitizeBodyPartAfflictions(afflictions) {
        const sanitized = {};
        for (const [bodyPart, issues] of Object.entries(afflictions)) {
            sanitized[bodyPart] = issues.map(issue => ({
                severity: issue.severity,
                condition: this.generalizeCondition(issue.condition)
            }));
        }
        return sanitized;
    }

    /**
     * Generalize specific medical conditions to maintain privacy
     * @param {string} condition - Specific condition
     * @returns {string} Generalized condition
     */
    generalizeCondition(condition) {
        // Map specific conditions to general categories
        const generalizations = {
            'Chronic musculoskeletal issues': 'Musculoskeletal concerns',
            'Blood disorders or inflammatory conditions': 'Circulatory concerns',
            'Mental health or neurological issues': 'Neurological concerns',
            'Wounds, spiritual crises, or digestive issues': 'Digestive concerns',
            'Cardiovascular issues': 'Heart concerns',
            'Vision problems': 'Eye concerns',
            'Headaches, migraines': 'Head concerns',
            'Arthritis, fractures': 'Joint concerns',
            'Mental health issues': 'Mental wellness concerns',
            'Anemia, clotting disorders': 'Blood concerns',
            'Strains, spasms': 'Muscle concerns',
            'Anxiety, neurological disorders': 'Nervous system concerns',
            'Dermatitis, infections': 'Skin concerns',
            'Hepatitis, fatty liver': 'Liver concerns',
            'Kidney stones, infections': 'Kidney concerns',
            'Hormonal imbalances': 'Hormonal concerns'
        };

        return generalizations[condition] || 'General health concerns';
    }

    /**
     * Generate comprehensive medical astrology report
     * @returns {Object} Medical astrology report
     */
    generateMedicalReport() {
        const startTime = performance.now();

        try {
            const report = {
                overallHealthScore: this.calculateOverallHealthScore(),
                immunityStrength: this.calculateImmunityStrength(),
                chronicConditions: this.sanitizeChronicConditions(this.identifyChronicConditions()),
                currentHealthRisk: this.diseaseTiming.currentRisk,
                upcomingHealthRisks: this.diseaseTiming.upcomingRisks,
                bodyPartAfflictions: this.sanitizeBodyPartAfflictions(this.analyzeBodyPartAfflictions()),
                healingPotential: this.analyzeHealingPotential(),
                recommendations: this.suggestRemedialMeasures(),
                lifestyleAdvice: this.generateLifestyleRecommendations(),
                generatedAt: new Date().toISOString(),
                systemVersion: 'ZC1.22',
                privacyNotice: 'This analysis is for informational purposes only and does not constitute medical advice. Consult qualified healthcare professionals for medical concerns.'
            };

            const endTime = performance.now();
            const duration = endTime - startTime;

            report.performance = {
                generationTimeMs: Math.round(duration),
                timestamp: new Date().toISOString()
            };

            return report;

        } catch (error) {
            console.error(`Medical astrology analysis failed: ${error.message}`);
            throw new Error(`Medical astrology analysis failed: ${error.message}`);
        }
    }

    /**
     * Get health overview
     * @returns {Object} Health overview
     */
    getHealthOverview() {
        return {
            overallHealthScore: this.calculateOverallHealthScore(),
            immunityStrength: this.calculateImmunityStrength(),
            chronicConditionsCount: this.identifyChronicConditions().length,
            currentRiskLevel: this.diseaseTiming.currentRisk?.healthRisk?.riskLevel || 'Unknown',
            healingPotential: this.calculateRecoveryRate(),
            keyRecommendations: this.suggestRemedialMeasures().slice(0, 3)
        };
    }
}

module.exports = MedicalAstrologyCounselor;