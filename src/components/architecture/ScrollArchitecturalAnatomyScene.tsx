import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectMonograph } from '../../types/realEstate';
import {
  isMobileOrConstrainedDevice,
  prefersReducedMotion,
} from '../../utils/animation';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import { ActionButton } from '../ui/Primitives';

gsap.registerPlugin(ScrollTrigger);

interface ScrollArchitecturalAnatomySceneProps {
  project: ProjectMonograph;
}

const ANATOMY_CHAPTERS = [
  {
    rangeLabel: '00% – 25% SCROLL',
    stageCode: 'STAGE 01 / EXTERIOR MONOLITH',
    title: 'Climatic Shielding & Deep Monsoon Cantilevers',
    metricLabel: '62% Solar Heat Gain Reduction',
    description:
      'Every Varendra & Co. commission begins as a climatic filter. Fourteen-foot cantilevered sky verandas and ventilated Roman travertine rainscreens absorb the fierce western sun while welcoming south-easterly lake breezes.',
  },
  {
    rangeLabel: '25% – 50% SCROLL',
    stageCode: 'STAGE 02 / STRUCTURAL DISASSEMBLY',
    title: 'Post-Tensioned Column-Free Horizon Spans',
    metricLabel: '52-Foot Unbroken Living Span · BNBC Zone 2',
    description:
      'As the outer facade separates, the structural skeleton reveals high-strength post-tensioned flat slabs poured without intrusive drop beams—allowing 360-degree daylight and complete floor-plate sovereignty.',
  },
  {
    rangeLabel: '50% – 75% SCROLL',
    stageCode: 'STAGE 03 / LEVEL 08 ISOLATION',
    title: 'One Residence Per Floor, Zero Shared Walls',
    metricLabel: '6,450 Sq. Ft. Private Horizontal Estate',
    description:
      'Isolating a single full-floor plate demonstrates why vertical living in Dhaka can rival a landed estate: dual biometric passenger lifts, a segregated spice galley and service spine, and four-corner botanical terraces.',
  },
  {
    rangeLabel: '75% – 100% SCROLL',
    stageCode: 'STAGE 04 / INTERIOR SANCTUARY',
    title: '32-Decibel Acoustic Stillness Inside the Metropolis',
    metricLabel: '42.52mm Laminated Low-Iron Glazing',
    description:
      'Crossing the threshold from the cantilevered veranda into the Great Salon, street noise drops by 46 decibels. Honed travertine slabs float on acoustic mats while MERV-16 filtration maintains hospital-grade air purity.',
  },
];

/**
 * 09 & 10. CONTINUOUS SCROLL-SCRUBBED ARCHITECTURAL TRANSFORMATION SCENE
 * Continuously transforms across 4 spatial states as the user scrolls:
 *   00–25%: Complete Exterior Monolith
 *   25–50%: Exploded Structural Disassembly (Roof, Slabs, Brise-Soleil Fins)
 *   50–75%: Single Full-Floor Blueprint Extraction
 *   75–100%: Camera Portal Zoom into the Double-Height Interior Sanctuary
 */
export const ScrollArchitecturalAnatomyScene: React.FC<
  ScrollArchitecturalAnatomySceneProps
> = ({ project }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinViewportRef = useRef<HTMLDivElement | null>(null);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [scrollPct, setScrollPct] = useState<number>(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinViewportRef.current;
    if (!section || !pinEl) return;

    if (prefersReducedMotion() || isMobileOrConstrainedDevice()) {
      return;
    }

    const ctx = gsap.context(() => {
      const roofLayer = pinEl.querySelector('[data-layer="crown-parasol"]');
      const upperSlabs = pinEl.querySelector('[data-layer="upper-slabs"]');
      const isolatedSlab = pinEl.querySelector('[data-layer="isolated-floor"]');
      const lowerSlabs = pinEl.querySelector('[data-layer="lower-slabs"]');
      const louverScreen = pinEl.querySelector('[data-layer="louver-screen"]');
      const blueprintOverlay = pinEl.querySelector('[data-layer="blueprint-grid"]');
      const interiorPortal = pinEl.querySelector('[data-layer="interior-portal"]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=240%',
          pin: pinEl,
          scrub: 0.65,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollPct(Math.round(p * 100));
            const nextStage =
              p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;
            setActiveStage((prev) => (prev !== nextStage ? nextStage : prev));
          },
        },
      });

      // Phase 1 -> 2 (0% to 35%): Explode architectural massing layers vertically
      tl.to(
        roofLayer,
        { y: -95, scale: 1.04, duration: 0.35, ease: 'power2.inOut' },
        0
      )
        .to(
          upperSlabs,
          { y: -48, opacity: 0.45, duration: 0.35, ease: 'power2.inOut' },
          0
        )
        .to(
          lowerSlabs,
          { y: 54, opacity: 0.4, duration: 0.35, ease: 'power2.inOut' },
          0
        )
        .to(
          louverScreen,
          { x: 70, opacity: 0.35, duration: 0.35, ease: 'power2.inOut' },
          0
        );

      // Phase 2 -> 3 (35% to 68%): Isolate Level 08 Floor Plate & Expand Blueprint Grid
      tl.to(
        isolatedSlab,
        {
          scale: 1.18,
          y: -8,
          duration: 0.33,
          ease: 'power3.inOut',
        },
        0.35
      )
        .fromTo(
          blueprintOverlay,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
          0.38
        )
        .to(
          [roofLayer, upperSlabs, lowerSlabs, louverScreen],
          { opacity: 0.12, duration: 0.3 },
          0.38
        );

      // Phase 3 -> 4 (68% to 100%): Camera Portal Zoom into Interior Sanctuary
      tl.fromTo(
        interiorPortal,
        {
          clipPath: 'inset(38% 34% 38% 34%)',
          scale: 1.12,
          opacity: 0,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          opacity: 1,
          duration: 0.32,
          ease: 'power3.inOut',
        },
        0.68
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const currentChapter = ANATOMY_CHAPTERS[activeStage] || ANATOMY_CHAPTERS[0];

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll-Choreographed Architectural Disassembly & Interior Portal"
      className="relative border-b border-[#D6CEBE] bg-[#141210] text-[#FBF9F5]"
    >
      <div
        ref={pinViewportRef}
        className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden py-12 lg:py-16"
      >
        {/* Top Scene Telemetry Header */}
        <div className="relative z-20 mx-auto w-full max-w-[1360px] px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CEBE]/20 pb-4">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-[#D97724] font-semibold">
                CONTINUOUS SCROLL ANATOMY
              </span>
              <span aria-hidden="true" className="text-[#D6CEBE]/40">
                ·
              </span>
              <span className="text-[#D6CEBE]">
                {project.catalogNumber} — {project.title.toUpperCase()}
              </span>
            </div>

            {/* Interactive Stage Pills (Also clickable for mobile / reduced-motion users) */}
            <div className="flex flex-wrap items-center gap-2">
              {ANATOMY_CHAPTERS.map((chap, idx) => (
                <button
                  key={chap.stageCode}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`px-3 py-1 font-mono text-[10px] border transition-colors cursor-pointer ${
                    activeStage === idx
                      ? 'border-[#D97724] bg-[#D97724] text-[#141210] font-semibold'
                      : 'border-[#D6CEBE]/25 text-[#D6CEBE]/75 hover:border-[#FBF9F5]'
                  }`}
                >
                  0{idx + 1}. {chap.stageCode.split('/')[1]?.trim()}
                </button>
              ))}
              <span className="ml-2 hidden font-mono text-xs text-[#D97724] tabular-nums lg:inline">
                [{scrollPct}%]
              </span>
            </div>
          </div>
        </div>

        {/* Center Spatial Stage: Layered Architectural Disassembly + Interior Portal */}
        <div className="relative mx-auto my-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-10 px-6 py-8 md:px-12 lg:grid-cols-12">
          {/* Left 5 Columns: Live Synchronized Narrative & Telemetry */}
          <div className="relative z-20 space-y-6 lg:col-span-5">
            <div className="inline-flex items-center gap-2 border border-[#D97724]/50 bg-[#78350F]/25 px-3 py-1 font-mono text-[11px] text-[#FBF9F5]">
              <span>{currentChapter.rangeLabel}</span>
              <span>·</span>
              <span className="text-[#D97724]">{currentChapter.stageCode}</span>
            </div>

            <h2 className="font-serif text-3xl font-normal leading-[1.08] tracking-tight text-[#FBF9F5] sm:text-5xl">
              {currentChapter.title}
            </h2>

            <p className="text-sm leading-relaxed text-[#D6CEBE]/85 sm:text-base">
              {currentChapter.description}
            </p>

            <div className="border-l-2 border-[#D97724] pl-4 py-1">
              <span className="block font-mono text-[10px] text-[#A8A29E]">
                VERIFIED CONCEPT SPECIFICATION
              </span>
              <span className="font-mono text-sm font-semibold text-[#FBF9F5]">
                {currentChapter.metricLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <ActionButton
                to={`/projects/${project.slug}`}
                variant="inverse"
                magnetic
              >
                Enter {project.title} Monograph
              </ActionButton>
              <Link
                to="/projects"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#D6CEBE] hover:text-[#FBF9F5]"
              >
                <span>Compare All 06 Commissions</span>
                <ArchitecturalIcon name="arrow-up-right" size={13} />
              </Link>
            </div>
          </div>

          {/* Right 7 Columns: Exploding Architectural Isometric Stack & Interior Portal */}
          <div className="relative flex min-h-[420px] sm:min-h-[500px] items-center justify-center border border-[#D6CEBE]/20 bg-[#1C1917]/80 p-6 lg:col-span-7 overflow-hidden">
            {/* Background Coordinate Grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #D6CEBE 1px, transparent 1px), linear-gradient(to bottom, #D6CEBE 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Explodable Isometric Architectural Stack (SVG Vector Assembly) */}
            <div className="relative z-10 flex w-full max-w-lg flex-col items-center justify-center py-8">
              {/* Layer 1: Crown Solar Parasol */}
              <div
                data-layer="crown-parasol"
                className="w-4/5 border border-[#D97724] bg-[#78350F]/30 px-4 py-3 text-center backdrop-blur-xs transition-transform"
              >
                <span className="font-mono text-[10px] tracking-widest text-[#FBF9F5]">
                  ROOF PARASOL · CANTILEVERED TEAK & SOLAR CANOPY
                </span>
              </div>

              {/* Layer 2: Upper Penthouse & Sky Villa Slabs */}
              <div
                data-layer="upper-slabs"
                className="mt-3 w-5/6 space-y-2 border border-[#D6CEBE]/40 bg-[#292524]/80 p-3 text-center"
              >
                <div className="h-2 w-full bg-[#D6CEBE]/40" />
                <div className="h-2 w-full bg-[#D6CEBE]/30" />
                <span className="block font-mono text-[10px] text-[#D6CEBE]">
                  LEVELS 09–12 · DUPLEX PENTHOUSE & UPPER SANCTUARIES
                </span>
              </div>

              {/* Layer 3: Isolated Full-Floor Plate (Level 08) with Blueprint Overlay */}
              <div
                data-layer="isolated-floor"
                className="relative my-4 w-full border-2 border-[#D97724] bg-[#141210] p-5 shadow-2xl"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-[#D97724]">
                  <span>ISOLATED FULL-FLOOR PLATE · LEVEL 08</span>
                  <span>6,450 SQ. FT. · 0 SHARED WALLS</span>
                </div>

                {/* Blueprint Schematic Grid Inside Isolated Plate */}
                <div
                  data-layer="blueprint-grid"
                  className="mt-3 grid grid-cols-12 gap-2 border border-[#D6CEBE]/30 bg-[#1C1917] p-3 text-[10px] font-mono"
                >
                  <div className="col-span-12 border border-[#D97724]/60 bg-[#78350F]/20 p-2 text-[#FBF9F5]">
                    14&apos;0&quot; CANTILEVERED MONSOON SKY VERANDA (SOUTH-EAST LAKE VIEW)
                  </div>
                  <div className="col-span-7 border border-[#D6CEBE]/30 p-2.5 text-[#D6CEBE]">
                    GREAT SALON &amp; DINING PAVILION (52&apos; × 26&apos;)
                  </div>
                  <div className="col-span-5 border border-[#D6CEBE]/30 p-2.5 text-[#D6CEBE]">
                    SOVEREIGN PRIMARY WING (34&apos; × 24&apos;)
                  </div>
                </div>
              </div>

              {/* Layer 4: Operable Brise-Soleil Louver Envelope */}
              <div
                data-layer="louver-screen"
                className="mb-3 w-5/6 border border-[#D97724]/50 bg-[#78350F]/15 px-4 py-2 text-center font-mono text-[10px] text-[#D6CEBE]"
              >
                42.52MM ACOUSTIC GLAZING + BURMESE TEAK BRISE-SOLEIL ENVELOPE
              </div>

              {/* Layer 5: Lower Typical Floors & Basalt Water Podium */}
              <div
                data-layer="lower-slabs"
                className="w-5/6 space-y-2 border border-[#D6CEBE]/35 bg-[#292524]/75 p-3 text-center"
              >
                <div className="h-2 w-full bg-[#D6CEBE]/30" />
                <div className="h-2 w-full bg-[#D6CEBE]/40" />
                <span className="block font-mono text-[10px] text-[#A8A29E]">
                  LEVELS 01–07 &amp; SUBTERRANEAN HYDROTHERAPY PODIUM
                </span>
              </div>
            </div>

            {/* Stage 4 Interior Portal Overlay (Zooms open on 68–100% scroll or Stage 4 click) */}
            <div
              data-layer="interior-portal"
              className={`absolute inset-0 z-20 flex flex-col justify-end p-6 transition-opacity duration-500 ${
                activeStage === 3 ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <img
                src={project.interiorImage}
                alt={`${project.title} Great Salon Interior Sanctuary`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/45 to-transparent" />
              <div className="relative z-10 border-t border-[#FBF9F5]/30 pt-4">
                <span className="font-mono text-[10px] text-[#D97724]">
                  INTERIOR THRESHOLD ENTERED · 32 dBA ACOUSTIC SANCTUARY
                </span>
                <p className="mt-1 font-serif text-2xl text-[#FBF9F5]">
                  Column-Free Roman Travertine Salon &amp; Fourteen-Foot Sky Veranda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Rail */}
        <div className="relative z-20 mx-auto w-full max-w-[1360px] px-6 md:px-12">
          <div className="h-0.5 w-full bg-[#D6CEBE]/20">
            <div
              className="h-full bg-[#D97724] transition-all duration-150"
              style={{ width: `${Math.max(12, scrollPct || (activeStage + 1) * 25)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
