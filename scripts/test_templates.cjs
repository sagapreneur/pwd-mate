// Test script to validate all 9 PWD Smart Templates against SSR data
const ssrData = require('../src/data/ssrFullData.json');

console.log('=== VALIDATING SSR ITEM MAPPINGS FOR ALL TEMPLATES ===');

const templateCodes = [
  { template: 'CW-01 BBM Compound Wall', items: ['21.01', '24.01', '24.12', '26.33', '27.01', '32.03', '35.01', '40.01'] },
  { template: 'CC-01 Cement Concrete Road', items: ['21.01', '3.18', '24.01', '5.01', '8.07'] },
  { template: 'DR-01 Open Surface Drainage', items: ['21.01', '24.01', '27.05', '32.03', '24.12', '26.33'] },
  { template: 'CD-01 Hume Pipe Culvert', items: ['21.01', '11.03', '11.08', '11.07', '24.01'] },
  { template: 'BLD-01 Samaj Mandir / Hall', items: ['21.01', '24.01', '24.12', '26.33', '27.01', '32.03', '33.06', '39.03', '40.01', '35.01'] },
  { template: 'PV-01 Paver Block Road', items: ['21.01', '3.18', '48.06', '24.01'] },
  { template: 'BT-01 Asphalt Resurfacing', items: ['3.14', '3.18', '3.3', '8.07', '3.31'] },
  { template: 'CW-02 UCR Boundary Wall', items: ['21.01', '24.01', '28.01', '32.01'] },
  { template: 'AM-01 Parking Shed', items: ['21.01', '24.01', '38.34', '33.01', '35.01'] },
];

let totalTested = 0;
let totalFound = 0;

for (const t of templateCodes) {
  console.log(`\nTesting: ${t.template}`);
  for (const code of t.items) {
    totalTested++;
    const match = ssrData.find(s => s.itemCode === code || s.itemCode.startsWith(code));
    if (match) {
      totalFound++;
      console.log(`  ✓ ${code.padEnd(7)} -> [${match.itemCode}] ${match.description.substring(0, 45)}... (₹${match.baseRate}/${match.unit})`);
    } else {
      console.error(`  ✗ ${code.padEnd(7)} NOT FOUND in SSR!`);
    }
  }
}

console.log(`\n=== RESULTS: ${totalFound}/${totalTested} items successfully resolved from SSR database (${((totalFound/totalTested)*100).toFixed(1)}%) ===`);
