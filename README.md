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
   - Create `.env`
   - Install: `python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt`
- Run: `uvicorn main:app --reload`
2. **Frontend**:
- Navigate: `cd frontend`
- Install: `npm install`
- Run: `npm start`
3. **Database**:
- Install PostgreSQL 17 and PostGIS 3.5.3.
- Create database: `psql -U postgres -c "CREATE DATABASE darukaa;"`
- Enable PostGIS: `psql -U postgres -d darukaa -c "CREATE EXTENSION postgis;"`

## Dataset Choice
- **Mock Data**: Used for site metrics (e.g., `{"carbon": 100, "biodiversity": 80}`).

## Trade-offs
- **Leaflet over Mapbox**: Free, open-source, uses OSM tiles.
- **FastAPI over Django**: Lightweight, faster API development.
- **GitHub Pages**: Free, simple for frontend; backend requires separate hosting.