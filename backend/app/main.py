from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.api import auth, user, vocab 

# Import tất cả model trước khi tạo schema
from app.models.user import User
from app.models.vocabulary_entry import VocabularyEntry
from app.models.user_goal import UserGoal
from app.models.user_vocab import UserVocab

# Tự động tạo table nếu chưa có
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IELTS Study Backend",
    version="1.0.0",
    description="API backend phục vụ ứng dụng học IELTS"
)

# Cấu hình CORS để frontend có thể gọi API từ localhost hoặc production
origins = [
    "http://localhost:8000",  # frontend dev server
    "http://127.0.0.1:8000",
    "https://your-production-frontend.com",  # sau này bạn sửa nếu deploy
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gắn route vào app
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(vocab.router, prefix="/api/vocab", tags=["Vocabulary"])

# Tùy chọn root endpoint (debug)
@app.get("/")
def root():
    return {"message": "IELTS backend is running"}