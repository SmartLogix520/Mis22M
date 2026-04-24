import { useState } from "react";
import { Link } from "react-router-dom";
import { BiMenu, BiSearch, BiUser } from "react-icons/bi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--primary)] text-[var(--text)] border-b border-[var(--border)] shadow-custom">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden hover:opacity-60 transition"
            onClick={() => setOpen(!open)}
          >
            <BiMenu size={26} />
          </button>

          <button className="hover:text-[var(--hover)] transition">
            <BiSearch size={20} />
          </button>

          {/* Desktop logo */}
          <Link to="/" className="hidden md:flex items-center ml-4">
            <img src="/assets/logo.jpg" alt="logo" className="h-9" />
          </Link>
        </div>

        {/* CENTER MENU (desktop only) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/categories"
            className="hover:text-[var(--hover)] transition"
          >
            Produits
          </Link>

          <Link
            to="/best-sellers"
            className="hover:text-[var(--hover)] transition"
          >
            Best Sellers
          </Link>

          <Link to="/reviews" className="hover:text-[var(--hover)] transition">
            Reviews
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button className="hover:text-[var(--hover)] transition">
            <BiUser size={22} />
          </button>
        </div>

        {/* MOBILE LOGO */}
        <Link to="/" className="md:hidden absolute left-1/2 -translate-x-1/2">
          <img src="/assets/logo.jpg" alt="logo" className="h-8" />
        </Link>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-[var(--primary)] border-t border-[var(--border)] px-4 py-3 flex flex-col gap-3">
          <Link
            to="/categories"
            onClick={() => setOpen(false)}
            className="py-2 hover:text-[var(--hover)] transition"
          >
            Produits
          </Link>

          <Link
            to="/best-sellers"
            onClick={() => setOpen(false)}
            className="py-2 hover:text-[var(--hover)] transition"
          >
            Best Sellers
          </Link>

          <Link
            to="/reviews"
            onClick={() => setOpen(false)}
            className="py-2 hover:text-[var(--hover)] transition"
          >
            Reviews
          </Link>
        </div>
      )}
    </header>
  );
}
