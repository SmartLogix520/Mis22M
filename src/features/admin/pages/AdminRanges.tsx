// src/features/admin/pages/AdminRanges.tsx
import { useState, useEffect } from 'react';
import { rangesAPI, type Range } from '../../../services/api';

export default function AdminRanges() {
  const [ranges, setRanges] = useState<Range[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Range | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', description: '', color: '#8b5cf6', isActive: true });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    rangesAPI.getAll(true)
      .then(res => { setRanges(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (range: Range) => {
    setEditItem(range);
    setForm({ name: range.name, description: range.description ?? '', color: range.color ?? '#8b5cf6', isActive: range.isActive });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '', color: '#8b5cf6', isActive: true });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError('Le nom est requis');
    setSaving(true);
    setFormError(null);
    try {
      if (editItem) { await rangesAPI.update(editItem.id, form); }
      else { await rangesAPI.create(form); }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la gamme "${name}" ?`)) return;
    setDeleting(id);
    try { await rangesAPI.delete(id); load(); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (range: Range) => {
    try { await rangesAPI.update(range.id, { isActive: !range.isActive }); load(); }
    catch (e: unknown) { alert((e as Error).message); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gammes</h1>
          <p className="text-white/40 text-sm">{ranges.length} gamme{ranges.length > 1 ? 's' : ''} — utilisées pour filtrer produits et points de vente</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all">
          <span>+</span> Ajouter
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)
        ) : ranges.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-white/30">
            <p className="text-4xl mb-3">🎯</p>
            <p>Aucune gamme. Créez-en une !</p>
            <p className="text-xs mt-2">Les gammes apparaîtront dans les filtres de la page "Points de vente".</p>
          </div>
        ) : (
          ranges.map(range => (
            <div key={range.id} className={`bg-white/5 border rounded-2xl p-5 transition-all ${range.isActive ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: range.color ?? '#8b5cf6' }} />
                  <p className="font-semibold text-white">{range.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${range.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {range.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              {range.description && <p className="text-xs text-white/40 mb-3 line-clamp-2">{range.description}</p>}
              <p className="text-xs text-white/20 mb-3">Ordre : {range.order}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(range)} className="text-xs text-white/40 hover:text-white px-2 py-1 hover:bg-white/5 rounded-lg transition-colors">✏️ Modifier</button>
                <button onClick={() => toggleActive(range)} className="text-xs text-white/40 hover:text-white px-2 py-1 hover:bg-white/5 rounded-lg transition-colors">{range.isActive ? '🔴 Désactiver' : '🟢 Activer'}</button>
                <button onClick={() => handleDelete(range.id, range.name)} disabled={deleting === range.id} className="text-xs text-red-400/60 hover:text-red-400 px-2 py-1 hover:bg-red-500/5 rounded-lg transition-colors ml-auto">
                  {deleting === range.id ? '...' : '🗑️'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1d27] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{editItem ? 'Modifier la gamme' : 'Nouvelle gamme'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white text-xl transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{formError}</div>}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Nom * <span className="text-white/20">(apparaît dans les filtres)</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Parapharmacie" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Couleur du badge</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                  <span className="text-sm text-white/40 font-mono">{form.color}</span>
                  <span className="ml-2 text-xs px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: form.color }}>Aperçu</span>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded accent-violet-500" />
                <span className="text-sm text-white/60">Active (visible dans les filtres)</span>
              </label>
              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
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
