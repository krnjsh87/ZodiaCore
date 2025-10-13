# ZC1.21 Astro-Cartography and Relocation Counseling

## Overview

Astro-cartography and relocation counseling are advanced astrological techniques that analyze how planetary influences change based on geographical location. This module provides comprehensive algorithms and APIs for calculating planetary lines, relocation charts, and personalized counseling recommendations.

## Features

- **Planetary Line Calculations**: Generate astro-cartography lines for all planets with conjunction, opposition, square, trine, and sextile aspects
- **Relocation Chart Generation**: Create birth charts for different geographical locations with adjusted houses and angular planets
- **Location Analysis**: Score locations based on planetary influences, relocation factors, and local astrological considerations
- **Counseling Engine**: Generate personalized recommendations for travel, relocation, and life changes
- **Timing Optimization**: Calculate optimal periods for moves and location changes

## Usage

### Basic Astro-Cartography Analysis

```javascript
const { AstroCartographyCalculator } = require('./astro-cartography-calculator');

const birthChart = {
  planets: {
    SUN: { longitude: 120.5, latitude: 0 },
    MOON: { longitude: 45.2, latitude: 0 },
    // ... other planets
  }
};

const calculator = new AstroCartographyCalculator(birthChart);
const lines = calculator.calculateAllLines();
```

### Relocation Chart Generation

```javascript
const { RelocationChartGenerator } = require('./relocation-chart-generator');

const generator = new RelocationChartGenerator(birthChart);
const relocationChart = generator.generateRelocationChart(
  40.7128,  // latitude
  -74.0060, // longitude
  -5        // timezone offset
);
```

### Location Analysis and Counseling

```javascript
const { LocationAnalyzer, CounselingEngine } = require('./location-analyzer');

const analyzer = new LocationAnalyzer(cartographyData, relocationData);
const analysis = analyzer.analyzeLocation(40.7128, -74.0060, 'career');

const counselor = new CounselingEngine();
const recommendations = counselor.generateCounseling(analysis, userProfile);
```

## API Endpoints

### Calculate Astro-Cartography

```http
POST /api/v1/astro-cartography
Content-Type: application/json

{
  "birthChart": {
    "planets": {
      "SUN": {"longitude": 120.5, "latitude": 0},
      "MOON": {"longitude": 45.2, "latitude": 0}
    }
  },
  "options": {
    "includeParallels": true,
    "lineTypes": ["conjunction", "opposition", "trine"],
    "orbSize": 2.0
  }
}
```

### Generate Relocation Chart

```http
POST /api/v1/relocation/chart
Content-Type: application/json

{
  "birthChart": { /* birth chart data */ },
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timezone": -5
  }
}
```

### Analyze Location Compatibility

```http
POST /api/v1/location/analysis
Content-Type: application/json

{
  "birthChart": { /* birth chart data */ },
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "purpose": "career",
  "userProfile": {
    "careerFocus": true,
    "relationshipStatus": "single"
  }
}
```

## Technical Implementation

### Core Classes

- `AstroCartographyCalculator`: Handles planetary line calculations and geographic conversions
- `RelocationChartGenerator`: Generates charts for new locations with adjusted houses
- `LocationAnalyzer`: Analyzes location compatibility using multiple scoring factors
- `CounselingEngine`: Generates personalized recommendations and action plans

### Key Algorithms

#### Planetary Line Calculation
Calculates vertical lines for each planet at their longitude positions, plus aspect lines at 90°, 120°, etc.

#### Geographic Distance Calculation
Uses great circle distance to determine proximity to planetary lines.

#### Location Scoring
Combines line influences (40%), relocation factors (40%), and local factors (20%) for overall compatibility score.

### Data Structures

#### Planetary Line
```javascript
{
  planet: 'SUN',
  type: 'conjunction',
  longitude: 120.5,
  latitude: null,
  influence: 'direct',
  strength: 1.0,
  description: 'Leadership, vitality, recognition'
}
```

#### Relocation Chart
```javascript
{
  originalChart: { /* original birth chart */ },
  relocationLocation: {
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: -5
  },
  ascendant: 120.5,
  houses: [/* 12 house cusps */],
  planets: { /* planets with new house positions */ },
  analysis: {
    houseChanges: { /* planet house changes */ },
    angularPlanets: [ /* planets near angles */ ]
  }
}
```

## Dependencies

- Astronomical calculation utilities (`astronomical-calculations.js`)
- Geographic distance functions (`astrology-utils.js`)
- Counseling interpretation engine (`counseling-interpretation-engine.js`)

## Database Schema

### Key Tables

- `astro_cartography_analyses`: Stores analysis metadata
- `planetary_lines`: Stores calculated planetary lines
- `relocation_analyses`: Stores relocation chart data
- `location_compatibility`: Stores compatibility scores
- `counseling_recommendations`: Stores generated recommendations

## Testing

### Unit Tests
- Line calculation accuracy within 0.1°
- Relocation chart house cusps within 1° accuracy
- Location scores between 0-100 with logical distribution

### Integration Tests
- End-to-end analysis workflows
- API response validation
- Performance testing with multiple locations

### Validation Criteria
- Planetary lines calculated for all traditional planets
- Relocation charts generated for any latitude/longitude
- Counseling recommendations relevant to user profiles
- Timing calculations based on planetary periods

## Examples

### Complete Location Analysis

```javascript
// Input: Birth chart and target location
const analysis = await analyzeLocation({
  birthChart: userBirthChart,
  location: { latitude: 51.5074, longitude: -0.1278 }, // London
  purpose: 'career'
});

// Output: Comprehensive analysis
{
  location: { latitude: 51.5074, longitude: -0.1278, name: 'London' },
  astroCartography: {
    lines: [/* planetary lines */],
    influences: {
      beneficial: [/* strong positive lines */],
      challenging: [/* difficult lines */],
      score: 78
    }
  },
  relocationChart: {
    ascendant: 142.3,
    angularPlanets: ['Mars', 'Saturn'],
    score: 82
  },
  counseling: {
    overallScore: 80,
    recommendations: {
      immediate: ['Focus on leadership opportunities'],
      shortTerm: ['Network in tech industry'],
      longTerm: ['Consider permanent relocation']
    },
    optimalTiming: ['March 2024 - June 2024']
  }
}
```

## Limitations

- Calculations based on geocentric planetary positions
- Local factors limited to latitude/longitude analysis
- Recommendations are interpretive and should be used as guidance, not definitive predictions

## Ethical Considerations

- Provides astrological guidance only, not professional advice
- Users should consult appropriate professionals for major life decisions
- Data privacy maintained through secure birth chart handling
- Fairness ensured through standardized scoring algorithms

## Future Enhancements

- Integration with geomagnetic data
- Cultural factor analysis for different regions
- Historical relocation success tracking
- Machine learning optimization of scoring algorithms