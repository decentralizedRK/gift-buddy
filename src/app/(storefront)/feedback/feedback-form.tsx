'use client';

import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FEEDBACK_TYPES,
  BUDGET_RANGE_LABELS,
  QUANTITY_RANGE_LABELS,
  type FeedbackType,
  type BudgetRange,
  type QuantityRange,
} from '@/domain/feedback';
import { useProducts } from '@/hooks/use-data';
import { generateReferenceNumber, generateIdempotencyKey } from '@/domain/reference';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface FormData {
  type: FeedbackType;
  relatedProductId: string;
  title: string;
  message: string;
  rating: number | undefined;
  occasion: string;
  suggestedItems: string;
  budgetRange: BudgetRange | '';
  quantityRange: QuantityRange | '';
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  contactRequested: boolean;
  consent: boolean;
  honeypot: string;
}

interface FormErrors {
  [field: string]: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const PRODUCT_LINKED_TYPES: FeedbackType[] = [
  'product_feedback',
  'hamper_improvement',
  'packaging_feedback',
];

const feedbackTypeEntries = Object.entries(FEEDBACK_TYPES) as [FeedbackType, string][];
const budgetRangeEntries = Object.entries(BUDGET_RANGE_LABELS) as [BudgetRange, string][];
const quantityRangeEntries = Object.entries(QUANTITY_RANGE_LABELS) as [QuantityRange, string][];

/* ------------------------------------------------------------------ */
/*  Validation                                                        */
/* ------------------------------------------------------------------ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required.';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be 200 characters or fewer.';
  }

  if (!data.message.trim()) {
    errors.message = 'Please provide your feedback.';
  } else if (data.message.length > 5000) {
    errors.message = 'Message must be 5,000 characters or fewer.';
  }

  if (data.contactRequested) {
    if (!data.consent) {
      errors.consent = 'Consent is required when requesting contact.';
    }
    if (!data.email.trim() && !data.phone.trim()) {
      errors.email = 'Please provide at least an email or phone number.';
    }
  }

  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (data.honeypot) {
    errors.honeypot = 'Spam detected.';
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Star Rating Widget                                                */
/* ------------------------------------------------------------------ */

function StarRating({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (rating: number | undefined) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const current = value ?? 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, current + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = current - 1;
      onChange(next < 1 ? undefined : next);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Rating (1 to 5 stars)"
      className="flex items-center gap-1"
      onKeyDown={handleKeyDown}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered ?? value ?? 0);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            tabIndex={star === (value ?? 1) ? 0 : -1}
            className="p-0.5 focus:outline-none focus:ring-2 focus:ring-ring rounded"
            onClick={() => onChange(value === star ? undefined : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              className={`w-7 h-7 transition-colors ${filled ? 'text-amber-500' : 'text-muted-foreground/40'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          </button>
        );
      })}
      {value && (
        <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feedback Form Component                                           */
/* ------------------------------------------------------------------ */

export function FeedbackForm() {
  const searchParams = useSearchParams();
  const { data: products } = useProducts();

  const initialType = (searchParams.get('type') as FeedbackType) || 'general_feedback';
  const initialProduct = searchParams.get('product') || '';
  const resolvedProductId = initialProduct
    ? products.find((p) => p.slug === initialProduct || p.id === initialProduct)?.id || ''
    : '';

  const [form, setForm] = useState<FormData>({
    type: feedbackTypeEntries.some(([k]) => k === initialType) ? initialType : 'general_feedback',
    relatedProductId: resolvedProductId,
    title: '',
    message: '',
    rating: undefined,
    occasion: '',
    suggestedItems: '',
    budgetRange: '',
    quantityRange: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    contactRequested: false,
    consent: false,
    honeypot: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');

  const idempotencyKeyRef = useRef<string>('');
  useEffect(() => {
    idempotencyKeyRef.current = generateIdempotencyKey();
  }, []);

  const showProductField = PRODUCT_LINKED_TYPES.includes(form.type);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      const { name, value, type } = e.target;
      const checked =
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [errors],
  );

  const handleRatingChange = useCallback((rating: number | undefined) => {
    setForm((prev) => ({ ...prev, rating }));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus the first error field
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    // Simulate server submission
    try {
      const ref = generateReferenceNumber();
      setReferenceNumber(ref);
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      type: 'general_feedback',
      relatedProductId: '',
      title: '',
      message: '',
      rating: undefined,
      occasion: '',
      suggestedItems: '',
      budgetRange: '',
      quantityRange: '',
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      contactRequested: false,
      consent: false,
      honeypot: '',
    });
    setErrors({});
    setSubmitting(false);
    setSubmitted(false);
    setSubmitError(null);
    setReferenceNumber('');
    idempotencyKeyRef.current = generateIdempotencyKey();
  };

  /* ---------- Success state ---------- */
  if (submitted) {
    return (
      <div className="text-center py-16" role="status" aria-live="polite">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Thank You for Your Feedback!</h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Your feedback has been submitted successfully. We appreciate you taking the time to
          help us improve.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Reference number:{' '}
          <span className="font-mono font-semibold text-foreground">{referenceNumber}</span>
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Status announcements */}
      <div aria-live="polite" className="sr-only">
        {submitting && 'Submitting your feedback...'}
        {submitError && submitError}
      </div>

      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="text-sm font-medium text-destructive">
            Please fix the following errors:
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-destructive">
            {Object.entries(errors)
              .filter(([key]) => key !== 'honeypot')
              .map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
          </ul>
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        </div>
      )}

      {/* Feedback Type & Product */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">Feedback Details</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="type" label="Feedback Type" required>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClasses()}
            >
              {feedbackTypeEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          {showProductField && (
            <Field id="relatedProductId" label="Related Product">
              <select
                id="relatedProductId"
                name="relatedProductId"
                value={form.relatedProductId}
                onChange={handleChange}
                className={inputClasses()}
              >
                <option value="">Select a product (optional)</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <Field id="title" label="Title" required error={errors.title}>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={200}
            value={form.title}
            onChange={handleChange}
            placeholder="Brief summary of your feedback"
            className={inputClasses(errors.title)}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
        </Field>

        <Field id="message" label="Message" required error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={5000}
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us what you think, what could be improved, or what you would love to see..."
            className={inputClasses(errors.message) + ' resize-y'}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {form.message.length}/5,000 characters
          </p>
        </Field>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Rating (optional)
          </label>
          <StarRating value={form.rating} onChange={handleRatingChange} />
        </div>
      </fieldset>

      {/* Suggestions */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">Suggestions (Optional)</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="occasion" label="Suggested Occasion">
            <input
              id="occasion"
              name="occasion"
              type="text"
              maxLength={100}
              value={form.occasion}
              onChange={handleChange}
              placeholder="e.g., Farewell, Anniversary"
              className={inputClasses()}
            />
          </Field>

          <Field id="suggestedItems" label="Suggested Items (comma-separated)">
            <input
              id="suggestedItems"
              name="suggestedItems"
              type="text"
              value={form.suggestedItems}
              onChange={handleChange}
              placeholder="e.g., organic tea, desk plant, journals"
              className={inputClasses()}
            />
          </Field>

          <Field id="budgetRange" label="Budget Range">
            <select
              id="budgetRange"
              name="budgetRange"
              value={form.budgetRange}
              onChange={handleChange}
              className={inputClasses()}
            >
              <option value="">Select a range</option>
              {budgetRangeEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field id="quantityRange" label="Quantity Range">
            <select
              id="quantityRange"
              name="quantityRange"
              value={form.quantityRange}
              onChange={handleChange}
              className={inputClasses()}
            >
              <option value="">Select a range</option>
              {quantityRangeEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* Contact Info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">Contact Information (Optional)</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="companyName" label="Company Name">
            <input
              id="companyName"
              name="companyName"
              type="text"
              maxLength={200}
              value={form.companyName}
              onChange={handleChange}
              className={inputClasses()}
            />
          </Field>

          <Field id="contactName" label="Contact Name">
            <input
              id="contactName"
              name="contactName"
              type="text"
              maxLength={200}
              value={form.contactName}
              onChange={handleChange}
              className={inputClasses()}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              maxLength={320}
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className={inputClasses(errors.email)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </Field>

          <Field id="phone" label="Phone">
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={20}
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={inputClasses()}
            />
          </Field>
        </div>

        {/* Contact me checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="contactRequested"
            name="contactRequested"
            type="checkbox"
            checked={form.contactRequested}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
          />
          <label htmlFor="contactRequested" className="text-sm text-foreground leading-snug">
            I would like Gift Buddy to contact me about this feedback
          </label>
        </div>

        {/* Consent (shown when contact is requested) */}
        {form.contactRequested && (
          <div className="ml-7 space-y-3">
            <div className="flex items-start gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-ring"
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? 'consent-error' : undefined}
              />
              <label htmlFor="consent" className="text-sm text-foreground leading-snug">
                I consent to Gift Buddy using my contact details to respond to this feedback.
                See our{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  privacy policy
                </Link>
                .
                <span className="text-destructive ml-0.5">*</span>
              </label>
            </div>
            {errors.consent && (
              <p id="consent-error" className="text-xs text-destructive ml-7" role="alert">
                {errors.consent}
              </p>
            )}
            {!form.email.trim() && !form.phone.trim() && form.contactRequested && (
              <p className="text-xs text-muted-foreground ml-7">
                Please provide at least an email address or phone number above.
              </p>
            )}
          </div>
        )}
      </fieldset>

      {/* Privacy notice */}
      <p className="text-xs text-muted-foreground">
        By submitting this form, you agree to our{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          privacy policy
        </Link>
        . We will only use your information as described there.
      </p>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px]">
        <label htmlFor="website_url">Leave this blank</label>
        <input
          id="website_url"
          name="honeypot"
          type="text"
          value={form.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared UI helpers                                                  */
/* ------------------------------------------------------------------ */

function inputClasses(error?: string): string {
  return [
    'w-full px-3 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-ring text-sm',
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
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
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
