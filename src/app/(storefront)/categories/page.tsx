import type { Metadata } from 'next';
import CategoriesContent from './categories-content';

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse corporate gift hampers by category. Find gifts for onboarding, festivals, wellness, gourmet, and employee recognition.',
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}
