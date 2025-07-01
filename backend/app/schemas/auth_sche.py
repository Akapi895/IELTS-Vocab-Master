from pydantic import BaseModel, EmailStr
from datetime import date as Date

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    name: str
    dob: Date

class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: EmailStr