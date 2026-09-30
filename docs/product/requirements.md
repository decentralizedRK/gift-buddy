# Functional Requirements

## CAT -- Catalog

| ID | Requirement | Priority |
|----|-------------|----------|
| CAT-01 | Display gift hampers with image, title, description, price, and availability | Must |
| CAT-02 | Support product variants (size, contents, customization options) | Must |
| CAT-03 | Organize products by categories (occasion, recipient type, price band) | Must |
| CAT-04 | Support curated collections (e.g., "Festival Specials", "Executive Picks") | Should |
| CAT-05 | Full-text search with normalized keywords | Must |
| CAT-06 | Filter by price range, occasion, recipient, category, availability, lead time | Must |
| CAT-07 | Sort by relevance, newest, price (low/high), and popularity | Must |
| CAT-08 | Product detail page with full description, included items, MOQ, lead time, delivery regions | Must |
| CAT-09 | SEO metadata, canonical URLs, and structured data (JSON-LD) for products | Should |
| CAT-10 | Responsive images with lazy loading and loading skeletons | Must |
| CAT-11 | Draft/active/archived product states | Must |
| CAT-12 | Featured products and display ordering | Should |

## CART -- Cart and Inquiry

| ID | Requirement | Priority |
|----|-------------|----------|
| CART-01 | Client-side cart persisted in localStorage | Must |
| CART-02 | Add/remove/update quantity for products in cart | Must |
| CART-03 | Display indicative subtotal from catalog prices | Must |
| CART-04 | Label pricing as "indicative, subject to final quote" | Must |
| CART-05 | Inquiry form: company name, contact name, phone, email, quantity, date, delivery mode, addresses, personalization, budget, consent | Must |
| CART-06 | Phone number validation and normalization (Indian format) | Must |
| CART-07 | Idempotent inquiry submission using client-generated idempotency key | Must |
| CART-08 | Display confirmation with reference number after submission | Must |
| CART-09 | WhatsApp continuation link with prefilled message (reference only, no PII) | Must |
| CART-10 | Order/quote tracking page with secure non-enumerable reference | Should |

## ORD -- Order Management

| ID | Requirement | Priority |
|----|-------------|----------|
| ORD-01 | Order lifecycle states: inquiry_received through delivered, plus terminal states | Must |
| ORD-02 | Validated state transitions with audit trail | Must |
| ORD-03 | Immutable event log per order: actor, timestamp, old/new state, source, note | Must |
| ORD-04 | Internal notes (not customer-visible) on orders | Must |
| ORD-05 | Separate internal status from customer-facing status wording | Must |
| ORD-06 | Searchable order timeline and filters | Should |
| ORD-07 | Customer/company record deduplication by normalized phone | Should |

## ADM -- Admin Interface

| ID | Requirement | Priority |
|----|-------------|----------|
| ADM-01 | Firebase Auth login for admin users | Must |
| ADM-02 | Server-enforced admin role (custom claim or allowlist) | Must |
| ADM-03 | Dashboard: new inquiries, pending quotes, confirmed orders, overdue actions, failed messages | Must |
| ADM-04 | Product CRUD with draft/active/archived states | Must |
| ADM-05 | Category and collection management | Must |
| ADM-06 | Order state transition controls with validation | Must |
| ADM-07 | Customer/company record view with conversation history | Should |
| ADM-08 | CSV import/export for products with dry-run preview | Should |
| ADM-09 | Audit log viewer for admin actions | Should |
| ADM-10 | Bounded Firestore reads (no unbounded collection scans) | Must |

## WA -- WhatsApp Integration

| ID | Requirement | Priority |
|----|-------------|----------|
| WA-01 | Webhook verification endpoint (GET with challenge response) | Must |
| WA-02 | Webhook POST endpoint with signature validation | Must |
| WA-03 | Idempotent webhook event processing | Must |
| WA-04 | Inbound message correlation to customer/order | Must |
| WA-05 | Outbound message sending via approved templates | Must |
| WA-06 | Message delivery status tracking (sent, delivered, read, failed) | Must |
| WA-07 | Retry with bounded exponential backoff; dead-letter for permanent failures | Must |
| WA-08 | Fake/mock adapter for local development and testing | Must |
| WA-09 | Template mapping for transactional events (inquiry received, quote ready, dispatched, delivered, etc.) | Must |
| WA-10 | Token/phone/message body redaction in logs | Must |
| WA-11 | Respect opt-in/opt-out consent | Must |
| WA-12 | Conversation record linking messages to orders | Should |

## SEC -- Security

| ID | Requirement | Priority |
|----|-------------|----------|
| SEC-01 | Firestore Security Rules deny by default | Must |
| SEC-02 | Admin routes protected on server and data layer | Must |
| SEC-03 | Input validation and sanitization on all external input | Must |
| SEC-04 | No secrets in source, bundles, logs, or client config | Must |
| SEC-05 | Rate limiting on public submission endpoints | Must |
| SEC-06 | CSRF protection on state-changing requests | Must |
| SEC-07 | Webhook authenticity verification | Must |
| SEC-08 | Audit logging for security-relevant admin actions | Must |
