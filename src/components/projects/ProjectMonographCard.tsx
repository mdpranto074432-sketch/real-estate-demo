import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEVELOPER_PROFILE } from '../../data/mockRealEstateData';
import { ProjectMonograph } from '../../types/realEstate';
import {
  formatBdtValuation,
  useBangladeshLocalization,
} from '../../utils/bangladeshLocalization';
import { ArchitecturalImage } from '../ui/ArchitecturalImage';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import { ArchitecturalModal } from '../ui/ArchitecturalModal';
import { ArchitecturalTooltip } from '../ui/ArchitecturalTooltip';
import {
  ActionButton,
  ArchitecturalStatusText,
  EditorialMetaLine,
} from '../ui/Primitives';
import { FloorPlanViewer } from './FloorPlanViewer';

interface ProjectMonographCardProps {
  project: ProjectMonograph;
  featuredLayout?: boolean;
}

/**
 * Helper to derive complete Bangladesh Property Information Model metrics
 * from a project's units for transparent discovery:
 * - project name, location, property type, area in sq ft, bedrooms, bathrooms,
 *   parking, floor, status, handover, payment structure, price / price on request,
 *   developer information, documentation/trust information.
 */
export function getProjectUnitMetrics(project: ProjectMonograph) {
  const bedroomsSet = Array.from(
    new Set(project.units.map((u) => u.bedrooms))
  ).sort((a, b) => a - b);

  const bedroomsLabel =
    bedroomsSet.length > 1
      ? `${bedroomsSet[0]} – ${bedroomsSet[bedroomsSet.length - 1]} Bedrooms`
      : `${bedroomsSet[0] || 4} Bedrooms`;

  const bathsSet = Array.from(
    new Set(project.units.map((u) => u.baths))
  ).sort((a, b) => a - b);

  const powderSet = Array.from(
    new Set(project.units.map((u) => u.powderRooms))
  ).sort((a, b) => a - b);

  const bathroomsLabel =
    project.bathroomsSummary ||
    (bathsSet.length > 1
      ? `${bathsSet[0]}–${bathsSet[bathsSet.length - 1]} En-Suite + ${
          powderSet[0] || 1
        } Powder`
      : `${bathsSet[0] || 4} En-Suite + ${powderSet[0] || 1} Powder`);

  const parkingSet = Array.from(
    new Set(project.units.map((u) => u.parkingBays))
  ).sort((a, b) => a - b);

  const parkingLabel =
    project.parkingSummary ||
    (parkingSet.length > 1
      ? `${parkingSet[0]}–${parkingSet[parkingSet.length - 1]} Dedicated Bays`
      : `${parkingSet[0] || 3} Dedicated Bays`);

  const areas = project.units.map((u) => u.areaSqFt);
  const minArea = Math.min(...areas);
  const maxArea = Math.max(...areas);
  const areaRangeLabel =
    minArea === maxArea
      ? `${minArea.toLocaleString('en-IN')} sq. ft.`
      : `${minArea.toLocaleString('en-IN')} – ${maxArea.toLocaleString(
          'en-IN'
        )} sq. ft.`;

  // Parse numeric BDT Crore values where present
  const numericPrices: number[] = [];
  project.units.forEach((u) => {
    const match = u.indicativeValuationBDT.match(/([\d.]+)\s*Crore/i);
    if (match && match[1]) {
      numericPrices.push(parseFloat(match[1]));
    }
  });

  const minPriceCrore =
    numericPrices.length > 0 ? Math.min(...numericPrices) : null;

  const priceDisplay =
    minPriceCrore !== null
      ? `From ৳ ${minPriceCrore.toFixed(1)} Crore BDT (Demo)`
      : 'Price on Request (Demo)';

  const typologies = Array.from(
    new Set(project.units.map((u) => u.residenceType))
  );

  const propertyTypeLabel =
    project.propertyType || typologies.join(' · ') || 'Full-Floor Residence';

  const floorAllocationLabel =
    project.floorAllocationSummary ||
    `G + ${project.stories - 1} Stories (1 Residence / Floor)`;

  const paymentStructureLabel =
    project.paymentStructureSummary ||
    '15% Booking · 20% Allotment · 55% Slab/Envelope · 10% Handover (Demo)';

  const developerInfoLabel = `${DEVELOPER_PROFILE.brandName} (${project.leadArchitectConcept})`;

  const documentationTrustLabel =
    '9-Pillar Due Diligence Schema (Unpopulated Demo Template)';

  return {
    bedroomsSet,
    bedroomsLabel,
    bathroomsLabel,
    parkingLabel,
    minArea,
    maxArea,
    areaRangeLabel,
    minPriceCrore,
    priceDisplay,
    typologies,
    propertyTypeLabel,
    floorAllocationLabel,
    paymentStructureLabel,
    developerInfoLabel,
    documentationTrustLabel,
  };
}

/**
 * Museum-grade Project Monograph & Property Discovery Entry.
 * Supports the complete 14-field Bangladesh Property Information Model:
 * 1. Project Name, 2. Location, 3. Property Type, 4. Area in sq ft,
 * 5. Bedrooms, 6. Bathrooms, 7. Parking, 8. Floor, 9. Status,
 * 10. Handover, 11. Payment Structure, 12. Price / Price on Request (BDT),
 * 13. Developer Information, 14. Documentation / Trust Information.
 */
export const ProjectMonographCard: React.FC<ProjectMonographCardProps> = ({
  project,
  featuredLayout = false,
}) => {
  const [dossierOpen, setDossierOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'exterior' | 'interior'>(
    'exterior'
  );
  const { bdtDisplayUnit, languageMode } = useBangladeshLocalization();

  const metrics = getProjectUnitMetrics(project);

  const localizedPriceDisplay =
    metrics.minPriceCrore !== null
      ? `From ${formatBdtValuation(
          `${metrics.minPriceCrore} Crore`,
          bdtDisplayUnit,
          languageMode
        )}`
      : languageMode === 'BN'
      ? 'মূল্য আলোচনাসাপেক্ষ (ডেমো)'
      : 'Price on Request (Demo)';

  const statusTone =
    project.status === 'Completed Monograph (Demo)' ||
    project.status === 'Interior Curation (Demo)'
      ? 'botanical'
      : project.status === 'Structural Phase (Demo)'
      ? 'bronze'
      : 'muted';

  const activeImageSrc =
    previewMode === 'exterior' ? project.heroImage : project.interiorImage;

  return (
    <>
      {featuredLayout ? (
        <article className="group grid grid-cols-1 gap-8 border-b border-[#D6CEBE] pb-14 lg:grid-cols-12 lg:gap-12">
          {/* Left 7 Columns: Visual Plate with Exterior / Interior Preview Switcher */}
          <div className="lg:col-span-7">
            <div className="relative">
              <ArchitecturalImage
                src={activeImageSrc}
                alt={`${project.title} — ${project.enclaveName} (${previewMode} view)`}
                aspectRatioClass="aspect-[16/10]"
                caption={`${project.addressLine} · Handover Target: ${project.completionYear}`}
                figureNumber={project.catalogNumber}
                clipReveal
                onInspectPlate={() => setDossierOpen(true)}
              />

              {/* Subtle Exterior / Interior Plate Toggle */}
              <div className="absolute top-4 left-4 z-10 inline-flex border border-[#D6CEBE]/80 bg-[#141210]/80 p-0.5 text-[11px] font-mono text-[#FBF9F5] backdrop-blur-xs">
                <button
                  type="button"
                  onClick={() => setPreviewMode('exterior')}
                  className={`px-2.5 py-1 transition-colors cursor-pointer ${
                    previewMode === 'exterior'
                      ? 'bg-[#78350F] text-[#FBF9F5]'
                      : 'text-[#D6CEBE] hover:text-[#FBF9F5]'
                  }`}
                >
                  EXTERIOR ELEVATION
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('interior')}
                  className={`px-2.5 py-1 transition-colors cursor-pointer ${
                    previewMode === 'interior'
                      ? 'bg-[#78350F] text-[#FBF9F5]'
                      : 'text-[#D6CEBE] hover:text-[#FBF9F5]'
                  }`}
                >
                  INTERIOR VOLUME
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Complete 14-Field Bangladesh Property Specification Model */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <EditorialMetaLine
                items={[
                  project.catalogNumber,
                  project.enclaveName,
                  <ArchitecturalStatusText
                    key="status"
                    status={project.status}
                    tone={statusTone}
                  />,
                ]}
              />

              <h3 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#1C1917] sm:text-4xl">
                <Link
                  to={`/projects/${project.slug}`}
                  data-cursor="explore"
                  className="transition-colors duration-150 hover:text-[#78350F]"
                >
                  {project.title}
                </Link>
              </h3>

              <p className="mt-2 font-serif text-lg italic text-[#44403C]">
                {project.subtitle}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                {project.curatorialStatement}
              </p>

              {/* Property Type & Developer Attribution */}
              <div className="mt-4 space-y-1 border-l-2 border-[#78350F] pl-3 text-xs text-[#57534E]">
                <div>
                  <span className="font-medium text-[#1C1917]">
                    Property Type:{' '}
                  </span>
                  <span>{metrics.propertyTypeLabel}</span>
                </div>
                <div>
                  <span className="font-medium text-[#1C1917]">
                    Developer Practice:{' '}
                  </span>
                  <span>{metrics.developerInfoLabel}</span>
                </div>
              </div>
            </div>

            {/* Structured Bangladesh Property Specification Grid */}
            <div className="mt-6 border-t border-[#D6CEBE] pt-5">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-[#78716C]">Area (sq. ft.)</dt>
                  <dd className="mt-0.5 font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.areaRangeLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Bedrooms</dt>
                  <dd className="mt-0.5 font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.bedroomsLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Bathrooms</dt>
                  <dd className="mt-0.5 font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.bathroomsLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Parking</dt>
                  <dd className="mt-0.5 font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.parkingLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Floor Configuration</dt>
                  <dd className="mt-0.5 font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.floorAllocationLabel}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Handover (Demo)</dt>
                  <dd className="mt-0.5 font-mono font-medium text-[#1C1917] tabular-nums">
                    {project.completionYear}
                  </dd>
                </div>
              </dl>

              {/* Payment Structure, Price (BDT), and Trust Layer Summary Strip */}
              <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[#D6CEBE]/60 pt-3 text-xs sm:grid-cols-2">
                <div>
                  <span className="text-[#78716C] block">
                    Indicative Valuation (BDT / Taka):
                  </span>
                  <span className="font-mono font-semibold text-[#78350F] tabular-nums">
                    {localizedPriceDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-[#78716C] block">
                    Payment & Trust Protocol:
                  </span>
                  <span className="font-mono text-[11px] text-[#1C1917]">
                    Milestone-Linked · 9-Pillar Trust Vault (Demo)
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#D6CEBE]/60 pt-4">
                <div className="flex flex-wrap items-center gap-5">
                  <Link
                    to={`/projects/${project.slug}`}
                    data-cursor="explore"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1C1917] whitespace-nowrap transition-colors duration-150 group-hover:text-[#78350F]"
                  >
                    <span>Examine Monograph</span>
                    <ArchitecturalIcon name="arrow-up-right" size={14} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDossierOpen(true)}
                    className="inline-flex items-center gap-1 border-b border-transparent font-mono text-[11px] text-[#57534E] transition-colors hover:border-[#78350F] hover:text-[#1C1917] cursor-pointer"
                  >
                    <ArchitecturalIcon name="layers" size={12} />
                    <span>Preview Floor Plate & Specs</span>
                  </button>
                </div>

                <ArchitecturalTooltip
                  term={`${project.landAreaKathas} Kathas`}
                  definition="Traditional Bengal land area measurement utilized across Dhaka municipal enclaves."
                  benchmark={`1 Katha = 720 sq. ft. (${(
                    project.landAreaKathas * 720
                  ).toLocaleString('en-IN')} sq. ft. plot)`}
                />
              </div>
            </div>
          </div>
        </article>
      ) : (
        /* 2-Column Architectural Editorial Gallery Card */
        <article className="group flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-6 transition-colors duration-200 hover:border-[#1C1917] md:p-8">
          <div>
            <div className="relative">
              <ArchitecturalImage
                src={activeImageSrc}
                alt={`${project.title} elevation`}
                aspectRatioClass="aspect-[4/3]"
                caption={`${project.enclaveName} · ${project.completionYear}`}
                figureNumber={project.catalogNumber}
                onInspectPlate={() => setDossierOpen(true)}
              />
              <div className="absolute top-3 left-3 z-10 inline-flex border border-[#D6CEBE]/80 bg-[#141210]/80 p-0.5 text-[10px] font-mono text-[#FBF9F5]">
                <button
                  type="button"
                  onClick={() => setPreviewMode('exterior')}
                  className={`px-2 py-0.5 cursor-pointer ${
                    previewMode === 'exterior'
                      ? 'bg-[#78350F] text-[#FBF9F5]'
                      : 'text-[#D6CEBE]'
                  }`}
                >
                  EXTERIOR
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('interior')}
                  className={`px-2 py-0.5 cursor-pointer ${
                    previewMode === 'interior'
                      ? 'bg-[#78350F] text-[#FBF9F5]'
                      : 'text-[#D6CEBE]'
                  }`}
                >
                  INTERIOR
                </button>
              </div>
            </div>

            <div className="mt-6">
              <EditorialMetaLine
                items={[
                  project.enclaveName,
                  <ArchitecturalStatusText
                    key="status"
                    status={project.status}
                    tone={statusTone}
                  />,
                ]}
              />

              <h3 className="mt-2.5 font-serif text-2xl font-normal text-[#1C1917] sm:text-3xl">
                <Link
                  to={`/projects/${project.slug}`}
                  className="transition-colors duration-150 hover:text-[#78350F]"
                >
                  {project.title}
                </Link>
              </h3>

              <p className="mt-1 font-serif text-base italic text-[#44403C]">
                {project.subtitle}
              </p>

              <p className="mt-2 text-xs text-[#57534E]">
                <strong className="font-medium text-[#1C1917]">Type:</strong>{' '}
                {metrics.propertyTypeLabel} ·{' '}
                <strong className="font-medium text-[#1C1917]">Developer:</strong>{' '}
                {DEVELOPER_PROFILE.brandName}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#D6CEBE] pt-5">
            <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
              <div>
                <dt className="text-[#78716C]">Area (sq. ft.)</dt>
                <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                  {metrics.areaRangeLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Bedrooms & Baths</dt>
                <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                  {metrics.bedroomsLabel} · {metrics.bathroomsLabel.split('+')[0]}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Floor & Parking</dt>
                <dd className="font-mono text-[#57534E] tabular-nums">
                  {project.stories}F · {metrics.parkingLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[#78716C]">Valuation (BDT)</dt>
                <dd className="font-mono font-semibold text-[#78350F] tabular-nums">
                  {localizedPriceDisplay}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between border-t border-[#D6CEBE]/60 pt-4 text-xs">
              <button
                type="button"
                onClick={() => setDossierOpen(true)}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-[#57534E] underline hover:text-[#1C1917] cursor-pointer"
              >
                <ArchitecturalIcon name="layers" size={12} />
                <span>Quick Preview</span>
              </button>

              <Link
                to={`/projects/${project.slug}`}
                className="inline-flex items-center gap-1 font-medium text-[#1C1917] whitespace-nowrap transition-colors group-hover:text-[#78350F]"
              >
                <span>Examine Dossier</span>
                <ArchitecturalIcon name="arrow-up-right" size={14} />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Architectural Dossier, Interactive Floor Plate & 14-Field Specification Modal */}
      <ArchitecturalModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        kicker={`${project.catalogNumber} · BANGLADESH PROPERTY SPECIFICATION DOSSIER`}
        title={project.title}
        subtitle={`${project.addressLine} · ${project.status}`}
        maxWidthClass="max-w-5xl"
        footerAction={
          <ActionButton to={`/projects/${project.slug}`} variant="primary">
            Open Full Project Monograph
          </ActionButton>
        }
      >
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <ArchitecturalImage
                src={project.heroImage}
                alt={`${project.title} high-resolution plate`}
                aspectRatioClass="aspect-[16/10]"
                caption={project.subtitle}
                figureNumber={project.catalogNumber}
              />
            </div>
            <div className="space-y-4 lg:col-span-6">
              <h4 className="font-mono text-xs text-[#78350F]">
                COMPLETE 14-POINT BANGLADESH SPECIFICATION SCHEDULE (DEMO)
              </h4>

              <dl className="divide-y divide-[#D6CEBE] border-t border-b border-[#D6CEBE] text-xs">
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">01. Project Name</dt>
                  <dd className="font-serif font-medium text-[#1C1917]">
                    {project.title}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">02. Location / Enclave</dt>
                  <dd className="font-medium text-[#1C1917]">
                    {project.enclaveName}, Dhaka
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">03. Property Type</dt>
                  <dd className="font-medium text-[#1C1917]">
                    {metrics.propertyTypeLabel}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">04. Area in sq. ft.</dt>
                  <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.areaRangeLabel} ({project.landAreaKathas} Katha Plot)
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">05. Bedrooms</dt>
                  <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.bedroomsLabel}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">06. Bathrooms</dt>
                  <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.bathroomsLabel}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">07. Parking</dt>
                  <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.parkingLabel}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">08. Floor Structure</dt>
                  <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {metrics.floorAllocationLabel}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">09. Project Status</dt>
                  <dd className="font-mono font-medium text-[#1C1917]">
                    {project.status}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">10. Handover Horizon</dt>
                  <dd className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {project.completionYear}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">11. Payment Structure</dt>
                  <dd className="font-mono text-[11px] text-[#1C1917]">
                    {metrics.paymentStructureLabel}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">12. Valuation (BDT / Taka)</dt>
                  <dd className="font-mono font-semibold text-[#78350F] tabular-nums">
                    {localizedPriceDisplay}
                  </dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">13. Developer Practice</dt>
                  <dd className="text-[#1C1917]">{metrics.developerInfoLabel}</dd>
                </div>
                <div className="flex justify-between py-1.5">
                  <dt className="text-[#78716C]">14. Documentation / Trust</dt>
                  <dd className="font-mono text-[11px] text-[#14532D]">
                    {metrics.documentationTrustLabel}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Embedded Interactive Floor Plan inside Preview Modal */}
          <div>
            <FloorPlanViewer floorPlans={project.floorPlans} />
          </div>
        </div>
      </ArchitecturalModal>
    </>
  );
};
