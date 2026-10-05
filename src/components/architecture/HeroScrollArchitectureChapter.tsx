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
import { IMAGE_ASSETS } from '../../data/mockRealEstateData';

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
 * 12 — PRODUCTION ERROR BOUNDARY FOR THE HERO VISUAL ENGINE
 * Guarantees that if any child visual engine or runtime API throws an exception,
 * the homepage never renders a blank/black screen and immediately displays the
 * real architectural hero image with full editorial typography and CTA.
 */
interface VisualBoundaryProps {
  fallbackImageSrc: string;
  fallbackAlt: string;
  children: React.ReactNode;
}

interface VisualBoundaryState {
  hasError: boolean;
}

class HeroVisualErrorBoundary extends React.Component<
  VisualBoundaryProps,
  VisualBoundaryState
> {
  constructor(props: VisualBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): VisualBoundaryState {
    console.error('[Hero] ERROR caught by HeroVisualErrorBoundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[Hero] ERROR stack trace:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const safeSrc =
        this.props.fallbackImageSrc ||
        IMAGE_ASSETS.ehlDhakaPlate ||
        '/images/ehl_dhaka_condominium_plate_1791106691381.jpg';
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#13161B]">
          <img
            src={safeSrc}
            alt={this.props.fallbackAlt}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith('/images/ehl_dhaka_condominium_plate_1791106691381.jpg')) {
                target.src = '/images/ehl_dhaka_condominium_plate_1791106691381.jpg';
              }
            }}
            className="h-full w-full object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(14,17,22,0.18) 0%, rgba(14,17,22,0.0) 20%, rgba(14,17,22,0.0) 58%, rgba(14,17,22,0.72) 100%)',
            }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

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
    const tType = window.setTimeout(() => setTypographyReady(true), 420);
    const tCta = window.setTimeout(() => setCtaReady(true), 820);
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

    try {
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
    } catch (err) {
      console.error('[Hero] ERROR initializing ScrollTrigger:', err);
      return;
    }
  }, []);

  const activeBeat =
    HERO_EDITORIAL_BEATS.find(
      (b) => scrollProgress >= b.range[0] && scrollProgress < b.range[1]
    ) || HERO_EDITORIAL_BEATS[0];

  const displayedEyebrow =
    isProjectDetail && enclaveLabel && scrollProgress < 0.36
      ? enclaveLabel
      : activeBeat.eyebrow;

  const exitTransitionT = Math.max(0, Math.min(1, (scrollProgress - 0.88) / 0.12));
  const heroLiftY = -exitTransitionT * 36;

  return (
    <section
      ref={sectionRef}
      aria-label="Architectural Hero"
      className="relative h-screen min-h-[680px] w-screen max-w-full overflow-hidden bg-[#151514] text-[#F2EEE7]"
    >
      {/* =====================================================================
          1. FULL-BLEED REAL BUILDING VISUAL & LIVE CAMERA MOTION
          Wrapped in HeroVisualErrorBoundary for guaranteed production safety.
      ===================================================================== */}
      <div
        className="absolute inset-0 z-0 h-full w-full will-change-transform"
        style={{
          transform: `translate3d(0, ${heroLiftY.toFixed(1)}px, 0)`,
        }}
      >
        <HeroVisualErrorBoundary
          fallbackImageSrc={fallbackImageSrc}
          fallbackAlt={fallbackAlt}
        >
          <HeroRealtimeArchitectureCanvas
            fallbackImageSrc={fallbackImageSrc}
            fallbackAlt={fallbackAlt}
            scrollProgress={scrollProgress}
          />
        </HeroVisualErrorBoundary>
      </div>

      {/* =====================================================================
          2. SUBORDINATE EDITORIAL TYPOGRAPHY & COMPOSITIONAL BALANCE
      ===================================================================== */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end px-6 pb-10 pt-24 sm:px-10 md:px-14 md:pb-14">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Editorial Eyebrow + Masked Line Reveal Headline + Short Statement */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden">
              <p
                className={`font-mono text-[10px] tracking-[0.26em] text-[#B5A07D] uppercase transition-all duration-700 ease-out sm:text-[11px] ${
                  typographyReady
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }`}
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
              >
                {displayedEyebrow}
              </p>
            </div>

            {isProjectDetail && projectTitle && scrollProgress < 0.36 ? (
              <div className="mt-3 overflow-hidden">
                <h1
                  className={`font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#F2EEE7] transition-all duration-900 ease-out sm:text-5xl lg:text-[62px] ${
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
                className="mt-3 font-serif text-3xl font-normal leading-[1.03] tracking-tight text-[#F2EEE7] sm:text-5xl lg:text-[58px]"
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

            <p
              className={`mt-4 max-w-md text-sm leading-relaxed text-[#F2EEE7]/90 transition-all duration-900 delay-300 ease-out sm:text-[15px] ${
                typographyReady
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}
            >
              {activeBeat.statement}
            </p>
          </div>

          {/* RIGHT COLUMN: One Primary CTA + One Secondary CTA + Minimal Scroll Indicator */}
          <div
            className={`pointer-events-auto flex flex-col items-start justify-between gap-6 transition-all duration-900 ease-out lg:col-span-4 lg:items-end ${
              ctaReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                  className="group inline-flex min-h-[44px] items-center justify-center gap-3 border border-[#F2EEE7] bg-[#F2EEE7] px-6 py-3 font-mono text-[11px] tracking-[0.22em] text-[#151514] uppercase transition-all duration-300 hover:bg-[#986046] hover:border-[#986046] hover:text-[#F2EEE7]"
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
                  className="group inline-flex min-h-[44px] items-center justify-center gap-3 border border-[#F2EEE7] bg-[#F2EEE7] px-6 py-3 font-mono text-[11px] tracking-[0.22em] text-[#151514] uppercase transition-all duration-300 hover:bg-[#986046] hover:border-[#986046] hover:text-[#F2EEE7]"
                >
                  <span>Explore Residences</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArchitecturalIcon name="arrow-up-right" size={13} />
                  </span>
                </Link>
              )}

              <Link
                to="/contact"
                data-cursor="BRIEFING"
                className="group inline-flex min-h-[44px] items-center justify-center gap-2.5 border border-[#F2EEE7]/40 bg-[#151514]/60 px-5 py-3 font-mono text-[11px] tracking-[0.2em] text-[#F2EEE7] uppercase backdrop-blur-md transition-all duration-300 hover:border-[#F2EEE7] hover:bg-[#151514]/90"
              >
                <span>Schedule Briefing</span>
              </Link>
            </div>

            {/* 13 — MINIMAL SCROLL INDICATOR */}
            <div className="flex items-center gap-3.5">
              <span
                className="font-mono text-[9px] tracking-[0.26em] text-[#A59D90] uppercase"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                Scroll to Explore
              </span>
              <div className="relative h-7 w-[1px] overflow-hidden bg-[#F2EEE7]/20">
                <div
                  className="w-full bg-[#986046] transition-all duration-150"
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
      ===================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 bg-gradient-to-t from-[#F2EEE7] to-transparent"
        style={{
          height: `${Math.round(exitTransitionT * 72)}px`,
          opacity: exitTransitionT * 0.9,
        }}
      />
    </section>
  );
};
