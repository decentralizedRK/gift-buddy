# Gift Finder — Rule-Based Matching

## Overview
The Gift Finder uses deterministic, rule-based matching to suggest suitable hampers from the active catalog. It does not use AI or opaque algorithms.

## Matching Criteria and Scoring

| Criterion | Points | Logic |
|---|---|---|
| Occasion | 3 | Product occasion field contains the requested occasion (case-insensitive) |
| Budget range | 3 (exact) / 1 (near) | Product base price falls within the selected budget band. Near-match: within 20% of band boundaries |
| Category | 2 | Product category matches any of the preferred categories |
| Sustainability | 2 | Product tags include "eco" or "sustainable" when preference is enabled |
| Recipient group | 2 | Product recipient type contains the described group (case-insensitive) |

## Budget Ranges (in paise)

| Range | Min | Max |
|---|---|---|
| Under ₹1,000 | 0 | 1,00,000 |
| ₹1,000 – ₹2,500 | 1,00,000 | 2,50,000 |
| ₹2,500 – ₹5,000 | 2,50,000 | 5,00,000 |
| ₹5,000 – ₹10,000 | 5,00,000 | 10,00,000 |
| Above ₹10,000 | 10,00,000 | ∞ |

## Result Behavior
- Only active, in-stock products are considered.
- Results sorted by total match score (descending).
- Maximum 4 results returned.
- Each result includes factual match reasons.
- Zero-score products are excluded.

## Disclaimer
Results are informational. Final pricing, availability, customization, and delivery require owner confirmation.

## Implementation
- Source: `src/domain/gift-matcher.ts`
- Tests: `tests/unit/domain/gift-matcher.test.ts`

## Future Enhancements
- Weight adjustments based on conversion data.
- Dietary/allergy filtering.
- Seasonal boosting.
- Machine learning ranking (separate feature, with transparency requirements).
