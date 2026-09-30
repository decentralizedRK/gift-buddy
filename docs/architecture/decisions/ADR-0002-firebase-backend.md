# ADR-0002: Firebase as Backend Platform

## Status

Accepted

## Date

2024-12-01

## Context

Gift Buddy needs backend services for authentication, data storage, and hosting. The platform should minimize operational overhead for a single-owner business while supporting the feature requirements.

Options considered:

1. **Firebase (Firestore, Auth, Hosting)** -- Google's app development platform
2. **Supabase (PostgreSQL, Auth, Storage)** -- Open-source Firebase alternative
3. **Custom Node.js + PostgreSQL** -- Self-managed backend
4. **AWS Amplify** -- Amazon's app development platform

## Decision

Use **Firebase** with Firestore, Authentication, and Hosting.

## Rationale

- **Firestore** provides a flexible document database that maps naturally to gift hamper catalogs, orders, and conversations
- **Firebase Auth** offers built-in email/password authentication with custom claims for admin role management
- **Firebase Hosting** supports Next.js SSR deployments
- **Security Rules** enforce data access control at the database level, providing defense-in-depth
- **Firebase Emulator Suite** enables local development and testing without cloud costs
- **Spark (free) plan** covers authentication, Firestore reads/writes within limits, and hosting -- suitable for initial development and low-volume production
- **Real-time listeners** (if needed later) are built into Firestore

## Spark Plan Constraints

The following features work on the free Spark plan:
- Firebase Authentication (50k monthly active users)
- Cloud Firestore (1 GiB storage, 50k reads/day, 20k writes/day)
- Firebase Hosting (10 GiB storage, 360 MB/day transfer)

The following require the Blaze (pay-as-you-go) plan:
- Cloud Functions (needed for server-side WhatsApp API calls in production)
- Outbound network requests from Firebase services
- Storage beyond Spark limits

See `/docs/operations/firebase-costs.md` for detailed cost analysis.

## Consequences

### Positive

- No server infrastructure to manage
- Built-in auth with admin custom claims
- Security Rules provide declarative, testable access control
- Emulator Suite enables full local development
- Generous free tier for development and early production

### Negative

- Firestore query model is more limited than SQL (no joins, limited aggregation)
- Complex queries require composite indexes that must be planned and deployed
- Vendor lock-in to Google Cloud ecosystem
- Blaze plan required for production WhatsApp integration (outbound HTTP)
- No built-in relational integrity enforcement

### Mitigations

- Use typed repository classes to abstract Firestore specifics
- Pre-plan composite indexes based on known query patterns
- Document the Blaze upgrade path and cost expectations
- Keep business logic independent of Firestore SDK
