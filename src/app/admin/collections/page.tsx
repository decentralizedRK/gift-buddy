'use client';

import { useState, useEffect } from 'react';
import { useCollections } from '@/hooks/use-data';
import { LoadingState } from '@/components/LoadingState';
import { formatDate } from '@/lib/format';

export default function CollectionsPage() {
  const { data: rawCollections, loading } = useCollections();
  const [collections, setCollections] = useState(
    rawCollections.map((c) => ({ ...c, status: c.status as 'active' | 'archived' }))
  );

  useEffect(() => {
    setCollections(
      rawCollections.map((c) => ({ ...c, status: c.status as 'active' | 'archived' }))
    );
  }, [rawCollections]);

  if (loading) return <LoadingState />;

  function toggleStatus(id: string) {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? ('archived' as const) : ('active' as const) }
          : c
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage curated product collections ({collections.length} collections)
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Collection
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Order</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Name</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Slug</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Description</th>
                <th className="px-5 py-3 font-medium text-muted-foreground text-right">Products</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr
                  key={collection.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-5 py-3 text-muted-foreground text-center">
                    {collection.displayOrder}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {collection.name}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {collection.slug}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground max-w-xs">
                    <p className="truncate">{collection.description}</p>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {collection.productSlugs.length}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        collection.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {collection.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatDate(collection.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(collection.id)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                          collection.status === 'active'
                            ? 'text-destructive hover:bg-destructive/10'
                            : 'text-success hover:bg-success/10'
                        }`}
                      >
                        {collection.status === 'active' ? 'Archive' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
