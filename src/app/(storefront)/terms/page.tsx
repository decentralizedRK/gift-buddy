import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the terms and conditions governing the use of Gift Buddy corporate gifting services, ordering, delivery, and website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: September 2026
      </p>

      <div className="mt-10 space-y-10 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the {APP_NAME} website and services, you accept and agree
            to be bound by these Terms of Service. If you do not agree to these terms,
            please do not use our services. {APP_NAME} reserves the right to update these
            Terms at any time. The current version will always be available on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">2. Services</h2>
          <p>
            {APP_NAME} provides curated corporate gift hamper selection, customization,
            and delivery services. Our services include product catalog browsing, order
            inquiry submission, custom quote generation, hamper personalization, and
            delivery coordination across India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">3. Pricing and Payment</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>All prices are listed in Indian Rupees (INR) and are exclusive of applicable taxes unless stated otherwise.</li>
            <li>Catalog prices are indicative for corporate orders. Final pricing is confirmed in the custom quote based on quantity, customization, and delivery requirements.</li>
            <li>Quotes are valid for 15 days from the date of issuance unless otherwise specified.</li>
            <li>Payment terms are specified in the quote and must be completed before production begins, unless a purchase order arrangement has been agreed upon.</li>
            <li>We reserve the right to modify prices without prior notice. Orders confirmed with a quote are honoured at the quoted price.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">4. Orders and Confirmation</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Submitting an inquiry or adding items to your cart does not constitute a confirmed order.</li>
            <li>An order is confirmed only when you accept the quote and we acknowledge receipt of payment or an approved purchase order.</li>
            <li>We reserve the right to decline orders at our discretion, including but not limited to cases of suspected fraud, product unavailability, or delivery infeasibility.</li>
            <li>Minimum order quantities apply as listed on each product page.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">5. Product Information</h2>
          <p>
            We make every effort to display product images, descriptions, and contents
            accurately. However, actual products may vary slightly in colour, packaging, or
            composition due to seasonal availability of ingredients, supplier changes, or
            customization. We will inform you of any material changes and offer alternatives
            or a refund if the change is significant.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">6. Delivery</h2>
          <p>
            Delivery timelines are estimates and may vary based on location, order volume,
            and external factors. {APP_NAME} is not liable for delays caused by circumstances
            beyond our reasonable control, including but not limited to natural disasters,
            transportation disruptions, or public holidays. See our{' '}
            <Link href="/delivery-info" className="text-primary hover:text-primary/80 transition-colors">
              delivery information page
            </Link>{' '}
            for detailed shipping policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">7. Cancellations and Refunds</h2>
          <p>
            Our cancellation and refund policies are detailed in our{' '}
            <Link href="/cancellation-policy" className="text-primary hover:text-primary/80 transition-colors">
              Cancellation and Refund Policy
            </Link>
            . In summary, orders may be cancelled within 24 hours of placement for a full
            refund provided production has not started. Personalized or custom items that
            have entered production are non-refundable. By placing an order, you agree to
            those terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">8. Intellectual Property</h2>
          <p>
            All content on the {APP_NAME} website, including text, images, logos, designs,
            and software, is our property or used under licence and is protected by
            applicable intellectual property laws. You may not reproduce, distribute,
            or create derivative works without our prior written consent. When you provide
            logos or brand assets for customization, you represent that you have the right
            to use them and grant us a limited licence to reproduce them on your order.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">9. User Conduct</h2>
          <p className="mb-4">When using our website and services, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Provide false or misleading information.</li>
            <li>Use automated systems to access or scrape our website.</li>
            <li>Attempt to interfere with the proper functioning of our services.</li>
            <li>Violate any applicable local, national, or international law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {APP_NAME} shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages arising
            out of your use of our services. Our total liability for any claim shall not
            exceed the amount paid by you for the specific order giving rise to the claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">11. Privacy</h2>
          <p>
            Your use of our services is also governed by our{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>
            , which describes how we collect, use, and protect your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">12. Governing Law</h2>
          <p>
            These Terms of Service are governed by and construed in accordance with the
            laws of India. Any disputes arising from these terms shall be subject to the
            exclusive jurisdiction of the courts in Bengaluru, Karnataka, India. We
            encourage you to contact us first to resolve any concerns before pursuing
            formal proceedings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes take effect
            upon posting to this page. Continued use of our services after changes are
            posted constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">14. Contact</h2>
          <p>
            For questions about these terms, contact us:
          </p>
          <div className="mt-4 p-4 rounded-lg border border-border text-sm">
            <p className="font-semibold text-foreground">{APP_NAME}</p>
            <p className="mt-1">Email: hello@giftbuddy.in</p>
            <p>
              <Link
                href="/contact"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Contact page
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
