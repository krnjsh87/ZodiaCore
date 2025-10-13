# ZodiaCore

## Project Description

ZodiaCore is a comprehensive astrology web application built with a microservices architecture. It provides detailed astrological calculations, interpretations, and insights for both Western and Chinese astrology systems. The application offers birth chart analysis, horoscopes, compatibility assessments, predictive astrology, and various specialized features like Yantra practices, Feng Shui remedies, and relationship counseling.

## Features

- **Birth Chart Generation**: Create detailed birth charts for Western and Chinese astrology
- **Horoscopes**: Daily, weekly, monthly, and yearly horoscopes
- **Compatibility Analysis**: Synastry, composite charts, and relationship counseling
- **Predictive Astrology**: Transit analysis, return charts, and life predictions
- **Specialized Services**:
  - Yantra activation and meditation guides
  - Feng Shui remedies
  - BaZi analysis
  - Astro-cartography
  - Medical astrology
  - Pet astrology
- **Multi-System Support**: Western tropical/sidereal and Chinese astrology
- **Microservices Architecture**: Scalable and maintainable service separation

## Technology Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express.js
- **Services**: Microservices architecture with independent services for Chinese and Western astrology
- **Containerization**: Docker, Docker Compose
- **Testing**: Jest, comprehensive test coverage
- **Version Control**: Git
- **Documentation**: Markdown

## Architecture Overview

ZodiaCore follows a microservices architecture with clear separation of concerns:

- **Frontend Service**: React-based user interface
- **Chinese Astrology Service**: Handles all Chinese astrology calculations and interpretations
- **Western Astrology Service**: Manages Western astrology computations and analysis
- **Backend Orchestrator**: Coordinates between services and handles API routing
- **Database Layer**: Independent databases for each service to ensure data isolation

Each microservice is designed for:
- Service independence (no shared databases)
- Failure isolation with circuit breakers
- Scalability through Kubernetes auto-scaling
- API versioning for backward compatibility

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ZodiaCore
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with necessary configuration variables.

4. **Start the application using Docker Compose**:
   ```bash
   docker-compose up --build
   ```

## Usage

1. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

2. **API Endpoints**:
   The backend services expose RESTful APIs for astrology calculations and data retrieval.

3. **Development**:
   - Frontend development: `npm run dev` in the frontend directory
   - Service development: Modify individual service code and rebuild containers

## Project Structure

```
ZodiaCore/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   └── types/            # TypeScript type definitions
├── backend/                  # Backend orchestrator service
├── services/                 # Microservices
│   ├── chinese-service/      # Chinese astrology calculations
│   └── western-service/      # Western astrology calculations
├── tests/                    # Test suites and coverage reports
├── others/                   # Additional documentation and utilities
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the established coding standards and best practices
- Ensure comprehensive test coverage (minimum 80%)
- Update documentation for any new features
- Conduct code reviews for all changes
- Address technical debt proactively

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact Information

For questions, support, or contributions, please contact the development team or create an issue in the repository.

---

**Note**: This application is for entertainment and educational purposes. Astrology interpretations should not replace professional advice in health, finance, or personal matters.