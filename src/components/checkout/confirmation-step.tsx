'use client';

import { useState, useRef } from 'react';
import { validatePaymentProof } from '@/lib/utils/payment-helpers';

interface ConfirmationStepProps {
  onSubmit: (data: {
    proof_file?: File;
    proof_url?: string;
    proof_number: string;
  }) => void;
  isSubmitting: boolean;
}

export default function ConfirmationStep({ onSubmit, isSubmitting }: ConfirmationStepProps) {
  const [proofNumber, setProofNumber] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePaymentProof(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo no válido');
      return;
    }

    setProofFile(file);
    setError(null);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setProofFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!proofNumber || proofNumber.trim().length < 5) {
      setError('El número de referencia es requerido (mínimo 5 caracteres)');
      return;
    }

    onSubmit({
      proof_file: proofFile || undefined,
      proof_number: proofNumber,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Confirmación de Pago</h2>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="proof_number" className="mb-1 block text-sm font-medium text-foreground">
          Número de Referencia / Hash de Transacción *
        </label>
        <input
          id="proof_number"
          type="text"
          value={proofNumber}
          onChange={(e) => {
            setProofNumber(e.target.value);
            setError(null);
          }}
          className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
          placeholder="Ej: 1234567890 o hash de transacción"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Ingresa el número de referencia de tu pago móvil o el hash de la transacción de Binance
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Comprobante de Pago (opcional)
        </label>
        <div
          className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            proofFile
              ? 'border-[var(--hl-primary)] bg-[var(--hl-primary)]/5'
              : 'border-border hover:border-[var(--hl-primary)]/50'
          }`}
        >
          {proofFile ? (
            <div className="space-y-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa del comprobante"
                  className="mx-auto max-h-48 rounded-lg object-contain"
                />
              ) : (
                <div className="flex items-center justify-center gap-2 text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm">{proofFile.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-sm text-destructive hover:underline"
              >
                Eliminar archivo
              </button>
            </div>
          ) : (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-2 text-sm text-muted-foreground">
                Arrastra y suelta tu comprobante aquí, o haz clic para seleccionar
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG o PDF (máx. 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Subir comprobante de pago"
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[var(--hl-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hl-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Procesando...
          </span>
        ) : (
          'Completar Pedido'
        )}
      </button>
    </div>
  );
}
