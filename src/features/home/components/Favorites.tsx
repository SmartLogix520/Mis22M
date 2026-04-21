import { favorites } from "../constants/favourites";
import VideoCard from "./VideoCard";
import { motion } from "framer-motion";

export default function Favorites() {
  return (
    <motion.section
      className="px-4 py-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-center font-semibold mb-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
        Découvrez les favoris du moment !
      </h2>

      <div className="relative">
        {/* Carousel */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {favorites.map((item, index) => (
            <motion.div
              key={item.id}
              className="min-w-[45%] sm:min-w-[30%] lg:min-w-[20%] xl:min-w-[16%]"
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
            >
              <VideoCard {...item} />
            </motion.div>
          ))}
        </div>

        {/* Shadow blanc à droite */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent" />
      </div>
    </motion.section>
  );
}
