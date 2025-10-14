# ZodiaCore API Documentation

## Overview

ZodiaCore provides a comprehensive REST API for astrology calculations and services. The API follows RESTful principles with consistent response formats, proper HTTP status codes, and comprehensive error handling.

## Base URL

```
Production: https://api.zodiacore.com
Staging: https://api-staging.zodiacore.com
Development: http://localhost:3000
```

## Authentication

All API requests require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Authentication Endpoints

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

## API Versioning

All endpoints are versioned with `/api/v1/` prefix. Future versions will use `/api/v2/`, etc.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req-123",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "birthData.date",
      "expected": "YYYY-MM-DD",
      "received": "invalid-date"
    }
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req-123"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

- **Authenticated Users**: 1000 requests per hour
- **Anonymous Users**: 100 requests per hour
- **Premium Users**: 5000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Astrology Services APIs

### ZC1 Vedic Astrology

#### Birth Chart Generation
```http
POST /api/v1/zc1/birth-chart
```

**Request Body:**
```json
{
  "userId": "user123",
  "birthData": {
    "date": "1990-05-15",
    "time": "14:30:00",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezone": "Asia/Kolkata"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "chartId": "chart456",
    "planets": [
      {
        "name": "Sun",
        "longitude": 64.5,
        "sign": "Taurus",
        "house": 2,
        "nakshatra": "Krittika"
      }
    ],
    "houses": [...],
    "aspects": [...],
    "yogas": [...]
  }
}
```

#### Dasha Calculation
```http
GET /api/v1/zc1/dasha/:userId
```

#### Compatibility Analysis
```http
POST /api/v1/zc1/compatibility
```

### ZC2 Chinese Astrology

#### BaZi Analysis
```http
POST /api/v1/zc2/bazi
```

#### Chinese Horoscope
```http
GET /api/v1/zc2/horoscope/:userId/:timeframe
```

### ZC3 Western Astrology

#### Western Birth Chart
```http
POST /api/v1/zc3/birth-chart
```

#### Synastry Analysis
```http
POST /api/v1/zc3/synastry
```

### ZC4 Numerology

#### Life Path Number
```http
POST /api/v1/zc4/life-path
```

#### Personal Cycles
```http
GET /api/v1/zc4/personal-cycles/:userId
```

## Common Parameters

### Birth Data Object
```json
{
  "date": "YYYY-MM-DD",
  "time": "HH:mm:ss",
  "latitude": number,  // Decimal degrees
  "longitude": number, // Decimal degrees
  "timezone": "string" // IANA timezone identifier
}
```

### Timeframe Options
- `daily` - Daily horoscope
- `weekly` - Weekly horoscope
- `monthly` - Monthly horoscope
- `yearly` - Yearly horoscope

## Pagination

For endpoints returning lists, pagination is supported:

```http
GET /api/v1/charts?page=1&limit=20&sort=createdAt&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting

### Query Parameters
- `sort`: Field to sort by
- `order`: `asc` or `desc`
- `filter[field]`: Filter by specific field
- `search`: Text search across relevant fields

### Examples
```http
GET /api/v1/charts?sort=createdAt&order=desc&filter[system]=vedic
GET /api/v1/horoscopes?search=career&timeframe=monthly
```

## Webhooks

ZodiaCore supports webhooks for real-time notifications.

### Register Webhook
```http
POST /api/v1/webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["chart.generated", "horoscope.created"],
  "secret": "webhook_secret"
}
```

### Supported Events
- `chart.generated` - When a birth chart is created
- `horoscope.created` - When a horoscope is generated
- `compatibility.calculated` - When compatibility analysis is completed
- `transit.alert` - When planetary transit alerts are triggered

### Webhook Payload
```json
{
  "event": "chart.generated",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "userId": "user123",
    "chartId": "chart456",
    "system": "vedic"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript SDK
```javascript
import { ZodiaCoreAPI } from '@zodiacore/sdk';

const client = new ZodiaCoreAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.zodiacore.com'
});

// Generate birth chart
const chart = await client.vedic.birthChart({
  date: '1990-05-15',
  time: '14:30:00',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata'
});
```

### Python SDK
```python
from zodiacore import ZodiaCoreAPI

client = ZodiaCoreAPI(api_key='your-api-key')

chart = client.vedic.birth_chart(
    date='1990-05-15',
    time='14:30:00',
    latitude=28.6139,
    longitude=77.2090,
    timezone='Asia/Kolkata'
)
```

## Testing

### Sandbox Environment
Use the staging environment for testing:
```
https://api-staging.zodiacore.com
```

### Test Data
Sample birth data for testing:
```json
{
  "date": "1990-05-15",
  "time": "14:30:00",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "timezone": "Asia/Kolkata"
}
```

## Support

### Documentation
- [API Reference](https://docs.zodiacore.com/api)
- [SDK Documentation](https://docs.zodiacore.com/sdk)
- [Integration Guides](https://docs.zodiacore.com/guides)

### Support Channels
- **Email**: api-support@zodiacore.com
- **Discord**: [ZodiaCore Community](https://discord.gg/zodiacore)
- **GitHub Issues**: [Report API Issues](https://github.com/zodiacore/api/issues)

### Service Status
Check service status at: https://status.zodiacore.com

## Changelog

### Version 1.0.0 (Current)
- Initial release of ZodiaCore API
- Support for ZC1-ZC4 astrology systems
- JWT authentication
- Comprehensive error handling
- Rate limiting and security features

### Upcoming Features
- GraphQL API support
- Real-time WebSocket connections
- Advanced filtering and search
- Bulk operations support
- API key management dashboard