# System Architecture: National Land Acquisition & Management System

## 1. Overview
The **National Land Acquisition & Management System** is an enterprise-grade digital platform built for the Government of India to monitor, streamline, and govern land acquisition lifecycles across Central Ministries, State Governments, Union Territories, District Administrations, Land Acquisition Officers, and Field Officers.

---

## 2. Layered Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER (Vite + React)               │
│  - National Dashboard (Exact Reference UI: 5 KPI cards, State/UT Grid)  │
│  - State Detail View (/states/:stateId)                                │
│  - Project Detail Management Console (/projects/:id - 10 Tabs)         │
│  - Interactive GIS India Map & Cadastral Parcel Viewer                 │
│  - Mobile-Optimized Field Survey Inspection Portal                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (JWT)
┌───────────────────────────────────▼────────────────────────────────────┐
│                        APPLICATION LAYER (Express + TypeScript)        │
│  - Auth & RBAC Middleware with Geographic Access Scoping               │
│  - 9-Stage Acquisition Lifecycle Workflow State Machine                │
│  - Compensation Ledger & DBT Disbursement Tracker                      │
│  - Rehabilitation & Resettlement (R&R) Family Registry                 │
│  - Multi-District Capital Infrastructure Project Engine                │
│  - Append-Only Audit Logging & Statutory Notification Dispatcher       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Prisma ORM
┌───────────────────────────────────▼────────────────────────────────────┐
│                        DATA & STORAGE LAYER (PostgreSQL + PostGIS)     │
│  - Relational Schema (Users, States, Districts, Projects, Cases)       │
│  - PostGIS Spatial Polygons (SOI District & Parcel Boundaries)         │
│  - Master Geographic Source (LGD 36 States/UTs, 785 Districts)         │
│  - Physical File Storage (/storage/documents/ for 3A/3D/3G Gazettes)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Principles
1. **Zero-Delay Visual Shell**: Initial dashboard renders immediately with pre-computed summaries; granular details load progressively.
2. **Server-Enforced RBAC & Geographic Scoping**: Users cannot access or mutate records outside their authorized state/district jurisdiction.
3. **Data Integrity & Truthfulness**: Demo records are clearly flagged with `data_source = 'DEMO'`. Real LGD records are imported via automated validation pipelines.
4. **Append-Only Auditing**: Critical administrative modifications create immutable audit trail records with before/after state diffs and IP addresses.
