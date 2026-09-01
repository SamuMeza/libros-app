'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  SubmitPaymentParams,
  VerifyPaymentParams,
  PaymentActionResponse,
  PaymentsActionResponse,
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

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: params.order_id,
        amount: params.amount,
        method: params.method,
        status: 'pending',
        proof_url: params.proof_url || null,
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

export async function getPayments(orderId: string): Promise<PaymentsActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: 'Error al consultar pagos' };
    }

    return { success: true, data: payments || [] };
  } catch {
    return { success: false, error: 'Error al consultar pagos' };
  }
}

export async function verifyPayment(params: VerifyPaymentParams): Promise<PaymentActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userProfile || !['admin_hl', 'admin_kc', 'super_admin'].includes(userProfile.role)) {
      return { success: false, error: 'No tiene permisos para verificar pagos' };
    }

    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', params.payment_id)
      .single();

    if (paymentError || !payment) {
      return { success: false, error: 'Pago no encontrado' };
    }

    if (payment.status !== 'pending') {
      return { success: false, error: 'Este pago ya fue procesado' };
    }

    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({
        status: params.status,
        notes: params.notes || null,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      })
      .eq('id', params.payment_id)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: 'Error al verificar el pago' };
    }

    if (params.status === 'verified') {
      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('order_id', payment.order_id)
        .eq('status', 'verified');

      const totalPaid = (allPayments || []).reduce(
        (sum: number, p: { amount: number }) => sum + p.amount,
        0
      );

      const { data: order } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('id', payment.order_id)
        .single();

      if (order) {
        let paymentStatus = 'pending';
        if (totalPaid >= order.total_amount) {
          paymentStatus = 'completed';
        } else if (totalPaid > 0) {
          paymentStatus = 'partial';
        }

        await supabase
          .from('orders')
          .update({
            payment_status: paymentStatus,
            status: paymentStatus === 'completed' ? 'payment_verified' : 'pending_payment',
          })
          .eq('id', payment.order_id);
      }
    }

    return { success: true, data: updatedPayment };
  } catch {
    return { success: false, error: 'Error al verificar el pago' };
  }
}
