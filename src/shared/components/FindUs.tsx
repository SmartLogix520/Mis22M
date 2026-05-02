import { BiMap } from "react-icons/bi";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function LocationButton() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Icône localisation */}
      <BiMap className="w-12 h-12 text-[var(--primary)] mb-3" />

      {/* Bouton */}
      <Button
        variant="default"
        size="lg"
        onClick={() => navigate('/points-de-vente')}
        className="text-lg font-semibold shadow-md"
      >
        Trouver un point de vente
      </Button>
    </div>
  );
}
