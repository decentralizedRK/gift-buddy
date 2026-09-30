# Changelog

All notable changes to Gift Buddy are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Customer feedback and insights feature (FEATURE-001).
  - Public feedback form at `/feedback` supporting 12 feedback types.
  - Product-specific feedback from product detail pages.
  - Gift Finder at `/gift-finder` with rule-based hamper matching.
  - Admin feedback management: list, detail, filters, status updates, notes, CSV export.
  - Dashboard widgets for new feedback and pending recommendations.
- Domain models: `FeedbackSubmission`, `RecommendationRequest`, `FeedbackEvent` with Zod validation.
- Feedback status lifecycle with validated transitions (11 statuses).
- Gift matching engine: deterministic, rule-based scoring on occasion, budget, category, sustainability, recipient.
- Seed data: 12 feedback submissions and 4 recommendation requests.
- CSV export with formula-injection protection (`sanitizeCsvValue`).
- Honeypot field and idempotency key for spam/duplicate prevention.
- Firestore Security Rules for `feedbackSubmissions`, `recommendationRequests`, `feedbackAggregates`, `feedbackSettings`.
- Domain tests for feedback validation, status transitions, consent logic, CSV safety.
- Gift matcher tests for scoring, filtering, sorting, edge cases.
- Feature document: `docs/features/FEATURE-001-customer-feedback-and-recommendations.md`.
- Gift finder rules documentation: `docs/product/gift-finder-rules.md`.
- Admin guide: `docs/admin/customer-insights-guide.md`.
- Demo data documentation: `docs/operations/demo-data.md`.

## [0.1.0] - 2024-01-01

### Added

- Project scaffolding with Next.js 16, TypeScript, and Tailwind CSS 4.
- Firebase SDK integration (Auth, Firestore) with emulator support.
- Zod for schema validation at trust boundaries.
- Vitest and Testing Library for unit and component testing.
- ESLint and Prettier for code quality.
- WhatsApp provider interface with fake adapter for development.
- Domain model foundations: products, orders, customers, pricing.
- Project documentation skeleton:
  - Product vision, requirements, personas, and acceptance criteria.
  - Architecture overview, data model, and security model.
  - ADRs for Next.js, Firebase, and WhatsApp decisions.
  - WhatsApp integration guide.
  - Operations guides: local dev, Firebase setup, costs, deployment, runbook, backup.
  - Test strategy and evidence template.
  - Requirements traceability matrix.
  - Contributing guide and security policy.
- `.env.example` with documented variable names (no secrets).
- GitHub pull request template.
- Conventional commits and branch naming conventions.

### Security

- Firebase Security Rules default to deny-all.
- Server-only environment variables for WhatsApp credentials.
- No secrets committed to repository.
