// src/features/stores/components/StoreCard.tsx
import type { Store } from '../../../services/api';

interface Props {
  store: Store;
}

export default function StoreCard({ store }: Props) {
  return (
    <article className="group bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col gap-3">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {store.name}
          </h3>
          {store.isFeatured && (
            <span className="inline-block text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full mt-1">
              ⭐ Mis en avant
            </span>
          )}
        </div>
        {store.distance !== undefined && (
          <span className="shrink-0 text-xs font-medium bg-secondary/10 text-secondary px-2 py-1 rounded-full">
            {store.distance} km
          </span>
        )}
      </div>

      {/* Adresse */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <span className="mt-0.5 shrink-0">📍</span>
        <span className="leading-snug">
          {store.address}, {store.commune} {store.wilaya}
        </span>
      </div>

      {/* Gammes */}
      {store.ranges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {store.ranges.map(range => (
            <span
              key={range}
              className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border"
            >
              {range}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-border/50">
        {store.phone && (
          <a
            href={`tel:${store.phone}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span>📞</span>
            <span>{store.phone}</span>
          </a>
        )}
        {store.googleMapsUrl && (
          <a
            href={store.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Itinéraire →
          </a>
        )}
      </div>

      {/* Horaires si disponibles */}
      {store.openingHours && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground transition-colors">🕐 Horaires</summary>
          <div className="mt-2 space-y-0.5 pl-2">
            {Object.entries(store.openingHours).map(([day, hours]) => (
              <div key={day} className="flex justify-between gap-4">
                <span className="capitalize">{day}</span>
                <span>{String(hours)}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </article>
  );
}
