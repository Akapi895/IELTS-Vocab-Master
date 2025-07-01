from sqlalchemy import Column, Integer, Float, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from app.database import Base

class UserGoal(Base):
    __tablename__ = "user_goal"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    target_band = Column(Float, nullable=False)
    deadline = Column(Date)
    current_score = Column(JSON)
    achieved_at = Column(DateTime)
    is_active = Column(Boolean, default=True)