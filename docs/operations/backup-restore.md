# Firestore Backup and Restore

## Overview

Firestore backup and restore ensures data can be recovered after accidental deletion, corruption, or failed migrations.

## Backup Strategies

### Strategy 1: Managed Export (Blaze plan only)

Firestore managed export requires the Blaze plan and a Cloud Storage bucket.

```bash
# Export all collections
gcloud firestore export gs://gift-buddy-backups/$(date +%Y-%m-%d)

# Export specific collections
gcloud firestore export gs://gift-buddy-backups/$(date +%Y-%m-%d) \
  --collection-ids=products,orders,customers,inquiries
```

### Strategy 2: Script-Based Export (Spark compatible)

Use the Firebase Admin SDK to export data as JSON files.

```bash
node scripts/backup-firestore.js --output=./backups/$(date +%Y-%m-%d)
```

The script should:
1. Authenticate with a service account or emulator
2. Read all documents from specified collections
3. Preserve document IDs, subcollections, and timestamps
4. Write each collection to a separate JSON file
5. Log document counts for verification

### Strategy 3: Emulator Data Export (Development)

```bash
# Export emulator state
firebase emulators:export ./emulator-backup

# Import on next start
firebase emulators:start --import=./emulator-backup
```

## Backup Schedule

| Environment | Method | Frequency | Retention |
|------------|--------|-----------|-----------|
| Production (Blaze) | Managed export | Daily | 30 days |
| Production (Spark) | Script export | Weekly (manual) | 4 exports |
| Development | Emulator export | Before destructive changes | As needed |

## Restore Procedures

### From managed export (Blaze)

```bash
gcloud firestore import gs://gift-buddy-backups/2024-01-15
```

**Warning**: Import overwrites existing documents with matching IDs but does not delete documents absent from the backup.

### From JSON export

```bash
node scripts/restore-firestore.js --input=./backups/2024-01-15 --collections=products,orders
```

The restore script should:
1. Validate document structure before writing
2. Use batch writes (max 500 per batch)
3. Skip existing documents unless `--overwrite` is specified
4. Report counts of created, skipped, and failed documents

### Emulator data

```bash
firebase emulators:start --import=./emulator-backup
```

## Pre-Restore Checklist

- [ ] Identify the cause of data loss to prevent recurrence
- [ ] Verify the backup predates the data loss event
- [ ] Take a fresh backup of the current state (even if corrupted)
- [ ] Notify team members
- [ ] Test the restore in an emulator first

## Post-Restore Verification

- [ ] Document counts match expected values
- [ ] Spot-check 5-10 documents per collection for integrity
- [ ] Application functions correctly with restored data
- [ ] Firestore indexes are active
- [ ] Security Rules apply correctly
- [ ] Critical flows work: catalog, inquiry submission, admin operations

## Data Retention Policy

| Collection | Retention | Notes |
|-----------|-----------|-------|
| products | Indefinite | Soft-delete via archived status |
| orders | 3 years minimum | Regulatory compliance |
| inquiries | 1 year after resolution | Scheduled purge |
| customers | Until deletion requested | Manual deletion workflow |
| auditLogs | 5 years | Append-only, never delete |
| webhookEvents | 90 days | Automated cleanup |
| conversations/messages | 1 year | Automated cleanup |
| notificationJobs | 30 days after completion | Automated cleanup |

## Disaster Recovery Scenarios

### Accidental collection deletion

1. Stop writes to prevent further data loss
2. Identify the most recent pre-deletion backup
3. Restore from backup
4. Verify data integrity
5. Resume the application
6. Review access controls

### Corrupted migration

1. Identify affected documents via audit logs
2. Restore only the affected collection from the pre-migration backup
3. Fix the migration script
4. Re-run the corrected migration

### Project compromise

1. Revoke all service account keys immediately
2. Rotate Firebase web app credentials
3. Review audit logs
4. Restore from last known-good backup
5. Deploy fresh Security Rules
6. Rotate all environment secrets
7. Follow the incident response process in SECURITY.md
