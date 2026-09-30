import { seedProducts } from '@/data/seed-products';
import EditProductPage from './edit-product';

export function generateStaticParams() {
  return seedProducts.map((p) => ({ id: p.id }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditProductPage params={params} />;
}
