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

const STORE_COORDS: [number, number] = [-34.76369780924711, -58.359833337200385];

async function calcularKmServidor(clientLat: number, clientLon: number): Promise<number> {
  const [storeLat, storeLon] = STORE_COORDS;
  const url = `https://router.project-osrm.org/route/v1/driving/${storeLon},${storeLat};${clientLon},${clientLat}?overview=false`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes?.[0]) throw new Error('No se pudo calcular la ruta.');
  return data.routes[0].distance / 1000;
}

async function getCostoEnvio(km: number): Promise<number | null> {
  const { data } = await supabase
    .from('tarifas_envio')
    .select('costo')
    .gte('km_hasta', km)
    .order('km_hasta', { ascending: true })
    .limit(1)
    .single();
  return data?.costo ?? null; // null = convenir (>10km)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, order_id, client_lat, client_lon } = req.body;
    const baseUrl = process.env.APP_URL ?? `https://${process.env.VERCEL_URL}`;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items inválidos' });
    }

    // Precios desde la DB — nunca confiar en los del cliente
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
        id: producto.id as string,
        title: producto.nombre as string,
        unit_price: producto.precio as number,
        quantity: item.quantity,
        currency_id: 'ARS',
      };
    });

    // Calcular costo de envío server-side si el cliente mandó coordenadas
    if (typeof client_lat === 'number' && typeof client_lon === 'number') {
      const km = await calcularKmServidor(client_lat, client_lon);
      const costo = await getCostoEnvio(km);
      if (costo !== null) {
        mpItems.push({
          id: 'envio',
          title: 'Costo de envío',
          unit_price: costo,
          quantity: 1,
          currency_id: 'ARS',
        });
      }
    }

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
