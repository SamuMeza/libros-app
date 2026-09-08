import { getDashboardStats } from '@/lib/actions/admin/dashboard';
import { SUB_ORDER_STATUS_LABELS } from '@/types/admin';
import type { SubOrderStatus } from '@/types/admin';

export default async function AdminDashboardPage() {
  const result = await getDashboardStats();

  if (!result.success || !result.data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  const stats = result.data;

  const statCards = [
    { label: 'Total Pedidos', value: stats.totalOrders, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Pagos Pendientes', value: stats.pendingPayments, color: 'bg-yellow-500/10 text-yellow-600' },
    { label: 'Ingresos Totales', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'bg-green-500/10 text-green-600' },
    { label: 'Órdenes Activas', value: stats.activeOrders, color: 'bg-purple-500/10 text-purple-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-lg p-4 ${card.color}`}>
            <p className="text-sm opacity-80">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-4">Pedidos Recientes</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-slate-500">No hay pedidos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Nº Orden</th>
                  <th className="pb-2 font-medium">Marca</th>
                  <th className="pb-2 font-medium">Estado</th>
                  <th className="pb-2 font-medium text-right">Subtotal</th>
                  <th className="pb-2 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-2 font-mono text-xs">{order.order_number}</td>
                    <td className="py-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        order.brand === 'hl' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {order.brand.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2">
                      {SUB_ORDER_STATUS_LABELS[order.status as SubOrderStatus] || order.status}
                    </td>
                    <td className="py-2 text-right">${order.subtotal.toFixed(2)}</td>
                    <td className="py-2 text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('es-VE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
