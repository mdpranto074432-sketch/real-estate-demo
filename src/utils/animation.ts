import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Checks whether the user has requested reduced motion at the OS/browser level.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if the device has a fine pointer (desktop mouse/trackpad) for cursor/magnetic interactions.
 */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

/**
 * Detects mobile touch viewports or constrained hardware where reduced-complexity
 * motion preserves 60fps touch scrolling and low INP latency.
 */
export function isMobileOrConstrainedDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 768;
  const lowCores =
    typeof navigator !== 'undefined' &&
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= 4;
  return isCoarse || isNarrow || lowCores;
}

/**
 * Detects strictly weak hardware or data-saver mode for WebGL fallback decisions.
 */
export function isWeakDevicePerformance(): boolean {
  if (typeof window === 'undefined') return false;
  const lowCores =
    typeof navigator !== 'undefined' &&
    typeof navigator.hardwareConcurrency === 'number' &&
    navigator.hardwareConcurrency <= 2;
  const navWithConnection = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  const saveData = Boolean(navWithConnection?.connection?.saveData);
  return lowCores || saveData;
}

/**
 * 1. ENTRANCE, SPLIT-TEXT & CURTAIN REVEAL CHOREOGRAPHY
 * Orchestrates zero-latency entrance choreography for editorial elements,
 * split-word masked typography, and image curtains within a container ref.
 * Automatically adapts complexity on mobile/touch devices to keep INP and frame timing pristine.
 */
export function useEditorialEntrance<T extends HTMLElement>(dependencyKey?: string) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    const isMobileMotion = isMobileOrConstrainedDevice();
    const targets = container.querySelectorAll('[data-animate="editorial"]');
    const splitWords = container.querySelectorAll('[data-animate="split-word"]');
    const splitChars = container.querySelectorAll('[data-animate="split-char"]');
    const curtainImages = container.querySelectorAll('[data-animate="image-curtain"]');

    const ctx = gsap.context(() => {
      if (splitChars.length) {
        if (isMobileMotion) {
          gsap.fromTo(
            splitChars,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.35,
              ease: 'power2.out',
              clearProps: 'opacity',
            }
          );
        } else {
          gsap.fromTo(
            splitChars,
            {
              opacity: 0,
              yPercent: 60,
            },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.55,
              stagger: 0.016,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
            }
          );
        }
      }

      if (splitWords.length) {
        gsap.fromTo(
          splitWords,
          {
            yPercent: isMobileMotion ? 65 : 108,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: isMobileMotion ? 0.55 : 0.82,
            stagger: isMobileMotion ? 0.018 : 0.032,
            ease: 'expo.out',
            clearProps: 'transform,opacity',
          }
        );
      }

      if (targets.length) {
        gsap.fromTo(
          targets,
          {
            opacity: 0,
            y: isMobileMotion ? 10 : 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: isMobileMotion ? 0.5 : 0.75,
            stagger: isMobileMotion ? 0.04 : 0.065,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      }

      if (curtainImages.length) {
        gsap.fromTo(
          curtainImages,
          {
            scaleX: 1,
            transformOrigin: 'right center',
          },
          {
            scaleX: 0,
            duration: isMobileMotion ? 0.65 : 0.95,
            stagger: 0.08,
            ease: 'expo.inOut',
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [dependencyKey]);

  return containerRef;
}

/**
 * 2. MULTI-MODAL SCROLL CHOREOGRAPHY (GSAP ScrollTrigger)
 * Adapts to mobile touch devices by avoiding heavy continuous scroll-scrubbing on mobile
 * while preserving smooth viewport entry choreography.
 */
export function useChoreographedScroll<T extends HTMLElement>(dependencyKey?: string) {
  const rootRef = useRef<T | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const isMobileMotion = isMobileOrConstrainedDevice();

    const ctx = gsap.context(() => {
      // A. Hero Camera Depth Parallax (Desktop fine pointer only to prevent mobile address-bar resize jumps)
      const heroMedia = root.querySelector('[data-parallax="hero-media"]');
      if (heroMedia && !isMobileMotion) {
        gsap.fromTo(
          heroMedia,
          { yPercent: -3, scale: 1.05 },
          {
            yPercent: 6,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: heroMedia,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.65,
            },
          }
        );
      }

      // B. Editorial Plate Parallax Depth (Desktop fine pointer only)
      if (!isMobileMotion) {
        const parallaxPlates = root.querySelectorAll('[data-parallax="plate-depth"]');
        parallaxPlates.forEach((plate) => {
          gsap.fromTo(
            plate,
            { yPercent: -3.5, scale: 1.045 },
            {
              yPercent: 3.5,
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: plate,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            }
          );
        });
      }

      // C. Brand Statement Cadence
      const statementBlocks = root.querySelectorAll('[data-scroll="statement-reveal"]');
      statementBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0.15, y: isMobileMotion ? 14 : 26 },
          {
            opacity: 1,
            y: 0,
            duration: isMobileMotion ? 0.7 : 1.05,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: block,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // D. Scroll-Triggered Split Words inside Section Headers
      const scrollSplitContainers = root.querySelectorAll('[data-scroll="split-heading"]');
      scrollSplitContainers.forEach((heading) => {
        const words = heading.querySelectorAll('[data-word]');
        if (words.length) {
          gsap.fromTo(
            words,
            { yPercent: isMobileMotion ? 65 : 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: isMobileMotion ? 0.55 : 0.8,
              stagger: isMobileMotion ? 0.015 : 0.028,
              ease: 'expo.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: heading,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });

      // E. Clip-Path Architectural Aperture Reveal (Desktop only; mobile uses clean opacity/translate)
      const clipContainers = root.querySelectorAll('[data-scroll="clip-reveal"]');
      clipContainers.forEach((clipEl) => {
        if (isMobileMotion) {
          gsap.fromTo(
            clipEl,
            { opacity: 0.4, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: clipEl,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        } else {
          gsap.fromTo(
            clipEl,
            { clipPath: 'inset(8% 6% 8% 6%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              ease: 'power3.out',
              clearProps: 'clipPath',
              scrollTrigger: {
                trigger: clipEl,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });

      // F. Architectural Panel Reveals
      const panels = root.querySelectorAll('[data-scroll="panel-elevate"]');
      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: isMobileMotion ? 16 : 28 },
          {
            opacity: 1,
            y: 0,
            duration: isMobileMotion ? 0.6 : 0.88,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: panel,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // G. Staggered Group Reveals (Tables, Timelines, Spec Grids)
      const groups = root.querySelectorAll('[data-scroll="stagger-group"]');
      groups.forEach((group) => {
        const items = group.children;
        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, y: isMobileMotion ? 10 : 18 },
            {
              opacity: 1,
              y: 0,
              duration: isMobileMotion ? 0.45 : 0.65,
              stagger: isMobileMotion ? 0.035 : 0.06,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: group,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });

      // H. Horizontal Hairline Dividers
      const rules = root.querySelectorAll('[data-scroll="rule-expand"]');
      rules.forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: isMobileMotion ? 0.7 : 1.05,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: rule,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // I. Velocity-Reactive Damped Motion on Elements Marked [data-velocity-react] (Desktop only)
      if (!isMobileMotion) {
        const velocityTargets = root.querySelectorAll('[data-velocity-react]');
        if (velocityTargets.length) {
          const skewSetter = gsap.quickTo(velocityTargets, 'skewY', {
            duration: 0.45,
            ease: 'power3.out',
          });
          const ySetter = gsap.quickTo(velocityTargets, 'y', {
            duration: 0.55,
            ease: 'power3.out',
          });

          ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
              const v = self.getVelocity();
              const clampedSkew = gsap.utils.clamp(-1.6, 1.6, v / -1400);
              const clampedY = gsap.utils.clamp(-10, 10, v / -320);
              skewSetter(clampedSkew);
              ySetter(clampedY);
            },
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [dependencyKey]);

  return rootRef;
}

/**
 * 3. STATE TRANSITION MORPH HOOK
 */
export function useStateTransition<T extends HTMLElement>(activeKey: string | number) {
  const panelRef = useRef<T | null>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.36,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, el);

    return () => ctx.revert();
  }, [activeKey]);

  return panelRef;
}

/**
 * 4. ARCHITECTURAL HAIRLINE RULE EXPANSION
 */
export function useHairlineReveal<T extends HTMLElement>(dependencyKey?: string) {
  const lineRef = useRef<T | null>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 0.85,
          ease: 'expo.out',
        }
      );
    }, el);

    return () => ctx.revert();
  }, [dependencyKey]);

  return lineRef;
}

/**
 * 5. MAGNETIC INTERACTION HOOK
 * Active only on fine-pointer desktop devices when reduced motion is off.
 */
export function useMagneticInteraction<T extends HTMLElement>(strength = 0.18) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || strength <= 0 || prefersReducedMotion() || !hasFinePointer()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xTo(Math.max(-6, Math.min(6, deltaX)));
      yTo(Math.max(-4.5, Math.min(4.5, deltaY)));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
}

/**
 * 6. SCROLL PROGRESS TELEMETRY HOOK
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (docHeight <= 0) {
            setProgress(0);
          } else {
            setProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
