import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Textarea } from "../../../shared/components/ui/textarea";
import { Send } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Ajoutez votre logique d'envoi ici
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputFields = [
    {
      name: "name",
      type: "text",
      label: "Votre nom",
      placeholder: "Entrez votre nom",
    },
    {
      name: "email",
      type: "email",
      label: "Votre email",
      placeholder: "Entrez votre email",
    },
    {
      name: "subject",
      type: "text",
      label: "Sujet",
      placeholder: "Entrez le sujet de votre message",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Fond avec bordure subtile */}
      <div className="absolute inset-0 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50" />

      <div className="relative p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champs de saisie */}
          {inputFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <label className="text-sm font-medium mb-2.5 block text-foreground/80 tracking-wide uppercase text-xs">
                {field.label}
              </label>
              <motion.div
                animate={{
                  scale: focusedField === field.name ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(field.name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={field.placeholder}
                  className="h-12 bg-background/50 border-border/60 focus:border-primary/50 transition-all duration-300"
                  required
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Message textarea */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label className="text-sm font-medium mb-2.5 block text-foreground/80 tracking-wide uppercase text-xs">
              Votre message
            </label>
            <motion.div
              animate={{
                scale: focusedField === "message" ? 1.01 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder={"Entrez votre message"}
                rows={6}
                className="bg-background/50 border-border/60 focus:border-primary/50 transition-all duration-300 resize-none"
                required
              />
            </motion.div>
          </motion.div>

          {/* Bouton d'envoi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {"Envoyer"}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </motion.div>
                </span>

                {/* Effet de shine au hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactForm;
