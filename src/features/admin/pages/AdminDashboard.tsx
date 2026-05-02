// src/features/admin/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { storesAPI, productsAPI, categoriesAPI, rangesAPI } from '../../../services/api';

interface Stats {
  stores: number;
  products: number;
  categories: number;
  ranges: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ stores: 0, products: 0, categories: 0, ranges: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      storesAPI.getAll({ limit: 1 }),
      productsAPI.getAll({ limit: 1 }),
      categoriesAPI.getAll(true),
      rangesAPI.getAll(true),
    ]).then(([s, p, c, r]) => {
      setStats({
        stores:     s.status === 'fulfilled' ? s.value.data.pagination.total : 0,
        products:   p.status === 'fulfilled' ? p.value.data.pagination.total : 0,
        categories: c.status === 'fulfilled' ? c.value.data.length : 0,
        ranges:     r.status === 'fulfilled' ? r.value.data.length : 0,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Points de vente', value: stats.stores,     icon: '📍', color: 'from-blue-500 to-cyan-500',    link: '/admin/stores' },
    { label: 'Produits',        value: stats.products,   icon: '📦', color: 'from-violet-500 to-purple-600', link: '/admin/products' },
    { label: 'Catégories',      value: stats.categories, icon: '🗂️', color: 'from-orange-400 to-pink-500',   link: '/admin/categories' },
    { label: 'Gammes',          value: stats.ranges,     icon: '🎯', color: 'from-green-400 to-emerald-600', link: '/admin/ranges' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Vue d'ensemble de la base de données Mis22M</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(card => (
          <a
            key={card.label}
            href={card.link}
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">{card.label}</p>
            {loading ? (
              <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold text-white">{card.value}</p>
            )}
          </a>
        ))}
      </div>

      {/* Info API */}
      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">API</h2>
        <div className="space-y-2 text-sm font-mono">
          {['/api/health', '/api/stores', '/api/products', '/api/categories', '/api/ranges'].map(endpoint => (
            <div key={endpoint} className="flex items-center gap-3">
              <span className="text-green-400 text-xs">GET</span>
              <span className="text-white/40">{window.location.origin}{endpoint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
