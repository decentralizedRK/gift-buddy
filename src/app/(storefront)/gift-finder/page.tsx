import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import { GiftFinderForm } from './gift-finder-form';

export const metadata: Metadata = {
  title: `Gift Finder — Help Me Choose | ${APP_NAME}`,
  description:
    'Not sure which corporate gift hamper to choose? Let our team recommend the perfect gift based on your occasion, budget, and preferences.',
};

export default function GiftFinderPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Gift Finder
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Not sure which hamper to choose? Tell us about your occasion, recipients, and
          preferences, and we will recommend the best options for you.
        </p>
      </div>
      <GiftFinderForm />
    </div>
  );
}
