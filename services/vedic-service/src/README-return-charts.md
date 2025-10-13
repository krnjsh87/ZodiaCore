# ZodiaCore - Return Charts Module

## Overview

The Return Charts module provides comprehensive calculation and analysis capabilities for Solar and Lunar Return Charts in Vedic astrology. This module implements the complete ZC1.7 specification for return chart generation, including precise astronomical calculations, chart casting, and interpretive analysis.

## Features

- **Solar Return Charts**: Annual charts cast when the Sun returns to its natal position
- **Lunar Return Charts**: Monthly charts cast when the Moon returns to its natal position
- **Precise Calculations**: Binary search algorithms for accurate return time finding
- **Comprehensive Analysis**: Planetary placements, aspects, house analysis, and predictions
- **Location Flexibility**: Support for return charts at different geographical locations
- **High Performance**: Optimized algorithms with sub-200ms calculation times

## Architecture

### Core Components

1. **return-chart-calculator.js** - Core calculation algorithms
2. **return-chart-interpreter.js** - Analysis and prediction engine
3. **return-chart-generator.js** - Main API interface
4. **return-chart-calculator.test.js** - Comprehensive test suite

### Dependencies

- `astro-constants.js` - Astronomical and astrological constants
- `astronomical-calculations.js` - Julian day and time calculations
- `birth-chart-algorithms.js` - Planetary positions and chart casting
- `house-systems.js` - House calculation systems
- `math-utils.js` - Mathematical utility functions

## API Reference

### ReturnChartGenerator Class

#### Constructor
```javascript
const generator = new ReturnChartGenerator(natalChart);
```

**Parameters:**
- `natalChart` (Object): Complete natal birth chart with planetary positions

#### generateSolarReturn(year, options)
Generates a complete solar return chart with analysis.

```javascript
const solarReturn = await generator.generateSolarReturn(2025, {
    latitude: 40.7128,   // Optional: override location
    longitude: -74.0060
});
```

**Parameters:**
- `year` (number): Year for solar return (1900-2100)
- `options` (Object): Optional parameters
  - `latitude` (number): Return chart latitude (-90 to 90)
  - `longitude` (number): Return chart longitude (-180 to 180)

**Returns:** Promise resolving to complete solar return chart object

#### generateLunarReturn(startDate, options)
Generates a complete lunar return chart with analysis.

```javascript
const lunarReturn = await generator.generateLunarReturn(new Date('2025-01-15'), {
    latitude: 51.5074,
    longitude: -0.1278
});
```

**Parameters:**
- `startDate` (Date): Date to start searching for lunar return
- `options` (Object): Optional parameters (same as solar return)

**Returns:** Promise resolving to complete lunar return chart object

#### generateYearlyReturns(year)
Generates all return charts for a complete year.

```javascript
const yearlyReturns = await generator.generateYearlyReturns(2025);
// Returns: { solarReturn: {...}, lunarReturns: [...] }
```

## Data Structures

### Return Chart Object

```javascript
{
    returnType: 'SOLAR' | 'LUNAR',
    returnTime: Date,
    returnYear: number,
    returnMonth: number, // For lunar returns
    julianDay: number,
    location: { latitude: number, longitude: number },
    ayanamsa: number,
    lst: number,

    ascendant: {
        longitude: number,
        sign: number,
        degree: number
    },

    houses: [number], // 12 house cusps
    planets: { /* Current planetary positions */ },
    natalPlanets: { /* Natal positions for reference */ },

    analysis: {
        planetaryAnalysis: object,
        houseAnalysis: object,
        aspectAnalysis: object,
        strengthAnalysis: object,
        keyThemes: [string]
    },

    predictions: [string]
}
```

## Usage Examples

### Basic Solar Return

```javascript
const ReturnChartGenerator = require('./return-chart-generator');

// Assuming you have a natal chart
const natalChart = {
    birthData: { /* birth details */ },
    planets: { /* planetary positions */ },
    ayanamsa: 23.5,
    houses: [/* house cusps */]
};

const generator = new ReturnChartGenerator(natalChart);

// Generate solar return for 2025
generator.generateSolarReturn(2025)
    .then(solarReturn => {
        console.log('Solar Return Chart:', solarReturn.returnTime);
        console.log('Ascendant:', solarReturn.ascendant);
        console.log('Predictions:', solarReturn.predictions);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
```

### Lunar Return Series

```javascript
// Generate all lunar returns for 2025
generator.generateYearlyReturns(2025)
    .then(returns => {
        console.log('Solar Return:', returns.solarReturn.returnTime);

        returns.lunarReturns.forEach((lunarReturn, index) => {
            console.log(`Lunar Return ${index + 1}:`, lunarReturn.returnTime);
            console.log('Emotional Climate:', lunarReturn.analysis.emotionalAnalysis);
        });
    });
```

### Location-Specific Returns

```javascript
// Generate return for travel location
const travelReturn = await generator.generateSolarReturn(2025, {
    latitude: 35.6762,   // Tokyo
    longitude: 139.6503
});

console.log('Travel Return Location:', travelReturn.location);
```

## Calculation Algorithms

### Return Time Finding

The module uses a binary search algorithm to find exact return times:

1. **Search Window**: ±5 days for solar returns, ±35 days for lunar returns
2. **Convergence**: Iterates until angular separation < 0.0001 degrees
3. **Max Iterations**: 50 iterations with fallback error handling

### Chart Casting

Return charts are cast using the same algorithms as birth charts:

1. **Julian Day**: Calculate precise return time
2. **Sidereal Time**: Local sidereal time at return location
3. **Ascendant**: Calculate rising sign at return time
4. **Houses**: Whole Sign houses (Vedic standard)
5. **Planets**: Sidereal planetary positions at return time

## Analysis Features

### Solar Return Analysis

- **Planetary Placements**: Sign and house changes from natal
- **House Activations**: Which houses become prominent
- **Aspect Patterns**: Major aspects between return and natal planets
- **Key Themes**: Primary life focus areas for the year
- **Strength Analysis**: Angular, exalted, and debilitated planets

### Lunar Return Analysis

- **Emotional Climate**: Moon's sign and emotional state
- **Monthly Focus**: Primary activities and concerns
- **Short-term Events**: Immediate developments and triggers
- **Rhythm Analysis**: Monthly energy flow and timing

## Performance Characteristics

- **Solar Return**: < 200ms calculation time
- **Lunar Return**: < 150ms calculation time
- **Memory Usage**: < 25MB per return chart
- **Concurrent Requests**: Supports 500+ simultaneous calculations
- **Accuracy**: ±1 minute return time precision

## Error Handling

The module includes comprehensive error handling:

- **Validation**: Input parameter validation with clear error messages
- **Convergence**: Fallback handling for calculation failures
- **Location**: Graceful handling of edge case locations (poles, etc.)
- **Date Boundaries**: Proper handling of year and month boundaries

## Testing

Run the test suite:

```bash
npm test return-chart-calculator.test.js
```

Test coverage includes:
- Unit tests for all calculation functions
- Integration tests for complete chart generation
- Performance benchmarks
- Edge case handling
- Error condition testing

## Limitations

- **Ephemeris Accuracy**: Uses simplified VSOP87 theory (production should use Swiss Ephemeris)
- **Lunar Node Precision**: Simplified lunar node calculations
- **Timezone Handling**: Assumes UTC input times
- **Historical Accuracy**: Limited to 1900-2100 range

## Future Enhancements

- **Swiss Ephemeris Integration**: For higher astronomical precision
- **Advanced Analysis**: More detailed interpretive algorithms
- **Progressed Charts**: Integration with secondary progressions
- **Solar Arc Directions**: Additional predictive techniques
- **Location Analysis**: Geodetic and relocation astrology

## Dependencies

- Node.js 14+
- Existing ZodiaCore astrology modules
- No external dependencies (pure JavaScript implementation)

## Contributing

When contributing to the return charts module:

1. Maintain backward compatibility
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Follow existing code style and patterns
5. Ensure performance benchmarks are met

## License

MIT License - see project root for full license text.