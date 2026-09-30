import { seedFeedback } from '@/data/seed-feedback';
import { seedRecommendationRequests } from '@/data/seed-feedback';
import FeedbackDetailPage from './feedback-detail';

export function generateStaticParams() {
  return [
    ...seedFeedback.map((f) => ({ id: f.id })),
    ...seedRecommendationRequests.map((r) => ({ id: r.id })),
  ];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <FeedbackDetailPage params={params} />;
}
