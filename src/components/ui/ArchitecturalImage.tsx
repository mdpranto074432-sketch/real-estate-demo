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
  overlayScrim?: 'none' | 'bottom' | 'full';
  onInspectPlate?: () => void;
  parallax?: boolean;
  clipReveal?: boolean;
  cursorMode?: 'inspect' | 'explore' | 'view' | 'enter' | 'open';
}

/**
 * 05 & 06. SPATIAL IMAGE SCENE SYSTEM WITH 3D PERSPECTIVE DEPTH & DYNAMIC LIGHTING
 * - Treats every image as an active spatial plane with subtle 3D perspective tilt
 *   and specular light sheen on pointer movement.
 * - Explicit width/height & aspect-ratio container for zero Cumulative Layout Shift (CLS = 0).
 * - `fetchPriority="high"` & `decoding="sync"` when `priority={true}` for optimal LCP.
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
    const rotateY = (nx - 0.5) * 4.2;
    const rotateX = (0.5 - ny) * 3.6;

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: 'transform 140ms ease-out',
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
        className={`relative w-full overflow-hidden border border-[#D6CEBE] bg-[#EBE6DF] ${aspectRatioClass}`}
      >
        {!hasError ? (
          <div
            data-parallax={parallax ? 'plate-depth' : undefined}
            className="h-full w-full"
          >
            <img
              src={src}
              alt={alt}
              width={1600}
              height={1000}
              referrerPolicy="no-referrer"
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              fetchPriority={priority ? 'high' : 'auto'}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.035] ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ) : (
          /* Styled Architectural Fallback Container */
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#EBE6DF] p-8 text-center text-[#57534E]">
            <ArchitecturalIcon
              name="building"
              size={36}
              strokeWidth={1}
              className="mb-3 text-[#78350F] opacity-70"
            />
            <span className="font-serif text-base italic text-[#1C1917]">{alt}</span>
            <span className="mt-1 font-mono text-xs text-[#78716C]">
              Architectural Elevation Plate
            </span>
          </div>
        )}

        {/* Dynamic Specular Sunlight Sheen Layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(251, 249, 245, 0.16) 0%, transparent 60%)`,
          }}
        />

        {/* Loading skeleton shimmer while image loads */}
        {!isLoaded && !hasError && (
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-pulse bg-[#EBE6DF]"
          />
        )}

        {/* GSAP Curtain Mask Reveal Layer */}
        <div
          data-animate="image-curtain"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-right scale-x-0 bg-[#EBE6DF]"
        />

        {overlayScrim === 'bottom' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
          />
        )}

        {overlayScrim === 'full' && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/45"
          />
        )}

        {/* Interactive Lightbox / Plate Inspection Affordance */}
        {onInspectPlate && (
          <button
            type="button"
            onClick={onInspectPlate}
            aria-label={`Inspect full architectural plate: ${alt}`}
            className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 z-10 inline-flex min-h-[44px] sm:min-h-[34px] items-center gap-1.5 border border-[#D6CEBE]/80 bg-[#141210]/90 px-3.5 py-2 sm:px-3 sm:py-1.5 font-mono text-[11px] text-[#FBF9F5] backdrop-blur-xs transition-all duration-150 hover:bg-[#78350F] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#FBF9F5] cursor-pointer"
          >
            <ArchitecturalIcon name="expand" size={12} />
            <span>OPEN PLATE</span>
          </button>
        )}
      </div>

      {(caption || figureNumber) && (
        <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[#D6CEBE]/70 pb-2 text-xs text-[#57534E]">
          <span className="font-serif italic text-[#44403C]">{caption}</span>
          {figureNumber && (
            <span className="shrink-0 font-mono text-[11px] text-[#57534E] tabular-nums">
              {figureNumber}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};
