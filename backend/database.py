from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from geoalchemy2 import Geometry
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://darukaa_db_user:vVBLHiECKs4lYU8tVjKNy72dSnS2EnAv@dpg-d33rq80dl3ps7394dbp0-a.singapore-postgres.render.com/darukaa_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

class Site(Base):
    __tablename__ = "sites"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    geometry = Column(Geometry("POLYGON", srid=4326), nullable=False)
    metrics = Column(String)

# Create tables on startup
Base.metadata.create_all(bind=engine)