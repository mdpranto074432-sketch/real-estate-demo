import React, { useEffect, useId, useRef } from 'react';
import { ArchitecturalIcon } from './ArchitecturalIcon';

export interface ArchitecturalModalProps {
  isOpen: boolean;
  onClose: () => void;
  kicker?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerAction?: React.ReactNode;
  maxWidthClass?: string;
}

/**
 * High-Contrast Editorial Dossier & Lightbox Modal.
 * Supports Escape key dismissal, keyboard Tab focus trapping, focus restoration on close,
 * backdrop click dismissal, ARIA dialog semantics, and smooth compositor entrance.
 */
export const ArchitecturalModal: React.FC<ArchitecturalModalProps> = ({
  isOpen,
  onClose,
  kicker = 'ARCHITECTURAL DOSSIER PLATE',
  title,
  subtitle,
  children,
  footerAction,
  maxWidthClass = 'max-w-4xl',
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button on open for immediate keyboard accessibility
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Measured Charcoal Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#151514]/80 backdrop-blur-[2px] transition-opacity duration-200"
      />

      {/* Modal Container */}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full ${maxWidthClass} flex-col border border-[#D8D1C5] bg-[#F2EEE7] text-[#151514] shadow-2xl transition-transform duration-200`}
      >
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#D8D1C5] px-6 py-5 md:px-8">
          <div>
            <p className="font-mono text-[11px] tracking-wider text-[#986046] tabular-nums">
              {kicker}
            </p>
            <h2
              id={titleId}
              className="mt-1 font-serif text-2xl font-normal text-[#151514] sm:text-3xl"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs text-[#544E46]">{subtitle}</p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dossier modal"
            className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center border border-[#D8D1C5] bg-[#F2EEE7] text-[#151514] transition-colors duration-150 hover:border-[#151514] hover:bg-[#E8E2D8] active:scale-[0.98] cursor-pointer"
          >
            <ArchitecturalIcon name="close" size={16} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D8D1C5] bg-[#E8E2D8]/50 px-6 py-4 md:px-8">
          <span className="font-mono text-[11px] text-[#736B63]">
            PRESS [ESC] TO CLOSE PLATE
          </span>
          <div className="flex items-center gap-3">
            {footerAction}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] sm:min-h-[38px] border border-[#151514] px-4 py-2 text-xs font-medium text-[#151514] whitespace-nowrap transition-colors duration-150 hover:bg-[#151514] hover:text-[#F2EEE7] cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
