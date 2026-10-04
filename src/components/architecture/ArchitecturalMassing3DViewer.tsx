import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProjectMonograph } from '../../types/realEstate';
import {
  isWeakDevicePerformance,
  prefersReducedMotion,
} from '../../utils/animation';

export interface ArchitecturalMassing3DViewerProps {
  project: ProjectMonograph;
  className?: string;
}

type MassingMode = 'assembled' | 'exploded' | 'wireframe';
type StructuralTier = 'all' | 'podium' | 'typical' | 'penthouse';

interface FloorMeshRecord {
  group: THREE.Group;
  slabMesh: THREE.Mesh;
  coreMesh: THREE.Mesh;
  louverGroup: THREE.Group;
  baseY: number;
  floorIndex: number;
  totalFloors: number;
  tier: 'podium' | 'typical' | 'penthouse';
}

/**
 * 08. 3D / WEBGL ARCHITECTURAL MASSING & EXPLODED FLOOR-PLATE STUDIO
 * Engineered for Performance, Mobile Ergonomics, and Graceful Fallback:
 * - IntersectionObserver pauses WebGL rAF loop when scrolled off-screen (0% idle GPU usage).
 * - Automatically falls back to an interactive 2D Axonometric Architectural Blueprint SVG
 *   when WebGL is unavailable, device performance is weak, or `prefers-reduced-motion` is active.
 * - Includes an explicit user toggle between 3D WebGL and 2D Blueprint Schematic modes.
 * - Mobile scroll-safe (`touch-action: pan-y`) so vertical page scrolling is never hijacked.
 */
export const ArchitecturalMassing3DViewer: React.FC<ArchitecturalMassing3DViewerProps> = ({
  project,
  className = '',
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [massingMode, setMassingMode] = useState<MassingMode>('assembled');
  const [activeTier, setActiveTier] = useState<StructuralTier>('all');
  const [louverAngleDeg, setLouverAngleDeg] = useState<number>(35);
  const [autoRotate, setAutoRotate] = useState<boolean>(() => !prefersReducedMotion());
  const [use2DBlueprint, setUse2DBlueprint] = useState<boolean>(() =>
    prefersReducedMotion() || isWeakDevicePerformance()
  );
  const [webglErrorReason, setWebglErrorReason] = useState<string | null>(null);

  // Refs synced into the Three.js render loop
  const modeRef = useRef<MassingMode>(massingMode);
  const tierRef = useRef<StructuralTier>(activeTier);
  const louverRef = useRef<number>(louverAngleDeg);
  const autoRotateRef = useRef<boolean>(autoRotate);
  const isInViewportRef = useRef<boolean>(true);

  useEffect(() => {
    modeRef.current = massingMode;
  }, [massingMode]);

  useEffect(() => {
    tierRef.current = activeTier;
  }, [activeTier]);

  useEffect(() => {
    louverRef.current = louverAngleDeg;
  }, [louverAngleDeg]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // IntersectionObserver to pause WebGL rendering when off-screen
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewportRef.current = entry.isIntersecting;
        });
      },
      { rootMargin: '150px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (use2DBlueprint) return;
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglErrorReason(
        'WebGL hardware acceleration is unavailable on this browser/device. Switched to 2D Axonometric Blueprint mode.'
      );
      setUse2DBlueprint(true);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const canvasEl = renderer.domElement;
    // Allow vertical touch scrolling on mobile without trapping user scroll
    canvasEl.style.touchAction = 'pan-y';

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglErrorReason(
        'WebGL graphics context was interrupted. Switched to interactive 2D Axonometric Blueprint mode.'
      );
      setUse2DBlueprint(true);
    };
    const handleContextRestored = () => {
      setWebglErrorReason(null);
      setUse2DBlueprint(false);
    };
    canvasEl.addEventListener('webglcontextlost', handleContextLost);
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#141210');
    scene.fog = new THREE.FogExp2('#141210', 0.018);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 150);

    // Three-Point Architectural Studio Lighting
    const ambientLight = new THREE.AmbientLight('#D6CEBE', 0.65);
    scene.add(ambientLight);

    const sunKeyLight = new THREE.DirectionalLight('#FDE68A', 2.1);
    sunKeyLight.position.set(16, 24, 14);
    sunKeyLight.castShadow = true;
    sunKeyLight.shadow.mapSize.width = 1024;
    sunKeyLight.shadow.mapSize.height = 1024;
    sunKeyLight.shadow.camera.near = 2;
    sunKeyLight.shadow.camera.far = 60;
    const d = 14;
    sunKeyLight.shadow.camera.left = -d;
    sunKeyLight.shadow.camera.right = d;
    sunKeyLight.shadow.camera.top = d;
    sunKeyLight.shadow.camera.bottom = -d;
    scene.add(sunKeyLight);

    const fillLight = new THREE.DirectionalLight('#93C5FD', 0.75);
    fillLight.position.set(-16, 12, -12);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#D97706', 0.9);
    rimLight.position.set(0, -10, -18);
    scene.add(rimLight);

    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    const gridHelper = new THREE.GridHelper(26, 26, '#78350F', '#292524');
    gridHelper.position.y = -4.2;
    buildingGroup.add(gridHelper);

    const plinthGeo = new THREE.BoxGeometry(10.5, 0.35, 8.5);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: '#292524',
      roughness: 0.85,
      metalness: 0.1,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -4.0;
    plinthMesh.receiveShadow = true;
    buildingGroup.add(plinthMesh);

    const totalFloors = Math.min(Math.max(project.stories, 9), 16);
    const floorHeight = 0.52;
    const floorRecords: FloorMeshRecord[] = [];
    const disposableGeometries: THREE.BufferGeometry[] = [plinthGeo];
    const disposableMaterials: THREE.Material[] = [plinthMat];

    for (let i = 0; i < totalFloors; i++) {
      const isPodium = i <= 1;
      const isPenthouse = i >= totalFloors - 2;
      const tier: 'podium' | 'typical' | 'penthouse' = isPodium
        ? 'podium'
        : isPenthouse
        ? 'penthouse'
        : 'typical';

      const floorGroup = new THREE.Group();
      const baseY = -3.6 + i * floorHeight;
      floorGroup.position.y = baseY;

      const slabW = isPodium ? 7.4 : isPenthouse ? 5.6 : i % 2 === 0 ? 6.6 : 6.35;
      const slabD = isPodium ? 5.8 : isPenthouse ? 4.5 : i % 2 === 0 ? 5.1 : 4.85;
      const slabThickness = isPodium ? 0.13 : 0.095;

      const slabGeo = new THREE.BoxGeometry(slabW, slabThickness, slabD);
      const slabMat = new THREE.MeshStandardMaterial({
        color: '#E7E0D3',
        roughness: 0.6,
        metalness: 0.08,
        transparent: true,
        opacity: 1,
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      floorGroup.add(slabMesh);

      const edgeGeo = new THREE.EdgesGeometry(slabGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: '#78350F',
        transparent: true,
        opacity: 0.45,
      });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      slabMesh.add(edgeLines);

      const coreW = slabW * 0.76;
      const coreD = slabD * 0.74;
      const coreH = floorHeight - slabThickness;
      const coreGeo = new THREE.BoxGeometry(coreW, coreH, coreD);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: isPodium ? '#1C1917' : '#384854',
        roughness: 0.2,
        metalness: 0.35,
        transmission: 0.25,
        transparent: true,
        opacity: 0.88,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = coreH / 2 + slabThickness / 2;
      coreMesh.castShadow = true;
      floorGroup.add(coreMesh);

      const louverGroup = new THREE.Group();
      const finCount = isPenthouse ? 8 : 11;
      const finGeo = new THREE.BoxGeometry(0.05, coreH * 0.92, 0.24);
      const finMat = new THREE.MeshStandardMaterial({
        color: '#9A4A1A',
        roughness: 0.45,
        metalness: 0.2,
        transparent: true,
        opacity: 0.95,
      });

      for (let f = 0; f < finCount; f++) {
        const finMesh = new THREE.Mesh(finGeo, finMat);
        const xPos = -slabW * 0.42 + (f / (finCount - 1)) * (slabW * 0.84);
        finMesh.position.set(xPos, coreH / 2 + slabThickness / 2, slabD * 0.46);
        louverGroup.add(finMesh);
      }

      floorGroup.add(louverGroup);
      buildingGroup.add(floorGroup);

      disposableGeometries.push(slabGeo, edgeGeo, coreGeo, finGeo);
      disposableMaterials.push(slabMat, edgeMat, coreMat, finMat);

      floorRecords.push({
        group: floorGroup,
        slabMesh,
        coreMesh,
        louverGroup,
        baseY,
        floorIndex: i,
        totalFloors,
        tier,
      });
    }

    let targetTheta = 0.68;
    let currentTheta = 0.68;
    let targetPhi = 1.18;
    let currentPhi = 1.18;
    let targetRadius = 17.5;
    let currentRadius = 17.5;
    let currentExplosion = 0;

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      targetTheta -= dx * 0.008;
      targetPhi = Math.max(0.55, Math.min(1.48, targetPhi - dy * 0.006));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvasEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 800;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let reqId = 0;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Pause GPU rendering when component is scrolled out of the viewport
      if (!isInViewportRef.current) return;

      if (autoRotateRef.current && !isDragging && !prefersReducedMotion()) {
        targetTheta += 0.0022;
      }

      currentTheta += (targetTheta - currentTheta) * 0.08;
      currentPhi += (targetPhi - currentPhi) * 0.08;

      const desiredExplosion = modeRef.current === 'exploded' ? 1 : 0;
      currentExplosion += (desiredExplosion - currentExplosion) * 0.08;

      targetRadius = modeRef.current === 'exploded' ? 21.0 : 17.2;
      currentRadius += (targetRadius - currentRadius) * 0.08;

      camera.position.x = currentRadius * Math.sin(currentPhi) * Math.sin(currentTheta);
      camera.position.y = currentRadius * Math.cos(currentPhi) + 0.5;
      camera.position.z = currentRadius * Math.sin(currentPhi) * Math.cos(currentTheta);
      camera.lookAt(0, 0.2, 0);

      const isWireframe = modeRef.current === 'wireframe';
      const selectedTier = tierRef.current;
      const louverRad = (louverRef.current * Math.PI) / 180;

      floorRecords.forEach((rec) => {
        const centeredIdx = rec.floorIndex - (rec.totalFloors - 1) / 2;
        const explodedOffset = centeredIdx * 0.36 * currentExplosion;
        rec.group.position.y = rec.baseY + explodedOffset;

        const isTierMatch = selectedTier === 'all' || rec.tier === selectedTier;
        const slabMat = rec.slabMesh.material as THREE.MeshStandardMaterial;
        const coreMat = rec.coreMesh.material as THREE.MeshPhysicalMaterial;

        slabMat.wireframe = isWireframe;
        coreMat.wireframe = isWireframe;

        if (selectedTier === 'all') {
          slabMat.color.set('#E7E0D3');
          slabMat.opacity = 1;
          coreMat.opacity = 0.88;
        } else if (isTierMatch) {
          slabMat.color.set('#D97706');
          slabMat.opacity = 1;
          coreMat.opacity = 0.95;
        } else {
          slabMat.color.set('#57534E');
          slabMat.opacity = 0.22;
          coreMat.opacity = 0.14;
        }

        rec.louverGroup.children.forEach((fin) => {
          fin.rotation.y += (louverRad - fin.rotation.y) * 0.12;
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);

      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [project.slug, project.stories, use2DBlueprint]);

  const tierTelemetry = {
    all: {
      title: `Complete ${project.stories}-Story Tectonic Massing`,
      elevation: 'Levels B2 – Crown Penthouse',
      clearHeight: '11.5 ft Typical · 22.0 ft Duplex Crown',
      cantilever: '14.0 ft Monsoon Veranda Overhang',
      notes:
        'Post-tensioned flat plate concrete structure with 360-degree daylight exposure and dual segregated elevator cores.',
    },
    podium: {
      title: 'Levels G–02 · Sanctuary Podium & Arrival Court',
      elevation: '+0.0m to +11.5m Above Enclave Datum',
      clearHeight: '16.5 ft Double-Height Arrival & Baithak',
      cantilever: 'Recessed Basalt Water Court & Drop-Off',
      notes:
        'Houses the acoustically isolated 25m lap pool, subterranean hydrotherapy hammam, rare book library, and chauffeur lounge.',
    },
    typical: {
      title: `Levels 03–${project.stories - 2} · Full-Floor Residence Plates`,
      elevation: 'One Private Household Per Structural Level',
      clearHeight: '11 ft 6 in Clear Uninterrupted Span',
      cantilever: '14 ft × 48 ft Planted Sky Veranda',
      notes:
        'Column-free living salons wrapped in operable Burmese teak brise-soleil screens and 42.52mm laminated acoustic glazing.',
    },
    penthouse: {
      title: `Levels ${project.stories - 1}–${project.stories} · Crown Duplex Sky Sanctuary`,
      elevation: 'Uppermost Structural Horizon',
      clearHeight: '22.0 ft Double-Height Great Salon',
      cantilever: 'Private Rooftop Reflecting Pool & Pavilion',
      notes:
        'Stepped upper massing with private internal sculptural stair, panoramic enclave vistas, and rainwater-irrigated sky garden.',
    },
  }[activeTier];

  const schematicFloors = Math.min(Math.max(project.stories, 8), 12);

  return (
    <div
      ref={wrapperRef}
      className={`border border-[#D6CEBE] bg-[#141210] text-[#FBF9F5] ${className}`}
    >
      {/* Top Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D6CEBE]/20 px-5 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 bg-[#D97706]" />
          <span className="font-mono text-xs tracking-wider text-[#FBF9F5]">
            INTERACTIVE 3D TECTONIC MASSING & EXPLODED FLOOR-PLATE STUDIO
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['assembled', 'exploded', 'wireframe'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={massingMode === mode}
              onClick={() => setMassingMode(mode)}
              className={`min-h-[44px] sm:min-h-[34px] px-3 py-1.5 font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                massingMode === mode
                  ? 'bg-[#FBF9F5] text-[#141210] font-semibold'
                  : 'border border-[#D6CEBE]/30 text-[#D6CEBE] hover:border-[#FBF9F5]'
              }`}
            >
              {mode === 'assembled'
                ? '01. Assembled'
                : mode === 'exploded'
                ? '02. Exploded Plates'
                : '03. Wireframe'}
            </button>
          ))}

          <button
            type="button"
            aria-pressed={use2DBlueprint}
            onClick={() => setUse2DBlueprint((prev) => !prev)}
            className="min-h-[44px] sm:min-h-[34px] border border-[#D97706]/70 bg-[#78350F]/30 px-3 py-1.5 font-mono text-[11px] text-[#FBF9F5] hover:bg-[#78350F] cursor-pointer"
          >
            {use2DBlueprint ? 'SWITCH TO 3D WEBGL' : '2D BLUEPRINT FALLBACK'}
          </button>
        </div>
      </div>

      {/* Informative Error / Fallback Notice Banner if WebGL Context Was Interrupted */}
      {webglErrorReason && (
        <div
          role="status"
          aria-live="polite"
          className="border-b border-[#D97706]/40 bg-[#78350F]/25 px-6 py-2.5 font-mono text-xs text-[#FDE68A]"
        >
          {webglErrorReason}
        </div>
      )}

      {/* Main 3D / 2D Viewport + Semantic DOM HUD Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left 8 Columns: Interactive WebGL Viewport OR Interactive 2D Axonometric Blueprint Fallback */}
        <div className="relative min-h-[420px] sm:min-h-[520px] lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#D6CEBE]/20">
          {!use2DBlueprint ? (
            <div
              ref={mountRef}
              data-cursor="orbit"
              className="h-full min-h-[420px] sm:min-h-[520px] w-full cursor-grab active:cursor-grabbing"
              aria-label={`Interactive 3D architectural massing model of ${project.title}. ${tierTelemetry.title}`}
              role="img"
            />
          ) : (
            /* Interactive 2D Axonometric Architectural Blueprint Fallback (For Reduced Motion, Weak Devices, or Non-WebGL) */
            <div className="flex h-full min-h-[420px] sm:min-h-[520px] flex-col items-center justify-center bg-[#141210] p-6 pt-20 pb-20">
              <svg
                viewBox="0 0 240 180"
                className="h-full max-h-[340px] w-full select-none"
                role="img"
                aria-label={`2D Axonometric architectural blueprint of ${project.title} showing ${project.stories} structural levels`}
              >
                {/* Axonometric Coordinate Grid */}
                <line x1="20" y1="165" x2="220" y2="165" stroke="#78350F" strokeWidth="0.6" />
                <line x1="120" y1="10" x2="120" y2="170" stroke="#D6CEBE" strokeWidth="0.3" strokeDasharray="2 2" />

                {Array.from({ length: schematicFloors }).map((_, idx) => {
                  const isPod = idx <= 1;
                  const isPent = idx >= schematicFloors - 2;
                  const tierKey: StructuralTier = isPod
                    ? 'podium'
                    : isPent
                    ? 'penthouse'
                    : 'typical';
                  const isHighlighted = activeTier === 'all' || activeTier === tierKey;
                  const gap = massingMode === 'exploded' ? 11.5 : 7.5;
                  const yPos = 152 - idx * gap;
                  const width = isPod ? 130 : isPent ? 96 : 114;
                  const xPos = 120 - width / 2;

                  return (
                    <g
                      key={idx}
                      onClick={() => setActiveTier(tierKey)}
                      className="cursor-pointer"
                    >
                      {/* Isometric Floor Plate Polygon */}
                      <polygon
                        points={`${xPos},${yPos} ${xPos + width},${yPos} ${
                          xPos + width + 14
                        },${yPos - 6} ${xPos + 14},${yPos - 6}`}
                        fill={
                          massingMode === 'wireframe'
                            ? 'none'
                            : isHighlighted
                            ? activeTier === 'all'
                              ? '#E7E0D3'
                              : '#D97706'
                            : '#292524'
                        }
                        fillOpacity={isHighlighted ? '0.88' : '0.35'}
                        stroke={isHighlighted ? '#FBF9F5' : '#57534E'}
                        strokeWidth="0.6"
                      />
                      {/* Brise-Soleil Fin Ticks */}
                      {isHighlighted && (
                        <line
                          x1={xPos + 10}
                          y1={yPos - 1}
                          x2={xPos + width - 10}
                          y2={yPos - 1}
                          stroke="#D97706"
                          strokeWidth="1.1"
                          strokeDasharray={`${Math.max(1, louverAngleDeg / 15)} 2`}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
              <p className="mt-2 font-mono text-[11px] text-[#D6CEBE]/80 text-center">
                2D AXONOMETRIC BLUEPRINT MODE (ZERO-GPU / REDUCED-MOTION SAFE) · TAP ANY LEVEL TO ISOLATE TIER
              </p>
            </div>
          )}

          {/* Floating Top-Left Semantic HUD: Scale & Orientation */}
          <div className="pointer-events-none absolute top-4 left-4 z-10 border border-white/15 bg-black/65 px-3.5 py-2.5 backdrop-blur-xs">
            <p className="font-mono text-[10px] tracking-widest text-[#D6CEBE]">
              {project.catalogNumber} · {project.enclaveName.toUpperCase()}
            </p>
            <p className="mt-0.5 font-serif text-lg text-[#FBF9F5]">
              {project.title} ({project.stories} Stories)
            </p>
          </div>

          {/* Floating Bottom Controls Bar over Canvas */}
          <div className="absolute right-3 bottom-3 left-3 sm:right-4 sm:bottom-4 sm:left-4 z-10 flex flex-wrap items-center justify-between gap-2 border border-white/15 bg-black/75 px-3.5 py-2.5 backdrop-blur-xs">
            <span className="font-mono text-[11px] text-[#D6CEBE]">
              {use2DBlueprint
                ? 'Interactive 2D Axonometric Schematic'
                : 'Drag horizontally to orbit 360° massing'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {!use2DBlueprint && (
                <button
                  type="button"
                  onClick={() => setAutoRotate((prev) => !prev)}
                  className="min-h-[38px] border border-[#D6CEBE]/40 px-3 py-1.5 font-mono text-[10px] text-[#FBF9F5] hover:border-[#FBF9F5] cursor-pointer"
                >
                  {autoRotate ? 'PAUSE TURNTABLE' : 'AUTO-ROTATE'}
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  setMassingMode((prev) => (prev === 'exploded' ? 'assembled' : 'exploded'))
                }
                className="min-h-[38px] bg-[#78350F] px-3 py-1.5 font-mono text-[10px] text-[#FBF9F5] hover:bg-[#9A3412] cursor-pointer"
              >
                {massingMode === 'exploded' ? 'COLLAPSE PLATES' : 'EXPLODE PLATES'}
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Interactive Structural Tier & Brise-Soleil Controls */}
        <div className="flex flex-col justify-between p-5 sm:p-6 md:p-8 lg:col-span-4">
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[11px] tracking-wider text-[#D97706]">
                01. ISOLATE STRUCTURAL TIER
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'all', label: 'Full Massing' },
                    { id: 'penthouse', label: 'Crown Penthouse' },
                    { id: 'typical', label: 'Full-Floor Plates' },
                    { id: 'podium', label: 'Sanctuary Podium' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={activeTier === item.id}
                    onClick={() => setActiveTier(item.id)}
                    className={`min-h-[44px] border px-3 py-2 text-left font-mono text-[11px] transition-colors cursor-pointer ${
                      activeTier === item.id
                        ? 'border-[#D97706] bg-[#78350F]/40 text-[#FBF9F5]'
                        : 'border-[#D6CEBE]/25 text-[#D6CEBE]/80 hover:border-[#D6CEBE]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Selected Tier Telemetry (Announced to Screen Readers) */}
            <div
              aria-live="polite"
              className="border-t border-[#D6CEBE]/20 pt-5"
            >
              <p className="font-serif text-2xl text-[#FBF9F5]">{tierTelemetry.title}</p>
              <p className="mt-1 font-mono text-xs text-[#D97706]">{tierTelemetry.elevation}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#D6CEBE]/85">
                {tierTelemetry.notes}
              </p>

              <dl className="mt-4 space-y-2 border-t border-[#D6CEBE]/15 pt-3 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#A8A29E]">Clear Structural Span</dt>
                  <dd className="font-mono text-[#FBF9F5] text-right tabular-nums">
                    {tierTelemetry.clearHeight}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#A8A29E]">Veranda Cantilever</dt>
                  <dd className="font-mono text-[#FBF9F5] text-right tabular-nums">
                    {tierTelemetry.cantilever}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Interactive Facade Brise-Soleil Fin Rotation */}
            <div className="border-t border-[#D6CEBE]/20 pt-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wider text-[#D97706]">
                  02. TEAK BRISE-SOLEIL APERTURE
                </span>
                <span className="font-mono text-xs text-[#FBF9F5] tabular-nums">
                  {louverAngleDeg}° Pitch
                </span>
              </div>
              <p className="mt-1 text-xs text-[#D6CEBE]/75">
                Rotate the operable Burmese teak facade louvers on the elevation:
              </p>
              <div className="mt-3 flex gap-2">
                {[
                  { deg: 0, label: '0° Open' },
                  { deg: 35, label: '35° Filter' },
                  { deg: 70, label: '70° Shield' },
                ].map((preset) => (
                  <button
                    key={preset.deg}
                    type="button"
                    aria-pressed={louverAngleDeg === preset.deg}
                    onClick={() => setLouverAngleDeg(preset.deg)}
                    className={`min-h-[44px] flex-1 border py-1.5 px-2 font-mono text-[10px] transition-colors cursor-pointer ${
                      louverAngleDeg === preset.deg
                        ? 'border-[#FBF9F5] bg-[#FBF9F5] text-[#141210] font-semibold'
                        : 'border-[#D6CEBE]/30 text-[#D6CEBE] hover:border-[#FBF9F5]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[#D6CEBE]/20 pt-4 text-[11px] text-[#A8A29E] font-mono">
            ILLUSTRATIVE 3D MASSING · SCALE 1:100 CONCEPT SIMULATION
          </div>
        </div>
      </div>
    </div>
  );
};
