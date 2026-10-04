import React from 'react';
import { Link } from 'react-router-dom';
import { useMagneticInteraction } from '../../utils/animation';

/**
 * 1. METADATA TYPOGRAPHY & ZERO-PILL DISCIPLINE
 * Unboxed inline metadata line with clean typographic separators (·).
 * Never wraps static metadata in rounded pill boxes or candy chips.
 */
export const EditorialMetaLine: React.FC<{
  items: (string | React.ReactNode)[];
  className?: string;
}> = ({ items, className = '' }) => {
  const validItems = items.filter(Boolean);
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs tracking-wide text-[#57534E] ${className}`}
    >
      {validItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <span>{item}</span>
          {idx < validItems.length - 1 && (
            <span aria-hidden="true" className="text-[#78716C]">
              ·
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * 2. ARCHITECTURAL STATUS INDICATOR (UNBOXED SEMANTIC LABEL)
 * Pairs color with an explicit text label and subtle geometric square marker (never a pill capsule).
 */
export const ArchitecturalStatusText: React.FC<{
  status: string;
  tone?: 'botanical' | 'bronze' | 'muted';
}> = ({ status, tone = 'bronze' }) => {
  const colorMap = {
    botanical: 'text-[#14532D]',
    bronze: 'text-[#78350F]',
    muted: 'text-[#57534E]',
  };
  const dotMap = {
    botanical: 'bg-[#14532D]',
    bronze: 'bg-[#78350F]',
    muted: 'bg-[#57534E]',
  };

  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium ${colorMap[tone]}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 ${dotMap[tone]}`} />
      <span>{status}</span>
    </span>
  );
};

/**
 * 3. SECTION HEADING SYSTEM WITH MEASURED ARCHITECTURAL CHOREOGRAPHY
 * Uses natural human editorial numbering (e.g. "01. Architectural Thesis") — never slash comments.
 * Uses clean block elevation and horizontal hairline rule expansion (reserving word-split for Hero H1s).
 */
export const SectionHeader: React.FC<{
  indexNumber?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'between';
  action?: React.ReactNode;
}> = ({ indexNumber, kicker, title, subtitle, align = 'left', action }) => {
  return (
    <div className="relative pb-6 md:pb-8">
      {(indexNumber || kicker) && (
        <div
          data-scroll="panel-elevate"
          className="mb-3 flex items-center gap-2 text-xs text-[#78350F]"
        >
          {indexNumber && <span className="font-mono tabular-nums">{indexNumber}.</span>}
          {kicker && <span className="font-medium tracking-wide">{kicker}</span>}
        </div>
      )}

      <div
        data-scroll="panel-elevate"
        className={
          align === 'between'
            ? 'flex flex-col justify-between gap-6 lg:flex-row lg:items-end'
            : 'max-w-3xl'
        }
      >
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-normal tracking-tight text-[#1C1917] text-balance sm:text-4xl lg:text-[42px] lg:leading-[1.12]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base leading-relaxed text-[#44403C] text-pretty">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 max-w-full overflow-x-auto">{action}</div>}
      </div>

      {/* Animated Architectural Hairline Rule */}
      <div
        data-scroll="rule-expand"
        aria-hidden="true"
        className="absolute right-0 bottom-0 left-0 h-px bg-[#D6CEBE]"
      />
    </div>
  );
};

/**
 * 4. INTERACTIVE FILTER CONTROLS (SEGMENTED ARCHITECTURE)
 * Touch-friendly (44px min height on mobile) and horizontally scrollable on narrow viewports.
 */
export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
  disabled?: boolean;
}

export function SegmentedFilter<T extends string>({
  options,
  activeValue,
  onChange,
  ariaLabel = 'Filter items',
}: {
  options: FilterOption<T>[];
  activeValue: T;
  onChange: (val: T) => void;
  ariaLabel?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex max-w-full overflow-x-auto sm:flex-wrap items-center gap-1 border border-[#D6CEBE] bg-[#EBE6DF]/70 p-1"
    >
      {options.map((option) => {
        const isActive = option.value === activeValue;
        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`min-h-[44px] sm:min-h-[38px] px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78350F] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
              isActive
                ? 'bg-[#1C1917] text-[#FBF9F5]'
                : 'text-[#44403C] hover:bg-[#D6CEBE]/50 hover:text-[#1C1917]'
            }`}
          >
            <span>{option.label}</span>
            {typeof option.count === 'number' && (
              <span
                className={`ml-1.5 font-mono text-[11px] tabular-nums ${
                  isActive ? 'text-[#D6CEBE]' : 'text-[#57534E]'
                }`}
              >
                ({option.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 5. BUTTON & ACTION PRIMITIVE
 * Enforces >=44px mobile touch target height, focus-visible ring, loading state, and magnetic pull.
 */
export const ActionButton: React.FC<{
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'quiet' | 'inverse';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  magnetic?: boolean;
}> = ({
  children,
  to,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  loading = false,
  magnetic = false,
}) => {
  const magneticButtonRef = useMagneticInteraction<HTMLButtonElement>(
    magnetic ? 0.16 : 0
  );
  const magneticLinkRef = useMagneticInteraction<HTMLAnchorElement>(
    magnetic ? 0.16 : 0
  );

  const baseStyles =
    'inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78350F] active:scale-[0.985] disabled:opacity-45 disabled:pointer-events-none cursor-pointer';

  const variantStyles = {
    primary: 'bg-[#1C1917] text-[#FBF9F5] hover:bg-[#78350F]',
    secondary:
      'border border-[#1C1917] bg-transparent text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBF9F5]',
    inverse:
      'bg-[#FBF9F5] text-[#1C1917] hover:bg-[#D6CEBE] focus-visible:outline-[#FBF9F5]',
    quiet:
      'min-h-[36px] border-b border-[#1C1917]/35 px-0 py-1 text-[#1C1917] hover:border-[#78350F] hover:text-[#78350F]',
  }[variant];

  const content = (
    <>
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent rounded-full"
        />
      )}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link
        ref={magnetic ? magneticLinkRef : undefined}
        to={to}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={magnetic ? magneticButtonRef : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {content}
    </button>
  );
};

/**
 * 6. EDITORIAL FORM PRIMITIVES
 * Standardized Input, Select, and Textarea with explicit focus, error, and disabled states.
 */
export const EditorialFieldLabel: React.FC<{
  htmlFor: string;
  label: string;
  required?: boolean;
  optionalNote?: string;
}> = ({ htmlFor, label, required, optionalNote }) => (
  <label
    htmlFor={htmlFor}
    className="flex items-baseline justify-between text-xs font-medium text-[#1C1917]"
  >
    <span>
      {label} {required && <span className="text-[#78350F]">*</span>}
    </span>
    {optionalNote && (
      <span className="font-mono text-[10px] text-[#57534E]">{optionalNote}</span>
    )}
  </label>
);

export const EditorialGridSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  surface?: 'canvas' | 'structural' | 'obsidian';
  borderTop?: boolean;
  borderBottom?: boolean;
}> = ({
  children,
  className = '',
  id,
  surface = 'canvas',
  borderTop = false,
  borderBottom = false,
}) => {
  const surfaceClasses = {
    canvas: 'bg-[#FBF9F5] text-[#1C1917]',
    structural: 'bg-[#EBE6DF]/45 text-[#1C1917]',
    obsidian: 'surface-dark-optical',
  }[surface];

  return (
    <section
      id={id}
      className={`${surfaceClasses} ${borderTop ? 'border-t border-[#D6CEBE]' : ''} ${
        borderBottom ? 'border-b border-[#D6CEBE]' : ''
      } py-14 sm:py-20 lg:py-[112px] ${className}`}
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-6 md:px-12">{children}</div>
    </section>
  );
};
