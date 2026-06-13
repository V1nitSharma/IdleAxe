from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(String, unique=True, index=True)
    name = Column(String)
    status = Column(String, default="ACTIVE") # States: ACTIVE, FLAGGED, PENDING_APPROVAL, TERMINATED
    waste_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Telemetry(Base):
    __tablename__ = "telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(String, ForeignKey("resources.container_id"))
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class ActionLog(Base):
    __tablename__ = "action_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    container_id = Column(String, ForeignKey("resources.container_id"))
    agent_name = Column(String) # Audit Agent, Context Agent, Guard Agent
    action = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())