import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { products } from "../constants/products";
import { categories } from "../../home/constants/Categories";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

export default function ProductList() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);

  const [loading, setLoading] = useState(true);

  const filteredProducts = products.filter((p) => p.category === slug);

  // simulation loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <section className="p-4">
      <h2 className="text-center text-xl font-semibold mb-6">
        {category?.title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.images[0]}
                name={product.name}
                description={product.description}
                price={product.price}
              />
            ))}
      </div>
    </section>
  );
}
