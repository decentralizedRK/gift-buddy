'use client';

import { useState, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { formatPrice } from '@/lib/format';
import { generateReferenceNumber, generateIdempotencyKey } from '@/domain/reference';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface FormData {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  quantity: string;
  requestedDate: string;
  deliveryMode: 'delivery' | 'pickup';
  deliveryAddress: string;
  personalizationNotes: string;
  budget: string;
  whatsappConsent: boolean;
}

interface FormErrors {
  [field: string]: string;
}

const INITIAL_FORM: FormData = {
  companyName: '',
  contactName: '',
  phone: '',
  email: '',
  quantity: '',
  requestedDate: '',
  deliveryMode: 'delivery',
  deliveryAddress: '',
  personalizationNotes: '',
  budget: '',
  whatsappConsent: false,
};

/* ------------------------------------------------------------------ */
/*  Validation                                                        */
/* ------------------------------------------------------------------ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.companyName.trim()) {
    errors.companyName = 'Company name is required.';
  }
  if (!data.contactName.trim()) {
    errors.contactName = 'Contact name is required.';
  }
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^\+?[\d\s()-]{7,20}$/.test(data.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.quantity.trim()) {
    errors.quantity = 'Quantity is required.';
  } else if (
    Number.isNaN(parseInt(data.quantity, 10)) ||
    parseInt(data.quantity, 10) < 1
  ) {
    errors.quantity = 'Quantity must be at least 1.';
  }
  if (data.deliveryMode === 'delivery' && !data.deliveryAddress.trim()) {
    errors.deliveryAddress =
      'Delivery address is required when delivery mode is selected.';
  }
  if (
    data.budget.trim() &&
    (Number.isNaN(parseFloat(data.budget)) || parseFloat(data.budget) < 0)
  ) {
    errors.budget = 'Budget must be a positive number.';
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function InquiryPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Idempotency key generated once per page load.
  const idempotencyKeyRef = useRef<string>(generateIdempotencyKey());

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field error on change.
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prevent double submission.
    if (submitting) return;
    setSubmitting(true);

    const reference = generateReferenceNumber();

    // In a real app this would POST to the server. For now we go
    // straight to the confirmation page.
    clearCart();
    router.push(
      `/inquiry/confirmation?ref=${encodeURIComponent(reference)}&consent=${form.whatsappConsent ? '1' : '0'}`,
    );
  };

  const hasItems = items.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl mb-2">
        Submit Your Inquiry
      </h1>
      <p className="text-muted-foreground mb-8">
        Fill in the details below and our team will get back to you with a
        personalized quote.
      </p>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="text-sm font-medium text-destructive">
            Please fix the following errors:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-destructive">
            {Object.values(errors).map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-6"
          noValidate
        >
          {/* Company info */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-foreground">
              Company &amp; Contact
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="companyName"
                label="Company Name"
                required
                error={errors.companyName}
              >
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  className={inputClasses(errors.companyName)}
                  aria-invalid={!!errors.companyName}
                  aria-describedby={
                    errors.companyName ? 'companyName-error' : undefined
                  }
                />
              </Field>

              <Field
                id="contactName"
                label="Contact Name"
                required
                error={errors.contactName}
              >
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  value={form.contactName}
                  onChange={handleChange}
                  className={inputClasses(errors.contactName)}
                  aria-invalid={!!errors.contactName}
                  aria-describedby={
                    errors.contactName ? 'contactName-error' : undefined
                  }
                />
              </Field>

              <Field
                id="phone"
                label="Phone Number"
                required
                error={errors.phone}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={inputClasses(errors.phone)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              </Field>

              <Field
                id="email"
                label="Email Address"
                required
                error={errors.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClasses(errors.email)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </Field>
            </div>
          </fieldset>

          {/* Order details */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-foreground">
              Order Details
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="quantity"
                label="Total Quantity"
                required
                error={errors.quantity}
              >
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={handleChange}
                  className={inputClasses(errors.quantity)}
                  aria-invalid={!!errors.quantity}
                  aria-describedby={
                    errors.quantity ? 'quantity-error' : undefined
                  }
                />
              </Field>

              <Field id="requestedDate" label="Requested Delivery Date">
                <input
                  id="requestedDate"
                  name="requestedDate"
                  type="date"
                  value={form.requestedDate}
                  onChange={handleChange}
                  className={inputClasses()}
                />
              </Field>

              <Field id="deliveryMode" label="Delivery Mode">
                <select
                  id="deliveryMode"
                  name="deliveryMode"
                  value={form.deliveryMode}
                  onChange={handleChange}
                  className={inputClasses()}
                >
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                </select>
              </Field>

              <Field
                id="budget"
                label="Budget (INR, optional)"
                error={errors.budget}
              >
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.budget}
                  onChange={handleChange}
                  className={inputClasses(errors.budget)}
                  aria-invalid={!!errors.budget}
                  aria-describedby={errors.budget ? 'budget-error' : undefined}
                />
              </Field>
            </div>

            {form.deliveryMode === 'delivery' && (
              <Field
                id="deliveryAddress"
                label="Delivery Address"
                required
                error={errors.deliveryAddress}
              >
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  rows={3}
                  value={form.deliveryAddress}
                  onChange={handleChange}
                  className={inputClasses(errors.deliveryAddress)}
                  aria-invalid={!!errors.deliveryAddress}
                  aria-describedby={
                    errors.deliveryAddress
                      ? 'deliveryAddress-error'
                      : undefined
                  }
                />
              </Field>
            )}

            <Field id="personalizationNotes" label="Personalization Notes">
              <textarea
                id="personalizationNotes"
                name="personalizationNotes"
                rows={3}
                value={form.personalizationNotes}
                onChange={handleChange}
                placeholder="E.g., company logo on tote bags, custom message on cards..."
                className={inputClasses()}
              />
            </Field>
          </fieldset>

          {/* Consent */}
          <div className="flex items-start gap-3">
            <input
              id="whatsappConsent"
              name="whatsappConsent"
              type="checkbox"
              checked={form.whatsappConsent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label
              htmlFor="whatsappConsent"
              className="text-sm text-foreground leading-snug"
            >
              I consent to receive order updates and communication via WhatsApp.
              You can opt out at any time.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>

        {/* Cart summary sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="rounded-xl border border-border bg-background p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Cart Summary
            </h2>

            {hasItems ? (
              <>
                <ul className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const key = item.variantId
                      ? `${item.productId}::${item.variantId}`
                      : item.productId;
                    return (
                      <li
                        key={key}
                        className="flex justify-between gap-2 text-sm"
                      >
                        <span className="text-foreground line-clamp-1 flex-1">
                          {item.productTitle}
                          {item.variantName ? ` (${item.variantName})` : ''}
                          <span className="text-muted-foreground">
                            {' '}
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-medium text-foreground whitespace-nowrap">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 pt-4 border-t border-border flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal ({totalItems}{' '}
                    {totalItems === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-bold text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Final pricing subject to confirmation.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No items in cart.{' '}
                <Link
                  href="/products"
                  className="text-primary hover:underline"
                >
                  Browse products
                </Link>
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared UI helpers                                                  */
/* ------------------------------------------------------------------ */

function inputClasses(error?: string): string {
  return [
    'block w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-primary',
    error ? 'border-destructive' : 'border-border',
  ].join(' ');
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
