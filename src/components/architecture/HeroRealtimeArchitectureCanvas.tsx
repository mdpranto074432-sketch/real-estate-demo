import React, { useEffect, useRef, useState } from 'react';
import { IMAGE_ASSETS } from '../../data/mockRealEstateData';
import { prefersReducedMotion } from '../../utils/animation';

export type LightingAtmosphereMode = 'day' | 'golden' | 'blue' | 'night';

export interface EHLFloorInspectionData {
  level: number;
  title: string;
  elevationMeters: string;
  typology: string;
  orientation: string;
  verandahDepth: string;
  ventilationFlow: string;
  materialNote: string;
}

export interface HeroRealtimeArchitectureCanvasProps {
  fallbackImageSrc: string;
  fallbackAlt: string;
  className?: string;
  /** External scroll progress (0..1) from parent pinned Hero chapter */
  scrollProgress?: number;
  /** Optional callback when a floor plate is hovered or selected */
  onFloorSelect?: (floor: EHLFloorInspectionData | null) => void;
  /** Optional lighting override */
  lightingOverride?: LightingAtmosphereMode | null;
}

export const EHL_FLOOR_METADATA: Record<number, EHLFloorInspectionData> = {
  5: {
    level: 5,
    title: 'Level 05 — Primary Reference Residence',
    elevationMeters: '+17.4m Datum',
    typology: 'Documented 4-Bedroom Full-Length Living Plan · ~420 m²',
    orientation: '270° Primary Viewing Platform · West-Shaded Loggia',
    verandahDepth: '3.6m Deep Cantilevered Slab + Hanging Garden',
    ventilationFlow: 'Full-Length Living Hall Opening to Both End Balconies',
    materialNote: 'Fair-Faced Concrete, Exterior Iron-Wood & Hanging Greens',
  },
};

/**
 * FULL-SCREEN MULTI-ANGLE ARCHITECTURAL PHOTOGRAPHY & CINEMATIC CAMERA JOURNEY
 * Reference Architecture:
 * EHL Premium Condominiums — Dhaka, Bangladesh (Kashef Chowdhury / URBANA, 2013 · 4,536 m²)
 *
 * ZERO fake procedural 3D boxes.
 * ZERO wave/displacement distortion.
 * ZERO blank right-side or empty regions (`100vw` × `100vh` full-bleed).
 *
 * Orchestrates 4 seamless, full-screen photographic perspectives of the architecture
 * with multi-plane depth parallax (Background Sky, Midground Building, Foreground Canopy),
 * localized diurnal sunlight & window glow progression, and spatial portal transitions.
 */
export const HeroRealtimeArchitectureCanvas: React.FC<
  HeroRealtimeArchitectureCanvasProps
> = ({
  fallbackImageSrc,
  fallbackAlt,
  className = '',
  scrollProgress = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [entered, setEntered] = useState<boolean>(false);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 800;
      targetPointerRef.current = {
        x: (e.clientX / w - 0.5) * 2, // -1 .. 1
        y: (e.clientY / h - 0.5) * 2, // -1 .. 1
      };
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      setPointer((prev) => {
        const dx = targetPointerRef.current.x - prev.x;
        const dy = targetPointerRef.current.y - prev.y;
        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return prev;
        return {
          x: prev.x + dx * 0.065,
          y: prev.y + dy * 0.065,
        };
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const s = Math.max(0, Math.min(1, scrollProgress));

  // Smooth step helper for seamless multi-angle architectural transitions
  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  // ===========================================================================
  // 4-CHAPTER CONTINUOUS SCROLL CAMERA CHOREOGRAPHY ACROSS REAL PHOTOGRAPHY
  // ===========================================================================
  // PLATE 01 (0.00 -> 0.34): Wide Establishing Exterior of EHL Premium Condominiums
  // Camera pushes slowly inward toward the cantilevered slabs & hanging gardens
  const plate1Opacity = 1 - smoothstep(0.24, 0.36, s);
  const plate1Scale =
    (entered ? 1.02 : 1.09) + smoothstep(0.0, 0.36, s) * 0.16;
  const plate1Tx = -pointer.x * 14;
  const plate1Ty = -pointer.y * 9 - smoothstep(0.0, 0.36, s) * 18;

  // PLATE 02 (0.24 -> 0.62): Close-up Architectural Detail of Cantilevered Concrete Overhangs,
  // Exterior Iron-Wood Louver Screens & Cascading Verandah Greens
  const plate2Enter = smoothstep(0.22, 0.35, s);
  const plate2Exit = smoothstep(0.52, 0.64, s);
  const plate2Opacity = plate2Enter * (1 - plate2Exit);
  const plate2Scale = 1.14 - smoothstep(0.22, 0.62, s) * 0.11;
  const plate2Tx = -pointer.x * 20 + (1 - plate2Enter) * 24;
  const plate2Ty = -pointer.y * 12;

  // PLATE 03 (0.52 -> 0.84): Interior Double-End Cross-Ventilated Living Gallery & Verandah Threshold
  const plate3Enter = smoothstep(0.50, 0.63, s);
  const plate3Exit = smoothstep(0.75, 0.86, s);
  const plate3Opacity = plate3Enter * (1 - plate3Exit);
  const plate3Scale = 1.03 + smoothstep(0.50, 0.85, s) * 0.12;
  const plate3Tx = -pointer.x * 16;
  const plate3Ty = -pointer.y * 10 + (1 - plate3Enter) * 16;

  // PLATE 04 (0.74 -> 1.00): Nocturnal / Blue-Hour Transformation of EHL Premium Condominiums
  // Warm interior tungsten glow reflecting across the ground rainwater harvesting court
  const plate4Opacity = smoothstep(0.73, 0.86, s);
  const plate4Scale = 1.12 - smoothstep(0.73, 1.0, s) * 0.09;
  const plate4Tx = -pointer.x * 14;
  const plate4Ty = -pointer.y * 8;

  // Foreground Depth Layer (Subtle faster parallax on periphery for genuine 2.5D spatial depth without bending lines)
  const fgParallaxX = -pointer.x * 28;
  const fgParallaxY = -pointer.y * 16;

  // Localized Solar Light Sweep (Golden Hour sunbeam shifting across the facade as user scrolls/moves pointer)
  const lightAngleDeg = 118 + pointer.x * 8 + s * 25;
  const goldenWarmthOpacity = Math.max(0.12, 0.42 - s * 0.35);

  const primaryExteriorSrc = IMAGE_ASSETS.ehlDhakaPlate || fallbackImageSrc;
  const detailFacadeSrc = IMAGE_ASSETS.ehlDhakaDetailPlate || primaryExteriorSrc;
  const interiorGallerySrc = IMAGE_ASSETS.penthouseInterior || primaryExteriorSrc;
  const nocturnalExteriorSrc = IMAGE_ASSETS.ehlDhakaNightPlate || primaryExteriorSrc;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-[#14171C] select-none ${className}`}
      aria-label="EHL Premium Condominiums, Dhaka — Full-Screen Architectural Presentation"
    >
      {/* =====================================================================
          ANGLE 01: WIDE ESTABLISHING EXTERIOR (0% -> 35% SCROLL)
          Deep continuous cantilevered concrete slabs, warm iron-wood & hanging gardens
      ===================================================================== */}
      <div
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{
          opacity: plate1Opacity,
          transform: `translate3d(${plate1Tx.toFixed(1)}px, ${plate1Ty.toFixed(1)}px, 0) scale(${plate1Scale.toFixed(4)})`,
          transition: entered ? 'none' : 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <img
          src={primaryExteriorSrc}
          alt={fallbackAlt}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* =====================================================================
          ANGLE 02: CLOSE-UP ARCHITECTURAL DETAIL (25% -> 62% SCROLL)
          Board-formed concrete overhangs, exterior iron-wood screens & swaying greens
      ===================================================================== */}
      <div
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{
          opacity: plate2Opacity,
          transform: `translate3d(${plate2Tx.toFixed(1)}px, ${plate2Ty.toFixed(1)}px, 0) scale(${plate2Scale.toFixed(4)})`,
          pointerEvents: 'none',
        }}
      >
        <img
          src={detailFacadeSrc}
          alt="EHL Premium Condominiums — Close-up architectural study of cantilevered concrete overhangs, exterior iron-wood louvers, and hanging gardens"
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* =====================================================================
          ANGLE 03: INTERIOR LIVING GALLERY & VERANDAH THRESHOLD (52% -> 85% SCROLL)
          Full-length cross-ventilated living gallery opening to shaded verandas
      ===================================================================== */}
      <div
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{
          opacity: plate3Opacity,
          transform: `translate3d(${plate3Tx.toFixed(1)}px, ${plate3Ty.toFixed(1)}px, 0) scale(${plate3Scale.toFixed(4)})`,
          pointerEvents: 'none',
        }}
      >
        <img
          src={interiorGallerySrc}
          alt="EHL Premium Condominiums — Full-length cross-ventilated interior living gallery and shaded monsoon verandah"
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* =====================================================================
          ANGLE 04: NOCTURNAL / BLUE-HOUR TRANSFORMATION (74% -> 100% SCROLL)
          Warm glowing interiors and rainwater harvesting court reflections at dusk
      ===================================================================== */}
      <div
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{
          opacity: plate4Opacity,
          transform: `translate3d(${plate4Tx.toFixed(1)}px, ${plate4Ty.toFixed(1)}px, 0) scale(${plate4Scale.toFixed(4)})`,
          pointerEvents: 'none',
        }}
      >
        <img
          src={nocturnalExteriorSrc}
          alt="EHL Premium Condominiums — Nocturnal architectural elevation with warm interior illumination and rainwater court reflections"
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* =====================================================================
          LOCALIZED WEST SOLAR SHAFT & ATMOSPHERIC LIGHT LAYER
          Shifts subtly with pointer and scroll without distorting building geometry
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-300"
        style={{
          opacity: goldenWarmthOpacity,
          background: `linear-gradient(${lightAngleDeg.toFixed(1)}deg, rgba(255, 186, 115, 0.34) 0%, rgba(255, 168, 92, 0.10) 38%, rgba(18, 22, 28, 0.0) 72%)`,
        }}
      />

      {/* =====================================================================
          FOREGROUND DEPTH CANOPY VIGNETTE LAYER (2.5D SPATIAL SEPARATION)
      ===================================================================== */}
      <div
        className="pointer-events-none absolute -inset-8 will-change-transform"
        style={{
          transform: `translate3d(${fgParallaxX.toFixed(1)}px, ${fgParallaxY.toFixed(1)}px, 0)`,
          background:
            'radial-gradient(circle at 55% 45%, rgba(14,18,24,0.0) 48%, rgba(10,13,18,0.42) 100%)',
        }}
      />

      {/* =====================================================================
          RESTRAINED LOWER-LEFT EDITORIAL LEGIBILITY GRADIENT
          Leaves 85% of the full-bleed building completely unobstructed
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(12,15,20,0.22) 0%, rgba(12,15,20,0.0) 18%, rgba(12,15,20,0.0) 64%, rgba(12,15,20,0.74) 100%)',
        }}
      />
    </div>
  );
};
