# Darukaa.Earth

A basic geospatial analytics platform for managing and visualizing carbon and biodiversity projects.

## Architecture
- **Frontend**: React (TypeScript) with Leaflet.js (via react-leaflet, leaflet-draw) for interactive maps, Chart.js for analytics, Material-UI for UI.
- **Backend**: FastAPI (Python) with JWT authentication, SQLAlchemy/GeoAlchemy2 for database operations.
- **Database**: PostgreSQL with PostGIS for geospatial data (polygons).
- **Deployment**: Frontend hosted on GitHub Pages[](https://a-abrar.github.io/geospatial). Backend runs locally or can be hosted on Render.com.
- **Code Quality**: Basic linting with ESLint (frontend) and Ruff (backend).

## Database Schema
- **Users**: `id` (PK, int), `username` (string, unique), `hashed_password` (string).
- **Projects**: `id` (PK, int), `name` (string).
- **Sites**: `id` (PK, int), `project_id` (FK, int), `geometry` (POLYGON, SRID=4326), `metrics` (string, JSON).

## Setup Locally
1. **Backend**:
   - Navigate: `cd backend`
   - Create `.env`: