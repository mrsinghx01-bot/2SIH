# Data Ingestion & Validation: National Land Acquisition & Management System

## Data Architecture
1. **Raw Data (`data/raw/`)**:
   - `lgd_states.csv`: Official Local Government Directory master list of 36 States & Union Territories.
   - `lgd_districts.csv`: 785 Districts with Census 2011 & LGD identifiers.
   - `soi_admin_boundaries.zip`: Survey of India shapefiles and spatial layers.
2. **Processed Data (`data/processed/`)**:
   - `district_geometry_auto_matches.csv`: 654 auto-matched district spatial geometries.
   - `district_geometry_review_prioritized.csv`: 136 boundary records flagged for administrative verification.

## Running Ingestion & Validation

```bash
# 1. Validate master source CSV files
npm run data:validate

# 2. Ingest master geographic data
npm run data:import

# 3. Seed application demo records (with data_source = 'DEMO')
npm run db:seed
```
