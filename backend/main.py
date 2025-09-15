from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database import SessionLocal, User, Project, Site
from geoalchemy2 import Geometry, WKTElement
from typing import List
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://a-abrar.github.io/geospatial"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "This_is_geospatial_project_for_Darukaa.earth"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    username: str
    password: str

class ProjectCreate(BaseModel):
    name: str

class SiteCreate(BaseModel):
    project_id: int
    geometry: str
    metrics: str

class SiteResponse(BaseModel):
    id: int
    project_id: int
    geometry: str
    metrics: str
    class Config:
        from_attributes = True

@app.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.username == user.username).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        hashed_password = pwd_context.hash(user.password)
        db_user = User(username=user.username, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"msg": "User registered successfully"}
    except Exception as e:
        db.rollback()
        print(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/login")
async def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": user.username}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer"}

@app.get("/projects", response_model=List[ProjectCreate])
async def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@app.post("/projects")
async def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(name=project.name)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/sites", response_model=List[SiteResponse])
async def get_sites(db: Session = Depends(get_db)):
    try:
        sites = db.query(Site).all()
        for site in sites:
            site.geometry = db.scalar(func.ST_AsText(site.geometry))
        return sites
    except Exception as e:
        print(f"Get sites error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch sites")

@app.post("/sites")
async def create_site(site: SiteCreate, db: Session = Depends(get_db)):
    try:
        db_project = db.query(Project).filter(Project.id == site.project_id).first()
        if not db_project:
            raise HTTPException(status_code=400, detail=f"Project ID {site.project_id} does not exist")
        if not site.geometry.startswith("POLYGON(("):
            raise HTTPException(status_code=400, detail="Invalid WKT format. Must be POLYGON.")
        geom = WKTElement(site.geometry, srid=4326)
        db_site = Site(
            project_id=site.project_id,
            geometry=geom,
            metrics=site.metrics
        )
        db.add(db_site)
        db.commit()
        db.refresh(db_site)
        db_site.geometry = db.scalar(func.ST_AsText(db_site.geometry))
        return db_site
    except Exception as e:
        db.rollback()
        print(f"Site creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save site: {str(e)}")