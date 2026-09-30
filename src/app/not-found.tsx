import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md">
        {/* Gift box illustration */}
        <div className="mx-auto w-40 h-40 mb-8 text-muted-foreground/30">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
          >
            {/* Gift box body */}
            <rect
              x="40"
              y="90"
              width="120"
              height="80"
              rx="6"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            {/* Gift box lid */}
            <rect
              x="32"
              y="72"
              width="136"
              height="24"
              rx="4"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            {/* Vertical ribbon */}
            <line
              x1="100"
              y1="72"
              x2="100"
              y2="170"
              stroke="currentColor"
              strokeWidth="4"
            />
            {/* Horizontal ribbon */}
            <line
              x1="40"
              y1="130"
              x2="160"
              y2="130"
              stroke="currentColor"
              strokeWidth="4"
            />
            {/* Bow left */}
            <path
              d="M100 72 C85 50 60 55 75 72"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            {/* Bow right */}
            <path
              d="M100 72 C115 50 140 55 125 72"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            {/* Question mark */}
            <text
              x="100"
              y="145"
              textAnchor="middle"
              fontSize="32"
              fontWeight="bold"
              fill="currentColor"
              opacity="0.5"
            >
              ?
            </text>
          </svg>
        </div>

        <p className="text-primary text-6xl md:text-7xl font-bold mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Page Not Found
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Sorry, we could not find the page you are looking for. It may have been
          moved, removed, or the URL might be incorrect.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to {APP_NAME}
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/categories" className="text-primary hover:text-primary/80 transition-colors">
            Categories
          </Link>
          <Link href="/collections" className="text-primary hover:text-primary/80 transition-colors">
            Collections
          </Link>
          <Link href="/search" className="text-primary hover:text-primary/80 transition-colors">
            Search
          </Link>
          <Link href="/contact" className="text-primary hover:text-primary/80 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
