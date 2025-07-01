import json
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.models.vocabulary_entry import VocabularyEntry

# Kết nối đến PostgreSQL
DATABASE_URL = "postgresql://postgres:123123@host.docker.internal:5432/ielts"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

Base = declarative_base()

# Định nghĩa bảng

# Đọc file từ vựng
def insert_vocab_from_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        for line in file:
            if line.strip() == "":
                continue
            try:
                data = json.loads(line.strip())
                entry = VocabularyEntry(
                    word=data.get("word"),
                    definition=data.get("definition"),
                    part_of_speech=data.get("part_of_speech"),
                    pronunciation=data.get("pronunciation"),
                    phonetic=data.get("phonetic"),
                    example=data.get("example"),
                    translation=data.get("translation"),
                    example_translation=data.get("example_translation"),
                    system=0  # mặc định là của hệ thống
                )
                session.add(entry)
            except json.JSONDecodeError as e:
                print(f"Lỗi đọc dòng: {line}")
                print(f"Chi tiết lỗi: {e}")
        session.commit()
        print("Đã insert xong dữ liệu!")

if __name__ == "__main__":
    insert_vocab_from_file("app/enhanced_words.json")  # đổi tên file nếu khác
