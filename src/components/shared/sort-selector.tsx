'use client';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectorProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

const defaultOptions: SortOption[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Novedades' },
  { value: 'alpha', label: 'A-Z' },
];

export default function SortSelector({
  options = defaultOptions,
  value,
  onChange,
}: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-selector" className="text-sm text-muted-foreground">
        Ordenar por:
      </label>
      <select
        id="sort-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-[var(--kc-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--kc-primary)]"
        aria-label="Ordenar productos"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
