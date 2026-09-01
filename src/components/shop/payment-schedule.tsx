'use client';

import type { PaymentSchedule } from '@/types/admin';
import { formatAmount, formatShortDate } from '@/lib/utils/order-helpers';

interface PaymentScheduleProps {
  schedule: PaymentSchedule[];
}

export default function PaymentScheduleComponent({ schedule }: PaymentScheduleProps) {
  if (schedule.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {schedule.map((item) => (
        <div 
          key={item.id} 
          className={`p-3 rounded-lg ${
            item.status === 'paid' 
              ? 'bg-green-50 border border-green-200' 
              : item.status === 'overdue'
              ? 'bg-red-50 border border-red-200'
              : 'bg-[var(--admin-bg)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--admin-text)]">
                Cuota {item.installment_number}
              </p>
              <p className="text-sm text-[var(--admin-text-muted)]">
                Vence: {formatShortDate(item.due_date)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-[var(--admin-text)]">
                {formatAmount(item.amount)}
              </p>
              <span className={`admin-badge admin-badge-${
                item.status === 'paid' ? 'verified' : 
                item.status === 'overdue' ? 'rejected' : 'pending'
              }`}>
                {item.status === 'paid' ? 'Pagada' : 
                 item.status === 'overdue' ? 'Vencida' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
