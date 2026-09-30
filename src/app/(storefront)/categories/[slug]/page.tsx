import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { seedCategories } from '@/data/seed-categories';
import { seedProducts } from '@/data/seed-products';
import { ProductCard } from '@/components/storefront/ProductCard';
import { APP_NAME } from '@/lib/constants';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seedCategories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = seedCategories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | ${APP_NAME}`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = seedCategories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = seedProducts.filter(
    (p) => p.category === category.slug && p.status === 'active'
  );

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
            <Link href="/categories" className="hover:text-primary transition-colors">
              Categories
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium">{category.name}</li>
        </ol>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {category.name}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          {category.description}
        </p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              title={product.title}
              shortDescription={product.shortDescription}
              basePrice={product.basePrice}
              compareAtPrice={product.compareAtPrice}
              images={product.images}
              stockStatus={product.stockStatus}
              occasion={[product.occasion]}
              tags={product.tags}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-muted-foreground opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <p className="mt-4 text-muted-foreground text-lg">
            No products in this category yet.
          </p>
          <Link href="/products" className="mt-4 inline-block text-primary font-medium hover:text-primary/80 transition-colors">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
}
