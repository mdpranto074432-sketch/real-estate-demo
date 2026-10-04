import React, { createContext, useContext, useState } from 'react';
import {
  BangladeshLanguageMode,
  BangladeshTrustDocumentationSchema,
  PaymentStructureStage,
  ProjectMonograph,
} from '../types/realEstate';

export type BdtDisplayUnit = 'CRORE' | 'LAKH' | 'SYMBOL';

interface BangladeshContextValue {
  languageMode: BangladeshLanguageMode;
  setLanguageMode: (lang: BangladeshLanguageMode) => void;
  bdtDisplayUnit: BdtDisplayUnit;
  setBdtDisplayUnit: (unit: BdtDisplayUnit) => void;
  formatValuationBDT: (rawValuation: string) => string;
  formatAreaWithKatha: (sqFt: number) => string;
}

const BangladeshLocalizationContext = createContext<BangladeshContextValue>({
  languageMode: 'EN',
  setLanguageMode: () => {},
  bdtDisplayUnit: 'CRORE',
  setBdtDisplayUnit: () => {},
  formatValuationBDT: (v) => v,
  formatAreaWithKatha: (sqFt) => `${sqFt.toLocaleString('en-IN')} sq. ft.`,
});

/**
 * Converts standard English digits to Bengali numerals (০-৯) when in BN mode
 */
export function toBanglaNumerals(input: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

/**
 * Formats an indicative BDT valuation string according to Bangladesh conventions:
 * - CRORE: "৳ 34.5 Crore (Illustrative Demo)"
 * - LAKH: "৳ 3,450 Lakh (Illustrative Demo)"
 * - SYMBOL: "BDT 34,50,00,000 (Illustrative Demo)"
 */
export function formatBdtValuation(
  rawValuation: string,
  unit: BdtDisplayUnit = 'CRORE',
  lang: BangladeshLanguageMode = 'EN'
): string {
  const match = rawValuation.match(/([\d.]+)\s*Crore/i);
  if (!match || !match[1]) {
    if (lang === 'BN') {
      return 'মূল্য আলোচনাসাপেক্ষ (ডেমো / ধারণাগত)';
    }
    return rawValuation.includes('Demo')
      ? rawValuation
      : `${rawValuation} (Illustrative Demo)`;
  }

  const croreValue = parseFloat(match[1]);
  if (Number.isNaN(croreValue)) return rawValuation;

  if (unit === 'LAKH') {
    const lakhValue = Math.round(croreValue * 100);
    const formattedLakh = lakhValue.toLocaleString('en-IN');
    if (lang === 'BN') {
      return `৳ ${toBanglaNumerals(formattedLakh)} লক্ষ (ডেমো মূল্যায়ন)`;
    }
    return `৳ ${formattedLakh} Lakh · BDT ${croreValue.toFixed(1)} Cr (Demo)`;
  }

  if (unit === 'SYMBOL') {
    const totalTaka = Math.round(croreValue * 10000000);
    const formattedTaka = totalTaka.toLocaleString('en-IN');
    if (lang === 'BN') {
      return `৳ ${toBanglaNumerals(formattedTaka)} টাকা (ডেমো)`;
    }
    return `৳ ${formattedTaka} BDT (Demo)`;
  }

  // Default CRORE
  if (lang === 'BN') {
    return `৳ ${toBanglaNumerals(croreValue.toFixed(1))} কোটি টাকা (ডেমো)`;
  }
  return `৳ ${croreValue.toFixed(1)} Crore BDT (Demo)`;
}

export const BangladeshLocalizationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [languageMode, setLanguageMode] =
    useState<BangladeshLanguageMode>('EN');
  const [bdtDisplayUnit, setBdtDisplayUnit] =
    useState<BdtDisplayUnit>('CRORE');

  const formatValuationBDT = (rawValuation: string) =>
    formatBdtValuation(rawValuation, bdtDisplayUnit, languageMode);

  const formatAreaWithKatha = (sqFt: number) => {
    const formattedSqFt = sqFt.toLocaleString('en-IN');
    if (languageMode === 'BN') {
      return `${toBanglaNumerals(formattedSqFt)} বর্গফুট (${formattedSqFt} sq. ft.)`;
    }
    return `${formattedSqFt} sq. ft.`;
  };

  return (
    <BangladeshLocalizationContext.Provider
      value={{
        languageMode,
        setLanguageMode,
        bdtDisplayUnit,
        setBdtDisplayUnit,
        formatValuationBDT,
        formatAreaWithKatha,
      }}
    >
      {children}
    </BangladeshLocalizationContext.Provider>
  );
};

export function useBangladeshLocalization() {
  return useContext(BangladeshLocalizationContext);
}

/**
 * Generates an unpopulated, demo-safe Bangladesh Payment Structure Schedule
 * (Earnest Booking -> Allotment -> Structural Slab Castings -> Envelope -> Handover)
 */
export function getProjectPaymentSchedule(
  project: ProjectMonograph
): PaymentStructureStage[] {
  if (project.paymentMilestones && project.paymentMilestones.length > 0) {
    return project.paymentMilestones;
  }

  return [
    {
      stageCode: 'STAGE 01',
      milestoneLabel: 'Reservation & Earnest Money Deposit (Bayna)',
      milestoneLabelBn: 'প্রাথমিক বুকিং ও বায়না জমা (ডেমো কাঠামো)',
      percentageAllocation: '15% Indicative Weighting',
      scheduleNote: 'Upon Private Allocation Reservation & Draft Deed Vetting',
      demoStatusNote: 'Illustrative Concept Payment Structure',
    },
    {
      stageCode: 'STAGE 02',
      milestoneLabel: 'Tripartite Allotment & Sub-Soil Piling Completion',
      milestoneLabelBn: 'বরাদ্দ চুক্তি ও পাইলিং সম্পন্নকরণ',
      percentageAllocation: '20% Indicative Weighting',
      scheduleNote: 'Upon Piling & Subterranean Basement Raft Certification',
      demoStatusNote: 'Illustrative Concept Payment Structure',
    },
    {
      stageCode: 'STAGE 03',
      milestoneLabel: 'Post-Tensioned Superstructure Slab Casting (Progressive)',
      milestoneLabelBn: 'সুপারস্ট্রাকচার ছাদ ঢালাই (ধাপে ধাপে)',
      percentageAllocation: '35% Indicative Weighting',
      scheduleNote: `Distributed proportionally across ${project.stories} structural floor pours`,
      demoStatusNote: 'Illustrative Concept Payment Structure',
    },
    {
      stageCode: 'STAGE 04',
      milestoneLabel: 'Acoustic Glazing Envelope, Stone Rainscreen & MEP',
      milestoneLabelBn: 'অ্যাকোস্টিক গ্লাস, ট্রাভার্টিন পাথর ও এমইপি সংযোজন',
      percentageAllocation: '20% Indicative Weighting',
      scheduleNote: 'Upon completion of 42.52mm glazing and elevator installation',
      demoStatusNote: 'Illustrative Concept Payment Structure',
    },
    {
      stageCode: 'STAGE 05',
      milestoneLabel: 'Acoustic Commissioning, Key Handover & Registration',
      milestoneLabelBn: 'চূড়ান্ত হস্তান্তর ও সাফ কবলা রেজিস্ট্রেশন প্রক্রিয়া',
      percentageAllocation: '10% Indicative Weighting',
      scheduleNote: `Target Horizon: ${project.completionYear}`,
      demoStatusNote: 'Illustrative Concept Payment Structure',
    },
  ];
}

/**
 * Generates a 9-Part Bangladesh Trust & Documentation Framework for any Project Monograph.
 * Strictly adheres to zero fabricated regulatory/RAJUK/REHAB/deed numbers:
 * all slots are explicitly presented as unpopulated institutional templates for demo evaluation.
 */
export function getBangladeshTrustDocumentation(
  project: ProjectMonograph
): BangladeshTrustDocumentationSchema {
  if (project.trustDocumentation) {
    return project.trustDocumentation;
  }

  const totalPlotSqFt = (project.landAreaKathas * 720).toLocaleString('en-IN');
  const perResidenceKatha = (
    project.landAreaKathas / project.totalResidences
  ).toFixed(2);

  return {
    developerRegistration: {
      categoryTitle: '01. Developer Practice & Institutional Standing',
      categoryTitleBn: '০১. ডেভেলপার প্রতিষ্ঠান ও নিবন্ধন কাঠামো',
      authorityLabel: 'Corporate & Real Estate Practice Registry (Unpopulated Demo Slot)',
      verificationState: 'Unpopulated Template (Demo / Illustrative)',
      protocolSummary:
        'In a live Bangladesh residential acquisition, corporate incorporation certificates, trade licenses, and industry association memberships are presented in original physical binders. This concept portfolio intentionally omits fabricated registration numbers.',
      requiredDocumentsList: [
        'Certificate of Incorporation & Memorandum of Articles (Template Slot — Unpopulated in Demo)',
        'Real Estate Sector Membership / Practice Charter (Template Slot — Unpopulated in Demo)',
        'Principal Architects’ Professional Institute Standing (Concept Persona Profile)',
      ],
    },
    authorityAndMunicipal: {
      categoryTitle: '02. Municipal Planning & Development Authority Jurisdiction',
      categoryTitleBn: '০২. নগর উন্নয়ন কর্তৃপক্ষ ও জুরিসডিকশন প্রোটোকল',
      authorityLabel: `Dhaka Metropolitan Enclave Jurisdiction · ${project.enclaveName}`,
      verificationState: 'Unpopulated Template (Demo / Illustrative)',
      protocolSummary:
        'Defines the municipal zoning precinct, Floor Area Ratio (FAR) setback rules, and maximum ground coverage parameters applicable to the enclave plot. No governmental authority endorsements are claimed.',
      requiredDocumentsList: [
        'Land Use Clearance & Enclave Zoning Classification (Template Slot — Unpopulated in Demo)',
        'Mandatory Green Setback & Permeable Courtyard Calculation Sheet (Concept Study)',
        'Civil Aviation & Plinth Elevation Clearance Protocol (Template Slot — Unpopulated in Demo)',
      ],
    },
    approvalReferences: {
      categoryTitle: '03. Building Plan & Statutory Reference Schedule',
      categoryTitleBn: '০৩. ভবন নকশা অনুমোদন ও রেফারেন্স তফসিল',
      referencePlaceholder: '[UNPOPULATED IN CONCEPT DEMO — VERIFIED AT SALON BRIEFING]',
      protocolSummary:
        'Dedicated holding architecture for approved architectural layout numbers, structural stability certificates, and fire safety clearances. Never populated with synthetic or fake permit IDs.',
      requiredDocumentsList: [
        'Sanctioned Architectural & Structural Layout Reference (Unpopulated Demo Slot)',
        'Fire Defense, Pressurized Stairwell & Hydrant Clearance (Unpopulated Demo Slot)',
        'Environmental Impact & Rainwater Recharge Assessment (Unpopulated Demo Slot)',
      ],
    },
    projectDocumentation: {
      categoryTitle: '04. Project Technical & Architectural Dossier',
      categoryTitleBn: '০৪. প্রকল্পের কারিগরি ও স্থাপত্য দলিলাদি',
      dossierScope: `${project.catalogNumber} · 1:100 As-Designed CAD & MEP Schedule`,
      protocolSummary:
        'Comprehensive architectural drawings distinguishing Gross Floor Plate Area from Net Internal Carpet Area, veranda cantilevers, and vertical lift shafts.',
      requiredDocumentsList: [
        `Full-Floor 1:100 Dimensioned Architectural Plates (${project.typicalFloorAreaSqFt})`,
        'Sub-Soil Borehole Log & Geotechnical Bearing Capacity Report (Concept Specimen)',
        '42.52mm Laminated Glass Acoustic Attenuation Lab Report (32 dBA Target)',
      ],
    },
    ownershipAndTitle: {
      categoryTitle: '05. Land Title, Khatiyan & Undivided Share Structure',
      categoryTitleBn: '০৫. জমির মালিকানা, খতিয়ান ও অবিভক্ত অংশের কাঠামো',
      landTenureStructure: `${project.landAreaKathas} Kathas (${totalPlotSqFt} sq. ft.) Total Plot Extent (Concept)`,
      undividedShareNote: `Proportional Allocation: ~${perResidenceKatha} Kathas Undivided & Indivisible Land Share per Full-Floor Residence (Illustrative)`,
      protocolSummary:
        'In Bangladesh luxury real estate, generational security rests on clean chain-of-title vetting (CS, SA, RS, and Dhaka City Jarip Khatiyan records) and transparent undivided land share (অবিভক্ত ভূমি অংশ) allocation.',
      requiredDocumentsList: [
        'Chain of Title Deeds (Bia Deeds) & Mutation (Namjari) Khatiyan Slot (Unpopulated in Demo)',
        'Non-Encumbrance Certificate (NEC) Vetting Protocol (Unpopulated in Demo)',
        'Proportional Undivided Land Share Schedule per Residence (Concept Calculation)',
      ],
    },
    constructionInformation: {
      categoryTitle: '06. Structural Engineering, BNBC Seismic & Material Logs',
      categoryTitleBn: '০৬. স্ট্রাকচারাল ইঞ্জিনিয়ারিং ও নির্মাণ মানদণ্ড',
      structuralSystem: 'Post-Tensioned Column-Free Flat Slab & Cast-in-Situ Shear Core',
      seismicAndWindCodeNote:
        'Engineered for Dhaka Seismic Zone 2 lateral resilience and 210 km/h Kalbaishakhi wind loads (Concept Engineering Standard)',
      protocolSummary:
        'Open-book laboratory testing ledger covering concrete cylinder cube crush strength, high-yield deformed steel rebar mill certificates, and quarry origin logs.',
      requiredDocumentsList: [
        '28-Day Concrete Cylinder Crush-Strength Laboratory Ledger (Concept Specimen)',
        'Post-Tensioned Tendon Elongation & Stressing Records (Concept Specimen)',
        'Dhamrai Kiln-Fired Brick & Roman Travertine Provenance Dossier (Concept)',
      ],
    },
    deliveryHistory: {
      categoryTitle: '07. Studio Commissioning Cadence & Stewardship History',
      categoryTitleBn: '০৭. স্টুডিওর নির্মাণ ইতিহাস ও রক্ষণাবেক্ষণ চার্টার',
      stewardshipCadence: 'Restricted to Maximum 3 Active Dhaka Commissions Simultaneously (Concept)',
      protocolSummary:
        'Rather than speculative volume building, Varendra & Co. models an architectural patronage approach where founding principals supervise every pour and establish a 50-year building maintenance endowment.',
    },
    utilitiesAndSovereignty: {
      categoryTitle: '08. Sovereign Utilities, Acoustic Power & Water Infrastructure',
      categoryTitleBn: '০৮. সার্বভৌম ইউটিলিটি, বিদ্যুৎ ও পানি ব্যবস্থাপনা',
      powerBackupProvision:
        '100% Full-Load Dual Acoustic-Canopy Synchronization Generators + Solar Parasol Array (Concept)',
      waterTreatmentAndHarvesting: `Five-Stage Potable Mineralization Plant + ${project.environmentalMetrics.rainwaterHarvestingCapacityLiters.toLocaleString()}L Monsoon Rainwater Cistern`,
      gasAndCulinaryProvision:
        'Centralized Reticulated LPG / Induction Culinary Infrastructure with Automated Seismic Shutoff (Concept)',
      airFiltrationStandard:
        'Centralized MERV-16 + Activated Carbon Fresh-Air ERV maintaining PM2.5 < 8 µg/m³',
    },
    acquisitionTerms: {
      categoryTitle: '09. Private Allotment Charter, Handover & Covenant Terms',
      categoryTitleBn: '০৯. বরাদ্দ শর্তাবলী ও হস্তান্তর প্রোটোকল',
      bookingAndAllotmentProtocol:
        'Private consultation at our Gulshan North Salon followed by independent legal examination of specimen covenants prior to reservation.',
      escrowAndMilestoneNote:
        'Milestone-linked construction scheduling with quarterly engineering audit dispatches (Illustrative Concept Terms).',
      handoverAssessmentProtocol:
        'Joint architectural, acoustic (32 dBA), and MEP snag-list verification prior to formal key presentation.',
    },
  };
}
