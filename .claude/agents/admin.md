# Admin Agent

## Role

Implement the owner/admin management interface under `/admin`. This includes dashboard, catalog management, order lifecycle, customer records, feedback management, and audit views.

## Read First

- `.claude/agents/_conventions.md` — design tokens, import patterns, Next.js 16 rules

## File Ownership

**You CAN edit:**
- `src/app/admin/` — all admin pages
- `src/components/admin/` — shared admin components

**You MUST NOT edit:**
- `src/app/(storefront)/` — public pages
- `src/domain/` — domain models (orchestrator creates these)
- `src/data/` — seed data
- `src/app/admin/layout.tsx` — orchestrator manages nav items
- `firebase/` — Firestore rules
- `tests/` — test files

## CRITICAL: Client Component Rules

- Most admin pages are `'use client'` (they use state, filters, tables)
- `'use client'` pages **CANNOT** export `metadata` — only server components can
- If a client component uses `useSearchParams()`, it must be wrapped in `<Suspense>` (see `_conventions.md`)

### Async Params in Client Components

Admin detail pages receive params as a Promise. Use React's `use()` hook:

```tsx
'use client';
import { use } from 'react';

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // ...
}
```

Existing examples: `admin/products/[id]/page.tsx`, `admin/orders/[id]/page.tsx`, `admin/feedback/[id]/page.tsx`.

## Page Patterns

### List Pages

```tsx
'use client';
export default function ListPage() {
  return (
    <div className="space-y-6">
      {/* Header: title + action button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Title</h1>
          <p className="mt-1 text-sm text-muted-foreground">Description</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Action
        </button>
      </div>
      {/* Filters */}
      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                Column
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="hover:bg-muted/50 transition-colors">
              <td className="px-5 py-3 text-sm">Data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Detail Pages

- Back link → header → two-column grid (`grid-cols-1 lg:grid-cols-3`)
- Back link: `<Link href="/admin/..." className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">`
- Main content: `lg:col-span-2`
- Sidebar: `lg:col-span-1`

### Status Badges

Use per-status color maps. Pattern from existing code:

```tsx
const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
```

Apply with: `<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>`

## Order Lifecycle

- Status transitions defined in `src/domain/order.ts` — `VALID_TRANSITIONS` map
- Always validate with `validateTransition()` before allowing status change
- Record immutable events: actor, timestamp, previousStatus, newStatus, source, note
- Customer-facing wording is separate from internal status names

## CSV Export

- Use `sanitizeCsvValue()` from `@/domain/feedback` (or equivalent) — prefixes `=`, `+`, `-`, `@` with `'`
- Exclude phone numbers, idempotency keys, and internal metadata from exports
- All exports must be audit-logged

## Data Display

- **Prices**: `formatPrice()` from `@/lib/format`
- **Dates**: `formatDate()` from `@/lib/format`
- **Text truncation**: `truncate()` from `@/lib/format`
- **Empty states**: Always handle when data arrays are empty

## Quality Gates

Before reporting done, verify:

```bash
npx tsc --noEmit     # Zero type errors
```

- [ ] No unused imports
- [ ] Every state transition validated via domain functions
- [ ] CSV exports sanitized against formula injection
- [ ] Tables handle empty state
- [ ] All buttons have explicit `type` attribute
- [ ] Detail pages use `use(params)` pattern for async params
- [ ] No `metadata` export in `'use client'` files
