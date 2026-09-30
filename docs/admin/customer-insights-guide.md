# Customer Insights — Admin Guide

## Overview
The Customer Insights section allows you to review, classify, and act on customer feedback and gift recommendation requests.

## Accessing Feedback
Navigate to **Feedback** in the admin sidebar. You will see two tabs:
- **All Feedback** — Customer suggestions, product feedback, service feedback, etc.
- **Recommendations** — Gift-finder requests where customers need help choosing hampers.

## Filtering and Searching
Use the filter bar to narrow results by:
- **Status**: new, triaged, under_review, planned, accepted, implemented, responded, closed, duplicate, rejected, spam
- **Priority**: low, normal, high, urgent
- **Category**: product, packaging, website, order_process, delivery, pricing, personalization, catalog_gap, corporate_service, other
- **Type**: Any of the 12 feedback types
- **Sentiment**: positive, neutral, negative, mixed, not_classified

Use the search box to find feedback by title, company name, or contact name.

## Managing Feedback

### Status Updates
Open a feedback item to update its status. Only valid transitions are shown. Each change is recorded in the audit timeline.

### Priority and Classification
Set priority (low/normal/high/urgent) and sentiment manually. Do not use sentiment to restrict service — it is for operational insight only.

### Internal Notes
Add private notes visible only to admins. Notes are never exposed to customers.

### Tags
Add tags for categorization (e.g., "recurring", "high-value-client", "product-idea").

## Exporting Data
Click **Export CSV** to download filtered feedback. The export:
- Includes: reference, type, category, title, message (truncated), rating, status, priority, sentiment, company, contact, email, anonymous status, source, created date.
- Excludes: phone numbers, idempotency keys, internal metadata.
- Protects against spreadsheet formula injection.

## Recommendation Requests
Gift-finder submissions include occasion, recipient details, budget, preferences, and matched product suggestions. Review these to prepare custom quotes.

## Privacy
- Some feedback is submitted anonymously — respect this.
- Contact details appear only when the customer provided them.
- Consent must be given before contacting the customer.
- Do not share individual feedback externally without consent.
