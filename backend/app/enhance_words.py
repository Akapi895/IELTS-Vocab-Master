import json
import math
import requests
import time

# ==========================
# CẤU HÌNH
# ==========================
INPUT_FILE = "words.json"
OUTPUT_FILE = "enhanced_words1.json"
GEMINI_API_KEY = [
    #---
    "AIzaSyB7O0VJuDVzL_kVx9q58uhdd-E-ZgtatBY",
    "AIzaSyB0tIEbrjp5o7YZqwU9dEw8LPqRCELkDo0",
    "AIzaSyA4r61XKHbfIJney5lLf0PROAcSp2Dc8mo",
    "AIzaSyDfFTtGLGrdvmsxxGKwEj_XQAiuHkYKQkI",
    "AIzaSyDj7lurXKePTRV-F81JYi6IWb4WeBjqqaE",
    "AIzaSyDg_6DEzLItehpIJeKYZ3hIwzQ5ffIdWR4",
    "AIzaSyCjV1slDmxb-MzfYRPo4lDtWLo_g53t_to",
    "AIzaSyAj7jTjXHv-hF8a2tB1aoic_-E4Mh2IPqk",
    "AIzaSyCHuHc9Hzs48cYtzh1MDnB9cfn_PNXjZgM",
    "AIzaSyAX31Rny6rlIt6g8Va0RaXnweGZyNSoI8A",
    "AIzaSyC7jDgQg5WFRgXX5Bo6P_DxtB-iqDk_E54",
]

POS_MAPPING = {"n": "noun", "v": "verb", "a": "adjective", "r": "adverb"}

# ==========================
# HÀM GỌI GEMINI
# ==========================
def call_gemini(prompt: str, api_key: str) -> dict:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    resp = None
    try:
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        resp.raise_for_status()
        response_json = resp.json()
        # Lấy text trả về từ Gemini
        text = response_json["candidates"][0]["content"]["parts"][0]["text"]
        # Parse JSON từ text trả về
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        json_str = text[json_start:json_end]
        return json.loads(json_str)
    except Exception as e:
        print("\n❌ Lỗi khi gọi Gemini:", e)
        print("Nội dung Gemini:", resp.text if resp is not None else "(no response!)")
        time.sleep(10)
        return {"results": []}

# ==========================
# MAIN
# ==========================
def main(batch_size=10):
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        words_data = json.load(f)
    total_words = len(words_data)

    # Đếm số dòng đã có trong OUTPUT_FILE
    processed = 0
    try:
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f_out:
            processed = sum(1 for _ in f_out)
    except FileNotFoundError:
        processed = 0

    print(f"Đã có {processed} từ đã xử lý, tiếp tục từ vị trí {processed}")

    # Bắt đầu từ batch tiếp theo
    start_batch = processed // batch_size

    idx = 0
    cnt = processed  # Đếm tổng số từ đã xử lý

    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        for batch_start in range(start_batch * batch_size, total_words, batch_size):
            batch = words_data[batch_start:batch_start + batch_size]
            prompt_lines = []
            for item in batch:
                word = item.get("word", "")
                pos = POS_MAPPING.get(item.get("PartOfSpeech", ""), item.get("PartOfSpeech", ""))
                example = item.get("Example", "")
                definition = item.get("definition", "")
                prompt_lines.append(
                    json.dumps({
                        "word": word,
                        "part_of_speech": pos,
                        "definition": definition,
                        "example": example
                    }, ensure_ascii=False)
                )
            prompt = (
                "You are an expert English teacher, teaching Vietnamese students. "
                "For the following words, fill in any missing fields:\n"
                "Input JSON lines:\n" +
                "\n".join(prompt_lines) +
                '\n\nReturn as JSON object like this:\n'
                '{ "results": [ { "word": "...", "part_of_speech": "...", "pronunciation": "...", "phonetic": "...", "example": "...", "translation": "...", "example_translation": "..." } ] }'
                '\nLưu ý: '
                '- Chỉ trả về JSON object, không có text khác ngoài JSON.\n'
                '- example_translation là bản dịch tiếng Việt của example.\n'
                '- translation là bản dịch tiếng Việt của word.\n'
                '- Sửa lại definition nếu cần thiết, dựa trên definition cũ, ngữ cảnh, và example.\n'
                '- Definition là tiếng Anh, translation là bản dichj tiếng Việt của definition.'
            )
            response = call_gemini(prompt, GEMINI_API_KEY[idx])
            if "results" not in response:
                response = call_gemini(prompt, GEMINI_API_KEY[idx])

            results = response.get("results", [])
            
            cnt += 1
            if cnt == 30 * (idx + 1):
                print(f"\nĐã xử lý {cnt} từ, tạm dừng 10 giây...")
                time.sleep(10)
                idx += 1

            for entry in results:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
            batch_no = batch_start // batch_size + 1
            total_batches = math.ceil(total_words / batch_size)
            print(f"✅ Xong batch {batch_no}/{total_batches} ({len(results)} từ)")

            if (idx == len(GEMINI_API_KEY)):
                break

    print(f"\nHoàn thành! Kết quả được ghi vào: {OUTPUT_FILE}")

if __name__ == "__main__":
    for _ in range(100):
        main()
        time.sleep(60)
