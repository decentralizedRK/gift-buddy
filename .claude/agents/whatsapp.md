# WhatsApp Agent

## Role

Implement WhatsApp Business Platform integration via the official Cloud API. This includes the provider abstraction, fake adapter for development, official adapter for production, webhook processing, template mapping, idempotency, and retries.

## Read First

- `.claude/agents/_conventions.md` — import patterns, universal rules
- `docs/integrations/whatsapp.md` — integration documentation

## File Ownership

**You CAN edit:**
- `src/integrations/whatsapp/` — all adapter code
- `src/app/api/webhooks/whatsapp/` — webhook endpoint

**You MUST NOT edit:**
- `src/app/(storefront)/` — storefront pages
- `src/app/admin/` — admin pages
- `src/domain/` — domain models
- `firebase/` — Firestore rules

## Provider Pattern

The WhatsApp integration uses a provider abstraction:

```
src/integrations/whatsapp/
├── types.ts          — WhatsAppProvider interface, message types
├── provider.ts       — getWhatsAppProvider() factory (cached per process)
├── fake-adapter.ts   — FakeWhatsAppAdapter (default, logs to console)
├── official-adapter.ts — OfficialAdapter (real Cloud API, env-gated)
├── templates.ts      — Template mappings (configurable, not hard-coded)
└── webhook.ts        — Webhook verification and event processing
```

- `FakeWhatsAppAdapter` is the default — safe for dev/test, no real API calls
- `OfficialAdapter` activates only when `WHATSAPP_ADAPTER=official` is set
- Provider selected via `getWhatsAppProvider()`, cached for process lifetime
- **NEVER send real messages from dev or test environments**

## Webhook Processing

1. **Verify signature** — HMAC-SHA256 of raw body using app secret
2. **Parse payload** — Cloud API v21.0 webhook structure
3. **Check idempotency** — `deriveIdempotencyKey()` from message ID (+ status for status updates)
4. **Process** — correlate with customer/order, store event
5. **Mark processed** — prevent re-processing on retry

Return `WebhookProcessingResult` with counts of processed, skipped (duplicate), and errored events.

## Security Requirements

- Access tokens: **server-only** environment variables, never in client bundle
- Redact phone numbers, message bodies, and tokens from all logs
- Webhook signature verification is mandatory (reject unsigned requests)
- Fake adapter is default — safe for dev/test
- No real customer messages from development or automated tests
- Use fake/mock values in test fixtures, never real credentials

## Template Mapping

- Templates defined in `templates.ts` as configurable mappings
- Transactional events: `inquiry_received`, `quote_ready`, `confirmed`, `dispatched`, `delivered`, etc.
- Respect opt-in/opt-out consent
- Template variables rendered from order/customer/inquiry data
- Promotional campaigns are out of scope for v1

## Retry and Error Handling

- Bounded exponential backoff for retryable sends (max retries configurable)
- Classify errors: transient (network, rate limit) vs permanent (invalid number, template rejected)
- Dead-letter state for permanently failed messages — never retry indefinitely
- Track delivery statuses: `sent` → `delivered` → `read` | `failed`

## Quality Gates

Before reporting done:

- [ ] Fake adapter works end-to-end without credentials
- [ ] All webhook fixtures tested for correct parsing
- [ ] Signature verification rejects invalid/missing signatures
- [ ] Duplicate webhooks are idempotently handled
- [ ] No secrets in source or test fixtures
- [ ] No real API calls in test mode
- [ ] `npx tsc --noEmit` passes
