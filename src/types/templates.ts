// Smart Estimate Template Types for Maharashtra PWD Estimator (KardeCalc)
import { FloorTag, ProjectFacesheet, EstimateItem } from './estimator';

export type TemplateCategory =
  | 'buildings'    // Buildings, Halls, Classrooms
  | 'roads'        // CC Roads, Asphalt, WBM, Pavers
  | 'boundary'     // Compound Walls, Fencing, Gates
  | 'drainage'     // Drains, Culverts, Gutters
  | 'amenities';   // Sheds, Tanks, Public Amenities

export type TemplateParamType = 'number' | 'select' | 'boolean' | 'string';

export interface TemplateParamOption {
  label: string;
  value: string | number;
  description?: string;
}

export interface TemplateParameter {
  id: string;
  label: string;
  type: TemplateParamType;
  defaultValue: any;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: TemplateParamOption[];
  group: 'geometry' | 'structural' | 'finishing' | 'options';
  helpText?: string;
  dependsOn?: {
    paramId: string;
    value: any;
  };
}

export interface MeasurementFormulaSpec {
  label: string;
  floorTag?: FloorTag;
  multiplierFormula: string; // e.g. "1", "Math.ceil(wallLength / columnSpacing) + 1"
  lengthFormula: string;     // e.g. "wallLength", "0.3"
  breadthFormula: string;    // e.g. "foundationWidth", "0.23"
  depthFormula: string;      // e.g. "foundationDepth", "0.15"
  isDeduction?: boolean;
  conditionFormula?: string; // e.g. "hasGate === true", "wallType === 'BBM'"
}

export interface TemplateItemSpec {
  id: string;
  ssrItemCode: string;
  stageName: string;
  label: string;
  descriptionOverride?: string;
  unitOverride?: string;
  measurements: MeasurementFormulaSpec[];
  isOptional?: boolean;
  defaultIncluded?: boolean;
  inclusionCondition?: string; // e.g. "wallType === 'BBM'", "includeCoping === true"
  technicalNote?: string;
}

export interface SmartTemplate {
  id: string;
  code: string; // e.g. "CW-01"
  title: string;
  titleMarathi: string;
  category: TemplateCategory;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  badge: string;
  typicalCostRange: string;
  typicalTimeframe: string;
  applicableFundHeads: string[];
  defaultFacesheet: Partial<ProjectFacesheet>;
  parameters: TemplateParameter[];
  items: TemplateItemSpec[];
  assumptions: string[];
  verificationAlerts: string[];
  isCustom?: boolean;
  version: string;
  author?: string;
}

export interface GeneratedEstimatePreview {
  template: SmartTemplate;
  parameterValues: Record<string, any>;
  facesheet: ProjectFacesheet;
  items: EstimateItem[];
  subtotalCivilCost: number;
  estimatedGrandTotal: number;
  warnings: string[];
  assumptions: string[];
}
