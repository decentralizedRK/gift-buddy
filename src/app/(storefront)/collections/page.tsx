import type { Metadata } from 'next';
import CollectionsContent from './collections-content';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Browse our curated gift hamper collections. From best sellers to premium selections, find the right collection for your corporate gifting needs.',
};

export default function CollectionsPage() {
  return <CollectionsContent />;
}
