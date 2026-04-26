import { BiMap } from "react-icons/bi";
import { Button } from "./ui/button";

export default function LocationButton() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Icône localisation */}
      <BiMap className="w-12 h-12 text-[var(--primary)] mb-3" />

      {/* Bouton */}
      <Button
        variant="default"
        size="lg"
        className="text-lg font-semibold shadow-md"
      >
        Trouver un point de vente
      </Button>
    </div>
  );
}
