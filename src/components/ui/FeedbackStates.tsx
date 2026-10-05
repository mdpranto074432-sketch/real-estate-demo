import React from 'react';
import { ActionButton } from './Primitives';

/**
 * Architectural Skeleton Loading State
 */
export const MonographSkeletonState: React.FC<{ label?: string }> = ({
  label = 'Curating architectural plates and telemetry...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-[1360px] px-6 py-16 md:px-12"
    >
      <div className="mb-8 flex items-center justify-between border-b border-[#D8D1C5] pb-4">
        <span className="font-serif text-sm italic text-[#736B63]">{label}</span>
        <span className="font-mono text-xs text-[#8C827A] tabular-nums">LOADING</span>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="h-[420px] animate-pulse bg-[#E8E2D8]" lg:col-span-8 />
        <div className="flex flex-col justify-between space-y-4 lg:col-span-4">
          <div className="space-y-3">
            <div className="h-4 w-32 animate-pulse bg-[#E8E2D8]" />
            <div className="h-10 w-3/4 animate-pulse bg-[#E8E2D8]" />
            <div className="h-24 w-full animate-pulse bg-[#E8E2D8]" />
          </div>
          <div className="h-32 w-full animate-pulse bg-[#E8E2D8]" />
        </div>
      </div>
    </div>
  );
};

/**
 * Empty State when client-side filter criteria return no matching residences or monographs.
 */
export const EmptyFilterState: React.FC<{
  title: string;
  description: string;
  onReset: () => void;
  resetLabel?: string;
}> = ({ title, description, onReset, resetLabel = 'Reset Curatorial Filters' }) => {
  return (
    <div className="my-8 border border-[#D8D1C5] bg-[#E8E2D8]/40 px-6 py-16 text-center md:px-12">
      <p className="font-mono text-xs text-[#986046]">ARCHIVE QUERY — 0 MATCHES</p>
      <h3 className="mt-2 font-serif text-2xl text-[#151514]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#736B63]">
        {description}
      </p>
      <div className="mt-6">
        <ActionButton variant="secondary" onClick={onReset}>
          {resetLabel}
        </ActionButton>
      </div>
    </div>
  );
};

/**
 * Not Found / Missing Monograph Error State
 */
export const MonographErrorState: React.FC<{
  title?: string;
  message?: string;
  backPath?: string;
  backLabel?: string;
  onRetry?: () => void;
}> = ({
  title = 'Monograph Plate Not Found',
  message = 'The requested architectural dossier or residence entry could not be located in the current portfolio edition.',
  backPath = '/projects',
  backLabel = 'Return to Portfolio Index',
  onRetry,
}) => {
  return (
    <div role="alert" className="mx-auto max-w-[1360px] px-6 py-24 md:px-12">
      <div className="border-t border-b border-[#D8D1C5] py-16">
        <p className="font-mono text-xs text-[#986046]">CATALOGUE REFERENCE ERROR</p>
        <h1 className="mt-3 font-serif text-4xl text-[#151514] sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#544E46]">{message}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ActionButton to={backPath} variant="primary">
            {backLabel}
          </ActionButton>
          {onRetry && (
            <ActionButton variant="secondary" onClick={onRetry}>
              Retry Query
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
};
