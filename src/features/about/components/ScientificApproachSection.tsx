import { motion } from "framer-motion";
import { useState } from "react";
import { Microscope, Beaker, FlaskConical, ShieldCheck } from "lucide-react";

const ScientificApproachSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const steps = [
    {
      icon: Microscope,
      title: "Recherche approfondie",
      description: "Étude des actifs dermatologiques les plus efficaces",
    },
    {
      icon: Beaker,
      title: "Formulation experte",
      description: "Développement de formules optimisées et équilibrées",
    },
    {
      icon: FlaskConical,
      title: "Tests rigoureux",
      description: "Validation clinique sous contrôle dermatologique",
    },
    {
      icon: ShieldCheck,
      title: "Contrôle qualité",
      description: "Garantie de tolérance et d'efficacité optimale",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-15 py-12 lg:py-16">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Layout inversé : Image à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Colonne Contenu - À gauche */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Grand titre */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6 leading-tight tracking-tight">
              <>
                Une approche{" "}
                <span className="font-medium text-primary italic">
                  scientifique
                </span>{" "}
                rigoureuse
              </>
            </h2>

            {/* Séparateur */}
            <div className="h-[1px] w-20 bg-gradient-to-r from-primary/60 to-transparent mb-8" />

            {/* Description intro */}
            <p className="text-base text-foreground/80 mb-8 leading-relaxed font-light">
              'Chaque produit Hyfac est le résultat d\'un processus scientifique
              rigoureux, garantissant efficacité et tolérance optimales.'
            </p>

            {/* Grille des étapes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Icône */}
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 flex items-center justify-center">
                      <Icon
                        className="h-5 w-5 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Texte */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-foreground/80 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Colonne Image - À droite */}
          <motion.div
            className="relative overflow-hidden min-h-[400px] lg:max-h-[500px] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-slate-50 to-primary/10 animate-pulse" />
            )}

            <img
              src="/images/why-hyfac.png"
              alt="Approche scientifique"
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Overlay avec gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />

            {/* Badge flottant */}
            <motion.div
              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-5 shadow-2xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck
                    className="h-6 w-6 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-black/90">
                    'Contrôle dermatologique'
                  </p>
                  <p className="text-xs text-black/60 font-light">
                    'Tous nos produits sont testés cliniquement'
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cercle décoratif */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ScientificApproachSection;
