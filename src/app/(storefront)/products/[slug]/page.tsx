import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { seedProducts } from '@/data/seed-products';
import { formatPrice } from '@/lib/format';
import { APP_NAME } from '@/lib/constants';
import { ProductDetailClient } from './product-detail-client';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seedProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = seedProducts.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.seoTitle || `${product.title} | ${APP_NAME}`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = seedProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium truncate">{product.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Area */}
        <div className="aspect-square bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="text-muted-foreground text-center p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={0.5}
              stroke="currentColor"
              className="w-32 h-32 mx-auto opacity-30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
            <p className="mt-4 text-sm">Product image placeholder</p>
          </div>
          {(product.stockStatus as string) === 'out_of_stock' && (
            <div className="absolute top-4 left-4 bg-muted-foreground text-background text-sm font-medium px-3 py-1.5 rounded">
              Out of Stock
            </div>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
            <div className="absolute top-4 right-4 bg-destructive text-white text-sm font-medium px-3 py-1.5 rounded">
              Sale
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-primary font-medium uppercase tracking-wide mb-2">
            {product.occasion}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {product.title}
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            {product.shortDescription}
          </p>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.basePrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Key Info */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span className="text-muted-foreground">
                Lead time: <span className="text-foreground font-medium">{product.leadTimeDays} days</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
              <span className="text-muted-foreground">
                MOQ: <span className="text-foreground font-medium">{product.moq} units</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-3.146c-.287 0-.56-.116-.759-.316l-2.714-2.714A2.25 2.25 0 0 0 12.107 9H8.25M3.75 18.75h.375m.375-13.5h13.5A2.25 2.25 0 0 1 20.25 7.5v4.5" />
              </svg>
              <span className="text-muted-foreground">
                Delivery: <span className="text-foreground font-medium">{product.deliveryRegions.join(', ').replace(/_/g, ' ')}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span className="text-muted-foreground">
                SKU: <span className="text-foreground font-medium">{product.sku}</span>
              </span>
            </div>
          </div>

          {/* Client-side interactive section: variants, quantity, add to cart */}
          <ProductDetailClient
            variants={product.variants}
            stockStatus={product.stockStatus}
            moq={product.moq}
          />

          {/* Personalization Options */}
          {product.personalizationOptions.length > 0 && (
            <div className="mt-8 p-4 bg-secondary/30 rounded-lg">
              <h3 className="font-semibold text-foreground text-sm">
                Personalization Options
              </h3>
              <ul className="mt-2 space-y-1">
                {product.personalizationOptions.map((option) => (
                  <li key={option} className="text-sm text-muted-foreground flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-primary flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 border-t border-border pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Description Tab */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          {/* Included Items Tab */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Included Items ({product.includedItems.length})
            </h2>
            <ul className="space-y-2">
              {product.includedItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-success mt-0.5 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Info Tab */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Delivery Information</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">Lead Time</dt>
                <dd className="text-muted-foreground mt-1">
                  {product.leadTimeDays} business days from order confirmation
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Minimum Order Quantity</dt>
                <dd className="text-muted-foreground mt-1">{product.moq} units</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Delivery Regions</dt>
                <dd className="text-muted-foreground mt-1">
                  {product.deliveryRegions.map((r) => r.replace(/_/g, ' ')).join(', ')}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Tax</dt>
                <dd className="text-muted-foreground mt-1">
                  {product.taxClassification.replace('_', ' ')} applicable
                </dd>
              </div>
            </dl>
            <div className="mt-6">
              <Link
                href="/delivery-info"
                className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
              >
                View full delivery policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
