'use server';

import { createClient } from '@/lib/supabase/server';
import type { Order, SubOrder, OrderItem, Payment, PaymentSchedule, PaginatedResponse } from '@/types/admin';
import type {
  CreateOrderParams,
  OrderActionResponse,
  OrdersActionResponse,
} from '@/types/order';
import type { CartItemWithDetails } from '@/types/cart';
import { generateOrderNumber, calculateOrderTotal } from '@/lib/utils/order-helpers';
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

export async function createOrder(params: CreateOrderParams): Promise<OrderActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return { success: false, error: 'El carrito está vacío' };
    }

    const itemsWithDetails: CartItemWithDetails[] = await Promise.all(
      cartItems.map(async (item) => {
        let itemName = '';
        let itemPrice = 0;
        let itemImage = '';
        let brand: 'hl' | 'kc' = 'kc';

        if (item.item_type === 'book') {
          const { data: book } = await supabase
            .from('books')
            .select('name, price, image, brand')
            .eq('id', item.item_id)
            .single();

          if (book) {
            itemName = book.name;
            itemPrice = book.price;
            itemImage = book.image;
            brand = book.brand || 'hl';
          }
        } else {
          const { data: product } = await supabase
            .from('products')
            .select('name, price, images')
            .eq('id', item.item_id)
            .single();

          if (product) {
            itemName = product.name;
            itemPrice = product.price;
            itemImage = product.images?.[0] || '';
            brand = 'kc';
          }
        }

        const extrasTotal = (item.extras || []).reduce(
          (sum: number, extra: { price: number; quantity: number }) =>
            sum + extra.price * extra.quantity,
          0
        );
        const subtotal = (itemPrice + extrasTotal) * item.quantity;

        return {
          ...item,
          item_name: itemName,
          item_price: itemPrice,
          item_image: itemImage,
          brand,
          subtotal,
        };
      })
    );

    const brands = [...new Set(itemsWithDetails.map((item) => item.brand))];
    const itemsSubtotal = itemsWithDetails.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingCost = 0;
    const totalAmount = calculateOrderTotal(itemsSubtotal, shippingCost);

    const { count: orderCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const orderNumber = generateOrderNumber(brands, (orderCount || 0) + 1);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'pending_payment',
        total_amount: totalAmount,
        shipping_cost: shippingCost,
        shipping_method: params.shipping_method,
        shipping_address: params.shipping_address,
        payment_method: params.payment_method,
        payment_status: 'pending',
        notes: params.notes || null,
      })
      .select()
      .single();

    if (orderError) {
      return { success: false, error: 'Error al crear la orden' };
    }

    const brandGroups = new Map<'hl' | 'kc', CartItemWithDetails[]>();
    for (const item of itemsWithDetails) {
      const existing = brandGroups.get(item.brand) || [];
      existing.push(item);
      brandGroups.set(item.brand, existing);
    }

    const subOrders = [];
    for (const [brand, brandItems] of brandGroups) {
      const brandSubtotal = brandItems.reduce((sum, item) => sum + item.subtotal, 0);
      const subOrderNumber = `${orderNumber}-${brand.toUpperCase()}`;

      const { data: subOrder, error: subOrderError } = await supabase
        .from('sub_orders')
        .insert({
          order_id: order.id,
          brand,
          order_number: subOrderNumber,
          status: 'pending_payment',
          subtotal: brandSubtotal,
        })
        .select()
        .single();

      if (subOrderError) {
        return { success: false, error: 'Error al crear sub-órdenes' };
      }

      for (const item of brandItems) {
        const { error: itemError } = await supabase.from('order_items').insert({
          sub_order_id: subOrder.id,
          item_type: item.item_type,
          item_id: item.item_id,
          item_name: item.item_name,
          item_price: item.item_price,
          quantity: item.quantity,
          extras: item.extras,
          customization: item.customization,
          subtotal: item.subtotal,
        });

        if (itemError) {
          return { success: false, error: 'Error al crear ítems de la orden' };
        }
      }

      subOrders.push({ ...subOrder, items: [] });
    }

    if (params.payment_method === 'installments') {
      const hasBooks = itemsWithDetails.some((item) => item.item_type === 'book');
      if (hasBooks) {
        const schedule = calculateInstallments({
          total: totalAmount,
          num_installments: 3,
          order_date: new Date().toISOString(),
        });

        for (const installment of schedule) {
          await supabase.from('payment_schedules').insert({
            order_id: order.id,
            installment_number: installment.installment_number,
            amount: installment.amount,
            due_date: installment.due_date,
            status: 'pending',
          });
        }
      }
    }

    await supabase.from('cart_items').delete().eq('user_id', user.id);

    return {
      success: true,
      data: {
        ...order,
        sub_orders: subOrders,
      },
    };
  } catch {
    return { success: false, error: 'Error al crear la orden' };
  }
}

export async function getOrder(orderId: string): Promise<OrderActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error || !order) {
      return { success: false, error: 'Orden no encontrada' };
    }

    const { data: subOrders } = await supabase
      .from('sub_orders')
      .select('*')
      .eq('order_id', orderId);

    const subOrdersWithItems = await Promise.all(
      (subOrders || []).map(async (subOrder) => {
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('sub_order_id', subOrder.id);

        return { ...subOrder, items: items || [] };
      })
    );

    return {
      success: true,
      data: { ...order, sub_orders: subOrdersWithItems },
    };
  } catch {
    return { success: false, error: 'Error al consultar la orden' };
  }
}

export async function getOrders(
  page: number = 1,
  pageSize: number = 20
): Promise<OrdersActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: orders, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return { success: false, error: 'Error al consultar órdenes' };
    }

    return {
      success: true,
      data: {
        orders: orders || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };
  } catch {
    return { success: false, error: 'Error al consultar órdenes' };
  }
}
