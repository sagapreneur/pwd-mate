// Zustand Reactive Store for Maharashtra PWD Estimator with LocalStorage Persistence
import { create } from 'zustand';
import {
  ActiveTab,
  ProjectFacesheet,
  EstimateItem,
  LeadSetting,
  BBSElement,
  StampConfig,
  GeneralAbstractRollup,
  MeasurementRow,
  SSRItem,
  SavedEstimateRecord,
} from '../types/estimator';
import {
  INITIAL_LEAD_SETTINGS,
  SSR_MASTER_ITEMS,
  AREA_SURCHARGE_MAP,
} from '../data/ssrMaster';
import {
  calculateRowQuantity,
  calculateStatementC1Lead,
  calculateDynamicItemRate,
  explodeMaterialConsumption,
  calculateMineralRoyalty,
  calculateTestingRegister,
  calculateGeneralAbstract,
} from '../engine/calculationEngine';

interface EstimatorState {
  activeTab: ActiveTab;
  facesheet: ProjectFacesheet;
  items: EstimateItem[];
  leadSettings: LeadSetting[];
  bbsElements: BBSElement[];
  stamps: StampConfig[];
  calculationRollup: GeneralAbstractRollup;
  currentEstimateId: string | null;
  savedEstimates: SavedEstimateRecord[];

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  updateFacesheet: (partial: Partial<ProjectFacesheet>) => void;
  addItemFromSSR: (ssrItem: SSRItem, initialMeasurement?: Partial<MeasurementRow>) => void;
  addCustomItem: (item: Omit<EstimateItem, 'id' | 'sequenceOrder' | 'measurements'>) => void;
  removeItem: (itemId: string) => void;
  addMeasurementRow: (itemId: string, row?: Partial<MeasurementRow>) => void;
  updateMeasurementRow: (itemId: string, rowId: string, partial: Partial<MeasurementRow>) => void;
  removeMeasurementRow: (itemId: string, rowId: string) => void;
  duplicateMeasurementRow: (itemId: string, rowId: string) => void;
  updateLeadSetting: (materialId: string, distanceKm: number, sourceQuarry?: string) => void;
  updateItemConsumptionFactor: (itemId: string, materialId: string, factor: number) => void;
  addBBSElement: (element: BBSElement) => void;
  removeBBSElement: (elementId: string) => void;
  pushBBSToItem2633: () => void;
  updateStamp: (role: string, partial: Partial<StampConfig>) => void;
  recalculateAll: () => void;
  saveCurrentEstimate: (asNew?: boolean) => string;
  loadSavedEstimate: (id: string) => void;
  deleteSavedEstimate: (id: string) => void;
  duplicateSavedEstimate: (id: string) => void;
  createNewEstimate: (customTitle?: string) => void;
  loadGoldenMasterDemo: () => void;
  loadTrainingHomeDemo: () => void;
  loadLibraryDomeDemo: () => void;
  resetEstimate: () => void;
}

const DEFAULT_FACESHEET: ProjectFacesheet = {
  nameOfWork: 'Construction of Two Wheeler Parking Stand Shed at S.P. Office, Tah. Dist. Wardha',
  region: 'Nagpur Region',
  circle: 'Wardha P.W. Circle',
  division: 'Public Works Division, Wardha',
  subDivision: 'P.W. Sub-Division No. 1, Wardha',
  fundHead: 'Police Housing & Infrastructure Development Fund',
  majorHead: '2059 - Public Works',
  minorHead: '051 - Construction',
  serviceHead: 'Home Department (Police Administration)',
  departmentalHead: 'Director General of Police, M.S. Mumbai',
  adminApprovalNo: 'PW/WDH/PLAN/AA/2022-23/4582',
  adminApprovalDate: '2022-09-15',
  techSanctionNo: 'EE/PWD/WDH/TS/2022-23/1842',
  techSanctionDate: '2022-10-20',
  authority: 'Executive Engineer, P.W. Division, Wardha',
  necessity: 'Providing adequate parking shed with water-proofing and steel truss roof for official and staff two-wheelers at S.P. Office complex, Tah. Dist. Wardha.',
  outwardNo: 'जा.क्र./सा.बां.उपवि-१/तां/२०२६/१४२',
  letterDate: '२०/१०/२०२६',
  sanctionedAmount: 300000.0,
  ssrYear: '2022-23',
  status: 'DRAFT',
  areaSurchargeType: 'MUNICIPAL_COUNCIL',
  areaSurchargePercent: 4.0,
  scadaDeductionActive: true,
  scadaDeductionAmount: 126.0,
  currentBitumenRate: 55000.0,
  ssrBitumenRate: 52000.0,
  gstPercent: 18.0,
  contingencyPercent: 2.0,
  laborCessPercent: 0.5,
  electrificationAmount: 22371.0,
};

const DEFAULT_STAMPS: StampConfig[] = [
  {
    role: 'SE',
    name: 'Shri. R. K. Deshmukh',
    designation: 'Sectional Engineer',
    subDivision: 'P.W. Sub-Division No. 1, Wardha',
    showOnCover: true,
    showOnMeasurement: true,
    showOnAbstract: true,
    showOnRateAnalysis: false,
    showOnGeneralAbstract: true,
  },
  {
    role: 'SDE',
    name: 'Er. S. M. Kulkarni',
    designation: 'Sub-Divisional Engineer',
    subDivision: 'P.W. Sub-Division No. 1, Wardha',
    showOnCover: true,
    showOnMeasurement: true,
    showOnAbstract: true,
    showOnRateAnalysis: true,
    showOnGeneralAbstract: true,
  },
  {
    role: 'EE',
    name: 'Er. V. P. Patil',
    designation: 'Executive Engineer',
    subDivision: 'Public Works Division, Wardha',
    showOnCover: true,
    showOnMeasurement: false,
    showOnAbstract: true,
    showOnRateAnalysis: false,
    showOnGeneralAbstract: true,
  },
];

const STORAGE_KEY_SAVED_ESTIMATES = 'maha_pwd_saved_estimates';

function loadSavedEstimatesFromStorage(): SavedEstimateRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_ESTIMATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading saved estimates:', e);
  }
  return [];
}

function persistSavedEstimatesToStorage(estimates: SavedEstimateRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_ESTIMATES, JSON.stringify(estimates));
  } catch (e) {
    console.error('Error saving estimates to localStorage:', e);
  }
}

export const useEstimatorStore = create<EstimatorState>((set, get) => ({
  activeTab: 'facesheet',
  facesheet: { ...DEFAULT_FACESHEET },
  items: [],
  leadSettings: [...INITIAL_LEAD_SETTINGS],
  bbsElements: [],
  stamps: [...DEFAULT_STAMPS],
  calculationRollup: calculateGeneralAbstract(0, 0, 0, DEFAULT_FACESHEET),
  currentEstimateId: null,
  savedEstimates: loadSavedEstimatesFromStorage(),

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateFacesheet: (partial) => {
    set((state) => {
      const updatedFacesheet = { ...state.facesheet, ...partial };
      // If area surcharge type changed, auto-update percent
      if (partial.areaSurchargeType && AREA_SURCHARGE_MAP[partial.areaSurchargeType]) {
        updatedFacesheet.areaSurchargePercent = AREA_SURCHARGE_MAP[partial.areaSurchargeType].percent;
      }
      return { facesheet: updatedFacesheet };
    });
    get().recalculateAll();
  },

  addItemFromSSR: (ssrItem, initialMeasurement) => {
    set((state) => {
      const mult = initialMeasurement?.multiplier ?? 1.0;
      const l = initialMeasurement?.length ?? 1.0;
      const b = initialMeasurement?.breadth ?? 1.0;
      const d = initialMeasurement?.depth ?? 1.0;
      const isDed = initialMeasurement?.isDeduction ?? false;
      const floor = initialMeasurement?.floorTag || 'GF';
      const lbl = initialMeasurement?.label || 'Main Work Item';
      const computed = calculateRowQuantity(mult, l, b, d, isDed);

      const newItem: EstimateItem = {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        ssrItemId: ssrItem.id,
        itemCode: ssrItem.itemCode,
        description: ssrItem.description,
        unit: ssrItem.unit,
        baseRate: ssrItem.baseRate,
        scadaApplicable: ssrItem.scadaApplicable,
        bitumenQtyPerUnit: ssrItem.bitumenQtyPerUnit,
        measurements: [
          {
            id: 'm-' + Date.now(),
            floorTag: floor,
            label: lbl,
            multiplier: mult,
            length: l,
            breadth: b,
            depth: d,
            isDeduction: isDed,
            computedQty: computed,
          },
        ],
        consumptionFactors: { ...ssrItem.defaultCF },
        sequenceOrder: state.items.length + 1,
      };
      return { items: [...state.items, newItem] };
    });
    get().recalculateAll();
  },

  addCustomItem: (itemData) => {
    set((state) => {
      const newItem: EstimateItem = {
        ...itemData,
        id: 'custom-' + Date.now(),
        isCustom: true,
        sequenceOrder: state.items.length + 1,
        measurements: [
          {
            id: 'm-' + Date.now(),
            floorTag: 'GF',
            label: 'Initial Measurement',
            multiplier: 1.0,
            length: 1.0,
            breadth: 1.0,
            depth: 1.0,
            isDeduction: false,
            computedQty: 1.0,
          },
        ],
      };
      return { items: [...state.items, newItem] };
    });
    get().recalculateAll();
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((it) => it.id !== itemId),
    }));
    get().recalculateAll();
  },

  addMeasurementRow: (itemId, rowData) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        const newRow: MeasurementRow = {
          id: 'm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
          floorTag: rowData?.floorTag || 'GF',
          label: rowData?.label || `Detail ${item.measurements.length + 1}`,
          multiplier: rowData?.multiplier ?? 1.0,
          length: rowData?.length ?? 1.0,
          breadth: rowData?.breadth ?? 1.0,
          depth: rowData?.depth ?? 1.0,
          isDeduction: rowData?.isDeduction ?? false,
          computedQty: calculateRowQuantity(
            rowData?.multiplier ?? 1.0,
            rowData?.length ?? 1.0,
            rowData?.breadth ?? 1.0,
            rowData?.depth ?? 1.0,
            rowData?.isDeduction ?? false
          ),
        };
        return {
          ...item,
          measurements: [...item.measurements, newRow],
        };
      }),
    }));
    get().recalculateAll();
  },

  updateMeasurementRow: (itemId, rowId, partial) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          measurements: item.measurements.map((row) => {
            if (row.id !== rowId) return row;
            const updated = { ...row, ...partial };
            updated.computedQty = calculateRowQuantity(
              updated.multiplier,
              updated.length,
              updated.breadth,
              updated.depth,
              updated.isDeduction
            );
            return updated;
          }),
        };
      }),
    }));
    get().recalculateAll();
  },

  removeMeasurementRow: (itemId, rowId) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          measurements: item.measurements.filter((r) => r.id !== rowId),
        };
      }),
    }));
    get().recalculateAll();
  },

  duplicateMeasurementRow: (itemId, rowId) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== itemId) return item;
        const target = item.measurements.find((r) => r.id === rowId);
        if (!target) return item;
        const clone: MeasurementRow = {
          ...target,
          id: 'm-' + Date.now() + '-copy',
          label: `${target.label} (Copy)`,
        };
        return {
          ...item,
          measurements: [...item.measurements, clone],
        };
      }),
    }));
    get().recalculateAll();
  },

  updateLeadSetting: (materialId, distanceKm, sourceQuarry) => {
    set((state) => ({
      leadSettings: state.leadSettings.map((l) => {
        if (l.materialId !== materialId) return l;
        const calculatedRate = calculateStatementC1Lead(distanceKm, materialId);
        return {
          ...l,
          distanceKm,
          calculatedRate,
          sourceQuarry: sourceQuarry !== undefined ? sourceQuarry : l.sourceQuarry,
        };
      }),
    }));
    get().recalculateAll();
  },

  updateItemConsumptionFactor: (itemId, materialId, factor) => {
    set((state) => ({
      items: state.items.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          consumptionFactors: {
            ...it.consumptionFactors,
            [materialId]: Number(factor),
          },
        };
      }),
    }));
    get().recalculateAll();
  },

  addBBSElement: (element) => {
    set((state) => ({
      bbsElements: [...state.bbsElements, element],
    }));
  },

  removeBBSElement: (elementId) => {
    set((state) => ({
      bbsElements: state.bbsElements.filter((b) => b.id !== elementId),
    }));
  },

  pushBBSToItem2633: () => {
    const { bbsElements } = get();
    const totalKg = bbsElements.reduce((sum, el) => sum + el.totalWeightKg, 0);
    const totalMT = Number((totalKg / 1000).toFixed(4));
    if (totalMT <= 0) return;

    // Generate detailed measurement rows for each element for PWD audit trail
    const detailedMeasurements: MeasurementRow[] = bbsElements.map((el, idx) => {
      const elMT = Number((el.totalWeightKg / 1000).toFixed(4));
      return {
        id: 'm-bbs-' + Date.now() + '-' + idx,
        floorTag: 'GF',
        label: `${el.elementLabel} (${el.elementType} - ${el.count} Nos, Ø${el.barDiaMm}mm ${el.spacingMm ? `@ ${el.spacingMm}mm c/c` : ''})`,
        multiplier: 1.0,
        length: elMT,
        breadth: 1.0,
        depth: 1.0,
        isDeduction: false,
        computedQty: elMT,
      };
    });

    set((state) => {
      let tmtItem = state.items.find((it) => it.itemCode === '26.33');
      if (!tmtItem) {
        // Add SSR item 26.33 if not present
        const ssrTmt = SSR_MASTER_ITEMS.find((s) => s.itemCode === '26.33');
        if (ssrTmt) {
          tmtItem = {
            id: 'item-' + Date.now(),
            ssrItemId: ssrTmt.id,
            itemCode: ssrTmt.itemCode,
            description: ssrTmt.description,
            unit: ssrTmt.unit,
            baseRate: ssrTmt.baseRate,
            measurements: detailedMeasurements,
            consumptionFactors: { ...ssrTmt.defaultCF, ms_bars: 1.0 },
            sequenceOrder: state.items.length + 1,
          };
          return { items: [...state.items, tmtItem] };
        }
      } else {
        // Update existing item 26.33 with updated detailed rows
        return {
          items: state.items.map((it) => {
            if (it.id !== tmtItem?.id) return it;
            return {
              ...it,
              measurements: detailedMeasurements,
              consumptionFactors: { ...it.consumptionFactors, ms_bars: 1.0 },
            };
          }),
        };
      }
      return state;
    });

    get().recalculateAll();
  },

  updateStamp: (role, partial) => {
    set((state) => ({
      stamps: state.stamps.map((s) => (s.role === role ? { ...s, ...partial } : s)),
    }));
  },

  recalculateAll: () => {
    const { items, leadSettings, facesheet } = get();

    // 1. Calculate Schedule A: Cost of Civil Work Items
    let costOfWorkA = 0.0;

    for (const item of items) {
      // Group measurements by floor
      const floorGroups: Record<string, number> = {};
      for (const m of item.measurements) {
        floorGroups[m.floorTag] = (floorGroups[m.floorTag] || 0) + m.computedQty;
      }

      for (const [floorTag, qty] of Object.entries(floorGroups)) {
        if (qty !== 0) {
          const rateResult = calculateDynamicItemRate(
            item.baseRate,
            leadSettings,
            item.consumptionFactors,
            facesheet.areaSurchargePercent,
            floorTag,
            item.scadaApplicable,
            facesheet.scadaDeductionActive,
            facesheet.scadaDeductionAmount,
            item.bitumenQtyPerUnit,
            facesheet.currentBitumenRate,
            facesheet.ssrBitumenRate,
            1.0 // Cess isolation %
          );
          costOfWorkA += qty * rateResult.finalRate;
        }
      }
    }

    // 2. Explode consumption
    const { materialTotals } = explodeMaterialConsumption(items);

    // 3. Calculate Schedule B: Royalty
    const { totalRoyalty } = calculateMineralRoyalty(materialTotals);

    // 4. Calculate Schedule C: Testing Register
    const { totalTestingCost } = calculateTestingRegister(materialTotals);

    // 5. Consolidate General Abstract
    const calculationRollup = calculateGeneralAbstract(
      costOfWorkA,
      totalRoyalty,
      totalTestingCost,
      facesheet
    );

    set({ calculationRollup });
  },

  loadGoldenMasterDemo: () => {
    // Benchmark: Two Wheeler Parking Stand Shed Wardha (PARKING_STAND_Sample.xlsx)
    const demoFacesheet: ProjectFacesheet = {
      nameOfWork: 'CONSTRUCTION OF TWO WHEELER PARKING STAND SHED AT. S.P. OFFICE, TAH. DIST. WARDHA.',
      region: 'Nagpur Region',
      circle: 'Wardha P.W. Circle',
      division: 'Public Works Division, Wardha',
      subDivision: 'P.W. Sub-Division No. 1, Wardha',
      fundHead: 'Police Modernization & Infrastructure Scheme',
      majorHead: '2059 - Public Works',
      minorHead: '051 - Construction',
      serviceHead: 'Home Department',
      adminApprovalNo: 'PW/WDH/EST/2022-23/781',
      adminApprovalDate: '2022-08-10',
      sanctionedAmount: 300000.0,
      ssrYear: '2022-23',
      status: 'UNDER_REVIEW',
      areaSurchargeType: 'MUNICIPAL_COUNCIL',
      areaSurchargePercent: 4.0,
      scadaDeductionActive: true,
      scadaDeductionAmount: 126.0,
      currentBitumenRate: 55000.0,
      ssrBitumenRate: 52000.0,
      gstPercent: 18.0,
      contingencyPercent: 2.0,
      laborCessPercent: 0.5,
      electrificationAmount: 22371.0,
    };

    // Realistic authenticated items matching Parking Stand Shed
    const demoItems: EstimateItem[] = [
      {
        id: 'item-demo-1',
        ssrItemId: 'ssr-21-02',
        itemCode: '21.02',
        description: 'Excavation for foundation in earth, soil of all types, sand, gravel and soft murum, including removing excavated material up to 50m, clearing, leveling, ramming and refilling the trenches.',
        unit: 'Cu.M',
        baseRate: 213.55,
        measurements: [
          { id: 'm-d1-1', floorTag: 'GF', label: 'Column Footings (12 Nos)', multiplier: 12, length: 1.2, breadth: 1.2, depth: 1.2, isDeduction: false, computedQty: 20.736 },
          { id: 'm-d1-2', floorTag: 'GF', label: 'Tie Beam Trenches', multiplier: 2, length: 15.0, breadth: 0.45, depth: 0.6, isDeduction: false, computedQty: 8.1 },
          { id: 'm-d1-3', floorTag: 'GF', label: 'Deduct Existing Underground Duct', multiplier: -1, length: 3.0, breadth: 1.0, depth: 1.2, isDeduction: true, computedQty: -3.6 },
        ],
        consumptionFactors: {},
        sequenceOrder: 1,
      },
      {
        id: 'item-demo-2',
        ssrItemId: 'ssr-24-01',
        itemCode: '24.01',
        description: 'Providing and laying in situ plain cement concrete 1:3:6 in foundation and under floors, including compaction and curing.',
        unit: 'Cu.M',
        baseRate: 4120.0,
        measurements: [
          { id: 'm-d2-1', floorTag: 'GF', label: 'Bed Concrete under Footings', multiplier: 12, length: 1.2, breadth: 1.2, depth: 0.1, isDeduction: false, computedQty: 1.728 },
          { id: 'm-d2-2', floorTag: 'GF', label: 'Bed Concrete under Plinth Wall', multiplier: 2, length: 15.0, breadth: 0.45, depth: 0.1, isDeduction: false, computedQty: 1.35 },
        ],
        consumptionFactors: { CEMENT: 4.4, SAND_SCREENED: 0.46, METAL_40MM: 0.92 },
        sequenceOrder: 2,
      },
      {
        id: 'item-demo-3',
        ssrItemId: 'ssr-25-50',
        itemCode: '25.50',
        description: 'Providing and laying in situ cast-in-place M-20 grade concrete for RCC work in isolated footings, column bases, tie beams, vibrating and curing complete (excluding reinforcement).',
        unit: 'Cu.M',
        baseRate: 4980.0,
        scadaApplicable: true,
        measurements: [
          { id: 'm-d3-1', floorTag: 'GF', label: 'RCC Footing Bases', multiplier: 12, length: 0.9, breadth: 0.9, depth: 0.45, isDeduction: false, computedQty: 4.374 },
          { id: 'm-d3-2', floorTag: 'GF', label: 'RCC Plinth Beams', multiplier: 2, length: 15.0, breadth: 0.23, depth: 0.3, isDeduction: false, computedQty: 2.07 },
        ],
        consumptionFactors: { CEMENT: 7.0, SAND_SCREENED: 0.425, METAL_20MM: 0.57, METAL_10MM: 0.28 },
        sequenceOrder: 3,
      },
      {
        id: 'item-demo-4',
        ssrItemId: 'ssr-26-33',
        itemCode: '26.33',
        description: 'Providing, cutting, bending, hooking, tying and placing in position High Yield Strength Deformed TMT Fe-500 bar reinforcement for all RCC structural elements complete.',
        unit: 'MT',
        baseRate: 68500.0,
        measurements: [
          { id: 'm-d4-1', floorTag: 'GF', label: 'Rebar in Footings and Plinth Beams (as per BBS)', multiplier: 1, length: 0.732, breadth: 1.0, depth: 1.0, isDeduction: false, computedQty: 0.732 },
        ],
        consumptionFactors: { STEEL_TMT: 1.0, BINDING_WIRE: 0.01 },
        sequenceOrder: 4,
      },
      {
        id: 'item-demo-5',
        ssrItemId: 'ssr-26-40',
        itemCode: '26.40',
        description: 'Providing and fabricating structural steel work in tubular sections and angles for roof trusses, purlins, staging and framing, including cutting, welding, hoisting and one coat of red oxide primer.',
        unit: 'MT',
        baseRate: 79200.0,
        measurements: [
          { id: 'm-d5-1', floorTag: 'GF', label: 'Tubular Roof Trusses and Purlins', multiplier: 1, length: 1.45, breadth: 1.0, depth: 1.0, isDeduction: false, computedQty: 1.45 },
        ],
        consumptionFactors: {},
        sequenceOrder: 5,
      },
      {
        id: 'item-demo-6',
        ssrItemId: 'ssr-27-01',
        itemCode: '27.01',
        description: 'Providing and constructing second class burnt clay brick masonry in cement mortar 1:6 in plinth wall and foundation.',
        unit: 'Cu.M',
        baseRate: 4680.0,
        measurements: [
          { id: 'm-d6-1', floorTag: 'GF', label: 'Plinth Protection Wall', multiplier: 2, length: 15.0, breadth: 0.23, depth: 0.6, isDeduction: false, computedQty: 4.14 },
        ],
        consumptionFactors: { BRICKS_CLAY: 490.0, CEMENT: 1.4, SAND_SCREENED: 0.3 },
        sequenceOrder: 6,
      },
    ];

    set({
      facesheet: demoFacesheet,
      items: demoItems,
      activeTab: 'generalAbstract',
    });

    get().recalculateAll();
  },

  loadTrainingHomeDemo: () => {
    const trainingFacesheet: ProjectFacesheet = {
      ...DEFAULT_FACESHEET,
      nameOfWork: 'Under Minor Original Work Providing Water Proofing, Colouring, Plumbing and Other Work to Training Store Home Building at Home Guard Office, Wardha',
      adminApprovalNo: 'PWD/WRD/AA/2022-23/4521',
      adminApprovalDate: '2022-10-18',
      sanctionedAmount: 1088342.0,
      areaSurchargePercent: 4.0,
      areaSurchargeType: 'MUNICIPAL_COUNCIL',
      gstPercent: 18.0,
      laborCessPercent: 0.5,
      contingencyPercent: 0.0,
    };

    const trainingItems: EstimateItem[] = [
      {
        id: 'th-item-1',
        itemCode: '2.07',
        description: 'Clearing grass and removal of rubbish, rank vegetation and shrubs within building boundary premises.',
        unit: 'Sq.Mt.',
        baseRate: 4.0,
        measurements: [
          { id: 'th-m-1', floorTag: 'GF', label: 'Ground Premises Site Clearing', multiplier: 1, length: 18.0, breadth: 13.58, depth: 1.0, isDeduction: false, computedQty: 244.44 },
        ],
        consumptionFactors: {},
        sequenceOrder: 1,
      },
      {
        id: 'th-item-2',
        itemCode: '31.03',
        description: 'Providing and applying specialized crystalline surface impregnation water proofing treatment to external surfaces and terraces.',
        unit: 'Liter',
        baseRate: 40.0,
        measurements: [
          { id: 'th-m-2', floorTag: 'GF', label: 'Roof Slab and Walls Penetration Treatment', multiplier: 1, length: 1, breadth: 1, depth: 1, isDeduction: false, computedQty: 1222.2 },
        ],
        consumptionFactors: {},
        sequenceOrder: 2,
      },
      {
        id: 'th-item-3',
        itemCode: '31.05',
        description: 'Providing and laying integrated waterproofing plaster 20mm thick in CM 1:3 with water-proofing chemical compound on terrace slab.',
        unit: 'Sq.Mt.',
        baseRate: 425.0,
        measurements: [
          { id: 'th-m-3', floorTag: 'GF', label: 'Terrace Slab Waterproofing Plaster', multiplier: 1, length: 18.0, breadth: 13.58, depth: 1.0, isDeduction: false, computedQty: 244.44 },
        ],
        consumptionFactors: { CEMENT: 0.38, SAND_SCREENED: 0.045 },
        sequenceOrder: 3,
      },
      {
        id: 'th-item-4',
        itemCode: '38.40',
        description: 'Cleaning and de-silting elevated overhead water storage tanks, including draining, scrubbing, sanitizing with bleaching powder.',
        unit: 'Nos.',
        baseRate: 450.0,
        measurements: [
          { id: 'th-m-4', floorTag: 'GF', label: 'Overhead PVC and RCC Tanks (5000L)', multiplier: 8, length: 1, breadth: 1, depth: 1, isDeduction: false, computedQty: 8.0 },
        ],
        consumptionFactors: {},
        sequenceOrder: 4,
      },
      {
        id: 'th-item-5',
        itemCode: '32.10',
        description: 'Providing and fixing 110mm dia rigid PVC rainwater down-take pipes with necessary fittings, clamps and jointing.',
        unit: 'Rmt.',
        baseRate: 385.0,
        measurements: [
          { id: 'th-m-5', floorTag: 'GF', label: 'Rainwater Down-take Stacks', multiplier: 4, length: 10.0, breadth: 1, depth: 1, isDeduction: false, computedQty: 40.0 },
        ],
        consumptionFactors: {},
        sequenceOrder: 5,
      },
      {
        id: 'th-item-6',
        itemCode: '35.12',
        description: 'Providing and applying two coats of exterior weather-resistant acrylic emulsion paint on outside walls after priming coat.',
        unit: 'Sq.Mt.',
        baseRate: 118.0,
        measurements: [
          { id: 'th-m-6', floorTag: 'GF', label: 'External Walls Elevation Surface Area', multiplier: 1, length: 1, breadth: 1, depth: 1, isDeduction: false, computedQty: 430.04 },
        ],
        consumptionFactors: {},
        sequenceOrder: 6,
      },
      {
        id: 'th-item-7',
        itemCode: '35.08',
        description: 'Providing and applying internal washable oil bound distemper in approved shade on internal wall surfaces.',
        unit: 'Sq.Mt.',
        baseRate: 88.0,
        measurements: [
          { id: 'th-m-7', floorTag: 'GF', label: 'Internal Rooms and Halls Wall Area', multiplier: 1, length: 1, breadth: 1, depth: 1, isDeduction: false, computedQty: 532.58 },
        ],
        consumptionFactors: {},
        sequenceOrder: 7,
      },
      {
        id: 'th-item-8',
        itemCode: '36.02',
        description: 'Providing and applying two coats of synthetic enamel paint to steel doors, windows and grills over red oxide zinc chromate primer.',
        unit: 'Sq.Mt.',
        baseRate: 135.0,
        measurements: [
          { id: 'th-m-8', floorTag: 'GF', label: 'Steel Windows, Doors and Grills', multiplier: 1, length: 1, breadth: 1, depth: 1, isDeduction: false, computedQty: 74.68 },
        ],
        consumptionFactors: {},
        sequenceOrder: 8,
      },
    ];

    set({
      facesheet: trainingFacesheet,
      items: trainingItems,
      activeTab: 'dossier',
    });
    get().recalculateAll();
  },

  loadLibraryDomeDemo: () => {
    const libraryFacesheet: ProjectFacesheet = {
      ...DEFAULT_FACESHEET,
      nameOfWork: 'Under Minor Original Works Providing Waterproofing to Dome Slab Of Main Reading Hall at District Library, Wardha',
      adminApprovalNo: 'PWD/LIB/AA/2022-23/8812',
      adminApprovalDate: '2022-11-04',
      sanctionedAmount: 975864.0,
      areaSurchargePercent: 4.0,
      areaSurchargeType: 'MUNICIPAL_COUNCIL',
      gstPercent: 18.0,
      laborCessPercent: 0.5,
      contingencyPercent: 0.0,
    };

    const libraryItems: EstimateItem[] = [
      {
        id: 'lib-item-1',
        itemCode: '2.07',
        description: 'Clearing grass and site cleaning of dome roof slab, including removing all moss, lichen, dust and loose particles.',
        unit: 'Sq.Mt.',
        baseRate: 4.0,
        measurements: [
          { id: 'lib-m-1', floorTag: 'GF', label: 'Dome Circular Perimeter Surface', multiplier: 1, length: 18.0, breadth: 18.4, depth: 1.0, isDeduction: false, computedQty: 331.2 },
        ],
        consumptionFactors: {},
        sequenceOrder: 1,
      },
      {
        id: 'lib-item-2',
        itemCode: '31.03',
        description: 'Providing and applying specialized deep-penetrating crystalline waterproof polymeric injection grout to RCC spherical dome slab.',
        unit: 'Sq.Mt.',
        baseRate: 325.0,
        measurements: [
          { id: 'lib-m-2', floorTag: 'GF', label: 'Spherical RCC Dome Surface', multiplier: 1, length: 18.0, breadth: 18.4, depth: 1.0, isDeduction: false, computedQty: 331.2 },
        ],
        consumptionFactors: {},
        sequenceOrder: 2,
      },
      {
        id: 'lib-item-3',
        itemCode: '31.05',
        description: 'Providing and laying multi-layered elastomeric waterproofing membrane and fiber-reinforced protective cementitious screed to spherical dome.',
        unit: 'Sq.Mt.',
        baseRate: 2165.0,
        measurements: [
          { id: 'lib-m-3', floorTag: 'GF', label: 'Elastomeric Protective Screed Layer', multiplier: 1, length: 18.0, breadth: 18.4, depth: 1.0, isDeduction: false, computedQty: 331.2 },
        ],
        consumptionFactors: { CEMENT: 0.42, SAND_SCREENED: 0.05 },
        sequenceOrder: 3,
      },
    ];

    set({
      facesheet: libraryFacesheet,
      items: libraryItems,
      activeTab: 'dossier',
    });
    get().recalculateAll();
  },

  saveCurrentEstimate: (asNew = false) => {
    const state = get();
    let targetId = state.currentEstimateId;
    if (asNew || !targetId) {
      targetId = 'est-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    }

    const existingIndex = state.savedEstimates.findIndex((e) => e.id === targetId);
    const now = new Date().toISOString();

    const record: SavedEstimateRecord = {
      id: targetId,
      nameOfWork: state.facesheet.nameOfWork || 'Untitled Estimate',
      division: state.facesheet.division || 'P.W. Division',
      subDivision: state.facesheet.subDivision || 'P.W. Sub-Division',
      sanctionedAmount: state.calculationRollup.sanctionedTotal || state.facesheet.sanctionedAmount || 0,
      itemCount: state.items.length,
      createdAt: existingIndex >= 0 ? state.savedEstimates[existingIndex].createdAt : now,
      updatedAt: now,
      facesheet: { ...state.facesheet },
      items: JSON.parse(JSON.stringify(state.items)),
      leadSettings: JSON.parse(JSON.stringify(state.leadSettings)),
      bbsElements: JSON.parse(JSON.stringify(state.bbsElements)),
      stamps: JSON.parse(JSON.stringify(state.stamps)),
    };

    let updatedList: SavedEstimateRecord[];
    if (existingIndex >= 0) {
      updatedList = state.savedEstimates.map((e, idx) => (idx === existingIndex ? record : e));
    } else {
      updatedList = [record, ...state.savedEstimates];
    }

    persistSavedEstimatesToStorage(updatedList);
    set({
      savedEstimates: updatedList,
      currentEstimateId: targetId,
    });
    return targetId;
  },

  loadSavedEstimate: (id: string) => {
    const state = get();
    const record = state.savedEstimates.find((e) => e.id === id);
    if (!record) return;

    set({
      currentEstimateId: record.id,
      facesheet: { ...record.facesheet },
      items: JSON.parse(JSON.stringify(record.items)),
      leadSettings: JSON.parse(JSON.stringify(record.leadSettings)),
      bbsElements: JSON.parse(JSON.stringify(record.bbsElements)),
      stamps: JSON.parse(JSON.stringify(record.stamps)),
      activeTab: 'abstract',
    });
    get().recalculateAll();
  },

  deleteSavedEstimate: (id: string) => {
    const state = get();
    const updatedList = state.savedEstimates.filter((e) => e.id !== id);
    persistSavedEstimatesToStorage(updatedList);
    set({
      savedEstimates: updatedList,
      currentEstimateId: state.currentEstimateId === id ? null : state.currentEstimateId,
    });
  },

  duplicateSavedEstimate: (id: string) => {
    const state = get();
    const record = state.savedEstimates.find((e) => e.id === id);
    if (!record) return;

    const newId = 'est-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const clonedRecord: SavedEstimateRecord = {
      ...JSON.parse(JSON.stringify(record)),
      id: newId,
      nameOfWork: `${record.nameOfWork} (Copy)`,
      createdAt: now,
      updatedAt: now,
      facesheet: {
        ...record.facesheet,
        nameOfWork: `${record.facesheet.nameOfWork} (Copy)`,
      },
    };

    const updatedList = [clonedRecord, ...state.savedEstimates];
    persistSavedEstimatesToStorage(updatedList);
    set({ savedEstimates: updatedList });
  },

  createNewEstimate: (customTitle?: string) => {
    const blankFacesheet: ProjectFacesheet = {
      nameOfWork: customTitle?.trim() || 'New Maharashtra PWD Work Estimate',
      region: 'Nagpur Region',
      circle: 'Wardha P.W. Circle',
      division: 'Public Works Division, Wardha',
      subDivision: 'P.W. Sub-Division No. 1, Wardha',
      fundHead: 'State Plan Scheme (२५१५ ग्रामविकास कार्यक्रम)',
      majorHead: '2059 - Public Works',
      minorHead: '051 - Construction',
      serviceHead: 'Buildings / Infrastructure',
      departmentalHead: 'Public Works Department, Maharashtra',
      adminApprovalNo: 'PW/PLAN/AA/' + new Date().getFullYear() + '/____',
      adminApprovalDate: new Date().toISOString().split('T')[0],
      techSanctionNo: 'EE/PWD/TS/' + new Date().getFullYear() + '/____',
      techSanctionDate: new Date().toISOString().split('T')[0],
      authority: 'Executive Engineer',
      necessity: 'Detailed project necessity and scope of proposed works.',
      outwardNo: 'जा.क्र./सा.बां./' + new Date().getFullYear() + '/____',
      letterDate: new Date().toLocaleDateString('en-IN'),
      sanctionedAmount: 0.0,
      ssrYear: '2022-23',
      status: 'DRAFT',
      areaSurchargeType: 'MUNICIPAL_COUNCIL',
      areaSurchargePercent: 4.0,
      scadaDeductionActive: true,
      scadaDeductionAmount: 126.0,
      currentBitumenRate: 55000.0,
      ssrBitumenRate: 52000.0,
      gstPercent: 18.0,
      contingencyPercent: 2.0,
      laborCessPercent: 0.5,
      electrificationAmount: 0.0,
    };

    const newId = 'est-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    set({
      currentEstimateId: newId,
      facesheet: blankFacesheet,
      items: [],
      bbsElements: [],
      activeTab: 'facesheet',
    });
    get().recalculateAll();
  },

  resetEstimate: () => {
    set({
      facesheet: { ...DEFAULT_FACESHEET },
      items: [],
      bbsElements: [],
      activeTab: 'facesheet',
    });
    get().recalculateAll();
  },
}));
