// src/features/stores/components/StoreFilters.tsx
import type { Range } from '../../../services/api';

interface Filters {
  search: string;
  city: string;
  postalCode: string;
  range: string;
}

interface Props {
  filters: Filters;
  ranges: Range[];
  onChange: (key: string, value: string) => void;
}

export default function StoreFilters({ filters, ranges, onChange }: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Recherche libre */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un magasin..."
            value={filters.search}
            onChange={e => onChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>

        {/* Ville */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🏙️</span>
          <input
            type="text"
            placeholder="Ville..."
            value={filters.city}
            onChange={e => onChange('city', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>

        {/* Code postal */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">📮</span>
          <input
            type="text"
            placeholder="Code postal..."
            value={filters.postalCode}
            onChange={e => onChange('postalCode', e.target.value)}
            maxLength={5}
            className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>

        {/* Gamme — chargée dynamiquement depuis l'API */}
        <select
          value={filters.range}
          onChange={e => onChange('range', e.target.value)}
          className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        >
          <option value="">Toutes les gammes</option>
          {ranges.map(range => (
            <option key={range.id} value={range.name}>
              {range.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton reset */}
      {(filters.search || filters.city || filters.postalCode || filters.range) && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              onChange('search', '');
              onChange('city', '');
              onChange('postalCode', '');
              onChange('range', '');
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Effacer les filtres
          </button>
        </div>
      )}
    </div>
  );
}
