// src/features/stores/pages/StoresPage.tsx
import { useState, useEffect } from 'react';
import { storesAPI, rangesAPI, type Store, type Range } from '../../../services/api';
import StoreCard from '../components/StoreCard';
import StoreFilters from '../components/StoreFilters';
import StoreMap from '../components/StoreMap';
import { MapPin } from 'lucide-react';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [ranges, setRanges] = useState<Range[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 46.2276, lng: 2.2137 }); // France par défaut
  const [mapZoom, setMapZoom] = useState(6);

  const [filters, setFilters] = useState({
    wilaya: '',
    commune: '',
    range: '',
    page: 1,
    limit: 500, // On charge plus pour la map
  });

  // Géolocalisation utilisateur optionnelle
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setMapZoom(11);
      });
    }
  }, []);

  useEffect(() => {
    rangesAPI.getAll()
      .then(res => setRanges(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    storesAPI.getAll(filters)
      .then(res => {
        setStores(res.data.stores);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    setSelectedStore(null);
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setMapCenter({ lat: store.lat, lng: store.lng });
    setMapZoom(15);
  };

  // Liste réutilisable
  const renderStoreList = (isMobile: boolean) => (
    <div className={`overflow-y-auto ${isMobile ? 'flex gap-4 pb-4 overflow-x-auto snap-x' : 'h-[700px] flex flex-col gap-4 pr-2'}`}>
      {stores.length === 0 && !loading && (
        <div className="text-center py-20 px-4 text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Aucun point de vente trouvé.</p>
        </div>
      )}
      {stores.map(store => (
        <div
          key={store.id}
          className={`${isMobile ? 'min-w-[85vw] sm:min-w-[350px] snap-center' : 'w-full'} transition-all cursor-pointer`}
          onClick={() => handleStoreSelect(store)}
        >
          <div className={`pointer-events-none ${selectedStore?.id === store.id ? 'ring-2 ring-primary rounded-2xl' : ''}`}>
             <StoreCard store={store} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative py-16 px-4 overflow-hidden border-b border-border/40 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nos Points de Vente
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trouvez les produits au plus près de chez vous.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <StoreFilters filters={filters} ranges={ranges} onChange={handleFilterChange} />
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl mb-8">
            Erreur: {error}
          </div>
        )}

        {/* Vue Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-4 text-foreground/80 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {stores.length} points de vente
            </h2>
            {renderStoreList(false)}
          </div>
          <div className="col-span-2">
             <StoreMap 
               stores={stores} 
               center={mapCenter} 
               zoom={mapZoom} 
               selectedStore={selectedStore} 
               onStoreSelect={handleStoreSelect} 
             />
          </div>
        </div>

        {/* Vue Mobile */}
        <div className="lg:hidden flex flex-col gap-8">
          <div className="w-full">
            <StoreMap 
               stores={stores} 
               center={mapCenter} 
               zoom={mapZoom} 
               selectedStore={selectedStore} 
               onStoreSelect={handleStoreSelect} 
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 text-foreground/80 px-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {stores.length} points de vente
            </h2>
            {renderStoreList(true)}
          </div>
        </div>
      </div>
    </div>
  );
}
