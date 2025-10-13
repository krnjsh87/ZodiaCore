# ZodiaCore - Vedic Muhurat System

## Overview

The Vedic Muhurat System is a comprehensive implementation of traditional Vedic astrology timing calculations for determining auspicious moments for important life activities. This system provides accurate Panchang calculations, Muhurat scoring, and specialized recommendations for marriage, business, travel, and other significant events.

## Features

- **Complete Panchang Calculation**: Real-time calculation of all five Vedic elements (Tithi, Nakshatra, Yoga, Karana, Vara)
- **30 Muhurats per Day**: Traditional 48-minute time divisions with ruling planets and auspiciousness
- **Specialized Calculators**: Activity-specific algorithms for marriage, business, and travel
- **Comprehensive Scoring**: Weighted evaluation system with detailed recommendations
- **Auspicious Period Detection**: Abhijit Muhurat, Brahma Muhurat, and Rahu Kaal identification
- **Location-Based Calculations**: Accurate sunrise/sunset and planetary positions
- **Validation & Remedies**: Built-in validation with traditional remedy suggestions

## Architecture

```
VedicMuhuratSystem (Main Orchestrator)
├── PanchangCalculator (Core Vedic Elements)
├── MuhuratCalculator (30 Daily Muhurats)
├── MuhuratScorer (Scoring & Evaluation)
├── MarriageMuhuratCalculator (Specialized)
├── BusinessMuhuratCalculator (Specialized)
└── TravelMuhuratCalculator (Specialized)
```

## Installation

```bash
# Install dependencies (if any third-party libraries are added)
npm install

# Run tests
npm test

# Run the system
node example-usage.js
```

## Quick Start

```javascript
const VedicMuhuratSystem = require('./vedic-muhurat-system');

// Initialize the system
const muhuratSystem = new VedicMuhuratSystem();

// Find auspicious marriage muhurats
const marriageMuhurats = await muhuratSystem.findAuspiciousMuhurat(
    'marriage',
    new Date('2025-01-01'),
    new Date('2025-12-31'),
    {
        latitude: 28.6139,    // Delhi coordinates
        longitude: 77.2090,
        minScore: 0.7,
        maxResults: 5
    }
);

console.log('Recommended Marriage Muhurats:', marriageMuhurats);
```

## API Reference

### VedicMuhuratSystem

#### `findAuspiciousMuhurat(activityType, startDate, endDate, preferences)`

Finds auspicious timing for specified activities within a date range.

**Parameters:**
- `activityType` (string): Type of activity ('marriage', 'business', 'travel', 'education', 'medical', 'general')
- `startDate` (Date): Start date for search
- `endDate` (Date): End date for search
- `preferences` (object): Optional preferences
  - `latitude` (number): Location latitude (default: 28.6139)
  - `longitude` (number): Location longitude (default: 77.2090)
  - `minScore` (number): Minimum score threshold (default: 0.6)
  - `maxResults` (number): Maximum results to return (default: 10)

**Returns:** Array of muhurat objects sorted by score

#### `getPanchang(date, latitude, longitude)`

Gets complete Panchang for a specific date and location.

**Parameters:**
- `date` (Date): Date for calculation
- `latitude` (number): Latitude in degrees
- `longitude` (number): Longitude in degrees

**Returns:** Complete Panchang object with all five elements

#### `getDailyMuhurats(date, latitude, longitude)`

Gets all 30 Muhurats for a specific date.

**Parameters:**
- `date` (Date): Date for calculation
- `latitude` (number): Latitude for sunrise calculation
- `longitude` (number): Longitude for sunrise calculation

**Returns:** Array of 30 Muhurat objects

#### `generateMuhuratReport(selectedMuhurat, activityType)`

Generates a detailed report for a selected muhurat.

**Parameters:**
- `selectedMuhurat` (object): Selected muhurat data
- `activityType` (string): Type of activity

**Returns:** Comprehensive report object with analysis and recommendations

## Supported Activities

### Marriage Muhurat
- **Ideal Tithis**: 2, 3, 5, 7, 10, 11, 12, 13, 15 (Shukla Paksha preferred)
- **Ideal Nakshatras**: Rohini, Pushya, Magha, Hasta, etc.
- **Favorable Weekdays**: Monday, Wednesday, Thursday, Friday
- **Avoid**: Gand Mula Nakshatras, Rahu Kaal, Ashtami, Navami

### Business Muhurat
- **Ideal Tithis**: 2, 3, 5, 7, 10, 12, 13, 15
- **Ideal Nakshatras**: Krittika, Magha, Purva Phalguni, etc.
- **Favorable Weekdays**: Sunday, Tuesday, Wednesday, Thursday, Friday
- **Avoid**: Tuesday, Saturday (generally)

### Travel Muhurat
- **Direction-based**: Different weekdays favor different directions
- **Safe Nakshatras**: Avoid Bharani, Krittika (parts), Jyeshtha
- **Consider**: Moon position, planetary transits

## Scoring System

The system uses a weighted scoring algorithm with the following components:

| Component | Weight | Description |
|-----------|--------|-------------|
| Tithi | 20% | Lunar day auspiciousness |
| Nakshatra | 25% | Lunar mansion influence |
| Yoga | 15% | Luni-solar combination |
| Karana | 10% | Half-tithi influence |
| Vara | 15% | Weekday influence |
| Muhurat | 10% | Specific time division |
| Planetary | 5% | Planetary positions |

### Score Grades

- **Excellent** (0.8+): Highly auspicious, proceed with confidence
- **Very Good** (0.7-0.8): Very favorable conditions
- **Good** (0.6-0.7): Generally favorable
- **Fair** (0.5-0.6): Acceptable with precautions
- **Poor** (0.4-0.5): Consider alternatives
- **Inauspicious** (<0.4): Avoid if possible

## Special Periods

### Abhijit Muhurat
- **Time**: Approximately 11:30 AM to 12:30 PM (varies by location)
- **Significance**: Most auspicious period of the day
- **Suitable for**: All important activities

### Brahma Muhurat
- **Time**: 1.5 hours before sunrise
- **Significance**: Ideal for spiritual practices and meditation
- **Suitable for**: Prayers, meditation, spiritual activities

### Rahu Kaal
- **Time**: Varies by weekday (1.5 hour period)
- **Significance**: Inauspicious period to avoid
- **Avoid**: Important decisions, new beginnings

## Technical Specifications

### Accuracy Requirements
- **Time Calculations**: ±1 minute accuracy for sunrise/sunset
- **Planetary Positions**: ±0.01 degrees accuracy
- **Panchang Elements**: Exact calculation with proper sequencing
- **Muhurat Timing**: ±5 minutes accuracy for muhurat boundaries

### Performance Benchmarks
- **Panchang Calculation**: < 200ms per date
- **Muhurat Scanning**: < 500ms for 30-day range
- **Report Generation**: < 100ms per muhurat
- **Batch Processing**: < 2 seconds for 100 muhurat calculations

### Dependencies
- **Math Utils**: `math-utils.js` for trigonometric functions
- **Astronomical Calculations**: `astronomical-calculations.js` for Julian day and Ayanamsa
- **Planetary Calculator**: `planetary-calculator.js` for celestial positions

## Usage Examples

### Finding Marriage Muhurats

```javascript
const preferences = {
    latitude: 28.6139,    // Delhi
    longitude: 77.2090,
    minScore: 0.7,
    maxResults: 5
};

const marriageMuhurats = await muhuratSystem.findAuspiciousMuhurat(
    'marriage',
    new Date('2025-01-01'),
    new Date('2025-12-31'),
    preferences
);

marriageMuhurats.forEach(muhurat => {
    console.log(`${muhurat.date.toDateString()}: ${muhurat.score.grade} (${muhurat.score.totalScore})`);
});
```

### Generating Detailed Reports

```javascript
const selectedMuhurat = marriageMuhurats[0];
const report = await muhuratSystem.generateMuhuratReport(selectedMuhurat, 'marriage');

console.log('Muhurat Report:');
console.log(`Date: ${report.date}`);
console.log(`Grade: ${report.overallGrade}`);
console.log(`Recommendation: ${report.recommendation}`);
console.log('Strengths:', report.strengths);
console.log('Remedies:', report.remedies);
```

### Checking Daily Panchang

```javascript
const panchang = await muhuratSystem.getPanchang(new Date('2025-01-01'));

console.log('Daily Panchang:');
console.log(`Tithi: ${panchang.tithi.name} (${panchang.tithi.paksha})`);
console.log(`Nakshatra: ${panchang.nakshatra.name} (Lord: ${panchang.nakshatra.lord})`);
console.log(`Yoga: ${panchang.yoga.name}`);
console.log(`Karana: ${panchang.karana.name}`);
console.log(`Weekday: ${panchang.vara.englishName}`);
```

## Validation & Error Handling

The system includes comprehensive validation:

- **Input Validation**: Date ranges, coordinates, activity types
- **Calculation Validation**: Planetary position accuracy checks
- **Business Rule Validation**: Traditional rule compliance
- **Error Recovery**: Graceful degradation with fallbacks

## Limitations & Considerations

### Current Limitations
- Simplified astronomical calculations (use Swiss Ephemeris for production)
- Basic sunrise/sunset calculations (consider local timezone variations)
- Limited planetary influence modeling
- No historical data validation

### Future Enhancements
- Integration with professional ephemeris libraries
- Advanced planetary influence modeling
- Historical accuracy validation
- Multi-timezone support
- Extended activity types

## Testing

Run the test suite:

```bash
npm test muhurat-calculator.test.js
```

Test coverage includes:
- Panchang calculation accuracy
- Muhurat scoring algorithms
- Specialized calculator logic
- System integration tests
- Error handling scenarios

## Contributing

1. Follow the established coding standards
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure backward compatibility
5. Run full test suite before submitting

## References

- **Muhurta Chintamani**: Classical Vedic text on auspicious timing
- **Brihat Samhita**: Comprehensive astrological encyclopedia
- **Lahiri Ayanamsa**: Official Indian government standard
- **Traditional Vedic Panchang Systems**: Time-honored calculation methods

## License

MIT License - See LICENSE file for details

## Version History

- **1.0.0**: Initial implementation with core Muhurat functionality
  - Complete Panchang calculations
  - 30 Muhurat system
  - Specialized calculators for marriage, business, travel
  - Comprehensive scoring and reporting
  - Full test coverage