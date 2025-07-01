import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { playAudio } from "@/services/playAudio";

export default function ReviewMultipleChoice({ vocabs, onReview, onComplete }) {
  const [current, setCurrent] = useState(0);

  const handleAnswer = async (remembered: boolean) => {
    onReview(vocabs[current].id, remembered);
    await playAudio(vocabs[current].word.replace(/_/g, " "), vocabs[current].pronunciation);
    if (current < vocabs.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  // Tạo 4 đáp án random (1 đúng, 3 sai)
  const options = React.useMemo(() => {
    const correct = vocabs[current].translation;
    const others = vocabs
      .filter((v, i) => i !== current)
      .map(v => v.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }, [current, vocabs]);

  return (
    <div className="flex flex-col justify-end items-center min-h-[50vh] pb-16">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-2xl font-semibold text-center mb-6">
          What is the translation of{" "}
          <span className="text-emerald-700">
            {vocabs[current].word.replace(/_/g, " ")}
          </span>
          ?
        </div>
        <div className="grid grid-cols-1 gap-6">
          {options.map(opt => (
            <Button
              key={opt}
              onClick={() => handleAnswer(opt === vocabs[current].translation)}
              className="w-full py-6 text-xl rounded-lg break-words whitespace-pre-line"
            >
              {opt}
            </Button>
          ))}
        </div>
        <div className="text-center text-gray-500 mt-8 text-lg">
          {current + 1} / {vocabs.length}
        </div>
      </div>
    </div>
  );
}