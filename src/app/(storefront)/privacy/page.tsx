import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Gift Buddy collects, uses, stores, and protects your personal information when you use our corporate gifting services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: September 2026
      </p>

      <div className="mt-10 space-y-10 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">1. Introduction</h2>
          <p>
            {APP_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website, use our
            services, or communicate with us through any channel including WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">2. Information We Collect</h2>
          <p className="mb-4">We may collect the following categories of information:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong className="text-foreground">Contact information:</strong> Name, email address,
              phone number, and company name provided when you submit inquiries, place orders,
              or create an account.
            </li>
            <li>
              <strong className="text-foreground">Order information:</strong> Delivery addresses,
              order history, product preferences, and personalization details.
            </li>
            <li>
              <strong className="text-foreground">Communication data:</strong> Messages exchanged
              through our website forms and WhatsApp, including order-related conversations.
            </li>
            <li>
              <strong className="text-foreground">Technical data:</strong> Browser type, IP address,
              device information, and website usage patterns collected through cookies and
              similar technologies.
            </li>
            <li>
              <strong className="text-foreground">Payment information:</strong> Payment method details
              are processed by our secure payment partners and are not stored on our servers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Process and fulfil your orders and inquiries.</li>
            <li>Send order confirmations, status updates, and delivery notifications.</li>
            <li>Communicate via WhatsApp for order-related updates (with your explicit consent).</li>
            <li>Improve our products, services, and website experience.</li>
            <li>Respond to your questions and support requests.</li>
            <li>Comply with legal obligations and prevent fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">4. WhatsApp Communication</h2>
          <p>
            We use WhatsApp Business Platform for order-related communication. By
            providing your phone number and opting in to WhatsApp updates, you consent
            to receiving transactional messages including order confirmations, status
            updates, and delivery notifications. You can opt out at any time by
            replying &quot;STOP&quot; to any message or contacting us. We do not send
            unsolicited promotional messages via WhatsApp. For more details, see our{' '}
            <Link href="/whatsapp-consent" className="text-primary hover:text-primary/80 transition-colors">
              WhatsApp Consent Notice
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">5. Data Sharing</h2>
          <p className="mb-4">
            We do not sell or rent your personal information. We may share your
            information with:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Logistics and delivery partners to fulfil your orders.</li>
            <li>Payment processors to handle transactions securely.</li>
            <li>WhatsApp / Meta for message delivery as part of the WhatsApp Business Platform.</li>
            <li>Legal authorities when required by law or to protect our rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal
            information, including encryption, secure access controls, and regular
            security reviews. However, no method of electronic storage or transmission
            is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfil the
            purposes outlined in this policy, comply with legal obligations, resolve
            disputes, and enforce our agreements. Order records are retained for a minimum
            of seven years for tax and accounting purposes. WhatsApp conversation metadata
            is retained for operational continuity and may be purged after 24 months of
            inactivity. You may request earlier deletion subject to legal retention
            requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">8. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your personal data, subject to legal retention requirements.</li>
            <li>Withdraw consent for WhatsApp communication at any time.</li>
            <li>Request a copy of your data in a portable format.</li>
            <li>Object to processing of your data for specific purposes.</li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, contact us at{' '}
            <a
              href="mailto:privacy@giftbuddy.in"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              privacy@giftbuddy.in
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">9. Cookies</h2>
          <p>
            Our website uses essential cookies to ensure basic functionality. We may also
            use analytics cookies to understand how visitors interact with our site. We do
            not use cookies for advertising or cross-site tracking. You can manage cookie
            preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be
            communicated through our website. The &quot;Last updated&quot; date at the top
            of this page indicates when the policy was most recently revised.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices,
            please contact us:
          </p>
          <div className="mt-4 p-4 rounded-lg border border-border text-sm">
            <p className="font-semibold text-foreground">{APP_NAME}</p>
            <p className="mt-1">Email: privacy@giftbuddy.in</p>
            <p>
              General inquiries:{' '}
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
