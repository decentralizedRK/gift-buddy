import type { Metadata } from 'next';
import HomeContent from './home-content';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} — Premium Corporate Gifting`,
  description:
    'Curated corporate gift hampers for every occasion. Sustainable, premium, and personalized gifting solutions for businesses across India.',
};

export default function HomePage() {
  return <HomeContent />;
}
