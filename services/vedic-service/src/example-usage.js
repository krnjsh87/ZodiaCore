/**
 * ZodiaCore - Vedic Birth Chart Generator Usage Example
 *
 * Demonstrates how to use the VedicBirthChartGenerator to create birth charts.
 * Includes sample birth data and output formatting.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VedicBirthChartGenerator = require('./vedic-birth-chart-generator');

/**
 * Example usage of the Vedic Birth Chart Generator
 */
async function runExample() {
    console.log('🕉️  ZodiaCore - Vedic Birth Chart Generator Example\n');

    // Initialize the generator
    const chartGenerator = new VedicBirthChartGenerator();

    // Sample birth data (famous personality for demonstration)
    const birthData = {
        year: 1990,
        month: 5,      // May
        day: 15,
        hour: 14,      // 2 PM
        minute: 30,
        second: 0,
        latitude: 28.6139,   // Delhi, India
        longitude: 77.2090,
        timezone: 5.5        // IST
    };

    console.log('📅 Birth Data:');
    console.log(`   Date: ${birthData.year}-${birthData.month}-${birthData.day}`);
    console.log(`   Time: ${birthData.hour}:${birthData.minute}:${birthData.second} IST`);
    console.log(`   Location: ${birthData.latitude}°N, ${birthData.longitude}°E`);
    console.log('');

    try {
        // Generate the birth chart
        console.log('🔮 Generating Vedic Birth Chart...');
        const birthChart = await chartGenerator.generateBirthChart(birthData);

        // Display results
        displayChartSummary(birthChart);
        displayPlanetaryPositions(birthChart);
        displayNakshatraInfo(birthChart);
        displayStrengthAnalysis(birthChart);

        console.log('\n✅ Birth chart generation completed successfully!');

    } catch (error) {
        console.error('❌ Error generating birth chart:', error.message);
    }
}

/**
 * Display chart summary
 */
function displayChartSummary(chart) {
    console.log('📊 Chart Summary:');
    console.log(`   Ascendant: ${chart.ascendant.sign} sign, ${chart.ascendant.degree.toFixed(2)}°`);
    console.log(`   Julian Day: ${chart.julianDay.toFixed(2)}`);
    console.log(`   Ayanamsa: ${chart.ayanamsa.toFixed(4)}°`);
    console.log(`   Local Sidereal Time: ${chart.lst.toFixed(4)}°`);
    console.log('');
}

/**
 * Display planetary positions
 */
function displayPlanetaryPositions(chart) {
    console.log('🪐 Planetary Positions:');
    console.log('   Planet      | Sign | Degree | House | Retrograde');
    console.log('   ------------|------|--------|-------|-----------');

    const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

    planets.forEach(planet => {
        if (chart.planets[planet]) {
            const p = chart.planets[planet];
            const signName = getSignName(p.sign);
            const retro = p.retrograde ? 'R' : '';
            console.log(`   ${planet.padEnd(11)} | ${signName.padEnd(4)} | ${p.degree.toFixed(1).padStart(6)}° | ${p.house.toString().padStart(5)} | ${retro.padStart(10)}`);
        }
    });
    console.log('');
}

/**
 * Display nakshatra information
 */
function displayNakshatraInfo(chart) {
    console.log('🌙 Lunar Information:');
    const nakshatra = chart.moonDetails.nakshatra;
    const tithi = chart.moonDetails.tithi;

    console.log(`   Moon Nakshatra: ${nakshatra.nakshatraName} (${nakshatra.nakshatraNumber})`);
    console.log(`   Pada: ${nakshatra.pada}`);
    console.log(`   Lord: ${nakshatra.lord}`);
    console.log(`   Degrees in Nakshatra: ${nakshatra.degreesInNakshatra.toFixed(2)}°`);
    console.log(`   Tithi: ${tithi.name} (${tithi.number}) - ${tithi.paksha} Paksha`);
    console.log('');
}

/**
 * Display strength analysis
 */
function displayStrengthAnalysis(chart) {
    console.log('💪 Planetary Strengths:');
    console.log('   Planet      | Total | Sign | House | Nakshatra');
    console.log('   ------------|-------|------|-------|----------');

    const planets = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN', 'RAHU', 'KETU'];

    planets.forEach(planet => {
        if (chart.strengths[planet]) {
            const s = chart.strengths[planet];
            console.log(`   ${planet.padEnd(11)} | ${(s.total * 100).toFixed(0).padStart(5)}% | ${(s.components.sign * 100).toFixed(0).padStart(4)}% | ${(s.components.house * 100).toFixed(0).padStart(5)}% | ${(s.components.nakshatra * 100).toFixed(0).padStart(9)}%`);
        }
    });
    console.log('');
}

/**
 * Get sign name from sign number
 */
function getSignName(signNumber) {
    const signs = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
    return signs[signNumber] || '???';
}

/**
 * Test multiple birth charts
 */
async function testMultipleCharts() {
    console.log('\n🧪 Testing Multiple Birth Charts:\n');

    const chartGenerator = new VedicBirthChartGenerator();

    // Test data for different scenarios
    const testCases = [
        {
            name: 'Day Birth',
            data: { year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0, latitude: 28.6139, longitude: 77.2090 }
        },
        {
            name: 'Night Birth',
            data: { year: 1985, month: 12, day: 25, hour: 22, minute: 45, second: 0, latitude: 40.7128, longitude: -74.0060 }
        },
        {
            name: 'Southern Hemisphere',
            data: { year: 2000, month: 7, day: 4, hour: 9, minute: 15, second: 0, latitude: -33.8688, longitude: 151.2093 }
        }
    ];

    for (const testCase of testCases) {
        try {
            console.log(`Testing: ${testCase.name}`);
            const chart = await chartGenerator.generateBirthChart(testCase.data);
            console.log(`   ✅ Success - Ascendant: ${chart.ascendant.sign}, Moon: ${chart.planets.MOON.sign}`);
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
        }
    }
}

/**
 * Performance test
 */
async function performanceTest() {
    console.log('\n⚡ Performance Test:\n');

    const chartGenerator = new VedicBirthChartGenerator();
    const birthData = {
        year: 1990, month: 5, day: 15, hour: 14, minute: 30, second: 0,
        latitude: 28.6139, longitude: 77.2090
    };

    const iterations = 10;
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
        await chartGenerator.generateBirthChart(birthData);
    }

    const endTime = Date.now();
    const averageTime = (endTime - startTime) / iterations;

    console.log(`   Generated ${iterations} charts in ${(endTime - startTime)}ms`);
    console.log(`   Average time per chart: ${averageTime.toFixed(2)}ms`);
    console.log(`   Performance: ${((1000 / averageTime) * 60).toFixed(0)} charts/minute`);
}

// Run the examples
if (require.main === module) {
    runExample()
        .then(() => testMultipleCharts())
        .then(() => performanceTest())
        .then(() => {
            console.log('\n🎉 All examples completed!');
        })
        .catch(error => {
            console.error('💥 Example execution failed:', error);
        });
}

module.exports = {
    runExample,
    testMultipleCharts,
    performanceTest
};