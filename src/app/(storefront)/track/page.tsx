'use client';

import { useState, type FormEvent } from 'react';
import type { OrderStatus } from '@/domain/order';

/* ------------------------------------------------------------------ */
/*  Demo data — used until a real backend is connected                */
/* ------------------------------------------------------------------ */

const DEMO_REFERENCE = 'GB-DEMO1';

const DEMO_TIMELINE: {
  status: OrderStatus;
  label: string;
  date: string;
  note?: string;
}[] = [
  {
    status: 'inquiry_received',
    label: 'Inquiry Received',
    date: '2024-10-01 10:30 AM',
  },
  {
    status: 'qualification_pending',
    label: 'Qualification Pending',
    date: '2024-10-01 02:15 PM',
    note: 'Our team is reviewing your requirements.',
  },
  {
    status: 'quote_preparing',
    label: 'Quote Being Prepared',
    date: '2024-10-02 11:00 AM',
  },
  {
    status: 'quote_sent',
    label: 'Quote Sent',
    date: '2024-10-03 09:45 AM',
    note: 'A detailed quote has been emailed to you.',
  },
];

const CUSTOMER_FACING_STATUS: Record<string, string> = {
  inquiry_received: 'We have received your inquiry.',
  qualification_pending: 'Our team is reviewing your requirements.',
  quote_preparing: 'We are preparing a personalized quote for you.',
  quote_sent: 'Your quote is ready — please check your email.',
  customer_approved: 'You have approved the quote. Thank you!',
  confirmed: 'Your order is confirmed and in process.',
  procurement: 'We are sourcing items for your hampers.',
  packing: 'Your hampers are being carefully packed.',
  ready_to_dispatch: 'Your order is packed and ready to ship.',
  dispatched: 'Your order is on its way!',
  delivered: 'Your order has been delivered. Enjoy!',
  cancelled: 'This order has been cancelled.',
  rejected: 'This inquiry was not taken forward.',
  on_hold: 'Your order is currently on hold.',
  delivery_failed: 'Delivery was unsuccessful. We will retry.',
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function TrackPage() {
  const [reference, setReference] = useState('');
  const [verification, setVerification] = useState('');
  const [errors, setErrors] = useState<{ ref?: string; verify?: string }>({});
  const [result, setResult] = useState<'not_found' | 'found' | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!reference.trim()) {
      newErrors.ref = 'Reference number is required.';
    }
    if (!verification.trim()) {
      newErrors.verify = 'Email or phone is required for verification.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Demo: only the hardcoded reference resolves.
    if (reference.trim().toUpperCase() === DEMO_REFERENCE) {
      setResult('found');
    } else {
      setResult('not_found');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        Track Your Order
      </h1>
      <p className="mt-2 text-muted-foreground mb-8">
        Enter your reference number and the email or phone you used when
        submitting the inquiry.
      </p>

      {/* Lookup form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-background p-6 space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="track-ref"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Reference Number <span className="text-destructive">*</span>
            </label>
            <input
              id="track-ref"
              type="text"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                if (errors.ref)
                  setErrors((prev) => ({ ...prev, ref: undefined }));
              }}
              placeholder="GB-XXXXXX"
              className={[
                'block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                errors.ref ? 'border-destructive' : 'border-border',
              ].join(' ')}
              aria-invalid={!!errors.ref}
              aria-describedby={errors.ref ? 'track-ref-error' : undefined}
            />
            {errors.ref && (
              <p
                id="track-ref-error"
                className="mt-1 text-xs text-destructive"
                role="alert"
              >
                {errors.ref}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="track-verify"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Email or Phone <span className="text-destructive">*</span>
            </label>
            <input
              id="track-verify"
              type="text"
              value={verification}
              onChange={(e) => {
                setVerification(e.target.value);
                if (errors.verify)
                  setErrors((prev) => ({ ...prev, verify: undefined }));
              }}
              placeholder="you@company.com or +91 98765 43210"
              className={[
                'block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                errors.verify ? 'border-destructive' : 'border-border',
              ].join(' ')}
              aria-invalid={!!errors.verify}
              aria-describedby={
                errors.verify ? 'track-verify-error' : undefined
              }
            />
            {errors.verify && (
              <p
                id="track-verify-error"
                className="mt-1 text-xs text-destructive"
                role="alert"
              >
                {errors.verify}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Track
        </button>

        <p className="text-xs text-muted-foreground">
          Demo: try reference <strong>GB-DEMO1</strong> with any email/phone.
        </p>
      </form>

      {/* Results */}
      {result === 'not_found' && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center"
        >
          <p className="text-sm font-medium text-destructive">
            No inquiry found for the given reference and verification details.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please double-check your reference number and the email or phone you
            provided.
          </p>
        </div>
      )}

      {result === 'found' && (
        <div className="mt-8 space-y-6">
          {/* Status header */}
          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="text-lg font-mono font-bold text-primary">
                  {DEMO_REFERENCE}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Current Status</p>
                <span className="inline-block mt-0.5 rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent-foreground">
                  {DEMO_TIMELINE[DEMO_TIMELINE.length - 1].label}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {
                CUSTOMER_FACING_STATUS[
                  DEMO_TIMELINE[DEMO_TIMELINE.length - 1].status
                ]
              }
            </p>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Status Timeline
            </h2>

            <ol className="relative border-l-2 border-border ml-3" aria-label="Order status timeline">
              {DEMO_TIMELINE.map((entry, index) => {
                const isLatest = index === DEMO_TIMELINE.length - 1;
                return (
                  <li
                    key={entry.status}
                    className="mb-8 last:mb-0 ml-6"
                  >
                    {/* Dot */}
                    <span
                      className={[
                        'absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background',
                        isLatest
                          ? 'bg-primary'
                          : 'bg-muted-foreground/40',
                      ].join(' ')}
                      aria-hidden="true"
                    />

                    <div>
                      <h3
                        className={[
                          'text-sm font-semibold',
                          isLatest
                            ? 'text-primary'
                            : 'text-foreground',
                        ].join(' ')}
                      >
                        {entry.label}
                      </h3>
                      <time className="block text-xs text-muted-foreground mt-0.5">
                        {entry.date}
                      </time>
                      {entry.note && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
