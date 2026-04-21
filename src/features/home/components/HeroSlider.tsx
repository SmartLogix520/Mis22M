import { sliderImages } from "../constants/sliderData";

export default function Slider() {
  const slide = sliderImages[0]; // première image

  return (
    <div className="relative w-full h-[400px] md:h-[300px] lg:h-[400px] xl:h-[500px] overflow-hidden">
      <img
        src={slide.image}
        className="w-full h-full object-cover object-center"
      />

      {/* overlay text (optionnel) */}
      {/* 
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h2 className="text-white text-3xl md:text-5xl font-bold">
          {slide.title}
        </h2>
      </div> 
      */}
    </div>
  );
}
