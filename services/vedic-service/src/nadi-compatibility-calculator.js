/**
 * ZodiaCore - Nadi Compatibility Calculator
 *
 * Calculates Nadi compatibility between partners based on Moon's nakshatra.
 * Nadi is one of the eight kootas in Ashtakoota marriage compatibility system.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const { NADI_MAPPINGS } = require('./dosha-constants');
const NakshatraCalculator = require('./nakshatra-calculator');

/**
 * Nadi Compatibility Calculator Class
 * Handles Nadi dosha calculations and compatibility analysis
 */
class NadiCompatibilityCalculator {
    constructor() {
        this.nakshatraCalculator = new NakshatraCalculator();
    }

    /**
     * Calculate Nadi compatibility between two birth charts
     * @param {Object} brideChart - Bride's birth chart
     * @param {Object} groomChart - Groom's birth chart
     * @returns {Object} Nadi compatibility analysis
     */
    analyzeCompatibility(brideChart, groomChart) {
        if (!this._validateCharts(brideChart, groomChart)) {
            throw new Error('Invalid chart data provided for Nadi compatibility analysis');
        }

        const brideMoon = brideChart.planets.MOON;
        const groomMoon = groomChart.planets.MOON;

        // Get nakshatra information
        const brideNakshatra = this.nakshatraCalculator.calculateNakshatra(brideMoon.longitude);
        const groomNakshatra = this.nakshatraCalculator.calculateNakshatra(groomMoon.longitude);

        // Determine Nadi types
        const brideNadi = this._getNadiType(brideNakshatra.nakshatraName);
        const groomNadi = this._getNadiType(groomNakshatra.nakshatraName);

        // Calculate compatibility
        const isCompatible = brideNadi !== groomNadi;
        const score = isCompatible ? 8 : 0;
        const percentage = (score / 8) * 100;

        // Analyze compatibility details
        const analysis = this._analyzeCompatibility(brideNadi, groomNadi, isCompatible);

        // Generate remedies if incompatible
        const remedies = isCompatible ? [] : this._generateRemedies(brideNadi, groomNadi);

        return {
            brideNadi: brideNadi,
            groomNadi: groomNadi,
            brideNakshatra: brideNakshatra,
            groomNakshatra: groomNakshatra,
            compatible: isCompatible,
            score: score,
            maxScore: 8,
            percentage: percentage,
            analysis: analysis,
            remedies: remedies,
            compatibilityDetails: {
                sameNadi: brideNadi === groomNadi,
                nadiDifference: this._getNadiDifference(brideNadi, groomNadi),
                complementaryTraits: this._getComplementaryTraits(brideNadi, groomNadi)
            }
        };
    }

    /**
     * Get Nadi type from nakshatra name
     * @private
     */
    _getNadiType(nakshatraName) {
        for (const [nadi, nakshatras] of Object.entries(NADI_MAPPINGS)) {
            if (nakshatras.includes(nakshatraName)) {
                return nadi;
            }
        }
        // Default fallback (though all 27 nakshatras should be covered)
        return 'Madhya';
    }

    /**
     * Analyze compatibility details
     * @private
     */
    _analyzeCompatibility(brideNadi, groomNadi, isCompatible) {
        if (isCompatible) {
            return {
                type: "Compatible",
                benefits: [
                    "Genetic diversity for healthy progeny",
                    "Complementary constitutional energies",
                    "Balanced family dynamics",
                    "Reduced risk of genetic disorders"
                ],
                complementaryTraits: this._getComplementaryTraits(brideNadi, groomNadi),
                recommendations: [
                    "Excellent match for long-term compatibility",
                    "Strong foundation for family planning",
                    "Natural balance in relationship dynamics"
                ]
            };
        } else {
            return {
                type: "Incompatible",
                concerns: [
                    "Potential genetic similarity affecting progeny",
                    "Similar constitutional weaknesses",
                    "Increased risk of health issues in children",
                    "Challenges in maintaining family harmony"
                ],
                risks: [
                    "Higher chance of genetic disorders",
                    "Similar health predispositions",
                    "Potential fertility challenges",
                    "Emotional and mental compatibility issues"
                ],
                recommendations: [
                    "Consider detailed medical compatibility testing",
                    "Consult elders for traditional wisdom",
                    "Strong other koota scores may compensate",
                    "Focus on overall relationship compatibility"
                ]
            };
        }
    }

    /**
     * Get complementary traits between different Nadis
     * @private
     */
    _getComplementaryTraits(brideNadi, groomNadi) {
        const traits = {
            'Adi-Madhya': [
                'Creative and practical balance',
                'Dynamic and organized partnership',
                'Innovative problem-solving with structured approach'
            ],
            'Adi-Antya': [
                'Creative and nurturing combination',
                'Dynamic energy with stable foundation',
                'Innovative ideas with traditional wisdom'
            ],
            'Madhya-Antya': [
                'Practical and stable partnership',
                'Organized approach with nurturing care',
                'Balanced decision-making with emotional support'
            ]
        };

        const key = [brideNadi, groomNadi].sort().join('-');
        return traits[key] || ['Balanced complementary energies'];
    }

    /**
     * Get Nadi difference for analysis
     * @private
     */
    _getNadiDifference(brideNadi, groomNadi) {
        if (brideNadi === groomNadi) return 'Same';

        const nadiOrder = ['Adi', 'Madhya', 'Antya'];
        const brideIndex = nadiOrder.indexOf(brideNadi);
        const groomIndex = nadiOrder.indexOf(groomNadi);

        const difference = Math.abs(brideIndex - groomIndex);
        return difference === 1 ? 'Adjacent' : 'Opposite';
    }

    /**
     * Generate remedies for Nadi dosha
     * @private
     */
    _generateRemedies(brideNadi, groomNadi) {
        const remedies = {
            traditional: [],
            modern: [],
            spiritual: [],
            medical: []
        };

        // Traditional remedies
        remedies.traditional = [
            'Nadi Dosha Nivaran Puja ceremony',
            'Donation of food and clothes to temples',
            'Ekadashi fasting on specific days',
            'Special prayers to ancestors'
        ];

        // Spiritual remedies
        remedies.spiritual = [
            'Chanting specific mantras for dosha cancellation',
            'Wearing protective yantras or amulets',
            'Visiting sacred temples and holy places',
            'Performing charity and selfless service'
        ];

        // Modern approaches
        remedies.modern = [
            'Genetic counseling and compatibility testing',
            'Pre-marital health checkups',
            'Understanding and accepting differences',
            'Professional relationship counseling'
        ];

        // Medical recommendations
        remedies.medical = [
            'Comprehensive genetic screening',
            'Consultation with medical geneticist',
            'Family history analysis',
            'Prenatal care planning'
        ];

        // Nadi-specific additional remedies
        if (brideNadi === 'Adi' && groomNadi === 'Adi') {
            remedies.traditional.push('Special ceremonies for creative energy balance');
        }

        return remedies;
    }

    /**
     * Calculate Nadi compatibility score with detailed breakdown
     * @param {string} brideNadi - Bride's Nadi
     * @param {string} groomNadi - Groom's Nadi
     * @returns {Object} Detailed scoring
     */
    calculateDetailedScore(brideNadi, groomNadi) {
        const baseScore = brideNadi === groomNadi ? 0 : 8;

        // Additional factors
        let adjustment = 0;

        // Adjacent Nadis get partial credit
        if (this._getNadiDifference(brideNadi, groomNadi) === 'Adjacent') {
            adjustment += 2; // Though traditionally it's 0 or 8
        }

        // Consider strength of nakshatra position (simplified)
        // In a full implementation, this would consider pada position, etc.

        return {
            baseScore: baseScore,
            adjustments: adjustment,
            finalScore: Math.min(8, baseScore + adjustment),
            factors: [
                `Base compatibility: ${baseScore}/8`,
                brideNadi === groomNadi ? 'Same Nadi (0 points)' : 'Different Nadi (8 points)',
                adjustment > 0 ? `Additional factors: +${adjustment}` : 'No additional factors'
            ]
        };
    }

    /**
     * Get Nadi characteristics and attributes
     * @param {string} nadiType - Nadi type (Adi, Madhya, Antya)
     * @returns {Object} Nadi characteristics
     */
    getNadiCharacteristics(nadiType) {
        const characteristics = {
            'Adi': {
                name: 'Aadi Nadi (Beginning)',
                qualities: ['Vata constitution', 'Creative', 'Dynamic', 'Innovative'],
                strengths: ['Quick thinking', 'Adaptability', 'Leadership in new ventures'],
                challenges: ['Impatience', 'Inconsistency', 'Restlessness'],
                physicalTraits: ['Slim build', 'Quick metabolism', 'Prone to Vata disorders'],
                mentalTraits: ['Creative mind', 'Fast learner', 'Good communicator']
            },
            'Madhya': {
                name: 'Madhya Nadi (Middle)',
                qualities: ['Pitta constitution', 'Balanced', 'Practical', 'Determined'],
                strengths: ['Organization', 'Decision making', 'Achievement orientation'],
                challenges: ['Perfectionism', 'Competitiveness', 'Workaholic tendencies'],
                physicalTraits: ['Medium build', 'Strong digestion', 'Prone to Pitta disorders'],
                mentalTraits: ['Analytical mind', 'Strategic thinking', 'Goal-oriented']
            },
            'Antya': {
                name: 'Antya Nadi (End)',
                qualities: ['Kapha constitution', 'Stable', 'Nurturing', 'Traditional'],
                strengths: ['Patience', 'Care', 'Loyalty', 'Stability'],
                challenges: ['Resistance to change', 'Over-attachment', 'Inertia'],
                physicalTraits: ['Strong build', 'Slow metabolism', 'Prone to Kapha disorders'],
                mentalTraits: ['Calm mind', 'Supportive nature', 'Traditional values']
            }
        };

        return characteristics[nadiType] || {};
    }

    /**
     * Analyze Nadi compatibility for health and progeny
     * @param {string} brideNadi - Bride's Nadi
     * @param {string} groomNadi - Groom's Nadi
     * @returns {Object} Health and progeny analysis
     */
    analyzeHealthAndProgeny(brideNadi, groomNadi) {
        if (brideNadi === groomNadi) {
            return {
                compatibility: 'Concerning',
                healthRisks: [
                    'Similar constitutional weaknesses',
                    'Increased susceptibility to same diseases',
                    'Potential immune system challenges'
                ],
                progenyConcerns: [
                    'Genetic similarity may affect fertility',
                    'Higher risk of genetic disorders',
                    'Potential developmental issues'
                ],
                recommendations: [
                    'Comprehensive medical evaluation',
                    'Genetic counseling recommended',
                    'Consider IVF or other assisted reproduction'
                ]
            };
        } else {
            return {
                compatibility: 'Favorable',
                healthBenefits: [
                    'Complementary constitutional strengths',
                    'Balanced immune system support',
                    'Natural health balance in family'
                ],
                progenyBenefits: [
                    'Genetic diversity promotes healthy offspring',
                    'Balanced physical and mental traits',
                    'Stronger overall constitution'
                ],
                recommendations: [
                    'Regular health checkups',
                    'Balanced lifestyle and nutrition',
                    'Natural conception preferred'
                ]
            };
        }
    }

    /**
     * Validate input charts
     * @private
     */
    _validateCharts(brideChart, groomChart) {
        return brideChart &&
               groomChart &&
               brideChart.planets &&
               groomChart.planets &&
               brideChart.planets.MOON &&
               groomChart.planets.MOON &&
               typeof brideChart.planets.MOON.longitude === 'number' &&
               typeof groomChart.planets.MOON.longitude === 'number';
    }
}

module.exports = NadiCompatibilityCalculator;