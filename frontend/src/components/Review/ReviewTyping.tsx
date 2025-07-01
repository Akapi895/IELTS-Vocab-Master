import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { playAudio } from "@/services/playAudio";

export default function ReviewTyping({ vocabs, onReview, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await playAudio(vocabs[current].word.replace(/_/g, " "), vocabs[current].pronunciation);
    setShowResult(true);
  };

  const handleNext = () => {
    onReview(vocabs[current].id, input.trim().toLowerCase() === vocabs[current].word.replace(/_/g, " ").trim().toLowerCase()); 
    setInput("");
    setShowResult(false);
    if (current < vocabs.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-xl font-semibold text-center mb-2">
          Type the English word for: <span className="text-emerald-700">{vocabs[current].translation}</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            className="border rounded px-4 py-3 w-80 text-center text-lg"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={showResult}
            autoFocus
          />
          {!showResult ? (
            <Button type="submit" disabled={!input.trim()} className="w-40 py-3 text-lg rounded-lg">Check</Button>
          ) : (
            <Button type="button" onClick={handleNext} className="w-40 py-3 text-lg rounded-lg">Next</Button>
          )}
        </form>
        {showResult && (
          <div className={`mt-2 text-center font-semibold ${input.trim().toLowerCase() === vocabs[current].word.replace(/_/g, " ").trim().toLowerCase() ? "text-emerald-600" : "text-red-600"}`}>
            {input.trim().toLowerCase() === vocabs[current].word.replace(/_/g, " ").trim().toLowerCase()
              ? "Correct!"
              : <>Incorrect. The correct answer is <b>{vocabs[current].word.replace(/_/g, " ")}</b></>
            }
          </div>
        )}
        <div className="text-center text-gray-500 mt-4 text-lg">
          {current + 1} / {vocabs.length}
        </div>
      </div>
    </div>
  );
}