// Master GIS Alignment Corridors & Master-Plan Perimeter Polygons for national infrastructure projects
export interface ProjectGisDefinition {
  center: [number, number];
  zoom: number;
  alignmentPolyline: [number, number][];
  milestones?: { name: string; coord: [number, number]; state: string; chainageKm?: string }[];
}

export const MASTER_PROJECT_GIS_REGISTRY: Record<string, ProjectGisDefinition> = {
  // 1. Delhi-Mumbai Expressway (Complete 1,350 km 5-State Corridor)
  'PRJ-NHAI-DME-001': {
    center: [23.8500, 75.5000],
    zoom: 6,
    alignmentPolyline: [
      [28.3200, 77.0500], // 1. Sohna, Haryana / Delhi NCR (0 km)
      [28.1100, 77.0100], // 2. Nuh, Haryana (35 km)
      [27.7500, 76.8500], // 3. Naugaon / Alwar, Rajasthan (98 km)
      [26.9000, 76.4000], // 4. Bandikui / Dausa, Rajasthan (Jaipur Spur, 180 km)
      [26.5600, 76.3200], // 5. Lalsot, Rajasthan (225 km)
      [26.1500, 76.3500], // 6. Sawai Madhopur, Rajasthan (290 km)
      [25.7200, 76.1800], // 7. Indergarh / Lakheri, Rajasthan (330 km)
      [25.1800, 75.8500], // 8. Kota (Chambal River Cable Bridge), Rajasthan (375 km)
      [24.9300, 75.6800], // 9. Mukundara Hills Tunnel / Rawatbhata, Rajasthan (420 km)
      [24.5200, 75.7500], // 10. Bhanpura, Madhya Pradesh (475 km)
      [24.3200, 75.6500], // 11. Garoth, Madhya Pradesh (510 km)
      [24.1800, 75.6200], // 12. Shamgarh / Suwasra, Madhya Pradesh (535 km)
      [23.6300, 75.1300], // 13. Jaora, Madhya Pradesh (600 km)
      [23.3300, 75.0500], // 14. Ratlam, Madhya Pradesh (640 km)
      [23.0000, 74.5800], // 15. Thandla / Jhabua, Madhya Pradesh (710 km)
      [22.8300, 74.2500], // 16. Dahod, Gujarat (750 km)
      [22.7500, 73.6100], // 17. Godhra, Gujarat (810 km)
      [22.3000, 73.2000], // 18. Vadodara, Gujarat (875 km)
      [21.7000, 73.0000], // 19. Bharuch (Narmada River), Gujarat (960 km)
      [21.6200, 73.0000], // 20. Ankleshwar, Gujarat (975 km)
      [21.2500, 72.9000], // 21. Surat / Kim, Gujarat (1,035 km)
      [20.9500, 72.9200], // 22. Navsari, Gujarat (1,070 km)
      [20.6100, 72.9300], // 23. Valsad, Gujarat (1,115 km)
      [20.3700, 72.9100], // 24. Vapi, Gujarat (1,155 km)
      [20.1200, 72.9200], // 25. Talasari / Dahanu, Maharashtra (1,190 km)
      [19.8500, 73.3500], // 26. Kasara / Igatpuri / Shahpur, Maharashtra (1,240 km)
      [19.7500, 72.9100], // 27. Manor / Palghar, Maharashtra (1,265 km)
      [19.4700, 72.8200], // 28. Virar / Mumbai Suburban, Maharashtra (1,300 km)
      [19.2000, 73.1500], // 29. Thane / Kalyan / Badlapur, Maharashtra (1,325 km)
      [18.9500, 72.9500]  // 30. JNPT / Navi Mumbai Terminal, Maharashtra (1,350 km)
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

  // 2. Mumbai-Ahmedabad High-Speed Rail Corridor (Bullet Train)
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
      [23.0700, 72.5800]  // Sabarmati High-Speed Terminal
    ]
  },

  // 3. Navi Mumbai International Airport (CIDCO)
  'PRJ-CIDCO-NMIA-006': {
    center: [18.9900, 73.0720],
    zoom: 13,
    alignmentPolyline: [
      [19.0080, 73.0550], [19.0080, 73.0950], [18.9750, 73.0950], [18.9750, 73.0550], [19.0080, 73.0550]
    ]
  },

  // 4. Noida International Airport Jewar Phase 1
  'PRJ-YEIDA-NIA-002': {
    center: [28.1550, 77.5550],
    zoom: 13,
    alignmentPolyline: [
      [28.1750, 77.5300], [28.1750, 77.5850], [28.1300, 77.5850], [28.1300, 77.5300], [28.1750, 77.5300]
    ]
  },

  // 5. Purvanchal Expressway
  'PRJ-UPEIDA-PVE-010': {
    center: [26.2500, 82.2000],
    zoom: 8,
    alignmentPolyline: [
      [26.7500, 81.0800], [26.6500, 81.4000], [26.4000, 81.8500], [26.2500, 82.2000], [25.5800, 83.5800]
    ]
  }
};
