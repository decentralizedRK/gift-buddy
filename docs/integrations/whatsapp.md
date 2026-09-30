# WhatsApp Integration Guide

## Overview

Gift Buddy integrates with the WhatsApp Business Platform via the official Cloud API to send transactional notifications and receive customer messages.

## Architecture

```
[Gift Buddy Server] ---> [WhatsApp Cloud API] ---> [Customer WhatsApp]
                    <--- [Webhook POST]        <--- [Customer replies]
```

### Provider Interface

The integration uses a provider pattern:

```typescript
interface WhatsAppProvider {
  sendTemplate(phone: string, template: string, variables: Record<string, string>): Promise<SendResult>;
  sendText(phone: string, message: string): Promise<SendResult>;
  verifyWebhook(params: WebhookVerifyParams): string | null;
  processWebhook(body: unknown, signature: string): Promise<WebhookEvent[]>;
}
```

Two implementations:
- `FakeWhatsAppProvider` -- logs messages locally, no external calls
- `CloudAPIWhatsAppProvider` -- calls the real Meta Cloud API

Selection is controlled by `WHATSAPP_PROVIDER` environment variable (`fake` or `cloud`).

## Webhook Setup

### Verification Endpoint (GET)

When Meta registers a webhook, it sends a GET request:

```
GET /api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
```

The endpoint must:
1. Verify `hub.verify_token` matches `WHATSAPP_VERIFY_TOKEN`
2. Return the `hub.challenge` value as plain text

### Event Endpoint (POST)

Inbound messages and status updates arrive as POST requests:

```
POST /api/webhooks/whatsapp
X-Hub-Signature-256: sha256=HMAC_SIGNATURE
Content-Type: application/json
```

Processing steps:
1. Validate `X-Hub-Signature-256` using `WHATSAPP_APP_SECRET`
2. Parse the webhook payload
3. Check event ID for idempotency (skip if already processed)
4. Extract message or status update events
5. Correlate to customer record via phone number
6. Store in conversations/messages collection
7. Link to relevant order if identifiable

## Message Templates

Templates must be approved by Meta before use. Gift Buddy maps business events to template names:

| Business Event | Template Name (configurable) | Variables |
|---------------|------------------------------|-----------|
| Inquiry received | `inquiry_confirmation` | customer_name, reference_number |
| Quote ready | `quote_ready` | customer_name, reference_number, total |
| Order confirmed | `order_confirmed` | customer_name, reference_number |
| Packing started | `packing_update` | customer_name, reference_number |
| Dispatched | `order_dispatched` | customer_name, reference_number, tracking_url |
| Delivered | `order_delivered` | customer_name, reference_number |
| Delay notice | `delay_notification` | customer_name, reference_number, new_date |
| Cancellation | `order_cancelled` | customer_name, reference_number |

Template names are stored in application settings and can be updated without code changes.

## Fake Adapter (Development)

The fake adapter enables full development without Meta credentials:

- Outbound messages are logged to console and stored in Firestore (`webhookEvents` collection with `source: fake`)
- Simulated inbound messages can be sent via a development-only API endpoint
- Status updates (sent, delivered, read) can be triggered manually
- Template rendering is validated locally

### Using the Fake Adapter

1. Set `WHATSAPP_PROVIDER=fake` in `.env.local`
2. Start the dev server
3. Submit an inquiry -- the fake adapter logs the outbound template message
4. View logged messages in the admin conversations panel
5. Simulate an inbound message: `POST /api/dev/whatsapp/simulate` (dev mode only)

## Retry and Error Handling

- Outbound messages are queued in `notificationJobs` collection
- Failed sends retry with exponential backoff: 1m, 5m, 15m, 1h, 4h
- Maximum 5 retry attempts
- After max retries, job moves to `dead_letter` status
- Permanent failures (invalid phone, blocked) are not retried
- Transient failures (rate limit, timeout, server error) are retried

## Production Setup Checklist

- [ ] Create Meta Business Account and complete business verification
- [ ] Create a Meta App with WhatsApp product
- [ ] Register and verify a phone number for WhatsApp Business
- [ ] Generate a system user access token (permanent)
- [ ] Create and submit message templates for approval
- [ ] Configure webhook URL: `https://your-domain.com/api/webhooks/whatsapp`
- [ ] Set webhook verify token in Meta App dashboard and `WHATSAPP_VERIFY_TOKEN`
- [ ] Set all WhatsApp environment variables in production
- [ ] Switch `WHATSAPP_PROVIDER` to `cloud`
- [ ] Upgrade Firebase to Blaze plan (required for outbound API calls)
- [ ] Test with a personal WhatsApp number before going live
- [ ] Monitor webhook delivery and message status in admin panel

## Environment Variables

```
WHATSAPP_PROVIDER=fake|cloud
WHATSAPP_ACCESS_TOKEN=           # Meta API access token (server only)
WHATSAPP_APP_SECRET=             # For webhook signature verification (server only)
WHATSAPP_VERIFY_TOKEN=           # Webhook subscription verification (server only)
WHATSAPP_PHONE_NUMBER_ID=        # Registered phone number ID (server only)
WHATSAPP_BUSINESS_ACCOUNT_ID=    # Business account ID (server only)
WHATSAPP_API_VERSION=v21.0       # API version (server only)
```
