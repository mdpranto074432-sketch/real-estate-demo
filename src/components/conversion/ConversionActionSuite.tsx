import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DEVELOPER_PROFILE,
  GLOBAL_DEMO_NOTICE,
  PROJECTS_DATA,
} from '../../data/mockRealEstateData';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import { ArchitecturalModal } from '../ui/ArchitecturalModal';
import {
  ActionButton,
  EditorialFieldLabel,
  EditorialMetaLine,
} from '../ui/Primitives';

export type ConversionIntent =
  | 'inquire'
  | 'book-viewing'
  | 'request-details'
  | 'download-brochure'
  | 'contact-consultant';

interface ConversionIntentConfig {
  kicker: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  successHeadline: string;
  successNote: string;
}

const INTENT_CONFIG: Record<ConversionIntent, ConversionIntentConfig> = {
  inquire: {
    kicker: 'PRIVATE ARCHITECTURAL INQUIRY (DEMO)',
    title: 'Inquire Regarding a Residence',
    subtitle:
      'Connect with our curatorial desk for specific residence availability, floor plate allocations, and private family office briefings.',
    submitLabel: 'Submit Private Inquiry',
    successHeadline: 'Architectural Inquiry Logged',
    successNote:
      'Your inquiry has been registered in our frontend concept interface.',
  },
  'book-viewing': {
    kicker: 'PRIVATE SALON & SITE VIEWING (DEMO)',
    title: 'Schedule a Private Residence Viewing',
    subtitle:
      'Select your preferred date and consultation format to inspect 1:50 timber architectural models and material slabs in Gulshan North.',
    submitLabel: 'Confirm Viewing Request',
    successHeadline: 'Private Viewing Slot Reserved',
    successNote:
      'Your private appointment request has been recorded in this concept demonstration.',
  },
  'request-details': {
    kicker: 'TECHNICAL & SPATIAL DOSSIER (DEMO)',
    title: 'Request Complete Architectural & Engineering Details',
    subtitle:
      'Receive the full 1:100 floor plate dimension schedules, acoustic glazing STC reports, and structural specification binders.',
    submitLabel: 'Request Technical Dossier',
    successHeadline: 'Technical Dossier Prepared',
    successNote:
      'Your request for the complete technical and spatial specification binder has been logged.',
  },
  'download-brochure': {
    kicker: 'DIGITAL MONOGRAPH EDITION IV (DEMO)',
    title: 'Download Architectural Monograph & Floor Plates',
    subtitle:
      'Access the digital monograph containing curatorial essays, material provenance schedules, and schematic floor plates.',
    submitLabel: 'Generate Monograph Dossier',
    successHeadline: 'Digital Monograph Ready for Inspection',
    successNote:
      'In this frontend concept demo, your digital monograph summary is immediately available below.',
  },
  'contact-consultant': {
    kicker: 'SENIOR ARCHITECTURAL ADVISOR DESK (DEMO)',
    title: 'Speak with a Senior Portfolio Consultant',
    subtitle:
      'Arrange a confidential conversation with a Varendra & Co. principal advisor regarding multi-generational floor plates or enclave selection.',
    submitLabel: 'Request Advisor Callback',
    successHeadline: 'Advisor Consultation Requested',
    successNote:
      'Your preferred contact window and advisor request have been logged in this demo.',
  },
};

export interface ConversionActionBarProps {
  projectSlug?: string;
  unitCode?: string;
  defaultIntent?: ConversionIntent;
  compact?: boolean;
  className?: string;
}

/**
 * 6. GENERAL CTA & CONVERSION ECOSYSTEM COMPONENT
 * Provides reusable triggers and a unified interactive modal for:
 * - Inquire
 * - Book a Viewing (Private Viewing Flow)
 * - Request Details
 * - Download Brochure (Monograph Dossier)
 * - Contact Consultant
 * Includes full validation, loading, error, and privacy notice states.
 */
export const ConversionActionSuite: React.FC<ConversionActionBarProps> = ({
  projectSlug = PROJECTS_DATA[0].slug,
  unitCode = '',
   compact = false,
  className = '',
}) => {
  const [activeIntent, setActiveIntent] = useState<ConversionIntent | null>(
    null
  );

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProject, setSelectedProject] = useState(projectSlug);
  const [contactMethod, setContactMethod] = useState<
    'Direct Telephone' | 'Electronic Mail' | 'WhatsApp Confidential'
  >('Direct Telephone');
  const [viewingDate, setViewingDate] = useState('Saturday Morning (10:30 BST)');
  const [viewingVenue, setViewingVenue] = useState(
    'Gulshan North Salon (1:50 Scale Models)'
  );
  const [message, setMessage] = useState(
    unitCode ? `Inquiry regarding ${unitCode}` : ''
  );

  // Interaction States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const openIntentModal = (intent: ConversionIntent) => {
    setActiveIntent(intent);
    setSelectedProject(projectSlug);
    if (unitCode && !message) {
      setMessage(`Inquiry regarding ${unitCode}`);
    }
    setErrors({});
    setSubmissionError(null);
    setReferenceCode(null);
  };

  const closeModal = () => {
    setActiveIntent(null);
    setIsLoading(false);
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter your name or family office title.';
    }
    if (phone.replace(/\s+/g, '').length < 7) {
      nextErrors.phone = 'Please enter a valid direct phone or WhatsApp number.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Please provide a valid electronic mail address.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validate()) {
      setSubmissionError(
        'Please review the highlighted fields before confirming your request.'
      );
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setReferenceCode(
        `VRD-${Math.floor(100000 + Math.random() * 900000)}`
      );
    }, 350);
  };

  const currentProjectObj =
    PROJECTS_DATA.find((p) => p.slug === selectedProject) || PROJECTS_DATA[0];

  const config = activeIntent ? INTENT_CONFIG[activeIntent] : null;
  const inputClass =
    'mt-1.5 min-h-[48px] sm:min-h-[42px] w-full border border-[#D6CEBE] bg-[#FBF9F5] px-3.5 py-2 text-xs sm:text-sm text-[#1C1917] placeholder:text-[#78716C] transition-colors duration-150 hover:border-[#78716C] focus:border-[#78350F] focus:outline-none disabled:opacity-50';

  return (
    <>
      {compact ? (
        /* Compact Inline Action Bar */
        <div
          className={`flex flex-wrap items-center gap-2.5 ${className}`}
          role="group"
          aria-label="Architectural Inquiry & Dossier Actions"
        >
          <ActionButton
            variant="primary"
            onClick={() => openIntentModal('book-viewing')}
          >
            Book a Viewing
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => openIntentModal('download-brochure')}
          >
            <ArchitecturalIcon name="dossier" size={13} />
            <span>Download Monograph</span>
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => openIntentModal('request-details')}
          >
            Request Details
          </ActionButton>
          <button
            type="button"
            onClick={() => openIntentModal('contact-consultant')}
            className="px-3 py-2 font-mono text-xs text-[#78350F] underline hover:text-[#1C1917] cursor-pointer"
          >
            Speak with Advisor →
          </button>
        </div>
      ) : (
        /* Full 5-Action Architectural Conversion Panel */
        <div
          className={`border border-[#D6CEBE] bg-[#EBE6DF]/45 p-6 md:p-8 ${className}`}
        >
          <div className="flex flex-col justify-between gap-6 border-b border-[#D6CEBE] pb-6 lg:flex-row lg:items-end">
            <div>
              <EditorialMetaLine
                items={[
                  'PRIVATE CLIENT CONCIERGE',
                  currentProjectObj.title.toUpperCase(),
                  'FRONTEND DEMO CONVERSION SUITE',
                ]}
              />
              <h3 className="mt-2 font-serif text-2xl text-[#1C1917] sm:text-3xl">
                Curatorial Dossiers, Private Viewings & Advisory
              </h3>
              <p className="mt-1 text-xs text-[#44403C]">
                Select your preferred engagement channel below. All interactions
                occur locally within this demonstration environment.
              </p>
            </div>

            <Link
              to={`/contact?project=${currentProjectObj.slug}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#78350F] hover:text-[#1C1917]"
            >
              <span>Open Dedicated Salon Desk</span>
              <ArchitecturalIcon name="arrow-up-right" size={14} />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Inquire */}
            <button
              type="button"
              onClick={() => openIntentModal('inquire')}
              className="group flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-4 text-left transition-colors hover:border-[#1C1917] cursor-pointer"
            >
              <div>
                <span className="font-mono text-[10px] text-[#78350F]">
                  01. ALLOCATION
                </span>
                <p className="mt-1 font-serif text-lg font-medium text-[#1C1917] group-hover:text-[#78350F]">
                  Inquire Now
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#57534E]">
                  Register interest in specific floor plates or penthouses.
                </p>
              </div>
              <span className="mt-4 font-mono text-[11px] text-[#1C1917] group-hover:text-[#78350F]">
                Launch Form →
              </span>
            </button>

            {/* 2. Book a Viewing */}
            <button
              type="button"
              onClick={() => openIntentModal('book-viewing')}
              className="group flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-4 text-left transition-colors hover:border-[#1C1917] cursor-pointer"
            >
              <div>
                <span className="font-mono text-[10px] text-[#78350F]">
                  02. SALON VISIT
                </span>
                <p className="mt-1 font-serif text-lg font-medium text-[#1C1917] group-hover:text-[#78350F]">
                  Book a Viewing
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#57534E]">
                  Schedule a 1-on-1 model & stone viewing in Gulshan North.
                </p>
              </div>
              <span className="mt-4 font-mono text-[11px] text-[#1C1917] group-hover:text-[#78350F]">
                Select Slot →
              </span>
            </button>

            {/* 3. Request Details */}
            <button
              type="button"
              onClick={() => openIntentModal('request-details')}
              className="group flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-4 text-left transition-colors hover:border-[#1C1917] cursor-pointer"
            >
              <div>
                <span className="font-mono text-[10px] text-[#78350F]">
                  03. SPECIFICATIONS
                </span>
                <p className="mt-1 font-serif text-lg font-medium text-[#1C1917] group-hover:text-[#78350F]">
                  Request Details
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#57534E]">
                  Receive 1:100 CAD dimensions & acoustic glazing logs.
                </p>
              </div>
              <span className="mt-4 font-mono text-[11px] text-[#1C1917] group-hover:text-[#78350F]">
                Request Binder →
              </span>
            </button>

            {/* 4. Download Brochure */}
            <button
              type="button"
              onClick={() => openIntentModal('download-brochure')}
              className="group flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-4 text-left transition-colors hover:border-[#1C1917] cursor-pointer"
            >
              <div>
                <span className="font-mono text-[10px] text-[#78350F]">
                  04. MONOGRAPH PDF
                </span>
                <p className="mt-1 font-serif text-lg font-medium text-[#1C1917] group-hover:text-[#78350F]">
                  Download Brochure
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#57534E]">
                  Digital Edition IV architectural brochure & floor plans.
                </p>
              </div>
              <span className="mt-4 font-mono text-[11px] text-[#1C1917] group-hover:text-[#78350F]">
                Prepare PDF →
              </span>
            </button>

            {/* 5. Contact Consultant */}
            <button
              type="button"
              onClick={() => openIntentModal('contact-consultant')}
              className="group flex flex-col justify-between border border-[#D6CEBE] bg-[#FBF9F5] p-4 text-left transition-colors hover:border-[#1C1917] cursor-pointer"
            >
              <div>
                <span className="font-mono text-[10px] text-[#78350F]">
                  05. ADVISORY DESK
                </span>
                <p className="mt-1 font-serif text-lg font-medium text-[#1C1917] group-hover:text-[#78350F]">
                  Contact Consultant
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#57534E]">
                  Direct consultation with a Senior Portfolio Advisor.
                </p>
              </div>
              <span className="mt-4 font-mono text-[11px] text-[#1C1917] group-hover:text-[#78350F]">
                Arrange Call →
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Unified Conversion Modal */}
      {activeIntent && config && (
        <ArchitecturalModal
          isOpen={Boolean(activeIntent)}
          onClose={closeModal}
          kicker={config.kicker}
          title={config.title}
          subtitle={config.subtitle}
          maxWidthClass="max-w-2xl"
        >
          {referenceCode ? (
            <div className="space-y-6 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#14532D]">
                <ArchitecturalIcon name="check" size={16} />
                <span className="font-mono">
                  CONFIRMATION REFERENCE: {referenceCode}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-3xl text-[#1C1917]">
                  {config.successHeadline}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#44403C]">
                  Thank you, <strong className="text-[#1C1917]">{name}</strong>.{' '}
                  {config.successNote}
                </p>
              </div>

              <dl className="grid grid-cols-1 gap-4 border-t border-b border-[#D6CEBE] py-4 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-[#78716C]">Selected Monograph</dt>
                  <dd className="mt-1 font-serif text-base font-medium text-[#1C1917]">
                    {currentProjectObj.title} ({currentProjectObj.enclaveName})
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Preferred Channel</dt>
                  <dd className="mt-1 font-mono text-[#1C1917]">
                    {contactMethod} ({phone})
                  </dd>
                </div>
                {activeIntent === 'book-viewing' && (
                  <>
                    <div>
                      <dt className="text-[#78716C]">Requested Slot</dt>
                      <dd className="mt-1 font-mono text-[#78350F]">
                        {viewingDate}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#78716C]">Viewing Format</dt>
                      <dd className="mt-1 text-[#1C1917]">{viewingVenue}</dd>
                    </div>
                  </>
                )}
              </dl>

              {/* Simulated Brochure Spec Sheet when intent === 'download-brochure' */}
              {activeIntent === 'download-brochure' && (
                <div className="border border-[#1C1917] bg-[#EBE6DF]/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#78350F]">
                      {currentProjectObj.catalogNumber} · DIGITAL DOSSIER READY
                    </span>
                    <span className="font-mono text-[11px] text-[#57534E]">
                      EDITION IV (DEMO)
                    </span>
                  </div>
                  <p className="mt-2 font-serif text-xl text-[#1C1917]">
                    {currentProjectObj.title} — Architectural Monograph & Floor
                    Plates
                  </p>
                  <p className="mt-1 text-xs text-[#44403C]">
                    Includes {currentProjectObj.floorPlans.length} schematic
                    floor plates ({currentProjectObj.typicalFloorAreaSqFt}),
                    material provenance logs, and environmental telemetry.
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/projects/${currentProjectObj.slug}`}
                      onClick={closeModal}
                      className="inline-flex items-center gap-1.5 bg-[#1C1917] px-4 py-2 text-xs font-medium text-[#FBF9F5] hover:bg-[#78350F]"
                    >
                      <ArchitecturalIcon name="dossier" size={13} />
                      <span>Open Interactive Monograph Plate</span>
                    </Link>
                  </div>
                </div>
              )}

              <p className="text-[11px] leading-relaxed text-[#78716C]">
                {GLOBAL_DEMO_NOTICE}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {submissionError && (
                <div
                  role="alert"
                  className="border border-[#9A3412] bg-[#9A3412]/10 p-3 text-xs text-[#9A3412]"
                >
                  {submissionError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <EditorialFieldLabel
                    htmlFor="conv-name"
                    label="Full Name"
                    required
                  />
                  <input
                    id="conv-name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'conv-err-name' : undefined}
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Principal or Family Office Name"
                    className={inputClass}
                  />
                  {errors.name && (
                    <p
                      id="conv-err-name"
                      role="alert"
                      className="mt-1 text-xs text-[#9A3412]"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <EditorialFieldLabel
                    htmlFor="conv-phone"
                    label="Telephone / WhatsApp"
                    required
                  />
                  <input
                    id="conv-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'conv-err-phone' : undefined}
                    disabled={isLoading}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 17XX-XXXXXX"
                    className={`${inputClass} font-mono`}
                  />
                  {errors.phone && (
                    <p
                      id="conv-err-phone"
                      role="alert"
                      className="mt-1 text-xs text-[#9A3412]"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <EditorialFieldLabel
                    htmlFor="conv-email"
                    label="Electronic Mail"
                    required
                  />
                  <input
                    id="conv-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'conv-err-email' : undefined}
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="principal@domain.com"
                    className={inputClass}
                  />
                  {errors.email && (
                    <p
                      id="conv-err-email"
                      role="alert"
                      className="mt-1 text-xs text-[#9A3412]"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <EditorialFieldLabel
                    htmlFor="conv-project"
                    label="Interested Project"
                  />
                  <select
                    id="conv-project"
                    disabled={isLoading}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className={inputClass}
                  >
                    {PROJECTS_DATA.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.title} ({p.enclaveName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Extra Viewing Controls when booking a private viewing */}
              {activeIntent === 'book-viewing' && (
                <div className="grid grid-cols-1 gap-4 border-t border-b border-[#D6CEBE] bg-[#EBE6DF]/40 p-4 sm:grid-cols-2">
                  <div>
                    <EditorialFieldLabel
                      htmlFor="conv-date"
                      label="Preferred Viewing Window"
                    />
                    <select
                      id="conv-date"
                      disabled={isLoading}
                      value={viewingDate}
                      onChange={(e) => setViewingDate(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Saturday Morning (10:30 BST)">
                        Saturday Morning (10:30 BST)
                      </option>
                      <option value="Monday Afternoon (15:00 BST)">
                        Monday Afternoon (15:00 BST)
                      </option>
                      <option value="Wednesday Evening Salon (17:30 BST)">
                        Wednesday Evening Salon (17:30 BST)
                      </option>
                      <option value="Thursday Morning (11:00 BST)">
                        Thursday Morning (11:00 BST)
                      </option>
                    </select>
                  </div>

                  <div>
                    <EditorialFieldLabel
                      htmlFor="conv-venue"
                      label="Consultation Format"
                    />
                    <select
                      id="conv-venue"
                      disabled={isLoading}
                      value={viewingVenue}
                      onChange={(e) => setViewingVenue(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Gulshan North Salon (1:50 Scale Models)">
                        Gulshan North Salon (Scale Models)
                      </option>
                      <option value="Enclave Site Perimeter Walk">
                        Enclave Site Perimeter Walk
                      </option>
                      <option value="Principal Architect Video Briefing">
                        Principal Architect Video Briefing
                      </option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <EditorialFieldLabel
                    htmlFor="conv-method"
                    label="Preferred Contact Method"
                  />
                  <select
                    id="conv-method"
                    disabled={isLoading}
                    value={contactMethod}
                    onChange={(e) =>
                      setContactMethod(
                        e.target.value as
                          | 'Direct Telephone'
                          | 'Electronic Mail'
                          | 'WhatsApp Confidential'
                      )
                    }
                    className={inputClass}
                  >
                    <option value="Direct Telephone">Direct Telephone</option>
                    <option value="Electronic Mail">Electronic Mail</option>
                    <option value="WhatsApp Confidential">
                      WhatsApp Confidential
                    </option>
                  </select>
                </div>

                <div>
                  <EditorialFieldLabel
                    htmlFor="conv-msg"
                    label="Optional Note"
                    optionalNote="OPTIONAL"
                  />
                  <input
                    id="conv-msg"
                    type="text"
                    disabled={isLoading}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Floor preference or questions..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Explicit Privacy & Purpose Disclosure */}
              <div className="border-t border-[#D6CEBE] pt-4">
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  <strong className="font-medium text-[#1C1917]">
                    Privacy & Data Purpose Notice:
                  </strong>{' '}
                  In a live production environment, contact particulars are
                  collected solely to coordinate your requested architectural
                  briefing or dispatch project dossiers. In this frontend
                  demonstration, zero personal data is transmitted, stored, or
                  shared externally.
                </p>

                <div className="mt-4 flex justify-end">
                  <ActionButton
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                  >
                    {isLoading ? 'Processing Request...' : config.submitLabel}
                  </ActionButton>
                </div>
              </div>
            </form>
          )}
        </ArchitecturalModal>
      )}
    </>
  );
};
