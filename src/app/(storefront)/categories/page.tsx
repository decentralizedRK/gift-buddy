import type { Metadata } from 'next';
import Link from 'next/link';
import { seedCategories } from '@/data/seed-categories';
import { seedProducts } from '@/data/seed-products';

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse corporate gift hampers by category. Find gifts for onboarding, festivals, wellness, gourmet, and employee recognition.',
};

export default function CategoriesPage() {
  const activeCategories = seedCategories.filter((c) => c.status === 'active');

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
          const productCount = seedProducts.filter(
            (p) => p.category === category.slug && p.status === 'active'
          ).length;

          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block rounded-xl border border-border bg-background overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/9] bg-muted relative flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={0.5}
                  stroke="currentColor"
                  className="w-20 h-20 text-muted-foreground opacity-30"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
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
