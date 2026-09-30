'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/use-data';
import { LoadingState } from '@/components/LoadingState';
import { formatDate } from '@/lib/format';

export default function CategoriesPage() {
  const { data: rawCategories, loading } = useCategories();
  const [categories, setCategories] = useState(
    rawCategories.map((c) => ({ ...c, status: c.status as 'active' | 'archived' }))
  );

  useEffect(() => {
    setCategories(
      rawCategories.map((c) => ({ ...c, status: c.status as 'active' | 'archived' }))
    );
  }, [rawCategories]);

  if (loading) return <LoadingState />;

  function toggleStatus(id: string) {
    setCategories((prev) =>
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
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product categories ({categories.length} categories)
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
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
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-5 py-3 text-muted-foreground text-center">
                    {category.displayOrder}
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {category.name}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground max-w-xs">
                    <p className="truncate">{category.description}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        category.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatDate(category.createdAt)}
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
                        onClick={() => toggleStatus(category.id)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                          category.status === 'active'
                            ? 'text-destructive hover:bg-destructive/10'
                            : 'text-success hover:bg-success/10'
                        }`}
                      >
                        {category.status === 'active' ? 'Archive' : 'Activate'}
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
