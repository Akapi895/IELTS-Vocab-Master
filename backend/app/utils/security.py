from datetime import datetime, timedelta
from typing import Optional
import os

from dotenv import load_dotenv
from jose import jwt, JWTError
from app.schemas.auth_sche import TokenData

load_dotenv()
SECRET_KEY: str = os.getenv("SECRET_KEY")  # type: ignore[assignment]
if SECRET_KEY is None:
    raise RuntimeError("SECRET_KEY environment variable is not set")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise ValueError("Invalid token payload")
        return TokenData(email=email)
    except JWTError as e:
        raise ValueError("Invalid token") from e