'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  roles: string[];
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
  const pathname = usePathname();
  const userRole = 'admin_hl';

  const filteredItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

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

        <nav className="flex-1 p-4 space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-item ${
                pathname === item.href ? 'active' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
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
