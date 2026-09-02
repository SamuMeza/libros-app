import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatCurrencyVes, convertUsdToVes } from '@/lib/utils/payment-helpers';
import { formatCartTotal, getBrandBadgeClass } from '@/lib/utils/cart-helpers';

export const metadata: Metadata = {
  title: 'Pedido Confirmado - Hecho Letras & KamCat',
  description: 'Tu pedido ha sido recibido exitosamente',
};

interface ConfirmationPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Pedido No Encontrado</h1>
        <p className="mb-6 text-muted-foreground">
          No se pudo encontrar la información de tu pedido.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[var(--hl-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Sesión Requerida</h1>
        <p className="mb-6 text-muted-foreground">
          Inicia sesión para ver los detalles de tu pedido.
        </p>
        <Link
          href="/login"
          className="rounded-lg bg-[var(--hl-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (!order) {
    return (
      <div className="mx-auto max-w-[600px] px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Pedido No Encontrado</h1>
        <p className="mb-6 text-muted-foreground">
          El pedido que buscas no existe o no tienes permisos para verlo.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[var(--hl-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const { data: subOrders } = await supabase
    .from('sub_orders')
    .select('*')
    .eq('order_id', orderId);

  const vesAmount = convertUsdToVes(order.total_amount);

  return (
    <div className="mx-auto max-w-[800px] px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">¡Pedido Confirmado!</h1>
        <p className="text-muted-foreground">
          Tu pedido ha sido recibido y está siendo procesado
        </p>
      </div>

      <div className="rounded-xl border border-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pedido #{order.order_number}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('es-VE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            Pendiente de Pago
          </span>
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Dirección de Envío</h3>
            <div className="text-sm text-foreground">
              <p>{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.address}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
              <p>{order.shipping_address.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Método de Pago</h3>
            <div className="text-sm text-foreground">
              <p className="capitalize">
                {order.payment_method === 'pago_movil'
                  ? 'Pago Móvil'
                  : order.payment_method === 'binance'
                  ? 'Binance'
                  : 'Plan de Pagos'}
              </p>
              <p className="mt-2 font-semibold">
                Total: {formatCartTotal(order.total_amount)}
              </p>
              {order.payment_method === 'pago_movil' && (
                <p className="text-muted-foreground">
                  Equivalente: {formatCurrencyVes(vesAmount)}
                </p>
              )}
            </div>
          </div>
        </div>

        {subOrders && subOrders.length > 0 && (
          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Sub-Órdenes</h3>
            <div className="space-y-2">
              {subOrders.map((subOrder) => (
                <div
                  key={subOrder.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBrandBadgeClass(subOrder.brand)}`}
                    >
                      {subOrder.brand === 'hl' ? 'Hecho Letras' : 'KamCat'}
                    </span>
                    <span className="text-sm text-foreground">{subOrder.order_number}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatCartTotal(subOrder.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
        <h3 className="mb-2 font-medium text-foreground">Próximos Pasos</h3>
        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
          <li>Realiza el pago según el método seleccionado</li>
          <li>Sube tu comprobante de pago en la sección de pagos</li>
          <li>Espera la verificación del administrador</li>
          <li>Recibe tu pedido en la dirección indicada</li>
        </ol>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="/pedidos"
          className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Ver Mis Pedidos
        </Link>
        <Link
          href="/libros"
          className="rounded-lg bg-[var(--hl-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90"
        >
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
}
