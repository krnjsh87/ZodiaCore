# Divisional Chart Calculator

## Overview

The Divisional Chart Calculator implements Vedic astrology divisional charts (Vargas) for detailed astrological analysis. This module provides accurate calculations for D1-D60 charts based on traditional Vedic principles.

## Features

- **Complete Chart Support**: D1 (Rashi) through D60 (Shashtyamsa) charts
- **Accurate Calculations**: Implements authentic Vedic divisional rules
- **Varga Bala Analysis**: Planetary strength assessment across divisional charts
- **Comprehensive Validation**: Input validation and error handling
- **Performance Optimized**: Efficient calculations with proper normalization

## Installation

This module is part of the ZodiaCore astrology services. Ensure all dependencies are installed:

```bash
npm install
```

## Usage

### Basic Chart Generation

```javascript
const DivisionalChartCalculator = require('./divisional-chart-calculator');

// Initialize calculator
const calculator = new DivisionalChartCalculator();

// Sample planetary positions (sidereal longitudes in degrees)
const positions = {
    SUN: 45.5,    // Taurus
    MOON: 120.3,  // Leo
    MARS: 78.2,   // Gemini
    ASC: 15.7     // Cancer
};

// Generate a specific divisional chart
const navamsaChart = calculator.generateDivisionalChart(positions, 'D9');
console.log(navamsaChart);
// Output: { type: 'D9', name: 'Navamsa Chart', positions: {...}, houses: [...] }
```

### Generate All Charts

```javascript
// Generate all available divisional charts
const allCharts = calculator.generateAllDivisionalCharts(positions);
console.log(allCharts.D10); // Dasamsa (career) chart
console.log(allCharts.D7);  // Saptamsa (children) chart
```

### Varga Bala Analysis

```javascript
// Calculate planetary strength across divisional charts
const birthChart = { planets: positions };
const sunStrength = calculator.calculateVargaBala('SUN', birthChart);
console.log(sunStrength);
// Output: { planet: 'SUN', score: 15.5, percentage: 73.8, strength: 'Good', ... }
```

## API Reference

### Constructor

```javascript
const calculator = new DivisionalChartCalculator();
```

### Methods

#### `generateDivisionalChart(positions, chartType)`

Generates a single divisional chart.

**Parameters:**
- `positions` (Object): Planetary positions as `{ planetName: longitude }`
- `chartType` (String): Chart type ('D1', 'D2', ..., 'D60')

**Returns:** Chart object with positions and houses

**Throws:** `InvalidChartTypeError`, `InvalidLongitudeError`

#### `generateAllDivisionalCharts(positions, correlationId)`

Generates all available divisional charts.

**Parameters:**
- `positions` (Object): Planetary positions
- `correlationId` (String, optional): For logging correlation

**Returns:** Object with all chart types as keys

#### `calculateVargaBala(planet, birthChart)`

Calculates Varga Bala (divisional strength) for a planet.

**Parameters:**
- `planet` (String): Planet name ('SUN', 'MOON', etc.)
- `birthChart` (Object): Complete birth chart data

**Returns:** Strength analysis object

#### `getChartSignificance(chartType)`

Gets significance information for a chart type.

**Parameters:**
- `chartType` (String): Chart type

**Returns:** Significance object with name, areas, etc.

## Chart Types

| Chart | Name | Significance | Key Areas |
|-------|------|-------------|-----------|
| D1 | Rashi | Birth chart | Overall life, personality |
| D2 | Hora | Wealth | Finance, family, speech |
| D3 | Drekkana | Siblings | Courage, short journeys |
| D4 | Chaturthamsa | Fortune | Property, education |
| D7 | Saptamsa | Children | Progeny, creativity |
| D9 | Navamsa | Marriage | Spouse, dharma |
| D10 | Dasamsa | Career | Profession, authority |
| D12 | Dvadasamsa | Parents | Ancestors, spirituality |
| D16 | Shodasamsa | Vehicles | Conveyances, comforts |
| D20 | Vimsamsa | Spirituality | Worship, meditation |
| D24 | Chaturvimsamsa | Education | Learning, knowledge |
| D27 | Saptavimshamsa | Strengths | Health, immunity |
| D30 | Trimshamsa | Evils | Suffering, enemies |
| D40 | Khavedamsa | Auspiciousness | Luck, fortune |
| D45 | Akshavedamsa | Character | Personality, disposition |
| D60 | Shashtiamsa | Karma | Past life, evolution |

## Calculation Rules

### Sign Type Classification

- **Moveable**: Aries, Cancer, Libra, Capricorn
- **Fixed**: Taurus, Leo, Scorpio, Aquarius
- **Dual**: Gemini, Virgo, Sagittarius, Pisces

### Division Formula

For any chart Dn (divisor n):
```
Division Size = 30° / n
Result Degree = (degree % divisionSize) * n
```

### Specific Chart Rules

- **D2 (Hora)**: Odd signs start with Leo, even with Cancer
- **D3 (Drekkana)**: 1st third same sign, 2nd fifth, 3rd ninth
- **D9 (Navamsa)**: Moveable sequential, Fixed +8, Dual +4
- **D10 (Dasamsa)**: Odd sequential, Even +8

## Error Handling

The module uses structured error classes:

- `InvalidChartTypeError`: Unknown chart type
- `InvalidLongitudeError`: Invalid longitude value
- `CalculationError`: Calculation failures
- `DataProcessingError`: Input validation errors

## Testing

Run tests with:

```bash
npm test divisional-chart-calculator.test.js
```

Tests cover:
- All calculation methods
- Input validation
- Error scenarios
- Varga Bala accuracy
- Chart generation

## Dependencies

- `math-utils.js`: Angle normalization utilities
- `divisional-chart-config.js`: Configuration data
- `errors.js`: Custom error classes

## Performance

- O(1) per planet calculation
- Batch processing for multiple charts
- Memory efficient with no external dependencies

## Reference

Based on Vedic astrology principles from classical texts and modern implementations. See `projectdocs/references/zc1_3_divisional_charts_vargas.md` for detailed specifications.

## Contributing

1. Follow existing code patterns
2. Add comprehensive tests
3. Update documentation
4. Ensure backward compatibility

## License

MIT License - see project license file.