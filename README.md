# Gift Buddy

Premium corporate gifting platform for curated gift hampers. Built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Features

- **Storefront**: Browse curated corporate gift hampers by category, collection, occasion, and price
- **Product Catalog**: Detailed product pages with variants, personalization options, and bulk pricing
- **Cart & Inquiry**: Build orders and submit corporate inquiries with WhatsApp continuation
- **Admin Dashboard**: Manage products, orders, customers, and fulfillment lifecycle
- **WhatsApp Integration**: Order notifications and customer communication via WhatsApp Business API
- **Order Tracking**: Secure reference-based order tracking for customers

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Validation**: Zod
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Testing**: Vitest + Testing Library + Firebase Emulator Suite
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20+
- npm
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

```bash
git clone git@github.com:decentralizedRK/gift-buddy.git
cd gift-buddy
npm install
cp .env.example .env.local
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run format` | Format code with Prettier |
| `npm run emulators` | Start Firebase emulators |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (storefront)/       # Public storefront pages
│   ├── admin/              # Admin management interface
│   ├── api/                # API routes (webhooks)
│   └── auth/               # Authentication pages
├── components/
│   ├── storefront/         # Storefront components
│   └── admin/              # Admin components
├── domain/                 # Domain models and business logic
├── data/                   # Data access and seed data
├── integrations/whatsapp/  # WhatsApp Business API integration
├── lib/                    # Utilities and configuration
└── security/               # Authorization and validation
```

## Documentation

See [docs/](docs/) for full documentation including architecture, operations, and testing guides.

## License

Private — All rights reserved.
