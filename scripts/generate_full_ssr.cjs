const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelPath = path.resolve(__dirname, '../SSR ITEMS.xlsx');
console.log('Reading Excel file:', excelPath);

const wb = xlsx.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

console.log('Total sheet rows:', data.length);

let currentChapter = 'General';
let currentParentCode = '';
let currentSectionHeader = 'Road & Building Works';

const items = [];
const chaptersMap = new Map();

// Helper to clean strings
function cleanStr(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Standardize unit
function standardizeUnit(shortUnit, longUnit) {
  const s = cleanStr(shortUnit || longUnit).toLowerCase();
  if (s.includes('cum') || s.includes('cubic')) return 'Cu.M';
  if (s.includes('sqm') || s.includes('square') || s.includes('sq.m')) return 'Sqm';
  if (s.includes('rmt') || s.includes('running') || s.includes('metre') || s.includes('meter')) {
    if (s.includes('km') || s.includes('kilometre')) return 'Km';
    return 'Rmt';
  }
  if (s.includes('km') || s.includes('kilometre')) return 'Km';
  if (s.includes('no') || s.includes('each') || s.includes('per no')) return 'Nos';
  if (s.includes('tonne') || s.includes('m.t') || s.includes('mt')) return 'MT';
  if (s.includes('kg') || s.includes('kilogram')) return 'Kg';
  if (s.includes('set')) return 'Set';
  if (s.includes('point') || s.includes('pt')) return 'Point';
  if (s.includes('l.s') || s.includes('lump')) return 'L.S.';
  if (s.includes('day')) return 'Day';
  if (s.includes('hr') || s.includes('hour')) return 'Hour';
  if (s.includes('job')) return 'Job';
  
  return cleanStr(shortUnit || longUnit) || 'Unit';
}

for (let r = 3; r < data.length; r++) {
  const row = data[r];
  if (!row || row.length === 0) continue;

  const rawItemNo = row[2];
  const rawDesc = row[4];

  // Check if this row is a chapter or section heading
  if (rawItemNo === undefined || rawItemNo === null || String(rawItemNo).trim() === '') {
    // Check first 5 columns for a section/chapter title
    for (let c = 0; c < 5; c++) {
      const text = cleanStr(row[c]);
      if (text.length > 2 && isNaN(text)) {
        currentSectionHeader = text;
        currentChapter = text;
        break;
      }
    }
    continue;
  }

  // If there's no description, skip
  if (!rawDesc || cleanStr(rawDesc) === '') continue;

  const rawCodeStr = cleanStr(rawItemNo);
  let itemCode = rawCodeStr;

  // If item code is just a sub-letter (a, b, c, d, e, etc.)
  if (/^[a-zA-Z]$/.test(rawCodeStr) && currentParentCode) {
    itemCode = `${currentParentCode}(${rawCodeStr})`;
  } else if (/^[a-zA-Z0-9.]+$/.test(rawCodeStr)) {
    // If it's a primary code with numbers like 21.01, 1.04, 25.11a
    if (/\d/.test(rawCodeStr)) {
      currentParentCode = rawCodeStr;
    }
  }

  // Resolve chapter name
  let chName = cleanStr(row[1]);
  if (!chName || chName === 'General' || chName === '1' || chName === '2') {
    chName = currentChapter || currentSectionHeader || 'General';
  } else {
    currentChapter = chName;
  }

  // Derive chapter number
  let chNum = 0;
  const match = itemCode.match(/^(\d+)/);
  if (match) {
    chNum = parseInt(match[1], 10);
  }

  const desc = cleanStr(rawDesc);
  const spec = cleanStr(row[5]);
  const fullDesc = spec && spec !== desc && spec !== 'As directed by Engineer in charge' && spec !== 'As directed by Engineer-in-charge'
    ? `${desc} (Spec: ${spec})`
    : desc;

  const unit = standardizeUnit(row[37], row[6]);
  const baseRate = Number(row[7]) || 0;
  const laborRate = Number(row[8]) || 0;

  // Extract material consumption factors
  const defaultCF = {};
  // 1. Cement: in SSR it's in MT -> multiply by 20 to get Bags (50kg each)
  if (row[9] && Number(row[9]) > 0) {
    const bags = Number(row[9]) * 20;
    defaultCF['CEMENT'] = Number(bags.toFixed(3));
  }
  // 2. Steel: in MT
  if (row[10] && Number(row[10]) > 0) defaultCF['STEEL_TMT'] = Number(Number(row[10]).toFixed(4));
  // 3. Metal below 40mm: Cu.M
  if (row[11] && Number(row[11]) > 0) defaultCF['METAL_20MM'] = Number(Number(row[11]).toFixed(3));
  // 4. Metal 40mm & above: Cu.M
  if (row[12] && Number(row[12]) > 0) defaultCF['METAL_40MM'] = Number(Number(row[12]).toFixed(3));
  // 5. Rubble: Cu.M
  if (row[13] && Number(row[13]) > 0) defaultCF['RUBBLE'] = Number(Number(row[13]).toFixed(3));
  // 6. Screening metal: Cu.M
  if (row[14] && Number(row[14]) > 0) defaultCF['METAL_10MM'] = Number(Number(row[14]).toFixed(3));
  // 7. Fine Sand: Cu.M
  if (row[15] && Number(row[15]) > 0) defaultCF['SAND_SCREENED'] = Number(Number(row[15]).toFixed(3));
  // 8. Local Sand: Cu.M
  if (row[16] && Number(row[16]) > 0) defaultCF['SAND_LOCAL'] = Number(Number(row[16]).toFixed(3));
  // 9. Murrum: Cu.M
  if (row[17] && Number(row[17]) > 0) defaultCF['MURUM'] = Number(Number(row[17]).toFixed(3));
  // 10. Stone Dust: Cu.M
  if (row[18] && Number(row[18]) > 0) defaultCF['STONE_DUST'] = Number(Number(row[18]).toFixed(3));
  // 11. B.B. Bricks: Nos
  if (row[19] && Number(row[19]) > 0) defaultCF['BRICKS_CLAY'] = Number(Number(row[19]).toFixed(1));
  // 12. Fly Ash Bricks: Nos
  if (row[20] && Number(row[20]) > 0) defaultCF['BRICKS_FLYASH'] = Number(Number(row[20]).toFixed(1));
  // 13. Tiles: Sqm
  if (row[22] && Number(row[22]) > 0) defaultCF['TILES_CERAMIC'] = Number(Number(row[22]).toFixed(2));
  // 14. Paver blocks: Nos
  if (row[23] && Number(row[23]) > 0) defaultCF['PAVER_BLOCKS'] = Number(Number(row[23]).toFixed(1));

  // Bitumen
  const bitumenAtPlant = Number(row[26]) || 0;
  const bitumenAtSite = Number(row[27]) || 0;
  const bitumenPack = Number(row[28]) || 0;
  const totalBitumen = bitumenAtPlant + bitumenAtSite + bitumenPack;
  if (totalBitumen > 0) {
    defaultCF['BITUMEN_VG30'] = Number(totalBitumen.toFixed(4));
  }

  // SCADA
  const scadaApplicable = Boolean(row[35] && Number(row[35]) > 0);

  // Clean ID
  const sanitizedCode = itemCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  const id = `ssr-${sanitizedCode}-${items.length + 1}`;

  const ssrItem = {
    id,
    ssrYear: '2022-23',
    itemCode,
    chapterNumber: chNum,
    chapterName: chName,
    description: fullDesc,
    unit,
    baseRate,
    laborRate: laborRate > 0 ? laborRate : undefined,
    defaultCF,
    scadaApplicable: scadaApplicable || undefined,
    bitumenQtyPerUnit: totalBitumen > 0 ? Number(totalBitumen.toFixed(4)) : undefined,
  };

  items.push(ssrItem);

  // Track chapters
  if (!chaptersMap.has(chName)) {
    chaptersMap.set(chName, { name: chName, count: 0, chapterNumber: chNum });
  }
  chaptersMap.get(chName).count++;
}

console.log(`Successfully parsed ${items.length} official SSR items across ${chaptersMap.size} chapters.`);

// Save JSON file
const outJsonPath = path.resolve(__dirname, '../src/data/ssrFullData.json');
fs.writeFileSync(outJsonPath, JSON.stringify(items, null, 2), 'utf8');
console.log('Saved SSR items JSON to:', outJsonPath, `(${(fs.statSync(outJsonPath).size / 1024).toFixed(1)} KB)`);

// Prepare Chapters list sorted by item count descending or chapter number
const chaptersList = Array.from(chaptersMap.values()).map(c => ({
  name: c.name,
  count: c.count,
  chapterNumber: c.chapterNumber,
}));

const outChaptersPath = path.resolve(__dirname, '../src/data/ssrChapters.json');
fs.writeFileSync(outChaptersPath, JSON.stringify(chaptersList, null, 2), 'utf8');
console.log('Saved SSR chapters JSON to:', outChaptersPath);
