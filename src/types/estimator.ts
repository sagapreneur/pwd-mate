// TypeScript Definitions for Maharashtra PWD Estimator

export type FloorTag = 'BASEMENT' | 'GF' | '1F' | '2F' | '3F' | '4F' | 'ABOVE_4F';

export interface MeasurementRow {
  id: string;
  floorTag: FloorTag;
  label: string;
  multiplier: number;
  length: number;
  breadth: number;
  depth: number;
  isDeduction: boolean;
  computedQty: number;
}

export interface SSRItem {
  id: string;
  ssrYear: string;
  itemCode: string;
  chapterNumber: number;
  chapterName: string;
  description: string;
  unit: string;
  baseRate: number;
  laborRate?: number;
  defaultCF: Record<string, number>;
  scadaApplicable?: boolean;
  bitumenQtyPerUnit?: number;
}

export interface EstimateItem {
  id: string;
  ssrItemId?: string;
  itemCode: string;
  description: string;
  unit: string;
  baseRate: number;
  isCustom?: boolean;
  scadaApplicable?: boolean;
  bitumenQtyPerUnit?: number;
  measurements: MeasurementRow[];
  consumptionFactors: Record<string, number>;
  sequenceOrder: number;
}

export interface LeadSetting {
  materialId: string;
  materialName: string;
  unit: string;
  sourceQuarry: string;
  distanceKm: number;
  calculatedRate: number; // Statement C-1 rate per unit
}

export interface MaterialMaster {
  id: string;
  name: string;
  unit: string;
  isMineral: boolean;
  royaltyRate: number;
  testingThreshold: number;
  testingFee: number;
  testingUnit: string;
}

export type BBSElementType = 'FOOTING' | 'COLUMN' | 'BEAM' | 'SLAB';

export interface BBSElement {
  id: string;
  elementType: BBSElementType;
  elementLabel: string;
  count: number;
  barDiaMm: number;
  spacingMm?: number;
  cutLengthM: number;
  barsPerElement: number;
  totalBars: number;
  unitWeightKgM: number;
  totalWeightKg: number;
}

export interface StampConfig {
  role: 'SE' | 'SDE' | 'EE' | 'SEng' | 'CE';
  name: string;
  designation: string;
  subDivision: string;
  showOnCover: boolean;
  showOnMeasurement: boolean;
  showOnAbstract: boolean;
  showOnRateAnalysis: boolean;
  showOnGeneralAbstract: boolean;
}

export type AreaSurchargeType = 
  | 'NONE'
  | 'MUNICIPAL_CORP'
  | 'MUNICIPAL_COUNCIL'
  | 'SUGARCANE'
  | 'TRIBAL_HILLY'
  | 'CENTRAL_JAIL'
  | 'TIGER_PROJECT'
  | 'MINING'
  | 'NAXALITE'
  | 'METROPOLITAN';

export interface ProjectFacesheet {
  nameOfWork: string;
  region: string;
  circle: string;
  division: string;
  subDivision: string;
  fundHead: string;
  majorHead: string;
  minorHead: string;
  serviceHead: string;
  departmentalHead?: string;
  adminApprovalNo: string;
  adminApprovalDate: string;
  techSanctionNo?: string;
  techSanctionDate?: string;
  authority?: string;
  necessity?: string;
  provisionsSummary?: string;
  outwardNo?: string;
  letterDate?: string;
  sanctionedAmount: number;
  ssrYear: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'SANCTIONED' | 'LOCKED';
  areaSurchargeType: AreaSurchargeType;
  areaSurchargePercent: number;
  scadaDeductionActive: boolean;
  scadaDeductionAmount: number;
  currentBitumenRate: number;
  ssrBitumenRate: number;
  gstPercent: number;
  contingencyPercent: number;
  laborCessPercent: number;
  electrificationAmount: number;
}

export interface GeneralAbstractRollup {
  scheduleA_costOfWork: number;
  scheduleB_royalty: number;
  scheduleC_testing: number;
  subtotalDirectWorks: number;
  gstAmount: number;
  contingencyAmount: number;
  laborCessAmount: number;
  areaSurchargeAmount: number;
  electrificationAmount: number;
  grandTotal: number;
  sanctionedTotal: number;
  formattedLakhs: string;
}

export interface SavedEstimateRecord {
  id: string;
  nameOfWork: string;
  division: string;
  subDivision: string;
  sanctionedAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  facesheet: ProjectFacesheet;
  items: EstimateItem[];
  leadSettings: LeadSetting[];
  bbsElements: BBSElement[];
  stamps: StampConfig[];
}

export type ActiveTab =
  | 'myEstimates'
  | 'facesheet'
  | 'catalog'
  | 'measurements'
  | 'lead'
  | 'rateAnalysis'
  | 'abstract'
  | 'consumption'
  | 'royalty'
  | 'testing'
  | 'steelBbs'
  | 'generalAbstract'
  | 'stamps'
  | 'marathiDocs'
  | 'admin'
  | 'dossier';
