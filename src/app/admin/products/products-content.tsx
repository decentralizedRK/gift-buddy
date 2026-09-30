'use client';

import Link from 'next/link';
import { useProducts } from '@/hooks/use-data';
import { LoadingState } from '@/components/LoadingState';
import { formatPrice } from '@/lib/format';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-600',
};

const STOCK_BADGE: Record<string, string> = {
  in_stock: 'text-green-700',
  limited: 'text-amber-700',
  out_of_stock: 'text-red-700',
  made_to_order: 'text-blue-700',
};

function stockLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ProductsContent() {
  const { data: products, loading } = useProducts();

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your gift hamper catalog ({products.length} products)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground w-12">
                  <span className="sr-only">Image</span>
                </th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Title</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">SKU</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Price</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Stock</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                      {product.shortDescription}
                    </p>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{formatPrice(product.basePrice)}</p>
                    {product.compareAtPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice)}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[product.status] ?? 'bg-muted text-muted-foreground'}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium ${STOCK_BADGE[product.stockStatus] ?? 'text-muted-foreground'}`}>
                      {stockLabel(product.stockStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Archive
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
