# Services Directory

## Overview

The `services/` directory contains the microservices architecture for ZodiaCore's astrology calculation engines. Each service is independently deployable, maintains its own database, and provides specialized astrology calculations for different systems: Vedic (ZC1), Chinese (ZC2), Western (ZC3), and Numerology (ZC4).

## Architecture

The services follow a microservices pattern with clear boundaries and responsibilities:

```
services/
├── zc1-vedic/                    # Vedic Astrology Service
│   ├── calculations/             # Core calculation algorithms
│   ├── models/                   # Data models and schemas
│   ├── routes/                   # API route handlers
│   ├── utils/                    # Utility functions
│   ├── Dockerfile                # Container configuration
│   └── README.md                 # Service documentation
├── zc2-chinese/                  # Chinese Astrology Service
├── zc3-western/                  # Western Astrology Service
├── zc4-numerology/               # Numerology Service
├── vedic-service/                # Legacy Vedic service (being phased out)
├── chinese-service/              # Legacy Chinese service (being phased out)
├── western-service/              # Legacy Western service (being phased out)
└── mundane-service/              # Specialized mundane astrology service
```

## Service Principles

### Service Independence
- **Isolated Databases**: Each service maintains its own MongoDB collections
- **Independent Deployment**: Services can be deployed, scaled, and updated independently
- **API Contracts**: Well-defined REST APIs with versioning
- **Failure Isolation**: Service failures don't cascade to other services

### Service Responsibilities
- **Calculation Logic**: Core astrology algorithms and computations
- **Data Persistence**: Service-specific data storage and retrieval
- **API Endpoints**: RESTful APIs for calculations and data access
- **Health Monitoring**: Service health checks and metrics

## Core Services

### ZC1 Vedic Service (`zc1-vedic/`)
**Purpose**: Complete Vedic astrology calculations and interpretations

**Key Features**:
- Birth chart generation with planetary positions
- Dasha and planetary transit calculations
- Divisional chart analysis (D1-D60 Vargas)
- Muhurat (auspicious timing) calculations
- Panchang (calendar) details
- Horoscope generation across timeframes
- Compatibility analysis (Guna Milan, Ashtakoota)
- Dosha analysis (Manglik, Nadi, etc.)
- Medical astrology interpretations
- Remedial recommendations (Mantras, Yantras, Pooja)

**API Endpoints**: `/api/v1/zc1/*`

### ZC2 Chinese Service (`zc2-chinese/`)
**Purpose**: Chinese astrology and BaZi calculations

**Key Features**:
- BaZi (Four Pillars) analysis
- Five Elements and Ten Heavenly Stems calculations
- Nine Star Ki (Flying Star) analysis
- Chinese zodiac compatibility
- Feng Shui remedies and recommendations
- Lunar calendar integrations
- Chinese horoscope generation

**API Endpoints**: `/api/v1/zc2/*`

### ZC3 Western Service (`zc3-western/`)
**Purpose**: Western astrology computations

**Key Features**:
- Tropical/Sidereal birth chart generation
- Planetary position calculations
- House system calculations (Placidus, Equal, etc.)
- Aspect analysis and interpretations
- Birth chart analysis
- Transit and progression calculations
- Western horoscopes
- Synastry and composite chart analysis
- Medical astrology interpretations

**API Endpoints**: `/api/v1/zc3/*`

### ZC4 Numerology Service (`zc4-numerology/`)
**Purpose**: Numerological calculations and analysis

**Key Features**:
- Life Path number calculations
- Destiny and Soul Urge numbers
- Personal year/month/day cycle analysis
- Lucky number generation
- Auspicious timing based on numerology
- Name and birth date analysis

**API Endpoints**: `/api/v1/zc4/*`

## Specialized Services

### Mundane Service (`mundane-service/`)
**Purpose**: World astrology and mundane predictions

**Key Features**:
- National and international event predictions
- Political astrology analysis
- Economic trend forecasting
- Natural disaster predictions
- World transit analysis

## Service Structure

Each service follows a consistent internal structure:

### Calculations (`calculations/`)
- Core algorithmic implementations
- Mathematical formulas and calculations
- Astronomical computations
- Data processing logic

### Models (`models/`)
- MongoDB schema definitions
- Data validation rules
- Model relationships and indexes

### Routes (`routes/`)
- Express route handlers
- Input validation middleware
- Response formatting
- Error handling

### Utils (`utils/`)
- Helper functions
- Data transformation utilities
- Calculation helpers
- Configuration utilities

## Technology Stack

### Runtime & Framework
- **Node.js**: 20.x LTS for consistent runtime
- **Express.js**: RESTful API framework
- **TypeScript**: Type safety and better developer experience

### Database & Storage
- **MongoDB Atlas**: Cloud-hosted document database
- **Mongoose**: ODM for data modeling and validation
- **Redis**: Caching and session storage (shared)

### Development Tools
- **Docker**: Containerization for consistent environments
- **Vitest**: Unit testing framework
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting

## API Design Principles

### RESTful Design
- Resource-based URL structure
- HTTP methods for CRUD operations
- Consistent response formats
- Proper HTTP status codes

### Request/Response Format
```json
// Request
{
  "userId": "string",
  "birthData": {
    "date": "YYYY-MM-DD",
    "time": "HH:mm:ss",
    "latitude": number,
    "longitude": number,
    "timezone": "string"
  },
  "calculationType": "string"
}

// Response
{
  "success": true,
  "data": {
    // Service-specific result data
  },
  "metadata": {
    "calculationTime": number,
    "cached": boolean,
    "version": "string"
  }
}
```

### Error Handling
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid birth date format",
    "details": {
      "field": "birthData.date",
      "expected": "YYYY-MM-DD"
    }
  }
}
```

## Data Management

### Database Design
- **Collection Isolation**: Each service has dedicated collections
- **Indexing Strategy**: Optimized indexes for query performance
- **Data Validation**: Schema validation at database level
- **Migration Support**: Versioned schema migrations

### Caching Strategy
- **Redis Integration**: Shared Redis instance for caching
- **Calculation Results**: Cache expensive calculations (24-48 hours)
- **Metadata Caching**: Cache frequently accessed reference data
- **Cache Invalidation**: Proper cache invalidation on data updates

## Performance Optimization

### Calculation Optimization
- **Algorithm Efficiency**: Optimized mathematical calculations
- **Memory Management**: Efficient memory usage for large datasets
- **Concurrent Processing**: Parallel calculation processing where applicable
- **Result Caching**: Cache results to reduce redundant calculations

### Database Optimization
- **Query Optimization**: Efficient MongoDB queries with proper indexing
- **Connection Pooling**: Mongoose connection pooling
- **Read/Write Separation**: Separate read and write concerns
- **Aggregation Pipelines**: Efficient data aggregation

## Testing Strategy

### Unit Testing
- Calculation algorithm testing
- Utility function testing
- Model validation testing
- Route handler testing

### Integration Testing
- API endpoint testing
- Database integration testing
- Service communication testing
- Cache integration testing

### Performance Testing
- Load testing for calculations
- Memory usage testing
- Response time benchmarking
- Concurrent user simulation

## Deployment & Scaling

### Containerization
- **Docker Images**: Multi-stage builds for optimization
- **Environment Consistency**: Same runtime across environments
- **Resource Limits**: CPU and memory limits per service
- **Health Checks**: Container health monitoring

### Scaling Strategy
- **Horizontal Scaling**: Multiple instances behind load balancer
- **Service Discovery**: Dynamic service registration
- **Load Balancing**: Request distribution across instances
- **Auto-scaling**: Kubernetes HPA for demand-based scaling

## Monitoring & Observability

### Health Endpoints
- **Service Health**: `/health` endpoint for service status
- **Dependency Health**: Database and cache connectivity checks
- **Calculation Health**: Sample calculation validation

### Metrics Collection
- **Performance Metrics**: Response times and throughput
- **Error Metrics**: Error rates and types
- **Resource Metrics**: CPU, memory, and disk usage
- **Business Metrics**: Calculation requests and user patterns

### Logging Strategy
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Centralized Logging**: Aggregated logging for analysis
- **Audit Logging**: Security and compliance logging

## Security Considerations

### API Security
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Request throttling and abuse prevention
- **Authentication**: JWT token validation
- **Authorization**: Service-level access control

### Data Security
- **Encryption**: Data encryption at rest and in transit
- **Access Control**: Database-level access restrictions
- **Audit Trails**: Complete audit logging for sensitive operations
- **Data Sanitization**: Input data cleaning and validation

## Development Workflow

### Service Development
1. **Create Service Structure**: Follow standard directory layout
2. **Implement Calculations**: Core algorithms and logic
3. **Define Models**: Database schemas and validation
4. **Create Routes**: API endpoints and handlers
5. **Add Tests**: Comprehensive test coverage
6. **Containerize**: Docker configuration
7. **Document**: API documentation and README

### Service Updates
1. **Version Control**: API versioning for backward compatibility
2. **Migration Planning**: Database migration scripts
3. **Testing**: Full regression testing
4. **Deployment**: Rolling deployment strategy
5. **Monitoring**: Post-deployment monitoring and validation

## Service Communication

### Inter-Service Communication
- **HTTP APIs**: RESTful communication between services
- **Shared Cache**: Redis for shared data and coordination
- **Event-Driven**: Asynchronous communication for complex operations
- **Service Mesh**: Future implementation for advanced routing

### External Integrations
- **Backend Orchestrator**: Primary communication through backend service
- **Database Access**: Direct MongoDB Atlas access
- **Cache Access**: Shared Redis instance
- **Monitoring**: Centralized monitoring and logging

## Future Enhancements

### Advanced Features
- **Real-time Calculations**: WebSocket support for live updates
- **Machine Learning**: AI-powered pattern recognition
- **Advanced Caching**: Predictive caching strategies
- **Service Mesh**: Istio integration for traffic management

### Performance Improvements
- **WebAssembly**: Heavy calculations in WebAssembly
- **Edge Computing**: Computation closer to users
- **GraphQL**: Alternative API for complex queries
- **Streaming**: Real-time data streaming

### Operational Improvements
- **Auto-scaling**: Advanced scaling based on predictive analytics
- **Multi-region**: Global deployment with data replication
- **Advanced Monitoring**: AI-powered anomaly detection
- **Service Mesh**: Advanced service communication patterns