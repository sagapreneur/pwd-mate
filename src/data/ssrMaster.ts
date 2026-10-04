// Master Data Seed Library for Maharashtra PWD Estimator
import { MaterialMaster, LeadSetting, SSRItem, AreaSurchargeType } from '../types/estimator';

export const MATERIALS_MASTER: Record<string, MaterialMaster> = {
  CEMENT: {
    id: 'CEMENT',
    name: 'Portland Pozzolana Cement (PPC)',
    unit: 'Bags',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 3000, // 3000 bags = 150 MT
    testingFee: 3500,
    testingUnit: 'Bags',
  },
  SAND_SCREENED: {
    id: 'SAND_SCREENED',
    name: 'Screened Clean Sand',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 150.0,
    testingThreshold: 200,
    testingFee: 1500,
    testingUnit: 'Cu.M',
  },
  SAND_LOCAL: {
    id: 'SAND_LOCAL',
    name: 'Local / Natural Sand',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 150.0,
    testingThreshold: 200,
    testingFee: 1500,
    testingUnit: 'Cu.M',
  },
  METAL_40MM: {
    id: 'METAL_40MM',
    name: 'Hand Broken Metal (40mm & above)',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 80.0,
    testingThreshold: 200,
    testingFee: 2800,
    testingUnit: 'Cu.M',
  },
  METAL_20MM: {
    id: 'METAL_20MM',
    name: 'Graded Crushed Metal (20mm)',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 80.0,
    testingThreshold: 200,
    testingFee: 2800,
    testingUnit: 'Cu.M',
  },
  METAL_10MM: {
    id: 'METAL_10MM',
    name: 'Graded Crushed Metal (12mm - 10mm)',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 80.0,
    testingThreshold: 200,
    testingFee: 2800,
    testingUnit: 'Cu.M',
  },
  RUBBLE: {
    id: 'RUBBLE',
    name: 'Rubble / Stone Spalls',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 80.0,
    testingThreshold: 300,
    testingFee: 2000,
    testingUnit: 'Cu.M',
  },
  MURUM: {
    id: 'MURUM',
    name: 'Murum / Selected Earth Fill',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 80.0,
    testingThreshold: 500,
    testingFee: 1800,
    testingUnit: 'Cu.M',
  },
  STONE_DUST: {
    id: 'STONE_DUST',
    name: 'Crushed Stone Dust',
    unit: 'Cu.M',
    isMineral: true,
    royaltyRate: 80.0,
    testingThreshold: 300,
    testingFee: 1500,
    testingUnit: 'Cu.M',
  },
  BRICKS_CLAY: {
    id: 'BRICKS_CLAY',
    name: 'Standard Burnt Clay Bricks',
    unit: 'Nos',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 50000,
    testingFee: 2000,
    testingUnit: 'Nos',
  },
  BRICKS_FLYASH: {
    id: 'BRICKS_FLYASH',
    name: 'Fly Ash Bricks / AAC Blocks',
    unit: 'Nos',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 50000,
    testingFee: 2200,
    testingUnit: 'Nos',
  },
  STEEL_TMT: {
    id: 'STEEL_TMT',
    name: 'TMT Fe-500 Reinforcement Steel',
    unit: 'MT',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 5, // 1 test per 5 MT per dia
    testingFee: 2500,
    testingUnit: 'MT',
  },
  BINDING_WIRE: {
    id: 'BINDING_WIRE',
    name: 'Annealed Binding Wire',
    unit: 'MT',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 50,
    testingFee: 1000,
    testingUnit: 'MT',
  },
  BITUMEN_VG30: {
    id: 'BITUMEN_VG30',
    name: 'Bitumen Bulk (VG-30)',
    unit: 'MT',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 20,
    testingFee: 4000,
    testingUnit: 'MT',
  },
  PAVER_BLOCKS: {
    id: 'PAVER_BLOCKS',
    name: 'Precast Concrete Paver Blocks',
    unit: 'Nos',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 50000,
    testingFee: 2200,
    testingUnit: 'Nos',
  },
  TILES_CERAMIC: {
    id: 'TILES_CERAMIC',
    name: 'Ceramic / Vitrified Flooring Tiles',
    unit: 'Sqm',
    isMineral: false,
    royaltyRate: 0,
    testingThreshold: 500,
    testingFee: 1800,
    testingUnit: 'Sqm',
  },
};

export const INITIAL_LEAD_SETTINGS: LeadSetting[] = [
  { materialId: 'CEMENT', materialName: 'Portland Pozzolana Cement', unit: 'Bags', sourceQuarry: 'Local Authorized Depot', distanceKm: 5.0, calculatedRate: 8.25 },
  { materialId: 'SAND_SCREENED', materialName: 'Screened Clean Sand', unit: 'Cu.M', sourceQuarry: 'Wainganga River Sand Reach', distanceKm: 14.0, calculatedRate: 277.50 },
  { materialId: 'SAND_LOCAL', materialName: 'Local / Natural Sand', unit: 'Cu.M', sourceQuarry: 'Local Stream Reach', distanceKm: 8.0, calculatedRate: 202.50 },
  { materialId: 'METAL_40MM', materialName: 'Hand Broken Metal (40mm)', unit: 'Cu.M', sourceQuarry: 'Approved Stone Quarry', distanceKm: 12.0, calculatedRate: 252.50 },
  { materialId: 'METAL_20MM', materialName: 'Graded Crushed Metal (20mm)', unit: 'Cu.M', sourceQuarry: 'Seloo Stone Crusher', distanceKm: 16.0, calculatedRate: 302.50 },
  { materialId: 'METAL_10MM', materialName: 'Graded Crushed Metal (10mm)', unit: 'Cu.M', sourceQuarry: 'Seloo Stone Crusher', distanceKm: 16.0, calculatedRate: 302.50 },
  { materialId: 'RUBBLE', materialName: 'Rubble / Stone Spalls', unit: 'Cu.M', sourceQuarry: 'Local Hill Quarry', distanceKm: 10.0, calculatedRate: 227.50 },
  { materialId: 'MURUM', materialName: 'Murum / Earth Fill', unit: 'Cu.M', sourceQuarry: 'Govt. Land Borrow Pit', distanceKm: 3.0, calculatedRate: 0.00 }, // In-situ / borrow pit
  { materialId: 'BRICKS_CLAY', materialName: 'Standard Clay Bricks', unit: '1000 Nos', sourceQuarry: 'Brick Kiln Deoli Road', distanceKm: 10.0, calculatedRate: 350.00 },
  { materialId: 'STEEL_TMT', materialName: 'TMT Fe-500 Reinforcement', unit: 'MT', sourceQuarry: 'Regional Steel Yard Nagpur', distanceKm: 75.0, calculatedRate: 750.00 },
  { materialId: 'BITUMEN_VG30', materialName: 'Bitumen Bulk (VG-30)', unit: 'MT', sourceQuarry: 'IOCL Refinery Depot', distanceKm: 60.0, calculatedRate: 600.00 }, // Flat 10 Rs/MT/km
];

export const AREA_SURCHARGE_MAP: Record<AreaSurchargeType, { label: string; percent: number }> = {
  NONE: { label: 'Standard Normal / Rural Area (0%)', percent: 0.0 },
  MUNICIPAL_CORP: { label: 'Municipal Corporation Area (+5%)', percent: 5.0 },
  MUNICIPAL_COUNCIL: { label: 'Municipal Council Area (+4%)', percent: 4.0 },
  SUGARCANE: { label: 'Sugar Factory Belt within 10km (+5%)', percent: 5.0 },
  TRIBAL_HILLY: { label: 'Notified Tribal / Hilly Area (+10%)', percent: 10.0 },
  CENTRAL_JAIL: { label: 'Central Jail / Mental Hospital Premises (+15%)', percent: 15.0 },
  TIGER_PROJECT: { label: 'Tiger Project / Wildlife Reserve (+20%)', percent: 20.0 },
  MINING: { label: 'Coal / Lime / Manganese Mining Area (+5%)', percent: 5.0 },
  NAXALITE: { label: 'Naxalite Affected Area (+20%)', percent: 20.0 },
  METROPOLITAN: { label: 'Metropolitan Planning Area (+2%)', percent: 2.0 },
};

export const FLOOR_ESCALATION_MAP: Record<string, number> = {
  BASEMENT: 0.0,
  GF: 0.0,
  '1F': 0.01,
  '2F': 0.02,
  '3F': 0.03,
  '4F': 0.04,
  ABOVE_4F: 0.05,
};

import fullSsrData from './ssrFullData.json';
import chaptersData from './ssrChapters.json';

export interface SSRChapterInfo {
  name: string;
  count: number;
  chapterNumber: number;
}

export const SSR_CHAPTERS: SSRChapterInfo[] = chaptersData as SSRChapterInfo[];
export const SSR_MASTER_ITEMS: SSRItem[] = fullSsrData as SSRItem[];

export {
  MAHA_REGIONS,
  MAHA_CIRCLES,
  MAHA_DIVISIONS,
  MAHA_SUBDIVISIONS,
  getSubDivisionsForDivision,
  normalizeMahaRegion,
} from './mahaJurisdictionData';
