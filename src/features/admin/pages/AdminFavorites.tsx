// src/features/admin/pages/AdminFavorites.tsx
import { useState, useEffect } from 'react';
import { favoriteVideosAPI, type FavoriteVideo } from '../../../services/api';

export default function AdminFavorites() {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<FavoriteVideo | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ title: '', video: '', thumbnail: '', isActive: true, order: 0 });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    favoriteVideosAPI.getAll()
      .then(res => { setFavorites(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (fav: FavoriteVideo) => {
    setEditItem(fav);
    setForm({ title: fav.title, video: fav.video, thumbnail: fav.thumbnail ?? '', isActive: fav.isActive, order: fav.order ?? 0 });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', video: '', thumbnail: '', isActive: true, order: favorites.length });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.video.trim()) return setFormError('Le titre et la vidéo sont requis');
    setSaving(true);
    setFormError(null);
    try {
      if (editItem) {
        await favoriteVideosAPI.update(editItem.id, form);
      } else {
        await favoriteVideosAPI.create(form);
      }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer le favori "${title}" ?`)) return;
    setDeleting(id);
    try { await favoriteVideosAPI.delete(id); load(); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (fav: FavoriteVideo) => {
    try { await favoriteVideosAPI.update(fav.id, { isActive: !fav.isActive }); load(); }
    catch (e: unknown) { alert((e as Error).message); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Vidéos Favorites</h1>
          <p className="text-white/40 text-sm">{favorites.length} vidéo{favorites.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all">
          <span>+</span> Ajouter
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />)
        ) : favorites.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-white/30">
            <p className="text-4xl mb-3">🎥</p>
            <p>Aucune vidéo favorite pour l'instant.</p>
          </div>
        ) : (
          favorites.map(fav => (
            <div key={fav.id} className={`bg-white/5 border rounded-2xl p-5 transition-all flex flex-col ${fav.isActive ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
              <div className="relative w-full h-32 bg-black/40 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                {fav.thumbnail ? (
                  <img src={fav.thumbnail} alt={fav.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-white/20">▶</span>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-semibold text-white line-clamp-1">{fav.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${fav.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {fav.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-xs text-white/40 mb-4 truncate" title={fav.video}>{fav.video}</p>
              <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
                <button onClick={() => openEdit(fav)} className="text-xs text-white/40 hover:text-white px-2 py-1 hover:bg-white/5 rounded-lg transition-colors">✏️ Modifier</button>
                <button onClick={() => toggleActive(fav)} className="text-xs text-white/40 hover:text-white px-2 py-1 hover:bg-white/5 rounded-lg transition-colors">{fav.isActive ? '🔴 Masquer' : '🟢 Afficher'}</button>
                <button onClick={() => handleDelete(fav.id, fav.title)} disabled={deleting === fav.id} className="text-xs text-red-400/60 hover:text-red-400 px-2 py-1 hover:bg-red-500/5 rounded-lg transition-colors ml-auto">
                  {deleting === fav.id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1d27] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{editItem ? 'Modifier le favori' : 'Nouveau favori'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white text-xl transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{formError}</div>}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Titre *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Tuto Teint Parfait" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">URL de la vidéo *</label>
                <input type="url" value={form.video} onChange={e => setForm(f => ({ ...f, video: e.target.value }))} placeholder="/videos/video.mp4" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Miniature (Optionnel)</label>
                <input type="text" value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} placeholder="/images/bg.png" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-white/40 mb-1.5">Ordre d'affichage</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500 transition" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded accent-violet-500" />
                <span className="text-sm text-white/60">Active (Visible publiquement)</span>
              </label>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-white/40 hover:text-white border border-white/10 rounded-lg transition-colors">Annuler</button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg transition-all">
                  {saving ? 'Enregistrement...' : editItem ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
