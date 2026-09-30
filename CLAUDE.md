# Gift Buddy — Claude Code Operating Contract

See the parent directory's CLAUDE.md for the full autonomous operating contract.

## Quick Reference

- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Firebase, Zod
- **Node**: 20+ required (use `nvm use 20`)
- **Package manager**: npm (lockfile committed)
- **Currency**: INR, prices stored in paise
- **WhatsApp**: Fake adapter by default, official Cloud API when configured

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
