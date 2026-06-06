import type { Handler } from '@netlify/functions';
import MercadoPago, { Preference } from 'mercadopago';

const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { items, order_id } = JSON.parse(event.body ?? '{}');

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
        notification_url: `${process.env.URL}/.netlify/functions/webhook`,
        back_urls: {
          success: `${process.env.URL}/#/pago-exitoso`,
          failure: `${process.env.URL}/#/pago-fallido`,
          pending: `${process.env.URL}/#/pago-pendiente`,
        },
        auto_return: 'approved',
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ init_point: response.init_point }),
    };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
