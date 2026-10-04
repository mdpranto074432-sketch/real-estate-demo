import React from 'react';

export interface SplitEditorialHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  trigger?: 'entrance' | 'scroll';
  className?: string;
}

/**
 * 02. TYPOGRAPHY — SPLIT & MASKED WORD REVEAL
 * Splits an editorial heading into masked words (`overflow-hidden`) for staggered
 * architectural line/word choreography while preserving a single accessible label
 * for screen readers.
 */
export const SplitEditorialHeading: React.FC<SplitEditorialHeadingProps> = ({
  text,
  as: Tag = 'h2',
  trigger = 'scroll',
  className = '',
}) => {
  const words = text.trim().split(/\s+/);

  return (
    <Tag
      aria-label={text}
      data-scroll={trigger === 'scroll' ? 'split-heading' : undefined}
      className={className}
    >
      <span aria-hidden="true">
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <span className="split-mask-line">
              <span
                data-animate={trigger === 'entrance' ? 'split-word' : undefined}
                data-word={trigger === 'scroll' ? 'true' : undefined}
                className="split-mask-word"
              >
                {word}
              </span>
            </span>
            {index < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
};

/**
 * Restrained token-staggered monospace kicker for monograph headers.
 * Splits by word/separator rather than individual letters to avoid cheap typewriter effects
 * and ensure full compatibility with Bengali (বাংলা) conjunct ligatures.
 */
export const SplitMonographKicker: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const tokens = text.trim().split(/\s+/);
  return (
    <p aria-label={text} className={className}>
      <span aria-hidden="true">
        {tokens.map((token, idx) => (
          <React.Fragment key={`${token}-${idx}`}>
            <span
              data-animate="editorial"
              className="inline-block"
            >
              {token}
            </span>
            {idx < tokens.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>
    </p>
  );
};
