// Safe Calculation and Generation Engine for Smart Estimate Templates
import { SmartTemplate, TemplateItemSpec, MeasurementFormulaSpec, GeneratedEstimatePreview } from '../types/templates';
import { EstimateItem, MeasurementRow, ProjectFacesheet, SSRItem } from '../types/estimator';
import { SSR_MASTER_ITEMS, INITIAL_LEAD_SETTINGS } from '../data/ssrMaster';
import { calculateRowQuantity, calculateDynamicItemRate, calculateGeneralAbstract } from './calculationEngine';

/**
 * Safely evaluates a numeric formula expression using parameter values.
 */
export function evaluateNumericFormula(formula: string, params: Record<string, any>): number {
  if (!formula || formula.trim() === '') return 0;
  
  // Quick check for numeric literal
  const asNum = Number(formula);
  if (!isNaN(asNum)) return asNum;

  try {
    // Sanitize and replace variable names
    // Create a safe evaluation scope with Math and params
    const paramNames = Object.keys(params);
    const paramValues = Object.values(params);

    // Create a function with Math builtins and parameter keys
    const evaluator = new Function(
      'Math',
      ...paramNames,
      `"use strict"; return (${formula});`
    );

    const result = evaluator(Math, ...paramValues);
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return Math.round(result * 1000) / 1000;
    }
    return 0;
  } catch (err) {
    console.warn(`Error evaluating formula: "${formula}" with params`, params, err);
    return 0;
  }
}

/**
 * Safely evaluates a boolean condition expression.
 */
export function evaluateBooleanCondition(condition: string | undefined, params: Record<string, any>): boolean {
  if (!condition || condition.trim() === '') return true;

  try {
    const paramNames = Object.keys(params);
    const paramValues = Object.values(params);

    const evaluator = new Function(
      'Math',
      ...paramNames,
      `"use strict"; return Boolean(${condition});`
    );

    return Boolean(evaluator(Math, ...paramValues));
  } catch (err) {
    console.warn(`Error evaluating condition: "${condition}" with params`, params, err);
    return true;
  }
}

/**
 * Finds matching SSR item from SSR_MASTER_ITEMS by exact or normalized itemCode.
 */
export function findSSRItem(code: string): SSRItem | undefined {
  const cleanCode = code.trim();
  // 1. Exact match
  let found = SSR_MASTER_ITEMS.find((s) => s.itemCode === cleanCode);
  if (found) return found;

  // 2. Case-insensitive
  found = SSR_MASTER_ITEMS.find((s) => s.itemCode.toLowerCase() === cleanCode.toLowerCase());
  if (found) return found;

  // 3. Prefix match (e.g. '24.01' -> '24.01')
  found = SSR_MASTER_ITEMS.find((s) => s.itemCode.startsWith(cleanCode));
  return found;
}

/**
 * Generates an EstimateItem from a template item specification and parameter inputs.
 */
export function generateEstimateItemFromSpec(
  spec: TemplateItemSpec,
  params: Record<string, any>,
  seqIndex: number
): EstimateItem | null {
  // Check inclusion condition
  if (spec.inclusionCondition && !evaluateBooleanCondition(spec.inclusionCondition, params)) {
    return null;
  }

  // Lookup in SSR database
  const ssrMatch = findSSRItem(spec.ssrItemCode);

  const itemCode = ssrMatch?.itemCode || spec.ssrItemCode;
  const description = spec.descriptionOverride || ssrMatch?.description || spec.label;
  const unit = spec.unitOverride || ssrMatch?.unit || 'Cu.M';
  const baseRate = ssrMatch?.baseRate || 1000;
  const defaultCF = ssrMatch?.defaultCF ? { ...ssrMatch.defaultCF } : {};
  const scadaApplicable = ssrMatch?.scadaApplicable ?? false;
  const bitumenQty = ssrMatch?.bitumenQtyPerUnit ?? 0;

  // Generate measurement rows
  const measurementRows: MeasurementRow[] = [];

  for (let idx = 0; idx < spec.measurements.length; idx++) {
    const mSpec = spec.measurements[idx];
    
    // Check row condition
    if (mSpec.conditionFormula && !evaluateBooleanCondition(mSpec.conditionFormula, params)) {
      continue;
    }

    const mult = Math.max(0.001, evaluateNumericFormula(mSpec.multiplierFormula, params));
    const l = Math.max(0.001, evaluateNumericFormula(mSpec.lengthFormula, params));
    const b = Math.max(0.001, evaluateNumericFormula(mSpec.breadthFormula, params));
    const d = Math.max(0.001, evaluateNumericFormula(mSpec.depthFormula, params));
    const isDed = Boolean(mSpec.isDeduction);
    const computed = calculateRowQuantity(mult, l, b, d, isDed);

    // If computed qty is near 0 or NaN, still keep if valid dimensions
    measurementRows.push({
      id: `m-${Date.now()}-${seqIndex}-${idx}`,
      floorTag: mSpec.floorTag || 'GF',
      label: mSpec.label,
      multiplier: mult,
      length: l,
      breadth: b,
      depth: d,
      isDeduction: isDed,
      computedQty: computed,
    });
  }

  // If no measurements were generated, create one fallback row
  if (measurementRows.length === 0) {
    measurementRows.push({
      id: `m-${Date.now()}-${seqIndex}-0`,
      floorTag: 'GF',
      label: 'Main Work Component',
      multiplier: 1,
      length: 1,
      breadth: 1,
      depth: 1,
      isDeduction: false,
      computedQty: 1,
    });
  }

  return {
    id: `item-tpl-${Date.now()}-${seqIndex}`,
    ssrItemId: ssrMatch?.id,
    itemCode,
    description,
    unit,
    baseRate,
    scadaApplicable,
    bitumenQtyPerUnit: bitumenQty,
    measurements: measurementRows,
    consumptionFactors: defaultCF,
    sequenceOrder: seqIndex + 1,
  };
}

/**
 * Generates full preview estimate from a template and user parameter inputs.
 */
export function generateEstimateFromTemplate(
  template: SmartTemplate,
  userParams: Record<string, any>,
  baseFacesheet: ProjectFacesheet
): GeneratedEstimatePreview {
  // Merge default parameter values with user inputs
  const parameterValues: Record<string, any> = {};
  for (const p of template.parameters) {
    parameterValues[p.id] = userParams[p.id] !== undefined ? userParams[p.id] : p.defaultValue;
  }

  // Build facesheet
  const facesheet: ProjectFacesheet = {
    ...baseFacesheet,
    ...template.defaultFacesheet,
    nameOfWork: userParams.nameOfWork || template.defaultFacesheet.nameOfWork || `${template.title} at Proposed Site`,
    ssrYear: '2022-23',
    status: 'DRAFT',
  };

  // Generate estimate items
  const items: EstimateItem[] = [];
  let seq = 0;
  for (const itemSpec of template.items) {
    const item = generateEstimateItemFromSpec(itemSpec, parameterValues, seq);
    if (item) {
      items.push(item);
      seq++;
    }
  }

  // Calculate approximate subtotal civil cost
  let subtotalCivilCost = 0;
  for (const it of items) {
    const totalQty = it.measurements.reduce((acc, m) => acc + m.computedQty, 0);
    const ratePreview = calculateDynamicItemRate(
      it.baseRate,
      INITIAL_LEAD_SETTINGS,
      it.consumptionFactors,
      facesheet.areaSurchargePercent,
      'GF',
      it.scadaApplicable,
      facesheet.scadaDeductionActive,
      facesheet.scadaDeductionAmount,
      it.bitumenQtyPerUnit,
      facesheet.currentBitumenRate,
      facesheet.ssrBitumenRate
    );
    subtotalCivilCost += totalQty * ratePreview.finalRate;
  }

  // Estimate grand total including GST + contingencies + cess
  const rollup = calculateGeneralAbstract(subtotalCivilCost, subtotalCivilCost * 0.02, subtotalCivilCost * 0.01, facesheet);
  const estimatedGrandTotal = rollup.grandTotal;

  // Compile warnings
  const warnings: string[] = [];
  if (parameterValues.wallLength && parameterValues.wallLength > 500) {
    warnings.push('Wall length exceeds 500m: Consider breaking into multiple work phases or adding expansion joint allowances.');
  }
  if (parameterValues.roadLength && parameterValues.roadLength > 1000) {
    warnings.push('Road length exceeds 1.0 km: Ensure lead chart reflects local quarry sources across the entire stretch.');
  }
  if (parameterValues.foundationDepth && parameterValues.foundationDepth < 0.6) {
    warnings.push('Foundation depth is less than 0.60m: Verify local soil bearing capacity and minimum frost/scour depth.');
  }

  return {
    template,
    parameterValues,
    facesheet,
    items,
    subtotalCivilCost: Math.round(subtotalCivilCost),
    estimatedGrandTotal: Math.round(estimatedGrandTotal),
    warnings: [...template.verificationAlerts, ...warnings],
    assumptions: [...template.assumptions],
  };
}
