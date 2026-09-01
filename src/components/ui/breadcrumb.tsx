import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-hl-primary/60">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {idx > 0 && <span className="text-hl-primary/30">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-hl-accent transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-hl-primary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
