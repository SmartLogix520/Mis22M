// src/features/admin/pages/AdminProducts.tsx
import { useState, useEffect, useCallback } from 'react';
import { productsAPI, categoriesAPI, type Product, type Category } from '../../../services/api';
import ProductForm from '../components/ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(() => {
    setLoading(true);
    productsAPI.getAll({ search, limit: 50 })
      .then(res => { setProducts(res.data.products); setTotal(res.data.pagination.total); setError(null); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { categoriesAPI.getAll(true).then(res => setCategories(res.data)).catch(console.error); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    setDeleting(id);
    try {
      await productsAPI.delete(id);
      loadProducts();
    } catch (e: unknown) {
      alert((e as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-white/40 text-sm">{total} produit{total > 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium transition-all"
        >
          <span>+</span> Ajouter
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition"
        />
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-white/30">
            <p className="text-4xl mb-3">📦</p>
            <p>Aucun produit{search ? ' pour cette recherche' : ''}.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Produit</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Catégorie</th>
                <th className="px-5 py-3 text-left hidden lg:table-cell">Prix</th>
                <th className="px-5 py-3 text-left">Statut</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-white/5" />
                      )}
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-xs text-white/30">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-white/50 hidden md:table-cell">{product.category}</td>
                  <td className="px-5 py-3 text-white/50 hidden lg:table-cell">
                    {product.price ? `${product.price.toFixed(2)} €` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${product.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${product.inStock ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {product.inStock ? 'En stock' : 'Rupture'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditProduct(product); setShowForm(true); }} className="text-xs text-white/40 hover:text-white transition-colors px-2 py-1 hover:bg-white/5 rounded-lg">✏️ Modifier</button>
                      <button onClick={() => handleDelete(product.id, product.name)} disabled={deleting === product.id} className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 hover:bg-red-500/5 rounded-lg">
                        {deleting === product.id ? '...' : '🗑️ Supprimer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1d27] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{editProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={() => { setShowForm(false); setEditProduct(null); }} className="text-white/40 hover:text-white text-xl transition-colors">✕</button>
            </div>
            <ProductForm
              product={editProduct}
              categories={categories}
              onSuccess={() => { setShowForm(false); setEditProduct(null); loadProducts(); }}
              onCancel={() => { setShowForm(false); setEditProduct(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
