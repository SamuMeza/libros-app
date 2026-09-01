'use client';

import { useState } from 'react';
import type { TrackingNote } from '@/types/admin';
import { addTrackingNote } from '@/lib/actions/admin/tracking';
import { formatDate } from '@/lib/utils/order-helpers';

interface TrackingFormProps {
  subOrderId: string;
  existingNotes: TrackingNote[];
  onNoteAdded: () => void;
}

export default function TrackingForm({ subOrderId, existingNotes, onNoteAdded }: TrackingFormProps) {
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || location.trim().length < 2) {
      setError('La ubicación es requerida (mínimo 2 caracteres)');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await addTrackingNote(subOrderId, location.trim(), note.trim());
      if (result.success) {
        setLocation('');
        setNote('');
        onNoteAdded();
      } else {
        setError(result.error || 'Error al agregar nota de tracking');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-[var(--admin-text)] mb-3">
        Agregar nota de tracking
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-[var(--admin-text-muted)] mb-1">
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Maracaibo, Caracas"
            className="admin-input"
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label className="block text-sm text-[var(--admin-text-muted)] mb-1">
            Descripción (opcional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej: En tránsito desde la oficina central"
            className="admin-input min-h-16"
            rows={2}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--admin-danger)]">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !location || location.trim().length < 2}
          className="admin-button admin-button-primary w-full"
        >
          {isSubmitting ? 'Agregando...' : 'Agregar nota'}
        </button>
      </form>

      {existingNotes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-[var(--admin-text)] mb-3">
            Historial de tracking
          </h4>
          <div className="admin-timeline">
            {existingNotes.map((trackingNote) => (
              <div key={trackingNote.id} className="admin-timeline-item">
                <div className="admin-timeline-dot" />
                <div>
                  <p className="font-medium text-[var(--admin-text)]">
                    {trackingNote.location}
                  </p>
                  {trackingNote.note && (
                    <p className="text-sm text-[var(--admin-text-muted)]">
                      {trackingNote.note}
                    </p>
                  )}
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    {formatDate(trackingNote.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
