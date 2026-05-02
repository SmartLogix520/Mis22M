import { useRef, useEffect, useState } from "react";
import { productsAPI, type Product } from "../../../services/api";
import ProductCard from "../../products/components/ProductCard";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { motion } from "framer-motion";

export default function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ isBestSeller: true, limit: 10 })
      .then((res) => {
        // Le backend filtre si inStock = true et isActive = true.
        // Si isBestSeller = true n'est pas géré nativement via product filter backend,
        // on fait un filter local pour le moment, ou on affiche directement s'il le remonte.
        const best = res.data.products.filter(p => p.isBestSeller === true);
        setBestSellers(best.length > 0 ? best : res.data.products); 
        // fallback au produits generaux si pas encore de bestsellers tagués en DB
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 250;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading || bestSellers.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="px-4 py-10"
    >
      <h2 className="text-center font-semibold mb-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
        Best Sellers
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-50"
        >
          <BiChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar py-2"
        >
          {bestSellers.map((item) => (
            <div key={item.id} className="min-w-[220px]">
              <ProductCard
                id={item.id}
                image={item.images?.[0] || item.imageUrl || "/assets/placeholder.png"}
                name={item.name}
                price={item.price || 0}
                description={item.shortDesc || item.description || ""}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-50"
        >
          <BiChevronRight size={24} />
        </button>
      </div>
    </motion.section>
  );
}

