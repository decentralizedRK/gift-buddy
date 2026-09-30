import type { GiftMatchCriteria, GiftMatchResult, BudgetRange } from './feedback';

interface MatchableProduct {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  occasion: string | string[];
  category: string;
  tags: string[];
  recipientType: string | string[];
  status: string;
  stockStatus: string;
}

const BUDGET_RANGES: Record<BudgetRange, { min: number; max: number }> = {
  under_1000: { min: 0, max: 100000 },
  '1000_2500': { min: 100000, max: 250000 },
  '2500_5000': { min: 250000, max: 500000 },
  '5000_10000': { min: 500000, max: 1000000 },
  above_10000: { min: 1000000, max: Infinity },
};

export function matchProducts(
  products: MatchableProduct[],
  criteria: GiftMatchCriteria,
  maxResults = 4
): GiftMatchResult[] {
  const activeProducts = products.filter(
    (p) => p.status === 'active' && p.stockStatus !== 'out_of_stock'
  );

  const scored: GiftMatchResult[] = activeProducts.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    if (criteria.occasion) {
      const occasions = Array.isArray(product.occasion)
        ? product.occasion
        : [product.occasion];
      if (occasions.some((o) => o.toLowerCase().includes(criteria.occasion!.toLowerCase()))) {
        score += 3;
        reasons.push(`Suitable for ${criteria.occasion} occasions`);
      }
    }

    if (criteria.budgetRange) {
      const range = BUDGET_RANGES[criteria.budgetRange];
      if (range && product.basePrice >= range.min && product.basePrice < range.max) {
        score += 3;
        reasons.push('Within your budget range');
      } else if (range && product.basePrice < range.max * 1.2 && product.basePrice >= range.min * 0.8) {
        score += 1;
        reasons.push('Close to your budget range');
      }
    }

    if (criteria.categories && criteria.categories.length > 0) {
      if (criteria.categories.some((c) => c.toLowerCase() === product.category.toLowerCase())) {
        score += 2;
        reasons.push(`Matches preferred category`);
      }
    }

    if (criteria.sustainabilityPreference) {
      if (product.tags.some((t) => t.toLowerCase().includes('eco') || t.toLowerCase().includes('sustainable'))) {
        score += 2;
        reasons.push('Eco-friendly and sustainable option');
      }
    }

    if (criteria.recipientGroup) {
      const recipientTypes = Array.isArray(product.recipientType)
        ? product.recipientType
        : [product.recipientType];
      if (recipientTypes.some((r) => r.toLowerCase().includes(criteria.recipientGroup!.toLowerCase()))) {
        score += 2;
        reasons.push(`Designed for ${criteria.recipientGroup}`);
      }
    }

    return {
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      basePrice: product.basePrice,
      matchReasons: reasons,
      matchScore: score,
    };
  });

  return scored
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);
}
