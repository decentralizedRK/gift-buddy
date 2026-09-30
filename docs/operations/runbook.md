# Operations Runbook

## Health Checks

### Application health

| Check | Method | Expected |
|-------|--------|----------|
| Home page | `curl -s -o /dev/null -w "%{http_code}" https://gift-buddy.web.app` | 200 |
| Admin page | `curl -s -o /dev/null -w "%{http_code}" https://gift-buddy.web.app/admin` | 200 (login redirect) |
| Webhook endpoint | GET with valid verify_token and challenge | 200 with challenge echo |

### Firebase health

| Check | Location | Expected |
|-------|----------|----------|
| Firestore | Firebase Console > Firestore > Data | Collections visible |
| Auth | Firebase Console > Authentication > Users | Admin users listed |
| Hosting | Firebase Console > Hosting > Dashboard | Active deployment |
| Quotas | Firebase Console > Usage and billing | Within limits |

## Common Issues and Resolution

### "Permission denied" in Firestore

**Symptoms**: Blank pages or error states; console shows `FirebaseError: Missing or insufficient permissions`.

**Resolution**:
1. Check the active Security Rules in Firebase Console > Firestore > Rules
2. Verify `firebase/firestore.rules` matches expected access patterns
3. For admin access: verify the user has an `adminUsers` document matching their UID
4. Redeploy rules if stale: `firebase deploy --only firestore:rules`

### Admin login fails

**Symptoms**: Valid admin user cannot log in or sees "unauthorized" after login.

**Resolution**:
1. Confirm the user exists in Firebase Console > Authentication
2. Check `adminUsers` collection for a document with the user's UID as document ID
3. Check browser console for specific error messages
4. Verify `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` matches the project

### Inquiry form submission fails

**Symptoms**: Customer sees error after submitting the inquiry form.

**Resolution**:
1. Check browser console and network tab for the failing request
2. Verify Firestore write quota has not been exceeded (Firebase Console > Usage)
3. Check that required fields pass Zod validation
4. Verify the `inquiries` collection exists and rules allow public writes

### WhatsApp webhook not receiving events

**Symptoms**: Inbound messages do not appear in admin panel.

**Resolution**:
1. Verify webhook URL in Meta App Dashboard matches the deployed endpoint
2. Confirm `WHATSAPP_VERIFY_TOKEN` matches between Meta config and app environment
3. Test webhook verification manually with a GET request
4. Check server logs for signature validation failures
5. Verify `WHATSAPP_APP_SECRET` is correctly set in production

### WhatsApp messages not sending

**Symptoms**: Order status changes do not trigger WhatsApp notifications.

**Resolution**:
1. Confirm `WHATSAPP_PROVIDER=cloud` in production (not `fake`)
2. Verify `WHATSAPP_ACCESS_TOKEN` is valid (tokens can expire)
3. Check `notificationJobs` collection for `failed` or `dead_letter` entries
4. Review template approval status in Meta Business Manager
5. Verify customer phone number is in valid E.164 format

### Firebase quota exceeded

**Symptoms**: Application returns errors; quota warnings in Console.

**Resolution**:
1. Check Firebase Console > Usage and billing for which quota is hit
2. Identify expensive queries (unbounded reads, missing indexes)
3. Spark plan: consider upgrading to Blaze
4. Blaze plan: review budget alerts and optimize queries

### Deployment fails in GitHub Actions

**Resolution**:
1. Check workflow run logs in GitHub Actions
2. Verify `FIREBASE_SERVICE_ACCOUNT` secret is valid
3. Ensure the service account has necessary IAM roles
4. Run `npm run build` locally to reproduce build errors

## Escalation

| Level | Definition | Response | Examples |
|-------|-----------|----------|----------|
| P1 | Service down | Immediate | Site unreachable, data corruption |
| P2 | Major feature broken | 2 hours | Orders not processing, admin inaccessible |
| P3 | Feature degraded | 1 business day | WhatsApp delays, slow search |
| P4 | Minor issue | 1 week | Cosmetic bug, typo |

### Escalation path

1. Check this runbook and attempt resolution
2. Application owner reviews logs, deploys fix
3. Firebase support for platform issues (Console > Support)
4. Meta support for WhatsApp API issues (Meta Business Help Center)

## Maintenance Procedures

### Updating dependencies

```bash
npm outdated          # Check for updates
npm update            # Update within semver ranges
npm audit             # Check for vulnerabilities
npm audit fix         # Auto-fix where safe
```

### Rotating secrets

1. Generate new credentials in the relevant platform
2. Update GitHub Secrets with new values
3. Update production environment variables
4. Verify the application works with new credentials
5. Revoke the old credentials
6. Document the rotation in the audit log
