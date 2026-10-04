const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('SSR ITEMS.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
const headers = data[1];

const colStats = {};
for (let c = 9; c <= 36; c++) {
  colStats[c] = { name: headers[c].trim().replace(/\r\n/g, ' '), count: 0, min: Infinity, max: -Infinity };
}

let validItemCount = 0;
for (let r = 3; r < data.length; r++) {
  const row = data[r];
  if (!row) continue;
  const itemNo = row[2];
  const desc = row[4];
  if (itemNo === undefined || itemNo === null || itemNo === '' || !desc) continue;
  validItemCount++;

  for (let c = 9; c <= 36; c++) {
    const val = row[c];
    if (val !== null && val !== undefined && val !== '' && !isNaN(val) && Number(val) > 0) {
      colStats[c].count++;
      colStats[c].min = Math.min(colStats[c].min, Number(val));
      colStats[c].max = Math.max(colStats[c].max, Number(val));
    }
  }
}

console.log('Total valid items evaluated:', validItemCount);
for (const [col, stat] of Object.entries(colStats)) {
  if (stat.count > 0) {
    console.log(`Col ${col} [${stat.name}]: ${stat.count} items (min: ${stat.min}, max: ${stat.max})`);
  }
}
