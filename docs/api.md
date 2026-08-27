# REST API Specification: National Land Acquisition & Management System

## Base URL
`/api`

## Authentication & Authorization
Include `Authorization: Bearer <token>` in the HTTP headers for authenticated endpoints.

| Method | Route | Description | Role Scope |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Officer login with Employee ID & Password | Public |
| `GET` | `/auth/me` | Current authenticated user session details | Authenticated |
| `GET` | `/auth/demo-roles` | List available demo accounts for testing | Public |
| `GET` | `/dashboard/summary` | Lightweight KPI summary for instant dashboard | Public / Auth |
| `GET` | `/states` | List 36 States/UTs with derived metrics | Public / Auth |
| `GET` | `/states/:id` | State detail with districts and active projects | Geographic Scoped |
| `GET` | `/districts` | List districts (filter by `stateId` / search) | Public / Auth |
| `GET` | `/districts/:id` | District detail with projects and cases | Geographic Scoped |
| `GET` | `/projects` | List projects (filter by state, sector, status) | Authenticated |
| `GET` | `/projects/:id` | Full 10-tab project detail data | Authenticated |
| `POST` | `/projects` | Register new capital infrastructure project | Admin / Agency |
| `GET` | `/acquisition-cases` | List acquisition cases across 9 stages | Authenticated |
| `GET` | `/acquisition-cases/:id` | Case details, history, and attached parcels | Authenticated |
| `PATCH` | `/acquisition-cases/:id/stage` | Transition case stage in 9-stage lifecycle | LAO / Admin |
| `GET` | `/parcels` | List cadastral parcels and khasra numbers | Authenticated |
| `GET` | `/compensation` | List compensation ledger records | Authenticated |
| `GET` | `/rr` | List R&R affected families and entitlements | Authenticated |
| `GET` | `/documents` | List statutory documents and gazettes | Authenticated |
| `POST` | `/documents` | Upload project/case document metadata | Authenticated |
| `GET` | `/approvals` | List administrative approval requests | Authenticated |
| `POST` | `/approvals/:id/process` | Approve / Reject / Return approval request | Authorized Approver |
| `GET` | `/notifications` | Get officer notifications and unread badge count | Authenticated |
| `PATCH` | `/notifications/:id/read` | Mark notification as read | Authenticated |
| `GET` | `/audit-logs` | Retrieve append-only audit trail | Admin / Officer |
| `GET` | `/reports/analytics` | Aggregate metrics and sector velocity stats | Authenticated |
