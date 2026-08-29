'use server';

import { createServerClient } from '@/lib/supabase/server';
import type { ContactRequestCreate } from '@/types/books';

interface SubmitBookRequestResult {
  success: boolean;
  data?: { id: string };
  error?: string;
}

function validateContactRequest(data: ContactRequestCreate): string | null {
  if (!data.book_title || data.book_title.trim().length === 0) {
    return 'El título del libro es obligatorio';
  }
  if (!data.email || data.email.trim().length === 0) {
    return 'El email es obligatorio';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return 'El formato del email no es válido';
  }
  if (data.message && data.message.length > 500) {
    return 'El mensaje no puede exceder 500 caracteres';
  }
  return null;
}

export default async function submitBookRequest(data: ContactRequestCreate): Promise<SubmitBookRequestResult> {
  const validationError = validateContactRequest(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: result, error } = await supabase
    .from('contact_requests')
    .insert({
      book_title: data.book_title.trim(),
      book_author: data.book_author?.trim() || null,
      requester_name: data.requester_name?.trim() || null,
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      message: data.message?.trim() || null,
      user_id: user?.id ?? null,
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: `Error al enviar solicitud: ${error.message}` };
  }

  return { success: true, data: { id: result.id } };
}
