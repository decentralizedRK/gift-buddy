'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCategories, useProducts } from '@/hooks/use-data';
import { LoadingState } from '@/components/LoadingState';
import { imagePath } from '@/lib/image-path';

export default function CategoriesContent() {
  const { data: categories, loading: cLoading } = useCategories();
  const { data: products, loading: pLoading } = useProducts();

  if (cLoading || pLoading) return <LoadingState />;

  const activeCategories = categories.filter((c) => c.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Gift Categories
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Explore our curated categories to find the perfect corporate gift
          hamper for every occasion and recipient.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCategories.map((category) => {
          const productCount = products.filter(
            (p) => p.category === category.slug && p.status === 'active'
          ).length;

          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block rounded-xl border border-border bg-background overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                <Image
                  src={imagePath(category.image ?? '/images/placeholder.jpg')}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
                <p className="mt-3 text-sm text-primary font-medium">
                  {productCount} {productCount === 1 ? 'product' : 'products'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
