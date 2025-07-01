import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { playAudio } from "@/services/playAudio";

export default function ReviewMatching({ vocabs, onReview, onComplete }) {
  const [pairs, setPairs] = useState(() => {
    const words = vocabs.map((v, i) => ({ word: v.word, idx: i })).sort(() => Math.random() - 0.5);
    const translations = vocabs.map((v, i) => ({ translation: v.translation, idx: i })).sort(() => Math.random() - 0.5);
    return { words, translations };
  });

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [incorrectPairs, setIncorrectPairs] = useState<string[]>([]);
  const [correctPairs, setCorrectPairs] = useState<string[]>([]);
  const [hiddenWords, setHiddenWords] = useState<Set<string>>(new Set());

  const getVocabByWordAndIdx = (word: string, idx: number) =>
    vocabs.find((v, i) => v.word === word && i === idx);

  const handleSelect = async (
    type: "word" | "translation",
    value: string,
    idx?: number
  ) => {
    if (type === "word") {
      setSelectedWord(value);
      setSelectedWordIdx(idx ?? null);
      const vocab = getVocabByWordAndIdx(value, idx ?? 0);
      if (vocab) await playAudio(vocab.word.replace(/_/g, " "), vocab.pronunciation);
    } else if (selectedWord && selectedWordIdx !== null && idx !== undefined) {
      const vocab = getVocabByWordAndIdx(selectedWord, selectedWordIdx);
      if (!vocab) return;

      if (vocab.translation === value && selectedWordIdx === idx) {
        onReview(vocab.id, true);
        setCorrectPairs([`word_${selectedWordIdx}`, `trans_${idx}`]);
        setTimeout(() => {
          setHiddenWords(prev => {
            const newSet = new Set(prev);
            newSet.add(`word_${selectedWordIdx}`);
            newSet.add(`trans_${idx}`);
            return newSet;
          });
          setCorrectPairs([]);
        }, 400);
      } else {
        onReview(vocab.id, false);
        setIncorrectPairs([`word_${selectedWordIdx}`, `trans_${idx}`]);
        setTimeout(() => setIncorrectPairs([]), 600);
      }
      setSelectedWord(null);
      setSelectedWordIdx(null);
    }
  };

  const isComplete = hiddenWords.size >= vocabs.length * 2;

  const handleFinish = async () => {
    onComplete();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-3xl space-y-8">
        <h2 className="text-2xl font-bold text-center mb-4">Match each word with its translation</h2>
        <div className="flex justify-center gap-12">
          <div>
            {pairs.words.some(({ idx }) => !hiddenWords.has(`word_${idx}`)) && (
              <div className="font-bold mb-2 text-lg text-center">Words</div>
            )}
            {pairs.words.map(({ word, idx }) => {
              if (hiddenWords.has(`word_${idx}`)) return null;
              return (
                <div key={`word_${idx}`} className="mb-4 flex justify-center">
                  <button
                    type="button"
                    className={clsx(
                      "w-64 min-h-[56px] px-4 py-3 rounded-lg border text-lg font-semibold transition-all duration-200 break-words whitespace-pre-line shadow-sm",
                      selectedWordIdx === idx && "bg-emerald-100 border-emerald-400",
                      incorrectPairs.includes(`word_${idx}`) && "bg-red-200 border-red-500 animate-shake",
                      correctPairs.includes(`word_${idx}`) && "bg-emerald-200 border-emerald-500",
                      "hover:bg-emerald-50"
                    )}
                    onClick={() => handleSelect("word", word, idx)}
                  >
                    {word.replace(/_/g, " ")}
                  </button>
                </div>
              );
            })}
          </div>
          <div>
            {pairs.translations.some(({ idx }) => !hiddenWords.has(`trans_${idx}`)) && (
              <div className="font-bold mb-2 text-lg text-center">Translations</div>
            )}
            {pairs.translations.map(({ translation, idx }) => {
              if (hiddenWords.has(`trans_${idx}`)) return null;
              return (
                <div key={`trans_${idx}`} className="mb-4 flex justify-center">
                  <button
                    type="button"
                    className={clsx(
                      "w-80 min-h-[56px] px-4 py-3 rounded-lg border text-lg font-semibold transition-all duration-200 break-words whitespace-pre-line shadow-sm",
                      incorrectPairs.includes(`trans_${idx}`) && "bg-red-200 border-red-500 animate-shake",
                      correctPairs.includes(`trans_${idx}`) && "bg-emerald-200 border-emerald-500",
                      "hover:bg-emerald-50"
                    )}
                    onClick={() => handleSelect("translation", translation, idx)}
                  >
                    {translation}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-center mt-6">
          <Button onClick={handleFinish} disabled={!isComplete} className="px-8 py-3 text-lg rounded-lg">
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}