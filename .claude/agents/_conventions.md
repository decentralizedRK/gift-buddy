# Gift Buddy — Shared Conventions

Every agent must read this file before writing code.

## Next.js 16 Breaking Changes

- `params` is `Promise<{ slug: string }>` — server components use `await params`, client components use `use(params)` from React
- `useSearchParams()` **MUST** be wrapped in `<Suspense>` in the server page component — production build fails without this
- `metadata` export only works in server components — not in `'use client'` files
- Read guides in `node_modules/next/dist/docs/` before writing any code — APIs and conventions differ from prior versions

### Suspense Pattern (mandatory for useSearchParams)

```tsx
// page.tsx (server component)
import { Suspense } from 'react';
import { ClientForm } from './client-form';

export default function Page() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-lg" />}>
      <ClientForm />
    </Suspense>
  );
}

// client-form.tsx ('use client' — useSearchParams lives here)
'use client';
import { useSearchParams } from 'next/navigation';
export function ClientForm() {
  const params = useSearchParams();
  // ...
}
```

### Async Params Pattern

```tsx
// Server component: await params
type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const { slug } = await params;
}

// Client component: use(params)
'use client';
import { use } from 'react';
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
}
```

## Design Token System

| Token | Usage |
|-------|-------|
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text |
| `text-primary` | Brand accent text |
| `text-primary-foreground` | Text on primary bg |
| `text-destructive` | Error text |
| `bg-background` | Main background |
| `bg-muted` | Subdued background |
| `bg-primary` | Primary action bg |
| `bg-primary/10` | Faded primary bg |
| `border-border` | All borders |
| `focus:ring-ring` | Focus ring |

### Component Patterns

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`
- **Card**: `rounded-xl border border-border bg-background p-5`
- **Primary button**: `rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors`
- **Secondary button**: `rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors`
- **Input**: `w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm`
- **Badge**: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`
- **Skeleton**: `animate-pulse bg-muted/30 rounded`
- **Page heading (storefront)**: `text-3xl md:text-4xl font-bold text-foreground`
- **Page heading (admin)**: `text-2xl font-bold text-foreground`

## Import Patterns

```
@/domain/     — Pure business logic, Zod schemas, types (NO framework imports)
@/data/       — Seed data (seed-products, seed-categories, seed-collections, seed-feedback)
@/lib/        — Framework utilities (format, constants, env, firebase-client, cart-store)
@/components/ — Shared UI components (storefront/Header, storefront/Footer, storefront/ProductCard)
```

Import only what you use. Unused imports cause lint failures.

## Universal Rules

- **No secrets** in source, logs, fixtures, client bundles, or documentation
- **No FNP content** — never copy branding, images, text, descriptions, or layouts
- **Currency**: INR, prices stored in paise (integer). Use `formatPrice()` from `@/lib/format`
- **Dates**: Use `formatDate()` from `@/lib/format`
- **Validation**: Zod schemas at all trust boundaries
- **Domain purity**: `src/domain/` must contain zero framework imports
- **Commits**: Conventional format — `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- **Idempotency keys** on all public form submissions
- **Honeypot fields** on all public forms for spam prevention

## Quality Commands

```bash
npm run build      # Production build (catches Suspense errors)
npm run typecheck  # npx tsc --noEmit
npm run lint       # ESLint
npm test           # Vitest (unit + component tests)
npm run format     # Prettier
```
