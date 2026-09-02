'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  CartItemWithDetails,
  AddToCartParams,
  UpdateCartItemParams,
  RemoveFromCartParams,
  CartActionResponse,
} from '@/types/cart';
import { calculateCartSummary } from '@/lib/utils/cart-helpers';

export async function getCart(): Promise<CartActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (error) {
      return { success: false, error: 'Error al consultar el carrito' };
    }

    const itemsWithDetails: CartItemWithDetails[] = await Promise.all(
      (cartItems || []).map(async (item) => {
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

    const summary = calculateCartSummary(itemsWithDetails);

    return { success: true, data: summary };
  } catch {
    return { success: false, error: 'Error al consultar el carrito' };
  }
}

export async function addToCart(params: AddToCartParams): Promise<CartActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('item_type', params.item_type)
      .eq('item_id', params.item_id)
      .single();

    if (existingItem) {
      const newQuantity = existingItem.quantity + params.quantity;
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);

      if (updateError) {
        return { success: false, error: 'Error al actualizar el carrito' };
      }
    } else {
      const { error: insertError } = await supabase.from('cart_items').insert({
        user_id: user.id,
        item_type: params.item_type,
        item_id: params.item_id,
        quantity: params.quantity,
        extras: params.extras || [],
        customization: params.customization || {},
      });

      if (insertError) {
        return { success: false, error: 'Error al agregar al carrito' };
      }
    }

    return await getCart();
  } catch {
    return { success: false, error: 'Error al agregar al carrito' };
  }
}

export async function updateCartItem(params: UpdateCartItemParams): Promise<CartActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    if (params.quantity <= 0) {
      return await removeFromCart({ item_id: params.item_id });
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: params.quantity })
      .eq('user_id', user.id)
      .eq('item_id', params.item_id);

    if (error) {
      return { success: false, error: 'Error al actualizar el carrito' };
    }

    return await getCart();
  } catch {
    return { success: false, error: 'Error al actualizar el carrito' };
  }
}

export async function removeFromCart(params: RemoveFromCartParams): Promise<CartActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', params.item_id);

    if (error) {
      return { success: false, error: 'Error al eliminar del carrito' };
    }

    return await getCart();
  } catch {
    return { success: false, error: 'Error al eliminar del carrito' };
  }
}
