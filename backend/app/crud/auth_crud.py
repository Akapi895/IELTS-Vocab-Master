from datetime import datetime
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth_sche import UserCreate
from app.utils.hashing import hash_password

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_data: UserCreate):
    hashed_password = hash_password(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        dob=user_data.dob,
        created_at=datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user