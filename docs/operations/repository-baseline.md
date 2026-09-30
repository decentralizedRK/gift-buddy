# Repository Baseline

**Captured**: Project scaffolding phase (v0.1.0)

## Repository

- **Origin**: `https://github.com/decentralizedRK/gift-buddy`
- **Default branch**: `main`

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.3.x | Full-stack React framework (App Router) |
| React | 19.x | UI library |
| TypeScript | 5.x | Type-safe development |
| Tailwind CSS | 4.x | Utility-first styling |
| Firebase SDK | 12.x | Auth, Firestore, Hosting |
| Zod | 4.x | Schema validation |
| Vitest | Latest | Unit and component testing |
| Testing Library | Latest | Component test utilities |
| ESLint | Latest | Code linting |
| Prettier | Latest | Code formatting |
| nanoid | 3.x | Short unique ID generation |

## Package Manager

- **npm** with committed `package-lock.json`
- Node.js 20+ required

## Project Structure

```
gift-buddy/
  .github/               # GitHub templates and workflows
  docs/                   # Project documentation
    architecture/         # System design, data model, ADRs
    product/              # Vision, requirements, personas
    integrations/         # WhatsApp integration guide
    operations/           # Setup, deployment, runbooks
    testing/              # Test strategy and evidence
    features/             # Feature specifications
    api/                  # API documentation
  firebase/               # Firestore rules, indexes, emulator config
  src/
    app/                  # Next.js App Router
      (storefront)/       # Public-facing pages
      admin/              # Admin interface
      api/                # API routes
    components/           # Shared UI components
    domain/               # Business logic (framework-independent)
    data/                 # Data access layer and seed data
    integrations/         # External service adapters (WhatsApp)
    lib/                  # Shared utilities
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Tests with coverage |
| `npm run typecheck` | TypeScript checking |
| `npm run lint` | ESLint |
| `npm run format` | Prettier auto-format |
| `npm run emulators` | Firebase emulators |

## Architecture Decisions

- **ADR-0001**: Next.js App Router for server components and file-based routing
- **ADR-0002**: Firebase Backend for integrated auth/database/hosting on Spark plan
- **ADR-0003**: WhatsApp Cloud API for compliance and official Meta support

## Conventions

- **Currency**: INR, stored in paise (integer)
- **IDs**: Non-sequential, generated with nanoid
- **Dates**: ISO 8601 or Firestore server timestamps
- **Phone numbers**: E.164 for storage, original format for display
- **Commits**: Conventional Commits format
- **Branches**: `feat/`, `fix/`, `docs/`, `chore/` prefixes

## Constraints

- Firebase Spark plan by default (no billing)
- WhatsApp uses fake adapter until Meta credentials are configured
- No payment processing in v1
- Admin access requires explicit allowlisting
