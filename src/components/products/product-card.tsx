'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils/product-helpers';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasCustomization = product.customization_options.length > 0;
  const imageUrl = product.images[0] || '/placeholder-product.png';

  return (
    <Link
      href={`/kamcat/${product.id}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)]"
    >
      <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {hasCustomization && (
          <span className="absolute right-2 top-2 rounded-full bg-[var(--kc-accent)]/10 px-2 py-0.5 text-xs text-[var(--kc-accent)]">
            Personalizable
          </span>
        )}
      </div>

      <h3 className="mb-1 text-base font-semibold text-foreground line-clamp-2">
        {product.name}
      </h3>

      <p className="mb-2 text-sm text-muted-foreground line-clamp-1">
        {product.description || 'Sin descripción'}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-[var(--kc-accent)]">
          {formatPrice(Number(product.price))}
        </span>
        {product.category && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {product.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}
