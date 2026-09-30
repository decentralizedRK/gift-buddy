# FEATURE-001: Customer Feedback and Recommendations

## Status
In progress

## Problem
Gift Buddy has no mechanism for customers and visitors to share feedback, suggest new hamper ideas, request improvements, or ask for help choosing a suitable corporate gift. The owner has no way to capture, classify, prioritize, and act on customer insights.

## Users
- **Visitors**: Browse the storefront and want to share feedback or request help.
- **Corporate customers**: Have specific gifting requirements and need guidance.
- **Owner/Admin**: Needs to review, classify, and act on all feedback and recommendation requests.

## Scope

### In scope
1. Public feedback form (`/feedback`) for multiple feedback types.
2. Product-specific feedback from product detail pages.
3. Gift-finder / recommendation request form (`/gift-finder`) with rule-based matching.
4. Admin feedback management interface (list, detail, status, priority, notes, export).
5. Feedback submission lifecycle with validated status transitions.
6. Anonymous and identified submissions.
7. Contact consent handling.
8. Idempotent submission handling.
9. Honeypot-based spam prevention.
10. CSV export with formula-injection protection.
11. Comprehensive seed data for demos.
12. Firestore Security Rules for feedback collections.
13. Domain model tests, matching tests, and security rules.

### Exclusions
- Public display of feedback as reviews.
- AI-based recommendation engine.
- AI-inferred sentiment analysis.
- CAPTCHA integration (documented as future action).
- File uploads.
- Push notifications for new feedback.
- Automated WhatsApp feedback responses.

## UX Flow

### Customer Feedback Journey
1. Visitor navigates to `/feedback` (via header, footer, or product page link).
2. Selects feedback type.
3. Fills in details (title, message, optional rating).
4. Optionally provides contact details and requests response.
5. Submits with idempotency protection.
6. Sees confirmation with reference number.

### Gift Finder Journey
1. Visitor navigates to `/gift-finder`.
2. Describes occasion, recipients, budget, preferences.
3. Provides company and contact information.
4. Submits request.
5. Sees matched products with factual match reasons.
6. Sees disclaimer about final pricing requiring confirmation.
7. Can continue via WhatsApp (placeholder) or submit another request.

### Admin Feedback Management
1. Admin sees feedback counts on dashboard.
2. Navigates to Feedback section.
3. Filters/searches submissions.
4. Opens detail view.
5. Updates status, priority, sentiment, tags, internal notes.
6. Exports filtered data as CSV.

## Rules

### Feedback Types
Defined centrally in `src/domain/feedback.ts` via `FEEDBACK_TYPES` constant.

### Status Lifecycle
`new → triaged → under_review → planned → accepted → implemented → closed`
With branches to: `responded`, `duplicate`, `rejected`, `spam`.
Validated via `VALID_FEEDBACK_TRANSITIONS` map.

### Privacy
- Anonymous submissions require no contact info.
- Contact-requested submissions require consent + at least email or phone.
- No feedback displayed publicly as reviews.
- Admin-only access to all feedback data.
- CSV export excludes phone, idempotency hashes, internal metadata.

### Gift Matching
Rule-based, deterministic matching using product fields:
- Occasion match (3 points)
- Budget range match (3 points, 1 for near-match)
- Category match (2 points)
- Sustainability tag match (2 points)
- Recipient type match (2 points)

Returns top 4 matches sorted by score. Documented in `docs/product/gift-finder-rules.md`.

## Data Impact

### New Firestore collections
- `feedbackSubmissions` — customer feedback
- `feedbackSubmissions/{id}/events` — immutable audit trail
- `recommendationRequests` — gift-finder submissions
- `recommendationRequests/{id}/events` — immutable audit trail
- `feedbackAggregates` — dashboard counts
- `feedbackSettings` — configurable settings

### PII fields
- contactName, email, phone, companyName in both collections.
- Retention: follow existing data retention policy.
- Export: email included, phone excluded from CSV.

## API Impact
No new API routes in this version. Forms use local state and seed data.
Future: API routes for Firestore persistence.

## Privacy / Security Impact
- Public forms accept unauthenticated submissions.
- Honeypot field for bot detection.
- Idempotency keys prevent duplicate submissions.
- Admin-only access enforced by Security Rules.
- Public clients cannot set admin-only fields (status, priority, sentiment, assignedTo).
- Events subcollection is append-only (no update/delete).
- CSV export sanitizes against formula injection.

## Acceptance Criteria
1. Visitor can submit general feedback anonymously.
2. Visitor can submit product-specific feedback with rating.
3. Visitor can request contact and provide consent.
4. Invalid consent/contact combinations are rejected.
5. Gift finder shows matched products with reasons.
6. Duplicate submissions are prevented by idempotency key.
7. Admin can view, filter, and search feedback.
8. Admin can update status, priority, sentiment, and add notes.
9. Admin can export sanitized CSV.
10. Unauthorized users cannot access feedback data.
11. Firestore Security Rules tests pass.
12. Domain validation tests pass.
13. Gift matcher tests pass.
14. Production build succeeds.
15. All seed data appears in storefront and admin.

## Tests
- Domain: feedback type, status transition, rating, consent, CSV safety.
- Domain: gift matcher scoring, filtering, sorting.
- Security Rules: public create, admin read/update, event immutability.
- Component: form validation, rating widget, consent behavior.
- E2E: full feedback and gift-finder flows.

## Rollout
Local development only. No production deployment required.

## Rollback
Remove feature branch. No data migration needed.

## Operational Notes
- Demo data marked with `isDemoData: true`.
- Seed data is idempotent and deterministic.
- No production Firebase credentials required.

## Assumptions (reversible)
1. Feedback reference numbers use the existing `GB-XXXXXX` format.
2. Gift matching uses a maximum of 4 results.
3. Budget ranges use predefined bands rather than exact amounts.
4. No public tracking page for feedback in v1 (admin-only visibility).
5. No CAPTCHA — honeypot is sufficient for initial release.
