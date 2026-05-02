import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}
const Counter = ({ value, suffix = "", duration = 2 }: CounterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration });
      return controls.stop;
    }
  }, [isInView, count, value, duration]);

  return (
    <span
      ref={ref}
      className="block text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-2 tracking-tight"
    >
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const AboutHeroSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="w-full">
      {/* Image PLEIN WIDTH avec titre en bas */}
      <div className="relative w-full overflow-hidden min-h-[600px] lg:min-h-[490px] flex items-end">
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-slate-50 to-primary/5 animate-pulse" />
          )}

          <img
            src="/images/hero.png"
            alt="About Hyfac"
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="eager"
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient overlay sophistiqué */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        {/* Titre et description EN BAS de l'image */}
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Titre */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
              <>
                À propos de{" "}
                <span className="font-medium text-white italic">Hyfac</span>
              </>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/95 leading-relaxed font-light max-w-3xl">
              'Pionniers en dermocosmétique depuis plus de 30 ans, nous
              développons des solutions innovantes pour révéler la beauté
              naturelle de chaque peau.'
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats EN DEHORS - Centrés avec touche primary minimaliste */}
      <div className="w-full px-6 sm:px-8 lg:px-12 py-12 lg:py-16 bg-background">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-3 gap-8 lg:gap-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="group">
            <div className="relative inline-block">
              <Counter value={30} suffix="+" duration={2} />
              {/* Petit trait primary en dessous */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-12 bg-[var(--primary)]" />
            </div>
            <span className="block text-sm sm:text-base text-foreground/70 font-light mt-4">
              'Années d\'expertise'
            </span>
          </div>

          <div className="group">
            <div className="relative inline-block">
              <Counter value={100} suffix="%" duration={2.5} />
              {/* Petit trait primary en dessous */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-12 bg-[var(--primary)]" />
            </div>
            <span className="block text-sm sm:text-base text-foreground/70 font-light mt-4">
              'Testé dermatologiquement'
            </span>
          </div>

          <div className="group">
            <div className="relative inline-block">
              <Counter value={1} suffix="M+" duration={2} />
              {/* Petit trait primary en dessous */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-12 bg-[var(--primary)]" />
            </div>
            <span className="block text-sm sm:text-base text-foreground/70 font-light mt-4">
              'Utilisateurs satisfaits'
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
