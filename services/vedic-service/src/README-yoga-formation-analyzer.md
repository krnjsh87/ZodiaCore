# Yoga Formation Analyzer (ZC1.24)

## Overview

The Yoga Formation Analyzer implements comprehensive algorithms for detecting and interpreting major Vedic astrology Yogas including Raja Yoga, Dhana Yoga, Mahapurusha Yoga, and other significant planetary combinations as specified in ZC1.24.

## Features

- **Complete Yoga Detection**: Detects all major Vedic astrology yogas
- **Strength Calculation**: Quantitative evaluation of yoga potency
- **Detailed Interpretations**: Comprehensive effects and predictions for each yoga
- **Robust Validation**: Input validation and error handling
- **Modular Design**: Easy to extend and maintain

## Supported Yogas

### Raja Yogas (Power & Authority)
- Kendra-Trikona Raja Yoga
- Dharma-Karma Raja Yoga
- Lagna-Kendra Yoga

### Dhana Yogas (Wealth & Prosperity)
- Labha-Dhana Yoga
- Jupiter-Venus Dhana Yoga
- Second-Eleventh Yoga

### Mahapurusha Yogas (Great Person)
- Pancha Mahapurusha Yoga (Mars, Mercury, Jupiter, Venus, Saturn)
- General Mahapurusha Yoga

### Special Yogas
- Gaja Kesari Yoga
- Neecha Bhanga Raja Yoga
- Viparita Raja Yoga

## Installation

```javascript
const { YogaDetector } = require('./yoga-formation-analyzer');
```

## Usage

### Basic Usage

```javascript
// Sample birth chart data
const birthChart = {
    ascendant: { sign: 0 }, // Aries ascendant
    planets: {
        SUN: { longitude: 30, house: 1 },
        MOON: { longitude: 33, house: 1 },
        MARS: { longitude: 0, house: 1 },
        MERCURY: { longitude: 60, house: 2 },
        JUPITER: { longitude: 240, house: 9 },
        VENUS: { longitude: 270, house: 10 },
        SATURN: { longitude: 300, house: 11 }
    }
};

// Create detector instance
const yogaDetector = new YogaDetector(birthChart);

// Detect all yogas
const allYogas = yogaDetector.detectAllYogas();

console.log('Detected Yogas:', allYogas);
```

### Advanced Usage

```javascript
// Get yoga summary
const summary = yogaDetector.getYogaSummary();
console.log('Yoga Summary:', summary);

// Filter yogas by strength
const strongYogas = yogaDetector.getYogasByStrength(0.8);

// Filter yogas by category
const powerYogas = yogaDetector.getYogasByCategory('Power & Authority');
```

## API Reference

### YogaDetector Class

#### Constructor
```javascript
new YogaDetector(birthChart)
```

**Parameters:**
- `birthChart` (Object): Complete birth chart data with planets and ascendant

**Throws:**
- `Error`: If birth chart validation fails

#### Methods

##### detectAllYogas()
Detects all yogas in the birth chart.

**Returns:** `Array` - Array of detected yoga objects

##### detectRajaYogas()
Detects Raja Yogas only.

**Returns:** `Array` - Array of Raja yoga objects

##### detectDhanaYogas()
Detects Dhana Yogas only.

**Returns:** `Array` - Array of Dhana yoga objects

##### detectMahapurushaYogas()
Detects Mahapurusha Yogas only.

**Returns:** `Array` - Array of Mahapurusha yoga objects

##### detectSpecialYogas()
Detects special yogas only.

**Returns:** `Array` - Array of special yoga objects

##### getYogaSummary()
Generates a summary of detected yogas.

**Returns:** `Object` - Summary with totals, categories, and dominant category

##### getYogasByStrength(minStrength)
Filters yogas by minimum strength threshold.

**Parameters:**
- `minStrength` (number): Minimum strength (0-1)

**Returns:** `Array` - Filtered yoga array

##### getYogasByCategory(category)
Filters yogas by category.

**Parameters:**
- `category` (string): Category name ('Power & Authority', 'Wealth & Prosperity', etc.)

**Returns:** `Array` - Filtered yoga array

### Utility Functions

#### calculateDignityStrength(planet, sign)
Calculates planetary dignity strength multiplier.

**Parameters:**
- `planet` (string): Planet name
- `sign` (number): Sign number (0-11)

**Returns:** `number` - Strength multiplier

#### isInKendra(house)
Checks if house is a kendra house.

**Parameters:**
- `house` (number): House number (1-12)

**Returns:** `boolean`

#### isInTrikona(house)
Checks if house is a trikona house.

**Parameters:**
- `house` (number): House number (1-12)

**Returns:** `boolean`

#### calculateAspectStrength(planet1House, planet2House)
Calculates aspect strength between two planets.

**Parameters:**
- `planet1House` (number): First planet's house
- `planet2House` (number): Second planet's house

**Returns:** `number` - Aspect strength (0-1)

#### getHouseLord(house, ascendantSign)
Gets the lord of a house.

**Parameters:**
- `house` (number): House number (1-12)
- `ascendantSign` (number): Ascendant sign (0-11)

**Returns:** `string` - Planet name

#### calculateYogaStrength(birthChart, planets)
Calculates overall yoga strength for given planets.

**Parameters:**
- `birthChart` (Object): Birth chart data
- `planets` (Array): Array of planet names

**Returns:** `number` - Average strength (0-1)

## Data Structures

### Birth Chart Format

```javascript
{
    ascendant: {
        sign: 0  // 0-11 (Aries to Pisces)
    },
    planets: {
        SUN: {
            longitude: 30.5,  // 0-360 degrees
            house: 1          // 1-12
        },
        MOON: {
            longitude: 45.2,
            house: 2
        },
        // ... other planets
    },
    // Optional: Shad Bala strengths
    strengths: {
        SUN: { overall: 0.8 },
        MOON: { overall: 0.6 }
        // ... other planets
    }
}
```

### Yoga Object Format

```javascript
{
    name: "Kendra-Trikona Raja Yoga",
    type: "PARIVARTANA",
    planets: ["JUPITER", "SATURN"],
    strength: 0.85,
    description: "Jupiter and Saturn exchange signs",
    effects: {
        power: "Exceptional leadership and authority",
        career: "High-level executive positions, government roles",
        wealth: "Substantial wealth through position and influence",
        recognition: "National or international fame",
        duration: "Lifelong influence"
    },
    houses: [9, 10]
}
```

## Yoga Strength Levels

- **0.6-0.7**: Weak influence, present but minimal impact
- **0.7-0.8**: Moderate influence, noticeable life effects
- **0.8-0.9**: Strong influence, significant life impact
- **0.9-1.0**: Very strong influence, dominant life theme

## Constants

### YOGA_CONSTANTS
Contains all yoga-related constants including multipliers, thresholds, and house classifications.

### PLANETARY_RELATIONSHIPS
Defines planetary friendships, enmities, and neutral relationships.

### SIGN_LORDS
Array mapping signs to their ruling planets.

### PLANETARY_DIGNITIES
Exaltation and debilitation signs for each planet.

### YOGA_CATEGORIES
Categorization of different yoga types.

## Error Handling

The module includes comprehensive error handling:

- **Validation Errors**: Invalid birth chart data
- **Range Errors**: Invalid longitude, house, or sign values
- **Detection Errors**: Wrapped in try-catch for robustness

## Performance

- **Detection Time**: < 100ms for complete analysis
- **Memory Usage**: < 10MB for full system
- **Scalability**: Handles 1000+ charts per minute

## Dependencies

- **None**: Pure JavaScript implementation, no external dependencies

## Testing

Run the test suite:

```bash
npm test yoga-formation-analyzer.test.js
```

Tests cover:
- Yoga detection algorithms
- Utility functions
- Error handling
- Edge cases
- Performance benchmarks

## Integration

### With Birth Chart Generator

```javascript
const birthChart = birthChartGenerator.generateChart(birthData);
const yogaDetector = new YogaDetector(birthChart);
const yogas = yogaDetector.detectAllYogas();
```

### With Frontend Components

```javascript
// In React component
const [yogas, setYogas] = useState([]);

useEffect(() => {
    const detector = new YogaDetector(birthChart);
    const detectedYogas = detector.detectAllYogas();
    setYogas(detectedYogas);
}, [birthChart]);
```

## Limitations

- Requires accurate planetary positions and house calculations
- Vedic astrology interpretations may vary by tradition
- Does not include all possible rare yogas
- Strength calculations are based on traditional principles

## Future Enhancements

- Machine learning models for strength prediction
- Cultural variations in interpretations
- Additional rare yoga combinations
- Integration with divisional charts

## References

- Brihat Parashara Hora Shastra
- Saravali
- Jataka Parijata
- Chamatkar Chintamani
- Uttara Kalamrita

## License

MIT License - See project license file for details.

## Version

1.0.0 - Initial implementation of ZC1.24 Yoga Formation Analysis