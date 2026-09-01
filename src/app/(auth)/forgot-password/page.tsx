'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthForm from '@/components/auth/auth-form'
import LoadingOverlay from '@/components/auth/loading-overlay'
import resetPassword from '@/lib/actions/reset-password'
import { isValidEmail } from '@/lib/utils/validators'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError('El email es requerido')
      return
    }

    if (!isValidEmail(email)) {
      setError('El formato del email no es válido')
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword({ email })

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Error al enviar email de recuperación')
      }
    } catch {
      setError('Error al conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <AuthForm title="Email Enviado">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-green-100">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-600">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
          <Link
            href="/login"
            className="inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </AuthForm>
    )
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />
      <AuthForm title="Recuperar Contraseña">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="text-sm text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
              placeholder="tu@email.com"
              autoComplete="email"
              aria-label="Email"
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundColor: 'var(--hl-primary)',
              color: 'var(--text-on-dark)',
              borderRadius: 'var(--radius-lg)',
              height: '2.75rem',
            }}
            aria-label="Enviar enlace de recuperación"
          >
            {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Recuerdas tu contraseña?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </AuthForm>
    </>
  )
}
