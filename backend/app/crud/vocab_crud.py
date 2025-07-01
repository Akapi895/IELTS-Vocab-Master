from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.user_vocab import UserVocab
from app.models.vocabulary_entry import VocabularyEntry
from app.utils.ef import sm2, next_review_date

def add_user_vocab(db: Session, user_id: int, vocab_id: int):
    exists = db.query(UserVocab).filter_by(user_id=user_id, vocab_id=vocab_id).first()
    if exists:
        return None
    now = datetime.utcnow()
    interval = 1
    next_review = next_review_date(interval)
    user_vocab = UserVocab(
        user_id=user_id,
        vocab_id=vocab_id,
        last_reviewed_at=now,
        next_review_at=next_review,
        interval=interval,
        ease_factor=2.5,
        repetition_count=0,
        is_learned=False,
        created_at=now,
        updated_at=now
    )
    db.add(user_vocab)
    db.commit()
    db.refresh(user_vocab)
    return user_vocab

def create_personal_vocab(db: Session, data):
    vocab = VocabularyEntry(
        word=data.word,
        part_of_speech=data.part_of_speech,
        pronunciation=data.pronunciation,
        phonetic=data.phonetic,
        definition=data.definition,
        example=data.example,
        translation=data.translation,
        example_translation=data.example_translation,
        system=data.user_id
    )
    db.add(vocab)
    db.commit()
    db.refresh(vocab)
    
    user_vocab = add_user_vocab(db, data.user_id, vocab.id) # type: ignore
    return {"vocab": vocab, "user_vocab": user_vocab}

def delete_user_vocab(db: Session, user_id: int, vocab_id: int):
    user_vocab = db.query(UserVocab).filter_by(user_id=user_id, vocab_id=vocab_id).first()
    if not user_vocab:
        return None, "Not found in user_vocab"
    db.delete(user_vocab)
    db.commit()
    vocab = db.query(VocabularyEntry).filter_by(id=vocab_id).first()
    if vocab is not None and getattr(vocab, "system", 0) != 0:
        db.delete(vocab)
        db.commit()
        return True, "Deleted from user_vocab and vocabulary_entry"
    return True, "Deleted from user_vocab"

def search_vocab(db: Session, word: str):
    return db.query(VocabularyEntry).filter(
        VocabularyEntry.word.ilike(f"%{word}%"),
        VocabularyEntry.system == 0
    ).all()

def review_user_vocab(db: Session, user_id: int, vocab_id: int, remembered: bool):
    user_vocab = db.query(UserVocab).filter_by(user_id=user_id, vocab_id=vocab_id).first()
    if not user_vocab:
        return None, "Not found in user_vocab"
    # Sử dụng thuật toán SM-2
    quality = 5 if remembered else 2  # 5: nhớ tốt, 2: quên
    rep, interval, ef = sm2(
        user_vocab.repetition_count,
        user_vocab.interval,
        user_vocab.ease_factor,
        quality
    )
    user_vocab.repetition_count = rep if remembered else 0
    user_vocab.interval = interval
    user_vocab.ease_factor = ef
    user_vocab.last_reviewed_at = datetime.utcnow()
    user_vocab.next_review_at = next_review_date(interval)
    user_vocab.is_learned = remembered and rep >= 5  # Ví dụ: >=5 lần liên tiếp thì coi là đã thuộc
    db.commit()
    db.refresh(user_vocab)
    return user_vocab, "Updated"

def get_user_vocab_list(db: Session, user_id: int):
    user_vocabs = db.query(UserVocab).filter_by(user_id=user_id).all()

    vocab_ids = [uv.vocab_id for uv in user_vocabs]

    vocabs = db.query(VocabularyEntry).filter(
        VocabularyEntry.id.in_(vocab_ids)
    ).all()

    vocab_dict = {v.id: v for v in vocabs}

    result = []
    for uv in user_vocabs:
        vocab = vocab_dict.get(uv.vocab_id) # type: ignore
        if vocab is not None:  
            result.append({
                "user_vocab": uv,
                "vocab": vocab
            })

    return result

def get_due_vocab(db: Session, user_id: int):
    now = datetime.utcnow()

    user_vocabs = db.query(UserVocab).filter(
        UserVocab.user_id == user_id,
        UserVocab.next_review_at <= now 
    ).all()

    vocab_ids = [uv.vocab_id for uv in user_vocabs]

    vocabs = db.query(VocabularyEntry).filter(
        VocabularyEntry.id.in_(vocab_ids)
    ).all()

    vocab_dict = {v.id: v for v in vocabs}

    # Ghép user_vocab với vocab
    result = []
    for uv in user_vocabs:
        vocab = vocab_dict.get(uv.vocab_id) # type: ignore
        if vocab is not None: 
            result.append({
                "user_vocab": uv,
                "vocab": vocab
            })

    return result


def update_personal_vocab(db: Session, data):
    vocab = db.query(VocabularyEntry).filter_by(id=data.vocab_id, system=data.user_id).first()
    if not vocab:
        return None
    vocab.word = data.word
    vocab.part_of_speech = data.part_of_speech
    vocab.definition = data.definition
    vocab.example = data.example
    vocab.pronunciation = data.pronunciation
    vocab.phonetic = data.phonetic
    vocab.translation = data.translation
    vocab.example_translation = data.example_translation
    db.commit()
    db.refresh(vocab)
    return vocab

def user_vocab_statistics(db: Session, user_id: int):
    user_vocabs = db.query(UserVocab).filter_by(user_id=user_id).all()
    total = len(user_vocabs)
    learned = sum(1 for uv in user_vocabs if uv.is_learned)
    high_ease = sum(1 for uv in user_vocabs if uv.ease_factor >= 2.5)
    review_dates = sorted({uv.last_reviewed_at.date() for uv in user_vocabs if uv.last_reviewed_at})
    streak = 0
    today = datetime.utcnow().date()
    for i in range(len(review_dates)-1, -1, -1):
        if review_dates[i] == today - timedelta(days=streak):
            streak += 1
        else:
            break
    progress_chart = {}
    for uv in user_vocabs:
        if uv.last_reviewed_at:
            d = uv.last_reviewed_at.date().isoformat()
            progress_chart[d] = progress_chart.get(d, 0) + 1
    return {
        "total": total,
        "learned": learned,
        "high_ease": high_ease,
        "streak": streak,
        "progress_chart": progress_chart
    }

