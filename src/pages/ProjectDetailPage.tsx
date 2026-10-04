import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  DEVELOPER_PROFILE,
  GLOBAL_DEMO_NOTICE,
  IMAGE_ASSETS,
  LOCATION_ENCLAVES,
  PROJECTS_DATA,
  RESIDENCE_ARCHETYPES,
} from '../data/mockRealEstateData';
import {
  useChoreographedScroll,
  useEditorialEntrance,
  useStateTransition,
} from '../utils/animation';
import { usePageMetadata } from '../utils/metadata';
import { ArchitecturalImage } from '../components/ui/ArchitecturalImage';
import { ArchitecturalIcon } from '../components/ui/ArchitecturalIcon';
import { ArchitecturalTooltip } from '../components/ui/ArchitecturalTooltip';
import { SplitEditorialHeading } from '../components/ui/MaskedTypography';
import {
  ActionButton,
  ArchitecturalStatusText,
  EditorialGridSection,
  EditorialMetaLine,
  SectionHeader,
  SegmentedFilter,
} from '../components/ui/Primitives';
import { MonographErrorState } from '../components/ui/FeedbackStates';
import { FloorPlanViewer } from '../components/projects/FloorPlanViewer';
import { getProjectUnitMetrics } from '../components/projects/ProjectMonographCard';
import { ConversionActionSuite } from '../components/conversion/ConversionActionSuite';
import { ArchitecturalMassing3DViewer } from '../components/architecture/ArchitecturalMassing3DViewer';
import { HeroScrollArchitectureChapter } from '../components/architecture/HeroScrollArchitectureChapter';
import { MonsoonSolarCanvasSequence } from '../components/architecture/MonsoonSolarCanvasSequence';
import { ScrollArchitecturalAnatomyScene } from '../components/architecture/ScrollArchitecturalAnatomyScene';
import { ScrollFloorAscentScene } from '../components/architecture/ScrollFloorAscentScene';
import { BangladeshTrustLedger } from '../components/trust/BangladeshTrustLedger';
import {
  formatBdtValuation,
  useBangladeshLocalization,
} from '../utils/bangladeshLocalization';

interface GalleryPlate {
  id: string;
  src: string;
  title: string;
  category: 'Exterior Elevation' | 'Interior Volume' | 'Material & Detail';
  caption: string;
  figureCode: string;
}

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS_DATA.find((p) => p.slug === slug);
  const { bdtDisplayUnit, languageMode } = useBangladeshLocalization();

  usePageMetadata({
    title: project
      ? `${project.title} (${project.enclaveName}) — Architectural Monograph`
      : 'Monograph Not Found',
    description: project
      ? project.curatorialStatement
      : 'Requested architectural monograph could not be found.',
    canonicalPath: project ? `/projects/${project.slug}` : '/projects',
    ogType: 'article',
    ogImage: project?.heroImage,
    structuredData: project
      ? {
          '@context': 'https://schema.org',
          '@type': 'ApartmentComplex',
          name: `${project.title} (Concept Monograph)`,
          description: project.curatorialStatement,
          address: {
            '@type': 'PostalAddress',
            streetAddress: project.addressLine,
            addressLocality: project.enclaveName,
            addressRegion: 'Dhaka',
            addressCountry: 'BD',
          },
          numberOfAccommodationUnits: project.totalResidences,
          FloorSize: {
            '@type': 'QuantitativeValue',
            value: project.typicalFloorAreaSqFt,
            unitCode: 'FTK',
          },
        }
      : undefined,
  });

  // Reset component states when switching between projects
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    project?.floorPlans[0]?.id || ''
  );
  const [activeStoryTab, setActiveStoryTab] = useState<
    'concept' | 'form' | 'facade' | 'materials' | 'spatial'
  >('concept');
  const [activeTypologyCode, setActiveTypologyCode] = useState<
    '2BR' | '3BR' | '4BR' | 'PENTHOUSE'
  >('4BR');
  const [activeAmenityIndex, setActiveAmenityIndex] = useState<number>(0);
  const [unitAvailabilityFilter, setUnitAvailabilityFilter] = useState<
    'all' | 'available'
  >('all');

  // Immersive Fullscreen Gallery State (Keyboard + Mobile Touch Swipe)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(
    null
  );
  const touchStartXRef = useRef<number | null>(null);

  // Sync default floor plan and amenity index when route slug changes
  useEffect(() => {
    if (project) {
      setSelectedPlanId(project.floorPlans[0]?.id || '');
      setActiveAmenityIndex(0);
      setActiveGalleryIndex(null);
    }
  }, [project]);

  const entranceRef = useEditorialEntrance<HTMLDivElement>(slug || 'detail');
  const scrollChoreographyRef = useChoreographedScroll<HTMLDivElement>(slug || 'detail');
  const storyDimensionRef = useStateTransition<HTMLDivElement>(activeStoryTab);

  if (!project) {
    return <MonographErrorState />;
  }

  const metrics = getProjectUnitMetrics(project);
  const enclaveDossier =
    LOCATION_ENCLAVES.find((e) => e.slug === project.enclaveSlug) ||
    LOCATION_ENCLAVES[0];

  // Curated 5-Plate Architectural Gallery for this Project
  const galleryPlates: GalleryPlate[] = [
    {
      id: 'gp-1',
      src: project.heroImage,
      title: `${project.title} — Primary Twilight Elevation`,
      category: 'Exterior Elevation',
      caption: `${project.addressLine}. Deep cantilevered monsoon verandas and acoustic glazing envelope.`,
      figureCode: `${project.catalogNumber} / PLATE 01`,
    },
    {
      id: 'gp-2',
      src: project.interiorImage,
      title: `${project.title} — Great Salon & Double-Height Volume`,
      category: 'Interior Volume',
      caption:
        'Column-free post-tensioned living gallery finished in unfilled honed Roman travertine and seasoned Burmese teak.',
      figureCode: `${project.catalogNumber} / PLATE 02`,
    },
    {
      id: 'gp-3',
      src: project.secondaryImage,
      title: `${project.title} — Enclave Streetscape & Botanical Canopy`,
      category: 'Exterior Elevation',
      caption: `Set back along ${project.enclaveName}, buffered by mature rain trees and permeable water courts.`,
      figureCode: `${project.catalogNumber} / PLATE 03`,
    },
    {
      id: 'gp-4',
      src: IMAGE_ASSETS.dhanmondiTerrace,
      title: `${project.title} — Tectonic Masonry & Brise-Soleil Detail`,
      category: 'Material & Detail',
      caption: `Solar heat gain reduced by ${project.environmentalMetrics.solarHeatGainReduction}.`,
      figureCode: `${project.catalogNumber} / PLATE 04`,
    },
    {
      id: 'gp-5',
      src: IMAGE_ASSETS.baridharaPavilion,
      title: `${project.title} — Podium Lap Pool & Reflections`,
      category: 'Interior Volume',
      caption:
        'Acoustically isolated hydrotherapy lap pool and shaded courtyard cloister.',
      figureCode: `${project.catalogNumber} / PLATE 05`,
    },
  ];

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape) for Fullscreen Gallery
  useEffect(() => {
    if (activeGalleryIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveGalleryIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveGalleryIndex((prev) =>
          prev === null ? 0 : (prev + 1) % galleryPlates.length
        );
      } else if (e.key === 'ArrowLeft') {
        setActiveGalleryIndex((prev) =>
          prev === null
            ? 0
            : (prev - 1 + galleryPlates.length) % galleryPlates.length
        );
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeGalleryIndex, galleryPlates.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX < -45) {
      // Swipe Left -> Next
      setActiveGalleryIndex((prev) =>
        prev === null ? 0 : (prev + 1) % galleryPlates.length
      );
    } else if (deltaX > 45) {
      // Swipe Right -> Prev
      setActiveGalleryIndex((prev) =>
        prev === null
          ? 0
          : (prev - 1 + galleryPlates.length) % galleryPlates.length
      );
    }
    touchStartXRef.current = null;
  };

  const displayedUnits =
    unitAvailabilityFilter === 'all'
      ? project.units
      : project.units.filter(
          (u) => u.allocationStatus === 'Available for Private Briefing'
        );

  const selectedArchetype =
    RESIDENCE_ARCHETYPES.find((a) => a.code === activeTypologyCode) ||
    RESIDENCE_ARCHETYPES[2];

  const activeAmenity =
    project.amenities[activeAmenityIndex] || project.amenities[0];

  const currentProjectIndex = PROJECTS_DATA.findIndex(
    (p) => p.slug === project.slug
  );
  const nextProject =
    PROJECTS_DATA[(currentProjectIndex + 1) % PROJECTS_DATA.length];

  return (
    <div ref={scrollChoreographyRef}>
      <div ref={entranceRef}>
        {/* =====================================================================
            01. CINEMATIC REALTIME 3D / WEBGL PROJECT HERO & SCROLL DECONSTRUCTION
        ===================================================================== */}
        <HeroScrollArchitectureChapter
          fallbackImageSrc={project.heroImage}
          fallbackAlt={`${project.title} — ${project.enclaveName}`}
          projectTitle={project.title}
          projectSlug={project.slug}
          enclaveLabel={`${project.enclaveName.toUpperCase()} · ${project.status.toUpperCase()}`}
          addressLabel={project.addressLine}
          catalogLabel={project.catalogNumber}
          isProjectDetail
          onLaunchGallery={() => setActiveGalleryIndex(0)}
        />

        {/* =====================================================================
            02. PROJECT FACTS (COMPLETE 14-FIELD BANGLADESH PROPERTY INFORMATION MODEL)
            Supports: project name, location, property type, area in sq ft, bedrooms,
            bathrooms, parking, floor, status, handover, payment structure,
            price / price on request (BDT), developer information, and
            documentation/trust information.
        ===================================================================== */}
        <section
          id="project-facts"
          className="border-b border-[#D6CEBE] bg-[#FBF9F5] py-12 md:py-16"
        >
          <div className="mx-auto max-w-[1360px] px-6 md:px-12">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-[#78350F]">
                01. BANGLADESH PROPERTY SPECIFICATION & MONOGRAPH LEDGER (14-POINT SCHEDULE)
              </span>
              <span className="font-mono text-[11px] text-[#78716C]">
                STATUS: DEMO / ILLUSTRATIVE ARCHITECTURAL DATA · ZERO FABRICATED PERMITS
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-y-7 gap-x-6 border-t border-b border-[#D6CEBE] py-8 sm:grid-cols-3 lg:grid-cols-7">
              <div>
                <dt className="text-xs text-[#78716C]">01. Project Name</dt>
                <dd className="mt-1.5 font-serif text-base font-medium text-[#1C1917]">
                  {project.title}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">02. Location / Enclave</dt>
                <dd className="mt-1.5 font-serif text-base font-medium text-[#1C1917]">
                  {project.enclaveName}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">03. Property Type</dt>
                <dd className="mt-1.5 text-xs font-medium text-[#1C1917]">
                  {metrics.propertyTypeLabel}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">04. Area (sq. ft. & Katha)</dt>
                <dd className="mt-1.5">
                  <span className="block font-mono text-xs font-semibold text-[#1C1917] tabular-nums">
                    {metrics.areaRangeLabel}
                  </span>
                  <ArchitecturalTooltip
                    term={`${project.landAreaKathas} Katha Plot`}
                    definition="Bengal land area measurement (Demo Plot)."
                    benchmark={`${(
                      project.landAreaKathas * 720
                    ).toLocaleString('en-IN')} sq. ft.`}
                  />
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">05. Bedrooms</dt>
                <dd className="mt-1.5 font-mono text-xs font-medium text-[#1C1917] tabular-nums">
                  {metrics.bedroomsLabel}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">06. Bathrooms</dt>
                <dd className="mt-1.5 font-mono text-xs font-medium text-[#1C1917] tabular-nums">
                  {metrics.bathroomsLabel}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">07. Parking</dt>
                <dd className="mt-1.5 font-mono text-xs font-medium text-[#1C1917] tabular-nums">
                  {metrics.parkingLabel}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">08. Floor Structure</dt>
                <dd className="mt-1.5 font-mono text-xs font-medium text-[#1C1917] tabular-nums">
                  {metrics.floorAllocationLabel}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">09. Project Status</dt>
                <dd className="mt-1.5 font-mono text-xs font-medium text-[#1C1917]">
                  {project.status}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">10. Handover (Demo)</dt>
                <dd className="mt-1.5 font-mono text-xs font-medium text-[#78350F] tabular-nums">
                  {project.completionYear}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">11. Payment Structure</dt>
                <dd className="mt-1.5 font-mono text-[11px] text-[#1C1917]">
                  Milestone-Linked (5 Stages · Demo)
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">12. Price / BDT Valuation</dt>
                <dd className="mt-1.5 font-mono text-xs font-semibold text-[#78350F] tabular-nums">
                  {metrics.minPriceCrore !== null
                    ? formatBdtValuation(
                        `${metrics.minPriceCrore} Crore`,
                        bdtDisplayUnit,
                        languageMode
                      )
                    : 'Price on Request (Demo)'}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">13. Developer Info</dt>
                <dd className="mt-1.5 text-xs font-medium text-[#1C1917]">
                  {DEVELOPER_PROFILE.brandName}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#78716C]">14. Documentation / Trust</dt>
                <dd className="mt-1.5">
                  <a
                    href="#trust-documentation"
                    className="font-mono text-[11px] font-medium text-[#14532D] underline hover:text-[#78350F]"
                  >
                    Inspect 9-Pillar Vault ↓
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      {/* =====================================================================
          02B. CONTINUOUS SCROLL-DRIVEN ARCHITECTURAL DISASSEMBLY & PORTAL
          Exploded tectonic sequence specific to this monograph commission.
      ===================================================================== */}
      <ScrollArchitecturalAnatomyScene project={project} />

      {/* =====================================================================
          03. ARCHITECTURAL STORY
          Explains: Concept, Form, Facade, Materials, Spatial Philosophy
      ===================================================================== */}
      <EditorialGridSection
        id="architectural-story"
        surface="canvas"
        borderBottom
      >
        <SectionHeader
          indexNumber="02"
          kicker="Architectural Monograph & Tectonic Thesis"
          title="Concept, Form, Facade, and Material Provenance"
          subtitle={project.curatorialStatement}
          align="between"
          action={
            <SegmentedFilter
              ariaLabel="Inspect Architectural Story Dimension"
              activeValue={activeStoryTab}
              onChange={setActiveStoryTab}
              options={[
                { value: 'concept', label: '01. Concept' },
                { value: 'form', label: '02. Form & Massing' },
                { value: 'facade', label: '03. Facade' },
                { value: 'materials', label: '04. Materials' },
                { value: 'spatial', label: '05. Spatial Philosophy' },
              ]}
            />
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left 7 Columns: Long-form Architectural Essay + Interactive Dimension Breakdown */}
          <div className="lg:col-span-7">
            {/* Dynamic Architectural Dimension Panel */}
            <div
              ref={storyDimensionRef}
              className="mb-10 border border-[#D6CEBE] bg-[#EBE6DF]/45 p-6 md:p-8"
            >
              {activeStoryTab === 'concept' && (
                <div>
                  <p className="font-mono text-xs text-[#78350F]">
                    DIMENSION 01 · ARCHITECTURAL CONCEPT
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                    A Vertical Stack of Shaded Bengal Pavilions
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                    Designed by {project.leadArchitectConcept} in collaboration
                    with {project.landscapeDesignConcept}, {project.title} was
                    conceived to reconcile high-density urban living in{' '}
                    {project.enclaveName} with the botanical serenity of a
                    traditional landed bungalow.
                  </p>
                </div>
              )}

              {activeStoryTab === 'form' && (
                <div>
                  <p className="font-mono text-xs text-[#78350F]">
                    DIMENSION 02 · FORM & MASSING
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                    Stepped Cantilevers & Four-Sided Daylight Exposure
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                    Rising {project.stories} stories on a {project.landAreaKathas}
                    -Katha plot, the structural massing steps back to create deep
                    14-foot perimeter overhangs. Post-tensioned flat slabs
                    eliminate internal drop beams, yielding column-free living
                    spans with 11.5- to 22-foot clear ceiling heights.
                  </p>
                </div>
              )}

              {activeStoryTab === 'facade' && (
                <div>
                  <p className="font-mono text-xs text-[#78350F]">
                    DIMENSION 03 · FACADE ENGINEERING
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                    Climatic Brise-Soleil & {project.environmentalMetrics.acousticAttenuationDb} Acoustic Envelope
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                    The building’s double-skin envelope pairs operable louvers
                    with double-glazed low-iron laminated glass, achieving{' '}
                    {project.environmentalMetrics.solarHeatGainReduction} while
                    isolating the interior to a 32 dBA silence floor.
                  </p>
                </div>
              )}

              {activeStoryTab === 'materials' && (
                <div>
                  <p className="font-mono text-xs text-[#78350F]">
                    DIMENSION 04 · MATERIAL HONESTY
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                    Selected for Fifty Years of Monsoon Weathering
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                    Every primary surface—{project.materialPalette.map((m) => m.material).join(', ')}—is chosen for natural patination and tactile permanence rather than synthetic surface gloss.
                  </p>
                </div>
              )}

              {activeStoryTab === 'spatial' && (
                <div>
                  <p className="font-mono text-xs text-[#78350F]">
                    DIMENSION 05 · SPATIAL PHILOSOPHY
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                    Complete Horizontal Sovereignty & Segregated Circulation
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                    With {project.environmentalMetrics.crossVentilationRatio},
                    each residence separates formal guest entertaining from
                    private family quarters and back-of-house staff/spice-kitchen
                    circulation via dual independent elevator cores.
                  </p>
                </div>
              )}
            </div>

            {/* Full Long-Form Monograph Essay */}
            <div className="max-w-prose space-y-6 text-base leading-[1.8] text-[#1C1917]">
              {project.architecturalEssay.map((paragraph, index) => (
                <p
                  key={index}
                  className={index === 0 ? 'editorial-dropcap' : ''}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Material Palette & Environmental Telemetry */}
          <aside className="space-y-8 lg:col-span-5">
            <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-8">
              <p className="font-mono text-xs text-[#78350F]">
                MATERIAL PROVENANCE SCHEDULE
              </p>
              <h3 className="mt-1 font-serif text-2xl text-[#1C1917]">
                Tactile Specifications
              </h3>
              <div className="mt-6 divide-y divide-[#D6CEBE]">
                {project.materialPalette.map((item) => (
                  <div
                    key={item.material}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <p className="font-serif text-lg font-medium text-[#1C1917]">
                      {item.material}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#78350F]">
                      Origin: {item.origin}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#44403C]">
                      {item.application}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#D6CEBE] bg-[#EBE6DF]/40 p-6 md:p-8">
              <p className="font-mono text-xs text-[#14532D]">
                ENVIRONMENTAL TELEMETRY (DEMO BENCHMARKS)
              </p>
              <dl className="mt-4 space-y-3.5 text-xs">
                <div className="border-b border-[#D6CEBE] pb-3">
                  <dt className="text-[#78716C]">Solar Heat Gain Mitigation</dt>
                  <dd className="mt-1 font-mono font-medium text-[#1C1917] tabular-nums">
                    {project.environmentalMetrics.solarHeatGainReduction}
                  </dd>
                </div>
                <div className="border-b border-[#D6CEBE] pb-3">
                  <dt className="text-[#78716C]">Natural Cross-Ventilation</dt>
                  <dd className="mt-1 font-mono font-medium text-[#1C1917] tabular-nums">
                    {project.environmentalMetrics.crossVentilationRatio}
                  </dd>
                </div>
                <div className="border-b border-[#D6CEBE] pb-3">
                  <dt className="text-[#78716C]">Acoustic Facade Attenuation</dt>
                  <dd className="mt-1 font-mono font-medium text-[#1C1917] tabular-nums">
                    {project.environmentalMetrics.acousticAttenuationDb}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Rainwater Harvesting Cistern</dt>
                  <dd className="mt-1 font-mono font-medium text-[#1C1917] tabular-nums">
                    {project.environmentalMetrics.rainwaterHarvestingCapacityLiters.toLocaleString()}{' '}
                    Liters
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        {/* 08. Interactive 3D WebGL Architectural Massing & Exploded Floor-Plate Studio */}
        <div data-scroll="panel-elevate" className="mt-16">
          <ArchitecturalMassing3DViewer project={project} />
        </div>

        {/* 09. Interactive 60-Frame Diurnal Solar & Monsoon Facade Sequence */}
        <div data-scroll="panel-elevate" className="mt-12">
          <MonsoonSolarCanvasSequence
            projectTitle={project.title}
            enclaveName={project.enclaveName}
          />
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          03B. SCROLL-DRIVEN FLOOR SELECTION & VERTICAL ELEVATION ASCENT
      ===================================================================== */}
      <ScrollFloorAscentScene project={project} />

      {/* =====================================================================
          04. FULL-SCREEN VISUAL STORYTELLING
          Large image compositions with dramatic obsidian framing and pull-quotes.
      ===================================================================== */}
      <section className="surface-dark-optical border-b border-[#D6CEBE] py-20 lg:py-28">
        <div className="mx-auto max-w-[1360px] px-6 md:px-12">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-[#D6CEBE]/20 pb-6">
            <div>
              <p className="font-mono text-xs tracking-widest text-[#D6CEBE]">
                03. SPATIAL & ATMOSPHERIC PLATES
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#FBF9F5] sm:text-5xl">
                Dialogues Between Interior Stillness and the Monsoon Horizon
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveGalleryIndex(1)}
              className="font-mono text-xs text-[#D6CEBE] underline hover:text-[#FBF9F5] cursor-pointer"
            >
              Inspect Fullscreen Plate →
            </button>
          </div>

          {/* Primary Full-Width Visual Spread */}
          <div data-scroll="panel-elevate">
            <ArchitecturalImage
              src={project.interiorImage}
              alt={`${project.title} double-height interior living sanctuary`}
              aspectRatioClass="aspect-[16/9]"
              caption={`Interior Living Gallery — ${project.title}. Fourteen-foot cantilevered veranda framing the ${project.enclaveName} canopy.`}
              figureNumber={`${project.catalogNumber} / PLATE B`}
              parallax
              clipReveal
              onInspectPlate={() => setActiveGalleryIndex(1)}
            />
          </div>

          {/* Diptych Visual Storytelling Pair + Architectural Pull Quote */}
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div data-scroll="panel-elevate" className="lg:col-span-6">
              <ArchitecturalImage
                src={project.secondaryImage}
                alt={`${project.title} facade masonry and louvers`}
                aspectRatioClass="aspect-[4/3]"
                caption="Exterior Tectonics — Hand-finished stone and timber louvers modulating afternoon light."
                figureNumber={`${project.catalogNumber} / PLATE C`}
                parallax
                clipReveal
                onInspectPlate={() => setActiveGalleryIndex(2)}
              />
            </div>

            <div className="space-y-6 lg:col-span-6 lg:pl-8">
              <p className="font-mono text-xs text-[#D6CEBE]/75">
                CURATORIAL OBSERVATION
              </p>
              <blockquote className="font-serif text-2xl italic leading-relaxed text-[#FBF9F5] sm:text-3xl">
                “When the monsoon rain sweeps across {project.enclaveName}, the
                fourteen-foot cantilevered veranda allows every glass slider to
                remain open—inviting the scent of wet earth and cooled air
                without a single drop entering the travertine salon.”
              </blockquote>
              <p className="text-xs text-[#D6CEBE]/80">
                — {project.leadArchitectConcept} · Monograph Design Notes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          05. RESIDENCE TYPES & INDIVIDUAL UNIT SCHEDULE
          Shows 2BR, 3BR, 4BR, Duplex/Penthouse archetypes + project unit schedule.
      ===================================================================== */}
      <EditorialGridSection
        id="residence-types"
        surface="canvas"
        borderBottom
      >
        <SectionHeader
          indexNumber="04"
          kicker="Residence Typologies & Allocation Schedule (Demo)"
          title="Spatial Configurations & Residence Inventory"
          subtitle="Inspect the individual residence schedule for this monograph alongside our studio’s four architectural unit archetypes (2BR, 3BR, 4BR Full-Floor, and Duplex/Triplex Penthouse)."
          align="between"
          action={
            <SegmentedFilter
              ariaLabel="Filter units by availability"
              activeValue={unitAvailabilityFilter}
              onChange={setUnitAvailabilityFilter}
              options={[
                {
                  value: 'all',
                  label: 'All Commissioned Units',
                  count: project.units.length,
                },
                {
                  value: 'available',
                  label: 'Available for Briefing',
                  count: project.units.filter(
                    (u) =>
                      u.allocationStatus === 'Available for Private Briefing'
                  ).length,
                },
              ]}
            />
          }
        />

        {/* Project-Specific Unit Allocation Schedule Table */}
        <div className="mt-10 overflow-x-auto border border-[#D6CEBE] bg-[#FBF9F5]">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#1C1917] bg-[#EBE6DF]/60 text-xs font-semibold text-[#1C1917]">
                <th className="py-4 px-5">Residence Code</th>
                <th className="py-4 px-4">Level</th>
                <th className="py-4 px-4">Residence Typology</th>
                <th className="py-4 px-4">Gross Area</th>
                <th className="py-4 px-4">Configuration</th>
                <th className="py-4 px-4">Allocation Status (Demo)</th>
                <th className="py-4 px-4">Indicative Valuation (Demo)</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6CEBE]">
              {displayedUnits.map((unit) => {
                const isAvailable =
                  unit.allocationStatus === 'Available for Private Briefing';
                return (
                  <tr
                    key={unit.id}
                    className="transition-colors hover:bg-[#EBE6DF]/40"
                  >
                    <td className="py-4 px-5 font-mono font-semibold text-[#1C1917] tabular-nums">
                      {unit.unitCode}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#57534E] tabular-nums">
                      Level{' '}
                      {unit.floorNumber < 10
                        ? `0${unit.floorNumber}`
                        : unit.floorNumber}
                    </td>
                    <td className="py-4 px-4 font-serif text-base text-[#1C1917]">
                      {unit.residenceType}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#1C1917] tabular-nums">
                      {unit.areaSqFt.toLocaleString()} sq. ft.
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[#57534E] tabular-nums">
                      {unit.bedrooms}BR · {unit.baths} Bath · {unit.parkingBays}{' '}
                      Bays
                    </td>
                    <td className="py-4 px-4">
                      <ArchitecturalStatusText
                        status={unit.allocationStatus}
                        tone={isAvailable ? 'botanical' : 'muted'}
                      />
                    </td>
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-[#78350F] tabular-nums">
                      {unit.indicativeValuationBDT}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href="#floor-plans"
                          onClick={() => setSelectedPlanId(unit.floorPlanId)}
                          className="font-mono text-xs text-[#78350F] underline hover:text-[#1C1917] whitespace-nowrap"
                        >
                          Floor Plate
                        </a>
                        <Link
                          to={`/contact?project=${project.slug}&unit=${encodeURIComponent(
                            unit.unitCode
                          )}`}
                          className="inline-flex items-center gap-1 font-medium text-[#1C1917] hover:text-[#78350F] whitespace-nowrap"
                        >
                          <span>Inquire</span>
                          <ArchitecturalIcon name="arrow-up-right" size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Comparative Typology Guide: 2BR / 3BR / 4BR / Duplex Penthouse */}
        <div className="mt-14 border border-[#D6CEBE] bg-[#EBE6DF]/35 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[#D6CEBE] pb-5 lg:flex-row lg:items-center">
            <div>
              <p className="font-mono text-xs text-[#78350F]">
                PORTFOLIO RESIDENCE ARCHETYPES (2BR · 3BR · 4BR · PENTHOUSE)
              </p>
              <h3 className="mt-1 font-serif text-2xl text-[#1C1917]">
                Compare Spatial Typologies Across Our Practice
              </h3>
            </div>
            <SegmentedFilter
              ariaLabel="Compare Residence Typology"
              activeValue={activeTypologyCode}
              onChange={setActiveTypologyCode}
              options={RESIDENCE_ARCHETYPES.map((arch) => ({
                value: arch.code,
                label:
                  arch.code === 'PENTHOUSE'
                    ? 'Duplex / Penthouse'
                    : `${arch.code} Residence`,
              }))}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs text-[#57534E]">
                {selectedArchetype.label} · {selectedArchetype.typicalProject}
              </p>
              <h4 className="mt-1 font-serif text-2xl text-[#1C1917]">
                {selectedArchetype.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                {selectedArchetype.spatialNarrative}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t border-[#D6CEBE] pt-4 text-xs lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <div>
                <dt className="text-[#78716C]">Typical Volume</dt>
                <dd className="mt-1 font-mono font-semibold text-[#1C1917] tabular-nums">
                  {selectedArchetype.grossAreaRangeSqFt}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Veranda Depth</dt>
                <dd className="mt-1 font-mono text-[#1C1917] tabular-nums">
                  {selectedArchetype.verandaDepthFeet}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Configuration</dt>
                <dd className="mt-1 text-[#1C1917]">
                  {selectedArchetype.bedroomsLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Demo Valuation</dt>
                <dd className="mt-1 font-mono text-[#78350F] tabular-nums">
                  {selectedArchetype.indicativeValuationDemo}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          06. FLOOR PLANS (INTERACTIVE SVG + ZOOM + UNIT SELECTOR + CTA)
      ===================================================================== */}
      <EditorialGridSection
        id="floor-plans"
        surface="structural"
        borderBottom
      >
        <SectionHeader
          indexNumber="05"
          kicker="Interactive Architectural Blueprint Viewer"
          title="Floor Plates, Room Proportions & Unit Selector"
          subtitle="Use the interactive schematic below to switch between residence units, zoom into 1:100 architectural zones, toggle dimension layers, and inspect room orientations."
        />

        <div className="mt-10">
          <FloorPlanViewer
            floorPlans={project.floorPlans}
            units={project.units}
            projectSlug={project.slug}
            selectedPlanId={selectedPlanId}
            onSelectPlanId={setSelectedPlanId}
          />
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          07. AMENITIES (INTERACTIVE VISUAL PRESENTATION)
      ===================================================================== */}
      <EditorialGridSection
        id="amenities-showcase"
        surface="canvas"
        borderBottom
      >
        <SectionHeader
          indexNumber="06"
          kicker="Resident Sanctuary & Private Hospitality"
          title="Curated Amenities Reserved by Household Appointment"
          subtitle="Each amenity space is acoustically buffered and designed as a quiet extension of your private residence."
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left 5 Columns: Interactive Amenity Selector List */}
          <div className="space-y-3 lg:col-span-5">
            {project.amenities.map((amenity, idx) => {
              const isSelected = idx === activeAmenityIndex;
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => setActiveAmenityIndex(idx)}
                  className={`w-full border p-5 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                      : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] hover:border-[#78350F]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-mono tabular-nums ${
                        isSelected ? 'text-[#D6CEBE]' : 'text-[#78350F]'
                      }`}
                    >
                      0{idx + 1} · {amenity.category.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-normal">
                    {amenity.title}
                  </h3>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      isSelected ? 'text-[#D6CEBE]/90' : 'text-[#57534E]'
                    }`}
                  >
                    {amenity.description}
                  </p>
                  <p
                    className={`mt-3 border-t pt-2.5 font-mono text-[11px] tabular-nums ${
                      isSelected
                        ? 'border-[#D6CEBE]/25 text-[#FBF9F5]'
                        : 'border-[#D6CEBE] text-[#78716C]'
                    }`}
                  >
                    {amenity.specification}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right 7 Columns: Visual Amenity Plate */}
          <div className="lg:col-span-7">
            {activeAmenity && (
              <div className="border border-[#D6CEBE] bg-[#EBE6DF]/35 p-6 md:p-8">
                <ArchitecturalImage
                  src={
                    activeAmenityIndex % 2 === 0
                      ? project.secondaryImage
                      : project.interiorImage
                  }
                  alt={activeAmenity.title}
                  aspectRatioClass="aspect-[16/10]"
                  caption={`${activeAmenity.title} — ${activeAmenity.specification}`}
                  figureNumber={`AMENITY PLATE 0${activeAmenityIndex + 1}`}
                />
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-[#78350F]">
                      {activeAmenity.category}
                    </p>
                    <h4 className="mt-1 font-serif text-2xl text-[#1C1917]">
                      {activeAmenity.title}
                    </h4>
                  </div>
                  <ActionButton
                    to={`/contact?project=${project.slug}`}
                    variant="secondary"
                  >
                    Request Private Tour
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          08. LOCATION (NEIGHBORHOOD, MAP SCHEMATIC & LANDMARKS)
          No fabricated exact distances or travel time claims.
      ===================================================================== */}
      <EditorialGridSection
        id="enclave-location"
        surface="structural"
        borderBottom
      >
        <SectionHeader
          indexNumber="07"
          kicker={`Dhaka Enclave Context · ${enclaveDossier.district}`}
          title={`Situated in ${enclaveDossier.name}`}
          subtitle={enclaveDossier.characterSummary}
          align="between"
          action={
            <ActionButton
              to={`/locations?enclave=${enclaveDossier.slug}`}
              variant="secondary"
            >
              Explore Full {enclaveDossier.district} Atlas
            </ActionButton>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left 6 Columns: Architectural Enclave Map Schematic */}
          <div className="flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-8 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-[#D6CEBE] pb-4 text-xs">
              <span className="font-mono text-[#78350F]">
                GEODETIC ENCLAVE PLOT SCHEMATIC (ILLUSTRATIVE)
              </span>
              <span className="font-mono text-[#1C1917] tabular-nums">
                {enclaveDossier.coordinatesLabel}
              </span>
            </div>

            <div className="relative my-6 aspect-[4/3] w-full border border-[#D6CEBE] bg-[#EBE6DF]/60">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full select-none"
                role="img"
                aria-label={`Cartographic schematic for ${project.title} in ${enclaveDossier.name}`}
              >
                {[20, 40, 60, 80].map((c) => (
                  <React.Fragment key={c}>
                    <line
                      x1={c}
                      y1="0"
                      x2={c}
                      y2="100"
                      stroke="#D6CEBE"
                      strokeWidth="0.3"
                      strokeDasharray="1.5 1.5"
                    />
                    <line
                      x1="0"
                      y1={c}
                      x2="100"
                      y2={c}
                      stroke="#D6CEBE"
                      strokeWidth="0.3"
                      strokeDasharray="1.5 1.5"
                    />
                  </React.Fragment>
                ))}

                {/* Watershed Contour */}
                <path
                  d="M 35 10 Q 48 45, 42 90"
                  fill="none"
                  stroke="#78350F"
                  strokeWidth="1.2"
                  strokeOpacity="0.3"
                />

                {/* All Enclaves Context */}
                {LOCATION_ENCLAVES.map((loc) => {
                  const isCurrent = loc.slug === enclaveDossier.slug;
                  return (
                    <g key={loc.id}>
                      {isCurrent && (
                        <>
                          <circle
                            cx={loc.mapPosition.xPercent}
                            cy={loc.mapPosition.yPercent}
                            r="10"
                            fill="#78350F"
                            fillOpacity="0.12"
                            stroke="#78350F"
                            strokeWidth="0.4"
                            strokeDasharray="1 1"
                          />
                          <circle
                            cx={loc.mapPosition.xPercent}
                            cy={loc.mapPosition.yPercent}
                            r="5"
                            fill="#78350F"
                            fillOpacity="0.22"
                          />
                        </>
                      )}
                      <circle
                        cx={loc.mapPosition.xPercent}
                        cy={loc.mapPosition.yPercent}
                        r={isCurrent ? '2.5' : '1.4'}
                        fill={isCurrent ? '#78350F' : '#78716C'}
                      />
                      <text
                        x={loc.mapPosition.xPercent + 3.5}
                        y={loc.mapPosition.yPercent + 1}
                        fontSize={isCurrent ? '3.3' : '2.6'}
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={isCurrent ? '600' : '400'}
                        fill={isCurrent ? '#1C1917' : '#78716C'}
                      >
                        {isCurrent
                          ? `${project.title.toUpperCase()}`
                          : loc.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-[#57534E]">
              <span>Address: {project.addressLine}</span>
              <span className="font-mono text-[11px] text-[#78350F]">
                DEMO LOCATION PLATE
              </span>
            </div>
          </div>

          {/* Right 6 Columns: Urban Context Essay & Nearby Corridors */}
          <div className="flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-8 lg:col-span-6">
            <div>
              <p className="font-mono text-xs text-[#78350F]">
                URBAN & BOTANICAL CONTEXT
              </p>
              <h3 className="mt-2 font-serif text-3xl text-[#1C1917]">
                {enclaveDossier.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#44403C]">
                {enclaveDossier.urbanContextEssay}
              </p>

              <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-b border-[#D6CEBE] py-4 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-[#78716C]">Botanical Canopy Index</dt>
                  <dd className="mt-1 font-mono font-medium text-[#14532D]">
                    {enclaveDossier.canopyCoverageEstimate}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Typical Plot Orientation</dt>
                  <dd className="mt-1 font-medium text-[#1C1917]">
                    {enclaveDossier.typicalPlotOrientation}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <h4 className="font-mono text-xs font-semibold text-[#1C1917]">
                  NEARBY LANDMARKS & URBAN CORRIDORS (ILLUSTRATIVE)
                </h4>
                <ul className="mt-3 divide-y divide-[#D6CEBE] text-xs">
                  {enclaveDossier.proximityHighlights.map((item) => (
                    <li
                      key={item.destination}
                      className="flex flex-wrap items-center justify-between gap-2 py-3"
                    >
                      <span className="font-medium text-[#1C1917]">
                        {item.destination}
                      </span>
                      <span className="font-mono text-[#57534E]">
                        {item.urbanCorridor} · {item.spatialNote}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-6 border-t border-[#D6CEBE] pt-4 font-mono text-[11px] text-[#78716C]">
              Contextual enclave study based on illustrative concept data.
            </p>
          </div>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          09. CONSTRUCTION PROGRESS
          Timeline, milestone stages, visual progress. Clearly labeled as
          Demo / Illustrative Data.
      ===================================================================== */}
      <EditorialGridSection
        id="construction-progress"
        surface="canvas"
        borderBottom
      >
        <SectionHeader
          indexNumber="08"
          kicker="Engineering Chronicle (Demo / Illustrative Data)"
          title="Construction Progress & Realization Milestones"
          subtitle="All engineering phases, target quarters, and completion percentages below are illustrative concept data demonstrating how Varendra & Co. reports structural progress."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {project.constructionProgress.map((milestone) => {
            const isCompleted = milestone.completionPercentage === 100;
            return (
              <div
                key={milestone.phaseIndex}
                className="flex flex-col justify-between border border-[#D6CEBE] bg-[#EBE6DF]/35 p-6"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-[#78350F] tabular-nums">
                      STAGE {milestone.phaseIndex} · {milestone.targetQuarter}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#1C1917] tabular-nums">
                      <ArchitecturalIcon
                        name={isCompleted ? 'check' : 'clock'}
                        size={13}
                        className={
                          isCompleted ? 'text-[#14532D]' : 'text-[#78350F]'
                        }
                      />
                      {milestone.completionPercentage}%
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-xl text-[#1C1917]">
                    {milestone.phaseName}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#44403C]">
                    {milestone.architecturalSummary}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="h-1.5 w-full bg-[#D6CEBE]">
                    <div
                      className="h-full bg-[#78350F] transition-all duration-500"
                      style={{ width: `${milestone.completionPercentage}%` }}
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#78716C]">
                    <span>{milestone.status}</span>
                    <span className="font-mono">ILLUSTRATIVE DATA</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          10. TRUST / DOCUMENTATION & PAYMENT STRUCTURE
          Dedicated 9-pillar Bangladesh trust & documentation presentation area:
          developer registration, authority, approval references, project documentation,
          ownership/documentation, construction information, delivery history,
          utilities, and terms + progressive payment structure.
          Explicitly shows "Demo / Illustrative Data" without inventing fake
          registration or approval numbers.
      ===================================================================== */}
      <EditorialGridSection
        id="trust-documentation"
        surface="structural"
        borderBottom
      >
        <SectionHeader
          indexNumber="09"
          kicker="Bangladesh Stewardship, Due Diligence & Documentation Protocol"
          title="Verification, 9-Pillar Trust Ledger & Milestone Payment Structure"
          subtitle="Transparency is foundational to generational real estate in Dhaka. Below is the structured 9-category documentation framework and progressive payment model provided during private consultations. Note: All statutory records on this platform are unpopulated concept templates labeled as Demo / Illustrative Data."
        />

        <div className="mt-10">
          <BangladeshTrustLedger project={project} showPaymentStructure />
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          11. IMMERSIVE GALLERY
          Asymmetric architectural plate grid + Fullscreen Lightbox Viewer
          supporting keyboard navigation (←, →, Esc) and mobile touch swipe.
      ===================================================================== */}
      <EditorialGridSection
        id="monograph-gallery"
        surface="canvas"
        borderBottom
      >
        <SectionHeader
          indexNumber="10"
          kicker="Architectural Plate Archive"
          title="Immersive Monograph Gallery"
          subtitle="Select any plate to launch the fullscreen architectural viewer. Supports keyboard arrow navigation (← / →) and mobile touch swipe."
          align="between"
          action={
            <button
              type="button"
              onClick={() => setActiveGalleryIndex(0)}
              className="inline-flex items-center gap-2 border border-[#1C1917] bg-[#1C1917] px-5 py-2.5 text-xs font-medium text-[#FBF9F5] transition-colors hover:bg-[#78350F] cursor-pointer"
            >
              <ArchitecturalIcon name="expand" size={13} />
              <span>Open Fullscreen Exhibition ({galleryPlates.length} Plates)</span>
            </button>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
          {galleryPlates.map((plate, index) => {
            const colSpanClass =
              index === 0
                ? 'md:col-span-8'
                : index === 1
                ? 'md:col-span-4'
                : 'md:col-span-4';
            const aspectClass =
              index === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]';

            return (
              <div key={plate.id} className={colSpanClass}>
                <ArchitecturalImage
                  src={plate.src}
                  alt={plate.title}
                  aspectRatioClass={aspectClass}
                  caption={plate.title}
                  figureNumber={plate.figureCode}
                  onInspectPlate={() => setActiveGalleryIndex(index)}
                />
              </div>
            );
          })}
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          11B. GENERAL CONVERSION ECOSYSTEM (INQUIRE / VIEWING / DETAILS / BROCHURE / CONSULTANT)
      ===================================================================== */}
      <EditorialGridSection surface="structural" borderBottom>
        <ConversionActionSuite projectSlug={project.slug} />
      </EditorialGridSection>

      {/* =====================================================================
          12. PRIVATE VIEWING CTA & NEXT MONOGRAPH SWITCHER
      ===================================================================== */}
      <EditorialGridSection surface="obsidian">
        <div className="grid grid-cols-1 gap-12 border-b border-[#D6CEBE]/20 pb-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <p className="font-mono text-xs tracking-widest text-[#D6CEBE]">
              11. PRIVATE CONSULTATION & SITE BRIEFING
            </p>
            <h2 className="mt-3 font-serif text-4xl font-normal tracking-tight text-[#FBF9F5] text-balance sm:text-5xl lg:text-6xl">
              Arrange a Private Presentation of {project.title}.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#D6CEBE]/85">
              Private consultations for {project.title} ({project.enclaveName})
              are conducted by appointment at our Gulshan North salon. Inspect
              1:50 scale architectural models, travertine and teak samples, and
              individual floor plate drawings.
            </p>
            <p className="mt-4 font-mono text-[11px] text-[#A8A29E]">
              {GLOBAL_DEMO_NOTICE}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
            <ActionButton
              to={`/contact?project=${project.slug}`}
              variant="inverse"
              magnetic
            >
              Schedule Private Viewing
            </ActionButton>
            <Link
              to="/projects"
              className="font-mono text-xs text-[#D6CEBE] underline hover:text-[#FBF9F5]"
            >
              Return to Full Portfolio Archive
            </Link>
          </div>
        </div>

        {/* Next Project Monograph Switcher */}
        {nextProject && (
          <div className="mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs text-[#A8A29E]">
                NEXT ARCHITECTURAL MONOGRAPH IN PORTFOLIO
              </p>
              <h3 className="mt-1 font-serif text-2xl text-[#FBF9F5] sm:text-3xl">
                {nextProject.catalogNumber} — {nextProject.title} (
                {nextProject.enclaveName})
              </h3>
            </div>
            <Link
              to={`/projects/${nextProject.slug}`}
              className="inline-flex items-center gap-2 border border-[#D6CEBE]/40 px-5 py-2.5 text-xs font-medium text-[#FBF9F5] transition-colors hover:bg-[#FBF9F5] hover:text-[#141210]"
            >
              <span>Proceed to {nextProject.title}</span>
              <ArchitecturalIcon name="arrow-up-right" size={14} />
            </Link>
          </div>
        )}
      </EditorialGridSection>

      {/* =====================================================================
          FULLSCREEN EXHIBITION LIGHTBOX VIEWER (KEYBOARD + TOUCH SWIPE)
      ===================================================================== */}
      {activeGalleryIndex !== null && galleryPlates[activeGalleryIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen Architectural Plate Viewer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#141210]/98 p-4 text-[#FBF9F5] sm:p-8"
        >
          {/* Top Lightbox Bar */}
          <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between border-b border-[#D6CEBE]/20 pb-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono text-[#D6CEBE]">
                {galleryPlates[activeGalleryIndex].figureCode}
              </span>
              <span aria-hidden="true" className="text-[#D6CEBE]/40">
                ·
              </span>
              <span className="font-mono text-[#D6CEBE]/80">
                {galleryPlates[activeGalleryIndex].category}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[#D6CEBE] tabular-nums">
                PLATE 0{activeGalleryIndex + 1} / 0{galleryPlates.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveGalleryIndex(null)}
                aria-label="Close fullscreen gallery"
                className="inline-flex h-10 w-10 items-center justify-center border border-[#D6CEBE]/40 text-[#FBF9F5] transition-colors hover:bg-[#FBF9F5] hover:text-[#141210] cursor-pointer"
              >
                <ArchitecturalIcon name="close" size={16} />
              </button>
            </div>
          </div>

          {/* Center Plate Image + Prev/Next Controls */}
          <div className="relative mx-auto my-auto flex w-full max-w-5xl items-center justify-center py-6">
            <button
              type="button"
              onClick={() =>
                setActiveGalleryIndex(
                  (activeGalleryIndex - 1 + galleryPlates.length) %
                    galleryPlates.length
                )
              }
              aria-label="Previous architectural plate"
              className="mr-4 hidden h-12 w-12 shrink-0 items-center justify-center border border-[#D6CEBE]/35 bg-[#1C1917] text-[#FBF9F5] transition-colors hover:border-[#FBF9F5] sm:inline-flex cursor-pointer"
            >
              ←
            </button>

            <div className="w-full overflow-hidden border border-[#D6CEBE]/30 bg-[#1C1917]">
              <img
                src={galleryPlates[activeGalleryIndex].src}
                alt={galleryPlates[activeGalleryIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveGalleryIndex(
                  (activeGalleryIndex + 1) % galleryPlates.length
                )
              }
              aria-label="Next architectural plate"
              className="ml-4 hidden h-12 w-12 shrink-0 items-center justify-center border border-[#D6CEBE]/35 bg-[#1C1917] text-[#FBF9F5] transition-colors hover:border-[#FBF9F5] sm:inline-flex cursor-pointer"
            >
              →
            </button>
          </div>

          {/* Bottom Caption & Thumbnail Strip */}
          <div className="mx-auto w-full max-w-[1360px] border-t border-[#D6CEBE]/20 pt-4">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="font-serif text-2xl text-[#FBF9F5]">
                  {galleryPlates[activeGalleryIndex].title}
                </h3>
                <p className="mt-1 text-xs text-[#D6CEBE]/80">
                  {galleryPlates[activeGalleryIndex].caption}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Mobile Explicit Prev / Next Touch Controls + Swipe Hint */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveGalleryIndex(
                      (activeGalleryIndex - 1 + galleryPlates.length) %
                        galleryPlates.length
                    )
                  }
                  aria-label="Previous plate"
                  className="inline-flex min-h-[44px] items-center justify-center border border-[#D6CEBE]/40 px-3 py-1.5 font-mono text-xs text-[#FBF9F5] sm:hidden cursor-pointer"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveGalleryIndex(
                      (activeGalleryIndex + 1) % galleryPlates.length
                    )
                  }
                  aria-label="Next plate"
                  className="inline-flex min-h-[44px] items-center justify-center border border-[#D6CEBE]/40 px-3 py-1.5 font-mono text-xs text-[#FBF9F5] sm:hidden cursor-pointer"
                >
                  NEXT →
                </button>

                {galleryPlates.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={`Select plate 0${idx + 1}`}
                    aria-pressed={idx === activeGalleryIndex}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                      idx === activeGalleryIndex
                        ? 'bg-[#FBF9F5] text-[#141210] font-semibold'
                        : 'border border-[#D6CEBE]/30 text-[#D6CEBE] hover:border-[#FBF9F5]'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
