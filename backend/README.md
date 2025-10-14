# Centralized Logging System

This document describes the centralized logging system implemented for ZodiaCore microservices.

## Overview

The logging system provides:

- **Centralized logging** with Winston
- **Correlation ID support** for request tracing across services
- **Structured JSON logging** for better parsing and analysis
- **Configurable log levels** via environment variables
- **Multi-transport logging** (console for development, files for production)

## Architecture

### Core Components

1. **Logger Module** (`backend/logger.js`)
   - Main logging configuration and utilities
   - Correlation ID generation and management
   - Express middleware for request correlation

2. **Correlation ID Middleware**
   - Automatically generates or extracts correlation IDs from requests
   - Attaches correlation ID to request object
   - Sets correlation ID in response headers

3. **Child Loggers**
   - Service-specific loggers with correlation context
   - Maintains request tracing across service boundaries

## Usage

### Basic Logging

```javascript
const { getLogger } = require('./backend/logger');

// Get service-specific logger
const logger = getLogger(null, 'my-service');

// Log messages
logger.info('Service started');
logger.error('An error occurred', { error: err });
logger.debug('Debug information', { data: someData });
```

### Request-Scoped Logging

```javascript
// In Express routes, use req.logger for correlation
app.get('/api/data', (req, res) => {
  req.logger.info('Processing data request');

  // Correlation ID is automatically included
  someService
    .processData(req.correlationId)
    .then((result) => {
      req.logger.info('Data processed successfully');
      res.json(result);
    })
    .catch((err) => {
      req.logger.error('Failed to process data', { error: err });
      res.status(500).json({ error: 'Internal error' });
    });
});
```

### Service Integration

```javascript
// In service modules
const { getLogger } = require('../backend/logger');

class MyService {
  constructor(correlationId) {
    this.logger = getLogger(correlationId, 'my-service');
  }

  async processData(data) {
    this.logger.info('Processing data', { dataSize: data.length });

    try {
      const result = await this.doWork(data);
      this.logger.info('Data processed successfully');
      return result;
    } catch (error) {
      this.logger.error('Processing failed', { error: error.message });
      throw error;
    }
  }
}
```

## Configuration

### Environment Variables

- `LOG_LEVEL`: Logging level (error, warn, info, http, debug) - default: `info`
- `LOG_ERROR_FILE`: Path for error logs - default: `logs/error.log`
- `LOG_COMBINED_FILE`: Path for combined logs - default: `logs/combined.log`
- `NODE_ENV`: Environment (production disables console logging)

### Log Levels

- `error`: 0 - Error conditions
- `warn`: 1 - Warning conditions
- `info`: 2 - Informational messages
- `http`: 3 - HTTP request logging
- `debug`: 4 - Debug information

## Log Format

### JSON Structure

```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "info",
  "message": "User logged in",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "service": "auth-service",
  "userId": "12345",
  "ip": "192.168.1.1"
}
```

### Console Format (Development)

```
2024-01-15 10:30:45 info [auth-service] [550e84] User logged in
```

## Correlation ID Propagation

### HTTP Headers

- **Request**: `x-correlation-id` (optional)
- **Response**: `x-correlation-id` (always present)

### Service-to-Service Calls

When making HTTP calls between services:

```javascript
const axios = require('axios');

async function callOtherService(correlationId, data) {
  const response = await axios.post('http://other-service/api', data, {
    headers: {
      'x-correlation-id': correlationId,
    },
  });
  return response.data;
}
```

## Best Practices

1. **Always use correlation IDs** for request tracing
2. **Include relevant context** in log messages (user IDs, request IDs, etc.)
3. **Use appropriate log levels** (debug for development, info for production)
4. **Structure log data** as objects for better parsing
5. **Handle errors gracefully** with proper error logging
6. **Propagate correlation IDs** across service boundaries

## Monitoring Integration

The logging system is designed to integrate with monitoring tools:

- **ELK Stack**: JSON logs work well with Elasticsearch
- **Splunk**: Structured logging supports advanced queries
- **Grafana**: Correlation IDs enable request tracing
- **Prometheus**: Metrics can be derived from log patterns

## Dependencies

- `winston`: Logging framework
- `uuid`: Correlation ID generation

## Security Considerations

- Logs may contain sensitive information - ensure proper access controls
- Correlation IDs help track requests without exposing internal data
- Consider log rotation and retention policies
- Sanitize log data to prevent injection attacks
