import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsAPI, type Product } from "../../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../../../shared/components/Footer";
import ProductReviews from "../components/ProductReviews";
import RelatedProducts from "../components/RelatedProducts";
import LocationButton from "../../../shared/components/FindUs";

// ─── Accordéon de sections ────────────────────────────────────────────────────
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left text-xs font-semibold tracking-widest uppercase text-gray-800 hover:text-black transition-colors"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-gray-500 text-sm">
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-gray-600 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Parse couleur stockée "Nom|#hex" ────────────────────────────────────────
function parseColor(raw: string): { name: string; hex: string } {
  const parts = raw.split('|');
  return { name: parts[0] ?? raw, hex: parts[1] ?? '#d4a574' };
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useParams();

  const [product,         setProduct]         = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [selectedImage,   setSelectedImage]   = useState(0);
  const [selectedColor,   setSelectedColor]   = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setSelectedImage(0);
    productsAPI.getById(id)
      .then(res => {
        setProduct(res.data);
        if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
        return productsAPI.getAll({ category: res.data.category, limit: 10 });
      })
      .then(res => {
        if (res) setRelatedProducts(res.data.products.filter(p => p.id !== id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Chargement du produit...</p>
    </div>
  );

  if (!product) return (
    <div className="p-10 text-center text-red-500 text-sm">Produit introuvable</div>
  );

  const imagesList = product.images?.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : ['/assets/placeholder.png'];

  const colorsParsed = (product.colors ?? []).map(parseColor);

  const productPrice  = product.price    ?? 0;
  const hasOldPrice   = !!product.oldPrice && product.oldPrice > productPrice;
  const benefitsArr    = product.benefits    ?? [];
  const ingredientsArr = product.ingredients ?? [];

  return (
    <div className="bg-white min-h-screen">
      {/* ─── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2 text-xs text-gray-400 flex items-center gap-1">
        <a href="/" className="hover:text-black transition-colors">Accueil</a>
        <span>›</span>
        <a href="/produits" className="hover:text-black transition-colors capitalize">{product.category}</a>
        <span>›</span>
        <span className="text-gray-700 truncate max-w-[120px]">{product.name}</span>
      </div>

      <motion.section
        className="px-4 pb-8 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* ─── Image principale + miniatures ──────────────────────────────── */}
        <div className="relative mb-2">
          <motion.img
            key={selectedImage}
            src={imagesList[selectedImage]}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          />
          {hasOldPrice && (
            <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
              PROMO
            </div>
          )}
        </div>

        {/* Indicateurs de slides */}
        {imagesList.length > 1 && (
          <div className="flex justify-center gap-1.5 mb-4">
            {imagesList.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${selectedImage === i ? 'bg-black scale-125' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}

        {/* Miniatures */}
        {imagesList.length > 1 && (
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {imagesList.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img} alt={`vue-${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* ─── Infos produit ──────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-black leading-tight mb-1">{product.name}</h1>
          {product.shortDesc && (
            <p className="text-sm text-gray-500 mb-3">{product.shortDesc}</p>
          )}
        </div>

        {/* ─── Couleurs / Nuances ──────────────────────────────────────────── */}
        {colorsParsed.length > 0 && (
          <div className="mb-5 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            {/* Nuance sélectionnée */}
            {selectedColor && (() => {
              const current = parseColor(selectedColor);
              return (
                <p className="text-sm font-medium mb-3 text-gray-800">{current.name}</p>
              );
            })()}
            <div className="flex gap-3 flex-wrap">
              {colorsParsed.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedColor(product.colors?.[i])}
                  title={c.name}
                  className={`flex flex-col items-center gap-1 group`}
                >
                  <span
                    className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === product.colors?.[i] ? 'border-black scale-110' : 'border-gray-300 hover:border-gray-500'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] text-gray-500 text-center max-w-[40px] leading-tight">{c.name.split(' ').slice(0, 2).join('\n')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Prix ───────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-bold text-black">{productPrice.toFixed(2)} DA</span>
          {hasOldPrice && (
            <span className="text-base text-gray-400 line-through">{product.oldPrice!.toFixed(2)} DA</span>
          )}
        </div>

        {/* ─── Accordéons de contenu (style KIKO) ─────────────────────────── */}
        <div className="border-t border-gray-200 mt-2">
          {product.description && (
            <AccordionSection title="Description">
              <p>{product.description}</p>
            </AccordionSection>
          )}

          {product.testDescription && (
            <AccordionSection title="Test">
              <p>{product.testDescription}</p>
            </AccordionSection>
          )}

          {benefitsArr.length > 0 && (
            <AccordionSection title="Résultats">
              <ul className="list-disc pl-4 space-y-1">
                {benefitsArr.map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </AccordionSection>
          )}

          {product.usageInstructions && (
            <AccordionSection title="How to use">
              <p className="whitespace-pre-line">{product.usageInstructions}</p>
            </AccordionSection>
          )}

          {product.pack && (
            <AccordionSection title="Pack">
              <p>{product.pack}</p>
            </AccordionSection>
          )}

          {ingredientsArr.length > 0 && (
            <AccordionSection title="Ingredient list">
              <p className="text-xs leading-relaxed">{ingredientsArr.join(', ')}</p>
            </AccordionSection>
          )}
        </div>
      </motion.section>

      {/* ─── Bouton "Trouve un point de vente" ──────────────────────────────── */}
      <LocationButton />

      {/* ─── Avis ───────────────────────────────────────────────────────────── */}
      {product.reviewsData && <ProductReviews reviews={product.reviewsData} />}

      {/* ─── Bouton "Trouve un point de vente" ──────────────────────────────── */}
      <LocationButton />

      {/* ─── Produits similaires ─────────────────────────────────────────────── */}
      <RelatedProducts products={relatedProducts} title="You might also like" />

      <Footer />
    </div>
  );
}
