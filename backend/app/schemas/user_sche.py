from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional

class UserInfo(BaseModel):
    email: EmailStr
    name: str
    dob: date
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: str
    dob: date

class UserChangePassword(BaseModel):
    old_password: str
    new_password: str

class UserGoalUpdate(BaseModel):
    target_band: float
    deadline: Optional[date]
    current_score: Optional[dict]
    is_active: Optional[bool]

class UserGoalInfo(BaseModel):
    id: int
    user_id: int
    target_band: float
    deadline: Optional[date]
    current_score: Optional[dict]
    achieved_at: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True