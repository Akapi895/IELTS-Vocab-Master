import httpx
import json
from dotenv import load_dotenv
import os

load_dotenv()
GEMINI_API_KEY1 = os.getenv("GEMINI_API_KEY1")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

async def fill_missing_fields_with_gemini(entries: list[dict]) -> list[dict]:
    prompt_lines = [json.dumps(item, ensure_ascii=False) for item in entries]

    prompt = (
        "You are an expert English teacher, teaching Vietnamese students.\n"
        "For the following words, fill in any missing fields (example, translation, example_translation, pronunciation, phonetic).\n"
        "Input JSON lines:\n"
        + "\n".join(prompt_lines) +
        "\n\nReturn as JSON object like this:\n"
        "{ \"results\": [ { \"word\": \"...\", \"part_of_speech\": \"...\", \"pronunciation\": \"...\", \"phonetic\": \"...\", \"definition\": \"...\", \"example\": \"...\", \"translation\": \"...\", \"example_translation\": \"...\" } ] }\n"
        "Lưu ý:\n"
        "- Chỉ trả về JSON object, không có text khác ngoài JSON.\n"
        "- example_translation là bản dịch tiếng Việt của example.\n"
        "- translation là bản dịch tiếng Việt của definition.\n"
        "- Không sửa những phần nội dung đã có.\n"
        "- Nếu thiếu example thì tự tạo một ví dụ phù hợp.\n"
    )

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            GEMINI_API_URL,
            params={"key": GEMINI_API_KEY1},
            headers={"Content-Type": "application/json"},
            json={"contents": [{"parts": [{"text": prompt}]}]},
        )
        response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]

        if "```json" in text:
            text = text.split("```json")[-1]
        if "```" in text:
            text = text.split("```")[0]

        try:
            data = json.loads(text)
            return data.get("results", [])
        except json.JSONDecodeError:
            return []