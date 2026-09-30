import { Suspense } from 'react';
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import { FeedbackForm } from './feedback-form';

export const metadata: Metadata = {
  title: `Share Your Feedback | ${APP_NAME}`,
  description:
    'Help us improve Gift Buddy by sharing your feedback, suggestions, and ideas for our corporate gift hampers.',
};

export default function FeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Share Your Feedback
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your feedback helps us create better gifting experiences. Whether it is a suggestion
          for a new hamper, feedback on an existing product, or ideas for improvement, we would
          love to hear from you.
        </p>
      </div>
      <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
        <FeedbackForm />
      </Suspense>
    </div>
  );
}
