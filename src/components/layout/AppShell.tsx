import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { DEVELOPER_PROFILE, GLOBAL_DEMO_NOTICE, PROJECTS_DATA } from '../../data/mockRealEstateData';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import { ArchitecturalCursor } from '../ui/ArchitecturalCursor';
import {
  prefersReducedMotion,
  useMagneticInteraction,
  useScrollProgress,
} from '../../utils/animation';
import { useBangladeshLocalization } from '../../utils/bangladeshLocalization';

const NAV_ITEMS = [
  {
    label: 'Portfolio',
    labelBn: 'প্রকল্প আর্কাইভ',
    path: '/projects',
    subtitle: '06 Commissioned Monographs',
  },
  {
    label: 'Enclaves',
    labelBn: 'ঢাকা এনক্লেভ',
    path: '/locations',
    subtitle: '06 Dhaka Urban Precincts',
  },
  {
    label: 'Practice',
    labelBn: 'স্থাপত্য দর্শন',
    path: '/about',
    subtitle: 'Tectonic Doctrine & Leadership',
  },
  {
    label: 'Inquiries',
    labelBn: 'যোগাযোগ ও অ্যাপয়েন্টমেন্ট',
    path: '/contact',
    subtitle: 'Private Salon & Viewing Flow',
  },
];

function resolveChapterLabel(pathname: string): string {
  if (pathname === '/') return 'MONOGRAPH EDITION IV · DHAKA';
  if (pathname === '/projects') return 'PORTFOLIO ARCHIVE & DISCOVERY';
  if (pathname.startsWith('/projects/')) {
    const slug = pathname.replace('/projects/', '');
    const match = PROJECTS_DATA.find((p) => p.slug === slug);
    return match ? `${match.catalogNumber} · ${match.title.toUpperCase()}` : 'ARCHITECTURAL MONOGRAPH';
  }
  if (pathname === '/locations') return 'DHAKA ENCLAVE ATLAS';
  if (pathname === '/about') return 'PRACTICE & STRUCTURAL THESIS';
  if (pathname === '/contact') return 'PRIVATE SALON & BRIEFING';
  return 'VARENDRA & CO. ARCHIVE';
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const headerCtaRef = useMagneticInteraction<HTMLAnchorElement>(0.16);
  const scrollProgress = useScrollProgress();
  const { languageMode, setLanguageMode, bdtDisplayUnit, setBdtDisplayUnit } =
    useBangladeshLocalization();

  // Refs for Page Transition Choreography
  const mainCanvasRef = useRef<HTMLElement | null>(null);
  const transitionVeilRef = useRef<HTMLDivElement | null>(null);
  const transitionLabelRef = useRef<HTMLSpanElement | null>(null);
  const isInitialMount = useRef(true);

  const currentChapterLabel = resolveChapterLabel(location.pathname);

  // Lock body scroll and listen for Escape key when mobile navigation sheet is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // 01. PAGE TRANSITIONS — Choreographed entry/exit veil & content elevation on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (prefersReducedMotion()) return;

    const veil = transitionVeilRef.current;
    const label = transitionLabelRef.current;
    const mainEl = mainCanvasRef.current;

    const ctx = gsap.context(() => {
      if (veil && label) {
        const tl = gsap.timeline();
        tl.set(veil, { scaleY: 1, transformOrigin: 'bottom center', opacity: 1 })
          .fromTo(
            label,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' },
            0
          )
          .to(
            label,
            { opacity: 0, y: -8, duration: 0.18, ease: 'power2.in' },
            0.2
          )
          .to(
            veil,
            {
              scaleY: 0,
              transformOrigin: 'top center',
              duration: 0.5,
              ease: 'expo.inOut',
            },
            0.16
          );
      }

      if (mainEl) {
        gsap.fromTo(
          mainEl,
          { opacity: 0.88, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* 06. Minimal Premium Draughtsman Cursor System (Desktop fine-pointer only) */}
      <ArchitecturalCursor />

      {/* 01. Page Transition Architectural Veil */}
      <div
        ref={transitionVeilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#141210] text-[#FBF9F5] origin-top scale-y-0"
      >
        <span
          ref={transitionLabelRef}
          className="px-6 text-center font-mono text-xs tracking-[0.22em] text-[#D6CEBE] opacity-0"
        >
          {currentChapterLabel}
        </span>
      </div>

      {/* Accessibility Skip Link */}
      <a
        href="#main-editorial-canvas"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[#1C1917] focus:px-4 focus:py-2.5 focus:text-xs focus:font-medium focus:text-[#FBF9F5]"
      >
        Skip to primary architectural content
      </a>

      {/* Strict 3-Zone Top Bar Contract (56px mobile height respects <15% viewport cap) */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 border-b border-[#D6CEBE]/70 bg-[#FBF9F5]/92 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 sm:px-10 md:px-14">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="font-serif text-lg sm:text-[21px] font-normal tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 py-2 transition-colors duration-200 hover:text-[#78350F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78350F]"
          >
            {languageMode === 'BN' ? 'বরেন্দ্র অ্যান্ড কোং' : DEVELOPER_PROFILE.brandName}
          </Link>

          {/* Zone 2: 4 clean text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-10 font-mono text-[11px] tracking-[0.18em] uppercase text-[#44403C]"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `py-2 whitespace-nowrap shrink-0 transition-colors duration-200 border-b ${
                    isActive
                      ? 'border-[#1C1917] text-[#1C1917] font-medium'
                      : 'border-transparent hover:border-[#78350F]/50 hover:text-[#1C1917]'
                  }`
                }
              >
                {languageMode === 'BN' ? item.labelBn : item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Bilingual EN/BN Toggle + 1 Primary Action + 44x44px Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setLanguageMode(languageMode === 'EN' ? 'BN' : 'BN' === languageMode ? 'EN' : 'BN')
              }
              aria-label={
                languageMode === 'EN'
                  ? 'Switch to Bangla (বাংলা) editorial headings'
                  : 'Switch to English editorial headings'
              }
              title="Toggle English / বাংলা Bilingual Readiness"
              className="inline-flex min-h-[44px] sm:min-h-[36px] items-center gap-1.5 border border-[#D6CEBE]/80 bg-transparent px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-[#1C1917] transition-colors hover:border-[#1C1917] cursor-pointer"
            >
              <span className={languageMode === 'EN' ? 'font-semibold text-[#1C1917]' : 'text-[#78716C]'}>
                EN
              </span>
              <span aria-hidden="true" className="text-[#D6CEBE]">
                /
              </span>
              <span className={languageMode === 'BN' ? 'font-semibold text-[#1C1917]' : 'text-[#78716C]'}>
                বাংলা
              </span>
            </button>

            <Link
              ref={headerCtaRef}
              to="/contact"
              className="hidden sm:inline-flex min-h-[38px] items-center justify-center border border-[#1C1917] bg-[#1C1917] px-5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#FBF9F5] whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-transparent hover:text-[#1C1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78350F]"
            >
              {languageMode === 'BN' ? 'পরামর্শ বুকিং' : 'Schedule Briefing'}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-[#D6CEBE] text-[#1C1917] transition-colors hover:bg-[#EBE6DF] active:bg-[#D6CEBE] md:hidden cursor-pointer"
            >
              <ArchitecturalIcon name={mobileMenuOpen ? 'close' : 'menu'} size={18} />
            </button>
          </div>
        </div>

        {/* Subtle 1.5px Architectural Scroll Progress Telemetry Hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[1.5px] bg-transparent overflow-hidden"
        >
          <div
            className="h-full w-full origin-left bg-[#78350F] transition-transform duration-75 ease-out"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* Dedicated Mobile Navigation Sheet (Thumb-Zone Ergonomics & Full Accessibility) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Primary Navigation"
          className="fixed inset-0 top-14 z-50 flex flex-col justify-between bg-[#FBF9F5] md:hidden overflow-y-auto"
        >
          <div className="px-5 pt-6 pb-8">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-widest text-[#78350F]">
                ARCHITECTURAL INDEX · DHAKA
              </p>
              <span className="font-mono text-[10px] text-[#57534E]">
                BDT (৳) · {languageMode === 'BN' ? 'বাংলা সংস্করণ' : 'ENGLISH EDITION'}
              </span>
            </div>
            <nav aria-label="Mobile Navigation" className="mt-4 divide-y divide-[#D6CEBE] border-t border-b border-[#D6CEBE]">
              {NAV_ITEMS.map((item, idx) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-[60px] items-center justify-between py-3 transition-colors ${
                      isActive ? 'text-[#78350F]' : 'text-[#1C1917]'
                    }`
                  }
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#78716C] mr-2">
                      0{idx + 1}.
                    </span>
                    <span className="font-serif text-2xl">
                      {languageMode === 'BN' ? item.labelBn : item.label}
                    </span>
                    <p className="mt-0.5 text-xs text-[#57534E]">{item.subtitle}</p>
                  </div>
                  <ArchitecturalIcon name="arrow-up-right" size={16} />
                </NavLink>
              ))}
            </nav>

            {/* Quick Monograph Jump List for Mobile Thumb Reach */}
            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-widest text-[#57534E]">
                SIGNATURE MONOGRAPHS (DIRECT ACCESS)
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {PROJECTS_DATA.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/projects/${proj.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center justify-between border border-[#D6CEBE] bg-[#EBE6DF]/40 px-3.5 py-2.5 text-xs text-[#1C1917] active:bg-[#D6CEBE]"
                  >
                    <span className="font-serif text-base font-medium">{proj.title}</span>
                    <span className="font-mono text-[11px] text-[#78350F]">{proj.enclaveName}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Natural Thumb-Zone Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 border-t border-[#D6CEBE] bg-[#FBF9F5] p-5 shadow-lg">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex min-h-[48px] items-center justify-center border border-[#1C1917] bg-transparent px-4 py-3 text-xs font-medium text-[#1C1917]"
              >
                Explore Portfolio
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex min-h-[48px] items-center justify-center bg-[#1C1917] px-4 py-3 text-xs font-medium text-[#FBF9F5]"
              >
                Schedule Briefing
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area with Page Transition Choreography */}
      <main
        id="main-editorial-canvas"
        ref={mainCanvasRef}
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        {children}
      </main>

      {/* Quiet Institutional Footer with Bangladesh Localization & BDT Controls */}
      <footer className="border-t border-[#D6CEBE] bg-[#EBE6DF]/55 text-[#1C1917]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-6 py-14 sm:py-16 md:px-12 lg:py-20">
          {/* Bangladesh Localization & Currency Convention Bar */}
          <div className="mb-10 flex flex-col justify-between gap-4 border border-[#D6CEBE] bg-[#FBF9F5] p-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono font-semibold text-[#78350F]">
                BANGLADESH LOCALIZATION & CURRENCY CONVENTION:
              </span>
              <span className="text-[#44403C]">
                1 Katha = 720 sq. ft. · 1 Crore = 100 Lakh BDT (৳)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="BDT Valuation Display Format"
                className="inline-flex border border-[#D6CEBE] bg-[#EBE6DF]/50 p-0.5 font-mono text-[11px]"
              >
                {(['CRORE', 'LAKH', 'SYMBOL'] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setBdtDisplayUnit(unit)}
                    className={`px-2.5 py-1 transition-colors cursor-pointer ${
                      bdtDisplayUnit === unit
                        ? 'bg-[#1C1917] text-[#FBF9F5]'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    {unit === 'CRORE'
                      ? '৳ Crore'
                      : unit === 'LAKH'
                      ? '৳ Lakh'
                      : '৳ BDT Digits'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setLanguageMode(languageMode === 'EN' ? 'BN' : 'EN')
                }
                className="border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-1 font-mono text-[11px] font-medium text-[#1C1917] hover:border-[#78350F] cursor-pointer"
              >
                {languageMode === 'EN'
                  ? 'Language: English (Switch to বাংলা)'
                  : 'ভাষা: বাংলা (Switch to English)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:gap-12 border-b border-[#D6CEBE] pb-12 lg:grid-cols-12">
            {/* Brand & Manifesto Summary */}
            <div className="lg:col-span-5">
              <p className="font-serif text-2xl font-medium tracking-tight text-[#1C1917]">
                {DEVELOPER_PROFILE.brandName}{' '}
                <span className="font-serif text-base text-[#78716C]">
                  · বরেন্দ্র অ্যান্ড কোং
                </span>
              </p>
              <p className="mt-2 font-mono text-xs text-[#78350F]">
                {DEVELOPER_PROFILE.monographEdition}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#44403C]">
                {DEVELOPER_PROFILE.manifestoLead}
              </p>
              <p className="mt-4 font-mono text-xs text-[#57534E]">
                {DEVELOPER_PROFILE.headquarters}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#78350F]">
                <span>Direct Salon Desk (Demo): +880 1711-000000</span>
                <span>·</span>
                <span>WhatsApp Concierge Ready</span>
              </div>
            </div>

            {/* Monographs Index */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold tracking-wide text-[#1C1917]">
                Architectural Monographs (Concept Portfolio)
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#44403C]">
                {PROJECTS_DATA.map((proj) => (
                  <li key={proj.id}>
                    <Link
                      to={`/projects/${proj.slug}`}
                      data-cursor="explore"
                      className="group inline-flex min-h-[36px] flex-wrap items-baseline gap-x-2 py-1 transition-colors hover:text-[#78350F]"
                    >
                      <span className="font-mono text-xs text-[#78716C] tabular-nums">
                        {proj.catalogNumber.replace('MONOGRAPH ', '')}
                      </span>
                      <span className="font-serif text-lg text-[#1C1917] group-hover:text-[#78350F]">
                        {proj.title}
                      </span>
                      <span className="text-xs text-[#78716C]">· {proj.enclaveName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation & Salon Hours */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold tracking-wide text-[#1C1917]">
                Index & Private Salon
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[#44403C]">
                <li>
                  <Link
                    to="/projects"
                    className="inline-flex min-h-[36px] items-center editorial-link-underline hover:text-[#1C1917] transition-colors"
                  >
                    Portfolio Archive
                  </Link>
                </li>
                <li>
                  <Link
                    to="/locations"
                    className="inline-flex min-h-[36px] items-center editorial-link-underline hover:text-[#1C1917] transition-colors"
                  >
                    Dhaka Enclave Studies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="inline-flex min-h-[36px] items-center editorial-link-underline hover:text-[#1C1917] transition-colors"
                  >
                    Practice & Craft Standards
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-[36px] items-center editorial-link-underline hover:text-[#1C1917] transition-colors"
                  >
                    Request Private Briefing
                  </Link>
                </li>
              </ul>
              <div className="mt-6 border-t border-[#D6CEBE] pt-4 text-xs text-[#57534E]">
                <p className="font-medium text-[#1C1917]">By Private Appointment</p>
                <p className="mt-1 font-mono tabular-nums">
                  Saturday – Thursday · 10:00 – 19:00 BST (UTC+6)
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Demo & Non-Approval Disclaimer */}
          <div className="mt-8 flex flex-col justify-between gap-4 text-xs text-[#57534E] lg:flex-row lg:items-center">
            <p className="max-w-3xl leading-relaxed">{GLOBAL_DEMO_NOTICE}</p>
            <p className="shrink-0 font-mono text-[11px] text-[#78716C] tabular-nums">
              © {new Date().getFullYear()} {DEVELOPER_PROFILE.brandName} · Concept Architecture
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
