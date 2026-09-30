import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'WhatsApp Communication Consent',
  description:
    'Learn about Gift Buddy WhatsApp messaging, what notifications you receive, how to opt in or out, and how your data is handled.',
};

export default function WhatsAppConsentPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        WhatsApp Communication Consent
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: September 2026
      </p>

      <div className="mt-10 space-y-10 text-muted-foreground leading-relaxed">
        <section>
          <p>
            {APP_NAME} uses the official WhatsApp Business Platform to communicate
            order-related updates to our customers. This notice explains what messages you
            will receive, how your data is handled, and how you can manage your preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">What Messages Will I Receive?</h2>
          <p className="mb-4">
            By providing your phone number and opting in to WhatsApp communication during
            the order process, you consent to receiving the following types of transactional
            messages:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong className="text-foreground">Order confirmations:</strong> A message confirming
              receipt of your inquiry or order with a reference number.
            </li>
            <li>
              <strong className="text-foreground">Quote notifications:</strong> A message when your
              custom quote is ready for review.
            </li>
            <li>
              <strong className="text-foreground">Status updates:</strong> Notifications when your
              order moves through stages such as confirmed, packing, dispatched, and delivered.
            </li>
            <li>
              <strong className="text-foreground">Delivery updates:</strong> Tracking information
              and estimated delivery times.
            </li>
            <li>
              <strong className="text-foreground">Action required:</strong> Messages when we need
              additional information to process your order, such as clarification on delivery
              addresses or personalization details.
            </li>
            <li>
              <strong className="text-foreground">Exception notices:</strong> Notifications about
              delays, substitutions, or issues that affect your order.
            </li>
            <li>
              <strong className="text-foreground">Cancellation confirmation:</strong> Confirmation
              when an order has been cancelled at your request.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">What We Will Not Send</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Unsolicited promotional or marketing messages.</li>
            <li>Messages to contacts who have not opted in.</li>
            <li>Messages outside of approved WhatsApp Business message templates.</li>
            <li>Spam or bulk unsolicited communication.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">How to Opt In</h2>
          <p>
            You can opt in to WhatsApp communication by selecting the consent checkbox
            when submitting an inquiry or order request on our website. Opting in is
            voluntary and is not required to place an order. You can also initiate a
            WhatsApp conversation with us at any time through the contact link provided
            on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">How to Opt Out</h2>
          <p className="mb-4">
            You can stop receiving WhatsApp messages from {APP_NAME} at any time:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Reply <strong className="text-foreground">STOP</strong> to any WhatsApp message from us.</li>
            <li>
              Email us at{' '}
              <a
                href="mailto:hello@giftbuddy.in"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                hello@giftbuddy.in
              </a>{' '}
              with subject line &quot;WhatsApp Opt-Out.&quot;
            </li>
            <li>
              Contact us through the{' '}
              <Link
                href="/contact"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                contact page
              </Link>{' '}
              on our website.
            </li>
          </ul>
          <p className="mt-4">
            Opting out will be processed within 24 hours. After opting out, you will no
            longer receive WhatsApp updates. Order-related communications will then be
            sent via email only. Opting out does not affect your order.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Data Handling</h2>
          <p className="mb-4">
            When you opt in to WhatsApp communication, we collect and process:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Your phone number for message delivery.</li>
            <li>Message delivery and read status for operational monitoring.</li>
            <li>Conversation context to provide relevant order support.</li>
          </ul>
          <p className="mt-4">
            We do not share your phone number with third parties for marketing purposes.
            Messages are processed through the official WhatsApp Business Platform (Meta)
            in accordance with their terms and our{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>
            . Conversation data associated with inactive accounts may be purged after
            24 months.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Your Rights</h2>
          <p>
            You have the right to access, correct, or request deletion of your personal
            data associated with WhatsApp communication. To exercise these rights, contact
            us at{' '}
            <a
              href="mailto:privacy@giftbuddy.in"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              privacy@giftbuddy.in
            </a>
            . We will respond within 30 days. For more details, see our{' '}
            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Contact</h2>
          <p>
            Questions about WhatsApp communication? Reach out:
          </p>
          <div className="mt-4 p-4 rounded-lg border border-border text-sm">
            <p className="font-semibold text-foreground">{APP_NAME}</p>
            <p className="mt-1">Email: hello@giftbuddy.in</p>
            <p>WhatsApp: +91 98765 43210</p>
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
