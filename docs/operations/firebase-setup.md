# Firebase Setup Guide

## Overview

Gift Buddy uses Firebase for authentication, database, and hosting. This guide covers creating and configuring a Firebase project from scratch.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `gift-buddy` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

Record the project ID -- it is used in all configuration and CLI commands.

## 2. Enable Firestore

1. In the Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Select a location closest to your users (e.g., `asia-south1` for India)
4. Start in **Production mode** (rules will deny all access by default)
5. Click "Enable"

**Important**: The database location cannot be changed after creation.

## 3. Enable Authentication

1. Go to **Build > Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in provider
4. Optionally enable **Google** sign-in for admin convenience

Only admin users authenticate through the app. Customer-facing flows do not require login.

## 4. Register a Web App

1. Go to **Project Settings > General**
2. Under "Your apps", click the Web icon (`</>`)
3. Register app name: `gift-buddy-web`
4. Check "Also set up Firebase Hosting"
5. Click "Register app"
6. Copy the `firebaseConfig` object values into your `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gift-buddy.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gift-buddy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gift-buddy.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

These values are safe for client-side use (they are not secrets). Access is controlled by Security Rules, not by hiding configuration.

## 5. Set Up Admin Users

Admin access is controlled via a Firestore `adminUsers` collection or Firebase Auth custom claims.

### Option A: Firestore allowlist (Spark-compatible)

1. In the Firestore Console, create a collection called `adminUsers`
2. Add a document with the ID set to the admin user's UID
3. Set fields: `{ email: "admin@example.com", role: "owner", createdAt: <timestamp> }`

### Option B: Custom claims (requires server/Cloud Functions)

```bash
firebase auth:claims:set USER_UID --custom-claims '{"admin": true}'
```

This option requires the Blaze plan if using Cloud Functions to set claims programmatically.

## 6. Deploy Security Rules

```bash
# Login to Firebase CLI
firebase login

# Set the active project
firebase use gift-buddy

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

Review `firebase/firestore.rules` before deploying. Rules default to deny-all and grant access only to authenticated admin users for admin collections, and read-only public access for catalog data.

## 7. Configure Firebase Emulators

The emulator configuration is in `firebase.json`. No cloud project is needed for local development with emulators.

```bash
# Install emulator binaries
firebase setup:emulators:firestore
firebase setup:emulators:auth

# Start emulators
npm run emulators
```

Emulator UI: http://localhost:4000

## 8. Firebase Hosting Setup

```bash
# Initialize hosting (if not already configured)
firebase init hosting

# Configuration:
#   Public directory: out (or .next for SSR)
#   Single-page app: No (Next.js handles routing)
#   GitHub Actions deploy: Yes (optional)
```

For Next.js SSR with Firebase Hosting, see [deployment.md](deployment.md).

## Configuration Checklist

- [ ] Firebase project created
- [ ] Firestore enabled with appropriate region
- [ ] Authentication enabled (Email/Password at minimum)
- [ ] Web app registered and config values saved to `.env.local`
- [ ] Admin user created and allowlisted
- [ ] Security Rules reviewed and deployed
- [ ] Emulators installed and working locally
- [ ] Firebase Hosting initialized (for deployment)

## Environment-Specific Config

| Environment | Config Source | Firestore | Auth |
|------------|-------------|-----------|------|
| Local dev | `.env.local` | Emulator (localhost:8080) | Emulator (localhost:9099) |
| Preview | GitHub Secrets | Cloud Firestore | Cloud Auth |
| Production | GitHub Secrets | Cloud Firestore | Cloud Auth |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Permission denied" in Firestore | Check Security Rules and user auth state |
| Emulator won't start | Ensure Java 11+ is installed; check port availability |
| Auth domain mismatch | Verify `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` matches project |
| Rules deploy fails | Run `firebase login` and `firebase use <project-id>` |
