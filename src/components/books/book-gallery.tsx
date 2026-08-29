'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BookGalleryProps {
  images: string[];
  title: string;
}

export default function BookGallery({ images, title }: BookGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-hl-secondary/5 text-hl-primary/20">
        <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-hl-secondary/5">
        <Image
          src={images[selectedIndex]}
          alt={`${title} - imagen ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-opacity duration-200"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                idx === selectedIndex ? 'border-hl-accent' : 'border-transparent hover:border-hl-primary/20'
              }`}
            >
              <Image
                src={img}
                alt={`${title} miniatura ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
