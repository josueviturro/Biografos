// --- Netlify Function: crea una preferencia de pago en MercadoPago ---
// El Access Token nunca sale del servidor

import type { Handler } from '@netlify/functions';
import MercadoPago, { Preference } from 'mercadopago';

const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const handler: Handler = async (event) => {
  // Solo acepta POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { items } = JSON.parse(event.body ?? '{}');

    if (!items || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Sin items' }) };
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item: { nombre: string; precio: number; quantity: number }) => ({
          title: item.nombre,
          unit_price: item.precio,
          quantity: item.quantity,
          currency_id: 'ARS',
        })),
        back_urls: {
          success: `${process.env.URL ?? 'http://localhost:8888'}/#/pago-exitoso`,
          failure: `${process.env.URL ?? 'http://localhost:8888'}/#/pago-fallido`,
          pending: `${process.env.URL ?? 'http://localhost:8888'}/#/pago-pendiente`,
        },
        auto_return: 'approved',
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ init_point: response.init_point }),
    };
  } catch (error) {
    console.error('Error creando preferencia MP:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al crear preferencia de pago' }),
    };
  }
};
