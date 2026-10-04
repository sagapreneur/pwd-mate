const xlsx = require('xlsx');
const wb = xlsx.readFile('SSR ITEMS.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

console.log('Total rows:', data.length);

const nonItemRows = [];
for (let r = 3; r < data.length; r++) {
  const row = data[r];
  if (!row || row.length === 0) {
    nonItemRows.push({ row: r, reason: 'Empty row' });
    continue;
  }
  const itemNo = row[2];
  const desc = row[4];
  if (itemNo === undefined || itemNo === null || String(itemNo).trim() === '') {
    nonItemRows.push({ row: r, reason: 'Missing itemNo', data: row.filter(x => x !== null && x !== undefined) });
  } else if (!desc || String(desc).trim() === '') {
    nonItemRows.push({ row: r, reason: 'Missing desc', itemNo, data: row.filter(x => x !== null && x !== undefined) });
  }
}

console.log('Non-item rows count:', nonItemRows.length);
nonItemRows.slice(0, 30).forEach(nr => console.log(JSON.stringify(nr)));
