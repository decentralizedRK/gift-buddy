'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/format';
import {
  type OrderStatus,
  VALID_TRANSITIONS,
  validateTransition,
} from '@/domain/order';

/* Demo data ---------------------------------------------------------------- */

interface DemoOrderDetail {
  id: string;
  referenceNumber: string;
  status: OrderStatus;
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  items: {
    productTitle: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
  }[];
  quantity: number;
  subtotal: number;
  requestedDate: string;
  deliveryMode: string;
  addresses: string[];
  personalizationNotes: string;
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DemoOrderEvent {
  id: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  actor: string;
  source: string;
  note: string;
  timestamp: string;
}

const DEMO_ORDER: DemoOrderDetail = {
  id: 'ord_001',
  referenceNumber: 'GB-2024-0042',
  status: 'quote_sent',
  customerName: 'Priya Sharma',
  companyName: 'TechVista Solutions',
  phone: '+91 98765 43210',
  email: 'priya@techvista.com',
  items: [
    {
      productTitle: 'Sustainable Onboarding Hamper',
      variantName: 'Premium',
      quantity: 25,
      unitPrice: 349900,
    },
  ],
  quantity: 25,
  subtotal: 349900 * 25,
  requestedDate: '2024-10-15',
  deliveryMode: 'Bulk delivery to office',
  addresses: ['TechVista Solutions, 4th Floor, Tower B, Tech Park, Whitefield, Bangalore 560066'],
  personalizationNotes: 'Please add company logo on tote bags and notebooks. Welcome message: "Welcome to TechVista!"',
  consentGiven: true,
  createdAt: '2024-09-28T10:30:00Z',
  updatedAt: '2024-09-29T14:00:00Z',
};

const DEMO_EVENTS: DemoOrderEvent[] = [
  {
    id: 'evt_001',
    previousStatus: 'inquiry_received',
    newStatus: 'inquiry_received',
    actor: 'System',
    source: 'web_form',
    note: 'Inquiry submitted via website form',
    timestamp: '2024-09-28T10:30:00Z',
  },
  {
    id: 'evt_002',
    previousStatus: 'inquiry_received',
    newStatus: 'qualification_pending',
    actor: 'Admin User',
    source: 'admin_panel',
    note: 'Moved to qualification for volume pricing review',
    timestamp: '2024-09-28T11:15:00Z',
  },
  {
    id: 'evt_003',
    previousStatus: 'qualification_pending',
    newStatus: 'quote_preparing',
    actor: 'Admin User',
    source: 'admin_panel',
    note: 'Preparing custom quote with bulk discount',
    timestamp: '2024-09-28T14:30:00Z',
  },
  {
    id: 'evt_004',
    previousStatus: 'quote_preparing',
    newStatus: 'quote_sent',
    actor: 'Admin User',
    source: 'admin_panel',
    note: 'Quote sent via email and WhatsApp. 15% volume discount applied.',
    timestamp: '2024-09-29T14:00:00Z',
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

const TRANSITION_BUTTON_STYLES: Record<string, string> = {
  cancelled: 'border-destructive text-destructive hover:bg-destructive/10',
  rejected: 'border-destructive text-destructive hover:bg-destructive/10',
  on_hold: 'border-amber-500 text-amber-700 hover:bg-amber-50',
};

function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* Page --------------------------------------------------------------------- */

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState(DEMO_ORDER);
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [transitionNote, setTransitionNote] = useState('');
  const [noteInput, setNoteInput] = useState('');

  // Use the id to look up order -- for demo, we always show the same order
  void id;

  const validNextStatuses = VALID_TRANSITIONS[order.status] ?? [];

  function handleTransition(newStatus: OrderStatus) {
    if (!validateTransition(order.status, newStatus)) return;

    const newEvent: DemoOrderEvent = {
      id: `evt_${Date.now()}`,
      previousStatus: order.status,
      newStatus,
      actor: 'Admin User',
      source: 'admin_panel',
      note: transitionNote || `Status changed to ${statusLabel(newStatus)}`,
      timestamp: new Date().toISOString(),
    };

    setEvents((prev) => [...prev, newEvent]);
    setOrder((prev) => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }));
    setTransitionNote('');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Back to orders"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">
              Order {order.referenceNumber}
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] ?? 'bg-muted text-muted-foreground'}`}
            >
              {statusLabel(order.status)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Created {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium text-muted-foreground">Product</th>
                    <th className="pb-2 font-medium text-muted-foreground">Variant</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Qty</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Unit Price</th>
                    <th className="pb-2 font-medium text-muted-foreground text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-foreground">{item.productTitle}</td>
                      <td className="py-3 text-muted-foreground">{item.variantName}</td>
                      <td className="py-3 text-right text-foreground">{item.quantity}</td>
                      <td className="py-3 text-right text-foreground">{formatPrice(item.unitPrice)}</td>
                      <td className="py-3 text-right font-medium text-foreground">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="pt-3 text-right font-semibold text-foreground">
                      Subtotal
                    </td>
                    <td className="pt-3 text-right font-bold text-foreground">
                      {formatPrice(order.subtotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Final corporate pricing subject to owner confirmation.
            </p>
          </section>

          {/* Status timeline */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Status Timeline</h2>
            <div className="space-y-0">
              {events.map((event, i) => (
                <div key={event.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full border-2 ${
                        i === events.length - 1
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground bg-background'
                      }`}
                    />
                    {i < events.length - 1 && (
                      <div className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  {/* Event content */}
                  <div className="pb-6 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[event.newStatus] ?? 'bg-muted text-muted-foreground'}`}
                      >
                        {statusLabel(event.newStatus)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        by {event.actor}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        via {event.source.replace('_', ' ')}
                      </span>
                    </div>
                    {event.note && (
                      <p className="mt-1 text-sm text-foreground">{event.note}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(event.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Status transition */}
          {validNextStatuses.length > 0 && (
            <section className="rounded-xl border border-border bg-background p-5">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Update Status
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="transitionNote" className="block text-sm font-medium text-foreground mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    id="transitionNote"
                    value={transitionNote}
                    onChange={(e) => setTransitionNote(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Add a note about this transition..."
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {validNextStatuses.map((nextStatus) => (
                    <button
                      key={nextStatus}
                      type="button"
                      onClick={() => handleTransition(nextStatus)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        TRANSITION_BUTTON_STYLES[nextStatus] ??
                        'border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {statusLabel(nextStatus)}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* WhatsApp messages placeholder */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              WhatsApp Messages
            </h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <svg className="h-10 w-10 text-muted-foreground mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <p className="text-sm text-muted-foreground">
                WhatsApp message history will appear here once the integration is configured.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Configure WhatsApp in Settings to enable messaging.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer info */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Customer</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Contact</dt>
                <dd className="font-medium text-foreground mt-0.5">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Company</dt>
                <dd className="font-medium text-foreground mt-0.5">{order.companyName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium text-foreground mt-0.5">{order.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-foreground mt-0.5">{order.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">WhatsApp Consent</dt>
                <dd className="mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.consentGiven
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.consentGiven ? 'Given' : 'Not Given'}
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          {/* Order details */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Total Quantity</dt>
                <dd className="font-medium text-foreground mt-0.5">{order.quantity} units</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Requested Date</dt>
                <dd className="font-medium text-foreground mt-0.5">
                  {formatDate(order.requestedDate)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Delivery Mode</dt>
                <dd className="font-medium text-foreground mt-0.5">{order.deliveryMode}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Delivery Address</dt>
                <dd className="font-medium text-foreground mt-0.5 text-xs">
                  {order.addresses.join('; ')}
                </dd>
              </div>
              {order.personalizationNotes && (
                <div>
                  <dt className="text-muted-foreground">Personalization Notes</dt>
                  <dd className="font-medium text-foreground mt-0.5 text-xs">
                    {order.personalizationNotes}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Internal notes */}
          <section className="rounded-xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Internal Notes
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Notes visible only to admins. Never exposed to customers.
            </p>
            <div className="space-y-3">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Add an internal note..."
                aria-label="Internal note"
              />
              <button
                type="button"
                disabled={!noteInput.trim()}
                onClick={() => {
                  // TODO: Save note to Firestore
                  setNoteInput('');
                }}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                Add Note
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
