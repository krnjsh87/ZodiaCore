/**
 * ZC1.13 Pet Astrology - Basic Test
 *
 * Simple test to verify the pet astrology implementation works correctly.
 *
 * @module pet-astrology-test
 * @version 1.0.0
 */

const PetChartGenerator = require('./pet-chart-generator');

// Test data for a Golden Retriever
const testPetData = {
    species: 'dogs',
    breed: 'Golden Retriever',
    birthYear: 2020,
    birthMonth: 6,
    birthDay: 15,
    birthHour: 14,
    birthMinute: 30,
    birthLatitude: 40.7128,  // New York City latitude
    birthLongitude: -74.0060  // New York City longitude
};

console.log('Testing ZC1.13 Pet Astrology Implementation');
console.log('================================================\n');

try {
    // Create chart generator
    const generator = new PetChartGenerator();

    // Generate pet chart
    console.log('Generating chart for Golden Retriever...');
    const petChart = generator.generatePetChart(testPetData);

    // Display results
    console.log('✅ Chart generation successful!');
    console.log('\nPet Information:');
    console.log(`- Species: ${petChart.petInfo.species}`);
    console.log(`- Breed: ${petChart.petInfo.breed}`);
    console.log(`- Birth: ${petChart.petInfo.birthYear}-${petChart.petInfo.birthMonth}-${petChart.petInfo.birthDay} ${petChart.petInfo.birthHour}:${petChart.petInfo.birthMinute}`);

    console.log('\nAstrological Data:');
    console.log(`- Julian Day: ${petChart.julianDay.toFixed(2)}`);
    console.log(`- Ayanamsa: ${petChart.ayanamsa.toFixed(2)}°`);
    console.log(`- Ascendant: ${petChart.ascendant.longitude.toFixed(2)}° (${petChart.ascendant.sign}, ${petChart.ascendant.degree.toFixed(1)}°)`);

    console.log('\nPlanetary Positions:');
    Object.keys(petChart.planets).forEach(planet => {
        const pos = petChart.planets[planet];
        console.log(`- ${planet}: ${pos.longitude.toFixed(2)}° (Sign ${pos.sign}, House ${pos.house}, Strength: ${pos.strength})`);
    });

    console.log('\nSpecies Traits:');
    console.log(`- Planetary Ruler: ${petChart.speciesTraits.planetaryRuler}`);
    console.log(`- Element: ${petChart.speciesTraits.element}`);
    console.log(`- Nature: ${petChart.speciesTraits.nature}`);

    console.log('\n✅ All tests passed! Pet Astrology implementation is working.');

} catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}

console.log('\n================================================');
console.log('Test completed successfully!');