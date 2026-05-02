// src/features/admin/pages/AdminCategories.tsx
import { useState, useEffect, useRef } from 'react';
import { categoriesAPI, uploadAPI, type Category } from '../../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1', isActive: true, imageUrl: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    categoriesAPI.getAll(true)
      .then(res => { setCategories(res.data); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (cat: Category) => {
    setEditItem(cat);
    setForm({ name: cat.name, description: cat.description ?? '', color: cat.color ?? '#6366f1', isActive: cat.isActive, imageUrl: cat.imageUrl ?? '' });
    setShowForm(true);
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', description: '', color: '#6366f1', isActive: true, imageUrl: '' });
    setShowForm(true);
  };

  const handleFiles = async (files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;
    setUploadingImage(true);
    try {
      const res = await uploadAPI.uploadMultiple(valid);
      if (res.data.urls.length > 0) {
        setForm(f => ({ ...f, imageUrl: res.data.urls[0] }));
      }
    } catch (err: any) {
      alert("Erreur lors de l'upload des images.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError('Le nom est requis');
    setSaving(true);
    setFormError(null);
    try {
      if (editItem) {
        await categoriesAPI.update(editItem.id, form);
      } else {
        await categoriesAPI.create(form);
      }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;
    setDeleting(id);
    try { await categoriesAPI.delete(id); load(); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (cat: Category) => {
    try { await categoriesAPI.update(cat.id, { isActive: !cat.isActive }); load(); }
    catch (e: unknown) { alert((e as Error).message); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Catégories</h1>
          <p className="text-white/40 text-sm">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all">
          <span>+</span> Ajouter
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)
        ) : categories.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-white/30">
            <p className="text-4xl mb-3">🗂️</p>
            <p>Aucune catégorie. Créez-en une !</p>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className={`bg-white/5 border rounded-2xl p-5 transition-all ${cat.isActive ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-10 h-10 rounded-lg object-cover bg-white/5 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center border border-white/10" style={{ backgroundColor: cat.color ?? '#6366f1' }}>
                       <span className="text-xs font-bold text-white/50">{cat.name.slice(0,2).toUpperCase()}</span>
                    </div>
                  )}
                  <p className="font-semibold text-white">{cat.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${cat.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {cat.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              {cat.description && <p className="text-xs text-white/40 mb-3 line-clamp-2">{cat.description}</p>}
              <div className="flex gap-2 mt-auto">
                <button onClick={() => openEdit(cat)} className="text-xs text-white/40 hover:text-white px-2 py-1 hover:bg-white/5 rounded-lg transition-colors">✏️ Modifier</button>
                <button onClick={() => toggleActive(cat)} className="text-xs text-white/40 hover:text-white px-2 py-1 hover:bg-white/5 rounded-lg transition-colors">{cat.isActive ? '🔴 Désactiver' : '🟢 Activer'}</button>
                <button onClick={() => handleDelete(cat.id, cat.name)} disabled={deleting === cat.id} className="text-xs text-red-400/60 hover:text-red-400 px-2 py-1 hover:bg-red-500/5 rounded-lg transition-colors ml-auto">
                  {deleting === cat.id ? '...' : '🗑️'}
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
              <h2 className="text-lg font-bold text-white">{editItem ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white text-xl transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{formError}</div>}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Nom *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Nettoyants" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Image de la catégorie (Glisser-déposer)</label>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
                  className="w-full relative border-2 border-dashed border-white/10 bg-white/5 rounded-lg p-6 text-center hover:border-violet-500 hover:bg-white/10 transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} 
                  />
                  {uploadingImage ? (
                    <p className="text-sm text-white animate-pulse">Upload en cours...</p>
                  ) : form.imageUrl ? (
                    <div className="relative inline-block w-full max-w-xs aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/10 group">
                      <img src={form.imageUrl} alt="img" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setForm(f => ({...f, imageUrl: ''}))}} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-white/60 mb-1">Glissez et déposez une image ici</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Couleur</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
                    <span className="text-sm text-white/40 font-mono">{form.color}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Statut public</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg transition-colors hover:bg-white/10">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded accent-violet-500" />
                    <span className="text-sm text-white">Active</span>
                  </label>
                </div>
              </div>
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
