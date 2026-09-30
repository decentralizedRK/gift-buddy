'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { seedProducts } from '@/data/seed-products';
import { ProductCard } from '@/components/storefront/ProductCard';

export function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    return seedProducts.filter((product) => {
      if (product.status !== 'active') return false;
      const titleMatch = product.title.toLowerCase().includes(lowerQuery);
      const descMatch = product.shortDescription.toLowerCase().includes(lowerQuery);
      const tagMatch = product.tags.some((tag) =>
        tag.toLowerCase().includes(lowerQuery)
      );
      const occasionMatch = product.occasion.toLowerCase().includes(lowerQuery);
      const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
      return titleMatch || descMatch || tagMatch || occasionMatch || categoryMatch;
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Search Products
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Find the perfect corporate gift hamper.
        </p>
      </div>

      <div className="max-w-2xl mb-10">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, occasion, tags..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-lg"
            autoFocus
          />
        </div>
      </div>

      {query.trim() ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
            <span className="font-medium text-foreground">&quot;{query}&quot;</span>
          </p>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  slug={product.slug}
                  title={product.title}
                  shortDescription={product.shortDescription}
                  basePrice={product.basePrice}
                  compareAtPrice={product.compareAtPrice}
                  images={product.images}
                  stockStatus={product.stockStatus}
                  occasion={[product.occasion]}
                  tags={product.tags}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-muted-foreground opacity-40">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <p className="mt-4 text-muted-foreground text-lg">
                No products match your search.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try different keywords or browse our{' '}
                <a href="/products" className="text-primary hover:text-primary/80 transition-colors">
                  full catalog
                </a>
                .
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-muted-foreground opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="mt-4 text-muted-foreground text-lg">
            Start typing to search for gift hampers.
          </p>
        </div>
      )}
    </div>
  );
}
