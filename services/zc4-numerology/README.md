# ZC4 Numerology Service

## Overview
The ZC4 Numerology Service is a microservice responsible for all numerology calculations and predictions. This service follows the DB-first approach and microservices architecture principles, ensuring service independence and scalability.

## Purpose
This service handles traditional numerology calculations including:
- Life path number calculations
- Expression number analysis
- Soul urge number determination
- Personality number assessments
- Destiny number predictions
- Name numerology interpretations

## Architecture
- **calculations/**: Core calculation algorithms for numerology
- **models/**: Database models and schemas for numerology data
- **routes/**: API route definitions for service endpoints
- **utils/**: Utility functions and helper methods

## API Design
Following API-first principles, this service will expose RESTful endpoints for:
- Number calculations from birth dates and names
- Numerology chart generation
- Compatibility analysis based on numbers
- Predictive insights from numerological data
- Personalized recommendations

## Dependencies
- Independent database (no shared DB with other services)
- Centralized logging and monitoring
- Circuit breaker pattern for resilience
- Health check endpoints for observability

## Development Rules Compliance
- DB-first approach: Database schema designed before code implementation
- Service independence: No tight coupling with other astrology services
- API-first design: Endpoints documented before implementation
- Security-first: Input validation and secure API design
- Observability: Health checks, metrics, and logging implemented