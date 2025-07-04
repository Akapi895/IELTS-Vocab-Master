const API_URL = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("access_token") || "";
}

// Auth
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Sai email hoặc mật khẩu");
  return res.json();
}

export async function register(data: {
  email: string;
  username: string;
  password: string;
  name: string;
  dob: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Đăng ký thất bại");
  return res.json();
}

// Dashboard
export async function getUserInfo() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Không lấy được thông tin user");
  return res.json();
}

export async function getUserGoal() {
  const res = await fetch(`${API_URL}/users/goal`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getUserVocabList() {
  const res = await fetch(`${API_URL}/vocab/user_vocab/list`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Không lấy được danh sách từ vựng");
  return res.json();
}

export async function getUserDueVocab() {
  const res = await fetch(`${API_URL}/vocab/user_vocab/due`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Không lấy được danh sách từ cần ôn");
  return res.json();
}

export async function getUserVocabStatistics() {
  const accessToken = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/vocab/user_vocab/statistics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function updateUserGoal(goalData: any) {
  const res = await fetch(`${API_URL}/users/update-goal`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(goalData),
  });
  if (res.status === 404) {
    // Nếu chưa có goal, gọi tạo mới
    const createRes = await fetch(`${API_URL}/users/create-goal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(goalData),
    });
    if (!createRes.ok) throw new Error("Tạo goal thất bại");
    return createRes.json();
  }
  if (!res.ok) throw new Error("Cập nhật goal thất bại");
  return res.json();
}

// Dictionary
export async function fetchSystemVocabList(offset: number, limit: number = 30) {
  const res = await fetch(`${API_URL}/vocab/system/list?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error("Không lấy được danh sách từ vựng hệ thống");
  return res.json();
}

export async function searchVocab(word: string) {
  const res = await fetch(`${API_URL}/vocab/word/search?word=${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error("Không tìm thấy từ cần tra");
  return res.json();
}

// OneWord
export async function getExactWord(word: string) {
  const res = await fetch(`${API_URL}/vocab/word/exact?word=${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error("Không lấy được thông tin từ");
  return res.json();
}

export async function addVocabToUserList(vocabId: number) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/vocab/system/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ vocab_id: vocabId }),
  });
  if (!res.ok) throw new Error("Không thể thêm từ vào danh sách người dùng");
  return res.json();
}

// VocabularyList
export async function editUserVocab(payload: {
  user_vocab_id: number;
  word: string;
  part_of_speech: string;
  definition: string;
  example: string;
  pronunciation?: string;
  phonetic?: string;
  translation?: string;
  example_translation?: string;
}) {
  const res = await fetch(`${API_URL}/vocab/user_vocab/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Không thể cập nhật từ vựng");
  return res.json();
}

// VocabularyReview
interface Vocab {
  id: number;
  word: string;
  part_of_speech: string;
  pronunciation: string;
  phonetic: string;
  definition: string;
  example: string;
  translation: string;
  example_translation: string;
}

export async function getDueVocabsOnly(): Promise<{ vocab: Vocab }[]> {
  const res = await fetch(`${API_URL}/vocab/user_vocab/due`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Không thể lấy danh sách từ cần ôn");
  return res.json();
}

// Gửi kết quả review
export async function submitReviewResult(vocabId: number, remembered: boolean) {
  const res = await fetch(`${API_URL}/vocab/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ vocab_id: vocabId, remembered }),
  });
  if (!res.ok) throw new Error("Không thể gửi kết quả ôn tập");
  return res.json();
}
