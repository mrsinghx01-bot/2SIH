export interface StateAssetMeta {
  code: string;
  name: string;
  landmarkTitle: string;
  imageUrl: string;
  mapOutlineSvg: string;
  mapFillColor: string;
  accentColor: string;
  bgGradient: string;
  capital: string;
}

// Comprehensive, authentic 36-State & UT landmark photo and geographic vector outline repository
export const STATE_ASSETS: Record<string, StateAssetMeta> = {
  // 1. Uttar Pradesh
  UP: {
    code: 'UP',
    name: 'Uttar Pradesh',
    landmarkTitle: 'Taj Mahal, Agra',
    imageUrl: '/assets/landmarks/taj_mahal.jpg',
    mapFillColor: '#F59E0B',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    capital: 'Lucknow',
    mapOutlineSvg: 'M 18,32 C 22,24 35,18 48,16 C 60,14 74,18 84,24 C 90,28 92,36 88,44 C 84,52 82,62 76,70 C 68,78 54,82 42,80 C 32,78 22,70 16,60 C 12,50 14,38 18,32 Z'
  },
  // 2. Maharashtra
  MH: {
    code: 'MH',
    name: 'Maharashtra',
    landmarkTitle: 'Gateway of India, Mumbai',
    imageUrl: '/assets/landmarks/gateway_of_india.jpg',
    mapFillColor: '#F59E0B',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    capital: 'Mumbai',
    mapOutlineSvg: 'M 14,28 C 22,20 40,16 58,16 C 72,16 84,22 88,32 C 92,42 86,56 80,66 C 72,76 56,82 40,82 C 28,82 18,74 14,64 C 10,52 10,38 14,28 Z'
  },
  // 3. Bihar
  BR: {
    code: 'BR',
    name: 'Bihar',
    landmarkTitle: 'Mahabodhi Temple & Great Buddha, Bodh Gaya',
    imageUrl: '/assets/landmarks/great_buddha.jpg',
    mapFillColor: '#F59E0B',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    capital: 'Patna',
    mapOutlineSvg: 'M 16,24 C 32,20 54,20 74,22 C 84,24 88,32 86,44 C 84,56 82,68 76,76 C 62,80 40,80 24,78 C 16,76 12,68 14,56 C 16,42 12,30 16,24 Z'
  },
  // 4. West Bengal
  WB: {
    code: 'WB',
    name: 'West Bengal',
    landmarkTitle: 'Victoria Memorial, Kolkata',
    imageUrl: '/assets/landmarks/victoria_memorial.jpg',
    mapFillColor: '#3B82F6',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    capital: 'Kolkata',
    mapOutlineSvg: 'M 48,12 C 54,12 58,18 56,26 C 54,34 50,42 52,50 C 54,58 68,64 72,72 C 76,80 68,88 56,88 C 44,88 38,82 38,72 C 38,62 44,54 44,46 C 44,38 40,30 42,20 C 44,14 46,12 48,12 Z'
  },
  // 5. Tamil Nadu
  TN: {
    code: 'TN',
    name: 'Tamil Nadu',
    landmarkTitle: 'Meenakshi Temple Gopuram, Madurai',
    imageUrl: '/assets/landmarks/meenakshi_temple.jpg',
    mapFillColor: '#8B5CF6',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    capital: 'Chennai',
    mapOutlineSvg: 'M 32,18 C 44,16 62,18 70,26 C 76,34 78,48 74,60 C 70,72 58,82 50,88 C 42,82 32,70 28,58 C 24,44 26,28 32,18 Z'
  },
  // 6. Rajasthan
  RJ: {
    code: 'RJ',
    name: 'Rajasthan',
    landmarkTitle: 'Hawa Mahal, Jaipur',
    imageUrl: '/assets/landmarks/hawa_mahal.jpg',
    mapFillColor: '#F59E0B',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    capital: 'Jaipur',
    mapOutlineSvg: 'M 38,14 C 54,14 70,22 78,32 C 86,44 86,60 78,72 C 68,82 48,86 34,80 C 22,74 14,60 14,46 C 14,32 24,18 38,14 Z'
  },
  // 7. Gujarat
  GJ: {
    code: 'GJ',
    name: 'Gujarat',
    landmarkTitle: 'Statue of Unity, Kevadia',
    imageUrl: '/assets/landmarks/statue_of_unity.jpg',
    mapFillColor: '#10B981',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Gandhinagar',
    mapOutlineSvg: 'M 26,22 C 38,20 62,20 74,26 C 80,32 82,46 76,54 C 68,62 58,68 50,78 C 42,86 32,84 26,76 C 20,66 22,54 26,46 C 22,42 16,34 26,22 Z'
  },
  // 8. Karnataka
  KA: {
    code: 'KA',
    name: 'Karnataka',
    landmarkTitle: 'Vidhana Soudha, Bengaluru',
    imageUrl: '/assets/landmarks/vidhana_soudha.jpg',
    mapFillColor: '#7C3AED',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    capital: 'Bengaluru',
    mapOutlineSvg: 'M 34,14 C 46,14 62,20 66,30 C 70,42 66,58 60,70 C 54,80 42,86 32,84 C 24,80 20,68 22,56 C 24,44 26,30 34,14 Z'
  },
  // 9. Andhra Pradesh
  AP: {
    code: 'AP',
    name: 'Andhra Pradesh',
    landmarkTitle: 'Tirumala Venkateswara Temple, Tirupati',
    imageUrl: '/assets/landmarks/andhra_pradesh.jpg',
    mapFillColor: '#EA580C',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    capital: 'Amaravati',
    mapOutlineSvg: 'M 28,26 C 42,20 64,22 74,32 C 80,44 80,62 70,74 C 58,84 40,84 28,76 C 20,68 20,48 24,34 Z'
  },
  // 10. Arunachal Pradesh
  AR: {
    code: 'AR',
    name: 'Arunachal Pradesh',
    landmarkTitle: 'Tawang Monastery in the Himalayas',
    imageUrl: '/assets/landmarks/arunachal_pradesh.jpg',
    mapFillColor: '#059669',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Itanagar',
    mapOutlineSvg: 'M 22,34 C 38,22 66,20 82,28 C 88,34 86,52 78,66 C 68,76 46,80 32,76 C 20,72 16,56 18,44 Z'
  },
  // 11. Assam
  AS: {
    code: 'AS',
    name: 'Assam',
    landmarkTitle: 'Kaziranga National Park & One-Horned Rhino',
    imageUrl: '/assets/landmarks/assam.jpg',
    mapFillColor: '#059669',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Dispur',
    mapOutlineSvg: 'M 20,38 C 34,26 56,24 72,30 C 82,36 86,52 80,64 C 72,74 54,78 38,76 C 24,74 16,62 16,48 Z'
  },
  // 12. Chhattisgarh
  CG: {
    code: 'CG',
    name: 'Chhattisgarh',
    landmarkTitle: 'Chitrakote Waterfalls, Bastar',
    imageUrl: '/assets/landmarks/chhattisgarh.jpg',
    mapFillColor: '#0284C7',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    capital: 'Raipur',
    mapOutlineSvg: 'M 36,16 C 48,16 58,22 56,36 C 54,50 62,64 58,78 C 54,86 44,88 38,84 C 32,78 34,60 32,44 C 30,30 32,20 36,16 Z'
  },
  // 13. Goa
  GA: {
    code: 'GA',
    name: 'Goa',
    landmarkTitle: 'Basilica of Bom Jesus & Coastal Heritage',
    imageUrl: '/assets/landmarks/goa.jpg',
    mapFillColor: '#D97706',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    capital: 'Panaji',
    mapOutlineSvg: 'M 36,22 C 48,20 62,26 64,38 C 66,52 58,68 50,78 C 42,86 34,80 32,70 C 30,56 32,38 36,22 Z'
  },
  // 14. Haryana
  HR: {
    code: 'HR',
    name: 'Haryana',
    landmarkTitle: 'Brahma Sarovar & Kurukshetra Heritage',
    imageUrl: '/assets/landmarks/haryana.jpg',
    mapFillColor: '#16A34A',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
    capital: 'Chandigarh',
    mapOutlineSvg: 'M 30,22 C 46,20 64,24 72,34 C 78,46 76,64 66,74 C 52,82 36,80 26,72 C 18,64 18,44 22,30 Z'
  },
  // 15. Himachal Pradesh
  HP: {
    code: 'HP',
    name: 'Himachal Pradesh',
    landmarkTitle: 'The Ridge, Shimla & Himalayan Mountains',
    imageUrl: '/assets/landmarks/himachal_pradesh.jpg',
    mapFillColor: '#0284C7',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    capital: 'Shimla',
    mapOutlineSvg: 'M 34,18 C 50,14 68,18 76,28 C 84,40 80,60 70,72 C 58,82 40,84 28,76 C 18,66 20,44 26,30 Z'
  },
  // 16. Jharkhand
  JH: {
    code: 'JH',
    name: 'Jharkhand',
    landmarkTitle: 'Baidyanath Temple, Deoghar',
    imageUrl: '/assets/landmarks/jharkhand.jpg',
    mapFillColor: '#059669',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Ranchi',
    mapOutlineSvg: 'M 24,26 C 42,18 64,20 76,28 C 84,38 84,58 76,70 C 64,80 44,82 30,76 C 18,68 18,46 22,32 Z'
  },
  // 17. Kerala
  KL: {
    code: 'KL',
    name: 'Kerala',
    landmarkTitle: 'Alleppey Backwaters & Houseboats',
    imageUrl: '/assets/landmarks/kerala.jpg',
    mapFillColor: '#059669',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Thiruvananthapuram',
    mapOutlineSvg: 'M 40,14 C 48,16 52,24 50,38 C 48,52 42,66 38,80 C 34,88 28,88 26,82 C 26,72 32,54 34,40 C 36,26 36,16 40,14 Z'
  },
  // 18. Madhya Pradesh
  MP: {
    code: 'MP',
    name: 'Madhya Pradesh',
    landmarkTitle: 'Khajuraho Monuments & Sanchi Stupa',
    imageUrl: '/assets/landmarks/madhya_pradesh.jpg',
    mapFillColor: '#D97706',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    capital: 'Bhopal',
    mapOutlineSvg: 'M 20,30 C 36,20 60,18 78,24 C 88,32 88,52 82,66 C 74,78 54,84 36,82 C 22,80 14,66 14,50 C 14,38 16,32 20,30 Z'
  },
  // 19. Manipur
  MN: {
    code: 'MN',
    name: 'Manipur',
    landmarkTitle: 'Loktak Lake & Floating Phumdis',
    imageUrl: '/assets/landmarks/manipur.jpg',
    mapFillColor: '#7C3AED',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    capital: 'Imphal',
    mapOutlineSvg: 'M 36,18 C 48,18 58,26 56,40 C 54,54 58,68 52,80 C 46,86 38,86 34,78 C 30,68 34,50 32,36 Z'
  },
  // 20. Meghalaya
  ML: {
    code: 'ML',
    name: 'Meghalaya',
    landmarkTitle: 'Nohkalikai Falls & Living Root Bridges',
    imageUrl: '/assets/landmarks/meghalaya.jpg',
    mapFillColor: '#059669',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Shillong',
    mapOutlineSvg: 'M 20,34 C 36,24 64,24 80,30 C 86,38 84,54 76,64 C 64,72 44,74 28,70 C 18,64 16,48 20,34 Z'
  },
  // 21. Mizoram
  MZ: {
    code: 'MZ',
    name: 'Mizoram',
    landmarkTitle: 'Aizawl Hill Cityscape & Vantawng Falls',
    imageUrl: '/assets/landmarks/mizoram.jpg',
    mapFillColor: '#EA580C',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    capital: 'Aizawl',
    mapOutlineSvg: 'M 38,18 C 48,18 54,26 52,40 C 50,56 52,70 48,82 C 42,88 34,86 32,76 C 30,64 34,48 32,32 Z'
  },
  // 22. Nagaland
  NL: {
    code: 'NL',
    name: 'Nagaland',
    landmarkTitle: 'Dzukou Valley & Hornbill Heritage',
    imageUrl: '/assets/landmarks/nagaland.jpg',
    mapFillColor: '#059669',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Kohima',
    mapOutlineSvg: 'M 32,20 C 44,16 58,22 62,34 C 66,48 62,64 56,76 C 48,84 38,82 34,72 C 30,60 32,42 30,30 Z'
  },
  // 23. Odisha
  OD: {
    code: 'OD',
    name: 'Odisha',
    landmarkTitle: 'Konark Sun Temple & Puri Jagannath',
    imageUrl: '/assets/landmarks/odisha.jpg',
    mapFillColor: '#0284C7',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    capital: 'Bhubaneswar',
    mapOutlineSvg: 'M 28,26 C 42,20 66,22 76,32 C 84,44 82,64 72,76 C 58,84 40,84 28,76 C 18,68 18,48 22,34 Z'
  },
  // 24. Punjab
  PB: {
    code: 'PB',
    name: 'Punjab',
    landmarkTitle: 'Golden Temple (Harmandir Sahib), Amritsar',
    imageUrl: '/assets/landmarks/punjab.jpg',
    mapFillColor: '#EAB308',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FEF9C3 0%, #FEF08A 100%)',
    capital: 'Chandigarh',
    mapOutlineSvg: 'M 32,20 C 48,18 66,22 74,32 C 80,44 78,64 68,74 C 54,82 38,82 28,74 C 20,66 20,44 24,30 Z'
  },
  // 25. Sikkim
  SK: {
    code: 'SK',
    name: 'Sikkim',
    landmarkTitle: 'Rumtek Monastery & Kanchenjunga',
    imageUrl: '/assets/landmarks/sikkim.jpg',
    mapFillColor: '#7C3AED',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    capital: 'Gangtok',
    mapOutlineSvg: 'M 36,20 C 48,18 60,24 62,36 C 64,50 60,66 52,76 C 44,82 36,80 34,70 C 32,56 34,38 34,26 Z'
  },
  // 26. Telangana
  TG: {
    code: 'TG',
    name: 'Telangana',
    landmarkTitle: 'Charminar & Golconda, Hyderabad',
    imageUrl: '/assets/landmarks/telangana.jpg',
    mapFillColor: '#7C3AED',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    capital: 'Hyderabad',
    mapOutlineSvg: 'M 32,20 C 46,18 64,22 72,32 C 78,44 76,64 68,74 C 56,82 40,82 30,74 C 22,66 22,44 26,30 Z'
  },
  // 27. Tripura
  TR: {
    code: 'TR',
    name: 'Tripura',
    landmarkTitle: 'Neermahal Water Palace',
    imageUrl: '/assets/landmarks/tripura.jpg',
    mapFillColor: '#EA580C',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    capital: 'Agartala',
    mapOutlineSvg: 'M 34,22 C 46,20 58,26 60,38 C 62,52 58,68 50,78 C 42,84 36,82 32,72 C 30,58 32,40 32,28 Z'
  },
  // 28. Uttarakhand
  UK: {
    code: 'UK',
    name: 'Uttarakhand',
    landmarkTitle: 'Kedarnath Temple in the Snow Himalayas',
    imageUrl: '/assets/landmarks/uttarakhand.jpg',
    mapFillColor: '#0284C7',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    capital: 'Dehradun / Gairsain',
    mapOutlineSvg: 'M 32,22 C 48,16 68,20 76,32 C 82,44 80,62 70,74 C 58,82 40,84 28,76 C 18,68 20,46 26,32 Z'
  },

  // UNION TERRITORIES (8)
  // 29. Andaman and Nicobar Islands
  AN: {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    landmarkTitle: 'Cellular Jail National Memorial, Port Blair',
    imageUrl: '/assets/landmarks/andaman_nicobar.jpg',
    mapFillColor: '#0284C7',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    capital: 'Port Blair',
    mapOutlineSvg: 'M 44,14 C 48,14 50,22 48,34 C 46,46 48,60 46,76 C 44,86 40,86 38,78 C 38,62 42,42 42,24 Z'
  },
  // 30. Chandigarh
  CH: {
    code: 'CH',
    name: 'Chandigarh (UT)',
    landmarkTitle: 'Rock Garden Sculptures, Chandigarh',
    imageUrl: '/assets/landmarks/rock_garden.jpg',
    mapFillColor: '#10B981',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Chandigarh',
    mapOutlineSvg: 'M 30,26 C 45,24 65,24 72,32 C 78,42 76,62 68,70 C 58,78 42,80 32,74 C 24,68 22,48 24,36 C 26,28 28,26 30,26 Z'
  },
  // 31. Dadra & Nagar Haveli and Daman & Diu
  DN: {
    code: 'DN',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    landmarkTitle: 'Portuguese Fort of Moti Daman',
    imageUrl: '/assets/landmarks/daman_diu.jpg',
    mapFillColor: '#D97706',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    capital: 'Daman',
    mapOutlineSvg: 'M 34,26 C 46,24 60,28 62,38 C 64,50 60,66 52,74 C 44,80 36,78 34,68 C 32,54 32,40 34,26 Z'
  },
  // 32. Delhi
  DL: {
    code: 'DL',
    name: 'Delhi (UT)',
    landmarkTitle: 'India Gate, New Delhi',
    imageUrl: '/assets/landmarks/india_gate.jpg',
    mapFillColor: '#F43F5E',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    capital: 'New Delhi',
    mapOutlineSvg: 'M 30,22 C 44,20 64,20 72,30 C 78,40 76,62 68,72 C 58,80 40,82 30,76 C 22,68 20,48 24,34 C 26,26 28,22 30,22 Z'
  },
  // 33. Jammu & Kashmir
  JK: {
    code: 'JK',
    name: 'Jammu & Kashmir (UT)',
    landmarkTitle: 'Dal Lake & Shikara, Srinagar',
    imageUrl: '/assets/landmarks/dal_lake.jpg',
    mapFillColor: '#2563EB',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    capital: 'Srinagar / Jammu',
    mapOutlineSvg: 'M 28,18 C 42,12 66,16 76,28 C 84,40 82,62 72,74 C 60,84 40,86 28,78 C 18,68 18,44 22,30 C 24,22 26,18 28,18 Z'
  },
  // 34. Ladakh
  LA: {
    code: 'LA',
    name: 'Ladakh (UT)',
    landmarkTitle: 'Pangong Tso & High Himalayas',
    imageUrl: '/assets/landmarks/ladakh.jpg',
    mapFillColor: '#0284C7',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
    capital: 'Leh',
    mapOutlineSvg: 'M 26,20 C 44,14 68,16 80,28 C 88,42 84,66 74,78 C 60,86 38,86 26,76 C 16,66 16,42 22,28 Z'
  },
  // 35. Lakshadweep
  LD: {
    code: 'LD',
    name: 'Lakshadweep (UT)',
    landmarkTitle: 'Coral Islands & Turquoise Lagoons',
    imageUrl: '/assets/landmarks/lakshadweep.jpg',
    mapFillColor: '#0D9488',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)',
    capital: 'Kavaratti',
    mapOutlineSvg: 'M 44,18 C 48,18 52,24 50,36 C 48,50 48,64 46,78 C 44,84 40,84 38,76 C 38,62 42,44 42,28 Z'
  },
  // 36. Puducherry
  PY: {
    code: 'PY',
    name: 'Puducherry (UT)',
    landmarkTitle: 'French Colonial Church, Puducherry',
    imageUrl: '/assets/landmarks/puducherry_church.jpg',
    mapFillColor: '#10B981',
    accentColor: '#10B981',
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    capital: 'Puducherry',
    mapOutlineSvg: 'M 32,24 C 44,20 62,22 70,30 C 76,40 74,60 68,70 C 58,78 42,80 32,74 C 24,66 22,46 26,34 Z'
  }
};

// Aliases for states that might use variant short codes or names
const CODE_ALIASES: Record<string, string> = {
  'TS': 'TG',
  'TG': 'TG',
  'TELANGANA': 'TG',
  'CT': 'CG',
  'CG': 'CG',
  'CHHATTISGARH': 'CG',
  'UT': 'UK',
  'UK': 'UK',
  'UTTARAKHAND': 'UK',
  'DD': 'DN',
  'DH': 'DN',
  'DN': 'DN',
  'DADRA AND NAGAR HAVELI': 'DN',
  'THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU': 'DN',
  'ODISHA': 'OD',
  'ORISSA': 'OD',
  'OD': 'OD',
  'PONDICHERRY': 'PY',
  'PUDUCHERRY': 'PY',
  'ANDAMAN AND NICOBAR ISLANDS': 'AN',
  'ANDHRA PRADESH': 'AP',
  'ARUNACHAL PRADESH': 'AR',
  'HIMACHAL PRADESH': 'HP',
  'MADHYA PRADESH': 'MP',
  'UTTAR PRADESH': 'UP',
  'WEST BENGAL': 'WB',
  'TAMIL NADU': 'TN',
  'JAMMU AND KASHMIR': 'JK'
};

export function getStateAsset(codeOrName: string): StateAssetMeta {
  const clean = (codeOrName || '').toUpperCase().trim();

  // 1. Direct code match
  if (STATE_ASSETS[clean]) {
    return STATE_ASSETS[clean];
  }

  // 2. Direct alias match
  if (CODE_ALIASES[clean] && STATE_ASSETS[CODE_ALIASES[clean]]) {
    return STATE_ASSETS[CODE_ALIASES[clean]];
  }

  // 3. Name containment match
  for (const key of Object.keys(STATE_ASSETS)) {
    const assetName = STATE_ASSETS[key].name.toUpperCase();
    if (assetName.includes(clean) || clean.includes(assetName)) {
      return STATE_ASSETS[key];
    }
  }

  return STATE_ASSETS['UP'];
}
