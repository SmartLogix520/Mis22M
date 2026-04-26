import { useRef } from "react";
import { products } from "../../products/constants/products";
import ProductCard from "../../products/components/ProductCard"; // adapte le chemin
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { motion } from "framer-motion";

export default function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 250;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  const bestSellers = products.filter((p) => p.isBestSeller);
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="px-4 py-10"
    >
      {/* title */}
      <h2 className="text-center font-semibold mb-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
        Best Sellers
      </h2>

      <div className="relative">
        {/* left button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          <BiChevronLeft size={24} />
        </button>

        {/* scroll area */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {bestSellers.map((item) => (
            <div key={item.id} className="min-w-[220px]">
              <ProductCard
                id={item.id}
                image={item.images[0]}
                name={item.name}
                price={item.price}
                description={item.description}
              />
            </div>
          ))}
        </div>

        {/* right button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
        >
          <BiChevronRight size={24} />
        </button>
      </div>
    </motion.section>
  );
}
