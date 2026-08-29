'use server';

import { createClient } from '@/lib/supabase/server';
import type { BookWithCategory } from '@/types/books';

export default async function getBookBySlug(slug: string): Promise<BookWithCategory | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('books')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Error al obtener libro: ${error.message}`);
  }

  return data;
}
