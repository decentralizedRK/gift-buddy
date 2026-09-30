# Contributing to Gift Buddy

Thank you for your interest in contributing to Gift Buddy.

## Getting Started

1. Fork the repository and clone your fork
2. Follow the [Local Development Guide](docs/operations/local-development.md) for setup
3. Create a feature branch from `main`

## Branch Naming

Use prefixed branch names:

- `feat/short-description` -- new features
- `fix/short-description` -- bug fixes
- `docs/short-description` -- documentation changes
- `chore/short-description` -- tooling, dependencies, configuration

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Longer explanation if needed.
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

Examples:
```
feat(catalog): add price range filter to product listing
fix(cart): prevent negative quantity on cart items
docs(operations): update deployment checklist
test(domain): add order state transition edge cases
```

## Development Workflow

1. Create a branch: `git checkout -b feat/your-feature`
2. Make changes in small, focused commits
3. Run quality checks before pushing:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

4. Push and open a pull request against `main`
5. Fill in the PR template with summary, test plan, and checklist

## Pull Request Requirements

- All CI checks must pass (format, lint, types, tests, build)
- Include tests for new functionality
- Update documentation if behavior changes
- Keep PRs focused on a single concern
- No secrets, credentials, or personal data in code or tests

## Code Style

- TypeScript strict mode
- Prettier for formatting (run `npm run format`)
- ESLint for linting (run `npm run lint`)
- Prefer named exports over default exports
- Use Zod schemas at trust boundaries (API inputs, form data, external payloads)
- Keep domain logic in `src/domain/` free of framework imports

## Testing

- Write unit tests for domain logic and utilities
- Write component tests for UI components with Testing Library
- Write integration tests for Firestore operations (against emulators)
- See the [Test Strategy](docs/testing/test-strategy.md) for detailed guidance

## Architecture

- See [System Overview](docs/architecture/system-overview.md) for the overall design
- See [Data Model](docs/architecture/data-model.md) for Firestore collections
- Check existing [ADRs](docs/architecture/decisions/) before proposing architectural changes
- Create a new ADR for significant architectural decisions

## Security

- Never commit secrets, API keys, or credentials
- See [SECURITY.md](SECURITY.md) for the security policy and vulnerability reporting
- Validate all external input
- Follow the principle of least privilege for data access

## Questions

Open a GitHub issue for questions, feature requests, or bug reports.
