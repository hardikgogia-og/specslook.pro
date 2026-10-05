import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  className?: string;
  autoplayOnClick?: boolean;
  poster?: string;
  videoSrc?: string;
}

export const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({
  videoId,
  title,
  className = '',
  autoplayOnClick = true,
  poster = '#t=0.01',
  videoSrc,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const posterUrl = poster && poster !== '#t=0.01' ? poster : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${
    autoplayOnClick ? 'autoplay=1&' : ''
  }controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlay();
    }
  };

  return (
    <div className={`relative rounded-xs overflow-hidden border border-neutral-800 bg-black shadow-2xl group ${className}`}>
      <div className="relative w-full aspect-16/9 overflow-hidden bg-neutral-950">
        {isPlaying ? (
          <iframe
            className="w-full h-full object-cover pointer-events-auto"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label={`Play ${title}`}
            onClick={handlePlay}
            onKeyDown={handleKeyDown}
            className="relative w-full h-full cursor-pointer select-none group focus:outline-hidden focus:ring-2 focus:ring-red-500"
          >
            {/* Poster Thumbnail or Autoplaying Video Preview */}
            {videoSrc ? (
              <video
                src={videoSrc.includes('#t=') ? videoSrc : `${videoSrc}#t=0.01`}
                autoPlay
                playsInline
                muted
                loop
                preload="metadata"
                poster={poster || '#t=0.01'}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <img
                src={posterUrl}
                alt={title}
                loading="lazy"
                decoding="async"
                width={640}
                height={360}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            )}

            {/* Dark cinematic vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 group-hover:from-black/70 group-hover:via-black/20 transition-colors" />

            {/* Center Play Button with Specslook Luxury Styling */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-red-600/30 animate-ping group-hover:bg-red-600/50" />
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110 border-2 border-white/30">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Title / Badge Overlay */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider text-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>CINEMATIC SHOWCASE</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip - Preserved 100% */}
      <div className="px-4 py-2.5 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-300">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          {isPlaying ? 'PLAYING SUNGLASSES CINEMATIC' : 'SUNGLASSES CINEMATIC SHOWCASE'}
        </span>
        <span className="text-neutral-400">
          {isPlaying ? 'Press player controls for full screen' : 'Click play to start video with sound'}
        </span>
      </div>
    </div>
  );
};
