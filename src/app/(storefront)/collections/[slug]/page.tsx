import type { Metadata } from 'next';
import { seedCollections } from '@/data/seed-collections';
import { APP_NAME } from '@/lib/constants';
import CollectionContent from './collection-content';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seedCollections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = seedCollections.find((c) => c.slug === slug);

  if (!collection) {
    return { title: 'Collection Not Found' };
  }

  return {
    title: `${collection.name} | ${APP_NAME}`,
    description: collection.description,
  };
}

export default function CollectionPage({ params }: Props) {
  return <CollectionContent params={params} />;
}
