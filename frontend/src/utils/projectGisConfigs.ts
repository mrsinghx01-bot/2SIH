// Master GIS Alignment Corridors & Master-Plan Perimeter Polygons for all 47 National Infrastructure Projects
export interface ProjectGisDefinition {
  center: [number, number];
  zoom: number;
  alignmentPolyline: [number, number][];
  milestones?: { name: string; coord: [number, number]; state?: string; chainageKm?: string }[];
}

export const MASTER_PROJECT_GIS_REGISTRY: Record<string, ProjectGisDefinition> = {
  // ── 1. MAHARASHTRA ──────────────────────────────────────────────────────────
  'PRJ-NHAI-DME-001': {
    center: [23.8500, 75.5000],
    zoom: 6,
    alignmentPolyline: [
      [28.3200, 77.0500], // Sohna, Haryana / Delhi NCR (0 km)
      [28.1100, 77.0100], // Nuh, Haryana
      [27.7500, 76.8500], // Naugaon / Alwar, Rajasthan
      [26.9000, 76.4000], // Bandikui / Dausa, Rajasthan (Jaipur Spur)
      [26.5600, 76.3200], // Lalsot, Rajasthan
      [26.1500, 76.3500], // Sawai Madhopur, Rajasthan
      [25.7200, 76.1800], // Indergarh / Lakheri, Rajasthan
      [25.1800, 75.8500], // Kota (Chambal River Bridge), Rajasthan
      [24.9300, 75.6800], // Mukundara Hills Tunnel, Rajasthan
      [24.5200, 75.7500], // Bhanpura, Madhya Pradesh
      [24.3200, 75.6500], // Garoth, Madhya Pradesh
      [24.1800, 75.6200], // Shamgarh, Madhya Pradesh
      [23.6300, 75.1300], // Jaora, Madhya Pradesh
      [23.3300, 75.0500], // Ratlam, Madhya Pradesh
      [23.0000, 74.5800], // Thandla / Jhabua, Madhya Pradesh
      [22.8300, 74.2500], // Dahod, Gujarat
      [22.7500, 73.6100], // Godhra, Gujarat
      [22.3000, 73.2000], // Vadodara, Gujarat
      [21.7000, 73.0000], // Bharuch (Narmada River), Gujarat
      [21.6200, 73.0000], // Ankleshwar, Gujarat
      [21.2500, 72.9000], // Surat / Kim, Gujarat
      [20.9500, 72.9200], // Navsari, Gujarat
      [20.6100, 72.9300], // Valsad, Gujarat
      [20.3700, 72.9100], // Vapi, Gujarat
      [20.1200, 72.9200], // Talasari / Dahanu, Maharashtra
      [19.8500, 73.3500], // Kasara / Igatpuri / Shahpur, Maharashtra
      [19.7500, 72.9100], // Manor / Palghar, Maharashtra
      [19.4700, 72.8200], // Virar / Mumbai Suburban, Maharashtra
      [19.2000, 73.1500], // Thane / Kalyan / Badlapur, Maharashtra
      [18.9500, 72.9500]  // JNPT / Navi Mumbai Terminal, Maharashtra (1,350 km)
    ],
    milestones: [
      { name: 'Delhi NCR (Sohna Interchange)', coord: [28.3200, 77.0500], state: 'Haryana', chainageKm: '0 km' },
      { name: 'Dausa / Jaipur Junction', coord: [26.9000, 76.4000], state: 'Rajasthan', chainageKm: '180 km' },
      { name: 'Kota Chambal Bridge', coord: [25.1800, 75.8500], state: 'Rajasthan', chainageKm: '375 km' },
      { name: 'Ratlam Junction', coord: [23.3300, 75.0500], state: 'Madhya Pradesh', chainageKm: '640 km' },
      { name: 'Vadodara Hub', coord: [22.3000, 73.2000], state: 'Gujarat', chainageKm: '875 km' },
      { name: 'Surat / Bharuch Narmada', coord: [21.2500, 72.9000], state: 'Gujarat', chainageKm: '1,035 km' },
      { name: 'Palghar / Manor Section', coord: [19.7500, 72.9100], state: 'Maharashtra', chainageKm: '1,265 km' },
      { name: 'JNPT Port / Navi Mumbai Terminal', coord: [18.9500, 72.9500], state: 'Maharashtra', chainageKm: '1,350 km' }
    ]
  },

  'PRJ-NHSRCL-MAHSR-005': {
    center: [21.0500, 72.9500],
    zoom: 7,
    alignmentPolyline: [
      [19.0650, 72.8680], // BKC Underground Terminal, Mumbai
      [19.2100, 72.9800], // Thane Station
      [19.4500, 72.8200], // Virar Station
      [19.8000, 72.7500], // Boisar Station
      [20.3800, 72.9100], // Vapi Station
      [20.8500, 72.9300], // Bilimora Station
      [21.1700, 72.8300], // Surat Station
      [21.7000, 73.0000], // Bharuch Station
      [22.3000, 73.1800], // Vadodara Station
      [22.7500, 72.8600], // Anand / Nadiad Station
      [23.0000, 72.6000], // Ahmedabad Station
      [23.0700, 72.5800]  // Sabarmati High-Speed Terminal (508 km)
    ],
    milestones: [
      { name: 'Mumbai BKC Terminal', coord: [19.0650, 72.8680], state: 'Maharashtra', chainageKm: '0 km' },
      { name: 'Thane Bullet Train Station', coord: [19.2100, 72.9800], state: 'Maharashtra', chainageKm: '28 km' },
      { name: 'Surat High Speed Station', coord: [21.1700, 72.8300], state: 'Gujarat', chainageKm: '264 km' },
      { name: 'Vadodara Station Hub', coord: [22.3000, 73.1800], state: 'Gujarat', chainageKm: '390 km' },
      { name: 'Sabarmati Terminal', coord: [23.0700, 72.5800], state: 'Gujarat', chainageKm: '508 km' }
    ]
  },

  'PRJ-CIDCO-NMIA-006': {
    center: [18.9900, 73.0720],
    zoom: 13,
    alignmentPolyline: [
      [19.0080, 73.0550], [19.0080, 73.0950], [18.9750, 73.0950], [18.9750, 73.0550], [19.0080, 73.0550]
    ],
    milestones: [
      { name: 'North Runway 08L/26R', coord: [19.0050, 73.0650], state: 'Maharashtra' },
      { name: 'South Runway 08R/26L', coord: [18.9800, 73.0850], state: 'Maharashtra' },
      { name: 'Terminal 1 & ATC Tower', coord: [18.9920, 73.0720], state: 'Maharashtra' }
    ]
  },

  // ── 2. UTTAR PRADESH ────────────────────────────────────────────────────────
  'PRJ-YEIDA-NIA-002': {
    center: [28.1550, 77.5550],
    zoom: 13,
    alignmentPolyline: [
      [28.1750, 77.5300], [28.1750, 77.5850], [28.1300, 77.5850], [28.1300, 77.5300], [28.1750, 77.5300]
    ],
    milestones: [
      { name: 'Jewar Terminal 1 Footprint', coord: [28.1550, 77.5550], state: 'Uttar Pradesh' },
      { name: 'Runway 10/28 (3,900m)', coord: [28.1650, 77.5400], state: 'Uttar Pradesh' }
    ]
  },

  'PRJ-YEIDA-NIA-003': {
    center: [28.1250, 77.5850],
    zoom: 13,
    alignmentPolyline: [
      [28.1400, 77.5650], [28.1400, 77.6150], [28.1050, 77.6150], [28.1050, 77.5650], [28.1400, 77.5650]
    ]
  },

  'PRJ-UPEIDA-PVE-010': {
    center: [26.2500, 82.2000],
    zoom: 8,
    alignmentPolyline: [
      [26.7500, 81.0800], // Gosainganj, Lucknow (0 km)
      [26.6500, 81.4000], // Barabanki
      [26.5000, 81.6500], // Amethi
      [26.4000, 81.8500], // Sultanpur
      [26.2500, 82.2000], // Ayodhya / Kurebhar Link
      [26.0500, 82.6000], // Ambedkar Nagar
      [25.8500, 83.0000], // Azamgarh
      [25.7000, 83.3000], // Mau
      [25.5800, 83.5800]  // Haidaria, Ghazipur (340.8 km)
    ],
    milestones: [
      { name: 'Lucknow Zero Point', coord: [26.7500, 81.0800], state: 'Uttar Pradesh', chainageKm: '0 km' },
      { name: 'Sultanpur Airstrip Node', coord: [26.4000, 81.8500], state: 'Uttar Pradesh', chainageKm: '124 km' },
      { name: 'Azamgarh Economic Node', coord: [25.8500, 83.0000], state: 'Uttar Pradesh', chainageKm: '235 km' },
      { name: 'Ghazipur Haidaria Terminal', coord: [25.5800, 83.5800], state: 'Uttar Pradesh', chainageKm: '340 km' }
    ]
  },

  // ── 3. MADHYA PRADESH ───────────────────────────────────────────────────────
  'PRJ-NWDA-KBLP-004': {
    center: [24.9500, 79.4000],
    zoom: 9,
    alignmentPolyline: [
      [24.6200, 79.8800], // Daudhan Dam, Panna/Chhatarpur
      [24.8500, 79.5000], // Ken Submergence Link
      [25.1000, 79.1000], // Betwa Link Canal Reach
      [25.3500, 78.7500]  // Barwa Sagar, Jhansi UP Link (221 km canal)
    ]
  },

  // ── 4. KARNATAKA ────────────────────────────────────────────────────────────
  'PRJ-BDA-BBC-007': {
    center: [13.0100, 77.6200],
    zoom: 11,
    alignmentPolyline: [
      [13.0600, 77.4800], // Tumakuru Road
      [13.1500, 77.5600], // Doddaballapur Road
      [13.1400, 77.6200], // Ballari Road (Yelahanka)
      [13.0500, 77.6600], // Hennur Road
      [13.0100, 77.7200], // Old Madras Road
      [12.8800, 77.7000], // Sarjapur Road
      [12.8300, 77.6600]  // Hosur Road / Electronic City Link (73.5 km)
    ]
  },

  // ── 5. GUJARAT ──────────────────────────────────────────────────────────────
  'PRJ-DFCCIL-WDFC-008': {
    center: [21.4500, 73.0500],
    zoom: 8,
    alignmentPolyline: [
      [22.4500, 73.2500], // Vadodara Yard
      [22.2500, 73.2000], // Makarpura Freight Terminal
      [21.7200, 73.0000], // Bharuch Freight Corridor
      [21.0800, 72.8800], // Gothangam / Surat
      [20.7000, 72.9000], // Valsad
      [20.3500, 72.9000]  // Sanjan / Vapi (Maharashtra Border)
    ]
  },

  // ── 6. WEST BENGAL ──────────────────────────────────────────────────────────
  'PRJ-DFCCIL-EDFC-009': {
    center: [23.2000, 87.6500],
    zoom: 9,
    alignmentPolyline: [
      [22.6800, 88.3000], // Dankuni Terminal
      [22.7500, 88.3300], // Chandannagar
      [23.2500, 87.8500], // Bardhaman
      [23.5000, 87.3000], // Durgapur
      [23.7500, 86.9500]  // Asansol / Sitarampur (538 km)
    ]
  },

  // ── 7. TAMIL NADU ───────────────────────────────────────────────────────────
  'PRJ-CMRL-CMP2-011': {
    center: [13.0200, 80.2300],
    zoom: 12,
    alignmentPolyline: [
      [13.1500, 80.2300], // Madhavaram Milk Colony
      [13.0800, 80.2700], // Chennai Central Metro
      [13.0400, 80.2500], // Mylapore
      [13.0000, 80.2500], // Adyar
      [12.9200, 80.2300], // Sholinganallur
      [12.8500, 80.2200]  // SIPCOT Siruseri (118.9 km)
    ]
  },

  'PRJ-TIDCO-TNDIC-014': {
    center: [11.0200, 77.1200],
    zoom: 11,
    alignmentPolyline: [
      [11.0500, 77.0800], [11.0500, 77.1600], [10.9800, 77.1600], [10.9800, 77.0800], [11.0500, 77.0800]
    ]
  },

  // ── 8. RAJASTHAN ────────────────────────────────────────────────────────────
  'PRJ-SECI-BSP4-012': {
    center: [27.5380, 71.9150],
    zoom: 12,
    alignmentPolyline: [
      [27.5600, 71.8800], [27.5600, 71.9600], [27.5000, 71.9600], [27.5000, 71.8800], [27.5600, 71.8800]
    ]
  },

  // ── 9. JAMMU & KASHMIR ──────────────────────────────────────────────────────
  'PRJ-NRLY-USBRL-013': {
    center: [33.5500, 74.9500],
    zoom: 8,
    alignmentPolyline: [
      [32.9900, 74.9300], // Katra Railway Station
      [33.1500, 74.8800], // Reasi (World's Highest Chenab Rail Bridge, 359m)
      [33.2500, 75.0500], // Sangaldan Tunnel (T-50)
      [33.5000, 75.2000], // Banihal (Pir Panjal Rail Tunnel)
      [33.5900, 75.1600], // Qazigund (Kashmir Valley Entry)
      [33.7300, 75.1500], // Anantnag
      [34.0200, 74.8300], // Srinagar Station (Nowgam)
      [34.2100, 74.3400]  // Baramulla Terminal (272 km)
    ],
    milestones: [
      { name: 'Katra Base Station', coord: [32.9900, 74.9300], state: 'Jammu & Kashmir', chainageKm: '0 km' },
      { name: 'Chenab Iconic Rail Bridge (359m)', coord: [33.1500, 74.8800], state: 'Jammu & Kashmir', chainageKm: '42 km' },
      { name: 'Pir Panjal Tunnel / Banihal', coord: [33.5000, 75.2000], state: 'Jammu & Kashmir', chainageKm: '110 km' },
      { name: 'Srinagar Station', coord: [34.0200, 74.8300], state: 'Jammu & Kashmir', chainageKm: '220 km' },
      { name: 'Baramulla Terminal', coord: [34.2100, 74.3400], state: 'Jammu & Kashmir', chainageKm: '272 km' }
    ]
  },

  // ── 10. BIHAR ───────────────────────────────────────────────────────────────
  'PRJ-NICDC-AKIC-015': {
    center: [24.5800, 84.9500],
    zoom: 11,
    alignmentPolyline: [
      [24.5500, 84.8800], [24.5800, 84.9500], [24.6200, 85.0200], [24.6800, 85.1000]
    ]
  },

  // ── 11. HARYANA ─────────────────────────────────────────────────────────────
  'PRJ-NHAI-KMP-016': {
    center: [28.4500, 76.9500],
    zoom: 10,
    alignmentPolyline: [
      [28.8800, 77.1200], // Kundli (NH-44 Junction)
      [28.8800, 76.9100], // Kharkhoda
      [28.5800, 76.8100], // Farrukhnagar
      [28.3500, 76.9200], // Manesar (NH-48 Junction)
      [28.2400, 77.0600], // Sohna (Delhi-Mumbai Expressway Junction)
      [28.1400, 77.3300]  // Palwal (NH-19 Junction - 135.6 km)
    ]
  },

  'PRJ-NHAI-DAK-017': {
    center: [29.4000, 76.5000],
    zoom: 9,
    alignmentPolyline: [
      [28.7800, 76.8800], // Jasaur Kheri / Bahadurgarh
      [29.0500, 76.6000], // Rohtak
      [29.3200, 76.3100], // Jind
      [29.8000, 76.3000], // Narwana
      [30.0300, 76.3000]  // Kaithal (Haryana Stretch)
    ]
  },

  // ── 12. PUNJAB ──────────────────────────────────────────────────────────────
  'PRJ-NHAI-DAKP-018': {
    center: [31.1000, 75.6000],
    zoom: 8,
    alignmentPolyline: [
      [30.1500, 76.0500], // Patiala / Sangrur
      [30.8500, 75.8500], // Ludhiana
      [31.1300, 75.4700], // Nakodar / Jalandhar
      [31.6300, 74.8700], // Amritsar Bypass
      [32.0400, 75.4000]  // Gurdaspur (Punjab Corridor)
    ]
  },

  // ── 13. HIMACHAL PRADESH ────────────────────────────────────────────────────
  'PRJ-NRLY-BML-019': {
    center: [32.0000, 77.0500],
    zoom: 8,
    alignmentPolyline: [
      [31.3400, 76.7600], // Bilaspur Station
      [31.7100, 76.9300], // Mandi (Beas River Bridge)
      [31.9500, 77.1100], // Kullu (Bhuntar)
      [32.2400, 77.1900], // Manali
      [32.6800, 77.2100]  // Sissu / Rohtang Portal (465 km)
    ]
  },

  // ── 14. UTTARAKHAND ─────────────────────────────────────────────────────────
  'PRJ-RVNL-RKRL-020': {
    center: [30.1800, 78.7500],
    zoom: 10,
    alignmentPolyline: [
      [30.1000, 78.3000], // Rishikesh Yog Nagari
      [30.1300, 78.3800], // Shivpuri
      [30.1500, 78.6000], // Devprayag (Alaknanda-Bhagirathi Confluence)
      [30.2200, 78.7800], // Srinagar Garhwal
      [30.2800, 78.9800], // Rudraprayag
      [30.2600, 79.2200]  // Karnaprayag (125.2 km)
    ]
  },

  'PRJ-BRO-CDH-021': {
    center: [30.4500, 78.9000],
    zoom: 9,
    alignmentPolyline: [
      [30.1200, 78.3000], // Rishikesh
      [30.2800, 78.9800], // Rudraprayag
      [30.5500, 79.1500], // Chamoli
      [30.7400, 79.4900]  // Joshimath / Badrinath (889 km network)
    ]
  },

  // ── 15. ANDHRA PRADESH ──────────────────────────────────────────────────────
  'PRJ-APCRDA-ACC-022': {
    center: [16.5400, 80.5100],
    zoom: 13,
    alignmentPolyline: [
      [16.5600, 80.4800], [16.5600, 80.5500], [16.5100, 80.5500], [16.5100, 80.4800], [16.5600, 80.4800]
    ]
  },

  'PRJ-AP-PIP-023': {
    center: [17.1500, 81.5000],
    zoom: 10,
    alignmentPolyline: [
      [17.3000, 81.7000], // Godavari Left Canal
      [17.2580, 81.6550], // Polavaram Dam Spillway
      [17.1500, 81.5000], // Right Main Canal
      [16.9500, 81.2500]  // Krishna River Interlinking (174 km)
    ]
  },

  // ── 16. TELANGANA ───────────────────────────────────────────────────────────
  'PRJ-TSIIC-PFC-024': {
    center: [17.0420, 78.5850],
    zoom: 12,
    alignmentPolyline: [
      [17.0700, 78.5500], [17.0700, 78.6300], [17.0100, 78.6300], [17.0100, 78.5500], [17.0700, 78.5500]
    ]
  },

  'PRJ-NHAI-TRRR-025': {
    center: [17.7000, 78.5000],
    zoom: 10,
    alignmentPolyline: [
      [17.6200, 78.0800], // Sangareddy
      [17.7400, 78.2800], // Narsapur
      [17.8800, 78.4800], // Toopran
      [17.8500, 78.6800], // Gajwel
      [17.5100, 78.8900]  // Choutuppal (158 km Northern Arc)
    ]
  },

  // ── 17. KERALA ──────────────────────────────────────────────────────────────
  'PRJ-VISL-VZP-026': {
    center: [8.3750, 77.0020],
    zoom: 13,
    alignmentPolyline: [
      [8.3850, 76.9900], [8.3850, 77.0150], [8.3650, 77.0150], [8.3650, 76.9900], [8.3850, 76.9900]
    ]
  },

  'PRJ-KMRL-KMP2-027': {
    center: [10.0080, 76.3300],
    zoom: 13,
    alignmentPolyline: [
      [9.9980, 76.2990], // JLN Stadium Station
      [10.0050, 76.3120], // Palarivattom
      [10.0150, 76.3300], // Kakkanad Collectorate
      [10.0100, 76.3600]  // Infopark Phase 2 (11.2 km)
    ]
  },

  // ── 18. ODISHA ──────────────────────────────────────────────────────────────
  'PRJ-JSW-POSCO-028': {
    center: [21.6250, 85.5850],
    zoom: 12,
    alignmentPolyline: [
      [21.6500, 85.5500], [21.6500, 85.6200], [21.5900, 85.6200], [21.5900, 85.5500], [21.6500, 85.5500]
    ]
  },

  'PRJ-PPA-WDD-029': {
    center: [20.2650, 86.6720],
    zoom: 13,
    alignmentPolyline: [
      [20.2800, 86.6500], [20.2800, 86.6900], [20.2400, 86.6900], [20.2400, 86.6500], [20.2800, 86.6500]
    ]
  },

  // ── 19. JHARKHAND ───────────────────────────────────────────────────────────
  'PRJ-JUIDCO-RSC-030': {
    center: [23.3400, 85.3200],
    zoom: 11,
    alignmentPolyline: [
      [23.3100, 85.2900], // Dhurwa / Hatia
      [23.3500, 85.3900], // Namkum
      [23.4400, 85.3200], // Kanke Road
      [23.2700, 85.2800]  // Ratu (45 km Outer Ring)
    ]
  },

  // ── 20. CHHATTISGARH ────────────────────────────────────────────────────────
  'PRJ-CG-RDMC-031': {
    center: [21.2200, 81.4800],
    zoom: 11,
    alignmentPolyline: [
      [21.2300, 81.6700], // Raipur Airport
      [21.2500, 81.6300], // Telibandha / Jaistambh
      [21.2600, 81.5600], // Tatibandh
      [21.2100, 81.3800], // Bhilai Steel Plant
      [21.1900, 81.2800]  // Durg Railway Junction (42 km)
    ]
  },

  // ── 21. GOA ─────────────────────────────────────────────────────────────────
  'PRJ-GMR-MOPA-032': {
    center: [15.7500, 73.8650],
    zoom: 13,
    alignmentPolyline: [
      [15.7650, 73.8450], [15.7650, 73.8850], [15.7300, 73.8850], [15.7300, 73.8450], [15.7650, 73.8450]
    ]
  },

  // ── 22. DELHI UT ────────────────────────────────────────────────────────────
  'PRJ-DMRC-M4P-033': {
    center: [28.6700, 77.1800],
    zoom: 12,
    alignmentPolyline: [
      [28.6300, 77.0800], // Janakpuri West
      [28.6400, 77.2100], // RK Ashram Marg
      [28.7200, 77.1900], // Majlis Park
      [28.6900, 77.2700]  // Maujpur (28.9 km Priority Reach)
    ]
  },

  // ── 23. ASSAM ───────────────────────────────────────────────────────────────
  'PRJ-NHAI-GRR-034': {
    center: [26.2100, 91.7800],
    zoom: 11,
    alignmentPolyline: [
      [26.3400, 91.7100], // Baihata Chariali
      [26.2300, 91.8500], // Brahmaputra River 6-Lane Bridge
      [26.1100, 91.9700], // Sonapur
      [26.1100, 91.8200], // Khanapara
      [26.1500, 91.6600]  // Palasbari (121 km Ring)
    ]
  },

  // ── 24. ARUNACHAL PRADESH ───────────────────────────────────────────────────
  'PRJ-BRO-SELA-035': {
    center: [27.5050, 92.1030],
    zoom: 12,
    alignmentPolyline: [
      [27.4800, 92.1100], // Baisakhi Base Portal
      [27.5050, 92.1030], // Sela Pass High Altitude Tunnel (13,700 ft)
      [27.5300, 92.0800]  // Nurang / Tawang Approach
    ]
  },

  // ── 25. MANIPUR ─────────────────────────────────────────────────────────────
  'PRJ-NHIDCL-IMH-036': {
    center: [24.5200, 94.0500],
    zoom: 10,
    alignmentPolyline: [
      [24.8100, 93.9400], // Imphal East
      [24.6400, 93.9900], // Thoubal
      [24.4800, 93.9800], // Kakching
      [24.3800, 94.0200], // Pallel / Tengnoupal
      [24.2400, 94.3000]  // Moreh Indo-Myanmar Border (110 km AH-1)
    ]
  },

  // ── 26. MEGHALAYA ───────────────────────────────────────────────────────────
  'PRJ-NHAI-SWB-037': {
    center: [25.5600, 91.8400],
    zoom: 11,
    alignmentPolyline: [
      [25.6800, 91.9000], // Lad Umroi
      [25.5800, 91.8400], // Umiam Lake Bypass
      [25.5400, 91.8200], // Mawlyndep
      [25.4900, 91.8200]  // Upper Shillong (38.2 km)
    ]
  },

  // ── 27. NAGALAND ────────────────────────────────────────────────────────────
  'PRJ-NHIDCL-DKH-038': {
    center: [25.7500, 93.9200],
    zoom: 11,
    alignmentPolyline: [
      [25.8600, 93.7700], // Dimapur Purana Bazar
      [25.7500, 93.8500], // Chumukedima
      [25.6900, 94.0300], // Medziphema
      [25.6700, 94.1100]  // Kohima Town Bypass (42.8 km NH-29)
    ]
  },

  // ── 28. MIZORAM ─────────────────────────────────────────────────────────────
  'PRJ-NHIDCL-ABP-039': {
    center: [23.7300, 92.6800],
    zoom: 11,
    alignmentPolyline: [
      [23.8000, 92.6600], // Sairang Railhead Link
      [23.7300, 92.6800], // Durtlang Tunnel
      [23.6700, 92.7100]  // Falkawn Bypass (18.6 km)
    ]
  },

  // ── 29. TRIPURA ─────────────────────────────────────────────────────────────
  'PRJ-NRLY-AAR-040': {
    center: [23.8320, 91.2480],
    zoom: 13,
    alignmentPolyline: [
      [23.8050, 91.2750], // Agartala Badharghat
      [23.8320, 91.2480], // Nischintapur Dual-Gauge Yard
      [23.8500, 91.2380]  // Akhaura International Border (12.24 km)
    ]
  },

  // ── 30. SIKKIM ──────────────────────────────────────────────────────────────
  'PRJ-RVNL-SRR-041': {
    center: [27.0580, 88.4980],
    zoom: 11,
    alignmentPolyline: [
      [26.8850, 88.4750], // Sevoke, West Bengal
      [27.0580, 88.4980], // Kalijhora Teesta Bridge
      [27.0900, 88.4550], // Melli
      [27.1500, 88.5000], // Singtam
      [27.1750, 88.5300]  // Rangpo Himalayan Rail Terminal, Sikkim (44.96 km)
    ]
  },

  // ── 31. CHANDIGARH UT ───────────────────────────────────────────────────────
  'PRJ-NHAI-CBE-042': {
    center: [30.8500, 76.7300],
    zoom: 11,
    alignmentPolyline: [
      [30.7350, 76.8400], // Chandigarh IT Park
      [30.8500, 76.7300], // Siswan Border
      [30.9500, 76.7800]  // Baddi Industrial Zone (31.5 km)
    ]
  },

  // ── 32. PUDUCHERRY UT ───────────────────────────────────────────────────────
  'PRJ-PPD-PPM-043': {
    center: [11.9180, 79.8320],
    zoom: 13,
    alignmentPolyline: [
      [11.9300, 79.8200], [11.9300, 79.8400], [11.9050, 79.8400], [11.9050, 79.8200], [11.9300, 79.8200]
    ]
  },

  // ── 33. ANDAMAN & NICOBAR UT ────────────────────────────────────────────────
  'PRJ-AAI-PBA-044': {
    center: [11.6410, 92.7300],
    zoom: 13,
    alignmentPolyline: [
      [11.6520, 92.7200], [11.6520, 92.7420], [11.6300, 92.7420], [11.6300, 92.7200], [11.6520, 92.7200]
    ]
  },

  // ── 34. LADAKH UT ───────────────────────────────────────────────────────────
  'PRJ-BRO-ZLT-045': {
    center: [34.2850, 75.5000],
    zoom: 11,
    alignmentPolyline: [
      [34.2550, 75.4200], // Baltal Sonamarg West Portal
      [34.2850, 75.5000], // Zojila Ridge (11,578 ft Pass)
      [34.3100, 75.5900]  // Minamarg / Dras East Portal (14.15 km Tunnel)
    ]
  },

  // ── 35. LAKSHADWEEP UT ──────────────────────────────────────────────────────
  'PRJ-AAI-AML-046': {
    center: [10.8240, 72.1760],
    zoom: 14,
    alignmentPolyline: [
      [10.8400, 72.1700], [10.8400, 72.1850], [10.8100, 72.1850], [10.8100, 72.1700], [10.8400, 72.1700]
    ]
  },

  // ── 36. DADRA & NAGAR HAVELI AND DAMAN & DIU UT ─────────────────────────────
  'PRJ-NHAI-SDC-047': {
    center: [20.3400, 72.9000],
    zoom: 11,
    alignmentPolyline: [
      [20.2700, 72.9800], // Silvassa Town
      [20.3700, 72.9100], // Vapi Border
      [20.4100, 72.8300]  // Daman Coastal Jetty (28.4 km)
    ]
  }
};
