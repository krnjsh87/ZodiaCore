# ZodiaCore Metrics Module

## Overview

The Metrics Module provides comprehensive observability for the ZodiaCore astrology web application. It implements Prometheus-compatible metrics collection for latency, throughput, errors, system metrics, and custom business metrics. This module follows the development rules for observability and monitoring, ensuring centralized and reusable metrics across all microservices.

## Features

- **HTTP Request Metrics**: Response time, status codes, request count
- **System Metrics**: Memory usage, CPU usage
- **Custom Business Metrics**: Framework for application-specific metrics
- **Prometheus Compatibility**: Full text format output for scraping
- **Middleware Integration**: Automatic HTTP metrics collection
- **Centralized Registry**: Single source of truth for all metrics

## Architecture

The metrics module consists of:

1. **MetricsRegistry**: Central registry for all metrics
2. **Metric Types**: Counter, Gauge, Histogram implementations
3. **HTTP Middleware**: Automatic request/response tracking
4. **System Metrics**: Process-level resource monitoring
5. **Prometheus Output**: Text format generation for scraping

## Usage

### Basic Setup

```javascript
const metrics = require('./backend/metrics');

// Add middleware to your Express app
app.use(metrics.httpMetricsMiddleware());

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
  metrics.updateSystemMetrics(); // Update system metrics
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.end(metrics.getMetrics());
});
```

### Creating Custom Metrics

```javascript
const metrics = require('./backend/metrics');

// Create a counter for business events
const astrologyReadingsCounter = metrics.createCounter(
  'astrology_readings_total',
  'Total number of astrology readings performed',
  ['service_type', 'reading_type']
);

// Increment the counter
astrologyReadingsCounter.inc(1, {
  service_type: 'vedic',
  reading_type: 'birth_chart',
});

// Create a gauge for active users
const activeUsersGauge = metrics.createGauge(
  'active_users_current',
  'Current number of active users',
  ['service']
);

// Set gauge value
activeUsersGauge.set(42, { service: 'main' });

// Create a histogram for response times
const apiResponseTime = metrics.createHistogram(
  'api_response_time_seconds',
  'API response time in seconds',
  ['endpoint'],
  [0.1, 0.5, 1, 2, 5] // Custom buckets
);

// Observe a value
apiResponseTime.observe(0.234, { endpoint: '/api/birth-chart' });
```

### Pre-defined Metrics

The module includes several pre-defined metrics:

#### HTTP Metrics

- `http_requests_total`: Total HTTP requests (counter)
- `http_request_duration_seconds`: HTTP request duration (histogram)

#### System Metrics

- `process_memory_usage_bytes`: Process memory usage (gauge)
- `process_cpu_usage_percent`: Process CPU usage (gauge)

## Metric Types

### Counter

Monotonically increasing value. Use for counts that only go up (requests, errors, events).

### Gauge

Value that can go up and down. Use for current values (active users, memory usage, queue size).

### Histogram

Tracks distribution of values. Use for timing, sizes, etc. Automatically creates sum, count, and bucket metrics.

## Prometheus Integration

### Configuration

Add to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'zodiacore'
    static_configs:
      - targets: ['localhost:3000']
    scrape_interval: 15s
    metrics_path: '/metrics'
```

### Sample Output

```
# ZodiaCore Metrics
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/api/status",status_code="200"} 5
http_requests_total{method="POST",route="/api/birth-chart",status_code="201"} 2

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_sum{method="GET",route="/api/status"} 1.234
http_request_duration_seconds_count{method="GET",route="/api/status"} 5
http_request_duration_seconds_bucket{method="GET",route="/api/status",le="0.1"} 3
http_request_duration_seconds_bucket{method="GET",route="/api/status",le="0.5"} 4
http_request_duration_seconds_bucket{method="GET",route="/api/status",le="1"} 5
http_request_duration_seconds_bucket{method="GET",route="/api/status",le="+Inf"} 5

# HELP process_memory_usage_bytes Process memory usage in bytes
# TYPE process_memory_usage_bytes gauge
process_memory_usage_bytes{type="rss"} 45678912
process_memory_usage_bytes{type="heap_used"} 23456789
```

## Best Practices

### Naming Conventions

- Use snake_case for metric names
- Include units in names (e.g., `_seconds`, `_bytes`, `_total`)
- Use descriptive names that indicate what is being measured

### Labels

- Use labels for dimensions (service, endpoint, status, etc.)
- Avoid high cardinality labels (no user IDs, timestamps)
- Keep label values consistent

### Performance

- Metrics are stored in memory - monitor memory usage
- Update system metrics periodically, not on every request
- Use appropriate metric types for your use case

## Integration with Services

### Service-Specific Metrics

Each microservice can extend the metrics module:

```javascript
// In vedic-service/server.js
const metrics = require('../backend/metrics');

// Service-specific metrics
const vedicCalculationsCounter = metrics.createCounter(
  'vedic_calculations_total',
  'Total Vedic astrology calculations',
  ['calculation_type']
);

// Use in your service logic
vedicCalculationsCounter.inc(1, { calculation_type: 'dasha' });
```

### Centralized Monitoring

All services expose metrics at `/metrics`, allowing Prometheus to scrape from each service independently while maintaining consistent metric naming and structure.

## Dependencies

- **Node.js built-ins**: `os` for system metrics
- **No external dependencies**: Pure JavaScript implementation

## Security Considerations

- Metrics endpoint should be protected in production
- Avoid exposing sensitive information in metric names or labels
- Consider rate limiting the metrics endpoint

## Development Rules Compliance

This module adheres to the ZodiaCore development rules:

- **Observability & Monitoring**: Implements comprehensive metrics collection
- **Coding Standards**: Proper comments, DRY principles, readable code
- **Documentation**: Detailed usage and integration guides
- **Security**: No hardcoded secrets, input validation
- **DevOps**: Prometheus/Grafana compatible, CI/CD ready

## Troubleshooting

### Common Issues

1. **High Memory Usage**: Metrics are stored in memory. Monitor and rotate if necessary.
2. **Missing Metrics**: Ensure middleware is added before routes.
3. **Prometheus Scraping**: Verify endpoint is accessible and returns correct content-type.

### Debugging

Enable debug logging to see metrics collection:

```javascript
const logger = require('./backend/logger').getLogger();
logger.level = 'debug';
```

## Future Enhancements

- Metric persistence for historical analysis
- Alert manager integration
- Custom metric aggregations
- Performance profiling integration
