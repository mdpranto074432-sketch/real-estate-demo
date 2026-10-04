import React, { useEffect, useState } from 'react';
import { prefersReducedMotion, useScrollProgress } from '../../utils/animation';

export interface ScrollChapterItem {
  id: string;
  number: string;
  label: string;
  subtitle: string;
}

export const HOMEPAGE_SCROLL_CHAPTERS: ScrollChapterItem[] = [
  { id: 'chapter-city', number: '01', label: 'THE CITY', subtitle: 'Dhaka Monsoon Sky & 3D Landmark' },
  { id: 'scroll-anatomy', number: '02', label: 'THE ANATOMY', subtitle: 'Exploded Building Disassembly' },
  { id: 'signature-projects', number: '03', label: 'THE LANDMARKS', subtitle: 'Horizontal Gallery Journey' },
  { id: 'vertical-floor-journey', number: '04', label: 'THE FLOORS', subtitle: 'Vertical Elevation Ascent' },
  { id: 'dhaka-enclaves', number: '05', label: 'THE LOCATION', subtitle: '3D-to-2D Cartographic Zoom' },
  { id: 'featured-residence', number: '06', label: 'THE RESIDENCE', subtitle: '2D-to-3D Floor Extrusion' },
  { id: 'architecture-tectonics', number: '07', label: 'THE MATERIALS', subtitle: 'Tactile Surface & Diurnal Light' },
  { id: 'private-consultation', number: '08', label: 'THE INVITATION', subtitle: 'Trust Vault & Private Salon' },
];

export const ScrollChapterRail: React.FC = () => {
  const scrollProgress = useScrollProgress();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'DOWN' | 'UP'>('DOWN');
  const [velocityKmh, setVelocityKmh] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let decayTimer: number | null = null;

    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY;
      const dt = Math.max(16, now - lastTime);

      if (Math.abs(deltaY) > 2) {
        setScrollDirection(deltaY > 0 ? 'DOWN' : 'UP');
      }

      const rawVel = Math.min(99, Math.round((Math.abs(deltaY) / dt) * 18));
      setVelocityKmh(rawVel);

      lastScrollY = currentY;
      lastTime = now;

      // Determine active chapter by viewport center
      const viewportCenter = window.innerHeight * 0.42;
      let matchedIdx = 0;
      HOMEPAGE_SCROLL_CHAPTERS.forEach((chap, idx) => {
        const el = document.getElementById(chap.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter) {
            matchedIdx = idx;
          }
        }
      });
      setActiveChapterIndex(matchedIdx);

      if (decayTimer) window.clearTimeout(decayTimer);
      decayTimer = window.setTimeout(() => {
        setVelocityKmh(0);
      }, 140);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (decayTimer) window.clearTimeout(decayTimer);
    };
  }, []);

  const currentChapter =
    HOMEPAGE_SCROLL_CHAPTERS[activeChapterIndex] || HOMEPAGE_SCROLL_CHAPTERS[0];

  const handleJumpToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      setExpanded(false);
    }
  };

  return (
    <aside
      aria-label="Architectural Scroll Chapter Telemetry"
      className="fixed right-4 bottom-6 z-40 hidden xl:flex flex-col items-end select-none"
    >
      {/* Expanded Chapter Index Drawer */}
      {expanded && (
        <div className="mb-3 w-72 border border-[#D6CEBE]/40 bg-[#141210]/95 p-4 text-[#FBF9F5] shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#FBF9F5]/15 pb-2.5 font-mono text-[10px] text-[#C28E5C]">
            <span>8-CHAPTER CAMERA JOURNEY</span>
            <span>{Math.round(scrollProgress * 100)}% TRAVERSED</span>
          </div>
          <ul className="mt-2.5 space-y-1">
            {HOMEPAGE_SCROLL_CHAPTERS.map((chap, idx) => {
              const isCurrent = idx === activeChapterIndex;
              return (
                <li key={chap.id}>
                  <button
                    type="button"
                    onClick={() => handleJumpToChapter(chap.id)}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 text-left transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#C28E5C]/20 text-[#FBF9F5]'
                        : 'text-[#A8A29E] hover:bg-[#FBF9F5]/5 hover:text-[#FBF9F5]'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[10px] text-[#C28E5C] mr-2">
                        {chap.number}
                      </span>
                      <span className="font-mono text-[11px] font-medium tracking-wider">
                        {chap.label}
                      </span>
                      <p className="text-[10px] text-[#A8A29E] pl-5">
                        {chap.subtitle}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C28E5C]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Compact Floating Architectural Chapter & Velocity Pill */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="group flex items-center gap-3.5 border border-[#D6CEBE]/40 bg-[#141210]/90 px-4 py-2.5 text-left text-[#FBF9F5] shadow-xl backdrop-blur-md transition-colors hover:border-[#C28E5C] cursor-pointer"
      >
        {/* Vertical Progress Gauge */}
        <div className="relative h-7 w-1 bg-[#FBF9F5]/15 overflow-hidden">
          <div
            className="w-full bg-[#C28E5C] transition-all duration-150 origin-top"
            style={{ height: `${Math.max(8, Math.round(scrollProgress * 100))}%` }}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#C28E5C]">
            <span>
              CHAPTER {currentChapter.number} / 08 · {currentChapter.label}
            </span>
            <span className="text-[#A8A29E]">
              {scrollDirection === 'DOWN' ? '↓ DESCEND' : '↑ ASCEND'}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-[#D6CEBE]">
            <span>{currentChapter.subtitle}</span>
            <span className="text-[#A8A29E] tabular-nums">
              {velocityKmh > 0 ? `VEL ${velocityKmh}` : 'STILL'}
            </span>
          </div>
        </div>
      </button>
    </aside>
  );
};
