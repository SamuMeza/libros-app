import { useEffect } from 'react';
import type { ToastProps, ToastVariant } from '@/types';

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

export default function Toast({ variant, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-lg ${VARIANT_STYLES[variant]}`}
      role="alert"
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}
