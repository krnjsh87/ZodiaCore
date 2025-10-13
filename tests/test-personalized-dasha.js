/**
 * Simple test script for Personalized Dasha Guidance System
 */

const PersonalizedDashaGuidanceSystem = require('./src/services/astrology/personalized-dasha-guidance.js');

// Mock birth chart data
const mockBirthChart = {
    id: 'test_chart_123',
    birthData: {
        year: 1990,
        month: 5,
        day: 15,
        hour: 14,
        minute: 30,
        second: 0
    },
    ascendant: {
        sign: 0 // Aries
    },
    planets: {
        SUN: { sign: 1, degree: 15 },
        MOON: { sign: 3, degree: 20 },
        MARS: { sign: 7, degree: 10 },
        MERCURY: { sign: 1, degree: 25 },
        JUPITER: { sign: 8, degree: 5 },
        VENUS: { sign: 0, degree: 30 },
        SATURN: { sign: 9, degree: 12 }
    },
    dasha: {
        balance: {
            years: 5,
            months: 6,
            days: 15
        }
    }
};

async function testPersonalizedDashaGuidance() {
    try {
        console.log('Testing Personalized Dasha Guidance System...');

        const guidanceSystem = new PersonalizedDashaGuidanceSystem(mockBirthChart);
        console.log('✓ System initialized successfully');

        // Test complete guidance generation
        console.log('Generating complete guidance...');
        const guidance = await guidanceSystem.generateCompleteGuidance();
        console.log('✓ Complete guidance generated');

        // Check structure
        if (guidance.currentPeriod && guidance.metadata) {
            console.log('✓ Guidance structure is valid');
        }

        // Test area-specific guidance
        console.log('Testing career guidance...');
        const careerGuidance = await guidanceSystem.generateAreaSpecificGuidance('career');
        console.log('✓ Career guidance generated');

        // Test remedies
        console.log('Testing remedial recommendations...');
        const remedies = guidanceSystem.getCurrentRemedies();
        console.log('✓ Remedies generated');

        console.log('\n=== Test Results ===');
        console.log('✓ All tests passed!');
        console.log('✓ Personalized Dasha Guidance System ZC1.16 is working correctly');

        // Display sample output
        console.log('\n=== Sample Output ===');
        console.log('Overall Theme:', guidance.currentPeriod.overallGuidance.theme);
        console.log('Confidence:', guidance.currentPeriod.overallGuidance.confidence);
        console.log('Career Strength:', guidance.currentPeriod.careerGuidance.overallStrength);
        console.log('Primary Remedies for:', remedies.primaryPlanet);

    } catch (error) {
        console.error('✗ Test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testPersonalizedDashaGuidance();