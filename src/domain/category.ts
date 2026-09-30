import { z } from 'zod';

export const CategoryStatusSchema = z.enum(['active', 'archived']);
export type CategoryStatus = z.infer<typeof CategoryStatusSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0),
  status: CategoryStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CollectionStatusSchema = z.enum(['active', 'archived']);
export type CollectionStatus = z.infer<typeof CollectionStatusSchema>;

export const CollectionSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional(),
  productIds: z.array(z.string()),
  featuredRank: z.number().int().min(0).optional(),
  status: CollectionStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Collection = z.infer<typeof CollectionSchema>;
