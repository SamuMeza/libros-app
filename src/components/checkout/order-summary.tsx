'use client';

import { useCartStore } from '@/lib/hooks/use-cart';
import { formatCartTotal, getBrandBadgeClass } from '@/lib/utils/cart-helpers';
import { convertUsdToVes, formatCurrencyVes } from '@/lib/utils/payment-helpers';
import type { PaymentMethod } from '@/types/order';

interface OrderSummaryProps {
  paymentMethod: PaymentMethod;
  shippingCost: number;
}

export default function OrderSummary({ paymentMethod, shippingCost }: OrderSummaryProps) {
  const { brands, total } = useCartStore();

  const subtotal = total;
  const discount = paymentMethod === 'binance' ? subtotal * 0.05 : 0;
  const totalWithDiscount = subtotal - discount;
  const totalWithShipping = totalWithDiscount + shippingCost;
  const vesAmount = convertUsdToVes(totalWithDiscount);

  return (
    <div className="rounded-xl border border-border p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Resumen del Pedido</h2>

      <div className="space-y-3">
        {brands.map((brand) => (
          <div key={brand.brand} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBrandBadgeClass(brand.brand)}`}>
                {brand.brand === 'hl' ? 'HL' : 'KC'}
              </span>
              <span className="text-sm text-muted-foreground">{brand.brand_name}</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {formatCartTotal(brand.subtotal)}
            </span>
          </div>
        ))}

        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatCartTotal(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Descuento Binance (5%)</span>
              <span className="text-green-600">-{formatCartTotal(discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="text-foreground">
              {shippingCost > 0 ? formatCartTotal(shippingCost) : 'Calculado después'}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-foreground">
              {formatCartTotal(totalWithShipping)}
            </span>
          </div>

          {paymentMethod === 'pago_movil' && (
            <div className="mt-2 text-right text-sm text-muted-foreground">
              Equivalente: {formatCurrencyVes(vesAmount)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
