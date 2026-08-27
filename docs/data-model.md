# Data Model: National Land Acquisition & Management System

## Entity Relational Hierarchy

```
State (LGD 36)
  └── District (LGD 785)
        ├── ProjectDistrict (Multi-District Mapping)
        │     └── Project (Highways, Railways, Corridors, Ports, Energy)
        └── AcquisitionCase (Statutory Requisition)
              ├── AcquisitionCaseStatusHistory (9-Stage Timeline)
              ├── Parcel (Khasras & Cadastral GIS Polygons)
              ├── CompensationRecord (Assessed, Approved, Paid DBT)
              ├── AffectedFamily (Titleholders, Tenants, Vulnerability)
              │     └── RRRecord (Resettlement & Rehabilitation)
              ├── Document (Gazette 3A, 3D, 3G, Valuation Matrices)
              └── Approval (Administrative Sanction Chain)
```

## 9-Stage Acquisition Lifecycle Workflow
1. `INITIATED`: Requisition filed by Project Implementing Agency.
2. `SURVEY`: Joint cadastral & drone boundary survey by Field Officers.
3. `NOTIFICATION`: Preliminary Section 3A/4 Gazette notification issued.
4. `OBJECTION`: Section 15 public objection hearing & resolution window.
5. `VALUATION`: Circle rate determination + 100% Solatium calculation matrix.
6. `AWARD`: Final award determination under Section 3G / 37.
7. `COMPENSATION`: Direct Benefit Transfer (DBT) to beneficiary accounts.
8. `POSSESSION`: Statutory certificate of encumbrance-free physical possession.
9. `COMPLETED`: Handover of land to project executing authority.
