/**
 * Varendra & Co. — Architectural Design System Tokens
 * Target Feel: World-class architectural practice & luxury hospitality brand based in Dhaka.
 * Strictly follows the 60-30-10 color rule, 2+1 typography rule, and compositor-only motion.
 */

export const DESIGN_TOKENS = {
  colors: {
    canvas: {
      primary: '#FBF9F5', // 60% Dominant Warm Archival Paper
      elevated: '#F5F1EA', // Subtle ivory paper elevation
      structural: '#EBE6DF', // 30% Honed Travertine / Limestone surface
      obsidian: '#141210', // Deep Monolith Charcoal (Dark Editorial Surface)
    },
    ink: {
      primary: '#1C1917', // Deep Architectural Ink (16.4:1 contrast on #FBF9F5)
      secondary: '#44403C', // Warm Slate Charcoal for body prose (9.6:1 contrast)
      muted: '#57534E', // Subdued Stone for secondary descriptions (7.1:1 contrast)
      caption: '#78716C', // Archival Index Gray for figure numbers (4.6:1 contrast)
      inverse: '#FBF9F5', // Alabaster Ink on dark surfaces
    },
    border: {
      hairline: '#D6CEBE', // 1px Architectural Hairline Rule
      subtle: '#E5DEC9', // Secondary internal table divider
      strong: '#1C1917', // Primary structural frame border
      accent: '#78350F', // Patinated Bronze focus/active border
    },
    accent: {
      bronze: '#78350F', // 10% Accent Budget: Patinated Architectural Bronze
      bronzeHover: '#5C280B', // Deepened bronze state
      terracotta: '#9A3412', // Dhamrai Kiln Terracotta (Validation / Alert)
      botanical: '#14532D', // Monsoon Canopy Ink (Available / Environmental verification)
    },
  },

  typography: {
    families: {
      display: "'Cormorant Garamond', Georgia, serif",
      sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    scale: {
      displayHero: {
        size: 'clamp(2.5rem, 4.8vw + 1rem, 4.5rem)',
        lineHeight: '1.06',
        letterSpacing: '-0.02em',
        fontFamily: 'serif',
      },
      heading1: {
        size: 'clamp(2.125rem, 3.5vw + 0.75rem, 3.75rem)',
        lineHeight: '1.08',
        letterSpacing: '-0.015em',
        fontFamily: 'serif',
      },
      heading2: {
        size: 'clamp(1.75rem, 2.5vw + 0.5rem, 2.625rem)',
        lineHeight: '1.12',
        letterSpacing: '-0.01em',
        fontFamily: 'serif',
      },
      heading3: {
        size: 'clamp(1.375rem, 1.5vw + 0.5rem, 1.875rem)',
        lineHeight: '1.2',
        letterSpacing: '-0.005em',
        fontFamily: 'serif',
      },
      bodyLead: {
        size: '1.125rem', // 18px
        lineHeight: '1.75',
        measure: '65ch',
        fontFamily: 'sans',
      },
      bodyProse: {
        size: '1rem', // 16px
        lineHeight: '1.75',
        measure: '68ch',
        fontFamily: 'sans',
      },
      bodySmall: {
        size: '0.875rem', // 14px
        lineHeight: '1.65',
        measure: '65ch',
        fontFamily: 'sans',
      },
      metadata: {
        size: '0.75rem', // 12px
        lineHeight: '1.4',
        letterSpacing: '0.04em',
        fontFamily: 'sans',
      },
      telemetry: {
        size: '0.75rem', // 12px
        lineHeight: '1.4',
        letterSpacing: '0.02em',
        fontFamily: 'mono',
        numeric: 'tabular-nums',
      },
    },
  },

  spacing: {
    containerMax: '1360px',
    sectionVertical: {
      mobile: '4rem', // 64px
      tablet: '6rem', // 96px
      desktop: '7.5rem', // 120px
    },
    containerHorizontal: {
      mobile: '1.5rem', // 24px
      tablet: '3rem', // 48px
      desktop: '3rem', // 48px
    },
    gridGap: {
      tight: '1rem', // 16px
      standard: '2rem', // 32px
      editorial: '3rem', // 48px
      monumental: '4rem', // 64px
    },
  },

  motion: {
    easings: {
      editorialOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      architecturalInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      curtainReveal: 'power3.out',
    },
    durations: {
      micro: '150ms', // Hover, focus, active state settling (<200ms rule)
      transition: '550ms', // Page & modal choreography
      imageReveal: '900ms', // Architectural plate curtain reveal
    },
  },
} as const;
