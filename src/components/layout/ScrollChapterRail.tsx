import React, { useEffect, useState } from 'react';
import { prefersReducedMotion, useScrollProgress } from '../../utils/animation';

export interface ScrollChapterItem {
  id: string;
  number: string;
  label: string;
  subtitle: string;
}

export const HOMEPAGE_SCROLL_CHAPTERS: ScrollChapterItem[] = [
  { id: 'chapter-city', number: '01', label: 'Architecture', subtitle: 'Light, Shade & Monsoon' },
  { id: 'scroll-anatomy', number: '02', label: 'Anatomy', subtitle: 'Tectonic Structure' },
  { id: 'signature-projects', number: '03', label: 'Portfolio', subtitle: 'Commissioned Works' },
  { id: 'vertical-floor-journey', number: '04', label: 'Elevation', subtitle: 'Vertical Ascent' },
  { id: 'dhaka-enclaves', number: '05', label: 'Enclaves', subtitle: 'Dhaka Cartography' },
  { id: 'featured-residence', number: '06', label: 'Residence', subtitle: 'Spatial Floor Plan' },
  { id: 'architecture-tectonics', number: '07', label: 'Materials', subtitle: 'Stone, Timber & Glass' },
  { id: 'private-consultation', number: '08', label: 'Salon', subtitle: 'Private Briefing' },
];

export const ScrollChapterRail: React.FC = () => {
  const scrollProgress = useScrollProgress();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
      aria-label="Editorial Chapter Index"
      className="fixed right-6 bottom-6 z-40 hidden xl:flex flex-col items-end select-none"
    >
      {/* Expanded Monograph Index */}
      {expanded && (
        <div className="mb-2.5 w-60 border border-[#D6CEBE]/25 bg-[#141210]/88 p-4 text-[#FBF9F5] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#FBF9F5]/10 pb-2 font-mono text-[9px] tracking-[0.2em] text-[#E7C396] uppercase">
            <span>Monograph Index</span>
            <span>0{activeChapterIndex + 1} / 08</span>
          </div>
          <ul className="mt-2 space-y-0.5">
            {HOMEPAGE_SCROLL_CHAPTERS.map((chap, idx) => {
              const isCurrent = idx === activeChapterIndex;
              return (
                <li key={chap.id}>
                  <button
                    type="button"
                    onClick={() => handleJumpToChapter(chap.id)}
                    className={`flex w-full items-center justify-between px-2 py-1.5 text-left transition-colors cursor-pointer ${
                      isCurrent
                        ? 'text-[#FBF9F5]'
                        : 'text-[#A8A29E] hover:text-[#FBF9F5]'
                    }`}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-[9px] text-[#C28E5C]">
                        {chap.number}
                      </span>
                      <span className="font-serif text-xs tracking-wide">
                        {chap.label}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="h-1 w-1 rounded-full bg-[#E7C396]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Subtle Editorial Chapter Indicator (No heavy box or software velocity readout) */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="group flex items-center gap-3 border border-[#FBF9F5]/15 bg-[#12151B]/55 px-3.5 py-2 text-left text-[#FBF9F5] backdrop-blur-md transition-all duration-300 hover:border-[#FBF9F5]/35 hover:bg-[#12151B]/80 cursor-pointer"
      >
        <span className="font-mono text-[9px] tracking-[0.22em] text-[#E7C396]">
          {currentChapter.number} / 08
        </span>
        <span className="h-2.5 w-[1px] bg-[#FBF9F5]/20" />
        <span className="font-serif text-xs tracking-wide text-[#F5F2EB]/90">
          {currentChapter.label}
        </span>
        <div className="ml-1 h-[1px] w-8 overflow-hidden bg-[#FBF9F5]/20">
          <div
            className="h-full bg-[#E7C396] transition-all duration-150"
            style={{ width: `${Math.max(10, Math.round(scrollProgress * 100))}%` }}
          />
        </div>
      </button>
    </aside>
  );
};
