Darukaa.Earth
A full-stack geospatial analytics platform built for the Darukaa.Earth technical test (second round). This is a basic version without PostGIS due to deployment constraints.
Architecture

Frontend: React (TypeScript) with Leaflet.js for map visualization, Chart.js for data visualization, Material-UI for UI components, and react-router-dom for client-side routing. Hosted on GitHub Pages at https://a-abrar.github.io/geospatial.
Backend: FastAPI (Python 3.11) with JWT authentication, SQLAlchemy for ORM, and PostgreSQL for data storage. Hosted on Render at https://darukaa-backend.onrender.com.
Database: PostgreSQL with tables for users, projects, and sites. Geometry is stored as TEXT (WKT format) due to Render’s lack of PostGIS support.
CI/CD: GitHub Actions for linting (Ruff for backend, ESLint/Prettier for frontend) and frontend build.
Deployment: Frontend on GitHub Pages, backend on Render’s free tier.

Features Implemented

User registration and login with JWT authentication.
Dashboard to view projects and sites.
Map view with Leaflet.js for drawing and saving polygons (stored as WKT strings).
Site details page with metrics visualization using Chart.js.
Client-side routing with react-router-dom for /dashboard, /projects, /sites, /map, and /site/:id.
Automated table creation in PostgreSQL via SQLAlchemy.
CORS configuration for secure frontend-backend communication.

Features Not Implemented (Due to Time Constraints and Workload)

PostGIS Integration: Due to Render’s free tier not supporting PostGIS, geometry is stored as TEXT (WKT) instead of native geospatial types.
Advanced Geospatial Queries: Limited to basic storage and retrieval of WKT strings due to lack of PostGIS.
Comprehensive Testing: Minimal unit tests implemented due to time constraints.
Custom Components for Projects/Sites: Used Dashboard as a placeholder for /projects and /sites routes due to workload.
Advanced Metrics Visualization: Basic charts implemented with Chart.js; more complex analytics deferred.

Database Schema

Users: id (PK, int), username (string, unique), hashed_password (string).
Projects: id (PK, int), name (string).
Sites: id (PK, int), project_id (FK, int), geometry (TEXT, WKT string), metrics (string, JSON).

Setup Locally

Backend:

Navigate to backend directory:cd backend


Create .env file:echo "DATABASE_URL=postgresql://postgres:Abrar%401882001@localhost:5432/darukaa" >> .env
echo "SECRET_KEY=This_is_geospatial_project_for_Darukaa.earth" >> .env


Set up Python environment:python -m venv .venv
.venv\Scripts\activate  # On Windows
# or source .venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt


Run FastAPI server:uvicorn main:app --reload




Frontend:

Navigate to frontend directory:cd frontend


Install dependencies and start:npm install
npm start


Open http://localhost:3000/geospatial.


Database:

Install PostgreSQL 17.
Create database:psql -U postgres -c "CREATE DATABASE darukaa;"


Tables are created automatically by SQLAlchemy on first API call.



CI/CD Pipeline

GitHub Actions (ci.yml): Lints backend with Ruff, frontend with ESLint/Prettier, and builds frontend.
Steps:
Backend: Install Python 3.11, dependencies, and run Ruff linting.
Frontend: Install Node.js 18, dependencies, run ESLint, and build with react-scripts.



Dataset Choice

Used mock data for site metrics (e.g., {"carbon": 100, "biodiversity": 80}) stored as JSON strings in the sites table.
Geometry stored as WKT strings (e.g., POLYGON((0 0,1 1,1 0,0 0))) due to lack of PostGIS.

Trade-offs

Leaflet vs. Mapbox: Chose Leaflet for free, open-source map visualization.
FastAPI vs. Django: Selected FastAPI for lightweight, fast API development.
GitHub Pages + Render: Used free tiers for cost-effective hosting, but Render’s lack of PostGIS forced text-based geometry storage.
Text-based Geometry: Stored WKT strings instead of PostGIS types due to deployment constraints, limiting geospatial query capabilities.
Minimal Testing: Focused on core functionality over extensive testing due to time constraints and high workload.

Challenges Faced

Time Constraints: Limited to 7 days, with high workload impacting feature scope.
GitHub Pages Routing: Fixed 404 errors and redirect loops using a hash-based 404.html redirect.
Asset Loading: Resolved issues with %PUBLIC_URL% and hashed asset paths.
PostGIS Absence: Adapted to Render’s limitations by using TEXT for geometry.

Deployment

Frontend: Deployed to GitHub Pages with npm run deploy.
Backend: Deployed to Render with automated table creation.
URLs:
Frontend: https://a-abrar.github.io/geospatial
Backend: https://darukaa-backend.onrender.com


