import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WordPreview from "@/components/WordPreview";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { fetchSystemVocabList, searchVocab } from "@/services/api"; 

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

const Dictionary: React.FC = () => {
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch từ mặc định
  useEffect(() => {
    fetchMoreVocabs();
  }, []);

  // Infinite scroll: khi thẻ ref ở cuối cuộn tới, load tiếp
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchMoreVocabs();
        }
      },
      { threshold: 1 }
    );

    const current = bottomRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

    const fetchMoreVocabs = async () => {
    setLoading(true);
    try {
      const data = await fetchSystemVocabList(offset, 30);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setVocabs((prev) => [...prev, ...data]);
        setOffset((prev) => prev + 30);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const searchKey = pendingSearch.trim();
    if (!searchKey) return;

    try {
      const data = await searchVocab(searchKey);
      setVocabs(data);
      setHasMore(false);
      setSearch(pendingSearch);
      console.log(search);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Loại bỏ trùng từ (nếu có nhiều part_of_speech)
  const uniqueVocabs = Object.values(
    vocabs.reduce((acc, vocab) => {
      if (!acc[vocab.word]) acc[vocab.word] = vocab;
      return acc;
    }, {} as { [word: string]: Vocab })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-bold text-emerald-700">Dictionary</h2>

      {/* Search Box */}
      <div className="flex gap-2">
        <Input
          placeholder="Searching for a new word..."
          value={pendingSearch}
          onChange={(e) => setPendingSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="max-w-md"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* List */}
      {uniqueVocabs.length === 0 ? (
        <div className="text-center text-gray-500">No word found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {uniqueVocabs.map((vocab) => {
            const displayWord = vocab.word.replace(/_/g, " ");
            return (
              <Card
                key={vocab.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={(e) => {
                  const tag = (e.target as HTMLElement).tagName.toLowerCase();
                  if (["button", "svg", "path"].includes(tag)) return;
                  navigate(`/oneword/${vocab.word}`);
                }}
              >
                <WordPreview
                  word={displayWord}
                  phonetic={vocab.phonetic}
                  pronunciation={vocab.pronunciation}
                />
              </Card>
            );
          })}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center text-sm text-gray-400">Loading more...</div>
      )}

      {/* Bottom trigger để scroll xuống thì gọi tiếp */}
      <div ref={bottomRef} className="h-6" />
    </div>
  );
};

export default Dictionary;
