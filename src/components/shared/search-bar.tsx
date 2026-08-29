'use client';

import { useState, useEffect, useCallback } from 'react';

interface SearchBarProps {
  value: string;
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onSearch, placeholder = 'Buscar libros...' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  const debouncedSearch = useCallback(
    debounce((term: string) => onSearch(term), 500),
    [onSearch]
  );

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  }

  function handleClear() {
    setInputValue('');
    onSearch('');
  }

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hl-primary/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Buscar libros"
        className="w-full rounded-lg border border-hl-primary/20 bg-white py-2 pl-10 pr-10 text-sm text-hl-primary placeholder-hl-primary/40 focus:border-hl-accent focus:outline-none focus:ring-1 focus:ring-hl-accent/30"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-hl-primary/40 hover:text-hl-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}
