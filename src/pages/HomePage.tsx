import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DEVELOPER_PROFILE,
  GLOBAL_DEMO_NOTICE,
  IMAGE_ASSETS,
  LOCATION_ENCLAVES,
  PROJECTS_DATA,
  RESIDENCE_ARCHETYPES,
  ResidenceArchetype,
} from '../data/mockRealEstateData';
import { EnclaveSlug } from '../types/realEstate';
import {
  useChoreographedScroll,
  useEditorialEntrance,
  useStateTransition,
} from '../utils/animation';
import { usePageMetadata } from '../utils/metadata';
import { ArchitecturalImage } from '../components/ui/ArchitecturalImage';
import { ArchitecturalIcon } from '../components/ui/ArchitecturalIcon';
import { ArchitecturalModal } from '../components/ui/ArchitecturalModal';
import { ArchitecturalTooltip } from '../components/ui/ArchitecturalTooltip';
import {
  SplitEditorialHeading,
  SplitMonographKicker,
} from '../components/ui/MaskedTypography';
import {
  ActionButton,
  ArchitecturalStatusText,
  EditorialGridSection,
  EditorialMetaLine,
  SectionHeader,
  SegmentedFilter,
} from '../components/ui/Primitives';
import { FloorPlanViewer } from '../components/projects/FloorPlanViewer';
import { HorizontalScrollMonographGallery } from '../components/projects/HorizontalScrollMonographGallery';
import { ArchitecturalMassing3DViewer } from '../components/architecture/ArchitecturalMassing3DViewer';
import { HeroScrollArchitectureChapter } from '../components/architecture/HeroScrollArchitectureChapter';
import { MonsoonSolarCanvasSequence } from '../components/architecture/MonsoonSolarCanvasSequence';
import { ScrollArchitecturalAnatomyScene } from '../components/architecture/ScrollArchitecturalAnatomyScene';
import { ScrollDhakaCartographyScene } from '../components/architecture/ScrollDhakaCartographyScene';
import { ScrollFloorAscentScene } from '../components/architecture/ScrollFloorAscentScene';
import { ScrollMaterialAlchemyScene } from '../components/architecture/ScrollMaterialAlchemyScene';
import { ScrollChapterRail } from '../components/layout/ScrollChapterRail';
import { BangladeshTrustLedger } from '../components/trust/BangladeshTrustLedger';
import { useBangladeshLocalization } from '../utils/bangladeshLocalization';

export const HomePage: React.FC = () => {
  const { languageMode } = useBangladeshLocalization();

  usePageMetadata({
    title: 'Architectural Residences & Monographs',
    description:
      'Varendra & Co. commissions generational full-floor residences across Gulshan, Baridhara, Banani, Dhanmondi, Bashundhara, and Jolshiri in Dhaka. Concept architectural showcase.',
    canonicalPath: '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Varendra & Co. — Dhaka Architectural Residences',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://varendra.co',
      description: DEVELOPER_PROFILE.manifestoLead,
      inLanguage: ['en-BD', 'bn-BD'],
    },
  });

  // Refs for multi-modal choreography (Hero entrance + ScrollTrigger sections)
  const entranceRef = useEditorialEntrance<HTMLDivElement>('homepage-entrance');
  const scrollChoreographyRef = useChoreographedScroll<HTMLDivElement>();

  // Section 04: Interactive Dhaka Enclave State
  const [activeEnclaveSlug, setActiveEnclaveSlug] =
    useState<EnclaveSlug>('gulshan-north');
  const activeEnclave =
    LOCATION_ENCLAVES.find((e) => e.slug === activeEnclaveSlug) ||
    LOCATION_ENCLAVES[0];

  // Section 06: Interactive Architectural Layer State
  const [activeArchLayer, setActiveArchLayer] = useState<
    'facade' | 'massing' | 'materials' | 'philosophy'
  >('facade');

  // Section 07: Interactive Lifestyle & Hospitality Chapter State
  const [activeLifestyleIndex, setActiveLifestyleIndex] = useState<number>(0);

  // Section 08: Interactive Residence Typology State (2BR, 3BR, 4BR, Penthouse)
  const [activeArchetypeCode, setActiveArchetypeCode] =
    useState<ResidenceArchetype['code']>('4BR');
  const activeArchetype =
    RESIDENCE_ARCHETYPES.find((a) => a.code === activeArchetypeCode) ||
    RESIDENCE_ARCHETYPES[2];

  // State transition refs for smooth interactive morphing
  const archLayerTransitionRef = useStateTransition<HTMLDivElement>(activeArchLayer);

  // Section 10: Private Consultation Form State
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultEnclave, setConsultEnclave] = useState('Gulshan North Salon');
  const [consultError, setConsultError] = useState<string | null>(null);
  const [consultReference, setConsultReference] = useState<string | null>(null);

  // Lightbox Modal State
  const [inspectedPlate, setInspectedPlate] = useState<{
    src: string;
    title: string;
    subtitle: string;
    slug?: string;
  } | null>(null);

  const featuredResidence = PROJECTS_DATA[0]; // The Jamuna Pavilion

  const lifestyleChapters = [
    {
      index: '01',
      kicker: 'HYDROTHERAPY & THERMAL STILLNESS (POOL & SPA)',
      title: '25-Meter Cantilevered Horizon Pool & Thermal Spa',
      setting: 'Level 03 Podium & Substructure · The Jamuna Pavilion (Demo)',
      image: IMAGE_ASSETS.amenityInfinityPool,
      essay:
        'Suspended above the eastern rain-tree canopy of Gulshan Lake, our 25-meter infinity lap pool is lined in dark Sukabumi stone to absorb solar glare and mirror the monsoon sky. Below grade, residents reserve private honed-limestone steam chambers and vitality plunge pools by individual household appointment.',
      metrics: [
        { label: 'Water Treatment', value: 'Salt-Chlorinated & Mineralized' },
        { label: 'Acoustic Baffling', value: 'STC-58 Structural Isolation' },
        { label: 'Access Protocol', value: 'Private Household Reservation' },
      ],
    },
    {
      index: '02',
      kicker: 'PRIVATE HOSPITALITY & INTELLECTUAL LIFE (LOUNGE)',
      title: 'The Baithak, Monsoon Tea Pavilion & Rare Book Library',
      setting: 'Ground Courtyard Sanctuary · All Dhaka Commissions (Demo)',
      image: IMAGE_ASSETS.penthouseInterior,
      essay:
        'Designed as an extension of the resident’s own drawing room, the ground-level Baithak and Library is screened in operable Burmese teak louvers overlooking a basalt rainwater court. Hosts may welcome visiting delegations or intimate musical recitals without guests ever entering the private residential lift cores.',
      metrics: [
        { label: 'Curated Collection', value: '400+ Architectural & Bengal Monographs' },
        { label: 'Hospitality Support', value: 'Dedicated Sommelier & Tea Pantry' },
        { label: 'Climate Control', value: '48% Relative Humidity Preservation' },
      ],
    },
    {
      index: '03',
      kicker: 'BOTANICAL MICROCLIMATE & AIR SOVEREIGNTY (SKY TERRACE)',
      title: 'Fourteen-Foot Sky Verandas & High-Altitude Rain Gardens',
      setting: 'Full-Floor Perimeter · Every Residence (Demo)',
      image: IMAGE_ASSETS.monsoonVerandah,
      essay:
        'Each veranda is engineered with recessed structural soil planters capable of sustaining mature frangipani, kamini, and bamboo groves at high altitude. Indoors, centralized MERV-16 and activated-carbon energy recovery ventilation maintains interior particulate levels below 8 µg/m³ year-round.',
      metrics: [
        { label: 'Particulate Standard', value: 'PM2.5 < 8 µg/m³ Continuous' },
        { label: 'Veranda Soil Depth', value: '750mm Structural Root Trench' },
        { label: 'Irrigation', value: 'Automated Harvested Rainwater Drip' },
      ],
    },
    {
      index: '04',
      kicker: 'PRIVATE WELLNESS & MOVEMENT ATRIUM (GYM)',
      title: 'Acoustically Isolated Wellness Studio & Subterranean Hammam',
      setting: 'Level -01 Subterranean Vault · The Jamuna Pavilion (Demo)',
      image: IMAGE_ASSETS.ehlDhakaNightPlate,
      essay:
        'Engineered with calibrated spring-isolated timber flooring and sound-dampening fair-faced concrete, the private fitness atrium accommodates bespoke personal training, pilates reformers, and hydrotherapy plunge pools with dedicated air exchange every four minutes.',
      metrics: [
        { label: 'Acoustic Decoupling', value: 'Floating Concrete Slab on Neoprene' },
        { label: 'Air Exchange', value: '14 ACH Fresh Tempered Air' },
        { label: 'Equipment Curation', value: 'Custom Teak & Matte Black Artisanal' },
      ],
    },
    {
      index: '05',
      kicker: 'CEREMONIAL MOTORCOURT & RECEPTION (LOBBY)',
      title: 'Triple-Height Basalt Arrival Atrium & Concierge Salon',
      setting: 'Ground Arrival Court · Private Porte-Cochère (Demo)',
      image: IMAGE_ASSETS.dhanmondiTerrace,
      essay:
        'An unhurried procession from the street leads past water reflecting pools into a 28-foot high arrival salon lined in split-face basalt and teak panelling, served 24/7 by discrete resident concierge stewards.',
      metrics: [
        { label: 'Ceiling Volume', value: '28-Foot Clear Structural Height' },
        { label: 'Stone Cladding', value: 'Flamed Basalt & Honed Travertine' },
        { label: 'Logistics Core', value: 'Independent Subterranean Loading Bay' },
      ],
    },
  ];

  const currentLifestyle = lifestyleChapters[activeLifestyleIndex];

  const handleQuickConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultEmail.includes('@') || consultPhone.trim().length < 7) {
      setConsultError(
        'Please provide your name, a valid electronic mail address, and a direct telephone number.'
      );
      return;
    }
    setConsultError(null);
    setConsultReference(`VRD-SALON-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  return (
    <div ref={scrollChoreographyRef}>
      {/* Floating 8-Chapter Scroll Telemetry, Direction & Velocity Indicator */}
      <ScrollChapterRail />

      <div id="chapter-city" ref={entranceRef}>
        {/* =====================================================================
            SECTION 01 — LIVE REALTIME 3D ARCHITECTURAL HERO & SCROLL SEQUENCE
            Building occupies 75% of viewport; scrolling approaches the facade,
            parts the Burmese teak louvers, and separates the 14 floor plates.
        ===================================================================== */}
        <HeroScrollArchitectureChapter
          fallbackImageSrc={IMAGE_ASSETS.ehlDhakaPlate}
          fallbackAlt="EHL Premium Condominiums, Dhaka — Architectural Digital Reconstruction Demonstration (Kashef Chowdhury / URBANA)"
        />
      </div>

      {/* =====================================================================
          SECTION 02 — ARCHITECTURAL MANIFESTO WITH MASSIVE TYPOGRAPHIC SCALE
          Oversized numeric & architectural watermark layers, asymmetry,
          and sculptural editorial rhythm.
      ===================================================================== */}
      <section className="relative overflow-hidden border-b border-[#D8D1C5] bg-[#F2EEE7] py-16 sm:py-28 md:py-44 lg:py-52">
        {/* Giant Background Architectural Index Number */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 right-2 select-none font-serif text-[120px] font-light leading-none text-[#E8E2D8]/70 sm:-top-10 sm:right-6 sm:text-[240px] lg:right-16 lg:text-[360px]"
        >
          01
        </div>

        <div className="relative z-10 mx-auto max-w-[1360px] px-6 md:px-12">
          <div data-scroll="statement-reveal" className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <p className="font-mono text-xs tracking-[0.24em] text-[#986046] uppercase">
                01. ARCHITECTURAL MANIFESTO · TECTONIC DOCTRINE
              </p>

              <h2 className="mt-8 font-serif text-3xl font-normal leading-[1.12] tracking-tight text-[#151514] text-balance sm:text-5xl lg:text-[62px]">
                We do not build speculative volume. We commission generational
                sanctuaries—restricted to a single residence per floor, shaped by
                four-sided daylight, deep monsoon verandas, and materials that gain
                dignity over fifty years of tropical rain.
              </h2>
            </div>

            <div className="border-l border-[#D8D1C5] pl-8 lg:col-span-3">
              <span className="block font-mono text-[10px] tracking-[0.2em] text-[#736B63] uppercase">
                ACOUSTIC & SPATIAL STANDARD
              </span>
              <p className="mt-3 font-serif text-4xl text-[#151514] sm:text-5xl">
                360°
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#544E46]">
                Unobstructed horizon exposure on every commissioned level—zero shared party walls, zero internal corridors.
              </p>
            </div>
          </div>

          <div
            data-scroll="rule-expand"
            className="mt-16 h-px w-full bg-[#D8D1C5]"
          />

          <div className="mt-8 flex flex-col justify-between gap-6 text-xs text-[#544E46] sm:flex-row sm:items-center">
            <EditorialMetaLine
              items={[
                'Studio Varendra Architectural Practice',
                'Dhaka, Bangladesh',
                'Concept Portfolio Edition IV',
              ]}
            />
            <Link
              to="/about"
              data-cursor="EXPLORE"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-[#151514] transition-colors hover:text-[#986046]"
            >
              <span>Read Our Architectural Doctrine</span>
              <ArchitecturalIcon name="arrow-up-right" size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 02B — CONTINUOUS SCROLL-DRIVEN ARCHITECTURAL DISASSEMBLY
          5-Act Pinned Scroll Choreography: Exterior Silhouette -> Brise-Soleil
          Disassembly -> Full-Floor Plate Extrusion -> Interior Portal -> Horizon
      ===================================================================== */}
      <div id="scroll-anatomy">
        <ScrollArchitecturalAnatomyScene project={featuredResidence} />
      </div>

      {/* =====================================================================
          SECTION 03 — HORIZONTAL SCROLL MONOGRAPH EXHIBITION (CHAPTER 03)
          Pinned horizontal gallery traversal through commissioned Dhaka monographs
          with multi-layer parallax planes (0.85x background, 1.0x architecture,
          1.18x foreground interior study).
      ===================================================================== */}
      <HorizontalScrollMonographGallery
        projects={PROJECTS_DATA}
        onInspectPlate={(plate) => setInspectedPlate(plate)}
      />

      {/* =====================================================================
          SECTION 03B — SCROLL-DRIVEN FLOOR SELECTION & VERTICAL BUILDING ASCENT
          Scroll vertically through the 14-story elevation from Ground Court
          to the Crown Duplex Penthouse.
      ===================================================================== */}
      <ScrollFloorAscentScene project={featuredResidence} />

      {/* =====================================================================
          SECTION 04 — 3D-TO-2D DHAKA CARTOGRAPHY & ENCLAVE ZOOM (CHAPTER 05)
          Scroll flattens 3D urban massing into an orthographic architectural survey
          and zooms into parcel solar/wind orientation.
      ===================================================================== */}
      <ScrollDhakaCartographyScene
        enclaves={LOCATION_ENCLAVES}
        activeEnclaveSlug={activeEnclaveSlug}
        onSelectEnclave={setActiveEnclaveSlug}
      />

      {/* =====================================================================
          SECTION 05 — FEATURED RESIDENCE
          Deep visual project showcase of "The Jamuna Pavilion" with interactive
          floor plate schematic and full-bleed dark editorial framing.
      ===================================================================== */}
      <EditorialGridSection
        id="featured-residence"
        surface="obsidian"
        borderBottom
      >
        <div className="border-b border-[#D6CEBE]/25 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#D6CEBE]">
            <span className="font-mono tracking-widest">
              04. FEATURED MONOGRAPH DEEP STUDY · {featuredResidence.catalogNumber}
            </span>
            <span className="font-mono text-[#D6CEBE]/80 tabular-nums">
              {featuredResidence.addressLine}
            </span>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h2 className="font-serif text-4xl font-normal tracking-tight text-[#FBF9F5] text-balance sm:text-5xl lg:text-6xl">
                {featuredResidence.title} — {featuredResidence.enclaveName}
              </h2>
              <p className="mt-3 font-serif text-xl italic text-[#D6CEBE]">
                {featuredResidence.subtitle}
              </p>
            </div>
            <ActionButton
              to={`/projects/${featuredResidence.slug}`}
              variant="inverse"
              magnetic
            >
              Open Full Project Monograph
            </ActionButton>
          </div>
        </div>

        {/* Dual Visual Composition + Spatial Narrative */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ArchitecturalImage
              src={featuredResidence.interiorImage}
              alt="Double-height penthouse salon at The Jamuna Pavilion overlooking Gulshan Lake"
              aspectRatioClass="aspect-[16/10]"
              caption="Interior Salon Volume — 22-foot double-height crown atrium with honed Roman travertine slabs."
              figureNumber="MONOGRAPH NO. 01 / INTERIOR"
            />
          </div>

          <div className="flex flex-col justify-between border border-[#D6CEBE]/25 bg-[#1C1917] p-6 md:p-8 lg:col-span-4">
            <div>
              <p className="font-mono text-xs text-[#D6CEBE]">
                SPATIAL & ENVIRONMENTAL SYNOPSIS
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#D6CEBE]/90">
                {featuredResidence.architecturalEssay[0]}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#D6CEBE]/90">
                {featuredResidence.architecturalEssay[1]}
              </p>
            </div>

            <dl className="mt-8 space-y-3 border-t border-[#D6CEBE]/20 pt-5 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#A8A29E]">Full-Floor Plate</dt>
                <dd className="font-mono text-[#FBF9F5] tabular-nums">
                  6,450 sq. ft. (Single Level)
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A8A29E]">Crown Duplex Penthouse</dt>
                <dd className="font-mono text-[#FBF9F5] tabular-nums">
                  11,200 sq. ft. (Levels 13–14)
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A8A29E]">Cantilevered Veranda</dt>
                <dd className="font-mono text-[#FBF9F5] tabular-nums">
                  48&apos; × 14&apos; Clear Overhang
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A8A29E]">Acoustic Rating</dt>
                <dd className="font-mono text-[#FBF9F5] tabular-nums">
                  44 dB Facade Attenuation
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Embedded Interactive Floor Plan Schematic inside Featured Residence Showcase */}
        <div className="mt-14 text-[#1C1917]">
          <FloorPlanViewer floorPlans={featuredResidence.floorPlans} />
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          SECTION 06 — ARCHITECTURE
          Interactive Tectonic Diagram & Materiality Study showing:
          1. Facade  2. Massing  3. Materials  4. Design Philosophy
      ===================================================================== */}
      <EditorialGridSection
        id="architecture-tectonics"
        surface="canvas"
        borderBottom
      >
        <SectionHeader
          indexNumber="05"
          kicker="Tectonics, Massing & Material Provenance"
          title="The Anatomy of a Tropical Monsoon Residence"
          subtitle="Explore the four structural layers that govern every Varendra & Co. building—from operable timber facade screens to post-tensioned acoustic floor slabs."
          align="between"
          action={
            <SegmentedFilter
              ariaLabel="Inspect Architectural Tectonic Layer"
              activeValue={activeArchLayer}
              onChange={setActiveArchLayer}
              options={[
                { value: 'facade', label: '01. Facade System' },
                { value: 'massing', label: '02. Massing & Void' },
                { value: 'materials', label: '03. Material Palette' },
                { value: 'philosophy', label: '04. Climatic Thesis' },
              ]}
            />
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left 6 Columns: Interactive Tectonic Cross-Section SVG Diagram */}
          <div className="border border-[#D6CEBE] bg-[#EBE6DF]/50 p-6 md:p-10 lg:col-span-6">
            <div className="mb-4 flex items-center justify-between text-xs text-[#57534E]">
              <span className="font-mono">
                TECTONIC SECTION DIAGRAM · LAYER: {activeArchLayer.toUpperCase()}
              </span>
              <span className="font-mono tabular-nums">SCALE 1:50</span>
            </div>

            <div className="relative aspect-[4/3] w-full border border-[#D6CEBE] bg-[#FBF9F5] p-4">
              <svg
                viewBox="0 0 100 75"
                className="h-full w-full select-none"
                role="img"
                aria-label="Architectural cross-section showing facade louvers, cantilevered veranda, and post-tensioned massing"
              >
                {/* Structural Grid */}
                {[15, 30, 45, 60].map((y) => (
                  <line
                    key={y}
                    x1="5"
                    y1={y}
                    x2="95"
                    y2={y}
                    stroke="#D6CEBE"
                    strokeWidth="0.25"
                    strokeDasharray="1 1"
                  />
                ))}

                {/* 1. Core Massing & Post-Tensioned Slabs */}
                <g
                  opacity={
                    activeArchLayer === 'massing' || activeArchLayer === 'philosophy'
                      ? '1'
                      : '0.45'
                  }
                >
                  <rect
                    x="32"
                    y="12"
                    width="54"
                    height="52"
                    fill="#EBE6DF"
                    stroke="#1C1917"
                    strokeWidth="0.6"
                  />
                  {/* Floor Slabs */}
                  <rect x="14" y="12" width="72" height="2.2" fill="#1C1917" />
                  <rect x="14" y="29" width="72" height="2.2" fill="#1C1917" />
                  <rect x="14" y="46" width="72" height="2.2" fill="#1C1917" />
                  <rect x="14" y="63" width="72" height="2.8" fill="#1C1917" />
                </g>

                {/* 2. Cantilevered 14-Foot Veranda & Facade Brise-Soleil Louvers */}
                <g
                  opacity={
                    activeArchLayer === 'facade' || activeArchLayer === 'materials'
                      ? '1'
                      : '0.55'
                  }
                >
                  {/* Vertical Burmese Teak Louver Screen */}
                  {[16, 18, 20, 22, 24, 26, 28].map((yOffset) => (
                    <line
                      key={`l1-${yOffset}`}
                      x1="15"
                      y1={yOffset}
                      x2="18"
                      y2={yOffset - 0.8}
                      stroke="#78350F"
                      strokeWidth="0.7"
                    />
                  ))}
                  {[33, 35, 37, 39, 41, 43, 45].map((yOffset) => (
                    <line
                      key={`l2-${yOffset}`}
                      x1="15"
                      y1={yOffset}
                      x2="18"
                      y2={yOffset - 0.8}
                      stroke="#78350F"
                      strokeWidth="0.7"
                    />
                  ))}

                  {/* Double-Glazed Low-Iron Acoustic Curtain Wall Line */}
                  <line
                    x1="32"
                    y1="14"
                    x2="32"
                    y2="63"
                    stroke="#66705B"
                    strokeWidth="0.9"
                    strokeDasharray="2 1"
                  />
                </g>

                {/* 3. Monsoon Wind & Solar Vectors */}
                <path
                  d="M 4 22 C 18 22, 28 20, 58 20"
                  fill="none"
                  stroke="#986046"
                  strokeWidth="0.5"
                  strokeDasharray="1.5 1"
                />
                <text
                  x="6"
                  y="10"
                  fontSize="2.7"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#986046"
                >
                  14&apos;-0&quot; CANTILEVER OVERHANG
                </text>
                <text
                  x="36"
                  y="22"
                  fontSize="2.7"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#151514"
                >
                  11&apos;-6&quot; CLEAR POST-TENSIONED VOLUME
                </text>
                <text
                  x="36"
                  y="39"
                  fontSize="2.7"
                  fontFamily="JetBrains Mono, monospace"
                  fill="#66705B"
                >
                  32 dBA FLOATING TRAVERTINE ACOUSTIC SLAB
                </text>
              </svg>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(['facade', 'massing', 'materials', 'philosophy'] as const).map(
                (layer) => (
                  <button
                    key={layer}
                    type="button"
                    onClick={() => setActiveArchLayer(layer)}
                    className={`border px-3 py-1.5 font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                      activeArchLayer === layer
                        ? 'border-[#151514] bg-[#151514] text-[#F2EEE7]'
                        : 'border-[#D8D1C5] bg-[#F2EEE7] text-[#736B63] hover:border-[#151514]'
                    }`}
                  >
                    {layer}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right 6 Columns: Detailed Layer Specification & Material Provenance */}
          <div ref={archLayerTransitionRef} className="space-y-8 lg:col-span-6">
            {activeArchLayer === 'facade' && (
              <div>
                <p className="font-mono text-xs text-[#986046]">
                  LAYER 01 · BREATHING ENVELOPE & BRISE-SOLEIL
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[#151514]">
                  Double-Skin Burmese Teak & Low-Iron Acoustic Glazing
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#544E46]">
                  Rather than exposing glass directly to Dhaka’s western summer
                  sun, our facades interpose a fourteen-foot structural veranda
                  and operable seasoned Burmese teak louvers. This outer veil
                  absorbs 62% of solar radiation before it ever reaches the
                  42.52mm laminated acoustic glass line.
                </p>
              </div>
            )}

            {activeArchLayer === 'massing' && (
              <div>
                <p className="font-mono text-xs text-[#986046]">
                  LAYER 02 · STEPPED MASSING & HORIZONTAL SOVEREIGNTY
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[#151514]">
                  Column-Free Post-Tensioned Floor Plates
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#544E46]">
                  Every residence occupies an entire structural level with zero
                  intrusive drop-beams, allowing 52-foot uninterrupted living
                  salons and four-sided natural cross-ventilation. Dual elevator
                  cores completely segregate ceremonial guest arrival from
                  service and culinary logistics.
                </p>
              </div>
            )}

            {activeArchLayer === 'materials' && (
              <div>
                <p className="font-mono text-xs text-[#986046]">
                  LAYER 03 · TACTILE PERMANENCE & FIFTY-YEAR PATINA
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[#151514]">
                  Honed Roman Travertine, Dhamrai Kiln Brick & Board-Formed Concrete
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#544E46]">
                  We reject synthetic coatings and fragile veneers. Our
                  structures are cast in architectural fair-faced concrete paired
                  with high-density compressed clay bricks fired in Dhamrai and
                  unfilled honed travertine that ages with quiet dignity across
                  generations.
                </p>
              </div>
            )}

            {activeArchLayer === 'philosophy' && (
              <div>
                <p className="font-mono text-xs text-[#986046]">
                  LAYER 04 · BENGAL CLIMATIC MODERNISM
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[#151514]">
                  Dialogues Between Solid Monolith and Monsoon Breeze
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#544E46]">
                  Continuing the intellectual lineage of twentieth-century Bengal
                  architecture, our buildings treat shadow and air movement as
                  primary building materials—creating residences that remain
                  naturally cool and luminous throughout the year.
                </p>
              </div>
            )}

            {/* Material Provenance Trio */}
            <div className="grid grid-cols-1 gap-4 border-t border-[#D8D1C5] pt-6 sm:grid-cols-3">
              {featuredResidence.materialPalette.map((mat) => (
                <div
                  key={mat.material}
                  className="border border-[#D8D1C5] bg-[#E8E2D8]/35 p-4"
                >
                  <p className="font-serif text-base font-medium text-[#151514]">
                    {mat.material}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-[#986046]">
                    {mat.origin}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#544E46]">
                    {mat.application}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Architectural Sequence: Wide → Detail → Material → Wide */}
        <div className="mt-16 border-t border-[#D8D1C5] pt-12">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
            <p className="font-mono text-xs tracking-[0.22em] text-[#986046] uppercase">
              VISUAL CADENCE · WIDE → DETAIL → MATERIAL → WIDE
            </p>
            <span className="font-mono text-[11px] text-[#736B63]">
              4-Plate Architectural Examination
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <ArchitecturalImage
                src={IMAGE_ASSETS.ehlDhakaPlate}
                alt="Wide elevation showing cantilevered concrete floor plates at The Jamuna Pavilion"
                aspectRatioClass="aspect-[4/3]"
                figureNumber="PLATE 01 · WIDE"
                caption="Full-Floor Cantilever Elevation"
              />
              <p className="mt-2 font-mono text-[10px] text-[#736B63]">
                01. Structural Silhouette (Kashef Chowdhury / URBANA)
              </p>
            </div>

            <div className="flex flex-col">
              <ArchitecturalImage
                src={IMAGE_ASSETS.ehlDhakaDetailPlate}
                alt="Close-up tectonic detail of board-formed concrete and Burmese teak joinery"
                aspectRatioClass="aspect-[4/3]"
                figureNumber="PLATE 02 · DETAIL"
                caption="Board-Formed Concrete & Teak"
              />
              <p className="mt-2 font-mono text-[10px] text-[#736B63]">
                02. 14-Foot Verandah Joinery & Brise-Soleil
              </p>
            </div>

            <div className="flex flex-col">
              <ArchitecturalImage
                src={IMAGE_ASSETS.craftMaterial}
                alt="Tactile terracotta brick samples and honed Roman travertine in Dhaka atelier"
                aspectRatioClass="aspect-[4/3]"
                figureNumber="PLATE 03 · MATERIAL"
                caption="Bengal Kiln Brick & Travertine"
              />
              <p className="mt-2 font-mono text-[10px] text-[#736B63]">
                03. Natural Material Provenance & Fifty-Year Patina
              </p>
            </div>

            <div className="flex flex-col">
              <ArchitecturalImage
                src={IMAGE_ASSETS.dhakaLakeEnclave}
                alt="Wide architectural setting showing lush rain-tree canopy over Gulshan lakefront"
                aspectRatioClass="aspect-[4/3]"
                figureNumber="PLATE 04 · WIDE"
                caption="Gulshan Lakefront Canopy"
              />
              <p className="mt-2 font-mono text-[10px] text-[#736B63]">
                04. Monsoon Microclimate & Canopy Setting
              </p>
            </div>
          </div>
        </div>

        {/* 08. Interactive 3D WebGL Architectural Massing & Exploded Floor-Plate Studio */}
        <div data-scroll="panel-elevate" className="mt-16">
          <ArchitecturalMassing3DViewer project={featuredResidence} />
        </div>

        {/* 09. Interactive 60-Frame Diurnal Solar & Monsoon Facade Sequence */}
        <div data-scroll="panel-elevate" className="mt-12">
          <MonsoonSolarCanvasSequence
            projectTitle={featuredResidence.title}
            enclaveName={featuredResidence.enclaveName}
          />
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          SECTION 06B — SCROLL-DRIVEN MATERIAL & DIURNAL ALCHEMY (CHAPTER 07)
          Scroll through Fair-Faced Concrete -> Roman Travertine -> Burmese Teak
          -> Laminated Acoustic Glass with dynamic solar incidence sweeps.
      ===================================================================== */}
      <ScrollMaterialAlchemyScene />

      {/* =====================================================================
          SECTION 07 — LIFESTYLE / AMENITIES
          Visual storytelling chapters rather than generic icon grids.
      ===================================================================== */}
      <EditorialGridSection
        id="lifestyle-sanctuary"
        surface="structural"
        borderBottom
      >
        <SectionHeader
          indexNumber="06"
          kicker="Private Hospitality & Sanctuary Amenities"
          title="Quiet Rituals of Water, Literature, and Botanical Air"
          subtitle="We replace crowded commercial clubhouses with intimate, acoustically isolated sanctuaries reserved by private household appointment."
        />

        {/* Chapter Selector Tabs */}
        <div className="mt-10 grid grid-cols-2 gap-3 border-b border-[#D8D1C5] pb-8 sm:grid-cols-3 lg:grid-cols-5">
          {lifestyleChapters.map((chap, idx) => {
            const isActive = idx === activeLifestyleIndex;
            return (
              <button
                key={chap.index}
                type="button"
                onClick={() => setActiveLifestyleIndex(idx)}
                className={`border p-4 text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'border-[#151514] bg-[#151514] text-[#F2EEE7]'
                    : 'border-[#D8D1C5] bg-[#FAF7F2] text-[#151514] hover:border-[#986046]'
                }`}
              >
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isActive ? 'text-[#B5A07D]' : 'text-[#986046]'
                  }`}
                >
                  CHAPTER {chap.index}
                </span>
                <p className="mt-1.5 font-serif text-base font-normal line-clamp-2">
                  {chap.title.split('&')[0]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Lifestyle Visual Storytelling Spread */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <ArchitecturalImage
              src={currentLifestyle.image}
              alt={currentLifestyle.title}
              aspectRatioClass="aspect-[16/10]"
              caption={currentLifestyle.setting}
              figureNumber={`HOSPITALITY PLATE ${currentLifestyle.index}`}
            />
          </div>

          <div className="space-y-6 lg:col-span-5">
            <p className="font-mono text-xs text-[#986046]">
              {currentLifestyle.kicker}
            </p>
            <h3 className="font-serif text-3xl text-[#151514] sm:text-4xl">
              {currentLifestyle.title}
            </h3>
            <p className="text-base leading-relaxed text-[#544E46]">
              {currentLifestyle.essay}
            </p>

            <dl className="divide-y divide-[#D8D1C5] border-t border-b border-[#D8D1C5] pt-2 text-xs">
              {currentLifestyle.metrics.map((m) => (
                <div key={m.label} className="flex justify-between py-3">
                  <dt className="text-[#736B63]">{m.label}</dt>
                  <dd className="font-mono font-medium text-[#151514] tabular-nums">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          SECTION 08 — RESIDENCES
          Interactive Residence Typologies: 2BR, 3BR, 4BR, Penthouse / Duplex
          with realistic demo dimensions and spatial schedules.
      ===================================================================== */}
      <EditorialGridSection
        id="residence-typologies"
        surface="canvas"
        borderBottom
      >
        <SectionHeader
          indexNumber="07"
          kicker="Spatial Typologies & Dimension Schedules (Concept Demo)"
          title="Residences Scaled for Collectors and Multi-Generational Families"
          subtitle="Compare our four residential archetypes—from lateral 2-bedroom collector sanctuaries in Banani to 11,200 sq. ft. duplex crown penthouses in Gulshan."
          align="between"
          action={
            <SegmentedFilter
              ariaLabel="Select Residence Typology"
              activeValue={activeArchetypeCode}
              onChange={setActiveArchetypeCode}
              options={RESIDENCE_ARCHETYPES.map((arch) => ({
                value: arch.code,
                label: arch.code === 'PENTHOUSE' ? 'Duplex Penthouse' : `${arch.code} Sanctuary`,
              }))}
            />
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-10 border border-[#D8D1C5] bg-[#E8E2D8]/35 p-6 md:p-10 lg:grid-cols-12">
          {/* Left 7 Columns: Typology Dossier & Spatial Narrative */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <EditorialMetaLine
                items={[
                  activeArchetype.label,
                  activeArchetype.enclave,
                  activeArchetype.typicalProject,
                ]}
              />

              <h3 className="mt-3 font-serif text-3xl text-[#151514] sm:text-4xl">
                {activeArchetype.title}
              </h3>

              <p className="mt-4 max-w-prose text-base leading-relaxed text-[#544E46]">
                {activeArchetype.spatialNarrative}
              </p>

              {/* Key Proportions Table */}
              <div className="mt-8">
                <h4 className="font-mono text-xs text-[#986046]">
                  REPRESENTATIVE ROOM PROPORTIONS (CLEAR SPAN)
                </h4>
                <div className="mt-3 divide-y divide-[#D8D1C5] border-t border-b border-[#D8D1C5]">
                  {activeArchetype.keyProportions.map((prop, i) => (
                    <div
                      key={prop.zone}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[#736B63] tabular-nums">
                          0{i + 1}
                        </span>
                        <span className="font-serif text-base font-medium text-[#151514]">
                          {prop.zone}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-[#544E46]">{prop.aspect}</span>
                        <span className="font-semibold text-[#151514] tabular-nums">
                          {prop.dimensions}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ActionButton
                to={`/projects/${activeArchetype.projectSlug}`}
                variant="primary"
              >
                Inspect {activeArchetype.code} Monograph
              </ActionButton>
              <ActionButton
                to={`/contact?project=${activeArchetype.projectSlug}&unit=${activeArchetype.code}`}
                variant="secondary"
              >
                Request {activeArchetype.code} Floor Plate PDF
              </ActionButton>
            </div>
          </div>

          {/* Right 5 Columns: Tabular Specification Summary */}
          <div className="flex flex-col justify-between border border-[#D8D1C5] bg-[#FAF7F2] p-6 md:p-8 lg:col-span-5">
            <div>
              <p className="font-mono text-xs text-[#986046]">
                ARCHITECTURAL SPECIFICATION SCHEDULE
              </p>
              <dl className="mt-5 divide-y divide-[#D8D1C5] text-xs">
                <div className="py-3.5">
                  <dt className="text-[#736B63]">Gross Floor Plate Range</dt>
                  <dd className="mt-1 font-mono text-lg font-semibold text-[#151514] tabular-nums">
                    {activeArchetype.grossAreaRangeSqFt}
                  </dd>
                </div>
                <div className="py-3.5">
                  <dt className="text-[#736B63]">Cantilevered Veranda Depth</dt>
                  <dd className="mt-1 font-mono text-sm font-medium text-[#151514] tabular-nums">
                    {activeArchetype.verandaDepthFeet}
                  </dd>
                </div>
                <div className="py-3.5">
                  <dt className="text-[#736B63]">Clear Ceiling Height</dt>
                  <dd className="mt-1 font-mono text-sm font-medium text-[#151514] tabular-nums">
                    {activeArchetype.ceilingHeightFeet}
                  </dd>
                </div>
                <div className="py-3.5">
                  <dt className="text-[#736B63]">Sleeping Chambers</dt>
                  <dd className="mt-1 font-medium text-[#151514]">
                    {activeArchetype.bedroomsLabel}
                  </dd>
                </div>
                <div className="py-3.5">
                  <dt className="text-[#736B63]">Service & Culinary Core</dt>
                  <dd className="mt-1 text-[#544E46]">
                    {activeArchetype.staffSuiteLabel}
                  </dd>
                </div>
                <div className="py-3.5">
                  <dt className="text-[#736B63]">Vertical Circulation</dt>
                  <dd className="mt-1 text-[#544E46]">
                    {activeArchetype.privateLiftsLabel}
                  </dd>
                </div>
                <div className="py-3.5">
                  <dt className="text-[#736B63]">Indicative Allocation (Demo)</dt>
                  <dd className="mt-1 font-mono font-semibold text-[#986046] tabular-nums">
                    {activeArchetype.indicativeValuationDemo}
                  </dd>
                </div>
              </dl>
            </div>

            <p className="mt-4 font-mono text-[11px] text-[#736B63]">
              All measurements and valuations are concept demonstration figures.
            </p>
          </div>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          SECTION 09 — TRUST, DELIVERY PHILOSOPHY & 9-PILLAR DOCUMENTATION LAYER
          Presents developer story, engineering quality benchmarks, and the 9-category
          Bangladesh documentation & payment framework—without fabricating fake government approvals.
      ===================================================================== */}
      <EditorialGridSection
        id="trust-stewardship"
        surface="structural"
        borderBottom
      >
        <SectionHeader
          indexNumber="08"
          kicker="Stewardship, Engineering Rigor & Bangladesh Due Diligence"
          title="Built on Verifiable Craft, Material Provenance, and 9-Pillar Transparency"
          subtitle="In a market often clouded by hyperbole, Varendra & Co. establishes trust through open-book engineering specifications, third-party material laboratory logs, and unpopulated institutional documentation templates—never inventing fake regulatory numbers."
        />

        {/* Embedded 9-Pillar Bangladesh Trust & Payment Framework */}
        <div className="mt-12">
          <BangladeshTrustLedger
            project={featuredResidence}
            showPaymentStructure={true}
          />
        </div>

        {/* Quantitative Craft Standards Table & Principal Endorsement */}
        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-[#D8D1C5] pt-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl text-[#151514]">
              Physical Engineering Benchmarks (Concept Specification)
            </h3>
            <dl className="mt-4 divide-y divide-[#D8D1C5] border-t border-b border-[#D8D1C5]">
              {DEVELOPER_PROFILE.craftStandards.map((std) => (
                <div
                  key={std.category}
                  className="grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-12 sm:items-baseline"
                >
                  <dt className="font-serif text-base font-medium text-[#151514] sm:col-span-4">
                    {std.category}
                  </dt>
                  <dd className="text-xs text-[#544E46] sm:col-span-5">
                    {std.specification}
                  </dd>
                  <dd className="font-mono text-xs font-medium text-[#986046] tabular-nums sm:col-span-3 sm:text-right">
                    <ArchitecturalTooltip
                      term={std.benchmark}
                      definition={std.specification}
                      benchmark={std.benchmark}
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border border-[#D8D1C5] bg-[#FAF7F2] p-8 lg:col-span-5">
            <p className="font-mono text-xs text-[#986046]">
              PRINCIPAL’S COMMITMENT
            </p>
            <blockquote className="mt-3 font-serif text-xl italic leading-relaxed text-[#151514]">
              “{DEVELOPER_PROFILE.principals[1].quote}”
            </blockquote>
            <div className="mt-4 border-t border-[#D8D1C5] pt-4 text-xs text-[#736B63]">
              <p className="font-medium text-[#151514]">
                {DEVELOPER_PROFILE.principals[1].name}
              </p>
              <p className="mt-0.5">{DEVELOPER_PROFILE.principals[1].role}</p>
            </div>
          </div>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          SECTION 10 — PRIVATE CONSULTATION
          Strong final CTA: "Experience the residence in person."
          Includes direct appointment request form + Gulshan Salon protocol.
      ===================================================================== */}
      <EditorialGridSection
        id="private-consultation"
        surface="obsidian"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left 6 Columns: Editorial Invitation */}
          <div className="lg:col-span-6">
            <p className="font-mono text-xs tracking-widest text-[#B5A07D]">
              09. PRIVATE SALON & ARCHITECTURAL BRIEFING
            </p>
            <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.08] tracking-tight text-[#F2EEE7] text-balance sm:text-5xl lg:text-6xl">
              Experience the Residence in Person.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#D8D1C5]/85">
              We invite prospective principals, family offices, and architectural
              patrons to inspect our 1:50 timber scale models, full-slab Roman
              travertine and Dhamrai kiln-brick samples, and complete floor plate
              blueprints at our Gulshan North salon.
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-[#D8D1C5]/20 pt-6 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-[#A59D90]">Private Salon Address</dt>
                <dd className="mt-1 font-medium text-[#F2EEE7]">
                  {DEVELOPER_PROFILE.headquarters}
                </dd>
              </div>
              <div>
                <dt className="text-[#A59D90]">Appointment Hours</dt>
                <dd className="mt-1 font-mono text-[#F2EEE7] tabular-nums">
                  Sat – Thu · 10:00 – 19:00 BST
                </dd>
              </div>
            </dl>
          </div>

          {/* Right 6 Columns: Instant Private Briefing Register */}
          <div className="border border-[#D8D1C5]/30 bg-[#1D1C1A] p-6 md:p-10 lg:col-span-6">
            {consultReference ? (
              <div role="status" aria-live="polite" className="py-6 text-[#F2EEE7]">
                <div className="flex items-center gap-2 font-mono text-xs text-[#B5A07D]">
                  <ArchitecturalIcon name="check" size={16} />
                  <span>APPOINTMENT LOGGED · REF {consultReference}</span>
                </div>
                <h3 className="mt-3 font-serif text-3xl text-[#F2EEE7]">
                  Briefing Reserved for {consultName}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#D8D1C5]/85">
                  Thank you. Your request for a{' '}
                  <strong className="text-[#F2EEE7]">{consultEnclave}</strong>{' '}
                  has been recorded in this concept demonstration.
                </p>
                <p className="mt-4 font-mono text-[11px] text-[#A59D90]">
                  {GLOBAL_DEMO_NOTICE}
                </p>
                <div className="mt-6">
                  <ActionButton
                    variant="inverse"
                    onClick={() => setConsultReference(null)}
                  >
                    Schedule Another Appointment
                  </ActionButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickConsultationSubmit} noValidate className="space-y-5">
                <div className="border-b border-[#D8D1C5]/20 pb-3">
                  <p className="font-mono text-xs text-[#B5A07D]">
                    REQUEST PRIVATE SALON APPOINTMENT (DEMO)
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="home-consult-name"
                      className="block text-xs font-medium text-[#D8D1C5]"
                    >
                      Principal Name *
                    </label>
                    <input
                      id="home-consult-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      placeholder="Full Name"
                      className="mt-1.5 min-h-[48px] w-full border border-[#D8D1C5]/35 bg-[#151514] px-3.5 py-2.5 text-sm text-[#F2EEE7] placeholder:text-[#8C827A] focus:border-[#F2EEE7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="home-consult-phone"
                      className="block text-xs font-medium text-[#D8D1C5]"
                    >
                      Direct Telephone / WhatsApp *
                    </label>
                    <input
                      id="home-consult-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      placeholder="+880 17XX-XXXXXX"
                      className="mt-1.5 min-h-[48px] w-full border border-[#D8D1C5]/35 bg-[#151514] px-3.5 py-2.5 font-mono text-sm text-[#F2EEE7] placeholder:text-[#8C827A] focus:border-[#F2EEE7] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="home-consult-email"
                      className="block text-xs font-medium text-[#D8D1C5]"
                    >
                      Electronic Mail *
                    </label>
                    <input
                      id="home-consult-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={consultEmail}
                      onChange={(e) => setConsultEmail(e.target.value)}
                      placeholder="principal@domain.com"
                      className="mt-1.5 min-h-[48px] w-full border border-[#D8D1C5]/35 bg-[#151514] px-3.5 py-2.5 text-sm text-[#F2EEE7] placeholder:text-[#8C827A] focus:border-[#F2EEE7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="home-consult-format"
                      className="block text-xs font-medium text-[#D8D1C5]"
                    >
                      Consultation Preference
                    </label>
                    <select
                      id="home-consult-format"
                      value={consultEnclave}
                      onChange={(e) => setConsultEnclave(e.target.value)}
                      className="mt-1.5 min-h-[48px] w-full border border-[#D8D1C5]/35 bg-[#151514] px-3.5 py-2.5 text-sm text-[#F2EEE7] focus:border-[#F2EEE7] focus:outline-none"
                    >
                      <option value="Gulshan North Salon Private Viewing">
                        Gulshan North Salon Private Viewing
                      </option>
                      <option value="Baridhara Chancery Court Site Briefing">
                        Baridhara Chancery Court Briefing
                      </option>
                      <option value="Confidential Monograph PDF Dispatch">
                        Confidential Monograph Dossier Dispatch
                      </option>
                    </select>
                  </div>
                </div>

                {consultError && (
                  <p role="alert" className="text-xs text-[#986046]">
                    {consultError}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D8D1C5]/20 pt-4">
                  <span className="font-mono text-[11px] text-[#A59D90]">
                    Frontend Concept Demo · Zero Server Transmission
                  </span>
                  <ActionButton type="submit" variant="inverse" magnetic>
                    Request Private Briefing
                  </ActionButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </EditorialGridSection>

      {/* Lightbox Modal for Inspecting Any Signature Project Plate */}
      {inspectedPlate && (
        <ArchitecturalModal
          isOpen={Boolean(inspectedPlate)}
          onClose={() => setInspectedPlate(null)}
          kicker="ARCHITECTURAL ELEVATION STUDY"
          title={inspectedPlate.title}
          subtitle={inspectedPlate.subtitle}
          footerAction={
            inspectedPlate.slug ? (
              <ActionButton
                to={`/projects/${inspectedPlate.slug}`}
                variant="primary"
              >
                Open Complete Project Monograph
              </ActionButton>
            ) : undefined
          }
        >
          <ArchitecturalImage
            src={inspectedPlate.src}
            alt={inspectedPlate.title}
            aspectRatioClass="aspect-[16/9]"
            caption={inspectedPlate.subtitle}
            figureNumber="HIGH-RESOLUTION PLATE"
          />
        </ArchitecturalModal>
      )}
    </div>
  );
};
