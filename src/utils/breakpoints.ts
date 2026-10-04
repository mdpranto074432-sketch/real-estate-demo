import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const;

export type ViewportTier = 'mobile' | 'tablet' | 'desktop' | 'wide';

export function useViewportTier(): {
  width: number;
  tier: ViewportTier;
  isMobile: boolean;
  isDesktopOrWider: boolean;
} {
  const [width, setWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let tier: ViewportTier = 'desktop';
  if (width < BREAKPOINTS.md) {
    tier = 'mobile';
  } else if (width < BREAKPOINTS.lg) {
    tier = 'tablet';
  } else if (width >= BREAKPOINTS.xxl) {
    tier = 'wide';
  }

  return {
    width,
    tier,
    isMobile: width < BREAKPOINTS.md,
    isDesktopOrWider: width >= BREAKPOINTS.lg,
  };
}
