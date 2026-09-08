'use server';

import { createClient } from '@/lib/supabase/server';
import type { Order, SubOrder, OrderItem, Payment, PaymentSchedule, PaginatedResponse } from '@/types/admin';
import { calculateInstallments } from '@/lib/utils/payment-helpers';

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

export async function createOrder(params: {
  shipping_address: any;
  shipping_method: 'mrw' | 'zoom';
  payment_method: 'pago_movil' | 'binance' | 'installments';
  installments?: number;
}): Promise<ActionResult<Order>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión para crear una orden' };
    }

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return { success: false, error: 'El carrito está vacío' };
    }

    // Calcular subtotales por tipo
    let hlSubtotal = 0;
    let kcSubtotal = 0;
    const enrichedItems: Array<{
      item_type: 'book' | 'product';
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
      brand: 'hl' | 'kc';
      extras?: any;
      customization?: any;
    }> = [];

    for (const item of cartItems) {
      if (item.item_type === 'book') {
        const { data: book } = await supabase
          .from('books')
          .select('title, price, stock_status')
          .eq('id', item.item_id)
          .single();
        const price = book?.price || 0;

        if (book?.stock_status !== 'available' && book?.stock_status !== 'in_stock') {
          return { success: false, error: `El libro "${book?.title || 'Desconocido'}" no está disponible actualmente` };
        }

        const subtotal = price * item.quantity;
        hlSubtotal += subtotal;
        enrichedItems.push({
          item_type: 'book',
          item_id: item.item_id,
          item_name: book?.title || 'Libro',
          price,
          quantity: item.quantity,
          brand: 'hl',
          extras: item.extras || [],
        });
      } else {
        const { data: product } = await supabase
          .from('products')
          .select('name, price')
          .eq('id', item.item_id)
          .single();
        const price = product?.price || 0;
        const subtotal = price * item.quantity;
        kcSubtotal += subtotal;
        enrichedItems.push({
          item_type: 'product',
          item_id: item.item_id,
          item_name: product?.name || 'Producto',
          price,
          quantity: item.quantity,
          brand: 'kc',
          customization: item.customization || {},
        });
      }
    }

    const rawTotal = hlSubtotal + kcSubtotal;

    // Calcular costo de envío
    const { data: shippingConfig } = await supabase
      .from('shipping_config')
      .select('*')
      .eq('method', params.shipping_method)
      .single();

    let shippingCost = 0;
    if (shippingConfig) {
      shippingCost = shippingConfig.base_cost || 0;
    }

    const finalTotal = params.payment_method === 'binance'
      ? Math.round((rawTotal + shippingCost) * 0.95 * 100) / 100
      : rawTotal + shippingCost;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Crear orden maestra
    const { data: newOrder, error: orderInsertError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'pending_payment',
        total_amount: finalTotal,
        shipping_cost: shippingCost,
        shipping_method: params.shipping_method,
        shipping_address: params.shipping_address,
        payment_method: params.payment_method,
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderInsertError || !newOrder) {
      return { success: false, error: 'Error al crear la orden maestra' };
    }

    // Crear sub-órdenes si aplica
    if (hlSubtotal > 0) {
      const { data: hlSubOrder } = await supabase
        .from('sub_orders')
        .insert({
          order_id: newOrder.id,
          brand: 'hl',
          order_number: `${orderNumber}-HL`,
          status: 'pending_payment',
          subtotal: hlSubtotal,
        })
        .select()
        .single();

      if (hlSubOrder) {
        const hlItems = enrichedItems.filter((i) => i.brand === 'hl');
        for (const item of hlItems) {
          await supabase.from('order_items').insert({
            sub_order_id: hlSubOrder.id,
            item_type: item.item_type,
            item_id: item.item_id,
            item_name: item.item_name,
            quantity: item.quantity,
            item_price: item.price,
            subtotal: item.price * item.quantity,
            extras: item.extras,
          });
        }
      }
    }

    if (kcSubtotal > 0) {
      const { data: kcSubOrder } = await supabase
        .from('sub_orders')
        .insert({
          order_id: newOrder.id,
          brand: 'kc',
          order_number: `${orderNumber}-KC`,
          status: 'pending_payment',
          subtotal: kcSubtotal,
        })
        .select()
        .single();

      if (kcSubOrder) {
        const kcItems = enrichedItems.filter((i) => i.brand === 'kc');
        for (const item of kcItems) {
          await supabase.from('order_items').insert({
            sub_order_id: kcSubOrder.id,
            item_type: item.item_type,
            item_id: item.item_id,
            item_name: item.item_name,
            quantity: item.quantity,
            item_price: item.price,
            subtotal: item.price * item.quantity,
            customization: item.customization,
          });
        }
      }
    }

    // Generar cronograma de cuotas para pagos a plazos
    if (params.payment_method === 'installments' && params.installments && params.installments >= 2) {
      const { data: installmentConfig } = await supabase
        .from('installment_config')
        .select('*')
        .single();

      const config = installmentConfig
        ? {
            min_installments: installmentConfig.min_installments,
            max_installments: installmentConfig.max_installments,
            fortnight_days: installmentConfig.fortnight_days,
          }
        : undefined;

      const schedule = calculateInstallments(finalTotal, params.installments, new Date().toISOString().split('T')[0], config);
      const scheduleInserts = schedule.map((s) => ({
        order_id: newOrder.id,
        installment_number: s.installment_number,
        amount: s.amount,
        due_date: s.due_date,
        status: 'pending' as const,
        payment_id: null,
      }));

      const { error: scheduleError } = await supabase
        .from('payment_schedules')
        .insert(scheduleInserts);

      if (scheduleError) {
        return { success: false, error: 'Error al crear el calendario de cuotas' };
      }
    }

    // Vaciar carrito
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    return {
      success: true,
      data: newOrder,
    };
  } catch {
    return { success: false, error: 'Error interno del servidor al procesar la orden' };
  }
}
