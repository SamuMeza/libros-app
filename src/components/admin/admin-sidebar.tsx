'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types/auth';

interface NavItem {
  label: string;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', roles: ['admin_hl', 'admin_kc', 'superadmin'] },
  { label: 'Libros', href: '/admin/libros', roles: ['admin_hl', 'superadmin'] },
  { label: 'Productos', href: '/admin/productos', roles: ['admin_kc', 'superadmin'] },
  { label: 'Pedidos', href: '/admin/pedidos', roles: ['admin_hl', 'admin_kc', 'superadmin'] },
  { label: 'Pagos', href: '/admin/pagos', roles: ['admin_hl', 'admin_kc', 'superadmin'] },
  { label: 'Solicitudes', href: '/admin/solicitudes', roles: ['admin_hl', 'superadmin'] },
  { label: 'Reportes', href: '/admin/reportes', roles: ['superadmin'] },
  { label: 'Usuarios', href: '/admin/usuarios', roles: ['superadmin'] },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          .then(({ data: profile }) => {
            setUserRole((profile?.role as UserRole) ?? null);
          });
      }
    });
  }, []);

  const filteredItems = userRole
    ? navItems.filter(item => item.roles.includes(userRole))
    : [];

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const getLabel = (item: NavItem) => {
    if (item.label === 'Pedidos' || item.label === 'Pagos') {
      if (userRole === 'admin_hl') return `${item.label} (HL)`;
      if (userRole === 'admin_kc') return `${item.label} (KC)`;
    }
    return item.label;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden admin-button admin-button-ghost"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-bold text-white">
            Panel Administrativo
          </h1>
          <p className="text-sm text-slate-400">
            Hecho Letras & KamCat
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1" aria-label="Navegación administrativa">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-item ${
                pathname === item.href ? 'active' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {getLabel(item)}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="admin-sidebar-item"
          >
            Volver a la tienda
          </Link>
        </div>
      </aside>
    </>
  );
}
