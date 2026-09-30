import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Cancellation and Refund Policy',
  description:
    'Understand Gift Buddy cancellation windows, refund process, non-refundable items, and exchange policy for corporate gift orders.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Cancellation and Refund Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: September 2026
      </p>

      <div className="mt-10 space-y-10 text-muted-foreground leading-relaxed">
        <section>
          <p>
            We understand that plans can change. This policy explains how
            cancellations, refunds, and exchanges are handled for orders placed
            with {APP_NAME}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Cancellation Window</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                    Cancellation Window
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                    Refund
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Within 24 hours of order confirmation</td>
                  <td className="px-4 py-3">100% refund</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">24-72 hours (before production starts)</td>
                  <td className="px-4 py-3">90% refund (10% processing fee)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">After production has started</td>
                  <td className="px-4 py-3">50% refund</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">After dispatch</td>
                  <td className="px-4 py-3">No refund (except for damaged goods)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">How to Cancel</h2>
          <p className="mb-4">
            To cancel an order, contact us as soon as possible with your order reference
            number through any of the following channels:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Email: hello@giftbuddy.in with subject line &quot;Cancel Order: [Your Reference Number]&quot;</li>
            <li>WhatsApp: Send your cancellation request with your order reference number.</li>
            <li>Phone: +91 98765 43210 during business hours (Mon-Sat, 9 AM - 6 PM IST).</li>
          </ul>
          <p className="mt-4">
            We will confirm the cancellation and applicable refund amount within 1 business
            day.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Refund Process</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Approved refunds are processed within 5-7 business days.</li>
            <li>Refunds are credited to the original payment method (bank account or UPI).</li>
            <li>You will receive a confirmation email and WhatsApp notification (if opted in) once the refund is processed.</li>
            <li>Bank processing times may add 2-3 additional business days for the refund to appear in your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Non-Refundable Items</h2>
          <p className="mb-4">The following are not eligible for refunds once production has commenced:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Orders with custom branding or personalization (company logos, custom messages, bespoke packaging).</li>
            <li>Perishable goods (food items, fresh flowers, or products with a limited shelf life).</li>
            <li>Design and mockup fees for custom hamper curation.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Damaged or Defective Products</h2>
          <p className="mb-4">
            If your hamper arrives damaged, defective, or with missing items:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Report the issue within 48 hours of delivery.</li>
            <li>Provide photographs of the damaged product and packaging.</li>
            <li>Include your order reference number in the report.</li>
            <li>We will arrange a replacement or full refund at no additional cost.</li>
            <li>Do not discard the damaged product or packaging until the claim is resolved.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Exchanges</h2>
          <p>
            We offer exchanges for standard catalog hampers subject to stock availability.
            Exchange requests must be made within 48 hours of delivery, and the original
            hamper must be unused and in its original packaging. Any price difference between
            the original and replacement hamper will be adjusted accordingly. Personalized
            items cannot be exchanged.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Order Modifications</h2>
          <p>
            Minor modifications to your order (quantity adjustments, address changes) may
            be accommodated if production has not started. Contact us as early as possible
            with modification requests. Changes to custom hamper contents or branding may
            affect the delivery timeline and cost. Any cost differences will be communicated
            before proceeding.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Force Majeure</h2>
          <p>
            We are not liable for delays or cancellations caused by circumstances beyond
            our reasonable control, including natural disasters, pandemics, government
            restrictions, or supply chain disruptions. In such cases, we will work with
            you to reschedule delivery or offer a full refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Contact</h2>
          <p>
            For cancellations, refund inquiries, or disputes, contact us:
          </p>
          <div className="mt-4 p-4 rounded-lg border border-border text-sm">
            <p className="font-semibold text-foreground">{APP_NAME}</p>
            <p className="mt-1">Email: hello@giftbuddy.in</p>
            <p>WhatsApp: +91 98765 43210</p>
            <p className="mt-2">
              See also:{' '}
              <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </Link>
              {' | '}
              <Link href="/delivery-info" className="text-primary hover:text-primary/80 transition-colors">
                Delivery Information
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
