import type { Metadata } from 'next';
import ProductsContent from './products-content';

export const metadata: Metadata = {
  title: 'All Products',
  description:
    'Browse our complete collection of premium corporate gift hampers. Find the perfect gift for employee onboarding, appreciation, festivals, and more.',
};

export default function ProductsPage() {
  return <ProductsContent />;
}
