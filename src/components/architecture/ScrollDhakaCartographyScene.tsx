import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LocationEnclave } from '../../types/realEstate';
import {
  isMobileOrConstrainedDevice,
  prefersReducedMotion,
} from '../../utils/animation';
import { ActionButton } from '../ui/Primitives';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';

gsap.registerPlugin(ScrollTrigger);

interface ScrollDhakaCartographySceneProps {
  enclaves: LocationEnclave[];
  activeEnclaveSlug: LocationEnclave['slug'];
  onSelectEnclave: (slug: LocationEnclave['slug']) => void;
}

const CARTOGRAPHY_STAGES = [
  {
    code: 'SCALE 01 / BENGAL DELTA & DHAKA WATERSHED',
    zoomLabel: '1 : 50,000 METROPOLITAN ALTITUDE',
    headline: 'A Riverine Metropolis Defined by Alluvial Waterways',
    summary:
      'Descending from the Bengal deltaic plain into northern Dhaka, our commissions occupy select plots bordered by Gulshan Lake, Baridhara diplomatic canals, Dhanmondi Lake, and the Balu-Turag ecological corridor.',
  },
  {
    code: 'SCALE 02 / 3D-TO-2D ARCHITECTURAL FLATTENING',
    zoomLabel: '1 : 10,000 ENCLAVE MATRIX',
    headline: 'Six Sovereign Micro-Enclaves of Canopy & Diplomatic Calm',
    summary:
      'As the 3D urban massing flattens into an orthographic architectural survey, inspect the six precincts where mature rain-tree canopies and controlled cul-de-sacs buffer urban acoustic density.',
  },
  {
    code: 'SCALE 03 / PLOT-LEVEL SOLAR & BOTANICAL ORIENTATION',
    zoomLabel: '1 : 1,250 PARCEL TELEMETRY',
    headline: 'South-Easterly Monsoon Catchments & Lakefront Setbacks',
    summary:
      'At parcel altitude, every Varendra & Co. footprint is rotated to capture prevailing south-easterly breezes off adjacent waterbodies while shielding western elevations with deep structural verandas.',
  },
];

/**
 * 07 & 22 — 3D-TO-2D TRANSFORMATION & SCROLL-BOUND DHAKA CARTOGRAPHY
 * As the user scrolls:
 *   00–35%: Tilted 3D Perspective Watershed Massing (56deg X-tilt, -28deg Z-rotation)
 *   35–70%: Camera pulls upward and flattens 3D massing into a precision 2D architectural map
 *   70–100%: Camera zooms into the active enclave parcel with live solar & wind vectors
 */
export const ScrollDhakaCartographyScene: React.FC<
  ScrollDhakaCartographySceneProps
> = ({ enclaves, activeEnclaveSlug, onSelectEnclave }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const mapPlaneRef = useRef<HTMLDivElement | null>(null);
  const [stageIdx, setStageIdx] = useState<number>(0);
  const [flattenProgress, setFlattenProgress] = useState<number>(0);

  const activeEnclave =
    enclaves.find((e) => e.slug === activeEnclaveSlug) || enclaves[0];

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    const mapPlane = mapPlaneRef.current;
    if (!section || !pinEl || !mapPlane) return;

    if (prefersReducedMotion() || isMobileOrConstrainedDevice()) {
      return;
    }

    const ctx = gsap.context(() => {
      const towers3D = mapPlane.querySelectorAll('[data-map-3d-pillar]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          pin: pinEl,
          scrub: 0.65,
          onUpdate: (self) => {
            const p = self.progress;
            setFlattenProgress(Math.round(p * 100));
            const nextStage = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
            setStageIdx((prev) => (prev !== nextStage ? nextStage : prev));
          },
        },
      });

      // Stage 1 -> Stage 2: 3D tilted massing flattens into 2D orthographic survey
      tl.fromTo(
        mapPlane,
        {
          rotateX: 54,
          rotateZ: -24,
          scale: 0.88,
        },
        {
          rotateX: 0,
          rotateZ: 0,
          scale: 1.0,
          duration: 0.55,
          ease: 'power2.inOut',
        },
        0
      ).to(
        towers3D,
        {
          scaleY: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut',
        },
        0.05
      );

      // Stage 2 -> Stage 3: Zoom into parcel scale
      tl.to(
        mapPlane,
        {
          scale: 1.14,
          duration: 0.45,
          ease: 'power2.inOut',
        },
        0.55
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const currentStage = CARTOGRAPHY_STAGES[stageIdx] || CARTOGRAPHY_STAGES[0];

  return (
    <section
      ref={sectionRef}
      id="dhaka-enclaves"
      aria-label="Scroll-Driven 3D-to-2D Dhaka Cartography & Enclave Atlas"
      className="relative border-b border-[#D6CEBE] bg-[#EBE6DF] text-[#1C1917]"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden py-10 lg:py-14"
      >
        {/* Top Cartographic Header */}
        <div className="mx-auto w-full max-w-[1360px] px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CEBE] pb-4">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="font-semibold text-[#78350F]">
                CHAPTER 05 · 3D-TO-2D DHAKA CARTOGRAPHIC ZOOM
              </span>
              <span aria-hidden="true" className="text-[#D6CEBE]">
                ·
              </span>
              <span className="text-[#57534E]">{currentStage.zoomLabel}</span>
            </div>

            {/* Enclave Quick Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {enclaves.map((loc) => {
                const isSelected = loc.slug === activeEnclave.slug;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => onSelectEnclave(loc.slug)}
                    className={`border px-3 py-1 font-mono text-[10px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                        : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#57534E] hover:border-[#1C1917]'
                    }`}
                  >
                    {loc.name.split(' ')[0]}
                  </button>
                );
              })}
              <ActionButton to="/locations" variant="secondary" className="ml-2">
                Full Atlas
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Center 12-Column Interactive 3D-to-2D Map + Active Enclave Dossier */}
        <div className="mx-auto my-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-10 px-6 py-6 md:px-12 lg:grid-cols-12">
          {/* Left 7 Columns: 3D-to-2D Transforming Cartographic Viewport */}
          <div className="flex flex-col justify-between border border-[#D6CEBE] bg-[#141210] p-5 text-[#FBF9F5] sm:p-7 lg:col-span-7">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#C28E5C]">
              <span>{currentStage.code}</span>
              <span>
                PROJECTION:{' '}
                {flattenProgress < 40
                  ? '3D AXONOMETRIC URBAN MASS'
                  : flattenProgress < 75
                    ? '2D ORTHOGRAPHIC SURVEY'
                    : 'PARCEL MICROCLIMATE ZOOM'}{' '}
                [{flattenProgress}%]
              </span>
            </div>

            <div
              className="relative aspect-[16/11] w-full overflow-hidden border border-[#FBF9F5]/15 bg-[#1C1917] flex items-center justify-center"
              style={{ perspective: '1200px' }}
            >
              <div
                ref={mapPlaneRef}
                className="relative h-full w-full origin-center will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full select-none"
                  role="img"
                  aria-label="Interactive 3D to 2D schematic map of Dhaka luxury residential enclaves"
                >
                  {/* Coordinate Survey Grid */}
                  {[15, 30, 45, 60, 75, 85].map((coord) => (
                    <React.Fragment key={coord}>
                      <line
                        x1={coord}
                        y1="0"
                        x2={coord}
                        y2="100"
                        stroke="#3F3A34"
                        strokeWidth="0.25"
                        strokeDasharray="1 1"
                      />
                      <line
                        x1="0"
                        y1={coord}
                        x2="100"
                        y2={coord}
                        stroke="#3F3A34"
                        strokeWidth="0.25"
                        strokeDasharray="1 1"
                      />
                    </React.Fragment>
                  ))}

                  {/* Dhaka Alluvial Waterways (Gulshan-Banani Lake, Dhanmondi Lake, Balu River) */}
                  <path
                    d="M 44 10 Q 52 38, 45 58 T 52 94"
                    fill="none"
                    stroke="#C28E5C"
                    strokeWidth="1.4"
                    strokeOpacity="0.45"
                  />
                  <path
                    d="M 80 6 Q 89 45, 84 92"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.6"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M 18 62 Q 30 75, 24 92"
                    fill="none"
                    stroke="#C28E5C"
                    strokeWidth="1.1"
                    strokeOpacity="0.4"
                  />

                  {/* Enclave Nodes + 3D Extruded Massing Pillars (Flatten on Scroll) */}
                  {enclaves.map((enclave, idx) => {
                    const isSelected = enclave.slug === activeEnclave.slug;
                    const cx = enclave.mapPosition.xPercent;
                    const cy = enclave.mapPosition.yPercent;

                    return (
                      <g
                        key={enclave.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Inspect Dhaka enclave 0${idx + 1}: ${enclave.name}`}
                        aria-pressed={isSelected}
                        onClick={() => onSelectEnclave(enclave.slug)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectEnclave(enclave.slug);
                          }
                        }}
                        className="cursor-pointer focus:outline-none"
                      >
                        {/* Outer Radar Pulse Ring for Selected Enclave */}
                        {isSelected && (
                          <>
                            <circle
                              cx={cx}
                              cy={cy}
                              r="8.5"
                              fill="#C28E5C"
                              fillOpacity="0.16"
                              stroke="#C28E5C"
                              strokeWidth="0.45"
                            />
                            <line
                              x1={cx - 12}
                              y1={cy}
                              x2={cx + 12}
                              y2={cy}
                              stroke="#C28E5C"
                              strokeWidth="0.25"
                              strokeDasharray="1 1"
                            />
                            <line
                              x1={cx}
                              y1={cy - 12}
                              x2={cx}
                              y2={cy + 12}
                              stroke="#C28E5C"
                              strokeWidth="0.25"
                              strokeDasharray="1 1"
                            />
                          </>
                        )}

                        {/* 3D Vertical Massing Pillar (Flattens into 2D map as user scrolls) */}
                        <g data-map-3d-pillar style={{ transformOrigin: `${cx}px ${cy}px` }}>
                          <polygon
                            points={`${cx - 1.8},${cy} ${cx + 1.8},${cy} ${cx + 1.8 - 4},${cy - 12} ${cx - 1.8 - 4},${cy - 12}`}
                            fill={isSelected ? '#C28E5C' : '#78716C'}
                            fillOpacity={isSelected ? '0.85' : '0.45'}
                            stroke="#FBF9F5"
                            strokeWidth="0.2"
                          />
                        </g>

                        {/* 2D Orthographic Survey Node */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? '2.6' : '1.7'}
                          fill={isSelected ? '#FDE68A' : '#D6CEBE'}
                        />

                        <text
                          x={cx + 3.4}
                          y={cy + 1}
                          fontSize="3.1"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight={isSelected ? '600' : '400'}
                          fill={isSelected ? '#FDE68A' : '#D6CEBE'}
                        >
                          0{idx + 1} {enclave.name.split(' ')[0].toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[#A8A29E]">
              <span>
                SCROLL TO FLATTEN 3D URBAN MASSING INTO 2D ARCHITECTURAL ATLAS
              </span>
              <span className="text-[#C28E5C]">
                {activeEnclave.coordinatesLabel} · ILLUSTRATIVE DEMO
              </span>
            </div>
          </div>

          {/* Right 5 Columns: Synchronized Enclave Dossier */}
          <div className="flex flex-col justify-between space-y-6 border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-8 lg:col-span-5">
            <div>
              <span className="font-mono text-xs text-[#78350F]">
                {activeEnclave.district.toUpperCase()} · {activeEnclave.coordinatesLabel}
              </span>

              <h2 className="mt-2 font-serif text-3xl font-normal leading-[1.08] text-[#1C1917] sm:text-4xl">
                {activeEnclave.name}
              </h2>

              <p className="mt-2 font-serif text-base italic text-[#44403C]">
                {activeEnclave.characterSummary}
              </p>

              <p className="mt-4 text-xs leading-relaxed text-[#44403C] sm:text-sm">
                {activeEnclave.urbanContextEssay}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-b border-[#D6CEBE] py-4 text-xs">
                <div>
                  <dt className="text-[#78716C]">Botanical Canopy Index</dt>
                  <dd className="mt-1 font-mono font-semibold text-[#14532D]">
                    {activeEnclave.canopyCoverageEstimate}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Solar & Wind Orientation</dt>
                  <dd className="mt-1 font-medium text-[#1C1917]">
                    {activeEnclave.typicalPlotOrientation}
                  </dd>
                </div>
              </dl>

              <div className="mt-4">
                <h4 className="font-mono text-[10px] tracking-wider text-[#78716C]">
                  ADJACENT URBAN CORRIDORS (CONCEPT DEMO)
                </h4>
                <ul className="mt-2 divide-y divide-[#D6CEBE]/60 text-xs">
                  {activeEnclave.proximityHighlights.map((hl) => (
                    <li
                      key={hl.destination}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="font-medium text-[#1C1917]">
                        {hl.destination}
                      </span>
                      <span className="font-mono text-[11px] text-[#57534E]">
                        {hl.urbanCorridor}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#D6CEBE] pt-4">
              <Link
                to={`/locations?enclave=${activeEnclave.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1C1917] hover:text-[#78350F]"
              >
                <span>Examine Complete {activeEnclave.name} Dossier</span>
                <ArchitecturalIcon name="arrow-up-right" size={14} />
              </Link>
              <span className="font-mono text-[11px] text-[#78716C]">
                DHAKA, BD
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
