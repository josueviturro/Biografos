// --- Cálculo de distancia y costo de envío usando Nominatim + OSRM ---

// Coordenadas fijas del local — evita geocodificar siempre la misma dirección
const STORE_COORDS: [number, number] = [-34.7912, -58.3985]; // Salta 231, Temperley

export type CostoEnvio = number | 'convenir';

export interface ShippingResult {
  km: number;
  costo: CostoEnvio;
  storeCoords: [number, number];
  clientCoords: [number, number];
}

async function geocode(address: string): Promise<[number, number]> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(address)}&limit=1`);
  const data = await res.json();
  if (!data[0]) throw new Error('No se encontró la dirección. Seleccioná una opción del listado desplegable.');
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

async function getKm(from: [number, number], to: [number, number]): Promise<number> {
  const [latA, lonA] = from;
  const [latB, lonB] = to;
  const url = `https://router.project-osrm.org/route/v1/driving/${lonA},${latA};${lonB},${latB}?overview=false`;
  console.log('[SHIPPING] Routing:', url);
  const res = await fetch(url);
  const data = await res.json();
  console.log('[SHIPPING] Route result:', data);
  if (!data.routes?.[0]) throw new Error('No se pudo calcular la ruta.');
  return data.routes[0].distance / 1000;
}

function calcularCosto(km: number): CostoEnvio {
  if (km <= 2)  return 12000;
  if (km <= 5)  return 25000;
  if (km <= 10) return 50000;
  return 'convenir';
}

export async function calcularEnvio(
  clientAddress: string,
  precomputedClientCoords?: [number, number]
): Promise<ShippingResult> {
  const storeCoords = STORE_COORDS;
  const clientCoords = precomputedClientCoords ?? await geocode(clientAddress);
  const km = await getKm(storeCoords, clientCoords);
  return { km, costo: calcularCosto(km), storeCoords, clientCoords };
}
