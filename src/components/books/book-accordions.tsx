import AccordionItem from '@/components/ui/accordion';

export default function BookAccordions() {
  return (
    <div className="rounded-xl border border-hl-primary/10 bg-white shadow-sm">
      <AccordionItem title="Política de envíos" defaultOpen>
        <div className="space-y-2">
          <p><strong>Envíos a todo Venezuela</strong> mediante MRW y Zoom.</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Caracas y Greater Caracas:</strong> 1-3 días hábiles</li>
            <li><strong>Interior del país:</strong> 3-7 días hábiles</li>
            <li><strong>Costo:</strong> Calculado al finalizar la compra según destino y peso</li>
          </ul>
          <p>Recibirás un número de guía por WhatsApp o email una vez despachado tu pedido.</p>
        </div>
      </AccordionItem>

      <AccordionItem title="Métodos de pago">
        <div className="space-y-2">
          <p>Aceptamos los siguientes métodos de pago:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Pago Móvil:</strong> Transferencia al number XXX-XXXXXXX (Banco XXX)</li>
            <li><strong>Binance USDT:</strong> Envío de comprobante por WhatsApp</li>
            <li><strong>Transferencia bancaria:</strong> Deposito o transferencia directa</li>
          </ul>
          <p>Envía el comprobante de pago a nuestro WhatsApp +58 XXX-XXXXXXX para confirmar tu pedido.</p>
        </div>
      </AccordionItem>

      <AccordionItem title="Plan de cuotas">
        <div className="space-y-2">
          <p><strong>Paga a plazos con cuotas quincenales:</strong></p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>2 cuotas:</strong> 50% al confirmar + 50% a los 15 días</li>
            <li><strong>3 cuotas:</strong> 34% al confirmar + 33% a los 15 días + 33% a los 30 días</li>
            <li><strong>4 cuotas:</strong> 25% al confirmar + 25% cada 15 días</li>
          </ul>
          <p className="text-xs text-hl-primary/50">El plan de cuotas aplica para libros con precio superior a $20. El primer pago se realiza al confirmar el pedido.</p>
        </div>
      </AccordionItem>
    </div>
  );
}
