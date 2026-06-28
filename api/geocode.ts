import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { q, lat, lon, limit = '5', countrycodes = 'ar' } = req.query;

  const headers = {
    'Accept-Language': 'es',
    'User-Agent': 'MueblesbiografoApp/1.0 (josueviturro@gmail.com)',
  };

  let url: string;

  if (typeof lat === 'string' && typeof lon === 'string') {
    url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json`;
  } else if (typeof q === 'string') {
    url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=${limit}&countrycodes=${countrycodes}`;
  } else {
    return res.status(400).json({ error: 'Falta parámetro q o lat/lon' });
  }

  const response = await fetch(url, { headers });
  const data = await response.json();

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(data);
}
