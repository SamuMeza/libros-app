'use client';

import { useState, useCallback } from 'react';
import Toast from './toast';
import type { ToastVariant } from '@/types';

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  duration: number;
}

const MAX_VISIBLE = 3;

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (variant: ToastVariant, message: string, duration = 5000) => {
      const id = `toast-${++toastIdCounter}`;
      setToasts((prev) => {
        const updated = [...prev, { id, variant, message, duration }];
        return updated.slice(-MAX_VISIBLE);
      });
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed z-60 flex flex-col gap-2"
      style={{ top: '5rem', right: 'var(--space-4)' }}
      aria-live="polite"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
