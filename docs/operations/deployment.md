# Deployment Guide

## Overview

Gift Buddy deploys to Firebase Hosting with GitHub Actions for CI/CD. The pipeline supports three environments: local development, preview/staging, and production.

## Environments

| Environment | Trigger | Firebase Project | URL |
|------------|---------|-----------------|-----|
| Local | `npm run dev` | Emulators | http://localhost:3000 |
| Preview | PR opened/updated | Staging project | `https://gift-buddy-staging--pr-N.web.app` |
| Production | Merge to `main` | Production project | Custom domain or `.web.app` |

## Prerequisites

1. Firebase project created (see [firebase-setup.md](firebase-setup.md))
2. Firebase CLI installed and authenticated
3. GitHub repository secrets configured
4. Firebase Hosting initialized in the project

## GitHub Secrets

Configure in **Settings > Secrets and variables > Actions**:

| Secret | Description |
|--------|-------------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (for deployment) |
| `FIREBASE_PROJECT_ID` | Production project ID |
| `FIREBASE_PROJECT_ID_STAGING` | Staging project ID (optional) |

Generate a service account key:
1. Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Store the JSON content as `FIREBASE_SERVICE_ACCOUNT` secret

## CI/CD Pipeline

### Verify Workflow (on every PR)

Runs on `pull_request` to `main`:
1. Install dependencies (`npm ci`)
2. Format check (`npm run format:check`)
3. Lint (`npm run lint`)
4. Type check (`npm run typecheck`)
5. Unit/component tests (`npm test`)
6. Production build (`npm run build`)
7. Deploy preview to Firebase Hosting (optional)

### Deploy Workflow (on merge to main)

Runs on `push` to `main` after verify passes:
1. Install dependencies
2. Full verification suite
3. Production build
4. Deploy Firestore rules and indexes
5. Deploy to Firebase Hosting
6. Smoke test the deployed URL

## Manual Deployment

```bash
# Login and select project
firebase login
firebase use gift-buddy

# Build the application
npm run build

# Deploy everything
firebase deploy

# Or deploy specific targets
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Deployment Order

Deploy in this order to avoid breakage when changes span multiple services:

1. **Firestore indexes** -- new indexes must be built before queries that use them
2. **Firestore rules** -- updated rules should match the deployed data model
3. **Hosting** -- application code deployed last, after backend is ready

```bash
firebase deploy --only firestore:indexes
# Wait for index build to complete (check Firebase Console)
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

## Post-Deployment Verification

After every deployment, verify:

- [ ] Home page loads at the deployed URL
- [ ] Product catalog displays products
- [ ] Product detail pages render correctly
- [ ] Inquiry form submits successfully
- [ ] Admin login page loads at `/admin`
- [ ] Unauthenticated users cannot access admin routes
- [ ] WhatsApp webhook verification endpoint responds (GET)
- [ ] No console errors in browser dev tools

### Smoke test script

```bash
DEPLOY_URL="https://gift-buddy.web.app"
curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL"         # Expect 200
curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/admin"    # Expect 200 (login page)
```

## Rollback

### Via Firebase Console

1. Firebase Console > Hosting
2. View release history
3. Click "Rollback" on the last known good release

### Via CLI

```bash
firebase hosting:clone <source-site>:<source-version> <target-site>:live
```

### Firestore rules rollback

Rules are not versioned by Firebase. Redeploy from a known-good Git commit:

```bash
git checkout <known-good-commit> -- firebase/firestore.rules
firebase deploy --only firestore:rules
```

## Custom Domain

1. Firebase Console > Hosting > Add custom domain
2. Enter your domain (e.g., `giftbuddy.in`)
3. Add the DNS records Firebase provides (TXT for verification, A/CNAME for routing)
4. Wait for SSL provisioning (automatic, up to 24 hours)
5. Update `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` to match

## Deployment Checklist

- [ ] All CI checks pass (format, lint, types, tests, build)
- [ ] No critical or high security findings
- [ ] Environment variables configured in production
- [ ] Firebase rules and indexes deployed
- [ ] Application deployed
- [ ] Post-deployment smoke tests pass
- [ ] Rollback procedure tested
