import { useEffect, useRef } from "react";
import { galleryImages } from "../constants/galleryData";

export default function CommunitySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const isVisible = useRef(false);

  const isUserInteracting = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const position = useRef(0);
  const velocity = useRef(0);

  const images = galleryImages;
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      {
        threshold: 0.3, // commence quand 30% visible
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let rafId: number;
    let lastTime = performance.now();

    const speed = 40;

    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const containerWidth = containerRef.current?.offsetWidth || 0;
      const max = el.scrollWidth - containerWidth;

      if (
        isVisible.current &&
        !isUserInteracting.current &&
        !isDragging.current
      ) {
        position.current += (speed * delta) / 1000;

        // 🔒 stop à la vraie fin
        if (position.current >= max) {
          position.current = max;
        }

        el.style.transform = `translateX(-${position.current}px)`;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // ===== DRAG (PC + MOBILE) =====
  const handleStart = (e: React.PointerEvent) => {
    isDragging.current = true;
    isUserInteracting.current = true;
    startX.current = e.clientX;
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - startX.current;
    startX.current = e.clientX;

    const el = trackRef.current;
    const containerWidth = containerRef.current?.offsetWidth || 0;

    if (!el) return;

    const max = el.scrollWidth - containerWidth;

    const SMOOTH = 0.5;

    velocity.current = dx; // 👈 capture vitesse

    position.current -= dx * SMOOTH;

    // 🔒 clamp (empêche espace vide)
    if (position.current < 0) position.current = 0;
    if (position.current > max) position.current = max;

    el.style.transform = `translateX(-${position.current}px)`;
  };

  const handleEnd = () => {
    isDragging.current = false;

    // 👉 inertie après relâchement
    let inertia = velocity.current;

    const decay = 0.95;

    const animate = () => {
      if (Math.abs(inertia) < 0.5) return;

      position.current -= inertia;

      const el = trackRef.current;
      const containerWidth = containerRef.current?.offsetWidth || 0;

      if (el) {
        const max = el.scrollWidth - containerWidth;

        if (position.current < 0) position.current = 0;
        if (position.current > max) position.current = max;

        el.style.transform = `translateX(-${position.current}px)`;
      }

      inertia *= decay;
      requestAnimationFrame(animate);
    };

    animate();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      isUserInteracting.current = false;
    }, 1000);
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden py-16">
      <div
        ref={trackRef}
        className="flex items-center gap-16 px-10 w-max"
        style={{ willChange: "transform" }}
        onPointerDown={handleStart}
        onPointerMove={handleMove}
        onPointerUp={handleEnd}
        onPointerLeave={handleEnd}
      >
        {/* LEFT TEXT */}
        <div className="w-[200px] shrink-0">
          <h2 className="text-center font-semibold mb-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Ceci est votre communauté
          </h2>
          <p className="text-center mt-3 text-sm text-gray-600">
            Partagez votre #miss2mroutine et identifiez @miss2m_algerie
          </p>
        </div>

        {/* IMAGES */}
        <div className="flex flex-col gap-6 shrink-0">
          <div className="flex gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                className={`flex-shrink-0 overflow-hidden ${
                  i % 2 === 0 ? "w-56 h-56" : "w-40 h-40"
                }`}
              >
                <img
                  src={img.src}
                  className="w-full h-full object-cover animate-slowzoom"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-4 ml-28">
            {images
              .slice()
              .reverse()
              .map((img, i) => (
                <div
                  key={i}
                  className={`flex-shrink-0 overflow-hidden ${
                    i % 2 === 0 ? "w-40 h-40" : "w-56 h-56"
                  }`}
                >
                  <img
                    src={img.src}
                    className="w-full h-full object-cover animate-slowzoom"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT TEXT */}
        <div className="w-[200px] shrink-0 text-right">
          <h2 className="text-center font-semibold mb-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Ceci est votre communauté
          </h2>
          <p className="text-center mt-3 text-sm text-gray-600">
            Partagez votre #miss2mroutine et identifiez @miss2m_algerie
          </p>
        </div>
      </div>
    </div>
  );
}
