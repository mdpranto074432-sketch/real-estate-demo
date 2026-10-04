import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroRealtimeArchitectureCanvas } from './HeroRealtimeArchitectureCanvas';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import {
  isMobileOrConstrainedDevice,
  prefersReducedMotion,
} from '../../utils/animation';

gsap.registerPlugin(ScrollTrigger);

export interface HeroScrollArchitectureChapterProps {
  fallbackImageSrc: string;
  fallbackAlt: string;
  projectTitle?: string;
  projectSlug?: string;
  enclaveLabel?: string;
  addressLabel?: string;
  catalogLabel?: string;
  isProjectDetail?: boolean;
  onLaunchGallery?: () => void;
}

interface ScrollEditorialBeat {
  range: [number, number];
  eyebrow: string;
  lines: [string, string, string];
  statement: string;
}

const HERO_EDITORIAL_BEATS: ScrollEditorialBeat[] = [
  {
    range: [0.0, 0.36],
    eyebrow: 'GULSHAN & DHAKA · ARCHITECTURAL MONOGRAPH',
    lines: ['ARCHITECTURE', 'SHAPED BY LIGHT,', 'SHADE & MONSOON.'],
    statement:
      'Deep continuous cantilevered concrete slabs, warm exterior iron-wood, and hanging gardens engineered for tropical serenity.',
  },
  {
    range: [0.36, 0.64],
    eyebrow: 'FACADE & CANTILEVER STUDY · 270° EXPOSURE',
    lines: ['CANTILEVERED', 'CONCRETE &', 'IRON-WOOD.'],
    statement:
      'Generous perimeter overhangs shield operable timber louvers and recessed low-iron glass from intense west solar heat and monsoon rain.',
  },
  {
    range: [0.64, 0.84],
    eyebrow: 'SPATIAL THRESHOLD · FULL-LENGTH LIVING GALLERY',
    lines: ['SANCTUARIES', 'SUSPENDED IN', 'THE CANOPY.'],
    statement:
      'Extended ground-plane verandahs and end-to-end living galleries invite continuous natural cross-breeze across every floor.',
  },
  {
    range: [0.84, 1.01],
    eyebrow: 'NOCTURNAL ELEVATION · RAINWATER REFLECTION COURT',
    lines: ['QUIETUDE', 'AFTER DUSK', 'IN DHAKA.'],
    statement:
      'At twilight, warm interior light glows beneath board-formed concrete cantilevers and reflects across the rainwater harvesting court.',
  },
];

/**
 * WORLD-CLASS LUXURY REAL-ESTATE CINEMATIC HERO
 *
 * Implements:
 * - Staged intro choreography (atmosphere -> building settles -> headline mask reveal -> CTA)
 * - Editorial typographic hierarchy ("GULSHAN / DHAKA" -> "ARCHITECTURE SHAPED BY LIGHT, SHADE & MONSOON." -> supporting statement -> "EXPLORE RESIDENCES")
 * - Minimal scroll indicator with animated vertical hairline
 * - Seamless exit transition into the next architectural section
 */
export const HeroScrollArchitectureChapter: React.FC<
  HeroScrollArchitectureChapterProps
> = ({
  fallbackImageSrc,
  fallbackAlt,
  projectTitle,
  projectSlug = 'jamuna-pavilion-gulshan',
  enclaveLabel,
  isProjectDetail = false,
  onLaunchGallery,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [typographyReady, setTypographyReady] = useState<boolean>(false);
  const [ctaReady, setCtaReady] = useState<boolean>(false);

  // 06 & 10 — STAGED INTRO TYPOGRAPHY & CTA REVEAL
  useEffect(() => {
    if (prefersReducedMotion()) {
      setTypographyReady(true);
      setCtaReady(true);
      return;
    }
    const tType = window.setTimeout(() => setTypographyReady(true), 620);
    const tCta = window.setTimeout(() => setCtaReady(true), 1080);
    return () => {
      window.clearTimeout(tType);
      window.clearTimeout(tCta);
    };
  }, []);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    if (prefersReducedMotion()) {
      return;
    }

    const isConstrained = isMobileOrConstrainedDevice();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: isConstrained ? '+=155%' : '+=245%',
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const activeBeat =
    HERO_EDITORIAL_BEATS.find(
      (b) => scrollProgress >= b.range[0] && scrollProgress < b.range[1]
    ) || HERO_EDITORIAL_BEATS[0];

  const displayedEyebrow =
    isProjectDetail && enclaveLabel && scrollProgress < 0.36
      ? enclaveLabel
      : activeBeat.eyebrow;

  // 15 — CONTINUOUS VISUAL EXIT TRANSITION INTO NEXT SECTION
  // During the final 12% of the hero scroll (0.88 -> 1.00), the hero visual
  // glides upward slightly while a warm alabaster architectural curtain rises
  // at the bottom edge so Section 02 emerges as one continuous spatial sequence.
  const exitTransitionT = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.12));
  const heroLiftY = -exitTransitionT * 36;

  return (
    <section
      ref={sectionRef}
      aria-label="Architectural Hero"
      className="relative h-screen min-h-[680px] w-screen max-w-full overflow-hidden bg-[#13161B] text-[#FBF9F5]"
    >
      {/* =====================================================================
          1. FULL-BLEED REAL BUILDING VISUAL & LIVE CAMERA MOTION
      ===================================================================== */}
      <div
        className="absolute inset-0 z-0 h-full w-full will-change-transform"
        style={{
          transform: `translate3d(0, ${heroLiftY.toFixed(1)}px, 0)`,
        }}
      >
        <HeroRealtimeArchitectureCanvas
          fallbackImageSrc={fallbackImageSrc}
          fallbackAlt={fallbackAlt}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* =====================================================================
          2. SUBORDINATE EDITORIAL TYPOGRAPHY & COMPOSITIONAL BALANCE
          Positioned in the lower-left negative space so the building's
          cantilevered slabs, iron-wood screens, and hanging gardens dominate.
      ===================================================================== */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end px-6 pb-10 pt-24 sm:px-10 md:px-14 md:pb-14">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Editorial Eyebrow + Masked Line Reveal Headline + Short Statement */}
          <div className="lg:col-span-8">
            {/* Small Location / Architectural Eyebrow */}
            <div className="overflow-hidden">
              <p
                className={`font-mono text-[10px] tracking-[0.26em] text-[#E7C396] uppercase transition-all duration-700 ease-out sm:text-[11px] ${
                  typographyReady
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }`}
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
              >
                {displayedEyebrow}
              </p>
            </div>

            {/* Large Editorial Headline with Staggered Line Mask Reveal */}
            {isProjectDetail && projectTitle && scrollProgress < 0.36 ? (
              <div className="mt-3 overflow-hidden">
                <h1
                  className={`font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#FBF9F5] transition-all duration-900 ease-out sm:text-5xl lg:text-[62px] ${
                    typographyReady
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ textShadow: '0 8px 32px rgba(0,0,0,0.65)' }}
                >
                  {projectTitle}
                </h1>
              </div>
            ) : (
              <h1
                className="mt-3 font-serif text-3xl font-normal leading-[1.03] tracking-tight text-[#FBF9F5] sm:text-5xl lg:text-[58px]"
                style={{ textShadow: '0 8px 32px rgba(0,0,0,0.65)' }}
              >
                {activeBeat.lines.map((line, idx) => (
                  <span key={line} className="block overflow-hidden pb-0.5">
                    <span
                      className={`block transition-all duration-900 ease-out ${
                        typographyReady
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-full opacity-0'
                      }`}
                      style={{
                        transitionDelay: `${idx * 110}ms`,
                      }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>
            )}

            {/* Supporting Editorial Statement */}
            <p
              className={`mt-4 max-w-md text-sm leading-relaxed text-[#F5F2EB]/90 transition-all duration-900 delay-300 ease-out sm:text-[15px] ${
                typographyReady
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
            >
              {activeBeat.statement}
            </p>
          </div>

          {/* RIGHT COLUMN: Primary CTA + Minimal Scroll Indicator */}
          <div
            className={`pointer-events-auto flex flex-col items-start justify-between gap-6 transition-all duration-900 ease-out lg:col-span-4 lg:items-end ${
              ctaReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            {isProjectDetail ? (
              <a
                href="#project-facts"
                data-cursor="EXPLORE"
                onClick={(e) => {
                  if (onLaunchGallery && scrollProgress > 0.5) {
                    e.preventDefault();
                    onLaunchGallery();
                  }
                }}
                className="group inline-flex items-center gap-3.5 border border-[#FBF9F5]/35 bg-[#12151B]/55 px-6 py-3.5 font-mono text-[11px] tracking-[0.22em] text-[#FBF9F5] uppercase backdrop-blur-md transition-all duration-300 hover:border-[#FBF9F5] hover:bg-[#FBF9F5] hover:text-[#1C1917]"
              >
                <span>Explore Residences</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArchitecturalIcon name="arrow-up-right" size={13} />
                </span>
              </a>
            ) : (
              <Link
                to={`/projects/${projectSlug}`}
                data-cursor="ENTER"
                className="group inline-flex items-center gap-3.5 border border-[#FBF9F5]/35 bg-[#12151B]/55 px-6 py-3.5 font-mono text-[11px] tracking-[0.22em] text-[#FBF9F5] uppercase backdrop-blur-md transition-all duration-300 hover:border-[#FBF9F5] hover:bg-[#FBF9F5] hover:text-[#1C1917]"
              >
                <span>Explore Residences</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArchitecturalIcon name="arrow-up-right" size={13} />
                </span>
              </Link>
            )}

            {/* 13 — MINIMAL SCROLL INDICATOR (Animated Hairline + Subtle Typography) */}
            <div className="flex items-center gap-3.5">
              <span
                className="font-mono text-[9px] tracking-[0.26em] text-[#E7E2DA]/80 uppercase"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                Scroll to Explore
              </span>
              <div className="relative h-7 w-[1px] overflow-hidden bg-[#FBF9F5]/20">
                <div
                  className="w-full bg-[#E7C396] transition-all duration-150"
                  style={{
                    height: `${Math.max(18, Math.round(scrollProgress * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          15 — CONTINUOUS SECTION BRIDGE AT HERO EXIT
          Soft alabaster horizon reveal during the final 12% of hero scroll
      ===================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 bg-gradient-to-t from-[#FBF9F5] to-transparent"
        style={{
          height: `${Math.round(exitTransitionT * 72)}px`,
          opacity: exitTransitionT * 0.9,
        }}
      />
    </section>
  );
};
