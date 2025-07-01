import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import WordPreview from "@/components/WordPreview";

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

interface UserVocabItem {
  user_vocab: any;
  vocab: Vocab;
}

const VocabularyList: React.FC = () => {
  const [tab, setTab] = useState<"all" | "due">("all");
  const [allVocabs, setAllVocabs] = useState<UserVocabItem[]>([]);
  const [dueVocabs, setDueVocabs] = useState<UserVocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVocabs = (type: "all" | "due") => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const url =
      type === "all"
        ? "http://127.0.0.1:8000/api/vocab/user_vocab/list"
        : "http://127.0.0.1:8000/api/vocab/user_vocab/due";

    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        type === "all" ? setAllVocabs(data) : setDueVocabs(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVocabs("all");
  }, []);

  useEffect(() => {
    if (tab === "due" && dueVocabs.length === 0) fetchVocabs("due");
  }, [tab]);

  const vocabsToShow = tab === "all" ? allVocabs : dueVocabs;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Tabs value={tab} onValueChange={(val) => setTab(val as "all" | "due")}> 
          <TabsList>
            <TabsTrigger value="all">All Words</TabsTrigger>
            <TabsTrigger value="due">Due Review</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => navigate("/vocabularyreview")} className="bg-emerald-600 text-white">
          Review Now
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : vocabsToShow.length === 0 ? (
        <div className="text-center text-gray-400">No vocabulary found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vocabsToShow.map((item) => (
            <Card
              key={item.vocab.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={(e) => {
                const tag = (e.target as HTMLElement).tagName.toLowerCase();
                if (["button", "svg", "path"].includes(tag)) return;
                navigate(`/oneword/${item.vocab.word}`);
              }}
            >
              <WordPreview
                word={item.vocab.word.replace(/_/g, " ")}
                phonetic={item.vocab.phonetic}
                pronunciation={item.vocab.pronunciation}
              />
              <div className="text-xs text-gray-500 px-4 pb-4 italic">
                {item.vocab.part_of_speech}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VocabularyList;
