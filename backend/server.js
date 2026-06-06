require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

console.log('Token cargado:', process.env.MP_ACCESS_TOKEN ? 'SI' : 'NO');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

app.post('/api/create-preference', async (req, res) => {
  try {
    const { items } = req.body;
    console.log('Items recibidos:', items);

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.nombre,
          unit_price: Number(item.precio),
          quantity: Number(item.quantity),
          currency_id: 'ARS',
        })),
        // auto_return no funciona con localhost, se activa solo en producción
      },
    });

    console.log('Preferencia creada:', response.id);
    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error('Error completo:', JSON.stringify(error, null, 2));
    console.error('Mensaje:', error.message);
    console.error('Cause:', error.cause);
    res.status(500).json({ error: error.message ?? 'Error al crear preferencia' });
  }
});

app.listen(3001, () => console.log('Backend en http://localhost:3001'));
