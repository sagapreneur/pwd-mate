const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/ssrMaster.ts');
let code = fs.readFileSync(filePath, 'utf8');

const startMarker = 'export const SSR_MASTER_ITEMS: SSRItem[] = [';
const endMarker = '];\n\nexport const MAHA_REGIONS';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

const replacement = `import fullSsrData from './ssrFullData.json';
import chaptersData from './ssrChapters.json';

export interface SSRChapterInfo {
  name: string;
  count: number;
  chapterNumber: number;
}

export const SSR_CHAPTERS: SSRChapterInfo[] = chaptersData as SSRChapterInfo[];
export const SSR_MASTER_ITEMS: SSRItem[] = fullSsrData as SSRItem[];\n`;

code = code.slice(0, startIndex) + replacement + code.slice(endIndex + 3);
fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated ssrMaster.ts!');
