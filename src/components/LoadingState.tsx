'use client';

export function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3 mb-4" />
      <div className="h-4 bg-muted rounded w-2/3 mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="aspect-square bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingStateCompact() {
  return (
    <div className="animate-pulse space-y-4 py-8">
      <div className="h-6 bg-muted rounded w-1/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="space-y-3 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}
