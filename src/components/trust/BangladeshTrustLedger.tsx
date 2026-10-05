import React, { useState } from 'react';
import { DEVELOPER_PROFILE, GLOBAL_DEMO_NOTICE } from '../../data/mockRealEstateData';
import { ProjectMonograph } from '../../types/realEstate';
import {
  getBangladeshTrustDocumentation,
  getProjectPaymentSchedule,
  useBangladeshLocalization,
} from '../../utils/bangladeshLocalization';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import { ArchitecturalTooltip } from '../ui/ArchitecturalTooltip';
import { ActionButton, SegmentedFilter } from '../ui/Primitives';

interface BangladeshTrustLedgerProps {
  project: ProjectMonograph;
  showPaymentStructure?: boolean;
  className?: string;
}

/**
 * 9-CATEGORY BANGLADESH TRUST, DOCUMENTATION & PAYMENT STRUCTURE PRESENTATION
 * Specifically engineered to hold:
 * 1. Developer Registration
 * 2. Authority & Municipal Jurisdiction
 * 3. Approval References
 * 4. Project Documentation
 * 5. Ownership / Title / Khatiyan & Undivided Land Share
 * 6. Construction Information (BNBC Seismic & Lab Logs)
 * 7. Delivery History
 * 8. Utilities & Sovereignty
 * 9. Acquisition & Allotment Terms
 *
 * CRITICAL COMPLIANCE: Never populates fake RAJUK, REHAB, government IDs, or legal deed numbers.
 * All regulatory slots are transparently presented as unpopulated concept templates.
 */
export const BangladeshTrustLedger: React.FC<BangladeshTrustLedgerProps> = ({
  project,
  showPaymentStructure = true,
  className = '',
}) => {
  const { languageMode } = useBangladeshLocalization();
  const [activeVaultTab, setActiveVaultTab] = useState<
    'all' | 'statutory' | 'title-land' | 'engineering-utilities'
  >('all');

  const trustDoc = getBangladeshTrustDocumentation(project);
  const paymentStages = getProjectPaymentSchedule(project);

  const cards = [
    {
      id: 'developerRegistration',
      group: 'statutory' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.developerRegistration.categoryTitleBn
          : trustDoc.developerRegistration.categoryTitle,
      subtitle: trustDoc.developerRegistration.authorityLabel,
      summary: trustDoc.developerRegistration.protocolSummary,
      items: trustDoc.developerRegistration.requiredDocumentsList,
      badge: 'UNPOPULATED TEMPLATE (DEMO)',
    },
    {
      id: 'authorityAndMunicipal',
      group: 'statutory' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.authorityAndMunicipal.categoryTitleBn
          : trustDoc.authorityAndMunicipal.categoryTitle,
      subtitle: trustDoc.authorityAndMunicipal.authorityLabel,
      summary: trustDoc.authorityAndMunicipal.protocolSummary,
      items: trustDoc.authorityAndMunicipal.requiredDocumentsList,
      badge: 'NO AUTHORITY CLAIM (CONCEPT)',
    },
    {
      id: 'approvalReferences',
      group: 'statutory' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.approvalReferences.categoryTitleBn
          : trustDoc.approvalReferences.categoryTitle,
      subtitle: trustDoc.approvalReferences.referencePlaceholder,
      summary: trustDoc.approvalReferences.protocolSummary,
      items: trustDoc.approvalReferences.requiredDocumentsList,
      badge: 'UNPOPULATED SLOT (DEMO)',
    },
    {
      id: 'projectDocumentation',
      group: 'title-land' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.projectDocumentation.categoryTitleBn
          : trustDoc.projectDocumentation.categoryTitle,
      subtitle: trustDoc.projectDocumentation.dossierScope,
      summary: trustDoc.projectDocumentation.protocolSummary,
      items: trustDoc.projectDocumentation.requiredDocumentsList,
      badge: 'ILLUSTRATIVE CAD SPEC',
    },
    {
      id: 'ownershipAndTitle',
      group: 'title-land' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.ownershipAndTitle.categoryTitleBn
          : trustDoc.ownershipAndTitle.categoryTitle,
      subtitle: `${trustDoc.ownershipAndTitle.landTenureStructure} · ${trustDoc.ownershipAndTitle.undividedShareNote}`,
      summary: trustDoc.ownershipAndTitle.protocolSummary,
      items: trustDoc.ownershipAndTitle.requiredDocumentsList,
      badge: 'CONCEPT LAND SCHEDULE',
    },
    {
      id: 'constructionInformation',
      group: 'engineering-utilities' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.constructionInformation.categoryTitleBn
          : trustDoc.constructionInformation.categoryTitle,
      subtitle: `${trustDoc.constructionInformation.structuralSystem} · ${trustDoc.constructionInformation.seismicAndWindCodeNote}`,
      summary: trustDoc.constructionInformation.protocolSummary,
      items: trustDoc.constructionInformation.requiredDocumentsList,
      badge: 'CONCEPT ENGINEERING',
    },
    {
      id: 'deliveryHistory',
      group: 'statutory' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.deliveryHistory.categoryTitleBn
          : trustDoc.deliveryHistory.categoryTitle,
      subtitle: trustDoc.deliveryHistory.stewardshipCadence,
      summary: trustDoc.deliveryHistory.protocolSummary,
      items: [
        `Developer Practice: ${DEVELOPER_PROFILE.brandName} (${DEVELOPER_PROFILE.headquarters})`,
        `Commissioning Status: ${project.status} · Target: ${project.completionYear}`,
        '50-Year Building Stewardship & Sink-Fund Charter (Concept Model)',
      ],
      badge: 'CONCEPT PRACTICE PROFILE',
    },
    {
      id: 'utilitiesAndSovereignty',
      group: 'engineering-utilities' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.utilitiesAndSovereignty.categoryTitleBn
          : trustDoc.utilitiesAndSovereignty.categoryTitle,
      subtitle: '100% Full-Load Acoustic Backup & Potable Water Sovereignty',
      summary:
        'Engineered for uninterrupted domestic autonomy in Dhaka across power, water mineralization, culinary gas safety, and hospital-grade air filtration.',
      items: [
        `Power: ${trustDoc.utilitiesAndSovereignty.powerBackupProvision}`,
        `Water: ${trustDoc.utilitiesAndSovereignty.waterTreatmentAndHarvesting}`,
        `Culinary: ${trustDoc.utilitiesAndSovereignty.gasAndCulinaryProvision}`,
        `Air: ${trustDoc.utilitiesAndSovereignty.airFiltrationStandard}`,
      ],
      badge: 'ILLUSTRATIVE MEP SPEC',
    },
    {
      id: 'acquisitionTerms',
      group: 'title-land' as const,
      title:
        languageMode === 'BN'
          ? trustDoc.acquisitionTerms.categoryTitleBn
          : trustDoc.acquisitionTerms.categoryTitle,
      subtitle: 'Milestone-Linked Construction & Handover Assessment Charter',
      summary: trustDoc.acquisitionTerms.bookingAndAllotmentProtocol,
      items: [
        trustDoc.acquisitionTerms.escrowAndMilestoneNote,
        trustDoc.acquisitionTerms.handoverAssessmentProtocol,
        'Independent Buyer Legal Counsel Vetting Prior to Earnest Deposit (Concept Standard)',
      ],
      badge: 'CONCEPT TERMS',
    },
  ];

  const visibleCards =
    activeVaultTab === 'all'
      ? cards
      : cards.filter((c) => c.group === activeVaultTab);

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Institutional Transparency Banner */}
      <div className="border border-[#1C1917] bg-[#FBF9F5] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#78350F]">
              <ArchitecturalIcon name="dossier" size={14} />
              <span>
                {languageMode === 'BN'
                  ? 'বাংলাদেশ রিয়েল এস্টেট ট্রাস্ট এবং ডকুমেন্টেশন কাঠামো (ডেমো / ধারণাগত)'
                  : 'BANGLADESH DUE DILIGENCE & DOCUMENTATION ARCHITECTURE (DEMO / CONCEPT)'}
              </span>
            </div>
            <h3 className="mt-2 font-serif text-2xl text-[#1C1917] sm:text-3xl">
              {languageMode === 'BN'
                ? 'যাচাইযোগ্য স্থাপত্য মানদণ্ড — কোনো কাল্পনিক সরকারি অনুমোদন দাবি করা হয়নি'
                : 'Built for Independent Legal & Engineering Vetting — Zero Fabricated Regulatory Claims'}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#44403C] sm:text-sm">
              In Bangladesh’s premier residential market, discerning families and
              their legal counsel require structured clarity across nine pillars:
              Developer Registration, Municipal Authority Jurisdiction, Approval
              References, Project Documentation, Ownership & Undivided Land Share
              (Khatiyan), Construction Engineering, Delivery History, Utilities,
              and Allotment Terms. Because this platform is a{' '}
              <strong className="font-medium text-[#151514]">
                Concept Architectural Portfolio
              </strong>
              , all statutory reference fields below are deliberately maintained
              as{' '}
              <strong className="font-medium text-[#986046]">
                Unpopulated Template Slots
              </strong>{' '}
              rather than inventing synthetic permit numbers.
            </p>
          </div>

          <div className="shrink-0">
            <SegmentedFilter
              ariaLabel="Filter Trust & Documentation Categories"
              activeValue={activeVaultTab}
              onChange={setActiveVaultTab}
              options={[
                { value: 'all', label: 'All 9 Pillars', count: 9 },
                { value: 'statutory', label: 'Registry & Authority' },
                { value: 'title-land', label: 'Land, Title & Terms' },
                { value: 'engineering-utilities', label: 'Engineering & Utilities' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 9-Category Structured Documentation Vault Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((card) => (
          <article
            key={card.id}
            className="flex flex-col justify-between border border-[#D8D1C5] bg-[#FAF7F2] p-6 transition-colors hover:border-[#986046]"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D8D1C5] pb-3 font-mono text-[10px]">
                <span className="font-semibold text-[#986046]">
                  {card.badge}
                </span>
                <span className="text-[#8C827A]">ILLUSTRATIVE SCHEMA</span>
              </div>

              <h4 className="mt-4 font-serif text-xl font-normal text-[#151514] sm:text-2xl">
                {card.title}
              </h4>

              <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#151514] bg-[#E8E2D8]/60 px-2.5 py-1.5 border-l-2 border-[#986046]">
                {card.subtitle}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-[#544E46]">
                {card.summary}
              </p>

              <ul className="mt-4 space-y-2 border-t border-[#D8D1C5]/70 pt-3 text-[11px] text-[#544E46]">
                {card.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 font-mono text-[10px] text-[#986046]">
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#D8D1C5] pt-3 font-mono text-[10px] text-[#8C827A]">
              <span>STATUS: CONCEPT TEMPLATE</span>
              <span>ZERO FABRICATED IDs</span>
            </div>
          </article>
        ))}
      </div>

      {/* Indicative Bangladesh Milestone Payment Structure Schedule */}
      {showPaymentStructure && (
        <div className="border border-[#D8D1C5] bg-[#FAF7F2] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[#D8D1C5] pb-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-xs text-[#986046]">
                {languageMode === 'BN'
                  ? 'নির্মাণ-সংযুক্ত কিস্তি ও মূল্য পরিশোধ কাঠামো (ডেমো / ধারণাগত)'
                  : 'CONSTRUCTION-LINKED PAYMENT STRUCTURE MODEL (ILLUSTRATIVE DEMO)'}
              </p>
              <h3 className="mt-1 font-serif text-2xl text-[#151514] sm:text-3xl">
                {languageMode === 'BN'
                  ? `${project.titleBn || project.title} — ধারণাগত কিস্তি তফসিল`
                  : `${project.title} — Progressive Milestone Allocation Schedule`}
              </h3>
              <p className="mt-1 text-xs text-[#544E46]">
                {project.paymentStructureSummary ||
                  'Structured around verifiable engineering completions—from Earnest Booking (Bayna) and Tripartite Allotment to progressive Post-Tensioned Slab Pours and Key Handover.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ArchitecturalTooltip
                term="Undivided Land Share (অবিভক্ত ভূমি)"
                definition="Each residence is allocated a proportional undivided share of the freehold/leasehold enclave plot alongside structural construction milestones."
                benchmark={`${project.landAreaKathas} Kathas / ${project.totalResidences} Residences`}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {paymentStages.map((stage) => (
              <div
                key={stage.stageCode}
                className="flex flex-col justify-between border border-[#D8D1C5] bg-[#E8E2D8]/40 p-4"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-[#986046]">
                      {stage.stageCode}
                    </span>
                    <span className="text-[#66705B] font-semibold">
                      {stage.percentageAllocation.split(' ')[0]}
                    </span>
                  </div>
                  <h4 className="mt-2 font-serif text-base font-medium text-[#151514]">
                    {languageMode === 'BN'
                      ? stage.milestoneLabelBn
                      : stage.milestoneLabel}
                  </h4>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-[#544E46]">
                    {stage.scheduleNote}
                  </p>
                </div>
                <p className="mt-4 border-t border-[#D8D1C5] pt-2 font-mono text-[10px] text-[#8C827A]">
                  {stage.demoStatusNote}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#D8D1C5] pt-4 text-xs sm:flex-row sm:items-center">
            <p className="font-mono text-[11px] text-[#8C827A]">
              {GLOBAL_DEMO_NOTICE}
            </p>
            <ActionButton
              to={`/contact?project=${project.slug}`}
              variant="secondary"
            >
              Request Specimen Covenant & Payment Dossier
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
};
