import { Suspense } from 'react';
import { SearchContent } from './search-content';

export const metadata = {
  title: 'Search Products',
  description: 'Search for the perfect corporate gift hamper.',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
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
            <div className="h-12 rounded-lg border border-border bg-muted/30 animate-pulse" />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
