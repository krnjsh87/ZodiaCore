/**
 * Manual Test Script for Medical Astrology System
 *
 * Comprehensive manual testing of the ZC1.12 Medical Astrology Profile implementation.
 * This script provides detailed testing of all components and edge cases.
 *
 * @version 1.0.0
 * @author ZodiaCore QA Team
 */

const MedicalAstrologySystem = require('./medical-astrology-system');

/**
 * Test Data Generators
 */
function createMockBirthChart(options = {}) {
    return {
        planets: {
            SUN: { longitude: options.sunLong || 120.5, sign: options.sunSign || 3, house: options.sunHouse || 5 },
            MOON: { longitude: options.moonLong || 45.2, sign: options.moonSign || 1, house: options.moonHouse || 2 },
            MARS: { longitude: options.marsLong || 200.8, sign: options.marsSign || 6, house: options.marsHouse || 8 },
            MERCURY: { longitude: options.mercuryLong || 135.1, sign: options.mercurySign || 4, house: options.mercuryHouse || 6 },
            JUPITER: { longitude: options.jupiterLong || 280.3, sign: options.jupiterSign || 9, house: options.jupiterHouse || 11 },
            VENUS: { longitude: options.venusLong || 95.7, sign: options.venusSign || 3, house: options.venusHouse || 4 },
            SATURN: { longitude: options.saturnLong || 320.4, sign: options.saturnSign || 10, house: options.saturnHouse || 12 },
            RAHU: { longitude: options.rahuLong || 180.0, sign: options.rahuSign || 6, house: options.rahuHouse || 7 },
            KETU: { longitude: options.ketuLong || 0.0, sign: options.ketuSign || 0, house: options.ketuHouse || 1 }
        },
        ascendant: { longitude: options.ascLong || 30.0, sign: options.ascSign || 0, degree: 0 },
        dasha: options.dasha || {
            current: {
                planet: 'JUPITER',
                subPlanet: 'SATURN',
                start: new Date('2024-01-01'),
                end: new Date('2026-01-01'),
                years: 2
            }
        }
    };
}

function createMockMedicalHistory(options = {}) {
    return {
        name: options.name || 'Test Patient',
        age: options.age || 35,
        conditions: options.conditions || [
            { name: 'Hypertension', treatment: 'Medication and lifestyle changes' },
            { name: 'Anxiety', treatment: 'Therapy and medication' }
        ]
    };
}

/**
 * Test Runner
 */
function runTest(testName, testFn) {
    console.log(`\n🧪 Running: ${testName}`);
    try {
        const result = testFn();
        console.log(`✅ Passed: ${testName}`);
        return result;
    } catch (error) {
        console.log(`❌ Failed: ${testName}`);
        console.log(`   Error: ${error.message}`);
        return null;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function assertThrows(fn, message) {
    try {
        fn();
        throw new Error(`${message} - Expected function to throw`);
    } catch (error) {
        if (error.message.includes('Expected function to throw')) {
            throw error;
        }
        // Expected to throw, so this is good
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message} - Expected: ${expected}, Actual: ${actual}`);
    }
}

function assertDeepEqual(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
        throw new Error(`${message} - Expected: ${expectedStr}, Actual: ${actualStr}`);
    }
}

/**
 * Test Suites
 */
function testBasicFunctionality() {
    console.log('\n📋 Testing Basic Functionality');

    runTest('System instantiation with valid chart', () => {
        const chart = createMockBirthChart();
        const system = new MedicalAstrologySystem(chart);
        assert(system instanceof MedicalAstrologySystem, 'Should create MedicalAstrologySystem instance');
        assert(system.birthChart === chart, 'Should store birth chart reference');
    });

    runTest('System throws error with invalid chart', () => {
        assertThrows(() => new MedicalAstrologySystem({}), 'Should throw with empty chart');
        assertThrows(() => new MedicalAstrologySystem({ planets: {} }), 'Should throw without ascendant');
    });

    runTest('Generate medical profile without medical history', () => {
        const chart = createMockBirthChart();
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile, 'Should generate profile');
        assert(profile.constitution, 'Should include constitution');
        assert(profile.planetaryHealth, 'Should include planetary health');
        assert(profile.diseaseRisks, 'Should include disease risks');
        assert(profile.currentHealth, 'Should include current health');
        assert(profile.remedies, 'Should include remedies');
        assert(profile.generatedAt, 'Should include generation timestamp');
        assert(profile.medicalIntegration === null, 'Should have null medical integration without history');
    });

    runTest('Generate medical profile with medical history', () => {
        const chart = createMockBirthChart();
        const history = createMockMedicalHistory();
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile(history);

        assert(profile.medicalIntegration, 'Should include medical integration with history');
        assert(profile.medicalIntegration.patientProfile, 'Should include patient profile');
        assert(profile.medicalIntegration.medicalCorrelations, 'Should include medical correlations');
    });
}

function testConstitutionAnalysis() {
    console.log('\n🧬 Testing Constitution Analysis');

    runTest('Calculate constitution for Vata-dominant chart', () => {
        const chart = createMockBirthChart({
            moonSign: 0, // Aries (Vata)
            ascSign: 2,  // Gemini (Vata)
            mercurySign: 2 // Gemini (Vata)
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile.constitution.VATA > profile.constitution.PITTA, 'Vata should be dominant');
        assert(profile.constitution.VATA > profile.constitution.KAPHA, 'Vata should be dominant over Kapha');
    });

    runTest('Calculate constitution for Pitta-dominant chart', () => {
        const chart = createMockBirthChart({
            sunSign: 3,   // Leo (Pitta)
            marsSign: 0,  // Aries (Pitta)
            moonSign: 3   // Leo (Pitta)
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile.constitution.PITTA > profile.constitution.VATA, 'Pitta should be dominant');
        assert(profile.constitution.PITTA > profile.constitution.KAPHA, 'Pitta should be dominant over Kapha');
    });

    runTest('Calculate constitution for Kapha-dominant chart', () => {
        const chart = createMockBirthChart({
            moonSign: 1,  // Taurus (Kapha)
            venusSign: 1, // Taurus (Kapha)
            jupiterSign: 8 // Sagittarius (Kapha)
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile.constitution.KAPHA > profile.constitution.VATA, 'Kapha should be dominant');
        assert(profile.constitution.KAPHA > profile.constitution.PITTA, 'Kapha should be dominant over Pitta');
    });

    runTest('Constitution percentages sum to 100', () => {
        const chart = createMockBirthChart();
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        const total = profile.constitution.VATA + profile.constitution.PITTA + profile.constitution.KAPHA;
        assertEqual(total, 100, 'Constitution percentages should sum to 100');
    });
}

function testDiseaseAnalysis() {
    console.log('\n🩺 Testing Disease Analysis');

    runTest('Identify diseases for afflicted Sun', () => {
        const chart = createMockBirthChart({
            sunHouse: 6, // 6th house - disease house
            marsLong: 120.5, // Conjunct Sun
            saturnLong: 115.5 // Close to Sun
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        const sunDiseases = profile.diseaseRisks.filter(d => d.planet === 'SUN');
        assert(sunDiseases.length > 0, 'Should identify Sun-related diseases');
        assert(sunDiseases[0].diseases.includes('Heart Diseases'), 'Should include heart diseases for Sun');
    });

    runTest('Identify diseases for afflicted Moon', () => {
        const chart = createMockBirthChart({
            moonHouse: 8, // 8th house - chronic diseases
            saturnLong: 45.2, // Conjunct Moon
            rahuLong: 40.2 // Close to Moon
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        const moonDiseases = profile.diseaseRisks.filter(d => d.planet === 'MOON');
        assert(moonDiseases.length > 0, 'Should identify Moon-related diseases');
        assert(moonDiseases[0].diseases.includes('Mental Disorders'), 'Should include mental disorders for Moon');
    });

    runTest('Calculate disease likelihood correctly', () => {
        const chart = createMockBirthChart({
            marsHouse: 6, // 6th house
            marsSign: 3  // Cancer (debilitated)
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        const marsDiseases = profile.diseaseRisks.filter(d => d.planet === 'MARS');
        if (marsDiseases.length > 0) {
            assert(marsDiseases[0].likelihood >= 0 && marsDiseases[0].likelihood <= 95,
                   'Disease likelihood should be between 0 and 95');
        }
    });
}

function testHealthPredictions() {
    console.log('\n🔮 Testing Health Predictions');

    runTest('Generate future health predictions', () => {
        const chart = createMockBirthChart();
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(Array.isArray(profile.futurePredictions), 'Should generate future predictions array');
        if (profile.futurePredictions.length > 0) {
            const prediction = profile.futurePredictions[0];
            assert(prediction.period, 'Should include prediction period');
            assert(prediction.risks, 'Should include prediction risks');
            assert(prediction.severity, 'Should include prediction severity');
            assert(prediction.recommendations, 'Should include prediction recommendations');
        }
    });

    runTest('Assess current health status', () => {
        const chart = createMockBirthChart();
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile.currentHealth.overallHealth, 'Should assess overall health');
        assert(profile.currentHealth.riskLevel, 'Should assess risk level');
        assert(profile.currentHealth.activeRisks >= 0, 'Should count active risks');
        assert(profile.currentHealth.recommendations, 'Should provide recommendations');
    });
}

function testRemedialRecommendations() {
    console.log('\n💊 Testing Remedial Recommendations');

    runTest('Generate gemstone recommendations', () => {
        const chart = createMockBirthChart({
            sunHouse: 6 // Afflicted Sun
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile.remedies.gemstoneTherapy, 'Should include gemstone therapy');
        assert(Array.isArray(profile.remedies.gemstoneTherapy), 'Gemstone therapy should be array');
    });

    runTest('Generate mantra recommendations', () => {
        const chart = createMockBirthChart({
            moonHouse: 8 // Afflicted Moon
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile.remedies.mantraTherapy, 'Should include mantra therapy');
        assert(Array.isArray(profile.remedies.mantraTherapy), 'Mantra therapy should be array');
    });

    runTest('Generate dietary recommendations', () => {
        const chart = createMockBirthChart();
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile();

        assert(profile.remedies.dietaryRecommendations, 'Should include dietary recommendations');
        assert(profile.remedies.dietaryRecommendations.foods, 'Should include food recommendations');
        assert(profile.remedies.dietaryRecommendations.avoid, 'Should include foods to avoid');
    });
}

function testMedicalIntegration() {
    console.log('\n🏥 Testing Medical Integration');

    runTest('Correlate astrological risks with medical conditions', () => {
        const chart = createMockBirthChart({
            sunHouse: 6 // Heart issues
        });
        const history = createMockMedicalHistory({
            conditions: [
                { name: 'Cardiac problems', treatment: 'Medication' },
                { name: 'Hypertension', treatment: 'Lifestyle changes' }
            ]
        });
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile(history);

        assert(profile.medicalIntegration.medicalCorrelations, 'Should include medical correlations');
        assert(Array.isArray(profile.medicalIntegration.medicalCorrelations), 'Correlations should be array');
    });

    runTest('Generate integrated treatment recommendations', () => {
        const chart = createMockBirthChart();
        const history = createMockMedicalHistory();
        const system = new MedicalAstrologySystem(chart);
        const profile = system.generateMedicalProfile(history);

        assert(profile.medicalIntegration.integratedRecommendations, 'Should include integrated recommendations');
        assert(Array.isArray(profile.medicalIntegration.integratedRecommendations), 'Integrated recommendations should be array');
    });
}

function testErrorHandling() {
    console.log('\n🚨 Testing Error Handling');

    runTest('Handle missing planetary data gracefully', () => {
        const incompleteChart = {
            planets: {
                SUN: { longitude: 120, sign: 3, house: 5 }
                // Missing other planets
            },
            ascendant: { longitude: 30, sign: 0, degree: 0 }
        };

        try {
            const system = new MedicalAstrologySystem(incompleteChart);
            const profile = system.generateMedicalProfile();
            assert(profile, 'Should handle incomplete planetary data');
        } catch (error) {
            // Expected to potentially fail, but should fail gracefully
            assert(error.message.includes('Invalid') || error.message.includes('missing'),
                   'Should provide meaningful error message');
        }
    });

    runTest('Handle invalid medical history gracefully', () => {
        const chart = createMockBirthChart();
        const invalidHistory = { name: 'Test', conditions: null };
        const system = new MedicalAstrologySystem(chart);

        const profile = system.generateMedicalProfile(invalidHistory);
        assert(profile, 'Should handle invalid medical history');
        // Should still generate profile but with limited integration
    });
}

function testPerformance() {
    console.log('\n⚡ Testing Performance');

    runTest('Profile generation completes within time limit', () => {
        const chart = createMockBirthChart();
        const system = new MedicalAstrologySystem(chart);

        const startTime = Date.now();
        const profile = system.generateMedicalProfile();
        const endTime = Date.now();

        const duration = endTime - startTime;
        assert(duration < 1000, `Profile generation took ${duration}ms, should be under 1000ms`);
        assert(profile.performance.generationTimeMs < 1000, 'Performance metadata should reflect timing');
    });

    runTest('Handle multiple concurrent analyses', () => {
        const analyses = [];
        const startTime = Date.now();

        for (let i = 0; i < 5; i++) {
            const chart = createMockBirthChart({ sunLong: 100 + i * 10 });
            const system = new MedicalAstrologySystem(chart);
            analyses.push(system.generateMedicalProfile());
        }

        const endTime = Date.now();
        const totalTime = endTime - startTime;

        assert(totalTime < 3000, `5 concurrent analyses took ${totalTime}ms, should be under 3000ms`);
        assert(analyses.length === 5, 'Should complete all analyses');
        analyses.forEach(profile => assert(profile, 'Each analysis should produce valid profile'));
    });
}

/**
 * Main Test Runner
 */
function runAllTests() {
    console.log('🚀 Starting Medical Astrology System Tests');
    console.log('==========================================');

    testBasicFunctionality();
    testConstitutionAnalysis();
    testDiseaseAnalysis();
    testHealthPredictions();
    testRemedialRecommendations();
    testMedicalIntegration();
    testErrorHandling();
    testPerformance();

    console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = {
    runAllTests,
    createMockBirthChart,
    createMockMedicalHistory
};