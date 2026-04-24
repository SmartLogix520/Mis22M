import { useRef } from "react";

type Props = {
  images: string[];
};

export default function ProductGalleryCarousel({ images }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // ================= MOUSE DRAG =================
  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    startX.current = e.pageX;
    scrollLeft.current = trackRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => (isDown.current = false);
  const handleMouseUp = () => (isDown.current = false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !trackRef.current) return;
    const walk = (e.pageX - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // ================= TOUCH (MOBILE) =================
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].pageX;
    scrollLeft.current = trackRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const walk = (e.touches[0].pageX - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // ================= GROUP PAR 3 =================
  const groups = Array.from({
    length: Math.ceil(images.length / 3),
  }).map((_, i) => images.slice(i * 3, i * 3 + 3));

  return (
    <div className="mt-10 w-screen relative left-1/2 -translate-x-1/2 px-4">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* ================= TITLE ================= */}
        <div className="md:w-[40%] flex items-center justify-center text-center px-4 md:px-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold leading-tight">
              Découvrez nos visuels
            </h2>

            <p className="text-sm md:text-base text-gray-500 mt-4">
              Explorez le produit sous différents angles
            </p>
          </div>
        </div>

        {/* ================= CAROUSEL ================= */}
        <div className="md:w-[60%] overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-scroll scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {groups.map((group, index) => (
              <div key={index} className="flex gap-3 flex-shrink-0">
                {/* grande image */}
                {group[0] && (
                  <img
                    src={group[0]}
                    className="
                    w-[280px] md:w-[300px]
                    h-[320px] md:h-[500px]
                    object-cover rounded-xl
                  "
                  />
                )}

                {/* deux petites */}
                <div className="flex flex-col gap-3">
                  {group[1] && (
                    <img
                      src={group[1]}
                      className="
                      w-[140px] md:w-[190px]
                      h-[155px] md:h-[240px]
                      object-cover rounded-xl
                    "
                    />
                  )}

                  {group[2] && (
                    <img
                      src={group[2]}
                      className="
                      w-[140px] md:w-[190px]
                      h-[155px] md:h-[240px]
                      object-cover rounded-xl
                    "
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
