import { useRef } from "react";
import { motion } from "framer-motion";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import ProductCard from "./ProductCard"; // adapte le chemin si besoin
import type { Product } from "../../../services/api";

type Props = {
  products: Product[];
  title?: string;
};

export default function RelatedProducts({
  products,
  title = "Produits similaires",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-10 flex justify-center"
    >
      <div className="w-[80%]">
        {/* title */}
        <h2 className="text-center font-semibold mb-6 text-xl">{title}</h2>

        <div className="relative">
          {/* left */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
          >
            <BiChevronLeft size={24} />
          </button>

          {/* scroll */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {products.map((item) => (
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

          {/* right */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
          >
            <BiChevronRight size={24} />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
