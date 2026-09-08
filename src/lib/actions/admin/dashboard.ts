'use server';

import { createClient } from '@/lib/supabase/server';
import type { SubOrder, Payment } from '@/types/admin';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export interface DashboardStats {
  totalOrders: number;
  pendingPayments: number;
  totalRevenue: number;
  activeOrders: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Array<{
    id: string;
    order_number: string;
    brand: string;
    status: string;
    subtotal: number;
    created_at: string;
  }>;
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
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

    let subOrderQuery = supabase
      .from('sub_orders')
      .select('*');

    if (adminBrand) {
      subOrderQuery = subOrderQuery.eq('brand', adminBrand);
    }

    const { data: subOrders } = await subOrderQuery;

    const totalOrders = subOrders?.length || 0;

    const ordersByStatus: Record<string, number> = {};
    let activeOrders = 0;
    let pendingPayments = 0;
    let totalRevenue = 0;

    for (const so of subOrders || []) {
      ordersByStatus[so.status] = (ordersByStatus[so.status] || 0) + 1;

      if (['preparing', 'shipped', 'in_transit'].includes(so.status)) {
        activeOrders++;
      }

      if (so.status === 'pending_payment') {
        pendingPayments++;
      }

      if (['payment_verified', 'preparing', 'shipped', 'in_transit', 'delivered'].includes(so.status)) {
        totalRevenue += so.subtotal;
      }
    }

    let recentQuery = supabase
      .from('sub_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (adminBrand) {
      recentQuery = recentQuery.eq('brand', adminBrand);
    }

    const { data: recentOrders } = await recentQuery;

    return {
      success: true,
      data: {
        totalOrders,
        pendingPayments,
        totalRevenue,
        activeOrders,
        ordersByStatus,
        recentOrders: (recentOrders || []).map((so) => ({
          id: so.id,
          order_number: so.order_number,
          brand: so.brand,
          status: so.status,
          subtotal: so.subtotal,
          created_at: so.created_at,
        })),
      },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}
