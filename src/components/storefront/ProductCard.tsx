import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/format';
import { imagePath } from '@/lib/image-path';

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
        <Image
          src={imagePath(imageUrl)}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
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
