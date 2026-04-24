import { useParams } from "react-router-dom";
import { products } from "../constants/products";
import { motion } from "framer-motion";
import { useState } from "react";
import { Star } from "lucide-react";
import ProductGalleryCarousel from "../components/ProductGalleryCarousel";
import Footer from "../../../shared/components/Footer";

export default function ProductDetails() {
  const { id } = useParams();

  const product = products.find((p) => p.id === id);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  if (!product) {
    return <div className="p-4 text-center">Produit introuvable</div>;
  }

  return (
    <div>
      <motion.section
        className="p-4 md:p-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* ================= IMAGES ================= */}
          <div>
            {/* main image */}
            <motion.img
              key={selectedImage}
              src={product.images[selectedImage]}
              className="w-full h-[350px] object-cover rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />

            {/* thumbnails */}
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${
                    selectedImage === i ? "border-black" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ================= INFOS ================= */}
          <div>
            {/* title */}
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            {/* rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>

            {/* price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold">{product.price} DA</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through">
                  {product.oldPrice} DA
                </span>
              )}
            </div>

            {/* colors */}
            {product.colors && (
              <div className="mb-4">
                <p className="text-sm mb-2 font-medium">Couleurs</p>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* button */}
            <button className="w-full bg-[var(--primary)] text-black py-3 rounded-lg mb-6 hover:opacity-90 transition">
              Trouver un point de vente
            </button>

            {/* ================= ACCORDION ================= */}
            <div className="mt-6 border-t">
              {/* DESCRIPTION */}
              <div className="border-b py-3">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex justify-between font-semibold"
                >
                  Description
                  <span>{openSection === "description" ? "-" : "+"}</span>
                </button>

                {openSection === "description" && (
                  <p className="mt-3 text-sm text-gray-600">
                    {product.description}
                  </p>
                )}
              </div>

              {/* DETAILS */}
              <div className="border-b py-3">
                <button
                  onClick={() => toggleSection("details")}
                  className="w-full flex justify-between font-semibold"
                >
                  Détails
                  <span>{openSection === "details" ? "-" : "+"}</span>
                </button>

                {openSection === "details" && (
                  <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* INGREDIENTS */}
              <div className="border-b py-3">
                <button
                  onClick={() => toggleSection("ingredients")}
                  className="w-full flex justify-between font-semibold"
                >
                  Ingrédients
                  <span>{openSection === "ingredients" ? "-" : "+"}</span>
                </button>

                {openSection === "ingredients" && (
                  <ul className="mt-3 list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {product.ingredients?.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <ProductGalleryCarousel images={product.gallery || []} />
      <Footer />
    </div>
  );
}
