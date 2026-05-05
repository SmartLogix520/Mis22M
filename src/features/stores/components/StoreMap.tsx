import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Phone, Mail, ExternalLink, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { type Store } from '../../../services/api';

const customIcon = L.divIcon({
  html: `
        <div class="relative">
            <div class="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>
            <div class="relative w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
        </div>
    `,
  className: 'custom-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const selectedIcon = L.divIcon({
  html: `
        <div class="relative">
            <div class="absolute -inset-3 bg-primary/30 rounded-full blur-lg animate-pulse"></div>
            <div class="relative w-12 h-12 bg-gradient-to-br from-primary via-primary to-primary/70 rounded-full shadow-2xl flex items-center justify-center border-3 border-white ring-4 ring-primary/20">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
        </div>
    `,
  className: 'custom-marker-selected',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 'small';
  let sizeClass = 'w-12 h-12 text-sm';

  if (count > 100) {
    size = 'large';
    sizeClass = 'w-16 h-16 text-lg';
  } else if (count > 10) {
    size = 'medium';
    sizeClass = 'w-14 h-14 text-base';
  }

  return L.divIcon({
    html: `
            <div class="relative">
                <div class="absolute -inset-2 bg-primary/20 rounded-full blur-lg"></div>
                <div class="relative ${sizeClass} bg-gradient-to-br from-primary via-primary to-primary/80 rounded-full shadow-xl flex items-center justify-center border-3 border-white backdrop-blur-sm">
                    <span class="font-semibold text-white">${count}</span>
                </div>
            </div>
        `,
    className: `custom-cluster-icon cluster-${size}`,
    iconSize: L.point(50, 50, true),
  });
};

const MapController = ({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) => {
  const map = useMap();
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  useEffect(() => {
    const centerChanged = prevCenter.current.lat !== center.lat || prevCenter.current.lng !== center.lng;
    const zoomChanged = prevZoom.current !== zoom;

    if (centerChanged || zoomChanged) {
      map.setView([center.lat, center.lng], zoom, {
        animate: true,
        duration: 0.8,
      });
      prevCenter.current = center;
      prevZoom.current = zoom;
    }
  }, [center.lat, center.lng, zoom, map]);

  return null;
};

interface Props {
  stores: Store[];
  center: { lat: number; lng: number };
  zoom?: number;
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
}

export default function StoreMap({ stores, center, zoom = 6, selectedStore, onStoreSelect }: Props) {
  // Petite rustine locale pour éviter une erreur vite au SSR/dev si CSS non chargé
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-[600px] lg:h-[700px] rounded-3xl border border-border/50 shadow-xl overflow-hidden relative z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
        >
          {stores.map((store) => {
            const isSelected = selectedStore?.id === store.id;
            return (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
                icon={isSelected ? selectedIcon : customIcon}
                eventHandlers={{
                  click: () => onStoreSelect(store),
                }}
              >
                <Popup closeButton={false} className="border-none">
                  <div className="min-w-[250px] p-1">
                    <div className="pb-3 mb-3 border-b border-border/50">
                      <h3 className="font-semibold text-base text-foreground">{store.name}</h3>
                      {store.ranges && store.ranges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {store.ranges.map((range, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-md font-medium">
                              {range}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2.5 mb-4">
                      <div className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <div className="text-xs leading-relaxed">
                          <p>{store.address}</p>
                          <p>{store.commune} {store.wilaya}</p>
                        </div>
                      </div>
                      {store.phone && (
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-primary" />
                          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-xs hover:underline text-foreground/80">{store.phone}</a>
                        </div>
                      )}
                      {store.email && (
                        <div className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-primary" />
                          <a href={`mailto:${store.email}`} className="text-xs hover:underline text-foreground/80 truncate">{store.email}</a>
                        </div>
                      )}
                    </div>
                    <a
                      href={store.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Y aller
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
