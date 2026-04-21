import { useEffect, useRef } from "react";
import { galleryImages } from "../constants/galleryData";

export default function CommunitySection() {
    const trackRef = useRef<HTMLDivElement>(null);
    const isUserInteracting = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const images = galleryImages;

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        const step = () => {
            if (el && !isUserInteracting.current) {
                el.scrollLeft += 0.8;

                // reset propre
                if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
                    el.scrollLeft = 0;
                }
            }

            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }, []);

    const handleUserInteraction = () => {
        isUserInteracting.current = true;

        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            isUserInteracting.current = false;
        }, 1500);
    };

    return (
        <div className="relative overflow-hidden py-16">
            <div
                ref={trackRef}
                onWheel={handleUserInteraction}
                onTouchStart={handleUserInteraction}
                onMouseDown={handleUserInteraction}
                className="flex items-center gap-16 overflow-x-auto px-10 scroll-smooth no-scrollbar"
            >
                {/* LEFT TEXT */}
                <div className="w-[200px] shrink-0">
                    <h2 className="text-center font-semibold mb-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                        Ceci est votre communauté
                    </h2>
                    <p className="text-center mt-3 text-sm text-gray-600">
                        Partagez votre #miss2mroutine et identifiez @miss2m_algerie pour
                        avoir une chance d'être mise en avant.
                    </p>
                </div>

                {/* ROWS */}
                <div className="flex flex-col gap-6 shrink-0">
                    {/* ROW 1 */}
                    <div className="flex gap-4">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className={`flex-shrink-0 overflow-hidden
          ${i % 2 === 0 ? "w-56 h-56" : "w-40 h-40"}
        `}
                            >
                                <img
                                    src={img.src}
                                    className="w-full h-full object-cover animate-slowzoom"
                                />
                            </div>
                        ))}
                    </div>

                    {/* ROW 2 */}
                    <div className="flex gap-4 ml-28">
                        {images
                            .slice()
                            .reverse()
                            .map((img, i) => (
                                <div
                                    key={i}
                                    className={`flex-shrink-0 overflow-hidden
            ${i % 2 === 0 ? "w-40 h-40" : "w-56 h-56"}
          `}
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
                        Partagez votre #miss2mroutine et identifiez @miss2m_algerie pour
                        avoir une chance d'être mise en avant.
                    </p>
                </div>
            </div>
        </div>
    );
}