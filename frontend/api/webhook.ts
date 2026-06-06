// --- Vercel API Route: webhook de MercadoPago ---

import type { VercelRequest, VercelResponse } from '@vercel/node';
import MercadoPago, { Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const mpClient = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const ESTADOS: Record<string, string> = {
  approved:   'pagado',
  pending:    'pendiente',
  in_process: 'pendiente',
  rejected:   'cancelado',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    if (body.type !== 'payment') {
      return res.status(200).json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return res.status(400).json({ error: 'Sin payment id' });

    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    const { status, external_reference } = paymentData;

    if (!external_reference) return res.status(200).json({ ok: true });

    const nuevoEstado = ESTADOS[status ?? ''] ?? 'pendiente';

    await supabase
      .from('ordenes')
      .update({ estado: nuevoEstado })
      .eq('id', external_reference);

    console.log(`Orden ${external_reference} → ${nuevoEstado}`);
    return res.status(200).json({ ok: true });

  } catch (error: any) {
    console.error('Error webhook:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
