'use server';

import { createClient } from '@/lib/supabase/server';
import type { 
  Payment, 
  PaymentFilters, 
  PaginatedResponse,
  SubOrder 
} from '@/types/admin';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getAdminPayments(
  filters: PaymentFilters
): Promise<ActionResult<PaginatedResponse<Payment>>> {
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

    const adminBrand = profile.role === 'admin_hl' ? 'hl' : profile.role === 'admin_kc' ? 'kc' : null;

    let query = supabase
      .from('payments')
      .select('*, sub_orders!inner(id, brand, order_id, orders!inner(user_id, profiles!inner(full_name, phone)))', { count: 'exact' });

    if (adminBrand) {
      query = query.eq('sub_orders.brand', adminBrand);
    }

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.method !== 'all') {
      query = query.eq('method', filters.method);
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    const offset = (filters.page - 1) * filters.limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + filters.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return { success: false, error: 'Error al obtener pagos' };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / filters.limit);

    const payments = (data || []).map((p: Record<string, unknown>) => {
      const subOrders = p.sub_orders as Record<string, unknown> | null;
      const orders = subOrders?.orders as Record<string, unknown> | null;
      const profiles = orders?.profiles as Record<string, unknown> | null;
      return {
        ...p,
        customer_name: profiles?.full_name ?? null,
        customer_phone: profiles?.phone ?? null,
        sub_orders: undefined,
      };
    });

    return {
      success: true,
      data: {
        data: payments,
        total,
        page: filters.page,
        totalPages,
      },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function approvePayment(
  paymentId: string
): Promise<ActionResult<{ payment: Payment; subOrder: SubOrder }>> {
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

    const adminBrand = profile.role === 'admin_hl' ? 'hl' : profile.role === 'admin_kc' ? 'kc' : null;

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*, sub_orders(id, brand, order_id)')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return { success: false, error: 'Pago no encontrado' };
    }

    if (payment.status !== 'pending') {
      return { success: false, error: 'Este pago ya fue verificado' };
    }

    const subOrderData = payment.sub_orders as { id: string; brand: string; order_id: string } | null;
    if (!subOrderData) {
      return { success: false, error: 'No se encontró la sub-orden asociada al pago' };
    }

    if (adminBrand && subOrderData.brand !== adminBrand) {
      return { success: false, error: 'No tiene permisos para verificar pagos de otra marca' };
    }

    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'verified',
        verified_by: user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: 'Error al actualizar pago' };
    }

    const { data: updatedSubOrder, error: subOrderError } = await supabase
      .from('sub_orders')
      .update({ status: 'payment_verified' })
      .eq('id', subOrderData.id)
      .select()
      .single();

    if (subOrderError) {
      return { success: false, error: 'Error al actualizar sub-orden' };
    }

    return {
      success: true,
      data: {
        payment: updatedPayment,
        subOrder: updatedSubOrder,
      },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function rejectPayment(
  paymentId: string,
  reason: string
): Promise<ActionResult<{ payment: Payment }>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    if (!reason || reason.trim().length < 5) {
      return { success: false, error: 'El motivo es requerido (mínimo 5 caracteres)' };
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return { success: false, error: 'Pago no encontrado' };
    }

    if (payment.status !== 'pending') {
      return { success: false, error: 'Este pago ya fue verificado' };
    }

    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({ 
        status: 'rejected',
        notes: reason,
        verified_by: user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: 'Error al actualizar pago' };
    }

    return {
      success: true,
      data: { payment: updatedPayment },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}
