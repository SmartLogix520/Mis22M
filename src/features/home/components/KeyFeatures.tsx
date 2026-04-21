import { motion } from "framer-motion";
import { Microscope, Sparkles, Flag, Gem } from "lucide-react";

const KeyFeaturesSection = () => {
  const features = [
    {
      icon: Microscope,
      text: "25 ans de recherche",
    },
    {
      icon: Sparkles,
      text: "Disponible dans plus de 30 wilayas",
    },
    {
      icon: Flag,
      text: "Made in Turkey",
      flag: "/assets/madeinturkey.jpg",
    },
    {
      icon: Gem,
      text: "Premium makeup",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-15 py-12 lg:py-16">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Grid - 2x2 sur mobile, 4 colonnes sur desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
            >
              {/* Icône dans un cercle */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-foreground flex items-center justify-center mb-4 sm:mb-6 overflow-hidden">
                {feature.flag ? (
                  <img
                    src={feature.flag}
                    alt="Drapeau France"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <feature.icon
                    className="w-10 h-10 sm:w-12 sm:h-12 text-foreground"
                    strokeWidth={1.5}
                  />
                )}
              </div>

              <p className="text-sm sm:text-base font-normal text-foreground leading-relaxed">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default KeyFeaturesSection;
