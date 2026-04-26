import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const OurCommitmentSection = () => {
  const commitments = [
    {
      title: "Formules sûres et testées",
      description:
        "Tous nos produits sont développés sous contrôle dermatologique strict",
    },
    {
      title: "Respect de l'équilibre cutané",
      description:
        "Nous préservons la barrière naturelle de la peau pour une tolérance optimale",
    },
    {
      title: "Résultats visibles",
      description:
        "Efficacité cliniquement prouvée sur la réduction des imperfections",
    },
    {
      title: "Innovation permanente",
      description:
        "Recherche continue pour améliorer nos formules et répondre aux nouveaux besoins",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-15 py-12 lg:py-16">
      <motion.div
        className="max-w-6xl mx-auto overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[var(--primary)]/95 to-[var(--primary)] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Colonne gauche - Contenu texte */}
          <motion.div
            className="p-10 sm:p-12 lg:p-16 flex flex-col justify-center relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Effet décoratif en arrière-plan */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-black/5 blur-3xl" />

            {/* Titre principal */}
            <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-8 leading-tight tracking-tight">
              <>
                Votre peau mérite{" "}
                <span className="font-medium italic">le meilleur</span>
              </>
            </h2>

            {/* Séparateur */}
            <div className="h-[1px] w-20 bg-gradient-to-r from-black to-transparent mb-10" />

            {/* Description */}
            <p className="relative text-base sm:text-lg text-black/90 mb-12 leading-relaxed font-light max-w-lg">
              'Nous nous engageons à vos côtés pour vous offrir des solutions
              dermatologiques qui transforment vraiment votre peau et votre
              confiance.'
            </p>

            {/* Liste des engagements */}
            <div className="relative text-light space-y-6">
              {commitments.map((commitment, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Icône check avec effet */}
                  <div className="flex-shrink-0 w-7 h-7 bg-black/15 backdrop-blur-sm flex items-center justify-center mt-0.5 group-hover:bg-black/25 transition-all duration-300 border border-black/20">
                    <CheckCircle2
                      className="h-4 w-4 text-black"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Texte */}
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-black mb-1.5">
                      {commitment.title}
                    </h4>
                    <p className="text-sm text-black/75 leading-relaxed font-light">
                      {commitment.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Colonne droite - Image */}
          <motion.div
            className="relative min-h-[400px] lg:min-h-full"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/images/hero.png"
              alt="Notre engagement"
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Overlay sophistiqué */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/5 to-primary/20" />

            {/* Badge flottant */}
            <motion.div
              className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">100%</p>
                <p className="text-sm text-black/70">
                  'Contrôle dermatologique sur tous nos produits'
                </p>
              </div>
            </motion.div>

            {/* Élément décoratif */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default OurCommitmentSection;
