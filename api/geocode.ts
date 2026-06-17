import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { q, limit = '5', countrycodes = 'ar' } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Falta parámetro q' });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=${limit}&countrycodes=${countrycodes}`;

  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'es',
      'User-Agent': 'MueblesbiografoApp/1.0 (josueviturro@gmail.com)',
    },
  });

  const data = await response.json();

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(data);
}
