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

interface ScrollPhotographicChapter {
  range: [number, number];
  locationLabel: string;
  title: string;
  statement: string;
}

const EHL_PHOTOGRAPHIC_CHAPTERS: ScrollPhotographicChapter[] = [
  {
    range: [0.0, 0.28],
    locationLabel: 'DHAKA, BANGLADESH · KASHEF CHOWDHURY / URBANA',
    title: 'EHL Premium Condominiums',
    statement:
      'Deep continuous cantilevered concrete slabs, warm exterior iron-wood, and hanging gardens engineered for the tropical monsoon.',
  },
  {
    range: [0.28, 0.56],
    locationLabel: 'FACADE & OVERHANG STUDY · 270° EXPOSURE',
    title: 'Cantilevered Concrete & Iron-Wood',
    statement:
      'Generous perimeter overhangs shield exterior iron-wood louvers and floor-to-ceiling glazing from intense west solar heat and monsoon rain.',
  },
  {
    range: [0.56, 0.78],
    locationLabel: 'SPATIAL THRESHOLD · CROSS-VENTILATED LIVING GALLERY',
    title: 'Condos in the Sky',
    statement:
      'Extended ground-plane verandahs and end-to-end living galleries invite continuous natural cross-breeze across every level.',
  },
  {
    range: [0.78, 1.01],
    locationLabel: 'NOCTURNAL ELEVATION · RAINWATER REFLECTION COURT',
    title: 'EHL Premium Condominiums',
    statement:
      'At dusk, warm interior illumination glows beneath the board-formed concrete cantilevers and reflects across the rainwater harvesting court.',
  },
];

/**
 * FULL-SCREEN CINEMATIC ARCHITECTURAL HERO (100vw × 100vh)
 *
 * Strictly enforces:
 * - Full-bleed real Bangladeshi architecture across 100% of the viewport
 * - ZERO right-side panel or blank regions
 * - Minimal, subordinate typography: Project Name, Location, One Short Statement, One Primary CTA
 * - Seamless multi-angle photographic scroll journey
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
        end: isConstrained ? '+=150%' : '+=250%',
        pin: true,
        scrub: 0.65,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const activeChapter =
    EHL_PHOTOGRAPHIC_CHAPTERS.find(
      (c) => scrollProgress >= c.range[0] && scrollProgress < c.range[1]
    ) || EHL_PHOTOGRAPHIC_CHAPTERS[0];

  const displayedTitle =
    isProjectDetail && projectTitle && scrollProgress < 0.28
      ? projectTitle
      : activeChapter.title;

  const displayedLocation =
    isProjectDetail && enclaveLabel && scrollProgress < 0.28
      ? enclaveLabel
      : activeChapter.locationLabel;

  return (
    <section
      ref={sectionRef}
      aria-label="EHL Premium Condominiums, Dhaka — Full-Screen Architectural Hero"
      className="relative h-screen min-h-[680px] w-screen max-w-full overflow-hidden bg-[#14171C] text-[#FBF9F5]"
    >
      {/* =====================================================================
          1. FULL-BLEED 100vw × 100vh ARCHITECTURAL PHOTOGRAPHY & LIVE MOTION
          Zero split layout, zero right-side panel, zero blank space.
      ===================================================================== */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <HeroRealtimeArchitectureCanvas
          fallbackImageSrc={fallbackImageSrc}
          fallbackAlt={fallbackAlt}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* =====================================================================
          2. SUBORDINATE EDITORIAL TYPOGRAPHY & SINGLE PRIMARY CTA
          Leaves the entire upper and right 85% of the building completely open.
      ===================================================================== */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end px-6 pb-10 pt-24 md:px-12 md:pb-14">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left: Location + Project Name + One Short Statement */}
          <div className="max-w-xl">
            <p
              className="font-mono text-[10px] tracking-[0.22em] text-[#E7C396] uppercase"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.75)' }}
            >
              {displayedLocation}
            </p>

            <h1
              className="mt-2 font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#FBF9F5] sm:text-5xl lg:text-[56px]"
              style={{ textShadow: '0 8px 30px rgba(0,0,0,0.7)' }}
            >
              {displayedTitle}
            </h1>

            <p
              className="mt-3 max-w-lg text-sm leading-relaxed text-[#F5F2EB]/95 sm:text-base"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.85)' }}
            >
              {activeChapter.statement}
            </p>
          </div>

          {/* Right: One Primary CTA + Subtle Scroll Indicator */}
          <div className="pointer-events-auto flex flex-col items-start gap-4 lg:items-end">
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
                className="inline-flex items-center gap-3 border border-[#FBF9F5]/40 bg-[#12151B]/65 px-6 py-3.5 font-mono text-[11px] tracking-[0.2em] text-[#FBF9F5] uppercase backdrop-blur-md transition-colors hover:border-[#FBF9F5] hover:bg-[#FBF9F5] hover:text-[#1C1917]"
              >
                <span>Explore Residence</span>
                <ArchitecturalIcon name="arrow-up-right" size={13} />
              </a>
            ) : (
              <Link
                to={`/projects/${projectSlug}`}
                data-cursor="ENTER"
                className="inline-flex items-center gap-3 border border-[#FBF9F5]/40 bg-[#12151B]/65 px-6 py-3.5 font-mono text-[11px] tracking-[0.2em] text-[#FBF9F5] uppercase backdrop-blur-md transition-colors hover:border-[#FBF9F5] hover:bg-[#FBF9F5] hover:text-[#1C1917]"
              >
                <span>Explore Residence</span>
                <ArchitecturalIcon name="arrow-up-right" size={13} />
              </Link>
            )}

            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] tracking-[0.22em] text-[#E7E2DA]/85 uppercase"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                Scroll to Explore
              </span>
              <div className="h-[1px] w-20 overflow-hidden bg-[#FBF9F5]/25">
                <div
                  className="h-full bg-[#E7C396] transition-all duration-150"
                  style={{
                    width: `${Math.max(10, Math.round(scrollProgress * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
