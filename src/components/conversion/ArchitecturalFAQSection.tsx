import React, { useState } from 'react';
import { SectionHeader, SegmentedFilter } from '../ui/Primitives';

export interface FAQItem {
  id: string;
  category:
    | 'Spatial & Architecture'
    | 'Enclaves & Land'
    | 'Engineering & Climate'
    | 'Consultation & Demo Notice';
  question: string;
  answer: string;
  specificationNote?: string;
}

export const ARCHITECTURAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Spatial & Architecture',
    question:
      'Why does Varendra & Co. restrict its residences to one household per floor plate?',
    answer:
      'Dedicating an entire structural floor plate to a single residence eliminates shared party walls, common corridors, and acoustic bleed between neighbors. More importantly in Dhaka’s sub-tropical deltaic climate, a full-floor configuration enables true four-sided natural cross-ventilation—allowing south-easterly breezes to pass unimpeded from the lakefront veranda through the living salon and northern chambers.',
    specificationNote: '100% Dual-Aspect Cross-Ventilation · 0 Shared Party Walls',
  },
  {
    id: 'faq-2',
    category: 'Spatial & Architecture',
    question:
      'How is the distinction between Gross Floor Plate Area and Net Internal Suite Area calculated?',
    answer:
      'We publish both figures on every floor plate schematic so principals and their architectural advisors have complete clarity. Net Internal Suite Area measures the enclosed air-conditioned living, dining, bedroom, and culinary spaces, plus the fourteen-foot cantilevered verandas. Gross Floor Plate Area adds the dedicated private passenger lift vestibule and segregated service core.',
    specificationNote: 'Itemized 1:100 Schematic Schedules on Every Monograph',
  },
  {
    id: 'faq-3',
    category: 'Engineering & Climate',
    question:
      'How do the residences achieve a 32 dBA interior acoustic stillness in central Dhaka?',
    answer:
      'Each building envelope utilizes a 42.52mm double-glazed low-iron laminated glass assembly paired with deep exterior stone or timber louvers that deflect street-level sound waves. Internally, floor slabs are poured with an acoustic isolation mat beneath honed Roman travertine or terrazzo, preventing structural vibration transmission.',
    specificationNote: '44–46 dB Exterior-to-Interior Sound Reduction (Demo Benchmark)',
  },
  {
    id: 'faq-4',
    category: 'Engineering & Climate',
    question:
      'What provisions are made for indoor air quality and potable water sovereignty?',
    answer:
      'Every residence is served by a centralized hospital-grade MERV-16 and activated-carbon Energy Recovery Ventilation (ERV) system that filters incoming fresh air to maintain PM2.5 particulates below 8 µg/m³ continuously. Subterranean cisterns harvest up to 110,000 liters of monsoon rainwater alongside five-stage potable mineralization.',
    specificationNote: 'Continuous PM2.5 < 8 µg/m³ · Five-Stage Water Mineralization',
  },
  {
    id: 'faq-5',
    category: 'Enclaves & Land',
    question:
      'How does Varendra & Co. select plots across Gulshan, Baridhara, Banani, Dhanmondi, Bashundhara, and Jolshiri?',
    answer:
      'We evaluate fewer than two percent of plots presented to our studio, prioritizing corner plots, lakefront setbacks, or cul-de-sac avenues bordering mature rain-tree canopies. Up to 45% of each site footprint is preserved as permeable botanical water courts to lower the surrounding microclimate temperature.',
    specificationNote: '1 Katha = 720 sq. ft. · 14 to 24 Katha Plot Extents (Concept)',
  },
  {
    id: 'faq-6',
    category: 'Consultation & Demo Notice',
    question:
      'Are the projects, prices, and construction timelines on this website real offerings?',
    answer:
      'No. All architectural monographs, unit schedules, valuations, and engineering milestones presented on this platform are fictional concept demonstrations created to showcase luxury real-estate software architecture and editorial design. No real legal, municipal, or governmental approvals are claimed, and no personal data submitted in forms leaves your browser.',
    specificationNote: '100% Frontend Concept Demonstration · Zero Backend Storage',
  },
];

export const ArchitecturalFAQSection: React.FC<{
  indexNumber?: string;
  className?: string;
}> = ({ indexNumber = '04', className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | FAQItem['category']
  >('all');
  const [openId, setOpenId] = useState<string>(ARCHITECTURAL_FAQS[0].id);

  const filteredFaqs =
    selectedCategory === 'all'
      ? ARCHITECTURAL_FAQS
      : ARCHITECTURAL_FAQS.filter((f) => f.category === selectedCategory);

  return (
    <div className={className}>
      <SectionHeader
        indexNumber={indexNumber}
        kicker="Architectural, Technical & Advisory FAQ"
        title="Frequently Asked Questions"
        subtitle="Clear answers regarding our spatial calculations, environmental engineering benchmarks, Dhaka enclave criteria, and concept portfolio disclosures."
        align="between"
        action={
          <SegmentedFilter
            ariaLabel="Filter FAQs by Category"
            activeValue={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: 'all', label: 'All Topics', count: ARCHITECTURAL_FAQS.length },
              { value: 'Spatial & Architecture', label: 'Architecture' },
              { value: 'Engineering & Climate', label: 'Engineering' },
              { value: 'Enclaves & Land', label: 'Enclaves' },
              { value: 'Consultation & Demo Notice', label: 'Demo & Privacy' },
            ]}
          />
        }
      />

      <div className="mt-10 divide-y divide-[#D6CEBE] border-t border-b border-[#D6CEBE]">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = faq.id === openId;
          return (
            <div key={faq.id} className="py-6">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? '' : faq.id)}
                className="flex w-full items-start justify-between gap-6 text-left cursor-pointer group"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#78350F] tabular-nums">
                    0{idx + 1}.
                  </span>
                  <div>
                    <span className="font-mono text-[11px] text-[#78716C]">
                      {faq.category.toUpperCase()}
                    </span>
                    <h3 className="mt-1 font-serif text-xl font-normal text-[#1C1917] transition-colors group-hover:text-[#78350F] sm:text-2xl">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[#D6CEBE] font-mono text-xs text-[#1C1917] transition-colors group-hover:border-[#1C1917]"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="mt-4 pl-8 sm:pl-10">
                  <p className="max-w-3xl text-sm leading-relaxed text-[#44403C]">
                    {faq.answer}
                  </p>
                  {faq.specificationNote && (
                    <p className="mt-3 font-mono text-xs text-[#78350F]">
                      Standard: {faq.specificationNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
