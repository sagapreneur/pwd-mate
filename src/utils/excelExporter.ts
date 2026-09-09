import * as XLSX from 'xlsx';
import {
  ProjectFacesheet,
  EstimateItem,
  LeadSetting,
  GeneralAbstractRollup,
  BBSElement,
  StampConfig,
} from '../types/estimator';
import {
  calculateDynamicItemRate,
  explodeMaterialConsumption,
  calculateMineralRoyalty,
  calculateTestingRegister,
} from '../engine/calculationEngine';

export interface ExportDataParams {
  facesheet: ProjectFacesheet;
  items: EstimateItem[];
  leadSettings: LeadSetting[];
  calculationRollup: GeneralAbstractRollup;
  bbsElements: BBSElement[];
  stamps: StampConfig[];
}

export function exportFullMahaPwdExcel({
  facesheet,
  items,
  leadSettings,
  calculationRollup,
  bbsElements,
  stamps,
}: ExportDataParams) {
  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------------------
  // 1. COVER SHEET
  // -------------------------------------------------------------------------
  const coverData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA'],
    ['PUBLIC WORKS DEPARTMENT'],
    [`${facesheet.circle} CIRCLE, ${facesheet.division} DIVISION`],
    [`${facesheet.subDivision} SUB-DIVISION`],
    [],
    ['DETAILED PROJECT ESTIMATE & RECAPITULATION (COVER SHEET)'],
    [],
    ['Name of Work:', facesheet.nameOfWork],
    ['Admin Approval No:', facesheet.adminApprovalNo || 'PWD/AA/2023-24/0912'],
    ['Admin Approval Date:', facesheet.adminApprovalDate || '2023-11-15'],
    ['Region:', facesheet.region],
    ['Circle:', facesheet.circle],
    ['Division:', facesheet.division],
    ['Sub-Division:', facesheet.subDivision],
    ['Fund Head:', facesheet.fundHead],
    ['Major Head:', facesheet.majorHead],
    ['Minor Head:', facesheet.minorHead],
    ['SSR Baseline:', facesheet.ssrYear],
    ['Area Surcharge Type:', `${facesheet.areaSurchargeType} (+${facesheet.areaSurchargePercent}%)`],
    [],
    ['FINANCIAL RECAPITULATION SUMMARY:'],
    ["Schedule 'A' Civil Construction Works (₹):", calculationRollup.scheduleA_costOfWork],
    ["Schedule 'B' Statutory Mineral Royalty (₹):", calculationRollup.scheduleB_royalty],
    ["Schedule 'C' Mandatory Quality Testing Charges (₹):", calculationRollup.scheduleC_testing],
    ['Direct Works Subtotal (A + B + C) (₹):', calculationRollup.subtotalDirectWorks],
    [`Add GST @ ${facesheet.gstPercent}% (₹):`, calculationRollup.gstAmount],
    [`Add Labour Welfare Cess @ ${facesheet.laborCessPercent}% (₹):`, calculationRollup.laborCessAmount],
    [`Add Physical Contingencies @ ${facesheet.contingencyPercent}% (₹):`, calculationRollup.contingencyAmount],
    ['Add Electrification Provision (₹):', calculationRollup.electrificationAmount],
    ['TOTAL PROJECTED ESTIMATE COST (₹):', calculationRollup.grandTotal],
    ['SANCTIONED BUDGET ESTIMATE (ROUNDED) (₹):', calculationRollup.sanctionedTotal],
    ['AMOUNT IN LAKHS:', calculationRollup.formattedLakhs],
    [],
    ['DEPARTMENT SIGNATURE AUTHORITIES:'],
    ['Prepared By:', 'Junior Engineer (PWD)'],
    ['Checked By:', 'Assistant Engineer Gr-II / Sectional Engineer'],
    ['Verified & Submitted By:', 'Sub-Divisional Engineer (PWD)'],
    ['Technically Sanctioned By:', 'Executive Engineer (PWD)'],
  ];
  const wsCover = XLSX.utils.aoa_to_sheet(coverData);
  XLSX.utils.book_append_sheet(wb, wsCover, 'COVER');

  // -------------------------------------------------------------------------
  // 2. ESTIMATE (PREAMBLE & BUDGET HEADS)
  // -------------------------------------------------------------------------
  const estimateSheetData: (string | number)[][] = [
    ['', '', '', '', 'E  S  T  I  M  A  T  E'],
    [],
    ['DIVISION', ':', facesheet.division],
    ['SUB-DIVISION', ':', facesheet.subDivision],
    ['FUND HEAD', ':', facesheet.fundHead],
    ['MAJOR HEAD', ':', facesheet.majorHead],
    ['MINOR HEAD', ':', facesheet.minorHead],
    ['SERVICE HEAD', ':', facesheet.serviceHead],
    ['DEPARTMENTAL HEAD', ':', facesheet.departmentalHead || 'Director General / CE PWD'],
    [],
    ['The Detailed Estimate Amounting to Rs.', calculationRollup.sanctionedTotal, `/- Is Framed in the office of the Executive Engineer, ${facesheet.division}, for the probable expenses which may be incurred in the proposed work of:`],
    ['NAME OF WORK:', facesheet.nameOfWork],
    ['AMOUNTING TO RS.', calculationRollup.sanctionedTotal, '/-'],
    [],
    ['Administratively Approved Vide No.:', facesheet.adminApprovalNo, 'DATE:', facesheet.adminApprovalDate],
    ['Technically Sanctioned Vide No.:', facesheet.techSanctionNo || 'TS/PWD/2022-23/01', 'DATE:', facesheet.techSanctionDate || '2022-10-20'],
    [],
    ['ESTIMATE PREPARED', '', '', 'ESTIMATE CHECKED'],
    [],
    [],
    ['Sectional Engineer', '', 'Sub-Divisional Engineer', '', 'Executive Engineer'],
    [facesheet.subDivision, '', facesheet.subDivision, '', facesheet.division],
  ];
  const wsEstimate = XLSX.utils.aoa_to_sheet(estimateSheetData);
  XLSX.utils.book_append_sheet(wb, wsEstimate, 'ESTIMATE');

  // -------------------------------------------------------------------------
  // 3. letter (OFFICIAL MARATHI SDE FORWARDING LETTER)
  // -------------------------------------------------------------------------
  const letterSheetData: (string | number)[][] = [
    ['', '', 'महाराष्ट्र शासन'],
    ['', '', 'उपविभागीय अभियंता यांचे कार्यालय'],
    ['', '', `${facesheet.subDivision}`],
    [],
    [`जावक क्र. ${facesheet.outwardNo || 'जा.क्र./सा.बां.उपवि/तां/२०२६/१४२'}`, '', '', `दिनांक:- ${facesheet.letterDate || '२०/१०/२०२६'}`],
    [],
    ['प्रति,'],
    ['कार्यकारी अभियंता,'],
    [facesheet.division],
    [],
    ['विषय:-', 'अंदाजपत्रक तांत्रिक मान्यतेकरीता सादर करणेबाबत.'],
    ['संदर्भ:-', `१) प्रशासकीय मान्यता क्र. ${facesheet.adminApprovalNo} दिनांक ${facesheet.adminApprovalDate}`],
    [],
    ['महोदय,'],
    ['उपरोक्त संदर्भीय विषयानुसार नमूद कामाचे सविस्तर अंदाजपत्रक या उपविभागाकडून तयार करण्यात आले असून तांत्रिक मान्यतेच्या पुढील कार्यवाही करिता सादर करण्यात येत आहे.'],
    [],
    ['अ.क्र.', 'कामाचे नाव', '', '', '', 'अंदाजीत किमत (रुपये)'],
    [1, facesheet.nameOfWork, '', '', '', calculationRollup.sanctionedTotal],
    [],
    ['आपल्या माहिती करिता सादर.'],
    ['सहपत्र :- प्रस्तावित कामाचे अंदाजपत्रक, दर विश्लेषण, मोजमाप पत्रिका.'],
    [],
    ['', '', '', '', 'उपविभागीय अधिकारी / अभियंता'],
    ['', '', '', '', facesheet.subDivision],
    [],
    ['प्रतीलीपी :- कनिष्ठ अभियंता, सा. बां. उपविभाग, यांना पुढील कार्यवाही करीता अग्रेषित.'],
  ];
  const wsLetter = XLSX.utils.aoa_to_sheet(letterSheetData);
  XLSX.utils.book_append_sheet(wb, wsLetter, 'letter');

  // -------------------------------------------------------------------------
  // 4. GENRAL (GENERAL REPORT & SPECIFICATIONS)
  // -------------------------------------------------------------------------
  const genralSheetData: (string | number)[][] = [
    ['GENERAL REPORT & SPECIFICATION'],
    [],
    ['NAME OF WORK', ':-', facesheet.nameOfWork],
    ['Estimated Cost Rs.', ':-', calculationRollup.sanctionedTotal, '/-'],
    ['AUTHORITY', ':-', facesheet.authority || `Executive Engineer, ${facesheet.division}`],
    ['NECESSITY', ':-', facesheet.necessity || 'The proposed work is essentially required for public infrastructure maintenance and safety as per standard departmental norms.'],
    [],
    ['PROVISIONS MADE IN THIS ESTIMATE:'],
    ...items.map((item, idx) => [`${idx + 1}.`, `${item.description.substring(0, 120)} (SSR Item No. ${item.itemCode})`]),
    [],
    ['SPECIFICATIONS :-', 'The work will be carried out strictly as per standard PWD Red Book specifications and as per instructions of Engineer-in-Charge.'],
    ['RATES :-', `The rates adopted in this estimate are based on District Schedule of Rates (SSR ${facesheet.ssrYear}) with applicable quarry lead and statutory additions.`],
    [],
    ['Sub-Divisional Engineer', '', '', 'Executive Engineer'],
    [facesheet.subDivision, '', '', facesheet.division],
  ];
  const wsGenral = XLSX.utils.aoa_to_sheet(genralSheetData);
  XLSX.utils.book_append_sheet(wb, wsGenral, 'GENRAL');

  // -------------------------------------------------------------------------
  // 5. CERTIFICATE (OFFICIAL TECHNICAL SANCTION CERTIFICATES)
  // -------------------------------------------------------------------------
  const certSheetData: (string | number)[][] = [
    ['C E R T I F I C A T E'],
    ['NAME OF WORK :-', facesheet.nameOfWork],
    [],
    ['Part I: Certificate by SUB-DIVISION:'],
    ['It is Certified that:'],
    ['1.1', 'Lead taken in this estimate is actually measured and Quantity as well as Quality of material are verified by me.'],
    ['1.2', 'Present crust thickness chart and inventory chart attached with estimate is prepared by me.'],
    ['1.3', 'Measurements in estimate are correctly calculated and there will be no excess in quantity while executing the work.'],
    ['1.4', 'Trial pit is taken at site by me and details are attached in estimate.'],
    ['1.5', 'All provisions as per latest GRs / Circulars / IS-IRC Codes have been considered in estimate.'],
    ['1.6', 'Estimate is prepared & Arithmetically 100% checked by me.'],
    [],
    ['Junior / Sectional Engineer', '', '', 'Sub-Divisional Engineer'],
    [facesheet.subDivision, '', '', facesheet.subDivision],
    [],
    ['Part II: Certificate by DIVISION OFFICE:'],
    ['It is Certified that:'],
    ['2.1', 'Estimate is Technically and 100% arithmetically checked in division office.'],
    ['2.2', 'Measurements are checked in the division office & there will be no excess in quantity while executing the work.'],
    ['2.3', 'Rate analysis as well as wording of each item are checked in division office and there is no single item which is not required.'],
    ['2.4', 'It is verified that the estimate is prepared by considering latest GRs / Circulars / IS-IRC Codes.'],
    ['2.5', 'General Report is correctly written and is self explanatory having details of provisions and rates taken.'],
    [],
    ['Sectional Engineer (Division)', '', '', 'Executive Engineer'],
    [facesheet.division, '', '', facesheet.division],
  ];
  const wsCert = XLSX.utils.aoa_to_sheet(certSheetData);
  XLSX.utils.book_append_sheet(wb, wsCert, 'CERTIFICATE');

  // -------------------------------------------------------------------------
  // 6. G.abs (GENERAL ABSTRACT / RECAPITULATION SHEET)
  // -------------------------------------------------------------------------
  const gabsData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ['GENERAL ABSTRACT (RECAPITULATION SHEET)'],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr. No.', 'Particulars / Detailed Head of Expenditure', 'Schedule Ref', 'Amount (Rs.)'],
    [1, "Cost of Work as per Schedule 'A' (Civil Works)", '(A)', calculationRollup.scheduleA_costOfWork],
    [2, "Statutory Royalty Charges as per Schedule 'B'", '(B)', calculationRollup.scheduleB_royalty],
    [3, "Quality Control Testing Fees as per Schedule 'C'", '(C)', calculationRollup.scheduleC_testing],
    ['', 'SUBTOTAL DIRECT WORKS (A + B + C)', '', calculationRollup.subtotalDirectWorks],
    [4, `Add for GST @ ${facesheet.gstPercent}% on (A + B)`, '', calculationRollup.gstAmount],
    [5, `Add for Labour Welfare Cess / Insurance @ ${facesheet.laborCessPercent}% on (A)`, '', calculationRollup.laborCessAmount],
    [6, `Add for Physical Contingencies @ ${facesheet.contingencyPercent}%`, '', calculationRollup.contingencyAmount],
    [7, 'Add for Electrification / Services Installation', '', calculationRollup.electrificationAmount],
    [8, `Add for Area Surcharge (${facesheet.areaSurchargeType} @ ${facesheet.areaSurchargePercent}%)`, '', calculationRollup.areaSurchargeAmount],
    ['', 'TOTAL PROJECTED ESTIMATE COST', '', calculationRollup.grandTotal],
    ['', 'SANCTIONED BUDGET ESTIMATE (ROUNDED OFF)', '', calculationRollup.sanctionedTotal],
    ['', 'BUDGET IN LAKHS', '', calculationRollup.formattedLakhs],
  ];
  const wsGabs = XLSX.utils.aoa_to_sheet(gabsData);
  XLSX.utils.book_append_sheet(wb, wsGabs, 'G.abs');

  // -------------------------------------------------------------------------
  // 3. abstract (SCHEDULE 'A' ITEM ABSTRACT)
  // -------------------------------------------------------------------------
  const abstractData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ["SCHEDULE 'A' - ITEM ABSTRACT OF CIVIL WORKS"],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Item Code', 'Floor Tag', 'Item Description & Technical Specifications', 'Quantity', 'Unit', 'Sanctioned Rate (Rs.)', 'Total Amount (Rs.)'],
  ];

  let absSr = 1;
  items.forEach((item) => {
    const floorGroups: Record<string, number> = {};
    item.measurements.forEach((m) => {
      floorGroups[m.floorTag] = (floorGroups[m.floorTag] || 0) + m.computedQty;
    });

    Object.entries(floorGroups).forEach(([floorTag, qty]) => {
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
          facesheet.ssrBitumenRate
        );
        const amount = Number((qty * rateResult.finalRate).toFixed(2));
        abstractData.push([
          absSr++,
          item.itemCode,
          floorTag,
          item.description,
          Number(qty.toFixed(2)),
          item.unit,
          rateResult.finalRate,
          amount,
        ]);
      }
    });
  });
  abstractData.push([]);
  abstractData.push(['', '', '', "TOTAL SCHEDULE 'A' CIVIL WORKS:", '', '', '', calculationRollup.scheduleA_costOfWork]);
  const wsAbstract = XLSX.utils.aoa_to_sheet(abstractData);
  XLSX.utils.book_append_sheet(wb, wsAbstract, 'abstract');

  // -------------------------------------------------------------------------
  // 4. measurment (STATEMENT 'A' MEASUREMENT SHEET)
  // -------------------------------------------------------------------------
  const measData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ["STATEMENT 'A' - DETAILED MEASUREMENT SHEET (MEASUREMENT BOOK)"],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Item Code', 'Floor', 'Detail of Measurement / Location', 'No (N)', 'Length (m)', 'Breadth (m)', 'Depth (m)', 'Computed Qty', 'Unit'],
  ];

  let mSr = 1;
  items.forEach((it) => {
    it.measurements.forEach((m) => {
      measData.push([
        mSr++,
        it.itemCode,
        m.floorTag,
        (m.isDeduction ? '[Deduct] ' : '') + m.label,
        m.multiplier,
        m.length,
        m.breadth,
        m.depth,
        m.computedQty,
        it.unit,
      ]);
    });
  });
  const wsMeas = XLSX.utils.aoa_to_sheet(measData);
  XLSX.utils.book_append_sheet(wb, wsMeas, 'measurment');

  // -------------------------------------------------------------------------
  // 5. rate ana (STATEMENT 'C-1' RATE ANALYSIS)
  // -------------------------------------------------------------------------
  const rateData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ["STATEMENT 'C-1' - DYNAMIC RATE ANALYSIS & AREA SURCHARGE BREAKDOWN"],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Item Code', 'Description', 'Base SSR Rate', 'Less 21% Labour Cess', 'Net Non-Labor Base', `Add Area Surcharge (${facesheet.areaSurchargePercent}%)`, 'Re-add 21% Cess', 'Quarry Lead Addition', 'Final Unit Rate (Rs.)', 'Unit'],
  ];

  items.forEach((it, idx) => {
    const r = calculateDynamicItemRate(
      it.baseRate,
      leadSettings,
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
    rateData.push([
      idx + 1,
      it.itemCode,
      it.description,
      r.baseRate,
      r.baseRate - r.rateNoCess,
      r.rateNoCess,
      r.surchargedRate - r.rateNoCess,
      r.baseRate - r.rateNoCess,
      r.leadSurchargeTotal,
      r.finalRate,
      it.unit,
    ]);
  });
  const wsRate = XLSX.utils.aoa_to_sheet(rateData);
  XLSX.utils.book_append_sheet(wb, wsRate, 'rate ana');

  // -------------------------------------------------------------------------
  // 6. Royalty (SCHEDULE 'B' STATUTORY MINERAL ROYALTY)
  // -------------------------------------------------------------------------
  const { materialTotals } = explodeMaterialConsumption(items);
  const { royaltyRows, totalRoyalty } = calculateMineralRoyalty(materialTotals);

  const royaltyData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ["SCHEDULE 'B' - STATUTORY MINOR MINERAL ROYALTY STATEMENT"],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Mineral Material Description', 'Gross Volume (Cu.M)', 'Statutory Royalty Rate (Rs.)', 'Royalty Amount (Rs.)'],
  ];

  royaltyRows.forEach((r, idx) => {
    royaltyData.push([idx + 1, r.materialName, r.volumeCuM, r.royaltyRate, r.amount]);
  });
  royaltyData.push([]);
  royaltyData.push(['', "TOTAL SCHEDULE 'B' ROYALTY:", '', '', totalRoyalty]);
  const wsRoyalty = XLSX.utils.aoa_to_sheet(royaltyData);
  XLSX.utils.book_append_sheet(wb, wsRoyalty, 'Royalty');

  // -------------------------------------------------------------------------
  // 7. TESTING CHARGES (SCHEDULE 'C' QUALITY CONTROL REGISTER)
  // -------------------------------------------------------------------------
  const { testRows, totalTestingCost } = calculateTestingRegister(materialTotals);

  const testData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ["SCHEDULE 'C' - MANDATORY QUALITY CONTROL TESTING REGISTER"],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Material Name', 'Test Series Specification', 'Governing Standard', 'Consumed Volume', 'Number of Tests', 'Fee per Test (Rs.)', 'Total Testing Cost (Rs.)'],
  ];

  testRows.forEach((t, idx) => {
    testData.push([
      idx + 1,
      t.materialName,
      t.testSeriesName,
      t.standard,
      t.totalVolume,
      t.batchesCount,
      t.feePerBatch,
      t.totalCost,
    ]);
  });
  testData.push([]);
  testData.push(['', '', '', '', '', "TOTAL SCHEDULE 'C' TESTING FEES:", '', totalTestingCost]);
  const wsTesting = XLSX.utils.aoa_to_sheet(testData);
  XLSX.utils.book_append_sheet(wb, wsTesting, 'TESTING CHARGES');

  // -------------------------------------------------------------------------
  // 8. Lead & quarry (STATEMENT 'B' QUARRY HAULAGE)
  // -------------------------------------------------------------------------
  const leadData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ["STATEMENT 'B' - QUARRY LEAD & MATERIAL HAULAGE CHART"],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Material Name', 'Approved Quarry Source / Depot', 'Unit', 'Lead Distance (Km)', 'Statement C-1 Rate (Rs.)'],
  ];

  leadSettings.forEach((l, idx) => {
    leadData.push([idx + 1, l.materialName, l.sourceQuarry, l.unit, l.distanceKm, l.calculatedRate]);
  });
  const wsLead = XLSX.utils.aoa_to_sheet(leadData);
  XLSX.utils.book_append_sheet(wb, wsLead, 'Lead');

  // -------------------------------------------------------------------------
  // 9. BBS_STEEL (STRUCTURAL STEEL BAR BENDING SCHEDULE)
  // -------------------------------------------------------------------------
  const bbsData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ['STRUCTURAL STEEL BAR BENDING SCHEDULE (IS:2502 / IS:456)'],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Structural Member Type', 'Element Label', 'Bar Dia (mm)', 'Number of Bars', 'Cut Length (m)', 'Unit Weight (kg/m)', 'Total Weight (kg)'],
  ];

  let totalBbsWeight = 0;
  bbsElements.forEach((el, idx) => {
    totalBbsWeight += el.totalWeightKg;
    bbsData.push([
      idx + 1,
      el.elementType,
      el.elementLabel,
      el.barDiaMm,
      el.totalBars,
      el.cutLengthM,
      el.unitWeightKgM,
      el.totalWeightKg,
    ]);
  });
  bbsData.push([]);
  bbsData.push(['', '', '', '', '', "TOTAL STEEL MASS:", `${totalBbsWeight.toFixed(2)} kg`, `(${(totalBbsWeight / 1000).toFixed(3)} MT)`]);
  const wsBBS = XLSX.utils.aoa_to_sheet(bbsData);
  XLSX.utils.book_append_sheet(wb, wsBBS, 'BBS_STEEL');

  // -------------------------------------------------------------------------
  // 10. CONSUMPTION (GROSS MATERIAL BREAKDOWN)
  // -------------------------------------------------------------------------
  const consData: (string | number)[][] = [
    ['GOVERNMENT OF MAHARASHTRA - PUBLIC WORKS DEPARTMENT'],
    ['GROSS MATERIAL THEORETICAL CONSUMPTION STATEMENT'],
    ['Name of Work:', facesheet.nameOfWork],
    [],
    ['Sr', 'Primary Material Head', 'Total Theoretical Consumed Quantity', 'Unit'],
  ];

  let cIdx = 1;
  Object.entries(materialTotals).forEach(([matId, d]) => {
    consData.push([cIdx++, d.materialName, d.totalQty, d.unit]);
  });
  const wsCons = XLSX.utils.aoa_to_sheet(consData);
  XLSX.utils.book_append_sheet(wb, wsCons, 'CONSUMPTION');

  // -------------------------------------------------------------------------
  // SAVE WORKBOOK FILE
  // -------------------------------------------------------------------------
  const safeFilename = facesheet.nameOfWork
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 35);
  XLSX.writeFile(wb, `${safeFilename}_MahaPWD_Estimate_Master.xlsx`);
}
