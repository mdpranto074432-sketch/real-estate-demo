import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  GLOBAL_DEMO_NOTICE,
  PROJECTS_DATA,
} from '../data/mockRealEstateData';
import {
  EnclaveSlug,
  ProjectMonograph,
  ProjectStatus,
  PropertyUnit,
} from '../types/realEstate';
import { useEditorialEntrance } from '../utils/animation';
import { usePageMetadata } from '../utils/metadata';
import { ArchitecturalIcon } from '../components/ui/ArchitecturalIcon';
import { ArchitecturalTooltip } from '../components/ui/ArchitecturalTooltip';
import {
  ActionButton,
  ArchitecturalStatusText,
  EditorialMetaLine,
  SegmentedFilter,
} from '../components/ui/Primitives';
import { EmptyFilterState } from '../components/ui/FeedbackStates';
import {
  getProjectUnitMetrics,
  ProjectMonographCard,
} from '../components/projects/ProjectMonographCard';
import {
  formatBdtValuation,
  useBangladeshLocalization,
} from '../utils/bangladeshLocalization';

type BedroomFilter = 'all' | '2-3' | '4' | '5+';
type SizeFilter = 'all' | 'under-4500' | '4500-6500' | 'over-6500';
type PriceFilter = 'all' | 'under-25' | '25-35' | 'over-35' | 'on-request';
type HandoverFilter = 'all' | '2026' | '2027' | '2028-2029';
type SortOption =
  | 'featured'
  | 'newest'
  | 'location'
  | 'price-asc'
  | 'price-desc'
  | 'status';

export const ProjectsPage: React.FC = () => {
  const { bdtDisplayUnit, languageMode } = useBangladeshLocalization();

  usePageMetadata({
    title: 'Portfolio Archive & Property Discovery',
    description:
      'Discover Varendra & Co. architectural residences across Gulshan, Baridhara, Banani, Dhanmondi, Bashundhara, and Jolshiri in Dhaka. Concept portfolio demonstration.',
    canonicalPath: '/projects',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Varendra & Co. Dhaka Architectural Portfolio (Concept Demo)',
      itemListElement: PROJECTS_DATA.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.title,
        url: `${typeof window !== 'undefined' ? window.location.origin : 'https://varendra.co'}/projects/${p.slug}`,
      })),
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Multi-Dimensional Discovery Filter States
  const [enclaveFilter, setEnclaveFilter] = useState<'all' | EnclaveSlug>(
    (searchParams.get('enclave') as EnclaveSlug) || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [typologyFilter, setTypologyFilter] = useState<
    'all' | PropertyUnit['residenceType']
  >('all');
  const [bedroomFilter, setBedroomFilter] = useState<BedroomFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [handoverFilter, setHandoverFilter] = useState<HandoverFilter>('all');

  // 2. Sorting & Presentation Mode States
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'editorial' | 'gallery' | 'index'>(
    'editorial'
  );

  // 3. Mobile Filter Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Lock body scroll and listen for Escape key when mobile filter drawer is open
  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileDrawerOpen]);

  // Helper to check if a project matches all active discovery filters
  const matchesProjectFilters = (project: ProjectMonograph): boolean => {
    const metrics = getProjectUnitMetrics(project);

    // Location / Enclave
    if (enclaveFilter !== 'all' && project.enclaveSlug !== enclaveFilter) {
      return false;
    }

    // Project Status
    if (statusFilter !== 'all' && project.status !== statusFilter) {
      return false;
    }

    // Property Typology
    if (
      typologyFilter !== 'all' &&
      !project.units.some((u) => u.residenceType === typologyFilter)
    ) {
      return false;
    }

    // Bedrooms
    if (bedroomFilter !== 'all') {
      const hasMatch = project.units.some((u) => {
        if (bedroomFilter === '2-3') return u.bedrooms <= 3;
        if (bedroomFilter === '4') return u.bedrooms === 4;
        if (bedroomFilter === '5+') return u.bedrooms >= 5;
        return true;
      });
      if (!hasMatch) return false;
    }

    // Floor Plate Size (sq. ft.)
    if (sizeFilter !== 'all') {
      const hasSize = project.units.some((u) => {
        if (sizeFilter === 'under-4500') return u.areaSqFt < 4500;
        if (sizeFilter === '4500-6500')
          return u.areaSqFt >= 4500 && u.areaSqFt <= 6500;
        if (sizeFilter === 'over-6500') return u.areaSqFt > 6500;
        return true;
      });
      if (!hasSize) return false;
    }

    // Indicative Price Band (BDT Crore Demo)
    if (priceFilter !== 'all') {
      if (priceFilter === 'on-request') {
        const hasPOA = project.units.some(
          (u) =>
            u.indicativeValuationBDT.toLowerCase().includes('request') ||
            u.indicativeValuationBDT.toLowerCase().includes('consultation')
        );
        if (!hasPOA) return false;
      } else {
        const minCrore = metrics.minPriceCrore;
        if (minCrore === null) return false;
        if (priceFilter === 'under-25' && minCrore >= 25) return false;
        if (priceFilter === '25-35' && (minCrore < 25 || minCrore > 35))
          return false;
        if (priceFilter === 'over-35' && minCrore <= 35) return false;
      }
    }

    // Completion / Handover Horizon
    if (handoverFilter !== 'all') {
      if (
        handoverFilter === '2026' &&
        !project.completionYear.includes('2026')
      ) {
        return false;
      }
      if (
        handoverFilter === '2027' &&
        !project.completionYear.includes('2027')
      ) {
        return false;
      }
      if (
        handoverFilter === '2028-2029' &&
        !project.completionYear.includes('2028') &&
        !project.completionYear.includes('2029')
      ) {
        return false;
      }
    }

    return true;
  };

  // Filtered + Sorted Projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = PROJECTS_DATA.filter(matchesProjectFilters);

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'featured') {
        return a.catalogNumber.localeCompare(b.catalogNumber);
      }
      if (sortBy === 'newest') {
        return b.catalogNumber.localeCompare(a.catalogNumber);
      }
      if (sortBy === 'location') {
        return a.enclaveName.localeCompare(b.enclaveName);
      }
      if (sortBy === 'price-asc') {
        const priceA = getProjectUnitMetrics(a).minPriceCrore ?? 999;
        const priceB = getProjectUnitMetrics(b).minPriceCrore ?? 999;
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        const priceA = getProjectUnitMetrics(a).minPriceCrore ?? 999;
        const priceB = getProjectUnitMetrics(b).minPriceCrore ?? 999;
        return priceB - priceA;
      }
      if (sortBy === 'status') {
        const rank: Record<ProjectStatus, number> = {
          'Completed Monograph (Demo)': 1,
          'Interior Curation (Demo)': 2,
          'Structural Phase (Demo)': 3,
          'Architectural Concept': 4,
        };
        return rank[a.status] - rank[b.status];
      }
      return 0;
    });

    return sorted;
  }, [
    enclaveFilter,
    statusFilter,
    typologyFilter,
    bedroomFilter,
    sizeFilter,
    priceFilter,
    handoverFilter,
    sortBy,
  ]);

  // Count active filters
  const activeFilterCount = [
    enclaveFilter !== 'all',
    statusFilter !== 'all',
    typologyFilter !== 'all',
    bedroomFilter !== 'all',
    sizeFilter !== 'all',
    priceFilter !== 'all',
    handoverFilter !== 'all',
  ].filter(Boolean).length;

  const handleResetAllFilters = () => {
    setEnclaveFilter('all');
    setStatusFilter('all');
    setTypologyFilter('all');
    setBedroomFilter('all');
    setSizeFilter('all');
    setPriceFilter('all');
    setHandoverFilter('all');
    setSortBy('featured');
    setSearchParams({});
  };

  // Trigger subtle GSAP entrance animation whenever filtered set or view mode changes
  const animKey = `${enclaveFilter}-${statusFilter}-${typologyFilter}-${bedroomFilter}-${sizeFilter}-${priceFilter}-${handoverFilter}-${sortBy}-${viewMode}`;
  const containerRef = useEditorialEntrance<HTMLDivElement>(animKey);

  const selectControlClass =
    'mt-1.5 min-h-[44px] lg:min-h-[38px] w-full border border-[#D8D1C5] bg-[#FAF7F2] px-3 py-2 text-xs font-medium text-[#151514] transition-colors duration-150 hover:border-[#736B63] focus:border-[#986046] focus:outline-none cursor-pointer';

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F2EEE7]">
      {/* =====================================================================
          1. HERO / EDITORIAL INTRODUCTION WITH OVERSIZED SPATIAL WATERMARK
      ===================================================================== */}
      <section className="relative mx-auto max-w-[1360px] overflow-hidden px-6 pt-10 pb-10 md:px-12 lg:pt-16">
        {/* Oversized Background Architectural Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 right-6 select-none font-serif text-[140px] font-light leading-none text-[#E8E2D8]/60 sm:text-[220px] lg:right-12 lg:text-[280px]"
        >
          ARCHIVE
        </div>

        <div
          data-animate="editorial"
          className="relative z-10 border-b border-[#D8D1C5] pb-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <EditorialMetaLine
              items={[
                'ARCHITECTURAL PORTFOLIO & PROPERTY DISCOVERY',
                `${PROJECTS_DATA.length} COMMISSIONED MONOGRAPHS`,
                'DHAKA, BANGLADESH (CONCEPT DEMO)',
              ]}
            />
            <span className="font-mono text-xs text-[#986046] tabular-nums">
              1 RESIDENCE PER FLOOR · 100% NATURAL CROSS-VENTILATION
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-normal leading-[1.04] tracking-tight text-[#151514] text-balance sm:text-6xl lg:text-[72px]">
            Curated Residences & Spatial Monographs Across Dhaka
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#544E46]">
            Explore our portfolio of full-floor lakeside sanctuaries, diplomatic
            limestone residences, and low-rise courtyard villas. Filter by Dhaka
            enclave, architectural typology, floor plate volume, or handover
            horizon.
          </p>
        </div>

        {/* =====================================================================
            2. DESKTOP ARCHITECTURAL FILTER CONSOLE & SORTING BAR
        ===================================================================== */}
        <div className="mt-8 hidden lg:block">
          {/* Primary Enclave Segmented Filter + View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SegmentedFilter
              ariaLabel="Filter by Dhaka Enclave"
              activeValue={enclaveFilter}
              onChange={(val) => {
                setEnclaveFilter(val);
                if (val === 'all') {
                  setSearchParams({});
                } else {
                  setSearchParams({ enclave: val });
                }
              }}
              options={[
                { value: 'all', label: 'All Dhaka Enclaves', count: PROJECTS_DATA.length },
                { value: 'gulshan-north', label: 'Gulshan North' },
                { value: 'baridhara-diplomatic', label: 'Baridhara' },
                { value: 'banani-canopy', label: 'Banani' },
                { value: 'dhanmondi-lakefront', label: 'Dhanmondi' },
                { value: 'bashundhara-riverview', label: 'Bashundhara' },
                { value: 'jolshiri-watershed', label: 'Jolshiri' },
              ]}
            />

            <SegmentedFilter
              ariaLabel="Presentation Layout Mode"
              activeValue={viewMode}
              onChange={setViewMode}
              options={[
                { value: 'editorial', label: 'Editorial Plates' },
                { value: 'gallery', label: '2-Col Gallery' },
                { value: 'index', label: 'Tabular Schedule' },
              ]}
            />
          </div>

          {/* 6-Column Architectural Specification Filter Matrix */}
          <div className="mt-4 grid grid-cols-6 gap-4 border border-[#D6CEBE] bg-[#EBE6DF]/45 p-5">
            {/* Project Status */}
            <div>
              <label
                htmlFor="filter-status"
                className="block font-mono text-[10px] tracking-wider text-[#57534E]"
              >
                01. COMMISSION PHASE
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'all' | ProjectStatus)
                }
                className={selectControlClass}
              >
                <option value="all">All Phases</option>
                <option value="Completed Monograph (Demo)">
                  Completed Monograph
                </option>
                <option value="Interior Curation (Demo)">
                  Interior Curation
                </option>
                <option value="Structural Phase (Demo)">
                  Structural Phase
                </option>
                <option value="Architectural Concept">
                  Architectural Concept
                </option>
              </select>
            </div>

            {/* Residence Typology */}
            <div>
              <label
                htmlFor="filter-typology"
                className="block font-mono text-[10px] tracking-wider text-[#57534E]"
              >
                02. RESIDENCE TYPOLOGY
              </label>
              <select
                id="filter-typology"
                value={typologyFilter}
                onChange={(e) =>
                  setTypologyFilter(
                    e.target.value as 'all' | PropertyUnit['residenceType']
                  )
                }
                className={selectControlClass}
              >
                <option value="all">All Typologies</option>
                <option value="Simplex Sanctuary">Simplex Sanctuary</option>
                <option value="Full-Floor Garden Residence">
                  Full-Floor Garden Residence
                </option>
                <option value="Duplex Sky Villa">Duplex Sky Villa</option>
                <option value="Triplex Crown Penthouse">
                  Triplex Crown Penthouse
                </option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label
                htmlFor="filter-bedrooms"
                className="block font-mono text-[10px] tracking-wider text-[#57534E]"
              >
                03. SLEEPING CHAMBERS
              </label>
              <select
                id="filter-bedrooms"
                value={bedroomFilter}
                onChange={(e) =>
                  setBedroomFilter(e.target.value as BedroomFilter)
                }
                className={selectControlClass}
              >
                <option value="all">Any Bedrooms</option>
                <option value="2-3">2 – 3 Bedrooms</option>
                <option value="4">4 Bedrooms (Full-Floor)</option>
                <option value="5+">5+ Bedrooms (Duplex/Crown)</option>
              </select>
            </div>

            {/* Floor Plate Size */}
            <div>
              <label
                htmlFor="filter-size"
                className="block font-mono text-[10px] tracking-wider text-[#57534E]"
              >
                04. FLOOR PLATE VOLUME
              </label>
              <select
                id="filter-size"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as SizeFilter)}
                className={selectControlClass}
              >
                <option value="all">All Sizes (sq. ft.)</option>
                <option value="under-4500">Under 4,500 sq. ft.</option>
                <option value="4500-6500">4,500 – 6,500 sq. ft.</option>
                <option value="over-6500">Over 6,500 sq. ft.</option>
              </select>
            </div>

            {/* Indicative Valuation Band */}
            <div>
              <label
                htmlFor="filter-price"
                className="block font-mono text-[10px] tracking-wider text-[#57534E]"
              >
                05. INDICATIVE VALUATION
              </label>
              <select
                id="filter-price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                className={selectControlClass}
              >
                <option value="all">All Valuation Bands</option>
                <option value="under-25">Under BDT 25 Crore (Demo)</option>
                <option value="25-35">BDT 25 – 35 Crore (Demo)</option>
                <option value="over-35">Over BDT 35 Crore (Demo)</option>
                <option value="on-request">Price on Request / Crown</option>
              </select>
            </div>

            {/* Handover Horizon */}
            <div>
              <label
                htmlFor="filter-handover"
                className="block font-mono text-[10px] tracking-wider text-[#57534E]"
              >
                06. HANDOVER HORIZON
              </label>
              <select
                id="filter-handover"
                value={handoverFilter}
                onChange={(e) =>
                  setHandoverFilter(e.target.value as HandoverFilter)
                }
                className={selectControlClass}
              >
                <option value="all">Any Horizon</option>
                <option value="2026">Handover Ready (2026 Demo)</option>
                <option value="2027">2027 Target (Demo)</option>
                <option value="2028-2029">2028 – 2029 Horizon (Demo)</option>
              </select>
            </div>
          </div>

          {/* Active Results Status Bar + Sorting Dropdown */}
          <div className="mt-4 flex items-center justify-between border-b border-[#D6CEBE] pb-4 text-xs">
            <div aria-live="polite" className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[#1C1917] tabular-nums">
                SHOWING {filteredAndSortedProjects.length} OF{' '}
                {PROJECTS_DATA.length} MONOGRAPHS
              </span>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="inline-flex items-center gap-1 border-b border-[#78350F] font-mono text-[11px] font-medium text-[#78350F] hover:text-[#1C1917] cursor-pointer"
                >
                  <ArchitecturalIcon name="close" size={11} />
                  <span>Reset Active Filters ({activeFilterCount})</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="desktop-sort"
                className="font-mono text-[11px] text-[#57534E]"
              >
                SORT ARCHIVE BY:
              </label>
              <select
                id="desktop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-1.5 font-mono text-xs text-[#1C1917] focus:border-[#78350F] focus:outline-none cursor-pointer"
              >
                <option value="featured">Curatorial Order (Featured)</option>
                <option value="newest">Newest Monograph Release</option>
                <option value="location">Enclave Alphabetical</option>
                <option value="price-asc">Valuation: Ascending (Demo)</option>
                <option value="price-desc">Valuation: Descending (Demo)</option>
                <option value="status">Completion Readiness</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. STICKY MOBILE FILTER & SORT BAR (<1024px)
          Respects the <15% mobile viewport height budget and 44px touch hitboxes.
      ===================================================================== */}
      <div className="sticky top-14 sm:top-16 z-30 border-b border-[#D6CEBE] bg-[#FBF9F5]/95 px-5 sm:px-6 py-2.5 backdrop-blur-xs lg:hidden">
        <div className="flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#1C1917] bg-[#1C1917] px-4 py-2 text-xs font-medium text-[#FBF9F5] whitespace-nowrap cursor-pointer"
          >
            <ArchitecturalIcon name="filter" size={14} />
            <span>Filter Dossiers</span>
            {activeFilterCount > 0 && (
              <span className="font-mono text-[11px] text-[#D6CEBE] tabular-nums">
                ({activeFilterCount})
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="mobile-sort" className="sr-only">
              Sort Projects
            </label>
            <select
              id="mobile-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="min-h-[44px] border border-[#D6CEBE] bg-[#FBF9F5] px-2.5 py-1.5 font-mono text-xs text-[#1C1917]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="location">Sort: Enclave</option>
              <option value="price-asc">Price: Low–High</option>
              <option value="price-desc">Price: High–Low</option>
              <option value="status">Sort: Readiness</option>
            </select>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetAllFilters}
                aria-label="Reset all filters"
                className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-[#D6CEBE] text-[#78350F]"
              >
                <ArchitecturalIcon name="close" size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MOBILE FILTER DRAWER DIALOG
      ===================================================================== */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter Architectural Monographs"
          className="fixed inset-0 z-50 flex flex-col bg-[#FBF9F5] lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-[#D6CEBE] px-6 py-4">
            <div>
              <p className="font-mono text-[10px] text-[#78350F]">
                PORTFOLIO DISCOVERY PARAMETERS
              </p>
              <h2 className="font-serif text-2xl text-[#1C1917]">
                Filter Monographs ({filteredAndSortedProjects.length} Matches)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close filter drawer"
              className="inline-flex h-10 w-10 items-center justify-center border border-[#D6CEBE] text-[#1C1917]"
            >
              <ArchitecturalIcon name="close" size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <div>
              <label
                htmlFor="m-enclave"
                className="block font-mono text-xs text-[#57534E]"
              >
                01. DHAKA ENCLAVE
              </label>
              <select
                id="m-enclave"
                value={enclaveFilter}
                onChange={(e) =>
                  setEnclaveFilter(e.target.value as 'all' | EnclaveSlug)
                }
                className={selectControlClass}
              >
                <option value="all">All Dhaka Enclaves</option>
                <option value="gulshan-north">Gulshan North Lakefront</option>
                <option value="baridhara-diplomatic">
                  Baridhara Diplomatic Zone
                </option>
                <option value="banani-canopy">Banani Old DOHS & Lake</option>
                <option value="dhanmondi-lakefront">
                  Dhanmondi Heritage Lakefront
                </option>
                <option value="bashundhara-riverview">
                  Bashundhara Southern Greens
                </option>
                <option value="jolshiri-watershed">
                  Jolshiri Abashon Watershed
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="m-status"
                className="block font-mono text-xs text-[#57534E]"
              >
                02. COMMISSION PHASE
              </label>
              <select
                id="m-status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'all' | ProjectStatus)
                }
                className={selectControlClass}
              >
                <option value="all">All Phases</option>
                <option value="Completed Monograph (Demo)">
                  Completed Monograph (Demo)
                </option>
                <option value="Interior Curation (Demo)">
                  Interior Curation (Demo)
                </option>
                <option value="Structural Phase (Demo)">
                  Structural Phase (Demo)
                </option>
                <option value="Architectural Concept">
                  Architectural Concept
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="m-typology"
                className="block font-mono text-xs text-[#57534E]"
              >
                03. RESIDENCE TYPOLOGY
              </label>
              <select
                id="m-typology"
                value={typologyFilter}
                onChange={(e) =>
                  setTypologyFilter(
                    e.target.value as 'all' | PropertyUnit['residenceType']
                  )
                }
                className={selectControlClass}
              >
                <option value="all">All Typologies</option>
                <option value="Simplex Sanctuary">Simplex Sanctuary</option>
                <option value="Full-Floor Garden Residence">
                  Full-Floor Garden Residence
                </option>
                <option value="Duplex Sky Villa">Duplex Sky Villa</option>
                <option value="Triplex Crown Penthouse">
                  Triplex Crown Penthouse
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="m-bedrooms"
                className="block font-mono text-xs text-[#57534E]"
              >
                04. SLEEPING CHAMBERS
              </label>
              <select
                id="m-bedrooms"
                value={bedroomFilter}
                onChange={(e) =>
                  setBedroomFilter(e.target.value as BedroomFilter)
                }
                className={selectControlClass}
              >
                <option value="all">Any Bedrooms</option>
                <option value="2-3">2 – 3 Bedrooms</option>
                <option value="4">4 Bedrooms (Full-Floor)</option>
                <option value="5+">5+ Bedrooms (Duplex/Crown)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="m-size"
                className="block font-mono text-xs text-[#57534E]"
              >
                05. FLOOR PLATE VOLUME
              </label>
              <select
                id="m-size"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as SizeFilter)}
                className={selectControlClass}
              >
                <option value="all">All Sizes (sq. ft.)</option>
                <option value="under-4500">Under 4,500 sq. ft.</option>
                <option value="4500-6500">4,500 – 6,500 sq. ft.</option>
                <option value="over-6500">Over 6,500 sq. ft.</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="m-price"
                className="block font-mono text-xs text-[#57534E]"
              >
                06. INDICATIVE VALUATION (DEMO)
              </label>
              <select
                id="m-price"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                className={selectControlClass}
              >
                <option value="all">All Valuation Bands</option>
                <option value="under-25">Under BDT 25 Crore</option>
                <option value="25-35">BDT 25 – 35 Crore</option>
                <option value="over-35">Over BDT 35 Crore</option>
                <option value="on-request">Price on Request / Crown</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="m-handover"
                className="block font-mono text-xs text-[#57534E]"
              >
                07. HANDOVER HORIZON
              </label>
              <select
                id="m-handover"
                value={handoverFilter}
                onChange={(e) =>
                  setHandoverFilter(e.target.value as HandoverFilter)
                }
                className={selectControlClass}
              >
                <option value="all">Any Horizon</option>
                <option value="2026">Handover Ready (2026 Demo)</option>
                <option value="2027">2027 Target (Demo)</option>
                <option value="2028-2029">2028 – 2029 Horizon (Demo)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-[#D6CEBE] bg-[#EBE6DF]/60 px-6 py-4">
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="border border-[#1C1917] px-4 py-2.5 text-xs font-medium text-[#1C1917]"
            >
              Reset All ({activeFilterCount})
            </button>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex-1 bg-[#1C1917] px-5 py-2.5 text-xs font-medium text-[#FBF9F5]"
            >
              View {filteredAndSortedProjects.length} Monographs
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. PROPERTY GRID / EDITORIAL LIST / TABULAR SCHEDULE
      ===================================================================== */}
      <section className="mx-auto max-w-[1360px] px-6 py-12 md:px-12 lg:py-16">
        {filteredAndSortedProjects.length === 0 ? (
          <EmptyFilterState
            title="No Architectural Monographs Match Your Filter Combination"
            description="Your selected combination of enclave, floor plate volume, bedroom configuration, or handover horizon returned zero matches. Reset filters to inspect all six Dhaka commissions."
            onReset={handleResetAllFilters}
            resetLabel="Reset All Discovery Filters"
          />
        ) : viewMode === 'editorial' ? (
          <div data-animate="editorial" className="space-y-20">
            {filteredAndSortedProjects.map((project) => (
              <ProjectMonographCard
                key={project.id}
                project={project}
                featuredLayout
              />
            ))}
          </div>
        ) : viewMode === 'gallery' ? (
          <div
            data-animate="editorial"
            className="grid grid-cols-1 gap-10 md:grid-cols-2"
          >
            {filteredAndSortedProjects.map((project) => (
              <ProjectMonographCard
                key={project.id}
                project={project}
                featuredLayout={false}
              />
            ))}
          </div>
        ) : (
          /* Tabular Archival Index View */
          <div
            data-animate="editorial"
            className="overflow-x-auto border border-[#D8D1C5] bg-[#FAF7F2]"
          >
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#151514] bg-[#E8E2D8]/70 text-xs font-semibold text-[#151514]">
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Catalogue</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Monograph Title</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Dhaka Enclave</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Property Type</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Area (sq. ft.)</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Beds / Baths</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Floor & Parking</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Handover (Demo)</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider">Valuation (BDT)</th>
                  <th className="py-4 px-4 font-mono text-[11px] tracking-wider text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D1C5]">
                {filteredAndSortedProjects.map((project) => {
                  const metrics = getProjectUnitMetrics(project);
                  const localizedPrice =
                    metrics.minPriceCrore !== null
                      ? formatBdtValuation(
                          `${metrics.minPriceCrore} Crore`,
                          bdtDisplayUnit,
                          languageMode
                        )
                      : 'Price on Request (Demo)';
                  return (
                    <tr
                      key={project.id}
                      className="transition-colors hover:bg-[#E8E2D8]/40"
                    >
                      <td className="py-4 px-4 font-mono text-xs text-[#986046] tabular-nums">
                        {project.catalogNumber.replace('MONOGRAPH ', '')}
                      </td>
                      <td className="py-4 px-4 font-serif text-lg font-medium text-[#151514]">
                        <Link
                          to={`/projects/${project.slug}`}
                          className="transition-colors hover:text-[#986046]"
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-xs text-[#544E46]">
                        {project.enclaveName}
                      </td>
                      <td className="py-4 px-4 text-xs text-[#544E46]">
                        {metrics.propertyTypeLabel}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#151514] tabular-nums">
                        {metrics.areaRangeLabel}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#736B63] tabular-nums">
                        {metrics.bedroomsLabel} · {metrics.bathroomsLabel.split('+')[0]}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#736B63] tabular-nums">
                        {project.stories}F · {metrics.parkingLabel}
                      </td>
                      <td className="py-4 px-4">
                        <ArchitecturalStatusText
                          status={project.completionYear}
                          tone={
                            project.status === 'Completed Monograph (Demo)'
                              ? 'botanical'
                              : 'bronze'
                          }
                        />
                      </td>
                      <td className="py-4 px-4 font-mono text-xs font-semibold text-[#986046] tabular-nums">
                        {localizedPrice}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/projects/${project.slug}`}
                          className="font-mono text-xs font-medium text-[#151514] underline hover:text-[#986046]"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================================================
          9. TRUST & ARCHITECTURAL METADATA GLOSSARY
          Makes project metadata easy to understand without fake approvals.
      ===================================================================== */}
      <section className="border-t border-[#D6CEBE] bg-[#EBE6DF]/45 py-16 lg:py-20">
        <div className="mx-auto max-w-[1360px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs text-[#78350F]">
                ARCHITECTURAL METADATA & TRANSPARENCY GUIDE
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#1C1917]">
                How to Read Our Monograph Specifications
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-[#44403C]">
                We publish clear spatial metrics so prospective principals and
                their architectural advisors can evaluate volume and engineering
                without ambiguity.
              </p>
              <p className="mt-4 font-mono text-[11px] text-[#78716C]">
                {GLOBAL_DEMO_NOTICE}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-7">
              <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-5">
                <p className="font-mono text-[11px] text-[#78350F]">
                  01. GROSS VS. NET PLATE
                </p>
                <h3 className="mt-1 font-serif text-lg font-medium text-[#1C1917]">
                  Full-Floor Area
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                  Gross area includes the private elevator lobby, internal
                  suite, and cantilevered monsoon verandas. Net internal area
                  is itemized on every floor plate schematic.
                </p>
              </div>

              <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-5">
                <p className="font-mono text-[11px] text-[#78350F]">
                  02. LAND EXTENT (KATHA)
                </p>
                <h3 className="mt-1 font-serif text-lg font-medium text-[#1C1917]">
                  Low-Density Ratio
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                  In Dhaka,{' '}
                  <ArchitecturalTooltip
                    term="1 Katha = 720 sq. ft."
                    definition="Standard Bengal land area unit."
                    benchmark="20 Kathas = 14,400 sq. ft."
                  />{' '}
                  Our commissions preserve up to 45% of the ground footprint as
                  permeable botanical courts.
                </p>
              </div>

              <div className="border border-[#D6CEBE] bg-[#FBF9F5] p-5">
                <p className="font-mono text-[11px] text-[#78350F]">
                  03. ALLOCATION STATUS
                </p>
                <h3 className="mt-1 font-serif text-lg font-medium text-[#1C1917]">
                  Private Consultation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#57534E]">
                  All valuations and availability statuses shown are concept
                  demonstration figures. Formal dossiers are shared during
                  private appointments.
                </p>
                <div className="mt-4">
                  <ActionButton to="/contact" variant="quiet">
                    Schedule Salon Briefing →
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
