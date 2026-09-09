// Core Engineering Calculation Engine for Maharashtra PWD Estimator
import {
  EstimateItem,
  LeadSetting,
  GeneralAbstractRollup,
  ProjectFacesheet,
  BBSElement,
  BBSElementType,
} from '../types/estimator';
import { MATERIALS_MASTER, FLOOR_ESCALATION_MAP } from '../data/ssrMaster';

/**
 * 1. Compute dimensional row quantity with deduction rules
 */
export function calculateRowQuantity(
  multiplier: number = 1.0,
  length: number = 1.0,
  breadth: number = 1.0,
  depth: number = 1.0,
  isDeduction: boolean = false
): number {
  const n = isNaN(multiplier) || multiplier === 0 ? 1.0 : multiplier;
  const l = isNaN(length) || length === 0 ? 1.0 : length;
  const b = isNaN(breadth) || breadth === 0 ? 1.0 : breadth;
  const d = isNaN(depth) || depth === 0 ? 1.0 : depth;

  const raw = Math.abs(n * l * b * d);
  const qty = isDeduction || n < 0 ? -1.0 * raw : raw;
  return Number(qty.toFixed(4));
}

/**
 * 2. Calculate Statement C-1 quarry haulage rate per unit
 */
export function calculateStatementC1Lead(distanceKm: number, materialId: string): number {
  if (distanceKm <= 0) return 0.0;

  // Bitumen linear exception: flat Rs. 10.00 / MT / km
  if (materialId === 'BITUMEN_VG30') {
    return Number((distanceKm * 10.0).toFixed(2));
  }

  // Cement (Bags): standard depot cartage
  if (materialId === 'CEMENT') {
    if (distanceKm <= 1) return 3.5;
    if (distanceKm <= 5) return Number((3.5 + (distanceKm - 1) * 1.1875).toFixed(2));
    if (distanceKm <= 30) return Number((8.25 + (distanceKm - 5) * 0.95).toFixed(2));
    return Number((32.0 + (distanceKm - 30) * 0.75).toFixed(2));
  }

  // Standard quarried minerals (Sand, Stone Aggregates, Murum, Rubble in Cu.M)
  if (distanceKm <= 1.0) {
    return 110.0;
  } else if (distanceKm <= 5.0) {
    return Number((110.0 + (distanceKm - 1.0) * 13.75).toFixed(2));
  } else if (distanceKm <= 30.0) {
    // 5km base = 165.0
    return Number((165.0 + (distanceKm - 5.0) * 12.5).toFixed(2));
  } else {
    // 30km base = 477.5
    return Number((477.5 + (distanceKm - 30.0) * 10.0).toFixed(2));
  }
}

/**
 * 3. Calculate Dynamic Item Unit Rate (Sequential Cess isolation, Area Surcharge, Lead, SCADA, Floor lift)
 */
export function calculateDynamicItemRate(
  baseRate: number,
  leadSettings: LeadSetting[],
  consumptionFactors: Record<string, number>,
  areaSurchargePercent: number = 0.0,
  floorTag: string = 'GF',
  scadaApplicable: boolean = false,
  scadaDeductionActive: boolean = true,
  scadaDeductionAmount: number = 126.0,
  bitumenQtyPerUnit: number = 0.0,
  currentBitumenRate: number = 55000.0,
  ssrBitumenRate: number = 52000.0,
  cessPercent: number = 1.0
): {
  baseRate: number;
  rateNoCess: number;
  surchargedRate: number;
  rateWithCess: number;
  leadSurchargeTotal: number;
  scadaDeduction: number;
  bitumenDelta: number;
  groundFloorRate: number;
  floorEscalationPercent: number;
  finalRate: number;
  leadContributions: { materialName: string; factor: number; rate: number; contribution: number }[];
} {
  // Step 1: Base SSR Rate
  const R_base = baseRate;

  // Step 2: Deduct 1% Labour Welfare Cess
  const cessDivisor = 1 + cessPercent / 100;
  const rateNoCess = Number((R_base / cessDivisor).toFixed(2));

  // Step 3: Apply Area Surcharge
  const areaMultiplier = 1 + areaSurchargePercent / 100;
  const surchargedRate = Number((rateNoCess * areaMultiplier).toFixed(2));

  // Step 4: Restore 1% Labour Welfare Cess
  const rateWithCess = Number((surchargedRate * cessDivisor).toFixed(2));

  // Step 5: Add Material Quarry Lead Surcharges
  let leadSurchargeTotal = 0.0;
  const leadContributions: { materialName: string; factor: number; rate: number; contribution: number }[] = [];

  const leadMap = new Map(leadSettings.map((l) => [l.materialId, l]));

  for (const [matId, factor] of Object.entries(consumptionFactors)) {
    if (factor > 0) {
      const setting = leadMap.get(matId);
      if (setting && setting.calculatedRate > 0) {
        let contrib = factor * setting.calculatedRate;
        // Cement bags conversion to MT lead rate if needed
        if (matId === 'CEMENT' && setting.unit === 'Bags') {
          contrib = factor * setting.calculatedRate;
        }
        leadContributions.push({
          materialName: setting.materialName,
          factor,
          rate: setting.calculatedRate,
          contribution: Number(contrib.toFixed(2)),
        });
        leadSurchargeTotal += contrib;
      }
    }
  }
  leadSurchargeTotal = Number(leadSurchargeTotal.toFixed(2));

  // Step 6: SCADA Concrete Batching Plant Credit (-Rs. 126.00/Cu.M)
  const scadaDeduction = scadaApplicable && scadaDeductionActive ? scadaDeductionAmount : 0.0;

  // Step 7: Bitumen Market Price Delta
  let bitumenDelta = 0.0;
  if (bitumenQtyPerUnit > 0) {
    bitumenDelta = Number((bitumenQtyPerUnit * (currentBitumenRate - ssrBitumenRate)).toFixed(2));
  }

  // Net Ground Floor Unit Rate
  const groundFloorRate = Number(
    (rateWithCess + leadSurchargeTotal - scadaDeduction + bitumenDelta).toFixed(2)
  );

  // Step 8: Floor Elevation Escalation
  const floorEscalationPercent = FLOOR_ESCALATION_MAP[floorTag] || 0.0;
  const finalRate = Number((groundFloorRate * (1 + floorEscalationPercent)).toFixed(2));

  return {
    baseRate: R_base,
    rateNoCess,
    surchargedRate,
    rateWithCess,
    leadSurchargeTotal,
    scadaDeduction,
    bitumenDelta,
    groundFloorRate,
    floorEscalationPercent,
    finalRate,
    leadContributions,
  };
}

/**
 * 4. Explode Gross Material Consumption across items
 */
export function explodeMaterialConsumption(items: EstimateItem[]): {
  materialRows: {
    itemCode: string;
    description: string;
    itemQty: number;
    unit: string;
    materialId: string;
    materialName: string;
    factor: number;
    derivedQty: number;
    materialUnit: string;
  }[];
  materialTotals: Record<string, { materialName: string; totalQty: number; unit: string }>;
} {
  const materialRows: {
    itemCode: string;
    description: string;
    itemQty: number;
    unit: string;
    materialId: string;
    materialName: string;
    factor: number;
    derivedQty: number;
    materialUnit: string;
  }[] = [];

  const materialTotals: Record<string, { materialName: string; totalQty: number; unit: string }> = {};

  for (const item of items) {
    const totalQty = item.measurements.reduce((sum, m) => sum + m.computedQty, 0);
    if (totalQty <= 0) continue;

    for (const [matId, factor] of Object.entries(item.consumptionFactors)) {
      if (factor > 0) {
        const matMaster = MATERIALS_MASTER[matId];
        const derivedQty = Number((totalQty * factor).toFixed(4));
        const matName = matMaster ? matMaster.name : matId;
        const matUnit = matMaster ? matMaster.unit : 'Units';

        materialRows.push({
          itemCode: item.itemCode,
          description: item.description,
          itemQty: totalQty,
          unit: item.unit,
          materialId: matId,
          materialName: matName,
          factor,
          derivedQty,
          materialUnit: matUnit,
        });

        if (!materialTotals[matId]) {
          materialTotals[matId] = { materialName: matName, totalQty: 0, unit: matUnit };
        }
        materialTotals[matId].totalQty += derivedQty;
      }
    }
  }

  // Round totals
  for (const k of Object.keys(materialTotals)) {
    materialTotals[k].totalQty = Number(materialTotals[k].totalQty.toFixed(3));
  }

  return { materialRows, materialTotals };
}

/**
 * 5. Calculate Statutory Mineral Royalty (Schedule B)
 */
export function calculateMineralRoyalty(
  materialTotals: Record<string, { materialName: string; totalQty: number; unit: string }>
): {
  royaltyRows: {
    materialId: string;
    materialName: string;
    volumeCuM: number;
    royaltyRate: number;
    amount: number;
  }[];
  totalRoyalty: number;
} {
  const royaltyRows: {
    materialId: string;
    materialName: string;
    volumeCuM: number;
    royaltyRate: number;
    amount: number;
  }[] = [];

  let totalRoyalty = 0.0;

  for (const [matId, data] of Object.entries(materialTotals)) {
    const master = MATERIALS_MASTER[matId];
    if (master && master.isMineral && master.royaltyRate > 0 && data.totalQty > 0) {
      const amount = Number((data.totalQty * master.royaltyRate).toFixed(2));
      royaltyRows.push({
        materialId: matId,
        materialName: master.name,
        volumeCuM: data.totalQty,
        royaltyRate: master.royaltyRate,
        amount,
      });
      totalRoyalty += amount;
    }
  }

  return {
    royaltyRows,
    totalRoyalty: Number(totalRoyalty.toFixed(2)),
  };
}

/**
 * 6. Calculate Material Testing Frequency Register (Schedule C)
 */
export function calculateTestingRegister(
  materialTotals: Record<string, { materialName: string; totalQty: number; unit: string }>
): {
  testRows: {
    materialId: string;
    materialName: string;
    totalVolume: number;
    standard: string;
    testSeriesName: string;
    threshold: number;
    batchesCount: number;
    feePerBatch: number;
    totalCost: number;
  }[];
  totalTestingCost: number;
} {
  const testRows: {
    materialId: string;
    materialName: string;
    totalVolume: number;
    standard: string;
    testSeriesName: string;
    threshold: number;
    batchesCount: number;
    feePerBatch: number;
    totalCost: number;
  }[] = [];

  let totalTestingCost = 0.0;

  for (const [matId, data] of Object.entries(materialTotals)) {
    const master = MATERIALS_MASTER[matId];
    if (master && master.testingThreshold > 0 && data.totalQty > 0) {
      const batchesCount = Math.max(1, Math.ceil(data.totalQty / master.testingThreshold));
      const totalCost = batchesCount * master.testingFee;

      let standard = 'PWD Handbook Ch. 33';
      let testSeries = 'Mandatory Physical & Quality Tests';

      if (matId === 'CEMENT') {
        standard = 'PWD Handbook Ch. 33 / IS:4031';
        testSeries = 'Compressive Strength, Setting Time, Soundness & Fineness';
      } else if (matId.startsWith('METAL') || matId === 'RUBBLE') {
        standard = 'PWD Handbook Ch. 3 / IS:2386';
        testSeries = 'Crushing Value, Impact Value, Flakiness & Absorption';
      } else if (matId.startsWith('SAND')) {
        standard = 'PWD Handbook Ch. 3 / IS:2386';
        testSeries = 'Fineness Modulus, Silt Content & Particle Gradation';
      } else if (matId === 'STEEL_TMT') {
        standard = 'IS:432 / IS:1786';
        testSeries = 'Tensile Strength, 0.2% Proof Stress & Elongation';
      } else if (matId.startsWith('BRICKS')) {
        standard = 'IS:1077';
        testSeries = 'Compressive Strength, Water Absorption & Efflorescence';
      }

      testRows.push({
        materialId: matId,
        materialName: master.name,
        totalVolume: data.totalQty,
        standard,
        testSeriesName: testSeries,
        threshold: master.testingThreshold,
        batchesCount,
        feePerBatch: master.testingFee,
        totalCost,
      });

      totalTestingCost += totalCost;
    }
  }

  return {
    testRows,
    totalTestingCost: Number(totalTestingCost.toFixed(2)),
  };
}

/**
 * 7. Calculate Structural Steel Bar Bending Schedule (BBS)
 */
export function calculateSteelBBS(
  elementType: BBSElementType,
  elementLabel: string,
  count: number,
  barDiaMm: number,
  lengthM: number,
  breadthM: number,
  depthM: number,
  coverMm: number = 50,
  spacingMm: number = 150
): BBSElement {
  // Nominal weight: w = (Dia^2) / 162.28 kg/m
  const unitWeightKgM = Number(((barDiaMm * barDiaMm) / 162.28).toFixed(4));
  const coverM = coverMm / 1000;
  const spacingM = spacingMm / 1000;

  let cutLengthM = 1.0;
  let barsPerElement = 1;

  if (elementType === 'FOOTING') {
    const lEff = Math.max(0.1, lengthM - 2 * coverM);
    const bEff = Math.max(0.1, breadthM - 2 * coverM);
    const hookBendAllowance = 2 * (depthM - 2 * coverM); // 90 degree bends up sides

    const nx = Math.ceil(bEff / spacingM) + 1;
    const ny = Math.ceil(lEff / spacingM) + 1;

    barsPerElement = nx + ny;
    const avgLen = (lEff + bEff) / 2 + hookBendAllowance;
    cutLengthM = Number(avgLen.toFixed(3));
  } else if (elementType === 'COLUMN') {
    // Height + lap length 50d
    const lapLengthM = (50 * barDiaMm) / 1000;
    cutLengthM = Number((depthM + lapLengthM).toFixed(3));
    barsPerElement = Math.max(4, count); // e.g. 4 or 8 main bars
  } else if (elementType === 'BEAM') {
    // Clear span + anchorage hooks 2 * 9d
    const hookM = (2 * 9 * barDiaMm) / 1000;
    cutLengthM = Number((lengthM + hookM).toFixed(3));
    barsPerElement = 4;
  } else {
    // SLAB
    const spanEff = Math.max(0.5, breadthM - 2 * coverM);
    barsPerElement = Math.ceil(lengthM / spacingM) + 1;
    cutLengthM = Number((spanEff + 0.2).toFixed(3));
  }

  const totalBars = count * barsPerElement;
  const totalLengthM = totalBars * cutLengthM;
  const totalWeightKg = Number((totalLengthM * unitWeightKgM).toFixed(2));

  return {
    id: 'bbs-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    elementType,
    elementLabel,
    count,
    barDiaMm,
    spacingMm,
    cutLengthM,
    barsPerElement,
    totalBars,
    unitWeightKgM,
    totalWeightKg,
  };
}

/**
 * 8. Consolidated General Abstract Recapitulation Engine
 */
export function calculateGeneralAbstract(
  costOfWorkA: number,
  royaltyB: number,
  testingC: number,
  facesheet: ProjectFacesheet
): GeneralAbstractRollup {
  const scheduleA = Number(costOfWorkA.toFixed(2));
  const scheduleB = Number(royaltyB.toFixed(2));
  const scheduleC = Number(testingC.toFixed(2));
  const subtotalDirect = Number((scheduleA + scheduleB + scheduleC).toFixed(2));

  // GST 18% on (A + B) or A per division practice
  const gstAmount = Number(((facesheet.gstPercent / 100) * (scheduleA + scheduleB)).toFixed(2));

  // Contingency 2% on Direct Works Subtotal
  const contingencyAmount = Number(((facesheet.contingencyPercent / 100) * subtotalDirect).toFixed(2));

  // Labour Welfare Cess 1% on Schedule A
  const laborCessAmount = Number(((facesheet.laborCessPercent / 100) * scheduleA).toFixed(2));

  // Area Surcharge (if not included inside Rate Analysis)
  const areaSurchargeAmount = 0.0;

  // Electrification
  const electrificationAmount = Number((facesheet.electrificationAmount || 0).toFixed(2));

  // Total Projected Cost
  const grandTotal = Number(
    (
      subtotalDirect +
      gstAmount +
      contingencyAmount +
      laborCessAmount +
      areaSurchargeAmount +
      electrificationAmount
    ).toFixed(2)
  );

  // Sanctioned Total rounded to nearest whole rupee
  const sanctionedTotal = Math.round(grandTotal);

  // Lakhs formatting (e.g. 2.98 Lakhs)
  const lakhsVal = (sanctionedTotal / 100000).toFixed(2);
  const formattedLakhs = `₹${sanctionedTotal.toLocaleString('en-IN')} (Rs. ${lakhsVal} Lakhs)`;

  return {
    scheduleA_costOfWork: scheduleA,
    scheduleB_royalty: scheduleB,
    scheduleC_testing: scheduleC,
    subtotalDirectWorks: subtotalDirect,
    gstAmount,
    contingencyAmount,
    laborCessAmount,
    areaSurchargeAmount,
    electrificationAmount,
    grandTotal,
    sanctionedTotal,
    formattedLakhs,
  };
}
