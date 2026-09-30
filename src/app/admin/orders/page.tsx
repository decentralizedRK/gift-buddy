'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/format';
import type { OrderStatus } from '@/domain/order';

/* Demo orders -------------------------------------------------------------- */

interface DemoOrder {
  id: string;
  referenceNumber: string;
  customerName: string;
  companyName: string;
  status: OrderStatus;
  total: number;
  quantity: number;
  date: string;
}

const DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'ord_001',
    referenceNumber: 'GB-2024-0042',
    customerName: 'Priya Sharma',
    companyName: 'TechVista Solutions',
    status: 'inquiry_received',
    total: 249900 * 25,
    quantity: 25,
    date: '2024-09-28T10:30:00Z',
  },
  {
    id: 'ord_002',
    referenceNumber: 'GB-2024-0041',
    customerName: 'Arjun Mehta',
    companyName: 'Pinnacle Corp',
    status: 'quote_sent',
    total: 599900 * 10,
    quantity: 10,
    date: '2024-09-27T14:15:00Z',
  },
  {
    id: 'ord_003',
    referenceNumber: 'GB-2024-0040',
    customerName: 'Neha Kapoor',
    companyName: 'GreenLeaf Organics',
    status: 'confirmed',
    total: 349900 * 50,
    quantity: 50,
    date: '2024-09-26T09:00:00Z',
  },
  {
    id: 'ord_004',
    referenceNumber: 'GB-2024-0039',
    customerName: 'Rohan Desai',
    companyName: 'Stellar Innovations',
    status: 'dispatched',
    total: 199900 * 100,
    quantity: 100,
    date: '2024-09-25T16:45:00Z',
  },
  {
    id: 'ord_005',
    referenceNumber: 'GB-2024-0038',
    customerName: 'Ananya Gupta',
    companyName: 'BrightPath Analytics',
    status: 'delivered',
    total: 449900 * 15,
    quantity: 15,
    date: '2024-09-24T11:20:00Z',
  },
  {
    id: 'ord_006',
    referenceNumber: 'GB-2024-0037',
    customerName: 'Vikram Singh',
    companyName: 'NovaTech Labs',
    status: 'packing',
    total: 299900 * 30,
    quantity: 30,
    date: '2024-09-23T08:00:00Z',
  },
  {
    id: 'ord_007',
    referenceNumber: 'GB-2024-0036',
    customerName: 'Kavita Reddy',
    companyName: 'Sunrise Enterprises',
    status: 'cancelled',
    total: 199900 * 20,
    quantity: 20,
    date: '2024-09-22T15:30:00Z',
  },
  {
    id: 'ord_008',
    referenceNumber: 'GB-2024-0035',
    customerName: 'Amit Patel',
    companyName: 'CrestView Partners',
    status: 'qualification_pending',
    total: 599900 * 8,
    quantity: 8,
    date: '2024-09-21T12:00:00Z',
  },
];

/* Status helpers ----------------------------------------------------------- */

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

/* Filter tabs -------------------------------------------------------------- */

const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_GROUPS: Record<string, OrderStatus[]> = {
  new: ['inquiry_received', 'qualification_pending'],
  in_progress: [
    'quote_preparing',
    'quote_sent',
    'customer_approved',
    'confirmed',
    'procurement',
    'packing',
    'ready_to_dispatch',
    'dispatched',
  ],
  completed: ['delivered'],
  cancelled: ['cancelled', 'rejected', 'on_hold', 'delivery_failed'],
};

/* Page --------------------------------------------------------------------- */

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders =
    activeTab === 'all'
      ? DEMO_ORDERS
      : DEMO_ORDERS.filter((o) =>
          STATUS_GROUPS[activeTab]?.includes(o.status)
        );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage inquiries, quotes, and orders
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border" role="tablist" aria-label="Order status filter">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px
              ${
                activeTab === tab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
            `}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-muted-foreground">
              (
              {tab.value === 'all'
                ? DEMO_ORDERS.length
                : DEMO_ORDERS.filter((o) =>
                    STATUS_GROUPS[tab.value]?.includes(o.status)
                  ).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Reference</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Qty</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Total</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No orders found for this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
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
                    <td className="px-5 py-3 text-muted-foreground">{order.quantity}</td>
                    <td className="px-5 py-3 font-medium text-foreground">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
