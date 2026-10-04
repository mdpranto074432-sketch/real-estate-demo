import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectMonograph } from '../../types/realEstate';
import {
  isMobileOrConstrainedDevice,
  prefersReducedMotion,
} from '../../utils/animation';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';
import { ActionButton } from '../ui/Primitives';
import {
  formatBdtValuation,
  useBangladeshLocalization,
} from '../../utils/bangladeshLocalization';
import { getProjectUnitMetrics } from './ProjectMonographCard';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollMonographGalleryProps {
  projects: ProjectMonograph[];
  onInspectPlate?: (plate: {
    src: string;
    title: string;
    subtitle: string;
    slug?: string;
  }) => void;
}

/**
 * 08 & 19 — HORIZONTAL SCROLL WORLD & SCROLL-BOUND PROJECT DISCOVERY
 * Vertical scroll pins the viewport and glides horizontally through a physical
 * architectural exhibition gallery of commissioned Dhaka monographs.
 * Features multi-layer parallax planes (Background index 0.85x, Architecture 1.0x,
 * Foreground interior inset 1.18x, Typography custom velocity response).
 */
export const HorizontalScrollMonographGallery: React.FC<
  HorizontalScrollMonographGalleryProps
> = ({ projects, onInspectPlate }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [progressPct, setProgressPct] = useState<number>(0);
  const { bdtDisplayUnit, languageMode } = useBangladeshLocalization();

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinContainerRef.current;
    const track = trackRef.current;
    if (!section || !pinEl || !track) return;

    if (prefersReducedMotion() || isMobileOrConstrainedDevice()) {
      return;
    }

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(
        track.querySelectorAll('[data-gallery-slide]')
      );
      const totalSlides = panels.length;
      if (totalSlides <= 1) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const mainTween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(2600, (totalSlides - 1) * 950)}`,
          pin: pinEl,
          scrub: 0.75,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (totalSlides - 1),
            duration: { min: 0.2, max: 0.55 },
            delay: 0.08,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const p = self.progress;
            setProgressPct(Math.round(p * 100));
            const idx = Math.min(
              totalSlides - 1,
              Math.max(0, Math.round(p * (totalSlides - 1)))
            );
            setActiveIndex((prev) => (prev !== idx ? idx : prev));
          },
        },
      });

      // Multi-layer internal parallax within each horizontal slide
      panels.forEach((panel) => {
        const bgWatermark = panel.querySelector('[data-depth="bg-watermark"]');
        const fgInset = panel.querySelector('[data-depth="fg-inset"]');
        const heroImg = panel.querySelector('[data-depth="arch-image"]');

        if (bgWatermark) {
          gsap.fromTo(
            bgWatermark,
            { xPercent: -18 },
            {
              xPercent: 18,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: mainTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }

        if (fgInset) {
          gsap.fromTo(
            fgInset,
            { xPercent: 22, yPercent: 8 },
            {
              xPercent: -22,
              yPercent: -8,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: mainTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }

        if (heroImg) {
          gsap.fromTo(
            heroImg,
            { scale: 1.12, xPercent: -5 },
            {
              scale: 1.0,
              xPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: mainTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [projects.length]);

  const activeProject = projects[activeIndex] || projects[0];

  return (
    <section
      ref={sectionRef}
      id="signature-projects"
      aria-label="Horizontal Scroll Architectural Monograph Gallery"
      className="relative border-b border-[#D6CEBE] bg-[#141210] text-[#FBF9F5]"
    >
      {/* Desktop Pinned Horizontal Scroll World */}
      <div
        ref={pinContainerRef}
        className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden py-10 lg:py-14"
      >
        {/* Top Gallery Telemetry & Chapter Header */}
        <div className="relative z-20 mx-auto w-full max-w-[1360px] px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#FBF9F5]/15 pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-widest text-[#C28E5C]">
                CHAPTER 03 · HORIZONTAL ARCHITECTURAL EXHIBITION
              </span>
              <span aria-hidden="true" className="text-[#D6CEBE]/40">
                ·
              </span>
              <span className="font-mono text-xs text-[#D6CEBE]">
                {activeProject.catalogNumber} ({activeIndex + 1} OF {projects.length})
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Monograph Selector Dots */}
              <div className="hidden sm:flex items-center gap-1.5">
                {projects.map((p, idx) => (
                  <span
                    key={p.id}
                    className={`h-1.5 transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-7 bg-[#C28E5C]'
                        : 'w-2 bg-[#FBF9F5]/25'
                    }`}
                    title={p.title}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-[#C28E5C] tabular-nums">
                GALLERY TRAVERSAL [{progressPct}%]
              </span>
              <ActionButton to="/projects" variant="inverse">
                Full Archive ({projects.length})
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Horizontal Track on Desktop / Vertical Cinematic Sequence on Mobile */}
        <div className="relative my-auto w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex flex-col gap-16 px-6 md:px-12 lg:flex-row lg:gap-0 lg:px-0 lg:w-max"
          >
            {projects.map((project, idx) => {
              const metrics = getProjectUnitMetrics(project);
              return (
                <article
                  key={project.id}
                  data-gallery-slide
                  className="relative flex w-full shrink-0 items-center justify-center lg:w-screen lg:px-16 xl:px-24"
                >
                  {/* Multi-Plane Layer 1: Background Watermark (0.85x Parallax Rate) */}
                  <div
                    data-depth="bg-watermark"
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-10 right-10 z-0 select-none font-serif text-[140px] leading-none text-[#FBF9F5]/[0.04] sm:text-[220px] lg:text-[290px]"
                  >
                    0{idx + 1} · {project.enclaveName.split(' ')[0].toUpperCase()}
                  </div>

                  {/* Main 12-Column Exhibition Frame */}
                  <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Left 7 Columns: Multi-Layered Architectural Imagery */}
                    <div className="relative lg:col-span-7">
                      <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#FBF9F5]/20 bg-[#1C1917]">
                        <img
                          data-depth="arch-image"
                          src={project.heroImage}
                          alt={`${project.title} — ${project.enclaveName}`}
                          loading={idx === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          className="h-full w-full object-cover opacity-90 transition-transform duration-700"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141210]/80 via-transparent to-transparent" />

                        {/* Bottom Plate Caption inside Frame */}
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 font-mono text-[11px] text-[#D6CEBE]">
                          <span>
                            {project.catalogNumber} · {project.addressLine}
                          </span>
                          {onInspectPlate && (
                            <button
                              type="button"
                              onClick={() =>
                                onInspectPlate({
                                  src: project.heroImage,
                                  title: project.title,
                                  subtitle: `${project.enclaveName} · ${project.typicalFloorAreaSqFt}`,
                                  slug: project.slug,
                                })
                              }
                              className="pointer-events-auto border border-[#FBF9F5]/40 bg-[#141210]/80 px-2.5 py-1 text-[10px] text-[#FBF9F5] hover:border-[#C28E5C] cursor-pointer"
                            >
                              EXPAND PLATE
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Multi-Plane Layer 3: Foreground Floating Interior Study (1.18x Parallax Rate) */}
                      <div
                        data-depth="fg-inset"
                        className="hidden xl:block absolute -bottom-8 -right-8 z-20 w-64 border border-[#C28E5C]/60 bg-[#141210] p-3 shadow-2xl"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden">
                          <img
                            src={project.interiorImage}
                            alt={`${project.title} interior salon`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#C28E5C]">
                          <span>INTERIOR SALON</span>
                          <span>
                            {project.floorPlans[0]
                              ? `${project.floorPlans[0].ceilingHeightFeet}' SOFFIT`
                              : `${project.stories} FLOORS`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right 5 Columns: Monograph Dossier & Kinetic Metrics */}
                    <div className="flex flex-col justify-between space-y-6 lg:col-span-5 lg:pl-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#C28E5C]">
                          <span>{project.catalogNumber}</span>
                          <span>·</span>
                          <span>
                            {languageMode === 'BN' && project.enclaveNameBn
                              ? project.enclaveNameBn
                              : project.enclaveName}
                          </span>
                          <span>·</span>
                          <span className="text-[#D6CEBE]">{project.status}</span>
                        </div>

                        <h3 className="mt-3 font-serif text-3xl font-normal leading-[1.06] tracking-tight text-[#FBF9F5] sm:text-5xl">
                          <Link
                            to={`/projects/${project.slug}`}
                            data-cursor="EXPLORE"
                            className="hover:text-[#C28E5C] transition-colors"
                          >
                            {languageMode === 'BN' && project.titleBn
                              ? project.titleBn
                              : project.title}
                          </Link>
                        </h3>

                        <p className="mt-2 font-serif text-lg italic text-[#D6CEBE]">
                          {project.subtitle}
                        </p>

                        <p className="mt-4 text-sm leading-relaxed text-[#D6CEBE]/85">
                          {project.curatorialStatement}
                        </p>
                      </div>

                      {/* Kinetic Architectural Specification Grid */}
                      <dl className="grid grid-cols-2 gap-4 border-t border-b border-[#FBF9F5]/15 py-4 text-xs sm:grid-cols-3">
                        <div>
                          <dt className="text-[#A8A29E]">Floor Plate</dt>
                          <dd className="mt-1 font-mono text-sm font-semibold text-[#FBF9F5] tabular-nums">
                            {project.typicalFloorAreaSqFt}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#A8A29E]">Elevation & Plot</dt>
                          <dd className="mt-1 font-mono text-sm font-semibold text-[#FBF9F5] tabular-nums">
                            {project.stories}F · {project.landAreaKathas} Katha
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#A8A29E]">Valuation (Demo)</dt>
                          <dd className="mt-1 font-mono text-xs font-semibold text-[#C28E5C] tabular-nums">
                            {formatBdtValuation(
                              metrics.priceDisplay,
                              bdtDisplayUnit
                            )}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <ActionButton
                          to={`/projects/${project.slug}`}
                          variant="inverse"
                        >
                          <span>Enter Monograph World</span>
                          <ArchitecturalIcon name="arrow-up-right" size={14} />
                        </ActionButton>

                        <Link
                          to={`/contact?project=${project.slug}`}
                          className="font-mono text-xs text-[#D6CEBE] underline underline-offset-4 hover:text-[#C28E5C]"
                        >
                          Request Private Dossier
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom Horizontal Scroll Rail */}
        <div className="relative z-20 mx-auto hidden w-full max-w-[1360px] px-6 md:px-12 lg:block">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#A8A29E]">
            <span>SCROLL VERTICALLY TO GLIDE HORIZONTALLY THROUGH THE EXHIBITION</span>
            <span>SNAP-ASSISTED ARCHITECTURAL PLATES · MULTI-PLANE DEPTH</span>
          </div>
        </div>
      </div>
    </section>
  );
};
