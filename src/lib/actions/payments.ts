'use server';

import { createClient } from '@/lib/supabase/server';
import { uploadPaymentProof } from '@/lib/utils/cloudinary';
import type {
  SubmitPaymentParams,
  PaymentActionResponse,
} from '@/types/payment';

export async function submitPayment(params: SubmitPaymentParams): Promise<PaymentActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.order_id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return { success: false, error: 'Orden no encontrada' };
    }

    if (!params.proof_number || params.proof_number.trim().length < 5) {
      return { success: false, error: 'El número de referencia es requerido (mínimo 5 caracteres)' };
    }

    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('order_id', params.order_id)
      .eq('proof_number', params.proof_number)
      .single();

    if (existingPayment) {
      return { success: false, error: 'Este número de referencia ya fue registrado' };
    }

    let proofUrl = params.proof_url || null;

    if (params.proof_file) {
      const uploadResult = await uploadPaymentProof(params.proof_file, params.order_id);
      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }
      proofUrl = uploadResult.url || null;
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: params.order_id,
        amount: params.amount,
        method: params.method,
        status: 'pending',
        proof_url: proofUrl,
        proof_number: params.proof_number,
      })
      .select()
      .single();

    if (paymentError) {
      return { success: false, error: 'Error al registrar el pago' };
    }

    const { data: totalPaid } = await supabase
      .from('payments')
      .select('amount')
      .eq('order_id', params.order_id)
      .eq('status', 'verified');

    const paidAmount = (totalPaid || []).reduce(
      (sum: number, p: { amount: number }) => sum + p.amount,
      0
    );

    let paymentStatus = 'pending';
    if (paidAmount >= order.total_amount) {
      paymentStatus = 'completed';
    } else if (paidAmount > 0) {
      paymentStatus = 'partial';
    }

    await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', params.order_id);

    return { success: true, data: payment };
  } catch {
    return { success: false, error: 'Error al registrar el pago' };
  }
}
