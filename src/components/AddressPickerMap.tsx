// --- Mapa interactivo: click o arrastre del pin para elegir la dirección ---

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const STORE_COORDS: [number, number] = [-34.76369780924711, -58.359833337200385];

interface Props {
  coords: [number, number] | null;
  onSelect: (coords: [number, number]) => void;
}

function ClickHandler({ onSelect }: { onSelect: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function AddressPickerMap({ coords, onSelect }: Props) {
  return (
    <MapContainer
      center={coords ?? STORE_COORDS}
      zoom={13}
      style={{ height: '220px', width: '100%', borderRadius: '2px', zIndex: 0 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />
      <ClickHandler onSelect={onSelect} />
      {coords && (
        <Marker
          position={coords}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const pos = e.target.getLatLng();
              onSelect([pos.lat, pos.lng]);
            },
          }}
        />
      )}
    </MapContainer>
  );
}
