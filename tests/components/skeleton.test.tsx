import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Skeleton, ProductCardSkeleton } from '@/components/shared/skeleton';

describe('Skeleton Component', () => {
  it('should render with default classes', () => {
    render(<Skeleton />);
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Skeleton className="h-4 w-32" />);
    const skeleton = document.querySelector('.h-4.w-32');
    expect(skeleton).toBeInTheDocument();
  });
});

describe('ProductCardSkeleton', () => {
  it('should render skeleton structure', () => {
    render(<ProductCardSkeleton />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render 3:4 aspect ratio by default', () => {
    render(<ProductCardSkeleton />);
    const aspectSkeleton = document.querySelector('.aspect-\\[3\\/4\\]');
    expect(aspectSkeleton).toBeInTheDocument();
  });

  it('should render 1:1 aspect ratio when specified', () => {
    render(<ProductCardSkeleton aspectRatio="1/1" />);
    const aspectSkeleton = document.querySelector('.aspect-\\[1\\/1\\]');
    expect(aspectSkeleton).toBeInTheDocument();
  });
});
