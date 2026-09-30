import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Gift Buddy — our mission to make corporate gifting thoughtful, sustainable, and effortless for businesses across India.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        About {APP_NAME}
      </h1>

      <div className="mt-8 prose prose-lg max-w-none">
        <section className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            {APP_NAME} was born from a simple idea: corporate gifting should feel personal,
            not transactional. We believe that every gift, whether for a new employee on
            their first day or a valued client celebrating a milestone, should carry thought,
            quality, and meaning.
          </p>
          <p className="leading-relaxed">
            Based in India, we curate premium gift hampers that combine artisanal products,
            sustainable packaging, and personalized touches. From handcrafted chocolates by
            small-batch Indian chocolatiers to eco-friendly desk accessories made from
            responsibly sourced materials, every item in our hampers is selected for its
            quality and story.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To transform corporate gifting from a routine obligation into a meaningful
            expression of appreciation. We help businesses build stronger relationships
            with their teams, clients, and partners through gifts that reflect their values
            and culture.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Thoughtful Curation',
                description:
                  'We hand-pick every product based on quality, craftsmanship, and relevance. No filler items, no generic choices.',
              },
              {
                title: 'Sustainability',
                description:
                  'We prioritize eco-friendly packaging, locally sourced products, and reusable containers to minimize our environmental footprint.',
              },
              {
                title: 'Personalization',
                description:
                  'From branded packaging to custom messages, we ensure every gift feels like it was made just for the recipient.',
              },
              {
                title: 'Transparency',
                description:
                  'Clear pricing, honest timelines, and real-time order updates. We believe in keeping you informed at every step.',
              },
            ].map((value) => (
              <div key={value.title} className="p-5 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">What Sets Us Apart</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>
                <strong className="text-foreground">Artisanal partnerships:</strong> We work directly with
                Indian artisans and small-batch producers, supporting local craftsmanship while ensuring
                authentic quality.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>
                <strong className="text-foreground">WhatsApp-native communication:</strong> Order, track,
                and manage your corporate gifts directly through WhatsApp for a seamless experience.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>
                <strong className="text-foreground">Flexible bulk ordering:</strong> Whether you need 10 hampers
                or 10,000, we scale our operations to deliver on time with consistent quality.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>
                <strong className="text-foreground">Pan-India delivery:</strong> From metro cities to
                tier-2 locations, we manage logistics so you can focus on your business.
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-12 p-8 rounded-xl bg-primary/5 text-center">
          <h2 className="text-2xl font-bold text-foreground">Let Us Help You Gift Better</h2>
          <p className="mt-3 text-muted-foreground">
            Ready to elevate your corporate gifting? We would love to hear about your needs.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
