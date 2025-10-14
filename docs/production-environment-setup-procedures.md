# Production Environment Setup Procedures

## Overview

This comprehensive guide documents the step-by-step procedures for setting up the ZodiaCore production environment as specified in microtask 0.3.10 of the implementation plan. The production environment consists of MongoDB Atlas clusters, Render hosting services, and supporting infrastructure for the astrology web application.

The setup procedures cover nine key microtasks (0.3.1 through 0.3.9) that establish a secure, scalable, and monitored production environment following the project's microservices architecture and DevOps principles.

## Prerequisites

### Required Accounts and Access
- **MongoDB Atlas Account**: Paid tier (M10+) for production features
- **Render Account**: With billing enabled for production services
- **Domain Registrar**: Administrative access to domain management
- **GitHub Repository**: With Actions enabled and proper permissions

### Technical Prerequisites
- Node.js 20.x LTS installed locally
- Docker and Docker Compose for containerization
- Git for version control
- Basic knowledge of cloud platforms and infrastructure

### Security Prerequisites
- Strong, unique passwords for all service accounts
- Two-factor authentication enabled on all accounts
- Secure storage for API keys and secrets
- Understanding of least privilege access principles

### Network Prerequisites
- Stable internet connection for cloud service configuration
- Access to configure DNS records with domain registrar
- Ability to whitelist IP addresses in MongoDB Atlas

## Microtask Procedures

### 0.3.1: Configure Production MongoDB Atlas Cluster Settings

**Objective**: Set up a production-ready MongoDB Atlas cluster with appropriate scaling, security, and monitoring configurations.

**Estimated Time**: 45 minutes

#### Step 1: Create Production Cluster
1. Log in to MongoDB Atlas dashboard
2. Click "Create" → "New Project" for production environment
3. Name the project "ZodiaCore-Production"
4. Select M10 cluster tier (minimum for production backups)
5. Choose AWS as cloud provider with us-east-1 region
6. Configure cluster settings:
   - Cluster Name: `zodiacore-prod-cluster`
   - Version: Latest stable MongoDB version
   - Backup: Enabled (35-day retention)

#### Step 2: Configure Network Security
1. Navigate to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Configure IP whitelisting:
   - Add Render service IP ranges (0.0.0.0/0 for initial setup, restrict later)
   - Add development IP addresses for maintenance access
4. Set up VPC peering if using private networking

#### Step 3: Create Database Users
1. Go to "Database Access" section
2. Click "Add New Database User"
3. Create application user:
   - Username: `zodiacore-prod-user`
   - Password: Generate strong password (store securely)
   - Authentication Method: SCRAM
   - Database User Privileges: Read and write to `zodiacore` database
4. Create admin user for maintenance:
   - Username: `zodiacore-prod-admin`
   - Password: Generate strong password
   - Role: `atlasAdmin` for the cluster

#### Step 4: Configure Database Settings
1. Access cluster via "Connect" button
2. Set up database:
   ```javascript
   use zodiacore
   db.createCollection("users")
   db.createCollection("birthcharts")
   db.createCollection("calculations")
   ```

#### Step 5: Enable Monitoring and Alerts
1. Go to "Alerts" section
2. Configure production alerts:
   - Connection count > 80%
   - Disk usage > 80%
   - CPU usage > 80%
   - Memory usage > 80%
   - Backup failures

**Security Considerations**:
- Use strong, unique passwords for all users
- Implement IP whitelisting (avoid 0.0.0.0/0 in production)
- Enable database auditing for compliance
- Regularly rotate database user credentials

**Verification**:
```bash
# Test connection
mongosh "mongodb+srv://zodiacore-prod-user:<password>@zodiacore-prod-cluster.xxxxx.mongodb.net/zodiacore?retryWrites=true&w=majority"
```

### 0.3.2: Set Up Production Render Services (2 Servers)

**Objective**: Deploy two Render services - one for live production and one for dev/staging environments.

**Estimated Time**: 30 minutes

#### Step 1: Create Production Service
1. Log in to Render dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure service settings:
   - Name: `zodiacore-production`
   - Environment: Production
   - Branch: `main`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

#### Step 2: Configure Service Resources
1. Select service plan (Starter plan minimum, upgrade based on needs)
2. Set environment variables (detailed in 0.3.3)
3. Configure health checks:
   - Health Check Path: `/health`
   - Health Check Timeout: 30 seconds

#### Step 3: Create Staging Service
1. Repeat steps 1-2 for staging environment
2. Configure staging service:
   - Name: `zodiacore-staging`
   - Environment: Staging
   - Branch: `develop` or `staging`
   - Same runtime and commands as production

#### Step 4: Set Up Service Dependencies
1. Configure service dependencies if using private services
2. Set up environment-specific configurations
3. Configure auto-scaling if needed (paid plans only)

#### Step 5: Enable Service Monitoring
1. Enable Render's built-in monitoring
2. Configure uptime monitoring
3. Set up error notifications

**Security Considerations**:
- Use separate services for production and staging
- Implement proper access controls
- Enable HTTPS-only traffic
- Configure appropriate firewall rules

**Verification**:
```bash
# Test production service
curl https://zodiacore-production.onrender.com/health

# Test staging service
curl https://zodiacore-staging.onrender.com/health
```

### 0.3.3: Configure Production Environment Variables in Render

**Objective**: Set up secure environment variable management for production and staging services.

**Estimated Time**: 20 minutes

#### Step 1: Identify Required Variables
Based on application requirements, configure these environment variables:

**Core Configuration**:
```
NODE_ENV=production
PORT=10000
LOG_LEVEL=info
```

**Database Configuration**:
```
MONGODB_URI=mongodb+srv://zodiacore-prod-user:<password>@zodiacore-prod-cluster.xxxxx.mongodb.net/zodiacore?retryWrites=true&w=majority
MONGODB_DB_NAME=zodiacore
```

**Authentication & Security**:
```
JWT_SECRET=<256-bit-secret>
ENCRYPTION_KEY=<256-bit-key>
BCRYPT_ROUNDS=12
```

**External Services**:
```
OPENAI_API_KEY=<openai-key>
ANTHROPIC_API_KEY=<anthropic-key>
GOOGLE_API_KEY=<google-key>
```

**Monitoring & Logging**:
```
METRICS_UPDATE_INTERVAL=30
CORRELATION_ID_HEADER=X-Correlation-ID
LOG_RETENTION_DAYS=30
```

#### Step 2: Configure in Render Dashboard
1. Access each service's "Environment" tab
2. Add environment variables securely
3. Use Render's secret management for sensitive values
4. Configure environment-specific values for staging vs production

#### Step 3: Environment Variable Validation
Implement startup validation in application code:

```javascript
// Validate required environment variables
const requiredVars = [
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'OPENAI_API_KEY'
];

function validateEnvironment() {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

#### Step 4: Secure Secret Management
1. Never commit secrets to version control
2. Use Render's environment variable encryption
3. Rotate secrets regularly
4. Implement secret versioning for rollbacks

**Security Considerations**:
- Store sensitive data as environment variables only
- Use strong encryption for secrets
- Implement proper access controls for environment variables
- Regularly audit and rotate secrets

### 0.3.4: Set Up Production Database Connections and Security

**Objective**: Establish secure, optimized database connections with proper authentication and access controls.

**Estimated Time**: 25 minutes

#### Step 1: Configure Connection Pooling
Update application database configuration for production:

```javascript
// MongoDB connection configuration
const mongoose = require('mongoose');

const connectionOptions = {
  maxPoolSize: 10, // Maximum connection pool size
  minPoolSize: 2,   // Minimum connection pool size
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions);
```

#### Step 2: Implement Connection Monitoring
Add connection health monitoring:

```javascript
// Connection event handlers
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', { error: err.message });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

#### Step 3: Configure Database Security
1. Enable MongoDB Atlas security features:
   - SSL/TLS encryption (enabled by default)
   - Database auditing
   - Field-level encryption for sensitive data
2. Implement application-level security:
   - Input validation and sanitization
   - SQL injection prevention (parameterized queries)
   - Rate limiting for database operations

#### Step 4: Set Up Database Indexes
Create essential indexes for performance:

```javascript
// User collection indexes
await db.collection('users').createIndex({ email: 1 }, { unique: true });
await db.collection('users').createIndex({ createdAt: 1 });

// Birth chart indexes
await db.collection('birthcharts').createIndex({ userId: 1 });
await db.collection('birthcharts').createIndex({ createdAt: -1 });
await db.collection('birthcharts').createIndex({ 'planets.sun.sign': 1 });
```

**Security Considerations**:
- Use SSL/TLS for all database connections
- Implement proper authentication and authorization
- Enable database auditing and logging
- Regularly update and patch database systems

### 0.3.5: Configure Production Logging and Monitoring Basics

**Objective**: Implement centralized logging and basic monitoring for production operations.

**Estimated Time**: 35 minutes

#### Step 1: Set Up Application Logging
Configure Winston logger for production:

```javascript
// backend/logger.js
const winston = require('winston');

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: productionFormat,
  transports: [
    // Error log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Combined log
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760,
      maxFiles: 5,
    }),
    // Console for Render logging
    new winston.transports.Console({
      format: productionFormat,
    }),
  ],
});
```

#### Step 2: Implement Correlation ID Tracing
Add request tracing middleware:

```javascript
// Correlation ID middleware
function correlationIdMiddleware(req, res, next) {
  const correlationId = req.headers['x-correlation-id'] ||
                       req.headers['x-request-id'] ||
                       generateCorrelationId();

  res.set('X-Correlation-ID', correlationId);
  req.correlationId = correlationId;

  req.logger = logger.child({ correlationId });
  next();
}
```

#### Step 3: Set Up Health Check Endpoint
Implement comprehensive health checks:

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Database connectivity check
    await mongoose.connection.db.admin().ping();

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'zodiacore-main',
      version: process.env.npm_package_version,
      database: {
        status: 'connected',
        latency: await measureDbLatency(),
      },
      system: {
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      },
    };

    res.json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});
```

#### Step 4: Configure Basic Monitoring
Set up Prometheus-compatible metrics:

```javascript
// backend/metrics.js
const promClient = require('prom-client');

const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

register.registerMetric(httpRequestDuration);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

**Security Considerations**:
- Implement log sanitization to prevent sensitive data leakage
- Use structured logging for better analysis
- Implement log rotation and retention policies
- Secure access to monitoring endpoints

### 0.3.6: Set Up Production Backup Procedures for MongoDB Atlas

**Objective**: Implement automated backup procedures with proper retention and recovery testing.

**Estimated Time**: 40 minutes

#### Step 1: Enable Automated Backups
1. In MongoDB Atlas dashboard, navigate to cluster
2. Click "Backup" tab
3. Click "Enable Backup"
4. Select backup tier (35-day retention recommended)
5. Configure backup schedule:
   - Frequency: Daily
   - Time: 02:00 UTC
   - Retention: 35 days

#### Step 2: Configure Backup Policies
Set up retention policies for different data types:

```yaml
# Backup retention configuration
backup_policies:
  user_data:
    retention_days: 2555  # 7 years for GDPR compliance
    frequency: daily
  calculation_results:
    retention_days: 730   # 2 years for analysis
    frequency: daily
  session_data:
    retention_days: 30    # 30 days temporary
    frequency: daily
  configuration:
    retention_days: 365   # 1 year for rollback
    frequency: weekly
```

#### Step 3: Set Up Backup Monitoring
Configure backup alerts and monitoring:

1. Enable backup failure notifications
2. Set up backup size monitoring
3. Configure backup restoration testing
4. Implement backup verification procedures

#### Step 4: Create Backup Testing Procedures
Implement automated backup verification:

```bash
#!/bin/bash
# backup-verification.sh

BACKUP_DIR="/tmp/backup-test"
mkdir -p $BACKUP_DIR

# Test backup restoration
mongorestore \
  --uri="${TEST_MONGODB_URI}" \
  --archive="${LATEST_BACKUP_FILE}" \
  --gzip \
  --drop

# Verify data integrity
mongosh "${TEST_MONGODB_URI}" --eval "
  db.getCollectionNames().forEach(function(collection) {
    var count = db[collection].countDocuments();
    print(collection + ': ' + count + ' documents');
  });
"
```

**Security Considerations**:
- Encrypt backup data at rest and in transit
- Implement access controls for backup files
- Regularly test backup restoration procedures
- Store backups in secure, geographically distributed locations

### 0.3.7: Configure Production Domain and SSL Certificates

**Objective**: Set up custom domain with automatic SSL certificate management.

**Estimated Time**: 25 minutes

#### Step 1: Add Custom Domain in Render
1. Access Render service dashboard
2. Navigate to "Settings" → "Custom Domains"
3. Click "Add Custom Domain"
4. Enter domain: `app.zodiacore.com` (or your chosen domain)
5. Render generates DNS records for configuration

#### Step 2: Configure DNS Records
Update DNS settings with domain registrar:

**CNAME Record**:
- Type: CNAME
- Name: `app` (or root if using apex domain)
- Value: Render-provided CNAME target
- TTL: 300

**TXT Record for Verification**:
- Type: TXT
- Name: `_render_verification.app`
- Value: Render-provided verification code
- TTL: 300

#### Step 3: SSL Certificate Setup
Render automatically handles SSL certificate provisioning:

1. SSL certificates are issued by Let's Encrypt
2. Automatic renewal before expiration
3. Full certificate chain included
4. Compatible with all modern browsers

#### Step 4: Domain Verification
1. Wait for DNS propagation (up to 48 hours)
2. Monitor domain status in Render dashboard
3. Test SSL certificate validity:
   ```bash
   openssl s_client -connect app.zodiacore.com:443 -servername app.zodiacore.com
   ```

#### Step 5: Security Headers Configuration
Implement security headers in application:

```javascript
// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
```

**Security Considerations**:
- Use HTTPS-only for all production traffic
- Implement HSTS headers for enhanced security
- Regularly monitor SSL certificate expiration
- Configure proper CAA records if required

### 0.3.8: Test Production Environment Connectivity

**Objective**: Verify all production services are properly connected and functioning.

**Estimated Time**: 30 minutes

#### Step 1: Database Connectivity Testing
Test MongoDB Atlas connection:

```bash
# Test connection from application server
mongosh "${MONGODB_URI}" --eval "db.adminCommand('ping')"

# Test database operations
mongosh "${MONGODB_URI}" --eval "
  use zodiacore
  db.users.findOne()
  db.birthcharts.findOne()
"
```

#### Step 2: External Service Connectivity
Verify connections to external APIs:

```bash
# Test OpenAI API
curl -H "Authorization: Bearer ${OPENAI_API_KEY}" \
     https://api.openai.com/v1/models

# Test Anthropic API
curl -H "Authorization: Bearer ${ANTHROPIC_API_KEY}" \
     https://api.anthropic.com/v1/messages

# Test Google AI API
curl -H "Authorization: Bearer ${GOOGLE_API_KEY}" \
     https://generativelanguage.googleapis.com/v1/models
```

#### Step 3: Application Health Checks
Comprehensive health verification:

```bash
# Test health endpoint
curl -H "X-Correlation-ID: test-123" \
     https://app.zodiacore.com/health

# Test API endpoints
curl https://app.zodiacore.com/api/v1/status

# Test authentication
curl -X POST https://app.zodiacore.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
```

#### Step 4: Load Testing
Basic load testing to verify scalability:

```bash
# Simple load test with curl
for i in {1..10}; do
  curl -s https://app.zodiacore.com/health &
done
wait

# Check response times
curl -o /dev/null -s -w "%{time_total}\n" \
     https://app.zodiacore.com/health
```

#### Step 5: Security Testing
Basic security verification:

```bash
# Test SSL configuration
openssl s_client -connect app.zodiacore.com:443 \
                -servername app.zodiacore.com \
                -tlsextdebug

# Check security headers
curl -I https://app.zodiacore.com/

# Test rate limiting
for i in {1..20}; do
  curl -s https://app.zodiacore.com/api/test &
done
```

### 0.3.9: Set Up Production Deployment Pipeline

**Objective**: Configure automated CI/CD pipeline for production deployments.

**Estimated Time**: 45 minutes

#### Step 1: Configure GitHub Actions Workflow
Create production deployment workflow:

```yaml
# .github/workflows/production-deployment.yml
name: Production Deployment

on:
  push:
    branches: [ main, production ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'production'
        type: choice
        options:
        - production
        - staging

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security scan
        run: npm audit --audit-level moderate

  build-and-test:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"serviceId": "${{ secrets.RENDER_SERVICE_ID }}"}' \
            https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys
```

#### Step 2: Configure Required Secrets
Set up GitHub repository secrets:

```
RENDER_API_KEY=<render-api-key>
RENDER_SERVICE_ID=<render-service-id>
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<jwt-secret>
OPENAI_API_KEY=<openai-key>
```

#### Step 3: Set Up Deployment Environments
Configure GitHub environments:

1. Create "production" environment
2. Add required reviewers for production deployments
3. Configure environment-specific variables

#### Step 4: Implement Rollback Procedures
Add rollback capability to pipeline:

```yaml
# Rollback job
rollback:
  needs: deploy
  runs-on: ubuntu-latest
  if: failure()
  steps:
    - name: Rollback deployment
      run: |
        curl -X POST \
          -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
          https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/rollbacks
```

#### Step 5: Configure Notifications
Set up deployment notifications:

```yaml
# Notification step
notify:
  needs: [deploy, rollback]
  runs-on: ubuntu-latest
  if: always()
  steps:
    - name: Send Slack notification
      run: |
        curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"Production deployment ${{ job.status }}"}' \
        ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Security Considerations**:
- Implement branch protection rules
- Require code reviews for production deployments
- Use secure secrets management
- Implement deployment approval workflows

## Security Considerations

### Access Control
- Implement least privilege access for all services
- Use strong authentication for administrative access
- Regularly rotate API keys and passwords
- Enable multi-factor authentication where available

### Data Protection
- Encrypt sensitive data at rest and in transit
- Implement proper input validation and sanitization
- Use parameterized queries to prevent injection attacks
- Regularly audit and monitor data access

### Network Security
- Configure firewalls and security groups appropriately
- Use HTTPS for all external communications
- Implement rate limiting to prevent abuse
- Monitor for suspicious activity and anomalies

### Compliance
- Follow GDPR requirements for data handling
- Implement proper audit logging
- Maintain data retention policies
- Regular security assessments and penetration testing

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Failures
**Symptoms**: Application unable to connect to MongoDB Atlas
**Solutions**:
- Verify connection string and credentials
- Check IP whitelisting in Atlas
- Confirm network connectivity
- Review MongoDB Atlas status page

#### SSL Certificate Issues
**Symptoms**: HTTPS not working or certificate errors
**Solutions**:
- Verify DNS configuration
- Check certificate expiration
- Confirm domain ownership
- Contact Render support for certificate issues

#### Deployment Failures
**Symptoms**: GitHub Actions deployment fails
**Solutions**:
- Check build logs for errors
- Verify environment variables
- Confirm service quotas and limits
- Review GitHub Actions permissions

#### Performance Issues
**Symptoms**: Slow response times or high resource usage
**Solutions**:
- Monitor application metrics
- Check database query performance
- Review resource allocation
- Implement caching strategies

### Support Resources

- **Render Support**: https://docs.render.com/
- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Let's Encrypt**: https://letsencrypt.org/docs/

## Cross-References

- [`docs/production-deployment-pipeline.md`](production-deployment-pipeline.md) - Detailed CI/CD pipeline documentation
- [`docs/mongodb-atlas-backup-procedures.md`](mongodb-atlas-backup-procedures.md) - Comprehensive backup procedures
- [`docs/production-domain-ssl-configuration.md`](production-domain-ssl-configuration.md) - Domain and SSL setup guide
- [`docs/production-operations-guide.md`](production-operations-guide.md) - Production operations and monitoring

---

**Document Version**: 1.0
**Last Updated**: October 2024
**Microtask**: 0.3.10