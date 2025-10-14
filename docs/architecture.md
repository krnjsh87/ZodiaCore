# ZodiaCore Architecture Overview

## System Architecture

ZodiaCore implements a microservices architecture designed for scalability, maintainability, and fault tolerance. The system is built around four core astrology calculation engines (ZC1-ZC4) with supporting infrastructure for user management, data persistence, and cross-service communication.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZodiaCore Platform                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Frontend   │    │  Backend    │    │  Services   │         │
│  │  (Next.js)  │◄──►│ Orchestrator│◄──►│  (ZC1-ZC4)  │         │
│  │             │    │  (Express)  │    │             │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Database   │    │   Cache     │    │ Monitoring  │         │
│  │ (MongoDB)   │    │   (Redis)   │    │ (Prometheus)│         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Service Components

### Frontend Service (Next.js)
- **Purpose**: User interface and client-side application
- **Technology**: React 18+, Next.js 14+, TypeScript
- **Responsibilities**:
  - User authentication and session management
  - Astrology chart visualization and rendering
  - Form handling for birth data input
  - Report generation and PDF export
  - Real-time transit notifications
- **Communication**: RESTful API calls to Backend Orchestrator

### Backend Orchestrator (Express.js)
- **Purpose**: API gateway and service coordination
- **Technology**: Node.js 20+, Express.js, TypeScript
- **Responsibilities**:
  - Request routing and load balancing
  - Authentication and authorization middleware
  - Rate limiting and security enforcement
  - Service discovery and health monitoring
  - Response aggregation and error handling
  - API versioning and backward compatibility
- **Communication**: RESTful APIs to all microservices

### ZC1 Vedic Service
- **Purpose**: Complete Vedic astrology calculations
- **Technology**: Node.js, Express.js, specialized calculation libraries
- **Features**: 29 Vedic astrology services including birth charts, dashas, divisional charts, muhurats, horoscopes, compatibility analysis, dosha analysis, and remedial recommendations
- **Database**: Dedicated MongoDB collections for Vedic data
- **API Endpoints**: `/api/v1/zc1/*`

### ZC2 Chinese Service
- **Purpose**: Chinese astrology and BaZi calculations
- **Technology**: Node.js, Express.js, Chinese calendar algorithms
- **Features**: BaZi analysis, Five Elements, Nine Star Ki, Chinese zodiac compatibility, Feng Shui guidance, lunar calendar integration
- **Database**: Dedicated MongoDB collections for Chinese astrology data
- **API Endpoints**: `/api/v1/zc2/*`

### ZC3 Western Service
- **Purpose**: Western astrology computations
- **Technology**: Node.js, Express.js, astronomical calculation libraries
- **Features**: Tropical/Sidereal charts, planetary positions, house systems, aspects analysis, synastry, solar/lunar returns, horoscopes
- **Database**: Dedicated MongoDB collections for Western astrology data
- **API Endpoints**: `/api/v1/zc3/*`

### ZC4 Numerology Service
- **Purpose**: Numerological calculations and analysis
- **Technology**: Node.js, Express.js, numerology algorithms
- **Features**: Life Path numbers, personal cycles, lucky number generation, auspicious timing
- **Database**: Dedicated MongoDB collections for numerology data
- **API Endpoints**: `/api/v1/zc4/*`

## Data Architecture

### Database Design Principles
- **Service Isolation**: Each microservice maintains its own database collections
- **No Shared Databases**: Prevents tight coupling between services
- **Flexible Schemas**: MongoDB's document model supports evolving data structures
- **Indexing Strategy**: Optimized indexes for query performance
- **Migration Management**: Versioned migrations with rollback capabilities

### Core Data Entities

#### User Management
```javascript
{
  _id: ObjectId,
  email: String,
  profile: {
    name: String,
    dateOfBirth: Date,
    placeOfBirth: String,
    coordinates: { lat: Number, lng: Number }
  },
  preferences: {
    astrologySystems: [String],
    notificationSettings: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Astrology Calculations
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  serviceType: String, // 'zc1', 'zc2', 'zc3', 'zc4'
  calculationType: String, // 'birth-chart', 'compatibility', etc.
  input: {
    // Service-specific input parameters
  },
  result: {
    // Calculation results and interpretations
  },
  cached: Boolean,
  expiresAt: Date,
  createdAt: Date
}
```

#### Sessions and Authentication
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  token: String,
  expiresAt: Date,
  ipAddress: String,
  userAgent: String
}
```

## Communication Patterns

### Inter-Service Communication
- **Synchronous**: RESTful HTTP APIs for real-time calculations
- **Asynchronous**: Event-driven patterns for background processing
- **Service Discovery**: Centralized registry for service locations
- **Circuit Breakers**: Fault tolerance and graceful degradation

### API Design Principles
- **RESTful Design**: Resource-based URLs with HTTP methods
- **Versioning**: `/api/v1/` prefix for API versioning
- **Consistent Response Format**: Standardized success/error responses
- **Pagination**: Cursor-based pagination for large result sets
- **Filtering**: Query parameter-based filtering and sorting

### Example API Endpoints

#### Vedic Astrology (ZC1)
```
GET    /api/v1/zc1/birth-chart/:userId
POST   /api/v1/zc1/compatibility
GET    /api/v1/zc1/dasha/:userId
POST   /api/v1/zc1/muhurat
```

#### Chinese Astrology (ZC2)
```
GET    /api/v1/zc2/bazi/:userId
POST   /api/v1/zc2/compatibility
GET    /api/v1/zc2/feng-shui
```

#### Western Astrology (ZC3)
```
GET    /api/v1/zc3/chart/:userId
POST   /api/v1/zc3/transits
GET    /api/v1/zc3/synastry
```

#### Numerology (ZC4)
```
GET    /api/v1/zc4/life-path/:userId
POST   /api/v1/zc4/personal-year
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with refresh token rotation
- **Role-Based Access Control**: User, Premium, Admin roles
- **API Keys**: Service-to-service authentication
- **OAuth Integration**: Social login support (future enhancement)

### Data Protection
- **Encryption at Rest**: MongoDB field-level encryption
- **Encryption in Transit**: TLS 1.3 for all communications
- **Input Validation**: Comprehensive sanitization and validation
- **Rate Limiting**: DDoS protection and abuse prevention

### Security Monitoring
- **Audit Logging**: Complete audit trails for sensitive operations
- **Intrusion Detection**: Automated threat detection
- **Vulnerability Scanning**: Regular security assessments

## Scalability & Performance

### Horizontal Scaling
- **Service Replication**: Multiple instances behind load balancers
- **Database Sharding**: MongoDB sharding for large datasets
- **Caching Strategy**: Redis for frequently accessed calculations
- **CDN Integration**: Static asset delivery optimization

### Performance Optimization
- **Calculation Caching**: Results cached for 24-48 hours
- **Lazy Loading**: Heavy calculations loaded on-demand
- **Query Optimization**: Indexed queries with aggregation pipelines
- **Response Compression**: Gzip compression for API responses

### Monitoring & Metrics
- **Application Metrics**: Response times, error rates, throughput
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Business Metrics**: User engagement, service usage patterns
- **Custom Dashboards**: Grafana visualizations for key metrics

## Deployment Architecture

### Development Environment
```
Local Development
├── Docker Compose
├── Local MongoDB/Redis
├── Hot reload development servers
└── Local testing suites
```

### Staging Environment
```
Render Staging
├── Automated deployments from staging branch
├── Full service replication
├── MongoDB Atlas staging cluster
├── Integration testing environment
└── Performance testing sandbox
```

### Production Environment
```
Render Production
├── Blue-green deployments
├── Auto-scaling based on load
├── MongoDB Atlas production cluster
├── Redis production instance
├── CDN for static assets
└── Comprehensive monitoring
```

## Observability & Monitoring

### Health Checks
- **Service Health**: `/health` endpoints for all services
- **Dependency Checks**: Database and cache connectivity validation
- **Custom Health Metrics**: Service-specific health indicators

### Logging Strategy
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Centralized Aggregation**: Log shipping to centralized service
- **Retention Policies**: Configurable log retention periods

### Alerting & Incident Response
- **Automated Alerts**: Service degradation notifications
- **Escalation Procedures**: Tiered response protocols
- **Incident Playbooks**: Documented response procedures
- **Post-Mortem Analysis**: Incident review and improvement processes

## Disaster Recovery

### Backup Strategy
- **Database Backups**: MongoDB Atlas automated backups
- **Configuration Backups**: Infrastructure as Code versioning
- **Application Backups**: Container images in registry
- **Data Retention**: Configurable backup retention periods

### Recovery Procedures
- **RTO/RPO Targets**: Defined recovery time/point objectives
- **Failover Mechanisms**: Automatic failover for critical services
- **Data Recovery**: Point-in-time recovery capabilities
- **Business Continuity**: Multi-region deployment readiness

## Future Architecture Considerations

### Microservices Evolution
- **Service Mesh**: Istio integration for advanced traffic management
- **Event Streaming**: Apache Kafka for event-driven architecture
- **API Gateway**: Kong or similar for enhanced API management

### Advanced Features
- **AI/ML Integration**: Machine learning for pattern recognition
- **Real-time Features**: WebSocket support for live updates
- **Multi-tenancy**: Organization-based data isolation
- **Internationalization**: Multi-language support

### Scalability Enhancements
- **Kubernetes Migration**: Full container orchestration
- **Global CDN**: Worldwide content delivery
- **Edge Computing**: Computation closer to users
- **Serverless Functions**: Event-driven processing

This architecture provides a solid foundation for ZodiaCore's growth while maintaining the principles of service independence, scalability, and maintainability.