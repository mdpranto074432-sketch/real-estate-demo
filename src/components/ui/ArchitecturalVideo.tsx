import React, { useEffect, useRef, useState } from 'react';
import { ArchitecturalIcon } from './ArchitecturalIcon';
import { prefersReducedMotion } from '../../utils/animation';

export interface ArchitecturalVideoProps {
  posterSrc: string;
  videoSrc?: string;
  alt: string;
  caption?: string;
  figureNumber?: string;
  aspectRatioClass?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  overlayScrim?: 'none' | 'bottom' | 'full';
  onInspectPlate?: () => void;
}

/**
 * ARCHITECTURAL VIDEO & CINEMATIC MOTION PLAYER
 *
 * - Zero Black Frames: Uses instant high-res poster image until video is actively playing.
 * - Adaptive Fallback: Gracefully falls back to high-res still photography if video fails.
 * - Respects Reduced Motion: Halts autoplay if `prefers-reduced-motion` is active.
 * - Zero Layout Shift (CLS): Explicit aspect-ratio container with loaded states.
 */
export const ArchitecturalVideo: React.FC<ArchitecturalVideoProps> = ({
  posterSrc,
  videoSrc,
  alt,
  caption,
  figureNumber,
  aspectRatioClass = 'aspect-[16/9]',
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  overlayScrim = 'none',
  onInspectPlate,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [videoError, setVideoError] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || reducedMotion || videoError) return;

    video.muted = isMuted;
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay policy or low power mode prevented autoplay
        setIsPlaying(false);
      });
  }, [videoSrc, isMuted, reducedMotion, videoError]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <figure className={`group relative overflow-hidden ${className}`}>
      <div
        className={`relative w-full overflow-hidden border border-[#D6CEBE]/80 bg-[#12161D] ${aspectRatioClass}`}
      >
        {/* High-Resolution Poster Image (Always renders instantly to prevent black frame) */}
        <img
          src={posterSrc}
          alt={alt}
          width={1600}
          height={1000}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setPosterLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />

        {/* Video Element (If source provided and no fatal error) */}
        {videoSrc && !videoError && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            playsInline
            muted={isMuted}
            loop={loop}
            autoPlay={autoPlay && !reducedMotion}
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Overlay Scrims */}
        {overlayScrim === 'bottom' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0E12]/90 via-[#0C0E12]/35 to-transparent"
          />
        )}
        {overlayScrim === 'full' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#0C0E12]/45"
          />
        )}

        {/* Ambient Video Control Badge */}
        {videoSrc && !videoError && (
          <div className="absolute left-3 bottom-3 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause architectural video loop' : 'Play architectural video loop'}
              className="inline-flex min-h-[36px] items-center gap-1.5 border border-[#D6CEBE]/40 bg-[#12161D]/90 px-3 py-1.5 font-mono text-[11px] text-[#FBF9F5] backdrop-blur-xs transition-colors hover:border-[#C28E5C] hover:text-[#C28E5C] cursor-pointer"
            >
              <ArchitecturalIcon name={isPlaying ? 'pause' : 'play'} size={12} />
              <span>{isPlaying ? 'PAUSE MOTION' : 'PLAY MOTION'}</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
              className="inline-flex h-9 w-9 items-center justify-center border border-[#D6CEBE]/40 bg-[#12161D]/90 font-mono text-[11px] text-[#FBF9F5] backdrop-blur-xs transition-colors hover:border-[#C28E5C] hover:text-[#C28E5C] cursor-pointer"
            >
              <span className="text-[10px] tracking-wider uppercase">{isMuted ? 'MUT' : 'SND'}</span>
            </button>
          </div>
        )}

        {/* Open Lightbox Plate Button */}
        {onInspectPlate && (
          <button
            type="button"
            onClick={onInspectPlate}
            aria-label={`Inspect full architectural plate: ${alt}`}
            className="absolute right-3 bottom-3 z-10 inline-flex min-h-[36px] items-center gap-1.5 border border-[#D6CEBE]/40 bg-[#12161D]/90 px-3 py-1.5 font-mono text-[11px] text-[#FBF9F5] backdrop-blur-xs transition-colors hover:border-[#C28E5C] hover:bg-[#C28E5C] hover:text-[#12161D] cursor-pointer"
          >
            <ArchitecturalIcon name="expand" size={12} />
            <span>OPEN PLATE</span>
          </button>
        )}
      </div>

      {(caption || figureNumber) && (
        <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#D6CEBE]/40 pb-2 text-xs text-[#78716C]">
          <span className="font-serif italic text-[#D6CEBE]">{caption}</span>
          {figureNumber && (
            <span className="shrink-0 font-mono text-[11px] text-[#A8A29E] tabular-nums">
              {figureNumber}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};
