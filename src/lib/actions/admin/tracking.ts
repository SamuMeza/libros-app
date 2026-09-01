'use server';

import { createClient } from '@/lib/supabase/server';
import type { TrackingNote } from '@/types/admin';

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function addTrackingNote(
  subOrderId: string,
  location: string,
  note: string
): Promise<ActionResult<{ trackingNote: TrackingNote }>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    if (!location || location.trim().length < 2) {
      return { success: false, error: 'La ubicación es requerida (mínimo 2 caracteres)' };
    }

    const { data: trackingNote, error } = await supabase
      .from('tracking_notes')
      .insert({
        sub_order_id: subOrderId,
        location: location.trim(),
        note: note?.trim() || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Error al crear nota de tracking' };
    }

    return {
      success: true,
      data: { trackingNote },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}

export async function getTrackingNotes(
  subOrderId: string
): Promise<ActionResult<{ notes: TrackingNote[] }>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Debe iniciar sesión' };
    }

    const { data: notes, error } = await supabase
      .from('tracking_notes')
      .select('*')
      .eq('sub_order_id', subOrderId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: 'Error al obtener notas de tracking' };
    }

    return {
      success: true,
      data: { notes: notes || [] },
    };
  } catch {
    return { success: false, error: 'Error interno del servidor' };
  }
}
