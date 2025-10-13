/**
 * ZC2.3 Chinese Zodiac Animal Sign Compatibility Engine
 *
 * This module provides comprehensive algorithms for calculating compatibility
 * between Chinese zodiac animal signs based on traditional frameworks including
 * triangle compatibility, polar relationships, and secret friends.
 *
 * @version ZC2.3-1.0
 * @author ZodiaCore Development Team
 */

const {
    CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS,
    COMPATIBILITY_THRESHOLDS,
    CHINESE_ZODIAC_SIGNS,
    TRIANGLE_GROUPS,
    POLAR_RELATIONSHIPS,
    SECRET_FRIENDS,
    ERROR_MESSAGES
} = require('./chinese-zodiac-compatibility-constants');

const {
    normalizeCompatibilityScore,
    calculateWeightedCompatibility,
    applyCulturalBias,
    calculateElementCompatibility,
    isBidirectionalRelationship,
    validateSign,
    validateSigns,
    calculatePolarityCompatibility,
    calculateDirectionCompatibility,
    LimitedCache
} = require('./chinese-zodiac-compatibility-utils');

// ============================================================================
// COMPATIBILITY ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze triangle compatibility between two signs
 * @param {string} sign1 - First zodiac sign
 * @param {string} sign2 - Second zodiac sign
 * @returns {TriangleAnalysis} Triangle compatibility analysis
 */
function analyzeTriangleCompatibility(sign1, sign2) {
    const sign1Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign1);
    const sign2Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign2);

    if (!sign1Data || !sign2Data) {
        throw new Error(ERROR_MESSAGES.INVALID_SIGNS);
    }

    const triangle1 = sign1Data.triangle;
    const triangle2 = sign2Data.triangle;

    let compatibility = CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.NEUTRAL_COMPATIBILITY_SCORE;
    let relationship = 'neutral';

    if (triangle1 === triangle2) {
        // Same triangle: generally compatible
        compatibility = COMPATIBILITY_THRESHOLDS.TRIANGLE_ALLY;
        relationship = 'triangle_ally';

        // Check for specific triangle dynamics
        const triangleGroup = TRIANGLE_GROUPS[triangle1];
        const sign1Index = triangleGroup.indexOf(sign1);
        const sign2Index = triangleGroup.indexOf(sign2);

        // Adjacent signs in triangle are most compatible
        if (Math.abs(sign1Index - sign2Index) === 1) {
            compatibility = COMPATIBILITY_THRESHOLDS.TRIANGLE_ALLY + 1.0; // 9.0
            relationship = 'triangle_adjacent';
        }
    } else {
        // Different triangles: mixed compatibility
        compatibility = COMPATIBILITY_THRESHOLDS.TRIANGLE_NEUTRAL;
        relationship = 'triangle_neutral';
    }

    return {
        compatibility: compatibility,
        relationship: relationship,
        triangle1: triangle1,
        triangle2: triangle2,
        explanation: getTriangleExplanation(relationship, sign1, sign2)
    };
}

/**
 * Get explanation for triangle relationship
 * @param {string} relationship - Relationship type
 * @param {string} sign1 - First sign
 * @param {string} sign2 - Second sign
 * @returns {string} Explanation text
 */
function getTriangleExplanation(relationship, sign1, sign2) {
    const explanations = {
        'triangle_ally': `${sign1} and ${sign2} share the same triangle group, indicating natural compatibility and mutual understanding.`,
        'triangle_adjacent': `${sign1} and ${sign2} are adjacent in their triangle, suggesting excellent harmony and complementary energies.`,
        'triangle_neutral': `${sign1} and ${sign2} belong to different triangles, requiring effort to understand each other's perspectives.`
    };

    return explanations[relationship] || 'Compatibility requires mutual understanding and compromise.';
}

/**
 * Analyze polar (opposite) relationship compatibility
 * @param {string} sign1 - First zodiac sign
 * @param {string} sign2 - Second zodiac sign
 * @returns {PolarAnalysis} Polar compatibility analysis
 */
function analyzePolarCompatibility(sign1, sign2) {
    let compatibility = CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.NEUTRAL_COMPATIBILITY_SCORE;
    let relationship = 'neutral';
    let attraction = 'moderate';

    if (isBidirectionalRelationship(sign1, sign2, POLAR_RELATIONSHIPS)) {
        // Signs are polar opposites
        compatibility = COMPATIBILITY_THRESHOLDS.POLAR_OPPOSITE;
        relationship = 'polar_opposite';
        attraction = 'strong';

        // Check for element complementarity
        const sign1Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign1);
        const sign2Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign2);

        if (sign1Data && sign2Data) {
            const elementComp = calculateElementCompatibility(sign1Data.element, sign2Data.element);
            if (elementComp > 1.0) {
                compatibility += 0.5;
                attraction = 'very_strong';
            }
        }
    } else {
        // Not polar opposites
        relationship = 'non_polar';
        attraction = 'neutral';
    }

    return {
        compatibility: normalizeCompatibilityScore(compatibility),
        relationship: relationship,
        attraction: attraction,
        polarSign1: POLAR_RELATIONSHIPS[sign1],
        polarSign2: POLAR_RELATIONSHIPS[sign2],
        explanation: getPolarExplanation(relationship, attraction, sign1, sign2)
    };
}

/**
 * Get explanation for polar relationship
 * @param {string} relationship - Relationship type
 * @param {string} attraction - Attraction level
 * @param {string} sign1 - First sign
 * @param {string} sign2 - Second sign
 * @returns {string} Explanation text
 */
function getPolarExplanation(relationship, attraction, sign1, sign2) {
    if (relationship === 'polar_opposite') {
        const attractionText = {
            'strong': 'strong magnetic attraction',
            'very_strong': 'very strong magnetic attraction'
        }[attraction] || 'magnetic attraction';

        return `${sign1} and ${sign2} are polar opposites, creating ${attractionText} but also potential challenges that can lead to growth.`;
    }

    return `${sign1} and ${sign2} are not polar opposites, so their relationship follows different compatibility patterns.`;
}

/**
 * Analyze secret friend relationship
 * @param {string} sign1 - First zodiac sign
 * @param {string} sign2 - Second zodiac sign
 * @returns {SecretFriendAnalysis} Secret friend compatibility analysis
 */
function analyzeSecretFriendCompatibility(sign1, sign2) {
    let compatibility = CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.NEUTRAL_COMPATIBILITY_SCORE;
    let relationship = 'neutral';
    let friendship = 'casual';

    if (isBidirectionalRelationship(sign1, sign2, SECRET_FRIENDS)) {
        // Signs are secret friends
        compatibility = COMPATIBILITY_THRESHOLDS.SECRET_FRIEND;
        relationship = 'secret_friend';
        friendship = 'deep';

        // Secret friends often have complementary elements
        const sign1Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign1);
        const sign2Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign2);

        if (sign1Data && sign2Data) {
            const elementComp = calculateElementCompatibility(sign1Data.element, sign2Data.element);
            if (elementComp >= 1.1) {
                compatibility += 0.5;
                friendship = 'very_deep';
            }
        }
    }

    return {
        compatibility: normalizeCompatibilityScore(compatibility),
        relationship: relationship,
        friendship: friendship,
        secretFriend1: SECRET_FRIENDS[sign1],
        secretFriend2: SECRET_FRIENDS[sign2],
        explanation: getSecretFriendExplanation(relationship, friendship, sign1, sign2)
    };
}

/**
 * Get explanation for secret friend relationship
 * @param {string} relationship - Relationship type
 * @param {string} friendship - Friendship depth
 * @param {string} sign1 - First sign
 * @param {string} sign2 - Second sign
 * @returns {string} Explanation text
 */
function getSecretFriendExplanation(relationship, friendship, sign1, sign2) {
    if (relationship === 'secret_friend') {
        const depthText = {
            'deep': 'deep and meaningful',
            'very_deep': 'very deep and profound'
        }[friendship] || 'meaningful';

        return `${sign1} and ${sign2} are secret friends, sharing a ${depthText} bond that may not be immediately apparent but grows stronger over time.`;
    }

    return `${sign1} and ${sign2} are not secret friends, though they may still develop strong relationships through other compatibility factors.`;
}

// ============================================================================
// MAIN COMPATIBILITY CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate compatibility factors for two signs
 * @param {string} sign1 - First zodiac sign
 * @param {string} sign2 - Second zodiac sign
 * @returns {object} Individual compatibility factors
 */
function calculateCompatibilityFactors(sign1, sign2) {
    return {
        triangle: analyzeTriangleCompatibility(sign1, sign2),
        polar: analyzePolarCompatibility(sign1, sign2),
        secretFriend: analyzeSecretFriendCompatibility(sign1, sign2),
        element: calculateElementCompatibility(
            CHINESE_ZODIAC_SIGNS.find(s => s.name === sign1).element,
            CHINESE_ZODIAC_SIGNS.find(s => s.name === sign2).element
        )
    };
}

/**
 * Apply weights and cultural bias to factors
 * @param {object} factors - Compatibility factors
 * @returns {object} Weighted and biased results
 */
function applyWeightsAndBias(factors) {
    const factorScores = [
        factors.triangle.compatibility,
        factors.polar.compatibility,
        factors.secretFriend.compatibility,
        factors.element * 10 // Convert to 1-10 scale
    ];

    const weights = [
        CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.TRIANGLE_COMPATIBILITY_WEIGHT,
        CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.POLAR_RELATIONSHIP_WEIGHT,
        CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.SECRET_FRIEND_WEIGHT,
        CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.ELEMENT_COMPATIBILITY_WEIGHT
    ];

    const baseScore = calculateWeightedCompatibility(factorScores, weights);
    const finalScore = applyCulturalBias(baseScore);

    return {
        baseScore,
        finalScore: normalizeCompatibilityScore(finalScore),
        weights
    };
}

/**
 * Build comprehensive analysis result
 * @param {string} sign1 - First sign
 * @param {string} sign2 - Second sign
 * @param {object} factors - Compatibility factors
 * @param {object} weighted - Weighted results
 * @returns {object} Complete compatibility analysis
 */
function buildAnalysisResult(sign1, sign2, factors, weighted) {
    const relationshipType = determineRelationshipType(factors.triangle, factors.polar, factors.secretFriend);
    const analysis = generateCompatibilityAnalysis(sign1, sign2, weighted.finalScore, relationshipType);

    return {
        sign1: sign1,
        sign2: sign2,
        overallScore: weighted.finalScore,
        relationshipType: relationshipType,
        breakdown: {
            triangle: factors.triangle,
            polar: factors.polar,
            secretFriend: factors.secretFriend,
            element: {
                compatibility: factors.element * 10,
                element1: CHINESE_ZODIAC_SIGNS.find(s => s.name === sign1).element,
                element2: CHINESE_ZODIAC_SIGNS.find(s => s.name === sign2).element
            }
        },
        analysis: analysis,
        calculationMetadata: {
            algorithm: 'Comprehensive Compatibility v1.0',
            factors: 4,
            weights: weighted.weights,
            culturalBias: CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.TRADITIONAL_BIAS_FACTOR
        }
    };
}

/**
 * Calculate comprehensive compatibility between two zodiac signs
 * @param {string} sign1 - First zodiac sign
 * @param {string} sign2 - Second zodiac sign
 * @returns {object} Comprehensive compatibility analysis
 */
function calculateComprehensiveCompatibility(sign1, sign2) {
    // Validate inputs
    const [normalizedSign1, normalizedSign2] = validateSigns(sign1, sign2);

    // Calculate individual compatibility factors
    const factors = calculateCompatibilityFactors(normalizedSign1, normalizedSign2);

    // Apply weights and cultural bias
    const weighted = applyWeightsAndBias(factors);

    // Build complete analysis result
    return buildAnalysisResult(normalizedSign1, normalizedSign2, factors, weighted);
}

/**
 * Determine the primary relationship type
 * @param {TriangleAnalysis} triangleComp - Triangle compatibility analysis
 * @param {PolarAnalysis} polarComp - Polar compatibility analysis
 * @param {SecretFriendAnalysis} secretFriendComp - Secret friend compatibility analysis
 * @returns {string} Primary relationship type
 */
function determineRelationshipType(triangleComp, polarComp, secretFriendComp) {
    // Priority: Secret Friend > Triangle > Polar > Neutral
    if (secretFriendComp.relationship === 'secret_friend') {
        return 'secret_friend';
    }

    if (triangleComp.relationship !== 'triangle_neutral') {
        return triangleComp.relationship;
    }

    if (polarComp.relationship === 'polar_opposite') {
        return 'polar_opposite';
    }

    return 'neutral';
}

/**
 * Generate detailed compatibility analysis
 * @param {string} sign1 - First sign
 * @param {string} sign2 - Second sign
 * @param {number} score - Overall compatibility score
 * @param {string} relationshipType - Primary relationship type
 * @returns {object} Detailed analysis object
 */
function generateCompatibilityAnalysis(sign1, sign2, score, relationshipType) {
    const analysis = {
        summary: '',
        strengths: [],
        challenges: [],
        recommendations: [],
        longTermPotential: ''
    };

    // Generate summary based on score
    if (score >= COMPATIBILITY_THRESHOLDS.SECRET_FRIEND) {
        analysis.summary = `${sign1} and ${sign2} have excellent compatibility with strong natural harmony.`;
        analysis.strengths.push('Natural understanding and mutual respect');
        analysis.longTermPotential = 'High potential for long-term success';
    } else if (score >= COMPATIBILITY_THRESHOLDS.POLAR_OPPOSITE) {
        analysis.summary = `${sign1} and ${sign2} have good compatibility with complementary energies.`;
        analysis.strengths.push('Complementary strengths and perspectives');
        analysis.longTermPotential = 'Good potential with mutual effort';
    } else if (score >= COMPATIBILITY_THRESHOLDS.TRIANGLE_NEUTRAL) {
        analysis.summary = `${sign1} and ${sign2} have moderate compatibility requiring understanding.`;
        analysis.challenges.push('May need to work on communication');
        analysis.longTermPotential = 'Moderate potential with compromise';
    } else {
        analysis.summary = `${sign1} and ${sign2} have challenging compatibility requiring significant effort.`;
        analysis.challenges.push('Fundamental differences in approach');
        analysis.longTermPotential = 'Challenging but possible with dedication';
    }

    // Add relationship-specific insights
    switch (relationshipType) {
        case 'secret_friend':
            analysis.strengths.push('Deep, unspoken understanding');
            analysis.recommendations.push('Allow relationship to develop naturally');
            break;
        case 'triangle_ally':
            analysis.strengths.push('Shared values and goals');
            analysis.recommendations.push('Leverage complementary skills');
            break;
        case 'polar_opposite':
            analysis.strengths.push('Exciting attraction and growth opportunities');
            analysis.challenges.push('Potential for conflict and misunderstanding');
            analysis.recommendations.push('Practice patience and communication');
            break;
    }

    return analysis;
}

// ============================================================================
// ZODIAC COMPATIBILITY ENGINE CLASS
// ============================================================================

/**
 * Complete ZC2.3 Zodiac Compatibility Engine
 */
class ZodiacCompatibilityEngine {
    /**
     * @param {object} options - Engine configuration options
     */
    constructor(options = {}) {
        this.constants = CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS;
        this.matrix = options.useMatrix ? this.generateCompatibilityMatrix() : null;
        this.customWeights = options.weights || {};
        this.cache = new LimitedCache();
        this.validator = new ZodiacCompatibilityValidator();
    }

    /**
     * Calculate compatibility between two zodiac signs
     * @param {string} sign1 - First zodiac sign
     * @param {string} sign2 - Second zodiac sign
     * @param {object} options - Calculation options
     * @returns {CompatibilityResult} Compatibility result
     */
    calculateCompatibility(sign1, sign2, options = {}) {
        try {
            // Validate and normalize inputs
            const [normalizedSign1, normalizedSign2] = validateSigns(sign1, sign2);

            // Check cache first
            const cacheKey = `${normalizedSign1}-${normalizedSign2}`;
            if (this.cache.has(cacheKey) && !options.skipCache) {
                return this.cache.get(cacheKey);
            }

            let result;

            if (this.matrix && !options.forceCalculation) {
                // Use pre-calculated matrix
                result = this.calculateFromMatrix(normalizedSign1, normalizedSign2);
            } else {
                // Calculate from scratch
                result = this.calculateComprehensive(normalizedSign1, normalizedSign2);
            }

            // Apply custom weights if provided
            if (Object.keys(this.customWeights).length > 0) {
                result = this.applyCustomWeights(result, this.customWeights);
            }

            // Cache result
            this.cache.set(cacheKey, result);

            return result;

        } catch (error) {
            throw new ZodiacCompatibilityError(`Compatibility calculation failed: ${error.message}`, error.code);
        }
    }

    /**
     * Calculate using pre-built matrix
     * @param {string} sign1 - First sign
     * @param {string} sign2 - Second sign
     * @returns {CompatibilityResult} Matrix-based result
     */
    calculateFromMatrix(sign1, sign2) {
        const matrixData = this.getCompatibilityFromMatrix(sign1, sign2);
        const detailed = calculateComprehensiveCompatibility(sign1, sign2);

        return {
            sign1: sign1,
            sign2: sign2,
            score: matrixData.score,
            type: matrixData.type,
            summary: matrixData.summary,
            detailed: detailed,
            source: 'matrix'
        };
    }

    /**
     * Calculate comprehensive compatibility
     * @param {string} sign1 - First sign
     * @param {string} sign2 - Second sign
     * @returns {CompatibilityResult} Comprehensive result
     */
    calculateComprehensive(sign1, sign2) {
        const compatibility = calculateComprehensiveCompatibility(sign1, sign2);
        const weighted = this.calculateWeightedCompatibilityScore(sign1, sign2, this.customWeights);

        return {
            sign1: sign1,
            sign2: sign2,
            score: compatibility.overallScore,
            weightedScore: weighted.overallScore,
            type: compatibility.relationshipType,
            summary: compatibility.analysis.summary,
            breakdown: compatibility.breakdown,
            weightedBreakdown: weighted.breakdown,
            analysis: compatibility.analysis,
            source: 'calculated'
        };
    }

    /**
     * Apply custom weights to existing result
     * @param {CompatibilityResult} result - Base result
     * @param {object} customWeights - Custom weights
     * @returns {CompatibilityResult} Weighted result
     */
    applyCustomWeights(result, customWeights) {
        const weighted = this.calculateWeightedCompatibilityScore(result.sign1, result.sign2, customWeights);

        return {
            ...result,
            weightedScore: weighted.overallScore,
            weightedBreakdown: weighted.breakdown,
            customWeights: customWeights
        };
    }

    /**
     * Get compatibility trends for a sign
     * @param {string} sign - Zodiac sign to analyze
     * @returns {object} Compatibility trends
     */
    getCompatibilityTrends(sign) {
        const normalizedSign = validateSign(sign);

        const trends = {
            sign: normalizedSign,
            bestMatches: [],
            challengingMatches: [],
            averageScore: 0,
            distribution: {}
        };

        const scores = [];
        const signs = CHINESE_ZODIAC_SIGNS.map(s => s.name);

        signs.forEach(otherSign => {
            if (otherSign !== normalizedSign) {
                const compatibility = this.calculateCompatibility(normalizedSign, otherSign);
                scores.push(compatibility.score);

                // Categorize relationships
                if (compatibility.score >= COMPATIBILITY_THRESHOLDS.POLAR_OPPOSITE) {
                    trends.bestMatches.push(otherSign);
                } else if (compatibility.score <= COMPATIBILITY_THRESHOLDS.TRIANGLE_NEUTRAL) {
                    trends.challengingMatches.push(otherSign);
                }
            }
        });

        trends.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Calculate score distribution
        trends.distribution = {
            excellent: scores.filter(s => s >= COMPATIBILITY_THRESHOLDS.SECRET_FRIEND).length,
            good: scores.filter(s => s >= COMPATIBILITY_THRESHOLDS.POLAR_OPPOSITE && s < COMPATIBILITY_THRESHOLDS.SECRET_FRIEND).length,
            moderate: scores.filter(s => s >= COMPATIBILITY_THRESHOLDS.TRIANGLE_NEUTRAL && s < COMPATIBILITY_THRESHOLDS.POLAR_OPPOSITE).length,
            challenging: scores.filter(s => s < COMPATIBILITY_THRESHOLDS.TRIANGLE_NEUTRAL).length
        };

        return trends;
    }

    /**
     * Generate complete 12x12 compatibility matrix
     * @returns {object} Compatibility matrix
     */
    generateCompatibilityMatrix() {
        const matrix = {};
        const signs = CHINESE_ZODIAC_SIGNS.map(s => s.name);

        signs.forEach(sign1 => {
            matrix[sign1] = {};
            signs.forEach(sign2 => {
                const compatibility = calculateComprehensiveCompatibility(sign1, sign2);
                matrix[sign1][sign2] = {
                    score: compatibility.overallScore,
                    type: compatibility.relationshipType,
                    summary: compatibility.analysis.summary
                };
            });
        });

        return matrix;
    }

    /**
     * Get compatibility score from matrix
     * @param {string} sign1 - First sign
     * @param {string} sign2 - Second sign
     * @returns {object} Matrix data
     */
    getCompatibilityFromMatrix(sign1, sign2) {
        if (this.matrix && this.matrix[sign1] && this.matrix[sign1][sign2]) {
            return this.matrix[sign1][sign2];
        }

        // Fallback to calculation if not in matrix
        const compatibility = calculateComprehensiveCompatibility(sign1, sign2);
        return {
            score: compatibility.overallScore,
            type: compatibility.relationshipType,
            summary: compatibility.analysis.summary
        };
    }

    /**
     * Calculate weighted compatibility score with multiple factors
     * @param {string} sign1 - First sign
     * @param {string} sign2 - Second sign
     * @param {object} customWeights - Custom weights
     * @returns {object} Weighted compatibility result
     */
    calculateWeightedCompatibilityScore(sign1, sign2, customWeights = {}) {
        const defaultWeights = {
            triangle: CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.TRIANGLE_COMPATIBILITY_WEIGHT,
            polar: CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.POLAR_RELATIONSHIP_WEIGHT,
            secretFriend: CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.SECRET_FRIEND_WEIGHT,
            element: CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.ELEMENT_COMPATIBILITY_WEIGHT,
            polarity: 0.8,
            direction: 0.6
        };

        const weights = { ...defaultWeights, ...customWeights };

        // Calculate individual factor scores
        const triangleScore = analyzeTriangleCompatibility(sign1, sign2).compatibility;
        const polarScore = analyzePolarCompatibility(sign1, sign2).compatibility;
        const secretFriendScore = analyzeSecretFriendCompatibility(sign1, sign2).compatibility;

        const sign1Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign1);
        const sign2Data = CHINESE_ZODIAC_SIGNS.find(s => s.name === sign2);

        const elementScore = calculateElementCompatibility(sign1Data.element, sign2Data.element) * 10;
        const polarityScore = calculatePolarityCompatibility(sign1Data.polarity, sign2Data.polarity);
        const directionScore = calculateDirectionCompatibility(sign1Data.direction, sign2Data.direction);

        // Apply weights
        const factors = [triangleScore, polarScore, secretFriendScore, elementScore, polarityScore, directionScore];
        const factorWeights = [weights.triangle, weights.polar, weights.secretFriend, weights.element, weights.polarity, weights.direction];

        const weightedScore = calculateWeightedCompatibility(factors, factorWeights);

        return {
            overallScore: normalizeCompatibilityScore(weightedScore),
            breakdown: {
                triangle: { score: triangleScore, weight: weights.triangle },
                polar: { score: polarScore, weight: weights.polar },
                secretFriend: { score: secretFriendScore, weight: weights.secretFriend },
                element: { score: elementScore, weight: weights.element },
                polarity: { score: polarityScore, weight: weights.polarity },
                direction: { score: directionScore, weight: weights.direction }
            },
            weights: factorWeights
        };
    }

    /**
     * Clear compatibility cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get engine statistics
     * @returns {object} Engine statistics
     */
    getStatistics() {
        return {
            cacheSize: this.cache.size,
            calculationsPerformed: this.cache.size,
            matrixEnabled: this.matrix !== null,
            customWeights: Object.keys(this.customWeights).length > 0
        };
    }
}

// ============================================================================
// VALIDATION AND ERROR HANDLING
// ============================================================================

/**
 * Input validation for zodiac compatibility
 */
class ZodiacCompatibilityValidator {
    /**
     * Validate two signs for compatibility calculation
     * @param {string} sign1 - First sign
     * @param {string} sign2 - Second sign
     * @throws {ValidationError} If signs are invalid or identical
     */
    validateSigns(sign1, sign2) {
        const normalizedSign1 = this.validateSign(sign1);
        const normalizedSign2 = this.validateSign(sign2);

        if (normalizedSign1 === normalizedSign2) {
            throw new ValidationError(ERROR_MESSAGES.IDENTICAL_SIGNS);
        }

        return [normalizedSign1, normalizedSign2];
    }

    /**
     * Validate a single zodiac sign
     * @param {string} sign - Sign to validate
     * @returns {string} Normalized sign
     * @throws {ValidationError} If sign is invalid
     */
    validateSign(sign) {
        if (!sign || typeof sign !== 'string') {
            throw new ValidationError(ERROR_MESSAGES.INVALID_TYPE);
        }

        const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
        const validSigns = CHINESE_ZODIAC_SIGNS.map(s => s.name);

        if (!validSigns.includes(normalizedSign)) {
            throw new ValidationError(ERROR_MESSAGES.INVALID_SIGN(sign));
        }

        return normalizedSign;
    }
}

/**
 * Custom error classes
 */
class ZodiacCompatibilityError extends Error {
    /**
     * @param {string} message - Error message
     * @param {string} code - Error code
     */
    constructor(message, code = 'COMPATIBILITY_ERROR') {
        super(message);
        this.name = 'ZodiacCompatibilityError';
        this.code = code;
    }
}

class ValidationError extends ZodiacCompatibilityError {
    /**
     * @param {string} message - Validation error message
     */
    constructor(message) {
        super(message, 'VALIDATION_ERROR');
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    ZodiacCompatibilityEngine,
    CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS,
    COMPATIBILITY_THRESHOLDS,
    CHINESE_ZODIAC_SIGNS,
    TRIANGLE_GROUPS,
    POLAR_RELATIONSHIPS,
    SECRET_FRIENDS,
    calculateComprehensiveCompatibility,
    analyzeTriangleCompatibility,
    analyzePolarCompatibility,
    analyzeSecretFriendCompatibility,
    calculateElementCompatibility,
    normalizeCompatibilityScore,
    calculateWeightedCompatibility,
    applyCulturalBias,
    ZodiacCompatibilityError,
    ValidationError
};