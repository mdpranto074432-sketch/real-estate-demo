import React, { useEffect, useId, useRef, useState } from 'react';
import { ArchitecturalIcon } from './ArchitecturalIcon';

export interface ArchitecturalTooltipProps {
  term: string;
  definition: string;
  benchmark?: string;
  children?: React.ReactNode;
}

/**
 * Accessible, Touch-Safe Architectural Term & Telemetry Tooltip.
 * - Supports hover, keyboard focus, and mobile tap toggle (no hover dependency).
 * - Dismisses on Escape key or outside tap.
 * - On mobile viewports (<640px), renders as a viewport-safe bottom toast card so it never clips off-screen.
 */
export const ArchitecturalTooltip: React.FC<ArchitecturalTooltipProps> = ({
  term,
  definition,
  benchmark,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    const handlePointerDownOutside = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDownOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDownOutside);
    };
  }, [isVisible]);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
          setIsVisible(false);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isVisible}
        aria-describedby={isVisible ? tooltipId : undefined}
        onClick={() => setIsVisible((prev) => !prev)}
        className="inline-flex min-h-[32px] items-center gap-1 border-b border-dotted border-[#78350F] py-0.5 font-mono text-xs text-[#1C1917] transition-colors duration-150 hover:text-[#78350F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78350F] cursor-pointer"
      >
        <span>{children || term}</span>
        <ArchitecturalIcon name="info" size={12} className="text-[#78350F]" />
      </button>

      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          className="fixed inset-x-4 bottom-5 z-50 border border-[#D6CEBE]/40 bg-[#141210] p-4 text-left text-xs text-[#FBF9F5] shadow-2xl sm:absolute sm:inset-auto sm:bottom-full sm:left-1/2 sm:mb-2.5 sm:w-64 sm:-translate-x-1/2 sm:p-3.5"
        >
          <span className="flex items-center justify-between font-mono text-[10px] tracking-wider text-[#D6CEBE]">
            <span>TECHNICAL SPECIFICATION</span>
            <span className="sm:hidden text-[10px] text-[#A8A29E]">TAP TO CLOSE</span>
          </span>
          <span className="mt-1 block font-serif text-base sm:text-sm font-medium text-[#FBF9F5]">
            {term}
          </span>
          <span className="mt-1 block text-xs sm:text-[11px] leading-relaxed text-[#D6CEBE]/90">
            {definition}
          </span>
          {benchmark && (
            <span className="mt-2 block border-t border-[#D6CEBE]/20 pt-1.5 font-mono text-[10px] text-[#FBF9F5] tabular-nums">
              Standard: {benchmark}
            </span>
          )}
        </span>
      )}
    </span>
  );
};
