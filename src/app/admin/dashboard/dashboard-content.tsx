'use client';

import Link from 'next/link';
import { useProducts, useFeedbackItems, useRecommendations } from '@/hooks/use-data';
import { LoadingState } from '@/components/LoadingState';
import { formatPrice, formatDate, truncate } from '@/lib/format';
import type { OrderStatus } from '@/domain/order';

/* Demo data ---------------------------------------------------------------- */

interface DemoOrder {
  id: string;
  referenceNumber: string;
  customerName: string;
  companyName: string;
  status: OrderStatus;
  total: number;
  date: string;
}

const RECENT_ORDERS: DemoOrder[] = [
  {
    id: 'ord_001',
    referenceNumber: 'GB-2024-0042',
    customerName: 'Priya Sharma',
    companyName: 'TechVista Solutions',
    status: 'inquiry_received',
    total: 249900 * 25,
    date: '2024-09-28T10:30:00Z',
  },
  {
    id: 'ord_002',
    referenceNumber: 'GB-2024-0041',
    customerName: 'Arjun Mehta',
    companyName: 'Pinnacle Corp',
    status: 'quote_sent',
    total: 599900 * 10,
    date: '2024-09-27T14:15:00Z',
  },
  {
    id: 'ord_003',
    referenceNumber: 'GB-2024-0040',
    customerName: 'Neha Kapoor',
    companyName: 'GreenLeaf Organics',
    status: 'confirmed',
    total: 349900 * 50,
    date: '2024-09-26T09:00:00Z',
  },
  {
    id: 'ord_004',
    referenceNumber: 'GB-2024-0039',
    customerName: 'Rohan Desai',
    companyName: 'Stellar Innovations',
    status: 'dispatched',
    total: 199900 * 100,
    date: '2024-09-25T16:45:00Z',
  },
  {
    id: 'ord_005',
    referenceNumber: 'GB-2024-0038',
    customerName: 'Ananya Gupta',
    companyName: 'BrightPath Analytics',
    status: 'delivered',
    total: 449900 * 15,
    date: '2024-09-24T11:20:00Z',
  },
];

/* Status badge helper ------------------------------------------------------ */

const STATUS_STYLES: Record<string, string> = {
  inquiry_received: 'bg-blue-100 text-blue-800',
  qualification_pending: 'bg-yellow-100 text-yellow-800',
  quote_preparing: 'bg-orange-100 text-orange-800',
  quote_sent: 'bg-purple-100 text-purple-800',
  customer_approved: 'bg-indigo-100 text-indigo-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  procurement: 'bg-teal-100 text-teal-800',
  packing: 'bg-cyan-100 text-cyan-800',
  ready_to_dispatch: 'bg-sky-100 text-sky-800',
  dispatched: 'bg-violet-100 text-violet-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-rose-100 text-rose-800',
  on_hold: 'bg-amber-100 text-amber-800',
  delivery_failed: 'bg-red-100 text-red-800',
};

const FEEDBACK_STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  triaged: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-orange-100 text-orange-800',
  planned: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  implemented: 'bg-green-100 text-green-800',
  responded: 'bg-teal-100 text-teal-800',
  closed: 'bg-gray-100 text-gray-600',
  duplicate: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-800',
  spam: 'bg-red-100 text-red-800',
};

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* Page --------------------------------------------------------------------- */

export default function DashboardContent() {
  const { data: products, loading: pLoading } = useProducts();
  const { data: feedbackItems, loading: fLoading } = useFeedbackItems();
  const { data: recommendations, loading: rLoading } = useRecommendations();

  if (pLoading || fLoading || rLoading) return <LoadingState />;

  const newFeedbackCount = feedbackItems.filter((fb) => fb.status === 'new').length;
  const pendingRecommendationsCount = recommendations.filter(
    (r) => r.status === 'new' || r.status === 'under_review'
  ).length;

  const SUMMARY_CARDS = [
    {
      label: 'Total Products',
      value: products.length.toString(),
      change: '+2 this month',
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Active Orders',
      value: '12',
      change: '3 pending action',
      color: 'bg-accent/10 text-accent-foreground',
    },
    {
      label: 'Pending Inquiries',
      value: '5',
      change: '2 new today',
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Total Customers',
      value: '28',
      change: '+4 this month',
      color: 'bg-secondary text-secondary-foreground',
    },
    {
      label: 'New Feedback',
      value: newFeedbackCount.toString(),
      change: 'Awaiting triage',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Pending Recommendations',
      value: pendingRecommendationsCount.toString(),
      change: 'Need response',
      color: 'bg-orange-100 text-orange-800',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your Gift Buddy store
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-background p-5"
          >
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
            <p className={`mt-1 text-xs ${card.color} inline-block px-2 py-0.5 rounded-full`}>
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Reference</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Total</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 font-mono text-xs">{order.referenceNumber}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.companyName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? 'bg-muted text-muted-foreground'}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent feedback */}
      <div className="rounded-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Feedback</h2>
          <Link
            href="/admin/feedback"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Reference</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Title</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...feedbackItems]
                .sort((a, b) => new Date(b.createdAt as unknown as string).getTime() - new Date(a.createdAt as unknown as string).getTime())
                .slice(0, 5)
                .map((fb) => (
                  <tr key={fb.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-mono text-xs">{fb.publicReference}</td>
                    <td className="px-5 py-3 text-foreground" title={fb.title}>
                      {truncate(fb.title, 40)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${FEEDBACK_STATUS_STYLES[fb.status] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {statusLabel(fb.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/feedback/${fb.id}`}
                        className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Add Product</p>
              <p className="text-xs text-muted-foreground">Create new hamper</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Process Orders</p>
              <p className="text-xs text-muted-foreground">Review pending</p>
            </div>
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Customers</p>
              <p className="text-xs text-muted-foreground">View directory</p>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <svg className="h-5 w-5 text-secondary-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Categories</p>
              <p className="text-xs text-muted-foreground">Manage catalog</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
