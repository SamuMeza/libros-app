'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/hooks/use-cart';
import StepIndicator from '@/components/shared/step-indicator';
import ShippingStep from './shipping-step';
import PaymentStep from './payment-step';
import ConfirmationStep from './confirmation-step';
import OrderSummary from './order-summary';
import type { ShippingAddress, ShippingMethod, PaymentMethod } from '@/types/order';
import { submitPayment } from '@/lib/actions/payments';
import { createOrder } from '@/lib/actions/orders';
import { validatePaymentProof } from '@/lib/utils/payment-helpers';

const STEPS = [
  { number: 1, label: 'Envío' },
  { number: 2, label: 'Pago' },
  { number: 3, label: 'Confirmación' },
];

interface CheckoutData {
  shipping_address: ShippingAddress;
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;
}

export default function CheckoutLayout() {
  const router = useRouter();
  const { items, total, fetchCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shipping_address: {
      full_name: '',
      cedula: '',
      phone: '',
      state: '',
      city: '',
      address: '',
      reference: '',
    },
    shipping_method: 'mrw',
    payment_method: 'pago_movil',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const hasBooks = items.some((item) => item.item_type === 'book');

  const handleShippingComplete = (data: {
    shipping_address: ShippingAddress;
    shipping_method: ShippingMethod;
  }) => {
    setCheckoutData((prev) => ({
      ...prev,
      shipping_address: data.shipping_address,
      shipping_method: data.shipping_method,
    }));
    setCurrentStep(2);
  };

  const handlePaymentComplete = (data: { payment_method: PaymentMethod }) => {
    setCheckoutData((prev) => ({
      ...prev,
      payment_method: data.payment_method,
    }));
    setCurrentStep(3);
  };

  const handleConfirmationSubmit = async (data: {
    proof_file?: File;
    proof_url?: string;
    proof_number: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderResult = await createOrder({
        shipping_address: checkoutData.shipping_address,
        shipping_method: checkoutData.shipping_method,
        payment_method: checkoutData.payment_method,
      });

      if (!orderResult.success || !orderResult.data) {
        setError(orderResult.error || 'Error al crear la orden');
        setIsSubmitting(false);
        return;
      }

      if (data.proof_file) {
        const validation = validatePaymentProof(data.proof_file);
        if (!validation.valid) {
          setError(validation.error || 'Comprobante no válido');
          setIsSubmitting(false);
          return;
        }
      }

      const paymentResult = await submitPayment({
        order_id: orderResult.data.id,
        amount: orderResult.data.total_amount,
        method: checkoutData.payment_method === 'pago_movil' ? 'pago_movil' : 'binance',
        proof_number: data.proof_number,
      });

      if (!paymentResult.success) {
        setError(paymentResult.error || 'Error al registrar el pago');
        setIsSubmitting(false);
        return;
      }

      router.push(`/checkout/confirmacion?orderId=${orderResult.data.id}`);
    } catch {
      setError('Error al procesar el pedido');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Tu carrito está vacío</h2>
        <p className="mb-4 text-muted-foreground">Agrega productos antes de proceder al checkout</p>
        <button
          type="button"
          onClick={() => router.push('/libros')}
          className="rounded-lg bg-[var(--hl-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90"
        >
          Ver Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-8">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {currentStep === 1 && (
          <ShippingStep data={checkoutData} onComplete={handleShippingComplete} />
        )}

        {currentStep === 2 && (
          <PaymentStep
            total={total}
            hasBooks={hasBooks}
            data={checkoutData}
            onComplete={handlePaymentComplete}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationStep
            onSubmit={handleConfirmationSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="mt-4 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Volver al paso anterior
          </button>
        )}
      </div>

      <div className="lg:col-span-1">
        <OrderSummary
          paymentMethod={checkoutData.payment_method}
          shippingCost={0}
        />
      </div>
    </div>
  );
}
