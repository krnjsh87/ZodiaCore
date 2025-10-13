# ZodiaCore Technology Stack Reference

This document provides a comprehensive overview of the technologies used in the ZodiaCore platform, organized by category. For the initial phase, it prioritizes free-tier options to minimize costs while maintaining functionality. It includes current free technologies and planned paid upgrades for scalability.

## Programming Languages

### JavaScript
- **Version**: ES6+ (modern JavaScript)
- **Purpose**: Primary backend language for astrology calculation engines and services
- **Usage**: Core business logic, API implementations, utility functions
- **Files**: All `.js` files in `src/services/astrology/`

### TypeScript
- **Version**: Latest stable (4.x+)
- **Purpose**: Frontend development and type-safe components
- **Usage**: React components, type definitions, frontend services
- **Files**: All `.tsx` and `.ts` files in `src/frontend/`

## Frameworks & Libraries

### React + Next.js
- **Version**: React 18.x, Next.js 14.x (latest stable)
- **Purpose**: Frontend UI framework with SSR/SSG for SEO and performance
- **Usage**: Component-based architecture for birth charts, horoscopes, and consultation interfaces; rapid UI development with Tailwind CSS
- **Why Chosen**: SEO, SSR/SSG, rapid UI, tokens, global styles
- **Files**: `src/frontend/components/`

### Vitest
- **Version**: Latest stable
- **Purpose**: Modern testing framework for unit and integration tests
- **Usage**: Fast, comprehensive test coverage for astrology calculations and components
- **Why Chosen**: Modern, fast unit & component tests
- **Files**: `package.json`, test files throughout the codebase

## Databases

### MongoDB Atlas (Free M0)
- **Version**: Latest stable
- **Purpose**: Cloud NoSQL database for flexible astrology data storage
- **Usage**:
  - Vedic astrology schemas (ZC1)
  - Chinese astrology schemas (ZC2)
  - Western astrology schemas (ZC3)
  - Numerology schemas (ZC4)
  - User management data
- **Why Chosen**: Free, cloud, easy with Render/Node.js
- **Features**: Flexible document storage, easy integration with Node.js

## Infrastructure & Runtime

### Node.js (Express)
- **Version**: 20.x LTS
- **Purpose**: JavaScript runtime for backend services with Express framework
- **Usage**: Running astrology calculation engines and API servers; popular, async, easy Mongo integration
- **Why Chosen**: Popular, async, easy Mongo integration
- **Configuration**: Environment variables for 12-factor app compliance

### Render, Docker, Docker Compose
- **Version**: Latest stable
- **Purpose**: Hosting and containerization for MVP deployment
- **Usage**: Free hosting for MVP, Docker for dev/prod parity
- **Why Chosen**: Free for MVP, Docker for dev/prod parity
- **Integration**: Container orchestration for development

## DevOps & CI/CD

### Git
- **Purpose**: Version control system
- **Usage**: Source code management with branching strategy (main/develop/feature branches)
- **Integration**: GitHub for collaboration

### GitHub Actions
- **Purpose**: Automated CI/CD for free OSS projects
- **Usage**: Automated testing, linting, security scanning, and deployment
- **Why Chosen**: Free for OSS, auto testing, badge for repo
- **Features**:
  - Automated testing (Vitest)
  - Linting (ESLint)
  - Security scanning
  - Artifact creation
  - Deployment to Render

## Monitoring & Observability

### Prometheus
- **Purpose**: Metrics collection and monitoring
- **Usage**: Collecting application and infrastructure metrics
- **Integration**: Grafana dashboards for visualization

### Grafana
- **Purpose**: Visualization and alerting dashboards
- **Usage**: Real-time monitoring of system performance, business metrics, and alerts

### ELK Stack (Elasticsearch, Logstash, Kibana)
- **Purpose**: Centralized logging and log analysis
- **Usage**:
  - Log aggregation from all microservices
  - Correlation IDs for request tracing
  - Log search and visualization

### Jaeger/OpenTelemetry
- **Purpose**: Distributed tracing
- **Usage**: Tracing requests across microservices for performance analysis

### AlertManager
- **Purpose**: Alert management and notification
- **Integration**: PagerDuty for incident response

## Security & Authentication

### JWT
- **Purpose**: Secure/sessionless authentication
- **Usage**: API authentication and session management
- **Why Chosen**: Secure/sessionless auth

### Brevo
- **Purpose**: Email service for authentication and notifications
- **Usage**: Best free email option for user verification and communications
- **Why Chosen**: Best free email option

## API & Documentation

### OpenAPI/Swagger
- **Purpose**: API documentation and specification
- **Usage**: RESTful API documentation with interactive testing

### RESTful APIs
- **Design**: Resource-based URLs with HTTP methods
- **Versioning**: URL-based versioning (/v1/, /v2/)
- **Features**: Rate limiting, consistent response formats, structured error handling

## Development Tools

### ESLint
- **Purpose**: Code linting and style enforcement
- **Configuration**: Custom rules for JavaScript/TypeScript consistency

### Prettier
- **Purpose**: Code formatting
- **Usage**: Automated code formatting for consistent style

## Ads/Analytics

### Google AdSense, GA4
- **Purpose**: Monetization and analytics
- **Usage**: Highest RPM for ads, instant analytics with Consent Mode v2
- **Why Chosen**: Highest RPM, instant analytics, Consent Mode v2

## Planned Technologies (Paid Upgrades)

### AI/ML Integration
- **Purpose**: Enhanced astrology predictions and pattern recognition
- **Technologies**: TensorFlow.js, Python ML libraries
- **Usage**: Machine learning for personalized recommendations

### Message Queue (Future)
- **Technologies**: RabbitMQ / Apache Kafka
- **Purpose**: Asynchronous processing for heavy calculations
- **Usage**: Background job processing and event-driven architecture

### CDN (Content Delivery Network)
- **Purpose**: Global content delivery and API caching
- **Usage**: Static asset delivery and edge computing

### Multi-Region Deployment
- **Purpose**: Disaster recovery and global scalability
- **Technologies**: Multi-region Kubernetes clusters
- **Features**: Automatic failover and data replication

## Quality Assurance

### Testing Framework
- **Primary**: Vitest, React Testing Library, MSW; Vitest + SuperTest (API); mongodb-memory-server/Testcontainers (data); Playwright (E2E); nice-to-haves: axe-core, Percy/Chromatic, k6, Allure
- **Coverage**: Minimum 80% code coverage required
- **Why Chosen**: Modern, fast unit & component tests; robust API testing; realistic data layer; reliable E2E; optional a11y/visual/perf/reporting
- **Types**: Unit tests, integration tests, contract tests, E2E tests

### Code Quality
- **Reviews**: Mandatory pull request reviews
- **Standards**: ESLint rules, TypeScript strict mode
- **Documentation**: Automated documentation generation

## Compliance & Security

### Data Privacy
- **Standards**: GDPR compliance, data minimization
- **Features**: Consent management, audit logging, data retention policies

### Security Scanning
- **Tools**: Snyk, OWASP ZAP, dependency vulnerability scans
- **Integration**: CI/CD pipeline integration

This technology stack provides a robust foundation for the ZodiaCore platform, prioritizing free-tier options for the initial phase while maintaining scalability, security, and maintainability. The free options enable complex astrology calculations across multiple systems, with clear upgrade paths to paid technologies as the platform grows.