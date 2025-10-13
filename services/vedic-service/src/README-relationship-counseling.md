# ZodiaCore Relationship Counseling System (ZC1.18)

## Overview

The Relationship Counseling System provides comprehensive Vedic astrology-based guidance for couples and individuals seeking to understand and improve their relationships. This system integrates synastry analysis, composite chart interpretations, and Guna Milan compatibility assessments to deliver personalized counseling services.

## Features

- **Multi-System Compatibility Analysis**: Integrates synastry, composite charts, and Guna Milan for holistic relationship assessment
- **AI-Powered Interpretation**: Intelligent analysis of relationship dynamics across communication, emotional, intimacy, and conflict resolution areas
- **Personalized Remedial Measures**: Tailored spiritual, astrological, and behavioral remedies based on identified challenges
- **Structured Counseling Sessions**: Multi-stage counseling process with progress tracking and milestone management
- **Comprehensive Reporting**: Detailed counseling reports with actionable recommendations and long-term outlook

## Architecture

### Core Components

1. **RelationshipCounselor** - Main orchestration engine
2. **CounselingInterpretationEngine** - AI-powered insights generation
3. **RemedyGenerator** - Personalized remedial measures creation
4. **CounselingSessionManager** - Session lifecycle management
5. **RelationshipCounselingAPI** - REST API endpoints

### Data Flow

```
Client Request → Compatibility Analysis Integration
    ↓
Relationship Dynamics Analysis
    ↓
Counseling Insights Generation
    ↓
Recommendations & Remedies Creation
    ↓
Session Management & Progress Tracking
    ↓
Comprehensive Counseling Report Generation
    ↓
Client Response with Actionable Guidance
```

## Installation & Setup

### Dependencies

The relationship counseling system requires the following existing ZodiaCore modules:

- `synastry-analyzer.js` - Synastry chart analysis
- `composite-chart-generator.js` - Composite chart generation
- `guna-milan-calculator.js` - Guna Milan compatibility calculation
- `relationship-counseling-constants.js` - System constants and templates
- `errors.js` - Error handling utilities
- `logger.js` - Logging utilities

### Database Setup

Execute the SQL schema in `relationship-counseling-schema.sql` to create the required database tables:

```sql
-- Execute the contents of relationship-counseling-schema.sql
```

### Environment Configuration

Set the following environment variables:

```bash
# Database connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zodiacore
DB_USER=zodiacore_user
DB_PASSWORD=your_secure_password

# Counseling system settings
COUNSELING_MAX_RETRIES=3
COUNSELING_ENABLE_LOGGING=true
COUNSELING_SESSION_TIMEOUT=3600000
```

## Usage

### Basic Counseling Session

```javascript
const RelationshipCounselor = require('./relationship-counselor');

// Initialize counselor
const counselor = new RelationshipCounselor({
    enableLogging: true,
    maxRetries: 3
});

// Conduct counseling session
const result = await counselor.conductCounselingSession(
    partner1Chart,  // Birth chart with moonDetails.nakshatra
    partner2Chart,  // Birth chart with moonDetails.nakshatra
    {
        clientId: 'client-123',
        partnerId: 'partner-456',
        relationshipType: 'marriage',
        goals: ['improve_communication', 'resolve_conflicts']
    }
);

console.log('Counseling Report:', result.counselingReport);
```

### Session Management

```javascript
const CounselingSessionManager = require('./counseling-session-manager');

const sessionManager = new CounselingSessionManager();

// Create new session
const session = sessionManager.createCounselingSession(
    { clientId: 'client-123', partnerId: 'partner-456' },
    compatibilityData
);

// Update session progress
const updatedSession = sessionManager.updateSessionProgress(
    session,
    'assessment',
    { completed: true, data: assessmentResults }
);

// Add action items
const sessionWithActions = sessionManager.addActionItems(session, [
    { description: 'Practice active listening', priority: 'high' },
    { description: 'Schedule weekly check-ins', priority: 'medium' }
]);
```

### Remedy Generation

```javascript
const RemedyGenerator = require('./remedy-generator');

const remedyGenerator = new RemedyGenerator();

// Generate remedies based on priorities
const remedies = remedyGenerator.generateRemedies(
    counselingInsights,
    [
        { area: 'communication', priority: 'high' },
        { area: 'emotional', priority: 'critical' }
    ]
);

console.log('Immediate Remedies:', remedies.immediate);
console.log('Short-term Remedies:', remedies.shortTerm);
console.log('Long-term Remedies:', remedies.longTerm);
```

## API Endpoints

### Initiate Counseling Session

```http
POST /api/v1/counseling/relationship
Content-Type: application/json

{
    "clientId": "uuid",
    "partnerId": "uuid",
    "chart1": { /* birth chart data */ },
    "chart2": { /* birth chart data */ },
    "sessionContext": {
        "relationshipType": "marriage",
        "duration": "2_years",
        "currentIssues": ["communication", "emotional"],
        "goals": ["improve_harmony", "resolve_conflicts"]
    }
}
```

### Get Session Details

```http
GET /api/v1/counseling/relationship/:sessionId
```

### Update Session Progress

```http
PUT /api/v1/counseling/relationship/:sessionId
Content-Type: application/json

{
    "stage": "analysis",
    "data": { /* stage-specific data */ },
    "notes": "Session notes"
}
```

### Generate Counseling Report

```http
GET /api/v1/counseling/relationship/:sessionId/report
```

### Get Remedial Measures

```http
GET /api/v1/counseling/remedies?issues=communication,emotional
```

## Configuration Options

### RelationshipCounselor Options

- `enableLogging` (boolean): Enable/disable logging. Default: `true`
- `maxRetries` (number): Maximum retry attempts for failed operations. Default: `3`
- `enableDetailedAnalysis` (boolean): Include detailed analysis in reports. Default: `true`

### CounselingInterpretationEngine Options

- `enableDetailedAnalysis` (boolean): Generate detailed analysis. Default: `false`
- `includeTimingAnalysis` (boolean): Include timing considerations. Default: `true`

## Compatibility Analysis

The system integrates three primary compatibility analysis methods:

### 1. Synastry Analysis
- Planetary aspects between charts
- House overlays and placements
- Relationship dynamics interpretation

### 2. Composite Chart Analysis
- Midpoint calculations between planets
- Composite house systems
- Relationship purpose and challenges

### 3. Guna Milan (Ashtakoota)
- 36-point compatibility scoring
- 8 traditional categories (Varna, Vashya, Tara, Yoni, etc.)
- Remedial measures for doshas

## Counseling Process

### Session Stages

1. **Assessment** - Initial compatibility analysis
2. **Analysis** - Detailed relationship dynamics evaluation
3. **Recommendations** - Generate personalized remedies and advice
4. **Implementation** - Action plan creation and tracking
5. **Followup** - Progress monitoring and outcome assessment

### Priority Levels

- **Critical**: Major issues requiring immediate attention
- **High**: Significant challenges needing focused effort
- **Medium**: Moderate issues with some guidance helpful
- **Low**: Strong areas with minimal counseling needed

## Remedial Measures

### Categories

- **Spiritual**: Mantras, prayers, and rituals
- **Astrological**: Gemstones, planetary worship
- **Ceremonial**: Rituals and ceremonies
- **Behavioral**: Communication exercises, practices

### Timeframes

- **Immediate**: Actions to start within 24 hours
- **Short-term**: 1-4 weeks implementation
- **Long-term**: 3-12 months development
- **Preventive**: Ongoing maintenance practices

## Error Handling

The system implements comprehensive error handling:

- **ValidationError**: Input validation failures
- **CalculationError**: Analysis computation errors
- **System failures**: Graceful degradation with partial results

## Testing

Run the comprehensive test suite:

```bash
npm test -- relationship-counseling.test.js
```

Test coverage includes:
- Unit tests for all components
- Integration tests for complete workflows
- Performance tests for response times
- Error handling and edge case testing

## Performance Considerations

- **Response Time**: Counseling reports generated within 5 seconds
- **Concurrent Sessions**: Supports multiple simultaneous sessions
- **Memory Usage**: Efficient data structures and cleanup
- **Database Optimization**: Indexed queries for fast retrieval

## Security & Privacy

- **Data Encryption**: Sensitive chart data encrypted at rest
- **Access Control**: Session-based authentication and authorization
- **Audit Logging**: All counseling interactions logged for compliance
- **Data Retention**: Configurable data retention policies

## Ethical Considerations

- **Cultural Sensitivity**: Respect for Vedic astrology traditions
- **Professional Boundaries**: Clear separation between astrology and therapy
- **Informed Consent**: Transparent communication about system limitations
- **Referral Protocols**: Guidelines for referring to professional counselors

## Limitations

- **Astrological Expertise**: Requires proper astrological knowledge for interpretation
- **Cultural Context**: Primarily designed for Vedic astrology framework
- **Professional Advice**: Not a substitute for licensed counseling or therapy
- **Data Accuracy**: Dependent on accurate birth chart and nakshatra data

## Future Enhancements

- **Machine Learning Integration**: AI-powered pattern recognition
- **Multi-cultural Support**: Additional astrological traditions
- **Real-time Collaboration**: Multi-user counseling sessions
- **Advanced Analytics**: Relationship trend analysis and predictions

## Support & Maintenance

### Monitoring

- Health check endpoints for system status
- Performance metrics collection
- Error rate monitoring and alerting

### Logging

- Structured logging with correlation IDs
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized log aggregation

### Maintenance

- Regular dependency updates
- Database migration management
- Performance optimization reviews

## Contributing

1. Follow the established coding standards
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure backward compatibility

## License

This module is part of the ZodiaCore astrology platform and follows the same MIT license terms.

## Version History

- **v1.0.0**: Initial implementation with core counseling functionality
- Comprehensive compatibility analysis integration
- Multi-stage session management
- Personalized remedy generation
- REST API endpoints
- Comprehensive test coverage