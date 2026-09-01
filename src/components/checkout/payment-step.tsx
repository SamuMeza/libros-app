'use client';

import { useState } from 'react';
import type { PaymentMethod } from '@/types/order';
import { convertUsdToVes, applyBinanceDiscount, formatCurrency, formatCurrencyVes } from '@/lib/utils/payment-helpers';

interface PaymentStepProps {
  total: number;
  hasBooks: boolean;
  data: {
    payment_method: PaymentMethod;
  };
  onComplete: (data: { payment_method: PaymentMethod }) => void;
}

export default function PaymentStep({ total, hasBooks, data, onComplete }: PaymentStepProps) {
  const [method, setMethod] = useState<PaymentMethod>(data.payment_method);
  const [showInstallmentsTable, setShowInstallmentsTable] = useState(false);
  const [numInstallments, setNumInstallments] = useState(3);

  const vesAmount = convertUsdToVes(total);
  const binanceTotal = applyBinanceDiscount(total);

  const handleSubmit = () => {
    onComplete({ payment_method: method });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Método de Pago</h2>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setMethod('pago_movil')}
          className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
            method === 'pago_movil'
              ? 'border-[var(--hl-primary)] bg-[var(--hl-primary)]/5'
              : 'border-border hover:border-[var(--hl-primary)]/50'
          }`}
        >
          <div className="font-medium text-foreground">Pago Móvil</div>
          <div className="text-sm text-muted-foreground">
            Transferencia bancaria en Bolívares
          </div>
        </button>

        <button
          type="button"
          onClick={() => setMethod('binance')}
          className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
            method === 'binance'
              ? 'border-[var(--hl-primary)] bg-[var(--hl-primary)]/5'
              : 'border-border hover:border-[var(--hl-primary)]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Binance</div>
              <div className="text-sm text-muted-foreground">
                Pago con criptomonedas (5% descuento)
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              -5%
            </span>
          </div>
        </button>

        {hasBooks && (
          <button
            type="button"
            onClick={() => {
              setMethod('installments');
              setShowInstallmentsTable(true);
            }}
            className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${
              method === 'installments'
                ? 'border-[var(--hl-primary)] bg-[var(--hl-primary)]/5'
                : 'border-border hover:border-[var(--hl-primary)]/50'
            }`}
          >
            <div className="font-medium text-foreground">Plan de Pagos</div>
            <div className="text-sm text-muted-foreground">
              Cuotas quincenales (2-4 cuotas)
            </div>
          </button>
        )}
      </div>

      {method === 'pago_movil' && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="mb-3 font-medium text-foreground">Datos para Pago Móvil</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Banco:</span>
              <span className="font-medium text-foreground">0102 - Banco de Venezuela</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cuenta:</span>
              <span className="font-medium text-foreground">01234567890123456789</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cédula:</span>
              <span className="font-medium text-foreground">V-12345678</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto a transferir:</span>
                <span className="font-bold text-foreground">{formatCurrencyVes(vesAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {method === 'binance' && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="mb-3 font-medium text-foreground">Datos para Binance</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Descuento (5%):</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(total - binanceTotal)}
              </span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total a pagar:</span>
                <span className="font-bold text-foreground">{formatCurrency(binanceTotal)}</span>
              </div>
            </div>
            <div className="border-t border-border pt-2">
              <div className="text-muted-foreground">Dirección de billetera:</div>
              <div className="mt-1 flex items-center gap-2 rounded-lg bg-background p-2">
                <code className="flex-1 text-xs text-foreground">
                  TRC-20: TXyz1234567890abcdef
                </code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText('TXyz1234567890abcdef')}
                  className="rounded bg-[var(--hl-primary)] px-2 py-1 text-xs text-white hover:bg-[var(--hl-primary)]/90"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {method === 'installments' && showInstallmentsTable && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="mb-3 font-medium text-foreground">Cronograma de Cuotas</h3>
          <div className="mb-3">
            <label htmlFor="installments" className="mb-1 block text-sm text-muted-foreground">
              Número de cuotas:
            </label>
            <select
              id="installments"
              value={numInstallments}
              onChange={(e) => setNumInstallments(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
            >
              <option value={2}>2 cuotas</option>
              <option value={3}>3 cuotas</option>
              <option value={4}>4 cuotas</option>
            </select>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-muted-foreground">Cuota</th>
                <th className="pb-2 text-right text-muted-foreground">Monto</th>
                <th className="pb-2 text-right text-muted-foreground">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numInstallments }).map((_, i) => {
                const amount = total / numInstallments;
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + (i + 1) * 15);
                return (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{i + 1}</td>
                    <td className="py-2 text-right font-medium text-foreground">
                      {formatCurrency(amount)}
                    </td>
                    <td className="py-2 text-right text-muted-foreground">
                      {dueDate.toLocaleDateString('es-VE', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-[var(--hl-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hl-primary)] focus-visible:ring-offset-2"
      >
        Continuar a Confirmación
      </button>
    </div>
  );
}
