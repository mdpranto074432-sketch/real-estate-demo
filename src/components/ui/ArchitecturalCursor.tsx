import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { hasFinePointer, prefersReducedMotion } from '../../utils/animation';

/**
 * 13. CONTEXTUAL ARCHITECTURAL CURSOR SYSTEM
 * Supports rich contextual states:
 * - VIEW, EXPLORE, DRAG, ROTATE, ENTER, OPEN, PLAY, INSPECT
 * - Never hides the native OS cursor (zero input lag).
 * - Uses compositor-only GSAP quickTo transforms.
 */
export const ArchitecturalCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [cursorMode, setCursorMode] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = cursorRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.16, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.16, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      const cursorTrigger = target?.closest('[data-cursor]') as HTMLElement | null;
      const mode = cursorTrigger?.getAttribute('data-cursor') || null;
      setCursorMode((prev) => (prev !== mode ? mode : prev));
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [enabled, isVisible]);

  if (!enabled) return null;

  const labelMap: Record<string, string> = {
    view: 'VIEW SCENE',
    inspect: 'OPEN PLATE',
    explore: 'ENTER MONOGRAPH →',
    orbit: 'ROTATE 3D MODEL',
    rotate: 'ROTATE 3D',
    drag: 'DRAG / PAN',
    enter: 'ENTER SANCTUARY',
    open: 'OPEN DOSSIER',
    play: 'PLAY SEQUENCE',
    scrub: 'SCRUB SOLAR ARC',
  };

  const activeLabel = cursorMode
    ? labelMap[cursorMode.toLowerCase()] || cursorMode.toUpperCase()
    : null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`flex items-center justify-center transition-all duration-200 ${
          activeLabel
            ? 'px-3 py-1 bg-[#141210]/95 border border-[#D97724]/80 text-[#FBF9F5] shadow-lg translate-x-14 translate-y-6'
            : 'h-6 w-6 border border-[#78350F]/45 rounded-full'
        }`}
      >
        {activeLabel ? (
          <span className="font-mono text-[9px] font-medium tracking-[0.18em] whitespace-nowrap">
            {activeLabel}
          </span>
        ) : (
          <span className="h-1 w-1 rounded-full bg-[#78350F]/70" />
        )}
      </div>
    </div>
  );
};
