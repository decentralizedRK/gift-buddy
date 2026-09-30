# Gift Buddy — Claude Code Operating Contract

See the parent directory's CLAUDE.md for the full autonomous operating contract.

## Quick Reference

- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Firebase, Zod
- **Node**: 20+ required (use `nvm use 20`)
- **Package manager**: npm (lockfile committed)
- **Currency**: INR, prices stored in paise
- **WhatsApp**: Fake adapter by default, official Cloud API when configured

## Agent Definitions

Specialized agent instructions live in `.claude/agents/`. Each file defines a role's scope, file ownership boundaries, conventions, and quality gates.

- `_conventions.md` — shared design tokens, import patterns, Next.js 16 rules (read by all agents)
- `orchestrator.md` — delegation model, task graph, acceptance gates
- `storefront.md` — public pages, forms, SEO, Suspense patterns
- `admin.md` — admin flows, CRUD, order lifecycle, CSV export
- `firebase.md` — Firestore rules, indexes, seed data, Spark constraints
- `whatsapp.md` — provider pattern, webhooks, templates, idempotency
- `test.md` — test pyramid, fixtures, coverage requirements
- `security-review.md` — threat modeling, review checklist, privacy audit
- `product-ux.md` — journeys, requirements, accessibility criteria
- `architecture.md` — boundaries, data model, ADRs, cost constraints
- `documentation.md` — docs, traceability, changelog, runbooks

When spawning a subagent, reference the appropriate agent file in the prompt so it inherits project-specific conventions.

## Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm test             # Run tests
npm run typecheck    # Type checking
npm run lint         # ESLint
npm run format       # Prettier
npm run emulators    # Firebase emulators
```

## Architecture

- `src/domain/` — Business logic and types (no framework imports)
- `src/data/` — Data access layer and seed data
- `src/integrations/whatsapp/` — WhatsApp provider abstraction
- `src/app/(storefront)/` — Public pages
- `src/app/admin/` — Admin interface
- `src/app/api/` — API routes
- `firebase/` — Firestore rules and indexes

@AGENTS.md
