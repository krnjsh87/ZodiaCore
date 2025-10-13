/**
 * ZodiaCore - Western Relationship Chart System Tests
 *
 * Unit tests for the ZC3.9 Western Synastry/Composite Chart Compatibility system.
 * Tests all components including synastry generation, composite charts,
 * compatibility analysis, and relationship dynamics.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

// Simple assertion library for Node.js
const assert = require('assert');

/**
 * Test data for relationship charts
 */
const testCharts = {
    chart1: {
        planets: {
            SUN: { longitude: 84.5, latitude: 0 },
            MOON: { longitude: 123.7, latitude: 0 },
            MERCURY: { longitude: 67.2, latitude: 0 },
            VENUS: { longitude: 95.8, latitude: 0 },
            MARS: { longitude: 156.3, latitude: 0 },
            JUPITER: { longitude: 234.1, latitude: 0 },
            SATURN: { longitude: 289.4, latitude: 0 },
            URANUS: { longitude: 345.6, latitude: 0 },
            NEPTUNE: { longitude: 12.3, latitude: 0 },
            PLUTO: { longitude: 78.9, latitude: 0 },
            RAHU: { longitude: 201.5, latitude: 0 },
            KETU: { longitude: 21.5, latitude: 0 }
        },
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        angles: { ASC: 0, MC: 90 }
    },
    chart2: {
        planets: {
            SUN: { longitude: 234.5, latitude: 0 },
            MOON: { longitude: 283.7, latitude: 0 },
            MERCURY: { longitude: 217.2, latitude: 0 },
            VENUS: { longitude: 245.8, latitude: 0 },
            MARS: { longitude: 306.3, latitude: 0 },
            JUPITER: { longitude: 24.1, latitude: 0 },
            SATURN: { longitude: 79.4, latitude: 0 },
            URANUS: { longitude: 135.6, latitude: 0 },
            NEPTUNE: { longitude: 202.3, latitude: 0 },
            PLUTO: { longitude: 268.9, latitude: 0 },
            RAHU: { longitude: 91.5, latitude: 0 },
            KETU: { longitude: 271.5, latitude: 0 }
        },
        houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        angles: { ASC: 60, MC: 150 }
    }
};

// Import modules
const WesternRelationshipChartSystem = require('./western-relationship-chart-system');
const WesternSynastryGenerator = require('./western-synastry-generator');
const WesternCompositeGenerator = require('./western-composite-generator');
const WesternCompatibilityAnalyzer = require('./western-compatibility-analyzer');
const WesternRelationshipDynamicsAnalyzer = require('./western-relationship-dynamics-analyzer');

/**
 * Simple test runner
 */
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('Running Western Relationship Chart System Tests...\n');

        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✓ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`✗ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }

        console.log(`\nResults: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

const runner = new TestRunner();

/**
 * Test suite for Western Relationship Chart System
 */
runner.test('should initialize with valid charts', () => {
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    assert(system, 'System should be defined');
    assert.strictEqual(system.chart1, testCharts.chart1, 'Chart1 should be set');
    assert.strictEqual(system.chart2, testCharts.chart2, 'Chart2 should be set');
});

runner.test('should throw error with invalid chart1', () => {
    assert.throws(() => {
        new WesternRelationshipChartSystem(null, testCharts.chart2);
    }, /First birth chart is required/);
});

runner.test('should throw error with invalid chart2', () => {
    assert.throws(() => {
        new WesternRelationshipChartSystem(testCharts.chart1, null);
    }, /Second birth chart is required/);
});

runner.test('should generate complete relationship analysis', async () => {
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    const analysis = await system.generateRelationshipAnalysis();

    assert(analysis, 'Analysis should be defined');
    assert(analysis.synastry, 'Synastry should be present');
    assert(analysis.composite, 'Composite should be present');
    assert(analysis.compatibility, 'Compatibility should be present');
    assert(analysis.dynamics, 'Dynamics should be present');
    assert(analysis.summary, 'Summary should be present');
    assert.strictEqual(analysis.systemVersion, 'ZC3.9', 'Version should be ZC3.9');
    assert(analysis.analysisId.match(/^wrcs_\d+_[a-z0-9]+$/), 'Analysis ID should match pattern');
});

runner.test('should generate synastry chart only', () => {
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    const synastry = system.generateSynastryChart();

    assert(synastry, 'Synastry should be defined');
    assert.strictEqual(synastry.type, 'synastry', 'Type should be synastry');
    assert(synastry.interAspects, 'Inter aspects should be present');
    assert(synastry.houseOverlays, 'House overlays should be present');
    assert(synastry.compatibility, 'Compatibility should be present');
});

runner.test('should generate composite chart only', () => {
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    const composite = system.generateCompositeChart();

    assert(composite, 'Composite should be defined');
    assert.strictEqual(composite.type, 'composite', 'Type should be composite');
    assert(composite.positions, 'Positions should be present');
    assert(composite.houses, 'Houses should be present');
    assert(composite.aspects, 'Aspects should be present');
});

runner.test('should validate system components', async () => {
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    const validation = await system.validateSystem();

    assert(validation, 'Validation should be defined');
    assert.strictEqual(validation.synastryGenerated, true, 'Synastry should be generated');
    assert.strictEqual(validation.compositeGenerated, true, 'Composite should be generated');
    assert.strictEqual(validation.compatibilityCalculated, true, 'Compatibility should be calculated');
    assert.strictEqual(validation.dynamicsAnalyzed, true, 'Dynamics should be analyzed');
    assert.strictEqual(validation.summaryGenerated, true, 'Summary should be generated');
    assert.strictEqual(validation.overall, 'System validation completed successfully', 'Overall validation message');
});

runner.test('should provide system information', () => {
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    const info = system.getSystemInfo();

    assert(info, 'Info should be defined');
    assert.strictEqual(info.version, 'ZC3.9', 'Version should be ZC3.9');
    assert(info.components.includes('WesternSynastryGenerator'), 'Should include SynastryGenerator');
    assert(info.features.includes('Synastry Chart Analysis'), 'Should include synastry analysis');
    assert(info.supportedAspects.includes('CONJUNCTION'), 'Should support conjunction');
});

/**
 * Test suite for Western Synastry Generator
 */
runner.test('should initialize synastry generator with valid charts', () => {
    const generator = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    assert(generator, 'Generator should be defined');
});

runner.test('should calculate inter-chart aspects', () => {
    const generator = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    const aspects = generator.calculateInterAspects();

    assert(aspects, 'Aspects should be defined');
    assert(Array.isArray(aspects), 'Aspects should be an array');
    assert(aspects.length > 0, 'Should have aspects');
});

runner.test('should calculate house overlays', () => {
    const generator = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    const overlays = generator.calculateHouseOverlays();

    assert(overlays, 'Overlays should be defined');
    assert(Array.isArray(overlays), 'Overlays should be an array');
    assert(overlays.length > 0, 'Should have overlays');

    overlays.forEach(overlay => {
        assert(overlay.person, 'Should have person');
        assert(overlay.planet, 'Should have planet');
        assert(overlay.house, 'Should have house');
        assert(overlay.significance, 'Should have significance');
    });
});

runner.test('should generate complete synastry chart', () => {
    const generator = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    const synastry = generator.generateSynastryChart();

    assert(synastry, 'Synastry should be defined');
    assert.strictEqual(synastry.type, 'synastry', 'Type should be synastry');
    assert(synastry.interAspects, 'Should have inter aspects');
    assert(synastry.houseOverlays, 'Should have house overlays');
    assert(synastry.compatibility, 'Should have compatibility');
    assert(synastry.generatedAt instanceof Date, 'Should have generated date');
});

/**
 * Test suite for Western Composite Generator
 */
runner.test('should initialize composite generator with valid charts', () => {
    const generator = new WesternCompositeGenerator(testCharts.chart1, testCharts.chart2);
    assert(generator, 'Generator should be defined');
});

runner.test('should calculate composite positions', () => {
    const generator = new WesternCompositeGenerator(testCharts.chart1, testCharts.chart2);
    const positions = generator.calculateCompositePositions();

    assert(positions, 'Positions should be defined');
    assert(positions.SUN, 'Should have Sun position');
    assert(positions.MOON, 'Should have Moon position');
    assert(positions.ASC, 'Should have ASC position');
    assert(positions.MC, 'Should have MC position');

    Object.keys(positions).forEach(planet => {
        assert(positions[planet].longitude >= 0, 'Longitude should be >= 0');
        assert(positions[planet].longitude < 360, 'Longitude should be < 360');
    });
});

runner.test('should generate complete composite chart', () => {
    const generator = new WesternCompositeGenerator(testCharts.chart1, testCharts.chart2);
    const composite = generator.generateCompositeChart();

    assert(composite, 'Composite should be defined');
    assert.strictEqual(composite.type, 'composite', 'Type should be composite');
    assert(composite.positions, 'Should have positions');
    assert(composite.houses, 'Should have houses');
    assert(composite.aspects, 'Should have aspects');
    assert(composite.angularity, 'Should have angularity');
    assert(composite.interpretation, 'Should have interpretation');
    assert(composite.generatedAt instanceof Date, 'Should have generated date');
});

/**
 * Test suite for Western Compatibility Analyzer
 */
runner.test('should initialize compatibility analyzer', () => {
    const synastryGen = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    const compositeGen = new WesternCompositeGenerator(testCharts.chart1, testCharts.chart2);

    const synastry = synastryGen.generateSynastryChart();
    const composite = compositeGen.generateCompositeChart();

    const analyzer = new WesternCompatibilityAnalyzer(synastry, composite);
    assert(analyzer, 'Analyzer should be defined');
});

runner.test('should calculate overall compatibility', () => {
    const synastryGen = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    const compositeGen = new WesternCompositeGenerator(testCharts.chart1, testCharts.chart2);

    const synastry = synastryGen.generateSynastryChart();
    const composite = compositeGen.generateCompositeChart();

    const analyzer = new WesternCompatibilityAnalyzer(synastry, composite);
    const compatibility = analyzer.calculateOverallCompatibility();

    assert(compatibility, 'Compatibility should be defined');
    assert(compatibility.overall >= 0, 'Overall should be >= 0');
    assert(compatibility.overall <= 100, 'Overall should be <= 100');
    assert(compatibility.breakdown, 'Should have breakdown');
    assert(compatibility.rating, 'Should have rating');
    assert(compatibility.strengths, 'Should have strengths');
    assert(compatibility.challenges, 'Should have challenges');
    assert(compatibility.recommendations, 'Should have recommendations');
});

/**
 * Test suite for Western Relationship Dynamics Analyzer
 */
runner.test('should initialize dynamics analyzer', () => {
    const synastryGen = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    const compositeGen = new WesternCompositeGenerator(testCharts.chart1, testCharts.chart2);

    const synastry = synastryGen.generateSynastryChart();
    const composite = compositeGen.generateCompositeChart();

    const compatAnalyzer = new WesternCompatibilityAnalyzer(synastry, composite);
    const compatibility = compatAnalyzer.calculateOverallCompatibility();

    const analyzer = new WesternRelationshipDynamicsAnalyzer(synastry, composite, compatibility);
    assert(analyzer, 'Analyzer should be defined');
});

runner.test('should analyze relationship dynamics', () => {
    const synastryGen = new WesternSynastryGenerator(testCharts.chart1, testCharts.chart2);
    const compositeGen = new WesternCompositeGenerator(testCharts.chart1, testCharts.chart2);

    const synastry = synastryGen.generateSynastryChart();
    const composite = compositeGen.generateCompositeChart();

    const compatAnalyzer = new WesternCompatibilityAnalyzer(synastry, composite);
    const compatibility = compatAnalyzer.calculateOverallCompatibility();

    const analyzer = new WesternRelationshipDynamicsAnalyzer(synastry, composite, compatibility);
    const dynamics = analyzer.analyzeRelationshipDynamics();

    assert(dynamics, 'Dynamics should be defined');
    assert(dynamics.communication, 'Should have communication');
    assert(dynamics.emotional, 'Should have emotional');
    assert(dynamics.intimacy, 'Should have intimacy');
    assert(dynamics.conflict, 'Should have conflict');
    assert(dynamics.growth, 'Should have growth');
    assert(dynamics.stability, 'Should have stability');
    assert(dynamics.evolution, 'Should have evolution');
    assert(dynamics.overall, 'Should have overall');
});

/**
 * Integration tests
 */
runner.test('should perform complete relationship analysis workflow', async () => {
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    const analysis = await system.generateRelationshipAnalysis();

    assert(analysis.synastry.interAspects.length > 0, 'Should have inter aspects');
    assert(analysis.composite.positions.SUN, 'Should have composite Sun');
    assert(analysis.compatibility.overall >= 0, 'Should have compatibility score');
    assert(analysis.dynamics.communication.score >= 0, 'Should have communication score');
    assert(analysis.summary.relationshipType, 'Should have relationship type');
    assert(analysis.summary.longTermPotential.score >= 0, 'Should have potential score');
});

runner.test('should handle edge cases gracefully', async () => {
    const minimalChart1 = {
        planets: { SUN: { longitude: 0 } },
        angles: { ASC: 0, MC: 90 }
    };
    const minimalChart2 = {
        planets: { SUN: { longitude: 180 } },
        angles: { ASC: 180, MC: 270 }
    };

    const system = new WesternRelationshipChartSystem(minimalChart1, minimalChart2);
    const analysis = await system.generateRelationshipAnalysis();

    assert(analysis, 'Analysis should be defined');
    assert(analysis.compatibility.overall >= 0, 'Should have compatibility score');
});

/**
 * Performance tests
 */
runner.test('should complete analysis within time limit', async () => {
    const startTime = Date.now();
    const system = new WesternRelationshipChartSystem(testCharts.chart1, testCharts.chart2);
    await system.generateRelationshipAnalysis();
    const endTime = Date.now();

    const duration = endTime - startTime;
    assert(duration < 5000, `Analysis took ${duration}ms, should be < 5000ms`);
});

/**
 * Edge case tests
 */
runner.test('should handle charts with missing planets', () => {
    const incompleteChart1 = {
        planets: { SUN: { longitude: 0 } },
        angles: { ASC: 0, MC: 90 }
    };
    const incompleteChart2 = {
        planets: { SUN: { longitude: 180 } },
        angles: { ASC: 180, MC: 270 }
    };

    const system = new WesternRelationshipChartSystem(incompleteChart1, incompleteChart2);
    const analysis = system.generateRelationshipAnalysis();

    assert(analysis, 'Should handle incomplete charts');
});

runner.test('should handle 360-degree wraparound in composite calculations', () => {
    const wraparoundChart1 = {
        planets: { SUN: { longitude: 350 } },
        angles: { ASC: 350, MC: 80 }
    };
    const wraparoundChart2 = {
        planets: { SUN: { longitude: 10 } },
        angles: { ASC: 10, MC: 100 }
    };

    const generator = new WesternCompositeGenerator(wraparoundChart1, wraparoundChart2);
    const positions = generator.calculateCompositePositions();

    assert(positions.SUN.longitude >= 0 && positions.SUN.longitude < 360, 'Should handle wraparound');
});

// Run tests
if (require.main === module) {
    runner.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = {
    testCharts,
    TestRunner: runner
};