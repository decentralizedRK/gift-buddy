# ADR-0001: Next.js with App Router

## Status

Accepted

## Date

2024-12-01

## Context

Gift Buddy needs a web framework that supports:

- Server-side rendering for SEO (product pages, catalog)
- Client-side interactivity for cart, forms, and admin interfaces
- API routes for webhook endpoints and server-side integrations
- TypeScript support
- A strong ecosystem for UI components and tooling

Options considered:

1. **Next.js (App Router)** -- React meta-framework with SSR, SSG, Server Components, and API routes
2. **Next.js (Pages Router)** -- Previous-generation routing model
3. **Remix** -- Full-stack React framework with nested routing
4. **Vite + React SPA** -- Client-only with separate API server

## Decision

Use **Next.js 15 with App Router**.

## Rationale

- **Server Components** reduce client-side JavaScript for catalog/product pages, improving Core Web Vitals
- **Server Actions** provide a clean pattern for authenticated mutations (admin operations, inquiry submission)
- **Built-in API routes** handle WhatsApp webhooks without a separate server
- **Static generation** can be used for rarely-changing pages (about, policies)
- **Mature ecosystem** with broad community support, deployment options, and documentation
- **Firebase Hosting** supports Next.js SSR deployment via Firebase web frameworks
- App Router is the recommended approach for new Next.js projects

## Consequences

### Positive

- Single codebase for storefront, admin, and API endpoints
- SEO-optimized product pages with minimal client JavaScript
- Server-side auth verification without exposing Firebase Admin SDK to the client
- Strong TypeScript integration

### Negative

- App Router has a steeper learning curve than Pages Router
- Some Firebase client SDK patterns require careful handling with Server/Client Component boundaries
- Firebase Hosting SSR support for Next.js may have limitations compared to Vercel
- Build times may increase as the application grows

### Risks

- If Firebase Hosting does not support a required Next.js feature, we may need to switch to Vercel or a custom Node.js host. Mitigated by keeping the deployment layer thin and documented.
