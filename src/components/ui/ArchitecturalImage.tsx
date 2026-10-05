import React, { useRef, useState } from 'react';
import { ArchitecturalIcon } from './ArchitecturalIcon';
import { hasFinePointer, prefersReducedMotion } from '../../utils/animation';

export interface ArchitecturalImageProps {
  src: string;
  alt: string;
  caption?: string;
  figureNumber?: string;
  aspectRatioClass?: string;
  className?: string;
  priority?: boolean;
  overlayScrim?: 'none' | 'bottom' | 'full' | 'subtle-vignette';
  onInspectPlate?: () => void;
  parallax?: boolean;
  clipReveal?: boolean;
  cursorMode?: 'inspect' | 'explore' | 'view' | 'enter' | 'open';
  objectPosition?: string;
  sizes?: string;
  srcSet?: string;
}

/**
 * PRODUCTION-GRADE ARCHITECTURAL RESPONSIVE MEDIA COMPONENT
 *
 * - Responsive Web Delivery: Responsive sizes, optional srcSet, and art-directed object positioning.
 * - Zero CLS Layout Stability: Enforces explicit aspect-ratio container with shimmer placeholder.
 * - Optimal LCP & Priority: `fetchPriority="high"`, `loading="eager"`, `decoding="sync"` when priority is set.
 * - Spatial 3D Perspective Tilt: Smooth pointer-driven micro-rotation and radial sunlight sheen.
 * - Resilient Multi-Tier Fallback: Gracefully handles offline, network errors, or failed assets without broken icons.
 */
export const ArchitecturalImage: React.FC<ArchitecturalImageProps> = ({
  src,
  alt,
  caption,
  figureNumber,
  aspectRatioClass = 'aspect-[16/9]',
  className = '',
  priority = false,
  overlayScrim = 'none',
  onInspectPlate,
  parallax = false,
  clipReveal = false,
  cursorMode,
  objectPosition = 'center',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1440px',
  srcSet,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [sheenPosition, setSheenPosition] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  const resolvedCursor = cursorMode || (onInspectPlate ? 'inspect' : 'view');

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !hasFinePointer()) return;
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width);
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height);
    const rotateY = (nx - 0.5) * 3.8;
    const rotateX = (0.5 - ny) * 3.2;

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`,
      transition: 'transform 120ms ease-out',
    });
    setSheenPosition({ x: Math.round(nx * 100), y: Math.round(ny * 100) });
  };

  const handlePointerLeave = () => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1)',
    });
  };

  return (
    <figure
      data-cursor={resolvedCursor}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        ref={frameRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={tiltStyle}
        data-scroll={clipReveal ? 'clip-reveal' : undefined}
        className={`relative w-full overflow-hidden border border-[#D6CEBE]/80 bg-[#161412] ${aspectRatioClass}`}
      >
        {!hasError ? (
          <div
            data-parallax={parallax ? 'plate-depth' : undefined}
            className="h-full w-full overflow-hidden"
          >
            <img
              src={src}
              srcSet={srcSet}
              sizes={sizes}
              alt={alt}
              width={1600}
              height={1000}
              referrerPolicy="no-referrer"
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              fetchPriority={priority ? 'high' : 'auto'}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              style={{ objectPosition }}
              className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ) : (
          /* Styled Architectural Fallback Container (Zero Broken Icons) */
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#1A1815] p-8 text-center text-[#A8A29E]">
            <div className="mb-3 flex h-12 w-12 items-center justify-center border border-[#C28E5C]/30 bg-[#C28E5C]/10 text-[#C28E5C]">
              <ArchitecturalIcon name="building" size={24} strokeWidth={1.2} />
            </div>
            <span className="font-serif text-sm tracking-wide text-[#FBF9F5]">{alt}</span>
            <span className="mt-1 font-mono text-[10px] tracking-widest text-[#A8A29E] uppercase">
              Architectural Monograph Plate
            </span>
          </div>
        )}

        {/* Dynamic Specular Sunlight Sheen Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(251, 249, 245, 0.14) 0%, transparent 60%)`,
          }}
        />

        {/* Loading skeleton shimmer while image loads */}
        {!isLoaded && !hasError && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-[#24211D]"
          />
        )}

        {/* GSAP Curtain Mask Reveal Layer */}
        <div
          data-animate="image-curtain"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-right scale-x-0 bg-[#161412]"
        />

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

        {overlayScrim === 'subtle-vignette' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]"
          />
        )}

        {/* Interactive Lightbox / Plate Inspection Affordance */}
        {onInspectPlate && (
          <button
            type="button"
            onClick={onInspectPlate}
            aria-label={`Inspect full architectural plate: ${alt}`}
            className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 z-10 inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 border border-[#D6CEBE]/40 bg-[#12161D]/90 px-3.5 py-2 sm:px-3 sm:py-1.5 font-mono text-[11px] text-[#FBF9F5] backdrop-blur-xs transition-all duration-150 hover:border-[#C28E5C] hover:bg-[#C28E5C] hover:text-[#12161D] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#FBF9F5] cursor-pointer"
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
