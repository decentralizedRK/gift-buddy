'use client';

import { useState, useEffect } from 'react';
import { isStaticStaging } from '@/lib/env-config';
import { seedProducts } from '@/data/seed-products';
import { seedCategories } from '@/data/seed-categories';
import { seedCollections } from '@/data/seed-collections';
import {
  seedFeedback,
  seedRecommendationRequests,
  type SeedFeedback,
  type SeedRecommendationRequest,
} from '@/data/seed-feedback';

type SeedProduct = (typeof seedProducts)[number];
type SeedCategory = (typeof seedCategories)[number];
type SeedCollection = (typeof seedCollections)[number];

interface DataResult<T> {
  data: T;
  loading: boolean;
}

function useFirestoreCollection<T>(
  collectionName: string,
  seedData: T[],
): DataResult<T[]> {
  const [data, setData] = useState<T[]>(isStaticStaging ? seedData : []);
  const [loading, setLoading] = useState(!isStaticStaging);

  useEffect(() => {
    if (isStaticStaging) return;

    let cancelled = false;

    async function fetchData() {
      try {
        const { db } = await import('@/lib/firebase-client');
        if (!db) throw new Error('Firebase not configured');
        const { collection, getDocs } = await import('firebase/firestore');
        const snapshot = await getDocs(collection(db, collectionName));
        if (!cancelled) {
          setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T));
          setLoading(false);
        }
      } catch (error) {
        console.error(`Failed to fetch ${collectionName}:`, error);
        if (!cancelled) {
          setData(seedData);
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [collectionName, seedData]);

  return { data, loading };
}

export function useProducts(): DataResult<SeedProduct[]> {
  return useFirestoreCollection<SeedProduct>('products', seedProducts);
}

export function useProduct(idOrSlug: string): DataResult<SeedProduct | null> {
  const { data: products, loading } = useProducts();
  const product = products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
  return { data: product, loading };
}

export function useCategories(): DataResult<SeedCategory[]> {
  return useFirestoreCollection<SeedCategory>('categories', seedCategories);
}

export function useCategory(slug: string): DataResult<SeedCategory | null> {
  const { data: categories, loading } = useCategories();
  const category = categories.find((c) => c.slug === slug) ?? null;
  return { data: category, loading };
}

export function useCollections(): DataResult<SeedCollection[]> {
  return useFirestoreCollection<SeedCollection>('collections', seedCollections);
}

export function useCollection(slug: string): DataResult<SeedCollection | null> {
  const { data: collections, loading } = useCollections();
  const coll = collections.find((c) => c.slug === slug) ?? null;
  return { data: coll, loading };
}

export function useFeedbackItems(): DataResult<SeedFeedback[]> {
  return useFirestoreCollection<SeedFeedback>('feedback', seedFeedback);
}

export function useFeedbackItem(id: string): DataResult<SeedFeedback | null> {
  const { data: items, loading } = useFeedbackItems();
  const item = items.find((f) => f.id === id) ?? null;
  return { data: item, loading };
}

export function useRecommendations(): DataResult<SeedRecommendationRequest[]> {
  return useFirestoreCollection<SeedRecommendationRequest>(
    'recommendationRequests',
    seedRecommendationRequests,
  );
}

export function useRecommendation(id: string): DataResult<SeedRecommendationRequest | null> {
  const { data: items, loading } = useRecommendations();
  const item = items.find((r) => r.id === id) ?? null;
  return { data: item, loading };
}
