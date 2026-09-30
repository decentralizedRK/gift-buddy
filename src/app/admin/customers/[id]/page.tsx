import CustomerDetailPage from './customer-detail';

export function generateStaticParams() {
  return [{ id: 'cust_001' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <CustomerDetailPage params={params} />;
}
