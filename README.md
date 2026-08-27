# National Land Acquisition & Management System
### Government of India • Ministry of Rural Development • Department of Land Resources

A comprehensive, production-grade enterprise platform for end-to-end management and real-time monitoring of land acquisition lifecycles across India.

---

## Key Features

1. **Exact Government of India Visual Identity**:
   - Deep navy header and sidebar with Ashoka Lion Capital emblem, system motto, dynamic date, and notification counter.
   - Five colorful pastel KPI cards (Total Projects, Land Proposed, Land Acquired, Compensation Paid, Affected Families).
   - High-fidelity State Cards with landmark imagery, state silhouettes in crisp white outlines, dynamic derived metrics, circular progress rings, and compact UT cards.
   - Subtle Himalayan mountain range & geographic background artwork layer.
2. **Master Geographic Ingestion**:
   - Built on official Local Government Directory (LGD) master data: **36 States & UTs** and **785 Districts**.
   - Integrated with Survey of India administrative boundary mappings.
3. **9-Stage Acquisition Lifecycle Workflow**:
   - `INITIATED` → `SURVEY` → `NOTIFICATION` → `OBJECTION` → `VALUATION` → `AWARD` → `COMPENSATION` → `POSSESSION` → `COMPLETED`.
4. **Deep Multi-District Infrastructure Project Console**:
   - 10 comprehensive tabs: Overview, Land Requirements, Acquisition Cases, Parcels/GIS, Documents, Compensation, R&R, Approvals, Timeline, and Audit.
5. **Role-Based Access Control (RBAC) & Server-Side Geographic Scoping**:
   - Central Admin, State Admin, District Admin, Land Acquisition Officer (LAO), Project Agency, and Field Officer.
6. **Mobile-Optimized Field Officer Portal**:
   - Ground-truth GPS location verification, photo capture, and cadastral survey submissions.

---

## Project Structure

```
national-land-acquisition-management-system/
├── frontend/                 # React 18 + Vite + TypeScript + Custom Design System CSS
│   ├── public/assets/        # Ashoka emblem SVG, India flag SVG, Mountain background
│   └── src/                  # Components, Pages, State Asset Library, API Client
│
├── backend/                  # Node.js + Express + TypeScript + Prisma ORM
│   ├── prisma/               # PostgreSQL schema & entity models
│   └── src/                  # Controllers, Routes, Middleware, Services
│
├── data/
│   ├── raw/                  # lgd_states.csv, lgd_districts.csv, soi_admin_boundaries.zip
│   └── processed/            # district_geometry_auto_matches.csv, district_geometry_review_prioritized.csv
│
├── scripts/                  # Data validation, LGD import, and Demo Seed scripts
├── storage/                  # Physical document and upload storage
└── docs/                     # Architecture, Data Model, API, Roles, and Data Import specs
```

---

## Quick Start & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Validate Data & Seed Demo Records
```bash
npm run data:validate
npm run db:seed
```

### 3. Run Development Servers
```bash
# Runs backend on port 5000 and frontend on port 5173 concurrently:
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## Demo Credentials

| Role | Employee ID | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Central Admin** | `GOI-CAD-001` | `Admin@123` | National (All 36 States/UTs) |
| **State Admin (UP)** | `UP-SAD-101` | `Admin@123` | Uttar Pradesh |
| **District Admin (Lucknow)** | `UP-DAD-201` | `Admin@123` | Lucknow District |
| **Land Acquisition Officer** | `LAO-GOI-301` | `Admin@123` | Competent Authority |
| **Field Survey Officer** | `FO-UP-501` | `Admin@123` | Field Survey Jurisdiction |
