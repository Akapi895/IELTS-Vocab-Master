import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import ReviewMultipleChoice from "@/components/Review/ReviewMultipleChoice";
import ReviewTyping from "@/components/Review/ReviewTyping";
import ReviewMatching from "@/components/Review/ReviewMatching";
import ReviewListening from "@/components/Review/ReviewListening";

const BATCH_SIZE = 20;
const REVIEW_METHODS = [
  "multiple_choice",
  "typing",
  "matching",
  "listening"
] as const;
type ReviewMethod = "multiple_choice" | "typing" | "matching" | "listening";

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

interface ReviewResult {
  vocab: Vocab;
  remembered: boolean;
  method: ReviewMethod;
}

const VocabularyReview: React.FC = () => {
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [currentMethod, setCurrentMethod] = useState<ReviewMethod>("multiple_choice");
  const [hasDuplicateWords, setHasDuplicateWords] = useState(false);
  const [reviewResults, setReviewResults] = useState<{
    [vocabId: number]: { [method in ReviewMethod]?: boolean }
  }>({});
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/vocab/user_vocab/due", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVocabs(data.map((item: any) => item.vocab)))
      .finally(() => setLoading(false));
  }, []);

  // Chia batch
  const batches = Array.from({ length: Math.ceil(vocabs.length / BATCH_SIZE) }, (_, i) =>
    vocabs.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
  );
  const currentBatch = batches[currentBatchIndex] || [];

  // Kiểm tra từ trùng lặp trong batch
  useEffect(() => {
    setHasDuplicateWords(checkForDuplicateWords(currentBatch));
    console.log(hasDuplicateWords);
  }, [currentBatch]);

  // Random phương pháp review cho mỗi batch
  const [methodOrder, setMethodOrder] = useState<ReviewMethod[]>([]);
  useEffect(() => {
    // Khi sang batch mới, kiểm tra từ trùng lặp và chọn phương pháp phù hợp
    if (vocabs.length > 0) {
      const duplicateWords = checkForDuplicateWords(currentBatch);
      setHasDuplicateWords(duplicateWords);
      
      let availableMethods: ReviewMethod[];
      if (duplicateWords) {
        // Nếu có từ trùng lặp, chỉ dùng 3 phương pháp: multiple_choice, typing, listening
        availableMethods = ["multiple_choice", "typing", "listening"];
      } else {
        // Nếu không có từ trùng lặp, random 3/4 phương pháp
        availableMethods = [...REVIEW_METHODS].sort(() => Math.random() - 0.5).slice(0, 3);
      }
      
      setMethodOrder(availableMethods);
      setCurrentMethod(availableMethods[0]);
    }
  }, [currentBatchIndex, vocabs.length]);

  const [currentMethodIndex, setCurrentMethodIndex] = useState(0);

  const handleNext = async () => {
    if (currentMethodIndex < methodOrder.length - 1) {
      setCurrentMethodIndex((prev) => prev + 1);
      setCurrentMethod(methodOrder[currentMethodIndex + 1]);
    } else {
      // Tổng hợp kết quả cho batch hiện tại
      for (const vocab of currentBatch) {
        const result = reviewResults[vocab.id];
        // Nếu đúng ở cả 3 phương pháp
        const allCorrect = methodOrder.every(method => result && result[method]);
        await fetch("http://127.0.0.1:8000/api/vocab/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ vocab_id: vocab.id, remembered: !!allCorrect }),
        });
      }
      setCurrentMethodIndex(0);
      setCurrentBatchIndex((prev) => prev + 1);
    }
  };

  // Gọi API khi review xong 1 từ
  const handleReview = async (vocabId: number, remembered: boolean) => {
    setReviewResults(prev => ({
      ...prev,
      [vocabId]: {
        ...prev[vocabId],
        [currentMethod]: remembered
      }
    }));
  };

  // Hàm kiểm tra batch có từ trùng lặp không
  const checkForDuplicateWords = (batch: Vocab[]): boolean => {
    const wordSet = new Set();
    for (const vocab of batch) {
      if (wordSet.has(vocab.word.toLowerCase())) {
        return true; // Có từ trùng lặp
      }
      wordSet.add(vocab.word.toLowerCase());
    }
    return false; // Không có từ trùng lặp
  };

  if (loading) return <div className="text-center p-8">Loading vocabulary...</div>;
  if (vocabs.length === 0) return <div className="text-center p-8">No vocabulary to review.</div>;

  if (currentBatchIndex >= batches.length) {
    // Tổng hợp kết quả cho tất cả các từ đã review
    const results: ReviewResult[] = vocabs.map(vocab => {
      const result = reviewResults[vocab.id];
      // Lấy các phương pháp đã dùng cho từ này (có thể khác nhau giữa các batch)
      const methods = Object.keys(result || {}) as ReviewMethod[];
      // Đúng nếu đúng hết các phương pháp đã dùng
      const remembered = methods.length > 0 && methods.every(method => result && result[method]);
      // Lưu lại phương pháp cuối cùng đã dùng (hoặc bạn có thể lưu cả 3 nếu muốn)
      const lastMethod = methods[methods.length - 1] || "multiple_choice";
      return {
        vocab,
        remembered,
        method: lastMethod,
      };
    });

    return <Navigate to="/review-summary" state={{ results }} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700 text-center">Vocabulary Review</h1>
      <div className="text-center text-gray-600 mb-2">
        Batch {currentBatchIndex + 1} of {batches.length} - Method:{" "}
        <span className="font-semibold">{currentMethod.replace("_", " ")}</span>
      </div>

      {/* Render component review theo phương pháp */}
      {currentMethod === "multiple_choice" && (
        <ReviewMultipleChoice vocabs={currentBatch} onReview={handleReview} onComplete={handleNext} />
      )}
      {currentMethod === "typing" && (
        <ReviewTyping vocabs={currentBatch} onReview={handleReview} onComplete={handleNext} />
      )}
      {currentMethod === "matching" && (
        <ReviewMatching vocabs={currentBatch} onReview={handleReview} onComplete={handleNext} />
      )}
      {currentMethod === "listening" && (
        <ReviewListening vocabs={currentBatch} onReview={handleReview} onComplete={handleNext} />
      )}
    </div>
  );
};

export default VocabularyReview;