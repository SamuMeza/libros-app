'use server'

import { createClient } from '@/lib/supabase/server'
import type { ResetPasswordData } from '@/types/auth'
import { isValidEmail } from '@/lib/utils/validators'

export default async function resetPassword(data: ResetPasswordData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.email) {
      return { success: false, error: 'El email es requerido' }
    }

    if (!isValidEmail(data.email)) {
      return { success: false, error: 'El formato del email no es válido' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(data.email.trim().toLowerCase(), {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al enviar email de recuperación',
    }
  }
}
