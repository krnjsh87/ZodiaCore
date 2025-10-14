# MongoDB Atlas Production Backup Procedures

## Overview

This document outlines comprehensive backup procedures for MongoDB Atlas in the ZodiaCore production environment. It covers backup features, configuration procedures, verification methods, and compliance considerations for astrology calculation data.

## MongoDB Atlas Backup Features

### Free Tier (M0) Limitations

- **No Automated Backups**: Free tier does not include automated backup functionality
- **Manual Exports Only**: Data must be exported manually using MongoDB Compass or mongodump
- **No Point-in-Time Recovery**: Not available in free tier
- **No On-Demand Backups**: Not supported

### Paid Tier Features (M10+)

- **Automated Snapshots**: Daily snapshots with configurable retention
- **Point-in-Time Recovery**: Restore to any point within retention window
- **On-Demand Backups**: Manual backup creation anytime
- **Cross-Region Backup**: Backup replication to secondary regions
- **Continuous Backup**: Real-time backup with minimal RPO

## Backup Strategy for Astrology Data

### Data Classification

- **Critical Data**: User birth charts, calculation results, personal astrology data
- **Operational Data**: Session data, cache, temporary calculations
- **Configuration Data**: System settings, constants, reference data

### Backup Frequency Recommendations

| Data Type           | Free Tier | Paid Tier | Rationale                           |
| ------------------- | --------- | --------- | ----------------------------------- |
| User Birth Charts   | Weekly    | Daily     | High business value, user data      |
| Calculation Results | Weekly    | Daily     | Computational intensive to recreate |
| Session Data        | N/A       | Daily     | Temporary, low retention needed     |
| Configuration       | Monthly   | Weekly    | Changes infrequently                |
| Cache Data          | N/A       | N/A       | Ephemeral, can be recreated         |

### Retention Policies

| Data Type           | Retention Period | Rationale                                     |
| ------------------- | ---------------- | --------------------------------------------- |
| User Data           | 7 years          | Legal compliance, user expectations           |
| Calculation Results | 2 years          | Historical analysis, performance optimization |
| Session Data        | 30 days          | Security, temporary nature                    |
| Configuration       | 1 year           | Version control, rollback capability          |
| Audit Logs          | 7 years          | Compliance requirements                       |

## Backup Configuration Procedures

### Free Tier Manual Backup Setup

#### Step 1: Prepare Backup Environment

```bash
# Install MongoDB Database Tools locally
# Download from: https://www.mongodb.com/try/download/database-tools

# Create backup directory structure
mkdir -p /backups/zodiacore/{daily,weekly,monthly}
mkdir -p /backups/zodiacore/scripts
```

#### Step 2: Create Backup Script

```bash
#!/bin/bash
# backup-mongodb-free-tier.sh

# Configuration
BACKUP_ROOT="/backups/zodiacore"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_TYPE=$1  # daily, weekly, monthly

# Database connections (from environment variables)
ZC1_URI="${MONGODB_ZC1_URI}"
ZC2_URI="${MONGODB_ZC2_URI}"
ZC3_URI="${MONGODB_ZC3_URI}"
ZC4_URI="${MONGODB_ZC4_URI}"
CORE_URI="${MONGODB_CORE_URI}"

# Create backup directory
BACKUP_DIR="${BACKUP_ROOT}/${BACKUP_TYPE}/${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"

echo "Starting ${BACKUP_TYPE} backup: ${TIMESTAMP}"

# Backup each cluster
backup_cluster() {
    local cluster_name=$1
    local uri=$2
    local cluster_dir="${BACKUP_DIR}/${cluster_name}"

    echo "Backing up ${cluster_name}..."

    mongodump \
        --uri="${uri}" \
        --out="${cluster_dir}" \
        --gzip \
        --quiet

    if [ $? -eq 0 ]; then
        echo "${cluster_name} backup completed successfully"
        # Compress backup
        tar -czf "${cluster_dir}.tar.gz" -C "${BACKUP_DIR}" "${cluster_name}"
        rm -rf "${cluster_dir}"
    else
        echo "ERROR: ${cluster_name} backup failed!"
        exit 1
    fi
}

# Backup all clusters
backup_cluster "zc1-vedic" "${ZC1_URI}"
backup_cluster "zc2-chinese" "${ZC2_URI}"
backup_cluster "zc3-western" "${ZC3_URI}"
backup_cluster "zc4-numerology" "${ZC4_URI}"
backup_cluster "core" "${CORE_URI}"

echo "All backups completed successfully"
```

#### Step 3: Schedule Automated Backups

```bash
# Add to crontab for automated execution
# Daily backup at 2 AM
0 2 * * * /backups/zodiacore/scripts/backup-mongodb-free-tier.sh daily

# Weekly backup every Sunday at 3 AM
0 3 * * 0 /backups/zodiacore/scripts/backup-mongodb-free-tier.sh weekly

# Monthly backup on 1st at 4 AM
0 4 1 * * /backups/zodiacore/scripts/backup-mongodb-free-tier.sh monthly
```

### Paid Tier Automated Backup Setup

#### Step 1: Enable Backup in Atlas Dashboard

1. Navigate to your cluster in MongoDB Atlas
2. Click "Backup" tab
3. Click "Enable Backup"
4. Select backup tier (recommended: 35-day retention)

#### Step 2: Configure Snapshot Schedule

```yaml
# Recommended snapshot configuration
backup_schedule:
  frequency: daily
  time: '02:00' # 2 AM UTC
  retention_days: 35
  point_in_time_recovery: enabled
```

#### Step 3: Set Up Cross-Region Backup (Optional)

1. In Backup settings, enable "Cross-Region Backup"
2. Select secondary region for backup replication
3. Configure retention for cross-region backups

#### Step 4: Configure On-Demand Backups

1. Go to "Backup" → "On-Demand Backup"
2. Click "Create On-Demand Backup"
3. Select retention period (up to 1 year)

## Backup Verification Procedures

### Automated Verification Script

```bash
#!/bin/bash
# verify-backup.sh

BACKUP_DIR=$1
LOG_FILE="/var/log/backup-verification.log"

echo "$(date): Starting backup verification for ${BACKUP_DIR}" >> "${LOG_FILE}"

# Verify backup integrity
verify_backup() {
    local cluster_name=$1
    local backup_file="${BACKUP_DIR}/${cluster_name}.tar.gz"

    if [ ! -f "${backup_file}" ]; then
        echo "ERROR: Backup file ${backup_file} not found" >> "${LOG_FILE}"
        return 1
    fi

    # Check file size (should be > 0)
    local size=$(stat -f%z "${backup_file}" 2>/dev/null || stat -c%s "${backup_file}")
    if [ "${size}" -eq 0 ]; then
        echo "ERROR: Backup file ${backup_file} is empty" >> "${LOG_FILE}"
        return 1
    fi

    # Verify gzip integrity
    if ! gzip -t "${backup_file}"; then
        echo "ERROR: Backup file ${backup_file} is corrupted" >> "${LOG_FILE}"
        return 1
    fi

    echo "SUCCESS: ${cluster_name} backup verified" >> "${LOG_FILE}"
    return 0
}

# Verify all cluster backups
verify_backup "zc1-vedic"
verify_backup "zc2-chinese"
verify_backup "zc3-western"
verify_backup "zc4-numerology"
verify_backup "core"

echo "$(date): Backup verification completed" >> "${LOG_FILE}"
```

### Manual Verification Steps

1. **File Integrity Check**: Verify backup files exist and are not corrupted
2. **Size Validation**: Ensure backup sizes are reasonable for data volume
3. **Content Verification**: Spot-check key collections in backup
4. **Restore Test**: Perform test restoration (see below)

## Restoration Testing Procedures

### Free Tier Restore Test

```bash
#!/bin/bash
# test-restore.sh

# Configuration
TEST_DB="zodiacore_restore_test"
BACKUP_FILE=$1

echo "Starting restore test with backup: ${BACKUP_FILE}"

# Create test database
mongosh --eval "use ${TEST_DB}"

# Restore from backup
mongorestore \
    --db="${TEST_DB}" \
    --archive="${BACKUP_FILE}" \
    --gzip \
    --drop

if [ $? -eq 0 ]; then
    echo "Restore test successful"

    # Verify key collections exist
    mongosh "${TEST_DB}" --eval "
        db.getCollectionNames().forEach(function(collection) {
            var count = db[collection].countDocuments();
            print(collection + ': ' + count + ' documents');
        });
    "

    # Clean up test database
    mongosh --eval "db.dropDatabase()"
else
    echo "ERROR: Restore test failed!"
    exit 1
fi
```

### Paid Tier Point-in-Time Recovery Test

1. **Access Backup Section**: Go to cluster → Backup → Restore
2. **Select Restore Type**: Choose "Point-in-Time" or "Snapshot"
3. **Choose Target**: Select date/time or specific snapshot
4. **Select Target Cluster**: Choose existing or create new cluster
5. **Execute Restore**: Click "Restore" and monitor progress
6. **Verify Data**: Connect to restored cluster and validate data integrity

### Full Disaster Recovery Test

```bash
# disaster-recovery-test.sh

# 1. Create new Atlas cluster for testing
# 2. Restore from latest backup
# 3. Update application configuration to point to test cluster
# 4. Run application integration tests
# 5. Verify all services function correctly
# 6. Document RTO (Recovery Time Objective) and RPO (Recovery Point Objective)
```

## Compliance Considerations

### Data Protection Regulations

- **GDPR**: 7-year retention for personal data, right to erasure
- **CCPA**: Data minimization, consumer rights
- **Industry Standards**: ISO 27001, SOC 2 compliance

### Audit Requirements

- **Backup Logs**: Maintain detailed logs of all backup operations
- **Access Controls**: Restrict backup access to authorized personnel
- **Encryption**: Ensure backups are encrypted at rest and in transit

### Retention Compliance

```javascript
// Backup retention policy enforcement
const retentionPolicies = {
  user_data: { retention: 7 * 365 * 24 * 60 * 60 * 1000 }, // 7 years
  calculations: { retention: 2 * 365 * 24 * 60 * 60 * 1000 }, // 2 years
  sessions: { retention: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  audit_logs: { retention: 7 * 365 * 24 * 60 * 60 * 1000 }, // 7 years
};

// Automated cleanup function
async function enforceRetentionPolicies() {
  const now = new Date();

  for (const [collection, policy] of Object.entries(retentionPolicies)) {
    const cutoffDate = new Date(now.getTime() - policy.retention);

    await db.collection(collection).deleteMany({
      createdAt: { $lt: cutoffDate },
    });
  }
}
```

## Monitoring and Alerting

### Backup Health Monitoring

```javascript
// Backup monitoring dashboard metrics
const backupMetrics = {
  lastBackupTime: null,
  backupSuccess: true,
  backupSize: 0,
  verificationStatus: 'pending',
  retentionCompliance: true,
};

// Alert conditions
const alertConditions = [
  {
    condition: 'lastBackupTime > 25 hours ago',
    severity: 'critical',
    message: 'Daily backup overdue',
  },
  {
    condition: 'backupSuccess == false',
    severity: 'critical',
    message: 'Backup operation failed',
  },
  {
    condition: 'verificationStatus == failed',
    severity: 'warning',
    message: 'Backup verification failed',
  },
];
```

### Automated Alerts

- **Backup Failure**: Immediate notification to operations team
- **Backup Overdue**: Warning when backup hasn't run within expected window
- **Storage Threshold**: Alert when backup storage exceeds capacity
- **Verification Failure**: Notification when backup integrity checks fail

## Cost Optimization

### Free Tier Cost Management

- **Storage Monitoring**: Track backup sizes to stay within 512MB limit
- **Compression**: Use gzip compression to minimize storage usage
- **Cleanup Scripts**: Automated removal of old backups

### Paid Tier Cost Optimization

- **Tier Selection**: Choose appropriate backup tier based on data volume
- **Retention Tuning**: Adjust retention periods based on compliance requirements
- **Cross-Region**: Enable only when disaster recovery justifies cost

## Operational Procedures

### Daily Operations

1. Monitor backup job completion
2. Review backup logs for errors
3. Verify backup file integrity
4. Check storage utilization

### Weekly Operations

1. Perform manual backup verification
2. Review backup retention compliance
3. Test restore procedures (quarterly)
4. Update backup scripts if needed

### Monthly Operations

1. Full disaster recovery test
2. Review backup costs and optimization
3. Audit backup access and security
4. Update retention policies if required

### Incident Response

1. **Backup Failure**: Immediate investigation and manual backup execution
2. **Data Corruption**: Restore from last known good backup
3. **Storage Full**: Immediate cleanup or tier upgrade
4. **Security Breach**: Quarantine affected backups, restore from clean source

## Migration to Paid Tier

### Upgrade Checklist

- [ ] Assess data volume and growth projections
- [ ] Choose appropriate Atlas tier (M10+ for backups)
- [ ] Plan migration window (low-traffic period)
- [ ] Test backup configuration in staging
- [ ] Update monitoring and alerting
- [ ] Train team on new backup features
- [ ] Execute migration with rollback plan

### Post-Upgrade Validation

- [ ] Verify automated backups are running
- [ ] Test point-in-time recovery
- [ ] Confirm cross-region replication (if enabled)
- [ ] Update documentation and procedures
- [ ] Monitor costs and adjust as needed

This backup strategy ensures data protection, compliance, and business continuity for ZodiaCore's astrology calculation data across all deployment tiers.
