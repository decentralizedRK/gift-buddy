import { z } from 'zod';

export const StockStatusSchema = z.enum([
  'in_stock',
  'limited',
  'out_of_stock',
  'made_to_order',
]);
export type StockStatus = z.infer<typeof StockStatusSchema>;

export const ProductStatusSchema = z.enum(['draft', 'active', 'archived']);
export type ProductStatus = z.infer<typeof ProductStatusSchema>;

export const ProductImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  alt: z.string(),
  sortOrder: z.number().int().min(0),
});
export type ProductImage = z.infer<typeof ProductImageSchema>;

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  sku: z.string().min(1),
  priceAdjustment: z.number().int(),
  stockStatus: StockStatusSchema,
  attributes: z.record(z.string(), z.string()),
});
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  sku: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string(),
  longDescription: z.string(),
  includedItems: z.array(z.string()),
  variants: z.array(ProductVariantSchema),
  basePrice: z.number().int().min(0),
  compareAtPrice: z.number().int().min(0).optional(),
  taxClassification: z.string(),
  moq: z.number().int().min(1),
  leadTimeDays: z.number().int().min(0),
  personalizationOptions: z.array(z.string()),
  stockStatus: StockStatusSchema,
  deliveryRegions: z.array(z.string()),
  tags: z.array(z.string()),
  occasion: z.array(z.string()),
  recipientType: z.array(z.string()),
  category: z.string(),
  collection: z.string().optional(),
  images: z.array(ProductImageSchema),
  featuredRank: z.number().int().min(0).optional(),
  status: ProductStatusSchema,
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Product = z.infer<typeof ProductSchema>;
