'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import submitBookRequest from '@/lib/actions/submit-book-request';

const MAX_MESSAGE_LENGTH = 500;

interface FormState {
  book_title: string;
  book_author: string;
  requester_name: string;
  email: string;
  phone: string;
  message: string;
}

const INITIAL_STATE: FormState = {
  book_title: '',
  book_author: '',
  requester_name: '',
  email: '',
  phone: '',
  message: '',
};

export default function BookRequestForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: { data: { user: { email?: string; user_metadata?: Record<string, unknown> } | null } }) => {
      if (data.user) {
        const fullName = [data.user.user_metadata?.full_name, data.user.user_metadata?.name]
          .filter(Boolean)
          .join(' ')
          .trim();
        const email = data.user.email ?? '';
        setForm((prev) => ({
          ...prev,
          requester_name: prev.requester_name || fullName,
          email: prev.email || email,
        }));
      }
    });
  }, []);

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.book_title.trim()) {
      newErrors.book_title = 'El título del libro es obligatorio';
    }
    if (!form.requester_name.trim()) {
      newErrors.requester_name = 'Tu nombre es obligatorio';
    }
    if (!form.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    if (form.message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setServerError('');

    const result = await submitBookRequest({
      book_title: form.book_title,
      book_author: form.book_author || undefined,
      requester_name: form.requester_name || undefined,
      email: form.email,
      phone: form.phone || undefined,
      message: form.message || undefined,
    });

    if (result.success) {
      setStatus('success');
      setForm(INITIAL_STATE);
    } else {
      setStatus('error');
      setServerError(result.error ?? 'No pudimos enviar tu solicitud. Por favor, verifica los datos e intenta de nuevo.');
    }
  }

  function handleRetry() {
    setStatus('idle');
    setServerError('');
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-center">
        <p className="text-sm font-medium text-green-800">¡Solicitud enviada correctamente!</p>
        <p className="mt-1 text-xs text-green-600">Te contactaremos pronto.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-3 text-xs text-green-700 underline hover:text-green-900"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="book_title" className="block text-sm font-medium text-hl-primary">
          Título del libro <span className="text-red-500">*</span>
        </label>
        <input
          id="book_title"
          type="text"
          value={form.book_title}
          onChange={(e) => setForm({ ...form, book_title: e.target.value })}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.book_title ? 'border-red-500 focus:ring-red-500/30' : 'border-hl-primary/20 focus:border-hl-accent focus:ring-hl-accent/30'
          }`}
          placeholder="Ej: Cien años de soledad"
        />
        {errors.book_title && <p className="mt-1 text-xs text-red-600">{errors.book_title}</p>}
      </div>

      <div>
        <label htmlFor="book_author" className="block text-sm font-medium text-hl-primary">
          Autor
        </label>
        <input
          id="book_author"
          type="text"
          value={form.book_author}
          onChange={(e) => setForm({ ...form, book_author: e.target.value })}
          className="mt-1 w-full rounded-lg border border-hl-primary/20 px-3 py-2 text-sm focus:border-hl-accent focus:outline-none focus:ring-1 focus:ring-hl-accent/30"
          placeholder="Ej: Gabriel García Márquez"
        />
      </div>

      <div>
        <label htmlFor="requester_name" className="block text-sm font-medium text-hl-primary">
          Tu nombre <span className="text-red-500">*</span>
        </label>
        <input
          id="requester_name"
          type="text"
          value={form.requester_name}
          onChange={(e) => setForm({ ...form, requester_name: e.target.value })}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.requester_name ? 'border-red-500 focus:ring-red-500/30' : 'border-hl-primary/20 focus:border-hl-accent focus:ring-hl-accent/30'
          }`}
          placeholder="Ej: María García"
        />
        {errors.requester_name && <p className="mt-1 text-xs text-red-600">{errors.requester_name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-hl-primary">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-hl-primary/20 focus:border-hl-accent focus:ring-hl-accent/30'
          }`}
          placeholder="tu@email.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-hl-primary">
          Teléfono / WhatsApp
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-1 w-full rounded-lg border border-hl-primary/20 px-3 py-2 text-sm focus:border-hl-accent focus:outline-none focus:ring-1 focus:ring-hl-accent/30"
          placeholder="+58 XXX-XXXXXXX"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-hl-primary">
          Mensaje adicional
        </label>
        <textarea
          id="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
            errors.message ? 'border-red-500 focus:ring-red-500/30' : 'border-hl-primary/20 focus:border-hl-accent focus:ring-hl-accent/30'
          }`}
          placeholder="Cualquier información adicional sobre el libro que buscas..."
        />
        <div className="mt-1 flex justify-between text-xs">
          {errors.message ? (
            <span className="text-red-600">{errors.message}</span>
          ) : (
            <span />
          )}
          <span className={form.message.length > MAX_MESSAGE_LENGTH ? 'text-red-600' : 'text-hl-primary/40'}>
            {form.message.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </div>

      {serverError && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-700">{serverError}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-2 text-xs font-medium text-red-800 underline hover:text-red-900"
          >
            Reintentar envío
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-lg bg-hl-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-hl-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'submitting' ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
