import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Vocab {
  id: number;
  word: string;
  translation: string;
  pronunciation?: string;
  phonetic?: string;
}

type ReviewMethod = "multiple_choice" | "typing" | "matching" | "listening";

interface ReviewResult {
  vocab: Vocab;
  remembered: boolean;
  method: ReviewMethod;
}

export default function ReviewSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const results = (location.state as { results: ReviewResult[] })?.results || [];

  useEffect(() => {
    if (!results.length) {
      // Nếu vào trang trực tiếp không có dữ liệu → quay về dashboard hoặc thông báo
      navigate("/dashboard");
    }
  }, [results, navigate]);

  const correct = results.filter((r) => r.remembered);
  const incorrect = results.filter((r) => !r.remembered);

  return (
    <div className="space-y-8 pt-10">
      <h2 className="text-3xl font-bold text-center text-emerald-700 mb-1">Review Summary</h2>

      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-base font-semibold shadow">
          Total: <span className="font-bold">{results.length}</span>
        </span>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-base font-semibold shadow">
          Correct: <span className="font-bold">{correct.length}</span>
        </span>
        <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-base font-semibold shadow">
          Incorrect: <span className="font-bold">{incorrect.length}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap- mt-2">
        {results.map((res, i) => (
          <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow p-6">
            <CardHeader className="flex justify-between items-start pb-2">
              <CardTitle className="text-xl text-emerald-700">{res.vocab.word.replace(/_/g, " ")}</CardTitle>
              <Badge
                variant={res.remembered ? "default" : "destructive"}
                className={
                  "text-base px-4 py-1" +
                  (res.remembered ? " bg-emerald-600 text-white" : "")
                }
              >
                {res.remembered ? "Correct" : "Incorrect"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-lg text-gray-700">
              {res.vocab.phonetic && (
                <div className="text-gray-500 italic text-base mb-1">/{res.vocab.phonetic}/</div>
              )}
              <div>
                <span className="font-medium text-gray-500">Translation:</span>{" "}
                {res.vocab.translation}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}