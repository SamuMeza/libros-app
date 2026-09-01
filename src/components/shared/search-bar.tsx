'use client';

import { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  defaultValue?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBar({
  defaultValue = '',
  onSearch,
  placeholder = 'Buscar productos...',
  debounceMs = 100,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const debouncedSearch = useCallback(
    (searchValue: string) => {
      const timer = setTimeout(() => {
        onSearch(searchValue);
      }, debounceMs);
      return () => clearTimeout(timer);
    },
    [onSearch, debounceMs]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(value);
    return cleanup;
  }, [value, debouncedSearch]);

  return (
    <div className="relative">
      <label htmlFor="search-products" className="sr-only">
        {placeholder}
      </label>
      <input
        id="search-products"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-4 py-2 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kc-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--kc-primary)]"
        aria-label={placeholder}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
