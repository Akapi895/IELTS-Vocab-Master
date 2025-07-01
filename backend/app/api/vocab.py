from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.vocab_sche import (
    UserVocabAddRequest,
    UserVocabDeleteRequest,
    PersonalVocabCreateRequest,
    UserVocabReviewRequest,
    PersonalVocabUpdateRequest,
)
from app.crud import vocab_crud
from app.models.vocabulary_entry import VocabularyEntry
from app.models.user import User 
from app.dependencies.auth import get_current_user  

router = APIRouter()

@router.post("/system/add")
def add_user_vocab(
    data: UserVocabAddRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_vocab = vocab_crud.add_user_vocab(db, current_user.id, data.vocab_id)
    if not user_vocab:
        raise HTTPException(status_code=400, detail="Vocab already in user's list")
    return user_vocab

@router.post("/personal/add")
def create_personal_vocab(
    data: PersonalVocabCreateRequest,
    db: Session = Depends(get_db)
):
    return vocab_crud.create_personal_vocab(db, data)

@router.delete("/personal/delete")
def delete_user_vocab(
    data: UserVocabDeleteRequest,
    db: Session = Depends(get_db)
):
    ok, msg = vocab_crud.delete_user_vocab(db, data.user_id, data.vocab_id)
    if not ok:
        raise HTTPException(status_code=404, detail=msg)
    return {"msg": msg}

@router.post("/review")
def review_user_vocab(
    data: UserVocabReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  
):
    user_vocab, msg = vocab_crud.review_user_vocab(db, current_user.id, data.vocab_id, data.remembered)
    if not user_vocab:
        raise HTTPException(status_code=404, detail=msg)
    return {"msg": msg, "user_vocab": user_vocab}

@router.get("/user_vocab/list")
def get_user_vocab_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vocab_crud.get_user_vocab_list(db, current_user.id)

@router.get("/user_vocab/due")
def get_due_vocab(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vocab_crud.get_due_vocab(db, current_user.id)

@router.put("/personal/update")
def update_personal_vocab(
    data: PersonalVocabUpdateRequest,
    db: Session = Depends(get_db)
):
    vocab = vocab_crud.update_personal_vocab(db, data)
    if not vocab:
        raise HTTPException(status_code=404, detail="Personal vocab not found")
    return vocab

@router.post("/user_vocab/statistics")
def user_vocab_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return vocab_crud.user_vocab_statistics(db, current_user.id)

@router.get("/system/list")
def get_system_vocab_list(
    offset: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    db: Session = Depends(get_db)
):
    vocabs = (
        db.query(VocabularyEntry)
        .filter_by(system=0)
        .order_by(VocabularyEntry.word.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return vocabs


@router.get("/word/search")
def get_vocab_search(
    word: str,
    db: Session = Depends(get_db)
):
    # Lấy các từ giống hệt
    exact = db.query(VocabularyEntry).filter(
        VocabularyEntry.word == word,
        VocabularyEntry.system == 0
    ).all()
    # Lấy các từ chứa từ khóa, loại bỏ các từ đã lấy ở trên
    similar = db.query(VocabularyEntry).filter(
        VocabularyEntry.word.ilike(f"%{word}%"),
        VocabularyEntry.system == 0,
        VocabularyEntry.word != word
    ).all()
    print("exact")
    return exact + similar

@router.get("/word/exact")
def get_vocab_exact(
    word: str,
    db: Session = Depends(get_db)
):
    exact = db.query(VocabularyEntry).filter(
        VocabularyEntry.word == word,
        VocabularyEntry.system == 0
    ).all()
    return exact