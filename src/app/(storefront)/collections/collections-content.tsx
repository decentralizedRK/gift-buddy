'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCollections } from '@/hooks/use-data';
import { LoadingState } from '@/components/LoadingState';
import { imagePath } from '@/lib/image-path';

export default function CollectionsContent() {
  const { data: collections, loading } = useCollections();

  if (loading) return <LoadingState />;

  const activeCollections = collections.filter((c) => c.status === 'active');

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
            <div className="aspect-[2/1] bg-muted relative overflow-hidden">
              <Image
                src={imagePath(collection.image ?? '/images/placeholder.jpg')}
                alt={collection.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
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
