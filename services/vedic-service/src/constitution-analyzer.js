/**
 * ZodiaCore - Constitution Analyzer
 *
 * Determines Ayurvedic constitution (Prakriti) from birth chart analysis.
 * Calculates Vata, Pitta, and Kapha balances based on planetary positions.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const {
    AYURVEDIC_CONSTITUTIONS,
    PLANETARY_BODY_RULERSHIPS,
    CONSTITUTION_THRESHOLDS
} = require('./medical-astrology-constants');
const { ZODIAC_SIGNS } = require('./astro-constants');
const { parseConstitutionTypes, isValidConstitutionType } = require('./astrology-utils');

/**
 * Constitution Analyzer Class
 * Determines Ayurvedic constitution from birth chart
 */
class ConstitutionAnalyzer {
    constructor(birthChart) {
        this.birthChart = birthChart;
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

        if (!this.birthChart.planets.MOON) {
            throw new Error('Invalid birth chart: missing Moon data for constitution analysis');
        }

        if (this.birthChart.ascendant === undefined) {
            throw new Error('Invalid birth chart: missing ascendant data');
        }
    }

    /**
     * Calculate constitutional balance
     * @returns {Object} Constitution percentages for Vata, Pitta, Kapha
     */
    calculateConstitution() {
        const scores = { VATA: 0, PITTA: 0, KAPHA: 0 };

        // Moon sign contribution (primary factor - 3 points)
        const moonSign = this.birthChart.planets.MOON.sign;
        for (const type in AYURVEDIC_CONSTITUTIONS) {
            if (AYURVEDIC_CONSTITUTIONS[type].signs.includes(this.getSignName(moonSign))) {
                scores[type] += 3;
            }
        }

        // Planetary positions contribution (2 points each)
        for (const planet in this.birthChart.planets) {
            const planetType = PLANETARY_BODY_RULERSHIPS[planet]?.constitution;
            if (planetType) {
                const types = parseConstitutionTypes(planetType);
                types.forEach(type => {
                    if (scores.hasOwnProperty(type)) {
                        scores[type] += 2;
                    }
                });
            }
        }

        // Lagna (Ascendant) contribution (2 points)
        const ascendantSign = this.birthChart.ascendant.sign;
        const ascendantType = this.getConstitutionFromSign(ascendantSign);
        if (scores.hasOwnProperty(ascendantType)) {
            scores[ascendantType] += 2;
        }

        // Normalize scores to percentages
        const total = scores.VATA + scores.PITTA + scores.KAPHA;
        if (total === 0) {
            // Fallback to balanced constitution
            return { VATA: 33, PITTA: 34, KAPHA: 33 };
        }

        return {
            VATA: Math.round((scores.VATA / total) * 100),
            PITTA: Math.round((scores.PITTA / total) * 100),
            KAPHA: Math.round((scores.KAPHA / total) * 100)
        };
    }

    /**
     * Get zodiac sign name from sign number
     * @param {number} signNumber - Sign number (0-11)
     * @returns {string} Sign name
     */
    getSignName(signNumber) {
        return ZODIAC_SIGNS[signNumber] || 'Unknown';
    }

    /**
     * Get constitution type from sign
     * @param {number} signNumber - Sign number
     * @returns {string} Constitution type
     */
    getConstitutionFromSign(signNumber) {
        const signName = this.getSignName(signNumber);
        for (const type in AYURVEDIC_CONSTITUTIONS) {
            if (AYURVEDIC_CONSTITUTIONS[type].signs.includes(signName)) {
                return type;
            }
        }
        return 'VATA'; // Default fallback
    }

    /**
     * Get dominant constitution
     * @returns {Object} Dominant constitution analysis
     */
    getDominantConstitution() {
        const constitution = this.calculateConstitution();

        // Find the highest scoring constitution
        let dominant = 'VATA';
        let maxScore = constitution.VATA;

        if (constitution.PITTA > maxScore) {
            dominant = 'PITTA';
            maxScore = constitution.PITTA;
        }
        if (constitution.KAPHA > maxScore) {
            dominant = 'KAPHA';
            maxScore = constitution.KAPHA;
        }

        // Check for dual constitution (if two are close)
        const sorted = Object.entries(constitution)
            .sort(([,a], [,b]) => b - a);

        const isDual = sorted[1][1] >= (maxScore - 10); // Within 10% points

        return {
            primary: dominant,
            percentage: maxScore,
            isDual: isDual,
            secondary: isDual ? sorted[1][0] : null,
            secondaryPercentage: isDual ? sorted[1][1] : null,
            constitution: constitution
        };
    }

    /**
     * Get constitution balance assessment
     * @returns {Object} Balance assessment
     */
    getConstitutionBalance() {
        const constitution = this.calculateConstitution();
        const dominant = this.getDominantConstitution();

        // Check for imbalances
        const imbalances = [];
        const recommendations = [];

        // Check for excessive dosha
        Object.entries(constitution).forEach(([dosha, percentage]) => {
            if (percentage > CONSTITUTION_THRESHOLDS.DOMINANT) {
                imbalances.push(`${dosha} excess (${percentage}%)`);
            }
        });

        // Check for deficient dosha
        Object.entries(constitution).forEach(([dosha, percentage]) => {
            if (percentage < CONSTITUTION_THRESHOLDS.BALANCED.min) {
                imbalances.push(`${dosha} deficiency (${percentage}%)`);
            }
        });

        // Generate recommendations based on constitution
        if (dominant.primary === 'VATA') {
            recommendations.push('Focus on warm, nourishing, grounding foods');
            recommendations.push('Establish regular daily routine');
            recommendations.push('Practice gentle yoga and meditation');
        } else if (dominant.primary === 'PITTA') {
            recommendations.push('Emphasize cooling foods and environments');
            recommendations.push('Manage stress and anger');
            recommendations.push('Avoid excessive heat and spicy foods');
        } else if (dominant.primary === 'KAPHA') {
            recommendations.push('Incorporate stimulating activities and exercise');
            recommendations.push('Eat light, warm, spicy foods');
            recommendations.push('Avoid heavy, cold, sweet foods');
        }

        return {
            constitution: constitution,
            dominant: dominant,
            balance: imbalances.length === 0 ? 'Balanced' : 'Imbalanced',
            imbalances: imbalances,
            recommendations: recommendations,
            characteristics: AYURVEDIC_CONSTITUTIONS[dominant.primary]
        };
    }

    /**
     * Get constitution-based health recommendations
     * @returns {Object} Health recommendations
     */
    getHealthRecommendations() {
        const dominant = this.getDominantConstitution();
        const constitution = AYURVEDIC_CONSTITUTIONS[dominant.primary];

        return {
            primaryConstitution: dominant.primary,
            characteristics: constitution.characteristics,
            commonDiseases: constitution.diseases,
            preventiveMeasures: this.getPreventiveMeasures(dominant.primary),
            dietaryGuidelines: this.getDietaryGuidelines(dominant.primary),
            lifestyleRecommendations: this.getLifestyleRecommendations(dominant.primary)
        };
    }

    /**
     * Get preventive health measures for constitution
     * @param {string} constitution - Constitution type
     * @returns {Array} Preventive measures
     */
    getPreventiveMeasures(constitution) {
        const measures = {
            VATA: [
                'Maintain regular sleep schedule',
                'Stay warm in cold weather',
                'Practice grounding exercises',
                'Use warm oil massage (Abhyanga)'
            ],
            PITTA: [
                'Avoid excessive heat and sun exposure',
                'Practice cooling breathing exercises',
                'Maintain moderate exercise routine',
                'Stay hydrated with cool water'
            ],
            KAPHA: [
                'Engage in regular physical activity',
                'Avoid daytime sleeping',
                'Eat light, warm meals',
                'Practice invigorating yoga poses'
            ]
        };

        return measures[constitution] || [];
    }

    /**
     * Get dietary guidelines for constitution
     * @param {string} constitution - Constitution type
     * @returns {Object} Dietary recommendations
     */
    getDietaryGuidelines(constitution) {
        const guidelines = {
            VATA: {
                foods: ['Warm', 'Oily', 'Heavy foods', 'Sweet', 'Sour', 'Salty'],
                avoid: ['Cold', 'Dry', 'Raw foods', 'Bitter', 'Pungent', 'Astringent'],
                herbs: ['Ginger', 'Garlic', 'Asafoetida'],
                spices: ['Cumin', 'Coriander', 'Fennel']
            },
            PITTA: {
                foods: ['Cool', 'Heavy', 'Oily foods', 'Sweet', 'Bitter', 'Astringent'],
                avoid: ['Hot', 'Spicy', 'Sour', 'Salty foods'],
                herbs: ['Coriander', 'Fennel', 'Turmeric'],
                spices: ['Coriander', 'Cumin', 'Fennel']
            },
            KAPHA: {
                foods: ['Warm', 'Light', 'Dry foods', 'Bitter', 'Pungent', 'Astringent'],
                avoid: ['Cold', 'Heavy', 'Oily', 'Sweet', 'Sour', 'Salty foods'],
                herbs: ['Ginger', 'Black Pepper', 'Turmeric'],
                spices: ['Ginger', 'Black Pepper', 'Cinnamon']
            }
        };

        return guidelines[constitution] || guidelines.VATA;
    }

    /**
     * Get lifestyle recommendations for constitution
     * @param {string} constitution - Constitution type
     * @returns {Array} Lifestyle recommendations
     */
    getLifestyleRecommendations(constitution) {
        const recommendations = {
            VATA: [
                'Follow a consistent daily routine',
                'Practice gentle yoga and meditation',
                'Avoid overstimulation and stress',
                'Maintain warm environment'
            ],
            PITTA: [
                'Practice stress management techniques',
                'Engage in moderate exercise',
                'Spend time in nature',
                'Practice forgiveness and patience'
            ],
            KAPHA: [
                'Stay active and avoid sedentary lifestyle',
                'Wake up early in the morning',
                'Engage in stimulating activities',
                'Practice regular detoxification'
            ]
        };

        return recommendations[constitution] || [];
    }

    /**
     * Analyze constitution compatibility with current planetary periods
     * @param {Object} dashaInfo - Current dasha information
     * @returns {Object} Compatibility analysis
     */
    analyzeConstitutionCompatibility(dashaInfo) {
        const constitution = this.calculateConstitution();
        const dominant = this.getDominantConstitution();

        // Simplified compatibility analysis
        const compatibility = {
            favorable: [],
            challenging: [],
            recommendations: []
        };

        if (dashaInfo && dashaInfo.current) {
            const currentPlanet = dashaInfo.current.planet;
            const planetConstitution = PLANETARY_BODY_RULERSHIPS[currentPlanet]?.constitution;

            if (planetConstitution) {
                if (planetConstitution.includes(dominant.primary)) {
                    compatibility.favorable.push(`${currentPlanet} dasha supports ${dominant.primary} constitution`);
                } else {
                    compatibility.challenging.push(`${currentPlanet} dasha may challenge ${dominant.primary} constitution`);
                    compatibility.recommendations.push(`Strengthen ${dominant.primary} balancing practices during this period`);
                }
            }
        }

        return compatibility;
    }
}

module.exports = ConstitutionAnalyzer;