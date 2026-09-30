# System Architecture Overview

## Architecture Layers

Gift Buddy follows a layered architecture built on Next.js with Firebase as the backend platform.

### Presentation Layer

**Next.js App Router** serves both the public storefront and the admin interface as a single application with route-based separation.

- `/` -- Public storefront (catalog, product pages, cart, inquiry, tracking)
- `/admin` -- Owner admin interface (dashboard, catalog management, orders, customers)

Server Components handle data fetching and SEO. Client Components handle interactivity (cart, forms, filters). The application uses Tailwind CSS for styling with a custom design system of reusable, accessible components.

### Application Layer

**Server-side logic** runs in Next.js API routes and Server Actions:

- **Inquiry processing** -- Validates and creates inquiry records with idempotency
- **Webhook handling** -- Receives and verifies WhatsApp webhook events
- **Admin operations** -- Authenticated server actions for catalog and order management
- **Auth verification** -- Validates Firebase Auth tokens and admin claims on protected routes

### Domain Layer

Core business logic is framework-independent and testable in isolation:

- **Products** -- Catalog items with variants, pricing, categorization, and lifecycle states
- **Orders** -- Inquiry-to-delivery lifecycle with validated state transitions
- **Customers** -- Company and contact records with phone normalization
- **Messages** -- WhatsApp conversation tracking and template rendering
- **Audit** -- Immutable event records for state changes and admin actions

### Data Layer

**Firebase Firestore** provides the primary data store:

- Typed repository classes abstract Firestore operations
- Firestore converters handle serialization/deserialization
- Security Rules enforce access control at the database level
- Composite indexes support filtered and sorted queries

### Integration Layer

**WhatsApp Cloud API** integration follows a provider pattern:

- `WhatsAppProvider` interface defines the contract for sending messages and processing webhooks
- `FakeWhatsAppProvider` -- Local development adapter that logs messages without external calls
- `CloudAPIWhatsAppProvider` -- Production adapter using the official Meta Cloud API
- Provider selection is controlled by environment configuration

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety across the stack |
| Styling | Tailwind CSS | Utility-first CSS |
| Validation | Zod | Schema validation at trust boundaries |
| Auth | Firebase Authentication | Admin user authentication |
| Database | Cloud Firestore | Document database |
| Hosting | Firebase Hosting | Static and SSR hosting |
| Messaging | WhatsApp Cloud API | Order communication channel |
| Testing | Vitest, Testing Library, Playwright | Unit, component, E2E testing |
| CI/CD | GitHub Actions | Automated verification and deployment |

## Data Flow: Inquiry Submission

1. Visitor browses catalog (Firestore read via Server Component)
2. Visitor adds items to cart (localStorage, client-side)
3. Visitor submits inquiry form (Server Action with Zod validation)
4. Server creates inquiry record in Firestore with idempotency key
5. Server triggers WhatsApp notification job (inquiry_received template)
6. WhatsApp provider sends confirmation message to customer (if consent given)
7. Admin sees new inquiry in dashboard (Firestore real-time or polling query)
8. Admin processes order through lifecycle states (Server Action with auth check)
9. Each state change triggers appropriate WhatsApp notification

## Data Flow: WhatsApp Webhook

1. Meta sends POST to webhook endpoint
2. Server validates request signature using app secret
3. Server parses webhook payload and extracts message/status events
4. Server checks idempotency (webhook event ID) to skip duplicates
5. Server correlates message to customer record via phone number
6. Server stores message in conversation record
7. Server links conversation to relevant order if identifiable
8. Admin sees updated conversation in the management interface

## Deployment Architecture

```
[Browser] --> [Firebase Hosting / CDN]
                    |
              [Next.js SSR]
                    |
         +--------------------+
         |                    |
    [Firestore]     [WhatsApp Cloud API]
         |
  [Security Rules]
```

Firebase Hosting serves the Next.js application. Firestore provides the database with Security Rules enforcing access control. The WhatsApp Cloud API is accessed server-side only.

## Key Architecture Decisions

- See [ADR-0001: Next.js App Router](decisions/ADR-0001-nextjs-app-router.md)
- See [ADR-0002: Firebase Backend](decisions/ADR-0002-firebase-backend.md)
- See [ADR-0003: WhatsApp Cloud API](decisions/ADR-0003-whatsapp-cloud-api.md)
