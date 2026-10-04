import React, { useEffect, useState } from 'react';
import { FloorPlan, FloorPlanZone, PropertyUnit } from '../../types/realEstate';
import { ActionButton } from '../ui/Primitives';
import { ArchitecturalIcon } from '../ui/ArchitecturalIcon';

export interface FloorPlanViewerProps {
  floorPlans: FloorPlan[];
  projectTitle?: string;
  projectSlug?: string;
  units?: PropertyUnit[];
  selectedPlanId?: string;
  onSelectPlanId?: (planId: string) => void;
  inquiryHref?: string;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  floorPlans,
  projectTitle = 'Monograph Residence',
  projectSlug,
  units,
  selectedPlanId,
  onSelectPlanId,
  inquiryHref,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [activeZoneIndex, setActiveZoneIndex] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [showDimensionLayer, setShowDimensionLayer] = useState<boolean>(true);
  const [showStructuralGrid, setShowStructuralGrid] = useState<boolean>(true);
  const [projectionMode, setProjectionMode] = useState<'2d' | '3d-axonometric'>(
    '3d-axonometric'
  );

  // Sync external selectedPlanId if controlled
  useEffect(() => {
    if (!selectedPlanId || !floorPlans) return;
    const foundIdx = floorPlans.findIndex((p) => p.id === selectedPlanId);
    if (foundIdx !== -1) {
      setInternalIndex(foundIdx);
    }
  }, [selectedPlanId, floorPlans]);

  // Reset active zone and zoom whenever the selected floor plate changes
  useEffect(() => {
    setActiveZoneIndex(0);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, [internalIndex]);

  if (!floorPlans || floorPlans.length === 0) return null;

  const activePlan = floorPlans[internalIndex] || floorPlans[0];
  const activeUnit =
    units?.find((u) => u.floorPlanId === activePlan.id) ||
    (units && units[internalIndex] ? units[internalIndex] : undefined);
  const currentZone: FloorPlanZone | null =
    activePlan.zones[activeZoneIndex] || activePlan.zones[0] || null;

  const resolvedInquiryHref =
    inquiryHref ||
    (projectSlug
      ? `/contact?project=${projectSlug}&intent=floorplan`
      : '/contact?intent=floorplan');

  const handleSelectPlan = (index: number, planId: string) => {
    setInternalIndex(index);
    if (onSelectPlanId) {
      onSelectPlanId(planId);
    }
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.25, 1.75));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleZoomReset = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    setDragOrigin({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoomScale <= 1) return;
    const maxPan = (zoomScale - 1) * 140;
    const nextX = Math.max(
      -maxPan,
      Math.min(maxPan, e.clientX - dragOrigin.x)
    );
    const nextY = Math.max(
      -maxPan,
      Math.min(maxPan, e.clientY - dragOrigin.y)
    );
    setPanOffset({ x: nextX, y: nextY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="border border-[#D6CEBE] bg-[#FBF9F5]">
      {/* Top Unit / Plate Selector Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#D6CEBE] bg-[#EBE6DF]/60 px-5 py-4 sm:px-6 lg:flex-row lg:items-center">
        <div>
          <span className="font-mono text-xs text-[#78350F]">
            ARCHITECTURAL FLOOR PLATE & 3D AXONOMETRIC SYNCHRONIZER
          </span>
          <h3 className="mt-1 font-serif text-2xl font-normal text-[#1C1917]">
            {activePlan.title}
          </h3>
        </div>

        {/* Unit / Floor Plan Selector Tabs */}
        <div
          role="tablist"
          aria-label={`Select floor plan plate for ${projectTitle}`}
          className="flex flex-wrap gap-2"
        >
          {floorPlans.map((plan, index) => {
            const isSelected = index === internalIndex;
            const matchingUnit =
              units?.find((u) => u.floorPlanId === plan.id) ||
              (units && units[index]);
            return (
              <button
                key={plan.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => handleSelectPlan(index, plan.id)}
                className={`min-h-[44px] px-4 py-2 text-left text-xs transition-colors duration-150 cursor-pointer border ${
                  isSelected
                    ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                    : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#44403C] hover:border-[#1C1917] hover:text-[#1C1917]'
                }`}
              >
                <span className="block font-mono text-[10px] opacity-80">
                  {matchingUnit ? matchingUnit.unitCode : plan.levelLabel}
                </span>
                <span className="font-medium">{plan.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Metrics Bar for Active Residence Plate */}
      <div className="grid grid-cols-2 gap-px border-b border-[#D6CEBE] bg-[#D6CEBE] sm:grid-cols-3 lg:grid-cols-6">
        <div className="bg-[#FBF9F5] p-4">
          <span className="block text-[11px] text-[#78716C]">Elevation Level</span>
          <span className="mt-1 block font-mono text-sm font-medium text-[#1C1917]">
            {activePlan.levelLabel}
          </span>
        </div>
        <div className="bg-[#FBF9F5] p-4">
          <span className="block text-[11px] text-[#78716C]">Gross Floor Area</span>
          <span className="mt-1 block font-mono text-sm font-medium text-[#1C1917] tabular-nums">
            {activePlan.grossAreaSqFt.toLocaleString('en-IN')} sq. ft.
          </span>
        </div>
        <div className="bg-[#FBF9F5] p-4">
          <span className="block text-[11px] text-[#78716C]">Suite Configuration</span>
          <span className="mt-1 block font-mono text-sm font-medium text-[#1C1917]">
            {activePlan.bedrooms} Bedrooms
          </span>
        </div>
        <div className="bg-[#FBF9F5] p-4">
          <span className="block text-[11px] text-[#78716C]">Ceiling Clear Height</span>
          <span className="mt-1 block font-mono text-sm font-medium text-[#1C1917]">
            {activePlan.ceilingHeightFeet} ft. Clear
          </span>
        </div>
        <div className="bg-[#FBF9F5] p-4">
          <span className="block text-[11px] text-[#78716C]">Exposure & Aspect</span>
          <span className="mt-1 block font-mono text-xs font-medium text-[#1C1917]">
            {activeUnit ? activeUnit.orientation : activePlan.compassOrientation}
          </span>
        </div>
        <div className="bg-[#FBF9F5] p-4">
          <span className="block text-[11px] text-[#78716C]">Allocation Status</span>
          <span className="mt-1 block font-mono text-xs font-medium text-[#78350F]">
            {activeUnit
              ? activeUnit.allocationStatus
              : 'Available for Private Briefing'}
          </span>
        </div>
      </div>

      {/* Main Split Interactive Canvas: 7 Cols Blueprint & 3D Axonometric Plate + 5 Cols Spatial Zone Schedule */}
      <div className="grid grid-cols-1 gap-8 p-5 sm:p-6 lg:grid-cols-12 lg:p-8">
        {/* Left 7 Cols: Interactive Vector Architectural Drawing with 2D / 3D Axonometric Extrusion */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {/* Interactive CAD Controls Bar */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border border-[#D6CEBE] bg-[#EBE6DF]/50 px-3.5 py-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={projectionMode === '2d'}
                onClick={() => setProjectionMode('2d')}
                className={`min-h-[40px] sm:min-h-[32px] border px-3 py-1 font-mono text-[10px] tracking-wider transition-colors cursor-pointer ${
                  projectionMode === '2d'
                    ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                    : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#57534E] hover:border-[#1C1917]'
                }`}
              >
                2D CAD BLUEPRINT
              </button>
              <button
                type="button"
                aria-pressed={projectionMode === '3d-axonometric'}
                onClick={() => setProjectionMode('3d-axonometric')}
                className={`min-h-[40px] sm:min-h-[32px] border px-3 py-1 font-mono text-[10px] tracking-wider transition-colors cursor-pointer ${
                  projectionMode === '3d-axonometric'
                    ? 'border-[#78350F] bg-[#78350F] text-[#FBF9F5]'
                    : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#57534E] hover:border-[#78350F]'
                }`}
              >
                3D AXONOMETRIC VOLUME
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomScale <= 1}
                aria-label="Zoom out floor plan"
                className="min-h-[40px] min-w-[40px] sm:min-h-[32px] sm:min-w-[32px] border border-[#D6CEBE] bg-[#FBF9F5] px-2.5 py-1 font-mono text-xs text-[#1C1917] hover:border-[#1C1917] disabled:opacity-40 cursor-pointer"
              >
                −
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                aria-label="Reset floor plan zoom to 100 percent"
                className="min-h-[40px] sm:min-h-[32px] border border-[#D6CEBE] bg-[#FBF9F5] px-2.5 py-1 font-mono text-[11px] text-[#1C1917] hover:border-[#1C1917] cursor-pointer"
              >
                100%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomScale >= 1.75}
                aria-label="Zoom in floor plan"
                className="min-h-[40px] min-w-[40px] sm:min-h-[32px] sm:min-w-[32px] border border-[#D6CEBE] bg-[#FBF9F5] px-2.5 py-1 font-mono text-xs text-[#1C1917] hover:border-[#1C1917] disabled:opacity-40 cursor-pointer"
              >
                +
              </button>

              <button
                type="button"
                aria-pressed={showDimensionLayer}
                onClick={() => setShowDimensionLayer((prev) => !prev)}
                className={`min-h-[40px] sm:min-h-[32px] border px-2.5 py-1 font-mono text-[10px] transition-colors cursor-pointer ${
                  showDimensionLayer
                    ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                    : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#57534E]'
                }`}
              >
                DIMS
              </button>

              <button
                type="button"
                aria-pressed={showStructuralGrid}
                onClick={() => setShowStructuralGrid((prev) => !prev)}
                className={`min-h-[40px] sm:min-h-[32px] border px-2.5 py-1 font-mono text-[10px] transition-colors cursor-pointer ${
                  showStructuralGrid
                    ? 'border-[#1C1917] bg-[#1C1917] text-[#FBF9F5]'
                    : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#57534E]'
                }`}
              >
                GRID
              </button>
            </div>
          </div>

          {/* Blueprint & 3D Axonometric Viewport Container */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            data-cursor={zoomScale > 1 ? 'DRAG' : 'EXPLORE'}
            className={`relative aspect-[4/3] w-full overflow-hidden border border-[#D6CEBE] transition-colors duration-500 ${
              projectionMode === '3d-axonometric'
                ? 'bg-[#141210] text-[#FBF9F5]'
                : 'bg-[#FBF9F5] text-[#1C1917]'
            } ${zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={{ perspective: '1200px' }}
          >
            {/* Subtle Spatial Mode Status Overlay */}
            <div className="pointer-events-none absolute top-3 left-3.5 z-20 flex items-center gap-2 font-mono text-[10px] tracking-widest opacity-80">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C28E5C]" />
              <span>
                {projectionMode === '3d-axonometric'
                  ? 'AXONOMETRIC VOLUMETRIC EXTRUSION · SELECT ANY ROOM'
                  : 'ORTHOGRAPHIC 1:100 PLAN · SELECT ANY ROOM'}
              </span>
            </div>

            <div
              className="h-full w-full transition-transform duration-700 ease-out origin-center flex items-center justify-center"
              style={{
                transform:
                  projectionMode === '3d-axonometric'
                    ? `translate3d(${panOffset.x}px, ${panOffset.y - 6}px, 0) scale(${zoomScale * 0.88}) rotateX(52deg) rotateZ(-32deg)`
                    : `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale}) rotateX(0deg) rotateZ(0deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full select-none overflow-visible"
                role="group"
                aria-label={`Interactive architectural floor plan for ${activePlan.title}. Select any room zone to inspect dimensions.`}
              >
                {/* Subtle Structural Grid Lines */}
                {showStructuralGrid &&
                  [20, 40, 60, 80].map((pos) => (
                    <React.Fragment key={pos}>
                      <line
                        x1={pos}
                        y1="4"
                        x2={pos}
                        y2="96"
                        stroke={
                          projectionMode === '3d-axonometric'
                            ? '#3F3A34'
                            : '#D6CEBE'
                        }
                        strokeWidth="0.25"
                        strokeDasharray="1 1"
                      />
                      <line
                        x1="4"
                        y1={pos}
                        x2="96"
                        y2={pos}
                        stroke={
                          projectionMode === '3d-axonometric'
                            ? '#3F3A34'
                            : '#D6CEBE'
                        }
                        strokeWidth="0.25"
                        strokeDasharray="1 1"
                      />
                    </React.Fragment>
                  ))}

                {/* Outer Structural Perimeter Slab */}
                <rect
                  x="6"
                  y="6"
                  width="88"
                  height="88"
                  fill={
                    projectionMode === '3d-axonometric' ? '#1C1917' : '#FBF9F5'
                  }
                  stroke={
                    projectionMode === '3d-axonometric' ? '#C28E5C' : '#1C1917'
                  }
                  strokeWidth="0.65"
                />

                {/* Interactive & Keyboard-Accessible Spatial Zones */}
                {activePlan.zones.map((zone: FloorPlanZone, idx: number) => {
                  const isSelected = idx === activeZoneIndex;
                  const extrudeOffset =
                    projectionMode === '3d-axonometric'
                      ? isSelected
                        ? -4.2
                        : -1.6
                      : 0;

                  return (
                    <g
                      key={zone.name}
                      role="button"
                      tabIndex={0}
                      aria-label={`Zone 0${idx + 1}: ${zone.name}, ${zone.dimensionsFeet}, ${zone.areaSqFt} square feet, ${zone.orientation}`}
                      aria-pressed={isSelected}
                      onClick={() => setActiveZoneIndex(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveZoneIndex(idx);
                        }
                      }}
                      className="cursor-pointer transition-all duration-500 focus:outline-none"
                    >
                      {/* Base footprint shadow in 3D axonometric mode */}
                      {projectionMode === '3d-axonometric' && (
                        <rect
                          x={zone.xPercent}
                          y={zone.yPercent}
                          width={zone.widthPercent}
                          height={zone.heightPercent}
                          fill="#0C0A09"
                          fillOpacity="0.7"
                          stroke="#57534E"
                          strokeWidth="0.25"
                        />
                      )}

                      {/* Side wall extrusion polygons in 3D axonometric mode */}
                      {projectionMode === '3d-axonometric' && (
                        <>
                          <polygon
                            points={`${zone.xPercent},${zone.yPercent + zone.heightPercent} ${zone.xPercent + zone.widthPercent},${zone.yPercent + zone.heightPercent} ${zone.xPercent + zone.widthPercent + extrudeOffset},${zone.yPercent + zone.heightPercent + extrudeOffset} ${zone.xPercent + extrudeOffset},${zone.yPercent + zone.heightPercent + extrudeOffset}`}
                            fill={isSelected ? '#9A5B25' : '#292524'}
                            fillOpacity={isSelected ? '0.85' : '0.65'}
                            stroke={isSelected ? '#F5D0A9' : '#57534E'}
                            strokeWidth="0.25"
                          />
                          <polygon
                            points={`${zone.xPercent + zone.widthPercent},${zone.yPercent} ${zone.xPercent + zone.widthPercent},${zone.yPercent + zone.heightPercent} ${zone.xPercent + zone.widthPercent + extrudeOffset},${zone.yPercent + zone.heightPercent + extrudeOffset} ${zone.xPercent + zone.widthPercent + extrudeOffset},${zone.yPercent + extrudeOffset}`}
                            fill={isSelected ? '#78350F' : '#1C1917'}
                            fillOpacity={isSelected ? '0.9' : '0.75'}
                            stroke={isSelected ? '#F5D0A9' : '#57534E'}
                            strokeWidth="0.25"
                          />
                        </>
                      )}

                      {/* Main Floor / Roof Cap Plane */}
                      <rect
                        x={zone.xPercent + extrudeOffset}
                        y={zone.yPercent + extrudeOffset}
                        width={zone.widthPercent}
                        height={zone.heightPercent}
                        fill={
                          projectionMode === '3d-axonometric'
                            ? isSelected
                              ? '#C28E5C'
                              : '#292524'
                            : isSelected
                              ? '#78350F'
                              : '#EBE6DF'
                        }
                        fillOpacity={
                          projectionMode === '3d-axonometric'
                            ? isSelected
                              ? '0.42'
                              : '0.75'
                            : isSelected
                              ? '0.18'
                              : '0.65'
                        }
                        stroke={
                          projectionMode === '3d-axonometric'
                            ? isSelected
                              ? '#FDE68A'
                              : '#78716C'
                            : isSelected
                              ? '#78350F'
                              : '#57534E'
                        }
                        strokeWidth={isSelected ? '0.9' : '0.35'}
                      />

                      {/* Zone Index Label */}
                      <text
                        x={zone.xPercent + extrudeOffset + 2.5}
                        y={zone.yPercent + extrudeOffset + 5.5}
                        fontSize="3.0"
                        fontFamily="JetBrains Mono, monospace"
                        fill={
                          projectionMode === '3d-axonometric'
                            ? isSelected
                              ? '#FDE68A'
                              : '#A8A29E'
                            : isSelected
                              ? '#78350F'
                              : '#57534E'
                        }
                      >
                        0{idx + 1}
                      </text>

                      {/* Zone Dimension Callout */}
                      {showDimensionLayer && (
                        <text
                          x={
                            zone.xPercent +
                            extrudeOffset +
                            zone.widthPercent / 2
                          }
                          y={
                            zone.yPercent +
                            extrudeOffset +
                            zone.heightPercent / 2
                          }
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="2.75"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                          fontWeight={isSelected ? '600' : '400'}
                          fill={
                            projectionMode === '3d-axonometric'
                              ? '#FBF9F5'
                              : '#1C1917'
                          }
                        >
                          {zone.dimensionsFeet}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Compass Orientation Indicator */}
                <g transform="translate(91, 11)" aria-hidden="true">
                  <circle
                    cx="0"
                    cy="0"
                    r="3.2"
                    fill={
                      projectionMode === '3d-axonometric'
                        ? '#1C1917'
                        : '#FBF9F5'
                    }
                    stroke={
                      projectionMode === '3d-axonometric'
                        ? '#C28E5C'
                        : '#1C1917'
                    }
                    strokeWidth="0.3"
                  />
                  <path d="M0 -2.4 L1 1.5 L0 0.7 L-1 1.5 Z" fill="#C28E5C" />
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fontSize="2.2"
                    fontFamily="JetBrains Mono, monospace"
                    fill={
                      projectionMode === '3d-axonometric'
                        ? '#FBF9F5'
                        : '#1C1917'
                    }
                  >
                    N
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[#44403C]">
            {activePlan.architecturalNotes}
          </p>
        </div>

        {/* Right 5 Cols: Interactive Zone Schedule, Active Room Details & CTA */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-[#1C1917]">
                Spatial Zone Schedule (Synchronized with 2D/3D Plate)
              </h4>
              <span className="font-mono text-[11px] text-[#78716C] tabular-nums">
                {activePlan.zones.length} ZONES
              </span>
            </div>

            <div className="mt-3 divide-y divide-[#D6CEBE] border-t border-b border-[#D6CEBE]">
              {activePlan.zones.map((zone: FloorPlanZone, idx: number) => {
                const isSelected = idx === activeZoneIndex;
                return (
                  <button
                    key={zone.name}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveZoneIndex(idx)}
                    className={`flex min-h-[54px] w-full items-center justify-between py-3.5 px-3 text-left transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EBE6DF] text-[#1C1917]'
                        : 'hover:bg-[#EBE6DF]/40 text-[#57534E]'
                    }`}
                  >
                    <div className="flex items-baseline gap-3 pr-3">
                      <span
                        className={`font-mono text-xs tabular-nums ${
                          isSelected
                            ? 'font-semibold text-[#78350F]'
                            : 'text-[#78716C]'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <div>
                        <p className="font-serif text-base font-medium text-[#1C1917]">
                          {zone.name}
                        </p>
                        <p className="text-xs text-[#78716C]">
                          {zone.orientation}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right font-mono text-xs tabular-nums">
                      <p className="text-[#1C1917]">{zone.dimensionsFeet}</p>
                      <p className="text-[#78716C]">{zone.areaSqFt} sq. ft.</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Highlighted Zone Callout Box (Screen-Reader Live Region) + Inquiry CTA */}
          <div className="mt-6 space-y-4">
            {currentZone && (
              <div
                aria-live="polite"
                className="border border-[#1C1917] bg-[#141210] p-5 text-[#FBF9F5]"
              >
                <div className="flex items-center justify-between text-xs text-[#C28E5C]">
                  <span className="font-mono tracking-wider">
                    SYNCHRONIZED VOLUME · ZONE 0{activeZoneIndex + 1}
                  </span>
                  <span className="font-mono tabular-nums">
                    {currentZone.areaSqFt} SQ. FT.
                  </span>
                </div>
                <p className="mt-1.5 font-serif text-2xl text-[#FBF9F5]">
                  {currentZone.name}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#FBF9F5]/15 pt-3 font-mono text-[11px]">
                  <div>
                    <span className="block text-[#A8A29E]">Clear Span</span>
                    <span className="text-[#FBF9F5]">
                      {currentZone.dimensionsFeet}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#A8A29E]">Ceiling Soffit</span>
                    <span className="text-[#FBF9F5]">
                      {activePlan.ceilingHeightFeet} ft.
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#A8A29E]">Solar Aspect</span>
                    <span className="text-[#C28E5C]">
                      {currentZone.orientation}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D6CEBE] pt-4">
              <ActionButton
                to={resolvedInquiryHref}
                variant="primary"
                className="w-full sm:w-auto"
              >
                <span>
                  Request CAD Plate & Briefing
                  {activeUnit ? ` (${activeUnit.unitCode})` : ''}
                </span>
                <ArchitecturalIcon name="arrow-up-right" size={14} />
              </ActionButton>

              <span className="font-mono text-[11px] text-[#78716C]">
                DEMO ILLUSTRATIVE DATA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
