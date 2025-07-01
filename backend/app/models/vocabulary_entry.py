from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class VocabularyEntry(Base):
    __tablename__ = "vocabulary_entry"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, nullable=False)
    part_of_speech = Column(String)
    pronunciation = Column(String)
    phonetic = Column(String)
    definition = Column(Text)
    example = Column(Text)
    translation = Column(Text)
    example_translation = Column(Text)
    system = Column(Integer, nullable=False, default=0)
