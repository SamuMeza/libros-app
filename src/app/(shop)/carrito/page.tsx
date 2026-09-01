import type { Metadata } from 'next';
import CartPage from '@/components/cart/cart-page';

export const metadata: Metadata = {
  title: 'Carrito de Compras - Hecho Letras & KamCat',
  description: 'Revisa los productos en tu carrito y procede al checkout',
};

export default function CarritoPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      <CartPage />
    </div>
  );
}
