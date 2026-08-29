'use server'

import { createClient } from '@/lib/supabase/server'
import type { AuthResponse, SignInData } from '@/types/auth'
import { isValidEmail } from '@/lib/utils/validators'

export default async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    if (!data.email || !data.password) {
      return { success: false, error: 'Email y contraseña son requeridos' }
    }

    if (!isValidEmail(data.email)) {
      return { success: false, error: 'El formato del email no es válido' }
    }

    const supabase = await createClient()

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al iniciar sesión',
    }
  }
}
