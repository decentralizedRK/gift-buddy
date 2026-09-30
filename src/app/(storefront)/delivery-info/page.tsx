import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Delivery Information',
  description:
    'Learn about Gift Buddy delivery timelines, shipping coverage, multi-address delivery, and order tracking for corporate gift hampers.',
};

export default function DeliveryInfoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Delivery Information
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Everything you need to know about how we deliver your corporate gift hampers.
      </p>

      <div className="mt-10 space-y-10 text-muted-foreground">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Delivery Coverage</h2>
          <p className="leading-relaxed">
            {APP_NAME} delivers across India. Our standard coverage includes all major metro
            cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, Pune, and
            Ahmedabad), tier-2 cities, and select tier-3 locations. For deliveries to
            remote areas or specific pin codes, contact us to confirm coverage and any
            additional charges.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Delivery Timelines</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                    Order Type
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground border-b border-border">
                    Lead Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Standard catalog hampers</td>
                  <td className="px-4 py-3">4-7 business days</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Custom / branded hampers</td>
                  <td className="px-4 py-3">10-14 business days</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">Bulk orders (100+ units)</td>
                  <td className="px-4 py-3">14-21 business days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Sample orders</td>
                  <td className="px-4 py-3">3 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm">
            Lead times are calculated from the date of order confirmation and payment.
            Business days exclude Sundays and public holidays. We recommend ordering at
            least 2-3 weeks before your target delivery date to account for customization
            and logistics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Multi-Address Delivery</h2>
          <p className="leading-relaxed">
            We specialize in multi-location corporate deliveries. For orders going to
            multiple addresses, provide a spreadsheet with recipient names, complete
            addresses, pin codes, and phone numbers. We will coordinate all shipments and
            provide individual tracking for each delivery. Additional shipping charges may
            apply for individual deliveries compared to a single-location bulk shipment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Order Tracking</h2>
          <p className="leading-relaxed">
            Every order receives a unique reference number at confirmation. We send
            status updates via WhatsApp (with your consent) at each stage of the process:
            order confirmation, packing, dispatch, and delivery. You can also check your
            order status on our website using your order reference and the phone number
            or email associated with the order.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Shipping Charges</h2>
          <p className="leading-relaxed">
            Shipping costs are included in the quote for bulk orders delivered to a single
            address. For multi-address deliveries and remote locations, shipping charges
            are calculated based on pin code, weight, and quantity and communicated along
            with your custom quote. There are no hidden charges.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Packaging</h2>
          <p className="leading-relaxed">
            All hampers are packed with care to ensure products arrive in perfect condition.
            We use sturdy outer packaging with protective inserts. Fragile items are
            individually wrapped. Our eco-friendly hamper range uses recyclable and
            biodegradable packaging materials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Damaged or Missing Items</h2>
          <p className="leading-relaxed">
            If a hamper arrives damaged or with missing items, contact us within 48 hours
            of delivery with photos and your order reference number. We will arrange a
            replacement or refund at no additional cost. See our{' '}
            <Link href="/cancellation-policy" className="text-primary hover:text-primary/80 transition-colors">
              cancellation and refund policy
            </Link>{' '}
            for complete details.
          </p>
        </section>
      </div>
    </div>
  );
}
