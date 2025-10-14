# ZodiaCore Monitoring Setup

This directory contains the monitoring configuration for the ZodiaCore services, following the development rules for observability and monitoring.

## Overview

The monitoring setup includes:

- Prometheus-compatible metrics collection
- Grafana dashboard for visualization
- Health check endpoints for all microservices
- Centralized logging with correlation IDs

## Prerequisites

- Docker and Docker Compose
- Node.js (for running the services)
- Prometheus (for metrics collection)
- Grafana (for dashboard visualization)

## Setup Instructions

### 1. Start Prometheus

Create a `prometheus.yml` configuration file:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'zodia-core-backend'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'zodia-core-services'
    static_configs:
      - targets:
          [
            'localhost:3001',
            'localhost:3002',
            'localhost:3003',
            'localhost:3004',
          ]
    metrics_path: '/health'
```

Start Prometheus:

```bash
docker run -d -p 9090:9090 -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

### 2. Start Grafana

```bash
docker run -d -p 3000:3000 grafana/grafana
```

### 3. Import Dashboard

1. Open Grafana at http://localhost:3000
2. Login with default credentials (admin/admin)
3. Go to Dashboards > Import
4. Upload the `grafana/zodia-core-dashboard.json` file
5. Configure the Prometheus data source (URL: http://localhost:9090)

### 4. Configure Services

Ensure all services expose metrics and health endpoints:

- Backend: `/metrics` endpoint (Prometheus format)
- Services: `/health` endpoint (JSON status)

### 5. Environment Variables

Set the following environment variables for monitoring:

```bash
# Metrics collection interval (seconds)
METRICS_UPDATE_INTERVAL=30

# Enable detailed logging
LOG_LEVEL=info

# Correlation ID header
CORRELATION_ID_HEADER=X-Correlation-ID
```

## Dashboard Panels

The Grafana dashboard includes the following panels:

1. **HTTP Request Rate**: Shows request rates by method and route
2. **HTTP Request Duration**: 95th percentile response times
3. **HTTP Status Codes**: Breakdown of response status codes
4. **Process Memory Usage**: Heap and RSS memory usage
5. **Process CPU Usage**: CPU utilization percentage
6. **Service Health Status**: Up/down status of all services

## Alerting

Configure alerts in Grafana for:

- High error rates (>5%)
- Response times >1 second
- Memory usage >80%
- Service down status

## Best Practices

- Monitor all microservices independently
- Use correlation IDs for request tracing
- Implement circuit breakers for resilience
- Regularly review and update metrics
- Enable anomaly detection for proactive monitoring

## Troubleshooting

- Check service logs for correlation IDs
- Verify Prometheus targets are healthy
- Ensure Grafana data sources are configured correctly
- Monitor resource usage during peak loads

## Staging Environment Testing

The staging environment provides a complete testing setup for validating logging, metrics, and health check implementations before production deployment.

### Setup Instructions

1. **Start Staging Environment**

   ```bash
   docker-compose -f docker-compose.staging.yml up -d
   ```

2. **Run Comprehensive Tests**

   ```bash
   chmod +x tests/run-staging-tests.sh
   ./tests/run-staging-tests.sh
   ```

3. **Access Monitoring Interfaces**
   - **Grafana Dashboard**: http://localhost:3004 (admin/admin)
   - **Prometheus**: http://localhost:9090
   - **API Gateway**: http://localhost:3000
   - **Vedic Service**: http://localhost:3001
   - **Western Service**: http://localhost:3002
   - **Mundane Service**: http://localhost:3003

### Test Scripts

The staging test suite includes:

- **`tests/staging-test-health.js`**: Validates health check endpoints for all services
- **`tests/staging-test-metrics.js`**: Verifies Prometheus metrics collection and format
- **`tests/staging-test-logging.js`**: Tests correlation ID handling and log structure
- **`tests/run-staging-tests.sh`**: Orchestrates all tests with comprehensive reporting

### Test Results

Test results are logged to timestamped files (`staging-test-results-*.log`) and include:

- Health status of all microservices
- Metrics collection validation
- Correlation ID verification
- Prometheus and Grafana accessibility checks

### Troubleshooting

- **Services not starting**: Check Docker logs with `docker-compose -f docker-compose.staging.yml logs`
- **Tests failing**: Review detailed logs in the generated log file
- **Metrics not appearing**: Ensure services are exposing `/metrics` endpoints correctly
- **Grafana not loading**: Wait for initialization and check port availability

### Environment Variables

Staging-specific environment variables:

```bash
NODE_ENV=staging
LOG_LEVEL=info
METRICS_UPDATE_INTERVAL=30
CORRELATION_ID_HEADER=X-Correlation-ID
GRAFANA_ADMIN_PASSWORD=admin
```

## Security Considerations

- Secure Grafana with proper authentication
- Use HTTPS for production deployments
- Implement access controls for sensitive metrics
- Regularly rotate credentials and secrets
