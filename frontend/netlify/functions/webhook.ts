// --- Webhook de MercadoPago: recibe notificaciones de pago ---

import type { Handler } from '@netlify/functions';
import MercadoPago, { Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const mpClient = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const handler: Handler = async (event) => {
  // Solo acepta POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body ?? '{}');

    // MP manda varios tipos de notificaciones, solo nos interesan los pagos
    if (body.type !== 'payment') {
      return { statusCode: 200, body: 'OK' };
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return { statusCode: 400, body: 'Sin payment id' };
    }

    // Consultamos a MP los detalles del pago
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    const { status, external_reference } = paymentData;

    console.log(`Pago ${paymentId}: status=${status}, orden=${external_reference}`);

    if (!external_reference) {
      return { statusCode: 200, body: 'Sin external_reference' };
    }

    // Mapeamos el estado de MP al estado de nuestra orden
    const estadoOrden: Record<string, string> = {
      approved:    'pagado',
      pending:     'pendiente',
      in_process:  'pendiente',
      rejected:    'cancelado',
    };

    const nuevoEstado = estadoOrden[status ?? ''] ?? 'pendiente';

    // Actualizamos la orden en Supabase
    const { error } = await supabase
      .from('ordenes')
      .update({ estado: nuevoEstado })
      .eq('id', external_reference);

    if (error) {
      console.error('Error actualizando orden:', error);
      return { statusCode: 500, body: 'Error actualizando orden' };
    }

    console.log(`Orden ${external_reference} actualizada a "${nuevoEstado}"`);
    return { statusCode: 200, body: 'OK' };

  } catch (error: any) {
    console.error('Error webhook:', error.message);
    return { statusCode: 500, body: error.message };
  }
};
