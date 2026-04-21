import { useRef, useState } from "react";

type Props = {
  video: string;
  thumbnail: string;
  title: string;
};

export default function VideoCard({ video, thumbnail, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setPlaying(true);
      } catch (err) {
        console.log("Video play blocked:", err);
      }
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[9/16]">
      <video
        ref={videoRef}
        src={video}
        poster={thumbnail}
        className="w-full h-full object-cover"
        controls={playing}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
      />

      {!playing && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-white/80 rounded-full p-3 text-lg">▶</div>
        </button>
      )}

      {/* overlay gradient pour lisibilité */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-medium">
        {title}
      </div>
    </div>
  );
}
