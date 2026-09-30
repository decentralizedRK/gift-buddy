import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common questions about Gift Buddy corporate gifting, ordering, delivery, customization, and more.',
};

const faqs = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How do I place a corporate gift order?',
        a: `You can place a corporate order through our website by browsing the catalog, adding hampers to your cart, and submitting an inquiry with your requirements. Alternatively, reach us on WhatsApp for quick assistance. Once you share your requirements, we will send you a custom quote within 24 business hours.`,
      },
      {
        q: 'What is the minimum order quantity?',
        a: `Minimum order quantities vary by product, typically starting at 5-20 units depending on the hamper. Each product page shows its specific MOQ. For custom hampers, the minimum is usually 25 units.`,
      },
      {
        q: 'What payment methods do you accept?',
        a: `We accept bank transfers (NEFT/RTGS), UPI, and corporate purchase orders from registered companies. Payment terms are shared along with your custom quote.`,
      },
    ],
  },
  {
    category: 'Customization',
    questions: [
      {
        q: 'Can I add my company logo to the hampers?',
        a: `Absolutely. We offer branding on packaging, select items within the hamper (such as tote bags, notebooks, and ribbons), and custom greeting cards. Share your brand guidelines and we will create a mockup for your approval.`,
      },
      {
        q: 'Can I create a completely custom hamper?',
        a: `Yes. Share your vision, budget, and recipient profile, and our curation team will design a bespoke hamper for you. Custom hampers have a minimum order of 25 units and require 10-14 days lead time.`,
      },
      {
        q: 'Can I include personalized messages for each recipient?',
        a: `Yes, we support individual personalized cards and messages. Simply provide a spreadsheet with recipient names and messages, and we will print and include them in each hamper.`,
      },
    ],
  },
  {
    category: 'Delivery',
    questions: [
      {
        q: 'Where do you deliver?',
        a: `We deliver across India, covering all major metro cities, tier-2 cities, and select tier-3 locations. For multi-city deliveries, share the list of pin codes and we will confirm coverage.`,
      },
      {
        q: 'What is the typical delivery timeline?',
        a: `Standard hampers ship within 4-7 business days from order confirmation. Custom hampers require 10-14 business days. We recommend ordering at least 2-3 weeks before your event date.`,
      },
      {
        q: 'Can I order via WhatsApp?',
        a: `Yes. You can start a conversation on WhatsApp, share your requirements, and we will guide you through the process. You will receive order updates and tracking information through the same channel with your consent.`,
      },
    ],
  },
  {
    category: 'Corporate Accounts',
    questions: [
      {
        q: 'Do you offer corporate account pricing?',
        a: `Yes. Companies with recurring gifting needs can set up a corporate account for streamlined ordering, dedicated support, and volume-based pricing. Contact us to discuss your requirements.`,
      },
      {
        q: 'Can I get a sample before placing a bulk order?',
        a: `Yes, we offer sample hampers at the listed retail price. Sample orders are shipped within 3 business days so you can review the quality before committing to a larger order.`,
      },
    ],
  },
  {
    category: 'Cancellations and Returns',
    questions: [
      {
        q: 'Can I cancel my order?',
        a: `Orders can be cancelled within 24 hours of placement for a full refund, provided production has not started. After 24 hours, cancellation charges may apply depending on the production stage. See our cancellation policy for details.`,
      },
      {
        q: 'What if I receive a damaged product?',
        a: `We take quality seriously. If a hamper arrives damaged, contact us within 48 hours with photos and your order reference. We will arrange a replacement at no additional cost.`,
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Frequently Asked Questions
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Everything you need to know about ordering corporate gift hampers
        from {APP_NAME}.
      </p>

      <div className="mt-12 space-y-10">
        {faqs.map((section) => (
          <section key={section.category}>
            <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
              {section.category}
            </h2>
            <div className="divide-y divide-border">
              {section.questions.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground list-none [&::-webkit-details-marker]:hidden">
                    <span>{faq.q}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 flex-shrink-0 ml-4 text-muted-foreground transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <h2 className="text-xl font-bold text-foreground">
          Still Have Questions?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Our team is ready to help with any additional questions you may have.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
