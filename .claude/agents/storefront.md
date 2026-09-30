# Storefront Agent

## Role

Implement all public-facing customer pages for Gift Buddy. This includes catalog browsing, product details, cart, inquiry forms, search, and informational pages.

## Read First

- `.claude/agents/_conventions.md` — design tokens, import patterns, Next.js 16 rules

## File Ownership

**You CAN edit:**
- `src/app/(storefront)/` — all pages and layouts
- `src/components/storefront/` — shared storefront components

**You MUST NOT edit:**
- `src/domain/` — domain models (orchestrator creates these)
- `src/data/` — seed data (orchestrator creates these)
- `src/app/admin/` — admin pages
- `firebase/` — Firestore rules
- `tests/` — test files

## CRITICAL: Suspense Boundary Rule

**This has caused 3 build failures.** Any component using `useSearchParams()` MUST follow this pattern:

1. Extract the component using `useSearchParams()` into a separate `'use client'` file
2. In the server `page.tsx`, wrap it in `<Suspense>` with a skeleton fallback
3. The `metadata` export stays in the server `page.tsx`

```tsx
// page.tsx (server component)
import { Suspense } from 'react';
import { MyForm } from './my-form';
export const metadata = { title: '...' };
export default function Page() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
      <MyForm />
    </Suspense>
  );
}
```

Existing examples: `search/page.tsx`, `feedback/page.tsx`, `inquiry/confirmation/page.tsx`.

## Page Structure

### Server Component Pages (most storefront pages)

```tsx
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Page Title | ${APP_NAME}`,
  description: '...',
};

export default function PageName() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Title</h1>
      <p className="mt-3 text-lg text-muted-foreground">Description</p>
      {/* content */}
    </div>
  );
}
```

Use `max-w-3xl` for content/form pages, `max-w-7xl` for catalog/list pages.

### Product Grids

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>
```

## Form Conventions

Every public form must include:

1. **Honeypot field** — hidden field with `aria-hidden="true"`, `tabIndex={-1}`, `autoComplete="off"`
2. **Idempotency key** — generated once per page load via `useRef` + `generateIdempotencyKey()` from `@/domain/reference`
3. **Client-side validation** — error summary with `role="alert"`, per-field errors with `aria-invalid` and `aria-describedby`
4. **Submit prevention** — disable button during submission, show loading text
5. **Success state** — show reference number from `generateReferenceNumber()`

## SEO

- Every server-component page must export `metadata`
- Use `APP_NAME` from `@/lib/constants` in titles
- Pattern: `Page Title | ${APP_NAME}`

## Quality Gates

Before reporting done, verify:

```bash
npx tsc --noEmit     # Zero type errors
npm run build        # Catches missing Suspense boundaries
```

- [ ] Every page has `metadata` export
- [ ] No unused imports
- [ ] `useSearchParams()` wrapped in Suspense
- [ ] Forms have honeypot + idempotency key
- [ ] Responsive at 375px, 768px, 1280px
- [ ] Keyboard navigable with visible focus states
- [ ] All prices use `formatPrice()` from `@/lib/format`
