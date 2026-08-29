'use server';

import { createServerClient } from '@/lib/supabase/server';
import type { BookExtraWithProduct } from '@/types/books';

export default async function getBookExtras(bookId: string): Promise<BookExtraWithProduct[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('book_extras')
    .select('*, products(id, name, price, images)')
    .eq('book_id', bookId)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Error al obtener extras: ${error.message}`);
  }

  return data ?? [];
}
