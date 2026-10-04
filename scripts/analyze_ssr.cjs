const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('SSR ITEMS.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

const headers = data[1];
console.log('Headers count:', headers.length);

const chapters = new Map();
let itemCount = 0;
let headerRows = 0;
let emptyRows = 0;
const sampleItemsWithCF = [];

for (let r = 2; r < data.length; r++) {
  const row = data[r];
  if (!row || row.length === 0 || row.every(cell => cell === null || cell === undefined || cell === '')) {
    emptyRows++;
    continue;
  }
  
  // If row has only 1 item and it's a string, it's a section/category header e.g. "SSR 2021-22 ROAD WORKS"
  const itemNo = row[2];
  const desc = row[4];
  const chapter = row[1];
  
  if (itemNo !== undefined && itemNo !== null && itemNo !== '' && desc) {
    itemCount++;
    const chName = String(chapter || 'General').replace(/\r\n/g, ' ').trim();
    chapters.set(chName, (chapters.get(chName) || 0) + 1);

    // Check if any CF columns (col 9 to 36) have values
    const cf = {};
    for (let c = 9; c <= 36; c++) {
      const val = row[c];
      if (val !== null && val !== undefined && val !== '' && !isNaN(val) && Number(val) > 0) {
        cf[headers[c].trim().replace(/\r\n/g, ' ')] = Number(val);
      }
    }
    if (Object.keys(cf).length > 0 && sampleItemsWithCF.length < 5) {
      sampleItemsWithCF.push({
        itemNo,
        desc: String(desc).slice(0, 80),
        unit: row[6],
        unitShort: row[37],
        rate: row[7],
        cf
      });
    }
  } else {
    headerRows++;
  }
}

console.log('Item count:', itemCount);
console.log('Header/Section rows:', headerRows);
console.log('Empty rows:', emptyRows);
console.log('\nChapters count:', chapters.size);
for (const [ch, cnt] of chapters.entries()) {
  console.log(`  ${ch}: ${cnt} items`);
}

console.log('\nSample items with CF:');
console.log(JSON.stringify(sampleItemsWithCF, null, 2));
