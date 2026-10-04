import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMAGE_ASSETS } from '../../data/mockRealEstateData';
import {
  isMobileOrConstrainedDevice,
  prefersReducedMotion,
} from '../../utils/animation';

gsap.registerPlugin(ScrollTrigger);

interface MaterialChapterSpec {
  id: string;
  index: string;
  materialName: string;
  originLabel: string;
  tectonicRole: string;
  acousticThermalNote: string;
  lightingMood: string;
  accentHex: string;
  surfaceGradient: string;
  imageSrc: string;
  essay: string;
}

const MATERIAL_CHAPTERS: MaterialChapterSpec[] = [
  {
    id: 'mat-concrete',
    index: '01',
    materialName: 'Architectural Board-Formed Fair-Faced Concrete',
    originLabel: 'Cast-in-Situ C50 High-Density Mix · Dhaka',
    tectonicRole: 'Primary Post-Tensioned Structural Core & 14-Foot Cantilevers',
    acousticThermalNote: 'STC-62 Airborne Sound Isolation · High Thermal Flywheel',
    lightingMood: 'MORNING OBLIQUE GRAZING LIGHT (07:30 BST)',
    accentHex: '#A8A29E',
    surfaceGradient: 'radial-gradient(circle at 30% 30%, #44403C 0%, #1C1917 70%)',
    imageSrc: IMAGE_ASSETS.heroDhaka,
    essay:
      'Poured against seasoned timber shuttering, our structural concrete retains the subtle organic grain of wood while providing a fifty-year weather-resistant exoskeleton engineered for Bengal monsoon downpours.',
  },
  {
    id: 'mat-travertine',
    index: '02',
    materialName: 'Unfilled Honed Roman Travertine',
    originLabel: 'Tivoli Quarries · Ventilated Rainscreen & Salon Slabs',
    tectonicRole: 'Floating Acoustic Floor Slabs & Double-Height Atrium Cladding',
    acousticThermalNote: 'Low Solar Absorption · Cool Underfoot in Tropical Humidity',
    lightingMood: 'SOLAR ZENITH DIFFUSED LUMINESCENCE (12:30 BST)',
    accentHex: '#D6CEBE',
    surfaceGradient: 'radial-gradient(circle at 45% 35%, #78716C 0%, #292524 72%)',
    imageSrc: IMAGE_ASSETS.penthouseInterior,
    essay:
      'Selected in open-pore, matte-honed blocks, Roman travertine diffuses harsh midday glare into a calm museum-like luminosity while floating over 18mm acoustic isolation mats.',
  },
  {
    id: 'mat-teak',
    index: '03',
    materialName: 'Seasoned Burmese Teak & Dhamrai Kiln Terracotta',
    originLabel: 'Kiln-Seasoned Heartwood & Dhamrai Artisanal Clay',
    tectonicRole: 'Operable Brise-Soleil Facade Louvers & Baithak Screening',
    acousticThermalNote: '62% Solar Heat Gain Reduction Before Glazing Line',
    lightingMood: 'GOLDEN HOUR WESTERN FILTER (17:15 BST)',
    accentHex: '#C28E5C',
    surfaceGradient: 'radial-gradient(circle at 60% 40%, #78350F 0%, #1C1917 74%)',
    imageSrc: IMAGE_ASSETS.dhanmondiTerrace,
    essay:
      'Hand-finished Burmese teak louvers pivot on marine-grade bronze bearings—filtering western golden-hour sunlight into rhythmic patterns across the interior living gallery.',
  },
  {
    id: 'mat-glass-bronze',
    index: '04',
    materialName: '42.52mm Laminated Low-Iron Glass & Patinated Architectural Bronze',
    originLabel: 'Triple-Silver Low-E Acoustic Glazing & Hand-Rubbed Bronze',
    tectonicRole: 'Hermetic Acoustic Curtain Wall & Custom Hardware Joinery',
    acousticThermalNote: '44 dB Exterior Traffic & Monsoon Thunder Attenuation',
    lightingMood: 'NOCTURNAL SANCTUARY LANTERN GLOW (20:30 BST)',
    accentHex: '#FDE68A',
    surfaceGradient: 'radial-gradient(circle at 70% 50%, #3F3A34 0%, #0C0A09 78%)',
    imageSrc: IMAGE_ASSETS.baridharaPavilion,
    essay:
      'Two thick low-iron glass lites bonded with an acoustic PVB interlayer and argon cavity transform the bustling metropolis outside into a silent visual panorama.',
  },
];

/**
 * 23 & 25 — SCROLL-BOUND MATERIAL & TACTILE SHADER EXPERIENCE
 * Scroll through Concrete -> Roman Travertine -> Burmese Teak -> Acoustic Glass & Bronze.
 * Lighting and specular sheen shift continuously with the active material state.
 */
export const ScrollMaterialAlchemyScene: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [activeMatIdx, setActiveMatIdx] = useState<number>(0);
  const [lightAngle, setLightAngle] = useState<number>(25);

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    if (!section || !pinEl) return;

    if (prefersReducedMotion() || isMobileOrConstrainedDevice()) {
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: pinEl,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setLightAngle(Math.round(15 + p * 70));
          const idx = Math.min(
            MATERIAL_CHAPTERS.length - 1,
            Math.max(0, Math.floor(p * MATERIAL_CHAPTERS.length))
          );
          setActiveMatIdx((prev) => (prev !== idx ? idx : prev));
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const currentMat = MATERIAL_CHAPTERS[activeMatIdx] || MATERIAL_CHAPTERS[0];

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll-Driven Material Provenance & Lighting Study"
      className="relative border-b border-[#D6CEBE] bg-[#141210] text-[#FBF9F5]"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden py-12 lg:py-16 transition-colors duration-700"
        style={{ background: currentMat.surfaceGradient }}
      >
        {/* Dynamic Specular Light Beam that sweeps across the viewport on scroll */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-30 transition-transform duration-300"
          style={{
            background: `linear-gradient(${lightAngle}deg, transparent 25%, ${currentMat.accentHex}33 50%, transparent 75%)`,
          }}
        />

        {/* Header */}
        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#FBF9F5]/20 pb-4">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-[#C28E5C] font-semibold">
                CHAPTER 07 · SCROLL-DRIVEN MATERIAL & DIURNAL ALCHEMY
              </span>
              <span aria-hidden="true" className="text-[#D6CEBE]/40">
                ·
              </span>
              <span className="text-[#D6CEBE]">{currentMat.lightingMood}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {MATERIAL_CHAPTERS.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMatIdx(idx)}
                  className={`border px-3 py-1 font-mono text-[10px] transition-colors cursor-pointer ${
                    activeMatIdx === idx
                      ? 'border-[#C28E5C] bg-[#C28E5C] text-[#141210] font-semibold'
                      : 'border-[#FBF9F5]/25 text-[#D6CEBE] hover:border-[#FBF9F5]'
                  }`}
                >
                  {m.index}. {m.materialName.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Material Specimen & Specular Lighting Showcase */}
        <div className="relative z-10 mx-auto my-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-10 px-6 py-8 md:px-12 lg:grid-cols-12">
          {/* Left 6 Columns: Tactile Surface Specimen Plate with Specular Shader Sheen */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/11] w-full overflow-hidden border border-[#FBF9F5]/25 bg-[#141210] shadow-2xl">
              <img
                src={currentMat.imageSrc}
                alt={currentMat.materialName}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-all duration-700 scale-105"
              />
              {/* Simulated Shader Refraction / Specular Sweep */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at ${lightAngle}% 45%, rgba(255,250,240,0.45), transparent 60%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#141210]/85 px-4 py-3 font-mono text-[11px] text-[#D6CEBE]">
                <span>SPECIMEN PLATE {currentMat.index} / 04</span>
                <span style={{ color: currentMat.accentHex }}>
                  SOLAR INCIDENCE: {lightAngle}°
                </span>
              </div>
            </div>
          </div>

          {/* Right 6 Columns: Material Provenance & Performance */}
          <div className="space-y-6 lg:col-span-6 lg:pl-6">
            <div className="inline-flex items-center gap-2 border border-[#FBF9F5]/25 bg-[#141210]/60 px-3 py-1 font-mono text-xs text-[#C28E5C]">
              <span>MATERIAL {currentMat.index}</span>
              <span>·</span>
              <span>{currentMat.originLabel}</span>
            </div>

            <h2 className="font-serif text-3xl font-normal leading-[1.08] text-[#FBF9F5] sm:text-5xl">
              {currentMat.materialName}
            </h2>

            <p className="text-sm leading-relaxed text-[#D6CEBE]/90 sm:text-base">
              {currentMat.essay}
            </p>

            <dl className="grid grid-cols-1 gap-4 border-t border-b border-[#FBF9F5]/20 py-5 text-xs sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] text-[#A8A29E]">
                  TECTONIC APPLICATION
                </dt>
                <dd className="mt-1 font-medium text-[#FBF9F5]">
                  {currentMat.tectonicRole}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] text-[#A8A29E]">
                  ACOUSTIC & CLIMATIC RATING
                </dt>
                <dd
                  className="mt-1 font-mono font-semibold"
                  style={{ color: currentMat.accentHex }}
                >
                  {currentMat.acousticThermalNote}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Bottom Caption */}
        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-6 md:px-12">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#D6CEBE]/70">
            <span>
              SCROLL TO TRANSITION BETWEEN ARCHITECTURAL MATERIALS & DIURNAL SOLAR ANGLES
            </span>
            <span>FIFTY-YEAR MONSOON PATINA STANDARD</span>
          </div>
        </div>
      </div>
    </section>
  );
};
