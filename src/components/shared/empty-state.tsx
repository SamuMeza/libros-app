import Link from 'next/link';

interface EmptyStateProps {
  message: string;
  suggestions?: string[];
  action?: { label: string; href: string };
}

export default function EmptyState({ message, suggestions, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hl-primary/20 bg-hl-secondary/5 px-8 py-16 text-center">
      <svg className="mb-4 h-16 w-16 text-hl-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 className="text-lg font-semibold text-hl-primary">No se encontraron libros</h3>
      <p className="mt-2 max-w-md text-sm text-hl-primary/60">{message}</p>
      {suggestions && suggestions.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-hl-primary/50">
          {suggestions.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      )}
      {action && (
        <Link
          href={action.href}
          className="mt-6 rounded-lg bg-hl-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-hl-accent/90"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
