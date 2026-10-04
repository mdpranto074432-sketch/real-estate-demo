import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  GLOBAL_DEMO_NOTICE,
  LOCATION_ENCLAVES,
  PROJECTS_DATA,
} from '../data/mockRealEstateData';
import { EnclaveSlug } from '../types/realEstate';
import { useEditorialEntrance } from '../utils/animation';
import { usePageMetadata } from '../utils/metadata';
import { ArchitecturalImage } from '../components/ui/ArchitecturalImage';
import { ArchitecturalIcon } from '../components/ui/ArchitecturalIcon';
import {
  ActionButton,
  EditorialGridSection,
  EditorialMetaLine,
  SectionHeader,
  SegmentedFilter,
} from '../components/ui/Primitives';
import { getProjectUnitMetrics } from '../components/projects/ProjectMonographCard';
import { ConversionActionSuite } from '../components/conversion/ConversionActionSuite';

export const LocationsPage: React.FC = () => {
  usePageMetadata({
    title: 'Dhaka Residential Enclaves — Urban & Botanical Atlas',
    description:
      'Architectural and microclimatic studies of Dhaka’s premier residential enclaves: Gulshan, Baridhara, Banani, Dhanmondi, Bashundhara, and Jolshiri.',
    canonicalPath: '/locations',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Dhaka Premier Residential Enclaves — Varendra & Co. Atlas',
      itemListElement: LOCATION_ENCLAVES.map((loc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Place',
          name: `${loc.name}, ${loc.district}, Dhaka`,
          description: loc.characterSummary,
        },
      })),
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialParam = searchParams.get('enclave') as EnclaveSlug | null;

  const [activeSlug, setActiveSlug] = useState<EnclaveSlug>(
    initialParam && LOCATION_ENCLAVES.some((e) => e.slug === initialParam)
      ? initialParam
      : LOCATION_ENCLAVES[0].slug
  );

  const containerRef = useEditorialEntrance<HTMLDivElement>(activeSlug);

  const activeEnclave =
    LOCATION_ENCLAVES.find((e) => e.slug === activeSlug) ||
    LOCATION_ENCLAVES[0];

  const enclaveProjects = PROJECTS_DATA.filter(
    (p) => p.enclaveSlug === activeEnclave.slug
  );

  const handleSelectEnclave = (slug: EnclaveSlug) => {
    setActiveSlug(slug);
    setSearchParams({ enclave: slug });
    const el = document.getElementById('enclave-dossier-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef}>
      {/* =====================================================================
          01. EDITORIAL HEADER & ENCLAVE SELECTOR
      ===================================================================== */}
      <section className="mx-auto max-w-[1360px] px-6 pt-10 pb-12 md:px-12 lg:pt-16">
        <div
          data-animate="editorial"
          className="border-b border-[#D6CEBE] pb-10"
        >
          <EditorialMetaLine
            items={[
              'DHAKA URBAN ATLAS',
              `${LOCATION_ENCLAVES.length} RESIDENTIAL PRECINCTS`,
              'MICROCLIMATE & CANOPY STUDIES (CONCEPT DEMO)',
            ]}
          />
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-normal leading-[1.08] tracking-tight text-[#1C1917] text-balance sm:text-5xl lg:text-[62px]">
            The Geography of Quiet in Dhaka
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#44403C]">
            In one of the world’s most vital metropolises, true residential
            sanctuary depends on micro-geography: lakeside wind corridors,
            mature rain-tree canopies, diplomatic height discipline, and
            waterfront watersheds.
          </p>

          <div className="mt-8">
            <SegmentedFilter
              ariaLabel="Select Dhaka Enclave Study"
              activeValue={activeSlug}
              onChange={handleSelectEnclave}
              options={LOCATION_ENCLAVES.map((loc) => ({
                value: loc.slug,
                label:
                  loc.district.split(' ')[0] === 'Block'
                    ? 'Bashundhara'
                    : loc.name.split(' ')[0],
              }))}
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          02. INTERACTIVE MAP EXPERIENCE & ACTIVE ENCLAVE DOSSIER
      ===================================================================== */}
      <section
        id="enclave-dossier-anchor"
        className="mx-auto max-w-[1360px] px-6 pb-16 md:px-12 lg:pb-24"
      >
        <div
          data-animate="editorial"
          className="grid grid-cols-1 gap-10 border-b border-[#D6CEBE] pb-16 lg:grid-cols-12"
        >
          {/* Left 6 Columns: Interactive Dhaka Watershed & Coordinate Map */}
          <div className="flex flex-col justify-between border border-[#D6CEBE] bg-[#EBE6DF]/40 p-6 md:p-8 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-[#D6CEBE] pb-4 text-xs">
              <span className="font-mono text-[#78350F]">
                INTERACTIVE DHAKA ENCLAVE MAP (ILLUSTRATIVE)
              </span>
              <span className="font-mono text-[#1C1917] tabular-nums">
                {activeEnclave.coordinatesLabel}
              </span>
            </div>

            <div className="relative my-6 aspect-[4/3] w-full border border-[#D6CEBE] bg-[#FBF9F5]">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full select-none"
                role="img"
                aria-label="Interactive schematic map of Dhaka luxury residential enclaves"
              >
                {[20, 40, 60, 80].map((coord) => (
                  <React.Fragment key={coord}>
                    <line
                      x1={coord}
                      y1="0"
                      x2={coord}
                      y2="100"
                      stroke="#D6CEBE"
                      strokeWidth="0.3"
                      strokeDasharray="1.5 1.5"
                    />
                    <line
                      x1="0"
                      y1={coord}
                      x2="100"
                      y2={coord}
                      stroke="#D6CEBE"
                      strokeWidth="0.3"
                      strokeDasharray="1.5 1.5"
                    />
                  </React.Fragment>
                ))}

                {/* Stylized Gulshan-Banani-Dhanmondi-Balu Watershed Contours */}
                <path
                  d="M 44 12 Q 50 38, 45 55 T 52 92"
                  fill="none"
                  stroke="#78350F"
                  strokeWidth="0.9"
                  strokeOpacity="0.3"
                />
                <path
                  d="M 82 10 Q 88 45, 84 90"
                  fill="none"
                  stroke="#14532D"
                  strokeWidth="1.2"
                  strokeOpacity="0.28"
                />
                <path
                  d="M 18 65 Q 30 75, 24 90"
                  fill="none"
                  stroke="#78350F"
                  strokeWidth="0.9"
                  strokeOpacity="0.3"
                />

                {/* Interactive & Keyboard-Accessible Enclave Nodes */}
                {LOCATION_ENCLAVES.map((enclave, idx) => {
                  const isSelected = enclave.slug === activeEnclave.slug;
                  return (
                    <g
                      key={enclave.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Inspect enclave 0${idx + 1}: ${enclave.name} (${enclave.district})`}
                      aria-pressed={isSelected}
                      onClick={() => handleSelectEnclave(enclave.slug)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectEnclave(enclave.slug);
                        }
                      }}
                      className="cursor-pointer focus:outline-none"
                    >
                      {isSelected && (
                        <>
                          <circle
                            cx={enclave.mapPosition.xPercent}
                            cy={enclave.mapPosition.yPercent}
                            r="9"
                            fill="#78350F"
                            fillOpacity="0.1"
                            stroke="#78350F"
                            strokeWidth="0.35"
                            strokeDasharray="1 1"
                          />
                          <circle
                            cx={enclave.mapPosition.xPercent}
                            cy={enclave.mapPosition.yPercent}
                            r="5"
                            fill="#78350F"
                            fillOpacity="0.2"
                          />
                        </>
                      )}
                      <circle
                        cx={enclave.mapPosition.xPercent}
                        cy={enclave.mapPosition.yPercent}
                        r={isSelected ? '2.5' : '1.7'}
                        fill={isSelected ? '#78350F' : '#1C1917'}
                      />
                      <text
                        x={enclave.mapPosition.xPercent + 3.2}
                        y={enclave.mapPosition.yPercent + 1}
                        fontSize="3.1"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={isSelected ? '600' : '400'}
                        fill={isSelected ? '#78350F' : '#44403C'}
                      >
                        0{idx + 1}{' '}
                        {enclave.district.split(' ')[0] === 'Block'
                          ? 'BASHUNDHARA'
                          : enclave.name.split(' ')[0].toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-[#57534E]">
              <span>Click any enclave marker on the map to inspect its dossier</span>
              <span className="font-mono text-[11px] text-[#78350F]">
                CONCEPT CARTOGRAPHY
              </span>
            </div>
          </div>

          {/* Right 6 Columns: Selected Enclave Visual Plate & Urban Context */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <ArchitecturalImage
                src={activeEnclave.featuredImage}
                alt={`${activeEnclave.name} architectural streetscape`}
                aspectRatioClass="aspect-[16/9]"
                caption={`${activeEnclave.name} (${activeEnclave.district}) — ${activeEnclave.canopyCoverageEstimate}`}
                figureNumber={activeEnclave.coordinatesLabel}
              />

              <div className="mt-6">
                <EditorialMetaLine
                  items={[
                    activeEnclave.district,
                    activeEnclave.coordinatesLabel,
                    activeEnclave.canopyCoverageEstimate,
                  ]}
                />
                <h2 className="mt-2 font-serif text-3xl text-[#1C1917] sm:text-4xl">
                  {activeEnclave.name}
                </h2>
                <p className="mt-2 font-serif text-lg italic text-[#44403C]">
                  {activeEnclave.characterSummary}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#1C1917]">
                  {activeEnclave.urbanContextEssay}
                </p>
              </div>
            </div>

            {/* Urban Corridors & Spatial Adjacency */}
            <div className="mt-6 border-t border-[#D6CEBE] pt-5">
              <h3 className="font-mono text-xs font-semibold text-[#1C1917]">
                URBAN CORRIDORS & SPATIAL ADJACENCY (CONCEPT STUDY)
              </h3>
              <table className="mt-3 w-full text-left text-xs">
                <tbody className="divide-y divide-[#D6CEBE]/70">
                  {activeEnclave.proximityHighlights.map((item) => (
                    <tr key={item.destination}>
                      <td className="py-2.5 pr-2 font-medium text-[#1C1917]">
                        {item.destination}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-[#78716C] text-right">
                        {item.urbanCorridor}
                      </td>
                      <td className="py-2.5 pl-2 font-mono font-medium text-[#78350F] text-right">
                        {item.spatialNote}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Associated Projects in Selected Enclave */}
        <div className="mt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-[#78350F]">
                ASSOCIATED ARCHITECTURAL MONOGRAPHS
              </p>
              <h3 className="mt-1 font-serif text-2xl text-[#1C1917] sm:text-3xl">
                Commissioned Residences in {activeEnclave.name}
              </h3>
            </div>
            <ActionButton
              to={`/projects?enclave=${activeEnclave.slug}`}
              variant="secondary"
            >
              Filter Portfolio by {activeEnclave.name.split(' ')[0]}
            </ActionButton>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {enclaveProjects.map((proj) => {
              const metrics = getProjectUnitMetrics(proj);
              return (
                <div
                  key={proj.id}
                  className="flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-8"
                >
                  <div>
                    <EditorialMetaLine
                      items={[
                        proj.catalogNumber,
                        proj.status,
                        proj.completionYear,
                      ]}
                    />
                    <h4 className="mt-2 font-serif text-3xl text-[#1C1917]">
                      <Link
                        to={`/projects/${proj.slug}`}
                        className="hover:text-[#78350F]"
                      >
                        {proj.title}
                      </Link>
                    </h4>
                    <p className="mt-1 font-serif text-base italic text-[#44403C]">
                      {proj.subtitle}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-[#44403C]">
                      {proj.curatorialStatement}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#D6CEBE] pt-4 text-xs">
                    <span className="font-mono text-[#1C1917] tabular-nums">
                      {metrics.areaRangeLabel} · {metrics.bedroomsLabel}
                    </span>
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1 font-medium text-[#1C1917] hover:text-[#78350F]"
                    >
                      <span>Examine Monograph</span>
                      <ArchitecturalIcon name="arrow-up-right" size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          03. ALL 6 DHAKA ENCLAVE EXPLORER CARDS
      ===================================================================== */}
      <EditorialGridSection
        surface="structural"
        borderTop
        borderBottom
      >
        <SectionHeader
          indexNumber="02"
          kicker="Complete Dhaka Precinct Directory"
          title="Compare All Six Residential Enclaves"
          subtitle="Select any enclave card below to load its geodetic coordinates, botanical canopy index, and associated residential monographs."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {LOCATION_ENCLAVES.map((loc, idx) => {
            const isSelected = loc.slug === activeSlug;
            const associatedCount = PROJECTS_DATA.filter(
              (p) => p.enclaveSlug === loc.slug
            ).length;

            return (
              <article
                key={loc.id}
                className={`flex flex-col justify-between border p-6 transition-colors ${
                  isSelected
                    ? 'border-[#1C1917] bg-[#FBF9F5]'
                    : 'border-[#D6CEBE] bg-[#FBF9F5] hover:border-[#78350F]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#78350F] tabular-nums">
                      ENCLAVE 0{idx + 1} · {loc.district.toUpperCase()}
                    </span>
                    <span className="text-[#78716C] tabular-nums">
                      {associatedCount} Monograph{associatedCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl text-[#1C1917]">
                    {loc.name}
                  </h3>

                  <p className="mt-1 font-mono text-[11px] text-[#78716C] tabular-nums">
                    {loc.coordinatesLabel}
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-[#44403C]">
                    {loc.characterSummary}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#D6CEBE] pt-4">
                  <p className="font-mono text-[11px] text-[#14532D]">
                    {loc.canopyCoverageEstimate}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectEnclave(loc.slug)}
                      className="font-mono font-medium text-[#1C1917] underline hover:text-[#78350F] cursor-pointer"
                    >
                      {isSelected ? 'Currently Inspecting' : 'Inspect Enclave Study →'}
                    </button>

                    <Link
                      to={`/projects?enclave=${loc.slug}`}
                      className="text-[#57534E] hover:text-[#1C1917]"
                    >
                      View Projects
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          04. GENERAL CONVERSION SUITE
      ===================================================================== */}
      <EditorialGridSection surface="canvas">
        <ConversionActionSuite
          projectSlug={enclaveProjects[0]?.slug || PROJECTS_DATA[0].slug}
        />
        <p className="mt-6 font-mono text-[11px] text-[#78716C]">
          {GLOBAL_DEMO_NOTICE}
        </p>
      </EditorialGridSection>
    </div>
  );
};
