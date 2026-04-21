import { categories } from "../constants/Categories";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Categories() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="px-4 py-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="relative cursor-pointer group overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08, // effet cascade
              ease: "easeOut",
            }}
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
