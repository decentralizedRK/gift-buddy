import Link from 'next/link';
import { formatPrice } from '@/lib/format';

interface ProductCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  basePrice: number;
  compareAtPrice?: number | null;
  images: { url: string; alt: string }[];
  stockStatus: string;
  occasion: string[];
  tags: string[];
}

export function ProductCard({
  slug,
  title,
  shortDescription,
  basePrice,
  compareAtPrice,
  images,
  stockStatus,
  occasion,
  tags,
}: ProductCardProps) {
  const imageUrl = images[0]?.url ?? '/images/placeholder.jpg';
  const imageAlt = images[0]?.alt ?? title;
  const isOutOfStock = stockStatus === 'out_of_stock';
  const hasDiscount = compareAtPrice && compareAtPrice > basePrice;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-16 h-16 opacity-30"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        </div>
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-muted-foreground text-background text-xs font-medium px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-destructive text-white text-xs font-medium px-2 py-1 rounded">
            Sale
          </div>
        )}
      </div>
      <div className="p-4">
        {occasion.length > 0 && (
          <p className="text-xs text-primary font-medium mb-1">{occasion[0]}</p>
        )}
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{shortDescription}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">{formatPrice(basePrice)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
