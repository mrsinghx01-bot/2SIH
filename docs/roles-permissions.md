# Roles & Permissions: National Land Acquisition & Management System

## Role Definitions & Jurisdiction Matrix

| Role Code | Role Name | Jurisdiction | Key Permissions |
| :--- | :--- | :--- | :--- |
| `CENTRAL_ADMIN` | Central Administrator | National (All 36 States & UTs) | Full system administration, national KPIs, global policy approval, audit inspection |
| `CENTRAL_OFFICER` | Central Monitoring Officer | National | Cross-state project monitoring, national analytics, statutory compliance reviews |
| `STATE_ADMIN` | State Administrator | Assigned State | State-wide projects, district administration management, state sanction concurrence |
| `STATE_OFFICER` | State Revenue Officer | Assigned State | State project monitoring, gazette notification review, inter-district coordination |
| `DISTRICT_ADMIN` | District Magistrate / Collector | Assigned District | Award approval, Section 3G valuation sign-off, possession certificates, DBT release |
| `DISTRICT_OFFICER` | Additional District Magistrate (LA) | Assigned District | Case hearing, objection resolution, valuation matrix verification, R&R monitoring |
| `PROJECT_AGENCY` | Project Implementing Agency (NHAI, DFCCIL, etc.) | Assigned Projects | Project registration, land requisition proposals, DPR uploads, progress tracking |
| `LAND_ACQUISITION_OFFICER` | Competent Authority (CALA / LAO) | Assigned Cases | 9-Stage lifecycle transitions, statutory gazette issuance, award generation |
| `FIELD_OFFICER` | Tehsildar / Survey Officer | Assigned Talukas / Villages | Ground-truth cadastral survey, GPS boundary tagging, photo capture, khasra verification |

## Server-Side Geographic Scoping Enforcement
All API requests for state-specific or district-specific data are filtered through `checkGeographicScope` middleware. Any attempt by a State or District user to access another territory via URL parameter manipulation returns `403 Forbidden`.
