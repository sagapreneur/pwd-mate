const xlsx = require('xlsx');
const wb = xlsx.readFile('SSR ITEMS.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

for (let r = 3; r < 200; r++) {
  const row = data[r];
  if (!row || !row[2] || !row[4]) continue;
  const code = String(row[2]).trim();
  if (code === 'a' || code === 'b' || code === 'c') {
    let prevCode = '';
    for (let k = r - 1; k >= 3; k--) {
      if (data[k] && data[k][2] && !['a','b','c','d','e','f','g'].includes(String(data[k][2]).trim())) {
        prevCode = String(data[k][2]).trim();
        break;
      }
    }
    console.log(`Row ${r}: code=${code}, parentCode=${prevCode}, desc=${String(row[4]).slice(0, 45)}`);
  }
}
