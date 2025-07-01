// WordPreview.tsx
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

type WordPreviewProps = {
  word: string;
  pronunciation?: string;
  phonetic?: string;
  onPlayAudio?: (e: React.MouseEvent) => void;
};

export default function WordPreview({
  word,
  pronunciation,
  phonetic,
}: WordPreviewProps) {
  const playAudio = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    let checkPronun = 0;

    if (pronunciation) {
      const audio = new Audio(pronunciation);
      try {
        await audio.play();
      } catch (err) {
        console.warn("Audio play error:", err);
        checkPronun = 1;
      }
    }

    if (checkPronun === 1 && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(word);
      utter.lang = "en-US";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xl font-bold text-emerald-700">{word}</span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={e => playAudio(e)}
          title="Listen"
        >
          <Volume2 className="w-5 h-5 text-emerald-600" />
        </Button>
      </div>

      {phonetic && (
        <div className="text-gray-500 text-sm italic pl-0.5">/{phonetic}/</div>
      )}
    </CardContent>
  );
}