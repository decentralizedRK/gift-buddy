# Test Strategy

## Overview

Gift Buddy uses a test pyramid approach with Vitest for unit/component tests, Firebase Emulator Suite for integration tests, and Playwright for end-to-end tests.

## Test Pyramid

```
        /  E2E  \          Playwright (critical user journeys)
       /----------\
      / Integration \      Firebase Emulators (data, rules, APIs)
     /----------------\
    /    Component      \   Testing Library (UI components)
   /--------------------\
  /       Unit            \  Vitest (domain logic, utilities)
 /--------------------------\
```

### Layer 1: Unit Tests (Vitest)

**Scope**: Pure functions, domain logic, validation, utilities.

**What to test**:
- Price calculations (INR paise arithmetic, tax, subtotals)
- Minimum order quantity enforcement
- Order state transition validation
- Reference number generation (format, uniqueness)
- Phone number normalization (E.164 conversion)
- Idempotency key generation and validation
- Retry classification (transient vs permanent failure)
- Zod schema validation (valid/invalid inputs)
- Date and currency formatting

**Location**: `src/**/*.test.ts` alongside source files.

**Run**: `npm test` or `npm run test:watch`

### Layer 2: Component Tests (Testing Library)

**Scope**: React components in isolation with mocked data.

**What to test**:
- Form rendering, validation, and submission
- Filter controls and state changes
- Cart add/remove/quantity operations
- Data table rendering and sorting
- Dialog open/close and confirmation flows
- Loading, empty, and error states
- Accessibility: focus management, ARIA attributes, keyboard navigation

**Location**: `src/**/*.test.tsx` alongside component files.

**Run**: `npm test` (same Vitest runner with jsdom environment)

### Layer 3: Integration Tests (Firebase Emulators)

**Scope**: Firestore operations, Security Rules, API routes.

**What to test**:
- Repository CRUD operations against emulated Firestore
- Security Rules: read/write allowed and denied for each role
- API route request/response contracts
- WhatsApp webhook verification and event processing (fake adapter)
- Seed data loading and query results
- Composite index behavior

**Prerequisites**: Firebase Emulators running (`npm run emulators`).

**Location**: `tests/integration/` or `src/**/*.integration.test.ts`

### Layer 4: E2E Tests (Playwright)

**Scope**: Full user journeys through the running application.

**What to test**:
- Browse catalog, view product, add to cart, submit inquiry, see confirmation
- Admin login, create product, edit product, archive product
- Admin view inquiry, process through order states, verify audit trail
- Unauthorized access to admin routes (redirect to login)
- Responsive layout at mobile (375px) and desktop (1280px) viewports
- Duplicate form submission produces only one inquiry

**Location**: `tests/e2e/`

**Run**: `npx playwright test`

## Test Categories by Risk

### Critical (must not ship without)

- Order state transition validation
- Admin authorization enforcement (rules + application)
- Inquiry creation idempotency
- Webhook signature verification
- Price calculation accuracy

### High (strong coverage expected)

- Form validation for all required fields
- Cart operations (add, remove, quantity, persistence)
- Product CRUD operations
- Customer phone normalization
- WhatsApp template variable rendering

### Medium (coverage for confidence)

- Search and filter combinations
- Sort ordering
- Pagination
- CSV import/export
- Responsive layout breakpoints

### Low (coverage when convenient)

- Cosmetic styling
- Animation timing
- Third-party library behavior

## Coverage Goals

Coverage percentages are secondary to risk coverage. Targets:

| Layer | Target | Measured By |
|-------|--------|------------|
| Domain logic (`src/domain/`) | 90%+ line coverage | `npm run test:coverage` |
| Components (`src/components/`) | 80%+ line coverage | `npm run test:coverage` |
| Data layer (`src/data/`) | 80%+ line coverage | Integration tests |
| API routes (`src/app/api/`) | 70%+ line coverage | Integration tests |
| E2E critical paths | 100% of listed scenarios | Playwright test count |

## Test Data

- Unit/component tests use inline fixtures
- Integration tests use seed data loaded into emulators
- E2E tests run against a dev server with emulators and seed data
- No real customer data in any test environment
- No real WhatsApp API calls in any test (fake adapter only)

## CI Integration

Tests run in GitHub Actions on every pull request:

1. `npm run format:check` -- formatting
2. `npm run lint` -- linting
3. `npm run typecheck` -- type safety
4. `npm test` -- unit and component tests
5. `npm run build` -- production build verification
6. Playwright tests (against built app with emulators)

A PR cannot merge if any step fails.

## Adding New Tests

When implementing a new feature:

1. Write domain unit tests first (red-green-refactor)
2. Add component tests for new UI elements
3. Add Security Rules tests for new Firestore collections
4. Add E2E tests for user-facing workflows
5. Update this document if new test patterns are introduced
