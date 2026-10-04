/**
 * Core Domain Data Model for Varendra & Co. Architectural Residences
 * NOTE: All projects, metrics, and timelines are fictional concept demonstrations.
 * No real legal, governmental, or regulatory approval claims are made.
 */

export type ProjectStatus =
  | 'Architectural Concept'
  | 'Structural Phase (Demo)'
  | 'Interior Curation (Demo)'
  | 'Completed Monograph (Demo)';

export type EnclaveSlug =
  | 'gulshan-north'
  | 'baridhara-diplomatic'
  | 'dhanmondi-lakefront'
  | 'banani-canopy'
  | 'bashundhara-riverview'
  | 'jolshiri-watershed';

export type BangladeshLanguageMode = 'EN' | 'BN';

export interface BilingualLabel {
  en: string;
  bn: string;
}

export interface AmenityItem {
  id: string;
  title: string;
  category:
    | 'Wellness & Hydrotherapy'
    | 'Botanical & Microclimate'
    | 'Private Hospitality'
    | 'Acoustic & Structural';
  description: string;
  specification: string;
}

export interface FloorPlanZone {
  name: string;
  dimensionsFeet: string;
  areaSqFt: number;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  orientation: string;
}

export interface FloorPlan {
  id: string;
  title: string;
  levelLabel: string;
  grossAreaSqFt: number;
  netInternalSqFt: number;
  terraceAreaSqFt: number;
  bedrooms: number;
  staffQuarters: number;
  privateLiftLobbies: number;
  ceilingHeightFeet: number;
  compassOrientation: string;
  architecturalNotes: string;
  zones: FloorPlanZone[];
}

export interface PaymentStructureStage {
  stageCode: string;
  milestoneLabel: string;
  milestoneLabelBn: string;
  percentageAllocation: string;
  scheduleNote: string;
  demoStatusNote: string;
}

export interface BangladeshTrustDocumentationSchema {
  developerRegistration: {
    categoryTitle: string;
    categoryTitleBn: string;
    authorityLabel: string;
    verificationState: 'Unpopulated Template (Demo / Illustrative)' | 'Concept Schema Only';
    protocolSummary: string;
    requiredDocumentsList: string[];
  };
  authorityAndMunicipal: {
    categoryTitle: string;
    categoryTitleBn: string;
    authorityLabel: string;
    verificationState: 'Unpopulated Template (Demo / Illustrative)' | 'Concept Schema Only';
    protocolSummary: string;
    requiredDocumentsList: string[];
  };
  approvalReferences: {
    categoryTitle: string;
    categoryTitleBn: string;
    referencePlaceholder: string;
    protocolSummary: string;
    requiredDocumentsList: string[];
  };
  projectDocumentation: {
    categoryTitle: string;
    categoryTitleBn: string;
    dossierScope: string;
    protocolSummary: string;
    requiredDocumentsList: string[];
  };
  ownershipAndTitle: {
    categoryTitle: string;
    categoryTitleBn: string;
    landTenureStructure: string;
    undividedShareNote: string;
    protocolSummary: string;
    requiredDocumentsList: string[];
  };
  constructionInformation: {
    categoryTitle: string;
    categoryTitleBn: string;
    structuralSystem: string;
    seismicAndWindCodeNote: string;
    protocolSummary: string;
    requiredDocumentsList: string[];
  };
  deliveryHistory: {
    categoryTitle: string;
    categoryTitleBn: string;
    stewardshipCadence: string;
    protocolSummary: string;
  };
  utilitiesAndSovereignty: {
    categoryTitle: string;
    categoryTitleBn: string;
    powerBackupProvision: string;
    waterTreatmentAndHarvesting: string;
    gasAndCulinaryProvision: string;
    airFiltrationStandard: string;
  };
  acquisitionTerms: {
    categoryTitle: string;
    categoryTitleBn: string;
    bookingAndAllotmentProtocol: string;
    escrowAndMilestoneNote: string;
    handoverAssessmentProtocol: string;
  };
}

export interface PropertyUnit {
  id: string;
  unitCode: string;
  floorNumber: number;
  residenceType:
    | 'Simplex Sanctuary'
    | 'Duplex Sky Villa'
    | 'Full-Floor Garden Residence'
    | 'Triplex Crown Penthouse';
  areaSqFt: number;
  orientation:
    | 'South-East Lakefront'
    | 'South-West Canopy'
    | 'North-South Cross-Ventilated';
  bedrooms: number;
  baths: number;
  powderRooms: number;
  parkingBays: number;
  allocationStatus:
    | 'Available for Private Briefing'
    | 'Reserved (Demo)'
    | 'Curatorial Hold';
  indicativeValuationBDT: string;
  floorPlanId: string;
}

export interface ConstructionMilestone {
  phaseIndex: string;
  phaseName: string;
  targetQuarter: string;
  completionPercentage: number;
  status: 'Completed (Demo)' | 'In Progress (Demo)' | 'Scheduled (Demo)';
  architecturalSummary: string;
  verificationNote: string;
}

export interface LocationEnclave {
  id: string;
  slug: EnclaveSlug;
  name: string;
  nameBn?: string;
  district: string;
  city: 'Dhaka';
  coordinatesLabel: string;
  mapPosition: { xPercent: number; yPercent: number };
  characterSummary: string;
  urbanContextEssay: string;
  canopyCoverageEstimate: string;
  typicalPlotOrientation: string;
  dhakaUrbanContext?: {
    thanaJurisdictionLabel: string;
    roadNetworkPattern: string;
    waterbodyRelationship: string;
    plotScaleConvention: string;
  };
  proximityHighlights: {
    destination: string;
    urbanCorridor: string;
    spatialNote: string;
  }[];
  featuredImage: string;
}

export interface ProjectMonograph {
  id: string;
  slug: string;
  catalogNumber: string;
  title: string;
  titleBn?: string;
  subtitle: string;
  enclaveSlug: EnclaveSlug;
  enclaveName: string;
  enclaveNameBn?: string;
  addressLine: string;
  propertyType?: string;
  status: ProjectStatus;
  completionYear: string;
  totalResidences: number;
  stories: number;
  landAreaKathas: number;
  typicalFloorAreaSqFt: string;
  bathroomsSummary?: string;
  parkingSummary?: string;
  floorAllocationSummary?: string;
  paymentStructureSummary?: string;
  paymentMilestones?: PaymentStructureStage[];
  trustDocumentation?: BangladeshTrustDocumentationSchema;
  leadArchitectConcept: string;
  landscapeDesignConcept: string;
  heroImage: string;
  secondaryImage: string;
  interiorImage: string;
  curatorialStatement: string;
  architecturalEssay: string[];
  materialPalette: {
    material: string;
    origin: string;
    application: string;
  }[];
  environmentalMetrics: {
    solarHeatGainReduction: string;
    crossVentilationRatio: string;
    acousticAttenuationDb: string;
    rainwaterHarvestingCapacityLiters: number;
  };
  amenities: AmenityItem[];
  floorPlans: FloorPlan[];
  units: PropertyUnit[];
  constructionProgress: ConstructionMilestone[];
  demoDisclaimer: string;
}

export interface DeveloperProfile {
  brandName: string;
  brandNameBn?: string;
  legalDisclaimer: string;
  foundingYearConcept: number;
  headquarters: string;
  headquartersBn?: string;
  directPhoneDisplay?: string;
  whatsappConciergeNumber?: string;
  monographEdition: string;
  manifestoHeadline: string;
  manifestoHeadlineBn?: string;
  manifestoLead: string;
  philosophies: {
    index: string;
    title: string;
    thesis: string;
    detail: string;
  }[];
  principals: {
    name: string;
    role: string;
    background: string;
    quote: string;
  }[];
  craftStandards: {
    category: string;
    specification: string;
    benchmark: string;
  }[];
}
