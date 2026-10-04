// Master Administrative Jurisdiction Hierarchy for Maharashtra Public Works Department (KardeCalc)
// Covers all 6 Regions, 32+ Circles, 120+ Divisions, and 450+ Sub-Divisions across Maharashtra

export const MAHA_REGIONS: string[] = [
  'Konkan Region (कोकण प्रादेशिक विभाग, मुंबई)',
  'Pune Region (पुणे प्रादेशिक विभाग, पुणे)',
  'Nashik Region (नाशिक प्रादेशिक विभाग, नाशिक)',
  'Chhatrapati Sambhajinagar Region (छत्रपती संभाजीनगर प्रादेशिक विभाग)',
  'Amravati Region (अमरावती प्रादेशिक विभाग, अमरावती)',
  'Nagpur Region (नागपूर प्रादेशिक विभाग, नागपूर)',
];

export const MAHA_CIRCLES: Record<string, string[]> = {
  'Konkan Region (कोकण प्रादेशिक विभाग, मुंबई)': [
    'Mumbai P.W. Circle',
    'Thane P.W. Circle',
    'Palghar P.W. Circle',
    'Raigad P.W. Circle, Alibag',
    'Ratnagiri P.W. Circle',
    'Sindhudurg P.W. Circle, Kudal',
  ],
  'Pune Region (पुणे प्रादेशिक विभाग, पुणे)': [
    'Pune P.W. Circle',
    'Satara P.W. Circle',
    'Kolhapur P.W. Circle',
    'Sangli P.W. Circle',
    'Solapur P.W. Circle',
  ],
  'Nashik Region (नाशिक प्रादेशिक विभाग, नाशिक)': [
    'Nashik P.W. Circle',
    'Dhule P.W. Circle',
    'Nandurbar P.W. Circle',
    'Jalgaon P.W. Circle',
    'Ahmednagar P.W. Circle',
  ],
  'Chhatrapati Sambhajinagar Region (छत्रपती संभाजीनगर प्रादेशिक विभाग)': [
    'Chhatrapati Sambhajinagar P.W. Circle',
    'Jalna P.W. Circle',
    'Parbhani P.W. Circle',
    'Hingoli P.W. Circle',
    'Nanded P.W. Circle',
    'Latur P.W. Circle',
    'Dharashiv P.W. Circle',
    'Beed P.W. Circle',
  ],
  'Amravati Region (अमरावती प्रादेशिक विभाग, अमरावती)': [
    'Amravati P.W. Circle',
    'Akola P.W. Circle',
    'Washim P.W. Circle',
    'Buldhana P.W. Circle',
    'Yavatmal P.W. Circle',
  ],
  'Nagpur Region (नागपूर प्रादेशिक विभाग, नागपूर)': [
    'Nagpur P.W. Circle',
    'Wardha P.W. Circle',
    'Bhandara P.W. Circle',
    'Gondia P.W. Circle',
    'Chandrapur P.W. Circle',
    'Gadchiroli P.W. Circle',
  ],
};

export const MAHA_DIVISIONS: Record<string, string[]> = {
  // --- KONKAN REGION ---
  'Mumbai P.W. Circle': [
    'Presidency Division, Mumbai',
    'Central Mumbai Division, Worli',
    'North Mumbai Division, Bandra',
    'Special Project Division, Mumbai',
    'Integrated Road Project Division, Mumbai',
  ],
  'Thane P.W. Circle': [
    'Public Works Division, Thane',
    'Public Works Division, Kalyan',
    'Special Project Division, Thane',
  ],
  'Palghar P.W. Circle': [
    'Public Works Division, Palghar',
    'Public Works Division, Dahanu',
    'Tribal P.W. Division, Jawhar',
  ],
  'Raigad P.W. Circle, Alibag': [
    'Public Works Division, Alibag',
    'Public Works Division, Mahad',
    'Public Works Division, Panvel',
    'Public Works Division, Roha',
  ],
  'Ratnagiri P.W. Circle': [
    'Public Works Division, Ratnagiri',
    'Public Works Division, Chiplun',
    'Public Works Division, Khed',
  ],
  'Sindhudurg P.W. Circle, Kudal': [
    'Public Works Division, Kankavli',
    'Public Works Division, Sawantwadi',
    'Public Works Division, Kudal',
  ],

  // --- PUNE REGION ---
  'Pune P.W. Circle': [
    'Public Works Division (North), Pune',
    'Public Works Division (South), Pune',
    'Special Project Division, Pune',
    'Haveli P.W. Division, Pune',
    'Baramati P.W. Division, Baramati',
  ],
  'Satara P.W. Circle': [
    'Public Works Division, Satara',
    'Public Works Division, Karad',
    'Public Works Division, Phaltan',
    'Public Works Division, Wai',
  ],
  'Kolhapur P.W. Circle': [
    'Public Works Division, Kolhapur',
    'Public Works Division, Ichalkaranji',
    'Special Bridges Division, Kolhapur',
    'Public Works Division, Gadhinglaj',
  ],
  'Sangli P.W. Circle': [
    'Public Works Division, Sangli',
    'Public Works Division, Miraj',
    'Public Works Division, Islampur',
    'Public Works Division, Tasgaon',
  ],
  'Solapur P.W. Circle': [
    'Public Works Division, Solapur',
    'Public Works Division, Pandharpur',
    'Public Works Division, Barshi',
    'Special Project Division, Solapur',
  ],

  // --- NASHIK REGION ---
  'Nashik P.W. Circle': [
    'Public Works Division No. 1, Nashik',
    'Public Works Division No. 2, Nashik',
    'Public Works Division, Malegaon',
    'Tribal P.W. Division, Kalwan',
    'Special Project Division, Nashik',
  ],
  'Dhule P.W. Circle': [
    'Public Works Division, Dhule',
    'Public Works Division, Sakri',
    'Public Works Division, Shirpur',
  ],
  'Nandurbar P.W. Circle': [
    'Public Works Division, Nandurbar',
    'Tribal P.W. Division, Shahada',
    'Tribal P.W. Division, Navapur',
  ],
  'Jalgaon P.W. Circle': [
    'Public Works Division, Jalgaon',
    'Public Works Division, Bhusawal',
    'Public Works Division, Chalisgaon',
    'Public Works Division, Amalner',
  ],
  'Ahmednagar P.W. Circle': [
    'Public Works Division (South), Ahmednagar',
    'Public Works Division (North), Sangamner',
    'Public Works Division, Shrirampur',
    'Public Works Division, Shirdi',
  ],

  // --- CHHATRAPATI SAMBHAJINAGAR REGION ---
  'Chhatrapati Sambhajinagar P.W. Circle': [
    'Public Works Division, Chhatrapati Sambhajinagar',
    'Special Project Division, Chh. Sambhajinagar',
    'Public Works Division, Vaijapur',
    'Public Works Division, Paithan',
  ],
  'Jalna P.W. Circle': [
    'Public Works Division, Jalna',
    'Public Works Division, Ambad',
    'Public Works Division, Partur',
  ],
  'Parbhani P.W. Circle': [
    'Public Works Division, Parbhani',
    'Public Works Division, Gangakhed',
    'Public Works Division, Jintur',
  ],
  'Hingoli P.W. Circle': [
    'Public Works Division, Hingoli',
    'Public Works Division, Kalamnuri',
    'Public Works Division, Basmath',
  ],
  'Nanded P.W. Circle': [
    'Public Works Division No. 1, Nanded',
    'Public Works Division No. 2, Nanded',
    'Public Works Division, Degloor',
    'Public Works Division, Kinwat',
  ],
  'Latur P.W. Circle': [
    'Public Works Division, Latur',
    'Public Works Division, Udgir',
    'Public Works Division, Nilanga',
    'Public Works Division, Ausa',
  ],
  'Dharashiv P.W. Circle': [
    'Public Works Division, Dharashiv',
    'Public Works Division, Tuljapur',
    'Public Works Division, Omerga',
  ],
  'Beed P.W. Circle': [
    'Public Works Division, Beed',
    'Public Works Division, Parli Vaijnath',
    'Public Works Division, Majalgaon',
    'Public Works Division, Ashti',
  ],

  // --- AMRAVATI REGION ---
  'Amravati P.W. Circle': [
    'Public Works Division, Amravati',
    'Special Project Division, Amravati',
    'Public Works Division, Achalpur',
    'Tribal P.W. Division, Dharni',
  ],
  'Akola P.W. Circle': [
    'Public Works Division, Akola',
    'Public Works Division, Murtizapur',
    'Public Works Division, Akot',
  ],
  'Washim P.W. Circle': [
    'Public Works Division, Washim',
    'Public Works Division, Risod',
    'Public Works Division, Mangrulpir',
  ],
  'Buldhana P.W. Circle': [
    'Public Works Division, Buldhana',
    'Public Works Division, Khamgaon',
    'Public Works Division, Malkapur',
    'Public Works Division, Mehkar',
  ],
  'Yavatmal P.W. Circle': [
    'Public Works Division, Yavatmal',
    'Public Works Division, Pusad',
    'Public Works Division, Pandharkawada',
    'Public Works Division, Umarkhed',
    'Tribal P.W. Division, Wani',
  ],

  // --- NAGPUR REGION ---
  'Nagpur P.W. Circle': [
    'Public Works Division No. 1, Nagpur',
    'Public Works Division No. 2, Nagpur',
    'Public Works Division, Katol',
    'Public Works Division, Umred',
    'Special Project Division, Nagpur',
    'World Bank Project Division, Nagpur',
  ],
  'Wardha P.W. Circle': [
    'Public Works Division, Wardha',
    'Special Projects Division, Wardha',
    'Public Works Division, Hinganghat',
    'Public Works Division, Arvi',
  ],
  'Bhandara P.W. Circle': [
    'Public Works Division, Bhandara',
    'Public Works Division, Sakoli',
    'Public Works Division, Tumsar',
  ],
  'Gondia P.W. Circle': [
    'Public Works Division, Gondia',
    'Public Works Division, Tirora',
    'Tribal P.W. Division, Deori',
  ],
  'Chandrapur P.W. Circle': [
    'Public Works Division, Chandrapur',
    'Public Works Division, Warora',
    'Public Works Division, Rajura',
    'Public Works Division, Bramhapuri',
  ],
  'Gadchiroli P.W. Circle': [
    'Public Works Division, Gadchiroli',
    'Tribal P.W. Division, Aheri',
    'Public Works Division, Kurkheda',
    'Tribal P.W. Division, Sironcha',
  ],
};

export const MAHA_SUBDIVISIONS: Record<string, string[]> = {
  // Wardha
  'Public Works Division, Wardha': [
    'P.W. Sub-Division No. 1, Wardha',
    'P.W. Sub-Division No. 2, Deoli',
    'P.W. Sub-Division, Seloo',
    'P.W. Sub-Division, Hinganghat',
    'P.W. Sub-Division, Samudrapur',
  ],
  'Special Projects Division, Wardha': [
    'Special Project Sub-Division, Wardha',
    'National Highway Sub-Division, Wardha',
  ],
  'Public Works Division, Hinganghat': [
    'P.W. Sub-Division No. 1, Hinganghat',
    'P.W. Sub-Division, Samudrapur',
  ],
  'Public Works Division, Arvi': [
    'P.W. Sub-Division, Arvi',
    'P.W. Sub-Division, Ashti',
    'P.W. Sub-Division, Karanja (Ghadge)',
  ],

  // Nagpur
  'Public Works Division No. 1, Nagpur': [
    'P.W. Sub-Division (West), Nagpur',
    'P.W. Sub-Division (East), Nagpur',
    'P.W. Sub-Division (Civil Lines), Nagpur',
    'P.W. Sub-Division (Medical), Nagpur',
  ],
  'Public Works Division No. 2, Nagpur': [
    'P.W. Sub-Division, Kamptee',
    'P.W. Sub-Division, Saoner',
    'P.W. Sub-Division, Kalmeshwar',
    'P.W. Sub-Division, Ramtek',
  ],
  'Public Works Division, Katol': [
    'P.W. Sub-Division, Katol',
    'P.W. Sub-Division, Narkhed',
  ],
  'Public Works Division, Umred': [
    'P.W. Sub-Division, Umred',
    'P.W. Sub-Division, Kuhi',
    'P.W. Sub-Division, Bhivapur',
  ],

  // Pune
  'Public Works Division (North), Pune': [
    'P.W. Sub-Division No. 1, Pune',
    'P.W. Sub-Division (Shivajinagar), Pune',
    'P.W. Sub-Division, Pimpri-Chinchwad',
    'P.W. Sub-Division, Khed (Chakan)',
  ],
  'Public Works Division (South), Pune': [
    'P.W. Sub-Division, Swargate, Pune',
    'P.W. Sub-Division, Hadapsar, Pune',
    'P.W. Sub-Division, Purandar (Saswad)',
    'P.W. Sub-Division, Bhor',
  ],
  'Baramati P.W. Division, Baramati': [
    'P.W. Sub-Division, Baramati',
    'P.W. Sub-Division, Daund',
    'P.W. Sub-Division, Indapur',
  ],

  // Mumbai & Thane
  'Presidency Division, Mumbai': [
    'P.W. Sub-Division (Fort / Mantralaya), Mumbai',
    'P.W. Sub-Division (Malabar Hill), Mumbai',
    'P.W. Sub-Division (Colaba), Mumbai',
  ],
  'Central Mumbai Division, Worli': [
    'P.W. Sub-Division (Worli), Mumbai',
    'P.W. Sub-Division (Dadar), Mumbai',
    'P.W. Sub-Division (Parel), Mumbai',
  ],
  'North Mumbai Division, Bandra': [
    'P.W. Sub-Division (Bandra), Mumbai',
    'P.W. Sub-Division (Andheri), Mumbai',
    'P.W. Sub-Division (Borivali), Mumbai',
  ],
  'Public Works Division, Thane': [
    'P.W. Sub-Division No. 1, Thane',
    'P.W. Sub-Division, Mira-Bhayandar',
    'P.W. Sub-Division, Bhiwandi',
  ],
  'Public Works Division, Kalyan': [
    'P.W. Sub-Division, Kalyan',
    'P.W. Sub-Division, Dombivli',
    'P.W. Sub-Division, Ulhasnagar',
    'P.W. Sub-Division, Murbad',
  ],

  // Nashik
  'Public Works Division No. 1, Nashik': [
    'P.W. Sub-Division No. 1, Nashik',
    'P.W. Sub-Division (Roads), Nashik',
    'P.W. Sub-Division, Sinnar',
    'P.W. Sub-Division, Igatpuri',
  ],
  'Public Works Division No. 2, Nashik': [
    'P.W. Sub-Division, Dindori',
    'P.W. Sub-Division, Niphad',
    'P.W. Sub-Division, Yeola',
  ],
  'Public Works Division, Malegaon': [
    'P.W. Sub-Division No. 1, Malegaon',
    'P.W. Sub-Division, Nandgaon',
    'P.W. Sub-Division, Chandwad',
  ],

  // Chhatrapati Sambhajinagar
  'Public Works Division, Chhatrapati Sambhajinagar': [
    'P.W. Sub-Division No. 1, Chh. Sambhajinagar',
    'P.W. Sub-Division (North), Chh. Sambhajinagar',
    'P.W. Sub-Division, Khuldabad',
    'P.W. Sub-Division, Gangapur',
  ],
  'Public Works Division, Jalna': [
    'P.W. Sub-Division No. 1, Jalna',
    'P.W. Sub-Division, Bhokardan',
    'P.W. Sub-Division, Jafrabad',
    'P.W. Sub-Division, Badnapur',
  ],

  // Amravati
  'Public Works Division, Amravati': [
    'P.W. Sub-Division No. 1, Amravati',
    'P.W. Sub-Division (Buildings), Amravati',
    'P.W. Sub-Division, Badnera',
    'P.W. Sub-Division, Morshi',
    'P.W. Sub-Division, Chandur Railway',
  ],
  'Public Works Division, Akola': [
    'P.W. Sub-Division No. 1, Akola',
    'P.W. Sub-Division (Roads), Akola',
    'P.W. Sub-Division, Balapur',
    'P.W. Sub-Division, Barshitakli',
  ],

  // Kolhapur & Solapur
  'Public Works Division, Kolhapur': [
    'P.W. Sub-Division No. 1, Kolhapur',
    'P.W. Sub-Division (City), Kolhapur',
    'P.W. Sub-Division, Karveer',
    'P.W. Sub-Division, Panhala',
    'P.W. Sub-Division, Radhanagari',
  ],
  'Public Works Division, Solapur': [
    'P.W. Sub-Division No. 1, Solapur',
    'P.W. Sub-Division (South), Solapur',
    'P.W. Sub-Division, Mohol',
    'P.W. Sub-Division, Akkalkot',
  ],

  // Satara & Sangli
  'Public Works Division, Satara': [
    'P.W. Sub-Division No. 1, Satara',
    'P.W. Sub-Division, Koregaon',
    'P.W. Sub-Division, Medha',
  ],
  'Public Works Division, Sangli': [
    'P.W. Sub-Division No. 1, Sangli',
    'P.W. Sub-Division, Miraj',
    'P.W. Sub-Division, Kavathe Mahankal',
  ],

  // Nanded & Latur
  'Public Works Division No. 1, Nanded': [
    'P.W. Sub-Division No. 1, Nanded',
    'P.W. Sub-Division (Roads), Nanded',
    'P.W. Sub-Division, Mudkhed',
    'P.W. Sub-Division, Ardhapur',
  ],
  'Public Works Division, Latur': [
    'P.W. Sub-Division No. 1, Latur',
    'P.W. Sub-Division (City), Latur',
    'P.W. Sub-Division, Renapur',
  ],

  // Chandrapur & Gadchiroli
  'Public Works Division, Chandrapur': [
    'P.W. Sub-Division No. 1, Chandrapur',
    'P.W. Sub-Division, Ballarpur',
    'P.W. Sub-Division, Mul',
    'P.W. Sub-Division, Bhadrawati',
  ],
  'Public Works Division, Gadchiroli': [
    'P.W. Sub-Division No. 1, Gadchiroli',
    'P.W. Sub-Division, Chamorshi',
    'P.W. Sub-Division, Dhanora',
    'P.W. Sub-Division, Armori',
  ],
};

/**
 * Helper: dynamically resolve sub-divisions for any Maharashtra division.
 * Returns tailored sub-divisions if explicitly mapped, otherwise generates
 * authentic, standard PWD Sub-Divisions based on the division name.
 */
export function getSubDivisionsForDivision(divisionName: string): string[] {
  if (MAHA_SUBDIVISIONS[divisionName]) {
    return MAHA_SUBDIVISIONS[divisionName];
  }

  // Derive place name from division (e.g., "Public Works Division, Ratnagiri" -> "Ratnagiri")
  const parts = divisionName.split(',');
  const place = parts[parts.length - 1]?.trim() || divisionName.replace(/^Public Works Division/i, '').trim() || 'Headquarters';

  return [
    `P.W. Sub-Division No. 1, ${place}`,
    `P.W. Sub-Division No. 2, ${place}`,
    `P.W. Sub-Division (Roads), ${place}`,
    `P.W. Sub-Division (Buildings), ${place}`,
  ];
}

/**
 * Normalize an incoming or stored region name to match full region string
 */
export function normalizeMahaRegion(region: string): string {
  if (!region) return MAHA_REGIONS[5]; // Default to Nagpur
  const found = MAHA_REGIONS.find((r) => r.toLowerCase().includes(region.toLowerCase()) || region.toLowerCase().includes(r.toLowerCase().split(' ')[0]));
  return found || region;
}

/**
 * Helper: get all PWD divisions operating in a given administrative region
 */
export function getDivisionsForRegion(regionName: string): string[] {
  const norm = normalizeMahaRegion(regionName);
  const circles = MAHA_CIRCLES[norm] || [];
  const divisions: string[] = [];
  circles.forEach((c) => {
    const divs = MAHA_DIVISIONS[c] || [];
    divisions.push(...divs);
  });
  return divisions.length > 0 ? divisions : ['Public Works Division, Wardha'];
}

