import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

interface ProductCardSkeletonProps {
  aspectRatio?: '3/4' | '1/1';
}

export function ProductCardSkeleton({ aspectRatio = '3/4' }: ProductCardSkeletonProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <Skeleton className={`aspect-[${aspectRatio}] w-full`} />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
}
