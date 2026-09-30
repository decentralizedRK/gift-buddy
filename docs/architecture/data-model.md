# Firestore Data Model

## Collection: `products`

Catalog items (gift hampers).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Firestore document ID |
| sku | string | yes | Unique SKU identifier |
| title | string | yes | Display title |
| slug | string | yes | URL-safe slug (unique) |
| shortDescription | string | yes | Summary for catalog cards |
| longDescription | string | yes | Full description for detail page |
| includedItems | string[] | yes | List of items in the hamper |
| categoryId | string | yes | Reference to categories collection |
| collectionIds | string[] | no | References to collections |
| price | number | yes | Price in smallest currency unit (paise) |
| compareAtPrice | number | no | Original price for discount display |
| currency | string | yes | ISO 4217 code (default: INR) |
| taxClassification | string | no | Tax category identifier |
| moq | number | yes | Minimum order quantity (default: 1) |
| leadTimeDays | number | yes | Estimated lead time in days |
| variants | Variant[] | no | Size/content variations |
| imageUrls | string[] | yes | Product image URLs |
| tags | string[] | no | Searchable tags |
| occasion | string | no | Occasion category |
| recipientType | string | no | Target recipient type |
| personalizationOptions | string[] | no | Available customization options |
| deliveryRegions | string[] | no | Supported delivery region IDs |
| status | enum | yes | draft, active, archived |
| featuredRank | number | no | Display ordering for featured products |
| searchKeywords | string[] | yes | Normalized search terms |
| popularity | number | yes | Explicit popularity score (default: 0) |
| createdAt | timestamp | auto | Server timestamp |
| updatedAt | timestamp | auto | Server timestamp |

**Access Rules:** Public read for active products. Admin write only.

**Indexes:**
- `status` + `categoryId` + `price` (catalog filtering)
- `status` + `occasion` + `price`
- `status` + `featuredRank` (featured products)
- `status` + `createdAt` (newest sort)
- `status` + `popularity` (popular sort)

---

## Collection: `categories`

Product categories for navigation and filtering.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| name | string | yes | Display name |
| slug | string | yes | URL-safe slug |
| description | string | no | Category description |
| imageUrl | string | no | Category image |
| parentId | string | no | Parent category for hierarchy |
| displayOrder | number | yes | Sort order |
| status | enum | yes | active, archived |
| createdAt | timestamp | auto | Server timestamp |

**Access Rules:** Public read for active. Admin write only.

---

## Collection: `collections`

Curated product groupings (e.g., "Festival Specials").

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| name | string | yes | Display name |
| slug | string | yes | URL-safe slug |
| description | string | no | Collection description |
| imageUrl | string | no | Banner image |
| productIds | string[] | yes | Ordered product references |
| displayOrder | number | yes | Sort order |
| status | enum | yes | active, archived |
| createdAt | timestamp | auto | Server timestamp |

**Access Rules:** Public read for active. Admin write only.

---

## Collection: `customers`

Customer contact records (deduplicated by normalized phone).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| name | string | yes | Contact name |
| email | string | no | Email address |
| phone | string | yes | Phone as entered |
| phoneNormalized | string | yes | E.164 normalized phone |
| companyId | string | no | Reference to companies |
| whatsappConsent | boolean | yes | Consent for WhatsApp messages |
| consentTimestamp | timestamp | no | When consent was given |
| createdAt | timestamp | auto | Server timestamp |
| updatedAt | timestamp | auto | Server timestamp |

**Access Rules:** Admin read/write only. No public access.

**Indexes:**
- `phoneNormalized` (unique, for deduplication)

**PII:** name, email, phone. Subject to retention policy.

---

## Collection: `companies`

Company records linked to customers.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| name | string | yes | Company name |
| industry | string | no | Industry/sector |
| size | string | no | Company size range |
| notes | string | no | Internal notes |
| createdAt | timestamp | auto | Server timestamp |

**Access Rules:** Admin read/write only.

---

## Collection: `inquiries`

Customer inquiries from the storefront form.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| referenceNumber | string | yes | Non-sequential public reference (e.g., GB-A7K9M2) |
| idempotencyKey | string | yes | Client-generated dedup key |
| customerId | string | yes | Reference to customers |
| companyName | string | yes | Company name (denormalized) |
| contactName | string | yes | Contact name (denormalized) |
| phone | string | yes | Phone (denormalized) |
| email | string | no | Email |
| items | InquiryItem[] | yes | Products, quantities, variants |
| totalQuantity | number | yes | Sum of all item quantities |
| indicativeSubtotal | number | yes | Calculated from catalog prices |
| requestedDeliveryDate | timestamp | no | Preferred delivery date |
| deliveryMode | string | no | Single/multiple address delivery |
| deliveryAddresses | Address[] | no | Delivery addresses |
| personalizationNotes | string | no | Custom requirements |
| budgetRange | string | no | Budget indication |
| whatsappConsent | boolean | yes | Consent for WhatsApp |
| status | enum | yes | inquiry_received, qualification_pending, etc. |
| source | string | yes | web, whatsapp, manual |
| createdAt | timestamp | auto | Server timestamp |

**Access Rules:** Admin read/write. Public create (validated). No public read of other inquiries.

**Indexes:**
- `idempotencyKey` (unique, for deduplication)
- `status` + `createdAt` (admin dashboard)
- `referenceNumber` (tracking lookup)

**PII:** contactName, phone, email, deliveryAddresses. Subject to retention policy.

---

## Collection: `orders`

Orders derived from confirmed inquiries.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| referenceNumber | string | yes | Public reference |
| inquiryId | string | yes | Source inquiry |
| customerId | string | yes | Customer reference |
| companyId | string | no | Company reference |
| items | OrderItem[] | yes | Finalized items with confirmed pricing |
| finalTotal | number | yes | Confirmed total in paise |
| status | enum | yes | Current lifecycle state |
| customerFacingStatus | string | yes | Human-readable status for customer |
| assignedTo | string | no | Admin handling the order |
| internalNotes | string | no | Private admin notes |
| trackingInfo | TrackingInfo | no | Dispatch/tracking details |
| createdAt | timestamp | auto | Server timestamp |
| updatedAt | timestamp | auto | Server timestamp |

**Access Rules:** Admin read/write only. Public read by referenceNumber with verification.

**Indexes:**
- `status` + `updatedAt` (admin filtering)
- `customerId` + `createdAt`
- `referenceNumber`

### Subcollection: `orders/{orderId}/events`

Immutable audit trail for order state changes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| previousState | string | yes | State before transition |
| newState | string | yes | State after transition |
| actor | string | yes | User ID or system identifier |
| source | string | yes | admin, system, webhook |
| note | string | no | Optional context |
| timestamp | timestamp | auto | Server timestamp |

**Access Rules:** Admin read only. System write only (never client-writable).

---

## Collection: `conversations`

WhatsApp conversation threads.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| customerId | string | yes | Customer reference |
| orderId | string | no | Related order |
| phoneNormalized | string | yes | Customer phone (E.164) |
| lastMessageAt | timestamp | yes | Most recent message timestamp |
| lastMessagePreview | string | no | Truncated last message |
| unreadCount | number | yes | Unread inbound messages |
| status | enum | yes | active, archived |
| createdAt | timestamp | auto | Server timestamp |

**Access Rules:** Admin read/write only.

### Subcollection: `conversations/{conversationId}/messages`

Individual messages in a conversation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| direction | enum | yes | inbound, outbound |
| type | enum | yes | text, template, image, document |
| content | string | yes | Message body or template name |
| templateName | string | no | Template identifier if template message |
| templateVariables | object | no | Template variable values |
| waMessageId | string | no | WhatsApp message ID |
| status | enum | yes | pending, sent, delivered, read, failed |
| failureReason | string | no | Error details if failed |
| timestamp | timestamp | auto | Server timestamp |

**Access Rules:** Admin read only. System write only.

**PII:** content (message body). Subject to retention policy and redaction rules.

---

## Collection: `webhookEvents`

Raw webhook event log for diagnostics.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| eventId | string | yes | WhatsApp webhook event ID (for idempotency) |
| type | string | yes | Event type |
| processed | boolean | yes | Whether event has been handled |
| processedAt | timestamp | no | When processing completed |
| error | string | no | Processing error if any |
| receivedAt | timestamp | auto | Server timestamp |

**Access Rules:** Admin read only. System write only.

**Note:** Raw payload is stored minimally. Personal data fields are excluded or redacted.

---

## Collection: `notificationJobs`

Queued outbound WhatsApp message jobs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| type | string | yes | Notification type (inquiry_received, quote_ready, etc.) |
| recipientPhone | string | yes | E.164 phone number |
| templateName | string | yes | WhatsApp template identifier |
| templateVariables | object | yes | Template parameters |
| orderId | string | no | Related order |
| status | enum | yes | pending, sending, sent, failed, dead_letter |
| attempts | number | yes | Send attempt count |
| lastAttemptAt | timestamp | no | Last attempt timestamp |
| nextRetryAt | timestamp | no | Scheduled retry time |
| error | string | no | Last error message |
| createdAt | timestamp | auto | Server timestamp |

**Access Rules:** Admin read. System read/write.

---

## Collection: `settings`

Application configuration (single document or keyed documents).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | manual | Setting key (e.g., "general", "whatsapp", "delivery") |
| values | object | yes | Configuration key-value pairs |
| updatedAt | timestamp | auto | Server timestamp |
| updatedBy | string | yes | Admin user ID |

**Access Rules:** Admin read/write only.

---

## Collection: `auditLogs`

Append-only security audit records.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| action | string | yes | Action performed (e.g., product.create, order.transition) |
| actor | string | yes | User ID |
| resource | string | yes | Resource type and ID |
| details | object | no | Additional context |
| ip | string | no | Request IP (if available) |
| timestamp | timestamp | auto | Server timestamp |

**Access Rules:** Admin read only. System write only. Never deletable.

---

## Collection: `deliveryRegions`

Supported delivery regions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| name | string | yes | Region name |
| states | string[] | no | Indian states covered |
| additionalLeadDays | number | yes | Extra days beyond base lead time |
| isActive | boolean | yes | Currently available |

**Access Rules:** Public read for active. Admin write only.

---

## Collection: `feedbackSubmissions`

Customer feedback and suggestions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| publicReference | string | yes | Non-sequential reference (e.g., GB-FB7K3N) |
| type | enum | yes | One of 12 feedback types |
| category | enum | yes | Classification category |
| title | string | yes | Feedback title (max 200) |
| message | string | yes | Detailed feedback (max 5000) |
| rating | number | no | 1–5 star rating |
| relatedProductId | string | no | Product reference |
| relatedProductSnapshot | object | no | Product ID, SKU, title, slug at submission time |
| suggestedItems | string[] | no | Customer-suggested items |
| occasion | string | no | Related occasion |
| budgetRange | enum | no | Budget band |
| quantityRange | enum | no | Quantity band |
| companyName | string | no | Company name |
| contactName | string | no | Contact person |
| email | string | no | Email address (PII) |
| phone | string | no | Phone number (PII) |
| anonymous | boolean | yes | True if no identity provided |
| contactRequested | boolean | yes | True if customer wants response |
| consent | boolean | yes | Contact consent given |
| status | enum | yes | Lifecycle status |
| priority | enum | yes | low, normal, high, urgent |
| sentiment | enum | yes | Owner-classified sentiment |
| tags | string[] | no | Classification tags |
| duplicateOf | string | no | Reference to duplicate original |
| source | string | yes | Submission source (web_form, product_page) |
| idempotencyKeyHash | string | yes | Hash of idempotency key |
| isDemoData | boolean | no | True for seed data |
| createdAt | timestamp | auto | Server timestamp |
| updatedAt | timestamp | auto | Server timestamp |
| assignedTo | string | no | Admin user ID |

**Access Rules:** Public create (restricted fields). Admin read/update/delete.

**PII:** contactName, email, phone, companyName. Subject to retention and deletion policy.

### Subcollection: `feedbackSubmissions/{feedbackId}/events`

Immutable audit trail for feedback status changes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| feedbackId | string | yes | Parent feedback ID |
| previousStatus | enum | yes | Status before change |
| newStatus | enum | yes | Status after change |
| actor | string | yes | Admin user ID |
| source | string | yes | admin, system |
| reason | string | no | Reason for change |
| internalNote | string | no | Private admin note |
| timestamp | timestamp | auto | Server timestamp |

**Access Rules:** Admin read and create only. No update or delete (immutable).

---

## Collection: `recommendationRequests`

Gift-finder / "Help me choose" submissions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Document ID |
| publicReference | string | yes | Non-sequential reference |
| occasion | string | yes | Gift occasion |
| recipientGroup | string | yes | Description of recipients |
| numberOfRecipients | number | yes | Recipient count |
| budgetPerRecipient | enum | yes | Budget band per person |
| totalBudgetApprox | string | no | Estimated total |
| requiredDate | string | no | Desired delivery date |
| deliveryCityOrRegion | string | no | Delivery location |
| dietaryPreferences | string[] | no | Dietary requirements |
| sustainabilityPreference | boolean | no | Eco-friendly preference |
| personalizationRequired | boolean | no | Needs personalization |
| brandingRequired | boolean | no | Needs company branding |
| preferredCategories | string[] | no | Preferred product categories |
| productsToAvoid | string | no | Items to exclude |
| additionalNotes | string | no | Free-text notes |
| companyName | string | yes | Company name |
| contactName | string | yes | Contact person |
| email | string | yes | Email (PII) |
| phone | string | no | Phone (PII) |
| consent | boolean | yes | Must be true |
| status | enum | yes | Lifecycle status |
| priority | enum | yes | Priority level |
| matchedProductIds | string[] | no | Matched product IDs |
| source | string | yes | gift_finder |
| idempotencyKeyHash | string | yes | Idempotency hash |
| isDemoData | boolean | no | True for seed data |
| createdAt | timestamp | auto | Server timestamp |
| updatedAt | timestamp | auto | Server timestamp |
| assignedTo | string | no | Admin user ID |

**Access Rules:** Public create (status=new, priority=normal, consent=true). Admin read/update/delete.

**PII:** contactName, email, phone, companyName. Subject to retention policy.

### Subcollection: `recommendationRequests/{requestId}/events`

Same structure as feedback events. Immutable.

---

## Collection: `feedbackAggregates`

Pre-computed counts for admin dashboard. Avoids unbounded reads.

**Access Rules:** Admin read/write only.

---

## Collection: `feedbackSettings`

Configurable feedback settings (e.g., enabled types, notification preferences).

**Access Rules:** Admin read/write only.

---

## Data Retention

| Collection | Retention | Notes |
|-----------|-----------|-------|
| products | Indefinite | Archived, not deleted |
| customers | 3 years after last activity | PII deletion on request |
| inquiries | 3 years | PII redaction after retention |
| orders | 7 years | Financial record retention |
| conversations/messages | 1 year | PII, redact after retention |
| webhookEvents | 90 days | Diagnostic data |
| auditLogs | 7 years | Compliance, never delete |
| feedbackSubmissions | 3 years | PII redaction on request |
| recommendationRequests | 3 years | PII redaction on request |
| feedbackAggregates | Indefinite | No PII |
| feedbackSettings | Indefinite | Configuration only |
