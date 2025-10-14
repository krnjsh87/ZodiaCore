# Production Deployment Pipeline Documentation

## Overview

The ZodiaCore production deployment pipeline implements a comprehensive CI/CD workflow that ensures secure, reliable, and automated deployments to production environments. This pipeline is built using GitHub Actions and integrates with Render for hosting, MongoDB Atlas for data persistence, and various notification systems.

## Pipeline Architecture

```mermaid
graph TD
    A[Push to main/production] --> B[Security Scan]
    C[Manual Dispatch] --> B
    B --> D[Build & Test]
    D --> E[Environment Validation]
    E --> F[Deploy to Render]
    F --> G{Health Check}
    G -->|Pass| H[Post-Deploy Tests]
    G -->|Fail| I[Rollback]
    H --> J[Notifications]
    I --> J
    F -->|Fail| I
```

## Pipeline Jobs

### 1. Security Scanning (`security-scan`)

**Purpose**: Performs comprehensive security analysis before deployment.

**Steps**:
- Dependency vulnerability scanning using `npm audit`
- Code linting and validation with GitHub Super Linter
- Static code analysis with CodeQL for JavaScript

**Duration**: ~15 minutes

**Failure Behavior**: Pipeline stops if security issues are found.

### 2. Build and Test (`build-and-test`)

**Purpose**: Ensures code quality and builds the application.

**Steps**:
- Install dependencies for backend and frontend
- Run linting checks
- Execute tests with coverage reporting
- Enforce minimum 80% test coverage
- Build the application
- Upload build artifacts and test results

**Duration**: ~20 minutes

**Coverage Requirements**: Minimum 80% line coverage required.

### 3. Environment Validation (`environment-validation`)

**Purpose**: Validates production environment readiness.

**Steps**:
- Check required environment variables
- Run production connectivity tests
- Validate MongoDB Atlas connection

**Duration**: ~10 minutes

**Required Environment Variables**:
- `MONGODB_URI`
- `JWT_SECRET`
- `RENDER_EXTERNAL_URL`

### 4. Deploy (`deploy`)

**Purpose**: Deploys the application to Render.

**Steps**:
- Deploy using Render API
- Wait for deployment completion
- Perform health checks
- Run post-deployment connectivity tests

**Duration**: ~15 minutes

**Health Check Endpoint**: `GET /health`

### 5. Rollback (`rollback`)

**Purpose**: Automatically rollback to previous stable version on deployment failure.

**Steps**:
- Identify last successful deployment
- Trigger rollback via Render API
- Verify rollback health
- Send rollback notifications

**Duration**: ~10 minutes

### 6. Notifications (`notifications`)

**Purpose**: Send deployment status notifications.

**Supported Channels**:
- Slack (webhook-based)
- Email (SMTP)
- GitHub Actions summary

## Prerequisites and Setup

### Repository Requirements

1. **GitHub Repository** with Actions enabled
2. **Render Account** with service configured
3. **MongoDB Atlas** cluster set up
4. **Node.js 18** runtime environment

### Required Secrets Configuration

Configure the following secrets in GitHub repository settings:

#### Required Secrets

| Secret | Description | Example |
|--------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret | `your-256-bit-secret` |
| `RENDER_EXTERNAL_URL` | Render service URL | `https://zodiacore.onrender.com` |
| `RENDER_SERVICE_ID` | Render service identifier | `srv-xxx` |
| `RENDER_API_KEY` | Render API key | `rnd_xxx` |

#### Optional Secrets (for notifications)

| Secret | Description | Example |
|--------|-------------|---------|
| `SLACK_WEBHOOK_URL` | Slack webhook URL | `https://hooks.slack.com/...` |
| `SMTP_SERVER` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `user@gmail.com` |
| `SMTP_PASS` | SMTP password | `app-password` |
| `SMTP_FROM` | From email address | `ci@zodiacore.com` |
| `NOTIFICATION_EMAILS` | Comma-separated email list | `devops@company.com,team@company.com` |

### Environment Variables Setup

#### Render Environment Variables

Set these in your Render service dashboard:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-256-bit-secret
NODE_ENV=production
```

#### Local Development Variables

Create `.env` file for local testing:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-256-bit-secret
RENDER_EXTERNAL_URL=http://localhost:3000
NODE_ENV=development
```

## Workflow Triggers

### Automatic Triggers

The pipeline runs automatically on:
- Push to `main` branch
- Push to `production` branch

### Manual Execution

Use GitHub Actions workflow dispatch:

1. Go to **Actions** tab in GitHub
2. Select **Production Deployment** workflow
3. Click **Run workflow**
4. Choose environment (`production` or `staging`)
5. Click **Run workflow**

## Step-by-Step Deployment Guide

### 1. Prepare Your Code

```bash
# Ensure you're on main branch
git checkout main

# Pull latest changes
git pull origin main

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "feat: add new astrology feature"

# Push to trigger deployment
git push origin main
```

### 2. Monitor Pipeline Execution

1. Go to **Actions** tab in GitHub
2. Click on the running **Production Deployment** workflow
3. Monitor each job's progress:
   - **Security Scan**: Check for vulnerabilities
   - **Build & Test**: Verify code quality
   - **Environment Validation**: Confirm configuration
   - **Deploy**: Watch deployment progress
   - **Notifications**: Check status updates

### 3. Verify Deployment

After successful deployment:

```bash
# Check application health
curl https://your-app.onrender.com/health

# Run connectivity tests
npm run test:production
```

## Troubleshooting Common Issues

### Pipeline Failures

#### Security Scan Failures

**Symptom**: Security scan job fails with audit errors.

**Solutions**:
```bash
# Update vulnerable dependencies
npm audit fix

# For breaking changes, update manually
npm update package@latest

# If vulnerability is acceptable, add to .nsprc
{
  "exceptions": ["package@version"]
}
```

#### Test Coverage Below Threshold

**Symptom**: Build fails with "Test coverage below 80%".

**Solutions**:
```bash
# Run coverage report
npm run test:coverage

# Add missing tests
# Create test files in tests/ directory

# Update coverage configuration in package.json
"jest": {
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/index.js"
  ]
}
```

#### Environment Variable Missing

**Symptom**: Environment validation fails.

**Solutions**:
1. Check GitHub secrets are set correctly
2. Verify Render environment variables
3. Ensure variable names match exactly

#### MongoDB Connection Failure

**Symptom**: "MongoDB Atlas connection failed".

**Solutions**:
```bash
# Test connection locally
node -e "
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
client.connect().then(() => {
  console.log('Connected');
  client.close();
}).catch(console.error);
"

# Check MongoDB Atlas:
# 1. IP whitelist includes 0.0.0.0/0
# 2. Database user has read/write permissions
# 3. Connection string is correct
```

#### Health Check Failures

**Symptom**: Deployment succeeds but health check fails.

**Solutions**:
```bash
# Check application logs in Render dashboard
# Verify /health endpoint exists
curl -I https://your-app.onrender.com/health

# Check application startup
# Ensure all services are initialized
```

### Rollback Scenarios

#### Automatic Rollback

The pipeline automatically rolls back on:
- Deployment failure
- Health check failure
- Post-deployment test failure

#### Manual Rollback

To manually rollback via Render dashboard:

1. Go to Render service dashboard
2. Click **Manual Deploy**
3. Select **Rollback to previous deploy**
4. Click **Deploy**

### Notification Issues

#### Slack Notifications Not Working

**Check**:
- `SLACK_WEBHOOK_URL` secret is set
- Webhook URL is valid
- Slack app has proper permissions

#### Email Notifications Not Working

**Check**:
- All SMTP secrets are configured
- SMTP server allows less secure apps
- Firewall allows SMTP port

## Monitoring and Maintenance

### Health Monitoring

#### Application Health Checks

```bash
# Continuous health monitoring
while true; do
  if curl -f https://your-app.onrender.com/health; then
    echo "$(date): Health OK"
  else
    echo "$(date): Health FAIL"
  fi
  sleep 300  # Check every 5 minutes
done
```

#### Render Metrics

Monitor in Render dashboard:
- Response times
- Error rates
- CPU/Memory usage
- Request volume

### Log Monitoring

#### Application Logs

Access logs via:
- Render dashboard → Logs tab
- GitHub Actions → Workflow runs → Logs

#### Error Patterns

Common error patterns to monitor:

```javascript
// Log aggregation example
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add external logging service
  ]
});
```

### Performance Monitoring

#### Key Metrics

- Response time < 500ms
- Error rate < 1%
- Test coverage > 80%
- Deployment success rate > 95%

#### Monitoring Tools

```yaml
# Example Prometheus metrics
metrics:
  - name: http_requests_total
    type: counter
    help: Total number of HTTP requests
  - name: http_request_duration_seconds
    type: histogram
    help: HTTP request duration in seconds
```

### Maintenance Procedures

#### Regular Tasks

**Weekly**:
- Review security scan results
- Check test coverage trends
- Monitor error rates

**Monthly**:
- Update dependencies
- Review pipeline performance
- Audit secrets rotation

#### Emergency Procedures

**Service Outage**:
1. Check Render status page
2. Review application logs
3. Trigger manual rollback if needed
4. Notify stakeholders

**Security Incident**:
1. Stop pipeline execution
2. Rotate compromised secrets
3. Audit access logs
4. Deploy security patches

## Best Practices

### Development Workflow

1. **Branch Strategy**: Use feature branches, merge to main via PR
2. **Code Reviews**: Required for all changes
3. **Testing**: Write tests for new features
4. **Security**: Address vulnerabilities promptly

### Deployment Strategy

1. **Blue-Green**: Use staging environment for testing
2. **Canary**: Gradual rollout for major changes
3. **Rollback Plan**: Always have rollback strategy
4. **Monitoring**: Monitor post-deployment metrics

### Security Considerations

1. **Secrets Management**: Never commit secrets to code
2. **Access Control**: Least privilege principle
3. **Vulnerability Scanning**: Regular dependency updates
4. **Audit Logging**: Log all deployment activities

## Support and Resources

### Documentation Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deployment Guide](https://docs.render.com/deploy-github)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

### Getting Help

- **Pipeline Issues**: Check GitHub Actions logs
- **Render Support**: Use Render dashboard support
- **MongoDB Issues**: Check Atlas monitoring

### Contact Information

- **DevOps Team**: devops@zodiacore.com
- **Security Team**: security@zodiacore.com
- **Development Team**: dev@zodiacore.com

---

**Last Updated**: October 2024
**Version**: 1.0
**Pipeline Version**: Microtask 0.3.9