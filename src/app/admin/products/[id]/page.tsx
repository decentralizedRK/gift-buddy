'use client';

import { use } from 'react';
import Link from 'next/link';
import { seedProducts } from '@/data/seed-products';
import { ProductForm } from '../new/page';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = seedProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you are looking for does not exist.
        </p>
        <Link
          href="/admin/products"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const initialData = {
    title: product.title,
    slug: product.slug,
    sku: product.sku,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    includedItems: product.includedItems.join('\n'),
    basePrice: product.basePrice.toString(),
    compareAtPrice: product.compareAtPrice?.toString() ?? '',
    taxClassification: product.taxClassification,
    moq: product.moq.toString(),
    leadTimeDays: product.leadTimeDays.toString(),
    stockStatus: product.stockStatus,
    status: product.status,
    personalizationOptions: product.personalizationOptions.join(', '),
    deliveryRegions: product.deliveryRegions.join(', '),
    tags: product.tags.join(', '),
    occasion: Array.isArray(product.occasion) ? product.occasion.join(', ') : String(product.occasion),
    recipientType: Array.isArray(product.recipientType) ? product.recipientType.join(', ') : String(product.recipientType),
    category: product.category,
    collection: product.collection ?? '',
    imageUrl: product.images[0]?.url ?? '',
    imageAlt: product.images[0]?.alt ?? '',
    seoTitle: product.seoTitle ?? '',
    seoDescription: product.seoDescription ?? '',
  };

  const initialVariants = product.variants.map((v) => ({
    id: v.id,
    name: v.name,
    sku: v.sku,
    price: v.price.toString(),
    description: v.description ?? '',
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Back to products"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="text-sm text-muted-foreground mt-1">{product.title}</p>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Preview
        </Link>
      </div>

      <ProductForm
        initialData={initialData}
        initialVariants={initialVariants}
        isEdit
      />
    </div>
  );
}
