'use server'

import { createClient } from '@/lib/supabase/server'
import type { AuthResponse, SignUpData } from '@/types/auth'
import { isValidEmail, isValidPassword, isValidFullName } from '@/lib/utils/validators'

export default async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    if (!data.email || !data.password || !data.fullName) {
      return { success: false, error: 'Email, contraseña y nombre completo son requeridos' }
    }

    if (!isValidEmail(data.email)) {
      return { success: false, error: 'El formato del email no es válido' }
    }

    if (!isValidPassword(data.password)) {
      return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' }
    }

    if (!isValidFullName(data.fullName)) {
      return { success: false, error: 'El nombre debe tener entre 2 y 100 caracteres' }
    }

    const supabase = await createClient()

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          full_name: data.fullName.trim(),
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!authData.user) {
      return { success: false, error: 'No se pudo crear el usuario' }
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: data.fullName.trim(),
        role: 'customer',
      })

    if (profileError) {
      return { success: false, error: 'Error al crear el perfil. Inténtalo de nuevo.' }
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
      error: error instanceof Error ? error.message : 'Error al registrar usuario',
    }
  }
}
