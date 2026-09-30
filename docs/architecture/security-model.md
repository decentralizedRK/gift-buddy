# Security Model

## Overview

Gift Buddy implements defense-in-depth security across authentication, authorization, data access, input handling, and external integrations.

## Authentication

### Admin Authentication

- Firebase Authentication with email/password provider
- Admin status determined by custom claims (`admin: true`) set via Firebase Admin SDK, or presence in the `adminUsers` Firestore collection
- Auth state verified server-side on every protected request using Firebase Admin SDK token verification
- Client-side auth state managed via Firebase Auth SDK with `onAuthStateChanged`
- Session persistence: browser session (not indefinite)

### Public Users

- No authentication required for storefront browsing, cart, or inquiry submission
- Order tracking requires a non-enumerable reference number plus a verification step (e.g., phone number match)

## Authorization

### Firestore Security Rules

Rules follow deny-by-default:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }

    // Products: public read for active, admin write
    match /products/{productId} {
      allow read: if resource.data.status == 'active';
      allow write: if isAdmin();
    }

    // Orders: admin only
    match /orders/{orderId} {
      allow read, write: if isAdmin();
    }

    // Inquiries: public create (validated), admin read/write
    match /inquiries/{inquiryId} {
      allow create: if isValidInquiry();
      allow read, write: if isAdmin();
    }

    // Helper functions
    function isAdmin() {
      return request.auth != null &&
        (request.auth.token.admin == true ||
         exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid)));
    }
  }
}
```

### Server-Side Authorization

- Next.js middleware checks auth token on `/admin/*` routes
- API routes verify admin claims before processing requests
- Server Actions validate auth context before data mutations

## Input Validation

- All external input validated with Zod schemas at trust boundaries
- Phone numbers normalized to E.164 format before storage
- HTML output encoded to prevent XSS
- No use of `dangerouslySetInnerHTML` without sanitization
- File uploads (if added) restricted by type and size

## CSRF Protection

- Next.js Server Actions include built-in CSRF protection via action tokens
- API routes that accept mutations verify the `Origin` header
- SameSite cookie attribute set on auth cookies

## Feedback Security

### Public Feedback Submissions
- No authentication required for general feedback.
- Honeypot field to detect bots (hidden field, `aria-hidden`, `tabIndex=-1`).
- Idempotency key prevents duplicate submissions.
- Public create limited to allowed fields only (Security Rules enforce allowlist).
- Status, priority, and sentiment cannot be set by public clients (enforced to `new`, `normal`, `not_classified`).
- Consent required when contact is requested.
- Maximum field lengths enforced by Zod validation.

### Admin Feedback Access
- All feedback data access requires `admin: true` custom claim.
- Feedback events (audit trail) are append-only — no update or delete.
- CSV export sanitizes against formula injection (`=`, `+`, `-`, `@` prefixed with `'`).
- CSV excludes phone numbers, idempotency keys, and internal metadata.
- All admin status changes recorded in immutable events subcollection.

### Privacy
- Anonymous submissions store no PII.
- Contact details stored only when customer provides them.
- Feedback not displayed publicly.
- Admin-only internal notes never exposed to customers.

## Rate Limiting

- Public inquiry submission: rate limited per IP (configurable, default 5/minute)
- Public feedback submission: rate limited per IP (configurable, default 5/minute)
- Order tracking lookups: rate limited per IP (configurable, default 10/minute)
- Admin operations: rate limited per authenticated user
- Implementation via middleware or API route guards

## Webhook Security

### WhatsApp Webhook Verification

- GET requests: validate `hub.mode`, `hub.verify_token`, and return `hub.challenge`
- POST requests: validate `X-Hub-Signature-256` header using HMAC-SHA256 with app secret
- Reject requests with missing, malformed, or invalid signatures
- Reject requests with timestamps outside acceptable window (when available)
- Process events idempotently using webhook event IDs

## Secret Management

### Secrets Never In

- Source code or version control
- Client-side JavaScript bundles
- Browser-accessible configuration
- Log output (console, file, or external)
- Error messages returned to clients
- Documentation or screenshots
- Test fixtures (use fake/mock values)

### Secret Storage

- Local development: `.env.local` (in `.gitignore`)
- CI/CD: GitHub Actions encrypted secrets
- Production: Firebase environment configuration or GitHub environment secrets
- `.env.example` committed with variable names and descriptions only

### Required Secrets

| Secret | Purpose | Where Used |
|--------|---------|------------|
| `FIREBASE_API_KEY` | Firebase web app key | Client config |
| `FIREBASE_SERVICE_ACCOUNT` | Server-side Firebase Admin | Server only |
| `WHATSAPP_ACCESS_TOKEN` | Meta Cloud API auth | Server only |
| `WHATSAPP_APP_SECRET` | Webhook signature verification | Server only |
| `WHATSAPP_VERIFY_TOKEN` | Webhook subscription verification | Server only |
| `WHATSAPP_PHONE_NUMBER_ID` | Sender phone number | Server only |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Business account identifier | Server only |

## Audit Logging

All security-relevant actions are recorded in the `auditLogs` collection:

- Admin login/logout
- Product create/update/delete
- Order state transitions
- Customer data access
- Settings changes
- Feedback status changes, priority updates, notes
- Feedback CSV exports
- Failed authentication attempts
- Webhook verification failures

Audit records are append-only and never deletable through the application.

## Dependency Security

- `npm audit` run in CI to detect known vulnerabilities
- Dependabot or similar automated dependency updates
- No use of packages with known critical vulnerabilities in production

## Data Privacy

- Customer PII (name, email, phone, addresses) stored only as needed
- Message content subject to retention limits
- Data export and deletion procedures documented in operations runbook
- WhatsApp message bodies and phone numbers redacted from application logs
- Access to customer data restricted to authenticated admin users
