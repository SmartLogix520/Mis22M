// src/features/admin/components/ProductForm.tsx
import { useState, useRef } from 'react';
import { productsAPI, uploadAPI, type Product, type Category } from '../../../services/api';

interface Props {
  product: Product | null;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const inputCls = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition';
const labelCls = 'block text-xs text-white/40 mb-1.5';

export default function ProductForm({ product, categories, onSuccess, onCancel }: Props) {
  const [openSection, setOpenSection] = useState<string>('basic');

  const [form, setForm] = useState({
    name:              product?.name              ?? '',
    description:       product?.description       ?? '',
    shortDesc:         product?.shortDesc         ?? '',
    testDescription:   product?.testDescription   ?? '',
    pack:              product?.pack              ?? '',
    category:          product?.category          ?? '',
    ranges:            product?.ranges            ?? [] as string[],
    skinType:          product?.skinType?.join(', ')        ?? '',
    volume:            product?.volume            ?? '',
    price:             product?.price             ?? '',
    oldPrice:          product?.oldPrice          ?? '',
    imageUrl:          product?.imageUrl          ?? '',
    images:            product?.images?.join(', ')          ?? '',
    activeIngredients: product?.activeIngredients?.join(', ') ?? '',
    ingredients:       product?.ingredients?.join(', ')      ?? '',
    usageInstructions: product?.usageInstructions ?? '',
    benefits:          product?.benefits?.join(', ')         ?? '',
    inStock:           product?.inStock           ?? true,
    isActive:          product?.isActive          ?? true,
    isBestSeller:      product?.isBestSeller      ?? false,
  });

  // Gestion des couleurs avec nom + valeur hex
  const [colorsList, setColorsList] = useState<{ name: string; hex: string }[]>(
    () => {
      if (!product?.colors?.length) return [];
      return product.colors.map(c => {
        // Format stocké : "02 Caramel Caress|#d4a574" ou juste "02 Caramel Caress"
        const parts = c.split('|');
        return { name: parts[0] ?? c, hex: parts[1] ?? '#d4a574' };
      });
    }
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex]   = useState('#d4a574');

  const [saving,         setSaving]         = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [rangeInput,     setRangeInput]     = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Upload images ────────────────────────────────────────────────────────
  const handleFiles = async (files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;
    setUploadingImage(true);
    try {
      const res = await uploadAPI.uploadMultiple(valid);
      const urls = res.data.urls;
      setForm(f => {
        const currentImages = f.images ? f.images.split(',').map(s => s.trim()).filter(Boolean) : [];
        let newMain = f.imageUrl;
        let newRest = [...currentImages];
        for (const url of urls) {
          if (!newMain) newMain = url;
          else newRest.push(url);
        }
        return { ...f, imageUrl: newMain, images: newRest.join(', ') };
      });
    } catch {
      setError("Erreur lors de l'upload des images. Vérifiez la connexion au serveur.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (url: string) => {
    setForm(f => {
      const rest = f.images ? f.images.split(',').map(s => s.trim()).filter(Boolean) : [];
      if (f.imageUrl === url) {
        const nextMain = rest.length > 0 ? rest[0] : '';
        const curRest  = rest.length > 0 ? rest.slice(1) : [];
        return { ...f, imageUrl: nextMain, images: curRest.join(', ') };
      }
      return { ...f, images: rest.filter(u => u !== url).join(', ') };
    });
  };

  // ─── Couleurs ─────────────────────────────────────────────────────────────
  const addColor = () => {
    if (!newColorName.trim()) return;
    setColorsList(prev => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
    setNewColorHex('#d4a574');
  };

  const removeColor = (idx: number) => {
    setColorsList(prev => prev.filter((_, i) => i !== idx));
  };

  // ─── Soumission ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price:             form.price    ? parseFloat(String(form.price))    : undefined,
        oldPrice:          form.oldPrice ? parseFloat(String(form.oldPrice)) : undefined,
        skinType:          form.skinType.split(',').map(s => s.trim()).filter(Boolean),
        images:            form.images.split(',').map(s => s.trim()).filter(Boolean),
        activeIngredients: form.activeIngredients.split(',').map(s => s.trim()).filter(Boolean),
        ingredients:       form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        benefits:          form.benefits.split(',').map(s => s.trim()).filter(Boolean),
        // Couleurs stockées au format "Nom nuance|#hex"
        colors:            colorsList.map(c => `${c.name}|${c.hex}`),
      };
      if (product) {
        await productsAPI.update(product.id, payload);
      } else {
        await productsAPI.create(payload);
      }
      onSuccess();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Composants utilitaires sous forme de fonctions (évite le re-render qui perd le focus) ───
  const renderField = (label: string, k: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={placeholder} className={inputCls} />
    </div>
  );

  const renderTextarea = (label: string, k: keyof typeof form, placeholder = '', rows = 3) => (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={placeholder} rows={rows} className={`${inputCls} resize-none`} />
    </div>
  );

  const renderSectionHeader = (id: string, label: string) => (
    <button
      type="button"
      onClick={() => setOpenSection(openSection === id ? '' : id)}
      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl text-sm font-medium text-white/80 transition-all"
    >
      <span>{label}</span>
      <span className={`transition-transform duration-200 ${openSection === id ? 'rotate-180' : ''}`}>▾</span>
    </button>
  );

  const allImages = [form.imageUrl, ...(form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [])].filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-3">
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

      {/* ─── 1. Informations de base ─────────────────────────────────────── */}
      {renderSectionHeader('basic', '📋 Informations de base')}
      {openSection === 'basic' && (
        <div className="p-4 border border-white/10 rounded-xl space-y-4 bg-white/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderField('Nom du produit *', 'name', 'text', 'Ex: Crème Hydratante SPF 50')}
            {renderField('Volume / Contenance', 'volume', 'text', '150ml, 50g, etc.')}
          </div>
          {renderField('Description courte (sous le titre)', 'shortDesc', 'text', 'Radiant Finish Powder Blush — une phrase accrocheuse')}
        </div>
      )}

      {/* ─── 2. Images ───────────────────────────────────────────────────── */}
      {renderSectionHeader('media', '🖼️ Images du produit')}
      {openSection === 'media' && (
        <div className="p-4 border border-white/10 rounded-xl space-y-4 bg-white/2">
          <div>
            <label className={labelCls}>Glisser-déposer vos images (JPG, PNG, GIF — max 20MB)</label>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/10 bg-white/5 rounded-xl p-8 text-center hover:border-violet-500 hover:bg-white/10 transition cursor-pointer"
            >
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={e => e.target.files && handleFiles(Array.from(e.target.files))} />
              {uploadingImage ? (
                <p className="text-sm text-violet-400 animate-pulse">⏳ Upload en cours...</p>
              ) : (
                <>
                  <p className="text-3xl mb-2">🖼️</p>
                  <p className="text-sm text-white/60">Glissez vos images ici ou cliquez pour parcourir</p>
                  <p className="text-xs text-white/30 mt-1">La 1ère image sera l'image principale</p>
                </>
              )}
            </div>
          </div>

          {allImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((url, i) => (
                <div key={url + i} className="relative shrink-0 w-24 h-24 bg-black/50 rounded-xl overflow-hidden border border-white/10 group">
                  <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-violet-600/90 text-white text-[9px] text-center font-bold py-0.5">PRINCIPALE</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 3. Prix & Catégorie ─────────────────────────────────────────── */}
      {renderSectionHeader('pricing', '💰 Prix & Catégorie')}
      {openSection === 'pricing' && (
        <div className="p-4 border border-white/10 rounded-xl space-y-4 bg-white/2">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Catégorie *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                <option value="">Choisir...</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            {renderField('Prix Actuel (DA)', 'price', 'number', '1990')}
            {renderField('Ancien Prix Barré', 'oldPrice', 'number', '2490')}
          </div>

          {/* Gammes — tags */}
          <div>
            <label className={labelCls}>Gammes</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.ranges.map(r => (
                <span key={r} className="flex items-center gap-1 text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full">
                  {r}
                  <button type="button" onClick={() => setForm(f => ({ ...f, ranges: f.ranges.filter(x => x !== r) }))} className="ml-0.5 hover:text-white">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={rangeInput} onChange={e => setRangeInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (rangeInput.trim()) { setForm(f => ({ ...f, ranges: [...f.ranges, rangeInput.trim()] })); setRangeInput(''); } }}} placeholder="Ajouter une gamme (Entrée)" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition" />
              <button type="button" onClick={() => { if (rangeInput.trim()) { setForm(f => ({ ...f, ranges: [...f.ranges, rangeInput.trim()] })); setRangeInput(''); }}} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white transition">+</button>
            </div>
          </div>

          {renderField('Types de peau (virgules)', 'skinType', 'text', 'grasse, mixte, sensible, acnéique')}
        </div>
      )}

      {/* ─── 4. Sections accordéon (style KIKO) ─────────────────────────── */}
      {renderSectionHeader('description', '📝 Description & Sections accordéon')}
      {openSection === 'description' && (
        <div className="p-4 border border-white/10 rounded-xl space-y-4 bg-white/2">
          <p className="text-xs text-white/30 -mt-1">Ces sections s'affichent en accordéon sur la page produit (style KIKO Milano)</p>

          {renderTextarea('DESCRIPTION — Présentation générale *', 'description', 'Description complète du produit...', 4)}
          {renderTextarea('TEST — Texture & formule (ex: légère, fondante, longue tenue...)', 'testDescription', 'Décrivez la texture, la formule, l\'expérience à l\'application...', 3)}
          {renderTextarea('RÉSULTATS — Bénéfices clés (virgules : Purifie, Matifie, Hydrate)', 'benefits', 'Purifie les pores, Matifie, Réduit les imperfections', 2)}
          {renderTextarea('HOW TO USE — Instructions d\'utilisation', 'usageInstructions', 'Appliquer matin et soir sur peau propre et sèche...', 3)}
          {renderTextarea('PACK — Informations emballage / contenant', 'pack', 'Flacon pompe en verre recyclable, 150ml. Sans BPA...', 2)}
        </div>
      )}

      {/* ─── 5. Couleurs disponibles ─────────────────────────────────────── */}
      {renderSectionHeader('colors', '🎨 Couleurs / Nuances disponibles')}
      {openSection === 'colors' && (
        <div className="p-4 border border-white/10 rounded-xl space-y-4 bg-white/2">
          <p className="text-xs text-white/30 -mt-1">Ajoutez les différentes nuances du produit (ex: "02 Caramel Caress", "03 Cushion Coral")</p>

          {/* Liste des couleurs */}
          {colorsList.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {colorsList.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs text-white">{c.name}</span>
                  <button type="button" onClick={() => removeColor(i)} className="text-white/30 hover:text-red-400 text-xs ml-1">✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Ajouter une couleur */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className={labelCls}>Nom de la nuance</label>
              <input type="text" value={newColorName} onChange={e => setNewColorName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); }}} placeholder="02 Caramel Caress" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Couleur</label>
              <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
            </div>
            <button type="button" onClick={addColor} className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm transition mb-0.5">
              + Ajouter
            </button>
          </div>
        </div>
      )}

      {/* ─── 6. Composition ──────────────────────────────────────────────── */}
      {renderSectionHeader('ingredients', '🧪 Composition')}
      {openSection === 'ingredients' && (
        <div className="p-4 border border-white/10 rounded-xl space-y-4 bg-white/2">
          {renderField('Ingrédients actifs (virgules)', 'activeIngredients', 'text', 'Acide salicylique 2%, Niacinamide, Zinc PCA')}
          {renderTextarea('INGREDIENT LIST — Liste complète des ingrédients', 'ingredients', 'AQUA, GLYCERIN, NIACINAMIDE, ZINC PCA, ...', 4)}
        </div>
      )}

      {/* ─── 7. Utilisation & Bénéfices (résumé) ────────────────────────── */}
      {renderSectionHeader('usage', '✨ Paramètres avancés')}
      {openSection === 'usage' && (
        <div className="p-4 border border-white/10 rounded-xl space-y-4 bg-white/2">
          <p className="text-xs text-white/30 -mt-1">Ces champs sont utilisés pour les filtres et la recherche</p>
        </div>
      )}

      {/* ─── 8. Paramètres ───────────────────────────────────────────────── */}
      {renderSectionHeader('settings', '⚙️ Paramètres de visibilité')}
      {openSection === 'settings' && (
        <div className="p-4 border border-white/10 rounded-xl bg-white/2">
          <div className="flex gap-6">
            {[{ key: 'isActive', label: '🟢 Actif' }, { key: 'inStock', label: '📦 En stock' }, { key: 'isBestSeller', label: '⭐️ Best Seller' }].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={Boolean(form[key as keyof typeof form])} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 rounded accent-violet-500" />
                <span className="text-sm text-white/70">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ─── Actions ─────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-3 pt-2 border-t border-white/10 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-white/40 hover:text-white border border-white/10 rounded-lg transition-colors">Annuler</button>
        <button type="submit" disabled={saving || uploadingImage} className="px-5 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg transition-all">
          {saving ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer le produit'}
        </button>
      </div>
    </form>
  );
}
