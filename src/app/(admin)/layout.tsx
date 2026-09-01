import '@/styles/admin.css';
import AdminSidebar from '@/components/admin/admin-sidebar';

export const metadata = {
  title: 'Panel Administrativo - Hecho Letras & KamCat',
  description: 'Gestión de pagos, pedidos y tracking',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
