import React from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Expand,
  FileText,
  Info,
  Layers,
  MapPin,
  Menu,
  Pause,
  Play,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  Wind,
  X,
} from 'lucide-react';

export type ArchitecturalIconName =
  | 'arrow-up-right'
  | 'arrow-left'
  | 'compass'
  | 'layers'
  | 'expand'
  | 'map-pin'
  | 'check'
  | 'clock'
  | 'menu'
  | 'close'
  | 'info'
  | 'filter'
  | 'dossier'
  | 'wind'
  | 'acoustic'
  | 'building'
  | 'play'
  | 'pause';

const ICON_MAP: Record<ArchitecturalIconName, React.ElementType> = {
  'arrow-up-right': ArrowUpRight,
  'arrow-left': ArrowLeft,
  compass: Compass,
  layers: Layers,
  expand: Expand,
  'map-pin': MapPin,
  check: CheckCircle2,
  clock: Clock,
  menu: Menu,
  close: X,
  info: Info,
  filter: SlidersHorizontal,
  dossier: FileText,
  wind: Wind,
  acoustic: Volume2,
  building: Building2,
  play: Play,
  pause: Pause,
};

export interface ArchitecturalIconProps {
  name: ArchitecturalIconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/**
 * Unified Architectural Icon System
 * Enforces a consistent 1.25px fine technical draughtsman stroke weight across all interactive affordances.
 * Reserved strictly for functional affordances (navigation, modal triggers, blueprint zoom, sorting).
 */
export const ArchitecturalIcon: React.FC<ArchitecturalIconProps> = ({
  name,
  size = 15,
  className = '',
  strokeWidth = 1.35,
}) => {
  const IconComponent = ICON_MAP[name] || Sparkles;
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    />
  );
};
