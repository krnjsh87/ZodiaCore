# Backend Directory

## Overview

The `backend/` directory contains the backend orchestrator service for ZodiaCore, built with Node.js and Express.js. This service acts as the central API gateway and coordinates communication between the frontend client and the various astrology microservices (ZC1-ZC4).

## Architecture

The backend orchestrator follows a layered architecture:

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware (auth, validation, etc.)
│   ├── services/        # Business logic and service integrations
│   ├── models/          # Database models and schemas
│   ├── utils/           # Utility functions and helpers
│   ├── config/          # Configuration management
│   └── types/           # TypeScript type definitions
├── tests/               # Unit and integration tests
├── Dockerfile           # Container configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Key Responsibilities

### API Gateway
- **Request Routing**: Routes incoming requests to appropriate microservices
- **Load Balancing**: Distributes requests across service instances
- **Rate Limiting**: Implements API rate limiting and throttling
- **CORS Handling**: Manages cross-origin resource sharing

### Authentication & Authorization
- **JWT Token Management**: Issues and validates JWT tokens
- **Session Handling**: Manages user sessions and refresh tokens
- **Role-Based Access Control**: Enforces user permissions and roles
- **API Key Management**: Handles service-to-service authentication

### Service Orchestration
- **Service Discovery**: Maintains registry of available microservices
- **Health Monitoring**: Monitors health of downstream services
- **Circuit Breaking**: Implements fault tolerance patterns
- **Response Aggregation**: Combines responses from multiple services

### Data Management
- **Shared Data Layer**: Manages common entities (users, sessions)
- **Caching Coordination**: Coordinates caching across services
- **Migration Management**: Handles database schema migrations
- **Audit Logging**: Maintains audit trails for sensitive operations

## Technology Stack

- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js 4.x with TypeScript
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT with bcrypt for password hashing
- **Validation**: Joi/Zod schema validation
- **Caching**: Redis for session and token storage
- **Security**: Helmet, CORS, rate limiting
- **Testing**: Vitest for unit tests, Supertest for integration tests
- **Documentation**: Swagger/OpenAPI for API documentation

## Core Components

### Routes (`src/routes/`)
- `auth.ts` - Authentication endpoints (login, register, refresh)
- `users.ts` - User management endpoints
- `services.ts` - Service orchestration endpoints
- `health.ts` - Health check endpoints
- `api.ts` - Main API router with versioning

### Middleware (`src/middleware/`)
- `auth.ts` - JWT authentication middleware
- `validation.ts` - Request validation middleware
- `rateLimit.ts` - Rate limiting middleware
- `cors.ts` - CORS configuration middleware
- `errorHandler.ts` - Global error handling middleware

### Services (`src/services/`)
- `authService.ts` - Authentication business logic
- `userService.ts` - User management operations
- `serviceOrchestrator.ts` - Microservice coordination
- `cacheService.ts` - Caching operations
- `healthService.ts` - Health monitoring logic

### Models (`src/models/`)
- `User.ts` - User entity model
- `Session.ts` - Session management model
- `AuditLog.ts` - Audit logging model
- `ServiceRegistry.ts` - Service discovery model

## API Endpoints

### Authentication Endpoints
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

### User Management Endpoints
```
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:id/profile
PUT    /api/v1/users/:id/preferences
```

### Service Orchestration Endpoints
```
GET    /api/v1/services/health
GET    /api/v1/services/:serviceType/:endpoint
POST   /api/v1/services/:serviceType/:endpoint
PUT    /api/v1/services/:serviceType/:endpoint
DELETE /api/v1/services/:serviceType/:endpoint
```

### Health & Monitoring Endpoints
```
GET    /health
GET    /api/v1/health/detailed
GET    /api/v1/metrics
```

## Configuration

Environment variables are managed through `.env` files:

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Service URLs
ZC1_SERVICE_URL=http://zc1-vedic-service:3001
ZC2_SERVICE_URL=http://zc2-chinese-service:3002
ZC3_SERVICE_URL=http://zc3-western-service:3003
ZC4_SERVICE_URL=http://zc4-numerology-service:3004

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Application Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1
```

## Development Setup

### Prerequisites
- Node.js 20.x LTS
- MongoDB Atlas account
- Redis instance (local or cloud)

### Installation
```bash
cd backend
npm install
```

### Development
```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Generate API documentation
npm run docs
```

### Docker Development
```bash
# Build container
docker build -t zodiacore-backend .

# Run with dependencies
docker-compose up backend
```

## Testing Strategy

### Unit Tests
- Service layer testing with mocked dependencies
- Middleware testing with isolated requests
- Utility function testing
- Model validation testing

### Integration Tests
- API endpoint testing with Supertest
- Database integration testing
- Service orchestration testing
- Authentication flow testing

### Test Coverage
- Minimum 80% code coverage required
- Coverage reports generated automatically
- CI/CD integration with coverage gates

## Security Considerations

### Authentication Security
- JWT tokens with secure signing
- Password hashing with bcrypt
- Refresh token rotation
- Secure token storage

### API Security
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Infrastructure Security
- HTTPS enforcement
- Security headers with Helmet
- Rate limiting and DDoS protection
- Audit logging for sensitive operations

## Monitoring & Observability

### Health Checks
- Application health endpoints
- Database connectivity checks
- Service dependency health checks
- Memory and CPU usage monitoring

### Logging
- Structured JSON logging
- Correlation IDs for request tracing
- Error logging with stack traces
- Audit logging for security events

### Metrics
- Response time monitoring
- Error rate tracking
- Request volume metrics
- Database query performance

## Deployment

### Production Deployment
- Docker container deployment on Render
- Environment-specific configurations
- Automated health checks
- Rolling deployment strategy

### Scaling Considerations
- Horizontal scaling support
- Load balancer configuration
- Database connection pooling
- Caching layer scaling

## Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT token handling
- `bcrypt` - Password hashing
- `redis` - Caching and session storage
- `joi` - Schema validation

### Development Dependencies
- `typescript` - TypeScript compiler
- `vitest` - Testing framework
- `supertest` - HTTP endpoint testing
- `eslint` - Code linting
- `prettier` - Code formatting

## Contributing

1. Follow the established coding standards
2. Add comprehensive tests for new features
3. Update API documentation for endpoint changes
4. Ensure all tests pass before submitting PR
5. Follow conventional commit messages

## Troubleshooting

### Common Issues
- **Database Connection Errors**: Check MongoDB Atlas network access and credentials
- **Service Unavailable**: Verify microservice health and network connectivity
- **Authentication Failures**: Check JWT configuration and token validity
- **Rate Limiting**: Monitor request patterns and adjust limits if needed

### Debug Mode
```bash
# Enable debug logging
DEBUG=backend:* npm run dev

# Check service health
curl http://localhost:3000/health
```

## Future Enhancements

- **GraphQL API**: Alternative to REST API for complex queries
- **WebSocket Support**: Real-time features and notifications
- **API Gateway**: Advanced routing and transformation capabilities
- **Service Mesh**: Istio integration for advanced traffic management
- **Multi-Region Deployment**: Global distribution and failover
