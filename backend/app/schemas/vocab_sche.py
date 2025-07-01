from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class UserVocabAddRequest(BaseModel):
    vocab_id: int

class UserVocabDeleteRequest(BaseModel):
    user_id: int
    vocab_id: int

class PersonalVocabCreateRequest(BaseModel):
    user_id: int
    word: str
    part_of_speech: str
    definition: str
    example: str
    pronunciation: str = ""
    phonetic: str = ""
    translation: str = ""
    example_translation: str = ""

class UserVocabReviewRequest(BaseModel):
    vocab_id: int
    remembered: bool  # True: nhớ, False: quên

class PersonalVocabUpdateRequest(BaseModel):
    vocab_id: int
    user_id: int
    word: str
    part_of_speech: str
    definition: str
    example: str
    pronunciation: str = ""
    phonetic: str = ""
    translation: str = ""
    example_translation: str = ""

class UserVocabListResponse(BaseModel):
    user_vocab: Dict[str, Any]
    vocab: Dict[str, Any]

class UserVocabStatisticsResponse(BaseModel):
    total: int
    learned: int
    high_ease: int
    streak: int
    progress_chart: Dict[str, int]