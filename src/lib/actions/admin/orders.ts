'use server';

import { createClient } from '@/lib/supabase/server';
import type { 
  SubOrder, 
  OrderItem, 
  Payment, 
  TrackingNote,
  OrderFilters,
  PaginatedResponse,
  AdminOrderDetail,
  AdminProfile,
  Address
} from '@/types/admin';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getAdminOrders(
  filters: OrderFilters
): Promise<ActionResult<PaginatedResponse<SubOrder>>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin_hl', 'admin_kc', 'superadmin'].includes(profile.role)) {
      return { success: false, error: 'No tiene permisos para esta acción' };
    }

    let query = supabase
      .from('sub_orders')
      .select('*', { count: 'exact' });

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const offset = (filters.page - 1) * filters.limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + filters.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return { success: false, error: 'Error al obtener pedidos' };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / filters.limit);

    return {
      success: true,
      data: {
        data: data || [],
        total,
        page: filters.page,
        totalPages,
      },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function getAdminOrder(
  orderId: string
): Promise<ActionResult<AdminOrderDetail>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    const { data: subOrder, error: subOrderError } = await supabase
      .from('sub_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (subOrderError || !subOrder) {
      return { success: false, error: 'Sub-orden no encontrada' };
    }

    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('sub_order_id', orderId);

    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', subOrder.order_id)
      .order('created_at', { ascending: false });

    const { data: trackingNotes } = await supabase
      .from('tracking_notes')
      .select('*')
      .eq('sub_order_id', orderId)
      .order('created_at', { ascending: false });

    const { data: order } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', subOrder.order_id)
      .single();

    let client: AdminProfile | null = null;
    let address: Address | null = null;

    if (order) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', order.user_id)
        .single();

      client = profile;

      const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', order.user_id)
        .eq('is_default', true)
        .single();

      address = addressData;
    }

    return {
      success: true,
      data: {
        subOrder,
        items: items || [],
        payments: payments || [],
        trackingNotes: trackingNotes || [],
        client: client as AdminProfile,
        address,
      },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: SubOrder['status']
): Promise<ActionResult<{ subOrder: SubOrder }>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    const { data: subOrder, error: fetchError } = await supabase
      .from('sub_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !subOrder) {
      return { success: false, error: 'Sub-orden no encontrada' };
    }

    const allowedTransitions: Record<string, string[]> = {
      pending_payment: ['payment_verified', 'cancelled'],
      payment_verified: ['preparing', 'cancelled'],
      preparing: ['shipped', 'cancelled'],
      shipped: ['in_transit', 'cancelled'],
      in_transit: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[subOrder.status]?.includes(status)) {
      return { success: false, error: 'Transición de estado no permitida' };
    }

    const { data: updatedSubOrder, error: updateError } = await supabase
      .from('sub_orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: 'Error al actualizar estado' };
    }

    return {
      success: true,
      data: { subOrder: updatedSubOrder },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}
