import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { categoriesAPI, type Category } from "../../../services/api";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then(res => setCategories(res.data.filter(c => c.isActive).sort((a,b) => a.order - b.order)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || categories.length === 0) return null;

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
              delay: index * 0.08,
              ease: "easeOut",
            }}
          >
            <img
              src={cat.imageUrl || "/assets/placeholder.png"}
              alt={cat.name}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
