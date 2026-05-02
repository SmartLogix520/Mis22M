import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsAPI, categoriesAPI, type Product, type Category } from "../../../services/api";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

export default function ProductList() {
  const { slug } = useParams();
  const location = useLocation();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isBestSellers = location.pathname.includes('best-sellers');
  const isAllProducts = location.pathname === '/produits' || location.pathname === '/products';

  useEffect(() => {
    setLoading(true);
    
    let filters: Record<string, string | number | boolean> = { limit: 100 };
    
    if (isBestSellers) {
      filters.isBestSeller = true;
    } else if (slug && !isAllProducts) {
      filters.category = slug;
    }

    // On met en place deux appels: l'un pour chopper le titre de la categorie, l'autre pour les produits.
    Promise.all([
      categoriesAPI.getAll(),
      productsAPI.getAll(filters)
    ])
      .then(([catsRes, prodsRes]) => {
        if (slug) {
          const foundCat = catsRes.data.find(c => c.slug === slug || c.name.toLowerCase() === slug);
          setCategory(foundCat || null);
        } else {
          setCategory(null);
        }
        setProducts(prodsRes.data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, location.pathname]);

  let title = "Produits";
  if (isBestSellers) title = "Best Sellers";
  else if (category) title = category.name;
  else if (slug) title = slug;

  return (
    <section className="p-4 min-h-[50vh]">
      <h2 className="text-center text-xl font-semibold mb-6 capitalize">
        {title}
      </h2>

      {(!loading && products.length === 0) ? (
        <div className="text-center py-20 text-muted-foreground">
          Aucun produit trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images?.[0] || product.imageUrl || "/assets/placeholder.png"}
                  name={product.name}
                  description={product.shortDesc || product.description || ""}
                  price={product.price || 0}
                />
              ))}
        </div>
      )}
    </section>
  );
}
