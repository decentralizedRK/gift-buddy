# Local Development Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | `nvm install 20 && nvm use 20` |
| npm | 10+ | Ships with Node 20 |
| Firebase CLI | Latest | `npm install -g firebase-tools` |
| Java | 11+ | Required for Firebase Emulators |
| Git | 2.30+ | System package manager |

## Initial Setup

```bash
# Clone the repository
git clone https://github.com/decentralizedRK/gift-buddy.git
cd gift-buddy

# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env.local
```

## Environment Variables

Edit `.env.local` with the following (see `.env.example` for descriptions):

```
# Firebase (required -- use emulator values for local dev)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gift-buddy-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase emulator flags
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true

# WhatsApp (fake adapter for local dev)
WHATSAPP_PROVIDER=fake
```

When using emulators, `NEXT_PUBLIC_FIREBASE_PROJECT_ID` can be any string (e.g., `gift-buddy-dev`). Real Firebase config is only needed for deployed environments.

## Firebase Emulators

Emulators let you develop against Firestore, Auth, and Hosting locally with no cloud project needed.

```bash
# Start emulators (Firestore + Auth)
npm run emulators

# Emulator UI is available at http://localhost:4000
# Firestore: localhost:8080
# Auth: localhost:9099
```

Emulator data is ephemeral by default. To persist data between sessions:

```bash
firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data
```

## Development Server

```bash
# Start Next.js dev server (port 3000)
npm run dev

# Open in browser
open http://localhost:3000
```

The dev server supports hot module replacement. Ensure emulators are running first if the app accesses Firestore or Auth.

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Test categories

- **Unit tests** (`src/**/*.test.ts`): Domain logic, utilities, validation
- **Component tests** (`src/**/*.test.tsx`): React components with Testing Library
- **Integration tests**: Firestore operations against emulators
- **E2E tests** (when configured): Playwright browser tests

## Code Quality

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Formatting
npm run format          # Auto-fix
npm run format:check    # Check only
```

## Production Build

```bash
npm run build
npm start
```

Always verify the production build passes before pushing:

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

## Seed Data

When emulators start, seed data can be loaded from the export directory. Seed data includes 6 demo gift hampers with Indian pricing in INR. See `src/data/seed/` for definitions.

## Common Issues

| Problem | Solution |
|---------|----------|
| `EACCES` on global npm install | Use `nvm` to manage Node versions |
| Emulator port conflicts | Check for other processes on ports 4000, 8080, 9099 |
| Java not found for emulators | Install JDK 11+ and ensure `java` is on PATH |
| Firebase CLI not authenticated | Run `firebase login` (only needed for deployment, not emulators) |
| Module not found errors | Run `npm install` after pulling new changes |
| `.env.local` not loaded | Restart the dev server after modifying env files |

## Directory Structure

```
gift-buddy/
  src/
    app/              # Next.js App Router pages
      (storefront)/   # Public pages
      admin/          # Admin interface
      api/            # API routes
    components/       # Shared UI components
    domain/           # Business logic (framework-independent)
    data/             # Data access layer
    integrations/     # External service adapters
    lib/              # Utilities
  firebase/           # Firestore rules, indexes, emulator config
  docs/               # Documentation
  tests/              # E2E and integration tests
```
