// --- Vercel API Route: crea preferencia de pago en MercadoPago ---

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, order_id } = req.body;
    const baseUrl = process.env.APP_URL ?? `https://${process.env.VERCEL_URL}`;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items inválidos' });
    }

    // Buscar precios reales desde la DB — nunca confiar en los del cliente
    const productIds = items.map((i: { product_id: string }) => i.product_id);
    const { data: productos, error: dbError } = await supabase
      .from('productos')
      .select('id, nombre, precio')
      .in('id', productIds);

    if (dbError || !productos) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }

    const mpItems = items.map((item: { product_id: string; quantity: number }) => {
      const producto = productos.find((p) => p.id === item.product_id);
      if (!producto) throw new Error(`Producto ${item.product_id} no encontrado`);
      return {
        title: producto.nombre as string,
        unit_price: producto.precio as number,
        quantity: item.quantity,
        currency_id: 'ARS',
      };
    });

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: mpItems,
        external_reference: order_id,
        notification_url: `${baseUrl}/api/webhook`,
        back_urls: {
          success: `${baseUrl}/pago-exitoso`,
          failure: `${baseUrl}/pago-fallido`,
          pending: `${baseUrl}/pago-pendiente`,
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
