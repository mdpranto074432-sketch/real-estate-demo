import ehlDhakaPlateUrl from '../assets/images/ehl_dhaka_condominium_plate_1791106691381.jpg';
import ehlDhakaDetailPlateUrl from '../assets/images/ehl_dhaka_detail_plate_1791108740864.jpg';
import ehlDhakaNightPlateUrl from '../assets/images/ehl_dhaka_night_plate_1791108753816.jpg';
import heroDhakaUrl from '../assets/images/hero_dhaka_residence_1791097284081.jpg';
import gulshanSanctuaryUrl from '../assets/images/project_gulshan_sanctuary_1791097297928.jpg';
import baridharaPavilionUrl from '../assets/images/project_baridhara_pavilion_1791097313429.jpg';
import dhanmondiTerraceUrl from '../assets/images/project_dhanmondi_terrace_1791097325390.jpg';
import penthouseInteriorUrl from '../assets/images/interior_penthouse_living_1791097388057.jpg';
import bashundharaCourtUrl from '../assets/images/bashundhara_court_residence_1791210380858.jpg';
import jolshiriEstateUrl from '../assets/images/jolshiri_estate_panoramic_1791210394270.jpg';
import craftMaterialUrl from '../assets/images/architectural_craft_material_1791210407236.jpg';
import monsoonVerandahUrl from '../assets/images/dhaka_monsoon_verandah_lifestyle_1791210420618.jpg';

export interface MediaManifestEntry {
  id: string;
  title: string;
  filename: string;
  type: 'photography' | 'cinematic_film' | 'archival_plate' | 'material_study';
  section: string;
  role: 'hero' | 'gallery_feature' | 'monograph_hero' | 'lifestyle_study' | 'tectonic_detail' | 'enclave_backdrop';
  source: string;
  publicFallback: string;
  dimensions: {
    width: number;
    height: number;
  };
  aspectRatio: '16:9' | '4:3' | '3:2' | '1:1';
  focalPoint: string;
  preferredCrop: string;
  loadingPriority: 'high' | 'auto' | 'lazy';
  colorGrade: {
    temperature: 'warm_golden' | 'neutral_stone' | 'monsoon_ambient' | 'nocturnal_twilight';
    dominantColors: string[];
    notes: string;
  };
  architecturalSubject: string;
  location: string;
  licenseStatus: 'Demonstration Commission Portfolio' | 'Architectural Concept Reference';
}

export const MEDIA_MANIFEST: Record<string, MediaManifestEntry> = {
  hero_ehl_dhaka: {
    id: 'hero_ehl_dhaka',
    title: 'EHL Premium Condominiums — Establishing Elevation',
    filename: 'ehl_dhaka_condominium_plate_1791106691381.jpg',
    type: 'photography',
    section: 'homepage_hero',
    role: 'hero',
    source: ehlDhakaPlateUrl,
    publicFallback: '/images/ehl_dhaka_condominium_plate_1791106691381.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '54% 42%',
    preferredCrop: 'Full-bleed landscape with cantilevered slabs dominant',
    loadingPriority: 'high',
    colorGrade: {
      temperature: 'warm_golden',
      dominantColors: ['#CFCAC0', '#7E4627', '#2A3441', '#426837'],
      notes: 'Late afternoon Dhaka golden hour with balanced highlights and deep concrete shadow relief.',
    },
    architecturalSubject: 'Cantilevered fair-faced concrete slabs and exterior iron-wood louver screens',
    location: 'Gulshan, Dhaka',
    licenseStatus: 'Architectural Concept Reference',
  },
  detail_ehl_facade: {
    id: 'detail_ehl_facade',
    title: 'EHL Premium Condominiums — Cantilever & Tectonic Detail',
    filename: 'ehl_dhaka_detail_plate_1791108740864.jpg',
    type: 'photography',
    section: 'facade_study',
    role: 'tectonic_detail',
    source: ehlDhakaDetailPlateUrl,
    publicFallback: '/images/ehl_dhaka_detail_plate_1791108740864.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Low-angle upward view of cantilevered overhangs and foliage',
    loadingPriority: 'auto',
    colorGrade: {
      temperature: 'warm_golden',
      dominantColors: ['#D2CCC2', '#8F4E2B', '#3E5C32'],
      notes: 'Crisp shadow cast from deep concrete drip-edges onto warm iron-wood timber louvers.',
    },
    architecturalSubject: 'Board-formed concrete overhangs and vertical teak solar louvers',
    location: 'Dhaka, Bangladesh',
    licenseStatus: 'Architectural Concept Reference',
  },
  night_ehl_twilight: {
    id: 'night_ehl_twilight',
    title: 'EHL Premium Condominiums — Nocturnal Elevation',
    filename: 'ehl_dhaka_night_plate_1791108753816.jpg',
    type: 'photography',
    section: 'nocturnal_study',
    role: 'monograph_hero',
    source: ehlDhakaNightPlateUrl,
    publicFallback: '/images/ehl_dhaka_night_plate_1791108753816.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 48%',
    preferredCrop: 'Wide twilight landscape with rainwater pool reflections',
    loadingPriority: 'lazy',
    colorGrade: {
      temperature: 'nocturnal_twilight',
      dominantColors: ['#131B26', '#FFB85A', '#242F3E'],
      notes: 'Deep blue-hour sky balanced with 2700K warm interior tungsten floor glow.',
    },
    architecturalSubject: 'Illuminated living galleries and rainwater court reflections',
    location: 'Dhaka, Bangladesh',
    licenseStatus: 'Architectural Concept Reference',
  },
  interior_penthouse_salon: {
    id: 'interior_penthouse_salon',
    title: 'Great Salon & Double-Height Living Gallery',
    filename: 'interior_penthouse_living_1791097388057.jpg',
    type: 'photography',
    section: 'interior_typologies',
    role: 'lifestyle_study',
    source: penthouseInteriorUrl,
    publicFallback: '/images/interior_penthouse_living_1791097388057.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Column-free living gallery opening to double-height terrace',
    loadingPriority: 'auto',
    colorGrade: {
      temperature: 'neutral_stone',
      dominantColors: ['#E2DBD0', '#3D342A', '#7A6248'],
      notes: 'Honed Roman travertine, teak joinery, and filtered diffused northern daylight.',
    },
    architecturalSubject: 'Post-tensioned column-free living volume with natural cross-ventilation',
    location: 'Gulshan North, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
  gulshan_sanctuary: {
    id: 'gulshan_sanctuary',
    title: 'The Jamuna Pavilion — Lakefront Facade',
    filename: 'project_gulshan_sanctuary_1791097297928.jpg',
    type: 'photography',
    section: 'portfolio_archive',
    role: 'monograph_hero',
    source: gulshanSanctuaryUrl,
    publicFallback: '/images/project_gulshan_sanctuary_1791097297928.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '48% 45%',
    preferredCrop: 'Full vertical elevation with mature rain-tree canopy framing',
    loadingPriority: 'auto',
    colorGrade: {
      temperature: 'warm_golden',
      dominantColors: ['#C8C2B8', '#6A4328', '#2D4B2A'],
      notes: 'Direct morning sunlight filtering through mature mahogany and rain trees.',
    },
    architecturalSubject: 'Single-residence full-floor tower with 360° horizon exposure',
    location: 'Gulshan North Lakefront, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
  baridhara_pavilion: {
    id: 'baridhara_pavilion',
    title: 'Buriganga Sanctuary — Diplomatic Enclave Cloister',
    filename: 'project_baridhara_pavilion_1791097313429.jpg',
    type: 'photography',
    section: 'portfolio_archive',
    role: 'monograph_hero',
    source: baridharaPavilionUrl,
    publicFallback: '/images/project_baridhara_pavilion_1791097313429.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Quiet residential streetscape with private security setbacks',
    loadingPriority: 'auto',
    colorGrade: {
      temperature: 'neutral_stone',
      dominantColors: ['#DBD4C8', '#4A3B30', '#2B3C2A'],
      notes: 'Even daylight with deep acoustic buffer setbacks.',
    },
    architecturalSubject: 'Acoustically isolated private residential cloister and water court',
    location: 'Baridhara Diplomatic Zone, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
  dhanmondi_terrace: {
    id: 'dhanmondi_terrace',
    title: 'Dhaka Terrace — Tectonic Masonry & Brise-Soleil',
    filename: 'project_dhanmondi_terrace_1791097325390.jpg',
    type: 'photography',
    section: 'portfolio_archive',
    role: 'monograph_hero',
    source: dhanmondiTerraceUrl,
    publicFallback: '/images/project_dhanmondi_terrace_1791097325390.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Tectonic terracotta and exposed concrete cantilever detail',
    loadingPriority: 'auto',
    colorGrade: {
      temperature: 'warm_golden',
      dominantColors: ['#986046', '#B8B2A6', '#1E2822'],
      notes: 'Dhamrai red-brick kiln warmth paired with cast-in-situ concrete overhangs.',
    },
    architecturalSubject: 'Porous brick masonry screens and cantilevered corner balconies',
    location: 'Dhanmondi Heritage Lakefront, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
  bashundhara_court: {
    id: 'bashundhara_court',
    title: 'Shitalakshya Court — Garden Pavilion & Water Mirror',
    filename: 'bashundhara_court_residence_1791210380858.jpg',
    type: 'photography',
    section: 'portfolio_archive',
    role: 'monograph_hero',
    source: bashundharaCourtUrl,
    publicFallback: '/images/bashundhara_court_residence_1791210380858.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Low-density horizontal garden estate with reflection pool',
    loadingPriority: 'lazy',
    colorGrade: {
      temperature: 'warm_golden',
      dominantColors: ['#D6D0C5', '#60422B', '#345228'],
      notes: 'Golden afternoon sunlight across central courtyard water feature.',
    },
    architecturalSubject: 'Horizontal estate pavilion with permeable courtyard water courts',
    location: 'Bashundhara Block I, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
  jolshiri_estate: {
    id: 'jolshiri_estate',
    title: 'Meghna Belvedere — Panoramic Parkside Estate',
    filename: 'jolshiri_estate_panoramic_1791210394270.jpg',
    type: 'photography',
    section: 'portfolio_archive',
    role: 'monograph_hero',
    source: jolshiriEstateUrl,
    publicFallback: '/images/jolshiri_estate_panoramic_1791210394270.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Wide panoramic skyline and water reflection',
    loadingPriority: 'lazy',
    colorGrade: {
      temperature: 'warm_golden',
      dominantColors: ['#CEC8BC', '#744A2D', '#2B402B'],
      notes: 'Open horizon exposure and sunset illumination.',
    },
    architecturalSubject: 'Master-planned luxury residential volume facing ecological greenbelt',
    location: 'Jolshiri Abashon Sector 12, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
  craft_material_study: {
    id: 'craft_material_study',
    title: 'Tectonic Joinery & Seasoned Burmese Teak Slats',
    filename: 'architectural_craft_material_1791210407236.jpg',
    type: 'material_study',
    section: 'materials_philosophy',
    role: 'tectonic_detail',
    source: craftMaterialUrl,
    publicFallback: '/images/architectural_craft_material_1791210407236.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Macro tactile texture of joinery and brass details',
    loadingPriority: 'lazy',
    colorGrade: {
      temperature: 'neutral_stone',
      dominantColors: ['#824F30', '#BEB8AC', '#8A7145'],
      notes: 'Natural grain fidelity with warm timber and patinated brass shadow reveals.',
    },
    architecturalSubject: 'Hand-rubbed Burmese teak and cast concrete joints',
    location: 'Studio Varendra Fabrication Atelier, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
  monsoon_verandah_lifestyle: {
    id: 'monsoon_verandah_lifestyle',
    title: 'Deep Monsoon Verandah & Tropical Rain Sanctuary',
    filename: 'dhaka_monsoon_verandah_lifestyle_1791210420618.jpg',
    type: 'photography',
    section: 'lifestyle_philosophy',
    role: 'lifestyle_study',
    source: monsoonVerandahUrl,
    publicFallback: '/images/dhaka_monsoon_verandah_lifestyle_1791210420618.jpg',
    dimensions: { width: 3840, height: 2160 },
    aspectRatio: '16:9',
    focalPoint: '50% 50%',
    preferredCrop: 'Deep shaded verandah with lush monstera and monsoon rain veil',
    loadingPriority: 'lazy',
    colorGrade: {
      temperature: 'monsoon_ambient',
      dominantColors: ['#283D2C', '#C2BCB0', '#4A3B30'],
      notes: 'Atmospheric tropical monsoon light with lush wet greenery and soft sky reflections.',
    },
    architecturalSubject: 'Sheltered 3.6m deep residential verandah designed for 50-year rains',
    location: 'Gulshan North, Dhaka',
    licenseStatus: 'Demonstration Commission Portfolio',
  },
};
