import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email",
      content: "hyfacalgerie@gmail.com",
      href: "mailto:hyfacalgerie@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+213 559190044",
      href: "tel:+213 559190044",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Main Street, Algiers, Algeria",
      href: null,
    },
    {
      icon: Clock,
      title: "horaires",
      content: "Lun-Ven: 9AM - 6PM, Sat: 10AM - 4PM",
      href: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Informations de contactu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50" />

        <div className="relative p-8 space-y-6">
          {contactDetails.map((detail, index) => {
            const Icon = detail.icon;
            const content = detail.href ? (
              <a
                href={detail.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {detail.content}
              </a>
            ) : (
              <span>{detail.content}</span>
            );

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ x: 5 }}
                className="group"
              >
                <div className="flex gap-4 items-start">
                  {/* Icône avec animation */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-shrink-0 w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground/80 mb-1 text-sm uppercase tracking-wider">
                      {detail.title}
                    </h3>
                    <p className="text-foreground text-sm leading-relaxed">
                      {content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Bloc décoratif minimaliste */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
      />
    </div>
  );
};

export default ContactInfo;
