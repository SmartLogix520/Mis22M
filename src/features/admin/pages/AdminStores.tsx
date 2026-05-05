// src/features/admin/pages/AdminStores.tsx
import { useState, useEffect, useCallback } from 'react';
import { storesAPI, rangesAPI, type Store, type Range } from '../../../services/api';
import StoreForm from '../components/StoreForm';

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [ranges, setRanges] = useState<Range[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editStore, setEditStore] = useState<Store | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStores = useCallback(() => {
    setLoading(true);
    storesAPI.getAll({ search, limit: 50 })
      .then(res => { setStores(res.data.stores); setTotal(res.data.pagination.total); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { loadStores(); }, [loadStores]);
  useEffect(() => { rangesAPI.getAll(true).then(res => setRanges(res.data)).catch(console.error); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    setDeleting(id);
    try {
      await storesAPI.delete(id);
      loadStores();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditStore(null);
    loadStores();
  };

  return (
    <div className="p-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Points de vente</h1>
          <p className="text-white/40 text-sm">{total} point{total > 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={() => { setEditStore(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all"
        >
          <span>+</span> Ajouter
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Rechercher un point de vente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition"
        />
      </div>

      {/* Erreur */}
      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      {/* Tableau */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : stores.length === 0 ? (
          <div className="py-16 text-center text-white/30">
            <p className="text-4xl mb-3">📍</p>
            <p>Aucun point de vente{search ? ' pour cette recherche' : ''}.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Nom</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Ville</th>
                <th className="px-5 py-3 text-left hidden lg:table-cell">Gammes</th>
                <th className="px-5 py-3 text-left">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stores.map(store => (
                <tr key={store.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3 font-medium text-white">
                    {store.name}
                    {store.isFeatured && <span className="ml-2 text-yellow-400 text-xs">⭐</span>}
                  </td>
                  <td className="px-5 py-3 text-white/50 hidden md:table-cell">{store.wilaya} {store.commune}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {store.ranges.slice(0, 3).map(r => (
                        <span key={r} className="text-xs bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${store.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {store.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditStore(store); setShowForm(true); }} className="text-xs text-white/40 hover:text-white transition-colors px-2 py-1 hover:bg-white/5 rounded-lg">✏️ Modifier</button>
                      <button onClick={() => handleDelete(store.id, store.name)} disabled={deleting === store.id} className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 hover:bg-red-500/5 rounded-lg">
                        {deleting === store.id ? '...' : '🗑️ Supprimer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1d27] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{editStore ? 'Modifier le point de vente' : 'Nouveau point de vente'}</h2>
              <button onClick={() => { setShowForm(false); setEditStore(null); }} className="text-white/40 hover:text-white text-xl transition-colors">✕</button>
            </div>
            <StoreForm store={editStore} ranges={ranges} onSuccess={handleFormSuccess} onCancel={() => { setShowForm(false); setEditStore(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}
