# Requirements Traceability Matrix

This matrix maps requirements from the product specification to their implementation in code and tests. Update it as features are implemented.

## Legend

| Status | Meaning |
|--------|---------|
| Planned | Not yet started |
| In Progress | Partially implemented |
| Implemented | Code complete |
| Tested | Tests written and passing |
| Verified | E2E verified and documented |

## Storefront Requirements

| ID | Requirement | Status | Source Files | Tests |
|----|------------|--------|-------------|-------|
| SF-001 | Home page | Planned | `src/app/(storefront)/page.tsx` | -- |
| SF-002 | Product catalog with filters | Planned | `src/app/(storefront)/products/` | -- |
| SF-003 | Product detail page | Planned | `src/app/(storefront)/products/[id]/` | -- |
| SF-004 | Category landing pages | Planned | `src/app/(storefront)/categories/` | -- |
| SF-005 | Search with keyword normalization | Planned | `src/app/(storefront)/search/` | -- |
| SF-006 | Cart (localStorage) | Planned | `src/components/cart/` | -- |
| SF-007 | Inquiry/quote request form | Planned | `src/app/(storefront)/inquiry/` | -- |
| SF-008 | Order tracking page | Planned | `src/app/(storefront)/track/` | -- |
| SF-009 | Corporate gifting landing | Planned | `src/app/(storefront)/corporate/` | -- |
| SF-010 | Static pages (about, FAQ, etc.) | Planned | `src/app/(storefront)/` | -- |
| SF-011 | SEO metadata and structured data | Planned | Layout and page metadata | -- |
| SF-012 | Responsive design (mobile-first) | Planned | All components | -- |
| SF-013 | Accessible UI (WCAG 2.2 AA) | Planned | All components | -- |

## Admin Requirements

| ID | Requirement | Status | Source Files | Tests |
|----|------------|--------|-------------|-------|
| AD-001 | Admin authentication | Planned | `src/app/admin/login/` | -- |
| AD-002 | Admin authorization (rules) | Planned | `firebase/firestore.rules` | -- |
| AD-003 | Dashboard with counts/queues | Planned | `src/app/admin/dashboard/` | -- |
| AD-004 | Product CRUD | Planned | `src/app/admin/products/` | -- |
| AD-005 | Category management | Planned | `src/app/admin/categories/` | -- |
| AD-006 | Order lifecycle management | Planned | `src/app/admin/orders/` | -- |
| AD-007 | Customer records | Planned | `src/app/admin/customers/` | -- |
| AD-008 | Conversation/message view | Planned | `src/app/admin/conversations/` | -- |
| AD-009 | CSV import/export | Planned | `src/app/admin/` | -- |
| AD-010 | Audit trail view | Planned | `src/app/admin/audit/` | -- |

## Domain Requirements

| ID | Requirement | Status | Source Files | Tests |
|----|------------|--------|-------------|-------|
| DM-001 | Product model with variants | Planned | `src/domain/product.ts` | -- |
| DM-002 | Order state machine | Planned | `src/domain/order.ts` | -- |
| DM-003 | Price calculations (INR paise) | Planned | `src/domain/pricing.ts` | -- |
| DM-004 | Phone normalization (E.164) | Planned | `src/domain/phone.ts` | -- |
| DM-005 | Reference number generation | Planned | `src/domain/reference.ts` | -- |
| DM-006 | Idempotency key handling | Planned | `src/domain/idempotency.ts` | -- |
| DM-007 | Zod validation schemas | Planned | `src/domain/schemas/` | -- |

## Data Layer Requirements

| ID | Requirement | Status | Source Files | Tests |
|----|------------|--------|-------------|-------|
| DL-001 | Firestore repositories | Planned | `src/data/repositories/` | -- |
| DL-002 | Security Rules (deny by default) | Planned | `firebase/firestore.rules` | -- |
| DL-003 | Composite indexes | Planned | `firebase/firestore.indexes.json` | -- |
| DL-004 | Seed data | Planned | `src/data/seed/` | -- |

## Integration Requirements

| ID | Requirement | Status | Source Files | Tests |
|----|------------|--------|-------------|-------|
| WA-001 | WhatsApp provider interface | Planned | `src/integrations/whatsapp/` | -- |
| WA-002 | Fake adapter (dev) | Planned | `src/integrations/whatsapp/fake.ts` | -- |
| WA-003 | Cloud API adapter | Planned | `src/integrations/whatsapp/cloud.ts` | -- |
| WA-004 | Webhook verification | Planned | `src/app/api/webhooks/whatsapp/` | -- |
| WA-005 | Webhook signature validation | Planned | `src/integrations/whatsapp/` | -- |
| WA-006 | Idempotent webhook processing | Planned | `src/integrations/whatsapp/` | -- |
| WA-007 | Template mapping | Planned | `src/integrations/whatsapp/templates.ts` | -- |
| WA-008 | Retry with backoff | Planned | `src/integrations/whatsapp/retry.ts` | -- |

## Security Requirements

| ID | Requirement | Status | Source Files | Tests |
|----|------------|--------|-------------|-------|
| SC-001 | No secrets in source/client | Planned | `.env.example`, build config | -- |
| SC-002 | Input validation (all boundaries) | Planned | Zod schemas | -- |
| SC-003 | CSRF protection | Planned | API routes | -- |
| SC-004 | Rate limiting (public endpoints) | Planned | API middleware | -- |
| SC-005 | Audit logging (admin actions) | Planned | `src/domain/audit.ts` | -- |
| SC-006 | Webhook authenticity verification | Planned | WhatsApp integration | -- |

## Customer Feedback and Insights Requirements (FEATURE-001)

| ID | Requirement | Status | Source Files | Tests |
|----|------------|--------|-------------|-------|
| FB-001 | Public feedback form | Implemented | `src/app/(storefront)/feedback/` | -- |
| FB-002 | Product-specific feedback | Implemented | `src/app/(storefront)/products/[slug]/page.tsx` | -- |
| FB-003 | Gift finder form | Implemented | `src/app/(storefront)/gift-finder/` | -- |
| FB-004 | Rule-based gift matching | Tested | `src/domain/gift-matcher.ts` | `tests/unit/domain/gift-matcher.test.ts` |
| FB-005 | Feedback domain models | Tested | `src/domain/feedback.ts` | `tests/unit/domain/feedback.test.ts` |
| FB-006 | Feedback status lifecycle | Tested | `src/domain/feedback.ts` | `tests/unit/domain/feedback.test.ts` |
| FB-007 | Anonymous submissions | Tested | `src/domain/feedback.ts` | `tests/unit/domain/feedback.test.ts` |
| FB-008 | Contact consent handling | Tested | `src/domain/feedback.ts` | `tests/unit/domain/feedback.test.ts` |
| FB-009 | Honeypot spam prevention | Implemented | Feedback form components | -- |
| FB-010 | Idempotency keys | Tested | `src/domain/reference.ts` | `tests/unit/domain/reference.test.ts` |
| FB-011 | Admin feedback list | Implemented | `src/app/admin/feedback/page.tsx` | -- |
| FB-012 | Admin feedback detail | Implemented | `src/app/admin/feedback/[id]/page.tsx` | -- |
| FB-013 | Admin dashboard widgets | Implemented | `src/app/admin/dashboard/page.tsx` | -- |
| FB-014 | CSV export with safety | Tested | `src/domain/feedback.ts` | `tests/unit/domain/feedback.test.ts` |
| FB-015 | Firestore Security Rules | Implemented | `firebase/firestore.rules` | -- |
| FB-016 | Seed data (feedback) | Implemented | `src/data/seed-feedback.ts` | -- |
| FB-017 | Seed data (recommendations) | Implemented | `src/data/seed-feedback.ts` | -- |

## Documentation Requirements

| ID | Document | Status | Path |
|----|----------|--------|------|
| DC-001 | README | Implemented | `README.md` |
| DC-002 | CLAUDE.md | Implemented | `CLAUDE.md` |
| DC-003 | Product vision | Implemented | `docs/product/vision.md` |
| DC-004 | Requirements | Implemented | `docs/product/requirements.md` |
| DC-005 | System overview | Implemented | `docs/architecture/system-overview.md` |
| DC-006 | Data model | Implemented | `docs/architecture/data-model.md` |
| DC-007 | Security model | Implemented | `docs/architecture/security-model.md` |
| DC-008 | WhatsApp integration | Implemented | `docs/integrations/whatsapp.md` |
| DC-009 | Local development | Implemented | `docs/operations/local-development.md` |
| DC-010 | Firebase setup | Implemented | `docs/operations/firebase-setup.md` |
| DC-011 | Deployment | Implemented | `docs/operations/deployment.md` |
| DC-012 | Runbook | Implemented | `docs/operations/runbook.md` |
| DC-013 | Test strategy | Implemented | `docs/testing/test-strategy.md` |
| DC-014 | Traceability | Implemented | `docs/traceability.md` |
| DC-015 | CHANGELOG | Implemented | `CHANGELOG.md` |
| DC-016 | CONTRIBUTING | Implemented | `CONTRIBUTING.md` |
| DC-017 | SECURITY | Implemented | `SECURITY.md` |
