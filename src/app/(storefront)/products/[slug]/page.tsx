import type { Metadata } from 'next';
import { seedProducts } from '@/data/seed-products';
import { APP_NAME } from '@/lib/constants';
import ProductDetailContent from './product-detail-content';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seedProducts.map((product) => ({ slug: product.slug }));
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

export default function ProductDetailPage({ params }: Props) {
  return <ProductDetailContent params={params} />;
}
