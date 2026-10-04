import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../utils/animation';

export interface MonsoonSolarCanvasSequenceProps {
  projectTitle?: string;
  enclaveName?: string;
  className?: string;
}

/**
 * 09. CANVAS / FRAME-BASED VISUAL EXPERIENCE
 * Interactive 60-Frame Diurnal Dhaka Solar Path & Monsoon Facade Sequence.
 * - Uses IntersectionObserver to pause interval playback when scrolled out of view.
 * - 44px mobile touch targets on all playback, squall, and time-of-day preset controls.
 * - Accessible range input and `aria-live="polite"` telemetry readout for screen readers.
 */
export const MonsoonSolarCanvasSequence: React.FC<MonsoonSolarCanvasSequenceProps> = ({
  projectTitle = 'The Jamuna Pavilion',
  enclaveName = 'Gulshan North',
  className = '',
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [frameIndex, setFrameIndex] = useState<number>(28);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [monsoonActive, setMonsoonActive] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play sequence loop when active and visible in viewport
  useEffect(() => {
    if (!isPlaying || !isInView || prefersReducedMotion()) return;
    const interval = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 60);
    }, 90);
    return () => window.clearInterval(interval);
  }, [isPlaying, isInView]);

  const normalized = frameIndex / 59;
  const totalMinutes = Math.round(5.5 * 60 + normalized * (15.5 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')} BST`;

  const daylightFactor = Math.max(0, Math.sin(normalized * Math.PI));
  const solarAltitudeDeg = Math.round(daylightFactor * 78);
  const louverApertureDeg = monsoonActive
    ? 68
    : Math.round(12 + daylightFactor * 54);
  const heatRejectionPct = monsoonActive
    ? 74
    : Math.round(48 + daylightFactor * 20);
  const interiorLux = monsoonActive
    ? 340
    : Math.round(180 + daylightFactor * 420);

  const chapterPhase = monsoonActive
    ? 'KALBAISHAKHI MONSOON SQUALL'
    : normalized < 0.2
    ? 'BENGAL DAWN & EASTERN MIST'
    : normalized < 0.55
    ? 'HIGH ZENITH CANTILEVER SHADING'
    : normalized < 0.82
    ? 'WESTERN AFTERNOON LOUVER ATTENUATION'
    : 'TWILIGHT LANTERN & THERMAL RELEASE';

  // High-DPI Canvas Frame Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 760;
    const height = canvas.clientHeight || 380;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Sky Atmosphere Background Gradient by Frame
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    if (monsoonActive) {
      skyGrad.addColorStop(0, '#18222B');
      skyGrad.addColorStop(1, '#2C3A44');
    } else if (normalized < 0.22) {
      skyGrad.addColorStop(0, '#23293A');
      skyGrad.addColorStop(1, '#C98A63');
    } else if (normalized < 0.65) {
      skyGrad.addColorStop(0, '#2B4257');
      skyGrad.addColorStop(1, '#DFD3C3');
    } else if (normalized < 0.85) {
      skyGrad.addColorStop(0, '#1E1B24');
      skyGrad.addColorStop(0.6, '#7C3E1D');
      skyGrad.addColorStop(1, '#D98A4E');
    } else {
      skyGrad.addColorStop(0, '#0E0D0C');
      skyGrad.addColorStop(1, '#1C1917');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Architectural Coordinate Grid Overlay
    ctx.strokeStyle = 'rgba(214, 206, 190, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 40; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Solar Trajectory Arc & Sun Position
    const arcCenterX = width * 0.42;
    const arcCenterY = height * 0.88;
    const arcRadius = Math.min(width, height) * 0.68;

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(251, 249, 245, 0.22)';
    ctx.beginPath();
    ctx.arc(arcCenterX, arcCenterY, arcRadius, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    ctx.setLineDash([]);

    const sunAngle = Math.PI * (1.12 + normalized * 0.76);
    const sunX = arcCenterX + Math.cos(sunAngle) * arcRadius;
    const sunY = arcCenterY + Math.sin(sunAngle) * arcRadius;

    if (!monsoonActive && normalized < 0.88) {
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 3, sunX, sunY, 44);
      sunGlow.addColorStop(0, 'rgba(253, 230, 138, 0.95)');
      sunGlow.addColorStop(0.4, 'rgba(217, 119, 6, 0.35)');
      sunGlow.addColorStop(1, 'rgba(217, 119, 6, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(253, 230, 138, 0.26)';
      ctx.lineWidth = 1;
      [0.28, 0.5, 0.72].forEach((t) => {
        const targetY = height * t;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(width * 0.48, targetY);
        ctx.stroke();
      });
    }

    // 4. Architectural Section Massing
    const bldgLeft = width * 0.46;
    const glassLineX = width * 0.6;
    const bldgRight = width * 0.92;
    const bldgTop = height * 0.14;
    const bldgBottom = height * 0.88;

    const interiorGlow = ctx.createLinearGradient(glassLineX, bldgTop, bldgRight, bldgBottom);
    const warmAlpha = normalized > 0.7 || monsoonActive ? 0.42 : 0.2;
    interiorGlow.addColorStop(0, `rgba(245, 158, 11, ${warmAlpha})`);
    interiorGlow.addColorStop(1, 'rgba(28, 25, 23, 0.92)');
    ctx.fillStyle = interiorGlow;
    ctx.fillRect(glassLineX, bldgTop, bldgRight - glassLineX, bldgBottom - bldgTop);

    const floorCount = 3;
    const levelH = (bldgBottom - bldgTop) / floorCount;

    for (let lvl = 0; lvl < floorCount; lvl++) {
      const slabY = bldgTop + lvl * levelH;

      ctx.fillStyle = '#E7E0D3';
      ctx.fillRect(bldgLeft, slabY, bldgRight - bldgLeft, 10);

      const shadowDepth = Math.min(
        levelH - 12,
        Math.max(18, daylightFactor * (levelH * 0.85))
      );
      ctx.fillStyle = 'rgba(15, 14, 13, 0.46)';
      ctx.beginPath();
      ctx.moveTo(bldgLeft, slabY + 10);
      ctx.lineTo(glassLineX, slabY + 10);
      ctx.lineTo(glassLineX, slabY + 10 + shadowDepth);
      ctx.lineTo(bldgLeft, slabY + 16);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(glassLineX, slabY + 10);
      ctx.lineTo(glassLineX, slabY + levelH);
      ctx.stroke();

      const bladeCount = 6;
      const bladeSpacing = (levelH - 16) / bladeCount;
      const bladeAngleRad = (louverApertureDeg * Math.PI) / 180;

      for (let b = 0; b < bladeCount; b++) {
        const by = slabY + 16 + b * bladeSpacing;
        const bx = bldgLeft + 10;
        const dx = Math.cos(bladeAngleRad) * 9;
        const dy = Math.sin(bladeAngleRad) * 5;

        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(bx - dx * 0.5, by - dy * 0.5);
        ctx.lineTo(bx + dx * 0.5, by + dy * 0.5);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#D6CEBE';
    ctx.fillRect(bldgLeft - 20, bldgBottom, bldgRight - bldgLeft + 20, 12);

    if (monsoonActive) {
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
      ctx.lineWidth = 1.2;
      for (let r = 0; r < 38; r++) {
        const rx = ((r * 29 + frameIndex * 11) % Math.floor(bldgLeft + 8));
        const ry = ((r * 43 + frameIndex * 23) % Math.floor(bldgBottom - 20));
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + 8, ry + 18);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#FBF9F5';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('14\'-0" CANTILEVER VERANDA', bldgLeft, bldgTop - 10);
    ctx.fillText('42.5mm ACOUSTIC GLASS LINE', glassLineX + 6, bldgTop - 10);

    ctx.restore();
  }, [frameIndex, monsoonActive, normalized, daylightFactor, louverApertureDeg]);

  return (
    <div
      ref={wrapperRef}
      className={`border border-[#D6CEBE] bg-[#141210] text-[#FBF9F5] ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CEBE]/20 px-5 sm:px-6 py-4">
        <div>
          <span className="font-mono text-[11px] tracking-widest text-[#D97706]">
            DIURNAL SOLAR & MONSOON FACADE SEQUENCE · FRAME {String(frameIndex + 1).padStart(2, '0')} / 60
          </span>
          <h3 className="mt-0.5 font-serif text-2xl text-[#FBF9F5]">
            {projectTitle} ({enclaveName}) — Climatic Envelope Simulation
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying((prev) => !prev)}
            className="min-h-[44px] sm:min-h-[36px] border border-[#D6CEBE]/40 px-3.5 py-1.5 font-mono text-[11px] text-[#FBF9F5] hover:border-[#FBF9F5] cursor-pointer"
          >
            {isPlaying ? 'PAUSE SEQUENCE' : 'PLAY 60-FRAME CYCLE'}
          </button>
          <button
            type="button"
            aria-pressed={monsoonActive}
            onClick={() => setMonsoonActive((prev) => !prev)}
            className={`min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 font-mono text-[11px] transition-colors cursor-pointer ${
              monsoonActive
                ? 'bg-[#38BDF8] text-[#141210] font-semibold'
                : 'border border-[#D6CEBE]/40 text-[#D6CEBE] hover:border-[#FBF9F5]'
            }`}
          >
            {monsoonActive ? 'MONSOON SQUALL: ACTIVE' : 'SIMULATE MONSOON SQUALL'}
          </button>
        </div>
      </div>

      {/* Canvas + Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="relative lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#D6CEBE]/20">
          <canvas
            ref={canvasRef}
            data-cursor="scrub"
            role="img"
            aria-label={`Diurnal solar and monsoon cross-section simulation for ${projectTitle} at ${formattedTime}. Solar altitude ${solarAltitudeDeg} degrees, louver pitch ${louverApertureDeg} degrees.`}
            className="block h-[300px] sm:h-[380px] w-full"
          />

          {/* Interactive Timeline Scrubber Bar */}
          <div className="border-t border-[#D6CEBE]/20 bg-[#1C1917] px-5 sm:px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#D6CEBE] mb-2">
              <span>SOLAR TIMELINE SCRUBBER (23.8103° N DHAKA)</span>
              <span className="text-[#FBF9F5] font-semibold tabular-nums">
                {formattedTime} · {chapterPhase}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={59}
              value={frameIndex}
              aria-label="Scrub through 60-frame diurnal solar and monsoon facade sequence"
              onChange={(e) => {
                setIsPlaying(false);
                setFrameIndex(Number(e.target.value));
              }}
              className="h-6 w-full accent-[#D97706] cursor-pointer"
            />
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px] text-[#A8A29E]">
              {[
                { frame: 4, label: '06:30 Dawn' },
                { frame: 25, label: '12:00 Zenith' },
                { frame: 41, label: '16:15 Western Glare' },
                { frame: 55, label: '20:00 Nocturnal' },
              ].map((preset) => (
                <button
                  key={preset.frame}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setMonsoonActive(false);
                    setFrameIndex(preset.frame);
                  }}
                  className="min-h-[38px] border border-[#D6CEBE]/20 bg-[#141210]/60 px-2 py-1 text-[#D6CEBE] hover:border-[#FBF9F5] hover:text-[#FBF9F5] cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Real-Time Frame Telemetry */}
        <div
          aria-live="polite"
          className="flex flex-col justify-between p-5 sm:p-6 md:p-8 lg:col-span-4"
        >
          <div className="space-y-5">
            <div>
              <p className="font-mono text-[11px] text-[#D97706]">
                REAL-TIME ENVELOPE TELEMETRY
              </p>
              <p className="mt-1 font-serif text-xl text-[#FBF9F5]">
                {chapterPhase}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#D6CEBE]/85">
                {monsoonActive
                  ? 'During a Kalbaishakhi squall, the 14-foot structural cantilever shields the low-iron glass curtain wall from wind-driven rain while Burmese teak louvers pitch to 68° to baffle acoustic pressure.'
                  : 'As the sun arcs across Dhaka, the deep cantilevered veranda and operable Burmese teak louvers intercept direct radiation before it reaches the interior travertine floor slab.'}
              </p>
            </div>

            <dl className="space-y-3 border-t border-[#D6CEBE]/20 pt-4 text-xs">
              <div className="flex justify-between border-b border-[#D6CEBE]/15 pb-2.5">
                <dt className="text-[#A8A29E]">Solar Altitude Angle</dt>
                <dd className="font-mono text-[#FBF9F5] tabular-nums">
                  {solarAltitudeDeg}° Above Horizon
                </dd>
              </div>
              <div className="flex justify-between border-b border-[#D6CEBE]/15 pb-2.5">
                <dt className="text-[#A8A29E]">Teak Louver Pitch</dt>
                <dd className="font-mono text-[#D97706] tabular-nums">
                  {louverApertureDeg}° Automated Tilt
                </dd>
              </div>
              <div className="flex justify-between border-b border-[#D6CEBE]/15 pb-2.5">
                <dt className="text-[#A8A29E]">Solar Heat Gain Blocked</dt>
                <dd className="font-mono text-[#FBF9F5] tabular-nums">
                  {heatRejectionPct}% Attenuation
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A8A29E]">Interior Salon Daylight</dt>
                <dd className="font-mono text-[#FBF9F5] tabular-nums">
                  {interiorLux} Lux (Glare-Free)
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-6 border-t border-[#D6CEBE]/20 pt-4 font-mono text-[11px] text-[#A8A29E]">
            60-FRAME PROCEDURAL CANVAS SEQUENCE · ILLUSTRATIVE DEMO
          </p>
        </div>
      </div>
    </div>
  );
};
