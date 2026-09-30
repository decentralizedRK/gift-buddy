'use client';

import { use } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/format';
import type { OrderStatus } from '@/domain/order';

/* Demo data ---------------------------------------------------------------- */

interface DemoCustomerDetail {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  normalizedPhone: string;
  email: string;
  addresses: {
    label: string;
    line1: string;
    city: string;
    state: string;
    postalCode: string;
  }[];
  notes: string;
  createdAt: string;
}

interface DemoCustomerOrder {
  id: string;
  referenceNumber: string;
  status: OrderStatus;
  total: number;
  date: string;
}

const DEMO_CUSTOMER: DemoCustomerDetail = {
  id: 'cust_001',
  companyName: 'TechVista Solutions',
  contactName: 'Priya Sharma',
  phone: '+91 98765 43210',
  normalizedPhone: '+919876543210',
  email: 'priya@techvista.com',
  addresses: [
    {
      label: 'Head Office',
      line1: '4th Floor, Tower B, Tech Park, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560066',
    },
    {
      label: 'Branch Office',
      line1: '201, Business Centre, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
    },
  ],
  notes: 'Key account. Prefers eco-friendly products. Budget approvals happen quarterly.',
  createdAt: '2024-06-15T00:00:00Z',
};

const DEMO_ORDERS: DemoCustomerOrder[] = [
  {
    id: 'ord_001',
    referenceNumber: 'GB-2024-0042',
    status: 'quote_sent',
    total: 349900 * 25,
    date: '2024-09-28T10:30:00Z',
  },
  {
    id: 'ord_010',
    referenceNumber: 'GB-2024-0031',
    status: 'delivered',
    total: 249900 * 50,
    date: '2024-08-15T09:00:00Z',
  },
  {
    id: 'ord_015',
    referenceNumber: 'GB-2024-0018',
    status: 'delivered',
    total: 199900 * 100,
    date: '2024-07-01T11:00:00Z',
  },
  {
    id: 'ord_020',
    referenceNumber: 'GB-2024-0005',
    status: 'delivered',
    total: 299900 * 30,
    date: '2024-06-20T14:00:00Z',
  },
];

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

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* Page --------------------------------------------------------------------- */

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customer = DEMO_CUSTOMER;
  void id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Back to customers"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{customer.companyName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customer since {formatDate(customer.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order history */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Order History ({DEMO_ORDERS.length} orders)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Reference</th>
                    <th className="pb-2 font-medium text-muted-foreground">Status</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Total</th>
                    <th className="pb-2 font-medium text-muted-foreground">Date</th>
                    <th className="pb-2 font-medium text-muted-foreground">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ORDERS.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-3 font-mono text-xs">{order.referenceNumber}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? 'bg-muted text-muted-foreground'}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-foreground">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 text-muted-foreground">{formatDate(order.date)}</td>
                      <td className="py-3">
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
          </section>

          {/* Conversation history placeholder */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Conversation History
            </h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <svg className="h-10 w-10 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <p className="text-sm text-muted-foreground">
                WhatsApp conversation history will appear here once the integration is configured.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Contact Information
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Contact Name</dt>
                <dd className="font-medium text-foreground mt-0.5">{customer.contactName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium text-foreground mt-0.5">{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Normalized Phone</dt>
                <dd className="font-mono text-xs text-muted-foreground mt-0.5">
                  {customer.normalizedPhone}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-foreground mt-0.5">{customer.email}</dd>
              </div>
            </dl>
          </section>

          {/* Addresses */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Addresses</h2>
            <div className="space-y-4">
              {customer.addresses.map((addr, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-foreground">{addr.label}</p>
                  <p className="text-muted-foreground mt-0.5">{addr.line1}</p>
                  <p className="text-muted-foreground">
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Notes</h2>
            {customer.notes ? (
              <p className="text-sm text-foreground">{customer.notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No notes added.</p>
            )}
          </section>

          {/* Summary stats */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Orders</dt>
                <dd className="font-medium text-foreground">{DEMO_ORDERS.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Revenue</dt>
                <dd className="font-medium text-foreground">
                  {formatPrice(DEMO_ORDERS.reduce((sum, o) => sum + o.total, 0))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last Order</dt>
                <dd className="font-medium text-foreground">
                  {formatDate(DEMO_ORDERS[0]?.date ?? '')}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
