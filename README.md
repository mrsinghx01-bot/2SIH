# 🏛️ Bhoomisetu (भूमिसेतु) • National Land Acquisition & Management System
### Government of India • Ministry of Rural Development (MoRD) • Department of Land Resources (DoLR)
> **Unified National e-Governance Platform for Transparent Land Acquisition, Geospatial Monitoring, and Statutory Decision Support**  
> *Developed for the Smart India Hackathon (SIH) • Compliant with RFCTLARR Act 2013, PM GatiShakti & DILRMP*

---

## 🌐 Live Production Deployments & Links

| Component | Platform | Live Production URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web Portal** | **Cloudflare Pages** | 🚀 **[https://bhoomisetu.pages.dev](https://bhoomisetu.pages.dev)** | 🟢 **Live & Active** |
| **Backend REST API** | **Render** | ⚡ **[https://national-land-aquisisation.onrender.com](https://national-land-aquisisation.onrender.com/api/v1/health)** | 🟢 **Live & Active** |
| **Local Web Interface** | Local Dev Server | `http://localhost:5173` | 🟢 Ready |
| **Local API Server** | Local Express | `http://localhost:5000` | 🟢 Ready |

---

## 🎯 Executive Vision & Problem Statement

Land acquisition in India for mega infrastructure corridors (Expressways, High-Speed Rail, Dedicated Freight Corridors, Mega Solar Parks) historically suffers from **inter-departmental silos, valuation litigations, Section 19 statutory lapses, and lack of pre-notification feasibility analysis**.

**Bhoomisetu (भूमिसेतु)** provides a unified e-Governance platform that brings together the Ministry of Rural Development, State Revenue Departments, District Collectorates / CALA, and Displaced Landowners onto a single transparent digital ledger.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE 9-STAGE STATUTORY LIFECYCLE (RFCTLARR 2013)                        │
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

## 🌟 Core Modules & Technical Innovations

### 1. 🧠 Decision Support System (DSS) & What-If Corridor Feasibility Simulator
* **Pre-Notification Corridor Optimization:** Simulates compensation budgets, solatium overhead, R&R displacement, and clearance velocity **before** issuing Section 4/11 Gazette notifications.
* **Statutory RFCTLARR Act 2013 Calculation Engine:**
  $$\text{Total Acquisition Budget} = \text{Sec 26 Market Value} + \mathbf{100\%\ Solatium\ u/s\ 30(1)} + \mathbf{12\%\ p.a.\ AMV\ u/s\ 30(3)} + \mathbf{Schedule\ II\ R\&R\ Grants}$$
* **Instant Terrain Friction Comparison:** Compares 4 real-world alignment scenarios (*Irrigated Multi-Crop*, *Rainfed Rural*, *Barren / Govt Gram Sabha*, and *Forest FRA Eco-Zone*).
* **📥 Official DSS Brief CSV Export:** Generates an auditable, standardized 5-column executive briefing document with **UTF-8 Byte Order Mark (BOM)** formatting for Microsoft Excel and Cabinet EFC/CCEA appraisal.
* **Collector Statutory Action Playbook:** Codified SOPs (Protocols 01–05) guiding District Magistrates through Section 15 objection timelines, Section 77(2) LARRA Court Escrow deposits, tribal FPIC clearances, and Section 19(7) lapse prevention.

### 2. 🗺️ Interactive GIS & Cadastral Parcel Engine
* **47 Real National Mega-Projects:** Spanning all **36 States and Union Territories** across 9 infrastructure sectors (Highways, High-Speed Rail, Airports, Solar, Ports, Defence, Urban Development, Industrial Corridors, Irrigation).
* **4-Tier Cadastral Status Tracking:**
  * 🟢 **Acquired & Handed Over:** Clear Title, Section 38 Vesting, DBT compensation disbursed.
  * 🟡 **Under Acquisition / Valuation:** Active joint survey, Section 11/19 Gazette, or award inquiry.
  * 🔴 **Disputed / Statutory Hold-Up:** Section 15 objections, co-sharer disputes, or Court stays.
  * 🔵 **Government / Forest Land:** Gram Sabha, PSU, or FRA 2006 land.
* **Dynamic Corridor Bounds & Village Analytics:** Automatic bounding-box camera zoom (`map.fitBounds`) with sector-specific corridor titles and surveyed revenue village tallies.
* **Cadastral Side Inspector:** Deep drill-down to Khasra/Khata numbers, Aadhaar-linked titleholders, assessed market values, and asset schedules.

### 3. 📱 All-Device Responsive Design
* **100% Mobile & Tablet Compatible:** Seamless experience from smartphones (320px–480px), iPads/tablets (641px–1024px), to 4K desktop screens.
* **Off-Canvas Slide-In Navigation Drawer:** Glassmorphism overlay with auto-close interaction on mobile viewports.
* **Touch-Friendly Controls:** Horizontal swipe tab navigation, touch-scrolling GIS filter chips, and bottom-sheet parcel inspector.
* **Responsive Multi-Tier Grid Breakpoints:** Adaptive 5-column to 1-column layouts for statutory lifecycle steppers and executive MIS cards.

### 4. 📲 Mobile Field Officer Survey Portal
* **HTML5 Geolocation Geofencing:** Validates surveyor presence within the parcel polygon before unlocking inspection tools.
* **Drone & Ground-Truth Photo Capture:** Live geotagged photograph uploads with metadata verification.
* **Asset & Tree Enumeration:** Detailed logging of fruit-bearing timber trees and immovable structures as per Section 29 schedules.
* **Competent Authority Review Queue (`/survey-review`):** LAOs review field surveyor evidence and issue binding decisions (`APPROVE`, `REQUEST_RESURVEY`, `REJECT`).

### 5. ⚖️ 100% RFCTLARR 2013 Statutory Compliance
* **First Schedule (Sections 26–30):** State-notified rural multipliers ($1.0\times$ to $2.0\times$), mandatory 100% Solatium, and 12% p.a. Additional Market Value.
* **Second Schedule (Section 31 R&R):** Mandatory ₹5.0 Lakh annuity/resettlement grant, ₹50,000 subsistence allowance, and constructed housing allocations.
* **Section 41 Tribal Protections:** Gram Sabha Free Prior Informed Consent (FPIC), one-third upfront compensation, and 2.5 acres alternative land.
* **Section 77(2) LARRA Court Escrow Deposit:** Prevents project stall by depositing contested title compensation into Court Escrow while delivering clear Section 38 physical possession to the acquiring agency.

### 6. 🗣️ Multilingual Accessibility (8th Schedule Languages)
* Real-time language switching supporting **12+ Official Indian Languages** with authentic typography:
  * English, हिन्दी (Hindi), தமிழ் (Tamil), తెలుగు (Telugu), मराठी (Marathi), বাংলা (Bengali), ગુજરાતી (Gujarati), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), ଓଡ଼ିଆ (Odia), ਪੰਜਾਬੀ (Punjabi), অসমীয়া (Assamese).

### 7. 🔒 Enterprise Role-Based Access Control (RBAC)
* **Strict Server-Side Geographic Scoping:** State and District administrators can only view and authorize records within their assigned Local Government Directory (LGD) boundaries.
* **Immutable Audit Trail:** Tamper-evident logging of every administrative decision, compensation voucher, and statutory approval.

---

## 🔑 Demo Credentials & Role Access

Access the portal directly via **[https://bhoomisetu.pages.dev/login](https://bhoomisetu.pages.dev/login)** using 1-click demo role switcher or credentials:

| Role | Demo Employee ID | Default Password | Geographic Jurisdiction Scope |
| :--- | :--- | :--- | :--- |
| **Central Admin** | `GOI-CAD-001` | `Admin@123` | **National Master Scope** (All 36 States & UTs) |
| **Central Officer** | `GOI-COF-002` | `Admin@123` | **National Oversight** (Ministry of Rural Development) |
| **State Admin (UP)** | `UP-SAD-101` | `Admin@123` | **State Scope** (Uttar Pradesh — LGD Code 9) |
| **District Admin** | `UP-DAD-201` | `Admin@123` | **District Scope** (Lucknow District) |
| **District LAO** | `LAO-GOI-301` | `Admin@123` | **Competent Authority** (Valuation & Awards) |
| **Field Survey Officer** | `FO-UP-501` | `Admin@123` | **Field Survey Scope** (Mobile Geo-Survey App) |

---

## 📊 47 National Infrastructure Mega-Projects Catalog

<details>
<summary><strong>Click to expand the Complete 47-Project National Registry across all 36 States & UTs</strong></summary>

1. **Delhi-Mumbai Expressway** (`PRJ-NHAI-DME-001`) — Maharashtra / Rajasthan / Gujarat / MP / Haryana
2. **Mumbai-Ahmedabad High-Speed Rail (Bullet Train)** (`PRJ-NHSRCL-MAHSR-005`) — Maharashtra / Gujarat
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

## 🗂️ Project Repository Structure

```
2SIH/
├── frontend/                          # React 18 + Vite + TypeScript (Single Page App)
│   ├── public/assets/                 # Ashoka emblem, Indian flag, mountain branding
│   └── src/
│       ├── components/                # GisInteractiveMap, Sidebar, Header, KPI Cards
│       ├── features/
│       │   ├── auth/                  # Authentication & Role Switching
│       │   ├── dashboard/             # National Dashboard & Analytics
│       │   ├── states/                # 36 States & UTs Explorer
│       │   ├── projects/              # Projects List & 10-Tab Project Console
│       │   ├── parcels/               # Cadastral Parcel Registry
│       │   ├── compensation/          # Direct Benefit Transfer (DBT) Registry
│       │   ├── rr/                    # Resettlement & Rehabilitation Monitoring
│       │   ├── reports/               # Decision Support System (DSS) Simulator & MIS
│       │   ├── alerts/                # Statutory Exception & Lapse Monitoring
│       │   ├── audit/                 # Immutable Event Sourcing Audit Trail
│       │   └── field-officer/         # Mobile Field Survey App & Review Queue
│       ├── i18n/                      # 8th Schedule Multilingual Translations
│       ├── services/                  # REST API Client
│       └── store/                     # Auth & Session Context
│
├── backend/                           # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── controllers/               # Projects, States, Compensation, DSS Analytics
│   │   ├── middleware/                # JWT Auth, RBAC & LGD Scope Guards
│   │   ├── routes/                    # Versioned REST API Routes (/api)
│   │   └── scripts/                   # LGD Data & 47-Project Master Seed Generator
│   ├── storage/                       # Database Store & Document Archives
│   └── prisma/                        # PostgreSQL Schema
│
└── scripts/                           # Cross-Platform CI/CD Build Pipelines
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone & Install
```bash
git clone https://github.com/mrsinghx01-bot/2SIH.git
cd 2SIH
npm install
```

### 2. Run Locally
```bash
# Starts Backend (Port 5000) and Frontend (Port 5173) concurrently:
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🛡️ Statutory Legal Framework & Standards

* **RFCTLARR Act, 2013** *(Act No. 30 of 2013, Parliament of India)*
* **National Highways Act, 1956** *(Sections 3A, 3D, 3G)*
* **Railways Act, 1989 & Amendment 2008** *(Sections 20A–20N)*
* **Forest Rights Act (FRA), 2006 & PESA Act, 1996**
* **Digital India Land Records Modernization Programme (DILRMP)** standards for Bhu-Aadhaar & ULPIN.

---

## 📜 License & Hackathon Declaration

Developed for the **Smart India Hackathon (SIH)** under the problem statement issued by the **Ministry of Rural Development & Department of Land Resources (DoLR), Government of India**. Released under the [MIT License](LICENSE).
