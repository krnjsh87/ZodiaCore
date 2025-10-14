# ZodiaCore Documentation

## Overview

ZodiaCore is a comprehensive, enterprise-grade astrology platform built with a microservices architecture. This documentation provides complete technical guidance for understanding, developing, and deploying the ZodiaCore system.

## Documentation Structure

### Core Documentation
- **[Architecture Overview](architecture.md)** - System architecture, service components, and design principles
- **[Development Setup](development-setup.md)** - Complete setup guide for development environment
- **[API Documentation](api/index.md)** - REST API reference and integration guides

### Component Documentation
- **[Backend Services](../backend/README.md)** - Backend orchestrator and API gateway documentation
- **[Frontend Application](../frontend/README.md)** - React/Next.js frontend documentation
- **[Astrology Services](../services/README.md)** - Microservices for astrology calculations

### Operational Documentation
- **[Production Deployment](production-deployment-pipeline.md)** - Deployment procedures and pipelines
- **[Production Environment Setup](production-environment-setup-procedures.md)** - Production environment configuration
- **[Domain & SSL Configuration](production-domain-ssl-configuration.md)** - Domain and SSL setup
- **[Operations Guide](production-operations-guide.md)** - Production operations and maintenance

### Database & Monitoring
- **[MongoDB Atlas Backup](mongodb-atlas-backup-procedures.md)** - Database backup procedures
- **[Monitoring Setup](../monitoring/README.md)** - Monitoring and observability configuration

## Quick Start

### For Developers
1. **Set up development environment**: Follow the [Development Setup Guide](development-setup.md)
2. **Understand the architecture**: Read the [Architecture Overview](architecture.md)
3. **Explore APIs**: Check the [API Documentation](api/index.md)

### For Operators
1. **Production deployment**: See [Production Deployment Pipeline](production-deployment-pipeline.md)
2. **Environment setup**: Follow [Production Environment Setup](production-environment-setup-procedures.md)
3. **Operations**: Refer to [Operations Guide](production-operations-guide.md)

## Project Structure

```
ZodiaCore/
├── docs/                          # Documentation
│   ├── README.md                 # This file
│   ├── architecture.md           # System architecture
│   ├── development-setup.md      # Development setup
│   ├── api/                      # API documentation
│   └── ...                       # Additional docs
├── backend/                      # Backend orchestrator
├── frontend/                     # Frontend application
├── services/                     # Astrology microservices
├── tests/                        # Testing suite
├── monitoring/                   # Monitoring configuration
└── ...                           # Other directories
```

## Key Features

### Astrology Systems
- **ZC1 Vedic Astrology**: Complete Vedic calculations with 29 specialized services
- **ZC2 Chinese Astrology**: BaZi, Five Elements, and Chinese zodiac analysis
- **ZC3 Western Astrology**: Tropical/Sidereal charts with comprehensive analysis
- **ZC4 Numerology**: Life path, personal cycles, and numerological guidance

### Technical Features
- **Microservices Architecture**: Independent, scalable services
- **API-First Design**: Comprehensive REST APIs with OpenAPI specification
- **Real-time Processing**: Live transit calculations and notifications
- **Multi-system Integration**: Cross-analysis between astrology systems
- **AI-Powered Features**: Machine learning for pattern recognition

## Technology Stack

### Frontend
- React 18+ with Next.js 14+
- TypeScript for type safety
- Tailwind CSS for styling
- D3.js for chart visualizations

### Backend
- Node.js 20.x LTS
- Express.js with TypeScript
- MongoDB Atlas for data storage
- Redis for caching and sessions

### Infrastructure
- Docker containerization
- Kubernetes orchestration
- Render for hosting
- Prometheus/Grafana monitoring

## Development Principles

### Architecture
- **Service Independence**: Each microservice operates autonomously
- **API-First Design**: APIs defined before implementation
- **Failure Isolation**: Circuit breakers prevent cascade failures
- **Scalability**: Horizontal scaling support

### Code Quality
- **Type Safety**: Full TypeScript coverage
- **Testing**: 80%+ test coverage requirement
- **Code Reviews**: Mandatory peer review process
- **Documentation**: Comprehensive technical documentation

### Security
- **Input Validation**: Comprehensive sanitization and validation
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control
- **Data Protection**: Encryption at rest and in transit

## Contributing

### Development Workflow
1. **Setup**: Follow [Development Setup](development-setup.md)
2. **Branching**: Create feature branches from `main`
3. **Coding**: Follow established patterns and standards
4. **Testing**: Ensure all tests pass and coverage maintained
5. **Review**: Submit pull request for code review
6. **Merge**: Approved changes merged to main branch

### Documentation Standards
- Use Markdown for all documentation
- Follow consistent formatting and structure
- Include code examples where applicable
- Keep documentation up-to-date with code changes

## Support & Resources

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community questions and answers
- **Documentation Issues**: Report documentation problems

### Additional Resources
- **[Project README](../README.md)**: High-level project overview
- **[API Playground](https://api.zodiacore.com/docs)**: Interactive API testing
- **[Status Page](https://status.zodiacore.com)**: Service status and incidents

## Version Information

- **Current Version**: ZodiaCore 0.4.0
- **Documentation Version**: 0.4.0
- **Last Updated**: October 2024

---

**Note**: This documentation is continuously updated. For the latest information, always refer to the main repository documentation.