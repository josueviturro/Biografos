// --- Vercel API Route: crea preferencia de pago en MercadoPago ---

import type { VercelRequest, VercelResponse } from '@vercel/node';
import MercadoPago, { Preference } from 'mercadopago';

const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, order_id } = req.body;
    const baseUrl = process.env.APP_URL ?? `https://${process.env.VERCEL_URL}`;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item: { nombre: string; precio: number; quantity: number }) => ({
          title: item.nombre,
          unit_price: item.precio,
          quantity: item.quantity,
          currency_id: 'ARS',
        })),
        external_reference: order_id,
        notification_url: `${baseUrl}/api/webhook`,
        back_urls: {
          success: `${baseUrl}/#/pago-exitoso`,
          failure: `${baseUrl}/#/pago-fallido`,
          pending: `${baseUrl}/#/pago-pendiente`,
        },
        auto_return: 'approved',
      },
    });

    return res.json({ init_point: response.init_point });

  } catch (error: any) {
    console.error('Error MP:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
