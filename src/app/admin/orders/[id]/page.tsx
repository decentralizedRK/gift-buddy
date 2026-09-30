import OrderDetailPage from './order-detail';

export function generateStaticParams() {
  return [{ id: 'ord_001' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <OrderDetailPage params={params} />;
}
