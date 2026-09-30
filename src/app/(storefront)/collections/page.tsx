import type { Metadata } from 'next';
import Link from 'next/link';
import { seedCollections } from '@/data/seed-collections';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Browse our curated gift hamper collections. From best sellers to premium selections, find the right collection for your corporate gifting needs.',
};

export default function CollectionsPage() {
  const activeCollections = seedCollections.filter((c) => c.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Gift Collections
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          Discover our carefully curated collections, each designed to make
          corporate gifting simple and impactful.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {activeCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group block rounded-xl border border-border bg-background overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[2/1] bg-muted relative flex items-center justify-center">
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
                  d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
                />
              </svg>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {collection.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {collection.description}
              </p>
              <p className="mt-3 text-sm text-primary font-medium">
                {collection.productSlugs.length}{' '}
                {collection.productSlugs.length === 1 ? 'product' : 'products'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
