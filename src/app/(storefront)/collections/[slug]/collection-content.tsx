'use client';

import { use } from 'react';
import Link from 'next/link';
import { useCollection, useProducts } from '@/hooks/use-data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { LoadingState } from '@/components/LoadingState';

export default function CollectionContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: collection, loading: colLoading } = useCollection(slug);
  const { data: products, loading: pLoading } = useProducts();

  if (colLoading || pLoading) return <LoadingState />;

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Collection Not Found</h1>
        <Link href="/collections" className="mt-4 inline-block text-primary font-medium">
          Browse all collections
        </Link>
      </div>
    );
  }

  const collectionProducts = products.filter(
    (p) => collection.productSlugs.includes(p.slug) && p.status === 'active'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/collections" className="hover:text-primary transition-colors">Collections</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium">{collection.name}</li>
        </ol>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{collection.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{collection.description}</p>
      </div>

      {collectionProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionProducts.map((product) => (
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
          </svg>
          <p className="mt-4 text-muted-foreground text-lg">No products in this collection yet.</p>
          <Link href="/products" className="mt-4 inline-block text-primary font-medium hover:text-primary/80 transition-colors">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
}
