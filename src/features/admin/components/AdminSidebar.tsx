// src/features/admin/components/AdminSidebar.tsx
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/stores',    icon: '📍', label: 'Points de vente' },
  { to: '/admin/products',  icon: '📦', label: 'Produits' },
  { to: '/admin/categories',icon: '🗂️', label: 'Catégories' },
  { to: '/admin/ranges',    icon: '🎯', label: 'Gammes' },
  { to: '/admin/favorites', icon: '⭐', label: 'Favoris Vidéos' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-60 shrink-0 min-h-screen bg-[#16181f] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold">
            M
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Mis22M</p>
            <p className="text-xs text-white/40">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div className="px-4 py-4 border-t border-white/5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <span>↗</span>
          <span>Voir le site public</span>
        </a>
      </div>
    </aside>
  );
}
