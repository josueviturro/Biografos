require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

app.post('/api/create-preference', async (req, res) => {
  try {
    const { items, order_id } = req.body;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.nombre,
          unit_price: Number(item.precio),
          quantity: Number(item.quantity),
          currency_id: 'ARS',
        })),
        external_reference: order_id,   // ID de la orden en Supabase
        back_urls: {
          success: 'http://localhost:5173/#/pago-exitoso',
          failure: 'http://localhost:5173/#/pago-fallido',
          pending: 'http://localhost:5173/#/pago-pendiente',
        },
        // auto_return no funciona con HTTP localhost, solo en producción con HTTPS
      },
    });

    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error('Error MP:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Backend en http://localhost:3001'));
