import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DEVELOPER_PROFILE,
  GLOBAL_DEMO_NOTICE,
  PROJECTS_DATA,
} from '../data/mockRealEstateData';
import { useEditorialEntrance } from '../utils/animation';
import { usePageMetadata } from '../utils/metadata';
import { ArchitecturalIcon } from '../components/ui/ArchitecturalIcon';
import {
  ActionButton,
  EditorialFieldLabel,
  EditorialGridSection,
  EditorialMetaLine,
  SegmentedFilter,
} from '../components/ui/Primitives';
import {
   ArchitecturalFAQSection,
  ARCHITECTURAL_FAQS,
} from '../components/conversion/ArchitecturalFAQSection';
import { ConversionActionSuite } from '../components/conversion/ConversionActionSuite';
import { useBangladeshLocalization } from '../utils/bangladeshLocalization';

type EngagementMode = 'inquiry' | 'private-viewing';

interface LeadFormState {
  fullName: string;
  phone: string;
  email: string;
  projectSlug: string;
  preferredContactMethod:
    | 'Direct Telephone'
    | 'Electronic Mail'
    | 'WhatsApp Confidential';
  optionalMessage: string;
  // Private Viewing Flow Specifics
  viewingVenue:
    | 'Gulshan North Salon (1:50 Scale Models & Material Slabs)'
    | 'On-Site Enclave Perimeter Briefing'
    | 'Confidential Video Presentation with Principal Architect';
  preferredTimeSlot: string;
}

export const ContactPage: React.FC = () => {
  const { languageMode } = useBangladeshLocalization();

  usePageMetadata({
    title: 'Private Salon Inquiries & Viewing Appointments',
    description:
      'Request an architectural monograph or schedule a private consultation with Varendra & Co. in Gulshan North, Dhaka.',
    canonicalPath: '/contact',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: ARCHITECTURAL_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  });

  const [searchParams] = useSearchParams();
  const initialProject = searchParams.get('project') || PROJECTS_DATA[0].slug;
  const initialUnit = searchParams.get('unit') || '';
  const initialMode =
    searchParams.get('mode') === 'viewing' ? 'private-viewing' : 'inquiry';

  const [engagementMode, setEngagementMode] =
    useState<EngagementMode>(initialMode);

  const [formState, setFormState] = useState<LeadFormState>({
    fullName: '',
    phone: '',
    email: '',
    projectSlug: initialProject,
    preferredContactMethod: 'Direct Telephone',
    optionalMessage: initialUnit ? `Inquiry regarding ${initialUnit}` : '',
    viewingVenue: 'Gulshan North Salon (1:50 Scale Models & Material Slabs)',
    preferredTimeSlot: 'Saturday · 11:00 BST',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formErrorBanner, setFormErrorBanner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(
    null
  );

  const containerRef = useEditorialEntrance<HTMLDivElement>('contact-page');

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formState.fullName.trim() || formState.fullName.trim().length < 2) {
      nextErrors.fullName =
        'Please enter your full name or family office representation.';
    }
    const phoneClean = formState.phone.replace(/\s+/g, '');
    if (phoneClean.length < 7) {
      nextErrors.phone =
        'Please provide a direct telephone or WhatsApp contact number.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email.trim())) {
      nextErrors.email = 'Please provide a valid electronic mail address.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorBanner(null);

    if (!validateForm()) {
      setFormErrorBanner(
        'Please verify the highlighted fields below so our curatorial desk can respond accurately.'
      );
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      const prefix = engagementMode === 'private-viewing' ? 'VIEW' : 'INQ';
      const refCode = `VRD-${prefix}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      setSubmittedReference(refCode);
      setIsSubmitting(false);
    }, 360);
  };

  const selectedProjectObj =
    PROJECTS_DATA.find((p) => p.slug === formState.projectSlug) ||
    PROJECTS_DATA[0];

  const inputBaseClass =
    'mt-2 min-h-[48px] w-full border border-[#D6CEBE] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1C1917] placeholder:text-[#A8A29E] transition-colors duration-150 hover:border-[#78716C] focus:border-[#78350F] focus:outline-none disabled:opacity-50';

  return (
    <div ref={containerRef}>
      {/* =====================================================================
          01. EDITORIAL HEADER & MODE SWITCHER (INQUIRY vs. PRIVATE VIEWING FLOW)
      ===================================================================== */}
      <section className="mx-auto max-w-[1360px] px-6 pt-10 pb-12 md:px-12 lg:pt-16">
        <div
          data-animate="editorial"
          className="border-b border-[#D6CEBE] pb-10"
        >
          <EditorialMetaLine
            items={[
              'PRIVATE SALON & BRIEFING DESK',
              'BY PRIOR APPOINTMENT ONLY',
              'GULSHAN NORTH AVENUE, DHAKA (CONCEPT)',
            ]}
          />

          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <h1 className="font-serif text-4xl font-normal leading-[1.08] tracking-tight text-[#1C1917] text-balance sm:text-5xl lg:text-[62px]">
                Initiate a Private Architectural Briefing
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#44403C]">
                Whether requesting a technical floor-plate dossier or reserving
                a private model viewing at our Gulshan North salon, every
                inquiry is handled directly by a senior architectural advisor.
              </p>
            </div>

            <SegmentedFilter
              ariaLabel="Select Consultation Type"
              activeValue={engagementMode}
              onChange={(mode) => {
                setEngagementMode(mode);
                setSubmittedReference(null);
                setFormErrorBanner(null);
              }}
              options={[
                { value: 'inquiry', label: '01. Direct Inquiry' },
                { value: 'private-viewing', label: '02. Private Viewing Flow' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          02. CONCISE LEAD / PRIVATE VIEWING FORM & SALON PROTOCOL
      ===================================================================== */}
      <section className="mx-auto max-w-[1360px] px-6 pb-20 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left 7 Columns: Validated Short Form or Confirmation State */}
          <div className="lg:col-span-7">
            {submittedReference ? (
              <div
                role="status"
                aria-live="polite"
                className="border border-[#14532D] bg-[#EBE6DF]/50 p-8 md:p-10"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-[#14532D]">
                  <ArchitecturalIcon name="check" size={16} />
                  <span className="font-mono">
                    REQUEST CONFIRMED · DEMO REFERENCE: {submittedReference}
                  </span>
                </div>

                <h2 className="mt-3 font-serif text-3xl text-[#1C1917]">
                  Thank You, {formState.fullName}.
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[#44403C]">
                  Your{' '}
                  {engagementMode === 'private-viewing'
                    ? 'Private Viewing Appointment'
                    : 'Architectural Dossier Inquiry'}{' '}
                  for{' '}
                  <strong className="font-medium text-[#1C1917]">
                    {selectedProjectObj.title}
                  </strong>{' '}
                  has been recorded in our frontend concept demonstration.
                </p>

                <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-b border-[#D6CEBE] py-5 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[#78716C]">Interested Project</dt>
                    <dd className="mt-1 font-serif text-base font-medium text-[#1C1917]">
                      {selectedProjectObj.title} ({selectedProjectObj.enclaveName})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#78716C]">Preferred Contact Method</dt>
                    <dd className="mt-1 font-medium text-[#1C1917]">
                      {formState.preferredContactMethod}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#78716C]">Contact Particulars</dt>
                    <dd className="mt-1 font-mono text-[#1C1917]">
                      {formState.phone} · {formState.email}
                    </dd>
                  </div>
                  {engagementMode === 'private-viewing' && (
                    <div>
                      <dt className="text-[#78716C]">Viewing Window & Venue</dt>
                      <dd className="mt-1 font-mono text-[#78350F]">
                        {formState.preferredTimeSlot} ·{' '}
                        {formState.viewingVenue.split('(')[0]}
                      </dd>
                    </div>
                  )}
                </dl>

                <p className="mt-5 text-xs text-[#78716C]">
                  {GLOBAL_DEMO_NOTICE}
                </p>

                <div className="mt-6">
                  <ActionButton
                    variant="secondary"
                    onClick={() => setSubmittedReference(null)}
                  >
                    Submit Another Request
                  </ActionButton>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6 border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-10"
              >
                <div className="border-b border-[#D6CEBE] pb-4">
                  <p className="font-mono text-xs text-[#78350F]">
                    {engagementMode === 'private-viewing'
                      ? 'PRIVATE SALON & SITE VIEWING SCHEDULER (DEMO)'
                      : 'CONFIDENTIAL PORTFOLIO INQUIRY DESK (DEMO)'}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-[#1C1917]">
                    {engagementMode === 'private-viewing'
                      ? 'Configure Your Private Viewing Experience'
                      : 'Principal Contact Particulars'}
                  </h2>
                </div>

                {formErrorBanner && (
                  <div
                    role="alert"
                    className="border border-[#9A3412] bg-[#9A3412]/10 p-3.5 text-xs text-[#9A3412]"
                  >
                    {formErrorBanner}
                  </div>
                )}

                {/* Private Viewing Step Selector (Only shown in Private Viewing Flow) */}
                {engagementMode === 'private-viewing' && (
                  <div className="space-y-4 border border-[#D6CEBE] bg-[#EBE6DF]/45 p-5">
                    <p className="font-mono text-[11px] text-[#78350F]">
                      STEP 01 · SELECT VIEWING VENUE & PREFERRED WINDOW
                    </p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <EditorialFieldLabel
                          htmlFor="viewingVenue"
                          label="Viewing Format"
                        />
                        <select
                          id="viewingVenue"
                          disabled={isSubmitting}
                          value={formState.viewingVenue}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              viewingVenue: e.target
                                .value as LeadFormState['viewingVenue'],
                            })
                          }
                          className={inputBaseClass}
                        >
                          <option value="Gulshan North Salon (1:50 Scale Models & Material Slabs)">
                            Gulshan North Salon (Scale Models & Slabs)
                          </option>
                          <option value="On-Site Enclave Perimeter Briefing">
                            On-Site Enclave Perimeter Briefing
                          </option>
                          <option value="Confidential Video Presentation with Principal Architect">
                            Principal Architect Video Briefing
                          </option>
                        </select>
                      </div>

                      <div>
                        <EditorialFieldLabel
                          htmlFor="preferredTimeSlot"
                          label="Preferred Time Window (BST)"
                        />
                        <select
                          id="preferredTimeSlot"
                          disabled={isSubmitting}
                          value={formState.preferredTimeSlot}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              preferredTimeSlot: e.target.value,
                            })
                          }
                          className={inputBaseClass}
                        >
                          <option value="Saturday · 11:00 BST">
                            Saturday Morning · 11:00 BST
                          </option>
                          <option value="Monday · 15:30 BST">
                            Monday Afternoon · 15:30 BST
                          </option>
                          <option value="Wednesday · 17:30 BST">
                            Wednesday Evening · 17:30 BST
                          </option>
                          <option value="Thursday · 11:30 BST">
                            Thursday Morning · 11:30 BST
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Concise 6 Core Contact Fields: Name, Phone, Email, Interested Project, Preferred Contact Method, Optional Message */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <EditorialFieldLabel
                      htmlFor="fullName"
                      label="Name"
                      required
                    />
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'err-fullName' : undefined}
                      disabled={isSubmitting}
                      value={formState.fullName}
                      onChange={(e) => {
                        setFormState({ ...formState, fullName: e.target.value });
                        if (errors.fullName) {
                          setErrors({ ...errors, fullName: '' });
                        }
                      }}
                      placeholder="Full Name or Family Office"
                      className={inputBaseClass}
                    />
                    {errors.fullName && (
                      <p
                        id="err-fullName"
                        role="alert"
                        className="mt-1.5 text-xs text-[#9A3412]"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <EditorialFieldLabel
                      htmlFor="phone"
                      label="Phone / WhatsApp"
                      required
                    />
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'err-phone' : undefined}
                      disabled={isSubmitting}
                      value={formState.phone}
                      onChange={(e) => {
                        setFormState({ ...formState, phone: e.target.value });
                        if (errors.phone) {
                          setErrors({ ...errors, phone: '' });
                        }
                      }}
                      placeholder="+880 17XX-XXXXXX"
                      className={`${inputBaseClass} font-mono`}
                    />
                    {errors.phone && (
                      <p
                        id="err-phone"
                        role="alert"
                        className="mt-1.5 text-xs text-[#9A3412]"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <EditorialFieldLabel
                      htmlFor="email"
                      label="Email"
                      required
                    />
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'err-email' : undefined}
                      disabled={isSubmitting}
                      value={formState.email}
                      onChange={(e) => {
                        setFormState({ ...formState, email: e.target.value });
                        if (errors.email) {
                          setErrors({ ...errors, email: '' });
                        }
                      }}
                      placeholder="principal@domain.com"
                      className={inputBaseClass}
                    />
                    {errors.email && (
                      <p
                        id="err-email"
                        role="alert"
                        className="mt-1.5 text-xs text-[#9A3412]"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <EditorialFieldLabel
                      htmlFor="projectSlug"
                      label="Interested Project"
                    />
                    <select
                      id="projectSlug"
                      disabled={isSubmitting}
                      value={formState.projectSlug}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          projectSlug: e.target.value,
                        })
                      }
                      className={inputBaseClass}
                    >
                      {PROJECTS_DATA.map((proj) => (
                        <option key={proj.id} value={proj.slug}>
                          {proj.title} — {proj.enclaveName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <EditorialFieldLabel
                    htmlFor="preferredContactMethod"
                    label="Preferred Contact Method"
                  />
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {(
                      [
                        'Direct Telephone',
                        'Electronic Mail',
                        'WhatsApp Confidential',
                      ] as const
                    ).map((method) => {
                      const isSelected =
                        formState.preferredContactMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() =>
                            setFormState({
                              ...formState,
                              preferredContactMethod: method,
                            })
                          }
                          className={`border px-3.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                              : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#44403C] hover:border-[#78350F]'
                          }`}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <EditorialFieldLabel
                    htmlFor="optionalMessage"
                    label="Message"
                    optionalNote="OPTIONAL"
                  />
                  <textarea
                    id="optionalMessage"
                    rows={3}
                    disabled={isSubmitting}
                    value={formState.optionalMessage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        optionalMessage: e.target.value,
                      })
                    }
                    placeholder="Specify preferred floor level, bedroom configuration (2BR, 3BR, 4BR, or Penthouse), or any specific questions..."
                    className={inputBaseClass}
                  />
                </div>

                {/* Explicit Privacy & Data Purpose Disclosure */}
                <div className="border-t border-[#D6CEBE] pt-5">
                  <div className="rounded-none border border-[#D6CEBE] bg-[#EBE6DF]/35 p-4 text-xs leading-relaxed text-[#44403C]">
                    <p className="font-mono text-[11px] font-semibold text-[#1C1917]">
                      PRIVACY & DATA COLLECTION TRANSPARENCY
                    </p>
                    <p className="mt-1">
                      We request only your name, direct contact channel, and
                      project of interest for the sole purpose of arranging your
                      architectural consultation or dispatching requested floor
                      plate monographs. No unnecessary telemetry is collected,
                      and in this frontend demonstration, no personal data is
                      transmitted to any backend server.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <span className="font-mono text-[11px] text-[#78716C]">
                      RESPONSE STANDARD: WITHIN 1 BUSINESS DAY (DEMO)
                    </span>
                    <ActionButton
                      type="submit"
                      variant="primary"
                      loading={isSubmitting}
                      magnetic
                    >
                      {isSubmitting
                        ? 'Recording Request...'
                        : engagementMode === 'private-viewing'
                        ? 'Reserve Private Viewing'
                        : 'Submit Inquiry'}
                    </ActionButton>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right 5 Columns: Private Salon Protocol & Bangladesh Phone/WhatsApp Concierge */}
          <aside className="space-y-8 lg:col-span-5">
            {/* Direct Bangladesh Phone & WhatsApp Concierge Card */}
            <div className="border border-[#1C1917] bg-[#1C1917] p-6 text-[#FBF9F5] md:p-8">
              <p className="font-mono text-xs text-[#D6CEBE]">
                {languageMode === 'BN'
                  ? 'সরাসরি টেলিফোন ও হোয়াটসঅ্যাপ কনসিয়ার্জ (ডেমো)'
                  : 'DIRECT DHAKA TELEPHONE & WHATSAPP CONCIERGE (DEMO)'}
              </p>
              <h3 className="mt-2 font-serif text-2xl text-[#FBF9F5]">
                {languageMode === 'BN'
                  ? 'সিনিয়র স্থাপত্য উপদেষ্টার সাথে সরাসরি যোগাযোগ'
                  : 'Prefer Immediate Telephone or WhatsApp Coordination?'}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#D6CEBE]/85">
                In Bangladesh, principal families and NRB (Non-Resident
                Bangladeshi) patrons frequently prefer direct WhatsApp or
                telephone coordination for rapid floor-plate dispatches and
                appointment scheduling.
              </p>

              <dl className="mt-5 space-y-3 border-t border-[#D6CEBE]/20 pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-[#A8A29E]">Gulshan Salon Desk (Demo)</dt>
                  <dd className="font-mono font-semibold text-[#FBF9F5] tabular-nums">
                    +880 1711-000000
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#A8A29E]">WhatsApp Concierge (Demo)</dt>
                  <dd className="font-mono font-semibold text-[#D6CEBE] tabular-nums">
                    +880 1711-000000 (Encrypted)
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#A8A29E]">NRB International Desk</dt>
                  <dd className="font-mono text-[#D6CEBE]">
                    BST (UTC+6) · Flexible Video Briefing
                  </dd>
                </div>
              </dl>

              <p className="mt-4 border-t border-[#D6CEBE]/20 pt-3 font-mono text-[10px] text-[#A8A29E]">
                Note: Telephone numbers above are illustrative placeholders for
                this concept portfolio.
              </p>
            </div>

            <div className="border border-[#D6CEBE] bg-[#EBE6DF]/40 p-6 md:p-8">
              <p className="font-mono text-xs text-[#78350F]">
                THE PRIVATE VIEWING PROTOCOL
              </p>
              <h3 className="mt-2 font-serif text-2xl text-[#1C1917]">
                What to Expect at Our Gulshan North Salon
              </h3>
              <ul className="mt-5 space-y-4 text-xs leading-relaxed text-[#44403C]">
                <li className="border-l-2 border-[#78350F] pl-3.5">
                  <strong className="block font-serif text-base text-[#1C1917]">
                    01. 1:50 Timber Scale Models
                  </strong>
                  Examine physical basswood and teak models illustrating sun
                  angles, monsoon overhang depth, and privacy setbacks.
                </li>
                <li className="border-l-2 border-[#78350F] pl-3.5">
                  <strong className="block font-serif text-base text-[#1C1917]">
                    02. Tactile Material Library
                  </strong>
                  Inspect full-size slabs of honed Roman travertine, Dhamrai
                  kiln-fired clay bricks, and 42.52mm acoustic laminated glass.
                </li>
                <li className="border-l-2 border-[#78350F] pl-3.5">
                  <strong className="block font-serif text-base text-[#1C1917]">
                    03. 1:100 Engineering & Floor Plates
                  </strong>
                  Review structural post-tensioned slab spans and customize
                  internal partition layouts with a project architect.
                </li>
              </ul>

              <dl className="mt-6 space-y-3.5 border-t border-[#D6CEBE] pt-5 text-xs">
                <div>
                  <dt className="text-[#78716C]">Concept Studio Location</dt>
                  <dd className="mt-0.5 font-medium text-[#1C1917]">
                    {DEVELOPER_PROFILE.headquarters}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Private Salon Hours</dt>
                  <dd className="mt-0.5 font-mono text-[#1C1917] tabular-nums">
                    Saturday – Thursday · 10:00 to 19:00 BST
                  </dd>
                </div>
                <div>
                  <dt className="text-[#78716C]">Direct Curatorial Desk (Demo)</dt>
                  <dd className="mt-0.5 font-mono text-[#1C1917] tabular-nums">
                    salon@varendra-architecture.example · +880 (02) 550-0194
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-8">
              <p className="font-mono text-xs text-[#78716C]">
                CONCEPT PORTFOLIO NOTICE
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                {GLOBAL_DEMO_NOTICE}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================================
          03. GENERAL CTA SYSTEM & ARCHITECTURAL FAQ
      ===================================================================== */}
      <EditorialGridSection
        surface="structural"
        borderTop
        borderBottom
      >
        <ConversionActionSuite projectSlug={formState.projectSlug} />
      </EditorialGridSection>

      <EditorialGridSection surface="canvas">
        <ArchitecturalFAQSection indexNumber="02" />
      </EditorialGridSection>
    </div>
  );
};
