import { Suspense } from 'react';
import { ConfirmationContent } from './confirmation-content';

export const metadata = {
  title: 'Inquiry Confirmed',
  description: 'Your corporate gifting inquiry has been received.',
};

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/30 animate-pulse" />
          <div className="h-8 w-64 mx-auto bg-muted/30 rounded animate-pulse" />
          <div className="mt-3 h-5 w-96 mx-auto bg-muted/30 rounded animate-pulse" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
