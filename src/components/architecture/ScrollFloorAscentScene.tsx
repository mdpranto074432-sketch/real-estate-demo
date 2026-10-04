import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectMonograph } from '../../types/realEstate';
import {
  isMobileOrConstrainedDevice,
  prefersReducedMotion,
} from '../../utils/animation';
import { ActionButton } from '../ui/Primitives';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import {
  formatBdtValuation,
  useBangladeshLocalization,
} from '../../utils/bangladeshLocalization';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloorAscentSceneProps {
  project: ProjectMonograph;
}

interface ElevationTier {
  id: string;
  floorRangeLabel: string;
  elevationFeet: string;
  title: string;
  typology: string;
  areaSqFt: string;
  ceilingHeight: string;
  acousticRating: string;
  viewAspect: string;
  valuationDemo: string;
  narrative: string;
  highlightSlabIndices: number[]; // Out of 14 stories (0 = Ground, 13 = Crown)
}

const ELEVATION_TIERS: ElevationTier[] = [
  {
    id: 'tier-ground',
    floorRangeLabel: 'GROUND & LEVEL 01',
    elevationFeet: '+0.0 FT TO +24.0 FT',
    title: 'Ceremonial Arrival Court, Baithak Library & Basalt Water Cloister',
    typology: 'Sanctuary Podium & Private Hospitality',
    areaSqFt: '9,800 sq. ft. Footprint',
    ceilingHeight: '18.5 ft. Clear Cloister',
    acousticRating: '48 dB Street Isolation',
    viewAspect: 'Shaded Rain-Tree & Basalt Reflection Pool',
    valuationDemo: 'Resident Sanctuary Commons',
    narrative:
      'Ascending from the diplomatic cul-de-sac, residents cross a black basalt rainwater mirror into a double-height Burmese teak Baithak and rare-book library—segregated completely from subterranean vehicular ramps.',
    highlightSlabIndices: [0, 1],
  },
  {
    id: 'tier-podium',
    floorRangeLabel: 'LEVEL 02 – LEVEL 03',
    elevationFeet: '+24.0 FT TO +50.0 FT',
    title: '25-Meter Cantilevered Horizon Pool & Subterranean Hammam',
    typology: 'Hydrotherapy & Botanical Wellness Level',
    areaSqFt: '6,450 sq. ft. Wellness Plate',
    ceilingHeight: '14.0 ft. Acoustic Soffit',
    acousticRating: 'STC-58 Structural Isolation',
    viewAspect: 'Eastern Lake Canopy & Frangipani Veranda',
    valuationDemo: 'Reserved by Household Appointment',
    narrative:
      'Suspended at tree-canopy level, the dark Sukabumi stone infinity lap pool projects fourteen feet toward Gulshan Lake, accompanied by honed limestone steam rooms and private acoustic movement studios.',
    highlightSlabIndices: [2, 3],
  },
  {
    id: 'tier-mid',
    floorRangeLabel: 'LEVEL 04 – LEVEL 07',
    elevationFeet: '+50.0 FT TO +98.0 FT',
    title: 'Canopy Simplex Sanctuaries — One Residence Per Floor',
    typology: 'Full-Floor Garden Residence (4 Bedroom)',
    areaSqFt: '6,450 sq. ft. Single Level',
    ceilingHeight: '11.5 ft. Post-Tensioned Span',
    acousticRating: '32 dBA Interior Stillness',
    viewAspect: '360° Mature Rain-Tree Canopy & Lake Glint',
    valuationDemo: '৳ 28.5 Crore (Demo / Illustrative)',
    narrative:
      'Positioned directly within the upper botanical crown of Dhaka’s rain trees, each full-floor residence enjoys a 52-foot column-free Great Salon wrapped in operable Burmese teak brise-soleil screens.',
    highlightSlabIndices: [4, 5, 6, 7],
  },
  {
    id: 'tier-high',
    floorRangeLabel: 'LEVEL 08 – LEVEL 11',
    elevationFeet: '+98.0 FT TO +146.0 FT',
    title: 'Upper Horizon Full-Floor Estates',
    typology: 'Simplex Horizon Sanctuary (4 Bedroom + Study)',
    areaSqFt: '6,450 sq. ft. Single Level',
    ceilingHeight: '11.5 ft. Clear Span',
    acousticRating: '31 dBA Interior Stillness',
    viewAspect: 'Unobstructed Gulshan-Baridhara Watershed Panorama',
    valuationDemo: '৳ 31.0 Crore (Demo / Illustrative)',
    narrative:
      'Rising above neighboring structures, Levels 08 through 11 capture uninterrupted south-easterly monsoon breezes across fourteen-foot sky verandas with 750mm recessed botanical root trenches.',
    highlightSlabIndices: [8, 9, 10, 11],
  },
  {
    id: 'tier-crown',
    floorRangeLabel: 'LEVEL 12 – LEVEL 14 (CROWN)',
    elevationFeet: '+146.0 FT TO +194.0 FT',
    title: 'The Crown Duplex & Sky Pavilion Penthouse',
    typology: 'Duplex Sky Villa (5 Bedroom + Private Roof Court)',
    areaSqFt: '11,200 sq. ft. Dual Level',
    ceilingHeight: '22.0 ft. Double-Height Atrium',
    acousticRating: '30 dBA Sanctuary Rating',
    viewAspect: '360° Sovereign Horizon & Private Sky Plunge Pool',
    valuationDemo: '৳ 54.0 Crore (Demo / Illustrative)',
    narrative:
      'Crowning the monolith beneath an architectural parasol roof, the Duplex Penthouse commands a 22-foot double-height salon, private internal sculptural stair, and a cantilevered sky court overlooking all of northern Dhaka.',
    highlightSlabIndices: [12, 13],
  },
];

/**
 * 05 — SCROLL-DRIVEN FLOOR SELECTION & VERTICAL BUILDING ASCENT
 * As the user scrolls, the camera ascends vertically up the 14-story architectural
 * section from Ground Arrival -> Podium Pool -> Canopy Floors -> Horizon Estates -> Crown Penthouse.
 */
export const ScrollFloorAscentScene: React.FC<ScrollFloorAscentSceneProps> = ({
  project,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [activeTierIdx, setActiveTierIdx] = useState<number>(0);
  const [ascentPct, setAscentPct] = useState<number>(0);
  const { bdtDisplayUnit } = useBangladeshLocalization();

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    if (!section || !pinEl) return;

    if (prefersReducedMotion() || isMobileOrConstrainedDevice()) {
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=240%',
        pin: pinEl,
        scrub: 0.6,
        snap: {
          snapTo: 1 / (ELEVATION_TIERS.length - 1),
          duration: { min: 0.18, max: 0.45 },
          delay: 0.05,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const p = self.progress;
          setAscentPct(Math.round(p * 100));
          const idx = Math.min(
            ELEVATION_TIERS.length - 1,
            Math.max(0, Math.round(p * (ELEVATION_TIERS.length - 1)))
          );
          setActiveTierIdx((prev) => (prev !== idx ? idx : prev));
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const currentTier = ELEVATION_TIERS[activeTierIdx] || ELEVATION_TIERS[0];

  return (
    <section
      ref={sectionRef}
      id="vertical-floor-journey"
      aria-label="Scroll-Driven Vertical Building Floor Selection"
      className="relative border-b border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917]"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden py-12 lg:py-16"
      >
        {/* Top Telemetry Header */}
        <div className="mx-auto w-full max-w-[1360px] px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CEBE] pb-4">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="font-semibold text-[#78350F]">
                CHAPTER 04 · VERTICAL FLOOR ASCENT & ELEVATION SELECTOR
              </span>
              <span aria-hidden="true" className="text-[#D6CEBE]">
                ·
              </span>
              <span className="text-[#57534E]">
                {project.title.toUpperCase()} (14 LEVELS)
              </span>
            </div>

            {/* Interactive Tier Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {ELEVATION_TIERS.map((tier, idx) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTierIdx(idx)}
                  className={`border px-3 py-1 font-mono text-[10px] transition-colors cursor-pointer ${
                    activeTierIdx === idx
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                      : 'border-[#D6CEBE] bg-[#EBE6DF]/50 text-[#57534E] hover:border-[#1C1917]'
                  }`}
                >
                  0{idx + 1}. {tier.floorRangeLabel.split(' ')[0]}
                </button>
              ))}
              <span className="ml-2 hidden font-mono text-xs text-[#78350F] tabular-nums lg:inline">
                ELEVATION [{ascentPct}%]
              </span>
            </div>
          </div>
        </div>

        {/* Center 12-Column Interactive Building Section + Active Floor Plate Dossier */}
        <div className="mx-auto my-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-10 px-6 py-8 md:px-12 lg:grid-cols-12">
          {/* Left 5 Columns: Interactive 14-Story Architectural Tower Elevation */}
          <div className="relative flex flex-col items-center justify-center border border-[#D6CEBE] bg-[#141210] p-6 text-[#FBF9F5] lg:col-span-5">
            <div className="mb-4 flex w-full items-center justify-between font-mono text-[10px] text-[#C28E5C]">
              <span>ARCHITECTURAL SECTION · 14 STORIES</span>
              <span>{currentTier.elevationFeet}</span>
            </div>

            {/* 14-Floor Interactive Stack (Top = Floor 14, Bottom = Ground) */}
            <div className="relative flex w-full max-w-xs flex-col gap-1.5 py-4">
              {/* Parasol Roof Crown */}
              <div className="mx-auto h-2 w-11/12 border-t-2 border-x border-[#C28E5C] bg-[#C28E5C]/20" />

              {Array.from({ length: 14 })
                .map((_, i) => 13 - i)
                .map((floorIndex) => {
                  const isHighlighted =
                    currentTier.highlightSlabIndices.includes(floorIndex);
                  const tierMatchIndex = ELEVATION_TIERS.findIndex((t) =>
                    t.highlightSlabIndices.includes(floorIndex)
                  );

                  return (
                    <button
                      key={floorIndex}
                      type="button"
                      onClick={() => {
                        if (tierMatchIndex !== -1) {
                          setActiveTierIdx(tierMatchIndex);
                        }
                      }}
                      aria-label={`Inspect Floor Level ${floorIndex === 0 ? 'Ground' : floorIndex}`}
                      className={`group relative flex h-6 w-full items-center justify-between border px-3 font-mono text-[10px] transition-all duration-300 cursor-pointer ${
                        isHighlighted
                          ? 'scale-[1.05] border-[#C28E5C] bg-[#C28E5C]/30 text-[#FBF9F5] shadow-lg'
                          : 'border-[#FBF9F5]/15 bg-[#1C1917] text-[#A8A29E] hover:border-[#FBF9F5]/40'
                      }`}
                    >
                      <span>
                        {floorIndex === 0
                          ? 'GND COURT'
                          : floorIndex >= 12
                            ? `LVL ${floorIndex} PENTHOUSE`
                            : `LVL ${String(floorIndex).padStart(2, '0')}`}
                      </span>
                      <span
                        className={
                          isHighlighted ? 'text-[#FDE68A]' : 'text-[#78716C]'
                        }
                      >
                        {isHighlighted ? '● ACTIVE PLATE' : '6,450 SQ.FT'}
                      </span>
                    </button>
                  );
                })}

              {/* Subterranean Foundation Plinth */}
              <div className="mt-1 h-3 w-full bg-[#292524] border-t border-[#78716C]" />
            </div>

            <div className="mt-3 flex w-full items-center justify-between border-t border-[#FBF9F5]/15 pt-3 font-mono text-[10px] text-[#A8A29E]">
              <span>CLICK OR SCROLL TO ASCEND</span>
              <span className="text-[#C28E5C]">1 RESIDENCE / FLOOR</span>
            </div>
          </div>

          {/* Right 7 Columns: Dominant Kinetic Floor Number & Synchronized Specification */}
          <div className="relative flex flex-col justify-between space-y-6 lg:col-span-7 lg:pl-6">
            {/* Oversized Kinetic Floor Level Watermark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 right-0 select-none font-mono text-[110px] font-light leading-none text-[#EBE6DF] sm:text-[160px]"
            >
              0{activeTierIdx + 1}
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 border border-[#78350F]/40 bg-[#EBE6DF] px-3 py-1 font-mono text-xs text-[#78350F]">
                <span>{currentTier.floorRangeLabel}</span>
                <span>·</span>
                <span>{currentTier.elevationFeet}</span>
              </div>

              <h2 className="mt-4 font-serif text-3xl font-normal leading-[1.08] tracking-tight text-[#1C1917] sm:text-5xl">
                {currentTier.title}
              </h2>

              <p className="mt-2 font-mono text-xs text-[#78350F]">
                {currentTier.typology}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-[#44403C] sm:text-base">
                {currentTier.narrative}
              </p>
            </div>

            {/* Synchronized Floor Metrics Schedule */}
            <dl className="relative z-10 grid grid-cols-2 gap-4 border-t border-b border-[#D6CEBE] py-5 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-[#78716C]">Floor Plate Volume</dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-[#1C1917] tabular-nums">
                  {currentTier.areaSqFt}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Ceiling Soffit Height</dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-[#1C1917] tabular-nums">
                  {currentTier.ceilingHeight}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Acoustic Attenuation</dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-[#14532D]">
                  {currentTier.acousticRating}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[#78716C]">Primary Horizon Aspect</dt>
                <dd className="mt-1 font-medium text-[#1C1917]">
                  {currentTier.viewAspect}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Indicative Valuation</dt>
                <dd className="mt-1 font-mono text-xs font-semibold text-[#78350F]">
                  {formatBdtValuation(
                    currentTier.valuationDemo,
                    bdtDisplayUnit
                  )}
                </dd>
              </div>
            </dl>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <ActionButton
                to={`/contact?project=${project.slug}&floor=${encodeURIComponent(currentTier.floorRangeLabel)}`}
                variant="primary"
              >
                <span>Inquire About {currentTier.floorRangeLabel}</span>
                <ArchitecturalIcon name="arrow-up-right" size={14} />
              </ActionButton>

              <span className="font-mono text-[11px] text-[#78716C]">
                DEMO ILLUSTRATIVE ELEVATION SCHEDULE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
