# Feng Shui Remedies and Guidance Engine (ZC2.5)

## Overview

The ZC2.5 Feng Shui Remedies and Guidance Engine provides comprehensive algorithms for energy flow analysis, Bagua map calculations, Five Element remedies, and traditional Chinese geomancy principles. This module implements advanced Feng Shui calculations for property analysis, remedy generation, and personalized guidance.

## Features

- **Bagua Map Analysis**: Eight-directional energy mapping with area-specific remedies
- **Five Element Remedies**: Elemental balance restoration through colors, shapes, and materials
- **Flying Stars Calculations**: Time-based energy flow analysis with annual/monthly charts
- **Compass Direction Analysis**: Precise directional calculations for optimal placement
- **Remedy Effectiveness Scoring**: Weighted algorithms for remedy prioritization
- **Location-Based Guidance**: Property-specific recommendations based on orientation and layout
- **Personalized Integration**: Birth data and personal preferences integration
- **Comprehensive API**: RESTful endpoints for all functionality

## Architecture

### Core Components

- **FengShuiRemediesEngine**: Main orchestration engine
- **BaguaCalculator**: Bagua map analysis and recommendations
- **ElementalAnalyzer**: Five Element balance assessment
- **FlyingStarsCalculator**: Time-based energy calculations
- **RemedyGenerator**: Prioritized remedy generation
- **GuidanceEngine**: Implementation planning and scheduling
- **FengShuiValidator**: Input validation and error handling

### Data Flow

```
Property Data + Personal Data + Timeframe
           ↓
    Comprehensive Analysis
           ↓
    Remedy Generation & Prioritization
           ↓
    Implementation Guidance
           ↓
    API Response
```

## Installation

### Dependencies

- Node.js 14+
- No external dependencies (pure JavaScript implementation)

### Setup

```javascript
const FengShuiRemediesEngine = require('./feng-shui-remedies-engine');

// Initialize engine
const engine = new FengShuiRemediesEngine({
    cacheEnabled: true,
    maxCacheSize: 100
});
```

## Usage

### Basic Usage

```javascript
// Property data
const propertyData = {
    layout: {
        width: 50,
        length: 80,
        floors: 2,
        facingDirection: 45 // Northeast
    },
    location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main St, New York, NY'
    }
};

// Personal data (optional)
const personalData = {
    birthData: {
        year: 1990,
        month: 5,
        day: 15,
        hour: 14
    },
    preferences: {
        budget: 5000,
        style: 'modern'
    }
};

// Timeframe
const timeframe = {
    year: 2025,
    month: 1,
    analysisType: 'annual'
};

// Generate remedies
const result = await engine.generateRemedies(propertyData, personalData, timeframe);

console.log('Analysis:', result.analysis);
console.log('Remedies:', result.remedies);
console.log('Guidance:', result.guidance);
```

### Area-Specific Remedies

```javascript
// Get remedies for specific Bagua area
const wealthRemedies = engine.getRemediesForArea('Xun', 'Wealth & Prosperity');

wealthRemedies.forEach(remedy => {
    console.log(`Remedy: ${remedy.remedy.item}`);
    console.log(`Effectiveness: ${remedy.effectiveness}`);
    console.log(`Placement: ${remedy.placement.area}`);
});
```

### API Usage

```javascript
const express = require('express');
const fengShuiRouter = require('./feng-shui-api');

const app = express();
app.use('/api/feng-shui', fengShuiRouter);

// Endpoints:
// POST /api/feng-shui/generate - Generate complete analysis
// GET /api/feng-shui/area/:area/:aspect - Get area-specific remedies
// PUT /api/feng-shui/update - Update remedies for new conditions
// GET /api/feng-shui/health - Health check
// POST /api/feng-shui/cache/clear - Clear cache (admin)
```

## API Reference

### FengShuiRemediesEngine

#### Constructor Options

- `cacheEnabled` (boolean): Enable result caching (default: true)
- `maxCacheSize` (number): Maximum cached results (default: 100)
- `timeout` (number): Operation timeout in ms (default: 30000)

#### Methods

- `generateRemedies(propertyData, personalData, timeframe)`: Generate complete analysis
- `getRemediesForArea(area, aspect, context)`: Get area-specific remedies
- `updateRemedies(existingRemedies, newConditions)`: Update remedies
- `clearCache()`: Clear result cache
- `getStatistics()`: Get engine statistics

### Input Data Structures

#### Property Data

```javascript
{
    layout: {
        width: number,      // Property width in feet/meters
        length: number,     // Property length
        floors: number,     // Number of floors
        facingDirection: number  // Facing direction in degrees (0-360)
    },
    location: {
        latitude: number,   // Latitude (-90 to 90)
        longitude: number,  // Longitude (-180 to 180)
        address: string     // Optional address
    }
}
```

#### Personal Data

```javascript
{
    birthData: {
        year: number,       // Birth year
        month: number,      // Birth month (1-12)
        day: number,        // Birth day (1-31)
        hour: number        // Birth hour (0-23, optional)
    },
    preferences: {
        budget: number,     // Budget in USD (optional)
        style: string,      // Preferred style (optional)
        colors: string[]    // Preferred colors (optional)
    }
}
```

#### Timeframe

```javascript
{
    year: number,          // Analysis year
    month: number,         // Analysis month (optional)
    day: number,           // Analysis day (optional)
    analysisType: string   // 'annual', 'monthly', or 'daily'
}
```

## Output Data Structures

### Complete Analysis Result

```javascript
{
    propertyData: object,     // Input property data
    personalData: object,     // Input personal data
    timeframe: object,        // Input timeframe
    analysis: {
        bagua: object,        // Bagua map analysis
        elemental: object,    // Five Element analysis
        flyingStars: object,  // Flying Stars analysis
        directional: object,  // Directional energy analysis
        personal: object,     // Personal factor integration
        overall: object       // Overall assessment
    },
    remedies: array,          // Prioritized remedy list
    guidance: {
        implementationPlan: object,
        maintenanceSchedule: object,
        expectedOutcomes: object,
        riskAssessment: object,
        costEstimate: object
    },
    generatedAt: string,      // ISO timestamp
    version: string          // Engine version
}
```

## Technical Specifications

### Performance Benchmarks

- **Basic Property Analysis**: < 500ms generation time
- **Comprehensive Analysis**: < 2 seconds generation time
- **Remedy Generation**: < 1 second for 50 remedies
- **Cache Lookup**: < 50ms average
- **Concurrent Analyses**: Support for 100+ simultaneous calculations
- **Memory Usage**: < 50MB for complete engine with cache

### Accuracy Requirements

- **Compass Calculations**: ±0.1 degrees precision
- **Bagua Area Determination**: 100% accuracy for directional sectors
- **Elemental Compatibility**: ±0.05 score accuracy
- **Flying Stars Positioning**: ±1 star position accuracy
- **Remedy Effectiveness Scoring**: ±0.02 score accuracy
- **Location-based Calculations**: ±0.0001 coordinate precision

### Error Handling

The engine provides comprehensive error handling with custom error classes:

- `FengShuiError`: Base error class
- `ValidationError`: Input validation errors
- `CalculationError`: Mathematical calculation errors
- `DataError`: Data processing errors
- `ConfigurationError`: Configuration errors
- `TimeoutError`: Operation timeout errors
- `ExternalServiceError`: External service errors

## Testing

Run the test suite:

```bash
npm test feng-shui-remedies-engine.test.js
```

Test coverage includes:
- Engine initialization and configuration
- Remedy generation and prioritization
- Cache management
- Input validation
- Error handling
- Utility functions

## Security Considerations

### Authentication & Authorization

- **Basic Authentication**: All API endpoints require HTTP Basic authentication
- **Environment Variables**: Credentials stored in environment variables (FENG_SHUI_API_USERNAME, FENG_SHUI_API_PASSWORD)
- **Rate Limiting**: 10 requests per minute per IP address to prevent abuse
- **Input Validation**: Comprehensive validation and sanitization of all inputs

### Data Protection

- **Input Sanitization**: All string inputs are sanitized to prevent XSS attacks
- **Secure Cache Keys**: SHA-256 hashing for cache key generation
- **No Data Persistence**: Results are cached in memory only, no database storage
- **Error Handling**: Sensitive information not exposed in error messages

### Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with correlation IDs for request tracing
- **Metrics Collection**: Prometheus-compatible metrics for performance monitoring
- **Health Checks**: System health monitoring endpoints
- **Timeout Protection**: 30-second timeout on all operations to prevent resource exhaustion

### Configuration Security

- **Environment Variables**: All configuration moved to environment variables
- **No Hardcoded Secrets**: No credentials or sensitive data in source code
- **Configurable Limits**: Rate limits and cache sizes configurable via environment

## Ethical Considerations

### Cultural Respect

This implementation respects traditional Chinese Feng Shui principles while providing modern algorithmic analysis. All calculations are based on established geomantic frameworks and avoid cultural stereotyping.

### Responsible Interpretation

- Provides probabilistic insights rather than definitive predictions
- Includes comprehensive disclaimers about interpretive nature
- Encourages balanced, holistic approaches to well-being
- Promotes evidence-based decision making alongside traditional wisdom

### Data Privacy

- Processes property layouts and personal birth data securely
- Implements input validation and sanitization
- No data persistence without explicit consent
- Supports anonymized analysis for research purposes

## Limitations

### Technical Limitations

- Simplified Flying Stars calculations (traditional formulas are complex)
- Basic property layout analysis (advanced 3D modeling not included)
- Limited external data integration (weather, geomagnetic fields, etc.)
- No real-time environmental monitoring

### Cultural Limitations

- Focuses on classical Chinese Feng Shui traditions
- May not encompass all regional variations
- Requires consultation with qualified practitioners for complex cases
- Not a substitute for professional architectural or psychological advice

## Future Enhancements

- Integration with astronomical libraries for precise Flying Stars
- 3D property modeling and energy flow simulation
- Real-time environmental data integration
- Multi-cultural geomantic system support
- Machine learning optimization of remedy effectiveness
- Mobile application integration

## References

1. **Classical Feng Shui for Modern Living** - Master Joseph Yu
2. **The Complete Illustrated Guide to Feng Shui** - Lillian Too
3. **Traditional Chinese Geomancy** - Ancient Chinese texts
4. **Bagua: The Ancient Chinese System of Environmental Harmony** - Maya Kaathryn Bohnhoff

## Contributing

When contributing to the Feng Shui engine:

1. Maintain backward compatibility
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Respect cultural accuracy and ethical guidelines
5. Follow established coding standards

## License

This module is part of the ZodiaCore project and follows the project's licensing terms.

## Version History

- **ZC2.5-1.0**: Initial implementation with complete remedy generation and guidance systems
- Comprehensive Bagua map analysis
- Five Element balance calculations
- Flying Stars time-based analysis
- Prioritized remedy generation with effectiveness scoring
- Implementation planning and maintenance scheduling
- RESTful API endpoints
- Comprehensive testing and validation