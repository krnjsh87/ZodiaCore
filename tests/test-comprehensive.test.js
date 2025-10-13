/**
 * Comprehensive Test Suite for ZC2.3 Chinese Zodiac Compatibility Engine
 *
 * This test suite provides extensive coverage of edge cases, boundary conditions,
 * cultural accuracy verification, and performance benchmarks.
 */

const {
    ZodiacCompatibilityEngine,
    CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS,
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
} = require('./src/services/astrology/chinese-zodiac-compatibility-engine');

describe('ZC2.3 Chinese Zodiac Compatibility Engine - Comprehensive Tests', () => {

    // ============================================================================
    // EDGE CASE AND BOUNDARY TESTS
    // ============================================================================

    describe('Edge Cases and Boundary Conditions', () => {
        let engine;

        beforeEach(() => {
            engine = new ZodiacCompatibilityEngine();
        });

        test('should handle all triangle combinations correctly', () => {
            TRIANGLE_GROUPS.forEach(triangle => {
                for (let i = 0; i < triangle.length; i++) {
                    for (let j = i + 1; j < triangle.length; j++) {
                        const result = engine.calculateCompatibility(triangle[i], triangle[j]);
                        expect(result.type).toMatch(/^triangle_/);
                        expect(result.score).toBeGreaterThanOrEqual(8.0);
                    }
                }
            });
        });

        test('should handle all polar relationships correctly', () => {
            Object.entries(POLAR_RELATIONSHIPS).forEach(([sign1, sign2]) => {
                const result = engine.calculateCompatibility(sign1, sign2);
                expect(result.type).toBe('polar_opposite');
                expect(result.score).toBeGreaterThanOrEqual(7.5);
                expect(result.score).toBeLessThanOrEqual(8.0);
            });
        });

        test('should handle all secret friend relationships correctly', () => {
            Object.entries(SECRET_FRIENDS).forEach(([sign1, sign2]) => {
                const result = engine.calculateCompatibility(sign1, sign2);
                expect(result.type).toBe('secret_friend');
                expect(result.score).toBeGreaterThanOrEqual(8.5);
            });
        });

        test('should handle same element pairs with appropriate scores', () => {
            const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

            elements.forEach(element => {
                const sameElementSigns = CHINESE_ZODIAC_SIGNS.filter(s => s.element === element);
                sameElementSigns.forEach(sign1 => {
                    sameElementSigns.forEach(sign2 => {
                        if (sign1.name !== sign2.name) {
                            const result = engine.calculateCompatibility(sign1.name, sign2.name);
                            expect(result.breakdown.element.compatibility).toBe(10.0);
                        }
                    });
                });
            });
        });

        test('should handle extreme polarity differences', () => {
            const yinSigns = CHINESE_ZODIAC_SIGNS.filter(s => s.polarity === 'Yin').map(s => s.name);
            const yangSigns = CHINESE_ZODIAC_SIGNS.filter(s => s.polarity === 'Yang').map(s => s.name);

            yinSigns.forEach(yinSign => {
                yangSigns.forEach(yangSign => {
                    const result = engine.calculateCompatibility(yinSign, yangSign);
                    expect(result.breakdown.polarity.score).toBe(6.0);
                });
            });
        });

        test('should handle direction proximity correctly', () => {
            const result1 = engine.calculateCompatibility('Rat', 'Ox'); // 0° and 30°
            expect(result1.breakdown.direction.score).toBe(8.0);

            const result2 = engine.calculateCompatibility('Rat', 'Horse'); // 0° and 180°
            expect(result2.breakdown.direction.score).toBe(5.5);
        });

        test('should handle minimum and maximum compatibility scores', () => {
            const signs = CHINESE_ZODIAC_SIGNS.map(s => s.name);

            signs.forEach(sign1 => {
                signs.forEach(sign2 => {
                    if (sign1 !== sign2) {
                        const result = engine.calculateCompatibility(sign1, sign2);
                        expect(result.score).toBeGreaterThanOrEqual(1.0);
                        expect(result.score).toBeLessThanOrEqual(10.0);
                        expect(result.overallScore).toBeGreaterThanOrEqual(1.0);
                        expect(result.overallScore).toBeLessThanOrEqual(10.0);
                    }
                });
            });
        });
    });

    // ============================================================================
    // CULTURAL ACCURACY VERIFICATION TESTS
    // ============================================================================

    describe('Cultural Accuracy Verification', () => {
        let engine;

        beforeEach(() => {
            engine = new ZodiacCompatibilityEngine();
        });

        test('should match traditional triangle compatibility expectations', () => {
            const ratMonkey = engine.calculateCompatibility('Rat', 'Monkey');
            expect(ratMonkey.type).toBe('triangle_adjacent');
            expect(ratMonkey.score).toBeGreaterThanOrEqual(9.0);

            const oxRooster = engine.calculateCompatibility('Ox', 'Rooster');
            expect(oxRooster.type).toBe('triangle_adjacent');
            expect(oxRooster.score).toBeGreaterThanOrEqual(9.0);

            const tigerGoat = engine.calculateCompatibility('Tiger', 'Goat');
            expect(tigerGoat.type).toBe('triangle_adjacent');
            expect(tigerGoat.score).toBeGreaterThanOrEqual(9.0);

            const rabbitDog = engine.calculateCompatibility('Rabbit', 'Dog');
            expect(rabbitDog.type).toBe('triangle_adjacent');
            expect(rabbitDog.score).toBeGreaterThanOrEqual(9.0);
        });

        test('should match traditional polar relationship expectations', () => {
            const ratHorse = engine.calculateCompatibility('Rat', 'Horse');
            expect(ratHorse.type).toBe('polar_opposite');
            expect(ratHorse.analysis.strengths).toContain('Exciting attraction and growth opportunities');

            const dragonDog = engine.calculateCompatibility('Dragon', 'Dog');
            expect(dragonDog.type).toBe('polar_opposite');
            expect(dragonDog.analysis.challenges).toContain('Potential for conflict and misunderstanding');
        });

        test('should match traditional secret friend expectations', () => {
            const ratOx = engine.calculateCompatibility('Rat', 'Ox');
            expect(ratOx.type).toBe('secret_friend');
            expect(ratOx.analysis.strengths).toContain('Deep, unspoken understanding');

            const tigerPig = engine.calculateCompatibility('Tiger', 'Pig');
            expect(tigerPig.type).toBe('secret_friend');
            expect(tigerPig.analysis.strengths).toContain('Deep, unspoken understanding');
        });

        test('should provide culturally appropriate explanations', () => {
            const relationships = [
                { signs: ['Rat', 'Dragon'], type: 'triangle_adjacent' },
                { signs: ['Rat', 'Horse'], type: 'polar_opposite' },
                { signs: ['Rat', 'Ox'], type: 'secret_friend' }
            ];

            relationships.forEach(({ signs, type }) => {
                const result = engine.calculateCompatibility(signs[0], signs[1]);
                expect(result.type).toBe(type);
                expect(result.analysis.summary).toBeDefined();
                expect(result.analysis.strengths.length).toBeGreaterThan(0);
                expect(typeof result.analysis.summary).toBe('string');
            });
        });
    });

    // ============================================================================
    // VALIDATION AND ERROR HANDLING TESTS
    // ============================================================================

    describe('Validation and Error Handling', () => {
        let engine;

        beforeEach(() => {
            engine = new ZodiacCompatibilityEngine();
        });

        test('should reject invalid zodiac signs', () => {
            const invalidSigns = ['', null, undefined, 123, {}, [], 'invalid', 'Cat', 'Lion'];

            invalidSigns.forEach(invalidSign => {
                expect(() => engine.calculateCompatibility(invalidSign, 'Rat')).toThrow(ValidationError);
                expect(() => engine.calculateCompatibility('Rat', invalidSign)).toThrow(ValidationError);
                expect(() => engine.getCompatibilityTrends(invalidSign)).toThrow(ValidationError);
            });
        });

        test('should reject identical signs', () => {
            CHINESE_ZODIAC_SIGNS.forEach(sign => {
                expect(() => engine.calculateCompatibility(sign.name, sign.name)).toThrow(ValidationError);
            });
        });

        test('should handle case-insensitive input correctly', () => {
            const variations = ['rat', 'RAT', 'Rat', 'rAt'];

            variations.forEach(variation => {
                const result = engine.calculateCompatibility(variation, 'Dragon');
                expect(result.sign1).toBe('Rat');
                expect(result.sign2).toBe('Dragon');
                expect(result.score).toBeDefined();
            });
        });

        test('should handle whitespace and normalization', () => {
            const inputs = [' rat ', ' RAT ', ' rAt '];

            inputs.forEach(input => {
                const result = engine.calculateCompatibility(input, 'Dragon');
                expect(result.sign1).toBe('Rat');
                expect(result.sign2).toBe('Dragon');
            });
        });

        test('should provide meaningful error messages', () => {
            try {
                engine.calculateCompatibility('Invalid', 'Rat');
                fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                expect(error.message).toContain('Invalid zodiac sign');
                expect(error.message).toContain('Valid signs');
            }
        });
    });

    // ============================================================================
    // PERFORMANCE TESTS
    // ============================================================================

    describe('Performance Tests', () => {
        let engine;

        beforeEach(() => {
            engine = new ZodiacCompatibilityEngine();
        });

        test('single calculation should be fast', () => {
            const startTime = Date.now();

            engine.calculateCompatibility('Rat', 'Dragon');

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(50); // Should complete in less than 50ms
        });

        test('matrix generation should be reasonably fast', () => {
            const startTime = Date.now();

            const matrixEngine = new ZodiacCompatibilityEngine({ useMatrix: true });

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(500); // Should complete in less than 500ms
        });

        test('cached calculations should be very fast', () => {
            engine.calculateCompatibility('Rat', 'Dragon');
            const startTime = Date.now();

            engine.calculateCompatibility('Rat', 'Dragon');

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(5); // Should complete in less than 5ms
        });

        test('should handle concurrent calculations efficiently', () => {
            const promises = [];

            for (let i = 0; i < 50; i++) {
                const sign1 = CHINESE_ZODIAC_SIGNS[i % 12].name;
                const sign2 = CHINESE_ZODIAC_SIGNS[(i + 1) % 12].name;
                promises.push(engine.calculateCompatibility(sign1, sign2));
            }

            const startTime = Date.now();

            return Promise.all(promises).then(results => {
                const endTime = Date.now();
                const duration = endTime - startTime;

                expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
                expect(results).toHaveLength(50);
                results.forEach(result => {
                    expect(result.score).toBeDefined();
                });
            });
        });

        test('memory usage should remain stable', () => {
            for (let i = 0; i < 1000; i++) {
                const sign1 = CHINESE_ZODIAC_SIGNS[i % 12].name;
                const sign2 = CHINESE_ZODIAC_SIGNS[(i + 1) % 12].name;
                engine.calculateCompatibility(sign1, sign2);
            }

            expect(engine.cache.size).toBeLessThanOrEqual(1000);
        });
    });

    // ============================================================================
    // SPECIFICATION COMPLIANCE TESTS
    // ============================================================================

    describe('Specification Compliance', () => {
        let engine;

        beforeEach(() => {
            engine = new ZodiacCompatibilityEngine();
        });

        test('should implement all required relationship types', () => {
            const requiredTypes = ['triangle_ally', 'triangle_adjacent', 'polar_opposite', 'secret_friend', 'neutral'];

            const signs = CHINESE_ZODIAC_SIGNS.map(s => s.name);
            const foundTypes = new Set();

            signs.forEach(sign1 => {
                signs.forEach(sign2 => {
                    if (sign1 !== sign2) {
                        const result = engine.calculateCompatibility(sign1, sign2);
                        foundTypes.add(result.type);
                    }
                });
            });

            requiredTypes.forEach(type => {
                expect(foundTypes.has(type)).toBe(true);
            });
        });

        test('should provide complete analysis structure', () => {
            const result = engine.calculateCompatibility('Rat', 'Dragon');

            expect(result).toHaveProperty('sign1');
            expect(result).toHaveProperty('sign2');
            expect(result).toHaveProperty('overallScore');
            expect(result).toHaveProperty('relationshipType');
            expect(result).toHaveProperty('breakdown');
            expect(result).toHaveProperty('analysis');
            expect(result).toHaveProperty('calculationMetadata');

            expect(result.breakdown).toHaveProperty('triangle');
            expect(result.breakdown).toHaveProperty('polar');
            expect(result.breakdown).toHaveProperty('secretFriend');
            expect(result.breakdown).toHaveProperty('element');

            expect(result.analysis).toHaveProperty('summary');
            expect(result.analysis).toHaveProperty('strengths');
            expect(result.analysis).toHaveProperty('challenges');
            expect(result.analysis).toHaveProperty('recommendations');
            expect(result.analysis).toHaveProperty('longTermPotential');
        });

        test('should apply cultural bias correctly', () => {
            const baseScore = 8.0;
            const biasedScore = applyCulturalBias(baseScore);

            expect(biasedScore).toBeCloseTo(8.12, 2);
        });

        test('should use correct weight constants', () => {
            expect(CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.TRIANGLE_COMPATIBILITY_WEIGHT).toBe(2.0);
            expect(CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.POLAR_RELATIONSHIP_WEIGHT).toBe(1.5);
            expect(CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.SECRET_FRIEND_WEIGHT).toBe(1.8);
            expect(CHINESE_ZODIAC_COMPATIBILITY_CONSTANTS.ELEMENT_COMPATIBILITY_WEIGHT).toBe(1.3);
        });
    });
});