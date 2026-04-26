import { motion } from "framer-motion";
import { Target, Heart, Lightbulb } from "lucide-react";

const OurMissionSection = () => {
  const missions = [
    {
      icon: Target,
      title: "Efficacité prouvée",
      description:
        "Développer des formules dont l'efficacité est cliniquement démontrée pour traiter les imperfections cutanées.",
    },
    {
      icon: Heart,
      title: "Respect de la peau",
      description:
        "Créer des soins qui respectent l'équilibre naturel de la peau, même les plus sensibles.",
    },
    {
      icon: Lightbulb,
      title: "Innovation continue",
      description:
        "Innover constamment pour offrir les meilleures solutions dermatologiques du marché.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-15 py-16 lg:py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--primary)]/5 via-transparent to-transparent" />

      <motion.div
        className="relative max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* HEADER */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6 tracking-tight"
            variants={itemVariants}
          >
            Redonner confiance à travers{" "}
            <span className="font-medium text-black italic">la science</span>
          </motion.h2>

          <motion.p
            className="text-base text-foreground/60 max-w-2xl mx-auto leading-relaxed font-light"
            variants={itemVariants}
          >
            Notre mission est simple mais essentielle : accompagner chaque
            personne vers une peau plus saine en développant des solutions
            dermatologiques innovantes et accessibles.
          </motion.p>
        </div>

        {/* GRID */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
          variants={containerVariants}
        >
          {missions.map((mission, index) => {
            const Icon = mission.icon;

            return (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
              >
                {/* CARD */}
                <div className="relative p-10 bg-background/60 backdrop-blur-sm border border-slate-200/50 hover:border-[var(--primary)]/40 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/8 via-[var(--primary)]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* ICON */}
                    <motion.div
                      className="relative flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 group-hover:from-[var(--primary)]/15 group-hover:to-[var(--primary)]/10 transition-all duration-500"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute inset-0 bg-[var(--primary)]/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                      <Icon
                        className="relative h-7 w-7 text-[var(--primary)]"
                        strokeWidth={1.5}
                      />
                    </motion.div>

                    {/* TITLE */}
                    <h3 className="text-xl font-medium text-foreground mb-4 group-hover:text-[var(--primary)] transition-colors duration-300">
                      {mission.title}
                    </h3>

                    {/* LINE */}
                    <div className="w-12 h-[1px] bg-gradient-to-r from-[var(--primary)]/80 to-transparent mb-4" />

                    {/* DESCRIPTION */}
                    <p className="text-sm text-foreground/80 leading-relaxed font-light">
                      {mission.description}
                    </p>
                  </div>

                  {/* NUMBER */}
                  <div className="absolute bottom-6 right-8 text-7xl font-extralight text-slate-900/10 group-hover:text-[var(--primary)]/40 transition-colors duration-500 select-none">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>
                </div>

                {/* CONNECTOR LINE */}
                {index < missions.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-[1px] bg-gradient-to-r from-[var(--primary)]/20 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OurMissionSection;
