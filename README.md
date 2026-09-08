# 🏛️ National Land Acquisition & Management System (NLAMS)
### Government of India • Ministry of Rural Development • Department of Land Resources (DoLR)
> **Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support**  
> *Developed for the Smart India Hackathon (SIH) • Compliant with RFCTLARR Act 2013 & DILRMP*

---

## 🌐 Live Production Links & Deployments

| Component | Environment | URL / Endpoint | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web Portal** | Production (Vercel) | [https://frontend-git-main-manik14.vercel.app](https://frontend-git-main-manik14.vercel.app/dashboard) | 🟢 Live |
| **Backend REST API** | Production (Render) | [https://national-land-aquisisation.onrender.com](https://national-land-aquisisation.onrender.com/api/v1/health) | 🟢 Live |
| **Local Web Interface** | Local Dev | `http://localhost:5173` | 🟢 Active |
| **Local API Server** | Local Dev | `http://localhost:5000` | 🟢 Active |

---

## 🎯 Executive Summary & Vision

The **National Land Acquisition & Management System (NLAMS)** is a unified, production-grade e-Governance platform engineered to digitize, monitor, and accelerate the entire land acquisition lifecycle for national infrastructure projects across India. 

Governed by the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR)** and integrated with the **Digital India Land Records Modernization Programme (DILRMP)**, the platform replaces fragmented manual files with real-time geospatial intelligence, automated statutory valuation engines, and prescriptive decision support.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     THE 9-STAGE STATUTORY LIFECYCLE                                    │
│                                                                                                        │
│  [1. REQUISITION]  ➔  [2. SIA & SURVEY]  ➔  [3. SEC 11 NOTIFICATION]  ➔  [4. SEC 15 OBJECTIONS]      │
│         │                                                                             │                │
│         ▼                                                                             ▼                │
│  [5. SEC 26-29 VALUATION]  ➔  [6. SEC 30 AWARD]  ➔  [7. PFMS COMPENSATION]  ➔  [8. SEC 38 POSSESSION]│
│                                                                                       │                │
│                                           [9. PROJECT COMMISSIONED] ◄─────────────────┘                │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Architecture & Technical Highlights

### 1. 🗺️ Interactive GIS & Cadastral Parcel Engine
- **47 Real National Infrastructure Mega-Projects**: Spanning all **28 States and 8 Union Territories** (Highways, High-Speed Rail, Airports, Freight Corridors, Solar Ultra Parks, Ports, and Irrigation Canals).
- **4-Tier Cadastral Visual Status Tracking**:
  - 🟢 **Acquired & Handed Over**: Clear Title, Section 38 Vesting complete, PFMS DBT compensation disbursed.
  - 🟡 **Under Acquisition / Valuation**: Active joint survey, Section 11/19 Gazette stage, or Section 30 award pending.
  - 🔴 **Disputed / Statutory Hold-Up**: Section 15 public objections, co-sharer succession disputes, or High Court stays.
  - 🔵 **Government / Forest / Public Land**: Gram Sabha, PSU, or Forest Rights Act (FRA 2006) land.
- **Dynamic Auto-Fit Bounds (`map.fitBounds`)**: Seamlessly centers and zooms to the exact Right-of-Way (RoW) corridor polygon and cadastral parcels on project load.
- **Cadastral Side Inspector**: Real-time drill-down to Khasra numbers, village revenue records, Aadhaar-verified landowners, assessed market values, and **100% Solatium u/s 30(1)** awards.

### 2. 🧠 Decision Support System (DSS) & Feasibility Engine
- **What-If Corridor Feasibility Simulator**: 
  - Allows Ministry Planners and NHAI/DFCCIL directors to simulate alternative corridor routes across all 36 States/UTs before issuing Gazette notifications.
  - Computes exact statutory financial models: $(\text{Circle Rate} \times \text{Rural Multiplier } [1.0\times - 2.0\times]) + \mathbf{100\%\ Solatium\ u/s\ 30(1)} + \mathbf{12\%\ p.a.\ AMV\ u/s\ 30(3)} + \mathbf{Schedule\ II\ R\&R\ Grants}$.
  - Instant comparative analysis across **4 Land-Use Scenarios**: *Irrigated Multi-Crop*, *Rainfed Rural*, *Barren / Govt Wasteland*, and *Forest FRA*.
- **Collector Statutory Action Playbook (Protocols 01 to 05)**:
  - Prescriptive legal resolution workflows for District Magistrates and LAOs based on codified Indian law and Supreme Court precedents:
    - `Protocol 01`: *Section 15 Public Objections Exceeding 60-Day Window* (RFCTLARR § 15(2) & § 15(3)).
    - `Protocol 02`: *Title Succession Disputes & Refusal of Award* (RFCTLARR § 64 & § 77(2) LARRA Court Escrow).
    - `Protocol 03`: *Fifth Schedule Tribal Area Protections* (RFCTLARR § 41 & Gram Sabha FPIC).
    - `Protocol 04`: *Section 19(7) 12-Month Statutory Lapse Prevention*.
    - `Protocol 05`: *Standing Crops, Trees & Immovable Asset Joint Re-Valuation* (RFCTLARR § 29).

### 3. ⚖️ 100% RFCTLARR 2013 Statutory Compliance
- **First Schedule (Section 26–30)**: Automated market value determination with state-notified rural multipliers ($1.0\times$ to $2.0\times$), mandatory 100% Solatium, and 12% p.a. Additional Market Value.
- **Second Schedule (Section 31 R&R Entitlements)**: Mandatory ₹5.0 Lakh one-time annuity/resettlement grant, ₹50,000 subsistence allowance, and constructed housing allocations.
- **Section 41 Tribal Safeguards**: Gram Sabha Free Prior Informed Consent (FPIC), one-third upfront compensation, and 2.5 acres alternative land.
- **Section 77(2) LARRA Escrow Deposit**: Prevents infrastructure delays by depositing disputed title compensation directly into Reference Court Escrow while issuing Section 38 Vesting Orders.

### 4. 📱 Mobile-Optimized Field Officer Survey Portal
- **HTML5 Geolocation Geofencing**: Validates that the surveyor is physically within the cadastral parcel boundary.
- **Drone & Ground-Truth Photo Capture**: Live geotagged photo uploads with camera sensor metadata.
- **Tree & Asset Enumeration**: Record-by-record enumeration of fruit-bearing timber trees and structures.
- **Competent Authority Review Queue (`/survey-review`)**: District LAOs review survey evidence and issue official statutory decisions (`APPROVE`, `REQUEST_RESURVEY`, `REJECT`).

### 5. 🗣️ Multilingual Accessibility (8th Schedule Languages)
- Real-time language switching supporting **12+ Official Indian Languages** with authentic native typography:
  - English, हिन्दी (Hindi), தமிழ் (Tamil), తెలుగు (Telugu), मराठी (Marathi), বাংলা (Bengali), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), ଓଡ଼ିଆ (Odia), ਪੰਜਾਬੀ (Punjabi), অসমীয়া (Assamese).

### 6. 🔒 Enterprise Role-Based Access Control (RBAC)
- **Strict Server-Side Geographic Scoping**: District Admins and LAOs can only access data within their assigned Local Government Directory (LGD) district jurisdiction.
- **Immutable Audit Trail**: Append-only tamper-evident logging of every administrative approval, document hash, and compensation sign-off.

---

## 🗂️ Project Repository Structure

```
national-land-acquisition-management-system/
├── frontend/                          # React 18 + Vite + TypeScript (SPA Client)
│   ├── public/assets/                 # Ashoka emblem SVG, India flag SVG, Mountain background
│   └── src/
│       ├── components/                # GisInteractiveMap, Sidebar, Header, KPI Cards, LoadingSkeleton
│       ├── features/
│       │   ├── dashboard/             # National Master Dashboard & State KPIs
│       │   ├── states/                # 36 States & UTs Geographical Explorer
│       │   ├── projects/              # Projects List & 10-Tab Deep Project Console
│       │   ├── parcels/               # Cadastral Parcel Registry & Khasra Inspector
│       │   ├── compensation/          # PFMS Direct Benefit Transfer (DBT) Settlement
│       │   ├── rr/                    # Resettlement & Rehabilitation Monitoring
│       │   ├── reports/               # Decision Support System (DSS) Hub & What-If Simulator
│       │   ├── alerts/                # Statutory Exception & Lapse Monitoring
│       │   ├── audit/                 # Immutable Event Sourcing Audit Trail
│       │   ├── field-officer/         # Mobile Field Survey App & Survey Review Queue
│       │   └── settings/              # System Settings & Jurisdiction Configuration
│       ├── i18n/                      # 8th Schedule Multilingual Translation Engine
│       ├── services/                  # Axios API Client & Endpoints
│       └── store/                     # Auth & Session State Context
│
├── backend/                           # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── controllers/               # Projects, States, Parcels, Compensation, DSS Analytics
│   │   ├── data/                      # Real Census 2011, RBI, and DoLR Master Data
│   │   ├── middleware/                # JWT Auth, RBAC Authorization & Geographic Scope Guards
│   │   ├── routes/                    # Versioned REST API Route Definitions (/api/v1)
│   │   └── scripts/                   # LGD Ingestion & Master 47-Project Seed Generator
│   ├── storage/                       # Local disk JSON store & digital document archives
│   └── prisma/                        # PostgreSQL Schema definition
│
├── data/
│   ├── raw/                           # Official LGD master datasets (States & 785 Districts)
│   └── processed/                     # Survey of India administrative boundary mappings
│
└── docs/                              # Statutory Architecture, API Specs, and Evaluation Guides
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/mrsinghx01-bot/2SIH.git
cd 2SIH
```

### 2. Install Root, Backend & Frontend Dependencies
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. Build & Seed Master Database
```bash
cd backend
npm run build
cd ..
```

### 4. Launch Full-Stack Application
```bash
# Concurrently starts Backend (Port 5000) and Frontend (Port 5173):
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Credentials & Role Access

| Role | Email / Employee ID | Password | Geographic Jurisdiction Scope |
| :--- | :--- | :--- | :--- |
| **Central Admin** | `central.admin@landrecords.gov.in` (`GOI-CAD-001`) | `Admin@123` | **National Master Scope** (All 36 States & UTs) |
| **Central Officer** | `central.officer@mord.gov.in` (`GOI-COF-002`) | `Admin@123` | **National Oversight** (Ministry Monitoring) |
| **State Admin (UP)** | `state.admin.up@landrecords.gov.in` (`UP-SAD-101`) | `Admin@123` | **State Scope** (Uttar Pradesh — LGD Code 9) |
| **District Admin** | `district.admin.lucknow@landrecords.gov.in` (`UP-DAD-201`) | `Admin@123` | **District Scope** (Lucknow District) |
| **District LAO** | `lao.lucknow@landrecords.gov.in` (`LAO-GOI-301`) | `Admin@123` | **Competent Authority** (Land Valuation & Awards) |
| **Field Officer** | `field.officer.lucknow@landrecords.gov.in` (`FO-UP-501`) | `Admin@123` | **Field Survey Jurisdiction** (Mobile App) |

---

## 📊 Comprehensive 47 National Infrastructure Projects

The platform includes verified public infrastructure projects across all 36 States and Union Territories:

<details>
<summary><strong>Click to expand the 47-Project National Registry</strong></summary>

1. **Delhi-Mumbai Expressway** (`PRJ-NHAI-DME-001`) — Maharashtra / Haryana / Rajasthan / MP / Gujarat
2. **Mumbai-Ahmedabad High-Speed Rail** (`PRJ-NHSRCL-MAHSR-005`) — Maharashtra / Gujarat
3. **Navi Mumbai International Airport** (`PRJ-CIDCO-NMIA-006`) — Maharashtra (Panvel)
4. **Noida International Airport Jewar Phase 1** (`PRJ-YEIDA-NIA-002`) — Uttar Pradesh
5. **Noida International Airport Phase 3 & 4** (`PRJ-YEIDA-NIA-003`) — Uttar Pradesh
6. **Purvanchal Expressway Economic Nodes** (`PRJ-UPEIDA-PVE-010`) — Uttar Pradesh
7. **Ken-Betwa River Interlinking Project** (`PRJ-NWDA-KBLP-004`) — Madhya Pradesh / Uttar Pradesh
8. **Bengaluru Peripheral Ring Road** (`PRJ-BDA-BBC-007`) — Karnataka
9. **Western Dedicated Freight Corridor** (`PRJ-DFCCIL-WDFC-008`) — Gujarat Segment
10. **Eastern Dedicated Freight Corridor** (`PRJ-DFCCIL-EDFC-009`) — West Bengal Segment
11. **Chennai Metro Rail Phase 2** (`PRJ-CMRL-CMP2-011`) — Tamil Nadu
12. **Tamil Nadu Defence Industrial Corridor** (`PRJ-TIDCO-TNDIC-014`) — Coimbatore Node
13. **Bhadla Mega Solar Ultra Park Phase IV** (`PRJ-SECI-BSP4-012`) — Rajasthan (Thar Desert)
14. **USBRL Strategic Kashmir Rail Link** (`PRJ-NRLY-USBRL-013`) — Jammu & Kashmir
15. **AKIC Gaya Dobhi Industrial Node** (`PRJ-NICDC-AKIC-015`) — Bihar
16. **Kundli-Manesar-Palwal (KMP) Expressway** (`PRJ-NHAI-KMP-016`) — Haryana
17. **Delhi-Amritsar-Katra Expressway** (`PRJ-NHAI-DAK-017`) — Haryana Stretch
18. **Delhi-Amritsar-Katra Expressway** (`PRJ-NHAI-DAKP-018`) — Punjab Corridor
19. **Bilaspur-Manali-Leh Strategic Rail Line** (`PRJ-NRLY-BML-019`) — Himachal Pradesh
20. **Rishikesh-Karnaprayag Broad-Gauge Rail** (`PRJ-RVNL-RKRL-020`) — Uttarakhand
21. **Char Dham All-Weather Highway Network** (`PRJ-BRO-CDH-021`) — Uttarakhand
22. **Amaravati Capital City Development Corridor** (`PRJ-APCRDA-ACC-022`) — Andhra Pradesh
23. **Polavaram Multipurpose Irrigation Project** (`PRJ-AP-PIP-023`) — Andhra Pradesh
24. **Hyderabad Pharma City / Future City** (`PRJ-TSIIC-PFC-024`) — Telangana
25. **Telangana Regional Ring Road (Northern Arc)** (`PRJ-NHAI-TRRR-025`) — Telangana
26. **Vizhinjam International Deepwater Port** (`PRJ-VISL-VZP-026`) — Kerala
27. **Kochi Metro Phase 2 Pink Line** (`PRJ-KMRL-KMP2-027`) — Kerala
28. **JSW-POSCO Keonjhar Steel Plant** (`PRJ-JSW-POSCO-028`) — Odisha
29. **Paradip Port Western Dock Expansion** (`PRJ-PPA-WDD-029`) — Odisha
30. **Ranchi Smart City Outer Ring Road** (`PRJ-JUIDCO-RSC-030`) — Jharkhand
31. **Raipur-Durg SCR Metro Rail Transit** (`PRJ-CG-RDMC-031`) — Chhattisgarh
32. **Manohar International Airport Mopa** (`PRJ-GMR-MOPA-032`) — Goa
33. **Delhi Metro Phase 4 Priority Corridors** (`PRJ-DMRC-M4P-033`) — Delhi UT
34. **Guwahati Ring Road & Brahmaputra Bridge** (`PRJ-NHAI-GRR-034`) — Assam
35. **Sela Pass Strategic High-Altitude Tunnel** (`PRJ-BRO-SELA-035`) — Arunachal Pradesh
36. **Imphal-Moreh Asian Highway 1 Upgrade** (`PRJ-NHIDCL-IMH-036`) — Manipur
37. **Shillong Western Bypass Corridor** (`PRJ-NHAI-SWB-037`) — Meghalaya
38. **Dimapur-Kohima Four-Laning (NH-29)** (`PRJ-NHIDCL-DKH-038`) — Nagaland
39. **Aizawl Bypass Twin-Tube Tunnel** (`PRJ-NHIDCL-ABP-039`) — Mizoram
40. **Agartala-Akhaura Cross-Border Rail Link** (`PRJ-NRLY-AAR-040`) — Tripura
41. **Sevoke-Rangpo Himalayan Rail Link** (`PRJ-RVNL-SRR-041`) — Sikkim
42. **Chandigarh-Baddi Link Expressway** (`PRJ-NHAI-CBE-042`) — Chandigarh UT
43. **Puducherry Port Modernization Terminal** (`PRJ-PPD-PPM-043`) — Puducherry UT
44. **Port Blair Airport Runway Expansion** (`PRJ-AAI-PBA-044`) — Andaman & Nicobar UT
45. **Zoji La Strategic Tunnel Link (14.15 km)** (`PRJ-BRO-ZLT-045`) — Ladakh UT
46. **Agatti & Minicoy Airstrip Extensions** (`PRJ-AAI-AML-046`) — Lakshadweep UT
47. **Silvassa-Daman Border Road Link** (`PRJ-NHAI-SDC-047`) — Dadra & Nagar Haveli and Daman & Diu UT

</details>

---

## 🛡️ Statutory Legal Framework & Standards

This software is built to comply with:
- **RFCTLARR Act, 2013** *(Act No. 30 of 2013, Parliament of India)*
- **National Highways Act, 1956** *(Sections 3A, 3D, 3G)*
- **Railways Act, 1989 & Amendment 2008** *(Section 20A–20N)*
- **Forest Rights Act (FRA), 2006 & PESA Act, 1996**
- **Digital India Land Records Modernization Programme (DILRMP)** standards for Bhu-Aadhaar / Unique Land Parcel Identification Number (ULPIN).

---

## 📜 License

This project is developed for the **Smart India Hackathon (SIH)** under the auspices of the **Ministry of Rural Development & Department of Land Resources, Government of India**. Released under the [MIT License](LICENSE).
