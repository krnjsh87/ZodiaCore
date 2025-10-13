# Western Horoscope System (ZC3.7)

## Overview

The Western Horoscope System implements comprehensive horoscope generation for Western astrology, supporting daily, weekly, monthly, and yearly predictions based on tropical zodiac calculations and astrological transits.

## Features

- **Daily Horoscopes**: Personalized daily predictions with moon phases, planetary hours, and auspicious timing
- **Weekly Horoscopes**: 7-day forecasts with peak days and challenging periods
- **Monthly Horoscopes**: Lunar cycle analysis and monthly transit summaries
- **Yearly Horoscopes**: Annual predictions with major planetary movements and life themes
- **Tropical Zodiac**: Standard Western astrology calculations
- **Transit Analysis**: Real-time planetary position calculations
- **Aspect Analysis**: Angular relationships between planets
- **Void of Course Detection**: Optimal timing for activities

## Architecture

### Core Components

1. **WesternHoroscopeSystem** - Main orchestration class
2. **WesternHoroscopeGenerator** - Base generator with common functionality
3. **DailyWesternHoroscopeGenerator** - Daily-specific predictions
4. **WeeklyWesternHoroscopeGenerator** - Weekly forecasts
5. **MonthlyWesternHoroscopeGenerator** - Monthly analysis
6. **YearlyWesternHoroscopeGenerator** - Annual predictions
7. **WesternTransitCalculator** - Astronomical calculations
8. **WesternHoroscopeUtils** - Utility functions

### File Structure

```
western-horoscope-system/
├── western-horoscope-constants.js          # Constants and configuration
├── western-horoscope-utils.js               # Utility functions
├── western-transit-calculator.js            # Astronomical calculations
├── western-horoscope-generator.js           # Base generator class
├── daily-western-horoscope-generator.js     # Daily horoscopes
├── weekly-western-horoscope-generator.js    # Weekly horoscopes
├── monthly-western-horoscope-generator.js   # Monthly horoscopes
├── yearly-western-horoscope-generator.js    # Yearly horoscopes
├── western-horoscope-system.js              # Main system class
├── western-horoscope-system.test.js         # Test suite
└── README-western-horoscope-system.md       # This documentation
```

## Usage

### Basic Usage

```javascript
const { WesternHoroscopeSystem } = require('./western-horoscope-system');

// Initialize with birth chart
const birthChart = {
    planets: {
        SUN: { longitude: 120 },
        MOON: { longitude: 60 },
        // ... other planets
    },
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
};

const horoscopeSystem = new WesternHoroscopeSystem(birthChart);

// Generate daily horoscope
const dailyHoroscope = await horoscopeSystem.generateHoroscope('daily', new Date());
console.log(dailyHoroscope);

// Generate all horoscopes
const allHoroscopes = await horoscopeSystem.generateAllHoroscopes(new Date());
console.log(allHoroscopes);
```

### Advanced Usage

```javascript
// Generate specific type
const weeklyHoroscope = await horoscopeSystem.generateHoroscope('weekly', new Date());
const monthlyHoroscope = await horoscopeSystem.generateHoroscope('monthly', new Date());
const yearlyHoroscope = await horoscopeSystem.generateHoroscope('yearly', new Date());

// Access specific data
console.log('Daily moon phase:', dailyHoroscope.daily.moonPhase);
console.log('Weekly peak days:', weeklyHoroscope.weekly.peakDays);
console.log('Monthly lunar phases:', monthlyHoroscope.monthly.lunarPhases);
```

## API Reference

### WesternHoroscopeSystem

#### Constructor
```javascript
new WesternHoroscopeSystem(birthChart)
```

**Parameters:**
- `birthChart` (Object): Birth chart data with planets and houses

#### Methods

##### generateHoroscope(type, date)
Generates horoscope for specified type and date.

**Parameters:**
- `type` (string): 'daily', 'weekly', 'monthly', or 'yearly'
- `date` (Date): Date for horoscope generation

**Returns:** Promise resolving to horoscope object

##### generateAllHoroscopes(date)
Generates all horoscope types for the given date.

**Parameters:**
- `date` (Date): Date for horoscope generation

**Returns:** Promise resolving to object with all horoscope types

##### validateHoroscope(horoscope, referenceData)
Validates horoscope accuracy against reference data.

##### isRatingReasonable(rating)
Checks if rating string is valid.

##### getHealthStatus()
Returns system health status.

## Horoscope Output Structure

### Daily Horoscope
```javascript
{
    type: 'daily',
    dateRange: { start: Date, end: Date },
    sunSign: 'Leo',
    moonSign: 'Gemini',
    risingSign: 'Sagittarius',
    predictions: {
        overall: {
            score: 0.75,
            rating: 'Good',
            summary: 'Positive day ahead',
            keyInfluences: [...]
        },
        categories: {
            love: { score: 0.8, rating: 'Very Good', prediction: '...', advice: '...' },
            career: { ... },
            health: { ... },
            finance: { ... },
            family: { ... },
            spiritual: { ... }
        },
        aspects: [...],
        voidOfCourse: [...],
        challenges: [...],
        opportunities: [...]
    },
    daily: {
        moonSign: 'Gemini',
        voidOfCourse: false,
        moonPhase: 'Waxing Crescent',
        planetaryHours: [...],
        auspiciousHours: [...],
        challengingHours: [...]
    },
    transits: { ... },
    confidence: 0.85
}
```

### Weekly/Monthly/Yearly Structure
Similar structure with type-specific data in `weekly`/`monthly`/`yearly` properties.

## Dependencies

- **WESTERN_HOROSCOPE_CONSTANTS**: Configuration and constants
- **WesternHoroscopeUtils**: Utility functions for calculations
- **WesternTransitCalculator**: Astronomical calculations (future integration)

## Configuration

All configuration is centralized in `WESTERN_HOROSCOPE_CONSTANTS`:

- **TRANSIT_WEIGHTS**: Influence weights for each planet
- **ASPECTS**: Aspect definitions with angles and weights
- **CATEGORIES**: Prediction categories
- **RATING_THRESHOLDS**: Score-to-rating mappings
- **PREDICTION_TEMPLATES**: Text templates for predictions

## Testing

Run the test suite:

```bash
npm test western-horoscope-system.test.js
```

Tests cover:
- System initialization
- Horoscope generation for all types
- Data validation
- Error handling
- Constants verification

## Performance

- **Daily Horoscope**: < 500ms generation time
- **Weekly Horoscope**: < 1 second
- **Monthly Horoscope**: < 2 seconds
- **Yearly Horoscope**: < 5 seconds
- **Memory Usage**: < 50MB for complete system

## Accuracy Requirements

- **Transit Calculations**: ±0.01 degrees accuracy
- **Aspect Detection**: ±1 degree orb accuracy
- **Prediction Scoring**: ±0.05 score accuracy
- **Void of Course Detection**: 95% accuracy
- **Time Calculations**: ±1 minute accuracy

## Future Enhancements

- Integration with Swiss Ephemeris for accurate astronomical data
- Caching system for frequently requested horoscopes
- Machine learning for prediction refinement
- Multi-language support
- Advanced aspect pattern recognition

## References

- Western Astrology principles and tropical zodiac
- Traditional planetary hours system
- Void of Course Moon calculations
- Aspect theory and interpretation

## Contributing

Follow the project's coding standards and add comprehensive tests for new features.

## License

See project license file.