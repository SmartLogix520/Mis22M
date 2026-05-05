import { WILAYA_NAMES } from '../../../shared/constants/algeria';


interface Filters {
  wilaya: string;
  commune: string;
}

interface Props {
  filters: Filters;
  onChange: (key: string, value: string) => void;
}

export default function StoreFilters({ filters, onChange }: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Wilaya */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm z-10">🏙️</span>
          <select
            value={filters.wilaya}
            onChange={e => onChange('wilaya', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition appearance-none"
          >
            <option value="">Toutes les wilayas</option>
            {WILAYA_NAMES.map((name, index) => {
              const code = (index + 1).toString().padStart(2, '0');
              return (
                <option key={name} value={name}>
                  {code} - {name}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
            ▼
          </div>
        </div>

        {/* Commune */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">📍</span>
          <input
            type="text"
            placeholder="Commune..."
            value={filters.commune}
            onChange={e => onChange('commune', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>


      </div>

      {/* Bouton reset */}
      {(filters.wilaya || filters.commune) && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              onChange('wilaya', '');
              onChange('commune', '');
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
