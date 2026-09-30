'use client';

import { useProducts } from '@/hooks/use-data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { LoadingState } from '@/components/LoadingState';

export default function ProductsContent() {
  const { data: products, loading } = useProducts();

  if (loading) return <LoadingState />;

  const activeProducts = products.filter((p) => p.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          All Gift Hampers
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Explore our curated collection of premium corporate gift hampers.
          Each hamper is thoughtfully assembled with quality products and can
          be personalized to suit your brand.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProducts.map((product) => (
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

      {activeProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No products available at the moment. Please check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
