# ZodiaCore Production Operations Guide

## Overview

This comprehensive guide covers production deployment, monitoring, logging, and operational procedures for the ZodiaCore astrology application. It follows the development rules for observability, monitoring, and documentation, ensuring clear, actionable guidance for production operations.

## Table of Contents

1. [Production Deployment](#production-deployment)
   - [Render Deployment](#render-deployment)
   - [Environment Configuration](#environment-configuration)
   - [Database Setup](#database-setup)
   - [Service Dependencies](#service-dependencies)

2. [Monitoring Setup](#monitoring-setup)
   - [Prometheus Configuration](#prometheus-configuration)
   - [Grafana Dashboard Setup](#grafana-dashboard-setup)
   - [Alert Configuration](#alert-configuration)
   - [Health Check Endpoints](#health-check-endpoints)

3. [Logging System](#logging-system)
   - [Centralized Logging](#centralized-logging)
   - [Correlation ID Tracing](#correlation-id-tracing)
   - [Log Levels and Rotation](#log-levels-and-rotation)
   - [Log Analysis](#log-analysis)

4. [Operational Procedures](#operational-procedures)
   - [Daily Operations](#daily-operations)
   - [Weekly Maintenance](#weekly-maintenance)
   - [Monthly Reviews](#monthly-reviews)
   - [Backup Procedures](#backup-procedures)

5. [Troubleshooting Guide](#troubleshooting-guide)
   - [Common Issues](#common-issues)
   - [Performance Problems](#performance-problems)
   - [Service Failures](#service-failures)
   - [Database Issues](#database-issues)

6. [Incident Response](#incident-response)
   - [Severity Levels](#severity-levels)
   - [Response Procedures](#response-procedures)
   - [Communication Plan](#communication-plan)
   - [Post-Incident Review](#post-incident-review)

7. [Security Considerations](#security-considerations)
   - [Access Control](#access-control)
   - [Data Protection](#data-protection)
   - [Compliance](#compliance)

## Production Deployment

### Render Deployment

ZodiaCore uses Render for production deployment, providing a scalable cloud platform with automated deployments and monitoring.

#### Prerequisites

- Render account with billing enabled
- GitHub repository access
- Environment variables configured
- MongoDB Atlas cluster provisioned

#### Step-by-Step Deployment

1. **Connect Repository**

   ```bash
   # In Render dashboard:
   # 1. Click "New +" > "Web Service"
   # 2. Connect your GitHub repository
   # 3. Select the main branch
   ```

2. **Configure Build Settings**

   ```yaml
   # render.yaml (already configured)
   services:
     - type: web
       name: zodiacore-production
       runtime: node
       buildCommand: npm install
       startCommand: npm start
       plan: free # Upgrade as needed
   ```

3. **Set Environment Variables**

   ```bash
   # Required environment variables in Render dashboard:
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=${MONGODB_URI}
   JWT_SECRET=${JWT_SECRET}
   LOG_LEVEL=info
   # ... (see render.yaml for complete list)
   ```

4. **Deploy Service**

   ```bash
   # Render automatically deploys on:
   # - Initial setup
   # - Git push to main branch
   # - Manual trigger
   ```

5. **Verify Deployment**

   ```bash
   # Check service status
   curl https://zodiacore-production.onrender.com/health

   # Expected response:
   {
     "status": "healthy",
     "timestamp": "2025-01-14T10:30:00.000Z",
     "service": "zodiacore-main"
   }
   ```

#### Deployment Rollback

If deployment fails or issues arise:

1. **Manual Rollback**

   ```bash
   # In Render dashboard:
   # 1. Go to service settings
   # 2. Click "Rollbacks" tab
   # 3. Select previous deployment
   # 4. Click "Rollback"
   ```

2. **Git-based Rollback**
   ```bash
   # Revert commit and push
   git revert <problematic-commit>
   git push origin main
   ```

### Environment Configuration

#### Production Environment Variables

```bash
# Core Configuration
NODE_ENV=production
PORT=10000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zodiacore
MONGODB_DB_NAME=zodiacore

# Authentication
JWT_SECRET=<secure-random-string>
ENCRYPTION_KEY=<secure-random-string>

# AI Services
OPENAI_API_KEY=<api-key>
ANTHROPIC_API_KEY=<api-key>
GOOGLE_API_KEY=<api-key>

# Logging
LOG_LEVEL=info
LOG_RETENTION_DAYS=30
LOG_MAX_SIZE_MB=100

# Monitoring
METRICS_UPDATE_INTERVAL=30
CORRELATION_ID_HEADER=X-Correlation-ID

# Performance
MAX_CONNECTIONS=100
CACHE_TTL=3600
MAX_CONCURRENT_REQUESTS=50
```

#### Environment Validation

```javascript
// Validate required environment variables on startup
const requiredEnvVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'OPENAI_API_KEY',
];

function validateEnvironment() {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

### Database Setup

#### MongoDB Atlas Configuration

1. **Create Cluster**

   ```bash
   # In MongoDB Atlas dashboard:
   # 1. Create new cluster (M0 for free tier)
   # 2. Configure network access (IP whitelist)
   # 3. Create database user
   ```

2. **Database User Setup**

   ```javascript
   // Recommended user permissions:
   {
     "user": "zodiacore-prod",
     "pwd": "<secure-password>",
     "roles": [
       {
         "role": "readWrite",
         "db": "zodiacore"
       }
     ]
   }
   ```

3. **Connection String**
   ```bash
   mongodb+srv://zodiacore-prod:<password>@cluster0.xxxxx.mongodb.net/zodiacore?retryWrites=true&w=majority
   ```

#### Database Migrations

```javascript
// Migration script example
const mongoose = require('mongoose');

async function runMigrations() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Add new fields to existing collections
    await mongoose.connection.db
      .collection('users')
      .updateMany(
        { birthChart: { $exists: false } },
        { $set: { birthChart: null } }
      );

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}
```

### Service Dependencies

#### External Services

1. **AI/ML Services**
   - OpenAI API (GPT models)
   - Anthropic Claude API
   - Google AI services

2. **Caching**
   - Redis (optional, for performance)

3. **Email Services**
   - SMTP provider for notifications

#### Health Checks

```javascript
// External service health checks
async function checkExternalServices() {
  const services = [
    { name: 'OpenAI', url: 'https://api.openai.com/v1/models' },
    { name: 'MongoDB', url: process.env.MONGODB_URI },
  ];

  for (const service of services) {
    try {
      // Implement service-specific health checks
      const isHealthy = await checkServiceHealth(service);
      if (!isHealthy) {
        console.error(`${service.name} is unhealthy`);
      }
    } catch (error) {
      console.error(`Health check failed for ${service.name}:`, error);
    }
  }
}
```

## Monitoring Setup

### Prometheus Configuration

#### Production Prometheus Setup

1. **Install Prometheus**

   ```bash
   # Using Docker for production
   docker run -d \
     --name prometheus \
     -p 9090:9090 \
     -v $(pwd)/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml \
     prom/prometheus
   ```

2. **Prometheus Configuration**

   ```yaml
   # monitoring/prometheus.yml
   global:
     scrape_interval: 15s
     evaluation_interval: 15s

   scrape_configs:
     - job_name: 'zodiacore-production'
       static_configs:
         - targets: ['zodiacore-production.onrender.com']
       metrics_path: '/metrics'
       scrape_interval: 30s

     - job_name: 'zodiacore-health'
       static_configs:
         - targets: ['zodiacore-production.onrender.com']
       metrics_path: '/health'
       scrape_interval: 60s
   ```

3. **Metrics Collection**

   ```javascript
   // In backend/metrics.js - automatic metrics collection
   const metrics = require('./backend/metrics');

   // HTTP metrics middleware
   app.use(metrics.httpMetricsMiddleware());

   // System metrics update (every 30 seconds)
   setInterval(() => {
     metrics.updateSystemMetrics();
   }, 30000);

   // Metrics endpoint
   app.get('/metrics', (req, res) => {
     res.set('Content-Type', 'text/plain');
     res.send(metrics.getMetrics());
   });
   ```

### Grafana Dashboard Setup

#### Production Grafana Setup

1. **Install Grafana**

   ```bash
   docker run -d \
     --name grafana \
     -p 3000:3000 \
     -e GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD} \
     grafana/grafana
   ```

2. **Configure Data Source**

   ```bash
   # In Grafana UI (http://localhost:3000):
   # 1. Login with admin/admin
   # 2. Add Prometheus data source
   # 3. URL: http://prometheus:9090
   # 4. Access: Server (default)
   ```

3. **Import Dashboard**
   ```json
   // monitoring/grafana/zodia-core-dashboard.json
   {
     "dashboard": {
       "title": "ZodiaCore Production Dashboard",
       "tags": ["zodiacore", "production"],
       "timezone": "UTC",
       "panels": [
         // Dashboard panels defined here
       ]
     }
   }
   ```

#### Key Dashboard Panels

1. **HTTP Request Rate**

   ```
   Query: rate(http_requests_total[5m])
   Labels: method, route
   ```

2. **Response Time (95th percentile)**

   ```
   Query: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
   ```

3. **Error Rate**

   ```
   Query: rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m])
   ```

4. **Memory Usage**

   ```
   Query: process_memory_usage_bytes{type="heap_used"} / process_memory_usage_bytes{type="heap_total"}
   ```

5. **Service Health Status**
   ```
   Query: up{job="zodiacore-production"}
   ```

### Alert Configuration

#### Grafana Alerts

```yaml
# Alert rules configuration
groups:
  - name: zodiacore-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is {{ $value }}% (threshold: 5%)'

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'Slow response times detected'
          description: '95th percentile response time is {{ $value }}s'

      - alert: HighMemoryUsage
        expr: process_memory_usage_bytes{type="heap_used"} / process_memory_usage_bytes{type="heap_total"} > 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: 'High memory usage detected'
          description: 'Memory usage is {{ $value }}%'
```

#### Alert Notifications

```yaml
# Notification channels
notifiers:
  - name: email
    type: email
    settings:
      addresses: alerts@zodiacore.com

  - name: slack
    type: slack
    settings:
      url: https://hooks.slack.com/services/...
      channel: '#alerts'
```

### Health Check Endpoints

#### Service Health Checks

```javascript
// Health check endpoint implementation
app.get('/health', async (req, res) => {
  try {
    // Database connectivity check
    await mongoose.connection.db.admin().ping();

    // External services check
    const externalHealth = await checkExternalServices();

    // System resources check
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'zodiacore-main',
      version: process.env.npm_package_version,
      uptime: process.uptime(),
      database: {
        status: 'connected',
        latency: await measureDbLatency(),
      },
      system: {
        memory: {
          used: memUsage.heapUsed,
          total: memUsage.heapTotal,
          percentage: ((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(
            2
          ),
        },
        cpu: cpuUsage,
      },
      external: externalHealth,
    };

    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'zodiacore-main',
      error: error.message,
    });
  }
});
```

#### Load Balancer Health Checks

```nginx
# Nginx configuration for health checks
location /health {
  proxy_pass http://backend;
  proxy_connect_timeout 5s;
  proxy_send_timeout 5s;
  proxy_read_timeout 5s;

  # Health check headers
  add_header X-Health-Check true;
}
```

## Logging System

### Centralized Logging

#### Winston Logger Configuration

```javascript
// backend/logger.js - Production logging setup
const winston = require('winston');

// Production format (JSON for aggregation)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: productionFormat,
  transports: [
    // Error log
    new winston.transports.File({
      filename: process.env.LOG_ERROR_FILE || 'logs/error.log',
      level: 'error',
      maxsize: (process.env.LOG_MAX_SIZE_MB || 100) * 1024 * 1024,
      maxFiles: process.env.LOG_MAX_FILES || 10,
    }),

    // Combined log
    new winston.transports.File({
      filename: process.env.LOG_COMBINED_FILE || 'logs/combined.log',
      maxsize: (process.env.LOG_MAX_SIZE_MB || 100) * 1024 * 1024,
      maxFiles: process.env.LOG_MAX_FILES || 10,
    }),

    // Console for Render logging
    new winston.transports.Console({
      format: productionFormat,
    }),
  ],
});
```

#### Structured Logging

```javascript
// Structured logging examples
logger.info('User login successful', {
  userId: 'user123',
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  correlationId: req.correlationId,
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  connectionString: maskConnectionString(process.env.MONGODB_URI),
  retryCount: 3,
});

logger.warn('Rate limit exceeded', {
  userId: 'user123',
  endpoint: '/api/birth-chart',
  limit: 100,
  window: '1h',
  correlationId: req.correlationId,
});
```

### Correlation ID Tracing

#### Request Tracing Implementation

```javascript
// Correlation ID middleware
function correlationIdMiddleware(req, res, next) {
  const correlationId =
    req.headers[process.env.CORRELATION_ID_HEADER] ||
    req.headers['x-correlation-id'] ||
    generateCorrelationId();

  // Set correlation ID in response
  res.set(process.env.CORRELATION_ID_HEADER, correlationId);

  // Attach to request for use in handlers
  req.correlationId = correlationId;

  // Create child logger
  req.logger = logger.child({
    correlationId,
    service: 'zodiacore-main',
    userId: req.user?.id,
    ip: req.ip,
  });

  next();
}

// Usage in route handlers
app.get('/api/birth-chart', correlationIdMiddleware, async (req, res) => {
  req.logger.info('Processing birth chart request', {
    userId: req.user.id,
    chartType: req.query.type,
  });

  try {
    const chart = await generateBirthChart(req.user, req.query);
    req.logger.info('Birth chart generated successfully', {
      chartId: chart.id,
      processingTime: Date.now() - req.startTime,
    });
    res.json(chart);
  } catch (error) {
    req.logger.error('Birth chart generation failed', {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### Distributed Tracing

```javascript
// Cross-service correlation ID propagation
async function callExternalService(serviceUrl, data, correlationId) {
  const logger = getLogger(correlationId, 'external-service');

  logger.info('Calling external service', {
    serviceUrl,
    dataSize: JSON.stringify(data).length,
  });

  try {
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [process.env.CORRELATION_ID_HEADER]: correlationId,
      },
      body: JSON.stringify(data),
    });

    logger.info('External service call completed', {
      status: response.status,
      responseTime: Date.now() - startTime,
    });

    return response.json();
  } catch (error) {
    logger.error('External service call failed', {
      error: error.message,
      serviceUrl,
    });
    throw error;
  }
}
```

### Log Levels and Rotation

#### Log Level Configuration

```javascript
// Log levels (from most to least verbose)
const LOG_LEVELS = {
  error: 0, // System errors, exceptions
  warn: 1, // Warnings, deprecated features
  info: 2, // General information, user actions
  http: 3, // HTTP requests (for debugging)
  debug: 4, // Detailed debugging information
};

// Production log level
process.env.LOG_LEVEL =
  process.env.NODE_ENV === 'production' ? 'info' : 'debug';
```

#### Log Rotation Strategy

```javascript
// Log rotation configuration
const logRotation = {
  maxSize: process.env.LOG_MAX_SIZE_MB || 100, // MB
  maxFiles: process.env.LOG_MAX_FILES || 10, // Number of files
  datePattern: 'YYYY-MM-DD', // Date pattern
  zippedArchive: true, // Compress old logs
};

// Automatic cleanup
function cleanupOldLogs() {
  const logDir = path.dirname(process.env.LOG_COMBINED_FILE);
  const files = fs
    .readdirSync(logDir)
    .filter((file) => file.endsWith('.log.gz'))
    .sort()
    .reverse();

  // Keep only last N compressed files
  const keepFiles = parseInt(process.env.LOG_MAX_FILES) || 10;
  if (files.length > keepFiles) {
    files.slice(keepFiles).forEach((file) => {
      fs.unlinkSync(path.join(logDir, file));
    });
  }
}
```

### Log Analysis

#### Log Querying and Analysis

```bash
# Search for specific correlation ID
grep "correlationId\":\"abc-123\"" logs/combined.log

# Find errors in last hour
grep '"level":"error"' logs/error.log | jq 'select(.timestamp > "'$(date -d '1 hour ago' +%Y-%m-%dT%H:%M:%S)'")'

# Count requests by endpoint
grep '"message":"HTTP.*request"' logs/combined.log | jq -r '.endpoint' | sort | uniq -c | sort -nr

# Monitor error rate
tail -f logs/error.log | jq -r '.timestamp + " " + .message' | head -20
```

#### Log Aggregation Tools

```javascript
// ELK Stack configuration (if used)
const elasticsearch = require('@elastic/elasticsearch');

const client = new elasticsearch.Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USER,
    password: process.env.ELASTICSEARCH_PASS,
  },
});

// Send logs to Elasticsearch
logger.add(
  new winston.transports.Http({
    host: process.env.ELASTICSEARCH_URL,
    port: 9200,
    path: '/_bulk',
    auth: {
      username: process.env.ELASTICSEARCH_USER,
      password: process.env.ELASTICSEARCH_PASS,
    },
  })
);
```

## Operational Procedures

### Daily Operations

#### Morning Health Check

```bash
#!/bin/bash
# daily-health-check.sh

echo "=== ZodiaCore Daily Health Check ==="
echo "Date: $(date)"

# Check service status
echo "1. Service Health:"
curl -s https://zodiacore-production.onrender.com/health | jq .

# Check database connectivity
echo "2. Database Status:"
# MongoDB ping command

# Check external services
echo "3. External Services:"
# Check AI service APIs

# Review error logs
echo "4. Recent Errors:"
tail -20 logs/error.log | jq -r '.timestamp + " " + .level + " " + .message'

# Check resource usage
echo "5. Resource Usage:"
# Memory, CPU, disk usage

echo "=== Health Check Complete ==="
```

#### Key Metrics Review

```javascript
// Daily metrics summary
async function generateDailyReport() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const metrics = {
    totalRequests: await getMetricSum('http_requests_total', yesterday),
    errorRate: await getErrorRate(yesterday),
    avgResponseTime: await getAvgResponseTime(yesterday),
    activeUsers: await getActiveUsers(yesterday),
    topEndpoints: await getTopEndpoints(yesterday),
  };

  // Send daily report
  await sendDailyReport(metrics);
}
```

### Weekly Maintenance

#### Log Rotation and Cleanup

```bash
#!/bin/bash
# weekly-maintenance.sh

echo "=== Weekly Maintenance: $(date) ==="

# Rotate logs
echo "1. Rotating application logs..."
logrotate -f /etc/logrotate.d/zodiacore

# Clean old logs
echo "2. Cleaning old log files..."
find /var/log/zodiacore -name "*.log.gz" -mtime +30 -delete

# Database maintenance
echo "3. Database optimization..."
mongosh ${MONGODB_URI} --eval "db.adminCommand('compact')"

# Cache cleanup
echo "4. Cache maintenance..."
redis-cli FLUSHDB ASYNC

# Update dependencies (if safe)
echo "5. Dependency updates..."
npm audit fix

echo "=== Weekly Maintenance Complete ==="
```

#### Performance Optimization

```javascript
// Weekly performance review
async function weeklyPerformanceReview() {
  // Analyze slow queries
  const slowQueries = await analyzeSlowQueries();

  // Review cache hit rates
  const cacheStats = await getCacheStatistics();

  // Check memory leaks
  const memoryAnalysis = await analyzeMemoryUsage();

  // Generate optimization recommendations
  const recommendations = generateRecommendations({
    slowQueries,
    cacheStats,
    memoryAnalysis,
  });

  await sendWeeklyReport(recommendations);
}
```

### Monthly Reviews

#### Security Audit

```bash
#!/bin/bash
# monthly-security-audit.sh

echo "=== Monthly Security Audit ==="

# Check for vulnerabilities
echo "1. Dependency vulnerabilities:"
npm audit --audit-level moderate

# Review access logs
echo "2. Suspicious access patterns:"
grep "401\|403\|429" logs/access.log | head -20

# Check SSL certificates
echo "3. SSL certificate expiry:"
openssl s_client -connect zodiacore-production.onrender.com:443 -servername zodiacore-production.onrender.com < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Review user permissions
echo "4. User access review:"
# Check for inactive users, excessive permissions

echo "=== Security Audit Complete ==="
```

#### Capacity Planning

```javascript
// Monthly capacity analysis
async function monthlyCapacityPlanning() {
  const metrics = {
    monthlyActiveUsers: await getMonthlyActiveUsers(),
    peakConcurrentUsers: await getPeakConcurrentUsers(),
    averageResponseTime: await getAvgResponseTimeLastMonth(),
    errorRate: await getErrorRateLastMonth(),
    databaseSize: await getDatabaseSize(),
    cacheHitRate: await getCacheHitRate(),
  };

  // Predict future needs
  const predictions = {
    nextMonthUsers: predictUsers(metrics.monthlyActiveUsers),
    requiredCapacity: calculateRequiredCapacity(metrics),
    costProjection: calculateCostProjection(metrics),
  };

  await sendCapacityReport(metrics, predictions);
}
```

### Backup Procedures

#### Database Backup

```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/backups/zodiacore"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="zodiacore_backup_${TIMESTAMP}"

echo "Starting database backup: ${BACKUP_NAME}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# MongoDB backup
mongodump \
  --uri="${MONGODB_URI}" \
  --out="${BACKUP_DIR}/${BACKUP_NAME}" \
  --gzip \
  --quiet

# Verify backup
if [ $? -eq 0 ]; then
  echo "Backup completed successfully"

  # Compress backup
  tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" -C "${BACKUP_DIR}" "${BACKUP_NAME}"
  rm -rf "${BACKUP_DIR}/${BACKUP_NAME}"

  # Upload to cloud storage
  aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" "s3://zodiacore-backups/"

  # Clean old backups (keep last 30 days)
  find ${BACKUP_DIR} -name "*.tar.gz" -mtime +30 -delete

  echo "Backup uploaded and cleanup completed"
else
  echo "Backup failed!"
  exit 1
fi
```

#### Configuration Backup

```bash
#!/bin/bash
# backup-config.sh

CONFIG_BACKUP_DIR="/backups/config"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup environment variables (redacted)
env | grep -E '^(NODE_ENV|MONGODB_|JWT_|API_)' | sed 's/=.*/=***REDACTED***/' > "${CONFIG_BACKUP_DIR}/env_${TIMESTAMP}.txt"

# Backup application config files
tar -czf "${CONFIG_BACKUP_DIR}/config_${TIMESTAMP}.tar.gz" \
  render.yaml \
  docker-compose.yml \
  monitoring/ \
  --exclude='*.log'

# Upload to secure storage
aws s3 cp "${CONFIG_BACKUP_DIR}/" "s3://zodiacore-config-backups/" --recursive
```

## Troubleshooting Guide

### Common Issues

#### Service Unavailable

**Symptoms:**

- 503 Service Unavailable errors
- Health check endpoint returns unhealthy status

**Troubleshooting Steps:**

1. **Check Service Logs**

   ```bash
   # View recent errors
   tail -50 logs/error.log | jq .

   # Check for correlation ID patterns
   grep "correlationId\":\"<specific-id>\"" logs/combined.log
   ```

2. **Verify Dependencies**

   ```bash
   # Check database connectivity
   mongosh ${MONGODB_URI} --eval "db.adminCommand('ping')"

   # Check external APIs
   curl -H "Authorization: Bearer ${OPENAI_API_KEY}" https://api.openai.com/v1/models
   ```

3. **Check System Resources**

   ```bash
   # Memory usage
   free -h

   # Disk space
   df -h

   # Process status
   ps aux | grep node
   ```

4. **Restart Service**
   ```bash
   # Via Render dashboard or
   pm2 restart zodiacore-production
   ```

#### Slow Performance

**Symptoms:**

- Response times > 1 second
- High CPU/memory usage
- Timeout errors

**Troubleshooting Steps:**

1. **Analyze Performance Metrics**

   ```bash
   # Check response time percentiles
   curl http://localhost:9090/api/v1/query?query=histogram_quantile(0.95,+rate(http_request_duration_seconds_bucket[5m]))

   # Check memory usage
   curl http://localhost:9090/api/v1/query?query=process_memory_usage_bytes
   ```

2. **Identify Slow Endpoints**

   ```bash
   # Find slowest endpoints
   grep '"http_request_duration_seconds"' logs/metrics.log | jq -r '.endpoint, .duration' | paste - - | sort -k2 -nr | head -10
   ```

3. **Database Query Analysis**

   ```javascript
   // Enable MongoDB profiler
   db.setProfilingLevel(2, { slowms: 100 });

   // Check slow queries
   db.system.profile.find().sort({ ts: -1 }).limit(5);
   ```

4. **Cache Performance**
   ```bash
   # Check Redis hit rate
   redis-cli INFO stats | grep keyspace_hits
   redis-cli INFO stats | grep keyspace_misses
   ```

### Performance Problems

#### Memory Leaks

**Detection:**

```javascript
// Memory usage monitoring
setInterval(() => {
  const usage = process.memoryUsage();
  console.log(
    `Memory: RSS=${usage.rss}, Heap=${usage.heapUsed}/${usage.heapTotal}`
  );

  if (usage.heapUsed > 0.8 * usage.heapTotal) {
    console.warn('High memory usage detected');
  }
}, 30000);
```

**Resolution:**

```javascript
// Force garbage collection (if --expose-gc flag used)
if (global.gc) {
  global.gc();
}

// Check for memory leaks
const memwatch = require('memwatch-next');
memwatch.on('leak', (info) => {
  logger.error('Memory leak detected', info);
});
```

#### Database Connection Issues

**Symptoms:**

- Connection timeouts
- High connection count
- Query failures

**Resolution:**

```javascript
// Connection pool configuration
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10, // Maximum connection pool size
  serverSelectionTimeoutMS: 5000, // Timeout for server selection
  socketTimeoutMS: 45000, // Socket timeout
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
});

// Connection monitoring
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});
```

### Service Failures

#### Circuit Breaker Pattern

```javascript
// Circuit breaker implementation
class CircuitBreaker {
  constructor(failureThreshold = 5, recoveryTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeout = recoveryTimeout;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = 0;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.recoveryTimeout;
      logger.warn('Circuit breaker opened', {
        failureCount: this.failureCount,
      });
    }
  }
}

// Usage
const aiServiceBreaker = new CircuitBreaker(3, 30000);

async function callAIService(prompt) {
  return aiServiceBreaker.execute(async () => {
    return await openai.createCompletion({ prompt });
  });
}
```

#### Graceful Shutdown

```javascript
// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, starting graceful shutdown`);

  // Stop accepting new requests
  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close database connections
      await mongoose.connection.close();
      logger.info('Database connections closed');

      // Close Redis connections
      await redis.quit();
      logger.info('Redis connections closed');

      // Close external service connections
      await closeExternalConnections();

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', error);
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
}
```

### Database Issues

#### Connection Pool Exhaustion

**Symptoms:**

- "connection pool exhausted" errors
- Slow database queries
- High memory usage

**Resolution:**

```javascript
// Optimize connection pool
const connectionOptions = {
  maxPoolSize: parseInt(process.env.MAX_CONNECTIONS) || 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  bufferMaxEntries: 0,
  bufferCommands: false,
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions);

// Monitor connection pool
setInterval(() => {
  const stats = mongoose.connection.db.serverStatus();
  logger.info('Connection pool stats', {
    poolSize: stats.connections.totalCreated,
    available: stats.connections.available,
    active: stats.connections.active,
  });
}, 60000);
```

#### Index Optimization

```javascript
// Database index management
async function ensureIndexes() {
  const db = mongoose.connection.db;

  // User collection indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ createdAt: 1 });
  await db.collection('users').createIndex({ lastLogin: 1 });

  // Birth chart indexes
  await db.collection('birthcharts').createIndex({ userId: 1 });
  await db.collection('birthcharts').createIndex({ createdAt: -1 });
  await db.collection('birthcharts').createIndex({ 'planets.sun.sign': 1 });

  logger.info('Database indexes ensured');
}

// Analyze slow queries and suggest indexes
async function analyzeQueryPerformance() {
  const slowQueries = await db
    .collection('system.profile')
    .find({ millis: { $gt: 100 } })
    .sort({ ts: -1 })
    .limit(10)
    .toArray();

  for (const query of slowQueries) {
    logger.info('Slow query detected', {
      collection: query.ns,
      operation: query.op,
      duration: query.millis,
      query: query.query,
    });
  }
}
```

## Incident Response

### Severity Levels

#### Severity Classification

1. **SEV-1 (Critical)**
   - Complete service outage
   - Data loss or corruption
   - Security breach
   - Response time: Immediate (< 15 minutes)

2. **SEV-2 (High)**
   - Major functionality broken
   - Performance degradation affecting users
   - Response time: < 1 hour

3. **SEV-3 (Medium)**
   - Minor functionality issues
   - Intermittent problems
   - Response time: < 4 hours

4. **SEV-4 (Low)**
   - Cosmetic issues
   - Non-critical bugs
   - Response time: Next business day

#### Incident Declaration

```javascript
// Incident declaration template
function declareIncident(severity, title, description) {
  const incident = {
    id: generateIncidentId(),
    severity,
    title,
    description,
    declaredAt: new Date(),
    status: 'INVESTIGATING',
    affectedServices: [],
    impact: '',
    timeline: [
      {
        timestamp: new Date(),
        status: 'INCIDENT_DECLARED',
        message: `Incident declared: ${title}`,
      },
    ],
    responders: [],
    communication: [],
  };

  // Log incident
  logger.error('INCIDENT_DECLARED', incident);

  // Notify team
  notifyTeam(incident);

  return incident;
}
```

### Response Procedures

#### SEV-1 Response (Critical)

1. **Immediate Actions (< 5 minutes)**

   ```bash
   # Assess impact
   curl -s https://zodiacore-production.onrender.com/health

   # Check monitoring dashboards
   # Notify on-call engineer via PagerDuty/Slack

   # Start incident response channel
   # Declare incident in communication tools
   ```

2. **Investigation (< 15 minutes)**

   ```bash
   # Check recent deployments
   # Review error logs
   grep "ERROR\|FATAL" logs/error.log | tail -20

   # Check system resources
   # Verify external dependencies
   ```

3. **Mitigation (< 1 hour)**

   ```bash
   # Rollback if deployment-related
   # Scale resources if capacity issue
   # Restart services if needed
   # Implement temporary fixes
   ```

4. **Resolution**
   ```bash
   # Deploy permanent fix
   # Verify service recovery
   # Update monitoring
   ```

#### Communication Template

```javascript
// Incident communication template
function sendIncidentUpdate(incident, update) {
  const message = {
    incidentId: incident.id,
    severity: incident.severity,
    status: incident.status,
    title: incident.title,
    impact: incident.impact,
    currentStatus: update.message,
    eta: update.eta,
    nextUpdate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    affectedUsers: incident.affectedUsers || 'Unknown',
  };

  // Send to all communication channels
  sendToSlack(message);
  sendToEmail(message);
  updateStatusPage(message);

  // Log communication
  incident.communication.push({
    timestamp: new Date(),
    type: 'UPDATE',
    message: update.message,
    channel: 'ALL',
  });
}
```

### Communication Plan

#### Internal Communication

- **Slack Channel**: `#incidents` for real-time updates
- **PagerDuty**: For on-call notifications
- **Email**: For detailed updates and post-mortems

#### External Communication

- **Status Page**: Public status page updates
- **Twitter**: For widespread outages
- **Email**: For affected customers

#### Communication Guidelines

1. **Be Transparent**: Share what you know, what you don't know
2. **Be Timely**: Regular updates every 30-60 minutes
3. **Be Empathetic**: Acknowledge user impact
4. **Be Action-Oriented**: Focus on resolution steps

### Post-Incident Review

#### Post-Mortem Template

```markdown
# Incident Post-Mortem: [Incident Title]

## Incident Summary

- **Date/Time**: [When it happened]
- **Duration**: [How long]
- **Impact**: [What was affected]
- **Severity**: [SEV level]

## Timeline

- [Time] Incident started
- [Time] Incident detected
- [Time] Incident declared
- [Time] Mitigation started
- [Time] Service restored

## Root Cause

[Detailed analysis of what caused the incident]

## Impact Assessment

- Users affected: [number/percentage]
- Business impact: [description]
- Data loss: [yes/no, details]

## Resolution

[What was done to fix the issue]

## Prevention

[Actions to prevent similar incidents]

## Lessons Learned

- What went well
- What went poorly
- What could be improved

## Action Items

- [ ] [Action 1] - Owner: [Person] - Due: [Date]
- [ ] [Action 2] - Owner: [Person] - Due: [Date]
```

#### Follow-up Actions

```javascript
// Action item tracking
class ActionItem {
  constructor(description, owner, dueDate, priority = 'MEDIUM') {
    this.id = generateId();
    this.description = description;
    this.owner = owner;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = 'OPEN';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  complete() {
    this.status = 'COMPLETED';
    this.updatedAt = new Date();
  }

  update(progress) {
    this.status = 'IN_PROGRESS';
    this.updatedAt = new Date();
    // Log progress
  }
}

// Track action items from post-mortems
async function trackActionItems(incidentId, actionItems) {
  for (const item of actionItems) {
    await createActionItem(incidentId, item);
  }

  // Schedule follow-ups
  scheduleFollowUps(actionItems);
}
```

## Security Considerations

### Access Control

#### Authentication & Authorization

```javascript
// JWT authentication middleware
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Invalid JWT token', {
        error: err.message,
        ip: req.ip,
        correlationId: req.correlationId,
      });
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
}

// Role-based authorization
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user.roles.includes(role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        requiredRole: role,
        userRoles: req.user.roles,
        correlationId: req.correlationId,
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
```

#### API Rate Limiting

```javascript
// Rate limiting implementation
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      correlationId: req.correlationId,
    });
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// Apply rate limiting
app.use('/api/', apiLimiter);

// Stricter limits for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts',
});

app.use('/api/auth/login', strictLimiter);
```

### Data Protection

#### Data Encryption

```javascript
// Data encryption utilities
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('additional-auth-data'));

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

function decrypt(encryptedData) {
  const decipher = crypto.createDecipher(algorithm, key);
  decipher.setAAD(Buffer.from('additional-auth-data'));
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Usage for sensitive user data
async function saveUserData(userId, sensitiveData) {
  const encrypted = encrypt(JSON.stringify(sensitiveData));
  await db.collection('user_data').insertOne({
    userId,
    data: encrypted,
    createdAt: new Date(),
  });
}
```

#### Input Validation & Sanitization

```javascript
// Input validation middleware
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

function validateAndSanitizeInput(req, res, next) {
  // Validate email
  if (req.body.email && !validator.isEmail(req.body.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Sanitize HTML input
  if (req.body.description) {
    req.body.description = sanitizeHtml(req.body.description, {
      allowedTags: ['p', 'br', 'strong', 'em'],
      allowedAttributes: {}
    });
  }

  // Validate and sanitize birth data
  if (req
```
