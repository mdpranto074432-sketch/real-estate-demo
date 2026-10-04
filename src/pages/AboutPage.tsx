import React, { useState } from 'react';
import {
  DEVELOPER_PROFILE,
  GLOBAL_DEMO_NOTICE,
  IMAGE_ASSETS,
  PROJECTS_DATA,
} from '../data/mockRealEstateData';
import { useEditorialEntrance } from '../utils/animation';
import { usePageMetadata } from '../utils/metadata';
import { ArchitecturalImage } from '../components/ui/ArchitecturalImage';
import { ArchitecturalTooltip } from '../components/ui/ArchitecturalTooltip';
import {
  EditorialGridSection,
  EditorialMetaLine,
  SectionHeader,
  SegmentedFilter,
} from '../components/ui/Primitives';
import { ConversionActionSuite } from '../components/conversion/ConversionActionSuite';
import { ArchitecturalFAQSection } from '../components/conversion/ArchitecturalFAQSection';

export const AboutPage: React.FC = () => {
  usePageMetadata({
    title: 'Architectural Practice, Vision & Craft Standards',
    description:
      'The architectural philosophy, vision, commissioning process, material craft standards, and leadership of Varendra & Co., Dhaka.',
    canonicalPath: '/about',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Varendra & Co. — Dhaka Architectural Practice (Concept)',
      description: DEVELOPER_PROFILE.manifestoLead,
    },
  });

  const containerRef = useEditorialEntrance<HTMLDivElement>('about-practice');
  const [activeProcessStep, setActiveProcessStep] = useState<number>(0);

  const commissioningProcess = [
    {
      step: 'STAGE 01',
      title: 'Enclave Selection & Micro-Climatic Hydrology',
      duration: 'Months 01 – 04 (Concept)',
      summary:
        'Before a single line is drawn, our studio conducts seasonal solar path modeling, prevailing monsoon wind-corridor analysis, and deep soil hydrology testing on the selected Dhaka plot.',
      deliverable: 'Site Microclimate & Acoustic Baseline Monograph',
    },
    {
      step: 'STAGE 02',
      title: 'Tectonic Massing & Full-Floor Spatial Proportioning',
      duration: 'Months 05 – 09 (Concept)',
      summary:
        'We configure a column-free post-tensioned structural grid restricted to one residence per floor, orienting primary salons toward lakeshore canopies and segregating service cores.',
      deliverable: '1:50 Timber Architectural Model & Wind-Tunnel Validation',
    },
    {
      step: 'STAGE 03',
      title: 'Artisanal Kiln Trials & Quarry Provenance Selection',
      duration: 'Months 10 – 16 (Concept)',
      summary:
        'Our material directors commission custom high-density clay brick firings in Dhamrai, select unfilled Roman travertine blocks, and test 42.52mm acoustic glass mockups.',
      deliverable: 'Mill-to-Site Material Provenance Binder',
    },
    {
      step: 'STAGE 04',
      title: 'Unhurried Superstructure & Acoustic Commissioning',
      duration: 'Months 17 – 36 (Concept)',
      summary:
        'Cast-in-situ board-formed concrete and ventilated stone rainscreens are executed under daily principal supervision, concluding with 32 dBA interior acoustic verification.',
      deliverable: 'Fifty-Year Structural & Maintenance Charter',
    },
  ];

  const practiceChronology = [
    {
      year: '2016 (Concept)',
      milestone: 'Founding of Studio Varendra Architectural Practice',
      note: 'Established in Dhaka as a research-led residential design and patronage studio focused on tropical modernism.',
    },
    {
      year: '2019 (Concept)',
      milestone: 'Dhamrai Kiln & Burmese Teak Material Archive',
      note: 'Initiated dedicated artisanal partnerships for compressed clay jali masonry and reclaimed seasoned timber louvers.',
    },
    {
      year: '2023 (Concept)',
      milestone: '32 dBA Acoustic & MERV-16 Air Sovereignty Standard',
      note: 'Codified our four quantitative environmental engineering benchmarks across all Dhaka residential commissions.',
    },
    {
      year: '2026 (Concept)',
      milestone: 'Monograph Edition IV — Six Enclave Portfolio',
      note: 'Presentation of six concept monographs spanning Gulshan, Baridhara, Banani, Dhanmondi, Bashundhara, and Jolshiri.',
    },
  ];

  return (
    <div ref={containerRef}>
      {/* =====================================================================
          01. BRAND PHILOSOPHY & MANIFESTO HEADER
      ===================================================================== */}
      <section className="mx-auto max-w-[1360px] px-6 pt-10 pb-16 md:px-12 lg:pt-16">
        <div
          data-animate="editorial"
          className="border-b border-[#D6CEBE] pb-12"
        >
          <EditorialMetaLine
            items={[
              'ARCHITECTURAL PRACTICE MONOGRAPH',
              `ESTABLISHED ${DEVELOPER_PROFILE.foundingYearConcept} (CONCEPT)`,
              DEVELOPER_PROFILE.headquarters,
            ]}
          />
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-normal leading-[1.06] tracking-tight text-[#1C1917] text-balance sm:text-6xl lg:text-[66px]">
            {DEVELOPER_PROFILE.manifestoHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#44403C]">
            {DEVELOPER_PROFILE.manifestoLead}
          </p>
        </div>

        {/* Asymmetric Editorial Essay & Visual Plate */}
        <div
          data-animate="editorial"
          className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center"
        >
          <div className="max-w-prose space-y-6 text-base leading-[1.8] text-[#1C1917] lg:col-span-6">
            <p className="editorial-dropcap">
              For half a century, Bengal has stood at the crossroads of
              monumental modern architecture—where Louis Kahn’s timeless brick
              and concrete citadel at Sher-e-Bangla Nagar conversed with
              Muzharul Islam’s climatic humanism. Yet much of contemporary
              residential development in Dhaka has drifted toward speculative
              speed and sealed glass curtain walls.
            </p>
            <p>
              Varendra & Co. was conceived as a counter-practice. We operate
              closer to an architectural patronage house or a fine book bindery
              than a conventional volume developer. We undertake no more than
              three buildings simultaneously, dedicating years to
              hydro-geological testing, custom brick-kiln firing in Dhamrai, and
              full-scale acoustic mockups.
            </p>
            <p>
              Our measure of success is fifty-year patination: how board-formed
              concrete weathers a fifth decade of July monsoons, how natural
              cross-ventilation eliminates mechanical cooling throughout autumn,
              and how a multi-generational family experiences complete domestic
              privacy in the heart of Gulshan or Baridhara.
            </p>
          </div>

          <div className="lg:col-span-6">
            <ArchitecturalImage
              src={IMAGE_ASSETS.dhanmondiTerrace}
              alt="Hand-crafted brick and architectural concrete facade with lush monsoon terraces"
              aspectRatioClass="aspect-[4/3]"
              caption="Material Study — Perforated kiln-brick jali screens and board-formed architectural concrete."
              figureNumber="ARCHIVE PLATE / MATERIALITY"
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          02. VISION & ARCHITECTURAL DOCTRINE
      ===================================================================== */}
      <EditorialGridSection
        surface="structural"
        borderTop
        borderBottom
      >
        <SectionHeader
          indexNumber="01"
          kicker="Vision & Architectural Doctrine"
          title="Three Non-Negotiable Tenets of Our Practice"
          subtitle="Every commission undertaken by our studio is governed by three structural and environmental commitments."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {DEVELOPER_PROFILE.philosophies.map((phil) => (
            <div
              key={phil.index}
              className="flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-8"
            >
              <div>
                <span className="font-mono text-xs text-[#78350F] tabular-nums">
                  TENET {phil.index}
                </span>
                <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                  {phil.title}
                </h3>
                <p className="mt-3 font-serif text-base italic text-[#1C1917]">
                  “{phil.thesis}”
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#44403C]">
                  {phil.detail}
                </p>
              </div>
              <span className="mt-6 border-t border-[#D6CEBE] pt-3 font-mono text-[11px] text-[#78716C]">
                STUDIO STANDARD · DHAKA
              </span>
            </div>
          ))}
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          03. QUALITY & ENGINEERING BENCHMARKS
      ===================================================================== */}
      <EditorialGridSection surface="canvas" borderBottom>
        <SectionHeader
          indexNumber="02"
          kicker="Quality & Quantitative Engineering Rigor"
          title="Physical Performance Benchmarks (Concept Specification)"
          subtitle="We define luxury not through decorative ornament, but through measurable acoustic, structural, atmospheric, and hydrological thresholds."
        />

        <div className="mt-10 overflow-x-auto border border-[#D6CEBE] bg-[#FBF9F5]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#1C1917] bg-[#EBE6DF]/60 text-xs font-semibold text-[#1C1917]">
                <th className="py-4 px-5">Engineering Discipline</th>
                <th className="py-4 px-5">Architectural & Material Specification</th>
                <th className="py-4 px-5 text-right">Measured Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6CEBE]">
              {DEVELOPER_PROFILE.craftStandards.map((std) => (
                <tr key={std.category} className="hover:bg-[#EBE6DF]/35">
                  <td className="py-4 px-5 font-serif text-lg font-medium text-[#1C1917]">
                    {std.category}
                  </td>
                  <td className="py-4 px-5 text-xs text-[#44403C]">
                    {std.specification}
                  </td>
                  <td className="py-4 px-5 text-right font-mono text-xs font-semibold text-[#78350F] tabular-nums">
                    <ArchitecturalTooltip
                      term={std.benchmark}
                      definition={std.specification}
                      benchmark={std.benchmark}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          04. PROCESS & COMMISSIONING METHODOLOGY + DEMO-SAFE CHRONOLOGY
      ===================================================================== */}
      <EditorialGridSection
        surface="structural"
        borderBottom
      >
        <SectionHeader
          indexNumber="03"
          kicker="Commissioning Process & Studio Chronology"
          title="From Hydrological Testing to Fifty-Year Stewardship"
          subtitle="Explore our four-stage architectural realization process alongside our concept studio timeline."
          align="between"
          action={
            <SegmentedFilter
              ariaLabel="Select Commissioning Stage"
              activeValue={String(activeProcessStep)}
              onChange={(val) => setActiveProcessStep(Number(val))}
              options={commissioningProcess.map((p, idx) => ({
                value: String(idx),
                label: p.step,
              }))}
            />
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left 7 Columns: Interactive 4-Stage Process Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {commissioningProcess.map((proc, idx) => {
              const isSelected = idx === activeProcessStep;
              return (
                <button
                  key={proc.step}
                  type="button"
                  onClick={() => setActiveProcessStep(idx)}
                  className={`flex flex-col justify-between border p-6 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                      : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] hover:border-[#78350F]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span
                        className={
                          isSelected ? 'text-[#D6CEBE]' : 'text-[#78350F]'
                        }
                      >
                        {proc.step}
                      </span>
                      <span
                        className={
                          isSelected ? 'text-[#A8A29E]' : 'text-[#78716C]'
                        }
                      >
                        {proc.duration}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-xl font-normal">
                      {proc.title}
                    </h3>
                    <p
                      className={`mt-2.5 text-xs leading-relaxed ${
                        isSelected ? 'text-[#D6CEBE]/90' : 'text-[#44403C]'
                      }`}
                    >
                      {proc.summary}
                    </p>
                  </div>

                  <p
                    className={`mt-5 border-t pt-3 font-mono text-[11px] ${
                      isSelected
                        ? 'border-[#D6CEBE]/20 text-[#FBF9F5]'
                        : 'border-[#D6CEBE] text-[#78350F]'
                    }`}
                  >
                    Dossier: {proc.deliverable}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right 5 Columns: Demo-Safe Practice History & Chronology */}
          <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-8 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-[#D6CEBE] pb-4">
              <span className="font-mono text-xs text-[#78350F]">
                PRACTICE CHRONOLOGY (CONCEPT TIMELINE)
              </span>
              <span className="font-mono text-[10px] text-[#78716C]">
                ILLUSTRATIVE
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {practiceChronology.map((item) => (
                <div
                  key={item.year}
                  className="border-l-2 border-[#78350F] pl-4"
                >
                  <p className="font-mono text-xs font-semibold text-[#78350F] tabular-nums">
                    {item.year}
                  </p>
                  <h4 className="mt-1 font-serif text-lg font-medium text-[#1C1917]">
                    {item.milestone}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#44403C]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          05. PEOPLE & CURATORIAL LEADERSHIP
      ===================================================================== */}
      <EditorialGridSection surface="canvas" borderBottom>
        <SectionHeader
          indexNumber="04"
          kicker="People & Curatorial Leadership"
          title="Principals of the Practice (Concept Personas)"
          subtitle="Our studio is led by architects, structural engineers, and material conservationists dedicated to Bengal’s built environment."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {DEVELOPER_PROFILE.principals.map((principal) => (
            <div
              key={principal.name}
              className="flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-8"
            >
              <div>
                <p className="font-mono text-xs text-[#78350F]">
                  {principal.role}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                  {principal.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                  {principal.background}
                </p>
              </div>

              <blockquote className="mt-6 border-t border-[#D6CEBE] pt-4 font-serif text-lg italic text-[#1C1917]">
                “{principal.quote}”
              </blockquote>
            </div>
          ))}
        </div>
      </EditorialGridSection>

      {/* =====================================================================
          06. FAQ & CONVERSION ECOSYSTEM
      ===================================================================== */}
      <EditorialGridSection surface="canvas">
        <ArchitecturalFAQSection indexNumber="05" />

        <div className="mt-16">
          <ConversionActionSuite projectSlug={PROJECTS_DATA[0].slug} />
        </div>

        <p className="mt-8 font-mono text-[11px] text-[#78716C]">
          {GLOBAL_DEMO_NOTICE}
        </p>
      </EditorialGridSection>
    </div>
  );
};
