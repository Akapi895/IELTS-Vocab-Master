from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, Float, Boolean, ForeignKey, DateTime
from datetime import datetime
from app.database import Base

class UserVocab(Base):
    __tablename__ = "user_vocab"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    vocab_id: Mapped[int] = mapped_column(ForeignKey("vocabulary_entry.id"), nullable=False)

    last_reviewed_at: Mapped[datetime] = mapped_column(DateTime)
    next_review_at: Mapped[datetime] = mapped_column(DateTime)
    interval: Mapped[int] = mapped_column(Integer, default=1)
    ease_factor: Mapped[float] = mapped_column(Float, default=2.5)
    repetition_count: Mapped[int] = mapped_column(Integer, default=0)
    is_learned: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)