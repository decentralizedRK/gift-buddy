'use client';

import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import {
  BUDGET_RANGE_LABELS,
  type BudgetRange,
  type GiftMatchCriteria,
  type GiftMatchResult,
} from '@/domain/feedback';
import { seedProducts } from '@/data/seed-products';
import { matchProducts } from '@/domain/gift-matcher';
import { generateReferenceNumber, generateIdempotencyKey } from '@/domain/reference';
import { formatPrice } from '@/lib/format';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface FormData {
  occasion: string;
  recipientGroup: string;
  numberOfRecipients: string;
  budgetPerRecipient: BudgetRange | '';
  totalBudgetApprox: string;
  requiredDate: string;
  deliveryCityOrRegion: string;
  dietaryPreferences: string[];
  sustainabilityPreference: boolean;
  personalizationRequired: boolean;
  brandingRequired: boolean;
  preferredCategories: string[];
  productsToAvoid: string;
  additionalNotes: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  consent: boolean;
  honeypot: string;
}

interface FormErrors {
  [field: string]: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const OCCASIONS = [
  { value: 'onboarding', label: 'Employee Onboarding' },
  { value: 'appreciation', label: 'Appreciation & Recognition' },
  { value: 'festival', label: 'Festival & Seasonal' },
  { value: 'diwali', label: 'Diwali' },
  { value: 'christmas', label: 'Christmas' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'farewell', label: 'Farewell' },
  { value: 'anniversary', label: 'Work Anniversary' },
  { value: 'other', label: 'Other' },
];

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'no-nuts', label: 'No Nuts' },
  { value: 'no-gluten', label: 'No Gluten' },
  { value: 'halal', label: 'Halal' },
  { value: 'none', label: 'No Restrictions' },
];

const CATEGORY_OPTIONS = [
  { value: 'Corporate Gifting', label: 'Corporate Gifting' },
  { value: 'Festival & Seasonal', label: 'Festival & Seasonal' },
  { value: 'Wellness', label: 'Wellness' },
  { value: 'Gourmet', label: 'Gourmet' },
  { value: 'Employee Recognition', label: 'Employee Recognition' },
];

const budgetRangeEntries = Object.entries(BUDGET_RANGE_LABELS) as [BudgetRange, string][];

/* ------------------------------------------------------------------ */
/*  Validation                                                        */
/* ------------------------------------------------------------------ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.occasion) {
    errors.occasion = 'Please select an occasion.';
  }
  if (!data.recipientGroup.trim()) {
    errors.recipientGroup = 'Please describe the recipient group.';
  }
  if (!data.numberOfRecipients.trim()) {
    errors.numberOfRecipients = 'Number of recipients is required.';
  } else {
    const n = parseInt(data.numberOfRecipients, 10);
    if (Number.isNaN(n) || n < 1) {
      errors.numberOfRecipients = 'At least 1 recipient is required.';
    }
  }
  if (!data.budgetPerRecipient) {
    errors.budgetPerRecipient = 'Please select a budget range.';
  }
  if (!data.companyName.trim()) {
    errors.companyName = 'Company name is required.';
  }
  if (!data.contactName.trim()) {
    errors.contactName = 'Contact name is required.';
  }
  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.consent) {
    errors.consent = 'Consent is required to submit this request.';
  }
  if (data.honeypot) {
    errors.honeypot = 'Spam detected.';
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Gift Finder Form Component                                        */
/* ------------------------------------------------------------------ */

export function GiftFinderForm() {
  const [form, setForm] = useState<FormData>({
    occasion: '',
    recipientGroup: '',
    numberOfRecipients: '',
    budgetPerRecipient: '',
    totalBudgetApprox: '',
    requiredDate: '',
    deliveryCityOrRegion: '',
    dietaryPreferences: [],
    sustainabilityPreference: false,
    personalizationRequired: false,
    brandingRequired: false,
    preferredCategories: [],
    productsToAvoid: '',
    additionalNotes: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    consent: false,
    honeypot: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [matchedProducts, setMatchedProducts] = useState<GiftMatchResult[]>([]);

  const idempotencyKeyRef = useRef<string>('');
  useEffect(() => {
    idempotencyKeyRef.current = generateIdempotencyKey();
  }, []);

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

  const handleCheckboxGroup = useCallback(
    (groupName: 'dietaryPreferences' | 'preferredCategories', value: string) => {
      setForm((prev) => {
        const current = prev[groupName];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [groupName]: updated };
      });
    },
    [],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.focus();
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      const ref = generateReferenceNumber();
      setReferenceNumber(ref);

      // Run gift matching
      const criteria: GiftMatchCriteria = {
        occasion: form.occasion || undefined,
        budgetRange: form.budgetPerRecipient || undefined,
        categories: form.preferredCategories.length > 0 ? form.preferredCategories : undefined,
        sustainabilityPreference: form.sustainabilityPreference || undefined,
        recipientGroup: form.recipientGroup || undefined,
      };
      const matches = matchProducts(seedProducts, criteria, 4);
      setMatchedProducts(matches);

      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      occasion: '',
      recipientGroup: '',
      numberOfRecipients: '',
      budgetPerRecipient: '',
      totalBudgetApprox: '',
      requiredDate: '',
      deliveryCityOrRegion: '',
      dietaryPreferences: [],
      sustainabilityPreference: false,
      personalizationRequired: false,
      brandingRequired: false,
      preferredCategories: [],
      productsToAvoid: '',
      additionalNotes: '',
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      consent: false,
      honeypot: '',
    });
    setErrors({});
    setSubmitting(false);
    setSubmitted(false);
    setSubmitError(null);
    setReferenceNumber('');
    setMatchedProducts([]);
    idempotencyKeyRef.current = generateIdempotencyKey();
  };

  /* ---------- Success state ---------- */
  if (submitted) {
    const whatsappMessage = encodeURIComponent(
      `Hi! I submitted a gift recommendation request (Ref: ${referenceNumber}). I'd love to discuss options for my team.`
    );
    const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMessage}`;

    return (
      <div role="status" aria-live="polite">
        {/* Confirmation */}
        <div className="text-center py-8">
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
          <h2 className="text-2xl font-bold text-foreground">
            Recommendation Request Submitted!
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Our team will review your requirements and get back to you with personalized
            recommendations.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Reference number:{' '}
            <span className="font-mono font-semibold text-foreground">{referenceNumber}</span>
          </p>
        </div>

        {/* Matched Products */}
        {matchedProducts.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Recommended Hampers for You
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Based on your preferences, here are some hampers that might be a great fit:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedProducts.map((match) => (
                <div
                  key={match.productId}
                  className="rounded-xl border border-border bg-background p-5 hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/products/${match.productSlug}`}
                    className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {match.productTitle}
                  </Link>
                  <p className="mt-1 text-primary font-bold">
                    {formatPrice(match.basePrice)}
                  </p>
                  {match.matchReasons.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {match.matchReasons.map((reason) => (
                        <li
                          key={reason}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 text-success mt-0.5 flex-shrink-0"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground italic">
              Availability, final pricing, customization, and delivery timelines require
              confirmation from our team.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20bd5a] transition-colors text-sm"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Continue on WhatsApp
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
          >
            Submit Another Request
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
        {submitting && 'Submitting your recommendation request...'}
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

      {/* Gift Requirements */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">Gift Requirements</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="occasion" label="Occasion" required error={errors.occasion}>
            <select
              id="occasion"
              name="occasion"
              value={form.occasion}
              onChange={handleChange}
              className={inputClasses(errors.occasion)}
              aria-invalid={!!errors.occasion}
              aria-describedby={errors.occasion ? 'occasion-error' : undefined}
            >
              <option value="">Select an occasion</option>
              {OCCASIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="recipientGroup"
            label="Recipient Group"
            required
            error={errors.recipientGroup}
          >
            <input
              id="recipientGroup"
              name="recipientGroup"
              type="text"
              maxLength={200}
              value={form.recipientGroup}
              onChange={handleChange}
              placeholder="e.g., New hires, Senior management, Entire team"
              className={inputClasses(errors.recipientGroup)}
              aria-invalid={!!errors.recipientGroup}
              aria-describedby={errors.recipientGroup ? 'recipientGroup-error' : undefined}
            />
          </Field>

          <Field
            id="numberOfRecipients"
            label="Number of Recipients"
            required
            error={errors.numberOfRecipients}
          >
            <input
              id="numberOfRecipients"
              name="numberOfRecipients"
              type="number"
              min={1}
              value={form.numberOfRecipients}
              onChange={handleChange}
              placeholder="e.g., 50"
              className={inputClasses(errors.numberOfRecipients)}
              aria-invalid={!!errors.numberOfRecipients}
              aria-describedby={
                errors.numberOfRecipients ? 'numberOfRecipients-error' : undefined
              }
            />
          </Field>

          <Field
            id="budgetPerRecipient"
            label="Budget per Recipient"
            required
            error={errors.budgetPerRecipient}
          >
            <select
              id="budgetPerRecipient"
              name="budgetPerRecipient"
              value={form.budgetPerRecipient}
              onChange={handleChange}
              className={inputClasses(errors.budgetPerRecipient)}
              aria-invalid={!!errors.budgetPerRecipient}
              aria-describedby={
                errors.budgetPerRecipient ? 'budgetPerRecipient-error' : undefined
              }
            >
              <option value="">Select budget range</option>
              {budgetRangeEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field id="totalBudgetApprox" label="Total Approximate Budget">
            <input
              id="totalBudgetApprox"
              name="totalBudgetApprox"
              type="text"
              maxLength={100}
              value={form.totalBudgetApprox}
              onChange={handleChange}
              placeholder="e.g., 5,00,000"
              className={inputClasses()}
            />
          </Field>

          <Field id="requiredDate" label="Required Delivery Date">
            <input
              id="requiredDate"
              name="requiredDate"
              type="date"
              value={form.requiredDate}
              onChange={handleChange}
              className={inputClasses()}
            />
          </Field>

          <Field id="deliveryCityOrRegion" label="Delivery City / Region">
            <input
              id="deliveryCityOrRegion"
              name="deliveryCityOrRegion"
              type="text"
              maxLength={200}
              value={form.deliveryCityOrRegion}
              onChange={handleChange}
              placeholder="e.g., Mumbai, Pan India"
              className={inputClasses()}
            />
          </Field>
        </div>
      </fieldset>

      {/* Preferences */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">Preferences</legend>

        {/* Dietary Preferences */}
        <div>
          <p className="block text-sm font-medium text-foreground mb-2">
            Dietary Preferences
          </p>
          <div className="flex flex-wrap gap-3">
            {DIETARY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="inline-flex items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={form.dietaryPreferences.includes(option.value)}
                  onChange={() => handleCheckboxGroup('dietaryPreferences', option.value)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Categories */}
        <div>
          <p className="block text-sm font-medium text-foreground mb-2">
            Preferred Categories
          </p>
          <div className="flex flex-wrap gap-3">
            {CATEGORY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="inline-flex items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={form.preferredCategories.includes(option.value)}
                  onChange={() => handleCheckboxGroup('preferredCategories', option.value)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Toggle preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="sustainabilityPreference"
              checked={form.sustainabilityPreference}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            />
            Eco-friendly / Sustainable
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="personalizationRequired"
              checked={form.personalizationRequired}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            />
            Personalization Required
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="brandingRequired"
              checked={form.brandingRequired}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
            />
            Company Branding Required
          </label>
        </div>

        <Field id="productsToAvoid" label="Products to Avoid">
          <textarea
            id="productsToAvoid"
            name="productsToAvoid"
            rows={2}
            maxLength={1000}
            value={form.productsToAvoid}
            onChange={handleChange}
            placeholder="e.g., No alcohol, no non-vegetarian items"
            className={inputClasses() + ' resize-y'}
          />
        </Field>

        <Field id="additionalNotes" label="Additional Notes">
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            rows={3}
            maxLength={2000}
            value={form.additionalNotes}
            onChange={handleChange}
            placeholder="Any other requirements, preferences, or context..."
            className={inputClasses() + ' resize-y'}
          />
        </Field>
      </fieldset>

      {/* Contact Info */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-foreground">Contact Information</legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="companyName" label="Company Name" required error={errors.companyName}>
            <input
              id="companyName"
              name="companyName"
              type="text"
              maxLength={200}
              value={form.companyName}
              onChange={handleChange}
              className={inputClasses(errors.companyName)}
              aria-invalid={!!errors.companyName}
              aria-describedby={errors.companyName ? 'companyName-error' : undefined}
            />
          </Field>

          <Field id="contactName" label="Contact Name" required error={errors.contactName}>
            <input
              id="contactName"
              name="contactName"
              type="text"
              maxLength={200}
              value={form.contactName}
              onChange={handleChange}
              className={inputClasses(errors.contactName)}
              aria-invalid={!!errors.contactName}
              aria-describedby={errors.contactName ? 'contactName-error' : undefined}
            />
          </Field>

          <Field id="email" label="Email" required error={errors.email}>
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
      </fieldset>

      {/* Consent */}
      <div className="space-y-2">
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
            I consent to Gift Buddy using my contact details to process this recommendation
            request and contact me with personalized suggestions. See our{' '}
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
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px]">
        <label htmlFor="company_website">Leave this blank</label>
        <input
          id="company_website"
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
        {submitting ? 'Finding Recommendations...' : 'Get Recommendations'}
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
