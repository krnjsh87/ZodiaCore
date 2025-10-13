# ZodiaCore - Compatibility Analysis Module

## Overview

The Compatibility Analysis Module provides comprehensive astrological relationship compatibility analysis through both Western and Vedic astrology techniques. This module supports synastry and composite chart analysis for Western astrology, and Guna Milan (Ashtakoota) compatibility for Vedic astrology. The module analyzes compatibility between two individuals by examining planetary aspects, house overlays, composite chart formations, and traditional Vedic matching criteria.

## Features

### Western Astrology Compatibility
- **Synastry Analysis**: Examines planetary aspects between two natal charts
- **Composite Chart Generation**: Creates relationship entity charts from two birth charts
- **Compatibility Scoring**: Provides overall compatibility scores with detailed breakdowns
- **Interpretation Engine**: Offers detailed astrological interpretations and recommendations

### Vedic Astrology Compatibility
- **Guna Milan (Ashtakoota)**: Traditional Vedic marriage compatibility analysis
- **8 Koota Evaluation**: Assesses compatibility across Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi
- **Dosha Detection**: Identifies critical compatibility issues (Nadi dosha, Bhakoot dosha)
- **Remedy Recommendations**: Suggests astrological remedies for compatibility issues

### General Features
- **API Integration**: RESTful endpoints for all compatibility analysis types
- **Multi-System Support**: Western and Vedic astrology compatibility methods
- **Detailed Reporting**: Comprehensive compatibility reports with recommendations

## Architecture

### Core Components

#### Western Astrology Components
1. **SynastryAnalyzer** (`synastry-analyzer.js`)
    - Analyzes aspects between two natal charts
    - Calculates house overlays
    - Provides relationship insights

2. **CompositeChartGenerator** (`composite-chart-generator.js`)
    - Generates composite charts from two birth charts
    - Calculates midpoints for planetary positions
    - Creates relationship entity representations

3. **CompatibilityScorer** (`compatibility-scorer.js`)
    - Combines synastry and composite analyses
    - Calculates overall compatibility scores
    - Provides detailed reports and recommendations

#### Vedic Astrology Components
4. **GunaMilanCalculator** (`guna-milan-calculator.js`)
    - Implements Ashtakoota compatibility analysis
    - Evaluates 8 Kootas: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi
    - Detects doshas and provides remedy recommendations

5. **NakshatraCompatibility** (`nakshatra-compatibility.js`)
    - Nakshatra-based matching logic
    - Yoni, Gana, and Nadi compatibility calculations
    - Traditional Vedic compatibility algorithms

#### Shared Components
6. **CompatibilityUtils** (`compatibility-utils.js`)
    - Core utility functions for aspect calculations
    - Scoring algorithms and interpretation helpers
    - Constants and configuration values for both systems

## Usage

### Basic Compatibility Analysis

```javascript
const { VedicBirthChartGenerator } = require('./vedic-birth-chart-generator');
const { SynastryAnalyzer } = require('./synastry-analyzer');
const { CompositeChartGenerator } = require('./composite-chart-generator');
const { CompatibilityScorer } = require('./compatibility-scorer');

// Generate birth charts
const generator = new VedicBirthChartGenerator();
const chart1 = await generator.generateBirthChart(birthData1);
const chart2 = await generator.generateBirthChart(birthData2);

// Analyze synastry
const synastryAnalyzer = new SynastryAnalyzer(chart1, chart2);
const synastry = synastryAnalyzer.analyzeSynastry();

// Generate composite chart
const compositeGenerator = new CompositeChartGenerator(chart1, chart2);
const composite = compositeGenerator.generateCompositeChart();

// Calculate compatibility
const scorer = new CompatibilityScorer(synastry, composite);
const compatibility = scorer.calculateOverallScore();

console.log(`Compatibility Score: ${compatibility.overall}`);
console.log(`Interpretation: ${compatibility.interpretation}`);
```

### Guna Milan (Vedic) Compatibility Analysis

```javascript
const { GunaMilanCalculator } = require('./guna-milan-calculator');
const { VedicBirthChartGenerator } = require('./vedic-birth-chart-generator');

// Generate birth charts
const generator = new VedicBirthChartGenerator();
const brideChart = await generator.generateBirthChart(brideBirthData);
const groomChart = await generator.generateBirthChart(groomBirthData);

// Calculate Guna Milan compatibility
const gunaMilan = new GunaMilanCalculator();
const compatibility = gunaMilan.calculateCompatibility(brideChart, groomChart);

console.log(`Total Guna Score: ${compatibility.totalScore}/36`);
console.log(`Compatibility Rating: ${compatibility.compatibility}`);
console.log(`Nadi Dosha: ${compatibility.scores.nadi === 0 ? 'Present' : 'Not Present'}`);
```

### API Endpoints

The module integrates with the following API endpoints:

#### Western Astrology Endpoints
- `POST /api/v1/compatibility/synastry` - Calculate synastry compatibility
- `POST /api/v1/compatibility/composite` - Generate composite chart
- `GET /api/v1/compatibility/report/:relationshipId` - Get detailed compatibility report

#### Vedic Astrology Endpoints
- `POST /api/v1/compatibility/guna-milan` - Calculate Guna Milan (Ashtakoota) compatibility
- `GET /api/v1/compatibility/guna-milan/:compatibilityId` - Get Guna Milan analysis report

## Data Structures

### Birth Chart Format

```javascript
{
  ascendant: {
    longitude: 123.45,  // Degrees
    sign: 3,            // 0-11 (Aries-Pisces)
    degree: 23.45       // Degrees within sign
  },
  houses: [0, 30, 60, ...], // 12 house cusps in degrees
  planets: {
    SUN: {
      longitude: 45.67,
      sign: 1,
      degree: 15.67,
      house: 2
    },
    MOON: { /* ... */ },
    // ... other planets
  }
}
```

### Compatibility Result

```javascript
{
  overall: 0.75,        // Overall score (0-1)
  breakdown: {
    synastry: 0.8,      // Synastry score
    overlays: 0.7,      // House overlay score
    composite: 0.7      // Composite chart score
  },
  interpretation: "Good compatibility with positive potential",
  strengths: ["Strong harmonious connections", "..."],
  challenges: ["Some challenging aspects require attention"],
  recommendations: ["Focus on open communication", "..."]
}
```

### Guna Milan Compatibility Result

```javascript
{
  compatibilityId: "uuid",
  bride: {
    nakshatra: "Rohini",
    lord: "MOON",
    sign: 1
  },
  groom: {
    nakshatra: "Uttara Phalguni",
    lord: "SUN",
    sign: 11
  },
  scores: {
    varna: 1,
    vashya: 2,
    tara: 3,
    yoni: 4,
    grahaMaitri: 5,
    gana: 6,
    bhakoot: 7,
    nadi: 8
  },
  totalScore: 36,
  percentage: 100,
  compatibility: "Excellent Match",
  recommendations: [
    {
      type: "Positive",
      message: "Good sexual and physical compatibility indicated."
    }
  ],
  exceptions: [],
  remedies: []
}
```

## Scoring Methodology

### Component Weights

- **Synastry Aspects**: 40% - Planetary interactions between charts
- **House Overlays**: 30% - Planetary placements in partner's houses
- **Composite Aspects**: 30% - Aspects within the relationship entity

### Aspect Scoring

- **Conjunction**: 0.7 (intense connection)
- **Trine**: 0.9 (harmonious flow)
- **Sextile**: 0.8 (supportive energy)
- **Square**: 0.4 (growth opportunities)
- **Opposition**: 0.5 (balance needed)

### Guna Milan (Ashtakoota) Scoring

The Guna Milan system evaluates compatibility across 8 categories with a maximum total score of 36 points:

- **Varna (1 point)**: Social compatibility - 0 or 1 point
- **Vashya (2 points)**: Mutual control/domination - 0, 1, or 2 points
- **Tara (3 points)**: Longevity and prosperity - 0, 1.5, 2, or 3 points
- **Yoni (4 points)**: Sexual compatibility - 0, 2, or 4 points
- **Graha Maitri (5 points)**: Mental compatibility - 0, 0.5, 1, 2.5, or 5 points
- **Gana (6 points)**: Temperament compatibility - 0, 3, or 6 points
- **Bhakoot (7 points)**: Love and prosperity - 0-7 points based on sign difference
- **Nadi (8 points)**: Health and progeny - 0 or 8 points

#### Compatibility Ratings
- **28+ points**: Excellent Match
- **25-27 points**: Very Good Match
- **22-24 points**: Good Match
- **18-21 points**: Average Match - Proceed with Caution
- **15-17 points**: Below Average - Not Recommended
- **<15 points**: Poor Match - Strongly Not Recommended

### House Overlay Scoring

- **1st House**: 0.8 (self-image, important)
- **7th House**: 0.9 (partnership, crucial)
- **4th/10th Houses**: 0.9 (home/career, significant)
- **6th/12th Houses**: 0.4-0.5 (service/spirituality, variable)

## Error Handling

The module uses standardized error handling with the following error types:

- **ValidationError**: Invalid input data (HTTP 400)
- **CalculationError**: Mathematical/computational failures (HTTP 500)

All errors are logged with correlation IDs for debugging and include detailed context information.

## Testing

### Unit Tests

Run the test suite:

```bash
npm test -- --grep "compatibility"
```

### Test Coverage

- Aspect calculation accuracy
- Composite chart generation
- Scoring algorithm validation
- Guna Milan compatibility calculations
- Nakshatra matching logic
- Dosha detection and remedies
- Error handling scenarios
- API endpoint testing

## Performance

### Benchmarks

- **Synastry Analysis**: < 100ms for typical charts
- **Composite Generation**: < 50ms
- **Compatibility Scoring**: < 20ms
- **Guna Milan Analysis**: < 30ms for typical charts
- **Memory Usage**: < 10MB per analysis

### Optimization

- Efficient aspect calculation algorithms
- Cached trigonometric functions
- Minimal object creation in hot paths
- Streaming JSON responses for large datasets

## Dependencies

- `math-utils.js` - Mathematical utilities
- `astro-constants.js` - Astronomical constants
- `house-systems.js` - House calculation functions
- `nakshatra-calculator.js` - Nakshatra calculation utilities
- `errors.js` - Error handling framework
- `logger.js` - Logging system

## Configuration

The module uses environment variables for configuration:

- `COMPATIBILITY_CACHE_TTL` - Cache timeout (default: 3600s)
- `COMPATIBILITY_MAX_CONCURRENT` - Max concurrent analyses (default: 10)
- `COMPATIBILITY_ASPECT_ORBS` - Custom aspect orbs (optional)

## Security Considerations

- Input validation for all chart data
- Rate limiting on API endpoints
- No storage of personal birth data
- Secure error message handling
- Audit logging for sensitive operations

## Future Enhancements

- **Advanced Aspects**: Minor aspects (quincunx, semisquare)
- **Synodic Cycles**: Relationship timing analysis
- **Progressed Charts**: Time-based compatibility evolution
- **Solar Arc Directions**: Long-term relationship forecasting
- **Machine Learning**: Pattern recognition in successful relationships

## API Reference

### SynastryAnalyzer

#### `constructor(chart1, chart2)`
Creates a new synastry analyzer instance.

#### `calculateSynastryAspects()`
Returns array of planetary aspects between charts.

#### `calculateHouseOverlays()`
Returns array of house overlay information.

#### `analyzeSynastry()`
Performs complete synastry analysis.

### CompositeChartGenerator

#### `constructor(chart1, chart2)`
Creates a new composite chart generator.

#### `generateCompositeChart()`
Returns complete composite chart object.

#### `calculateCompositeAscendant()`
Returns composite ascendant longitude.

### CompatibilityScorer

#### `constructor(synastryData, compositeData)`
Creates a new compatibility scorer.

#### `calculateOverallScore()`
Returns overall compatibility analysis.

#### `getDetailedReport()`
Returns comprehensive compatibility report.

### GunaMilanCalculator

#### `constructor()`
Creates a new Guna Milan calculator instance.

#### `calculateCompatibility(brideChart, groomChart)`
Calculates complete Guna Milan compatibility analysis.

**Parameters:**
- `brideChart` (Object): Bride's birth chart with Moon nakshatra details
- `groomChart` (Object): Groom's birth chart with Moon nakshatra details

**Returns:** Complete compatibility report with scores, recommendations, and remedies

#### `calculateVarna(brideNakshatra, groomNakshatra)`
Calculates Varna compatibility (0 or 1 point).

#### `calculateVashya(brideNakshatra, groomNakshatra)`
Calculates Vashya compatibility (0, 1, or 2 points).

#### `calculateTara(brideNakshatra, groomNakshatra)`
Calculates Tara compatibility (0, 1.5, 2, or 3 points).

#### `calculateYoni(brideNakshatra, groomNakshatra)`
Calculates Yoni compatibility (0, 2, or 4 points).

#### `calculateGrahaMaitri(brideNakshatra, groomNakshatra)`
Calculates Graha Maitri compatibility (0, 0.5, 1, 2.5, or 5 points).

#### `calculateGana(brideNakshatra, groomNakshatra)`
Calculates Gana compatibility (0, 3, or 6 points).

#### `calculateBhakoot(brideNakshatra, groomNakshatra)`
Calculates Bhakoot compatibility (0-7 points).

#### `calculateNadi(brideNakshatra, groomNakshatra)`
Calculates Nadi compatibility (0 or 8 points).

## Troubleshooting

### Common Issues

1. **Invalid Chart Data**
   - Ensure charts contain required `planets` and `houses` arrays
   - Verify longitude values are numeric and within 0-360°

2. **Performance Issues**
   - Check for large numbers of aspects (>100)
   - Verify cache configuration
   - Monitor memory usage

3. **Scoring Inconsistencies**
   - Validate aspect calculations
   - Check weight configurations
   - Review custom scoring rules

### Debug Mode

Enable debug logging:

```javascript
process.env.COMPATIBILITY_DEBUG = 'true';
```

This provides detailed logging of calculations and decision points.

## Contributing

When contributing to the compatibility module:

1. Follow existing code style and patterns
2. Add comprehensive unit tests
3. Update documentation for new features
4. Ensure backward compatibility
5. Test with various chart combinations

## License

This module is part of the ZodiaCore astrology system and follows the same MIT license terms.