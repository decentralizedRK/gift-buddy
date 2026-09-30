import type { Metadata } from 'next';
import { seedCategories } from '@/data/seed-categories';
import { APP_NAME } from '@/lib/constants';
import CategoryContent from './category-content';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return seedCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = seedCategories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | ${APP_NAME}`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: Props) {
  return <CategoryContent params={params} />;
}
