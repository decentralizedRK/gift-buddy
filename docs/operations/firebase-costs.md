# Firebase Cost Analysis: Spark vs Blaze

## Overview

Gift Buddy is designed to operate within the Firebase Spark (free) plan wherever possible. This document tracks which features work on Spark and which require the Blaze (pay-as-you-go) plan.

## Spark Plan (No-Cost Tier)

The Spark plan includes generous free allowances suitable for development and low-traffic production.

### What works on Spark

| Service | Free Allowance | Gift Buddy Usage |
|---------|---------------|-----------------|
| Firestore reads | 50,000/day | Catalog browsing, admin queries |
| Firestore writes | 20,000/day | Inquiries, order updates, audit logs |
| Firestore deletes | 20,000/day | Minimal (soft-delete preferred) |
| Firestore storage | 1 GiB | Product data, orders, messages |
| Authentication | Unlimited (Email/Password) | Admin users |
| Hosting storage | 10 GiB | Application bundle |
| Hosting transfer | 360 MB/day | Static assets, SSR responses |
| Hosting custom domain | 1 | Production domain |

### Spark plan limitations

- **No outbound network calls from server-side code**: Cloud Functions and server-side API calls to external services (including WhatsApp Cloud API) are blocked.
- **No Cloud Functions**: Scheduled tasks, background triggers, and server-side processing are not available.
- **No Cloud Storage for Firebase**: Image uploads must use external hosting or direct URLs.
- **No Extensions**: Firebase Extensions require the Blaze plan.
- **Limited hosting bandwidth**: 360 MB/day may be insufficient for image-heavy traffic.

## Blaze Plan (Pay-as-you-go)

The Blaze plan includes the same free allowances as Spark, plus pay-per-use beyond those limits. There is no monthly minimum charge.

### Features requiring Blaze

| Feature | Why Blaze is Needed | Gift Buddy Impact |
|---------|--------------------|--------------------|
| WhatsApp Cloud API calls | Outbound HTTPS from server | Production messaging blocked on Spark |
| Cloud Functions | Server-side triggers, scheduled jobs | Notification queue processing |
| Cloud Storage | File uploads | Product image hosting |
| Higher hosting bandwidth | >360 MB/day transfer | Production traffic |
| Firebase Extensions | Pre-built integrations | Optional convenience features |

### Estimated Blaze costs for low-traffic operation

| Service | Estimated Monthly (low traffic) | Notes |
|---------|-------------------------------|-------|
| Firestore | $0 | Within free tier for <1000 orders/month |
| Authentication | $0 | Email/Password is free |
| Hosting | $0-5 | Depends on traffic and image sizes |
| Cloud Functions | $0-2 | Minimal invocations for webhook processing |
| **Total** | **$0-7/month** | Before WhatsApp API costs (Meta charges separately) |

## Gift Buddy Architecture Decisions

### On Spark plan (development and early production)

- Use `WHATSAPP_PROVIDER=fake` -- all WhatsApp features work via the fake adapter
- Product images use external URLs (Cloudinary, Imgur, etc.) rather than Cloud Storage
- Inquiry notifications are visible in the admin panel without WhatsApp delivery
- No server-side scheduled jobs -- admin manually processes queues

### Migration to Blaze

When real WhatsApp messaging is needed:

1. Upgrade to Blaze in Firebase Console (Project Settings > Usage and billing)
2. Set a budget alert (recommended: $10/month initially)
3. Deploy Cloud Functions for webhook processing and notification jobs
4. Switch `WHATSAPP_PROVIDER=cloud` with proper credentials
5. Monitor usage in Firebase Console

### Cost controls

- Set billing alerts at $5, $10, and $25
- Use bounded Firestore queries (never unbounded list-all operations)
- Cache catalog reads where possible
- Use CDN-friendly caching headers on static assets
- Monitor daily read/write counts in Firebase Console

## External Costs (Not Firebase)

| Service | Cost | Notes |
|---------|------|-------|
| WhatsApp Business Platform | Per-conversation pricing (see Meta docs) | Charged by Meta, not Firebase |
| Domain name | ~$10-15/year | Required for production |
| Image hosting (if external) | Free tier usually sufficient | Cloudinary, etc. |

## References

- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firestore Quotas](https://firebase.google.com/docs/firestore/quotas)
- [ADR-0002: Firebase Backend](../architecture/decisions/ADR-0002-firebase-backend.md)
