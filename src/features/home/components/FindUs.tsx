import { BiMap } from "react-icons/bi";

export default function LocationButton() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Icône localisation */}
      <BiMap className="w-12 h-12 text-[var(--primary)] mb-3" />

      {/* Bouton */}
      <button className="px-10 py-4 bg-[var(--primary)] text-black text-lg font-semibold shadow-md hover:opacity-90 transition">
        Trouver un point de vente
      </button>
    </div>
  );
}
