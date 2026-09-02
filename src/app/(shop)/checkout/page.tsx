import type { Metadata } from 'next';
import CheckoutLayout from '@/components/checkout/checkout-layout';

export const metadata: Metadata = {
  title: 'Checkout - Hecho Letras & KamCat',
  description: 'Completa tu pedido con envío y pago seguro',
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <CheckoutLayout />
    </div>
  );
}
