// --- Mapa de envío con Leaflet ---

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix de iconos de Leaflet con Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const storeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Props {
  storeCoords: [number, number];
  clientCoords: [number, number];
}

export default function ShippingMap({ storeCoords, clientCoords }: Props) {
  const center: [number, number] = [
    (storeCoords[0] + clientCoords[0]) / 2,
    (storeCoords[1] + clientCoords[1]) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '260px', width: '100%', borderRadius: '2px', zIndex: 0 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />
      <Marker position={storeCoords} icon={storeIcon}>
        <Popup>BIOGRAFO — Salta 231, San José</Popup>
      </Marker>
      <Marker position={clientCoords}>
        <Popup>Tu domicilio</Popup>
      </Marker>
    </MapContainer>
  );
}
