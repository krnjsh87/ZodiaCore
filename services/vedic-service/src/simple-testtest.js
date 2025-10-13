// Simple test to isolate the issue
const ConstitutionAnalyzer = require('./constitution-analyzer');
const DiseaseAnalyzer = require('./disease-analyzer');
const MedicalAstrologySystem = require('./medical-astrology-system');

function createMockBirthChart() {
    return {
        planets: {
            SUN: { longitude: 120.5, sign: 3, house: 5 },
            MOON: { longitude: 45.2, sign: 1, house: 2 },
            MARS: { longitude: 200.8, sign: 6, house: 8 },
            MERCURY: { longitude: 135.1, sign: 4, house: 6 },
            JUPITER: { longitude: 280.3, sign: 9, house: 11 },
            VENUS: { longitude: 95.7, sign: 3, house: 4 },
            SATURN: { longitude: 320.4, sign: 10, house: 12 },
            RAHU: { longitude: 180.0, sign: 6, house: 7 },
            KETU: { longitude: 0.0, sign: 0, house: 1 }
        },
        ascendant: { longitude: 30.0, sign: 0, degree: 0 },
        dasha: {
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

console.log('Testing ConstitutionAnalyzer...');
try {
    const chart = createMockBirthChart();
    const analyzer = new ConstitutionAnalyzer(chart);
    const constitution = analyzer.calculateConstitution();
    console.log('Constitution:', constitution);
    console.log('✅ ConstitutionAnalyzer works');
} catch (error) {
    console.error('❌ ConstitutionAnalyzer failed:', error.message);
    console.error(error.stack);
}

console.log('\nTesting DiseaseAnalyzer...');
try {
    const chart = createMockBirthChart();
    const analyzer = new DiseaseAnalyzer(chart);
    const diseases = analyzer.identifyDiseases();
    console.log('Diseases found:', diseases.length);
    console.log('✅ DiseaseAnalyzer works');
} catch (error) {
    console.error('❌ DiseaseAnalyzer failed:', error.message);
    console.error(error.stack);
}

console.log('\nTesting MedicalAstrologySystem...');
try {
    const chart = createMockBirthChart();
    const system = new MedicalAstrologySystem(chart);
    const profile = system.generateMedicalProfile();
    console.log('Profile generated successfully');
    console.log('Constitution:', profile.constitution);
    console.log('Disease risks:', profile.diseaseRisks.length);
    console.log('✅ MedicalAstrologySystem works');
} catch (error) {
    console.error('❌ MedicalAstrologySystem failed:', error.message);
    console.error(error.stack);
}