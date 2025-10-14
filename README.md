# ZodiaCore

## Project Description

ZodiaCore is a comprehensive, enterprise-grade astrology platform built with a microservices architecture. It provides detailed astrological calculations, interpretations, and insights across four major astrology systems: Vedic (ZC1), Chinese (ZC2), Western (ZC3), and Numerology (ZC4). The platform offers over 100 specialized astrology services including birth chart analysis, horoscopes, compatibility assessments, predictive astrology, and advanced features like Yantra practices, Feng Shui remedies, relationship counseling, and AI-powered energy checking.

## Features

### Core Astrology Systems

#### **ZC1 - Vedic Astrology (29 Services)**
- **Birth Chart Generation**: Complete Vedic birth chart with planetary positions, houses, and aspects
- **Dasha & Planetary Transit Calculations**: Mahadasha, Antardasha, and transit analysis
- **Divisional Charts & Vargas**: D1-D60 divisional chart calculations
- **Muhurat/Auspicious Timing Selection**: Wedding, business, and personal muhurats
- **Panchang/Calendar Details**: Tithi, Nakshatra, Yoga, and Karana calculations
- **Horoscopes**: Daily, weekly, monthly, and yearly Vedic horoscopes
- **Solar/Lunar Return Charts**: Annual progression analysis
- **Synastry/Composite Chart Compatibility**: Relationship analysis using Vedic methods
- **Guna Milan (Ashtakoota) Compatibility**: Traditional marriage compatibility scoring
- **Manglik/Nadi/Dosha/Varsha Analysis**: Comprehensive dosha analysis and remedies
- **Lucky Number & Auspicious Timing Generator**: Personalized lucky numbers and timing
- **Medical Astrology Profile**: Health predictions based on planetary positions
- **Astrology for Pets**: Pet birth chart analysis and compatibility
- **Deep Horoscope/Life Interpretation**: Comprehensive life analysis
- **Advanced KP/Nadi/Lal Kitab/Varshaphal Consultation**: Specialized predictive techniques
- **Personalized Dasha/Period Guidance**: Current period analysis and guidance
- **Parenting/Childbirth Astrology**: Conception and child astrology
- **Relationship/Marriage/Compatibility Counseling**: Advanced relationship analysis
- **Personalized Remedy/Mantra/Pooja Prescription**: Customized remedial measures
- **Horary/Prashna Question Answering**: Question-based astrology
- **Astro-cartography Relocation Counseling**: Geographic astrology analysis
- **Career/Finance/Business/Medical Counseling**: Professional guidance
- **Complex Mundane Astrology**: World event predictions
- **Yoga Formation Analysis**: Planetary combination analysis
- **Lal Kitab Karmic Debt Analysis**: Karmic astrology insights
- **Transit Analysis and Alerts**: Real-time planetary transit notifications
- **Yantra Sacred Geometry Recommendations**: Sacred geometry prescriptions
- **Charity and Donation Guidance**: Philanthropic timing and methods
- **Fasting (Vrata) Recommendations**: Spiritual fasting guidance

#### **ZC2 - Chinese Astrology (5 Services)**
- **Chinese Birth Chart Generation**: BaZi, Five Elements, Nine Star Ki analysis
- **Chinese Zodiac Compatibility**: Relationship compatibility analysis
- **Feng Shui Remedies/Guidance**: Space harmonization recommendations
- **Chinese Horoscopes**: Daily, weekly, monthly, yearly predictions
- **Chinese Lunar Calendar Integration**: Traditional Chinese calendar features

#### **ZC3 - Western Astrology (15 Services)**
- **Western Birth Chart Generation**: Tropical/Sidereal chart creation
- **Planetary Positions and Transits**: Real-time planetary tracking
- **Houses System**: Placidus, Equal, and other house systems
- **Aspects and Interpretations**: Planetary relationship analysis
- **Birth Chart Analysis**: Comprehensive chart interpretation
- **Progressive and Transit Predictions**: Future event forecasting
- **Western Horoscopes**: Multi-timeframe horoscopes
- **Solar/Lunar Return Charts**: Annual progression analysis
- **Synastry/Composite Chart Compatibility**: Western relationship analysis
- **Medical, Pet, Deep Horoscope Analysis**: Specialized interpretations
- **Relationship/Marriage Counseling**: Western compatibility methods
- **Career/Finance/Business/Medical Counseling**: Professional guidance

#### **ZC4 - Numerology (3 Services)**
- **Numerology Calculators**: Life Path, Destiny, Soul Urge numbers
- **Personal Year/Month/Day Cycles**: Current period analysis
- **Lucky Number & Auspicious Timing Generator**: Numerological timing

### Advanced Features
- **AI-Powered Energy Checking**: Pendulum dowsing and energy analysis
- **Multi-System Cross-Analysis**: Combined insights from multiple astrology systems
- **Real-time Transit Alerts**: Planetary movement notifications
- **Personalized Recommendations**: AI-driven remedial suggestions
- **Historical Chart Analysis**: Past event correlation with astrological data

## Technology Stack

### Frontend
- **Framework**: React 18+ with Next.js 14+
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: Custom component library with accessibility
- **Charts**: D3.js for astrological visualizations

### Backend
- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js with TypeScript
- **API**: RESTful APIs with OpenAPI 3.0 specification
- **Authentication**: JWT with role-based access control
- **Validation**: Joi/Zod schema validation
- **Documentation**: Swagger/OpenAPI integration

### Services (Microservices)
- **ZC1 Vedic Service**: Node.js/Express with specialized Vedic calculation engines
- **ZC2 Chinese Service**: Node.js/Express with Chinese astrology algorithms
- **ZC3 Western Service**: Node.js/Express with astronomical calculations
- **ZC4 Numerology Service**: Node.js/Express with numerological computations

### Database & Storage
- **Primary Database**: MongoDB Atlas (M0-M10 clusters)
- **Caching**: Redis for performance optimization
- **File Storage**: AWS S3 or compatible for chart images and documents
- **Backup**: Automated MongoDB Atlas backups with point-in-time recovery

### Infrastructure & DevOps
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for development, Kubernetes for production
- **Hosting**: Render (2 environments: production and staging)
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Monitoring**: Prometheus/Grafana stack with custom dashboards
- **Logging**: Centralized logging with correlation IDs
- **Security**: Helmet, CORS, rate limiting, input validation

### Testing & Quality
- **Unit Testing**: Vitest with 80%+ coverage requirement
- **Integration Testing**: API contract testing between services
- **E2E Testing**: Playwright for critical user journeys
- **Performance Testing**: Load testing with Artillery
- **Security Testing**: Automated vulnerability scanning

### Development Tools
- **Version Control**: Git with GitHub
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Documentation**: Markdown with automated generation
- **API Testing**: Postman collections and automated tests

## Architecture Overview

ZodiaCore implements a microservices architecture with clear separation of concerns and service independence:

### Service Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Services      │
│   (Next.js)     │◄──►│   Orchestrator  │◄──►│   (ZC1-ZC4)     │
│                 │    │   (Express)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface│    │   API Gateway   │    │   Calculation   │
│   Components    │    │   & Routing     │    │   Engines       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Design Principles
- **Service Independence**: Each microservice has its own database and can operate independently
- **API-First Design**: All services expose well-documented REST APIs
- **Failure Isolation**: Circuit breakers and retry mechanisms prevent cascade failures
- **Scalability**: Horizontal scaling support through Kubernetes
- **Observability**: Comprehensive logging, metrics, and health checks
- **Security-First**: Input validation, authentication, and authorization at all layers

### Data Architecture
- **Database per Service**: MongoDB collections isolated by service domain
- **Shared Services**: Common entities (users, sessions) in dedicated collections
- **Migration Strategy**: Versioned migrations with rollback capabilities
- **Backup & Recovery**: Automated backups with disaster recovery procedures

## Prerequisites

- **Node.js**: Version 20.x LTS or higher
- **Docker**: Version 24.0+ with Docker Compose
- **Git**: Version 2.30+ for version control
- **MongoDB Atlas**: Free M0 tier account for development
- **Render Account**: Free tier for hosting (2 services: production and staging)

## Installation

### Development Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-org/zodiacore.git
    cd ZodiaCore
    ```

2. **Install root dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    ```bash
    cp .env.example .env
    # Edit .env with your MongoDB Atlas connection string and other configs
    ```

4. **Start development environment**:
    ```bash
    docker-compose up --build
    ```

5. **Access the application**:
    - Frontend: http://localhost:3000
    - API Documentation: http://localhost:3001/api-docs
    - Health Checks: http://localhost:3001/health

### Production Deployment

1. **Set up Render services**:
    - Create two web services (production and staging)
    - Configure environment variables in Render dashboard
    - Set up MongoDB Atlas production cluster

2. **Deploy via GitHub Actions**:
    - Push to main branch triggers production deployment
    - Push to staging branch triggers staging deployment

## Usage

### For Users
1. **Access ZodiaCore**: Navigate to the deployed application URL
2. **Create Account**: Register with email and basic information
3. **Generate Birth Chart**: Enter birth details for personalized analysis
4. **Explore Services**: Access horoscopes, compatibility analysis, and specialized consultations
5. **View Reports**: Download detailed PDF reports and recommendations

### For Developers
1. **API Integration**: Use RESTful APIs documented in `/docs/api/`
2. **Service Communication**: Follow microservice communication patterns
3. **Database Access**: Use MongoDB drivers with connection pooling
4. **Monitoring**: Access Prometheus metrics and Grafana dashboards

## Project Structure

```
ZodiaCore/
├── frontend/                          # Next.js frontend application
│   ├── app/                          # Next.js app router
│   ├── components/                   # Reusable React components
│   ├── lib/                          # Utility functions and configurations
│   ├── services/                     # API service layer
│   ├── types/                        # TypeScript type definitions
│   ├── styles/                       # Global styles and Tailwind config
│   └── public/                       # Static assets
├── backend/                          # Backend orchestrator service
│   ├── src/
│   │   ├── routes/                   # API route handlers
│   │   ├── middleware/               # Express middleware
│   │   ├── services/                 # Business logic services
│   │   ├── models/                   # Database models
│   │   └── utils/                    # Utility functions
│   ├── tests/                        # Backend tests
│   └── Dockerfile                    # Backend container config
├── services/                         # Microservices directory
│   ├── zc1-vedic/                    # Vedic astrology service
│   │   ├── calculations/             # Core calculation algorithms
│   │   ├── models/                   # Service-specific models
│   │   ├── routes/                   # Service API routes
│   │   └── utils/                    # Service utilities
│   ├── zc2-chinese/                  # Chinese astrology service
│   ├── zc3-western/                  # Western astrology service
│   └── zc4-numerology/               # Numerology service
├── docs/                             # Documentation
│   ├── api/                          # API documentation
│   ├── architecture/                 # Architecture docs
│   ├── development-setup/            # Setup guides
│   └── phases/                       # Implementation phases
├── tests/                            # Integration and E2E tests
│   ├── integration/                  # Service integration tests
│   ├── e2e/                          # End-to-end tests
│   └── coverage/                     # Test coverage reports
├── monitoring/                       # Monitoring configuration
│   ├── prometheus/                   # Prometheus configuration
│   └── grafana/                      # Grafana dashboards
├── others/                           # Additional resources
│   ├── docs/                         # Supplementary documentation
│   ├── references/                   # Research and reference materials
│   └── design/                       # Design assets and mockups
├── .github/                          # GitHub Actions and templates
├── docker-compose.yml                # Development environment
├── render.yaml                       # Production deployment config
├── package.json                      # Root dependencies and scripts
└── README.md                         # This file
```

## Development Workflow

### Contributing

1. **Fork and Clone**:
    ```bash
    git clone https://github.com/your-username/zodiacore.git
    cd ZodiaCore
    git checkout -b feature/your-feature-name
    ```

2. **Development Setup**:
    ```bash
    npm install
    docker-compose up -d mongodb redis
    npm run dev
    ```

3. **Code Standards**:
    - Follow ESLint and Prettier configurations
    - Write comprehensive tests (minimum 80% coverage)
    - Add JSDoc comments for all functions
    - Follow conventional commit messages

4. **Testing**:
    ```bash
    npm test                    # Run all tests
    npm run test:coverage      # Generate coverage report
    npm run test:integration   # Run integration tests
    ```

5. **Submit Pull Request**:
    - Ensure all tests pass
    - Update documentation if needed
    - Request code review from maintainers

### Development Guidelines

- **Code Quality**: Maintain high standards with automated linting and testing
- **Documentation**: Update docs for any API changes or new features
- **Security**: Follow security-first principles with input validation and sanitization
- **Performance**: Optimize calculations and implement caching strategies
- **Testing**: Write tests for all new features and bug fixes
- **Reviews**: All code changes require peer review before merging

### Branching Strategy

- `main`: Production-ready code, automatically deployed to production
- `staging`: Integration branch, deployed to staging environment
- `feature/*`: Feature branches for new development
- `hotfix/*`: Emergency fixes for production issues

## API Documentation

Comprehensive API documentation is available in `/docs/api/` with:
- OpenAPI 3.0 specifications
- Interactive Swagger UI
- Postman collections
- Authentication and authorization guides

## Monitoring & Observability

- **Health Checks**: `/health` endpoints for all services
- **Metrics**: Prometheus-compatible metrics for latency, throughput, errors
- **Logging**: Structured logging with correlation IDs
- **Dashboards**: Grafana dashboards for real-time monitoring
- **Alerts**: Automated alerting for service degradation

## Security

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Comprehensive input sanitization and validation
- **Rate Limiting**: DDoS protection and abuse prevention
- **Audit Logging**: Complete audit trails for sensitive operations

## Performance

- **Caching**: Redis caching for frequently accessed calculations
- **Optimization**: Query optimization and indexing in MongoDB
- **Compression**: Response compression for API payloads
- **Load Balancing**: Horizontal scaling support
- **CDN**: Static asset delivery optimization

## Deployment

### Environments
- **Development**: Local Docker Compose setup
- **Staging**: Render staging environment for testing
- **Production**: Render production environment with monitoring

### CI/CD Pipeline
- **Automated Testing**: Runs on every push
- **Security Scanning**: Vulnerability checks in CI
- **Deployment**: Automated deployment to staging/production
- **Rollback**: One-click rollback capabilities

## Troubleshooting

Common issues and solutions are documented in `/docs/troubleshooting.md`. For additional support:
- Check the GitHub Issues for known problems
- Review the FAQ in `/docs/faq.md`
- Contact the development team through GitHub Discussions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Ethical Considerations

ZodiaCore is designed for entertainment and educational purposes. While astrology can provide insights and guidance, it should not replace professional advice in health, finance, legal, or personal matters. Users should consult qualified professionals for important decisions.

## Contact Information

- **GitHub Issues**: [Report bugs and request features](https://github.com/your-org/zodiacore/issues)
- **Discussions**: [Community discussions](https://github.com/your-org/zodiacore/discussions)
- **Email**: Contact the development team through GitHub

---

**Disclaimer**: ZodiaCore provides astrological information for entertainment purposes only. The accuracy and reliability of astrological predictions cannot be guaranteed. Always use professional judgment for important life decisions.