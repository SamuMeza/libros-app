'use server';

import { createClient } from '@/lib/supabase/server';
import type { Order, SubOrder, OrderItem, Payment, PaymentSchedule, PaginatedResponse } from '@/types/admin';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getClientOrders(
  options: { page?: number; limit?: number } = {}
): Promise<ActionResult<PaginatedResponse<Order & { subOrders: SubOrder[] }>>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const { data: orders, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { success: false, error: 'Error al obtener pedidos' };
    }

    const ordersWithSubOrders = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: subOrders } = await supabase
          .from('sub_orders')
          .select('*')
          .eq('order_id', order.id);

        return {
          ...order,
          subOrders: subOrders || [],
        };
      })
    );

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        data: ordersWithSubOrders,
        total,
        page,
        totalPages,
      },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function getClientOrderDetail(
  orderId: string
): Promise<ActionResult<{
  order: Order;
  subOrders: { hl: SubOrder | null; kc: SubOrder | null };
  items: OrderItem[];
  payments: Payment[];
  paymentSchedule?: PaymentSchedule[];
}>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return { success: false, error: 'Pedido no encontrado' };
    }

    const { data: hlSubOrder } = await supabase
      .from('sub_orders')
      .select('*')
      .eq('order_id', orderId)
      .eq('brand', 'hl')
      .single();

    const { data: kcSubOrder } = await supabase
      .from('sub_orders')
      .select('*')
      .eq('order_id', orderId)
      .eq('brand', 'kc')
      .single();

    const subOrderIds = [hlSubOrder?.id, kcSubOrder?.id].filter(Boolean);

    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .in('sub_order_id', subOrderIds);

    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    const { data: paymentSchedule } = await supabase
      .from('payment_schedules')
      .select('*')
      .eq('order_id', orderId)
      .order('installment_number');

    return {
      success: true,
      data: {
        order,
        subOrders: {
          hl: hlSubOrder,
          kc: kcSubOrder,
        },
        items: items || [],
        payments: payments || [],
        paymentSchedule: paymentSchedule || undefined,
      },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}
