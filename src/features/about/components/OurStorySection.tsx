import { motion } from "framer-motion";

import { useState, useRef, useEffect } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

const OurStorySection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);

        if (entry.isIntersecting && videoRef.current && isPlaying) {
          videoRef.current.play().catch((err) => {
            console.log("Autoplay prevented:", err);
          });
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.25 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch((err) => {
          console.log("Play prevented:", err);
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-15 py-16 lg:py-24">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Colonne Vidéo */}
        <motion.div
          className="relative overflow-hidden bg-slate-100 h-[450px] sm:h-[500px] lg:h-[550px] order-2 lg:order-1 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Placeholder élégant */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-slate-50 to-primary/10 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 border-[3px] border-primary/30 border-t-primary animate-spin" />
            </div>
          )}

          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            poster="/images/hero.png"
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src="/videos/story-3.mp4" type="video/mp4" />
            <img
              src="/images/hero.png"
              alt="Notre histoire"
              className="w-full h-full object-cover"
            />
          </video>

          {/* Overlay subtil avec vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black/10_100%)] pointer-events-none" />

          {/* Boutons de contrôle redessinés */}
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <motion.button
              onClick={toggleMute}
              className="
                flex items-center justify-center
                w-11 h-11
                bg-white/90 hover:bg-white
                backdrop-blur-md
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-105
                active:scale-95
                border border-white/20
                group
              "
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVideoLoaded ? 1 : 0,
                scale: isVideoLoaded ? 1 : 0.8,
              }}
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? (
                <VolumeX
                  className="w-4.5 h-4.5 text-primary group-hover:text-primary/70 transition-colors"
                  strokeWidth={2}
                />
              ) : (
                <Volume2
                  className="w-4.5 h-4.5 text-primary group-hover:text-primary/70 transition-colors"
                  strokeWidth={2}
                />
              )}
            </motion.button>

            <motion.button
              onClick={togglePlayPause}
              className="
                flex items-center justify-center
                w-11 h-11
                bg-white/90 hover:bg-white
                backdrop-blur-md
                shadow-lg hover:shadow-xl
                transition-all duration-300
                hover:scale-105
                active:scale-95
                border border-white/20
                group
              "
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVideoLoaded ? 1 : 0,
                scale: isVideoLoaded ? 1 : 0.8,
              }}
              aria-label={isPlaying ? "Mettre en pause" : "Lire la vidéo"}
            >
              {isPlaying ? (
                <Pause
                  className="w-4.5 h-4.5 text-primary group-hover:text-primary/70 transition-colors"
                  strokeWidth={2}
                />
              ) : (
                <Play
                  className="w-4.5 h-4.5 text-primary group-hover:text-primary/70 transition-colors ml-0.5"
                  strokeWidth={2}
                />
              )}
            </motion.button>
          </div>

          {/* Cercle décoratif */}
          <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20" />
        </motion.div>

        {/* Colonne Contenu */}
        <motion.div
          className="flex flex-col justify-center order-1 lg:order-2"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Titre raffiné */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-8 leading-tight tracking-tight">
            <>
              Une expertise française{" "}
              <span className="font-medium text-primary italic">reconnue</span>
            </>
          </h2>

          {/* Séparateur élégant */}
          <div className="h-[1px] w-20 bg-gradient-to-r from-[var(--primary)] to-transparent mb-8" />

          {/* Description en prose fluide */}
          <div className="space-y-5 text-foreground/90 leading-relaxed font-light">
            <p className="text-base">
              'Hyfac est née de la volonté de créer une gamme dermatologique
              accessible et efficace pour toutes les personnes souffrant
              d\'imperfections cutanées. Nos fondateurs, experts en
              dermatologie, ont constaté le manque de solutions adaptées aux
              peaux grasses et acnéiques.'
            </p>
            <p className="text-base">
              'Depuis notre création, nous nous engageons à développer des
              formules innovantes, testées sous contrôle dermatologique, qui
              respectent l\'équilibre naturel de la peau tout en traitant
              efficacement les imperfections.'
            </p>
            <p className="text-base sm:text-lg">
              'Aujourd\'hui, Hyfac est devenue une référence en France et à
              l\'international, accompagnant des milliers d\'adolescents et
              d\'adultes vers une peau plus saine et confiante.'
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OurStorySection;
