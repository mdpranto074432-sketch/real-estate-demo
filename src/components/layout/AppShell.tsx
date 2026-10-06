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
    const mainEl = mainCanvasRef.current;
    const labelEl = transitionLabelRef.current;
    if (!veil || !mainEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      tl.set(veil, { scaleY: 0, transformOrigin: 'bottom', display: 'flex' })
        .set(mainEl, { opacity: 0.82, y: 12 })
        .to(veil, {
          scaleY: 1,
          duration: 0.32,
          ease: 'power4.inOut',
        })
        .fromTo(
          labelEl,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' },
          '-=0.12'
        )
        .set(veil, { transformOrigin: 'top' })
        .to(veil, {
          scaleY: 0,
          duration: 0.38,
          delay: 0.08,
          ease: 'power4.inOut',
        })
        .to(
          mainEl,
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            ease: 'power3.out',
          },
          '-=0.28'
        )
        .set(veil, { display: 'none' });
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-[#F2EEE7] text-[#151514] selection:bg-[#986046] selection:text-[#F2EEE7]">
      {/* Magnetic Architectural Cursor Follower */}
      <ArchitecturalCursor />

      {/* Fullscreen Route Transition Architectural Wipe Veil */}
      <div
        ref={transitionVeilRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 hidden flex-col items-center justify-center bg-[#151514] text-[#F2EEE7]"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-[10px] tracking-[0.24em] text-[#986046] uppercase">
            CHAPTER TRANSITION
          </span>
          <span
            ref={transitionLabelRef}
            className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#F2EEE7]"
          >
            {currentChapterLabel}
          </span>
          <div className="mt-2 h-px w-16 bg-[#B5A07D]/40" />
        </div>
      </div>

      {/* Skip to Main Content Link (Accessibility) */}
      <a
        href="#main-editorial-canvas"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-[#986046] focus:bg-[#151514] focus:px-4 focus:py-2.5 focus:font-mono focus:text-xs focus:text-[#F2EEE7]"
      >
        Skip to main architectural content
      </a>

      {/* Strict 3-Zone Top Bar Contract (56px mobile height respects <15% viewport cap) */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 border-b border-[#D8D1C5] bg-[#F2EEE7]/94 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-5 sm:px-6 md:px-12">
          {/* Zone 1: Unboxed Brand Logotype & Live Monograph Chapter Indicator */}
          <div className="flex items-baseline gap-3">
            <Link
              to="/"
              data-cursor="home"
              className="inline-flex flex-col items-start group focus-visible:outline-2 focus-visible:outline-[#986046]"
              aria-label="Varendra & Co. Home Page"
            >
              <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-[#151514] transition-colors group-hover:text-[#986046]">
                {DEVELOPER_PROFILE.brandName}
              </span>
              <span className="hidden sm:inline font-mono text-[9px] tracking-[0.18em] text-[#736B63] uppercase">
                DHAKA RESIDENCES
              </span>
            </Link>

            <span aria-hidden="true" className="hidden lg:inline text-[#D8D1C5]">
              /
            </span>
            <span className="hidden lg:inline font-mono text-[10px] tracking-widest text-[#736B63] truncate max-w-[280px]">
              {currentChapterLabel}
            </span>
          </div>

          {/* Zone 2: Quiet Text Navigation Links (Zero Pill Enclosures) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 lg:gap-9 text-xs tracking-wide"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                data-cursor="view"
                className={({ isActive }) =>
                  `inline-flex min-h-[44px] items-center border-b-2 py-1 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#986046] ${
                    isActive
                      ? 'border-[#151514] text-[#151514] font-medium'
                      : 'border-transparent text-[#544E46] hover:border-[#986046]/60 hover:text-[#151514]'
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
              className="inline-flex min-h-[44px] sm:min-h-[36px] items-center gap-1.5 border border-[#D8D1C5] bg-transparent px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-[#151514] transition-colors hover:border-[#151514] cursor-pointer"
            >
              <span className={languageMode === 'EN' ? 'font-semibold text-[#151514]' : 'text-[#8C827A]'}>
                EN
              </span>
              <span aria-hidden="true" className="text-[#D8D1C5]">
                /
              </span>
              <span className={languageMode === 'BN' ? 'font-semibold text-[#151514]' : 'text-[#8C827A]'}>
                বাংলা
              </span>
            </button>

            <Link
              ref={headerCtaRef}
              to="/contact"
              className="hidden sm:inline-flex min-h-[38px] items-center justify-center border border-[#151514] bg-[#151514] px-5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-[#F2EEE7] whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-[#986046] hover:border-[#986046] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#986046]"
            >
              {languageMode === 'BN' ? 'পরামর্শ বুকিং' : 'Schedule Briefing'}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-[#D8D1C5] text-[#151514] transition-colors hover:bg-[#E8E2D8] active:bg-[#D8D1C5] md:hidden cursor-pointer"
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
            className="h-full w-full origin-left bg-[#986046] transition-transform duration-75 ease-out"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* Dedicated Mobile Navigation Sheet */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Primary Navigation"
          className="fixed inset-0 top-14 z-50 flex flex-col justify-between bg-[#F2EEE7] md:hidden overflow-y-auto"
        >
          <div className="px-5 pt-6 pb-8">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-widest text-[#986046]">
                ARCHITECTURAL INDEX · DHAKA
              </p>
              <span className="font-mono text-[10px] text-[#736B63]">
                BDT (৳) · {languageMode === 'BN' ? 'বাংলা সংস্করণ' : 'ENGLISH EDITION'}
              </span>
            </div>
            <nav aria-label="Mobile Navigation" className="mt-4 divide-y divide-[#D8D1C5] border-t border-b border-[#D8D1C5]">
              {NAV_ITEMS.map((item, idx) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-[60px] items-center justify-between py-3 transition-colors ${
                      isActive ? 'text-[#986046]' : 'text-[#151514]'
                    }`
                  }
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#8C827A] mr-2">
                      0{idx + 1}.
                    </span>
                    <span className="font-serif text-2xl">
                      {languageMode === 'BN' ? item.labelBn : item.label}
                    </span>
                    <p className="mt-0.5 text-xs text-[#736B63]">{item.subtitle}</p>
                  </div>
                  <ArchitecturalIcon name="arrow-up-right" size={16} />
                </NavLink>
              ))}
            </nav>

            {/* Quick Monograph Jump List for Mobile */}
            <div className="mt-6">
              <p className="font-mono text-[10px] tracking-widest text-[#736B63]">
                SIGNATURE MONOGRAPHS (DIRECT ACCESS)
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {PROJECTS_DATA.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/projects/${proj.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[48px] items-center justify-between border border-[#D8D1C5] bg-[#E8E2D8]/50 px-3.5 py-2.5 text-xs text-[#151514] active:bg-[#D8D1C5]"
                  >
                    <span className="font-serif text-base font-medium">{proj.title}</span>
                    <span className="font-mono text-[11px] text-[#986046]">{proj.enclaveName}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 border-t border-[#D8D1C5] bg-[#F2EEE7] p-5 shadow-lg">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex min-h-[48px] items-center justify-center border border-[#151514] bg-transparent px-4 py-3 text-xs font-medium text-[#151514]"
              >
                Explore Portfolio
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex min-h-[48px] items-center justify-center bg-[#151514] px-4 py-3 text-xs font-medium text-[#F2EEE7]"
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

      {/* 15. PERSISTENT MOBILE LUXURY ACTION BAR (Discreet & Elegant) */}
      <div
        aria-hidden={scrollProgress < 0.06 || mobileMenuOpen}
        className={`fixed bottom-4 left-4 right-4 z-40 transition-all duration-300 md:hidden ${
          scrollProgress > 0.06 && !mobileMenuOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-8 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border border-[#D8D1C5]/80 bg-[#151514]/94 px-4 py-2.5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col min-w-0">
            <span className="truncate font-serif text-sm font-medium text-[#F2EEE7]">
              Varendra &amp; Co.
            </span>
            <span className="font-mono text-[9px] tracking-wider text-[#B5A07D] uppercase">
              Dhaka Salon Desk
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/contact?intent=book-viewing"
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 border border-[#986046] bg-[#986046] px-3.5 py-2 font-mono text-[10px] tracking-wider text-[#F2EEE7] uppercase active:bg-[#7E4F39]"
            >
              <span>Briefing</span>
              <ArchitecturalIcon name="arrow-up-right" size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quiet Institutional Footer with Bangladesh Localization & BDT Controls */}
      <footer className="border-t border-[#D8D1C5] bg-[#E8E2D8]/50 text-[#151514]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-6 py-14 sm:py-16 md:px-12 lg:py-20">
          {/* Bangladesh Localization & Currency Convention Bar */}
          <div className="mb-10 flex flex-col justify-between gap-4 border border-[#D8D1C5] bg-[#FAF7F2] p-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono font-semibold text-[#986046]">
                BANGLADESH LOCALIZATION & CURRENCY CONVENTION:
              </span>
              <span className="text-[#544E46]">
                1 Katha = 720 sq. ft. · 1 Crore = 100 Lakh BDT (৳)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="BDT Valuation Display Format"
                className="inline-flex border border-[#D8D1C5] bg-[#E8E2D8]/60 p-0.5 font-mono text-[11px]"
              >
                {(['CRORE', 'LAKH', 'SYMBOL'] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setBdtDisplayUnit(unit)}
                    className={`px-2.5 py-1 transition-colors cursor-pointer ${
                      bdtDisplayUnit === unit
                        ? 'bg-[#151514] text-[#F2EEE7]'
                        : 'text-[#736B63] hover:text-[#151514]'
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
                className="border border-[#D8D1C5] bg-[#FAF7F2] px-3 py-1 font-mono text-[11px] font-medium text-[#151514] hover:border-[#986046] cursor-pointer"
              >
                {languageMode === 'EN'
                  ? 'Language: English (Switch to বাংলা)'
                  : 'ভাষা: বাংলা (Switch to English)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:gap-12 border-b border-[#D8D1C5] pb-12 lg:grid-cols-12">
            {/* Brand & Manifesto Summary */}
            <div className="lg:col-span-5">
              <p className="font-serif text-2xl font-medium tracking-tight text-[#151514]">
                {DEVELOPER_PROFILE.brandName}{' '}
                <span className="font-serif text-base text-[#8C827A]">
                  · বরেন্দ্র অ্যান্ড কোং
                </span>
              </p>
              <p className="mt-2 font-mono text-xs text-[#986046]">
                {DEVELOPER_PROFILE.monographEdition}
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#544E46]">
                {DEVELOPER_PROFILE.manifestoLead}
              </p>
              <p className="mt-4 font-mono text-xs text-[#736B63]">
                {DEVELOPER_PROFILE.headquarters}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#986046]">
                <span>Direct Salon Desk (Demo): +880 1711-000000</span>
                <span>·</span>
                <span>WhatsApp Concierge Ready</span>
              </div>
            </div>

            {/* Monographs Index */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold tracking-wide text-[#151514]">
                Architectural Monographs (Concept Portfolio)
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#544E46]">
                {PROJECTS_DATA.map((proj) => (
                  <li key={proj.id}>
                    <Link
                      to={`/projects/${proj.slug}`}
                      data-cursor="explore"
                      className="group inline-flex min-h-[36px] flex-wrap items-baseline gap-x-2 py-1 transition-colors hover:text-[#986046]"
                    >
                      <span className="font-mono text-xs text-[#8C827A] tabular-nums">
                        {proj.catalogNumber.replace('MONOGRAPH ', '')}
                      </span>
                      <span className="font-serif text-lg text-[#151514] group-hover:text-[#986046]">
                        {proj.title}
                      </span>
                      <span className="text-xs text-[#8C827A]">· {proj.enclaveName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation & Salon Hours */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold tracking-wide text-[#151514]">
                Index & Private Salon
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[#544E46]">
                <li>
                  <Link
                    to="/projects"
                    className="inline-flex min-h-[36px] items-center hover:text-[#986046] transition-colors"
                  >
                    Portfolio Archive
                  </Link>
                </li>
                <li>
                  <Link
                    to="/locations"
                    className="inline-flex min-h-[36px] items-center hover:text-[#986046] transition-colors"
                  >
                    Dhaka Enclave Studies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="inline-flex min-h-[36px] items-center hover:text-[#986046] transition-colors"
                  >
                    Practice & Craft Standards
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-[36px] items-center hover:text-[#986046] transition-colors"
                  >
                    Request Private Briefing
                  </Link>
                </li>
              </ul>
              <div className="mt-6 border-t border-[#D8D1C5] pt-4 text-xs text-[#736B63]">
                <p className="font-medium text-[#151514]">By Private Appointment</p>
                <p className="mt-1 font-mono tabular-nums">
                  Saturday – Thursday · 10:00 – 19:00 BST (UTC+6)
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Demo Disclaimer */}
          <div className="mt-8 flex flex-col justify-between gap-4 text-xs text-[#736B63] lg:flex-row lg:items-center">
            <p className="max-w-3xl leading-relaxed">{GLOBAL_DEMO_NOTICE}</p>
            <p className="shrink-0 font-mono text-[11px] text-[#8C827A] tabular-nums">
              © {new Date().getFullYear()} {DEVELOPER_PROFILE.brandName} · Concept Architecture
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
