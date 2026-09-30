export const seedCollections = [
  {
    id: 'col_best_sellers',
    slug: 'best-sellers',
    name: 'Best Sellers',
    description:
      'Our most popular corporate gift hampers, loved by companies across India for their quality and thoughtful curation.',
    image: '/images/collections/best-sellers.jpg',
    displayOrder: 1,
    status: 'active' as const,
    productSlugs: ['wellness-mindfulness-hamper', 'remote-work-essentials-hamper'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'col_new_arrivals',
    slug: 'new-arrivals',
    name: 'New Arrivals',
    description:
      'Freshly curated hampers just added to our catalog. Discover the latest in corporate gifting.',
    image: '/images/collections/new-arrivals.jpg',
    displayOrder: 2,
    status: 'active' as const,
    productSlugs: ['sustainable-onboarding-hamper'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'col_budget_friendly',
    slug: 'budget-friendly',
    name: 'Budget-Friendly',
    description:
      'Quality corporate gifts under INR 3,000. Perfect for large teams and company-wide celebrations.',
    image: '/images/collections/budget-friendly.jpg',
    displayOrder: 3,
    status: 'active' as const,
    productSlugs: [
      'sustainable-onboarding-hamper',
      'festival-celebration-hamper',
      'remote-work-essentials-hamper',
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'col_premium_selection',
    slug: 'premium-selection',
    name: 'Premium Selection',
    description:
      'Luxury hampers starting at INR 4,000 for executive gifts, client appreciation, and milestone celebrations.',
    image: '/images/collections/premium-selection.jpg',
    displayOrder: 4,
    status: 'active' as const,
    productSlugs: ['executive-appreciation-hamper', 'premium-gourmet-hamper'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];
