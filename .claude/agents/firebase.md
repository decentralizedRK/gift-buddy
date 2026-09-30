# Firebase Agent

## Role

Implement the Firestore data layer: repositories, converters, indexes, security rules, seed data, and emulator configuration.

## Read First

- `.claude/agents/_conventions.md` — import patterns, universal rules

## File Ownership

**You CAN edit:**
- `firebase/firestore.rules`
- `firebase/firestore.indexes.json`
- `firebase.json`, `.firebaserc`
- `src/data/` — seed data and repository implementations

**You MUST NOT edit:**
- `src/app/` — pages (storefront and admin agents own these)
- `src/components/` — UI components
- `src/domain/` — domain models (orchestrator creates these)

## Security Rules

### Default Deny

Every rules file must start with deny-all:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    // Collection-specific rules below
  }
}
```

### Admin Check Function

```
function isAdmin() {
  return request.auth != null &&
    (request.auth.token.admin == true ||
     exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid)));
}
```

### Public Create with Field Restriction

For collections that allow public submission (inquiries, feedback):

```
match /feedbackSubmissions/{docId} {
  allow create: if
    request.resource.data.keys().hasOnly(['type', 'title', 'message', ...]) &&
    request.resource.data.status == 'new' &&
    request.resource.data.priority == 'normal';
  allow read, update, delete: if isAdmin();
}
```

Key patterns:
- `keys().hasOnly([...])` restricts writable fields
- Enforce immutable defaults on create (status, priority, sentiment)
- Admin-only for read/update/delete
- Subcollection events: `allow read, create: if isAdmin()` (append-only, no update/delete)

## Seed Data Conventions

- Files in `src/data/`: `seed-products.ts`, `seed-categories.ts`, `seed-collections.ts`, `seed-feedback.ts`
- Original content only — never copy FNP product data
- Prices in paise (e.g., `249900` = INR 2,499.00)
- Use domain types from `src/domain/`
- Use `@example.com` for test emails (RFC 2606 reserved domain)
- Mark demo data clearly

## Spark Plan Constraints

- Design for Firebase Spark (no-cost) plan
- No Cloud Functions (requires Blaze)
- Bounded queries only — never `collection.get()` without limits
- Use maintained aggregate documents instead of counting queries
- Document any Blaze-required capability in `docs/operations/firebase-costs.md`

## Index Design

- Create composite indexes for filtered + sorted queries
- Document every index in `firebase/firestore.indexes.json`
- Test queries against emulator to verify index requirements

## Quality Gates

Before reporting done:

- [ ] All rules deny by default
- [ ] No open write access to any collection
- [ ] Public create restricts writable fields with `keys().hasOnly()`
- [ ] Seed data passes domain Zod schema validation
- [ ] Every new collection has rules, indexes, and docs
- [ ] No secrets in seed data or fixtures
