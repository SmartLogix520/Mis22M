import { motion } from "framer-motion";
import ContactForm from "../components/ContactForm";
import ContactInfo from "../components/ContactInfo";
import type { Variants } from "framer-motion";

const Contact = () => {
  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        {/* Header ultra-moderne */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24 relative"
        >
          {/* Badge avec le composant Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          ></motion.div>

          {/* Titre avec effet de gradient */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="block bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Nous contacter
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
          >
            {
              "Vous avez des questions, des suggestions ou souhaitez simplement en savoir plus sur nos produits ? N'hésitez pas à nous contacter, nous sommes là pour vous aider !"
            }
          </motion.p>

          {/* Lignes décoratives */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-12 h-px bg-gradient-to-r from-transparent to-primary"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-12 h-px bg-gradient-to-l from-transparent to-primary"
            />
          </div>
        </motion.div>

        {/* Grid avec animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-16"
        >
          {/* Formulaire - prend plus d'espace */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <ContactForm />
          </motion.div>

          {/* Informations de contact */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ContactInfo />
          </motion.div>
        </motion.div>

        {/* Google Map avec bordure primary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border-4 border-primary shadow-2xl shadow-primary/10"
        >
          <div className="aspect-video md:aspect-[21/9] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.563825651225!2d3.0505882745122985!3d36.73303537148492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad835b30b041%3A0x357f1abfb6e94e23!2sRue%20AT%20TABRIZI%2C%20Bir%20Mourad%20Ra%C3%AFs!5e0!3m2!1sfr!2sdz!4v1770924138318!5m2!1sfr!2sdz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation HYFAC"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
