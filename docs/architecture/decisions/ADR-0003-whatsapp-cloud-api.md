# ADR-0003: Official WhatsApp Cloud API

## Status

Accepted

## Date

2024-12-01

## Context

Gift Buddy uses WhatsApp as the primary order communication channel. The integration must support sending transactional notifications (inquiry confirmations, quotes, status updates) and receiving inbound messages from customers.

Options considered:

1. **WhatsApp Cloud API (official Meta API)** -- Meta-hosted API for WhatsApp Business
2. **WhatsApp On-Premises API** -- Self-hosted, requires infrastructure
3. **Third-party BSPs (Twilio, MessageBird, etc.)** -- Intermediary services
4. **Unofficial/reverse-engineered libraries** -- Browser automation or protocol-level access

## Decision

Use the **official WhatsApp Cloud API** exclusively.

## Rationale

- **Official and compliant** -- follows Meta's terms of service and WhatsApp Business Policy
- **No infrastructure to manage** -- Meta hosts the API endpoints
- **Free tier** -- 1,000 free service conversations per month
- **Webhook support** -- real-time delivery of inbound messages and status updates
- **Template messages** -- structured messages that can be sent outside the 24-hour conversation window
- **Direct integration** -- no intermediary BSP fees or dependencies

## Prerequisites (Human Actions Required)

1. Meta Business Account with business verification
2. WhatsApp Business Account created in Meta Business Manager
3. Phone number registered and verified for WhatsApp Business
4. Meta App created with WhatsApp product enabled
5. Webhook subscription configured with verify token
6. Message templates submitted and approved by Meta
7. Access token generated (system user or temporary)

## Consequences

### Positive

- Legal and compliant messaging
- Reliable delivery with status callbacks
- Template messages ensure consistent customer communication
- No third-party intermediary costs
- Well-documented API with official SDKs

### Negative

- Requires Meta Business verification (can take days/weeks)
- Message templates must be pre-approved by Meta (limits flexibility)
- 24-hour conversation window for free-form replies
- Rate limits apply (varies by quality rating)
- Outbound API calls require Firebase Blaze plan (cannot call external APIs from Spark)

### Mitigations

- **Fake adapter** for development: a local mock that simulates the Cloud API without making real API calls, enabling full development and testing before Meta verification is complete
- **Provider interface**: abstraction layer (`WhatsAppProvider`) allows swapping between fake and real adapters via environment configuration
- **Template mapping**: configurable mapping from business events to template names, so templates can be updated without code changes
- **Idempotent processing**: webhook events are deduplicated to handle Meta's at-least-once delivery guarantee
