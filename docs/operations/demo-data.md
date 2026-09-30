# Demo Data

## Overview
Gift Buddy includes deterministic seed data for local development and demonstrations. All seed data is clearly fictional and marked with `isDemoData: true`.

## Seed Data Files

| File | Collection | Records |
|---|---|---|
| `src/data/seed-products.ts` | Products | 6 gift hampers |
| `src/data/seed-categories.ts` | Categories | 5 categories |
| `src/data/seed-collections.ts` | Collections | 4 collections |
| `src/data/seed-feedback.ts` | Feedback | 12 submissions |
| `src/data/seed-feedback.ts` | Recommendations | 4 requests |

## Feedback Seed Data Coverage

### By Status
- new (2), triaged (2), under_review (2), planned (1), accepted (1), implemented (1), responded (1), closed (2), spam (1)

### By Sentiment
- positive (4), neutral (3), negative (1), mixed (1), not_classified (1)

### By Type
- Anonymous (4), Identified (8)
- Product-linked (4), General (8)
- Contact requested (5), No contact (7)

### Recommendation Requests
- new (1), under_review (1), responded (1), closed (1)
- Various occasions: diwali, onboarding, appreciation, festival
- Various budget ranges and recipient counts

## Fictional People and Companies
All names, companies, email addresses, and phone numbers are fictional:
- Emails use `@example.com` (reserved domain per RFC 2606)
- Phone numbers are not real
- Company names are invented

## Running Locally

```bash
# Start development server (uses seed data automatically)
npm run dev

# Start Firebase emulators (when configured)
npm run emulators
```

## Production Safety
- Seed data is imported only in application code, not loaded from Firestore
- No seed scripts modify production databases
- The `isDemoData` flag allows easy identification and cleanup
- Development mode is detected via `process.env.NODE_ENV`
