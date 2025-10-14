# Production MongoDB Atlas Cluster Configuration for ZodiaCore

## Overview

This document outlines the MongoDB Atlas cluster configuration for the ZodiaCore platform using the free M0 tier, supporting microservices architecture with independent databases for astrology services (ZC1-ZC4). The configuration follows DB-first principles while working within the constraints of the free tier (512 MB storage, shared RAM, shared vCPU). This setup is suitable for development and initial production testing, with clear upgrade paths documented for future scaling.

## Cluster Architecture

### Multi-Cluster Setup for Microservices

ZodiaCore implements separate MongoDB Atlas clusters for each astrology system to ensure service independence, adapted for free tier limitations:

- **ZC1-Vedic Cluster**: Vedic astrology calculations and data
- **ZC2-Chinese Cluster**: Chinese astrology (BaZi, Feng Shui) data
- **ZC3-Western Cluster**: Western astrology calculations and data
- **ZC4-Numerology Cluster**: Numerology calculations and data
- **Core Cluster**: Shared user management, sessions, and cross-system data

**Free Tier Constraints:**

- Each cluster limited to 512 MB storage
- Shared resources may impact performance during peak usage
- Single region deployment only
- No multi-AZ availability
- Manual scaling required for upgrades

### Cluster Tier Selection

**Current Free Tier Configuration:**

| Cluster        | Tier | vCPU   | RAM    | Storage | Use Case                                   |
| -------------- | ---- | ------ | ------ | ------- | ------------------------------------------ |
| ZC1-Vedic      | M0   | Shared | Shared | 512MB   | Vedic calculations (monitor usage closely) |
| ZC2-Chinese    | M0   | Shared | Shared | 512MB   | Lunar calendar and BaZi computations       |
| ZC3-Western    | M0   | Shared | Shared | 512MB   | Transit and synastry calculations          |
| ZC4-Numerology | M0   | Shared | Shared | 512MB   | Lightweight numerology operations          |
| Core           | M0   | Shared | Shared | 512MB   | User management and sessions               |

**Rationale:**

- Free M0 tier provides sufficient resources for initial development and testing
- Cost-effective for proof-of-concept and early production validation
- Clear upgrade path to production tiers when storage/compute limits are reached

**Future Upgrade Considerations:**

- Monitor storage usage and upgrade to M10+ when approaching 400MB per cluster
- Plan for dedicated resources when shared vCPU/RAM impacts performance
- Consider multi-region deployment for production availability requirements

## Region and Availability Configuration

### Primary Region Selection

**Current Free Tier Regions:**

- **AWS us-east-1 (N. Virginia)**: Default free tier region with good connectivity
- **Single Region Only**: Free tier does not support multi-region deployment

### Availability Zones

**Free Tier Limitations:**

- **Single Availability Zone**: No multi-AZ deployment available
- **No Replica Sets**: Free tier operates without replica sets for high availability
- **Downtime Risk**: Potential service interruptions during maintenance windows

**Future Production Setup:**

- Multi-AZ deployment with minimum 3 availability zones
- Cross-region replication for disaster recovery
- Read-only nodes in secondary regions for scaling

## Backup and Recovery Configuration

### Free Tier Backup Limitations

**Current Capabilities:**

- **No Automated Backups**: Free tier does not include backup functionality
- **Manual Exports**: Data can be exported manually via MongoDB Compass or mongodump
- **No Point-in-Time Recovery**: Not available in free tier

**Recommended Practices:**

- **Regular Manual Backups**: Export critical data weekly using mongodump
- **Local Backup Storage**: Store backups in secure, version-controlled locations
- **Data Export Scripts**: Automate backup process using custom scripts

### Disaster Recovery

**Free Tier Constraints:**

- **No Built-in DR**: Rely on manual backup and restore procedures
- **RTO/RPO**: Dependent on manual processes (hours/days)
- **No Failover**: Single point of failure in free tier

**Future Production Configuration:**

- Continuous backup with point-in-time recovery
- 35-day retention period for compliance
- Cross-region backup replication
- Automated DR testing procedures

## Security Configuration

### Authentication and Authorization

**Database Users (Free Tier Adapted):**

```javascript
// Free tier database users with basic permissions
const dbUsers = [
  {
    name: 'zc1-service-user',
    roles: [
      { role: 'readWrite', db: 'zc1-vedic-db' },
      { role: 'read', db: 'core-db' },
    ],
    // Note: IP restrictions limited in free tier
  },
  {
    name: 'zc2-service-user',
    roles: [
      { role: 'readWrite', db: 'zc2-chinese-db' },
      { role: 'read', db: 'core-db' },
    ],
  },
  // Similar for ZC3, ZC4, and admin users
];
```

**Authentication Methods:**

- **SCRAM-SHA-256**: Primary authentication mechanism
- **Basic Security**: Free tier supports fundamental security features

**Free Tier Limitations:**

- No X.509 certificate authentication
- No AWS IAM integration
- Basic IP whitelisting only

### Network Security

**IP Access Control:**

- **IP Whitelisting**: Available but limited to basic configuration
- **No VPC Peering**: Not supported in free tier
- **No Private Endpoints**: Public endpoints only

**Network Encryption:**

- **TLS 1.2/1.3**: Supported for secure connections
- **Basic Encryption**: Standard TLS implementation

**Future Production Security:**

- AWS PrivateLink for secure connectivity
- Advanced network security features
- VPC peering with hosting platforms

### Data Encryption

**Free Tier Encryption:**

- **At-Rest Encryption**: Basic AES-256 encryption provided
- **In-Transit**: TLS encryption for all connections

**Limitations:**

- No customer-managed keys
- No field-level encryption
- Basic encryption management

## Scaling and Performance Configuration

### Free Tier Scaling Limitations

**Current Capabilities:**

- **No Auto-Scaling**: Manual tier upgrades required
- **Storage Limit**: Hard 512MB cap per cluster
- **Shared Resources**: Performance varies with other free tier users

### Performance Optimization

**Connection Configuration:**

- **Limited Pooling**: Maximum 10-20 connections recommended
- **Timeout Settings**: Standard MongoDB timeout configurations
- **Resource Monitoring**: Essential due to shared environment

**Indexing Strategy:**

- **Essential Indexes Only**: Minimize index overhead within storage limits
- **TTL Indexes**: For temporary data cleanup
- **Query Optimization**: Critical for performance within constraints

### Query Optimization

**Free Tier Monitoring:**

- **Basic Query Profiling**: Limited monitoring capabilities
- **Manual Optimization**: Regular query analysis required
- **Resource Alerts**: Monitor for performance degradation

## Monitoring and Alerting Setup

### Atlas Monitoring (Free Tier)

**Available Metrics:**

- **Basic Health Monitoring**: CPU, Memory, Disk I/O (shared resources)
- **Connection Metrics**: Active connection tracking
- **Storage Usage**: Critical 512MB limit monitoring

### Custom Alerts

**Free Tier Alert Configuration:**

| Metric           | Threshold     | Action                             |
| ---------------- | ------------- | ---------------------------------- |
| Storage Usage    | > 80% (409MB) | Immediate data cleanup/archiving   |
| Memory Usage     | > 85%         | Optimize queries, consider upgrade |
| Connection Count | > 15          | Review connection pooling          |
| Query Latency    | > 1000ms      | Query optimization required        |

**Limitations:**

- No advanced alerting features
- Manual monitoring required
- Limited historical data retention

### Future Production Monitoring

**Enhanced Setup:**

- Comprehensive Prometheus/Grafana integration
- Advanced alerting with PagerDuty
- Detailed performance dashboards
- Anomaly detection capabilities

## Database User Management

### User Roles and Permissions

**Free Tier Setup:**

- **Basic Read-Write Users**: For each microservice
- **Admin Users**: Limited administrative access
- **Simple Permissions**: Database-level access control

**Access Control:**

- **Basic Role-Based Access**: Fundamental permission management
- **IP Restrictions**: Simple whitelisting available

### User Lifecycle Management

**Free Tier Practices:**

- **Manual Rotation**: Credentials updated as needed
- **Basic Auditing**: Limited access logging
- **Security Reviews**: Regular permission verification

## Pre-Configuration Setup

### Initial Collections and Indexes

**Core Database Collections (Adapted for Free Tier):**

```javascript
// User management collections - keep minimal
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'created_at'],
      properties: {
        email: { bsonType: 'string', pattern: '^.+@.+$' },
        preferences: { bsonType: 'object' },
      },
    },
  },
});

// Session management - reduced TTL for storage efficiency
db.createCollection('sessions', {
  expireAfterSeconds: 3600, // 1 hour (reduced from 24h)
});

// Calculation cache - shorter TTL to manage storage
db.createCollection('calculation_cache', {
  expireAfterSeconds: 1800, // 30 minutes (reduced from 1h)
});
```

**Storage-Efficient Indexes:**

```javascript
// Essential indexes only
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ created_at: 1 });

// Session indexes
db.sessions.createIndex({ user_id: 1, created_at: -1 });

// Cache indexes
db.calculation_cache.createIndex({ cache_key: 1 }, { unique: true });
db.calculation_cache.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
```

### Database Initialization Scripts

**Free Tier Considerations:**

- **Minimal Schema**: Keep initial setup lightweight
- **Version Control**: Track all changes despite simple setup
- **Testing**: Validate in free tier environment

## Integration Points with Microservices

### Connection Strings

**Environment Variables (Free Tier):**

```bash
# ZC1 Vedic Service
MONGODB_ZC1_URI=mongodb+srv://zc1-service-user:password@zc1-vedic-cluster.mongodb.net/zc1-vedic-db?retryWrites=true&w=majority

# ZC2 Chinese Service
MONGODB_ZC2_URI=mongodb+srv://zc2-service-user:password@zc2-chinese-cluster.mongodb.net/zc2-chinese-db?retryWrites=true&w=majority

# Core Service
MONGODB_CORE_URI=mongodb+srv://core-service-user:password@core-cluster.mongodb.net/core-db?retryWrites=true&w=majority
```

### Connection Pooling Configuration

**Free Tier Optimized Setup:**

```javascript
const mongoose = require('mongoose');

const connectionOptions = {
  maxPoolSize: 5, // Reduced for free tier (from 10)
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0,
  maxIdleTimeMS: 30000,
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions);
```

### Health Check Endpoints

**Basic Health Checks:**

- **Database Connectivity**: Essential monitoring for free tier stability
- **Storage Usage**: Critical health metric
- **Connection Status**: Monitor shared resource usage

## Cost Optimization

### Free Tier Resource Management

**Monitoring and Adjustment:**

- **Usage Tracking**: Daily monitoring of storage and performance
- **Data Cleanup**: Regular removal of unnecessary data
- **Query Optimization**: Minimize resource consumption

### Future Production Cost Management

**Strategies:**

- Auto-scaling policies for variable loads
- Tiered storage and backup retention
- Resource optimization based on usage patterns

## Compliance and Governance

### Data Residency

**Free Tier Limitations:**

- **Single Region**: Data stored in selected free tier region only
- **Basic Compliance**: Fundamental data protection measures

**Future Production Compliance:**

- Multi-region data residency options
- Enhanced GDPR compliance features
- Advanced audit and logging capabilities

### Audit and Logging

**Free Tier Capabilities:**

- **Basic Access Logging**: Fundamental authentication logging
- **Manual Auditing**: Regular review of access patterns

## Deployment Checklist

### Pre-Deployment

- [ ] Atlas account configured (free tier)
- [ ] Database users created with basic permissions
- [ ] Initial collections and indexes created
- [ ] Connection strings configured in environment
- [ ] Basic security settings applied
- [ ] Storage usage monitoring set up

### Post-Deployment

- [ ] Connection testing from all microservices
- [ ] Basic performance validation
- [ ] Manual backup procedures documented
- [ ] Storage monitoring alerts configured

## Maintenance Procedures

### Regular Maintenance

**Daily Tasks:**

- Monitor storage usage across all clusters
- Check connection health
- Review performance metrics

**Weekly Tasks:**

- Manual backup of critical data
- Clean up expired cached data
- Verify user permissions

**Monthly Tasks:**

- Review resource utilization
- Assess upgrade readiness
- Security configuration review

## Future Production Upgrade Path

### Phase 1: Basic Production (M10-M20)

- Upgrade to dedicated resources
- Enable automated backups
- Implement multi-region deployment
- Add comprehensive monitoring

### Phase 2: Enterprise Scale (M30+)

- Advanced security features
- Cross-region replication
- Enhanced backup and DR
- Full observability suite

### Migration Strategy

- **Gradual Migration**: Upgrade clusters individually based on usage
- **Data Migration**: Plan for seamless data transfer during upgrades
- **Testing**: Validate performance improvements post-upgrade
- **Rollback Plan**: Ability to revert if issues arise

This configuration provides a functional MongoDB Atlas setup for ZodiaCore using the free tier, with clear limitations documented and upgrade paths defined for future production scaling while maintaining the microservices architecture principles.
