# ZC2 Chinese Astrology Service

## Overview
The ZC2 Chinese Astrology Service is a microservice responsible for all Chinese astrology calculations and predictions. This service follows the DB-first approach and microservices architecture principles, ensuring service independence and scalability.

## Purpose
This service handles traditional Chinese astrology calculations including:
- Chinese zodiac sign determination
- Lunar calendar calculations
- Bazi (Four Pillars of Destiny) analysis
- Feng Shui compatibility
- Yearly fortune predictions
- Elemental balance assessments

## Architecture
- **calculations/**: Core calculation algorithms for Chinese astrology
- **models/**: Database models and schemas for astrology data
- **routes/**: API route definitions for service endpoints
- **utils/**: Utility functions and helper methods

## API Design
Following API-first principles, this service will expose RESTful endpoints for:
- Zodiac sign calculations
- Bazi chart generation
- Compatibility analysis
- Fortune predictions
- Elemental recommendations

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