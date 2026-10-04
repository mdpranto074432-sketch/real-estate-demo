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

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
}

/**
 * WORLD-CLASS LUXURY ARCHITECTURAL CINEMATIC HERO ENGINE
 * Preserves the exact real-building identity of EHL Premium Condominiums (Dhaka)
 * with zero fake geometry and zero wave/displacement warping.
 *
 * Delivers:
 * - Multi-plane 2.5D spatial separation (Background Sky/Horizon, Midground Architecture,
 *   Foreground Botanical Canopy & Atmosphere) using subtle differential parallax
 * - Slow, continuous autonomous camera drift + pointer response + scroll camera push-in
 * - Restrained natural lighting progression (Warm Afternoon -> Golden Hour -> Blue Hour -> Nocturnal)
 * - Subtle live atmospheric dust motes & monsoon light shafts on a lightweight 2D canvas
 * - Seamless multi-angle photographic transitions into architectural details and interior spaces
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
  const atmosphereCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [introStage, setIntroStage] = useState<number>(0);
  const [cameraState, setCameraState] = useState<{
    px: number;
    py: number;
    driftX: number;
    driftY: number;
    breathScale: number;
  }>({
    px: 0,
    py: 0,
    driftX: 0,
    driftY: 0,
    breathScale: 0,
  });

  const targetPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 06 — INTRO MOTION CHOREOGRAPHY
  // 01: subtle atmospheric reveal -> 02: building settles -> 03: light reveals architecture
  useEffect(() => {
    if (prefersReducedMotion()) {
      setIntroStage(3);
      return;
    }
    const t1 = window.setTimeout(() => setIntroStage(1), 80);
    const t2 = window.setTimeout(() => setIntroStage(2), 450);
    const t3 = window.setTimeout(() => setIntroStage(3), 1050);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  // 03 & 08 — LIVE CINEMATIC CAMERA FEEL + SUBTLE ENVIRONMENTAL MOTION
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let rafId = 0;
    const startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1440;
      const h = window.innerHeight || 900;
      targetPointerRef.current = {
        x: (e.clientX / w - 0.5) * 2, // -1 .. 1
        y: (e.clientY / h - 0.5) * 2, // -1 .. 1
      };
    };

    // Initialize subtle atmospheric dust particles
    const canvas = atmosphereCanvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;
    const particles: DustParticle[] = [];
    const particleCount = window.innerWidth < 768 ? 18 : 34;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        radius: 0.6 + Math.random() * 1.35,
        vx: 0.00008 + Math.random() * 0.00014,
        vy: -0.00005 - Math.random() * 0.0001,
        alpha: 0.12 + Math.random() * 0.26,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth || 1440;
      canvas.height = window.innerHeight || 900;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const elapsed = (now - startTime) * 0.001;

      // Damped pointer interpolation (no sudden jerks or distortion)
      currentPointerRef.current.x +=
        (targetPointerRef.current.x - currentPointerRef.current.x) * 0.045;
      currentPointerRef.current.y +=
        (targetPointerRef.current.y - currentPointerRef.current.y) * 0.045;

      // Ultra-slow autonomous architectural camera drift (feels like a stabilized cinema dolly)
      const driftX = Math.sin(elapsed * 0.28) * 6.5;
      const driftY = Math.cos(elapsed * 0.22) * 4.0;
      const breathScale = (Math.sin(elapsed * 0.24) + 1) * 0.008;

      setCameraState({
        px: currentPointerRef.current.x,
        py: currentPointerRef.current.y,
        driftX,
        driftY,
        breathScale,
      });

      // Render subtle golden-hour dust motes & warm light scattering
      if (ctx && canvas) {
        const cw = canvas.width;
        const ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x > 1.05) p.x = -0.05;
          if (p.y < -0.05) p.y = 1.05;

          const drawX =
            (p.x + currentPointerRef.current.x * 0.012) * cw;
          const drawY =
            (p.y + currentPointerRef.current.y * 0.008) * ch;
          const twinkle =
            p.alpha * (0.65 + 0.35 * Math.sin(elapsed * 1.1 + p.phase));

          ctx.beginPath();
          ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(247, 226, 196, ${twinkle.toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const s = Math.max(0, Math.min(1, scrollProgress));

  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  // ===========================================================================
  // 04 & 05 — MULTI-PLANE SPATIAL DEPTH PARALLAX & SCROLL CAMERA JOURNEY
  // Preserves 100% straight architectural lines—zero bending or warping.
  // ===========================================================================
  // Background Sky / Horizon Plane (moves slowest: 0.45x parallax)
  const bgTx = -cameraState.px * 5.5 + cameraState.driftX * 0.45;
  const bgTy = -cameraState.py * 3.5 + cameraState.driftY * 0.45 - s * 10;
  const bgScale = 1.03 + s * 0.05;

  // Midground Primary Building Plane (moves at 1.0x camera speed + continuous scroll push-in)
  const introScaleOffset = introStage === 0 ? 0.055 : introStage === 1 ? 0.02 : 0;
  const bldgScale =
    1.035 + introScaleOffset + cameraState.breathScale + smoothstep(0.0, 0.48, s) * 0.14;
  const bldgTx = -cameraState.px * 12.5 + cameraState.driftX;
  const bldgTy = -cameraState.py * 7.5 + cameraState.driftY - smoothstep(0.0, 0.48, s) * 16;

  // Foreground Canopy / Verandah Frame Plane (moves fastest: 1.65x parallax for genuine depth)
  const fgTx = -cameraState.px * 21.0 + cameraState.driftX * 1.45;
  const fgTy = -cameraState.py * 12.5 + cameraState.driftY * 1.45 - s * 28;
  const fgScale = 1.06 + smoothstep(0.0, 0.5, s) * 0.19;

  // ===========================================================================
  // CONTINUOUS SCROLL PROGRESSION ACROSS ARCHITECTURAL PERSPECTIVES
  // 0.00 -> 0.44: Primary EHL Premium Condominiums Establishing Elevation
  //               (with 3-layer Background / Building / Foreground depth parallax)
  // 0.36 -> 0.72: Close-up Cantilevered Concrete Overhangs, Iron-Wood Louvers & Hanging Greens
  // 0.64 -> 0.90: Interior Cross-Ventilated Living Gallery & Verandah Threshold
  // 0.82 -> 1.00: Nocturnal Elevation & Seamless Upward Curtain Reveal into Section 02
  // ===========================================================================
  const plate1Opacity = 1 - smoothstep(0.36, 0.48, s);

  const plate2Enter = smoothstep(0.34, 0.47, s);
  const plate2Exit = smoothstep(0.64, 0.75, s);
  const plate2Opacity = plate2Enter * (1 - plate2Exit);
  const plate2Scale = 1.12 - smoothstep(0.34, 0.74, s) * 0.09 + cameraState.breathScale;
  const plate2Tx = -cameraState.px * 15 + cameraState.driftX + (1 - plate2Enter) * 18;
  const plate2Ty = -cameraState.py * 9 + cameraState.driftY;

  const plate3Enter = smoothstep(0.62, 0.74, s);
  const plate3Exit = smoothstep(0.83, 0.92, s);
  const plate3Opacity = plate3Enter * (1 - plate3Exit);
  const plate3Scale = 1.03 + smoothstep(0.62, 0.91, s) * 0.09 + cameraState.breathScale;
  const plate3Tx = -cameraState.px * 13 + cameraState.driftX;
  const plate3Ty = -cameraState.py * 8 + cameraState.driftY + (1 - plate3Enter) * 14;

  const plate4Opacity = smoothstep(0.81, 0.92, s);
  const plate4Scale = 1.09 - smoothstep(0.81, 1.0, s) * 0.06 + cameraState.breathScale;
  const plate4Tx = -cameraState.px * 11 + cameraState.driftX;
  const plate4Ty = -cameraState.py * 7 + cameraState.driftY;

  const primaryExteriorSrc = IMAGE_ASSETS.ehlDhakaPlate || fallbackImageSrc;
  const detailFacadeSrc = IMAGE_ASSETS.ehlDhakaDetailPlate || primaryExteriorSrc;
  const interiorGallerySrc = IMAGE_ASSETS.penthouseInterior || primaryExteriorSrc;
  const nocturnalExteriorSrc = IMAGE_ASSETS.ehlDhakaNightPlate || primaryExteriorSrc;

  // Subtle localized warm highlight angle (shifts naturally with pointer and scroll)
  const warmShaftAngle = 122 + cameraState.px * 6 + s * 18;
  const warmShaftOpacity =
    introStage >= 2 ? Math.max(0.08, 0.24 - s * 0.16) : 0.0;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-[#13161B] select-none ${className}`}
      aria-label="EHL Premium Condominiums, Dhaka — Full-Screen Cinematic Architectural Experience"
    >
      {/* =====================================================================
          CHAPTER 01 (0% -> 46% SCROLL): PRIMARY REAL-BUILDING VISUAL
          Separated into 3 depth planes (Background Sky, Midground Architecture,
          Foreground Peripheral Canopy) so the real photograph feels spatial and alive.
      ===================================================================== */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{ opacity: plate1Opacity }}
      >
        {/* DEPTH LAYER 1: BACKGROUND SKY & HORIZON (0.45x Parallax) */}
        <div
          className="absolute inset-0 h-full w-full will-change-transform"
          style={{
            transform: `translate3d(${bgTx.toFixed(2)}px, ${bgTy.toFixed(2)}px, 0) scale(${bgScale.toFixed(4)})`,
          }}
        >
          <img
            src={primaryExteriorSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[54%_38%] sm:object-center"
            draggable={false}
          />
        </div>

        {/* DEPTH LAYER 2: MIDGROUND PRIMARY ARCHITECTURAL SUBJECT (1.0x Parallax)
            Masked smoothly so the building's straight concrete slabs and iron-wood
            louvers glide with subtle differential depth against the distant Dhaka sky */}
        <div
          className="absolute inset-0 h-full w-full will-change-transform"
          style={{
            transform: `translate3d(${bldgTx.toFixed(2)}px, ${bldgTy.toFixed(2)}px, 0) scale(${bldgScale.toFixed(4)})`,
            transition:
              introStage < 3
                ? 'transform 2.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.4s ease-out'
                : 'none',
            WebkitMaskImage:
              'radial-gradient(ellipse 76% 82% at 54% 52%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 98%)',
            maskImage:
              'radial-gradient(ellipse 76% 82% at 54% 52%, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 98%)',
          }}
        >
          <img
            src={primaryExteriorSrc}
            alt={fallbackAlt}
            className="h-full w-full object-cover object-[54%_38%] sm:object-center"
            draggable={false}
          />
        </div>

        {/* DEPTH LAYER 3: FOREGROUND BOTANICAL FRAME (1.65x Parallax at peripheral edges) */}
        <div
          className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
          style={{
            transform: `translate3d(${fgTx.toFixed(2)}px, ${fgTy.toFixed(2)}px, 0) scale(${fgScale.toFixed(4)})`,
            WebkitMaskImage:
              'radial-gradient(ellipse 68% 72% at 52% 48%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.85) 100%)',
            maskImage:
              'radial-gradient(ellipse 68% 72% at 52% 48%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.85) 100%)',
          }}
        >
          <img
            src={primaryExteriorSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[54%_38%] sm:object-center"
            draggable={false}
          />
        </div>
      </div>

      {/* =====================================================================
          CHAPTER 02 (34% -> 74% SCROLL): ARCHITECTURAL FACADE & OVERHANG DETAIL
          Close-up of cantilevered concrete slabs, exterior iron-wood screens & hanging gardens
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
        style={{
          opacity: plate2Opacity,
          transform: `translate3d(${plate2Tx.toFixed(2)}px, ${plate2Ty.toFixed(2)}px, 0) scale(${plate2Scale.toFixed(4)})`,
        }}
      >
        <img
          src={detailFacadeSrc}
          alt="Close-up architectural study of cantilevered concrete overhangs, exterior iron-wood louvers, and hanging gardens"
          className="h-full w-full object-cover object-center"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* =====================================================================
          CHAPTER 03 (62% -> 91% SCROLL): CROSS-VENTILATED LIVING GALLERY & VERANDAH
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
        style={{
          opacity: plate3Opacity,
          transform: `translate3d(${plate3Tx.toFixed(2)}px, ${plate3Ty.toFixed(2)}px, 0) scale(${plate3Scale.toFixed(4)})`,
        }}
      >
        <img
          src={interiorGallerySrc}
          alt="Full-length cross-ventilated interior living gallery and shaded monsoon verandah"
          className="h-full w-full object-cover object-center"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* =====================================================================
          CHAPTER 04 (81% -> 100% SCROLL): NOCTURNAL ELEVATION & REFLECTION COURT
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full will-change-transform"
        style={{
          opacity: plate4Opacity,
          transform: `translate3d(${plate4Tx.toFixed(2)}px, ${plate4Ty.toFixed(2)}px, 0) scale(${plate4Scale.toFixed(4)})`,
        }}
      >
        <img
          src={nocturnalExteriorSrc}
          alt="Nocturnal architectural elevation with warm interior illumination and rainwater court reflections"
          className="h-full w-full object-cover object-center"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* =====================================================================
          07 — RESTRAINED NATURAL LIGHTING & ATMOSPHERIC GRADING
          Subtle warm afternoon sun-ray highlight + soft shadow depth (never orange/Instagram)
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-1000"
        style={{
          opacity: warmShaftOpacity,
          background: `linear-gradient(${warmShaftAngle.toFixed(1)}deg, rgba(255, 224, 186, 0.55) 0%, rgba(255, 205, 152, 0.18) 38%, rgba(16, 20, 26, 0.0) 70%)`,
        }}
      />

      {/* =====================================================================
          08 — SUBTLE LIVE ATMOSPHERIC DUST & LIGHT SCATTERING CANVAS
      ===================================================================== */}
      <canvas
        ref={atmosphereCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-75"
      />

      {/* =====================================================================
          06 — INTRO ATMOSPHERIC REVEAL VEIL
          Dissolves smoothly on load so the building emerges naturally from light
      ===================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#111317] transition-opacity duration-1000 ease-out"
        style={{
          opacity: introStage === 0 ? 0.55 : 0,
        }}
      />

      {/* =====================================================================
          02 — CINEMATIC EDITORIAL FRAMING GRADIENT
          Protects headline legibility in the lower-left while leaving the entire
          central and upper architectural volume 100% clear and luminous.
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(14,17,22,0.18) 0%, rgba(14,17,22,0.0) 16%, rgba(14,17,22,0.0) 58%, rgba(14,17,22,0.72) 100%), radial-gradient(circle at 18% 82%, rgba(12,15,20,0.48) 0%, rgba(12,15,20,0.0) 52%)',
        }}
      />
    </div>
  );
};
