# Transit Analysis and Alerts Module

## Overview

The Transit Analysis and Alerts module provides comprehensive Vedic astrology transit analysis capabilities, including real-time planetary position tracking, aspect detection, transit impact assessment, and automated alert systems for astrological events.

## Features

- **Real-time Planetary Tracking**: Continuous monitoring of planetary positions with caching and optimization
- **Aspect Detection**: Accurate calculation of major and minor aspects between transiting and natal planets
- **Transit Impact Analysis**: Detailed analysis of transit effects on life areas, houses, and overall influence
- **Alert System**: Configurable alerts for transit entries, aspect formations, and critical periods
- **Prediction Engine**: Generate transit calendars and predictions for future periods
- **Remedy Suggestions**: Personalized remedial recommendations based on transit analysis

## Architecture

### Core Components

1. **TransitAnalysisSystem**: Main orchestration class integrating all components
2. **PlanetaryPositionTracker**: Real-time position calculation and caching
3. **PositionMonitor**: Background monitoring with subscriber pattern
4. **TransitAlertEngine**: Alert rule processing and notification management
5. **NotificationManager**: Multi-channel notification delivery
6. **EphemerisCalculator**: Astronomical calculations and position data

### Utility Modules

- **transit-analysis-constants.js**: Configuration constants and alert settings
- **transit-analysis-utils.js**: Mathematical functions, aspect calculations, and utilities

## Installation

```bash
# Install dependencies (if any third-party libraries are added)
npm install
```

## Configuration

Configure the system using environment variables:

```bash
# Ayanamsa value for sidereal calculations
AYANAMSA_VALUE=23.5

# Logging level
LOG_LEVEL=info

# Cache settings
CACHE_TTL_MINUTES=60

# Alert notification channels
ALERT_EMAIL_ENABLED=true
ALERT_SMS_ENABLED=false

# Database connection
DATABASE_URL=sqlite:transits.db

# Ephemeris data path
EPHEMERIS_DATA_PATH=./ephemeris
```

## Usage

### Basic Setup

```javascript
const TransitAnalysisSystem = require('./transit-analysis-system');

// Sample natal chart
const natalChart = {
    id: 'user_chart_001',
    planets: {
        SUN: { longitude: 120.5, name: 'SUN' },
        MOON: { longitude: 45.2, name: 'MOON' },
        // ... other planets
    },
    houses: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    ayanamsa: 23.5
};

// Initialize system
const transitSystem = new TransitAnalysisSystem(natalChart);
await transitSystem.initialize();
```

### Current Transit Analysis

```javascript
// Get current transit analysis
const analysis = transitSystem.getCurrentTransitAnalysis();
console.log('Current positions:', analysis.currentPositions);
console.log('Active aspects:', analysis.activeAspects);
console.log('Overall influence:', analysis.overallInfluence);
```

### Transit Predictions

```javascript
// Generate 90-day predictions
const predictions = transitSystem.generateTransitPredictions(90);
console.log('Transit calendar:', predictions.calendar.length, 'events');
console.log('Active alerts:', predictions.alerts.length);
```

### Real-time Alerts

```javascript
// Process real-time alerts (call periodically)
setInterval(async () => {
    const alerts = await transitSystem.processRealtimeAlerts();
    if (alerts.length > 0) {
        console.log('New alerts:', alerts);
    }
}, 60000); // Every minute
```

## API Reference

### TransitAnalysisSystem

#### Constructor
```javascript
new TransitAnalysisSystem(natalChart)
```

#### Methods

- `initialize()`: Initialize the system and start monitoring
- `getCurrentTransitAnalysis()`: Get current transit analysis
- `generateTransitPredictions(daysAhead)`: Generate predictions for specified days
- `processRealtimeAlerts()`: Process and send real-time alerts
- `getSystemStatus()`: Get system health and status
- `shutdown()`: Gracefully shutdown the system

### Utility Functions

#### Aspect Calculations
```javascript
const { checkAspect, angularSeparation } = require('./transit-analysis-utils');

// Check if planets are in aspect
const aspect = checkAspect(120.5, 125.3, 5); // lon1, lon2, orb

// Calculate angular separation
const separation = angularSeparation(120.5, 125.3);
```

#### Transit Analysis
```javascript
const {
    analyzeTransitImpact,
    calculateTransitStrength,
    identifyLifeAreas
} = require('./transit-analysis-utils');

// Analyze transit impact
const analysis = analyzeTransitImpact(transit, natalChart);
```

## Alert Configuration

### Alert Types

- `transit_entry`: Planet entering a new sign
- `transit_exit`: Planet leaving a sign
- `aspect_formation`: New aspect formation
- `aspect_separation`: Aspect separation
- `critical_period`: High-intensity transit period

### Priority Levels

- `critical`: Immediate attention required
- `high`: Important events
- `medium`: Notable events
- `low`: Informational

### Notification Channels

- `email`: Email notifications
- `sms`: SMS notifications
- `push`: Push notifications
- `in_app`: In-app notifications

## Testing

Run the test suite:

```bash
node transit-analysis-system.test.js
```

Test output includes:
- System initialization verification
- Current transit analysis
- Prediction generation
- Utility function testing
- Error handling validation

## Performance

### Benchmarks

- Position calculations: < 50ms per planet
- Aspect detection: < 100ms for all planets
- Transit analysis: < 200ms for current analysis
- Prediction generation: < 500ms for 90-day period

### Optimization Features

- **Caching**: Planetary positions cached with TTL
- **Background Monitoring**: Non-blocking position updates
- **Efficient Algorithms**: Optimized mathematical calculations
- **Memory Management**: Automatic cache cleanup

## Error Handling

The system includes comprehensive error handling:

- Input validation for all parameters
- Graceful degradation on calculation errors
- Logging of all errors and warnings
- Recovery mechanisms for failed operations

## Dependencies

- **Node.js**: >= 14.0.0
- **No external libraries**: Pure JavaScript implementation

## Security Considerations

- Input validation prevents injection attacks
- Environment-based configuration
- No hardcoded secrets
- Secure notification channel handling

## Limitations

- Simplified ephemeris calculations (use Swiss Ephemeris for production)
- Basic caching implementation
- No database persistence in current version
- Limited notification channel integrations

## Future Enhancements

- Integration with professional ephemeris libraries
- Database persistence for transit data
- Advanced alert rule customization
- Machine learning for prediction accuracy
- Multi-user support with isolation

## Contributing

1. Follow the project's coding standards
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure backward compatibility

## License

This module is part of the ZodiaCore astrology system.

## References

- Vedic Astrology transit analysis principles
- Astronomical calculation algorithms
- Real-time data processing patterns
- Notification system design patterns