'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ProductStatus, StockStatus } from '@/domain/product';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Back to products"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Product</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new gift hamper
          </p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared product form                                                */
/* ------------------------------------------------------------------ */

interface ProductVariantForm {
  id: string;
  name: string;
  sku: string;
  price: string;
  description: string;
}

interface ProductFormData {
  title: string;
  slug: string;
  sku: string;
  shortDescription: string;
  longDescription: string;
  includedItems: string;
  basePrice: string;
  compareAtPrice: string;
  taxClassification: string;
  moq: string;
  leadTimeDays: string;
  stockStatus: StockStatus;
  status: ProductStatus;
  personalizationOptions: string;
  deliveryRegions: string;
  tags: string;
  occasion: string;
  recipientType: string;
  category: string;
  collection: string;
  imageUrl: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
}

const INITIAL_FORM: ProductFormData = {
  title: '',
  slug: '',
  sku: '',
  shortDescription: '',
  longDescription: '',
  includedItems: '',
  basePrice: '',
  compareAtPrice: '',
  taxClassification: 'GST_18',
  moq: '1',
  leadTimeDays: '5',
  stockStatus: 'in_stock',
  status: 'draft',
  personalizationOptions: '',
  deliveryRegions: 'pan_india',
  tags: '',
  occasion: '',
  recipientType: '',
  category: '',
  collection: '',
  imageUrl: '',
  imageAlt: '',
  seoTitle: '',
  seoDescription: '',
};

interface ProductFormProps {
  initialData?: ProductFormData;
  initialVariants?: ProductVariantForm[];
  isEdit?: boolean;
}

export function ProductForm({
  initialData,
  initialVariants,
  isEdit = false,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData ?? INITIAL_FORM);
  const [variants, setVariants] = useState<ProductVariantForm[]>(
    initialVariants ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function update(field: keyof ProductFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      {
        id: `var_new_${Date.now()}`,
        name: '',
        sku: '',
        price: '',
        description: '',
      },
    ]);
  }

  function removeVariant(id: string) {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }

  function updateVariant(id: string, field: keyof ProductVariantForm, value: string) {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.sku.trim()) newErrors.sku = 'SKU is required';
    if (!form.shortDescription.trim())
      newErrors.shortDescription = 'Short description is required';
    if (!form.basePrice || Number(form.basePrice) <= 0)
      newErrors.basePrice = 'Price must be greater than 0';
    if (!form.category.trim()) newErrors.category = 'Category is required';

    for (const variant of variants) {
      if (!variant.name.trim()) {
        newErrors[`variant_${variant.id}_name`] = 'Variant name is required';
      }
      if (!variant.sku.trim()) {
        newErrors[`variant_${variant.id}_sku`] = 'Variant SKU is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(publishStatus: ProductStatus) {
    if (!validate()) return;

    setSaving(true);
    // TODO: Save to Firestore
    setTimeout(() => setSaving(false), 1000);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(form.status);
      }}
      className="space-y-8"
      noValidate
    >
      {/* Basic Info */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => {
                update('title', e.target.value);
                if (!isEdit && !form.slug) {
                  update('slug', generateSlug(e.target.value));
                }
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.title ? 'border-destructive' : 'border-border'}`}
              placeholder="e.g. Premium Onboarding Hamper"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="premium-onboarding-hamper"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-foreground mb-1">
              SKU <span className="text-destructive">*</span>
            </label>
            <input
              id="sku"
              type="text"
              value={form.sku}
              onChange={(e) => update('sku', e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.sku ? 'border-destructive' : 'border-border'}`}
              placeholder="GB-XXX-001"
            />
            {errors.sku && (
              <p className="mt-1 text-xs text-destructive">{errors.sku}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="shortDescription" className="block text-sm font-medium text-foreground mb-1">
              Short Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
              rows={2}
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.shortDescription ? 'border-destructive' : 'border-border'}`}
              placeholder="Brief description for cards and search results"
            />
            {errors.shortDescription && (
              <p className="mt-1 text-xs text-destructive">{errors.shortDescription}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="longDescription" className="block text-sm font-medium text-foreground mb-1">
              Long Description
            </label>
            <textarea
              id="longDescription"
              value={form.longDescription}
              onChange={(e) => update('longDescription', e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Detailed product description"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="includedItems" className="block text-sm font-medium text-foreground mb-1">
              Included Items
            </label>
            <textarea
              id="includedItems"
              value={form.includedItems}
              onChange={(e) => update('includedItems', e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="One item per line"
            />
            <p className="mt-1 text-xs text-muted-foreground">Enter each item on a separate line</p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
              Category <span className="text-destructive">*</span>
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.category ? 'border-destructive' : 'border-border'}`}
            >
              <option value="">Select category</option>
              <option value="corporate-gifting">Corporate Gifting</option>
              <option value="festival-seasonal">Festival &amp; Seasonal</option>
              <option value="wellness-self-care">Wellness &amp; Self-Care</option>
              <option value="gourmet-food">Gourmet &amp; Food</option>
              <option value="employee-recognition">Employee Recognition</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          <div>
            <label htmlFor="collection" className="block text-sm font-medium text-foreground mb-1">
              Collection
            </label>
            <select
              id="collection"
              value={form.collection}
              onChange={(e) => update('collection', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No collection</option>
              <option value="best-sellers">Best Sellers</option>
              <option value="new-arrivals">New Arrivals</option>
              <option value="budget-friendly">Budget-Friendly</option>
              <option value="premium-selection">Premium Selection</option>
            </select>
          </div>

          <div>
            <label htmlFor="occasion" className="block text-sm font-medium text-foreground mb-1">
              Occasion
            </label>
            <input
              id="occasion"
              type="text"
              value={form.occasion}
              onChange={(e) => update('occasion', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. onboarding, festival, appreciation"
            />
          </div>

          <div>
            <label htmlFor="recipientType" className="block text-sm font-medium text-foreground mb-1">
              Recipient Type
            </label>
            <input
              id="recipientType"
              type="text"
              value={form.recipientType}
              onChange={(e) => update('recipientType', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. employee, executive, client"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-1">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Comma-separated tags"
            />
          </div>

          <div>
            <label htmlFor="personalizationOptions" className="block text-sm font-medium text-foreground mb-1">
              Personalization Options
            </label>
            <input
              id="personalizationOptions"
              type="text"
              value={form.personalizationOptions}
              onChange={(e) => update('personalizationOptions', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Comma-separated options"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-foreground mb-1">
              Base Price (paise) <span className="text-destructive">*</span>
            </label>
            <input
              id="basePrice"
              type="number"
              min="0"
              value={form.basePrice}
              onChange={(e) => update('basePrice', e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.basePrice ? 'border-destructive' : 'border-border'}`}
              placeholder="249900"
            />
            {errors.basePrice && (
              <p className="mt-1 text-xs text-destructive">{errors.basePrice}</p>
            )}
            {form.basePrice && Number(form.basePrice) > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Display: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(form.basePrice) / 100)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="compareAtPrice" className="block text-sm font-medium text-foreground mb-1">
              Compare-at Price (paise)
            </label>
            <input
              id="compareAtPrice"
              type="number"
              min="0"
              value={form.compareAtPrice}
              onChange={(e) => update('compareAtPrice', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="299900"
            />
          </div>

          <div>
            <label htmlFor="taxClassification" className="block text-sm font-medium text-foreground mb-1">
              Tax Classification
            </label>
            <select
              id="taxClassification"
              value={form.taxClassification}
              onChange={(e) => update('taxClassification', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="GST_0">GST 0%</option>
              <option value="GST_5">GST 5%</option>
              <option value="GST_12">GST 12%</option>
              <option value="GST_18">GST 18%</option>
              <option value="GST_28">GST 28%</option>
            </select>
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="stockStatus" className="block text-sm font-medium text-foreground mb-1">
              Stock Status
            </label>
            <select
              id="stockStatus"
              value={form.stockStatus}
              onChange={(e) => update('stockStatus', e.target.value as StockStatus)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="in_stock">In Stock</option>
              <option value="limited">Limited</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="made_to_order">Made to Order</option>
            </select>
          </div>

          <div>
            <label htmlFor="moq" className="block text-sm font-medium text-foreground mb-1">
              Minimum Order Quantity
            </label>
            <input
              id="moq"
              type="number"
              min="1"
              value={form.moq}
              onChange={(e) => update('moq', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="leadTimeDays" className="block text-sm font-medium text-foreground mb-1">
              Lead Time (days)
            </label>
            <input
              id="leadTimeDays"
              type="number"
              min="0"
              value={form.leadTimeDays}
              onChange={(e) => update('leadTimeDays', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="deliveryRegions" className="block text-sm font-medium text-foreground mb-1">
              Delivery Regions
            </label>
            <input
              id="deliveryRegions"
              type="text"
              value={form.deliveryRegions}
              onChange={(e) => update('deliveryRegions', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Comma-separated regions"
            />
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Variant
          </button>
        </div>

        {variants.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No variants added. Click &quot;Add Variant&quot; to create size or customization options.
          </p>
        ) : (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Variant {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="text-destructive hover:text-destructive/80 text-sm transition-colors"
                    aria-label={`Remove variant ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`variant-name-${variant.id}`}
                      className="block text-xs font-medium text-muted-foreground mb-1"
                    >
                      Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id={`variant-name-${variant.id}`}
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(variant.id, 'name', e.target.value)
                      }
                      className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors[`variant_${variant.id}_name`] ? 'border-destructive' : 'border-border'}`}
                      placeholder="e.g. Standard, Premium"
                    />
                    {errors[`variant_${variant.id}_name`] && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors[`variant_${variant.id}_name`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`variant-sku-${variant.id}`}
                      className="block text-xs font-medium text-muted-foreground mb-1"
                    >
                      SKU <span className="text-destructive">*</span>
                    </label>
                    <input
                      id={`variant-sku-${variant.id}`}
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(variant.id, 'sku', e.target.value)
                      }
                      className={`w-full rounded-lg border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors[`variant_${variant.id}_sku`] ? 'border-destructive' : 'border-border'}`}
                      placeholder="GB-XXX-001-STD"
                    />
                    {errors[`variant_${variant.id}_sku`] && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors[`variant_${variant.id}_sku`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`variant-price-${variant.id}`}
                      className="block text-xs font-medium text-muted-foreground mb-1"
                    >
                      Price (paise)
                    </label>
                    <input
                      id={`variant-price-${variant.id}`}
                      type="number"
                      min="0"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(variant.id, 'price', e.target.value)
                      }
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="249900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`variant-desc-${variant.id}`}
                      className="block text-xs font-medium text-muted-foreground mb-1"
                    >
                      Description
                    </label>
                    <input
                      id={`variant-desc-${variant.id}`}
                      type="text"
                      value={variant.description}
                      onChange={(e) =>
                        updateVariant(variant.id, 'description', e.target.value)
                      }
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Variant description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Media */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Media</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add image URLs for the product. Firebase Storage upload will be available once configured.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground mb-1">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label htmlFor="imageAlt" className="block text-sm font-medium text-foreground mb-1">
              Image Alt Text
            </label>
            <input
              id="imageAlt"
              type="text"
              value={form.imageAlt}
              onChange={(e) => update('imageAlt', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Descriptive alt text for the image"
            />
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-border bg-background p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">SEO</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium text-foreground mb-1">
              SEO Title
            </label>
            <input
              id="seoTitle"
              type="text"
              value={form.seoTitle}
              onChange={(e) => update('seoTitle', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Page title for search engines"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {form.seoTitle.length}/60 characters recommended
            </p>
          </div>
          <div>
            <label htmlFor="seoDescription" className="block text-sm font-medium text-foreground mb-1">
              SEO Description
            </label>
            <textarea
              id="seoDescription"
              value={form.seoDescription}
              onChange={(e) => update('seoDescription', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Meta description for search engines"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {form.seoDescription.length}/160 characters recommended
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </Link>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSubmit('draft')}
          className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSubmit('active')}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </form>
  );
}
