import { describe, it, expect } from 'vitest';
import { matchProducts } from '@/domain/gift-matcher';
import { seedProducts } from '@/data/seed-products';

// Cast seed products to the shape matchProducts expects
const products = seedProducts as Parameters<typeof matchProducts>[0];

describe('matchProducts', () => {
  it('returns empty array when no criteria match', () => {
    const results = matchProducts(products, { occasion: 'nonexistent_event_xyz' });
    expect(results).toEqual([]);
  });

  it('matches products by occasion', () => {
    const results = matchProducts(products, { occasion: 'festival' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.productId === 'prod_festival_celebration')).toBe(true);
  });

  it('matches products by budget range (under_1000)', () => {
    // under_1000 = 0 to 100000 paise. No seed products are that cheap, so empty.
    const results = matchProducts(products, { budgetRange: 'under_1000' });
    expect(results).toEqual([]);
  });

  it('matches products by budget range (1000_2500)', () => {
    // 1000_2500 = 100000 to 250000 paise. Festival hamper at 199900 fits.
    const results = matchProducts(products, { budgetRange: '1000_2500' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.productId === 'prod_festival_celebration')).toBe(true);
  });

  it('matches products by category', () => {
    const results = matchProducts(products, { categories: ['gourmet-food'] });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.productId === 'prod_premium_gourmet')).toBe(true);
  });

  it('matches products by sustainability tags', () => {
    const results = matchProducts(products, { sustainabilityPreference: true });
    expect(results.length).toBeGreaterThan(0);
    // Sustainable onboarding hamper has eco-friendly and sustainable tags
    expect(results.some((r) => r.productId === 'prod_sustainable_onboarding')).toBe(true);
  });

  it('matches products by recipient group', () => {
    const results = matchProducts(products, { recipientGroup: 'client' });
    expect(results.length).toBeGreaterThan(0);
    // Premium gourmet has recipientType 'client'
    expect(results.some((r) => r.productId === 'prod_premium_gourmet')).toBe(true);
  });

  it('combines multiple criteria for higher scores', () => {
    // Sustainable onboarding: occasion=onboarding, category=corporate-gifting, has eco tags
    const results = matchProducts(products, {
      occasion: 'onboarding',
      categories: ['corporate-gifting'],
      sustainabilityPreference: true,
    });
    expect(results.length).toBeGreaterThan(0);
    // Sustainable onboarding should score highest (occasion=3, category=2, sustainability=2 = 7)
    expect(results[0].productId).toBe('prod_sustainable_onboarding');
    expect(results[0].matchScore).toBe(7);
  });

  it('sorts results by match score descending', () => {
    const results = matchProducts(products, {
      occasion: 'appreciation',
      categories: ['gourmet-food'],
    });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].matchScore).toBeGreaterThanOrEqual(results[i].matchScore);
    }
  });

  it('respects maxResults limit', () => {
    // All employee products will match recipientGroup=employee
    const results = matchProducts(products, { recipientGroup: 'employee' }, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('excludes inactive products', () => {
    const productsWithInactive = [
      ...products,
      {
        id: 'prod_inactive',
        title: 'Inactive Product',
        slug: 'inactive-product',
        basePrice: 199900,
        occasion: 'festival',
        category: 'festival-seasonal',
        tags: ['festival'],
        recipientType: 'employee',
        status: 'archived' as const,
        stockStatus: 'in_stock' as const,
      },
    ];
    const results = matchProducts(productsWithInactive, { occasion: 'festival' });
    expect(results.every((r) => r.productId !== 'prod_inactive')).toBe(true);
  });

  it('excludes out_of_stock products', () => {
    const productsWithOOS = [
      ...products,
      {
        id: 'prod_oos',
        title: 'Out of Stock Product',
        slug: 'out-of-stock-product',
        basePrice: 199900,
        occasion: 'festival',
        category: 'festival-seasonal',
        tags: ['festival'],
        recipientType: 'employee',
        status: 'active' as const,
        stockStatus: 'out_of_stock' as const,
      },
    ];
    const results = matchProducts(productsWithOOS, { occasion: 'festival' });
    expect(results.every((r) => r.productId !== 'prod_oos')).toBe(true);
  });

  it('returns match reasons for each criterion matched', () => {
    const results = matchProducts(products, {
      occasion: 'onboarding',
      sustainabilityPreference: true,
    });
    const onboarding = results.find((r) => r.productId === 'prod_sustainable_onboarding');
    expect(onboarding).toBeDefined();
    expect(onboarding!.matchReasons.length).toBeGreaterThanOrEqual(2);
    expect(onboarding!.matchReasons.some((r) => r.includes('onboarding'))).toBe(true);
    expect(onboarding!.matchReasons.some((r) => r.includes('sustainable') || r.includes('Eco'))).toBe(true);
  });

  it('budget range edge case: product at exact lower boundary', () => {
    // 1000_2500 range: min=100000, max=250000. Product at exactly 100000 should match.
    const edgeProducts = [
      {
        id: 'prod_edge',
        title: 'Edge Product',
        slug: 'edge-product',
        basePrice: 100000,
        occasion: 'test',
        category: 'test',
        tags: [],
        recipientType: 'test',
        status: 'active' as const,
        stockStatus: 'in_stock' as const,
      },
    ];
    const results = matchProducts(edgeProducts, { budgetRange: '1000_2500' });
    expect(results.length).toBe(1);
    expect(results[0].matchReasons).toContain('Within your budget range');
  });

  it('budget range edge case: product at exact upper boundary is excluded from exact match', () => {
    // 1000_2500 range: min=100000, max=250000. Product at exactly 250000 is NOT < max.
    // But 250000 < 250000 * 1.2 = 300000 and >= 100000 * 0.8 = 80000, so "close" match.
    const edgeProducts = [
      {
        id: 'prod_upper',
        title: 'Upper Edge Product',
        slug: 'upper-edge',
        basePrice: 250000,
        occasion: 'test',
        category: 'test',
        tags: [],
        recipientType: 'test',
        status: 'active' as const,
        stockStatus: 'in_stock' as const,
      },
    ];
    const results = matchProducts(edgeProducts, { budgetRange: '1000_2500' });
    expect(results.length).toBe(1);
    expect(results[0].matchReasons).toContain('Close to your budget range');
  });

  it('case-insensitive matching for occasion', () => {
    const results = matchProducts(products, { occasion: 'FESTIVAL' });
    expect(results.some((r) => r.productId === 'prod_festival_celebration')).toBe(true);
  });

  it('case-insensitive matching for category', () => {
    const results = matchProducts(products, { categories: ['GOURMET-FOOD'] });
    expect(results.some((r) => r.productId === 'prod_premium_gourmet')).toBe(true);
  });

  it('returns productId, productTitle, productSlug, basePrice for each match', () => {
    const results = matchProducts(products, { occasion: 'festival' });
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result).toHaveProperty('productId');
      expect(result).toHaveProperty('productTitle');
      expect(result).toHaveProperty('productSlug');
      expect(result).toHaveProperty('basePrice');
      expect(typeof result.productId).toBe('string');
      expect(typeof result.productTitle).toBe('string');
      expect(typeof result.productSlug).toBe('string');
      expect(typeof result.basePrice).toBe('number');
    }
  });

  it('default maxResults is 4', () => {
    // All seed products match 'employee' recipientGroup (4 of 6), ensure default cap
    const results = matchProducts(products, { recipientGroup: 'employee' });
    expect(results.length).toBeLessThanOrEqual(4);
  });
});
