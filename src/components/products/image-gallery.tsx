'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex] || '/placeholder-product.png';

  return (
    <div>
      <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-xl shadow-lg">
        <Image
          src={mainImage}
          alt={`${productName} - imagen ${selectedIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-200"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2" role="group" aria-label="Imágenes del producto">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)] ${
                selectedIndex === idx
                  ? 'border-[var(--kc-primary)] ring-2 ring-[var(--kc-primary)]'
                  : 'border-border hover:border-[var(--kc-primary)]/50'
              }`}
              aria-label={`Ver imagen ${idx + 1} de ${productName}`}
              aria-pressed={selectedIndex === idx}
            >
              <Image
                src={img}
                alt={`${productName} - miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
