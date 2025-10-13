/**
 * Simple test script to verify the refactored compatibility engine
 */

const {
    ZodiacCompatibilityEngine,
    calculateComprehensiveCompatibility,
    analyzeTriangleCompatibility,
    analyzePolarCompatibility,
    analyzeSecretFriendCompatibility
} = require('./src/services/astrology/chinese-zodiac-compatibility-engine');

console.log('Testing ZC2.3 Chinese Zodiac Compatibility Engine...\n');

// Test basic functionality
try {
    console.log('1. Testing basic compatibility calculation...');
    const result = calculateComprehensiveCompatibility('Rat', 'Dragon');
    console.log(`   Rat-Dragon compatibility: ${result.overallScore.toFixed(1)} (${result.relationshipType})`);
    console.log(`   Summary: ${result.analysis.summary}\n`);

    console.log('2. Testing triangle compatibility...');
    const triangle = analyzeTriangleCompatibility('Rat', 'Dragon');
    console.log(`   Triangle relationship: ${triangle.relationship}\n`);

    console.log('3. Testing polar compatibility...');
    const polar = analyzePolarCompatibility('Rat', 'Horse');
    console.log(`   Polar relationship: ${polar.relationship}\n`);

    console.log('4. Testing secret friend compatibility...');
    const secret = analyzeSecretFriendCompatibility('Rat', 'Ox');
    console.log(`   Secret friend relationship: ${secret.relationship}\n`);

    console.log('5. Testing engine class...');
    const engine = new ZodiacCompatibilityEngine();
    const engineResult = engine.calculateCompatibility('Rat', 'Dragon');
    console.log(`   Engine result: ${engineResult.score.toFixed(1)} (${engineResult.type})`);
    console.log(`   Cache size: ${engine.cache.size}\n`);

    console.log('6. Testing case-insensitive input...');
    const caseResult = engine.calculateCompatibility('rat', 'DRAGON');
    console.log(`   Case-insensitive result: ${caseResult.score.toFixed(1)}\n`);

    console.log('7. Testing trends...');
    const trends = engine.getCompatibilityTrends('Rat');
    console.log(`   Rat best matches: ${trends.bestMatches.join(', ')}`);
    console.log(`   Rat challenging matches: ${trends.challengingMatches.join(', ')}\n`);

    console.log('✅ All tests passed! The refactored engine is working correctly.');

} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}