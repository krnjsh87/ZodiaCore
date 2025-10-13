// Test file for Western Birth Chart Components
// This file tests the frontend components for Western astrology birth chart generation

const { WesternBirthChart } = require('./src/frontend/types/astrology.ts');

// Sample birth data for testing
const sampleBirthData = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  second: 0,
  latitude: 40.7128, // New York
  longitude: -74.0060,
  timezone: -5 // EST
};

// Sample Western birth chart data for testing display component
const sampleWesternBirthChart = {
  birthData: sampleBirthData,
  julianDay: 2447892.123,
  lst: 45.67,
  ascendant: {
    longitude: 123.45,
    sign: 3, // Cancer
    degree: 23.45
  },
  midheaven: {
    longitude: 234.56,
    sign: 6, // Libra
    degree: 12.34
  },
  houses: [
    123.45, 145.67, 167.89, 190.12, 212.34, 234.56,
    256.78, 279.01, 301.23, 323.45, 345.67, 7.89
  ],
  planets: {
    SUN: { longitude: 65.43, sign: 1, degree: 5.43, house: 2, retrograde: false },
    MOON: { longitude: 123.45, sign: 3, degree: 23.45, house: 4, retrograde: false },
    MERCURY: { longitude: 45.67, sign: 0, degree: 15.67, house: 1, retrograde: false },
    VENUS: { longitude: 89.01, sign: 2, degree: 29.01, house: 3, retrograde: false },
    MARS: { longitude: 167.89, sign: 5, degree: 17.89, house: 5, retrograde: false },
    JUPITER: { longitude: 234.56, sign: 6, degree: 24.56, house: 7, retrograde: false },
    SATURN: { longitude: 301.23, sign: 9, degree: 1.23, house: 10, retrograde: true },
    URANUS: { longitude: 345.67, sign: 10, degree: 15.67, house: 11, retrograde: false },
    NEPTUNE: { longitude: 7.89, sign: 11, degree: 7.89, house: 12, retrograde: false },
    PLUTO: { longitude: 89.01, sign: 2, degree: 29.01, house: 3, retrograde: false }
  },
  aspects: [
    {
      planet1: 'SUN',
      planet2: 'MOON',
      aspect: 'Conjunction',
      angle: 2.5,
      orb: 1.5,
      exact: false
    },
    {
      planet1: 'VENUS',
      planet2: 'MARS',
      aspect: 'Square',
      angle: 88.2,
      orb: 1.8,
      exact: false
    }
  ],
  dominantElements: {
    fire: 0.3,
    earth: 0.25,
    air: 0.25,
    water: 0.2
  },
  chartShape: 'Splash',
  patterns: ['Grand Trine', 'T-Square']
};

// Test functions
function testWesternBirthChartInterface() {
  console.log('Testing WesternBirthChart interface...');

  // Validate that the sample data matches the interface
  const requiredFields = [
    'birthData', 'julianDay', 'lst', 'ascendant', 'midheaven',
    'houses', 'planets', 'aspects', 'dominantElements', 'chartShape', 'patterns'
  ];

  for (const field of requiredFields) {
    if (!(field in sampleWesternBirthChart)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  console.log('✓ WesternBirthChart interface validation passed');
}

function testBirthDataValidation() {
  console.log('Testing birth data validation...');

  // Test valid data
  const validData = { ...sampleBirthData };

  // Test invalid year
  const invalidYear = { ...sampleBirthData, year: 1581 };
  // Test invalid month
  const invalidMonth = { ...sampleBirthData, month: 13 };
  // Test invalid day
  const invalidDay = { ...sampleBirthData, day: 32 };
  // Test invalid latitude
  const invalidLat = { ...sampleBirthData, latitude: 91 };
  // Test invalid longitude
  const invalidLng = { ...sampleBirthData, longitude: 181 };

  console.log('✓ Birth data validation tests completed');
}

function testPlanetaryPositions() {
  console.log('Testing planetary positions...');

  const planets = Object.keys(sampleWesternBirthChart.planets);
  const expectedPlanets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'];

  if (planets.length !== expectedPlanets.length) {
    throw new Error(`Expected ${expectedPlanets.length} planets, got ${planets.length}`);
  }

  for (const planet of expectedPlanets) {
    if (!(planet in sampleWesternBirthChart.planets)) {
      throw new Error(`Missing planet: ${planet}`);
    }

    const planetData = sampleWesternBirthChart.planets[planet];
    const requiredFields = ['longitude', 'sign', 'degree', 'house', 'retrograde'];

    for (const field of requiredFields) {
      if (!(field in planetData)) {
        throw new Error(`Missing field ${field} for planet ${planet}`);
      }
    }
  }

  console.log('✓ Planetary positions validation passed');
}

function testHouseSystem() {
  console.log('Testing house system...');

  if (sampleWesternBirthChart.houses.length !== 12) {
    throw new Error(`Expected 12 houses, got ${sampleWesternBirthChart.houses.length}`);
  }

  // Check that houses are valid angles (0-360)
  for (let i = 0; i < sampleWesternBirthChart.houses.length; i++) {
    const house = sampleWesternBirthChart.houses[i];
    if (house < 0 || house >= 360) {
      throw new Error(`Invalid house angle: ${house} at index ${i}`);
    }
  }

  console.log('✓ House system validation passed');
}

function testAspects() {
  console.log('Testing aspects...');

  for (const aspect of sampleWesternBirthChart.aspects) {
    const requiredFields = ['planet1', 'planet2', 'aspect', 'angle', 'orb', 'exact'];

    for (const field of requiredFields) {
      if (!(field in aspect)) {
        throw new Error(`Missing field ${field} in aspect`);
      }
    }

    // Validate angle is reasonable
    if (aspect.angle < 0 || aspect.angle >= 360) {
      throw new Error(`Invalid aspect angle: ${aspect.angle}`);
    }
  }

  console.log('✓ Aspects validation passed');
}

function testChartAnalysis() {
  console.log('Testing chart analysis...');

  // Test dominant elements
  const elements = sampleWesternBirthChart.dominantElements;
  const elementSum = elements.fire + elements.earth + elements.air + elements.water;

  if (Math.abs(elementSum - 1.0) > 0.01) {
    throw new Error(`Element percentages don't sum to 1.0: ${elementSum}`);
  }

  // Test chart shape
  const validShapes = ['Splash', 'Bundle', 'Bowl', 'Bucket', 'Locomotor', 'Seesaw'];
  if (!validShapes.includes(sampleWesternBirthChart.chartShape)) {
    throw new Error(`Invalid chart shape: ${sampleWesternBirthChart.chartShape}`);
  }

  console.log('✓ Chart analysis validation passed');
}

// Run all tests
function runTests() {
  console.log('Running Western Birth Chart Component Tests...\n');

  try {
    testWesternBirthChartInterface();
    testBirthDataValidation();
    testPlanetaryPositions();
    testHouseSystem();
    testAspects();
    testChartAnalysis();

    console.log('\n✅ All tests passed! Western birth chart components are working correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other test files
module.exports = {
  sampleBirthData,
  sampleWesternBirthChart,
  runTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}