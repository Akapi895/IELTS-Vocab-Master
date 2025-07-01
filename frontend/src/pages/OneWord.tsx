import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Plus, Check } from "lucide-react";
import { getExactWord, addVocabToUserList } from "@/services/api";

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

const OneWord: React.FC = () => {
  const { word } = useParams<{ word: string }>();
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!word) return;
    setLoading(true);
    getExactWord(word)
      .then((data) => setVocabs(data))
      .catch((error) => {
        console.error(error);
        setVocabs([]);
      })
      .finally(() => setLoading(false));
  }, [word]);

  const handleAdd = (vocabId: number) => {
    addVocabToUserList(vocabId)
      .then(() => setAddedIds((prev) => [...prev, vocabId]))
      .catch((error) => console.error(error));
  };

  const playAudio = useCallback(async (word: string, pronunciation?: string) => {
    let checkPronun = 0;
    if (pronunciation) {
      const audio = new Audio(pronunciation);
      try {
        await audio.play();
      } catch (err) {
        console.warn("Audio play error:", err);
        checkPronun = 1;
      }
    } else {
      checkPronun = 1;
    }

    if (checkPronun === 1 && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(word);
      utter.lang = "en-US";
      window.speechSynthesis.speak(utter);
    }
  }, []);

  // Tự động phát âm khi vào trang và có từ
  useEffect(() => {
    if (vocabs.length > 0) {
      playAudio(vocabs[0].word.replace(/_/g, " "), vocabs[0].pronunciation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabs.length]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!vocabs.length) return <div className="text-center p-6 text-gray-600">No results found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">
            {vocabs[0].word.replace(/_/g, " ")}
          </h1>
          {vocabs[0].phonetic && (
            <div className="text-gray-500 text-lg italic">/{vocabs[0].phonetic}/</div>
          )}
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => playAudio(vocabs[0].word.replace(/_/g, " "), vocabs[0].pronunciation)}
          title="Play pronunciation"
        >
          <Volume2 className="w-5 h-5 text-emerald-600" />
        </Button>
      </div>

      {/* Meanings */}
      {vocabs.map((vocab) => (
        <Card key={vocab.id} className="border border-emerald-100 shadow-sm relative">
          <CardContent className="p-4 space-y-3">
            <Button
              size="icon"
              variant="default"
              className={`absolute top-2 right-2 rounded-full ${
                addedIds.includes(vocab.id) ? "bg-emerald-600" : "bg-blue-600"
              }`}
              disabled={addedIds.includes(vocab.id)}
              onClick={() => handleAdd(vocab.id)}
              title={addedIds.includes(vocab.id) ? "Added to your list" : "Add to list"}
            >
              {addedIds.includes(vocab.id) ? <Check size={18} /> : <Plus size={18} />}
            </Button>

            <div className="text-sm text-gray-500 italic">
              <span className="capitalize">{vocab.part_of_speech}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Definition:</span>{" "}
              <span>{vocab.definition}</span>
            </div>
            <div className="text-sm text-gray-600 italic">
              Translation: {vocab.translation}
            </div>
            <div className="pt-2">
              <div className="text-sm text-emerald-700 font-semibold">Example:</div>
              <div className="italic">"{vocab.example}"</div>
              <div className="text-sm text-gray-500">
                <b></b>{vocab.example_translation}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OneWord;
