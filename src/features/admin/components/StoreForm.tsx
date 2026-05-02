// src/features/admin/components/StoreForm.tsx
import { useState } from 'react';
import { storesAPI, type Store, type Range } from '../../../services/api';

interface Props {
  store: Store | null;
  ranges: Range[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StoreForm({ store, ranges, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState({
    name:         store?.name         ?? '',
    address:      store?.address      ?? '',
    city:         store?.city         ?? '',
    postalCode:   store?.postalCode   ?? '',
    country:      store?.country      ?? 'France',
    lat:          store?.lat          ?? '',
    lng:          store?.lng          ?? '',
    phone:        store?.phone        ?? '',
    email:        store?.email        ?? '',
    website:      store?.website      ?? '',
    googleMapsUrl:store?.googleMapsUrl?? '',
    ranges:       store?.ranges       ?? [] as string[],
    services:     store?.services?.join(', ') ?? '',
    isFeatured:   store?.isFeatured   ?? false,
    isActive:     store?.isActive     ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractGoogleMapsData = (url: string) => {
    try {
      const nameMatch = url.match(/maps\/place\/([^/@]+)/);
      const extractedName = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, ' ')) : '';
      let extractedLat: string | number = '';
      let extractedLng: string | number = '';

      const realCoordsMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (realCoordsMatch) {
          extractedLat = parseFloat(realCoordsMatch[1]);
          extractedLng = parseFloat(realCoordsMatch[2]);
      } else {
          const viewCoordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
          if (viewCoordsMatch) {
              extractedLat = parseFloat(viewCoordsMatch[1]);
              extractedLng = parseFloat(viewCoordsMatch[2]);
          }
      }
      return { name: extractedName, lat: extractedLat, lng: extractedLng };
    } catch (error) {
      console.error('Erreur extraction données:', error);
      return { name: '', lat: '', lng: '' };
    }
  };

  const handleExtract = () => {
    if (!form.googleMapsUrl) return;
    setExtracting(true);
    setTimeout(() => {
        const extracted = extractGoogleMapsData(form.googleMapsUrl);
        setForm(prev => ({
            ...prev,
            name: extracted.name || prev.name,
            lat: extracted.lat ? String(extracted.lat) : prev.lat,
            lng: extracted.lng ? String(extracted.lng) : prev.lng
        }));
        setExtracting(false);
    }, 500);
  };

  const toggle = (value: string, list: string[]) =>
    list.includes(value) ? list.filter(v => v !== value) : [...list, value];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        lat: parseFloat(String(form.lat)),
        lng: parseFloat(String(form.lng)),
        services: form.services.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (store) {
        await storesAPI.update(store.id, payload);
      } else {
        await storesAPI.create(payload);
      }
      onSuccess();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs text-white/40 mb-1.5">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Nom *', 'name', 'text', 'Nom du point de vente')}
        {field('Téléphone', 'phone', 'tel', '01 23 45 67 89')}
      </div>

      {field('Adresse *', 'address', 'text', '12 rue de la Paix')}

      <div className="grid grid-cols-2 gap-4">
        {field('Ville *', 'city', 'text', 'Paris')}
        {field('Code postal *', 'postalCode', 'text', '75001')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('Latitude *', 'lat', 'number', '48.8566')}
        {field('Longitude *', 'lng', 'number', '2.3522')}
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-1.5 flex justify-between">
          <span>Lien Google Maps</span>
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={form.googleMapsUrl}
            onChange={e => setForm(f => ({ ...f, googleMapsUrl: e.target.value }))}
            placeholder="https://maps.google.com/..."
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            type="button"
            onClick={handleExtract}
            disabled={!form.googleMapsUrl || extracting}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {extracting ? 'Extraction...' : 'Extraire Infos'}
          </button>
        </div>
      </div>
      {field('Site web', 'website', 'url', 'https://...')}
      {field('Email', 'email', 'email', 'contact@pharmacie.fr')}

      {/* Services */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5">Services (séparés par des virgules)</label>
        <input
          type="text"
          value={form.services}
          onChange={e => setForm(f => ({ ...f, services: e.target.value }))}
          placeholder="Conseil, Livraison, Click & Collect"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition"
        />
      </div>

      {/* Gammes */}
      {ranges.length > 0 && (
        <div>
          <label className="block text-xs text-white/40 mb-2">Gammes disponibles</label>
          <div className="flex flex-wrap gap-2">
            {ranges.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setForm(f => ({ ...f, ranges: toggle(r.name, f.ranges) }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  form.ranges.includes(r.name)
                    ? 'bg-violet-600 text-white border border-violet-500'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/30'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggles */}
      <div className="flex gap-6">
        {[
          { key: 'isActive', label: 'Actif' },
          { key: 'isFeatured', label: 'Mis en avant' }
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(form[key as keyof typeof form])}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
              className="w-4 h-4 rounded accent-violet-500"
            />
            <span className="text-sm text-white/60">{label}</span>
          </label>
        ))}
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-white/40 hover:text-white border border-white/10 rounded-lg transition-colors">Annuler</button>
        <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg transition-all">
          {saving ? 'Enregistrement...' : store ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
